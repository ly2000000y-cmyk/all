// cuihua_lib.js: the cast, props and sets for the 《翠花》 MV. Everything paints with the kit's paint()/inkLine().
// Characters are Clawd-shaped blocks so they stay on model with Clawd; each gets its own colour, hair and accessories.

const HAIR = '#33262F', RIBBON = '#D8394E', MELON = '#4E8B3A', MELON_DK = '#2D5A2B', FLESH = '#E8505B', RIND = '#CFE3A1';
const CH = { col: '#EE97A8', dk: '#C0607A', lt: '#FAC6CF' };   // 翠花
const RV = { col: '#6D70B2', dk: '#474A86', lt: '#A3A6DA' };   // the rival

// emotions() with a character's own colours in every key, so the cross-fades between moods stay in their colours
const emoAs = (base, t, keys, o) => emotions(t, keys.map(k => [k[0], k[1], { ...base, ...(k[2] || {}) }]), o);
const feelAs = (base, name, t, over = {}) => feel(name, t, { ...base, ...over });

// ---------- 翠花 ----------
// o.city: back from the city (no braids, curly bob, sun hat, sunglasses, handbag). o.flower (default true) the red
// flower. o.ghost: a pale memory (washed-out colours). o.braidSway: extra swing for the braids (follow-through).
function cuihua(x, y, u, o = {}) {
  const base = o.ghost ? { col: '#F4D9DE', dk: '#E2B6C0', lt: '#FBEDEF' } : CH;
  const opts = { ...base, ...o, hat: null, blush: Math.max(o.blush || 0, o.city ? .15 : .35) };
  if (o.city && !o.shadesOff) opts.eyes = 'shades';   // shadesOff: she lifts them onto the hat brim
  const aL = opts.aL ?? .2;
  if (o.city && o.bag !== false && !opts.armL) opts.armL = (u, sw) => { push(); rotate(aL); handbag(0, 0, u, sw); pop(); };
  const userDraw = o.draw;
  opts.draw = (u, sw) => { cuihuaHair(u, sw, opts); if (userDraw) userDraw(u, sw); };
  clawd(x, y, u, opts);
}
function cuihuaHair(u, sw, o) {
  const v = o.view || 'front', V = VIEWS[v] || VIEWS.front, L = V.L * u, R = V.R * u, back = v === 'back' || v === 'qback';
  const hair = o.ghost ? '#B9A7B4' : HAIR, rib = o.ghost ? '#F0B4BE' : RIBBON;
  const bp = bpOf(T), sway = (o.braidSway || 0) + .16 * Math.sin(bp * Math.PI + .7) - (o.rot || 0) * 1.5;
  if (!o.city) {   // two braids, plaited, with red ties
    const sides = v === 'side' ? [L] : [L, R];
    for (const ex of sides) {
      const s = ex < 0 ? -1 : 1, sw2 = s * sway;
      const P = [[ex - s * .25 * u, -7.5 * u], [ex + s * .55 * u + sw2 * .5 * u, -5.7 * u], [ex + s * .75 * u + sw2 * 1.4 * u, -3.9 * u], [ex + s * .7 * u + sw2 * 2 * u, -3.0 * u]];
      paint(ribbon(P, 1.05 * u, .55 * u), { wash: hair, ink: PAL.ink, sw: sw * .55 });
      const C = through(P);
      for (let i = 2; i < C.length - 3; i += 3) {   // plait marks
        const [cx, cy] = C[i]; inkLine([[cx - .38 * u, cy - .18 * u], [cx + .05 * u, cy + .22 * u], [cx + .38 * u, cy - .14 * u]], sw * .32, mixCol(hair, PAL.cream, .35), 'inkfine', .5);
      }
      const [tx, ty] = P[3];
      paint(ellPts(tx, ty - .1 * u, .42 * u, .3 * u, 10), { wash: rib, ink: PAL.ink, sw: sw * .45 });   // tie
      paint([[tx - .35 * u, ty + .1 * u], [tx + .35 * u, ty + .1 * u], [tx + .15 * u + sw2 * .3 * u, ty + .95 * u], [tx - .2 * u + sw2 * .3 * u, ty + .9 * u]], { wash: hair, ink: PAL.ink, sw: sw * .4 });   // tuft
    }
  } else {   // curly bob: two puffs at the sides
    const sides = v === 'side' ? [L] : [L, R];
    for (const ex of sides) {
      const s = ex < 0 ? -1 : 1, P = [];
      for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + i / 16 * Math.PI, r = 1 + .14 * Math.sin(i * 1.9); P.push([ex + s * Math.cos(a) * 1.15 * u * r, -6.6 * u + Math.sin(a) * 1.7 * u * r]); }
      paint(P, { wash: hair, ink: PAL.ink, sw: sw * .55 });
    }
  }
  // bangs: a dark cap with a fringe, over the top of the head (a full cap from behind)
  const top = -8 * u, fr = back ? -5.8 * u : -7.15 * u, pts = [[L - .2 * u, top - .3 * u], [(L + R) / 2, top - .55 * u], [R + .2 * u, top - .3 * u], [R + .2 * u, fr + .35 * u]];
  const n = Math.max(4, Math.round((R - L) / u / 1.1));
  for (let i = 1; i <= n; i++) { const xx = lerp(R, L, i / n); pts.push([lerp(R, L, (i - .5) / n), fr + .25 * u], [xx, fr - .25 * u + (i === n ? .5 * u : 0)]); }
  pts.push([L - .2 * u, fr + .35 * u]);
  paint(pts, { wash: hair, ink: PAL.ink, sw: sw * .7 });
  if (!back && v !== 'side') inkLine([[L + 1.4 * u, top - .25 * u], [L + 2.6 * u, top - .4 * u]], sw * .4, mixCol(hair, PAL.cream, .45), 'inkfine', .5);   // shine
  if (o.city) {   // sun hat: a wide cream brim with a red band, tipped
    push(); translate(.4 * u, -8.1 * u); rotate(-.08);
    paint(ellPts(0, -1.25 * u, 3.6 * u, 1.9 * u, 22), { wash: '#F4E6C8', ink: PAL.ink, sw: sw * .7 });   // crown
    paint(rectPts(-3.5 * u, -1.0 * u, 7 * u, .75 * u), { wash: RIBBON, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(0, 0, 7.6 * u, 1.05 * u, 30), { wash: '#F8EBD0', ink: PAL.ink, sw: sw * .7 });   // brim
    if (o.shadesOff) for (const s of [-1, 1]) paint(rrPts(s * 1.5 * u - 1.1 * u, -.2 * u, 2.2 * u, 1.0 * u, .35 * u), { wash: '#2B2233', ink: null });   // shades up on the brim
    pop();
  } else if (o.flower !== false) {   // red camellia above the left braid
    const fx = (v === 'side' ? L + 1.2 * u : L + 1.6 * u), fy = -8.35 * u;
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .4; paint(ellPts(fx + Math.cos(a) * .62 * u, fy + Math.sin(a) * .62 * u, .55 * u, .55 * u, 10), { wash: o.ghost ? '#F2B9C2' : '#E2384D', ink: PAL.ink, sw: sw * .4 }); }
    paint(ellPts(fx, fy, .38 * u, .38 * u, 10), { wash: '#F6C744', ink: PAL.ink, sw: sw * .35 });
  }
}
function handbag(x, y, u, sw) {
  inkLine([[x - .5 * u, y + .1 * u], [x - .7 * u, y + 1.0 * u]], sw * .5, PAL.ink, 'ink', 0);
  inkLine([[x + .5 * u, y + .1 * u], [x + .7 * u, y + 1.0 * u]], sw * .5, PAL.ink, 'ink', 0);
  paint(rrPts(x - 1.4 * u, y + 1.0 * u, 2.8 * u, 2.0 * u, .4 * u), { wash: '#F2C53D', ink: PAL.ink, sw: sw * .6 });
  paint(rectPts(x - .3 * u, y + 1.3 * u, .6 * u, .45 * u), { wash: PAL.ink, ink: null });
}

