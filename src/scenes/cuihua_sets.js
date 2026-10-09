// cuihua_sets.js: background plates for the 《翠花》 MV. Each set paints once (see usePlate in core.js) in world
// coordinates, with a palette per time of day. Depth comes from overlap, scale and colour: far = paler and bluer.

const SKIES = {
  day:     { top: '#94C9E6', mid: '#B8E0EE', low: '#E2F1E4', far1: '#A8C8C6', far2: '#8DB7A3', hillA: '#7DB062', hillB: '#5E9A4E', line: '#4C7C41', ground: '#D9BC7E', path: '#E7CF97', wall: '#B07A4A', roof: '#3E3A4E', cloud: '#F8F4EA' },
  night:   { top: '#1A1F48', mid: '#26306A', low: '#38437E', far1: '#33416E', far2: '#2C3D60', hillA: '#2B4A4A', hillB: '#243F3D', line: '#1B302F', ground: '#3E3F55', path: '#4C4B66', wall: '#5A4646', roof: '#1C1A2A', cloud: '#4A5288' },
  dawn:    { top: '#B9A9D3', mid: '#EFBCAE', low: '#FBDDBE', far1: '#C4B2C4', far2: '#AEB3A8', hillA: '#9CB877', hillB: '#83A668', line: '#6A8A55', ground: '#E3C595', path: '#EFD8A9', wall: '#C08A5A', roof: '#5A4A5E', cloud: '#FBE9DC' },
  sunset:  { top: '#E6866B', mid: '#F2A964', low: '#F8D27E', far1: '#C98A7A', far2: '#A87A6E', hillA: '#8C8A4C', hillB: '#6F7A44', line: '#525A30', ground: '#B8875A', path: '#D9A870', wall: '#A0603E', roof: '#4A3046', cloud: '#F6C8A0' },
  overcast:{ top: '#A9B3BC', mid: '#BFC6CB', low: '#D5D8D3', far1: '#A3ADAA', far2: '#93A39A', hillA: '#839C76', hillB: '#6E8A66', line: '#56704F', ground: '#C7B48E', path: '#D2C3A0', wall: '#9C7656', roof: '#4A4656', cloud: '#E4E4E0' },
  dusk:    { top: '#4A3F7A', mid: '#9A5E8A', low: '#E59A78', far1: '#6E5A84', far2: '#5A5276', hillA: '#4A5A5E', hillB: '#3E4E52', line: '#2E3A3E', ground: '#7A6A6E', path: '#9A8478', wall: '#7A5A50', roof: '#2E2A3A', cloud: '#C88A90' },
  rain:    { top: '#151A38', mid: '#1E2650', low: '#2A3462', far1: '#26305A', far2: '#222C4E', hillA: '#1F3438', hillB: '#1A2E31', line: '#121E22', ground: '#2E3046', path: '#3A3C56', wall: '#4A3E44', roof: '#16141E', cloud: '#2E3664' },
};
function skyBands(S, x0 = -600, x1 = 2520, y0 = -500, y1 = 760) {
  boilSeed('sky');
  paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: S.top, ink: null });
  band(x0, x1, y0 + (y1 - y0) * .42, y1, S.mid, { j: 14, n: 14 });
  band(x0, x1, y0 + (y1 - y0) * .72, y1, S.low, { j: 12, n: 14 });
}
function stars(x0, x1, y0, y1, n, seed = 0) {
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, hash(i + seed)), y = lerp(y0, y1, hash(i + seed + 300)), r = 2 + 4 * hash(i + seed + 600);
    paint(starPts(x, y, r, .35, 4), { wash: '#FFF5E2', washOp: 160 + 90 * hash(i + seed + 900), ink: null });
  }
}

