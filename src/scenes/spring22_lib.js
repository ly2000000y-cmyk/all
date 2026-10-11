// spring22_lib.js: the cast and props for the 《22》 MV. Everything paints with the kit's paint()/inkLine().
// 她 is a sunshine-yellow Clawd block with a ponytail and a teal ribbon; commuters are muted grey-blue blocks.
// Painting helpers (band, ridge, tuft, petal ...) are the generic kind from the toolbox, restyled for spring.

const HAIR = '#3B2A2A', RIB = '#2FB3A3', RIB_DK = '#1F8A7E';
const GIRL = { col: '#F3C94F', dk: '#D49A2B', lt: '#FBE7A0' };
const BLOOM = ['#F7B9C6', '#F2A0B3', '#FBD6DE', '#EE8DA5'];

const emoAs = (base, t, keys, o) => emotions(t, keys.map(k => [k[0], k[1], { ...base, ...(k[2] || {}) }]), o);
const feelAs = (base, name, t, over = {}) => feel(name, t, { ...base, ...over });

// ---------- 她 ----------
// o.wind 0..1.2: the ponytail streams backwards. o.loose 0..1: hair down, no ribbon. o.noTie hides the ribbon only.
// o.pack: a school/travel backpack. o.tieCol recolours the ribbon.
function girl(x, y, u, o = {}) {
  const opts = { ...GIRL, ...o, hat: o.hat || null, blush: Math.max(o.blush || 0, .22) };
  const userDraw = o.draw;
  opts.draw = (uu, sw) => { girlHair(uu, sw, opts); if (opts.pack) girlPack(uu, sw, opts); if (userDraw) userDraw(uu, sw); };
  clawd(x, y, u, opts);
}
function girlHair(u, sw, o) {
  const v = o.view || 'front', V = VIEWS[v] || VIEWS.front, L = V.L * u, R = V.R * u, back = v === 'back' || v === 'qback';
  const bp = bpOf(T), wind = clamp(o.wind || 0, 0, 1.3), loose = clamp(o.loose || 0), sway = .35 * Math.sin(bp * Math.PI + .7) - (o.rot || 0) * 1.5;
  const tailBack = v === 'back';
  const ax = tailBack ? 0 : L + (v === 'side' ? .35 : .5) * u, ay = -7.6 * u;
  // ponytail path: arcs up and out, then falls; wind lays it flat behind her
  const rest = [[ax, ay], [ax - .9 * u, ay - .7 * u], [ax - 1.55 * u + sway * .5 * u, ay + 1.3 * u], [ax - 1.5 * u + sway * u, ay + 3.4 * u]];
  const fl = 1.4 * Math.sin(bp * 4.2) * .35, flat = [[ax, ay], [ax - 1.5 * u, ay - .5 * u], [ax - 3.4 * u, ay - .3 * u + fl * u * .5], [ax - 5.2 * u, ay + fl * u]];
  const P = rest.map((p, i) => [lerp(p[0], flat[i][0], wind), lerp(p[1], flat[i][1], wind)]);
  if (tailBack) { P[0] = [0, -7.6 * u]; P[1] = [.2 * u, -6.2 * u]; P[2] = [-.4 * u + sway * u * .6, -4.6 * u]; P[3] = [.1 * u + sway * u, -2.8 * u]; }
  const w0 = 1.5 * u, w1 = .55 * u;
  if (loose < .5) paint(ribbon(through(P, 5), w0, w1), { wash: HAIR, ink: PAL.ink, sw: sw * .55 });
  else if (v === 'front') { /* hair down, front view: only the side locks show */ }
  else {   // hair down: a curtain behind the head, blown back in the wind
    const bx = (v === 'back' || v === 'qback') ? 0 : L, flat = [[bx + .4 * u, -7.5 * u], [bx - 2.0 * u, -7.0 * u], [bx - 4.0 * u, -6.4 * u + .5 * u * Math.sin(bp * 5)], [bx - 6.0 * u, -6.8 * u + .9 * u * Math.sin(bp * 5 + 1.2)]];
    const down = [[bx + .4 * u, -7.5 * u], [bx - .5 * u, -6.0 * u], [bx - .7 * u + sway * .3 * u, -4.2 * u], [bx - .3 * u + sway * .5 * u, -2.4 * u]];
    const Q = down.map((p, i) => [lerp(p[0], flat[i][0], wind), lerp(p[1], flat[i][1], wind)]);
    if (v === 'back' || v === 'qback') paint([[L - .3 * u, -7.4 * u], [R + .3 * u, -7.4 * u], [R + .4 * u, -3.4 * u + .2 * u * sway], [L * .5, -2.7 * u], [0, -3.3 * u], [R * .5, -2.7 * u], [L - .4 * u, -3.4 * u]], { wash: HAIR, ink: PAL.ink, sw: sw * .6 });
    else paint(ribbon(through(Q, 5), 2.2 * u, lerp(1.5, .25, wind) * u), { wash: HAIR, ink: PAL.ink, sw: sw * .6 });
    for (let i = 0; i < 3; i++) { const S = Q.map((p, k) => [p[0] + (i - 1) * .35 * u * (k ? 1 : 0), p[1] + (i - 1) * .5 * u * (k ? 1 : 0)]); inkLine(through(S, 4), sw * .35, mixCol(HAIR, PAL.cream, .3), 'inkfine', .6); }
  }
  if (!loose && !o.noTie) {   // the teal ribbon: a small bow at the tie
    const [tx, ty] = P[0], rc = o.tieCol || RIB;
    paint(ellPts(tx - .85 * u, ty - .1 * u, .95 * u, .6 * u, 12, 0, -.45), { wash: rc, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(tx + .55 * u, ty - .85 * u, .85 * u, .56 * u, 12, 0, .7), { wash: rc, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(tx, ty - .3 * u, .42 * u, .4 * u, 8), { wash: mixCol(rc, PAL.ink, .25), ink: PAL.ink, sw: sw * .4 });
  }
  // side locks: hair framing the face (a bob at the cheeks)
  if (v !== 'side') for (const ex of (v === 'back' ? [L, R] : [L, R])) { const sgn = ex < 0 ? 1 : -1; paint([[ex - sgn * .2 * u, -7.4 * u], [ex + sgn * 1.1 * u, -7.4 * u], [ex + sgn * 1.0 * u, -4.6 * u], [ex - sgn * .15 * u, -4.4 * u]], { wash: HAIR, ink: PAL.ink, sw: sw * .55 }); }
  else paint([[L - .2 * u, -7.4 * u], [L + 1.2 * u, -7.4 * u], [L + 1.1 * u, -4.5 * u], [L - .1 * u, -4.4 * u]], { wash: HAIR, ink: PAL.ink, sw: sw * .55 });
  // side-swept fringe: a dark cap over the top of the head (full cap from behind)
  const top = -8 * u, fr = back ? -5.8 * u : -7.1 * u, pts = [[L - .2 * u, top - .3 * u], [(L + R) / 2, top - .6 * u], [R + .2 * u, top - .3 * u], [R + .2 * u, fr + .3 * u]];
  const n = Math.max(4, Math.round((R - L) / u / 1.1));
  for (let i = 1; i <= n; i++) { const xx = lerp(R, L, i / n); pts.push([lerp(R, L, (i - .5) / n), fr + .25 * u + (i < n / 2 ? .15 * u : 0)], [xx, fr - .25 * u + (i === n ? .5 * u : 0)]); }
  pts.push([L - .2 * u, fr + .3 * u]);
  paint(pts, { wash: HAIR, ink: PAL.ink, sw: sw * .7 });
  if (!back && v !== 'side') inkLine([[L + 1.4 * u, top - .25 * u], [L + 2.7 * u, top - .45 * u]], sw * .4, mixCol(HAIR, PAL.cream, .45), 'inkfine', .5);
}
// a travel backpack: straps in front, the pack itself on her back
function girlPack(u, sw, o) {
  const v = o.view || 'front', col = '#E0793F', dk = '#B8582B';
  if (v === 'side') {
    paint(rrPts(-4.9 * u, -6.1 * u, 2.5 * u, 3.7 * u, .6 * u), { wash: col, ink: PAL.ink, sw: sw * .7 });
    paint(rectPts(-4.6 * u, -4.4 * u, 1.9 * u, .3 * u), { wash: dk, ink: null });
    inkLine([[-2.4 * u, -6.0 * u], [-1.6 * u, -3.4 * u]], sw * .6, dk, 'ink', .3);
  } else if (v === 'back' || v === 'qback') {
    paint(rrPts(-3.6 * u, -7.0 * u, 7.2 * u, 4.4 * u, .7 * u), { wash: col, ink: PAL.ink, sw: sw * .8 });
    paint(rectPts(-3.3 * u, -4.5 * u, 6.6 * u, .35 * u), { wash: dk, ink: null });
    paint(rrPts(-1.9 * u, -3.9 * u, 3.8 * u, 1.2 * u, .3 * u), { wash: dk, ink: PAL.ink, sw: sw * .4 });
  } else {
    for (const s of [-1, 1]) inkLine([[s * 3.1 * u, -7.7 * u], [s * 3.5 * u, -2.4 * u]], sw * 1.1, dk, 'ink', .3);
    paint(rrPts(-6.2 * u, -6.2 * u, 1.5 * u, 3 * u, .5 * u), { wash: col, ink: PAL.ink, sw: sw * .6 });
  }
}

// ---------- commuters: muted grey-blue blocks in hats ----------
const DRONES = [{ col: '#8792B2', dk: '#5E6889', lt: '#B6BFD8' }, { col: '#93A89F', dk: '#677E75', lt: '#BFD0C8' }, { col: '#A89BB0', dk: '#7C6F86', lt: '#CBC0D3' }, { col: '#B3A898', dk: '#877D6E', lt: '#D3CABB' }];
const DRONE_HATS = ['fedora', 'hard', 'beanie', null, 'top', null];
function drone(x, y, u, o = {}) {
  const k = o.k || 0, base = DRONES[k % DRONES.length];
  const opts = { ...base, hat: o.hat === undefined ? DRONE_HATS[k % DRONE_HATS.length] : o.hat, eyes: 'blank', ...o };
  const userDraw = o.draw;
  opts.draw = (uu, sw) => {
    const v = opts.view || 'front';
    if (v === 'front' || v === 'q') { const c = v === 'q' ? 1.2 * uu : 0; paint([[c - .55 * uu, -3.2 * uu], [c + .55 * uu, -3.2 * uu], [c + .9 * uu, -2.0 * uu], [c, -1.4 * uu], [c - .9 * uu, -2.0 * uu]], { wash: mixCol(base.dk, PAL.ink, .35), ink: PAL.ink, sw: sw * .4 }); }
    if (userDraw) userDraw(uu, sw);
  };
  clawd(x, y, u, opts);
}

// ---------- painting helpers (generic) ----------
function band(x0, x1, yTop, yBot, col, o = {}) {
  const n = o.n || 10, P = [];
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); P.push([x, (typeof yTop === 'function' ? yTop(x) : yTop) + jit(o.j ?? 6)]); }
  for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); P.push([x, (typeof yBot === 'function' ? yBot(x) : yBot) + jit(o.j ?? 6)]); }
  paint(P, { wash: col, washOp: o.op ?? 255, ink: o.ink ?? null, sw: o.sw ?? .8, curv: o.curv });
}
const ridge = (seed, base, amp, f = 1) => x => base - amp * (.55 * Math.sin(x * .0021 * f + seed) + .3 * Math.sin(x * .0057 * f + seed * 2.3) + .15 * Math.sin(x * .013 * f + seed * 4.1));
function tuft(x, y, h, col, t, i = 0, sw = .7, amp = .22) {
  const s = wob(t, .45, hash(i) * 3) * h * amp;
  for (const k of [-1, 0, 1]) inkLine([[x + k * h * .25, y], [x + k * h * .42 + s, y - h * (.8 + .3 * hash(i + k + 7))]], sw, col, 'inkfine', .4);
}
function cloudPuff(x, y, w, col, op = 255) {
  const P = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, up = Math.sin(a) < 0, r = up ? 1 + .3 * Math.abs(Math.sin(a * 3.5)) : 1; P.push([x + Math.cos(a) * w * r, y + Math.sin(a) * (up ? .42 : .2) * w * r]); }
  paint(P, { wash: col, washOp: op, ink: null, curv: .4 });
}
function sunDisc(x, y, r, col = '#FFE6A8') { paint(ellPts(x, y, r, r, 30, 1.5), { wash: col, ink: null }); }
function petal(x, y, s, rot, col = '#F2A0AE') { push(); translate(x, y); rotate(rot); paint([[0, -s], [s * .55, 0], [0, s * .6], [-s * .55, 0]], { wash: col, ink: PAL.ink, sw: .45, curv: .6 }); pop(); }
function dust(x, y, r, k, col = '#E2D6BC') {
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < 6; i++) {
    const a = Math.PI + (i / 5) * Math.PI, d = r * (.3 + .9 * easeOut(k)) * (.7 + .5 * hash(i + 11)), rr = r * (.25 + .35 * easeOut(k)) * (1 - k * .4);
    const px = x + Math.cos(a) * d * 1.4, py = y + Math.sin(a) * d * .5 - r * .25 * k, P = [];
    for (let j = 0; j < 20; j++) { const b = j / 20 * TAU, bump = 1 + .2 * Math.abs(Math.sin(b * 2.5 + i)); P.push([px + Math.cos(b) * rr * bump, py + Math.sin(b) * rr * .75 * bump]); }
    paint(P, { wash: col, washOp: 190 * (1 - k * k), ink: k < .12 ? mixCol(col, PAL.ink, .4) : null, sw: .4, curv: .5 });
  }
}
function sprout(x, y, s, k) {
  if (k <= 0) return;
  const g = backOut(k), h = 1.4 * s * g;
  inkLine([[x, y], [x + .05 * s, y - h * .5], [x, y - h]], clamp(s / 10, .6, 2), '#4E8B3A', 'ink', .5);
  for (const d of [-1, 1]) { push(); translate(x, y - h); rotate(d * (.6 + .2 * Math.sin(T * 3 + d))); paint(ellPts(d * .45 * s * g, 0, .5 * s * g, .25 * s * g, 14), { wash: '#7DB062', ink: PAL.ink, sw: .6 }); pop(); }
}
function rainStreaks(t, n, col = '#9FB2E0', len = 46, slant = .25, sw = .7, key = 'rain') {
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const sp = 1500 + 500 * hash(i + 7), x0 = hash(i) * (W + 400) - 200, ph = frac(hash(i + 3) + t * sp / (H + 200));
    const y = ph * (H + 200) - 100, x = x0 + slant * y;
    inkLine([[x, y], [x + slant * len, y + len]], sw, col, 'inkfine', 0);
  }
}
function speedLines(k, dir = 1, col = PAL.cream, n = 14) {
  if (k <= .02) return;
  boilSeed('speed');
  for (let i = 0; i < n; i++) {
    const y = 60 + (H - 120) * hash(i + 90), L = (300 + 600 * hash(i + 91)) * k, x = W * hash(i + 92);
    inkLine([[x, y], [x + dir * L, y + jit(3)]], 1.2 + 1.8 * hash(i + 93), col, 'inkfine', 0);
  }
}
function soundRing(x, y, r, col, sw, a0 = -1.2, a1 = 1.2) {
  const P = []; for (let i = 0; i <= 14; i++) { const a = lerp(a0, a1, i / 14); P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .8]); }
  inkLine(P, sw, col, 'ink', .6);
}
// a jagged noise burst (scribble spikes), k 0..1 age
function noiseBurst(x, y, s, col, k, seed = 0) {
  if (k <= 0 || k >= 1) return;
  const P = [], n = 14, g = easeOut(k * 1.6);
  for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, r = s * g * (i % 2 ? .45 : 1) * (.8 + .4 * hash(i + seed)); P.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  paint(P, { wash: col, washOp: 255 * (1 - k * k), ink: PAL.ink, sw: .8 * (1 - k * .5) });
}
function lantern(x, y, s, o = {}) {
  inkLine([[x, y], [x, y + .5 * s]], clamp(s / 40, .5, 1), PAL.ink, 'inkfine', 0);
  paint(ellPts(x, y + 1.2 * s, .6 * s, .72 * s, 18), { wash: o.col || '#F0A64A', ink: PAL.ink, sw: clamp(s / 50, .5, 1) });
  paint(rectPts(x - .32 * s, y + .45 * s, .64 * s, .15 * s), { wash: PAL.ink, ink: null });
  paint(rectPts(x - .32 * s, y + 1.86 * s, .64 * s, .15 * s), { wash: PAL.ink, ink: null });
  paint(ellPts(x - .15 * s, y + 1.1 * s, .18 * s, .42 * s, 10), { wash: '#FFE3A1', washOp: 200, ink: null });
}