// ---------- the rival ----------
function rival(x, y, u, o = {}) {
  const opts = { ...RV, eyes: 'shades', ...o, hat: null };
  const userDraw = o.draw;
  opts.draw = (u, sw) => { rivalHair(u, sw, opts); if (userDraw) userDraw(u, sw); };
  clawd(x, y, u, opts);
}
function rivalHair(u, sw, o) {
  const v = o.view || 'front', V = VIEWS[v] || VIEWS.front, L = V.L * u, R = V.R * u;
  const bob = .25 * Math.sin(bpOf(T) * Math.PI * 2) * u;
  const P = [[L - .1 * u, -7.3 * u], [L + .1 * u, -8.6 * u], [L + 2.0 * u, -9.4 * u + bob * .5], [R - 2.4 * u, -10.4 * u + bob], [R - .2 * u, -11.6 * u + bob], [R + 1.9 * u, -11.0 * u + bob], [R + 1.5 * u, -9.9 * u + bob], [R + .6 * u, -10.3 * u + bob], [R + .3 * u, -9.2 * u], [R + .15 * u, -7.4 * u]];
  paint(through(P, 4), { wash: '#2A2236', ink: PAL.ink, sw: sw * .7 });
  inkLine([[L + 1.2 * u, -9.2 * u], [L + 3.6 * u, -9.9 * u + bob], [R - .4 * u, -9.7 * u + bob]], sw * .45, '#6E6290', 'inkfine', .6);   // the gloss
}