// ---------- the village (shots 1, 12, 14) ----------
// The path runs left → right along the bottom; the shop (翠花's doorway) is at SHOP_DOOR.
const SHOP_DOOR = [1520, 890];
function villageSet(time, o = {}) {
  const S = SKIES[time], night = time === 'night', shopLit = night && o.shopLit !== false;
  skyBands(S);
  if (night) { boilSeed('stars'); stars(-400, 2400, -350, 420, 70, 3); paint(ellPts(1640, 120, 62, 62, 28, 1), { wash: '#FFF1C8', ink: PAL.ink, sw: .7 }); }
  else if (time === 'day') { boilSeed('clouds'); cloudPuff(300, 140, 160, S.cloud); cloudPuff(1200, 90, 120, S.cloud); cloudPuff(1900, 200, 150, S.cloud); sunDisc(1720, 110, 54, '#FFF0B8'); }
  else { boilSeed('clouds'); cloudPuff(500, 260, 200, S.cloud, 220); cloudPuff(1500, 200, 160, S.cloud, 220); sunDisc(1180, 470, 70, '#FFE2A8'); }
  boilSeed('far');
  band(-600, 2520, ridge(1.3, 470, 120, .8), 900, S.far1, { n: 30, j: 3 });
  band(-600, 2520, ridge(4.1, 560, 90, 1.1), 900, S.far2, { n: 30, j: 3 });
  // terraced hills: stacked bands with a thin line on each lip
  boilSeed('terraces');
  const hillTop = ridge(2.7, 640, 130, .9);
  band(-600, 2520, hillTop, 1000, S.hillA, { n: 30, j: 3, ink: PAL.ink, sw: .7 });
  for (let k = 1; k < 6; k++) {
    const yk = x => hillTop(x) + k * 42 + 10 * Math.sin(x * .004 + k);
    inkLine(Array.from({ length: 16 }, (_, i) => { const x = lerp(-600, 2520, i / 15); return [x, yk(x)]; }), .55, S.line, 'inkfine', .5);
  }
  boilSeed('houses');
  const H2 = [[-160, .7, 1], [180, .9, 0], [520, .75, 1], [1960, .8, 0], [2250, .7, 1]];
  for (const [hx, sc, lit] of H2) stiltHouse(hx, hillTop(hx) + 60 + 30 * sc, 190 * sc, { wall: S.wall, roof: S.roof, lit: night && lit });
  // the shop: a bigger stilt house down on the path, with an open doorway and an awning
  boilSeed('shop');
  const [sx, sy] = SHOP_DOOR;
  paint(rectPts(sx - 230, sy - 330, 460, 330, 2), { wash: S.wall, ink: PAL.ink, sw: 1 });
  for (let i = 1; i < 8; i++) inkLine([[sx - 230, sy - 330 + i * 40], [sx + 230, sy - 330 + i * 40]], .4, mixCol(S.wall, PAL.ink, .35), 'inkfine', 0);
  paint(rectPts(sx - 70, sy - 250, 140, 250, 1), { wash: shopLit ? '#F2C46A' : mixCol(S.wall, PAL.ink, .62), ink: PAL.ink, sw: .9 });   // doorway
  paint(rectPts(sx + 110, sy - 260, 90, 80), { wash: shopLit ? '#F2C46A' : '#5A4A48', ink: PAL.ink, sw: .8 });   // window
  paint([[sx - 290, sy - 300], [sx - 240, sy - 345], [sx, sy - 470], [sx + 240, sy - 345], [sx + 290, sy - 300], [sx + 230, sy - 330], [sx - 230, sy - 330]], { wash: S.roof, ink: PAL.ink, sw: 1, curv: .2 });
  for (let i = 0; i < 6; i++) paint([[sx - 230 + i * 77, sy - 325], [sx - 153 + i * 77, sy - 325], [sx - 160 + i * 77, sy - 280], [sx - 223 + i * 77, sy - 280]], { wash: i % 2 ? PAL.cream : '#D8394E', ink: PAL.ink, sw: .6 });   // awning
  paint(rectPts(sx - 330, sy - 70, 90, 70, 2), { wash: '#A8794A', ink: PAL.ink, sw: .8 });   // crate of melons
  for (let i = 0; i < 3; i++) paint(ellPts(sx - 310 + i * 26, sy - 78, 18, 14, 14), { wash: MELON, ink: PAL.ink, sw: .5 });
  // the path and its verge
  boilSeed('path');
  band(-600, 2520, x => 905 + 10 * Math.sin(x * .006), 1300, S.ground, { n: 24, j: 3 });
  band(-600, 2520, x => 930 + 12 * Math.sin(x * .005 + 1), x => 990 + 10 * Math.sin(x * .004), S.path, { n: 24, j: 4 });
  for (let i = 0; i < 26; i++) { const x = -500 + i * 115 + 40 * hash(i), y = 1010 + 40 * hash(i + 5); paint(ellPts(x, y, 9, 4, 8), { wash: mixCol(S.ground, PAL.ink, .2), ink: null }); }
}