// ---------- blossoms ----------
// a blossom tree: trunk + a cloud canopy of pink blobs. (x, y) = ground; s = height; o.lean tips the trunk
function blossomTree(x, y, s, o = {}) {
  const sw = clamp(s / 260, .5, 1.2), lean = (o.lean || 0) * s, cr = .36 * s;
  paint(ribbon([[x, y], [x + lean * .3, y - s * .4], [x + lean, y - s * .66]], .09 * s, .035 * s), { wash: '#6E4C46', ink: PAL.ink, sw });
  const cx = x + lean, cy = y - s * .8;
  const blobs = [[-.55, .18, .62, 2], [.55, .12, .66, 1], [0, -.3, .78, 0], [-.25, .3, .55, 3], [.3, .34, .5, 2], [-.85, -.05, .4, 1], [.88, -.1, .42, 3]];
  blobs.forEach(([dx, dy, rr, c], i) => paint(ellPts(cx + dx * cr, cy + dy * cr, rr * cr, rr * cr * .82, 30, cr * .015), { wash: BLOOM[c], ink: o.ink === false ? null : PAL.ink, sw: sw * .6, curv: .6 }));
  for (let i = 0; i < 14; i++) { const a = hash(i + 5) * TAU, d = hash(i + 6) * cr * 1.1; paint(ellPts(cx + Math.cos(a) * d * 1.1, cy + Math.sin(a) * d * .8, cr * .06, cr * .05, 7), { wash: '#FFF0F2', washOp: 220, ink: null }); }
}
// a foreground blossom branch entering from one side: base (x, y) and tip direction; returns the ribbon tip point
function blossomBranch(x, y, len, ang, o = {}) {
  const sw = o.sw || .9, sag = o.sag || 0, P = [];
  for (let i = 0; i <= 4; i++) { const k = i / 4; P.push([x + Math.cos(ang) * len * k, y + Math.sin(ang) * len * k + sag * Math.sin(k * Math.PI * .5) * len * .1 * k + (o.sway || 0) * k * k * 14]); }
  paint(ribbon(through(P, 4), (o.w0 || 26), 6), { wash: '#6E4C46', ink: PAL.ink, sw });
  const tip = P[P.length - 1];
  for (let i = 1; i <= 8; i++) {
    const k = i / 8, p = through(P, 6)[Math.round(k * (through(P, 6).length - 1))], r = (o.r || 46) * (1 - k * .4) * (.8 + .4 * hash(i + (o.seed || 0)));
    const side = i % 2 ? -1 : 1;
    for (let j = 0; j < 3; j++) paint(ellPts(p[0] + side * r * .5 + (j - 1) * r * .5, p[1] - side * r * .7 + (j % 2) * r * .3, r * .62, r * .5, 12, 2), { wash: BLOOM[(i + j) % 4], ink: PAL.ink, sw: sw * .55, curv: .3 });
  }
  return tip;
}

