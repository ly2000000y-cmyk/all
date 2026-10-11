// spring22_sets.js: background plates for the 《22》 MV. Each set paints once (see usePlate in core.js) in world
// coordinates. Depth comes from overlap, scale and colour: far = paler and bluer. No lettering anywhere.

function skyFill(top, mid, low, x0 = -500, x1 = 2420, y0 = -400, y1 = 800) {
  boilSeed('sky');
  paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: top, ink: null });
  band(x0, x1, y0 + (y1 - y0) * .38, y1, mid, { j: 14, n: 14 });
  band(x0, x1, y0 + (y1 - y0) * .7, y1, low, { j: 12, n: 14 });
}
function starField(x0, x1, y0, y1, n, seed = 0, col = '#FFF5E2') {
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, hash(i + seed)), y = lerp(y0, y1, hash(i + seed + 300)), r = 2 + 4 * hash(i + seed + 600);
    paint(starPts(x, y, r, .35, 4), { wash: col, washOp: 150 + 100 * hash(i + seed + 900), ink: null });
  }
}
function scatterPetals(x0, x1, y0, y1, n, seed = 0, s = 9) {
  for (let i = 0; i < n; i++) petal(lerp(x0, x1, hash(i + seed)), lerp(y0, y1, hash(i + seed + 50)), s * (.7 + .6 * hash(i + seed + 90)), hash(i + seed + 20) * TAU, BLOOM[i % 4]);
}

// ---------- the blossom lane (shots 1 and 12; kind 'wet' = the same lane after rain) ----------
const LANE = { x: 1000, y: 985, s: 800 };   // the big tree
function laneSet(kind = 'day') {
  const wet = kind === 'wet';
  const S = wet ? { top: '#B3D4E6', mid: '#D3E8EE', low: '#F6F1E2', far1: '#B9D8C8', far2: '#9DCAB0', grass: '#A9D08C', grass2: '#8FBE78', path: '#E9DEC2' }
                : { top: '#9FD3EC', mid: '#C6E6F0', low: '#F7F0DE', far1: '#C0E1CC', far2: '#A5D4B3', grass: '#B7DC92', grass2: '#9DCC7C', path: '#EFE0BA' };
  skyFill(S.top, S.mid, S.low, -500, 2420, -400, 820);
  boilSeed('lclouds'); cloudPuff(300, 170, 190, '#FFFDF6', 235); cloudPuff(1500, 120, 150, '#FFFDF6', 220); cloudPuff(1850, 260, 170, '#FFFDF6', 220); cloudPuff(-60, 330, 140, '#FFFDF6', 200);
  if (wet) {   // a faint rainbow after the rain
    boilSeed('rainbow');
    const R = ['#F28B82', '#F6B26B', '#F7DC6F', '#8FD19E', '#7FB8E8', '#B39DDB'];
    R.forEach((c, i) => { const P = []; for (let k = 0; k <= 24; k++) { const a = Math.PI + k / 24 * Math.PI; P.push([1560 + Math.cos(a) * (700 - i * 26), 720 + Math.sin(a) * (560 - i * 22)]); } paint(ribbon(P, 26, 26), { wash: c, washOp: 120, ink: null }); });
  }
  boilSeed('lfar');
  band(-500, 2420, ridge(1.7, 640, 90, .8), 1000, S.far1, { n: 30, j: 3 });
  band(-500, 2420, ridge(4.4, 720, 70, 1.1), 1000, S.far2, { n: 30, j: 3 });
  boilSeed('lfartrees');
  for (const [x, y, s] of [[-120, 790, 230], [330, 800, 190], [1560, 795, 210], [1850, 800, 260], [2200, 790, 220]]) blossomTree(x, y, s, { ink: false });
  boilSeed('lmeadow');
  band(-500, 2420, ridge(2.2, 800, 36, .9), 1100, S.grass, { n: 30, j: 3, ink: PAL.ink, sw: .6 });
  boilSeed('lpath');   // the lane: a pale band that curves across the foreground
  band(-500, 2420, x => 960 + 28 * Math.sin(x * .004) , x => 1090, S.path, { n: 30, j: 3, ink: PAL.ink, sw: .6 });
  boilSeed('lgrass2');
  band(-500, 2420, x => 1002 + 22 * Math.sin(x * .004 + 1), x => 1100, S.grass2, { n: 30, j: 3, op: 140 });
  if (wet) { boilSeed('puddles'); for (const [x, y, rx] of [[400, 1030, 190], [1500, 1045, 150], [700, 1060, 110]]) { paint(ellPts(x, y, rx, rx * .18, 24, 2), { wash: '#B9D8EA', ink: PAL.ink, sw: .5 }); paint(ellPts(x - rx * .2, y - 2, rx * .45, rx * .06, 14), { wash: '#F1FAFF', washOp: 200, ink: null }); } }
  boilSeed('lmain'); blossomTree(LANE.x, LANE.y, LANE.s, { lean: -.02 });
  boilSeed('lsmall'); blossomTree(130, 1000, 520, { lean: .04 }); blossomTree(1790, 1000, 560, { lean: -.05 });
  boilSeed('lfallen'); scatterPetals(-100, 2100, 975, 1070, wet ? 70 : 34, 3, 10);
}
// the foreground branch (per frame): enters at the top right; the ribbon can hang from its tip
function laneBranch(t, o = {}) {
  boilSeed('lbranch');
  const sway = (o.sway ?? 0) + 3 * Math.sin(t * 1.3);
  const tip = blossomBranch(2060, 130 + sway * .3, 980, Math.PI - .1, { w0: 32, r: 58, sway, seed: 7, sag: 1 });
  return tip;
}
function hangRibbon(x, y, t, k = 1, len = 1) {   // the teal ribbon snagged on a twig, fluttering; len stretches the tails
  if (k <= 0) return;
  const sw = Math.sin(t * 3.2) * 10 * len;
  paint(ribbon([[x, y], [x + 12 + sw * .3, y + 70 * k * len], [x + 4 + sw, y + 150 * k * len]], 18, 8), { wash: RIB, ink: PAL.ink, sw: .7 });
  paint(ribbon([[x, y], [x - 26 - sw * .4, y + 56 * k * len], [x - 34 - sw * .8, y + 120 * k * len]], 16, 7), { wash: RIB_DK, ink: PAL.ink, sw: .7 });
  paint(ellPts(x, y, 14, 12, 10), { wash: RIB, ink: PAL.ink, sw: .6 });
}

