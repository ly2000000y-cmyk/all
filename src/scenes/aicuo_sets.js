// aicuo_sets.js: background plates for the 《爱错》 MV. Each set paints once (see usePlate in core.js) in world
// coordinates, with a palette per season / time of day. Depth comes from overlap, scale and colour: far = paler and bluer.
//
// The valley (world coordinates of the hill sets): 呆呆's hill on the left (ground y = 882, mailbox at x = 760, a cliff at
// x = 1500), 铁山's cottage down in the valley (x ≈ 1850, y ≈ 1160), and 她's house on the far right hill (window at 2046, 572).

const SETC = {
  autumn:      { top: '#F0C07E', mid: '#F6D9A4', low: '#FAEACB', far1: '#D8B096', far2: '#C99486', hill: '#D6A04E', hill2: '#BF7F38', line: '#7C5028', ground: '#C8903E', cloud: '#FBE2BC', leaf: ['#D9822B', '#C2552D', '#E8AA38', '#A9482E'], tree: '#6B452B' },
  autumnNight: { top: '#161C46', mid: '#2A3170', low: '#4A4A86', far1: '#363E70', far2: '#2C3566', hill: '#6A5440', hill2: '#52412F', line: '#2E2630', ground: '#5E4A38', cloud: '#434B88', leaf: ['#8A5A2E', '#7A3A2A', '#8E7030', '#6A3226'], tree: '#2E2230' },
  grey:        { top: '#AEB4BE', mid: '#C5C9CF', low: '#DADAD5', far1: '#A5AAB2', far2: '#959CA6', hill: '#A99A78', hill2: '#8E8160', line: '#564E3A', ground: '#9A8B68', cloud: '#E1E1DE', leaf: ['#A88548', '#8C6A3C', '#9C7A44', '#7A5A34'], tree: '#4C3E34' },
  snow:        { top: '#6F7BB8', mid: '#A39CCB', low: '#F0C6D2', far1: '#8C90C2', far2: '#7B80B2', hill: '#EEF1FA', hill2: '#C8D2EA', line: '#7580AE', ground: '#E8EDF8', cloud: '#BDB6DC', leaf: [], tree: '#3E3A52' },
  snowNight:   { top: '#10173B', mid: '#1E2858', low: '#32407A', far1: '#2A3668', far2: '#232E5C', hill: '#B7C4E2', hill2: '#8D9EC8', line: '#4C5C8C', ground: '#A9B8DA', cloud: '#3A4585', leaf: [], tree: '#232038' },
  dusk:        { top: '#5C58A4', mid: '#B77DB0', low: '#F8B88A', far1: '#7E6AA8', far2: '#5F5A98', hill: '#5A5C8E', hill2: '#464B80', line: '#343A68', ground: '#4E5488', cloud: '#E7A6B6', leaf: [], tree: '#2E2A4A' },
};
const HILL_Y = 882, CLIFF_X = 1500, MBX = 760, GWIN = [2046, 572];

// ---------- little helpers ----------
function skyA(S, x0 = -300, x1 = 2600, y0 = -400, y1 = 800) {
  boilSeed('sky');
  paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: S.top, ink: null });
  bandP(x0, x1, y0 + (y1 - y0) * .42, y1, S.mid, { j: 14, n: 14 });
  bandP(x0, x1, y0 + (y1 - y0) * .72, y1, S.low, { j: 12, n: 14 });
}
// a wobbly band of colour between two edges (numbers or functions of x)
function bandP(x0, x1, yTop, yBot, col, o = {}) {
  const n = o.n || 10, P = [];
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); P.push([x, (typeof yTop === 'function' ? yTop(x) : yTop) + jit(o.j ?? 6)]); }
  for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); P.push([x, (typeof yBot === 'function' ? yBot(x) : yBot) + jit(o.j ?? 6)]); }
  paint(P, { wash: col, washOp: o.op ?? 255, ink: o.ink ?? null, sw: o.sw ?? .8, curv: o.curv });
}
const ridgeF = (seed, base, amp, f = 1) => x => base - amp * (.55 * Math.sin(x * .0021 * f + seed) + .3 * Math.sin(x * .0057 * f + seed * 2.3) + .15 * Math.sin(x * .013 * f + seed * 4.1));
function puffCloud(x, y, w, col, op = 255) {
  const P = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, up = Math.sin(a) < 0, r = up ? 1 + .3 * Math.abs(Math.sin(a * 3.5)) : 1; P.push([x + Math.cos(a) * w * r, y + Math.sin(a) * (up ? .42 : .2) * w * r]); }
  paint(P, { wash: col, washOp: op, ink: null, curv: .4 });
}
function sunDisc(x, y, r, col = '#FFE6A8', halo = '#FFE6A8') {
  paint(ellPts(x, y, r * 2.6, r * 2.6, 28), { fill: halo, fillOp: 70, bleed: .4, tex: .2, ink: null });
  paint(ellPts(x, y, r, r, 30, 1.5), { wash: col, ink: null });
}
function starsA(x0, x1, y0, y1, n, seed = 0) {
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, hash(i + seed)), y = lerp(y0, y1, hash(i + seed + 300)), r = 2 + 4 * hash(i + seed + 600); paint(starPts(x, y, r, .35, 4), { wash: '#FFF5E2', washOp: 160 + 90 * hash(i + seed + 900), ink: null }); }
}
function pineRow(x0, x1, yBase, h, col, step = 60) {
  const P = [[x0, yBase + h * 1.5]];
  for (let x = x0; x <= x1; x += step) { const hh = h * (.6 + .6 * hash(x * .31)); P.push([x, yBase], [x + step * .5, yBase - hh]); }
  P.push([x1, yBase], [x1, yBase + h * 1.5]);
  paint(P, { wash: col, ink: null });
}