// ---------- clock (no numerals): the wedge is the minutes left ----------
// mins: minute-hand position 0..60 (the red wedge is the arc from the hand to 12). o.shake: alarm rattle 0..1
function clockFace(x, y, r, mins, o = {}) {
  const sw = clamp(r / 90, .6, 1.4), sh = o.shake || 0;
  push(); translate(x + sh * Math.sin(T * 90) * r * .04, y + sh * Math.cos(T * 70) * r * .03); rotate(sh * Math.sin(T * 60) * .05);
  paint(ellPts(0, 0, r * 1.1, r * 1.1, 32), { wash: o.rim || '#6C7A92', ink: PAL.ink, sw });
  paint(ellPts(0, 0, r, r, 32), { wash: '#FFF8EA', ink: PAL.ink, sw: sw * .6 });
  const a = m => -Math.PI / 2 + m / 60 * TAU;
  const wedge = [[0, 0]]; const steps = Math.max(2, Math.round(Math.abs(60 - mins) / 2)), m0 = mins % 60;
  for (let i = 0; i <= steps; i++) { const m = lerp(m0, 60, i / steps); wedge.push([Math.cos(a(m)) * r * .92, Math.sin(a(m)) * r * .92]); }
  if (m0 < 59.5 && !o.noWedge) paint(wedge, { wash: '#EC6B5E', washOp: 210, ink: null });
  for (let i = 0; i < 12; i++) { const big = i % 3 === 0, aa = a(i * 5); inkLine([[Math.cos(aa) * r * (big ? .74 : .82), Math.sin(aa) * r * (big ? .74 : .82)], [Math.cos(aa) * r * .93, Math.sin(aa) * r * .93]], sw * (big ? 1 : .6), PAL.ink, 'inkfine', 0); }
  const hh = a((o.hour ?? 12.2) * 5);   // hour hand
  inkLine([[0, 0], [Math.cos(hh) * r * .5, Math.sin(hh) * r * .5]], sw * 1.5, PAL.ink, 'ink', 0);
  inkLine([[0, 0], [Math.cos(a(mins)) * r * .82, Math.sin(a(mins)) * r * .82]], sw * 1.1, PAL.ink, 'ink', 0);
  paint(ellPts(0, 0, r * .07, r * .07, 8), { wash: PAL.ink, ink: null });
  if (o.bells) for (const s of [-1, 1]) { push(); rotate(s * .7); paint(ellPts(0, -r * 1.22, r * .22, r * .16, 10), { wash: '#E8B94A', ink: PAL.ink, sw: sw * .6 }); pop(); }
  pop();
}

