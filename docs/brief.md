# Project brief

## Basics
- High-quality print-on-demand T-shirt shop selling in Thailand, no stock held
- Working name "Tee Shop" (placeholder). Brand name, colours, prices and contact email live in one config file so a rename is a one-line change
- Static site on Netlify (no WordPress or WooCommerce), switches between English and Thai
- Not selling yet; no domain until designs and order flow are right
- Current designs are temporary

## Reference sites
- https://www.westcoastees.com/
- https://www.duesouth.ie/

## Previous sites (reference only, not the base)
- thursdeys.netlify.app (original, yellow accent)
- thursdeys-pro.netlify.app (white retail layout, Inter and Inter Tight, trust strip, 4:5 cards, FAQ, dark footer)

## Order flow
- Netlify form "order", order numbers TD-YYMMDD-XXXX
- `submission-created` function emails the customer (EN or TH) with a proof per item, order details and a PromptPay QR for the exact amount (Gmail or Brevo)
- `promptpay-qr` function serves /qr/promptpay/<amount>.png
- Owner notification via Netlify Forms submission notifications (address must belong to a Netlify team member since 3 Nov 2026)
- Each order line in the owner email links art PNG, art SVG, proof and print width

## Shop settings
- Price per tee: TBD THB. Delivery: TBD THB. Free delivery from 2 tees
- Sizes S to 2XL. Size table currently uses typical values (100% cotton, chest 51 cm, length 73 cm), to be replaced with the printer's real blanks
- Payment: PromptPay QR to e-wallet ID 004999038380795 (from the K PLUS QR, 25 Nov 2026)
- Shirts: black and white only
- Times: printing 7 to 10 working days, delivery 3 to 5 working days, about 3 weeks door to door
- Contact and owner email: design@brickisred.com

## Design and print files
- All designs left chest
- Per design and shirt colour: outlined SVG, 300 dpi transparent PNG (709 px for 6 cm, 532 px for 4.5 cm), 1800x1350 chest proof JPG

## Copy
- Headline: "Small prints, close to the heart." / "ลายเล็ก ใกล้หัวใจ" (the old "left of centre" line and design are dropped for good)
- Open: QR timing copy vs instant email; returns policy to confirm; Thai copy needs a native speaker check

## To do
- [done] Base: fresh design, see docs/design.md
- Answer the copy items
- Get a bigger Irish Coins scan
- Build payments step by step
- Choose a Thai POD partner and forward orders to them
- Buy a domain (later)
