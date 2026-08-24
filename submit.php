<?php
declare(strict_types=1);

/**
 * AutoVoiceIntegration demo request form handler.
 *
 * This script runs on shared cPanel hosting and sends form submissions
 * to the configured recipient using PHP's built-in mail() function.
 */

define('RECIPIENT_EMAIL', 'admin@autovoiceintegration.com');
define('FROM_EMAIL', 'noreply@autovoiceintegration.com');
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
$headers = [
    'From: ' . $fromName . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . $cleanName . ' <' . $cleanEmail . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$mailSent = mail(RECIPIENT_EMAIL, $subject, $body, implode("\r\n", $headers));

if ($mailSent) {
    json_response(true, 'Thank you. Your demo request has been sent.');
}

json_response(false, 'There was a problem sending your request. Please try again or email us directly.', 500);