<?php
/**
 * SMTP configuration template for AutoVoiceIntegration.
 *
 * To enable authenticated SMTP delivery (recommended for reliable email),
 * copy this file to smtp-config.php in the same directory and fill in the
 * values below. smtp-config.php is gitignored and will NOT be deployed by
 * GitHub Actions, so upload it to the server manually after configuring.
 *
 * If smtp-config.php is absent, the form falls back to PHP's built-in
 * mail() function.
 */

return [
    'enabled' => false,
    // cPanel "Outgoing Server", e.g. autovoiceintegration.com.
    'host' => 'autovoiceintegration.com',
    // 465 = implicit SSL (recommended by cPanel), 587 = STARTTLS.
    'port' => 465,
    // 'ssl' for port 465 (implicit TLS), 'tls' for port 587 (STARTTLS).
    'encryption' => 'ssl',
    // A full mailbox address on your domain, e.g. admin@autovoiceintegration.com.
    'username' => 'admin@autovoiceintegration.com',
    'password' => 'REPLACE_WITH_MAILBOX_PASSWORD',
    // Optional: the envelope sender. Defaults to FROM_EMAIL in submit.php.
    'from' => 'admin@autovoiceintegration.com',
    // Optional: set false ONLY if the mail server uses a self-signed certificate.
    // Keep true in production for a properly issued certificate.
    'verify_peer' => true,
];