// ---------- the windy ridge (shot 2); ground at y ≈ 900 ----------
function ridgeSet() {
  skyFill('#8FCDEB', '#B9E1F0', '#EDF1E0', -500, 2420, -400, 800);
  boilSeed('rclouds');   // long wind-pulled clouds
  for (const [x, y, w] of [[250, 200, 330], [1100, 130, 260], [1650, 300, 380], [-100, 440, 240]]) { cloudPuff(x, y, w, '#FFFDF6', 230); cloudPuff(x + w * .9, y + 12, w * .5, '#FFFDF6', 200); }
  boilSeed('rfar'); band(-500, 2420, ridge(.8, 640, 120, .7), 1000, '#BFE0CB', { n: 30, j: 3 }); band(-500, 2420, ridge(3.3, 720, 90, 1.0), 1000, '#A2D1B0', { n: 30, j: 3 });
  boilSeed('rtrees'); for (const [x, y, s, l] of [[200, 770, 270, .12], [640, 790, 200, .14], [1420, 780, 230, .13], [1880, 790, 280, .1]]) blossomTree(x, y, s, { lean: l, ink: false });
  boilSeed('rslope'); band(-500, 2420, ridge(5.1, 800, 40, .8), 1100, '#B6DB91', { n: 30, j: 3, ink: PAL.ink, sw: .6 });
  band(-500, 2420, x => 930 + 14 * Math.sin(x * .005), 1100, '#9DCC7C', { n: 30, j: 3, op: 200 });
  boilSeed('rpath'); band(-500, 2420, x => 985 + 16 * Math.sin(x * .004 + 2), x => 1095, '#EFE0BA', { n: 30, j: 3, ink: PAL.ink, sw: .6 });
}