// ---------- the little shop, inside (shot 2) ----------
function shopSet() {
  boilSeed('wall');
  paint(rectPts(-200, -200, 2320, 1100), { wash: '#E7C99A', ink: null });
  for (let i = 0; i < 14; i++) inkLine([[-200 + i * 170, -200], [-195 + i * 170, 860]], .5, '#B98E5E', 'inkfine', 0);
  boilSeed('window');
  paint(rectPts(1180, 150, 420, 300, 2), { wash: '#B8E0EE', ink: PAL.ink, sw: 1 });
  band(1180, 1600, ridge(2, 330, 40), 450, '#8DB7A3', { n: 8, j: 2 });
  band(1180, 1600, ridge(5, 390, 30), 450, '#7DB062', { n: 8, j: 2 });
  inkLine([[1390, 150], [1390, 450]], 1, PAL.ink, 'ink', 0); inkLine([[1180, 300], [1600, 300]], 1, PAL.ink, 'ink', 0);
  paint(rectPts(1160, 140, 460, 22), { wash: '#8A5A3A', ink: PAL.ink, sw: .8 });
  boilSeed('shelves');
  const JARS = ['#E2476E', '#F2C53D', '#6E9F58', '#7B5CA8', '#E8AA38', '#3A9C98'];
  for (let r = 0; r < 3; r++) {
    const y = 210 + r * 170;
    paint(rectPts(80, y, 860, 22), { wash: '#8A5A3A', ink: PAL.ink, sw: .8 });
    for (let j = 0; j < 6; j++) {
      const x = 130 + j * 140, c = JARS[(j + r * 2) % 6];
      paint(rrPts(x - 42, y - 110, 84, 110, 14), { wash: '#DCEBEA', washOp: 200, ink: PAL.ink, sw: .7 });
      for (let k = 0; k < 5; k++) paint(ellPts(x - 22 + (k % 3) * 22, y - 22 - Math.floor(k / 3) * 22, 11, 11, 10), { wash: mixCol(c, JARS[(j + k) % 6], k * .15), ink: null });
      paint(rectPts(x - 30, y - 124, 60, 16), { wash: '#B08060', ink: PAL.ink, sw: .5 });
    }
  }
  boilSeed('lamp');
  inkLine([[960, -100], [960, 120]], .8, PAL.ink, 'ink', 0);
  paint([[900, 160], [1020, 160], [990, 120], [930, 120]], { wash: '#3A9C98', ink: PAL.ink, sw: .8 });
  paint(ellPts(960, 172, 22, 18, 12), { wash: '#FFF0B8', ink: PAL.ink, sw: .6 });
  boilSeed('floor');
  paint(rectPts(-200, 860, 2320, 400), { wash: '#B98E5E', ink: null });
  for (let i = 0; i < 4; i++) inkLine([[-200, 900 + i * 55], [2120, 905 + i * 55]], .6, '#8A6A44', 'inkfine', 0);
  inkLine([[-200, 862], [2120, 860]], 1, PAL.ink, 'ink', 0);
  // the counter (left), between the shelves and the floor
  boilSeed('counter');
  paint(rectPts(40, 620, 760, 250, 2), { wash: '#9A6438', ink: PAL.ink, sw: 1.1 });
  paint(rectPts(20, 600, 800, 40, 2), { wash: '#B5794A', ink: PAL.ink, sw: 1 });
  for (let i = 1; i < 5; i++) inkLine([[40 + i * 152, 645], [40 + i * 152, 865]], .5, '#6E4426', 'inkfine', 0);
  paint(rrPts(560, 520, 140, 84, 12), { wash: '#DCEBEA', washOp: 210, ink: PAL.ink, sw: .7 });   // a jar on the counter
  for (let k = 0; k < 4; k++) paint(ellPts(590 + k * 26, 575, 12, 12, 10), { wash: JARS[k], ink: null });
}

