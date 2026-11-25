# Design notes

## Idea

The shop sells small left-chest prints, so the site is built around showing real size. The hero is a chest crop with the shirt's centre line drawn in, so "left of centre" is literal. Every product sheet shows the print next to a 10 baht coin (26 mm) and a bank card (85.6 x 54 mm) at the same scale.

## Tokens

- Cotton `#EEEFEA` page
- Stone `#DADCD7` photo backdrop
- Ink `#1F2A44` text and print ink on white shirts (screen-print navy, not black)
- Marigold `#F2B517` the accent dot, used sparingly
- Thread `#5B6273` secondary text

Type: Bai Jamjuree (Cadson Demak) for everything, Latin and Thai from one family, weights 400 to 700.

## Mockups

`public/js/shirt.js` draws the shirt in SVG at 48 px per cm, so tiles, the hero, the product sheet and the email proofs all use the same geometry. The print sits 9.5 cm from centre on the wearer's left, which is the viewer's right.
