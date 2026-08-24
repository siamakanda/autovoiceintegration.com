# AutoVoiceIntegration.com — Project Context

## Purpose
This document is the durable source of truth for the AutoVoiceIntegration website. Future sessions should read this file before making content, design, or structure changes.

## Product Summary
AutoVoiceIntegration provides an AI voice agent with telephony integration and **speed-to-dial** automation. When a business runs Facebook ads and a lead submits a form-fill ad, the AI agent calls that lead immediately, qualifies them, attempts to close the sale, and transfers the call to a human representative with full context when the bot cannot close.

## Business Model
- The site is a **business landing page** intended to generate sales conversations.
- The product is not yet widely known, so trust, clarity, and professionalism are more important than aggressive hype.
- Primary call to action is **Request a Demo**.

## Confirmed Website Decisions
- **Stack:** Static HTML + CSS + vanilla JavaScript. No WordPress, no framework, no build step.
- **Hosting:** Shared cPanel hosting.
- **Lead capture:** Demo request form handled by `submit.php` using PHP `mail()`.
- **Core offer:** One flagship AI voice agent.
- **Brand:** `AutoVoiceIntegration`.
- **Voice:** Professional and consultative.
- **Visual style:** Follows the visual style of https://telnyx.com/ — black background, violet (`#8B5CF6`) and electric cyan (`#22D3EE`) accents, monospace eyebrows/accents, flat buttons with subtle borders.
- **Scope:** Single full landing page.

## Domain
- https://autovoiceintegration.com/

## Target Audience
Business owners and operators who already spend money on Facebook lead-generation ads and need to convert form fills into answered calls faster.

Ideal customer segments:
- Marketing agencies running client campaigns
- Clinics and healthcare practices
- Home services businesses
- Real estate teams and agents
- Education providers
- E-commerce brands with high-intent leads

## Positioning Statement
AutoVoiceIntegration turns slow, missed follow-ups into instant sales conversations. It connects paid lead generation to an always-on AI voice agent that calls the moment a lead appears, handles qualification and objections, and hands the call to a human only when it matters.

## Brand Voice Guidelines
- Confident but not exaggerated
- Consultative and outcome-focused
- Clear, plain-English explanations
- Avoid claiming guaranteed revenue or fabricated client results
- Use words like "speed", "context", "handoff", and "coverage" to reinforce trust

## Visual Identity
- Background: black `#000000`
- Surface: `#101010`
- Text primary: `#FFFFFF`
- Text muted: `#9AA3AD`
- Accent primary (violet): `#8B5CF6`
- Accent secondary (electric cyan): `#22D3EE`
- Success: `#34D399`
- Typography: Inter (body/UI, via Google Fonts) + system monospace for eyebrows/accents
- Visual elements: subtle borders, flat surfaces, monospace accents, and inline SVG icons

## Landing Page Sections
1. Sticky header with logo, navigation, and demo CTA
2. Hero with headline, subheadline, primary and secondary CTAs
3. Trust/stats bar
4. Problem section
5. Solution section
6. How It Works
7. Features
8. Who It's For
9. Social proof
10. Pricing
11. FAQ
12. Final CTA
13. Demo request form
14. Footer

## Core Message
Headline: "Turn Facebook Ad Leads Into Answered Sales Calls In Under 30 Seconds"

Supporting message: AutoVoiceIntegration connects your ad platform to an AI voice agent that calls instantly, qualifies, answers objections, attempts to close, and transfers to a human when needed.

## Key Claims
The following are framed as platform capabilities, not client-specific results:
- Under 30 seconds speed-to-lead
- 24/7 availability
- Zero missed follow-ups
- Human handoff when needed

## Contact Details
- Contact email: `admin@autovoiceintegration.com`
- Phone number: `(530) 451-7997`
- Company legal name: `Autovoiceintegration.com`
- Address: Delaware, US

## Form Configuration
- Recipient email in `submit.php`: `admin@autovoiceintegration.com`
- Required fields: Full Name, Work Email, Phone Number (with country code)
- Optional fields: Business Name, Monthly Ad Spend, Message
- Country code is a searchable dropdown showing flag emoji + country name + dial code, covering the full world list (~230 countries/territories incl. Bangladesh +880), sorted alphabetically by name. The native `<select>` is retained (hidden) as the source of truth for no-JS form submission; JavaScript progressively enhances it.
- Monthly ad spend options:
  - Under $5,000 / month
  - $5,000 – $15,000 / month
  - $15,000 – $50,000 / month
  - $50,000+ / month

### Pricing Placeholders
The site uses three consultative tiers. Current placeholder copy:
- **Starter:** For teams testing AI voice automation. Price: Request a Demo.
- **Growth:** For businesses scaling paid lead generation. Price: Request a Demo.
- **Scale:** For high-volume campaigns and agencies. Price: Request a Demo.

These are intentionally not priced because the offer is consultative. If public pricing is added later, update this document.

### Testimonials
Replaced sample testimonials with a neutral, capability-focused "Speed Advantage" block (speed-to-lead, always-on coverage, warm handoff with context). No fabricated customer quotes or names are published. If real, verifiable client quotes become available later, they can be added back to this section.

## Technical Decisions
- Inter (Google Fonts) for body/UI, system monospace for accents
- Inline SVG icons only
- No stock photos in the initial build
- Semantic HTML with JSON-LD structured data (Organization, WebSite, Product, FAQPage)
- `.htaccess` for HTTPS, canonical host, security headers, and caching
- `robots.txt` allows indexing and references `sitemap.xml`
- PHP handler supports both JS and no-JS form submission
- Respect `prefers-reduced-motion`
- Open Graph / Twitter share image at `assets/icons/og-image.png` (1200x630)
- Separate `privacy.html` and `terms.html` legal pages
- GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys to cPanel via FTP on every push to `main`; FTP credentials are stored in GitHub Secrets (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`).

## Future Considerations
- Add a WordPress subdirectory blog for content marketing without replacing the static landing page.
- Add CRM/calendar integrations once the operational product and demo flow are defined.
- Migrate to a full server if call volume, customer portals, or backend services require it.
- Add Google Analytics 4 and Google Search Console verification once IDs are available.
- Consider upgrading form email deliverability from PHP `mail()` to SMTP (SPF/DKIM) and hardening spam protection before scaling paid traffic.
