// aicuo_lib.js: the cast and props for the 《爱错》 MV ("The wrong delivery"). Everything paints with paint()/inkLine().
// Cast: 呆呆 (Clawd, with a scarf), 咕咕 (the pigeon), 铁山 (the big grumpy softie), and 她 (the girl across the valley).

const WINDC = '#8FB4DE', WINDDK = '#5F86BC';                      // the north wind, painted cold blue
const SCARF_R = '#C23B43', SCARF_C = '#F5E8CC';                   // 呆呆's scarf
const PINK = '#F08CA8', PINK_DK = '#C9607F', PINK_LT = '#FAC3D2'; // 铁山's love
const GI = { col: '#7E8797', dk: '#575F70', lt: '#A9B1C0' };      // 铁山 (slate)
const GIRL = { col: '#86CDBE', dk: '#4F9C8E', lt: '#BDE8DD' };    // 她 (mint)
const PG = { body: '#8E9DB8', dk: '#66759A', lt: '#B9C4D8', neck: '#46A596', neck2: '#A579C2', beak: '#E9A53C', foot: '#E58C8C' };
const MOUSTACHE = '#2B2233', CARD = '#C9A06B', CARD_DK = '#9C7442';
const WOOD = '#8A5A3A', WOOD_DK = '#5E3C26';

// emotions() with a character's own colours in every key, so cross-fades keep the character's colours
const emoAs = (base, t, keys, o) => emotions(t, keys.map(k => [k[0], k[1], { ...base, ...(k[2] || {}) }]), o);
const feelAs = (base, name, t, over = {}) => feel(name, t, { ...base, ...over });

// ---------- 呆呆: Clawd with a scarf (and, later, cardboard wings and goggles) ----------
// o.wind: how hard the north wind blows the scarf tail, in WORLD direction (+1 streams toward screen-right).
// o.wings (bool) + o.flap (angle, rad; + = up), o.goggles (bool). Everything else is clawd()'s.
function daidai(x, y, u, o = {}) {
  const opts = { ...o }, userDraw = o.draw;
  opts.draw = (u, sw) => {
    if (o.wings) cardWings(u, sw, opts);
    if (o.scarf !== false) scarfOn(u, sw, opts, o.scarfCols);
    if (o.goggles) goggles(u, sw, opts);
    if (userDraw) userDraw(u, sw);
  };
  clawd(x, y, u, opts);
}
// A knitted scarf: a striped band round the lower body, a knot, and a tail that streams in the wind.
function scarfOn(u, sw, o, cols) {
  cols = cols || { a: SCARF_R, b: SCARF_C };
  const v = o.view || 'front', V = VIEWS[v] || VIEWS.front, L = V.L * u, R = V.R * u, loc = o.flip ? -1 : 1;
  const wind = clamp(o.wind || 0, -1.2, 1.2) * loc, bp = bpOf(T), idle = .1 * Math.sin(bp * Math.PI + .6);
  const y0 = -3.4 * u, h = 1.25 * u, tailLen = (o.tailLen || 4.4) * u;
  // the tail first, so the band sits over its root
  const rx = v === 'side' ? L + .9 * u : R - 1.3 * u, ry = y0 + h * .6, ang = Math.PI / 2 - (wind + idle * (1 - Math.abs(wind))) * 1.25;   // direction of the tail
  const P = []; for (let i = 0; i <= 4; i++) {
    const k = i / 4, wav = Math.sin(T * 11 + i * 1.5 + (o.seed || 0)) * u * (.12 + .45 * Math.abs(wind)) * k;
    P.push([rx + Math.cos(ang) * tailLen * k - Math.sin(ang) * wav, ry + Math.sin(ang) * tailLen * k + Math.cos(ang) * wav]);
  }
  const tail = ribbon(P, 1.45 * u, .95 * u);
  paint(tail, { wash: cols.a, ink: PAL.ink, sw: sw * .75 });
  const C = through(P);
  for (const k of [.38, .68]) {   // cross stripes on the tail
    const i = Math.round(k * (C.length - 1)), a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d, w = lerp(.7, .45, k) * u;
    inkLine([[C[i][0] - nx * w, C[i][1] - ny * w], [C[i][0] + nx * w, C[i][1] + ny * w]], sw * 1.5, cols.b, 'inkfine', 0);
  }
  // the band
  paint(rectPts(L - .15 * u, y0, R - L + .3 * u, h, u * .04), { wash: cols.a, ink: PAL.ink, sw: sw * .8 });
  const n = Math.max(3, Math.round((R - L) / (1.9 * u)));
  for (let i = 0; i < n; i++) { const xx = lerp(L + 1 * u, R - 1 * u, (i + .5) / n); paint(rectPts(xx - .3 * u, y0 + .12 * u, .6 * u, h - .24 * u, u * .02), { wash: cols.b, ink: null }); }
  paint(ellPts(rx, ry, .75 * u, .68 * u, 12), { wash: mixCol(cols.a, PAL.ink, .15), ink: PAL.ink, sw: sw * .6 });   // the knot
}
// Cardboard wings, strapped on at the shoulders. flap = wing angle above horizontal (rad).
function cardWings(u, sw, o) {
  const v = o.view || 'front', fl = o.flap ?? .3;
  const wing = (rx, ry, dir, a, len, shade) => {   // dir = ±1: which way it points; a = lift angle
    push(); translate(rx, ry); scale(dir, 1); rotate(-a);
    const Pw = [[0, -.9], [len * .5, -1.7], [len * .98, -1.5], [len * .78, -.7], [len * 1.04, .05], [len * .8, .6], [len * .98, 1.4], [len * .68, 1.2], [len * .78, 2.1], [len * .4, 1.9], [0, 1.0]].map(([p, q]) => [p * u, q * u]);
    paint(Pw, { wash: shade ? mixCol(CARD, CARD_DK, .45) : CARD, fill: CARD_DK, fillOp: 70, bleed: .1, tex: .6, ink: PAL.ink, sw: sw * .85 });
    if (!shade) {
      for (const k of [.3, .55, .8]) inkLine([[0, 0], [len * k * u * 1.0, (k - .4) * 2.2 * u]], sw * .5, CARD_DK, 'inkfine', 0);
      paint(rectPts(len * .38 * u, -1.5 * u, .9 * u, 3.4 * u, u * .03), { wash: '#F2E9D8', washOp: 235, ink: PAL.ink, sw: sw * .35 });   // tape
    }
    pop();
  };
  if (v === 'side') { wing(-1.2 * u, -7.2 * u, -1, fl * .85 + .15, 7.4, true); wing(-.4 * u, -7.4 * u, -1, fl + .1, 8, false); }
  else { wing(-4.2 * u, -6.1 * u, -1, fl, 7.6, false); wing(4.2 * u, -6.1 * u, 1, fl, 7.6, false); }
}
// Aviator goggles over the eyes (view-aware), strap round the head.
function goggles(u, sw, o) {
  const V = VIEWS[o.view || 'front'] || VIEWS.front, F = V.face; if (!F) return;
  push(); translate(F.cx * u, 0); scale(F.fw, 1);
  inkLine([[-5.3 * u, -6.9 * u], [-3.9 * u, -7.2 * u]], sw * 1.3, '#4A3A34', 'ink', 0); inkLine([[3.9 * u, -7.2 * u], [5.3 * u, -6.9 * u]], sw * 1.3, '#4A3A34', 'ink', 0);
  inkLine([[-1.2 * u, -6.9 * u], [1.2 * u, -6.9 * u]], sw * 1.3, '#4A3A34', 'ink', 0);
  for (const s of F.sides) {
    paint(ellPts(s * 2.5 * u, -6.0 * u, 1.65 * u, 1.75 * u, 18), { wash: '#CBE7F2', washOp: 120, ink: '#8A6A3A', sw: sw * 1.5 });
    inkLine([[s * 2.5 * u - 1.0 * u, -6.9 * u], [s * 2.5 * u - .3 * u, -7.3 * u]], sw * .5, PAL.cream, 'inkfine', 0);
  }
  pop();
}

