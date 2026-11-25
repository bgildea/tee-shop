// Builds every print file from tools/designs.mjs and public/shop.json.
//
// For each design and shirt colour:
//   public/print/<id>-<colour>.svg   vector, text outlined, sized in cm
//   public/print/<id>-<colour>.png   300 dpi transparent PNG (532 px for 4.5 cm, 709 px for 6 cm)
//   public/mockups/<id>-<colour>.jpg 1800 x 1350 chest proof
// plus public/print/manifest.json with the print widths.
//
// Needs rsvg-convert (librsvg) and ImageMagick (magick or convert) on PATH.
// Usage: npm run designs

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { svgFor } from "./designs.mjs";
import { shirtSVG } from "../public/js/shirt.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shop = JSON.parse(fs.readFileSync(path.join(root, "public/shop.json"), "utf8"));
const out = (...p) => path.join(root, "public", ...p);
for (const d of ["print", "mockups", "art"]) fs.mkdirSync(out(d), { recursive: true });

const has = (cmd) => { try { execFileSync("which", [cmd], { stdio: "ignore" }); return true; } catch { return false; } };
const magick = has("magick") ? ["magick"] : ["convert"];

const manifest = {};
for (const design of shop.designs) {
  manifest[design.id] = {};
  for (const colour of shop.colours) {
    const name = `${design.id}-${colour.id}`;
    const svg = svgFor(design.id, { ink: colour.ink, accent: shop.accent, widthCm: design.widthCm });
    fs.writeFileSync(out("print", `${name}.svg`), svg);

    execFileSync("rsvg-convert", ["-d", "300", "-p", "300", "-o", out("print", `${name}.png`), out("print", `${name}.svg`)]);
    const pngPx = Math.ceil((design.widthCm / 2.54) * 300);

    const proofSvg = shirtSVG({ fabric: colour.fabric, print: { svg, widthCm: design.widthCm }, uid: name });
    const tmp = out("mockups", `${name}.tmp.svg`);
    fs.writeFileSync(tmp, proofSvg);
    const tmpPng = tmp.replace(".svg", ".png");
    execFileSync("rsvg-convert", ["-w", "1800", "-h", "1350", "-o", tmpPng, tmp]);
    execFileSync(magick[0], [tmpPng, "-quality", "86", out("mockups", `${name}.jpg`)]);
    fs.rmSync(tmp); fs.rmSync(tmpPng);

    manifest[design.id][colour.id] = { widthCm: design.widthCm, widthPx300: pngPx };
    console.log(`built ${name}  (${design.widthCm} cm, ${pngPx} px)`);
  }
  // Master art: the white-shirt version, used on the site and in emails.
  fs.copyFileSync(out("print", `${design.id}-white.svg`), out("art", `${design.id}.svg`));
}
fs.writeFileSync(out("print", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