// ---------- lunch, cake, books ----------
function bento(x, y, s, o = {}) {
  const sw = clamp(s / 70, .5, 1.1), eaten = o.eaten || 0;
  paint(rrPts(x - 1.7 * s, y - 1.0 * s, 3.4 * s, 1.2 * s, .35 * s), { wash: '#C7523F', ink: PAL.ink, sw });
  paint(rrPts(x - 1.5 * s, y - 1.2 * s, 3.0 * s, .6 * s, .25 * s), { wash: '#F7F1E4', ink: PAL.ink, sw: sw * .7 });   // rice
  paint(ellPts(x + .95 * s, y - 1.1 * s, .5 * s * (1 - eaten * .6), .32 * s * (1 - eaten * .6), 12), { wash: '#F2C94C', ink: PAL.ink, sw: sw * .5 });   // egg
  paint(ellPts(x - .2 * s, y - 1.18 * s, .55 * s * (1 - eaten * .8), .26 * s * (1 - eaten * .8), 12), { wash: '#6FAE5A', ink: PAL.ink, sw: sw * .5 });   // greens
  if (o.steam) for (let i = 0; i < 3; i++) { const sx = x + (i - 1) * .8 * s, ph = frac(T * .8 + i * .33); inkLine([[sx, y - 1.5 * s - ph * 1.5 * s], [sx + .25 * s * Math.sin(ph * 6 + i), y - 2.0 * s - ph * 1.6 * s], [sx - .1 * s, y - 2.5 * s - ph * 1.7 * s]], sw * .6, '#FFFFFF', 'inkfine', .6); }
}
// a cupcake on a plate with two candles; lit 0..1 flame size; smoke 0..1 after blowing out
function cupcake(x, y, s, o = {}) {
  const sw = clamp(s / 60, .5, 1.1);
  paint(ellPts(x, y, 2.4 * s, .45 * s, 20), { wash: '#F4EDE0', ink: PAL.ink, sw: sw * .7 });
  paint([[x - 1.3 * s, y - .25 * s], [x + 1.3 * s, y - .25 * s], [x + .95 * s, y - 1.5 * s], [x - .95 * s, y - 1.5 * s]], { wash: '#7FB7C9', ink: PAL.ink, sw });
  for (let i = -2; i <= 2; i++) inkLine([[x + i * .5 * s, y - .3 * s], [x + i * .38 * s, y - 1.45 * s]], sw * .4, '#5E97AB', 'inkfine', 0);
  paint(ellPts(x, y - 1.7 * s, 1.35 * s, .75 * s, 18, 1), { wash: '#FBD6DE', ink: PAL.ink, sw });
  paint(ellPts(x, y - 2.3 * s, .9 * s, .55 * s, 16, 1), { wash: '#F7B9C6', ink: PAL.ink, sw: sw * .8 });
  paint(ellPts(x, y - 2.75 * s, .5 * s, .35 * s, 12, 1), { wash: '#FBD6DE', ink: PAL.ink, sw: sw * .7 });
  for (const [cx2, ph] of [[-.55, 0], [.55, 1]]) {
    const cx = x + cx2 * s, cy = y - 2.6 * s;
    paint(rectPts(cx - .1 * s, cy - 1.05 * s, .2 * s, 1.1 * s), { wash: ph ? '#F2C94C' : '#EC6B5E', ink: PAL.ink, sw: sw * .6 });
    const l = o.lit ?? 0;
    if (l > .02) {
      const fl = 1 + .12 * Math.sin(T * 25 + ph * 2);
      push(); translate(cx, cy - 1.15 * s); paint([[0, .1 * s], [.22 * s * l, -.15 * s * l], [0, -.75 * s * l * fl], [-.22 * s * l, -.15 * s * l]], { wash: '#FFC15A', ink: null, curv: .6 });
      paint([[0, .05 * s], [.1 * s * l, -.1 * s * l], [0, -.4 * s * l], [-.1 * s * l, -.1 * s * l]], { wash: '#FFF2B8', ink: null, curv: .6 }); pop();
      glow(cx, cy - 1.4 * s, 2.4 * s * l, '#FFC766', .8 * l);
    }
    if (o.smoke > 0 && o.smoke < 1) { const k = o.smoke; inkLine([[cx, cy - 1.1 * s], [cx + .4 * s * Math.sin(k * 6 + ph), cy - 1.1 * s - k * 2.2 * s], [cx - .3 * s * Math.sin(k * 5), cy - 1.1 * s - k * 3.6 * s]], sw * .6, mixCol('#CFC8D4', PAL.paper, k), 'inkfine', .7); }
  }
}
const BOOKCOLS = ['#D8574B', '#4B8FB5', '#E8B94A', '#6FAE7E', '#8E6BB0'];
function bookStack(x, y, s, n = 5, o = {}) {   // a stack of closed books, spines toward us; (x, y) = bottom centre
  const sw = clamp(s / 70, .5, 1);
  for (let i = 0; i < n; i++) {
    const w = (3.0 - .2 * hash(i + 5)) * s, h = .55 * s, off = (hash(i + 9) - .5) * .5 * s;
    paint(rrPts(x - w / 2 + off, y - (i + 1) * h, w, h, .1 * s), { wash: BOOKCOLS[(i + (o.seed || 0)) % 5], ink: PAL.ink, sw });
    paint(rectPts(x - w / 2 + off + w * .06, y - (i + 1) * h + h * .3, w * .88, h * .12), { wash: '#FFF3D2', ink: null });
  }
}
// an open book flapping its covers like wings: flap -1..1
function flapBook(x, y, s, rot, flap, col = '#D8574B') {
  push(); translate(x, y); rotate(rot);
  const a = .25 + .65 * flap;
  for (const d of [-1, 1]) {
    push(); rotate(d * a);
    paint([[0, 0], [d * 1.7 * s, -.25 * s], [d * 1.75 * s, .6 * s], [0, .45 * s]], { wash: '#FFF8E8', ink: PAL.ink, sw: .6 });
    paint([[0, 0], [d * 1.7 * s, -.25 * s], [d * 1.7 * s, -.4 * s], [0, -.15 * s]], { wash: col, ink: PAL.ink, sw: .5 });
    pop();
  }
  paint(rectPts(-.12 * s, -.2 * s, .24 * s, .8 * s), { wash: col, ink: PAL.ink, sw: .5 });
  pop();
}

