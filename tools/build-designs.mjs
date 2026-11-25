// Builds every print file from tools/designs.mjs and public/shop.json.
//
// For each design and shirt colour:
//   public/print/<id>-<colour>.svg   vector, text outlined, sized in cm
//   public/print/<id>-<colour>.png   300 dpi transparent PNG at the print width
//   public/mockups/<id>-<colour>.jpg 1600 x 1600 flat-lay proof (used in emails)
// and the same three files with a -chest suffix for the 4 cm left-chest logo version.
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
  for (const colour of design.colours.map((c) => shop.colours.find((x) => x.id === c))) {
    const versions = [
      { key: "front", suffix: "", widthCm: design.widthCm, placement: design.placement, mini: false },
      { key: "chest", suffix: "-chest", widthCm: shop.chestLogoCm, placement: "chest", mini: true },
    ];
    for (const v of versions) {
      const name = `${design.id}-${colour.id}${v.suffix}`;
      const svg = svgFor(design.id, { ink: colour.ink, accent: design.accent || colour.accent, widthCm: v.widthCm, mini: v.mini });
      fs.writeFileSync(out("print", `${name}.svg`), svg);
      execFileSync("rsvg-convert", ["-d", "300", "-p", "300", "-o", out("print", `${name}.png`), out("print", `${name}.svg`)]);
      const proofSvg = shirtSVG({ fabric: colour.fabric, heather: colour.heather, print: { svg, widthCm: v.widthCm, placement: v.placement }, uid: name });
      const tmp = out("mockups", `${name}.tmp.svg`);
      fs.writeFileSync(tmp, proofSvg);
      const tmpPng = tmp.replace(".svg", ".png");
      execFileSync("rsvg-convert", ["-w", "1600", "-h", "1600", "-o", tmpPng, tmp]);
      execFileSync(magick[0], [tmpPng, "-quality", "86", out("mockups", `${name}.jpg`)]);
      fs.rmSync(tmp); fs.rmSync(tmpPng);
      console.log(`built ${name}  (${v.widthCm} cm, ${Math.ceil((v.widthCm / 2.54) * 300)} px)`);
    }
    const pngPx = Math.ceil((design.widthCm / 2.54) * 300);
    manifest[design.id][colour.id] = { front: { widthCm: design.widthCm, widthPx300: pngPx, placement: design.placement }, chest: { widthCm: shop.chestLogoCm, widthPx300: Math.ceil((shop.chestLogoCm / 2.54) * 300), placement: "chest" } };
  }
  // Master art: the first colour's version.
  fs.copyFileSync(out("print", `${design.id}-${design.colours[0]}.svg`), out("art", `${design.id}.svg`));
}
fs.writeFileSync(out("print", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
