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

`tools/designs.mjs` holds every design as code: round badges (Doi Inthanon, Railay, Khao Yai, Similan) and open layouts (Lumpini Lizard, Bangkok Skyline, Andaman Longtail, Soi Dog). Two inks per design: a main ink that flips between cream and black with the shirt, plus marigold.