// ---------- the watermelon patch (shots 3, 4) ----------
function patchSet(time) {
  const S = SKIES[time], sunset = time === 'sunset';
  skyBands(S);
  boilSeed('sun'); if (sunset) sunDisc(960, 560, 150, '#FFE08A'); else { sunDisc(1560, 140, 56, '#FFF0B8'); cloudPuff(500, 160, 170, S.cloud); cloudPuff(1100, 110, 120, S.cloud); }
  boilSeed('far');
  band(-600, 2520, ridge(.6, 520, 100, .9), 900, S.far1, { n: 30, j: 3 });
  band(-600, 2520, ridge(3.3, 590, 70, 1.2), 900, S.far2, { n: 30, j: 3 });
  // bamboo fence along the back
  boilSeed('fence');
  const fy = 640;
  band(-600, 2520, fy + 10, 1300, mixCol(S.ground, '#6A5034', .45), { n: 20, j: 4 });
  for (let i = 0; i < 40; i++) { const x = -560 + i * 78 + 8 * hash(i); paint(rectPts(x, fy - 130 - 20 * hash(i + 3), 16, 150 + 20 * hash(i + 3), 1), { wash: mixCol('#C9A24E', S.far2, sunset ? .55 : .15), ink: PAL.ink, sw: .6 }); }
  for (const yy of [fy - 90, fy - 40]) inkLine([[-600, yy], [2520, yy + 6]], 1.4, mixCol('#8A6A3A', S.far2, sunset ? .5 : .1), 'ink', .3);
  // rows of vines with leaves and melons
  boilSeed('rows');
  for (let r = 0; r < 3; r++) {
    const y = 700 + r * 85, sc = .75 + r * .14;
    inkLine([[-600, y], [2520, y + 10]], 1.4 * sc, mixCol(S.hillB, PAL.ink, .2), 'ink', .4);
    for (let i = 0; i < 22; i++) {
      const x = -560 + i * 140 + 60 * hash(i + r * 31);
      for (let q = 0; q < 3; q++) paint(ellPts(x + (q - 1) * 26 * sc, y - 10 - (q === 1 ? 10 : 0) * sc, 30 * sc, 19 * sc, 12, 2, (q - 1) * .6 + hash(i)), { wash: mixCol(S.hillB, S.hillA, hash(i + r + q)), ink: PAL.ink, sw: .5 });
      if (hash(i * 7 + r) > .62) melon(x + 34 * sc, y + 6, 30 * sc);
    }
  }
}

