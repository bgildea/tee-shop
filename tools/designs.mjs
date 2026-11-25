// Artwork for each design, drawn in millimetres.
// Each function returns { w, h, body } where body is SVG markup that uses
// the placeholders INK and ACCENT. Text is converted to outlines with
// opentype.js so the print files never depend on an installed font.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import opentype from "opentype.js";

const require = createRequire(import.meta.url);
const fontDir = path.dirname(require.resolve("@fontsource/bai-jamjuree/package.json")) + "/files";
const loadFont = (file) => {
  const buf = fs.readFileSync(path.join(fontDir, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const latin600 = loadFont("bai-jamjuree-latin-600-normal.woff");
const thai700 = loadFont("bai-jamjuree-thai-700-normal.woff");

// Outline a string so its cap box is `height` mm tall, starting at x,y (top-left).
function outline(font, text, { x = 0, y = 0, height, letterSpacing = 0 }) {
  const probe = font.getPath(text, 0, 0, 100, { letterSpacing });
  const bb = probe.getBoundingBox();
  const scale = height / (bb.y2 - bb.y1);
  const size = 100 * scale;
  const p = font.getPath(text, 0, 0, size, { letterSpacing });
  const b = p.getBoundingBox();
  const moved = font.getPath(text, x - b.x1, y - b.y1, size, { letterSpacing });
  const fb = moved.getBoundingBox();
  return { d: moved.toPathData(3), width: fb.x2 - fb.x1, height: fb.y2 - fb.y1 };
}

const r = (n) => Math.round(n * 1000) / 1000;

export const designs = {
  "bangkok-coordinates"() {
    const w = 60;
    const line2 = outline(latin600, "100.50° E", { height: 10 });
    const scale = w / line2.width; // line 2 sets the full width
    const capH = 10 * scale;
    const l2 = outline(latin600, "100.50° E", { x: 0, y: capH + 4.2, height: capH });
    const l1 = outline(latin600, "13.75° N", { x: 0, y: 0, height: capH });
    const dotR = capH * 0.26;
    const body = `
  <path d="${l1.d}" fill="INK"/>
  <circle cx="${r(l1.width + dotR + 2.6)}" cy="${r(capH - dotR)}" r="${r(dotR)}" fill="ACCENT"/>
  <path d="${l2.d}" fill="INK"/>`;
    return { w, h: r(capH * 2 + 4.2), body };
  },

  "mango-sticky-rice"() {
    const w = 60, h = 36;
    const grains = [
      [11, 24, -20], [16, 20, 15], [21, 25, -5], [26, 19, 30], [14, 29, 10],
      [24, 30, -25], [30, 25, 12], [19, 31, 40], [9, 30, -35], [28, 30, 5],
    ].map(([cx, cy, a]) => `<ellipse cx="${cx}" cy="${cy}" rx="1.6" ry="0.75" transform="rotate(${a} ${cx} ${cy})" fill="INK"/>`).join("");
    const body = `
  <path d="M4.5 34C4.5 21.5 13.5 14.5 22.5 14.5C31.5 14.5 38 21.5 38 34" fill="none" stroke="INK" stroke-width="1.5" stroke-linecap="round"/>
  ${grains}
  <path d="M31 33.2C31.5 22.5 42 13 53.5 13.6C58 13.9 59.6 17.6 57.6 21.6C53.6 29.6 44.5 33.8 31 33.2Z" fill="ACCENT" stroke="INK" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M37 30.2C43.5 27.5 49.5 22.5 54 17.3M41.5 31.4C47 28.6 51.6 24.8 55.4 20.4M35.6 26.4C40.6 22.6 45.4 18.8 50.6 15.6" fill="none" stroke="INK" stroke-width="0.9" stroke-linecap="round"/>
  <path d="M1.2 34.8H58.8" stroke="INK" stroke-width="1.5" stroke-linecap="round"/>`;
    return { w, h, body };
  },

  fon() {
    const w = 45;
    const word = outline(thai700, "ฝน", { x: 0, y: 0, height: 17 });
    const wave = (y) => {
      let d = `M0.9 ${y}`;
      const seg = 43.2 / 6;
      for (let i = 0; i < 6; i++) {
        const x0 = 0.9 + i * seg;
        const up = i % 2 === 0 ? -1.5 : 1.5;
        d += `Q${r(x0 + seg / 2)} ${r(y + up * 2)} ${r(x0 + seg)} ${y}`;
      }
      return d;
    };
    const top = 17 + 6.5;
    const body = `
  <path d="${word.d}" fill="INK"/>
  <path d="${wave(top)}${wave(top + 6)}${wave(top + 12)}" fill="none" stroke="ACCENT" stroke-width="1.8" stroke-linecap="round"/>`;
    return { w, h: r(top + 12 + 2), body };
  },
};

// Full SVG for one design in one ink colour, sized in cm for print.
export function svgFor(id, { ink, accent, widthCm }) {
  const art = designs[id]();
  const k = (widthCm * 10) / art.w;
  const wCm = widthCm, hCm = Math.round(art.h * k) / 10;
  const body = art.body.replaceAll("INK", ink).replaceAll("ACCENT", accent);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${wCm}cm" height="${hCm}cm" viewBox="0 0 ${art.w} ${art.h}">${body}
</svg>
`;
}