// ---------- rush-hour street (shot 3); sidewalk y ≈ 990, road y ≈ 800 ----------
function citySet() {
  skyFill('#B7C6D4', '#CFD8E0', '#E9E5DA', -500, 2420, -400, 800);
  boilSeed('cfar');   // far towers: pale
  const tw = (x0, x1, top, col, win) => {
    for (let x = x0; x < x1;) {
      const w = 170 + 160 * hash(x * .01 + 3), h = 380 + 340 * hash(x * .017 + 1);
      paint(rectPts(x, top + 700 - h, w, h + 400, 2), { wash: col, ink: null });
      if (win) for (let yy = top + 700 - h + 40; yy < 720; yy += 54) for (let xx = x + 24; xx < x + w - 30; xx += 46) paint(rectPts(xx, yy, 20, 28), { wash: win, washOp: 150, ink: null });
      x += w + 18 + 28 * hash(x);
    }
  };
  tw(-500, 2420, 0, '#C5D1DD', '#E6EEF5'); tw(-420, 2420, 90, '#A3B3C6', '#D3DEEA');
  boilSeed('cmid');
  for (let x = -300, i = 0; x < 2420; i++) {   // near buildings: darker blue-grey, blank shopfronts, awnings in muted colours
    const w = 360 + 120 * hash(i + 5), h = 520 + 220 * hash(i + 9), col = ['#7D8BA6', '#8896A6', '#7A8799'][i % 3];
    paint(rectPts(x, 760 - h, w, h + 200, 2), { wash: col, ink: PAL.ink, sw: .8 });
    for (let yy = 760 - h + 40; yy < 640; yy += 90) for (let xx = x + 34; xx < x + w - 60; xx += 78) paint(rectPts(xx, yy, 42, 56), { wash: hash(xx + yy) > .75 ? '#F2DE9A' : '#D6E0EA', washOp: 215, ink: PAL.ink, sw: .5 });
    paint(rectPts(x + 20, 640, w - 40, 130), { wash: mixCol(col, PAL.ink, .25), ink: PAL.ink, sw: .6 });
    const ac = ['#C9695C', '#7FA48E', '#D9A44E'][i % 3]; for (let k = 0; k < 4; k++) paint([[x + 24 + k * (w - 48) / 4, 640], [x + 24 + (k + 1) * (w - 48) / 4, 640], [x + 12 + (k + 1) * (w - 48) / 4, 690], [x + 12 + k * (w - 48) / 4, 690]], { wash: k % 2 ? PAL.cream : ac, ink: PAL.ink, sw: .5 });
    x += w + 10;
  }
  boilSeed('croad'); band(-500, 2420, 770, 905, '#7C8290', { n: 20, j: 2, ink: PAL.ink, sw: .8 });
  for (let x = -400; x < 2420; x += 220) paint(rectPts(x, 836, 110, 12), { wash: '#E8E3D2', ink: null });   // lane dashes
  boilSeed('cwalk'); band(-500, 2420, 905, 1120, '#C4C6CC', { n: 20, j: 2, ink: PAL.ink, sw: .8 });
  band(-500, 2420, 905, 930, '#A7AAB4', { n: 20, j: 2 });   // kerb
  for (let x = -300; x < 2420; x += 300) inkLine([[x, 935], [x - 40, 1080]], .5, '#9A9DA8', 'inkfine', 0);   // paving seams
  boilSeed('clamps');
  for (const x of [380, 1180, 1980]) { paint(rectPts(x - 8, 560, 16, 360), { wash: '#4E5568', ink: PAL.ink, sw: .8 }); paint(rrPts(x - 18, 540, 36, 90, 8), { wash: '#3C4152', ink: PAL.ink, sw: .8 }); paint(ellPts(x, 564, 11, 11, 10), { wash: '#EC6B5E', ink: null }); paint(ellPts(x, 584, 11, 11, 10), { wash: '#E8C66A', ink: null }); paint(ellPts(x, 606, 11, 11, 10), { wash: '#6FBF86', ink: null }); }
}

// ---------- the golden balcony (shot 4); floor y ≈ 960 ----------
function balconySet() {
  skyFill('#F2B48A', '#F7CF9A', '#FBE6B8', -500, 2420, -400, 800);
  boilSeed('bsk'); cloudPuff(380, 250, 260, '#F9D3B0', 230); cloudPuff(1500, 190, 300, '#F6C2A6', 210); cloudPuff(1120, 360, 190, '#F9D8B8', 190);
  boilSeed('bsky1');   // skyline silhouettes, two depths
  for (const [col, base, amp, off] of [['#D79F96', 700, 150, 0], ['#B98390', 780, 170, 3]]) {
    for (let x = -300, i = 0; x < 2420; i++) { const w = 120 + 150 * hash(i + off), h = 120 + amp * hash(i * 1.7 + off + 4); paint(rectPts(x, base - h, w, h + 400, 2), { wash: col, ink: null }); if (hash(i + off + 40) > .5) paint(rectPts(x + w * .4, base - h - 50, 8, 50), { wash: col, ink: null }); x += w + 6; }
  }
  boilSeed('bwin'); for (let i = 0; i < 38; i++) paint(rectPts(-300 + 2700 * hash(i + 11), 560 + 220 * hash(i + 12), 14, 20), { wash: '#FFF0B8', washOp: 190, ink: null });
  boilSeed('bwall');   // the flat's wall and balcony floor
  paint([[-500, 780], [-120, 780], [-120, -400], [-500, -400]], { wash: '#EAC49A', ink: PAL.ink, sw: .8 });
  paint(rectPts(1760, -400, 700, 1500), { wash: '#EAC49A', ink: PAL.ink, sw: .8 });
  paint(rectPts(1760, 160, 300, 600), { wash: '#4E4A5E', ink: PAL.ink, sw: .8 });   // the door to the flat, dark
  paint(rectPts(1790, 190, 240, 540), { wash: '#F2CF86', ink: null });
  paint(rectPts(-500, 940, 3000, 300), { wash: '#B98A6A', ink: PAL.ink, sw: .9 });
  for (let x = -500; x < 2400; x += 170) inkLine([[x, 945], [x - 60, 1090]], .5, '#8E6850', 'inkfine', 0);
  boilSeed('brail');   // the railing, across the middle
  paint(rectPts(-500, 700, 3000, 22), { wash: '#6A5260', ink: PAL.ink, sw: .9 });
  paint(rectPts(-500, 935, 3000, 20), { wash: '#6A5260', ink: PAL.ink, sw: .9 });
  for (let x = -480; x < 2400; x += 64) paint(rectPts(x, 718, 12, 220), { wash: '#6A5260', ink: PAL.ink, sw: .6 });
  paint(rectPts(1180, 770, 400, 20), { wash: '#8E6A52', ink: PAL.ink, sw: .8 });   // a ledge for the pot
}
// the sun and its glow, in sky coordinates (per frame); k 0..1 = the time-lapse
function balconySun(k, a = 1) {
  const x = lerp(1350, 520, ease(k)), y = lerp(430, 640, easeIn(k) * .6 + k * .4);
  glow(x, y, 560, '#FFB872', .9 * a);
  sunDisc(x, y, 74, k > .6 ? '#FFB27A' : '#FFE29A');
}