// ---------- the road and the bus stop (shots 5–8) ----------
// Side view: the road runs across the frame; the stop (pole, bench) is at STOP_X; the big tree at TREE_X.
const ROAD_Y = 900, STOP_X = 1250, TREE_X = 1560;
function roadSet(time, o = {}) {
  const S = SKIES[time], night = time === 'night', snow = o.snow;
  skyBands(S, -600, 2520, -500, 720);
  if (night) { boilSeed('stars'); stars(-400, 2400, -350, 480, 60, 9); }
  else if (time !== 'overcast') { boilSeed('clouds'); cloudPuff(400, 180, 150, S.cloud); cloudPuff(1400, 120, 110, S.cloud); }
  else { boilSeed('clouds'); for (let i = 0; i < 5; i++) cloudPuff(-200 + i * 520, 120 + 60 * hash(i), 260, mixCol(S.cloud, S.top, .3)); }
  boilSeed('hills');
  band(-600, 2520, ridge(2.2, 560, 110, .8), 1000, snow ? '#DDE6EE' : S.far1, { n: 30, j: 3 });
  band(-600, 2520, ridge(5.4, 650, 70, 1.3), 1000, snow ? '#E8EEF2' : S.far2, { n: 30, j: 3 });
  boilSeed('fields');
  band(-600, 2520, 760, 880, snow ? '#F2F4F6' : S.hillA, { n: 20, j: 4, ink: PAL.ink, sw: .6 });
  for (let k = 0; k < 4; k++) inkLine([[-600, 785 + k * 24], [2520, 790 + k * 24]], .45, snow ? '#C8D2DC' : S.line, 'inkfine', .3);
  boilSeed('road');
  band(-600, 2520, ROAD_Y - 30, ROAD_Y + 70, snow ? '#E4E8EE' : S.path, { n: 20, j: 3, ink: PAL.ink, sw: .8 });
  band(-600, 2520, ROAD_Y + 70, 1400, snow ? '#F0F2F5' : S.ground, { n: 20, j: 4 });
  for (let i = 0; i < 12; i++) paint(rectPts(-560 + i * 260, ROAD_Y + 16, 120, 9), { wash: snow ? '#CCD3DC' : mixCol(S.path, PAL.cream, .5), ink: null });
  // the stop: a pole with a round plate (no lettering) and a bench
  boilSeed('stop');
  paint(rectPts(STOP_X - 7, ROAD_Y - 330, 14, 300), { wash: '#8A8396', ink: PAL.ink, sw: .7 });
  paint(ellPts(STOP_X, ROAD_Y - 350, 52, 52, 24), { wash: night ? '#5A6A9A' : '#3A7CC0', ink: PAL.ink, sw: 1 });
  paint(ellPts(STOP_X, ROAD_Y - 350, 38, 38, 24), { wash: night ? '#C8C8D8' : '#F3EBDC', ink: null });
  paint(rrPts(STOP_X - 22, ROAD_Y - 368, 44, 28, 6), { wash: night ? '#5A6A9A' : '#3A7CC0', ink: null });   // a little bus pictogram
  paint(rectPts(STOP_X + 70, ROAD_Y - 95, 230, 22), { wash: '#9A6438', ink: PAL.ink, sw: .8 });
  for (const lx of [STOP_X + 85, STOP_X + 275]) paint(rectPts(lx, ROAD_Y - 75, 14, 50), { wash: '#7A4E2E', ink: PAL.ink, sw: .6 });
  if (snow) paint(rectPts(STOP_X + 68, ROAD_Y - 104, 234, 12), { wash: '#F6F8FA', ink: null });
  if (o.tree) { boilSeed('tree'); tree(TREE_X, ROAD_Y - 40, 620, 1, { leaf: S.hillB, snow }); }
}

