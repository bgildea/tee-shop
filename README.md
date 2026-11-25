# tee-shop

Print-on-demand T-shirt shop for Thailand. Static site on Netlify, English and Thai, no stock held.

Working name: Tee Shop (placeholder). The name, contact email, prices, sizes, colours and designs all live in `public/shop.json`, so a rename is a one-line change.

## Status

Pre-launch. Prices are placeholders (`pricesConfirmed: false` shows a preview banner). Designs are placeholders too.

## Layout

- `public/` the site: `index.html`, `styles.css`, `app.js`, `shop.json`, `js/shirt.js` (draws the chest mockups), `fonts/` (Bai Jamjuree, Latin and Thai, self-hosted)
- `public/print/` print files per design and shirt colour: outlined SVG and 300 dpi transparent PNG, plus `manifest.json`
- `public/mockups/` 1800 x 1350 chest proof JPGs (used in emails)
- `netlify/functions/submission-created.mjs` emails the customer (EN or TH) with proofs and a PromptPay QR, and emails you the print files
- `netlify/functions/promptpay-qr.mjs` serves `/qr/promptpay/<amount>.png`
- `netlify/lib/` PromptPay payload and order checking (the server recalculates totals from `shop.json`)
- `tools/designs.mjs` the artwork, drawn in millimetres; text is converted to outlines
- `tools/build-designs.mjs` rebuilds every print file and proof
- `tests/` PromptPay payloads checked against published examples, order maths and email escaping

## Commands

```
npm install
npm run designs   # needs rsvg-convert and ImageMagick
npm test
npx netlify dev   # local site with functions
```

## Netlify settings

Environment variables:

- `PROMPTPAY_ID` optional, overrides `promptPayId` in `shop.json` (phone, 13-digit ID or 15-digit e-wallet ID)
- `OWNER_EMAIL` optional, overrides `brand.contactEmail` for the owner copy of each order
- `MAIL_FROM` optional sender, e.g. `Tee Shop <orders@yourdomain>`
- Gmail: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, or Brevo: `BREVO_SMTP_USER`, `BREVO_SMTP_KEY` (Brevo wins if both are set)

Order numbers look like `TD-YYMMDD-XXXX` (Bangkok date). Netlify's own form notification is optional now that the function emails `OWNER_EMAIL`.

## Adding a design

1. Draw it in `tools/designs.mjs` (millimetres, use `INK` and `ACCENT` as colours).
2. Add it to `designs` in `public/shop.json` with its print width.
3. Run `npm run designs` and commit the generated files.