// ---------- the small cottage (铁山's, seen from afar) and her house ----------
function cottage(x, y, s, o = {}) {
  const sw = clamp(s / 150, .5, 1.1), wall = o.wall || '#7A7684', roof = o.roof || '#34304A';
  boilSeed('cottage' + (o.key || ''));
  paint(rectPts(x + s * .22, y - s * 1.05, s * .14, s * .42, 1), { wash: mixCol(wall, PAL.ink, .2), ink: PAL.ink, sw: sw * .8 });   // chimney
  paint(rectPts(x - s * .5, y - s * .55, s, s * .55, 1), { wash: wall, ink: PAL.ink, sw });
  for (let i = 1; i < 4; i++) inkLine([[x - s * .5, y - s * .55 + i * s * .14], [x, y - s * .55 + i * s * .14 + 1], [x + s * .5, y - s * .55 + i * s * .14]], sw * .4, mixCol(wall, PAL.ink, .35), 'inkfine', 0);
  paint([[x - s * .62, y - s * .52], [x, y - s * 1.12], [x + s * .62, y - s * .52]], { wash: roof, ink: PAL.ink, sw });
  if (o.snow) paint([[x - s * .6, y - s * .54], [x, y - s * 1.1], [x + s * .6, y - s * .54], [x + s * .5, y - s * .5], [x, y - s * .97], [x - s * .5, y - s * .5]], { wash: '#EEF2FA', ink: null });
  paint(rectPts(x - s * .28, y - s * .42, s * .2, s * .2), { wash: o.lit || '#F2C46A', ink: PAL.ink, sw: sw * .7 });
  paint(rectPts(x + s * .08, y - s * .36, s * .16, s * .36), { wash: mixCol(wall, PAL.ink, .6), ink: PAL.ink, sw: sw * .7 });
}
function girlHouse(x, y, s, o = {}) {
  const sw = clamp(s / 120, .5, 1.1), lit = o.lit !== false;
  boilSeed('ghouse');
  paint(rectPts(x - s * .5, y - s * .55, s, s * .55, 1), { wash: o.wall || '#E6C9A0', ink: PAL.ink, sw });
  paint([[x - s * .62, y - s * .5], [x, y - s * 1.05], [x + s * .62, y - s * .5]], { wash: o.roof || '#B4465A', ink: PAL.ink, sw });
  if (o.snow) paint([[x - s * .6, y - s * .52], [x, y - s * 1.03], [x + s * .6, y - s * .52], [x + s * .5, y - s * .49], [x, y - s * .92], [x - s * .5, y - s * .49]], { wash: '#EEF2FA', ink: null });
  paint(rectPts(x + s * .04, y - s * .36, s * .26, s * .3), { wash: lit ? '#F8D888' : '#2A2D4A', ink: PAL.ink, sw: sw * .8 });   // her window
  inkLine([[x + s * .17, y - s * .36], [x + s * .17, y - s * .06]], sw * .4, PAL.ink, 'inkfine', 0);
  paint(rectPts(x - s * .3, y - s * .36, s * .18, s * .36), { wash: '#8A5A3A', ink: PAL.ink, sw: sw * .7 });   // door
}

