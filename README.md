# AutoVoiceIntegration.com

Professional single-page landing site for AutoVoiceIntegration, an AI voice agent with telephony integration and speed-to-dial automation.

## What This Is
A fast, secure static website built with plain HTML, CSS, and JavaScript. It requires no database, no WordPress, and no build step. The demo request form is handled by a small PHP script designed to run on shared cPanel hosting.

## File Structure
```
.
├── index.html
├── submit.php
├── CONTEXT.md
├── README.md
├── .htaccess
├── robots.txt
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── main.js
    └── icons/
        └── favicon.svg
```

## Local Testing
Open `index.html` directly in a desktop browser to test layout, navigation, animations, and responsive behavior.

The PHP form handler requires a PHP environment. On Windows you can test it with a local PHP server if PHP is installed:

```bash
php -S localhost:8000
```

Then visit `http://localhost:8000`.

## Deploying to cPanel
1. Log in to cPanel and open **File Manager**.
2. Navigate to the `public_html` directory, or a subdirectory if this site should live in one.
3. Upload all files and folders while preserving the structure above.
4. Make sure `submit.php` is in the same directory as `index.html`.
5. Edit `submit.php` and set the correct recipient email address.
6. Verify the domain is serving HTTPS.
7. Submit the demo form and confirm the email arrives.

## Configuring the Demo Form
Open `submit.php` and update the configuration values at the top of the file:

```php
define('RECIPIENT_EMAIL', 'hello@autovoiceintegration.com');
define('FROM_EMAIL', 'noreply@autovoiceintegration.com');
define('SUBJECT_PREFIX', 'New Demo Request — AutoVoiceIntegration');
```

Also update the placeholder email address in `index.html` footer if needed.

## Customizing Content
Most content lives in `index.html`. Pricing, testimonials, and other placeholders are documented in `CONTEXT.md`. Review that file before publishing.

## Security Notes
- The form includes a honeypot field and minimum submit-time check to reduce automated spam.
- Input is sanitized and validated before emailing.
- Do not commit real email credentials or sensitive keys to this repository.
- The `.htaccess` file adds basic security headers and enforces HTTPS where supported.

## SEO
- Meta description, Open Graph tags, and JSON-LD structured data are included in `index.html`.
- `robots.txt` allows search engine indexing.
- Update the canonical URL if the site is deployed to a subdirectory or alternate domain.