// ---------- watermelon ----------
// whole melon (r = half-width); o.flower: wears 翠花's flower (for the lonely talk); o.face: braid straws
function melon(x, y, r, o = {}) {
  push(); translate(x, y); rotate(o.rot || 0);
  paint(ellPts(0, 0, r, r * .78, 26), { wash: MELON, ink: PAL.ink, sw: clamp(r / 60, .5, 1.2) });
  for (let i = -2; i <= 2; i++) {   // stripes
    const P = []; for (let k = 0; k <= 6; k++) { const yy = lerp(-.74, .74, k / 6) * r, xx = i * .36 * r * Math.sqrt(1 - (yy / r / .78) ** 2) + Math.sin(k * 1.7 + i) * .05 * r; P.push([xx, yy]); }
    inkLine(P, clamp(r / 45, .5, 2.2), MELON_DK, 'ink', .6);
  }
  paint(ellPts(-.38 * r, -.36 * r, .22 * r, .12 * r, 10, 0, -.6), { wash: '#9CC77A', washOp: 200, ink: null });   // highlight
  inkLine([[0, -.76 * r], [.06 * r, -.92 * r], [.18 * r, -.98 * r]], clamp(r / 50, .5, 1.2), '#6B5A2E', 'ink', .5);   // stem
  if (o.flower) {
    const fx = -.25 * r, fy = -.72 * r;
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .4; paint(ellPts(fx + Math.cos(a) * .13 * r, fy + Math.sin(a) * .13 * r, .12 * r, .12 * r, 10), { wash: '#E2384D', ink: PAL.ink, sw: .5 }); }
    paint(ellPts(fx, fy, .08 * r, .08 * r, 8), { wash: '#F6C744', ink: null });
  }
  if (o.braids) for (const s of [-1, 1]) {   // 翠花's braids, hung on the melon
    const P = [[s * .55 * r, -.62 * r], [s * .98 * r, -.2 * r], [s * 1.08 * r, .35 * r]];
    paint(ribbon(P, .2 * r, .12 * r), { wash: HAIR, ink: PAL.ink, sw: .5 });
    paint(ellPts(s * 1.08 * r, .38 * r, .08 * r, .06 * r, 8), { wash: RIBBON, ink: PAL.ink, sw: .4 });
  }
  pop();
}
// half melon, cut face up (a half-disc of red flesh with seeds), r = radius
function halfMelon(x, y, r, o = {}) {
  push(); translate(x, y); rotate(o.rot || 0);
  const bowl = []; for (let i = 0; i <= 18; i++) { const a = i / 18 * Math.PI; bowl.push([Math.cos(a) * r, Math.sin(a) * r * .8]); }
  paint(bowl, { wash: MELON, ink: PAL.ink, sw: clamp(r / 60, .5, 1.1) });
  paint(ellPts(0, 0, r, r * .26, 24), { wash: RIND, ink: PAL.ink, sw: clamp(r / 70, .4, 1) });
  paint(ellPts(0, 0, r * .9, r * .21, 24), { wash: FLESH, ink: null });
  if (o.scoop) paint(ellPts(r * .25, 0, r * .3 * o.scoop, r * .09 * o.scoop, 14), { wash: '#C73A48', ink: null });
  for (let i = 0; i < 7; i++) { const a = hash(i + 3) * TAU, d = .3 + .5 * hash(i + 9); paint(ellPts(Math.cos(a) * r * .8 * d, Math.sin(a) * r * .17 * d, r * .04, r * .025, 8), { wash: PAL.ink, ink: null }); }
  pop();
}
// a wedge slice (a fan), point down; r = radius
function slice(x, y, r, o = {}) {
  push(); translate(x, y); rotate(o.rot || 0);
  const a0 = -Math.PI / 2 - .55, a1 = -Math.PI / 2 + .55, P = [[0, 0]];
  for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); P.push([Math.cos(a) * r, Math.sin(a) * r]); }
  paint(P, { wash: FLESH, ink: PAL.ink, sw: clamp(r / 40, .4, 1) });
  const rim = []; for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); rim.push([Math.cos(a) * r, Math.sin(a) * r]); }
  for (let i = 10; i >= 0; i--) { const a = lerp(a0, a1, i / 10); rim.push([Math.cos(a) * r * 1.16, Math.sin(a) * r * 1.16]); }
  paint(rim, { wash: MELON, ink: PAL.ink, sw: clamp(r / 40, .4, 1) });
  if (o.bitten) for (let i = 0; i < 3; i++) paint(ellPts((i - 1) * .3 * r, -r * .98, .17 * r, .17 * r, 10), { wash: PAL.paper, ink: null });
  for (let i = 0; i < 5; i++) { const a = lerp(a0 + .2, a1 - .2, hash(i + 40)), d = .45 + .35 * hash(i + 50); paint(ellPts(Math.cos(a) * r * d, Math.sin(a) * r * d, r * .05, r * .08, 8, 0, a + Math.PI / 2), { wash: PAL.ink, ink: null }); }
  pop();
}