// ---------- the office (shots 5, 6); floor y ≈ 960, desk top ≈ 835 ----------
const OFFICE_SKY = { day: ['#9FD3EC', '#C9E7F2', '#EAF1E8', '#E9F4FA'], dusk: ['#F08B6E', '#F4AE7C', '#F9D49A', '#F4C9A0'], night: ['#1A1F48', '#242C62', '#33417E', '#2A3166'] };
function officeSet(time = 'day') {
  const [t1, t2, t3] = OFFICE_SKY[time], night = time === 'night';
  boilSeed('owall'); paint(rectPts(-500, -400, 3000, 1400), { wash: night ? '#6D6A7A' : '#D9D5C9', ink: null });
  band(-500, 2420, 760, 1000, night ? '#5E5B6C' : '#CCC8BA', { n: 12, j: 2 });   // lower wall
  inkLine([[-500, 760], [2420, 760]], 1, night ? '#44424F' : '#9E9A8C', 'ink', .2);
  // window: a big pane to the left of her
  boilSeed('owin');
  const wx = 150, wy = 120, ww = 760, wh = 560;
  paint(rectPts(wx - 24, wy - 24, ww + 48, wh + 48), { wash: night ? '#4A4858' : '#F2EEE2', ink: PAL.ink, sw: 1 });
  paint(rectPts(wx, wy, ww, wh), { wash: t1, ink: PAL.ink, sw: .8 });
  band(wx, wx + ww, wy + wh * .35, wy + wh, t2, { j: 4, n: 10 }); band(wx, wx + ww, wy + wh * .65, wy + wh, t3, { j: 4, n: 10 });
  for (let i = 0, x = wx + 20; x < wx + ww - 40; i++) { const w = 70 + 80 * hash(i + 3), h = 70 + 190 * hash(i + 7); paint(rectPts(x, wy + wh - h, Math.min(w, wx + ww - x), h), { wash: night ? '#1C2252' : time === 'dusk' ? '#B07A86' : '#A9BAC9', ink: null }); if (night) for (let k = 0; k < 5; k++) paint(rectPts(x + 8 + 22 * (k % 3), wy + wh - h + 14 + 30 * Math.floor(k / 3) + 40 * hash(k + i), 8, 12), { wash: '#FFE29A', washOp: 230, ink: null }); x += w + 12; }
  inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 2, '#B8B2A2', 'ink', 0); inkLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 2, '#B8B2A2', 'ink', 0);
  if (night) { boilSeed('ostars'); starField(wx + 20, wx + ww - 20, wy + 20, wy + wh * .45, 14, 2); paint(ellPts(wx + ww - 150, wy + 110, 44, 44, 20), { wash: '#FFF1C8', ink: null }); }
  // cubicle partitions and the ceiling light
  boilSeed('opart');
  paint(rectPts(1560, 300, 480, 700), { wash: night ? '#51587A' : '#8E9CB8', ink: PAL.ink, sw: .9 });
  paint(rectPts(1560, 300, 480, 30), { wash: night ? '#414868' : '#76849F', ink: PAL.ink, sw: .8 });
  paint(rectPts(1620, 380, 150, 190), { wash: night ? '#7D7A8C' : '#E8E2D2', ink: PAL.ink, sw: .6 });   // a pinned blank sheet
  paint(rectPts(1800, 410, 130, 170), { wash: night ? '#8A857A' : '#F2D987', ink: PAL.ink, sw: .6 });
  paint(rectPts(300, -20, 1100, 36), { wash: night ? '#4A4858' : '#F8F6EE', ink: PAL.ink, sw: .8 });   // light strip
  boilSeed('ofloor'); band(-500, 2420, 960, 1200, night ? '#4E4B5C' : '#A6A18F', { n: 12, j: 2, ink: PAL.ink, sw: .8 });
}
function officeLight(time) { const k = { day: 1, dusk: .35, night: 0 }[time]; glow(850, 5, 700, '#FFF6D8', .55 * k); }
// the desk, in front of her (per frame). o.papers = number of sheets piled; o.lamp 0..1; o.bento draws her lunch
function officeDesk(t, o = {}) {
  boilSeed('odesk');
  paint(rectPts(300, 835, 1300, 38, 2), { wash: '#C69A68', ink: PAL.ink, sw: 1 });
  paint(rectPts(330, 873, 1240, 260, 2), { wash: '#B08556', ink: PAL.ink, sw: 1 });
  for (let i = 1; i < 4; i++) inkLine([[330, 873 + i * 60], [1570, 873 + i * 60]], .5, '#8E6A42', 'inkfine', 0);
  paint(rectPts(1000, 890, 360, 110, 2), { wash: '#C69A68', ink: PAL.ink, sw: .8 }); paint(rectPts(1160, 940, 40, 14), { wash: PAL.ink, ink: null });   // drawer
  // the monitor, angled away at the right: we see its back and the stand
  paint([[1230, 835], [1470, 835], [1420, 810], [1280, 810]], { wash: '#8C93A4', ink: PAL.ink, sw: .8 });
  paint(rrPts(1180, 540, 330, 270, 14), { wash: '#6C7488', ink: PAL.ink, sw: 1.1 });
  paint(rectPts(1330, 810, 30, 30), { wash: '#565E72', ink: PAL.ink, sw: .8 });
  // cup
  paint(rrPts(420, 765, 70, 72, 12), { wash: '#F2F0E8', ink: PAL.ink, sw: .8 }); paint(ellPts(420, 790, 18, 18, 10, 0, 0), { wash: '#F2F0E8', ink: PAL.ink, sw: .6 });
  const n = Math.round(o.papers || 0);
  for (let i = 0; i < n; i++) {   // the pile on the left
    const px = 360 + 200 * hash(i + 3) * .15 + (hash(i * 3.3) - .5) * 30, py = 835 - i * 14, rot = (hash(i + 20) - .5) * .12;
    push(); translate(px + 120, py); rotate(rot); paint(rectPts(-120, -16, 240, 16), { wash: i % 3 === 0 ? '#F4EFE0' : '#FBF8EE', ink: PAL.ink, sw: .6 }); pop();
  }
  if (o.lamp !== undefined && o.lamp > 0) {
    const lx = 560, ly = 835;
    paint(rectPts(lx - 36, ly - 14, 72, 14), { wash: '#3E4457', ink: PAL.ink, sw: .8 });
    inkLine([[lx, ly - 14], [lx - 30, ly - 130], [lx + 50, ly - 210]], 4, '#3E4457', 'ink', .3);
    paint([[lx + 20, ly - 230], [lx + 110, ly - 200], [lx + 60, ly - 160]], { wash: '#E8B94A', ink: PAL.ink, sw: .8 });
    glow(lx + 70, ly - 170, 330 * o.lamp, '#FFD58A', .75 * o.lamp);
  }
}

