# Design notes

## Direction (25 Nov 2026)

Modelled on Due South (place-based, hand-drawn line art, single light ink on dark shirts) and West Coast Tees (playful local animals, "hot off the press" feature). Every design is a real place or creature in Thailand.

## Tokens

- Cream `#F4F0E8` page, Paper `#FBF9F4` panels
- Ink `#1E1E1F` text
- Forest `#2E4537` hero and pillars band
- Marigold `#EDB024` second ink colour and accents
- Clay `#B5541F` "New" badges and step numbers
- Collection backdrops behind product shots: North `#D5DCCC`, Bangkok `#E6D5C8`, Islands `#CADBDC`, Wildlife `#DDD8C2`

Type: Oswald for headings and artwork lettering, Bai Jamjuree for body text and all Thai (Kanit for Thai lettering inside artwork).

## Mockups

`public/js/shirt.js` draws a flat-lay tee in SVG at 10 units per cm (size M, 51 cm chest). Front prints sit centred 8 cm under the collar; chest prints sit on the wearer's left. Cards show the whole tee and swap to a close-up of the print on hover.

## Artwork

`tools/designs.mjs` holds every design as code. The current range (25 Nov 2026, second pass):

- Doi Inthanon: arch-framed poster, three ridgelines (hatched, stippled, solid with a pine line), striped sun, knocked-out altitude pill
- Phang Nga Bay: round badge, karst towers with hatching and stipple, perspective water, longtail, ribbon title with knocked-out lettering
- Bangkok 1782: temple prang over a sunburst, shadowed BANGKOK lettering, กรุงเทพมหานคร
- Tukkae Night Shift: spotted tokay gecko under a crescent moon, script lettering
- Similan Turtle: turtle with cut-out shell plates inside a scalloped wave ring
- Monsoon Club: storm cloud, lightning and rain with shadowed type and script
- Farang: ฝรั่ง in bold Kanit lettering with a yellow shadow over half a guava, plus a dictionary line (foreigner / guava)
- Soi Dog: small chest print

## Chest logo version

Every design also comes as a 4 cm left-chest logo (`chestLogoCm` in shop.json). It is not a shrunk copy: `svgFor(..., { mini: true })` drops stipple, hatching and text under about 2 mm, and makes strokes 1.7 times heavier so nothing is thinner than about 0.5 mm when printed. Files carry a `-chest` suffix.

## Thai lettering

`tools/thai.mjs` shapes Thai with HarfBuzz so stacked marks (the ั่ in ฝรั่ง) sit correctly. opentype.js alone overlaps them.

Techniques: procedural ridges, hatching and stipple (seeded, so output is repeatable), SVG masks for knockouts so the shirt shows through, two inks per design (main ink flips between cream and black with the shirt, plus marigold).