// ---------- the hill (呆呆's mailbox, the cliff, the valley, her far hill) ----------
// modes: autumn | autumnNight | grey | snow | snowNight
function hillSet(mode) {
  const S = SETC[mode], night = mode.endsWith('Night'), isSnow = mode.startsWith('snow'), aut = mode.startsWith('autumn');
  skyA(S);
  boilSeed('sun');
  if (mode === 'autumn') sunDisc(930, 600, 86, '#FFEBB5');
  else if (mode === 'snow') sunDisc(430, 690, 64, '#FFD9B8', '#FFC9A8');
  else if (night) { paint(ellPts(300, 200, 150, 150, 24), { fill: '#CFD8FF', fillOp: 40, bleed: .4, ink: null }); paint(ellPts(300, 200, 54, 54, 28, 1), { wash: '#FFF1C8', ink: PAL.ink, sw: .7 }); starsA(-200, 2400, -200, 520, 60, 3); }
  boilSeed('clouds');
  if (mode === 'autumn') { puffCloud(300, 330, 170, S.cloud); puffCloud(1500, 250, 190, S.cloud); puffCloud(2000, 420, 130, S.cloud, 220); }
  else if (mode === 'grey') { puffCloud(300, 220, 260, S.cloud); puffCloud(1000, 150, 300, S.cloud); puffCloud(1800, 260, 260, S.cloud); puffCloud(700, 420, 200, S.cloud, 200); }
  else if (isSnow) { puffCloud(300, 300, 190, S.cloud, 230); puffCloud(1300, 220, 220, S.cloud, 230); puffCloud(2000, 380, 150, S.cloud, 200); }
  else puffCloud(1300, 260, 230, S.cloud, 200);
  boilSeed('far');
  bandP(-300, 2600, ridgeF(1.3, 700, 110, .8), 1200, S.far1, { n: 30, j: 3 });
  // her far hill: a smooth bump on the right, with her house on top
  const gh = x => 1180 - 610 * Math.exp(-Math.pow((x - 2050) / 430, 2));
  boilSeed('farhill');
  bandP(1300, 2700, gh, 1250, S.far2, { n: 26, j: 2, ink: PAL.ink, sw: .6 });
  boilSeed('girlhouse');
  girlHouse(GWIN[0] - 24, gh(GWIN[0] - 24) + 8, 120, { lit: mode !== 'snowNight', snow: isSnow, wall: night ? '#8C7A8C' : '#E6C9A0' });
  boilSeed('fartrees'); for (let i = 0; i < 5; i++) { const x = 1760 + i * 70 + 20 * hash(i), y = gh(x) + 14; paint([[x - 16, y], [x, y - 52 - 12 * hash(i + 4)], [x + 16, y]], { wash: mixCol(S.far2, PAL.ink, .35), ink: null }); }
  // valley mist + 铁山's cottage in the valley
  boilSeed('valley');
  bandP(1450, 2700, 1120, 1300, mixCol(S.far1, S.low, .35), { n: 14, j: 4 });
  cottage(1860, 1175, 170, { snow: isSnow, lit: night ? '#F6B8C8' : '#F2C46A', wall: night ? '#59587A' : '#7A7684', key: 'v' });
  boilSeed('valleyfence'); for (let i = 0; i < 8; i++) { const x = 1700 + i * 24; paint(rectPts(x, 1148, 5, 26), { wash: PAL.ink, ink: null }); }
  boilSeed('valleytrees'); for (let i = 0; i < 4; i++) { const x = 1610 + i * 40, y = 1190; paint([[x - 20, y], [x, y - 70 - 16 * hash(i)], [x + 20, y]], { wash: mixCol(S.far2, PAL.ink, .5), ink: null }); }
  // the foreground hill
  boilSeed('hill');
  const top = x => HILL_Y + 8 * Math.sin(x * .006);
  const hillP = [[-300, 1500], [-300, 886], [200, 876], [600, 886], [1000, 878], [1400, 884], [1470, 892], [1522, 928], [1506, 992], [1552, 1062], [1538, 1140], [1576, 1250], [1600, 1500]];
  paint(hillP, { wash: S.ground, fill: S.hill2, fillOp: 70, bleed: .2, tex: .6, ink: null, curv: .3 });
  boilSeed('hilltop');
  bandP(-300, 1480, top, x => top(x) + 36, S.hill, { n: 24, j: 3, op: 255 });   // a lighter lip on the top
  inkLine(Array.from({ length: 14 }, (_, i) => { const x = lerp(-250, 1470, i / 13); return [x, top(x) + jit(2)]; }).concat([[1500, 905], [1522, 930], [1506, 992], [1552, 1062], [1538, 1140], [1576, 1250]]), 1, PAL.ink, 'ink', .5);
  boilSeed('rock');   // the cliff face: darker strata
  for (let k = 0; k < 6; k++) inkLine([[1500 + k * 3, 940 + k * 54], [1545 + k * 12 + 30 * hash(k), 960 + k * 56], [1580, 950 + k * 52]], .6, mixCol(S.line, PAL.ink, .25), 'inkfine', .5);
  if (isSnow) {
    boilSeed('snowhill');
    paint(ellPts(1440, 890, 120, 22, 16), { wash: '#F6F8FD', ink: null });
    for (let i = 0; i < 9; i++) { const x = -120 + i * 190 + 40 * hash(i), y = 930 + 28 * hash(i + 4); paint(ellPts(x, y, 110 + 40 * hash(i + 2), 14, 14), { wash: S.hill2, washOp: 170, ink: null }); }
  } else {
    boilSeed('grass');
    for (let i = 0; i < 26; i++) { const x = -180 + i * 66 + 30 * hash(i), y = top(x) + 20 + 70 * hash(i + 6); for (const k of [-1, 0, 1]) inkLine([[x + k * 7, y], [x + k * 11, y - 22 - 8 * hash(i + k + 7)]], .6, aut ? mixCol(S.hill2, PAL.ink, .2) : S.line, 'inkfine', .3); }
  }
  // the tree on the left
  bigTree(190, top(190) + 6, 360, S, mode);
  // a pebble, ready to be kicked off the cliff
  boilSeed('pebble'); paint(ellPts(1440, top(1440) - 4, 14, 9, 8), { wash: isSnow ? '#9DA4C0' : '#8A8076', ink: PAL.ink, sw: .6 });
}
// a big tree: autumn = leafy, grey = nearly bare, snow = bare with snow on the branches
function bigTree(x, y, h, S, mode) {
  const sw = 1, bare = mode.startsWith('snow'), thin = mode === 'grey';
  boilSeed('tree');
  paint(ribbon([[x, y], [x - 8, y - h * .45], [x + 6, y - h * .85]], 54, 22), { wash: S.tree, ink: PAL.ink, sw });
  for (const [bx, by, ex, ey] of [[-4, -.55, -150, -.9], [3, -.62, 140, -.95], [0, -.8, -70, -1.12], [4, -.82, 90, -1.1]]) paint(ribbon([[x + bx, y + by * h * .8], [x + ex * .55, y + (by + (ey - by) * .5) * h], [x + ex, y + ey * h]], 20, 6), { wash: S.tree, ink: PAL.ink, sw: .7 });
  if (!bare) {
    const n = thin ? 3 : 7, cx = x, cy = y - h * 1.05;
    for (let i = 0; i < n; i++) { const a = i / n * TAU + .4, rr = 90 + 30 * hash(i + 5), px = cx + Math.cos(a) * (thin ? 120 : 110), py = cy + Math.sin(a) * 60 + (thin ? 30 : 0); paint(ellPts(px, py, rr * (thin ? .5 : 1), rr * (thin ? .4 : .8), 16, 3), { wash: S.leaf[i % S.leaf.length], ink: PAL.ink, sw: .8, curv: .3 }); }
    if (!thin) paint(ellPts(cx, cy, 100, 70, 18, 3), { wash: S.leaf[1], ink: PAL.ink, sw: .8, curv: .3 });
  } else {
    for (const [ex, ey] of [[-150, -.9], [140, -.95], [-70, -1.12], [90, -1.1]]) paint(ellPts(x + ex * .8, y + ey * h * .96, 28, 8, 10), { wash: '#F6F8FD', ink: null });
    paint(ellPts(x, y - h * .02, 60, 14, 12), { wash: '#F6F8FD', ink: null });
  }
}

