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

## Deploying to cPanel
1. Log in to cPanel and open **File Manager**.
2. Navigate to the `public_html` directory, or a subdirectory if this site should live in one.
3. Upload all files and folders while preserving the structure above.
4. Make sure `submit.php` is in the same directory as `index.html`.
5. Edit `submit.php` and set the correct recipient email address.
6. Verify the domain is serving HTTPS.
7. Submit the demo form and confirm the email arrives.

## Automated Deploy (GitHub Actions)
The repo includes a workflow at `.github/workflows/deploy.yml` that deploys to cPanel via FTP on every push to `main` (and via manual trigger).

1. Add these repository secrets under **Settings → Secrets and variables → Actions**:
   - `FTP_SERVER` — e.g. `ftp.autovoiceintegration.com`
   - `FTP_USERNAME` — your cPanel FTP username
   - `FTP_PASSWORD` — your FTP password
2. Verify `server-dir` in the workflow matches where your FTP account lands (cPanel main account root = home directory → `./public_html/`).
3. Push to `main` (or use **Actions → Run workflow**). The workflow uploads all site files, excluding `README.md`, `CONTEXT.md`, `.git`, and `.github`.

## Configuring the Demo Form
Open `submit.php` and update the configuration values at the top of the file:

```php
define('RECIPIENT_EMAIL', 'admin@autovoiceintegration.com');
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
- Meta description, Open Graph tags (with `og:image`), Twitter cards, and JSON-LD structured data (Organization, WebSite, Product, FAQPage) are included.
- `sitemap.xml` lists the homepage plus the `privacy.html` and `terms.html` legal pages.
- `robots.txt` allows search engine indexing and references the sitemap.
- Canonical URLs use the `www` subdomain: `https://www.autovoiceintegration.com/`.