// ---------- plants ----------
// a potted plant growing: k 0..1 = soil → sprout → leaves → bud → blossom. (x, y) = pot base centre
function potPlant(x, y, s, k, o = {}) {
  const sw = clamp(s / 60, .5, 1.1);
  paint([[x - 1.5 * s, y - 2.5 * s], [x + 1.5 * s, y - 2.5 * s], [x + 1.15 * s, y], [x - 1.15 * s, y]], { wash: '#D98A5E', ink: PAL.ink, sw });
  paint(rectPts(x - 1.7 * s, y - 2.9 * s, 3.4 * s, .55 * s, 1), { wash: '#C9744A', ink: PAL.ink, sw });
  paint(ellPts(x, y - 2.9 * s, 1.5 * s, .22 * s, 16), { wash: '#6A4A3A', ink: PAL.ink, sw: sw * .6 });
  if (k <= 0) return;
  const stem = ease(clamp(k / .55)) * 5.2 * s, base = [x, y - 2.95 * s], sway = Math.sin(T * 1.8) * .15 * s * k;
  const P = [base, [x + .15 * s + sway * .3, base[1] - stem * .5], [x - .1 * s + sway, base[1] - stem]];
  inkLine(through(P, 5), clamp(s / 11, .8, 3.2), '#4E8B3A', 'ink', .5);
  const nl = Math.floor(clamp((k - .08) / .5) * 5);
  for (let i = 0; i < nl; i++) {
    const kk = (i + 1) / 6, p = through(P, 5)[Math.round(kk * 15)] || P[2], d = i % 2 ? 1 : -1, g = backOut(clamp((k - .08 - i * .1) / .2));
    push(); translate(p[0], p[1]); rotate(d * (.55 - i * .04) + sway * .02); paint(ellPts(d * .85 * s * g, 0, 1.0 * s * g, .38 * s * g, 14), { wash: i % 2 ? '#7DB062' : '#5E9A4E', ink: PAL.ink, sw: sw * .7 }); pop();
  }
  const tip = P[2];
  if (k > .55) {   // bud → bloom
    const b = clamp((k - .55) / .45), r = (.35 + 1.0 * b) * s;
    if (b < .5) paint(ellPts(tip[0], tip[1] - .3 * s, .45 * s * (b * 2 + .4), .6 * s * (b * 2 + .4), 12), { wash: BLOOM[1], ink: PAL.ink, sw: sw * .7 });
    else { for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2 + .3 * Math.sin(T) * .1; paint(ellPts(tip[0] + Math.cos(a) * r * .8, tip[1] - .3 * s + Math.sin(a) * r * .8, r * .62, r * .5, 12, 0, a), { wash: BLOOM[i % 4], ink: PAL.ink, sw: sw * .6 }); }
      paint(ellPts(tip[0], tip[1] - .3 * s, r * .38, r * .38, 10), { wash: '#F6C744', ink: PAL.ink, sw: sw * .5 }); }
  }
  return tip;
}

