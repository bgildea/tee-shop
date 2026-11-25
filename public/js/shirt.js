// Draws a front chest crop of a T-shirt with a print on the wearer's left
// chest (the viewer's right). Shared by the storefront and tools/render-proofs.mjs.
// Scale: 48 px per cm. Full frame is 1800 x 1350 (40 x 28 cm of shirt).

export const PX_PER_CM = 48;
export const FRAME = { w: 1800, h: 1350 };
const CX = 900;          // centre front
const NECK_BOTTOM = 430; // lowest point of the neck opening
const PRINT_CENTRE_FROM_MIDDLE_CM = 9.5;
const PRINT_TOP = 790;

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.max(0, Math.min(255, Math.round(v + amt * (amt < 0 ? v : 255 - v))));
  const rr = ch(n >> 16), gg = ch((n >> 8) & 255), bb = ch(n & 255);
  return "#" + ((1 << 24) | (rr << 16) | (gg << 8) | bb).toString(16).slice(1);
}

export function printBox(widthCm, aspect) {
  const w = widthCm * PX_PER_CM;
  return { x: CX + PRINT_CENTRE_FROM_MIDDLE_CM * PX_PER_CM - w / 2, y: PRINT_TOP, w, h: w * aspect };
}

// print: { svg: full SVG string, widthCm }
// opts.viewBox crops the frame; opts.annotate draws the print width mark.
export function shirtSVG({ fabric, print, uid = "s", viewBox, annotate = false, title = "", cmLabel = "cm" }) {
  const curve = `C560 250 700 ${NECK_BOTTOM} ${CX} ${NECK_BOTTOM}C1100 ${NECK_BOTTOM} 1240 250 1332 40`;
  const neck = `M468 40${curve}`;
  const rib = `M468 60C562 292 702 ${NECK_BOTTOM + 52} ${CX} ${NECK_BOTTOM + 52}C1098 ${NECK_BOTTOM + 52} 1238 292 1332 60`;
  const stitch = `M486 70C578 318 712 ${NECK_BOTTOM + 112} ${CX} ${NECK_BOTTOM + 112}C1088 ${NECK_BOTTOM + 112} 1222 318 1314 70`;
  const isLight = parseInt(fabric.slice(1, 3), 16) > 128;
  const dark = isLight ? -0.05 : 0.05;

  let printMarkup = "";
  let box = null;
  if (print) {
    const vb = print.svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    box = printBox(print.widthCm, vb[3] / vb[2]);
    const inner = print.svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    printMarkup = `<svg x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" viewBox="${vb.join(" ")}" overflow="visible"><g opacity=".95">${inner}</g></svg>`;
  }

  let notes = "";
  if (annotate && box) {
    const y = box.y + box.h + 70;
    const lineCol = isLight ? "#1F2A44" : "#F3F1EA";
    notes = `
    <g class="notes" stroke="${lineCol}" fill="none" stroke-width="3" opacity=".75">
      <path d="M${box.x} ${y}H${box.x + box.w}M${box.x} ${y - 22}V${y + 22}M${box.x + box.w} ${y - 22}V${y + 22}"/>
    </g>
    <g fill="${lineCol}" font-family="Bai Jamjuree, sans-serif" font-size="40" font-weight="500">
      <text x="${box.x + box.w / 2}" y="${y + 70}" text-anchor="middle">${print.widthCm} ${cmLabel}</text>
    </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox || `0 0 ${FRAME.w} ${FRAME.h}`}" preserveAspectRatio="xMidYMid slice" role="img"${title ? ` aria-label="${title}"` : ""}>
  <defs>
    <filter id="weave-${uid}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 ${isLight ? 0 : 1}  0 0 0 0 ${isLight ? 0 : 1}  0 0 0 0 ${isLight ? 0 : 1}  0 0 0 ${isLight ? 0.09 : 0.06} 0"/>
    </filter>
    <radialGradient id="light-${uid}" cx="58%" cy="55%" r="75%">
      <stop offset="0" stop-color="#fff" stop-opacity="${isLight ? 0 : 0.05}"/>
      <stop offset="1" stop-color="#000" stop-opacity="${isLight ? 0.1 : 0.28}"/>
    </radialGradient>
  </defs>
  <rect width="${FRAME.w}" height="${FRAME.h}" fill="#DADCD7"/>
  <path d="${neck}C1180 -10 620 -10 468 40Z" fill="${shade(fabric, isLight ? -0.16 : -0.35)}"/>
  <path d="M-10 260L468 40${curve}L1810 260V1360H-10Z" fill="${fabric}"/>
  <path d="${rib}" fill="none" stroke="${shade(fabric, dark)}" stroke-width="104"/>
  <path d="${neck}" fill="none" stroke="${shade(fabric, isLight ? -0.2 : -0.4)}" stroke-width="4"/>
  <path d="${stitch}" fill="none" stroke="${shade(fabric, isLight ? -0.22 : 0.25)}" stroke-width="3" stroke-dasharray="10 8"/>
  ${printMarkup}
  <rect width="${FRAME.w}" height="${FRAME.h}" fill="url(#light-${uid})"/>
  <rect width="${FRAME.w}" height="${FRAME.h}" filter="url(#weave-${uid})"/>
  ${notes}
</svg>`;
}