// ---------- 咕咕: the pigeon ----------
// (x, y) = ground between the feet, s = unit (the body is ~7s long). Faces right; o.flip faces left.
// o.mood: proud | scared | sly | blank | ko.  o.flap: wing lift (rad, 0 = folded, + = up).  o.fly: feet tucked.
// o.rot: nose-down tilt (rad) about the body.  o.bob: lift in px.  o.sq: squash.  o.bag (default true), o.letter.
function pigeon(x, y, s, o = {}) {
  const sw = clamp(s / 11, .5, 1.5), dir = o.flip ? -1 : 1, mood = o.mood || 'proud', bag = o.bag !== false;
  boilSeed('pigeon' + (o.key || ''));
  if (!o.noShadow) paint(ellPts(x, y + .1 * s, 3.8 * s * (1 - clamp((o.bob || 0) / (9 * s)) * .5), .55 * s, 18), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null });
  push(); translate(x, y - (o.bob || 0)); scale(dir * (1 + (o.sq || 0) * .5), 1 - (o.sq || 0));
  translate(0, -3 * s); rotate(o.rot || 0); translate(0, 3 * s);
  const P = pts => pts.map(([a, b]) => [a * s, b * s]);
  // legs
  if (!o.fly) for (const lx of [-.5, 1.0]) { inkLine(P([[lx, -1.0], [lx - .05, -.15]]), sw * 1.1, PG.foot, 'ink', 0); inkLine(P([[lx - .55, 0], [lx, -.15], [lx + .55, 0]]), sw * .8, PG.foot, 'ink', 0); }
  else for (const lx of [-.1, 1.0]) inkLine(P([[lx, -1.1], [lx - .5, -.35]]), sw * .9, PG.foot, 'ink', 0);
  // tail fan
  paint(P([[-2.9, -3.7], [-6.0, -4.5], [-6.5, -3.4], [-6.1, -2.3], [-2.9, -2.6]]), { wash: PG.dk, ink: PAL.ink, sw: sw * .8, curv: .2 });
  inkLine(P([[-3.4, -3.3], [-5.9, -3.4]]), sw * .4, PG.lt, 'inkfine', 0);
  // body
  const puff = mood === 'proud' ? 1.08 : 1;
  paint(ellPts(0, -3.0 * s, 3.5 * s * puff, 2.5 * s, 22, 0, -.08), { wash: PG.body, fill: PG.dk, fillOp: 60, tex: .5, ink: PAL.ink, sw });
  paint(ellPts(.9 * s, -2.4 * s, 2.0 * s, 1.35 * s, 14, 0, -.1), { wash: PG.lt, washOp: 200, ink: null });   // pale belly
  // satchel (under the wing)
  if (bag) {
    inkLine(P([[-1.3, -5.2], [.2, -3.4], [.6, -2.2]]), sw * .9, WOOD_DK, 'ink', .3);
    paint(rrPts(-1.6 * s, -3.0 * s, 2.5 * s, 1.9 * s, .45 * s), { wash: '#B9854F', ink: PAL.ink, sw: sw * .8 });
    paint(P([[-1.65, -3.0], [.95, -3.0], [-.35, -2.0]]), { wash: '#9A6B3C', ink: PAL.ink, sw: sw * .6 });
    if (o.letter) letterHeart(-.4 * s, -3.25 * s, s * .62, -.3);
  }
  // wing
  const fl = o.flap || 0, wa = Math.PI + .12 + fl;
  push(); translate(-.5 * s, -3.9 * s); rotate(wa);
  paint(P([[0, -.95], [1.6, -1.25], [3.3, -.7], [4.6, .25], [3.2, 1.0], [1.2, 1.15], [0, .85]]), { wash: PG.dk, fill: PG.body, fillOp: 50, ink: PAL.ink, sw: sw * .85, curv: .25 });
  for (const k of [.9, 1.8, 2.7]) inkLine(P([[k, -.2], [k + .7, .55]]), sw * .4, PG.lt, 'inkfine', 0);
  pop();
  // head + neck
  const hx = (2.9 + (o.headDX || 0)) * s, hy = (-5.7 + (o.headDY || 0)) * s;
  paint(ellPts(hx, hy, 1.6 * s, 1.55 * s, 18), { wash: PG.body, ink: PAL.ink, sw });
  paint(ellPts(1.9 * s, -4.5 * s, 1.5 * s, 1.5 * s, 12), { wash: PG.body, ink: null });
  paint(ellPts(2.2 * s, -4.7 * s, 1.15 * s, 1.0 * s, 14), { wash: PG.neck, washOp: 235, ink: null });
  paint(ellPts(1.8 * s, -4.4 * s, .7 * s, .55 * s, 12), { wash: PG.neck2, washOp: 150, ink: null });
  // eye + beak
  const ex = hx + .75 * s, ey = hy - .15 * s;
  if (mood === 'scared') {
    paint(ellPts(ex, ey, .85 * s, .95 * s, 14), { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(ex + Math.sin(T * 40) * .05 * s, ey, .2 * s, .28 * s, 8), { wash: PAL.ink, ink: null });
  } else if (mood === 'ko') {
    inkLine(P([[ex / s - .45, ey / s - .45], [ex / s + .45, ey / s + .45]]), sw, PAL.ink, 'ink', 0); inkLine(P([[ex / s + .45, ey / s - .45], [ex / s - .45, ey / s + .45]]), sw, PAL.ink, 'ink', 0);
  } else if (mood === 'sly') {
    paint(ellPts(ex, ey, .55 * s, .5 * s, 12), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(ex + .1 * s, ey + .05 * s, .25 * s, .25 * s, 8), { wash: PAL.ink, ink: null });
    inkLine(P([[ex / s - .7, ey / s - .12], [ex / s + .7, ey / s - .02]]), sw * 1.1, PAL.ink, 'ink', 0);
  } else if (mood === 'blank') {
    paint(ellPts(ex, ey, .35 * s, .35 * s, 10), { wash: PAL.ink, ink: null });
  } else {
    paint(ellPts(ex, ey, .55 * s, .58 * s, 12), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(ex + .1 * s, ey + .03 * s, .3 * s, .32 * s, 8), { wash: PAL.ink, ink: null });
  }
  paint(P([[hx / s + 1.4, hy / s - .35], [hx / s + 3.0, hy / s + .15], [hx / s + 1.4, hy / s + .6]]), { wash: PG.beak, ink: PAL.ink, sw: sw * .7, curv: .15 });
  if (mood === 'scared' && o.sweat !== false) emote('sweat', hx + 1.2 * s, hy - 2.3 * s, s * .8, o.sweatK ?? 1, T);
  pop();
}