// ---------- the dream: a petal boat and paper cranes ----------
function petalBoat(x, y, s, rot = 0, o = {}) {
  push(); translate(x, y); rotate(rot);
  const sw = clamp(s / 50, .5, 1.2), part = o.part || 'all';
  if (part !== 'front') {   // mast and sail (behind her), and the dark inside of the boat
    paint([[-3.0 * s, -.3 * s], [3.4 * s, -.4 * s], [2.2 * s, .15 * s], [-2.0 * s, .15 * s]], { wash: '#C77C92', ink: null });
    inkLine([[.2 * s, 0], [.2 * s, -4.2 * s]], sw, '#6E4C46', 'ink', 0);
    paint([[.35 * s, -4.0 * s], [2.5 * s, -1.6 * s], [.35 * s, -.9 * s]], { wash: '#FFF8E8', ink: PAL.ink, sw: sw * .8, curv: .3 });
  }
  if (part !== 'back') {   // the petal hull
    paint([[-3.6 * s, -.4 * s], [-2 * s, 1.0 * s], [2 * s, 1.0 * s], [4.2 * s, -.9 * s], [2.6 * s, -.1 * s], [0, .15 * s], [-2.2 * s, -.1 * s]], { wash: '#F6B2C2', ink: PAL.ink, sw, curv: .55 });
    paint([[-2.2 * s, .1 * s], [2.4 * s, .1 * s], [1.8 * s, .75 * s], [-1.6 * s, .75 * s]], { wash: '#EE8DA5', washOp: 200, ink: null });
  }
  if (o.glowK && part !== 'front') glow(x, y - 1.5 * s, 6 * s, '#FFD58A', o.glowK);
  pop();
}
function crane(x, y, s, flap, col = '#FFF1D0') {
  const d = Math.sin(flap) * .9 * s;
  push(); translate(x, y);
  paint([[-1.2 * s, 0], [0, -.35 * s], [1.3 * s, -.25 * s], [2.0 * s, -.85 * s], [1.3 * s, .0], [0, .3 * s]], { wash: col, ink: PAL.ink, sw: .6, curv: .2 });   // body + neck
  paint([[-.3 * s, -.1 * s], [-1.1 * s, -1.2 * s - d], [.9 * s, -.2 * s]], { wash: mixCol(col, '#F7B9C6', .5), ink: PAL.ink, sw: .6 });   // wing up
  paint([[-.2 * s, .1 * s], [-1.3 * s, .9 * s + d * .6], [.8 * s, .2 * s]], { wash: mixCol(col, '#8FC3D8', .4), ink: PAL.ink, sw: .6 });
  paint([[-1.2 * s, 0], [-2.3 * s, -.4 * s], [-1.2 * s, .25 * s]], { wash: col, ink: PAL.ink, sw: .5 });   // tail
  pop();
}

