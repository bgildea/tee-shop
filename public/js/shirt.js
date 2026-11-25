// Flat-lay T-shirt mockups in SVG, shared by the storefront and the print build.
// Scale: 10 units per cm. The shirt is a size M (51 cm chest, 73 cm long).
// Front prints sit centred 8 cm below the collar; chest prints sit on the
// wearer's left (the viewer's right).

export const UNITS_PER_CM = 10;
export const FRAME = { w: 1000, h: 1000 };

const NECK_TOP = 128, NECK_DROP = 196;

function mix(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return "#" + ((1 << 24) | (ch(n >> 16) << 16) | (ch((n >> 8) & 255) << 8) | ch(n & 255)).toString(16).slice(1);
}
const isLight = (hex) => parseInt(hex.slice(1, 3), 16) > 140;

export function printBox(placement, widthCm, aspect) {
  const w = widthCm * UNITS_PER_CM;
  if (placement === "chest") return { x: 500 + 95 - w / 2, y: NECK_DROP + 70, w, h: w * aspect };
  return { x: 500 - w / 2, y: NECK_DROP + 80, w, h: w * aspect };
}

// print: { svg, widthCm, placement }. view: "flat" (whole shirt) or "close" (print close-up)
export function shirtSVG({ fabric, print, uid = "s", view = "flat", backdrop = "#E9E6DF", title = "" }) {
  const light = isLight(fabric);
  const body = `M408 ${NECK_TOP}C430 ${NECK_DROP + 4} 570 ${NECK_DROP + 4} 592 ${NECK_TOP}L742 172L906 330L820 424L750 368C752 520 748 700 756 862C620 872 380 872 244 862C252 700 248 520 250 368L180 424L94 330L258 172Z`;
  const backNeck = `M408 ${NECK_TOP}C440 ${NECK_TOP - 18} 560 ${NECK_TOP - 18} 592 ${NECK_TOP}C570 ${NECK_DROP - 10} 430 ${NECK_DROP - 10} 408 ${NECK_TOP}Z`;
  const rib = `M408 ${NECK_TOP}C430 ${NECK_DROP + 4} 570 ${NECK_DROP + 4} 592 ${NECK_TOP}`;
  const ribInner = `M424 ${NECK_TOP + 4}C446 ${NECK_DROP - 18} 554 ${NECK_DROP - 18} 576 ${NECK_TOP + 4}`;
  const seam = mix(fabric, light ? -0.08 : 0.08);

  let printMarkup = "", box = null;
  if (print) {
    const vb = print.svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    box = printBox(print.placement, print.widthCm, vb[3] / vb[2]);
    const inner = print.svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
      .replace(/id="clip-/g, `id="clip-${uid}-`).replace(/url\(#clip-/g, `url(#clip-${uid}-`);
    printMarkup = `<svg x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" viewBox="${vb.join(" ")}" overflow="visible"><g opacity="${light ? 0.94 : 0.92}">${inner}</g></svg>`;
  }

  let viewBox = "70 80 860 860";
  if (view === "close" && box) {
    const size = Math.max(box.w, box.h) * 1.7;
    viewBox = `${box.x + box.w / 2 - size / 2} ${box.y + box.h / 2 - size / 2} ${size} ${size}`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" role="img"${title ? ` aria-label="${title}"` : ""}>
  <defs>
    <filter id="sh-${uid}" x="-10%" y="-10%" width="120%" height="125%"><feGaussianBlur in="SourceAlpha" stdDeviation="14"/><feOffset dy="16"/><feComponentTransfer><feFuncA type="linear" slope="${light ? 0.22 : 0.35}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft-${uid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="knit-${uid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 ${light ? 0 : 1}  0 0 0 0 ${light ? 0 : 1}  0 0 0 0 ${light ? 0 : 1}  0 0 0 ${light ? 0.07 : 0.06} 0"/></filter>
    <clipPath id="body-${uid}"><path d="${body}"/></clipPath>
    <linearGradient id="lit-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${light ? 0.05 : 0.07}"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${light ? 0.08 : 0.2}"/></linearGradient>
  </defs>
  <rect x="-500" y="-500" width="2000" height="2000" fill="${backdrop}"/>
  <path d="${backNeck}" fill="${mix(fabric, light ? -0.12 : -0.3)}"/>
  <g filter="url(#sh-${uid})"><path d="${body}" fill="${fabric}"/></g>
  <g clip-path="url(#body-${uid})">
    <path d="M300 420C340 520 320 640 360 760M690 380C650 470 700 600 650 740M420 820C480 790 560 800 620 830M200 380C230 360 250 340 262 300M800 380C770 360 750 340 738 300" stroke="#000" stroke-opacity="${light ? 0.07 : 0.22}" stroke-width="26" fill="none" filter="url(#soft-${uid})"/>
    <path d="M330 300C380 380 360 480 400 560M640 260C610 360 640 460 610 560" stroke="#fff" stroke-opacity="${light ? 0.35 : 0.05}" stroke-width="30" fill="none" filter="url(#soft-${uid})"/>
    ${printMarkup}
    <rect x="0" y="0" width="1000" height="1000" fill="url(#lit-${uid})"/>
    <rect x="0" y="0" width="1000" height="1000" filter="url(#knit-${uid})"/>
    <path d="M258 172L250 368M742 172L750 368" stroke="${seam}" stroke-width="3" fill="none"/>
    <path d="M190 412L262 345M810 412L738 345" stroke="${seam}" stroke-width="3" fill="none" opacity=".8"/>
    <path d="M250 842C380 852 620 852 750 842" stroke="${seam}" stroke-width="3" fill="none"/>
  </g>
  <path d="${rib}" fill="none" stroke="${mix(fabric, light ? -0.05 : 0.06)}" stroke-width="22"/>
  <path d="${ribInner}" fill="none" stroke="${mix(fabric, light ? -0.18 : -0.35)}" stroke-width="2.5" opacity=".6"/>
</svg>`;
}