// ---------- 铁山: the big grumpy softie ----------
// A Clawd-shaped block in slate, ~1.5× the size, with a walrus moustache, heavy brows and a scar. o.brow: + angry, − worried.
// o.scarf: wears the pink scarf he knitted (o.wind blows it).
function giant(x, y, u, o = {}) {
  const opts = { ...GI, ...o, hat: null }, userDraw = o.draw;
  opts.draw = (u, sw) => {
    giantFace(u, sw, opts);
    if (o.scarf) scarfOn(u, sw, { ...opts, tailLen: 6 }, { a: PINK, b: PINK_LT });
    if (userDraw) userDraw(u, sw);
  };
  clawd(x, y, u, opts);
}
function giantFace(u, sw, o) {
  const V = VIEWS[o.view || 'front'] || VIEWS.front, F = V.face; if (!F) return;
  push(); translate(F.cx * u, 0); scale(F.fw, 1);
  const b = o.brow ?? .5, mo = o.moustache ?? 1;
  for (const s of F.sides) { push(); translate(s * 2.5 * u, -7.45 * u - Math.max(0, -b) * .0); rotate(-s * b * .5); paint(rectPts(-1.55 * u, -.38 * u, 3.1 * u, .78 * u, u * .04), { wash: MOUSTACHE, ink: null }); pop(); }
  if (mo > 0) {
    const side = F.sides.length === 1;
    for (const s of (side ? [1] : [-1, 1])) {
      const droop = (o.moDroop ?? .6);
      const Pm = [[s * .15, -4.95], [s * 1.2, -5.0], [s * 2.3, -4.65], [s * 2.9, -3.95 + (1 - droop) * -.3], [s * 3.0, -3.2 + (1 - droop) * -.7]].map(([p, q]) => [p * u, q * u]);
      paint(ribbon(Pm, 1.25 * u, .45 * u), { wash: MOUSTACHE, ink: null });
    }
  }
  // the scar: a short crossed mark on the forehead
  if (o.scar !== false) { inkLine([[3.0 * u, -7.95 * u], [3.9 * u, -7.1 * u]], sw * .9, mixCol(o.dk || GI.dk, PAL.cream, .5), 'inkfine', 0); inkLine([[3.0 * u, -7.2 * u], [3.9 * u, -7.9 * u]], sw * .7, mixCol(o.dk || GI.dk, PAL.cream, .5), 'inkfine', 0); }
  pop();
}

// ---------- 她: the girl across the valley (mint, red bow) ----------
function girl(x, y, u, o = {}) { clawd(x, y, u, { ...GIRL, hat: 'bow', ...o }); }

