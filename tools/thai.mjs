// Thai lettering with proper shaping. opentype.js does not position stacked
// Thai marks (ฝรั่ง would collide), so this shapes text with HarfBuzz and draws
// each glyph's outline. Fontsource ships WOFF; HarfBuzz wants a plain font, so
// the WOFF is unpacked here (WOFF 1.0 is just zlib-compressed tables).

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createRequire } from "node:module";
import * as hb from "harfbuzzjs";

const require = createRequire(import.meta.url);

function woffToSfnt(buf) {
  const numTables = buf.readUInt16BE(12);
  const flavor = buf.readUInt32BE(4);
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const o = 44 + i * 20;
    const tag = buf.toString("latin1", o, o + 4);
    const offset = buf.readUInt32BE(o + 4), compLen = buf.readUInt32BE(o + 8), origLen = buf.readUInt32BE(o + 12), checksum = buf.readUInt32BE(o + 16);
    const raw = buf.subarray(offset, offset + compLen);
    tables.push({ tag, checksum, data: compLen < origLen ? zlib.inflateSync(raw) : raw });
  }
  const headerLen = 12 + numTables * 16;
  let size = headerLen;
  for (const t of tables) size += (t.data.length + 3) & ~3;
  const out = Buffer.alloc(size);
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(numTables, 4);
  let p = 1, e = 0; while (p * 2 <= numTables) { p *= 2; e++; }
  out.writeUInt16BE(p * 16, 6); out.writeUInt16BE(e, 8); out.writeUInt16BE(numTables * 16 - p * 16, 10);
  let off = headerLen;
  tables.forEach((t, i) => {
    const o = 12 + i * 16;
    out.write(t.tag, o, "latin1"); out.writeUInt32BE(t.checksum, o + 4); out.writeUInt32BE(off, o + 8); out.writeUInt32BE(t.data.length, o + 12);
    t.data.copy(out, off); off += (t.data.length + 3) & ~3;
  });
  return out;
}

const fonts = {};
function loadFont(pkg, file) {
  const key = pkg + file;
  if (!fonts[key]) {
    const dir = path.dirname(require.resolve(`@fontsource/${pkg}/package.json`)) + "/files";
    const sfnt = woffToSfnt(fs.readFileSync(path.join(dir, file)));
    const face = new hb.Face(new hb.Blob(sfnt.buffer.slice(sfnt.byteOffset, sfnt.byteOffset + sfnt.byteLength)));
    fonts[key] = { font: new hb.Font(face), upem: face.upem };
  }
  return fonts[key];
}

const r2 = (n) => Math.round(n * 100) / 100;

// Shaped Thai text centred on cx with baseline y. fit: scale to this width.
export function thaiText(str, { weight = 700, size = 40, cx = 100, y = 100, fit, fill = "INK", track = 0 }) {
  const { font, upem } = loadFont("kanit", `kanit-thai-${weight}-normal.woff`);
  const buf = new hb.Buffer();
  buf.addText(str);
  buf.guessSegmentProperties();
  hb.shape(font, buf);
  const infos = buf.getGlyphInfos(), pos = buf.getGlyphPositions();
  const trackU = track * upem;
  const advance = pos.reduce((s, p) => s + p.xAdvance, 0) + trackU * Math.max(0, infos.filter((_, i) => pos[i].xAdvance > 0).length - 1);
  if (fit) size = (fit / advance) * upem;
  const k = size / upem;
  let x = cx - (advance * k) / 2, out = "";
  infos.forEach((g, i) => {
    const d = font.glyphToPath(g.codepoint);
    const p = pos[i];
    if (d) out += `<path d="${d}" transform="translate(${r2(x + p.xOffset * k)} ${r2(y - p.yOffset * k)}) scale(${r2(k * 1000) / 1000} ${-r2(k * 1000) / 1000})" fill="${fill}"/>`;
    x += p.xAdvance * k + (p.xAdvance > 0 ? trackU * k : 0);
  });
  return { markup: out, width: advance * k, size };
}