// ---------- the long road to the horizon (shots 9, 10) ----------
const VP = [960, 560];
function roadVSet(time) {
  const S = SKIES[time], rain = time === 'rain';
  skyBands(S, -400, 2320, -400, 620);
  boilSeed('hills');
  band(-400, 2320, ridge(1.7, 520, 60, .7), 700, S.far1, { n: 26, j: 2 });
  band(-400, 2320, ridge(4.6, 555, 30, 1.2), 700, S.far2, { n: 26, j: 2 });
  boilSeed('fields');
  band(-400, 2320, VP[1], 1300, S.hillB, { n: 20, j: 2 });
  for (let k = 1; k < 9; k++) {   // furrows converging on the vanishing point
    for (const s of [-1, 1]) { const xb = 960 + s * (300 + k * 260); inkLine([[VP[0] + s * (14 + k * 3), VP[1] + 2], [xb, 1180]], .5, S.line, 'inkfine', 0); }
  }
  boilSeed('road');
  paint([[VP[0] - 10, VP[1]], [VP[0] + 10, VP[1]], [1500, 1180], [420, 1180]], { wash: S.path, ink: PAL.ink, sw: .8 });
  for (let i = 0; i < 7; i++) { const k0 = Math.pow(i / 7, 1.6), k1 = Math.pow((i + .45) / 7, 1.6), y0 = lerp(VP[1], 1180, k0), y1 = lerp(VP[1], 1180, k1), w0 = lerp(1, 12, k0), w1 = lerp(1, 12, k1); paint([[960 - w0, y0], [960 + w0, y0], [960 + w1, y1], [960 - w1, y1]], { wash: mixCol(S.path, PAL.cream, .45), ink: null }); }
  boilSeed('poles');
  for (let i = 0; i < 6; i++) {   // telegraph poles shrinking toward the horizon
    const k = Math.pow(.62, i), x = lerp(VP[0] + 30, 1700, k), yb = lerp(VP[1], 1120, k), h = 520 * k;
    paint(rectPts(x - 5 * k - 1, yb - h, 10 * k + 2, h), { wash: rain ? '#2A2436' : '#5A4038', ink: null });
    paint(rectPts(x - 40 * k - 2, yb - h + 20 * k, 80 * k + 4, 7 * k + 2), { wash: rain ? '#2A2436' : '#5A4038', ink: null });
  }
  inkLine([[1700 - 40, 1120 - 520 + 22], [1340, 760], [1150, 650], [1010, 590]], .7, PAL.ink, 'inkfine', .5);
}

// ---------- the porch at night (shot 11) ----------
function porchSet() {
  boilSeed('night');
  paint(rectPts(-300, -300, 2520, 1700), { wash: '#1E2552', ink: null });
  stars(-200, 900, -100, 380, 26, 21);
  paint(ellPts(520, 170, 70, 70, 28, 1), { wash: '#FFF1C8', ink: PAL.ink, sw: .7 });
  boilSeed('hills'); band(-300, 2220, ridge(3, 560, 60), 800, '#2A3A62', { n: 20, j: 2 });
  boilSeed('wall');
  paint(rectPts(980, -300, 1240, 1160, 2), { wash: '#6A4E40', ink: PAL.ink, sw: 1 });
  for (let i = 0; i < 8; i++) inkLine([[980 + i * 160, -300], [985 + i * 160, 860]], .6, '#4A3428', 'inkfine', 0);
  paint(rectPts(1280, 230, 360, 280, 2), { wash: '#F2C46A', ink: PAL.ink, sw: 1 });   // the warm window
  inkLine([[1460, 230], [1460, 510]], 1, PAL.ink, 'ink', 0); inkLine([[1280, 370], [1640, 370]], 1, PAL.ink, 'ink', 0);
  paint([[880, -40], [2300, -40], [2300, 40], [880, 120]], { wash: '#2E2234', ink: PAL.ink, sw: 1 });   // eave
  boilSeed('deck');
  paint(rectPts(-300, 860, 2520, 500), { wash: '#7A5A44', ink: null });
  for (let i = 0; i < 5; i++) inkLine([[-300, 890 + i * 50], [2220, 895 + i * 50]], .6, '#4E3828', 'inkfine', 0);
  inkLine([[-300, 860], [2220, 858]], 1, PAL.ink, 'ink', 0);
  paint(rectPts(1170, 700, 240, 26, 2), { wash: '#9A6A44', ink: PAL.ink, sw: .8 });   // the stool for the melon
  for (const lx of [1186, 1378]) paint(rectPts(lx, 724, 16, 140), { wash: '#7A4E2E', ink: PAL.ink, sw: .6 });
}