// ---------- the letter ----------
// A cream envelope with a red heart seal. (x, y) = centre, s = unit (the envelope is 4s × 2.8s).
function letterHeart(x, y, s, rot = 0, o = {}) {
  push(); translate(x, y); rotate(rot);
  const sw = clamp(s / 12, .4, 1.1);
  paint(rrPts(-2 * s, -1.4 * s, 4 * s, 2.8 * s, .25 * s), { wash: '#FBF1DC', fill: '#E7D3A8', fillOp: 70, bleed: .1, ink: PAL.ink, sw });
  if (!o.open) {
    inkLine([[-2 * s, -1.4 * s], [0, .2 * s], [2 * s, -1.4 * s]], sw * .8, PAL.ink, 'inkfine', 0);
    paint(heartPts(0, .15 * s, .62 * s), { wash: '#D8394E', ink: PAL.ink, sw: sw * .5 });
  } else {
    paint([[-2 * s, -1.4 * s], [0, -3.2 * s], [2 * s, -1.4 * s]], { wash: '#F3E4C4', ink: PAL.ink, sw });
  }
  pop();
}

// ---------- the mailbox ----------
// (x, y) = ground under the post, s = unit (the box is 5.2s wide, facing right). flag 0..1 raised, open 0..1 door, snow 0..1 cap.
function mailbox(x, y, s, o = {}) {
  const sw = clamp(s / 22, .5, 1.3), bx = -2.6 * s, bw = 5.2 * s, by = -6.2 * s, bh = 2.7 * s, box = '#5F83B0';
  boilSeed('mailbox' + (o.key || ''));
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  paint(rectPts(-.38 * s, -3.7 * s, .76 * s, 3.7 * s, s * .03), { wash: WOOD, ink: PAL.ink, sw });
  inkLine([[-.1 * s, -3.4 * s], [-.12 * s, -.5 * s]], sw * .45, WOOD_DK, 'inkfine', .3);
  // the flag (behind the box)
  const fa = lerp(.3, -1.5, clamp(o.flag || 0));
  push(); translate(bx + 1.1 * s, by + bh * .35); rotate(fa);
  paint(rectPts(0, -.17 * s, 2.5 * s, .34 * s, s * .02), { wash: '#8A8A98', ink: PAL.ink, sw: sw * .6 });
  paint(rectPts(1.4 * s, 0, 1.2 * s, 1.0 * s, s * .02), { wash: '#D8394E', ink: PAL.ink, sw: sw * .7 });
  pop();
  const open = clamp(o.open || 0);
  if (open > .02) paint(ellPts(bx + bw + .1 * s, by + bh / 2, .42 * s, 1.15 * s, 14), { wash: '#2A2434', ink: PAL.ink, sw: sw * .6 });
  paint(rrPts(bx, by, bw, bh, 1.15 * s), { wash: box, fill: '#8BAAD2', fillOp: 70, bleed: .15, tex: .6, ink: PAL.ink, sw });
  inkLine([[bx + .6 * s, by + .45 * s], [bx + 2.4 * s, by + .3 * s]], sw * .5, '#A9C2E2', 'inkfine', 0);
  if (open <= .02) paint(rectPts(bx + bw - .15 * s, by + .2 * s, .5 * s, bh - .4 * s, s * .03), { wash: '#7898C2', ink: PAL.ink, sw: sw * .8 });
  else { push(); translate(bx + bw, by + bh - .2 * s); rotate(open * 1.5); paint(rectPts(-.15 * s, -2.2 * s, .5 * s, 2.3 * s, s * .02), { wash: '#7898C2', ink: PAL.ink, sw: sw * .8 }); pop(); }
  const sn = clamp(o.snow || 0);
  if (sn > .02) {
    const Pc = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; Pc.push([Math.cos(a) * (bw / 2 + .25 * s), by + .35 * s + Math.sin(a) * .95 * s * sn]); }
    paint(Pc.map(([a, b]) => [a + bx + bw / 2, b]), { wash: '#F2F5FB', fill: '#BFD0E8', fillOp: 70, ink: PAL.ink, sw: sw * .7, curv: .5 });
    paint(ellPts(0, -.1 * s, .75 * s * sn, .22 * s * sn, 10), { wash: '#F2F5FB', ink: null });
  }
  pop();
}

