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
- **Visual style:** Dark navy/charcoal with electric blue and cyan accents.
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
- Background: deep navy/charcoal `#0B1220`
- Surface: `#111C33`
- Text primary: `#E5EDF8`
- Text muted: `#94A3B8`
- Accent blue: `#3B82F6`
- Accent cyan: `#22D3EE`
- Success: `#22C55E`
- Typography: modern system font stack, no external font requests
- Visual elements: CSS gradients, abstract shapes, and inline SVG icons

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

## Placeholder Items — MUST REVIEW BEFORE LAUNCH
These values are placeholders and must be replaced or confirmed before public launch.

### Contact Details
- Contact email: `hello@autovoiceintegration.com` — replace with the real receiving address.
- Phone number: not configured. Add if available.
- Company legal name and address: not configured.

### Form Configuration
- Recipient email in `submit.php`: `hello@autovoiceintegration.com`
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
The social proof section uses clearly editable sample testimonials. They are placeholder copy only and should be replaced with real, verifiable client quotes before launch. Do not publish sample testimonials as if they are real customer statements.

## Technical Decisions
- No external CDN dependencies
- Inline SVG icons only
- No stock photos in the initial build
- Semantic HTML with JSON-LD structured data
- `.htaccess` for HTTPS, canonical host, security headers, and caching
- `robots.txt` allows indexing
- PHP handler supports both JS and no-JS form submission
- Respect `prefers-reduced-motion`

## Future Considerations
- Add a WordPress subdirectory blog for content marketing without replacing the static landing page.
- Add CRM/calendar integrations once the operational product and demo flow are defined.
- Migrate to a full server if call volume, customer portals, or backend services require it.
- Expand to separate utility pages such as Privacy Policy and Terms of Service before paid traffic scaling.