// ---------- 铁山's yard (mode: grey = autumn afternoon, night = snowy night) ----------
function yardSet(mode) {
  const night = mode === 'night', S = night ? SETC.snowNight : SETC.grey;
  skyA(S, -300, 2400, -300, 760);
  boilSeed('moon');
  if (night) { paint(ellPts(300, 170, 150, 150, 24), { fill: '#CFD8FF', fillOp: 40, bleed: .4, ink: null }); paint(ellPts(300, 170, 50, 50, 28, 1), { wash: '#FFF1C8', ink: PAL.ink, sw: .7 }); starsA(-200, 2300, -200, 420, 50, 8); }
  else { puffCloud(300, 200, 250, S.cloud); puffCloud(1100, 130, 300, S.cloud); puffCloud(1800, 250, 240, S.cloud); }
  boilSeed('pines');
  bandP(-300, 2400, ridgeF(2.2, 720, 70, 1), 1100, S.far1, { n: 24, j: 3 });
  pineRow(-300, 2400, 700, 170, S.far2, 70);
  pineRow(-300, 2400, 790, 120, mixCol(S.far2, S.tree, .4), 52);
  boilSeed('ground');
  const gt = x => 870 + 6 * Math.sin(x * .01);
  bandP(-300, 2400, gt, 1300, S.ground, { n: 24, j: 3, ink: PAL.ink, sw: .9 });
  bandP(-300, 2400, x => gt(x) + 4, x => gt(x) + 40, night ? '#F2F5FB' : S.hill, { n: 24, j: 3 });
  if (night) { for (let i = 0; i < 8; i++) paint(ellPts(40 + i * 280, 960 + 30 * hash(i), 160, 16, 14), { wash: S.hill2, washOp: 150, ink: null }); }
  else for (let i = 0; i < 24; i++) { const x = -250 + i * 110 + 40 * hash(i), y = 920 + 120 * hash(i + 3); for (const k of [-1, 0, 1]) inkLine([[x + k * 7, y], [x + k * 11, y - 18 - 8 * hash(i + k)]], .6, S.line, 'inkfine', .3); }
  // the house
  const wall = night ? '#4F4F72' : '#6E6A7A', roof = night ? '#2B2942' : '#33303E', hx = 1010, hw = 780, hy = 330;
  boilSeed('house');
  paint(rectPts(1630, 100, 96, 200, 1), { wash: mixCol(wall, PAL.ink, .15), ink: PAL.ink, sw: 1 });   // chimney
  paint(rectPts(hx, hy, hw, 550, 2), { wash: wall, ink: PAL.ink, sw: 1.2 });
  for (let r = 0; r < 12; r++) { const yy = hy + 44 + r * 44; inkLine([[hx + 6, yy], [hx + hw / 2, yy + 2], [hx + hw - 6, yy]], .6, mixCol(wall, PAL.ink, .38), 'inkfine', 0); for (let c = 0; c < 9; c++) { const xx = hx + 40 + c * 90 + (r % 2) * 45 + 20 * hash(r * 9 + c); if (xx < hx + hw - 10) inkLine([[xx, yy], [xx + 1, yy + 44]], .5, mixCol(wall, PAL.ink, .38), 'inkfine', 0); } }
  paint([[hx - 70, hy + 20], [hx + hw / 2, hy - 250], [hx + hw + 70, hy + 20]], { wash: roof, ink: PAL.ink, sw: 1.3 });
  for (let r = 1; r < 5; r++) inkLine([[hx - 70 + r * 52, hy + 20 - r * 50], [hx + hw + 70 - r * 52, hy + 20 - r * 50]], .8, mixCol(roof, PAL.cream, .22), 'inkfine', 0);
  if (night) paint([[hx - 60, hy + 16], [hx + hw / 2, hy - 236], [hx + hw + 60, hy + 16], [hx + hw + 40, hy + 38], [hx + hw / 2, hy - 190], [hx - 40, hy + 38]], { wash: '#F2F5FB', ink: null });
  paint(ellPts(hx + hw / 2, hy - 100, 50, 50, 22), { wash: night ? '#F6B8C8' : '#3A3646', ink: PAL.ink, sw: 1.2 });   // the attic window
  inkLine([[hx + hw / 2 - 50, hy - 100], [hx + hw / 2 + 50, hy - 100]], .8, PAL.ink, 'ink', 0); inkLine([[hx + hw / 2, hy - 150], [hx + hw / 2, hy - 50]], .8, PAL.ink, 'ink', 0);
  for (const wx of [hx + 110, hx + hw - 220]) { paint(rectPts(wx, 470, 110, 130, 1), { wash: night ? '#F6C987' : '#3A3646', ink: PAL.ink, sw: 1.1 }); inkLine([[wx + 55, 470], [wx + 55, 600]], .8, PAL.ink, 'ink', 0); inkLine([[wx, 535], [wx + 110, 535]], .8, PAL.ink, 'ink', 0); paint(rectPts(wx - 22, 470, 20, 130, 1), { wash: WOOD_DK, ink: PAL.ink, sw: .7 }); paint(rectPts(wx + 112, 470, 20, 130, 1), { wash: WOOD_DK, ink: PAL.ink, sw: .7 }); paint(rectPts(wx - 14, 600, 138, 14, 1), { wash: '#7A7684', ink: PAL.ink, sw: .7 }); }
  // the doorway (dark inside; the door itself is drawn per frame) and steps
  const dx = 1300, dw = 200, dy = 560;
  paint([[dx - 16, 880], [dx - 16, dy + 70], [dx + 20, dy + 14], [dx + dw / 2, dy - 12], [dx + dw - 20, dy + 14], [dx + dw + 16, dy + 70], [dx + dw + 16, 880]], { wash: mixCol(wall, PAL.ink, .3), ink: PAL.ink, sw: 1.2, curv: .2 });
  paint([[dx, 880], [dx, dy + 76], [dx + 26, dy + 26], [dx + dw / 2, dy + 2], [dx + dw - 26, dy + 26], [dx + dw, dy + 76], [dx + dw, 880]], { wash: '#2A2230', ink: PAL.ink, sw: 1, curv: .2 });
  paint(rectPts(dx - 40, 876, dw + 80, 26, 1), { wash: night ? '#8D9EC8' : '#8A8698', ink: PAL.ink, sw: 1 });
  // the fence, the sign, the dead tree
  boilSeed('yardfence'); spikeFence(-200, 900, 880, 100, night ? '#26243A' : '#3D3A4C');
  boilSeed('skull'); skullSign(980, 880, 30);
  boilSeed('deadtree');
  const tx = 330, tyb = 884;
  paint(ribbon([[tx, tyb], [tx + 10, tyb - 240], [tx - 6, tyb - 470]], 50, 14), { wash: night ? '#1E1C30' : '#3A3036', ink: PAL.ink, sw: 1 });
  for (const [ex, ey, w] of [[-130, -520, 16], [150, -560, 16], [-70, -400, 14], [110, -430, 14], [-40, -600, 9]]) paint(ribbon([[tx + 4, tyb - 300 - (ey < -480 ? 120 : 0)], [tx + ex * .5, tyb + ey * .75], [tx + ex, tyb + ey]], w, 4), { wash: night ? '#1E1C30' : '#3A3036', ink: PAL.ink, sw: .7 });
  if (night) { for (const [ex, ey] of [[-130, -520], [150, -560], [-70, -400], [110, -430]]) paint(ellPts(tx + ex * .75, tyb + ey * .78, 24, 6, 8), { wash: '#F2F5FB', ink: null }); }
  // the snowdrift Clawd lands in (night only); the shots draw its lip again on top of him
  if (night) { boilSeed('drift'); paint(driftPts(), { wash: '#EAF0FA', fill: '#B9C8E6', fillOp: 90, bleed: .2, tex: .5, ink: PAL.ink, sw: 1.1, curv: .5 }); }
}
const DRIFT = [740, 880];
function driftPts() {
  const [x, y] = DRIFT, P = [[x - 270, y + 4]];
  for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; P.push([x + Math.cos(a) * 250, y + 4 + Math.sin(a) * (150 + 14 * Math.sin(i * 1.7))]); }
  P.push([x + 290, y + 4]); return P;
}