// ---------- weather, painted ----------
// The north wind: cold-blue streaks with a curl at the head, sweeping across the screen (call it in screen space).
// k = strength 0..1, dir = +1 blows toward screen-right. Pure function of t.
function windLines(t, k, o = {}) {
  if (k <= .02) return;
  const n = o.n ?? 12, dir = o.dir ?? 1, y0 = o.y0 ?? 80, y1 = o.y1 ?? H - 160, seed = o.seed || 0, sp = o.speed ?? 2800;
  boilSeed('wind' + seed);
  for (let i = 0; i < n; i++) {
    const L = (260 + 360 * hash(i + seed + 1)) * (.5 + .5 * k), y = lerp(y0, y1, hash(i * 1.3 + seed)), span = W + 900 + L;
    let hx = frac(hash(i + seed + 7) + t * sp * (.8 + .4 * hash(i + 3)) / span) * span - L * .5;
    if (dir < 0) hx = W - hx;
    const P = []; for (let j = 0; j <= 6; j++) { const a = j / 6; P.push([hx - dir * L * a, y + Math.sin(a * 5 + i) * 14 * k]); }
    const r = 20 + 12 * hash(i + 31), cx = hx + dir * 4, cy = y - r, C = []; for (let j = 0; j <= 8; j++) { const a = Math.PI / 2 - dir * j / 8 * 4.6; C.push([cx + Math.cos(a) * r * (1 - j / 14), cy + Math.sin(a) * r * (1 - j / 14)]); }
    inkLine(P, .7 + 1.1 * k, '#D6E6F8', 'dry', .5);
    inkLine(P.concat(C), .9 + .5 * k, WINDDK, 'inkfine', .5);
  }
}
// Falling leaves (screen space). lean = how far a leaf drifts sideways while falling (px); a pure function of t.
function leafFall(t, o = {}) {
  const n = o.n ?? 14, cols = o.cols || ['#D9822B', '#C2552D', '#E8AA38', '#A9482E'], lean = o.lean ?? 260, seed = o.seed || 0, size = o.size ?? 24;
  boilSeed('leaves' + seed);
  for (let i = 0; i < n; i++) {
    const sp = (120 + 90 * hash(i + seed)) * (o.speed ?? 1), ph = frac(hash(i * 1.7 + seed + 3) + t * sp / (H + 160));
    const y = -80 + ph * (H + 160), x = hash(i + seed + 11) * (W + 500) - 250 + lean * ph + Math.sin(t * (1.4 + hash(i + 5)) + i) * (40 + 30 * hash(i + 9));
    const s = size * (.7 + .6 * hash(i + 17)), flip = Math.cos(t * (2 + hash(i + 23) * 3) + i) * .55 + .65;
    push(); translate(x, y); rotate(t * (1.2 + hash(i + 19) * 2) + i + (o.spin || 0)); scale(1, flip);
    paint([[0, -s], [s * .6, -s * .1], [s * .3, s * .7], [0, s], [-s * .3, s * .7], [-s * .6, -s * .1]], { wash: cols[i % cols.length], ink: PAL.ink, sw: .6, curv: .55 });
    inkLine([[0, -s * .8], [0, s * .9]], .5, mixCol(cols[i % cols.length], PAL.ink, .45), 'inkfine', 0);
    pop();
  }
}
// Snow (screen space): n flakes sinking and swaying; lean drifts them sideways.
function snowFall(t, o = {}) {
  const n = o.n ?? 40, lean = o.lean ?? 120, seed = o.seed || 0, sp0 = o.speed ?? 1;
  boilSeed('snow' + seed);
  for (let i = 0; i < n; i++) {
    const r = 2.5 + 5.5 * hash(i + seed), sp = (110 + 140 * hash(i + seed + 5)) * (.6 + r / 8) * sp0, ph = frac(hash(i * 1.9 + seed + 3) + t * sp / (H + 100));
    const y = -50 + ph * (H + 100), x = hash(i + seed + 11) * (W + 300) - 150 + lean * ph + Math.sin(t * (1 + hash(i + 7)) + i * 2) * 30;
    paint(ellPts(x, y, r, r, 8), { wash: '#F6F9FF', washOp: 235, ink: null });
  }
}

