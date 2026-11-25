// A pen for line drawings that look drawn rather than plotted.
// Strokes are smoothed (Catmull-Rom), get a slight seeded wobble, and are
// output as filled outlines whose width swells and tapers like a real nib.

const r2 = (n) => Math.round(n * 100) / 100;

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Smooth a polyline into evenly spaced samples.
export function smooth(pts, { closed = false, step = 0.8 } = {}) {
  if (pts.length < 2) return pts;
  const P = closed ? [pts.at(-1), ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts.at(-1)];
  const out = [];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const n = Math.max(2, Math.ceil(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(closed ? out[0] : pts.at(-1));
  return out;
}

// Low-frequency wobble along the stroke, like a steady hand.
function wobble(pts, amt, seed) {
  if (!amt) return pts;
  const R = rng(seed), ph = [R() * 6, R() * 6], f = [0.11 + R() * 0.05, 0.27 + R() * 0.1];
  let s = 0;
  return pts.map((p, i) => {
    if (i) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const d = amt * (0.7 * Math.sin(s * f[0] + ph[0]) + 0.3 * Math.sin(s * f[1] + ph[1]));
    const q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
    const dx = q[0] - o[0], dy = q[1] - o[1], L = Math.hypot(dx, dy) || 1;
    return [p[0] - (dy / L) * d, p[1] + (dx / L) * d];
  });
}

let seedN = 1;
// Stroke a polyline: returns a filled outline path. w = nominal width.
// taper: how much the ends thin (0 none, 1 to a point). press: width swing.
export function stroke(pts, { w = 2, closed = false, taper = 0.75, press = 0.22, wob = 0.35, seed, scale = 1 } = {}) {
  const sd = seed ?? seedN++;
  let s = smooth(pts, { closed });
  s = wobble(s, wob, sd);
  const R = rng(sd + 77), ph = R() * 6;
  const n = s.length;
  let total = 0; const acc = [0];
  for (let i = 1; i < n; i++) { total += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); acc.push(total); }
  const L = [], Rt = [];
  for (let i = 0; i < n; i++) {
    const t = total ? acc[i] / total : 0;
    const end = closed ? 1 : Math.min(1, Math.min(acc[i], total - acc[i]) / Math.max(3, w * 3.2));
    const tap = closed ? 1 : 1 - taper * (1 - Math.sin((end * Math.PI) / 2));
    const width = w * scale * tap * (1 + press * Math.sin(t * Math.PI * 2.3 + ph));
    const q = s[Math.min(i + 1, n - 1)], o = s[Math.max(i - 1, 0)];
    const dx = q[0] - o[0], dy = q[1] - o[1], D = Math.hypot(dx, dy) || 1;
    const nx = -dy / D, ny = dx / D, h = Math.max(width, 0.25) / 2;
    L.push([s[i][0] + nx * h, s[i][1] + ny * h]);
    Rt.push([s[i][0] - nx * h, s[i][1] - ny * h]);
  }
  const fmt = (a) => a.map(([x, y]) => `${r2(x)} ${r2(y)}`).join("L");
  if (closed) return `M${fmt(L)}ZM${fmt(Rt.reverse())}Z`;
  // round-ish caps
  return `M${fmt(L)}L${fmt(Rt.reverse())}Z`;
}

// Several strokes into one filled path element.
export const ink = (d, fill = "INK") => `<path d="${d}" fill="${fill}" fill-rule="nonzero"/>`;