// ---------- the summit at night (shots 12b, 13) ----------
// The summit rock top is at SUMMIT; the valley falls away to the right with tree clumps on the ridges.
const SUMMIT = [700, 760];
function summitSet() {
  const S = SKIES.night;
  skyBands(S, -500, 2420, -900, 700);
  boilSeed('stars'); stars(-400, 2300, -800, 420, 80, 41);
  boilSeed('moon'); paint(ellPts(1460, 150, 120, 120, 36, 1.5), { wash: '#FFF1C8', ink: PAL.ink, sw: .8 }); paint(ellPts(1425, 120, 24, 18, 12), { wash: '#F0DDA8', ink: null }); paint(ellPts(1500, 190, 16, 12, 10), { wash: '#F0DDA8', ink: null });
  boilSeed('ridges');
  const R = [[ridge(.9, 600, 90, .7), '#33426E'], [ridge(2.9, 690, 80, .9), '#2C3B60'], [ridge(5.1, 790, 70, 1.1), '#253452'], [ridge(7.3, 900, 60, 1.3), '#1F2C45']];
  R.forEach(([f, c], i) => { band(-500, 2420, f, 1700, c, { n: 30, j: 3, ink: i > 1 ? PAL.ink : null, sw: .6 }); if (i === 1) band(-500, 2420, x => f(x) + 40, x => f(x) + 90, '#4A5A88', { n: 30, j: 6, op: 120 }); });
  boilSeed('trees');
  for (let i = 0; i < 14; i++) { const x = 900 + i * 110 + 40 * hash(i + 2), f = R[2][0], y = f(x) + 8; paint(ellPts(x, y - 28, 34, 44, 14, 3), { wash: '#1A2A30', ink: PAL.ink, sw: .5 }); paint(rectPts(x - 4, y - 4, 8, 16), { wash: '#1A2028', ink: null }); }
  boilSeed('rock');
  const [mx, my] = SUMMIT;
  paint([[-500, 1700], [-500, my + 120], [mx - 380, my + 40], [mx - 160, my - 10], [mx + 40, my], [mx + 210, my + 30], [mx + 420, my + 160], [mx + 620, my + 420], [mx + 760, 1700]], { wash: '#2E2C40', ink: PAL.ink, sw: 1.1, curv: .3 });
  for (let i = 0; i < 6; i++) inkLine([[mx - 300 + i * 120, my + 80 + 30 * hash(i)], [mx - 260 + i * 120, my + 160 + 50 * hash(i + 4)]], .6, '#1E1C2C', 'inkfine', .4);
  for (let i = 0; i < 5; i++) { const x = mx - 260 + i * 120; paint(ellPts(x, my + 12 + 6 * hash(i), 26, 10, 10), { wash: '#3E3C56', ink: null }); }
}

// ---------- a grassy ridge at sunset (shot 4): the sun sits on the far ridge at SUN4 ----------
const SUN4 = [960, 540];
function ridgeSunsetSet() {
  const S = SKIES.sunset;
  skyBands(S, -600, 2520, -500, 700);
  boilSeed('clouds'); cloudPuff(380, 230, 210, '#F6B48A', 230); cloudPuff(1560, 170, 170, '#F6B48A', 230);
  boilSeed('sun'); paint(ellPts(SUN4[0], SUN4[1], 150, 150, 40, 1.5), { wash: '#FFD86E', ink: null });
  paint(ellPts(SUN4[0], SUN4[1], 112, 112, 36, 1.5), { wash: '#FFE79A', ink: null });
  boilSeed('far');
  band(-600, 2520, ridge(3.7, SUN4[1] + 70, 22, 1.4), 900, '#B9706E', { n: 30, j: 2 });
  band(-600, 2520, ridge(2.1, 690, 50, 1.1), 900, '#93625E', { n: 30, j: 3 });
  boilSeed('near');
  band(-600, 2520, ridge(6.2, 860, 26, .7), 1400, '#7C7A44', { n: 30, j: 3, ink: PAL.ink, sw: .8 });
  for (let i = 0; i < 30; i++) { const x = -560 + i * 100 + 30 * hash(i), y = ridge(6.2, 860, 26, .7)(x) + 6; for (const k of [-1, 0, 1]) inkLine([[x + k * 6, y], [x + k * 10, y - 22 - 10 * hash(i + k)]], .6, '#5E5E30', 'inkfine', .4); }
}