// ---------- props ----------
// A snowball with an optional face (coal eyes, carrot nose), rolling with rot.
function snowBall(x, y, r, o = {}) {
  push(); translate(x, y); rotate(o.rot || 0);
  paint(ellPts(0, 0, r, r * .96, 22, r * .01), { wash: '#F2F5FB', fill: '#BFD0E8', fillOp: 90, bleed: .2, tex: .5, ink: PAL.ink, sw: clamp(r / 40, .5, 1.3) });
  paint(ellPts(-r * .3, -r * .35, r * .35, r * .18, 10, 0, -.6), { wash: '#FFFFFF', washOp: 160, ink: null });
  if (o.face) {
    for (const s of [-1, 1]) paint(ellPts(s * r * .36, -r * .12, r * .1, r * .1, 8), { wash: PAL.ink, ink: null });
    paint([[r * .02, r * .06], [r * 1.1, r * .2], [r * .02, r * .3]], { wash: '#E8832B', ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 4; i++) paint(ellPts(-r * .4 + i * r * .27, r * .5 + Math.sin(i * 1.3) * r * .06, r * .06, r * .06, 6), { wash: PAL.ink, ink: null });
  }
  pop();
}
// The snowman: three balls, stick arms. o.noHead leaves the neck bare; o.lean tilts it.
function snowman(x, y, s, o = {}) {
  const sw = clamp(s / 22, .5, 1.2); boilSeed('snowman' + (o.key || ''));
  push(); translate(x, y); rotate(o.lean || 0);
  for (const d of [-1, 1]) { const a = d * (1.0 + (o.armUp || 0)); inkLine([[d * 1.0 * s, -3.9 * s], [d * 1.9 * s, -4.5 * s + (o.armUp || 0) * -s], [d * 2.5 * s, -4.9 * s + (o.armUp || 0) * -s * 1.4]], sw * 1.4, WOOD_DK, 'ink', .4); }
  snowBall(0, -1.5 * s, 1.55 * s);
  snowBall(0, -3.7 * s, 1.1 * s);
  if (!o.noHead) snowBall(0, -5.4 * s, .95 * s, { face: o.face !== false });
  for (let i = 0; i < 2; i++) paint(ellPts(0, -3.4 * s + i * 1.15 * s, .12 * s, .12 * s, 6), { wash: PAL.ink, ink: null });   // buttons
  pop();
}
function bouquet(x, y, s, rot = 0) {
  push(); translate(x, y); rotate(rot);
  const sw = clamp(s / 18, .4, 1.1), C = ['#E2384D', '#F6C744', '#F4EFE6', '#E2384D', '#F08CA8'];
  for (let i = 0; i < 5; i++) { const a = (i - 2) * .32; inkLine([[0, 0], [Math.sin(a) * 2.2 * s, -Math.cos(a) * 2.2 * s]], sw * 1.1, '#4E8B3A', 'ink', 0); }
  for (let i = 0; i < 5; i++) { const a = (i - 2) * .32, fx = Math.sin(a) * 2.5 * s, fy = -Math.cos(a) * 2.5 * s;
    for (let k = 0; k < 5; k++) { const b = k / 5 * TAU; paint(ellPts(fx + Math.cos(b) * .4 * s, fy + Math.sin(b) * .4 * s, .38 * s, .38 * s, 8), { wash: C[i], ink: PAL.ink, sw: sw * .45 }); }
    paint(ellPts(fx, fy, .28 * s, .28 * s, 8), { wash: i === 1 ? '#C28A2B' : '#F6C744', ink: PAL.ink, sw: sw * .4 }); }
  paint([[-.6 * s, .2 * s], [.6 * s, .2 * s], [1.5 * s, -1.6 * s], [-1.5 * s, -1.6 * s]], { wash: PINK_LT, ink: PAL.ink, sw: sw * .7 });
  paint(rectPts(-.55 * s, -.75 * s, 1.1 * s, .3 * s), { wash: PINK_DK, ink: null });
  pop();
}
// A painted skull-and-crossbones on a plank sign (a picture, not lettering).
function skullSign(x, y, s) {
  const sw = clamp(s / 22, .5, 1.2); boilSeed('skullsign');
  paint(rectPts(x - .3 * s, y - 2.6 * s, .6 * s, 2.6 * s, 1), { wash: WOOD_DK, ink: PAL.ink, sw });
  push(); translate(x, y - 3.4 * s); rotate(-.06);
  paint(rectPts(-2 * s, -1.5 * s, 4 * s, 3 * s, 1.5), { wash: '#B08A5A', fill: WOOD, fillOp: 60, tex: .6, ink: PAL.ink, sw });
  inkLine([[-1.4 * s, .9 * s], [1.4 * s, -.1 * s]], sw * 2, PAL.cream, 'ink', 0); inkLine([[-1.4 * s, -.1 * s], [1.4 * s, .9 * s]], sw * 2, PAL.cream, 'ink', 0);
  paint(ellPts(0, -.35 * s, .78 * s, .72 * s, 14), { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 });
  paint(rectPts(-.4 * s, .15 * s, .8 * s, .5 * s), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
  for (const d of [-1, 1]) paint(ellPts(d * .3 * s, -.4 * s, .2 * s, .24 * s, 8), { wash: PAL.ink, ink: null });
  paint([[0, -.05 * s], [.1 * s, .12 * s], [-.1 * s, .12 * s]], { wash: PAL.ink, ink: null });
  pop();
}
// Iron fence with spear tips. h = bar height; tips = true.
function spikeFence(x0, x1, y, h, col = '#3D3A4C') {
  const sw = .8; boilSeed('fence' + x0);
  inkLine([[x0, y - h * .28], [(x0 + x1) / 2, y - h * .28 + 2], [x1, y - h * .28 + 4]], 2.4, col, 'ink', 0); inkLine([[x0, y - h * .72], [(x0 + x1) / 2, y - h * .72 + 2], [x1, y - h * .72 + 4]], 2.4, col, 'ink', 0);
  const n = Math.round((x1 - x0) / 58);
  for (let i = 0; i <= n; i++) {
    const x = lerp(x0, x1, i / n), hh = h * (.92 + .1 * hash(i + 5));
    paint(rectPts(x - 5, y - hh, 10, hh, 1), { wash: col, ink: PAL.ink, sw });
    paint([[x - 8, y - hh + 2], [x, y - hh - 30], [x + 8, y - hh + 2]], { wash: col, ink: PAL.ink, sw });
  }
}
// tea: a stool, a table, a cup with steam (steam 0..1; pure function of T)
function stool(x, y, s, o = {}) {
  const sw = clamp(s / 20, .5, 1.2);
  for (const d of [-1, 0, 1]) inkLine([[x + d * .9 * s, y - 1.5 * s], [x + d * 1.3 * s, y]], sw * 2.2, WOOD_DK, 'ink', 0);
  paint(ellPts(x, y - 1.55 * s, 1.7 * s, .42 * s, 16), { wash: WOOD, ink: PAL.ink, sw });
}
function teaCup(x, y, s, steam = 1, o = {}) {
  const sw = clamp(s / 20, .4, 1.1);
  paint(ellPts(x, y, 1.5 * s, .32 * s, 14), { wash: '#F2E9D8', ink: PAL.ink, sw: sw * .7 });
  paint([[x - 1 * s, y - .15 * s], [x + 1 * s, y - .15 * s], [x + .7 * s, y - 1.4 * s], [x - .7 * s, y - 1.4 * s]], { wash: o.col || '#F6EDDA', ink: PAL.ink, sw: sw * .8, curv: .15 });
  paint(ellPts(x, y - 1.4 * s, .7 * s, .2 * s, 10), { wash: '#B8743A', ink: PAL.ink, sw: sw * .5 });
  inkLine([[x + .95 * s, y - 1.1 * s], [x + 1.55 * s, y - .85 * s], [x + .9 * s, y - .35 * s]], sw * .9, PAL.ink, 'ink', .5);
  if (steam > .03) for (let i = 0; i < 3; i++) {
    const ph = frac(T * .6 + i / 3), P = []; for (let j = 0; j <= 4; j++) P.push([x + (i - 1) * .4 * s + Math.sin(ph * 6 + j + i) * .3 * s, y - 1.7 * s - (ph + j * .22) * 2.2 * s * Math.min(1, steam)]);
    inkLine(P, sw * 1.4 * Math.min(1, steam + .2), '#E8E4F0', 'dry', .6);
  }
}
// A rain cloud that follows its owner and rains on just them. (x, y) = the cloud's centre, w = half width, k = 0..1 grown.
function miniCloud(x, y, w, k, o = {}) {
  if (k <= .02) return;
  const g = backOut(k), ww = w * g, P = [];
  for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, up = Math.sin(a) < 0, r = up ? 1 + .35 * Math.pow(Math.abs(Math.sin(a * 3)), .6) : 1; P.push([x + Math.cos(a) * ww * (up ? r * .92 : 1), y + Math.sin(a) * (up ? .55 : .3) * ww * r]); }
  const gy = o.groundY ?? y + 300;
  for (let i = 0; i < 9; i++) { const ph = frac(T * 2.6 + hash(i + 40)), rx = x + (-.8 + i * .2) * ww, ry = y + .3 * ww + ph * (gy - y - .3 * ww); inkLine([[rx, ry], [rx - 3, ry + 22]], 1.3, mixCol(PAL.sky, PAL.indigo, .35), 'inkfine', 0); }
  paint(P, { wash: o.col || '#9AA0BC', fill: PAL.indigo, fillOp: 80, bleed: .1, ink: PAL.ink, sw: .9, curv: .4 });
}
// the moth that flies out of the empty mailbox
function moth(x, y, s, T0 = T) {
  const f = Math.sin(T0 * 34) * .55, sw = .6;
  for (const d of [-1, 1]) { push(); translate(x, y); rotate(d * (.4 + f)); paint(ellPts(d * s * .9, -s * .15, s * .95, s * .55, 12), { wash: '#C9B79A', ink: PAL.ink, sw }); paint(ellPts(d * s * 1.0, -s * .15, s * .3, s * .2, 8), { wash: '#8C7A5E', ink: null }); pop(); }
  paint(ellPts(x, y, s * .22, s * .6, 8), { wash: '#5E4C3A', ink: PAL.ink, sw: .5 });
}
// a cobweb across the mailbox mouth: centre (x, y), radius r, k = 0..1 how much is left
function cobweb(x, y, r, k = 1) {
  if (k <= .02) return;
  boilSeed('web');
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45; inkLine([[x, y], [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]], .6, '#E8E4EE', 'inkfine', 0); }
  for (const f of [.35, .65, .95]) { const P = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45; P.push([x + Math.cos(a) * r * f * k, y + Math.sin(a) * r * f * k + (i % 2 ? r * .04 : 0)]); } inkLine(P, .5, '#E8E4EE', 'inkfine', .3); }
}
// tools for the wing-building montage: handed over as arm-tip hooks (hook space: +x runs along the arm)
const hammerHook = (u, sw, swing = 0) => { push(); rotate(swing); paint(rectPts(-.2 * u, -.3 * u, 3.2 * u, .6 * u, u * .02), { wash: WOOD, ink: PAL.ink, sw: sw * .7 }); paint(rectPts(2.5 * u, -1.2 * u, 1.3 * u, 2.4 * u, u * .02), { wash: '#6E7787', ink: PAL.ink, sw: sw * .8 }); pop(); };
const sawHook = (u, sw) => { paint(rectPts(-.3 * u, -.8 * u, 1.3 * u, 1.6 * u, u * .02), { wash: WOOD, ink: PAL.ink, sw: sw * .7 }); const Pb = [[.9, -.7], [5.0, -.2], [5.0, .9], [.9, .7]].map(([a, b]) => [a * u, b * u]); paint(Pb, { wash: '#B9C0CC', ink: PAL.ink, sw: sw * .7 }); for (let i = 0; i < 7; i++) paint([[(1.3 + i * .55) * u, .9 * u], [(1.6 + i * .55) * u, 1.35 * u], [(1.9 + i * .55) * u, .95 * u]], { wash: '#B9C0CC', ink: PAL.ink, sw: sw * .4 }); };
// a sheet of corrugated cardboard
function cardSheet(x, y, w, h, rot = 0) {
  push(); translate(x, y); rotate(rot);
  paint(rectPts(-w / 2, -h / 2, w, h, 1.5), { wash: CARD, fill: CARD_DK, fillOp: 60, tex: .6, ink: PAL.ink, sw: .8 });
  for (let i = 1; i < 6; i++) inkLine([[-w / 2 + 4, -h / 2 + i * h / 6], [w / 2 - 4, -h / 2 + i * h / 6]], .4, CARD_DK, 'inkfine', 0);
  pop();
}
// a knitted pink scarf draped along a path (ribbon with stripes)
function knitScarf(P, wd = 30) {
  const C = through(P, 4);
  paint(ribbon(P, wd, wd), { wash: PINK, ink: PAL.ink, sw: .9 });
  for (let i = 3; i < C.length - 1; i += 4) { const a = C[i - 1], b = C[i + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d; inkLine([[C[i][0] - nx * wd * .42, C[i][1] - ny * wd * .42], [C[i][0] + nx * wd * .42, C[i][1] + ny * wd * .42]], 2.4, PINK_LT, 'inkfine', 0); }
}
// a heart of smoke rising from a chimney: k = 0..1 age
function heartPuff(x, y, s, k, col = PINK) {
  if (k <= 0 || k >= 1) return;
  const a = Math.sin(k * Math.PI), r = s * (.4 + .9 * easeOut(k)), yy = y - k * s * 5, xx = x + Math.sin(k * 5 + x * .01) * s * .6;
  paint(heartPts(xx, yy, r * 1.5), { wash: col, washOp: 240 * Math.min(1, a * 2.2), ink: k < .6 ? PAL.ink : null, sw: .6 });
}
// a window with curtains: close 0..1 draws them together (x, y = top-left)
function curtains(x, y, w, h, close) {
  const cw = w * .5 * clamp(close), wine = '#B4465A';
  if (cw < 2) return;
  for (const side of [0, 1]) {
    const x0 = side ? x + w - cw : x, folds = 3; boilSeed('curt' + side);
    paint(rectPts(x0, y, cw, h, 1), { wash: wine, ink: PAL.ink, sw: .6 });
    for (let i = 1; i < folds; i++) inkLine([[x0 + cw * i / folds, y + 2], [x0 + cw * i / folds + 1, y + h - 2]], .5, mixCol(wine, PAL.ink, .4), 'inkfine', 0);
  }
}
// fire in a hearth: flames wobble on the beat
function flames(x, y, s, t) {
  boilSeed('flames');
  glow(x, y - s * 1.2, s * 4.2, '#FFB04A', .9);
  for (const [dx, hh, col] of [[-1, 2.2, '#E8832B'], [0, 3.1, '#F2A33A'], [1, 2.4, '#E8832B'], [0, 1.8, '#FFD878']]) {
    const w = Math.sin(t * 9 + dx * 2) * .25 * s;
    paint([[x + dx * s * .9 - s * .8, y], [x + dx * s * .9 - s * .5 + w, y - hh * s * .6], [x + dx * s * .9 + w * 1.6, y - hh * s], [x + dx * s * .9 + s * .5 + w, y - hh * s * .55], [x + dx * s * .9 + s * .8, y]], { wash: col, ink: null, curv: .5 });
  }
}

// ---------- LOOPS: the cast, as model sheets ----------
(() => {
  const label = (txt, x, y, size = 20) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });
  const floor = (y, x0 = 0, x1 = W) => inkLine([[x0 + 40, y + 6], [W / 2, y + 4], [x1 - 40, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
  LOOPS.cast = t => {
    const y1 = 400, y2 = 900;
    daidai(150, y1, 17, { ...feel('hopeful', t), view: 'front' }); label('daidai front', 150, y1 + 34);
    daidai(400, y1, 17, { ...feel('cry', t), view: 'q' }); label('q cry', 400, y1 + 34);
    daidai(650, y1, 17, { ...feel('determined', t), view: 'side', wind: .8, walk: t * 1.5 }); label('side wind', 650, y1 + 34);
    daidai(920, y1, 17, { ...feel('scared', t), view: 'front', wings: true, goggles: true, flap: .5 * Math.sin(t * TAU * 2) + .5 }); label('wings front', 920, y1 + 34);
    daidai(1250, y1, 17, { ...feel('excited', t), view: 'side', wings: true, goggles: true, flap: .6 * Math.sin(t * TAU * 2) + .5, wind: -.8, flip: false }); label('wings side', 1250, y1 + 34);
    daidai(1540, y1, 17, { ...feel('sad', t), view: 'front', emote: 'cloud' }); label('sad cloud', 1540, y1 + 34);
    daidai(1780, y1, 17, { ...feel('ko', t), view: 'front' }); label('ko', 1780, y1 + 34);
    floor(y1);
    pigeon(150, 640, 16, { mood: 'proud', letter: true }); label('proud+letter', 150, 674);
    pigeon(400, 640, 16, { mood: 'scared', flap: .6 * Math.sin(t * 14) + .6, fly: true, bob: 20 }); label('scared flap', 400, 674);
    pigeon(650, 640, 16, { mood: 'sly', flip: true }); label('sly (flipped)', 650, 674);
    pigeon(900, 640, 16, { mood: 'blank', bag: false }); label('blank', 900, 674);
    pigeon(1130, 640, 16, { mood: 'ko', rot: .5, bag: true }); label('ko', 1130, 674);
    letterHeart(1350, 600, 16, .2); letterHeart(1500, 600, 16, -.2, { open: true }); label('letter', 1420, 674);
    floor(640);
    giant(250, y2, 28, { ...emoAs(GI, t, [[0, 'angry']]), view: 'front', brow: .7 }); label('铁山 angry', 250, y2 + 36);
    giant(680, y2, 28, { ...emoAs(GI, t, [[0, 'shy']]), view: 'front', brow: -.5, moDroop: 1 }); label('shy', 680, y2 + 36);
    giant(1110, y2, 28, { ...emoAs(GI, t, [[0, 'love']]), view: 'q', brow: -.4 }); label('love q', 1110, y2 + 36);
    giant(1520, y2, 28, { ...emoAs(GI, t, [[0, 'cry']]), view: 'front', scarf: true, wind: .3, brow: -.6 }); label('cry+scarf', 1520, y2 + 36);
    girl(1800, 800, 14, { ...feelAs(GIRL, 'neutral', t) }); label('她', 1800, 836);
    floor(y2);
  };
  LOOPS.cast.len = 4;
})();

// ---------- LOOPS: props sheet ----------
(() => {
  const label = (txt, x, y, size = 18) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });
  LOOPS.props = t => {
    mailbox(160, 330, 30, { flag: .5 + .5 * Math.sin(t * 2), open: 0, key: 'a' }); label('mailbox', 160, 372);
    mailbox(440, 330, 30, { flag: 0, open: .5 + .5 * Math.sin(t * 2), snow: 1, key: 'b' }); label('open+snow', 440, 372);
    cobweb(560, 280, 40, 1); moth(620 + 20 * Math.sin(t * 3), 250, 16);
    snowman(800, 340, 34); label('snowman', 800, 372);
    snowman(1000, 340, 34, { noHead: true, key: 2 }); snowBall(1100 + 40 * Math.sin(t * 3), 320, 28, { face: true, rot: t * 3 }); label('noHead + ball', 1050, 372);
    bouquet(1290, 340, 30, .1); label('bouquet', 1290, 372);
    skullSign(1500, 340, 30); label('skull sign', 1500, 372);
    spikeFence(1620, 1900, 340, 90); 
    stool(120, 640, 30); teaCup(260, 600, 22, 1); stool(400, 640, 30); label('tea', 260, 672);
    miniCloud(620, 520, 90, .5 + .5 * Math.sin(t * 2), { groundY: 650 }); label('cloud', 620, 672);
    letterHeart(820, 600, 22, .1); heartPuff(940, 650, 24, frac(t * .5)); heartPuff(990, 650, 24, frac(t * .5 + .5));
    knitScarf([[1080, 650], [1160, 600], [1240, 640], [1320, 590]], 34); label('scarf', 1200, 672);
    cardSheet(1480, 610, 150, 90, .1); curtains(1620, 560, 120, 100, .6); flames(1850, 660, 22, t);
    clawd(250, 960, 22, { ...feel('determined', t), armR: (u, sw) => hammerHook(u, sw, Math.sin(t * 8) * .6), armL: (u, sw) => sawHook(u, sw) });
    clawd(700, 960, 22, { ...feel('cry', t), emote: null });
    leafFall(t, { n: 10 }); snowFall(t, { n: 30 }); windLines(t, 1, { n: 5, y0: 760, y1: 1000, dir: 1 });
  };
  LOOPS.props.len = 4;
})();
