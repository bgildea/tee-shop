// Artwork for every design, drawn in code. Each design returns { w, h, body }
// in a box about 200 units wide. body uses two ink placeholders, INK and ACCENT,
// which the build swaps for each shirt's ink colours. Knockouts are SVG masks,
// so the shirt shows through (no third ink). All text is converted to outlines.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import opentype from "opentype.js";
import { thaiText } from "./thai.mjs";
import { stroke, ink, smooth } from "./pen.mjs";
const ring = (cx, cy, r, n = 16) => Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r]);

const require = createRequire(import.meta.url);
const font = (pkg, file) => {
  const dir = path.dirname(require.resolve(`@fontsource/${pkg}/package.json`)) + "/files";
  const buf = fs.readFileSync(path.join(dir, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const OSW7 = font("oswald", "oswald-latin-700-normal.woff");
const OSW6 = font("oswald", "oswald-latin-600-normal.woff");
const OSW5 = font("oswald", "oswald-latin-500-normal.woff");
const SCRIPT = font("yellowtail", "yellowtail-latin-400-normal.woff");
const KANIT = font("kanit", "kanit-thai-600-normal.woff");

/* ---------- helpers ---------- */
// MINI is on while drawing the small chest-logo version: fine texture and small
// text are left out and strokes get heavier so everything still prints at 4 cm.
let MINI = false, SWM = 1;
const big = (markup) => (MINI ? "" : markup);
const r2 = (n) => Math.round(n * 100) / 100;
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const S = (w = 2, c = "INK") => `fill="none" stroke="${c}" stroke-width="${r2(w * SWM)}" stroke-linecap="round" stroke-linejoin="round"`;

// Text centred on cx, baseline y. fit: squeeze/stretch size so it spans this width.
function text(str, { f = OSW7, size = 20, cx = 100, y, track = 0, fill = "INK", fit, rotate = 0 }) {
  const width = (s) => f.getAdvanceWidth(str, s, { letterSpacing: track }) - track * s;
  if (fit) size = (size * fit) / width(size);
  const w = width(size);
  const d = f.getPath(str, cx - w / 2, y, size, { letterSpacing: track }).toPathData(2);
  const tr = rotate ? ` transform="rotate(${rotate} ${cx} ${y})"` : "";
  return `<path d="${d}" fill="${fill}"${tr}/>`;
}
function textSize(str, f, fit, track = 0) { return (100 * fit) / (f.getAdvanceWidth(str, 100, { letterSpacing: track }) - track * 100); }

// Text on a circle. "top" runs over the top; "bottom" reads left to right along the bottom.
function arcText(str, { f = OSW6, size, r, cx = 100, cy = 100, side = "top", track = 0.12, fill = "INK" }) {
  const chars = [...str];
  const adv = chars.map((c) => f.getAdvanceWidth(c, size) + track * size);
  const total = adv.reduce((a, b) => a + b, 0) - track * size;
  const dir = side === "top" ? 1 : -1;
  const start = side === "top" ? -Math.PI / 2 - total / r / 2 : Math.PI / 2 + total / r / 2;
  let cur = 0, out = "";
  chars.forEach((c, i) => {
    const w = adv[i] - track * size;
    const a = start + (dir * (cur + w / 2)) / r;
    const rot = ((side === "top" ? a + Math.PI / 2 : a - Math.PI / 2) * 180) / Math.PI;
    const d = f.getPath(c, -w / 2, 0, size).toPathData(2);
    if (d) out += `<path d="${d}" transform="translate(${r2(cx + r * Math.cos(a))} ${r2(cy + r * Math.sin(a))}) rotate(${r2(rot)})" fill="${fill}"/>`;
    cur += adv[i];
  });
  return out;
}

// Mountain ridge as points.
function ridge(x0, x1, base, amp, seed, { step = 1.5, sharp = 1.5, freq = 1 } = {}) {
  const R = rng(seed), p = [R() * 6, R() * 6, R() * 6, R() * 6];
  const pts = [];
  for (let x = x0; x <= x1 + 0.01; x += step) {
    const a = (x / 200) * Math.PI * 2 * freq;
    const n = 0.5 * Math.sin(a * 1.3 + p[0]) + 0.28 * Math.sin(a * 3.1 + p[1]) + 0.14 * Math.sin(a * 7.3 + p[2]) + 0.08 * Math.sin(a * 13 + p[3]);
    pts.push([x, base - amp * Math.pow((n + 1) / 2, sharp)]);
  }
  return pts;
}
const line = (pts) => "M" + pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join("L");
const area = (pts, bottom) => `${line(pts)}L${r2(pts.at(-1)[0])} ${bottom}L${r2(pts[0][0])} ${bottom}Z`;
const yAt = (pts, x) => { const i = pts.findIndex((p) => p[0] >= x); return i <= 0 ? pts[0][1] : pts[i][1]; };

// Random dots inside a box, denser where density(x, y) is high (0..1).
function stipple(x0, y0, x1, y1, n, seed, density = () => 1, rMin = 0.45, rMax = 0.8, fill = "INK") {
  if (MINI) return "";
  const R = rng(seed);
  let out = "", tries = 0, made = 0;
  while (made < n && tries < n * 12) {
    tries++;
    const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0);
    if (R() > density(x, y)) continue;
    out += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(rMin + R() * (rMax - rMin))}"/>`;
    made++;
  }
  return `<g fill="${fill}">${out}</g>`;
}
const pine = (x, y, h) => {
  const w = h * 0.42;
  return `M${r2(x)} ${r2(y - h)}L${r2(x - w * 0.55)} ${r2(y - h * 0.55)}H${r2(x - w * 0.3)}L${r2(x - w)} ${r2(y)}H${r2(x + w)}L${r2(x + w * 0.3)} ${r2(y - h * 0.55)}H${r2(x + w * 0.55)}Z`;
};
// Sun with retro horizontal cuts in the lower half.
function stripedSun(id, cx, cy, r, fill = "ACCENT") {
  let bands = `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${r * 1.08}"/>`;
  let y = cy + r * 0.08, gap = r * 0.06, h = r * 0.2;
  while (y < cy + r) { bands += `<rect x="${cx - r}" y="${r2(y + gap)}" width="${2 * r}" height="${r2(Math.max(h, 0.6))}"/>`; y += gap + h; gap *= 1.35; h *= 0.78; }
  return `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#${id})" fill="${fill}">${bands}</g>`;
}
// Mask that removes "holes" from a shape so the shirt shows through.
const knock = (id, holes) => `<mask id="${id}" maskUnits="userSpaceOnUse" x="-100" y="-100" width="400" height="400"><rect x="-100" y="-100" width="400" height="400" fill="#fff"/>${holes}</mask>`;
const star = (x, y, s = 3, fill = "INK") => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${fill}"/>`;

/* ---------- designs ---------- */
export const designs = {
  // Arch-framed mountain poster with layered ridges, stipple and a pine line.
  "doi-inthanon"() {
    const arch = "M28 152V86A72 72 0 0 1 172 86V152Z";
    const back = ridge(20, 180, 104, 34, 11, { sharp: 1.8 });
    const mid = ridge(20, 180, 122, 24, 23, { sharp: 1.4, freq: 1.4 });
    const front = ridge(20, 180, 140, 14, 7, { sharp: 1.1, freq: 0.8 });
    let pines = "";
    const R = rng(5);
    for (let x = 26; x < 176; x += 4.2 + R() * 3) pines += pine(x, yAt(front, x) + 2, 7 + R() * 6);
    const hatch = Array.from({ length: 70 }, (_, i) => { const x = 22 + i * 2.3; return `M${r2(x)} ${r2(yAt(back, x) + 3)}V${r2(yAt(mid, x))}`; }).join("");
    const mist = `<path d="M34 118H62M70 118H84M118 112H150M126 116H164" ${S(1.2)}/>`;
    const birds = `<path d="M116 52Q120 48 124 52Q128 48 132 52M132 42Q135 39 138 42Q141 39 144 42" ${S(1.2)}/>`;
    const scene = `
      <g mask="url(#doi-sunmask)">${stripedSun("doi-sun", 100, 84, 30)}</g>
      ${big(birds)}
      <path d="${line(back)}" ${S(1.6)}/>
      ${big(`<g clip-path="url(#doi-backarea)"><path d="${hatch}" ${S(0.7)}/></g>`)}
      <path d="${area(mid, 160)}" fill="INK" mask="url(#doi-midmask)"/>
      ${stipple(20, 96, 180, 160, 1100, 3, (x, y) => { const d = y - yAt(mid, x); return d < 2 ? 0 : Math.max(0, 1 - d / 22); }, 0.35, 0.72)}
      ${big(mist)}
      <path d="${area(front, 160)}" fill="INK"/>
      <path d="${pines}" fill="INK"/>`;
    const title = "DOI INTHANON";
    const tSize = textSize(title, OSW7, 150, 0.06);
    return {
      w: 200, h: MINI ? 192 : 200, body: `
      <defs>
        <clipPath id="doi-clip"><path d="${arch}"/></clipPath>
        <clipPath id="doi-backarea"><path d="${area(back, 160)}"/></clipPath>
        ${knock("doi-midmask", `<path d="${area(mid.map(([x, y]) => [x, y + 2.2]), 160)}" fill="#000"/><path d="${line(mid.map(([x, y]) => [x, y + 1]))}" fill="none" stroke="#fff" stroke-width="0"/>`)}
        ${knock("doi-sunmask", `<path d="${area(back.map(([x, y]) => [x, y - 1.6]), 170)}" fill="#000"/>`)}
        ${knock("doi-pill", text("2,565 M", { f: OSW6, size: 8.4, cx: 100, y: 155.6, track: 0.14, fill: "#000" }))}
      </defs>
      <g clip-path="url(#doi-clip)">${scene}</g>
      <path d="${arch}" ${S(3)}/>
      ${big(`<path d="M33.5 147V86A66.5 66.5 0 0 1 166.5 86V147" ${S(0.9)}/>
      <rect x="76" y="145" width="48" height="14" rx="7" fill="ACCENT" mask="url(#doi-pill)"/>`)}
      ${text(title, { f: OSW7, size: MINI ? tSize * 1.12 : tSize, y: MINI ? 186 : 184, track: 0.06 })}
      ${big(`${star(24, 192.4, 2.4, "ACCENT")}${star(176, 192.4, 2.4, "ACCENT")}
      ${text("CHIANG MAI  ·  THAILAND", { f: OSW5, size: 7.6, y: 195.3, track: 0.24 })}`)}` };
  },

  // Round badge, karst towers in Phang Nga Bay, ribbon title.
  "phang-nga-bay"() {
    const karst = (cx, base, w, h, seed) => {
      const R = rng(seed), L = [], Rt = [];
      for (let t = 0; t <= 1.0001; t += 0.04) {
        const under = t < 0.1 ? 0.18 * (1 - t / 0.1) : 0;
        const taper = 1 - 0.18 * Math.pow(t, 1.5) - (t > 0.78 ? 0.9 * Math.pow((t - 0.78) / 0.22, 2) * 0.55 : 0);
        const wob = (R() - 0.5) * 1.4;
        L.push([cx - (w / 2) * (taper - under) + wob, base - h * t]);
        Rt.push([cx + (w / 2) * (taper - under) + (R() - 0.5) * 1.4, base - h * t]);
      }
      const top = base - h, tw = (w / 2) * Math.max(0.2, 1 - 0.18 - 0.495);
      let cap = "";
      const bumps = 4 + Math.floor(R() * 3);
      for (let i = 0; i < bumps; i++) {
        const x0 = cx - tw + (2 * tw * i) / bumps, x1 = cx - tw + (2 * tw * (i + 1)) / bumps;
        cap += `Q${r2((x0 + x1) / 2)} ${r2(top - 1.5 - R() * 2.5)} ${r2(x1)} ${r2(top + R() * 0.6)}`;
      }
      const d = `M${r2(L[0][0])} ${r2(L[0][1])}` + L.slice(1).map(([x, y]) => `L${r2(x)} ${r2(y)}`).join("") + cap + Rt.slice().reverse().map(([x, y]) => `L${r2(x)} ${r2(y)}`).join("") + "Z";
      return { d, cx, w, base, top };
    };
    const ks = [karst(58, 128, 30, 58, 1), karst(104, 128, 38, 82, 2), karst(146, 128, 26, 46, 3), karst(172, 128, 18, 30, 4)];
    const shade = ks.map((k, i) => {
      let lines = "";
      for (let x = k.cx - k.w * 0.05; x < k.cx + k.w / 2 + 2; x += 1.9) lines += `M${r2(x)} ${k.top - 4}V${k.base}`;
      if (MINI) return "";
      return `<clipPath id="pn-k${i}"><path d="${k.d}"/></clipPath><g clip-path="url(#pn-k${i})"><path d="${lines}" ${S(0.75)}/>${stipple(k.cx - k.w / 2, k.base - 14, k.cx + k.w / 2, k.base, 60, 40 + i, () => 1, 0.35, 0.6)}</g>`;
    }).join("");
    const R = rng(9);
    let water = "";
    for (let i = 0, y = 133; y < 182; i++, y += (MINI ? 6 : 2.6) + i * 0.55) {
      let x = 18 + R() * 10;
      while (x < 182) { const len = 6 + R() * 22; water += `M${r2(x)} ${r2(y)}H${r2(Math.min(x + len, 184))}`; x += len + 3 + R() * 7; }
    }
    const refl = ks.map((k) => `M${r2(k.cx - k.w * 0.3)} 131.5H${r2(k.cx + k.w * 0.25)}M${r2(k.cx - k.w * 0.18)} 134H${r2(k.cx + k.w * 0.12)}`).join("");
    const boat = `<path d="M34 140C42 144 60 145 76 141L80 135C77 138 73 139 70 139H38Z" fill="INK"/><path d="M80 135L82 129M36 139L28 146" ${S(1.2)}/><path d="M82 130C85 132 86 135 84 138" ${S(1.2, "ACCENT")}/>`;
    const scene = `<g mask="url(#pn-sunmask)">${stripedSun("pn-sun", 132, 70, 20)}</g>${big(`<path d="M54 52Q58 48 62 52Q66 48 70 52M70 40Q73 37 76 40Q79 37 82 40" ${S(1.2)}/>`)}
      ${ks.map((k) => `<path d="${k.d}" fill="none" stroke="INK" stroke-width="1.7" stroke-linejoin="round"/>`).join("")}${shade}
      <path d="M14 129.5H186" ${S(1.6)}/><path d="${refl}${water}" ${S(MINI ? 1.4 : 1)}/>${boat}`;
    const ribbonText = text("PHANG NGA BAY", { f: OSW7, size: MINI ? 15.5 : 14, y: MINI ? 166.6 : 166, track: MINI ? 0.06 : 0.1, fill: "#000" });
    return {
      w: 200, h: MINI ? 178 : 200, body: `
      <defs><clipPath id="pn-clip"><circle cx="100" cy="96" r="76"/></clipPath>
        ${knock("pn-rib", ribbonText + `<path d="M23.5 150.5V171.5M176.5 150.5V171.5" stroke="#000" stroke-width="1.6"/>`)}
        ${knock("pn-under", `<rect x="0" y="149" width="200" height="24" fill="#000"/>`)}
        ${knock("pn-sunmask", ks.map((k) => `<path d="${k.d}" fill="#000" stroke="#000" stroke-width="3"/>`).join(""))}</defs>
      <g mask="url(#pn-under)"><circle cx="100" cy="96" r="94" ${S(3)}/>${big(`<circle cx="100" cy="96" r="88.5" ${S(0.9)}/>`)}<circle cx="100" cy="96" r="77" ${S(2.2)}/>
      <g clip-path="url(#pn-clip)">${scene}</g></g>
      ${big(arcText("ANDAMAN SEA   ·   THAILAND", { f: OSW6, size: 8.6, r: 80.5, cy: 96, track: 0.22 }))}
      <path d="M30 154H6L14 163L6 172H30Z M170 154H194L186 163L194 172H170Z" fill="INK"/>
      <path d="M22 150H178V172H22Z" fill="INK" mask="url(#pn-rib)"/>
      ${big(`${star(100, 184, 3.2, "ACCENT")}${star(88, 184, 1.8)}${star(112, 184, 1.8)}`)}` };
  },

  // City lockup: Wat Arun style prang over a sunburst, shadowed type.
  "bangkok-1782"() {
    const cx = 100, base = 112;
    let rays = "";
    const nRays = MINI ? 22 : 44;
    for (let i = 0; i < nRays; i++) {
      const a = Math.PI + (i / (nRays - 1)) * Math.PI, r0 = 30, r1 = i % 2 ? 66 : 78;
      rays += `M${r2(cx + Math.cos(a) * r0)} ${r2(base + Math.sin(a) * r0)}L${r2(cx + Math.cos(a) * r1)} ${r2(base + Math.sin(a) * r1)}`;
    }
    const prang = (x, scale) => {
      const s = (v) => r2(v * scale);
      const tiers = [[30, 7], [25, 7], [21, 8], [17, 8]];
      let y = base, d = "", cuts = "";
      for (const [hw, h] of tiers) { d += `M${r2(x - s(hw))} ${r2(y)}V${r2(y - s(h))}H${r2(x + s(hw))}V${r2(y)}Z`; cuts += `M${r2(x - s(hw) + 1.4)} ${r2(y - s(h) + s(2.2))}H${r2(x + s(hw) - 1.4)}`; y -= s(h); }
      const cob = `M${r2(x - s(14))} ${r2(y)}C${r2(x - s(14))} ${r2(y - s(26))} ${r2(x - s(6))} ${r2(y - s(44))} ${r2(x)} ${r2(y - s(52))}C${r2(x + s(6))} ${r2(y - s(44))} ${r2(x + s(14))} ${r2(y - s(26))} ${r2(x + s(14))} ${r2(y)}Z`;
      for (let k = 1; k < 7; k++) { const yy = y - s(k * 7); const ww = s(14) * (1 - Math.pow(k / 7.4, 1.6)); cuts += `M${r2(x - ww + 1.2)} ${r2(yy)}H${r2(x + ww - 1.2)}`; }
      const spireTop = y - s(52);
      const spire = `M${r2(x - s(1.6))} ${r2(spireTop + 2)}V${r2(spireTop - s(16))}H${r2(x + s(1.6))}V${r2(spireTop + 2)}Z`;
      const tri = `M${r2(x)} ${r2(spireTop - s(16))}V${r2(spireTop - s(26))}M${r2(x - s(4))} ${r2(spireTop - s(22))}V${r2(spireTop - s(17))}H${r2(x + s(4))}V${r2(spireTop - s(22))}`;
      return { body: d + cob + spire, cuts, tri };
    };
    const main = prang(100, 1), l = prang(52, 0.55), rr = prang(148, 0.55);
    const shop = (x, w, h) => `M${x} ${base}V${base - h}H${x + w}V${base}Z`;
    const skyline = shop(14, 12, 18) + shop(28, 8, 26) + shop(160, 9, 22) + shop(172, 14, 15);
    const water = MINI ? `<path d="M10 119H190M40 126H160" ${S(1.6)}/>` : `<path d="M10 117H190M24 122H70M80 122H124M134 122H176M40 127H96M106 127H160" ${S(1.2)}/>`;
    const title = "BANGKOK", tS = textSize(title, OSW7, 172, 0.04);
    return {
      w: 200, h: MINI ? 174 : 205, body: `
      <defs>${knock("bk-cut", `<path d="${main.cuts + l.cuts + rr.cuts}" stroke="#000" stroke-width="${MINI ? 1.8 : 1.1}" fill="none"/>`)}</defs>
      <path d="${rays}" ${S(1.5, "ACCENT")}/>
      <g mask="url(#bk-cut)"><path d="${main.body + l.body + rr.body + skyline}" fill="INK"/></g>
      <path d="${main.tri + l.tri + rr.tri}" ${S(1.2)}/>
      <path d="M8 ${base}H192" ${S(1.8)}/>${water}
      ${text(title, { f: OSW7, size: tS, cx: 101.6, y: 169.6, track: 0.04, fill: "ACCENT" })}
      ${text(title, { f: OSW7, size: tS, cx: 100, y: 168, track: 0.04 })}
      ${big(`<path d="M14 181H64M136 181H186" ${S(1.1)}/>
      ${text("EST. 1782", { f: OSW6, size: 10, y: 184.6, track: 0.3 })}
      ${thaiText("กรุงเทพมหานคร", { weight: 600, size: 11.5, cx: 100, y: 199 }).markup}`)}` };
  },

  // Playful tokay gecko from above, script lettering.
  "tukkae-night-shift"() {
    const toes = (x, y, a) => Array.from({ length: 5 }, (_, i) => {
      const ang = a + (i - 2) * 0.42, ex = x + Math.cos(ang) * 6.2, ey = y + Math.sin(ang) * 6.2;
      return `<path d="M${r2(x)} ${r2(y)}L${r2(ex)} ${r2(ey)}" ${S(2.4)}/><circle cx="${r2(ex)}" cy="${r2(ey)}" r="2.5" fill="INK"/>`;
    }).join("");
    const leg = (sx, sy, ex, ey, hx, hy, a) => `<path d="M${sx} ${sy}L${ex} ${ey}" ${S(7.5)}/><path d="M${ex} ${ey}L${hx} ${hy}" ${S(6)}/>${toes(hx, hy, a)}`;
    const body = "M0 -62C14 -62 19 -50 16 -40C14 -34 10 -32 10 -30C22 -16 23 14 14 36C9 46 -9 46 -14 36C-23 14 -22 -16 -10 -30C-10 -32 -14 -34 -16 -40C-19 -50 -14 -62 0 -62Z";
    const tail = `<path d="M0 40C2 58 22 64 22 80" ${S(10)}/><path d="M22 80C22 94 4 96 2 86" ${S(6.5)}/><path d="M2 86C1 80 8 78 10 82" ${S(4)}/>`;
    const R = rng(4);
    let spots = "";
    for (let i = 0; i < (MINI ? 12 : 34); i++) { const y = -52 + R() * 88, wmax = y < -32 ? 10 : 13; spots += `<circle cx="${r2((R() - 0.5) * 2 * wmax)}" cy="${r2(y)}" r="${r2(MINI ? 2.6 + R() * 1.2 : 1.1 + R() * 1.4)}"/>`; }
    let tspots = "";
    [[6, 54], [16, 66], [20, 78], [14, 90]].forEach(([x, y]) => { tspots += `<circle cx="${x}" cy="${y}" r="1.7"/>`; });
    const gecko = `<g transform="translate(94 78) rotate(-24) scale(0.74)">
      ${leg(-10, -18, -28, -26, -32, -44, -2.2)}${leg(10, -18, 28, -26, 32, -44, -0.95)}
      ${leg(-11, 24, -30, 30, -34, 48, 2.2)}${leg(11, 24, 30, 30, 34, 48, 0.95)}
      ${tail}
      <path d="${body}" fill="INK"/>
      <g fill="ACCENT">${spots}${tspots}</g>
      <g mask="url(#tk-eyes)"><circle cx="-9" cy="-48" r="3.6" fill="ACCENT"/><circle cx="9" cy="-48" r="3.6" fill="ACCENT"/></g>
    </g>`;
    const moon = `<path d="M160 26A16 16 0 1 0 176 50A13 13 0 1 1 160 26Z" fill="ACCENT"/>`;
    const stars = star(144, 22, 3) + star(176, 18, 2.2) + star(184, 62, 2.6) + star(30, 30, 2.4) + star(22, 70, 1.8);
    return {
      w: 200, h: MINI ? 192 : 208, body: `
      <defs>${knock("tk-eyes", `<path d="M-9 -51.6V-44.4M9 -51.6V-44.4" stroke="#000" stroke-width="1.2"/>`)}</defs>
      ${moon}${stars}${gecko}
      ${text("Night Shift", { f: SCRIPT, size: 44, cx: 101, y: 184, rotate: -6, fill: "ACCENT" })}
      ${big(text("TUKKAE CLUB  ·  BANGKOK", { f: OSW6, size: 8.4, y: 204, track: 0.28 }))}` };
  },

  // Sea turtle from above in a badge with a scalloped wave ring.
  "similan-turtle"() {
    const turtle = `
      <path d="M-24 -18C-46 -38 -66 -36 -74 -24C-62 -24 -46 -16 -28 -4Z M24 -18C46 -38 66 -36 74 -24C62 -24 46 -16 28 -4Z M-20 26C-30 38 -40 44 -46 42C-40 36 -32 28 -26 18Z M20 26C30 38 40 44 46 42C40 36 32 28 26 18Z" fill="INK" mask="url(#st-fl)"/>
      <path d="M-8 -36C-10 -52 -4 -58 0 -58C4 -58 10 -52 8 -36Z" fill="INK" mask="url(#st-hd)"/>
      <path d="M0 -40C22 -40 34 -20 34 4C34 28 20 44 0 46C-20 44 -34 28 -34 4C-34 -20 -22 -40 0 -40Z" fill="INK" mask="url(#st-sh)"/>
      <path d="M-4 44L0 54L4 44" fill="INK"/>`;
    const scutes = `<path d="M0 -26L11 -18V-4L0 4L-11 -4V-18Z M0 4L11 12V26L0 34L-11 26V12Z M11 -18L24 -24M-11 -18L-24 -24M11 -4L28 2M-11 -4L-28 2M11 12L28 2M-11 12L-28 2M11 26L22 34M-11 26L-22 34" fill="none" stroke="#000" stroke-width="${MINI ? 2.8 : 1.6}" stroke-linejoin="round"/><path d="M0 -40C22 -40 34 -20 34 4C34 28 20 44 0 46C-20 44 -34 28 -34 4C-34 -20 -22 -40 0 -40Z" transform="scale(0.88)" fill="none" stroke="#000" stroke-width="1.3"/>`;
    const R = rng(12);
    let flipDots = "";
    for (let i = 0; i < (MINI ? 0 : 26); i++) { const side = i % 2 ? 1 : -1; flipDots += `<circle cx="${r2(side * (34 + R() * 30))}" cy="${r2(-30 + R() * 14 + (Math.abs(34 + R() * 30) - 34) * -0.1)}" r="${r2(0.8 + R() * 0.9)}" fill="#000"/>`; }
    let scallops = "";
    for (let i = 0; i < 28; i++) { const a0 = (i / 28) * Math.PI * 2, a1 = ((i + 1) / 28) * Math.PI * 2, am = (a0 + a1) / 2, r = 71; scallops += `M${r2(100 + Math.cos(a0) * r)} ${r2(100 + Math.sin(a0) * r)}Q${r2(100 + Math.cos(am) * (r + 5))} ${r2(100 + Math.sin(am) * (r + 5))} ${r2(100 + Math.cos(a1) * r)} ${r2(100 + Math.sin(a1) * r)}`; }
    let rays = "";
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; rays += `M${r2(100 + Math.cos(a) * 50)} ${r2(100 + Math.sin(a) * 50)}L${r2(100 + Math.cos(a) * 62)} ${r2(100 + Math.sin(a) * 62)}`; }
    const bubbles = `<g ${S(1)}><circle cx="150" cy="70" r="3"/><circle cx="156" cy="60" r="2"/><circle cx="152" cy="52" r="1.3"/><circle cx="48" cy="134" r="2.4"/><circle cx="42" cy="126" r="1.4"/></g>`;
    return {
      w: 200, h: 200, body: `
      <defs>
        ${knock("st-sh", scutes)}
        ${knock("st-fl", `${flipDots}<path d="M-30 -10C-44 -22 -56 -26 -64 -24M30 -10C44 -22 56 -26 64 -24" stroke="#000" stroke-width="1.1" fill="none"/>`)}
        ${knock("st-hd", `<circle cx="-3.6" cy="-50" r="1.4" fill="#000"/><circle cx="3.6" cy="-50" r="1.4" fill="#000"/>`)}
      </defs>
      <circle cx="100" cy="100" r="97" ${S(3)}/><circle cx="100" cy="100" r="78" ${S(1.2)}/>
      <path d="${scallops}" ${S(1.6)}/>
      <path d="${rays}" ${S(1.6, "ACCENT")}/>
      ${big(bubbles)}
      <g transform="translate(100 102) rotate(-18)">${turtle}</g>
      ${arcText("SIMILAN ISLANDS", { f: OSW7, size: MINI ? 14.5 : 13.5, r: MINI ? 82 : 82.5, side: "top", track: 0.16 })}
      ${big(arcText("PHANG NGA  ·  THAILAND", { f: OSW5, size: 8.8, r: 86, side: "bottom", track: 0.22 }))}
      ${big(`${star(16, 100, 3, "ACCENT")}${star(184, 100, 3, "ACCENT")}`)}` };
  },

  // Type-led rainy season piece: cloud, rain, bolt, shadowed title and script.
  "monsoon-club"() {
    const cloud = "M48 86C36 86 30 76 34 68C38 60 48 58 54 62C54 46 68 36 82 40C88 26 112 22 124 36C134 30 150 36 150 50C162 50 170 60 166 72C164 80 156 86 148 86Z";
    let rain = "";
    const R = rng(21);
    for (let i = 0; i < 16; i++) { const x = 50 + i * 6.6 + R() * 2, y = 94 + R() * 8, len = 8 + R() * 12; rain += `M${r2(x)} ${r2(y)}L${r2(x - len * 0.35)} ${r2(y + len)}`; }
    const bolt = `<path d="M104 80L92 104H102L94 128L118 96H106L114 80Z" fill="ACCENT"/>`;
    const title = "MONSOON", tS = textSize(title, OSW7, 176, 0.05);
    return {
      w: 200, h: 200, body: `
      <defs>${knock("mc-cl", `<path d="M62 70C62 60 70 54 78 56M98 46C104 40 114 40 118 46M134 58C140 56 146 60 146 66" stroke="#000" stroke-width="2.2" fill="none" stroke-linecap="round"/>`)}</defs>
      <path d="${cloud}" fill="INK" mask="url(#mc-cl)"/>
      <path d="${rain}" ${S(1.8, "ACCENT")}/>${bolt}
      ${text(title, { f: OSW7, size: tS, cx: 101.8, y: 165.8, track: 0.05, fill: "ACCENT" })}
      ${text(title, { f: OSW7, size: tS, cx: 100, y: 164, track: 0.05 })}
      ${text("Club", { f: SCRIPT, size: 30, cx: 156, y: 182, rotate: -8, fill: "ACCENT" })}
      ${big(`${text("MAY TO OCTOBER", { f: OSW6, size: 8.6, cx: 62, y: 180, track: 0.26 })}
      ${text("MEMBERS SINCE FOREVER", { f: OSW5, size: 7, cx: 62, y: 191, track: 0.26 })}`)}` };
  },

  /* ---------- The Line Series: single ink, drawn with a pen, Due South spirit ---------- */

  "rama-viii-bridge"() {
    const P = (pts, w, o = {}) => stroke(pts, { w, scale: SWM, ...o });
    let d = "";
    d += P([[6, 113], [60, 110.5], [130, 108.5], [194, 110]], 2.8, { taper: 0.3 });
    d += P([[6, 118.5], [70, 116.5], [194, 115.5]], 1.5, { taper: 0.3 });
    d += P([[55, 142], [59, 120], [64, 94]], 2.8, { taper: 0.2 }) + P([[73, 142], [69, 120], [64, 94]], 2.8, { taper: 0.2 });
    d += P([[64, 96], [64, 26]], 3.4, { taper: 0.15, wob: 0.15 });
    const nC = MINI ? 7 : 13;
    for (let i = 0; i < nC; i++) {
      const y = 30 + i * (MINI ? 6 : 3.3);
      d += P([[64, y], [192 - i * (MINI ? 15 : 8.6), 110 - (i * 0.1)]], 0.85, { taper: 0.1, press: 0.05, wob: 0.1 });
      d += P([[64, y], [9 + i * (MINI ? 7 : 3.7), 113 - i * 0.2]], 0.85, { taper: 0.1, press: 0.05, wob: 0.1 });
    }
    if (!MINI) {
      d += P([[18, 134], [40, 132], [58, 134]], 1.3) + P([[86, 132], [118, 130.5], [146, 132]], 1.3) + P([[120, 141], [150, 139.5], [178, 141]], 1.3) + P([[30, 146], [60, 144.5], [92, 146]], 1.3);
      d += P([[128, 34], [132, 30], [136, 34]], 1.1) + P([[138, 26], [141, 23], [144, 26]], 1.1);
    }
    const sun = stroke(ring(156, 44, 9), { w: 1.6, closed: true, scale: SWM });
    return { w: 200, h: MINI ? 146 : 172, body: `${ink(d + (MINI ? "" : sun))}${big(text("RAMA VIII BRIDGE  ·  BANGKOK", { f: OSW5, size: 8.4, y: 168, track: 0.3 }))}` };
  },

  "ko-tapu"() {
    const P = (pts, w, o = {}) => stroke(pts, { w, scale: SWM, ...o });
    let d = "";
    d += P([[93, 140], [91, 128], [88, 112], [84, 96], [80, 80], [78, 64], [81, 55], [89, 49], [100, 47], [110, 49], [117, 57], [118, 71], [114, 87], [110, 103], [107, 119], [106, 132], [105, 140]], 2.5, { taper: 0.2 });
    d += P([[82, 53], [86, 47], [90, 50], [95, 44], [100, 48], [105, 43], [109, 48], [114, 46], [118, 53]], 1.6, { taper: 0.5 });
    if (!MINI) {
      [[106, 58, 76], [110, 62, 90], [104, 76, 108], [101, 96, 128], [112, 72, 82], [97, 64, 84], [90, 92, 112]].forEach(([x, y0, y1], i) => { d += P([[x, y0], [x - 1.5, (y0 + y1) / 2], [x - 2.5, y1]], 0.9, { seed: 300 + i }); });
    }
    d += P([[16, 140], [22, 118], [30, 100], [40, 88], [52, 84], [60, 92], [62, 110], [66, 128], [70, 140]], 1.9, { taper: 0.25 });
    if (!MINI) [[34, 102, 26, 130], [44, 94, 36, 132], [54, 92, 50, 128]].forEach(([a, b, c, e], i) => { d += P([[a, b], [c, e]], 0.9, { seed: 330 + i }); });
    d += P([[138, 140], [150, 128], [164, 124], [178, 130], [188, 140]], 1.6, { taper: 0.3 });
    d += P([[6, 141], [194, 141]], 2, { taper: 0.4 });
    const waves = MINI ? [[30, 150, 80], [110, 150, 170], [60, 160, 130]] : [[14, 149, 60], [72, 149, 86], [112, 149, 176], [30, 156, 104], [120, 156, 152], [58, 163, 92], [104, 163, 140], [84, 170, 118]];
    waves.forEach(([x0, y, x1], i) => { d += P([[x0, y], [(x0 + x1) / 2, y - 0.6], [x1, y]], 1.2, { seed: 360 + i }); });
    if (!MINI) d += P([[94, 145], [104, 145]], 1) + P([[96, 148], [102, 148]], 0.9);
    const boat = `<path d="M146 146C150 148.4 160 148.6 168 146.4L170 143.4C168 144.8 166 145.2 164 145.2H148Z" fill="INK"/>`;
    return { w: 200, h: MINI ? 172 : 190, body: `${ink(d)}${boat}${big(text("KO TAPU  ·  PHANG NGA", { f: OSW5, size: 9.4, y: 186, track: 0.34 }))}` };
  },

  "whale-shark"() {
    const P = (pts, w, o = {}) => stroke(pts, { w, scale: SWM, ...o });
    const top = [[18, 63], [26, 54], [44, 47], [76, 42], [118, 41], [150, 47], [172, 55], [190, 61]];
    const bottom = [[190, 68], [170, 74], [140, 80], [100, 83], [62, 81], [38, 75], [24, 69], [18, 64]];
    let d = "";
    d += P(top, 2.4, { taper: 0.3 });
    d += P(bottom, 2.4, { taper: 0.3 });
    d += P([[189, 61], [198, 45], [209, 28]], 2.2) + P([[209, 28], [205, 46], [199, 63], [205, 73], [211, 81]], 2.2) + P([[211, 81], [200, 73], [189, 68]], 2.2);
    d += P([[18, 64.5], [30, 67], [42, 66.5]], 1.6);
    d += P([[78, 77], [90, 96], [104, 101], [98, 86], [92, 78]], 2.1, { taper: 0.4 });
    d += P([[120, 42], [133, 22], [145, 19], [144, 32], [151, 46]], 2.1, { taper: 0.35 });
    d += P([[170, 54], [176, 46], [181, 46], [181, 57]], 1.6);
    const gills = MINI ? 3 : 5;
    for (let i = 0; i < gills; i++) { const x = 52 + i * (MINI ? 7 : 4.6); d += P([[x, 50], [x + 3, 61], [x + 1, 73]], MINI ? 1.4 : 1.1, { seed: 400 + i }); }
    d += P([[62, 54], [120, 52], [172, 58]], 1, { taper: 0.6 }) + P([[60, 65], [120, 65], [178, 64]], 1, { taper: 0.6 });
    let spots = "";
    const R = rng(44);
    const yTop = (x) => { for (let i = 1; i < top.length; i++) if (top[i][0] >= x) { const [a, b] = [top[i - 1], top[i]]; return a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]); } return 60; };
    const step = MINI ? 11 : 6.2;
    for (let x = 46; x < 182; x += step) {
      for (let y = yTop(x) + (MINI ? 5 : 3.6); y < 74 - (x - 46) * 0.06; y += MINI ? 9 : 5.2) {
        if (y > 51 && y < 56 && x > 62) continue;
        if (x > 76 && x < 106 && y > 74) continue;
        spots += `<circle cx="${r2(x + (R() - 0.5) * 1.6)}" cy="${r2(y + (R() - 0.5) * 1.4)}" r="${r2((MINI ? 1.5 : 0.95) + R() * 0.35)}"/>`;
      }
    }
    const eye = `<circle cx="37" cy="58" r="${MINI ? 1.8 : 1.3}"/>`;
    let extra = "";
    if (!MINI) {
      extra += P([[84, 92], [92, 94], [98, 92]], 1.1) + P([[112, 90], [120, 92], [126, 90]], 1.1);
      extra += stroke(ring(62, 26, 2, 10), { w: 0.9, closed: true }) + stroke(ring(67.5, 16, 1.5, 10), { w: 0.8, closed: true }) + stroke(ring(58.4, 34, 2.6, 10), { w: 1, closed: true });
    }
    return {
      w: 220, h: MINI ? 106 : 128, body: `${ink(d + extra)}<g fill="INK">${spots}${eye}</g>
      ${big(text("WHALE SHARK", { f: OSW6, size: 12, cx: 110, y: 116, track: 0.34 }))}
      ${big(text("RICHELIEU ROCK  ·  ANDAMAN SEA", { f: OSW5, size: 6.8, cx: 110, y: 127, track: 0.28 }))}` };
  },

  "cha-yen"() {
    const P = (pts, w, o = {}) => stroke(pts, { w, scale: SWM, ...o });
    const bag = [[71, 50], [54, 70], [42, 108], [43, 148], [56, 170], [80, 177], [104, 170], [117, 148], [118, 108], [106, 70], [89, 50]];
    const liquidTop = 86;
    const inside = smooth(bag).filter(([, y]) => y >= liquidTop - 0.5);
    const liquid = `M${inside.map(([x, y]) => `${r2(x)} ${r2(y)}`).join("L")}Z`;
    let d = "";
    d += P(bag, 2.4, { taper: 0.15 });
    d += P([[71, 50], [74, 43], [80, 40], [86, 43], [89, 50]], 2.2, { taper: 0.2 });
    d += P([[76, 41], [64, 26], [60, 14], [70, 10], [80, 26], [81, 40]], 1.5, { taper: 0.3 });
    d += P([[84, 41], [98, 24], [100, 12], [90, 10], [81, 26]], 1.5, { taper: 0.3 });
    const straw = P([[90, 132], [110, 2]], 5, { taper: 0.05, press: 0, wob: 0.05, seed: 480 });
    const strawGap = P([[90, 132], [110, 2]], 2.4, { taper: 0, press: 0, wob: 0.05, seed: 480 });
    let cubes = "";
    const cubeList = MINI ? [[64, 104, 14, -12], [84, 140, 13, 18]] : [[62, 102, 14, -12], [88, 110, 12, 14], [70, 134, 13, 22], [96, 146, 11, -8], [56, 152, 10, 6]];
    cubeList.forEach(([x, y, s, a], i) => {
      const c = Math.cos((a * Math.PI) / 180), sn = Math.sin((a * Math.PI) / 180);
      const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + (u * c - v * sn) * s / 2, y + (u * sn + v * c) * s / 2]);
      cubes += stroke(pts, { w: 1.3, closed: true, scale: SWM, seed: 500 + i });
    });
    let shine = MINI ? "" : P([[50, 112], [49, 132], [52, 150]], 1.2) + P([[56, 92], [52, 102]], 1.2);
    let drops = "";
    if (!MINI) [[126, 120], [130, 138], [34, 136], [124, 156]].forEach(([x, y]) => { drops += `M${x} ${y - 4}C${x + 2.4} ${y - 1} ${x + 2.4} ${y + 2.4} ${x} ${y + 2.4}C${x - 2.4} ${y + 2.4} ${x - 2.4} ${y - 1} ${x} ${y - 4}Z`; });
    const word = thaiText("ชาเย็น", { weight: 600, cx: 80, y: 204, fit: MINI ? 110 : 84 });
    return {
      w: 160, h: MINI ? 212 : 216, body: `
      <defs>${knock("cy-cubes", `<path d="${cubes}" fill="#000" stroke="#000" stroke-width="2.4"/>`)}${knock("cy-core", `<path d="${strawGap}" fill="#000"/>`)}</defs>
      <path d="${liquid}" fill="ACCENT" mask="url(#cy-cubes)"/>
      ${ink(d)}${ink(cubes)}${shine ? ink(shine) : ""}${drops ? `<path d="${drops}" fill="INK"/>` : ""}
      <path d="${straw}" fill="INK" mask="url(#cy-core)"/>
      ${word.markup}` };
  },

  "jai-yen-yen"() {
    const P = (pts, w, o = {}) => stroke(pts, { w, scale: SWM, ...o });
    let d = "";
    d += P([[30, 116], [33, 92], [38, 66], [46, 36]], 3, { taper: 0.25 }) + P([[172, 116], [168, 92], [164, 68], [158, 40]], 3, { taper: 0.25 });
    const fronds = (x, y, dir) => [
      [[x, y], [x - 14 * dir, y - 8], [x - 30 * dir, y - 2]], [[x, y], [x - 10 * dir, y - 16], [x - 22 * dir, y - 18]],
      [[x, y], [x + 2 * dir, y - 16], [x + 12 * dir, y - 24]], [[x, y], [x + 14 * dir, y - 10], [x + 28 * dir, y - 6]],
      [[x, y], [x + 12 * dir, y + 2], [x + 22 * dir, y + 14]], [[x, y], [x - 12 * dir, y + 2], [x - 20 * dir, y + 14]],
    ];
    fronds(46, 36, 1).concat(fronds(158, 40, -1)).forEach((f, i) => { d += P(f, 2, { taper: 0.9, seed: 600 + i }); });
    d += P([[36, 72], [54, 80], [70, 84]], 1.3) + P([[166, 74], [148, 82], [134, 86]], 1.3);
    d += P([[70, 84], [100, 106], [134, 86]], 2.4, { taper: 0.2 }) + P([[70, 84], [102, 98], [134, 86]], 1.6, { taper: 0.2 });
    if (!MINI) for (let i = 1; i < 8; i++) { const x = 70 + i * 8; const yLow = 84 + Math.sin((i / 8) * Math.PI) * 21, yHi = 84 + Math.sin((i / 8) * Math.PI) * 13; d += P([[x, yHi], [x + 1, yLow]], 0.8, { seed: 640 + i }); }
    d += P([[10, 117], [100, 115.5], [192, 117]], 1.8, { taper: 0.4 });
    if (!MINI) d += P([[24, 124], [60, 123]], 1.1) + P([[130, 124], [178, 123]], 1.1);
    const sun = MINI ? "" : stroke(ring(100, 42, 11), { w: 1.4, closed: true });
    const word = thaiText("ใจเย็นๆ", { weight: 600, cx: 100, y: MINI ? 168 : 160, fit: MINI ? 140 : 104 });
    return {
      w: 200, h: MINI ? 176 : 184, body: `${ink(d + sun)}${word.markup}
      ${big(text("JAI YEN YEN  ·  KEEP A COOL HEART", { f: OSW5, size: 8, y: 180, track: 0.3 }))}` };
  },

  "doi-luang-chiang-dao"() {
    const P = (pts, w, o = {}) => stroke(pts, { w, scale: SWM, ...o });
    let d = "";
    d += P([[8, 128], [28, 114], [44, 105], [56, 93], [66, 73], [74, 60], [80, 45], [86, 34], [92, 40], [98, 29], [104, 36], [112, 52], [120, 62], [130, 71], [140, 84], [152, 92], [166, 104], [180, 112], [194, 120]], 2.5, { taper: 0.4 });
    const ridges = MINI
      ? [[[86, 36], [80, 70], [72, 104]], [[98, 31], [106, 70], [118, 104]]]
      : [[[86, 36], [80, 70], [72, 104]], [[98, 31], [106, 70], [118, 104]], [[104, 38], [126, 84], [134, 108]], [[66, 74], [60, 96], [52, 112]], [[140, 86], [150, 106]], [[92, 42], [92, 62]]];
    ridges.forEach((r, i) => { d += P(r, 1.2, { taper: 0.7, seed: 700 + i }); });
    if (!MINI) {
      for (let i = 0; i < 9; i++) { const x = 108 + i * 3.6, y = 60 + i * 5.2; d += P([[x, y], [x - 3, y + 7]], 0.8, { seed: 720 + i }); }
      for (let i = 0; i < 6; i++) { const x = 76 - i * 3.4, y = 66 + i * 6; d += P([[x, y], [x + 2.6, y + 6]], 0.8, { seed: 740 + i }); }
    }
    let trees = "";
    const R = rng(77);
    for (let x = 16; x < 186; x += MINI ? 10 : 7.5 + R() * 2.5) {
      const y = 132 + R() * 3, h = (MINI ? 9 : 6) + R() * 4;
      const rr = h * 0.5;
      trees += P([[x - rr, y], [x - rr * 0.95, y - rr * 0.9], [x - rr * 0.4, y - rr * 1.55], [x + rr * 0.3, y - rr * 1.6], [x + rr * 0.9, y - rr * 1.0], [x + rr, y]], MINI ? 1.4 : 1.1, { taper: 0.4, seed: 760 + Math.round(x) });
    }
    const mist = MINI ? "" : P([[8, 98], [34, 97]], 1.3) + P([[170, 92], [194, 91.5]], 1.3) + P([[180, 99], [198, 98.5]], 1.1);
    const sun = MINI ? "" : stroke(ring(152, 46, 10), { w: 1.6, closed: true });
    return {
      w: 200, h: MINI ? 140 : 166, body: `${ink(d + trees + mist + sun)}
      ${big(text("DOI LUANG CHIANG DAO", { f: OSW6, size: 10, y: 152, track: 0.26 }))}
      ${big(text("CHIANG MAI  ·  THAILAND", { f: OSW5, size: 7.6, y: 164, track: 0.34 }))}` };
  },

  // ฝรั่ง: the word for foreigner, and also for guava.
  farang() {
    const cx = 100, cy = 60;
    const R = rng(31);
    let seeds = "";
    const nSeeds = MINI ? 10 : 16;
    for (let i = 0; i < nSeeds; i++) {
      const a = (i / nSeeds) * Math.PI * 2 + R() * 0.15, rr = 17 + R() * 2;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr, deg = (a * 180) / Math.PI + 90;
      const s = MINI ? 1.5 : 1;
      seeds += `<path d="M0 ${-3.6 * s}C${2.2 * s} ${-1.4 * s} ${2.2 * s} ${1.8 * s} 0 ${2.8 * s}C${-2.2 * s} ${1.8 * s} ${-2.2 * s} ${-1.4 * s} 0 ${-3.6 * s}Z" transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(deg)})" fill="INK"/>`;
    }
    const guava = `
      <g mask="url(#fr-hl)"><circle cx="${cx}" cy="${cy}" r="41" fill="INK"/></g>
      <circle cx="${cx}" cy="${cy}" r="35" fill="ACCENT"/>
      <circle cx="${cx}" cy="${cy}" r="11" fill="none" stroke="INK" stroke-width="${r2(1.4 * SWM)}"/>
      ${seeds}
      <path d="M${cx + 6} ${cy - 40}C${cx + 8} ${cy - 50} ${cx + 12} ${cy - 54} ${cx + 18} ${cy - 56}" ${S(2.4)}/>
      <g mask="url(#fr-vein)"><path d="M${cx + 16} ${cy - 55}C${cx + 30} ${cy - 72} ${cx + 52} ${cy - 70} ${cx + 62} ${cy - 60}C${cx + 50} ${cy - 46} ${cx + 30} ${cy - 44} ${cx + 16} ${cy - 55}Z" fill="INK"/></g>`;
    const word = thaiText("ฝรั่ง", { weight: 700, cx: 100, y: 168, fit: MINI ? 150 : 140 });
    const shadow = thaiText("ฝรั่ง", { weight: 700, cx: 102.4, y: 170.4, fit: MINI ? 150 : 140, fill: "ACCENT" });
    const def = big(`${text("FARANG  (N.)", { f: OSW7, size: 9, cx: 100, y: 186, track: 0.24 })}${text("1. A FOREIGNER     2. A GUAVA", { f: OSW5, size: 8, cx: 100, y: 198, track: 0.2 })}`);
    return {
      w: 200, h: MINI ? 176 : 202, body: `
      <defs>
        ${knock("fr-hl", `<path d="M${cx - 30} ${cy - 22}A37 37 0 0 1 ${cx - 6} ${cy - 37}" stroke="#000" stroke-width="${MINI ? 3 : 2}" fill="none" stroke-linecap="round"/>`)}
        ${knock("fr-vein", `<path d="M${cx + 20} ${cy - 55}C${cx + 34} ${cy - 60} ${cx + 48} ${cy - 61} ${cx + 58} ${cy - 59}" stroke="#000" stroke-width="${MINI ? 2.2 : 1.4}" fill="none" stroke-linecap="round"/>`)}
      </defs>
      <g transform="translate(100 54) scale(0.74) translate(-100 -60)">${guava}</g>
      ${shadow.markup}${word.markup}${def}` };
  },

  "soi-dog"() {
    const dog = `
      <path d="M22 84C14 56 36 30 66 30C94 30 112 48 110 70" ${S(3.4)}/>
      <path d="M86 86C84 70 96 62 108 66C120 70 124 80 118 86" ${S(3.4)}/>
      <path d="M118 86C124 88 128 86 129 82" ${S(3)}/>
      <path d="M98 66L104 52L112 68" fill="INK" stroke="INK" stroke-width="2" stroke-linejoin="round"/>
      <path d="M104 77Q108 80 112 77" ${S(2.4)}/>
      <path d="M22 84C10 86 6 74 12 68C17 63 26 66 25 73" ${S(3.4)}/>
      <path d="M44 86C40 76 48 68 58 70" ${S(2.6)}/>
      <path d="M8 90H134" ${S(3)}/>
      <path d="M116 44H124L116 52H124M128 30H134L128 36H134" ${S(2.2, "ACCENT")}/>`;
    return { w: 140, h: 120, body: `${dog}${text("SOI DOG", { f: OSW6, size: 18, cx: 70, y: 116, track: 0.24 })}` };
  },
};

// Full SVG for one design in one ink pair, sized in cm for print.
export function svgFor(id, { ink, accent, widthCm, mini = false }) {
  MINI = mini; SWM = mini ? 1.7 : 1;
  const art = designs[id]();
  MINI = false; SWM = 1;
  const hCm = Math.round((art.h / art.w) * widthCm * 100) / 100;
  const body = art.body.replaceAll('"INK"', `"${ink}"`).replaceAll('"ACCENT"', `"${accent}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthCm}cm" height="${hCm}cm" viewBox="0 0 ${art.w} ${art.h}">${body}
</svg>
`;
}