// ---------- 铁山's room (warm, cosy, full of cute things) ----------
function roomSet() {
  boilSeed('wall');
  paint(rectPts(-300, -300, 2520, 1180), { wash: '#E8C79E', ink: null });
  for (let i = 0; i < 26; i++) paint(rectPts(-300 + i * 100, -300, 50, 1000, 0), { wash: '#DEB98C', washOp: 120, ink: null });
  boilSeed('wainscot');
  paint(rectPts(-300, 700, 2520, 190, 1), { wash: '#8A5A3A', ink: PAL.ink, sw: 1 });
  for (let i = 0; i < 16; i++) paint(rrPts(-250 + i * 160, 725, 130, 140, 10), { wash: '#9A6644', ink: PAL.ink, sw: .6 });
  boilSeed('floor');
  paint(rectPts(-300, 880, 2520, 400, 1), { wash: '#A8754A', ink: PAL.ink, sw: 1 });
  for (let i = 0; i < 6; i++) inkLine([[-300, 930 + i * 55], [960, 934 + i * 55], [2220, 930 + i * 55]], .7, '#7C5232', 'inkfine', 0);
  boilSeed('rug'); paint(ellPts(1000, 960, 620, 80, 28), { wash: '#C9738C', ink: PAL.ink, sw: 1 }); paint(ellPts(1000, 960, 480, 58, 28), { wash: '#F0A7B8', ink: null }); paint(ellPts(1000, 960, 330, 38, 24), { wash: '#C9738C', ink: null });
  // window (lilac evening) with rose curtains
  boilSeed('window');
  paint(rectPts(230, 150, 340, 380, 1), { wash: '#8C90C8', ink: PAL.ink, sw: 1.4 });
  paint(ellPts(400, 440, 220, 24, 14), { wash: '#F2F5FB', ink: null });
  starsA(250, 550, 170, 340, 6, 21);
  inkLine([[400, 150], [400, 530]], 1.4, PAL.ink, 'ink', 0); inkLine([[230, 340], [570, 340]], 1.4, PAL.ink, 'ink', 0);
  paint(rectPts(210, 530, 380, 24, 1), { wash: WOOD, ink: PAL.ink, sw: 1 });
  for (const s of [-1, 1]) paint([[s < 0 ? 200 : 600, 130], [s < 0 ? 300 : 500, 130], [s < 0 ? 290 : 510, 380], [s < 0 ? 240 : 560, 520], [s < 0 ? 200 : 600, 520]], { wash: '#E8879F', ink: PAL.ink, sw: 1, curv: .3 });
  // shelf with cute things
  boilSeed('shelf');
  paint(rectPts(700, 380, 460, 22, 1), { wash: WOOD, ink: PAL.ink, sw: 1 });
  paint(rrPts(730, 296, 70, 84, 10), { wash: '#C9703E', ink: PAL.ink, sw: .9 });   // plant pot
  for (const [px, py] of [[-30, -90], [0, -120], [30, -90], [-12, -70]]) paint([[765, 300], [765 + px, 300 + py], [765 + px + 14, 300 + py + 16]], { wash: '#5E9A4E', ink: PAL.ink, sw: .6, curv: .5 });
  paint(ellPts(900, 340, 38, 40, 16), { wash: '#B98253', ink: PAL.ink, sw: .9 }); paint(ellPts(900, 296, 28, 28, 14), { wash: '#B98253', ink: PAL.ink, sw: .9 });   // teddy bear
  for (const d of [-1, 1]) { paint(ellPts(900 + d * 24, 274, 11, 11, 8), { wash: '#B98253', ink: PAL.ink, sw: .7 }); paint(ellPts(900 + d * 10, 294, 3.2, 3.6, 6), { wash: PAL.ink, ink: null }); }
  paint(ellPts(900, 306, 8, 6, 8), { wash: PAL.ink, ink: null });
  paint(rrPts(1010, 330, 56, 50, 8), { wash: '#F6EDDA', ink: PAL.ink, sw: .9 }); paint(rrPts(1090, 336, 44, 44, 8), { wash: '#9FD0C6', ink: PAL.ink, sw: .9 });   // mugs
  // a child-like drawing in a frame: a crayon heart
  boilSeed('frame');
  paint(rectPts(1230, 150, 150, 190, 1), { wash: '#6E4A32', ink: PAL.ink, sw: 1.2 }); paint(rectPts(1246, 166, 118, 158, 1), { wash: '#FBF1DC', ink: null });
  paint(heartPts(1305, 250, 40), { wash: '#E2476E', ink: PAL.ink, sw: .8 });
  // fireplace
  boilSeed('fireplace');
  paint(rectPts(1450, 420, 420, 480, 1), { wash: '#8C8794', ink: PAL.ink, sw: 1.3 });
  for (let r = 0; r < 9; r++) inkLine([[1450, 460 + r * 50], [1870, 460 + r * 50]], .6, '#6E6A78', 'inkfine', 0);
  paint(rectPts(1420, 400, 480, 34, 1), { wash: '#6E4A32', ink: PAL.ink, sw: 1.2 });
  paint([[1530, 880], [1530, 600], [1660, 540], [1790, 600], [1790, 880]], { wash: '#2A2028', ink: PAL.ink, sw: 1.2, curv: .2 });
  paint(rrPts(1560, 850, 200, 30, 12), { wash: '#6A4128', ink: PAL.ink, sw: .9 });   // logs
  // the yarn basket
  boilSeed('yarn');
  paint([[420, 830], [620, 830], [590, 920], [450, 920]], { wash: '#C9A06B', ink: PAL.ink, sw: 1, curv: .2 });
  for (const [yx, yy, yc] of [[460, 820, PINK], [520, 800, PINK_LT], [580, 826, '#F6E7D0'], [500, 842, PINK_DK]]) { paint(ellPts(yx, yy, 40, 38, 14), { wash: yc, ink: PAL.ink, sw: .8 }); inkLine([[yx - 26, yy - 8], [yx + 24, yy + 14]], .5, mixCol(yc, PAL.ink, .35), 'inkfine', .3); }
  // the armchair back (the front, with the arms, is drawn per frame after 铁山)
  boilSeed('chair');
  paint(rrPts(780, 460, 460, 400, 70), { wash: '#9A3E4E', fill: '#6E2A38', fillOp: 70, bleed: .15, tex: .5, ink: PAL.ink, sw: 1.4 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) paint(ellPts(870 + c * 100 + (r % 2) * 50, 540 + r * 70, 7, 7, 8), { wash: '#5E1E2C', ink: null });
}
// the armchair's front: seat cushion and two arms, painted over the giant sitting in it
function armchairFront() {
  boilSeed('chairfront');
  paint(rrPts(740, 800, 540, 90, 36), { wash: '#B04A5C', fill: '#6E2A38', fillOp: 60, bleed: .15, ink: PAL.ink, sw: 1.4 });
  for (const x0 of [690, 1190]) paint(rrPts(x0, 640, 100, 250, 40), { wash: '#A8404F', fill: '#6E2A38', fillOp: 60, bleed: .15, ink: PAL.ink, sw: 1.4 });
}

// ---------- the dusk sky for the flight ----------
function duskSky() {
  const S = SETC.dusk;
  skyA(S, -300, 2300, -300, 960);
  boilSeed('sun'); sunDisc(300, 840, 120, '#FFE0A8', '#FFC890');
  boilSeed('farclouds'); puffCloud(1500, 700, 260, '#F2A8B4', 200); puffCloud(700, 520, 200, '#E8A0BC', 170); puffCloud(1900, 420, 170, '#D690B8', 170);
  boilSeed('ridge1'); bandP(-300, 2300, ridgeF(1.9, 960, 70, .9), 1300, S.far1, { n: 30, j: 3 });
  boilSeed('ridge2'); bandP(-300, 2300, ridgeF(4.4, 1030, 60, 1.2), 1300, S.far2, { n: 30, j: 3 });
  boilSeed('valleyfloor'); bandP(-300, 2300, x => 1090 + 8 * Math.sin(x * .004), 1400, S.ground, { n: 30, j: 3, ink: PAL.ink, sw: .8 });
  for (let i = 0; i < 20; i++) { const x = -250 + i * 130 + 40 * hash(i), y = 1130 + 70 * hash(i + 3); inkLine([[x, y], [x + 70, y - 3]], .6, mixCol(S.ground, PAL.ink, .3), 'inkfine', 0); }
}

// ---------- LOOPS: plate checks (the whole set, painted straight) ----------
(() => {
  const mk = (name, fn, cam) => { LOOPS['s_' + name] = t => { camBegin(cam.cx, cam.cy, cam.zoom); fn(); camEnd(); }; LOOPS['s_' + name].len = 2; };
  for (const m of ['autumn', 'autumnNight', 'grey', 'snow', 'snowNight']) mk('hill_' + m, () => hillSet(m), { cx: 1100, cy: 640, zoom: .9 });
  mk('yard_grey', () => yardSet('grey'), { cx: 960, cy: 540, zoom: 1 });
  mk('yard_night', () => yardSet('night'), { cx: 960, cy: 540, zoom: 1 });
  mk('hill_snow_hc', () => hillSet('snow'), { cx: 1380, cy: 820, zoom: 1.35 });
  mk('hill_snow_hn', () => hillSet('snow'), { cx: 800, cy: 700, zoom: 1.35 });
  mk('room', roomSet, { cx: 960, cy: 540, zoom: 1 });
  mk('dusk', duskSky, { cx: 960, cy: 540, zoom: 1 });
})();
