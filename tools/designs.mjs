// Artwork for every design. Each design is drawn in a box about 200 units
// wide and returns { w, h, body }. body uses the placeholders INK and ACCENT,
// which the build swaps for each shirt's ink colours. All text is converted to
// outlines with opentype.js so print files never depend on installed fonts.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import opentype from "opentype.js";

const require = createRequire(import.meta.url);
const font = (pkg, file) => {
  const dir = path.dirname(require.resolve(`@fontsource/${pkg}/package.json`)) + "/files";
  const buf = fs.readFileSync(path.join(dir, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const OSWALD = font("oswald", "oswald-latin-600-normal.woff");
const OSWALD_M = font("oswald", "oswald-latin-500-normal.woff");
const KANIT = font("kanit", "kanit-thai-600-normal.woff");

const r3 = (n) => Math.round(n * 100) / 100;

// Straight text centred on cx with its baseline at y.
function text(str, { f = OSWALD, size, cx = 100, y, track = 0, fill = "INK" }) {
  const w = f.getAdvanceWidth(str, size, { letterSpacing: track }) - track * size;
  const p = f.getPath(str, cx - w / 2, y, size, { letterSpacing: track });
  return `<path d="${p.toPathData(2)}" fill="${fill}"/>`;
}

// Text on a circle. "top" runs over the top, "bottom" runs left to right
// along the bottom with the letters pointing inwards.
function arcText(str, { f = OSWALD, size, r, cx = 100, cy = 100, side = "top", track = 0.08, fill = "INK" }) {
  const chars = [...str];
  const adv = chars.map((c) => f.getAdvanceWidth(c, size) + track * size);
  const total = adv.reduce((a, b) => a + b, 0) - track * size;
  const dir = side === "top" ? 1 : -1;
  const start = side === "top" ? -Math.PI / 2 - total / r / 2 : Math.PI / 2 + total / r / 2;
  let cursor = 0, out = "";
  chars.forEach((c, i) => {
    const w = adv[i] - track * size;
    const a = start + (dir * (cursor + w / 2)) / r;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    const rot = ((side === "top" ? a + Math.PI / 2 : a - Math.PI / 2) * 180) / Math.PI;
    const d = f.getPath(c, -w / 2, 0, size).toPathData(2);
    if (d) out += `<path d="${d}" transform="translate(${r3(x)} ${r3(y)}) rotate(${r3(rot)})" fill="${fill}"/>`;
    cursor += adv[i];
  });
  return out;
}

const S = (w = 2.6) => `fill="none" stroke="INK" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const SA = (w = 2.6) => `fill="none" stroke="ACCENT" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

function wave(x0, x1, y, amp = 2.2, len = 12) {
  let d = `M${x0} ${y}`;
  for (let x = x0, up = true; x < x1 - 0.1; x += len, up = !up) {
    const nx = Math.min(x + len, x1);
    d += `Q${r3((x + nx) / 2)} ${r3(y + (up ? -amp : amp))} ${r3(nx)} ${y}`;
  }
  return d;
}
const hatch = (d, w = 1.5) => `<path d="${d}" ${S(w)}/>`;
const star = (x, y, s = 3) => `<path d="M${x} ${y - s}L${x + s * 0.3} ${y - s * 0.3}L${x + s} ${y}L${x + s * 0.3} ${y + s * 0.3}L${x} ${y + s}L${x - s * 0.3} ${y + s * 0.3}L${x - s} ${y}L${x - s * 0.3} ${y - s * 0.3}Z" fill="INK"/>`;

// Round badge: outer ring, inner ring, clipped scene, text top and bottom.
function badge(id, { top, bottom, scene, topSize = 17, bottomSize = 11.5 }) {
  return `
  <defs><clipPath id="clip-${id}"><circle cx="100" cy="100" r="70"/></clipPath></defs>
  <circle cx="100" cy="100" r="97" ${S(3.2)}/>
  <circle cx="100" cy="100" r="71.5" ${S(2.6)}/>
  <g clip-path="url(#clip-${id})">${scene}</g>
  ${arcText(top, { size: topSize, r: 78.5, side: "top", track: 0.1 })}
  ${arcText(bottom, { f: OSWALD_M, size: bottomSize, r: 82, side: "bottom", track: 0.16 })}
  ${star(16.5, 100, 3.4)}${star(183.5, 100, 3.4)}`;
}

const pine = (x, y) => `<path d="M${x} ${y - 20}L${x - 7} ${y - 6}H${x - 3.5}L${x - 9} ${y + 2}H${x + 9}L${x + 3.5} ${y - 6}H${x + 7}Z" fill="INK"/>`;

export const designs = {
  "doi-inthanon"() {
    const scene = `
      <circle cx="128" cy="76" r="17" fill="ACCENT"/>
      <path d="M20 122L48 92L60 102L86 70L104 90L116 80L134 98L150 84L184 118" ${S()}/>
      ${hatch("M86 70L80 92M92 77L88 96M98 83L95 98M150 84L146 98M156 90L153 102M164 98L161 108M116 80L112 92M60 102L57 110")}
      <path d="M18 150C44 128 70 138 96 126C118 116 146 124 184 136V190H18Z" fill="INK"/>
      ${[[40, 136], [52, 130], [64, 132], [150, 126], [162, 130]].map(([x, y]) => pine(x, y)).join("")}
      <path d="M40 58H62M48 64H74M146 52H164" ${S(1.8)}/>`;
    return { w: 200, h: 200, body: badge("doi", { top: "DOI INTHANON", bottom: "CHIANG MAI  ·  2,565 M", scene }) };
  },

  railay() {
    const scene = `
      <circle cx="58" cy="60" r="10" fill="ACCENT"/>
      <path d="M22 138C20 112 24 94 34 84C42 76 52 80 54 94C57 112 54 128 57 138" ${S()}/>
      <path d="M70 138C66 98 74 62 98 52C116 45 130 64 130 92C130 114 134 128 137 138" ${S()}/>
      <path d="M140 138C138 116 142 100 152 94C162 89 172 98 172 114C172 124 176 132 178 138" ${S()}/>
      ${hatch("M80 74V120M88 64V128M96 58V112M104 56V96M112 60V124M120 70V104M30 96V128M38 88V118M46 90V130M150 102V128M158 98V120M166 104V132")}
      <path d="M90 54C92 60 96 60 98 55M106 50C108 57 113 56 114 52M40 80C41 86 46 86 47 81M156 92C157 97 161 98 163 93" ${S(1.6)}/>
      <path d="${wave(18, 184, 146, 2, 11)}" ${S(2)}/>
      <path d="${wave(30, 172, 156, 2, 11)}" ${S(2)}/>
      <path d="${wave(44, 160, 166, 2, 11)}" ${S(2)}/>
      <path d="M100 148C112 154 132 154 150 147L158 136C152 141 146 143 140 144H104Z" fill="INK"/>
      <path d="M158 136L162 128M102 145L94 156" ${S(1.8)}/>`;
    return { w: 200, h: 200, body: badge("railay", { top: "RAILAY BEACH", bottom: "KRABI  ·  ANDAMAN SEA", scene }) };
  },

  "khao-yai-hornbill"() {
    const scene = `
      <path d="M18 150C52 140 96 148 132 140C152 136 170 138 186 132" ${S(3)}/>
      <path d="M150 138C156 128 160 122 168 118M60 146C56 138 50 134 42 132" ${S(2)}/>
      <path d="M58 116C62 98 76 86 94 86C104 86 110 92 112 100C114 116 104 136 84 142C70 146 56 132 58 116Z" fill="INK"/>
      <path d="M66 136L54 182H70L80 140" fill="INK"/>
      <path d="M57 170H69M58 162H70" stroke="ACCENT" stroke-width="2.4"/>
      <path d="M72 112C80 106 92 106 100 112" stroke="ACCENT" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="112" cy="78" r="13" fill="INK"/>
      <path d="M120 76C136 74 152 84 166 102C150 96 136 92 122 90ZM116 66C126 58 144 60 154 72C144 68 130 68 120 72Z" fill="ACCENT" stroke="INK" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M96 140L94 150M104 138L106 149" ${S(2.2)}/>
      <circle cx="140" cy="44" r="2" fill="INK"/><circle cx="56" cy="56" r="2" fill="INK"/><circle cx="164" cy="64" r="1.6" fill="INK"/>`;
    return { w: 200, h: 200, body: badge("hornbill", { top: "KHAO YAI", bottom: "NATIONAL PARK  ·  EST. 1962", scene, topSize: 19 }) };
  },

  "similan-turtle"() {
    const shell = "M100 56C122 56 136 76 136 100C136 126 122 144 100 144C78 144 64 126 64 100C64 76 78 56 100 56Z";
    const rays = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      return `M${r3(100 + Math.cos(a) * 54)} ${r3(100 + Math.sin(a) * 54)}L${r3(100 + Math.cos(a) * 64)} ${r3(100 + Math.sin(a) * 64)}`;
    }).join("");
    const scene = `
      <path d="${rays}" ${SA(2.2)}/>
      <path d="M66 82C50 70 38 66 30 72C40 80 52 88 66 92Z M134 82C150 70 162 66 170 72C160 80 148 88 134 92Z M72 130C62 140 58 150 62 156C70 150 78 142 82 136Z M128 130C138 140 142 150 138 156C130 150 122 142 118 136Z" fill="INK"/>
      <path d="M90 56C88 44 92 36 100 34C108 36 112 44 110 56Z" fill="INK"/>
      <path d="${shell}" fill="INK"/>
      <path d="M100 70L112 80V96L100 104L88 96V80Z M88 96L76 104M112 96L124 104M100 104V124M88 80L76 74M112 80L124 74M76 104L80 122L100 124L120 122L124 104" fill="none" stroke="ACCENT" stroke-width="2" stroke-linejoin="round"/>`;
    return { w: 200, h: 200, body: badge("turtle", { top: "SIMILAN ISLANDS", bottom: "PHANG NGA  ·  THAILAND", scene, topSize: 15.5 }) };
  },

  "lumpini-lizard"() {
    const lizard = `
      <path d="M12 166C26 176 46 176 62 168C72 162 80 156 92 154" ${S(3.4)}/>
      <path d="M90 150C102 138 132 134 150 140C160 143 166 146 176 142C184 139 192 140 196 146C192 152 182 154 172 153C162 152 156 158 146 160C128 164 104 164 90 158Z" fill="INK"/>
      <path d="M196 146L204 144M204 144L208 140M204 144L208 148" ${SA(2)}/>
      <circle cx="184" cy="143.5" r="1.8" fill="ACCENT"/>
      <path d="M104 160L96 176L86 178M112 160L118 176L128 178M146 158L140 174L130 176M152 156L160 172L170 174" ${S(3)}/>
      ${[[108, 147], [122, 144], [136, 146], [116, 154], [130, 154]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="none" stroke="ACCENT" stroke-width="1.6"/>`).join("")}
      <path d="M8 182H210" ${S(2.2)}/>
      <path d="M30 182C30 176 32 172 36 170M44 182C44 177 46 174 49 172M176 182C176 176 178 173 182 171M190 182C190 178 192 175 195 174" ${S(1.6)}/>
      <path d="M40 90C46 70 66 62 80 70C88 58 108 56 116 72C130 70 140 82 134 94Z" fill="INK"/>
      <path d="M86 94V126M84 106L74 100M88 112L98 104" ${S(3)}/>`;
    const title = arcText("LUMPINI PARK", { size: 25, r: 150, cx: 108, cy: 196, side: "top", track: 0.12 });
    const sub = text("BANGKOK  ·  LIZARD SPOTTERS CLUB", { f: OSWALD_M, size: 9.5, cx: 108, y: 202, track: 0.18 });
    return { w: 216, h: 206, body: `${title}${lizard}${sub}` };
  },

  "bangkok-skyline"() {
    const g = 126;
    const blocks = [[8, 104, 16], [26, 96, 12], [124, 92, 14], [140, 86, 12], [178, 100, 14], [194, 108, 12]]
      .map(([x, top, w]) => `<path d="M${x} ${g}V${top}H${x + w}V${g}" ${S(2)}/>`).join("");
    const windows = "M12 108V120M16 108V120M20 108V120M30 100V120M34 100V120M128 96V120M132 96V120M144 90V120M148 90V120M182 104V120M186 104V120M198 112V120";
    const prang = `<path d="M44 ${g}V112H52V100H56V86H60V70H63V54L65 40L67 54V70H70V86H74V100H78V112H86V${g}" ${S(2.2)}/><path d="M52 112H78M56 100H74M60 86H70" ${S(1.4)}/>`;
    const tower = `<path d="M94 ${g}V28H112V${g}" ${S(2.2)}/><path d="M100 40H106V46H112M94 58H100V66H106V72H112M100 84H106V92H112M94 104H100V110" fill="none" stroke="ACCENT" stroke-width="2.2" stroke-linejoin="round"/>`;
    const tall = `<path d="M156 ${g}V50H170V${g}M163 50V30M159 50V44H167V50" ${S(2.2)}/>`;
    const sun = `<circle cx="138" cy="46" r="12" fill="ACCENT"/>`;
    const river = `<path d="${wave(6, 206, 136, 2, 12)}" ${S(2)}/><path d="${wave(22, 190, 145, 2, 12)}" ${S(2)}/>`;
    const boat = `<path d="M150 131H186L182 137H154Z" fill="INK"/>`;
    const thai = text("กรุงเทพฯ", { f: KANIT, size: 30, cx: 106, y: 184 });
    const en = text("BANGKOK  ·  CITY OF ANGELS", { f: OSWALD_M, size: 10, cx: 106, y: 202, track: 0.2 });
    return { w: 212, h: 206, body: `${sun}${blocks}<path d="${windows}" ${S(1.2)}/>${prang}${tower}${tall}<path d="M4 ${g}H208" ${S(2.4)}/>${river}${boat}${thai}${en}` };
  },

  longtail() {
    const hull = `<path d="M30 124C56 136 116 140 160 130C170 128 178 120 184 104L180 102C176 112 168 118 156 120C116 126 64 124 30 118Z" fill="INK"/>`;
    const prow = `<path d="M182 103L186 82" ${S(2.4)}/>`;
    const garlands = `<path d="M186 84C192 88 194 94 192 100M185 88C189 94 189 100 186 106M184 84C190 80 196 82 198 86" ${SA(2.2)}/>`;
    const engine = `<path d="M40 118L34 104H48L50 116M41 110L8 140M8 140L4 146M8 140L12 146" ${S(2.4)}/>`;
    const canopy = `<path d="M70 120V96M128 120V96M64 96C80 90 118 90 134 96" ${S(2.2)}/>`;
    const sea = `<path d="${wave(4, 200, 146, 2.2, 13)}" ${S(2)}/><path d="${wave(20, 186, 156, 2.2, 13)}" ${S(2)}/><path d="${wave(40, 166, 166, 2.2, 13)}" ${S(2)}/>`;
    const sun = `<circle cx="150" cy="60" r="16" fill="ACCENT"/>`;
    const birds = `<path d="M60 50Q66 44 72 50Q78 44 84 50M86 62Q90 58 94 62Q98 58 102 62" ${S(1.8)}/>`;
    const title = text("ANDAMAN", { size: 30, cx: 102, y: 196, track: 0.32 });
    return { w: 204, h: 200, body: `${sun}${birds}${canopy}${hull}${prow}${garlands}${engine}${sea}${title}` };
  },

  "soi-dog"() {
    // Small chest print: a soi dog asleep on the pavement.
    const dog = `
      <path d="M22 84C14 56 36 30 66 30C94 30 112 48 110 70" ${S(3.4)}/>
      <path d="M86 86C84 70 96 62 108 66C120 70 124 80 118 86" ${S(3.4)}/>
      <path d="M118 86C124 88 128 86 129 82" ${S(3)}/>
      <path d="M98 66L104 52L112 68" fill="INK" stroke="INK" stroke-width="2" stroke-linejoin="round"/>
      <path d="M104 77Q108 80 112 77" ${S(2.4)}/>
      <path d="M22 84C10 86 6 74 12 68C17 63 26 66 25 73" ${S(3.4)}/>
      <path d="M44 86C40 76 48 68 58 70" ${S(2.6)}/>
      <path d="M8 90H134" ${S(3)}/>
      <path d="M116 44H124L116 52H124M128 30H134L128 36H134" ${SA(2.2)}/>`;
    const title = text("SOI DOG", { size: 18, cx: 70, y: 116, track: 0.24 });
    return { w: 140, h: 120, body: `${dog}${title}` };
  },
};

// Full SVG for one design in one ink pair, sized in cm for print.
export function svgFor(id, { ink, accent, widthCm }) {
  const art = designs[id]();
  const hCm = Math.round((art.h / art.w) * widthCm * 100) / 100;
  const body = art.body.replaceAll("INK", ink).replaceAll("ACCENT", accent);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthCm}cm" height="${hCm}cm" viewBox="0 0 ${art.w} ${art.h}">${body}
</svg>
`;
}
