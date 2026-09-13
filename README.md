# AutoVoiceIntegration.com

Professional single-page landing site for AutoVoiceIntegration, an AI voice agent with telephony integration and speed-to-dial automation.

## What This Is
A fast, secure static website built with plain HTML, CSS, and JavaScript. It requires no database, no WordPress, and no build step. The demo request form is handled by a small PHP script designed to run on shared cPanel hosting.

## File Structure
```
.
├── index.html
├── privacy.html
├── terms.html
├── submit.php
├── sitemap.xml
├── CONTEXT.md
├── README.md
├── .htaccess
├── robots.txt
├── smtp-config.sample.php
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── main.js
    └── icons/
        ├── favicon.svg
        └── og-image.png
```

## Local Testing
Open `index.html` directly in a desktop browser to test layout, navigation, animations, and responsive behavior.

The PHP form handler requires a PHP environment. On Windows you can test it with a local PHP server if PHP is installed:

```bash
php -S localhost:8000
```

Then visit `http://localhost:8000`.

## Deploying with cPanel Git Version Control
The site deploys through cPanel's Git Version Control using the `.cpanel.yml` file, which copies the repository contents into `public_html`.

1. In cPanel, open **Git™ Version Control** and create a repository that clones this repo.
2. On **Manage Repository**, click **Update from Remote** to pull the latest commit on `main`.
3. Click **Deploy HEAD Commit**. The `.cpanel.yml` tasks copy all files into `/home/<user>/public_html/`.
4. Verify the domain is serving HTTPS.
5. Submit the demo form and confirm the email arrives.

The checked-out branch must be clean (no uncommitted changes) before cPanel will deploy. Push all changes to `main` first.

## Configuring the Demo Form
Open `submit.php` and update the configuration values at the top of the file:

```php
define('RECIPIENT_EMAIL', 'admin@autovoiceintegration.com');
define('FROM_EMAIL', 'admin@autovoiceintegration.com');
define('SUBJECT_PREFIX', 'New Demo Request — AutoVoiceIntegration');
```

Also update the placeholder email address in `index.html` footer if needed.

### Enabling SMTP (recommended)
PHP's built-in `mail()` function is unreliable on shared cPanel hosting and can silently drop messages. For dependable delivery, configure authenticated SMTP:

1. Copy `smtp-config.sample.php` to `smtp-config.php`.
2. Fill in your mailbox host, port, username, and password.
3. Set `'enabled' => true`.
4. Upload `smtp-config.php` to the server via cPanel File Manager or FTP. It is gitignored, so neither Git nor cPanel Git deployment will publish it — upload it manually.

`smtp-config.php` holds real credentials and must never be committed. The form uses SMTP when configured and falls back to `mail()` otherwise.

## Customizing Content
Most content lives in `index.html`. Pricing, testimonials, and other placeholders are documented in `CONTEXT.md`. Review that file before publishing.

## Security Notes
- The form includes a honeypot field and minimum submit-time check to reduce automated spam.
- Input is sanitized and validated before emailing.
- Do not commit real email credentials or sensitive keys to this repository.
- The `.htaccess` file adds basic security headers and enforces HTTPS where supported.

## SEO
- Meta description, Open Graph tags (with `og:image`), Twitter cards, and JSON-LD structured data (Organization, WebSite, Product, FAQPage) are included.
- `sitemap.xml` lists the homepage plus the `privacy.html` and `terms.html` legal pages.
- `robots.txt` allows search engine indexing and references the sitemap.
- Canonical URLs use the `www` subdomain: `https://www.autovoiceintegration.com/`.
