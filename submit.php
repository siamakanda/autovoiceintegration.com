<?php
declare(strict_types=1);

/**
 * AutoVoiceIntegration demo request form handler.
 *
 * Sends form submissions to the configured recipient. By default it uses
 * PHP's built-in mail() function, but for reliable delivery on shared cPanel
 * hosting you should configure SMTP via smtp-config.php (see smtp-config.sample.php).
 */

define('RECIPIENT_EMAIL', 'admin@autovoiceintegration.com');
define('FROM_EMAIL', 'admin@autovoiceintegration.com');
define('SUBJECT_PREFIX', 'New Demo Request — AutoVoiceIntegration');
define('MIN_SUBMIT_SECONDS', 3);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer-when-downgrade');

function json_response(bool $ok, string $message, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

/**
 * Minimal SMTP client (STARTTLS or implicit TLS with AUTH LOGIN).
 * No external dependencies, so it works on any PHP host with OpenSSL.
 */
final class SmtpMailer
{
    /** @var resource|null */
    private $socket;
    private string $host;
    private int $port;
    private string $user;
    private string $pass;
    private string $encryption;

    public function __construct(string $host, int $port, string $user, string $pass, string $encryption)
    {
        $this->host = $host;
        $this->port = $port;
        $this->user = $user;
        $this->pass = $pass;
        $this->encryption = strtolower($encryption);
    }

    /** @return array{0: bool, 1: string} */
    public function connect(bool $verifyPeer = true): array
    {
        $remote = $this->encryption === 'ssl'
            ? 'ssl://' . $this->host . ':' . $this->port
            : 'tcp://' . $this->host . ':' . $this->port;

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => $verifyPeer,
                'verify_peer_name' => $verifyPeer,
                'allow_self_signed' => !$verifyPeer,
                'SNI_enabled' => true,
            ],
        ]);

        $socket = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
        if ($socket === false) {
            return [false, 'Could not connect to SMTP server: ' . $errstr . ' (' . $errno . ')'];
        }

        $this->socket = $socket;
        stream_set_timeout($this->socket, 15);

        $code = $this->readResponse();
        if ($code !== 220) {
            return [false, 'SMTP greeting failed with code ' . $code];
        }

        $code = $this->command('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
        if ($code !== 250) {
            $code = $this->command('HELO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
            if ($code !== 250) {
                return [false, 'SMTP EHLO/HELO failed with code ' . $code];
            }
        }

        if ($this->encryption === 'tls') {
            $enabled = @stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if ($enabled !== true) {
                return [false, 'STARTTLS negotiation failed'];
            }
            $code = $this->command('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
            if ($code !== 250) {
                return [false, 'SMTP EHLO after STARTTLS failed with code ' . $code];
            }
        }

        if ($this->user !== '') {
            $code = $this->command('AUTH LOGIN');
            if ($code !== 334) {
                return [false, 'SMTP server does not accept AUTH LOGIN (code ' . $code . ')'];
            }
            $code = $this->command(base64_encode($this->user));
            if ($code !== 334) {
                return [false, 'SMTP username rejected (code ' . $code . ')'];
            }
            $code = $this->command(base64_encode($this->pass));
            if ($code !== 235) {
                return [false, 'SMTP authentication failed (code ' . $code . ')'];
            }
        }

        return [true, ''];
    }

    private function readResponse(): int
    {
        if (!is_resource($this->socket)) {
            return 0;
        }

        $code = 0;
        while (($line = fgets($this->socket, 515)) !== false) {
            if (strlen($line) < 3) {
                continue;
            }
            $code = (int) substr($line, 0, 3);
            // A space after the code marks the final line of the response.
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        return $code;
    }

    private function command(string $cmd): int
    {
        if (!is_resource($this->socket)) {
            return 0;
        }
        fwrite($this->socket, $cmd . "\r\n");
        return $this->readResponse();
    }

    /** @return array{0: bool, 1: string} */
    public function send(string $from, string $to, string $subject, string $body, string $headers): array
    {
        if (!is_resource($this->socket)) {
            return [false, 'No active SMTP connection'];
        }

        $code = $this->command('MAIL FROM:<' . $from . '>');
        if ($code !== 250) {
            return [false, 'SMTP MAIL FROM failed with code ' . $code];
        }

        $code = $this->command('RCPT TO:<' . $to . '>');
        if ($code !== 250 && $code !== 251) {
            return [false, 'SMTP RCPT TO failed with code ' . $code];
        }

        $code = $this->command('DATA');
        if ($code !== 354) {
            return [false, 'SMTP DATA failed with code ' . $code];
        }

        $payload = $headers . "\r\nSubject: " . $subject . "\r\n\r\n" . $body;
        $payload = str_replace(["\r\n", "\r", "\n"], "\r\n", $payload);
        // Dot-stuff any line that begins with a single dot.
        $payload = preg_replace('/^\./m', '..', $payload);
        $payload = rtrim($payload, "\r\n") . "\r\n.\r\n";

        fwrite($this->socket, $payload);
        $code = $this->readResponse();
        if ($code !== 250) {
            return [false, 'SMTP message rejected with code ' . $code];
        }

        return [true, ''];
    }

    public function close(): void
    {
        if (is_resource($this->socket)) {
            $this->command('QUIT');
            fclose($this->socket);
        }
        $this->socket = null;
    }
}

/**
 * Send an email via SMTP when configured, otherwise fall back to PHP mail().
 * Returns true when the message was accepted by the transport.
 */
function send_email(string $to, string $subject, string $body, string $from, string $fromName, string $replyTo): bool
{
    $configFile = __DIR__ . '/smtp-config.php';
    $smtp = is_file($configFile) ? require $configFile : [];

    $smtpEnabled = !empty($smtp['enabled'])
        && !empty($smtp['host'])
        && !empty($smtp['port'])
        && !empty($smtp['username'])
        && !empty($smtp['password']);

    $messageId = '<' . bin2hex(random_bytes(12)) . '@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>';

    $headers = 'Date: ' . date('r') . "\r\n"
        . 'Message-ID: ' . $messageId . "\r\n"
        . 'From: ' . $fromName . ' <' . $from . ">\r\n"
        . 'Reply-To: ' . $replyTo . "\r\n"
        . 'Content-Type: text/plain; charset=UTF-8';

    if ($smtpEnabled) {
        $encryption = isset($smtp['encryption']) ? (string) $smtp['encryption'] : 'tls';
        $fromAddr = $smtp['from'] ?? $from;

        $mailer = new SmtpMailer(
            (string) $smtp['host'],
            (int) $smtp['port'],
            (string) $smtp['username'],
            (string) $smtp['password'],
            $encryption
        );

        $verifyPeer = isset($smtp['verify_peer']) ? (bool) $smtp['verify_peer'] : true;
        $connected = $mailer->connect($verifyPeer);
        if (!$connected[0]) {
            $mailer->close();
            // Log and fall back to mail() so submissions are never silently dropped.
            error_log('AutoVoiceIntegration SMTP error: ' . $connected[1]);
            return mail($to, $subject, $body, $headers);
        }

        $sent = $mailer->send($fromAddr, $to, $subject, $body, $headers);
        $mailer->close();

        if (!$sent[0]) {
            error_log('AutoVoiceIntegration SMTP send error: ' . $sent[1]);
            return mail($to, $subject, $body, $headers);
        }

        return true;
    }

    return mail($to, $subject, $body, $headers);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Invalid request method.', 405);
}

// Honeypot: real users never see or fill this field.
$website = isset($_POST['website']) ? trim((string) $_POST['website']) : '';
if ($website !== '') {
    json_response(true, 'Thank you. Your request has been sent.');
}

// Minimum submit-time check reduces automated spam.
$formTime = isset($_POST['form_time']) ? (int) $_POST['form_time'] : 0;
if ($formTime > 0 && (time() - (int) floor($formTime / 1000)) < MIN_SUBMIT_SECONDS) {
    json_response(false, 'Your request was submitted too quickly. Please try again.', 400);
}

$name = isset($_POST['name']) ? trim((string) $_POST['name']) : '';
$business = isset($_POST['business']) ? trim((string) $_POST['business']) : '';
$email = isset($_POST['email']) ? trim((string) $_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim((string) $_POST['phone']) : '';
$countryCode = isset($_POST['country_code']) ? trim((string) $_POST['country_code']) : '';
$adSpend = isset($_POST['ad_spend']) ? trim((string) $_POST['ad_spend']) : '';
$message = isset($_POST['message']) ? trim((string) $_POST['message']) : '';

if ($name === '' || $email === '' || $phone === '' || $countryCode === '') {
    json_response(false, 'Please complete all required fields.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, 'Please enter a valid email address.', 400);
}

if (!preg_match('/^\+[0-9]{1,4}$/', $countryCode)) {
    json_response(false, 'Please select a valid country code.', 400);
}

if (!preg_match('/^[0-9\s\-().]{6,20}$/', $phone)) {
    json_response(false, 'Please enter a valid phone number.', 400);
}

$allowedAdSpend = [
    'Under $5,000 / month',
    '$5,000 – $15,000 / month',
    '$15,000 – $50,000 / month',
    '$50,000+ / month',
];

if ($adSpend !== '' && !in_array($adSpend, $allowedAdSpend, true)) {
    $adSpend = '';
}

$cleanName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$cleanBusiness = htmlspecialchars($business, ENT_QUOTES, 'UTF-8');
$cleanEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$cleanPhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$cleanCountryCode = htmlspecialchars($countryCode, ENT_QUOTES, 'UTF-8');
$cleanAdSpend = htmlspecialchars($adSpend, ENT_QUOTES, 'UTF-8');
$cleanMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$cleanBusiness = $cleanBusiness !== '' ? $cleanBusiness : 'Not provided';
$cleanAdSpend = $cleanAdSpend !== '' ? $cleanAdSpend : 'Not provided';
$cleanMessage = $cleanMessage !== '' ? $cleanMessage : 'No additional details provided.';
$fullPhone = trim($cleanCountryCode . ' ' . $cleanPhone);

$subject = SUBJECT_PREFIX;
$body = "New demo request received from AutoVoiceIntegration\n\n"
    . "Name: {$cleanName}\n"
    . "Business: {$cleanBusiness}\n"
    . "Email: {$cleanEmail}\n"
    . "Phone: {$fullPhone}\n"
    . "Monthly Ad Spend: {$cleanAdSpend}\n"
    . "Message:\n{$cleanMessage}\n";

$fromName = 'AutoVoiceIntegration Website';
$mailSent = send_email(RECIPIENT_EMAIL, $subject, $body, FROM_EMAIL, $fromName, $cleanEmail);

if ($mailSent) {
    json_response(true, 'Thank you. Your demo request has been sent.');
}

json_response(false, 'There was a problem sending your request. Please try again or email us directly.', 500);