// ---------- vehicles ----------
// A low red convertible, side view, facing right (o.flip faces left). (x, y) = ground under the middle; s = unit.
// Riders go behind the door: draw them first with seatPos(), then the car. o.spin = wheel angle, o.bob = body bounce (px).
const CAR_SEATS = { driver: -1.9, passenger: -5.6 };
const seatPos = (x, y, s, seat, flip) => [x + (flip ? -1 : 1) * CAR_SEATS[seat] * s, y - 1.25 * s];
function car(x, y, s, o = {}) {
  const col = o.col || '#D9413F', dk = mixCol(col, PAL.ink, .35), sw = clamp(s / 22, .5, 1.6);
  boilSeed('car' + (o.key || ''));
  if (!o.noShadow) paint(ellPts(x, y + .15 * s, 9.6 * s, .65 * s, 22), { fill: PAL.ink, fillOp: 80, bleed: .2, tex: .3, ink: null });
  push(); translate(x, y - (o.bob || 0)); if (o.flip) scale(-1, 1); rotate(o.rot || 0);
  const P = pts => pts.map(([a, b]) => [a * s, b * s]);
  paint(P([[1.6, -3.25], [2.5, -3.25], [.75, -5.6], [.15, -5.5]]), { wash: '#CFE6F0', washOp: 150, ink: PAL.ink, sw: sw * .6 });   // windshield
  const body = P([[-8.8, -1.0], [-9.1, -2.2], [-8.6, -3.05], [-4.6, -3.15], [-3.8, -3.4], [2.2, -3.3], [6.2, -2.95], [8.7, -2.45], [9.3, -1.6], [9.0, -.9], [7.0, -.85], [6.7, -1.9], [5.4, -2.45], [4.1, -1.9], [3.8, -.85], [-3.6, -.85], [-3.9, -1.9], [-5.2, -2.45], [-6.5, -1.9], [-6.8, -.9]]);
  paint(body, { wash: col, ink: PAL.ink, sw });
  paint(ribbon(P([[-8.7, -2.15], [0, -2.25], [8.6, -1.95]]), .32 * s, .2 * s), { wash: PAL.cream, ink: null });   // stripe
  inkLine(P([[-1.1, -3.25], [-1.25, -1.6], [-1.0, -.95]]), sw * .6, dk, 'ink', .4);   // door seam
  paint(rectPts(-2.6 * s, -2.75 * s, .9 * s, .22 * s), { wash: mixCol(col, PAL.cream, .5), ink: null });   // handle
  paint(ellPts(8.75 * s, -2.15 * s, .42 * s, .28 * s, 10), { wash: '#FFF2B8', ink: PAL.ink, sw: sw * .5 });   // headlight
  paint(rectPts(-9.15 * s, -2.75 * s, .38 * s, .55 * s), { wash: '#8E1F2E', ink: null });   // tail light
  for (const wx of [-5.2, 5.4]) wheel(wx * s, -1.0 * s, 1.25 * s, (o.spin || 0) * (o.flip ? 1 : 1), sw);
  pop();
}
function wheel(x, y, r, a, sw) {
  paint(ellPts(x, y, r, r, 20), { wash: '#3A3340', ink: PAL.ink, sw });
  paint(ellPts(x, y, r * .55, r * .55, 16), { wash: '#D9D3C4', ink: PAL.ink, sw: sw * .6 });
  for (let i = 0; i < 3; i++) { const b = a + i * TAU / 3; inkLine([[x + Math.cos(b) * r * .12, y + Math.sin(b) * r * .12], [x + Math.cos(b) * r * .5, y + Math.sin(b) * r * .5]], sw * .5, '#8A8396', 'ink', 0); }
}
// A country bus, side view, facing right. Two passes so a rider can lean out of a window between them:
// bus(x, y, s, { part: 'back' }) → rider → bus(x, y, s, { part: 'front' }). winX(i) = a window's centre x.
const BUS_WIN = [-7.3, -4.4, -1.5, 1.4];
function bus(x, y, s, o = {}) {
  const col = o.col || '#4A9E95', sw = clamp(s / 22, .5, 1.5), part = o.part || 'all';
  boilSeed('bus' + (o.key || ''));
  push(); translate(x, y - (o.bob || 0)); if (o.flip) scale(-1, 1);
  const P = pts => pts.map(([a, b]) => [a * s, b * s]);
  if (part !== 'front') {
    if (!o.noShadow) paint(ellPts(0, .15 * s, 10.8 * s, .6 * s, 22), { fill: PAL.ink, fillOp: 80, bleed: .2, ink: null });
    paint(rrPts(-10 * s, -10 * s, 20 * s, 9 * s, 1.3 * s), { wash: col, ink: PAL.ink, sw });
    paint(rrPts(-9.6 * s, -11.0 * s, 15 * s, 1.1 * s, .3 * s), { wash: '#8A6A4A', ink: PAL.ink, sw: sw * .6 });   // roof rack
    paint(rrPts(-8.6 * s, -12.1 * s, 3.2 * s, 1.2 * s, .4 * s), { wash: '#C9873E', ink: PAL.ink, sw: sw * .5 });   // bundles
    paint(rrPts(-4.8 * s, -12.0 * s, 2.4 * s, 1.1 * s, .4 * s), { wash: '#6E9F58', ink: PAL.ink, sw: sw * .5 });
    for (const wx of BUS_WIN) paint(rrPts((wx - 1.2) * s, -8.9 * s, 2.4 * s, 2.6 * s, .3 * s), { wash: o.night ? '#F2CF7A' : '#BFDCE0', ink: PAL.ink, sw: sw * .6 });
    paint(P([[5.0, -8.9], [9.3, -8.9], [9.7, -5.6], [5.0, -5.6]]), { wash: o.night ? '#F2CF7A' : '#BFDCE0', ink: PAL.ink, sw: sw * .6 });   // windscreen
  }
  if (part !== 'back') {
    paint(rectPts(-10 * s, -6.1 * s, 20 * s, .75 * s), { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 });   // sill stripe
    const door = clamp(o.door || 0);
    paint(rectPts(2.9 * s, -8.9 * s, 1.9 * s, 7.6 * s), { wash: door > .05 ? '#2E2A3A' : mixCol(col, PAL.ink, .2), ink: PAL.ink, sw: sw * .6 });
    if (door > .05) paint(rectPts((2.9 + 1.9 * door * .8) * s, -8.9 * s, 1.9 * (1 - door * .8) * s, 7.6 * s), { wash: mixCol(col, PAL.cream, .3), ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(9.55 * s, -2.6 * s, .38 * s, .32 * s, 10), { wash: '#FFF2B8', ink: PAL.ink, sw: sw * .5 });
    for (const wx of [-6.4, 6.0]) wheel(wx * s, -1.1 * s, 1.35 * s, o.spin || 0, sw);
  }
  pop();
}

// ---------- scenery pieces ----------
// A wobbly band of colour between two edges, for sky bands, terraces, fields (pts across, then back).
function band(x0, x1, yTop, yBot, col, o = {}) {
  const n = o.n || 10, P = [];
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); P.push([x, (typeof yTop === 'function' ? yTop(x) : yTop) + jit(o.j ?? 6)]); }
  for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); P.push([x, (typeof yBot === 'function' ? yBot(x) : yBot) + jit(o.j ?? 6)]); }
  paint(P, { wash: col, washOp: o.op ?? 255, ink: o.ink ?? null, sw: o.sw ?? .8, curv: o.curv });
}
const ridge = (seed, base, amp, f = 1) => x => base - amp * (.55 * Math.sin(x * .0021 * f + seed) + .3 * Math.sin(x * .0057 * f + seed * 2.3) + .15 * Math.sin(x * .013 * f + seed * 4.1));
// a stilt house: wooden box on legs with a dark curved roof; (x, y) = ground under the middle, s = width
function stiltHouse(x, y, s, o = {}) {
  const wall = o.wall || '#B07A4A', roof = o.roof || '#3E3A4E', sw = clamp(s / 220, .5, 1.1), lit = o.lit;
  for (const k of [-.38, -.12, .14, .38]) paint(rectPts(x + k * s - .025 * s, y - .32 * s, .05 * s, .32 * s), { wash: mixCol(wall, PAL.ink, .3), ink: null });
  paint(rectPts(x - .45 * s, y - .34 * s, .9 * s, .05 * s), { wash: mixCol(wall, PAL.ink, .2), ink: null });
  paint(rectPts(x - .4 * s, y - .72 * s, .8 * s, .4 * s, 2), { wash: wall, ink: PAL.ink, sw });
  for (let i = 1; i < 5; i++) inkLine([[x - .4 * s, y - .72 * s + i * .08 * s], [x + .4 * s, y - .72 * s + i * .08 * s]], sw * .35, mixCol(wall, PAL.ink, .35), 'inkfine', 0);
  paint(rectPts(x - .1 * s, y - .62 * s, .2 * s, .18 * s), { wash: lit ? '#F6C86A' : '#4A3A3A', ink: PAL.ink, sw: sw * .6 });
  paint([[x - .6 * s, y - .66 * s], [x - .48 * s, y - .74 * s], [x, y - 1.0 * s], [x + .48 * s, y - .74 * s], [x + .6 * s, y - .66 * s], [x + .4 * s, y - .72 * s], [x - .4 * s, y - .72 * s]], { wash: roof, ink: PAL.ink, sw, curv: .2 });
}
function tuft(x, y, h, col, t, i = 0, sw = .7) {
  const s = wob(t, .45, hash(i) * 3) * h * .22;
  for (const k of [-1, 0, 1]) inkLine([[x + k * h * .25, y], [x + k * h * .42 + s, y - h * (.8 + .3 * hash(i + k + 7))]], sw, col, 'inkfine', .4);
}
function cloudPuff(x, y, w, col, op = 255) {
  const P = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, up = Math.sin(a) < 0, r = up ? 1 + .3 * Math.abs(Math.sin(a * 3.5)) : 1; P.push([x + Math.cos(a) * w * r, y + Math.sin(a) * (up ? .42 : .2) * w * r]); }
  paint(P, { wash: col, washOp: op, ink: null, curv: .4 });
}
function sunDisc(x, y, r, col = '#FFE6A8') { paint(ellPts(x, y, r, r, 30, 1.5), { wash: col, ink: null }); }
// a leafy tree; k 0..1 grows it (sapling → full)
function tree(x, y, s, k = 1, o = {}) {
  const tr = o.trunk || '#7A5236', lf = o.leaf || '#5E9A4E', sw = clamp(s / 200, .5, 1.2), h = lerp(.25, 1, k) * s;
  paint(ribbon([[x, y], [x + .02 * s, y - h * .45], [x - .03 * s, y - h * .7]], lerp(.03, .12, k) * s, lerp(.02, .06, k) * s), { wash: tr, ink: PAL.ink, sw });
  if (k > .05) {
    const cr = lerp(.08, .48, k) * s, cy = y - h * .78;
    for (const [dx, dy, rr, c] of [[-.45, .15, .7, mixCol(lf, PAL.ink, .2)], [.45, .1, .72, mixCol(lf, PAL.ink, .15)], [0, -.25, .85, lf], [-.2, .25, .6, mixCol(lf, PAL.cream, .1)]])
      if (!o.bare) paint(ellPts(x + dx * cr, cy + dy * cr, rr * cr, rr * cr * .85, 18, cr * .04), { wash: o.snow && c === lf ? '#EEF2F6' : c, ink: PAL.ink, sw: sw * .8, curv: .3 });
  }
}
// a sound ring (part of the shout), a wobbly arc
function soundRing(x, y, r, col, sw, a0 = -1.2, a1 = 1.2) {
  const P = []; for (let i = 0; i <= 14; i++) { const a = lerp(a0, a1, i / 14); P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .8]); }
  inkLine(P, sw, col, 'ink', .6);
}
function bird(x, y, s, flap, col = PAL.ink) {
  const d = Math.sin(flap) * .6 * s;
  inkLine([[x - s, y - d], [x - .4 * s, y - .2 * s], [x, y + .15 * s], [x + .4 * s, y - .2 * s], [x + s, y - d]], clamp(s / 14, .5, 1.2), col, 'ink', .6);
}
function petal(x, y, s, rot, col = '#F2A0AE') { push(); translate(x, y); rotate(rot); paint([[0, -s], [s * .55, 0], [0, s * .6], [-s * .55, 0]], { wash: col, ink: PAL.ink, sw: .45, curv: .6 }); pop(); }
function lantern(x, y, s, o = {}) {   // a paper lantern hanging from (x, y)
  inkLine([[x, y], [x, y + .5 * s]], clamp(s / 40, .5, 1), PAL.ink, 'inkfine', 0);
  paint(ellPts(x, y + 1.2 * s, .6 * s, .72 * s, 18), { wash: o.col || '#F0A64A', ink: PAL.ink, sw: clamp(s / 50, .5, 1) });
  paint(rectPts(x - .32 * s, y + .45 * s, .64 * s, .15 * s), { wash: PAL.ink, ink: null });
  paint(rectPts(x - .32 * s, y + 1.86 * s, .64 * s, .15 * s), { wash: PAL.ink, ink: null });
  paint(ellPts(x - .15 * s, y + 1.1 * s, .18 * s, .42 * s, 10), { wash: '#FFE3A1', washOp: 200, ink: null });
}
function packet(x, y, s, rot = 0) {   // a little snack packet with a painted star
  push(); translate(x, y); rotate(rot);
  paint([[-.6 * s, -.8 * s], [.6 * s, -.8 * s], [.7 * s, .8 * s], [-.7 * s, .8 * s]], { wash: '#F2C53D', ink: PAL.ink, sw: clamp(s / 30, .4, 1) });
  paint(rectPts(-.6 * s, -.95 * s, 1.2 * s, .25 * s), { wash: '#D8394E', ink: null });
  paint(starPts(0, .1 * s, .35 * s, .45, 5), { wash: '#D8394E', ink: null });
  pop();
}
function dust(x, y, r, k, col = '#E2D6BC') {   // a burst of soft dust clouds, k 0..1 age
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < 6; i++) {
    const a = Math.PI + (i / 5) * Math.PI, d = r * (.3 + .9 * easeOut(k)) * (.7 + .5 * hash(i + 11)), rr = r * (.25 + .35 * easeOut(k)) * (1 - k * .4);
    const px = x + Math.cos(a) * d * 1.4, py = y + Math.sin(a) * d * .5 - r * .25 * k, P = [];
    for (let j = 0; j < 20; j++) { const b = j / 20 * TAU, bump = 1 + .2 * Math.abs(Math.sin(b * 2.5 + i)); P.push([px + Math.cos(b) * rr * bump, py + Math.sin(b) * rr * .75 * bump]); }
    paint(P, { wash: col, washOp: 190 * (1 - k * k), ink: k < .12 ? mixCol(col, PAL.ink, .4) : null, sw: .4, curv: .5 });
  }
}

