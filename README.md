# tee-shop

Print-on-demand T-shirt shop for Thailand. Static site on Netlify, English and Thai, no stock held.

Working name: Tee Shop (placeholder). The name, contact email, prices, sizes, colours and designs all live in `public/shop.json`, so a rename is a one-line change.

## Status

Pre-launch. Prices are placeholders (`pricesConfirmed: false` shows a preview banner). Designs are placeholders too.

## Layout

- `public/` the site: `index.html`, `styles.css`, `app.js`, `shop.json`, `js/shirt.js` (draws the flat-lay tee mockups), `img/hero.svg`, `fonts/` (Oswald and Bai Jamjuree, self-hosted)
- `public/print/` print files per design and shirt colour: outlined SVG and 300 dpi transparent PNG, plus `manifest.json`. Files ending `-chest` are the 4 cm left-chest logo version
- `public/mockups/` 1600 x 1600 flat-lay proof JPGs (used in emails)
- `netlify/functions/submission-created.mjs` emails the customer (EN or TH) with proofs and a PromptPay QR, and emails you the print files
- `netlify/functions/promptpay-qr.mjs` serves `/qr/promptpay/<amount>.png`
- `netlify/lib/` PromptPay payload and order checking (the server recalculates totals from `shop.json`)
- `tools/designs.mjs` the artwork, drawn in code; text is converted to outlines. `tools/thai.mjs` shapes Thai text with HarfBuzz
- `tools/build-designs.mjs` rebuilds every print file and proof
- `tests/` PromptPay payloads checked against published examples, order maths and email escaping

## Commands

```
npm install
npm run designs   # needs rsvg-convert and ImageMagick
npm test
npx netlify dev   # local site with functions
```

## Netlify

Live site: https://tee-shop-th.netlify.app (site ID b534f209-fcbd-40e6-9daa-13e9ab361835). Deployed from this repo with the Netlify CLI. It is not linked to GitHub yet, so pushes do not deploy on their own.

### Settings

Environment variables:

- `PROMPTPAY_ID` optional, overrides `promptPayId` in `shop.json` (phone, 13-digit ID or 15-digit e-wallet ID)
- `OWNER_EMAIL` optional, overrides `brand.contactEmail` for the owner copy of each order
- `MAIL_FROM` optional sender, e.g. `Tee Shop <orders@yourdomain>`
- Gmail: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, or Brevo: `BREVO_SMTP_USER`, `BREVO_SMTP_KEY` (Brevo wins if both are set)

Order numbers look like `TD-YYMMDD-XXXX` (Bangkok date). Netlify's own form notification is optional now that the function emails `OWNER_EMAIL`.

## Adding a design

1. Draw it in `tools/designs.mjs` (a box about 200 units wide, use `INK` and `ACCENT` as colours).
2. Add it to `designs` in `public/shop.json` with its print width, placement (`front` or `chest`), shirt colours and collections.
3. Run `npm run designs` and commit the generated files.