// ---------- storm: a scribble cloud, thorns, rocks ----------
// a tangle of looping scribbles that reads as a dark cloud of troubles; k = size 0..1
function scribbleCloud(x, y, w, t, k = 1, col = '#4B5470') {
  if (k <= 0) return;
  boilSeed('scribble');
  const base = [];
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, up = Math.sin(a) < 0; base.push([x + Math.cos(a) * w * k * (1 + .18 * Math.sin(a * 4 + t * 2)), y + Math.sin(a) * w * k * (up ? .5 : .28)]); }
  paint(base, { wash: col, washOp: 235, ink: PAL.ink, sw: 1, curv: .5 });
  for (let j = 0; j < 7; j++) {   // loops of ink over the top
    const P = []; const cx = x + (hash(j + 1) - .5) * w * k * 1.2, cy = y + (hash(j + 8) - .6) * w * k * .3, r = w * k * (.28 + .2 * hash(j + 15));
    for (let i = 0; i < 30; i++) { const a = i / 30 * TAU * 2.4 + j + t * .8; P.push([cx + Math.cos(a) * r * (1 + i * .02), cy + Math.sin(a) * r * .55 * (1 + i * .02)]); }
    inkLine(P, 1.2, mixCol(col, PAL.ink, .5), 'ink', .6);
  }
}
function lightning(x, y, len, k) {
  if (k <= 0 || k >= 1) return;
  const P = [[x, y]]; let px = x, py = y; for (let i = 0; i < 7; i++) { px += (hash(i + 33) - .5) * len * .35; py += len / 7; P.push([px, py]); }
  paint(ribbon(P, 14 * (1 - k), 3), { wash: '#FFF0A8', washOp: 255 * (1 - k), ink: null });
  glow(P[3][0], P[3][1], len * .8, '#FFF3B0', .7 * (1 - k));
}
function rock(x, y, s, col = '#8A8696') {
  paint([[x - 1.6 * s, y], [x - 1.3 * s, y - 1.1 * s], [x - .3 * s, y - 1.7 * s], [x + .8 * s, y - 1.4 * s], [x + 1.5 * s, y - .5 * s], [x + 1.7 * s, y]], { wash: col, ink: PAL.ink, sw: .9, curv: .15 });
  paint([[x - .9 * s, y - .8 * s], [x - .2 * s, y - 1.4 * s], [x + .2 * s, y - 1.0 * s]], { wash: mixCol(col, PAL.cream, .3), washOp: 180, ink: null });
}
function thorns(x, y, s, t) {
  boilSeed('thorns' + Math.round(x));
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * .32, L = s * (1.4 + .5 * hash(i + 3)), P = [[x + (i - 3) * .25 * s, y], [x + Math.cos(a) * L * .6 + Math.sin(t + i) * 3, y + Math.sin(a) * L * .6], [x + Math.cos(a + .5) * L, y + Math.sin(a + .3) * L]];
    inkLine(through(P, 4), 2.4, '#4F6B4A', 'ink', .5);
    for (let k = 1; k <= 3; k++) { const p = through(P, 4)[k * 4]; if (p) inkLine([[p[0], p[1]], [p[0] + (k % 2 ? 1 : -1) * .35 * s, p[1] - .3 * s]], 1.4, '#3E5A3B', 'ink', 0); }
  }
}
// a taxi, side view facing right (o.flip left)
function taxi(x, y, s, o = {}) {
  const sw = clamp(s / 22, .5, 1.5);
  push(); translate(x, y - (o.bob || 0)); if (o.flip) scale(-1, 1);
  const P = pts => pts.map(([a, b]) => [a * s, b * s]);
  paint(ellPts(0, .1 * s, 8 * s, .5 * s, 18), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null });
  paint(P([[-7.5, -1.0], [-7.7, -2.4], [-6.0, -3.0], [-3.8, -3.1], [-2.4, -5.0], [2.4, -5.0], [4.2, -3.1], [7.2, -2.6], [7.8, -1.6], [7.5, -1.0]]), { wash: '#F2C94C', ink: PAL.ink, sw });
  paint(P([[-2.0, -4.6], [-.1, -4.6], [-.1, -3.1], [-3.4, -3.1]]), { wash: '#CFE6F0', ink: PAL.ink, sw: sw * .6 });
  paint(P([[.4, -4.6], [2.0, -4.6], [3.3, -3.1], [.4, -3.1]]), { wash: '#CFE6F0', ink: PAL.ink, sw: sw * .6 });
  paint(rectPts(-1.2 * s, -5.6 * s, 2.2 * s, .6 * s), { wash: '#FFF2B8', ink: PAL.ink, sw: sw * .5 });
  for (const wx of [-4.6, 4.4]) { paint(ellPts(wx * s, -1.0 * s, 1.15 * s, 1.15 * s, 16), { wash: '#3A3340', ink: PAL.ink, sw }); paint(ellPts(wx * s, -1.0 * s, .55 * s, .55 * s, 12), { wash: '#D9D3C4', ink: PAL.ink, sw: sw * .6 }); }
  pop();
}