// half a melon held cut face to camera: a dome of red flesh with seeds inside a green rind (flat side down)
function melonFace(x, y, r, o = {}) {
  push(); translate(x, y); rotate(o.rot || 0);
  const dome = k => { const P = []; for (let i = 0; i <= 20; i++) { const a = Math.PI + i / 20 * Math.PI; P.push([Math.cos(a) * r * k, Math.sin(a) * r * k]); } return P; };
  paint(dome(1), { wash: MELON, ink: PAL.ink, sw: clamp(r / 50, .5, 1.4) });
  paint(dome(.9), { wash: RIND, ink: null });
  paint(dome(.82), { wash: FLESH, ink: null });
  for (let i = 0; i < 9; i++) { const a = Math.PI + (.15 + .7 * hash(i + 21)) * Math.PI, d = (.3 + .45 * hash(i + 22)) * r; paint(ellPts(Math.cos(a) * d, Math.sin(a) * d, r * .035, r * .06, 8, 0, a), { wash: PAL.ink, ink: null }); }
  pop();
}
// the convertible from behind, for the long road; (x, y) = ground under its middle, s = unit (as car())
function carRear(x, y, s, o = {}) {
  const sw = clamp(s / 22, .3, 1.4), col = '#D9413F';
  paint(ellPts(x, y + .1 * s, 5.2 * s, .5 * s, 16), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null });
  for (const k of [-1, 1]) paint(rrPts(x + k * 3.5 * s - .8 * s, y - 2.2 * s, 1.6 * s, 2.2 * s, .4 * s), { wash: '#3A3340', ink: PAL.ink, sw: sw * .7 });
  paint(rrPts(x - 4.6 * s, y - 3.4 * s, 9.2 * s, 2.6 * s, .9 * s), { wash: col, ink: PAL.ink, sw });
  for (const k of [-1, 1]) paint(rrPts(x + k * 3.2 * s - .6 * s, y - 2.9 * s, 1.2 * s, .6 * s, .2 * s), { wash: '#FF8A6A', ink: PAL.ink, sw: sw * .5 });
  paint(rectPts(x - 1.2 * s, y - 2.2 * s, 2.4 * s, .7 * s), { wash: '#E8E0D0', ink: PAL.ink, sw: sw * .4 });
}
// falling rain: n streaks in screen space, a pure function of t
function rainStreaks(t, n, col = '#9FB2E0', len = 46, slant = .25, sw = .7) {
  boilSeed('rain');
  for (let i = 0; i < n; i++) {
    const sp = 1500 + 500 * hash(i + 7), x0 = hash(i) * (W + 400) - 200, ph = frac(hash(i + 3) + t * sp / (H + 200));
    const y = ph * (H + 200) - 100, x = x0 + slant * y;
    inkLine([[x, y], [x + slant * len, y + len]], sw, col, 'inkfine', 0);
  }
}
// a sprout popping out of the ground (k 0..1)
function sprout(x, y, s, k) {
  if (k <= 0) return;
  const g = backOut(k), h = 1.4 * s * g;
  inkLine([[x, y], [x + .05 * s, y - h * .5], [x, y - h]], clamp(s / 10, .6, 2), '#4E8B3A', 'ink', .5);
  for (const d of [-1, 1]) { push(); translate(x, y - h); rotate(d * (.6 + .2 * Math.sin(T * 3 + d))); paint(ellPts(d * .45 * s * g, 0, .5 * s * g, .25 * s * g, 14), { wash: '#7DB062', ink: PAL.ink, sw: .6 }); pop(); }
}
// a red splat on the ground (k 0..1 = how far it has spread)
function splat(x, y, r, k) {
  if (k <= 0) return;
  const P = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = r * easeOut(k) * (1 + .35 * hash(i + 60)) * (i % 2 ? .75 : 1.1); P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .35]); }
  paint(P, { wash: FLESH, ink: PAL.ink, sw: .6, curv: .3 });
  for (let i = 0; i < 4; i++) paint(ellPts(x + (hash(i + 70) - .5) * r * 1.4, y + (hash(i + 71) - .5) * r * .3, r * .06, r * .04, 8), { wash: PAL.ink, ink: null });
  paint(slicePts(x + r * .5, y - r * .05, r * .5), { wash: MELON, ink: PAL.ink, sw: .5 });
}
function slicePts(x, y, r) { const P = []; for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .25]); } return P; }
// speed lines across the frame (screen space): k = strength 0..1, dir ±1
function speedLines(k, dir = 1, col = PAL.cream, n = 14) {
  if (k <= .02) return;
  boilSeed('speed');
  for (let i = 0; i < n; i++) {
    const y = 60 + (H - 120) * hash(i + 90), L = (300 + 600 * hash(i + 91)) * k, x = W * hash(i + 92);
    inkLine([[x, y], [x + dir * L, y + jit(4)]], 1.2 + 2 * hash(i + 93), col, 'dry', 0);
  }
}