// ---------- her room at night (shots 7, 8-start); floor y ≈ 960 ----------
function roomSet() {
  boilSeed('rwall'); paint(rectPts(-500, -400, 3000, 1500), { wash: '#C9A98E', ink: null });
  for (let x = -480; x < 2420; x += 120) paint(rectPts(x, -400, 56, 1300), { wash: '#C09F84', washOp: 150, ink: null });   // wallpaper stripes
  band(-500, 2420, 930, 1200, '#8F6A52', { n: 12, j: 2, ink: PAL.ink, sw: .9 });
  for (let x = -400; x < 2420; x += 230) inkLine([[x, 935], [x - 60, 1090]], .5, '#6E4E3C', 'inkfine', 0);
  // the window, tall, right of centre
  boilSeed('rwin');
  const wx = 1360, wy = 170, ww = 420, wh = 640;
  paint(rectPts(wx - 28, wy - 28, ww + 56, wh + 56), { wash: '#E8DCC8', ink: PAL.ink, sw: 1 });
  paint(rectPts(wx, wy, ww, wh), { wash: '#1B2252', ink: PAL.ink, sw: .8 });
  band(wx, wx + ww, wy + wh * .55, wy + wh, '#2B3578', { j: 3, n: 8 });
  for (let i = 0, x = wx + 10; x < wx + ww - 30; i++) { const w = 50 + 60 * hash(i + 4), h = 60 + 150 * hash(i + 8); paint(rectPts(x, wy + wh - h, Math.min(w, wx + ww - x), h), { wash: '#141A3E', ink: null }); for (let k = 0; k < 4; k++) paint(rectPts(x + 8 + 20 * (k % 2), wy + wh - h + 12 + 28 * Math.floor(k / 2), 8, 12), { wash: '#FFE29A', washOp: 220 * hash(k + i + 3), ink: null }); x += w + 10; }
  starField(wx + 20, wx + ww - 20, wy + 20, wy + 280, 12, 5); paint(ellPts(wx + 320, wy + 90, 34, 34, 18), { wash: '#FFF1C8', ink: null });
  inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 2.4, '#D9CDB6', 'ink', 0);
  paint(rectPts(wx - 40, wy + wh + 26, ww + 80, 26), { wash: '#E8DCC8', ink: PAL.ink, sw: .9 });   // sill
  // sofa, left
  boilSeed('rsofa');
  paint(rrPts(60, 700, 620, 260, 40), { wash: '#6F8FA8', ink: PAL.ink, sw: 1.1 });
  paint(rrPts(30, 770, 120, 190, 36), { wash: '#5E7C94', ink: PAL.ink, sw: 1 });
  paint(rrPts(600, 770, 120, 190, 36), { wash: '#5E7C94', ink: PAL.ink, sw: 1 });
  paint(rrPts(130, 800, 480, 130, 30), { wash: '#7FA0B8', ink: PAL.ink, sw: .9 });
  paint(rrPts(70, 920, 600, 36, 10), { wash: '#4E667A', ink: PAL.ink, sw: .8 });
  // a rug, a small plant
  boilSeed('rrug'); paint(ellPts(760, 1040, 520, 52, 28), { wash: '#B8705E', ink: PAL.ink, sw: .8 }); paint(ellPts(760, 1040, 400, 34, 24), { wash: '#D49C72', ink: null });
  boilSeed('rplant'); paint([[1170, 960], [1260, 960], [1245, 860], [1185, 860]], { wash: '#C9744A', ink: PAL.ink, sw: .9 });
  for (let i = 0; i < 5; i++) { push(); translate(1215, 860); rotate(-1 + i * .5); paint(ellPts(0, -56, 26, 66, 12), { wash: ['#5E9A4E', '#7DB062'][i % 2], ink: PAL.ink, sw: .7 }); pop(); }
}
// the calendar pages and lamp for the room (per frame): page = how many have fallen
function roomCalendar(t, falls) {
  boilSeed('rcal');
  const x = 780, y = 330;
  paint(rectPts(x - 6, y - 26, 190, 270), { wash: '#F8F2E4', ink: PAL.ink, sw: .9 });
  paint(rectPts(x - 6, y - 26, 190, 44), { wash: '#D8574B', ink: PAL.ink, sw: .8 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) paint(rectPts(x + 12 + c * 32, y + 44 + r * 44, 22, 28), { wash: '#E5DECF', ink: null });
  // each fallen page: a sheet peeling off and drifting down
  falls.forEach(([t0], i) => {
    const a = t - t0; if (a < 0 || a > 1.0) return;
    const k = a / 1.0, px = x - 6 + 40 * Math.sin(k * 5) * k, py = y - 26 + 560 * k * k, rot = .5 * Math.sin(k * 4 + i);
    push(); translate(px + 95, py + 135); rotate(rot); paint(rectPts(-95, -135, 190, 270), { wash: '#FBF6E8', ink: PAL.ink, sw: .8 }); paint(rectPts(-95, -135, 190, 44), { wash: '#D8574B', ink: PAL.ink, sw: .7 }); pop();
  });
}

// ---------- the dream: a sea of clouds under a huge moon (shot 8) ----------
function dreamSet() {
  skyFill('#171B4A', '#233B73', '#3B6E94', -500, 2420, -400, 820);
  boilSeed('dstars'); starField(-300, 2300, -300, 620, 70, 4);
  boilSeed('dmoon'); paint(ellPts(1450, 260, 190, 190, 40, 1.5), { wash: '#FFF3D0', ink: null }); paint(ellPts(1400, 220, 60, 50, 14), { wash: '#F2E2B8', washOp: 200, ink: null }); paint(ellPts(1520, 330, 36, 30, 12), { wash: '#F2E2B8', washOp: 200, ink: null });
  glow(1450, 260, 700, '#FFE9B0', .7);
  boilSeed('dfar'); band(-500, 2420, x => 700 + 20 * Math.sin(x * .006), 1100, '#5D8DB0', { n: 40, j: 3 });
  for (let k = 0; k < 4; k++) { boilSeed('dwave' + k); band(-500, 2420, x => 740 + k * 70 + 18 * Math.sin(x * .0045 + k * 1.7) + 8 * Math.sin(x * .013 + k), 1200, ['#6F9BC0', '#86AECF', '#A2C2DA', '#C0D5E6'][k], { n: 50, j: 2, ink: PAL.ink, sw: .5, op: 245 }); }
}

// ---------- a park bench at noon (shot 9) ----------
function parkSet() {
  skyFill('#A8D8EC', '#CDE9F1', '#F7F2E2', -500, 2420, -400, 800);
  boilSeed('pclouds'); cloudPuff(420, 180, 200, '#FFFDF6', 230); cloudPuff(1560, 240, 220, '#FFFDF6', 220);
  boilSeed('ptowers');   // the office towers, small and pale on the horizon
  for (let x = -300, i = 0; x < 2420; i++) { const w = 70 + 70 * hash(i + 2), h = 100 + 190 * hash(i + 6); paint(rectPts(x, 720 - h, w, h + 100), { wash: '#B9C9D6', ink: null }); x += w + 8; }
  boilSeed('pfar'); band(-500, 2420, ridge(2.9, 760, 40, .9), 1100, '#B9DDB4', { n: 30, j: 3 });
  boilSeed('plawn'); band(-500, 2420, ridge(1.1, 800, 24, .8), 1100, '#B3D98C', { n: 30, j: 3, ink: PAL.ink, sw: .6 });
  band(-500, 2420, x => 960 + 16 * Math.sin(x * .004), 1100, '#9ECB7C', { n: 30, j: 3, op: 200 });
  boilSeed('pbig'); blossomTree(300, 960, 880, { lean: .03 }); blossomTree(1620, 960, 840, { lean: -.03 });
  boilSeed('pfar2'); blossomTree(-100, 800, 260, { ink: false }); blossomTree(2150, 800, 280, { ink: false });
  // the bench back and legs, centre
  boilSeed('pbench');
  for (const x of [740, 1180]) paint(rectPts(x, 800, 18, 200), { wash: '#6E5A48', ink: PAL.ink, sw: .8 });
  for (let i = 0; i < 3; i++) paint(rrPts(700, 690 + i * 34, 520, 26, 6), { wash: i % 2 ? '#C9965E' : '#D4A46C', ink: PAL.ink, sw: .8 });
  boilSeed('pfallen'); scatterPetals(-100, 2100, 940, 1070, 46, 11, 10);
}
function benchFront() {   // the seat and front rail, drawn over her legs
  boilSeed('pbenchf');
  paint(rrPts(690, 930, 540, 34, 8), { wash: '#D9AC74', ink: PAL.ink, sw: .9 });
  paint(rrPts(690, 964, 540, 20, 6), { wash: '#B98650', ink: PAL.ink, sw: .8 });
}

// ---------- home at dawn and the open road (shot 10) ----------
function homeRoadSet() {
  skyFill('#C3B2D6', '#F2BEAC', '#FBE0B8', -500, 2700, -400, 800);
  boilSeed('hclouds'); cloudPuff(500, 280, 230, '#FBE3D8', 220); cloudPuff(1700, 190, 200, '#FBE3D8', 210); cloudPuff(2300, 330, 170, '#FBE3D8', 190);
  boilSeed('hsun'); sunDisc(2000, 600, 90, '#FFE2A8');
  boilSeed('hfar'); band(-500, 2700, ridge(1.9, 690, 110, .7), 1100, '#CDB4BE', { n: 36, j: 3 }); band(-500, 2700, ridge(3.7, 760, 80, 1.0), 1100, '#A9C4A3', { n: 36, j: 3 });
  boilSeed('hfartrees'); for (const x of [900, 1300, 1700, 2250, 2600]) blossomTree(x, 800, 200 + 30 * hash(x), { ink: false });
  boilSeed('hfield'); band(-500, 2700, ridge(.6, 820, 30, .8), 1100, '#B7D58E', { n: 36, j: 3, ink: PAL.ink, sw: .6 });
  // the road: a wide pale band running right
  boilSeed('hroad'); band(-500, 2700, x => 940 + 30 * Math.sin(x * .0032) , x => 1090, '#EAD9B2', { n: 36, j: 3, ink: PAL.ink, sw: .6 });
  boilSeed('hroadedge'); band(-500, 2700, x => 1050 + 14 * Math.sin(x * .0032), 1100, '#A9CB86', { n: 36, j: 3, op: 180 });
  // the house: a small cottage at the left, door open with warm light
  boilSeed('hhouse');
  paint(rectPts(110, 470, 660, 480, 2), { wash: '#E8CFA8', ink: PAL.ink, sw: 1.1 });
  for (let i = 1; i < 8; i++) inkLine([[110, 470 + i * 60], [770, 470 + i * 60]], .5, '#C9AE86', 'inkfine', 0);
  paint([[50, 480], [200, 340], [440, 230], [680, 340], [830, 480], [770, 470], [110, 470]], { wash: '#B8604A', ink: PAL.ink, sw: 1.1, curv: .12 });
  for (let i = 0; i < 5; i++) inkLine([[180 + i * 120, 345 + (i < 3 ? 0 : 20)], [210 + i * 110, 470]], .5, '#8E4636', 'inkfine', 0);
  paint(rectPts(130, 590, 170, 150), { wash: '#F6D88A', ink: PAL.ink, sw: .9 });   // window, lit
  inkLine([[215, 590], [215, 740]], 1.6, '#8E6A52', 'ink', 0); inkLine([[130, 665], [300, 665]], 1.6, '#8E6A52', 'ink', 0);
  paint(rectPts(480, 600, 190, 350), { wash: '#F6C86A', ink: PAL.ink, sw: 1 });   // the doorway: warm light inside
  paint(rectPts(740, 940, 80, 10), { wash: '#B98A6A', ink: null });
  boilSeed('hflowers'); for (let i = 0; i < 6; i++) { const fx = 150 + i * 110, fy = 960; inkLine([[fx, fy], [fx, fy - 40]], 1.4, '#4E8B3A', 'ink', 0); paint(ellPts(fx, fy - 46, 14, 14, 10), { wash: BLOOM[i % 4], ink: PAL.ink, sw: .5 }); }
  boilSeed('hsign'); paint(rectPts(1500, 800, 16, 190), { wash: '#8A6A4A', ink: PAL.ink, sw: .8 }); paint([[1516, 810], [1610, 810], [1650, 836], [1610, 862], [1516, 862]], { wash: '#E8C66A', ink: PAL.ink, sw: .8 }); paint([[1500, 880], [1410, 880], [1380, 902], [1410, 924], [1500, 924]], { wash: '#9FC9B0', ink: PAL.ink, sw: .8 });
}
function houseDoor(open) {   // the front door leaf swinging in front of the lit doorway (per frame); open 0..1
  boilSeed('hdoor');
  const w = 190 * (1 - .82 * open);
  paint(rectPts(480, 600, w, 350), { wash: '#9A5A3E', ink: PAL.ink, sw: 1 });
  if (open < .5) paint(ellPts(480 + w - 20, 790, 8, 8, 8), { wash: '#E8C66A', ink: PAL.ink, sw: .5 });
  paint(rectPts(465, 585, 220, 20), { wash: '#B8604A', ink: PAL.ink, sw: .8 });
}

// ---------- the crossroads under a storm (shot 11) ----------
function crossroadsSet() {
  skyFill('#3C3F5E', '#5B5A7C', '#8B84A0', -500, 2420, -400, 760);
  boilSeed('xfar'); band(-500, 2420, ridge(2.4, 650, 90, .8), 1100, '#5E637E', { n: 30, j: 3 }); band(-500, 2420, ridge(5.5, 740, 70, 1.1), 1100, '#4D536C', { n: 30, j: 3 });
  boilSeed('xground'); band(-500, 2420, ridge(1.3, 790, 20, .9), 1100, '#7C8268', { n: 30, j: 3, ink: PAL.ink, sw: .6 });
  // four forks fanning out of the foreground road toward the horizon
  boilSeed('xroads');
  const base = [960, 1100];
  for (const [tx, w] of [[240, 110], [700, 100], [1220, 100], [1700, 110]]) paint([[base[0] - 190, base[1]], [base[0] + 190, base[1]], [tx + w * .5, 800], [tx - w * .5, 800]], { wash: '#C9BFA0', washOp: 255, ink: PAL.ink, sw: .8 });
  paint(rectPts(770, 940, 380, 200), { wash: '#C9BFA0', ink: null });
  boilSeed('xtrees'); for (const x of [90, 470, 960, 1450, 1830]) { inkLine([[x, 800], [x, 700]], 4, '#3E4457', 'ink', 0); paint(ellPts(x, 690, 46, 38, 12, 2), { wash: '#56638A', ink: PAL.ink, sw: .6 }); }
}
