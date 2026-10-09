// aicuo.js: the shots of the 《爱错》 MV (see STORYBOARD.md). 73 BPM, first downbeat 0.20 s, bar = 3.288 s.
// Hill shots use two plates of the same painter: HW (wide) and HN (near, crisp at the standard framing CAMN).
(() => {
  const BAR = 60 / 73 * 4, bar = n => .2 + n * BAR;
  const gy = x => HILL_Y + 8 * Math.sin(x * .006), FEET = x => gy(x) + 12, U = 20;
  const HW = { cx: 1100, cy: 640, zoom: .9 }, HN = { cx: 800, cy: 700, zoom: 1.35 }, HG = { cx: 2043, cy: 555, zoom: 4 };
  const CAMN = [820, 700, 1.4];   // the standard near framing on the hill (mailbox and 呆呆 side by side)
  const CX = 930, MBY = gy(MBX) + 6, MB_S = 26, MB_TOP = MBY - 6.2 * MB_S;   // 呆呆's usual spot; the mailbox, and the top of its box
  const PAPERW = ['#F1E6CC', '#E6D5B0'], GREYW = ['#6F7280', '#8C8F9C'], SUNW = ['#F2A8B4', '#F8C07E'], PINKW = ['#E27A92', '#F6A9BC'], PURPW = ['#5F4B9C', '#8B72BE'];
  const wipeIn = (lt, cols, len = .3) => { if (lt < len) { boilSeed('wipe'); brushWipe(.5 + lt / (2 * len), cols); } };
  const wipeOut = (lt, dur, cols, len = .3) => { if (lt > dur - len) { boilSeed('wipe'); brushWipe((lt - (dur - len)) / (2 * len), cols); } };
  // a vertical whip: heavy strokes sweep DOWN the screen (cover p 0..0.5, drag off p 0.5..1); cut at p = .5
  function dropWipe(p, cols = PAPERW, up = false) {
    if (p <= 0 || p >= 1) return;
    const [c1, c2] = cols, n = 6, bw = (W + 500) / n + 40;
    push(); translate(W / 2, H / 2); rotate(up ? -Math.PI / 2 - .1 : Math.PI / 2 + .1); translate(-W / 2, -H / 2);
    for (let i = 0; i < n; i++) {
      const x0 = -H / 2 - 250 + i * (W + 500) / n + (W - H) / 2 * 0, d = [0, .14, .06, .18, .1, .04][i];
      const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
      const y0 = 280, yEnd = 1680;
      const a0 = p < .5 ? y0 : lerp(y0, yEnd, q), a1 = p < .5 ? lerp(y0, yEnd, q) : yEnd;
      if (a1 - a0 < 30) continue;
      const P = [], rag = k => 40 + 50 * hash(i * 31 + k) + jit(12);
      for (let k = 0; k <= 8; k++) P.push([lerp(a0, a1, k / 8), x0 + Math.sin(k * .9 + i) * 14 + jit(5)]);
      for (let k = 1; k < 9; k++) P.push([a1 + rag(k) - 40, x0 + bw * k / 9]);
      for (let k = 8; k >= 0; k--) P.push([lerp(a0, a1, k / 8), x0 + bw + Math.sin(k * .8 + i * 2) * 14 + jit(5)]);
      if (p >= .5) for (let k = 8; k > 0; k--) P.push([a0 - rag(k + 20) + 40, x0 + bw * k / 9]);
      paint(P.map(([a, b]) => [a, b]), { wash: i % 2 ? c1 : c2, washOp: 255, fill: i % 2 ? c2 : c1, fillOp: 70, bleed: .05, tex: .8, border: .6, ink: null });
    }
    pop();
  }
  // a quick brush whip centred on the cut time tc (cover for len, reveal for len)
  const whipAt = (t, tc, cols, len = .15) => { if (Math.abs(t - tc) < len) { boilSeed('wipe'); brushWipe(.5 + (t - tc) / (2 * len), cols); } };
  const hillPl = (mode, nearA = 1) => {
    if (nearA < .99) usePlate('hill-' + mode, () => hillSet(mode), HW);
    if (nearA > .01) usePlate('hillN-' + mode, () => hillSet(mode), HN, { alpha: nearA });
  };
  // where the letter sits in 呆呆's hand (body space follows the flip); chest = hugged
  const letterHand = (ce, s = .62) => (u, sw) => { const a = ce.aR ?? .2; letterHeart((4.9 + 2.2 * Math.cos(a) + .7) * u, (-4.5 - 2.2 * Math.sin(a) - .3) * u, u * s, .35 - a * .3); };
  const letterChest = (u, sw) => letterHeart(0, -3.3 * u, u * .72, -.1);
  const leafShape = (s, col) => { paint([[0, -s], [s * .6, -s * .1], [s * .3, s * .7], [0, s], [-s * .3, s * .7], [-s * .6, -s * .1]], { wash: col, ink: PAL.ink, sw: .6, curv: .55 }); inkLine([[0, -s * .8], [0, s * .9]], .5, mixCol(col, PAL.ink, .45), 'inkfine', 0); };
  // a gust of leaves crossing the screen (screen space), starting at t0
  function gust(t, t0, o = {}) {
    const n = o.n ?? 12, dir = o.dir ?? 1, dur = o.dur ?? 1.3, seed = o.seed || 0, cols = o.cols || SETC.autumn.leaf, s0 = o.size ?? 26;
    boilSeed('gust' + seed);
    for (let i = 0; i < n; i++) {
      const a = (t - t0 - hash(i + seed) * .9) / dur; if (a < 0 || a > 1) continue;
      const x = (dir > 0 ? -120 : W + 120) + dir * a * (W + 240), y = (o.y0 ?? 100) + hash(i * 3 + seed) * (o.yr ?? 700) + Math.sin(a * 9 + i) * 60 + a * 120;
      push(); translate(x, y); rotate(a * 14 * dir + i); scale(1, Math.cos(a * 25 + i) * .6 + .5); leafShape(s0 * (.7 + .6 * hash(i + 9)), cols[i % cols.length]); pop();
    }
  }
  // leaves lying on the ground (world space): n leaves heaped around x0
  function leafPile(x0, n, spread = 170) {
    boilSeed('pile');
    for (let i = 0; i < n; i++) {
      const dx = (hash(i * 1.7) - .5) * 2 * spread * (1 - .35 * (i / 60)), lift = (i / 60) * 26 * hash(i + 4);
      paint(ellPts(x0 + dx, FEET(x0 + dx) + 6 - lift - 4 * hash(i + 2), 21 + 8 * hash(i + 5), 8 + 3 * hash(i + 6), 10, 0, (hash(i + 8) - .5) * .8), { wash: SETC.autumn.leaf[i % 4], ink: PAL.ink, sw: .5 });
    }
  }
  const whenIn = (t, a, b) => t >= a && t < b;

  // ======================= 1. the hill, warm autumn (0.00–3.49) =======================
  function shot1(t, lt, dur) {
    const k = ease(seg(t, .25, 3.1));
    camBegin(lerp(1100, CAMN[0], k), lerp(640, CAMN[1], k), lerp(.9, CAMN[2], k));
    hillPl('autumn', ease(seg(k, .78, .98)));
    const wk = ease(seg(t, 1.6, 2.05));
    mailbox(MBX, MBY, MB_S, { key: 's1' });
    // 呆呆 seals the letter with a kiss, hops, then the north wind arrives and he hugs it
    const keys = [[0, 'happy'], [.95, 'love', { aR: 1.05, aL: -.4 }], [1.7, 'nervous', { aL: -1, aR: -1 }], [2.95, 'surprised', { aL: .5, aR: .5 }]];
    const ce = emotions(t, keys);
    const lean = { rot: -.15 * wk, dx: (ce.dx || 0) + .3 * wk * Math.sin(t * 30) };
    const face = t < 2.95 ? {} : turn(t, 2.95, 3.1, 0, -.125);
    const hug = t > 1.75 && t < 2.95;
    daidai(CX, FEET(CX), U, { ...ce, ...lean, ...face, wind: 1.15 * wk, seed: 1,
      draw: hug ? letterChest : t < 2.95 ? letterHand(ce) : undefined });
    // the pigeon flies in from the left and lands on the mailbox
    if (t > 2.6) {
      const f = seg(t, 2.6, 3.28), p = arcPt([-60, 330], [MBX + 8, MB_TOP], -90, easeOut(f));
      const landed = f >= 1, sq = landed ? .2 * Math.exp(-9 * (t - 3.28)) * Math.cos(22 * (t - 3.28)) : 0;
      pigeon(p[0], p[1], 14, { fly: !landed, flap: landed ? .1 : .6 + .6 * Math.sin(t * 34), sq, mood: 'proud', key: 'p1' });
    }
    const hc = toScreen(CX, FEET(CX) - 4 * U);
    camEnd();
    if (t < .65) iris(hc[0], hc[1], 1700 * easeOut(seg(t, .02, .62)), PAL.paper);
    leafFall(t, { n: 7, lean: 90, seed: 1 });
    gust(t, 1.7, { n: 14, seed: 2, yr: 650, dur: 1.2 });
    windLines(t, .9 * wk, { n: 10, y0: 120, y1: 760, dir: 1, seed: 1 });
  }

  // ======================= 2. the letter goes into the pigeon (3.49–6.78) =======================
  function shot2(t, lt, dur) {
    const wind = Math.max(.7 * (1 - ease(seg(t, 3.5, 4.3))) + .25, ease(seg(t, 5.7, 6.1)));   // a gust fades, then the real one comes
    const insert = t >= 4.45 && t < 5.2;
    if (insert) {
      camBegin(HG.cx, HG.cy, HG.zoom + .12 * seg(t, 4.45, 5.2));
      usePlate('hillG-autumn', () => hillSet('autumn'), HG);
      const rise = backOut(seg(t, 4.62, 4.95)), wv = seg(t, 4.95, 5.2);
      const gc = emoAs(GIRL, t, [[4.45, 'neutral'], [4.7, 'happy'], [5.0, 'laugh']]);
      glow(2043, 555, 60, '#FFD890', .8);
      girl(2043, 574 + (1 - rise) * 40, 2.6, { ...gc, aL: 1.1 + .5 * Math.sin((t - 4.95) * 16) * wv + .4 * (1 - wv), aR: .2, boilKey: 77 });
      camEnd();
      whipAt(t, 4.45, PAPERW); whipAt(t, 5.2, PAPERW);
      return;
    }
    camBegin(CAMN[0], CAMN[1], CAMN[2]);
    hillPl('autumn');
    mailbox(MBX, MBY, MB_S, { key: 's1' });
    // 呆呆: hands the letter over, pats the pigeon, turns and points at her far window, waves the pigeon off
    const sent = seg(t, 3.72, 4.06);
    const keys = [[3.49, 'hopeful', { aR: 1.0 }], [4.12, 'excited', { aL: .5 }], [5.35, 'happy'], [5.7, 'love', { aR: 1.2 }]];
    const ce = emotions(t, keys);
    let pose = {};
    if (t < 4.1) pose = { view: 'q', flip: true };
    else if (t < 4.25) pose = turn(t, 4.1, 4.25, -.125, .125);
    else if (t < 5.35) pose = { view: 'side', aL: .95 };   // pointing at the far hill
    else pose = { view: 'side', aL: 1.3 + .4 * Math.sin((t - 5.7) * 14) };
    daidai(CX, FEET(CX), U, { ...ce, ...pose, wind: 1.1 * wind, seed: 1, boilKey: 1, draw: t < 3.72 && pose.view === 'q' ? letterHand(ce) : undefined });
    if (sent > 0 && sent < 1) { const p = arcPt([CX - 6.4 * U, FEET(CX) - 6.4 * U], [MBX - 8, MB_TOP - 46], 60, ease(sent)); letterHeart(p[0], p[1], 10, -.5 + sent * 1.2); }
    // the pigeon: bag, salute, takeoff, blown off course
    const po = seg(t, 5.55, 6.15);
    let px = MBX + 8, py = MB_TOP, pr = {};
    if (t >= 5.55) { const p = arcPt([MBX + 8, MB_TOP], [1260, 560], 140, easeOut(po)); px = p[0]; py = p[1]; pr = { fly: true, flap: .6 + .7 * Math.sin(t * 36) }; }
    if (t >= 6.1) { const g = seg(t, 6.1, 6.78), p = [lerp(1260, 1760, easeIn(g)), lerp(560, 1120, easeIn(g) * easeIn(g) * .6 + g * .4)]; px = p[0]; py = p[1]; pr = { fly: true, flap: .9 * Math.sin(t * 40) + .5, rot: g * 9, mood: 'scared' }; }
    pigeon(px, py, 14, { mood: 'proud', letter: sent >= 1, flap: t > 4.9 && t < 5.5 ? .9 : .08, ...pr, key: 'p1' });
    camEnd();
    if (t < 3.8) leafFall(t, { n: 7, lean: 90, seed: 1 });
    gust(t, 5.8, { n: 12, seed: 5, yr: 600, dur: 1.0 });
    windLines(t, wind, { n: 10, y0: 120, y1: 760, dir: 1, seed: 1 });
    whipAt(t, 4.45, PAPERW); whipAt(t, 5.2, PAPERW);
    if (t > bar(2) - .35) { boilSeed('wipe'); dropWipe((t - (bar(2) - .35)) / .7, PAPERW); }
  }

  // ---------- the yard (铁山's) ----------
  const YW = { cx: 960, cy: 540, zoom: 1 }, YN = { cx: 1330, cy: 700, zoom: 2.1 };
  const DX = 1300, DW = 200, DY = 560, GX = 1400, SY = 884;   // doorway x, width, top; where 铁山 stands; the step surface
  const yardPl = (mode, near) => { if (near) usePlate('yardN-' + mode, () => yardSet(mode), YN); else usePlate('yard-' + mode, () => yardSet(mode), YW); };
  // the heavy front door: open 0..1 swings it back on its left hinge
  function door(open) {
    boilSeed('door');
    const c = Math.cos(open * 1.38), X = x => DX + (x - DX) * c;
    const P = [[DX, 880], [DX, DY + 76], [DX + 26, DY + 26], [DX + DW / 2, DY + 2], [DX + DW - 26, DY + 26], [DX + DW, DY + 76], [DX + DW, 880]].map(([x, y]) => [X(x), y + (x > DX ? -(1 - c) * 26 * ((x - DX) / DW) : 0)]);
    paint(P, { wash: '#7A4E32', fill: '#5E3C26', fillOp: 80, tex: .6, ink: PAL.ink, sw: 1.2, curv: .2 });
    if (c > .3) {
      for (let i = 1; i < 4; i++) inkLine([[X(DX + i * DW / 4), 600 + 20 * Math.abs(i - 2)], [X(DX + i * DW / 4), 876]], .8, '#4A2E1C', 'inkfine', 0);
      paint(ellPts(X(DX + DW * .78), 740, 13 * c, 13, 10), { wash: '#B8B2A6', ink: PAL.ink, sw: .8 });
    }
  }
  // feathers bursting out of a startled pigeon
  function feathers(x, y, age) {
    if (age < 0 || age > 1.1) return;
    boilSeed('feathers');
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * TAU + hash(i) * .5, d = 180 * easeOut(age / 1.1) * (.6 + .6 * hash(i + 3)), fy = age * 120 * (.5 + hash(i + 6));
      push(); translate(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 + fy); rotate(a + age * 5);
      paint(ellPts(0, 0, 15, 4.5, 10), { wash: i % 2 ? PG.lt : PG.body, washOp: 255 * (1 - seg(age, .7, 1.1)), ink: PAL.ink, sw: .4 });
      pop();
    }
  }
  // the unfolded letter: cream paper with a wobbly crayon heart
  function letterSheet(x, y, s, rot = 0) {
    push(); translate(x, y); rotate(rot); boilSeed('sheet');
    paint(rrPts(-1.5 * s, -1.2 * s, 3 * s, 2.4 * s, .12 * s), { wash: '#FFF8E6', fill: '#E7D3A8', fillOp: 60, ink: PAL.ink, sw: .7 });
    paint(heartPts(0, .05 * s, .62 * s), { wash: '#E2476E', ink: PAL.ink, sw: .4 });
    for (const [dx, dy] of [[-1, -.75], [1.05, -.8], [-1.05, .8], [1.0, .75]]) inkLine([[dx * s - .12 * s, dy * s], [dx * s + .12 * s, dy * s]], .6, '#E2476E', 'ink', 0);
    pop();
  }
  const GIANT_U = 27;
  // the giant's own feeling keys, with his colours
  const gEmo = (t, keys) => emoAs(GI, t, keys);

  // ======================= 3. the wrong door (6.78–10.06) =======================
  function shot3(t, lt, dur) {
    const k = ease(seg(t, 8.0, 9.9));
    camBegin(lerp(960, 1060, k), lerp(540, 520, k), lerp(1.04, 1.12, k) - .04 * easeOut(seg(lt, 0, .5)) * 0);
    yardPl('grey');
    const opened = ease(seg(t, 7.7, 8.15));
    door(opened);
    // 铁山 (behind the door until it swings open)
    const gx = t < 9.0 ? GX : stroll(t, 9.0, 9.35, GX, 1295, GIANT_U).x;
    const walking = t >= 9.0 && t < 9.35;
    if (t > 8.05) {
      const ge = gEmo(t, [[8.05, 'angry'], [8.8, 'suspicious'], [9.6, 'surprised']]);
      let gp = { view: 'front' };
      if (t >= 8.8 && t < 9.0) gp = { view: 'front', lookX: -.9 };
      if (walking) gp = { view: 'q', flip: true, walk: (t - 9.0) * 3, dy: -.3 * Math.abs(Math.sin((t - 9.0) * 14)) };
      if (t >= 9.35) gp = { view: 'q', flip: true };
      const crouch = seg(t, 9.35, 9.5) * (1 - seg(t, 9.55, 9.7));
      const hold = t >= 9.55;
      const aR = hold ? 1.15 : .2;
      giant(gx, SY, GIANT_U, { ...ge, ...gp, brow: lerp(.75, .1, seg(t, 9.55, 9.8)), sq: (ge.sq || 0) + .3 * crouch, aR: hold ? aR : (ge.aR ?? .2), boilKey: 31,
        draw: hold ? (u, sw) => letterHeart((4.9 + 2.2 * Math.cos(aR) + .5) * u, (-4.5 - 2.2 * Math.sin(aR) - .3) * u, u * .6, .2) : undefined });
    }
    // the doormat the letter lands on
    paint(rectPts(1230, 892, 130, 22, 1), { wash: '#8C6A4A', ink: PAL.ink, sw: .8 });
    // the pigeon: falls, hits the fence, is out cold, wakes up frozen, explodes and flees
    const fall = seg(t, 6.9, 7.3);
    if (t < 8.7) {
      let px = 540 + 30 * fall, py = lerp(-140, 770, easeIn(fall)), pr = { rot: fall * 7, fly: true, flap: .8 * Math.sin(t * 38) + .6, mood: 'scared', sweat: false };
      if (t >= 7.3) { const a = t - 7.3, bounce = Math.max(0, Math.sin(Math.min(a, .4) * Math.PI / .4)) * 30 * Math.exp(-a * 6); px = 570; py = 770 - bounce; pr = { rot: 1.35, mood: t < 8.05 ? 'ko' : 'scared', sq: t < 8.05 ? .06 * Math.exp(-a * 5) * Math.cos(a * 25) : 0, bag: true, sweat: true }; if (t >= 8.05) { pr.rot = .15; } }
      if (t >= 8.2) { pr.rot = .05; }
      const trem = t >= 8.05 ? Math.sin(t * 60) * 2.2 : 0;
      pigeon(px + trem, py, 17, { ...pr, bag: true, letter: t < 7.3, key: 'p3' });
      if (t >= 7.3 && t < 8.05) emote('stars', 570 - 10, 770 - 120, 15, seg(t, 7.32, 7.5), t - 7.32);
    } else {
      const f = t - 8.7, fx = 570 - 900 * easeIn(f / 1.0), fy = 770 - 330 * easeOut(f / .9);
      pigeon(fx, fy, 17, { fly: true, flap: .9 * Math.sin(t * 40) + .6, mood: 'scared', rot: -.15, bag: true, flip: true, key: 'p3' });
      feathers(570, 700, f);
      if (f < .25) { for (let i = 0; i < 6; i++) { const a = -Math.PI * .8 + i * .3; inkLine([[570 + Math.cos(a) * 60, 700 + Math.sin(a) * 60], [570 + Math.cos(a) * 110, 700 + Math.sin(a) * 110]], 1.6, PAL.ink, 'ink', 0); } }
    }
    // the letter: flung out of the bag, spins across the yard, lands on the step; then the giant lifts it
    if (t >= 7.3 && t < 9.5) {
      const f = seg(t, 7.3, 7.95), p = arcPt([590, 740], [1290, 884], 200, easeOut(f));
      letterHeart(p[0], p[1], 15, f < 1 ? f * 11 : 11 % TAU);
    }
    const gc = toScreen(1290 + 4.9 * 0, 884 - 6 * GIANT_U);
    const sealPos = toScreen(gx - (4.9 + 2.2 * Math.cos(1.15) + .5) * GIANT_U, 884 - (4.5 + 2.2 * Math.sin(1.15) + .3) * GIANT_U);
    camEnd();
    // the red seal swells until it is the whole screen (the next shot opens a heart-shaped hole in it)
    const grow = seg(t, 9.72, 10.06);
    if (grow > 0) { boilSeed('seal'); paint(heartPts(sealPos[0], sealPos[1], lerp(30, 2000, easeIn(grow)), 34), { wash: '#D8394E', ink: grow < .6 ? PAL.ink : null, sw: 1.2 }); if (grow > .9) flash(1, '#D8394E'); }
    if (lt < .35) { boilSeed('wipe'); dropWipe(.5 + lt / .7, PAPERW); }
  }

  // ======================= 4. 铁山 reads it; 呆呆 waits (10.06–13.35) =======================
  const HEARTRED = '#D8394E', HEARTPINK = '#F08CA8';
  function shot4(t, lt, dur) {
    const tHill = 12.45;
    if (t < tHill) {
      camBegin(1330, 700, 2.1);
      yardPl('grey', true);
      boilSeed('door4'); paint([[DX - 6, 880], [DX - 6, DY + 70], [DX + 18, DY + 30], [DX + 34, DY + 40], [DX + 34, 880]], { wash: '#7A4E32', ink: PAL.ink, sw: 1.2, curv: .2 });   // the open door's edge
      const ge = gEmo(t, [[10.06, 'angry'], [10.95, 'confused'], [11.3, 'shy'], [11.72, 'love']]);
      const brow = lerp(.75, -.55, ease(seg(t, 10.95, 11.8))), tear = ease(seg(t, 10.55, 10.95));
      const read = t > 10.95;
      const sheetPop = backOut(seg(t, 10.95, 11.2));
      const press = ease(seg(t, 11.8, 12.0));
      const lookX = read ? Math.sin((t - 11.0) * 9) * .8 : 0, lookY = read ? .7 : 0;
      giant(1330, SY, GIANT_U, { ...ge, view: 'front', brow, moDroop: lerp(.6, 1, ease(seg(t, 11, 11.8))), lookX: t < 11.3 ? lookX : 0, lookY: t < 11.3 ? lookY : 0, aL: .95, aR: .95,
        sq: (ge.sq || 0) + .05 * press, boilKey: 32,
        draw: (u, sw) => { if (!read) letterHeart(0, -3.1 * u, u * .85, -.08 + .05 * Math.sin(t * 20) * tear); else letterSheet(0, lerp(-3.0, -3.7, press) * u, u * lerp(1.15, .9, press) * sheetPop, lerp(-.04, .15, press)); } });
      camEnd();
      // the heart opens up, then closes on the lovesick giant
      boilSeed('hirisA');
      const op = seg(t, 10.06, 10.6), cl = seg(t, 11.98, 12.42);
      if (cl > 0) irisShape(heartPts(960, 560, lerp(1900, 0, easeIn(cl)) + 2, 40), HEARTPINK);
      else if (t < 10.6) irisShape(heartPts(960, 560, lerp(0, 1900, easeOut(op)) + 2, 40), HEARTRED);
    } else {
      camBegin(CAMN[0], CAMN[1], CAMN[2]);
      hillPl('autumn');
      mailbox(MBX, MBY, MB_S, { key: 's4' });
      const ce = emotions(t, [[tHill, 'hopeful', { aR: 1.55, aL: .2 }]]);
      daidai(CX, FEET(CX), U, { ...ce, view: 'front', wind: .1, seed: 1, boilKey: 1 });
      camEnd();
      leafFall(t, { n: 7, lean: 90, seed: 1 });
      const op = seg(t, tHill, tHill + .45);
      boilSeed('hirisB'); if (op < 1) irisShape(heartPts(960, 600, lerp(0, 1900, easeOut(op)) + 2, 40), HEARTPINK);
    }
  }

  // ======================= 5. the waiting (13.35–16.64) =======================
  function shot5(t, lt, dur) {
    camBegin(CAMN[0], CAMN[1], CAMN[2]);
    const toNight = ease(seg(t, 13.85, 14.25)), toGrey = ease(seg(t, 14.5, 14.9));
    hillPl('autumn');
    if (toNight > .01) { usePlate('hillN-autumnNight', () => hillSet('autumnNight'), HN, { alpha: toNight }); }
    if (toGrey > .01) { usePlate('hillN-grey', () => hillSet('grey'), HN, { alpha: toGrey }); }
    leafPile(CX, Math.floor(60 * seg(t, 13.5, 15.3)), 190);
    const opening = ease(seg(t, 15.0, 15.3));
    mailbox(MBX, MBY, MB_S, { key: 's5', open: opening });
    const mouth = [MBX + 2.75 * MB_S, MBY - 4.85 * MB_S];
    cobweb(mouth[0] + 6, mouth[1], 44, t < 15.3 ? 1 : 0);
    if (t > 15.3 && t < 16.6) { const f = seg(t, 15.3, 16.6), p = arcPt([mouth[0] + 10, mouth[1]], [mouth[0] + 520, mouth[1] - 330], 140, easeOut(f)); moth(p[0], p[1], 14); }
    const ce = emotions(t, [[13.35, 'hopeful', { aR: 1.55 }], [13.95, 'bored'], [14.3, 'sleepy'], [14.8, 'hopeful', { aR: 0 }], [15.5, 'surprised'], [15.85, 'sad', { emote: null }]]);
    let pose = { view: 'front' };
    if (t >= 14.85) pose = turn(t, 14.85, 15.0, 0, -.125);
    const slump = seg(t, 15.85, 16.2);
    daidai(CX, FEET(CX), U, { ...ce, ...pose, seed: 1, boilKey: 1, wind: .08 + .2 * Math.sin(t * 2), sq: (ce.sq || 0) + .1 * slump });
    camEnd();
    leafFall(t, { n: 10 + Math.floor(8 * toGrey), lean: 160, seed: 3, speed: 1.6 });
    if (t > 16.2) { /* a last leaf settles on his head is handled in S6 */ }
    wipeOut(lt, dur, GREYW);
  }

  // ---------- props local to the shots ----------
  function table(x, y, s, k = 1) {
    if (k <= .01) return; const g = backOut(k);
    boilSeed('table' + x);
    for (const d of [-1, 0, 1]) inkLine([[x + d * 1.5 * s * g, y - 3.1 * s * g], [x + d * 2.0 * s * g, y]], 2.4, WOOD_DK, 'ink', 0);
    paint(ellPts(x, y - 3.15 * s * g, 2.7 * s * g, .55 * s * g, 18), { wash: '#B98253', fill: WOOD, fillOp: 60, ink: PAL.ink, sw: .9 });
  }
  const TBL = 990, KS = 1110, ES = 870, STOOL = 24, TTOP = s => FEET(TBL) - 3.15 * s;
  // ======================= 6. two cups of tea (16.64–19.93) =======================
  const HT = { cx: 1000, cy: 760, zoom: 1.9 };
  // the grey rain cloud swelling over the whole picture (p5.brush drops shapes much bigger than the canvas, so past r≈1150 a flat sheet fades in)
  function bigCloud(x, y, k) {
    boilSeed('bigcloud');
    const r = lerp(150, 1150, easeIn(clamp(k / .8))), f = seg(k, .72, 1);
    if (r > 6) paint(ellPts(x, y, r, r * .9, 40, r * .03), { wash: '#9AA0BC', fill: PAL.indigo, fillOp: 60, ink: PAL.ink, sw: 1, curv: .4 });
    if (f > 0) paint(rectPts(-80, -80, W + 160, H + 160, 4), { wash: '#9AA0BC', washOp: 255 * f, ink: null });
  }
  function shot6(t, lt, dur) {
    camBegin(HT.cx, HT.cy, HT.zoom);
    usePlate('hillT-grey', () => hillSet('grey'), HT);
    leafPile(CX, 60, 190);
    mailbox(MBX, MBY, MB_S, { key: 's6' });
    const sy = FEET(ES), ky = FEET(KS);
    const tk = seg(t, 17.0, 17.3), sk = seg(t, 17.15, 17.45);
    table(TBL, FEET(TBL), 22, tk);
    if (sk > .01) { boilSeed('stools'); const g = backOut(sk); stool(ES, sy, STOOL * g); stool(KS, ky, STOOL * g); }
    const topY = FEET(TBL) - 3.15 * 22;
    const c1 = seg(t, 17.55, 17.7), c2 = seg(t, 17.8, 17.95);
    if (c1 > 0) teaCup(TBL - 38, topY - (1 - easeOut(c1)) * 60, 15, 1);
    if (c2 > 0) teaCup(TBL + 38, topY - (1 - easeOut(c2)) * 60, 15, 1 - ease(seg(t, 18.1, 18.9)));
    // the leaf that takes the other seat
    if (t > 18.2) { const f = seg(t, 18.2, 18.85), p = arcPt([ES - 300, sy - 420], [ES - 4, sy - 1.55 * STOOL - 8], -60, easeOut(f)); push(); translate(p[0], p[1]); rotate(f < 1 ? f * 9 : .6); scale(1, f < 1 ? Math.cos(f * 20) * .5 + .6 : .35); leafShape(24, SETC.autumn.leaf[1]); pop(); }
    // 呆呆: puts everything out, hops onto his stool, waits, gets rained on
    const rain = ease(seg(t, 18.95, 19.3));
    const hop = t < 17.5 ? jump(t, 17.3, 17.52, 1.6) : {};
    const ce = emotions(t, [[16.64, 'bored'], [17.5, 'hopeful'], [18.3, 'neutral'], [18.9, 'sad', { emote: null }]]);
    const seat = ease(seg(t, 17.3, 17.52)), dx = lerp(CX - KS, 0, 1);
    const ypos = lerp(FEET(CX), ky - 1.55 * STOOL, seat);
    const xpos = t < 17.3 ? KS : KS;
    daidai(xpos, ypos + (hop.dy || 0) * U, U, { ...ce, view: 'q', flip: true, sq: (ce.sq || 0) + (hop.sq || 0), dy: (ce.dy || 0) * .4, lookY: rain > 0 ? -1 : ce.lookY, wind: .1, seed: 1, boilKey: 1 });
    camEnd();
    // the little rain cloud that only follows him
    camBegin(HT.cx, HT.cy, HT.zoom);
    if (rain > 0) miniCloud(KS, ky - 1.55 * STOOL - 8 * U - 60, 105, rain, { groundY: ky - 1.55 * STOOL });
    const cc = toScreen(KS, ky - 1.55 * STOOL - 8 * U - 60);
    camEnd();
    leafFall(t, { n: 8, lean: 160, seed: 3, speed: 1.3 });
    wipeIn(lt, GREYW);
    // the cloud swells over the whole screen
    const big = seg(t, 19.55, 19.93);
    if (big > 0) bigCloud(cc[0], cc[1], big);
  }

  // ======================= 7. 铁山 knits (19.93–23.21) =======================
  const ROOM = { cx: 960, cy: 540, zoom: 1 }, RN = { cx: 1180, cy: 700, zoom: 1.55 }, GCH = [1010, 872];
  function shot7(t, lt, dur) {
    const k = ease(seg(t, 20.3, 21.5));
    camBegin(lerp(960, RN.cx, k), lerp(540, RN.cy, k), lerp(1, RN.zoom, k));
    usePlate('room', roomSet, ROOM);
    const nr = ease(seg(k, .8, .98)); if (nr > .01) usePlate('roomN', roomSet, RN, { alpha: nr });
    flames(1660, 880, 22, t);
    // the scarf, growing across the floor to the doorway
    const prog = ease(seg(t, 20.0, 22.2)), path = through([[1060, 790], [1130, 880], [1340, 930], [1650, 940], [2100, 945]], 14), m = Math.max(2, Math.floor(path.length * (.18 + .82 * prog)));
    knitScarf(path.slice(0, m), 40);
    // 铁山 in the armchair
    const looksAtCup = whenIn(t, 21.0, 21.45) || whenIn(t, 21.9, 22.15);
    const proud = seg(t, 22.2, 22.45);
    const ge = gEmo(t, [[19.93, 'happy', { emote: 'music' }], [22.2, 'love'], [22.75, 'cry', { emote: null }]]);
    giant(GCH[0], GCH[1], GIANT_U, { ...ge, view: 'front', brow: -.25, moDroop: .4, lookX: looksAtCup ? 1 : 0, aL: lerp(.5, 1.45, proud), aR: lerp(.5, 1.45, proud), boilKey: 33,
      sq: (ge.sq || 0), draw: (u, sw) => { if (proud > 0) knitScarfHeld(u, proud); } });
    armchairFront();
    // needles and the yarn from the basket
    if (t < 22.2) { boilSeed('needles'); const wv = Math.sin(t * 11) * .22;
      inkLine([[560, 835], [760, 880], [940, 800], [1000, 796]], 2.2, PINK, 'ink', .6);
      for (const d of [-1, 1]) { push(); translate(GCH[0] + d * 20, 800); rotate(d * (.55 + wv * d)); inkLine([[-4, 0], [-4, -150]], 3.2, '#C9A06B', 'ink', 0); paint(ellPts(-4, -152, 7, 7, 8), { wash: PINK_DK, ink: PAL.ink, sw: .5 }); pop(); } }
    // the side table with the pigeon in a big teacup
    boilSeed('sidetable'); paint(ellPts(1380, 846, 74, 13, 20), { wash: '#B98253', ink: PAL.ink, sw: .9 }); paint(rectPts(1372, 846, 16, 28, 1), { wash: WOOD_DK, ink: PAL.ink, sw: .7 }); paint(ellPts(1380, 874, 44, 8, 14), { wash: WOOD_DK, ink: PAL.ink, sw: .7 });
    const scare = looksAtCup ? 0 : 1, trem = Math.sin(t * 52) * 2.4 * scare;
    pigeon(1384 + trem, 852, 13, { mood: looksAtCup ? 'blank' : 'scared', bag: false, sweat: scare > 0, key: 'p7', headDY: .0 });
    boilSeed('bigcup'); const cx = 1380 + trem * .6, cy = 850;
    paint([[cx - 70, cy + 4], [cx + 70, cy + 4], [cx + 54, cy - 62], [cx - 54, cy - 62]], { wash: '#F6EDDA', fill: '#C9B79A', fillOp: 50, ink: PAL.ink, sw: 1.1, curv: .15 });
    paint(ellPts(cx, cy - 62, 54, 10, 18), { wash: '#E7D8BA', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 3; i++) paint(heartPts(cx - 28 + i * 28, cy - 28, 8), { wash: PINK, ink: null });
    inkLine([[cx + 68, cy - 54], [cx + 104, cy - 38], [cx + 70, cy - 12]], 2.4, PAL.ink, 'ink', .5);
    camEnd();
    // the grey cloud shrinks away (it was the end of the last shot) and, at the end, pink brushes come in
    if (lt < .45) bigCloud(720, 560, 1 - ease(lt / .45));
    wipeOut(lt, dur, PINKW);
  }
  // the finished scarf held up in both hands (body space)
  function knitScarfHeld(u, k) {
    boilSeed('heldscarf');
    paint(ribbon([[-6.2 * u, -6.7 * u], [-3 * u, -8.8 * u], [0, -6.4 * u], [3 * u, -8.8 * u], [6.2 * u, -6.7 * u]], 2.0 * u, 2.0 * u), { wash: PINK, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 9; i++) { const x = lerp(-5.6, 5.6, i / 8) * u; inkLine([[x, -7.4 * u], [x + .3 * u, -6.3 * u]], 2, PINK_LT, 'inkfine', 0); }
  }

  // ======================= 8–9. the snowman (23.21–29.79; one continuous shot) =======================
  const SNX = 1090, SNS = 26, yap = (t, on) => on ? ['open', 'smile', 'o', 'grin', 'open', 'flat'][Math.floor(t * 9) % 6] : undefined;
  // snow resting on 呆呆's head and shoulders (body space; view-aware)
  const snowCap = (view, k) => (u, sw) => {
    if (k <= .02) return; const V = VIEWS[view] || VIEWS.front; boilSeed('cap');
    paint(ellPts((V.L + V.R) / 2 * u, -8.05 * u, (V.R - V.L) / 2 * u * 1.04, 1.05 * u * k, 20), { wash: '#F6F9FF', fill: '#BFD0E8', fillOp: 60, ink: PAL.ink, sw: .6 });
    paint(ellPts((V.L + V.R) / 2 * u - 1.4 * u, -8.5 * u * 1.0 - .2 * u, 1.9 * u, .8 * u * k, 12), { wash: '#FFFFFF', ink: null });
  };
  function snowmanS(x, y, s, o = {}) {
    const k1 = backOut(o.k1 ?? 1), k2 = backOut(o.k2 ?? 1), k3 = backOut(o.k3 ?? 1), ka = clamp(o.ka ?? 1);
    boilSeed('snowmanS'); push(); translate(x, y); rotate(o.lean || 0);
    if (ka > .02) for (const d of [-1, 1]) inkLine([[d * 1.0 * s, -3.9 * s], [d * 1.9 * s * ka, -4.5 * s + (o.armUp || 0) * -s], [d * 2.5 * s * ka, -4.9 * s + (o.armUp || 0) * -s * 1.4]], 1.4, WOOD_DK, 'ink', .4);
    if (k1 > .02) snowBall(0, -1.5 * s * k1, 1.55 * s * k1);
    if (k2 > .02) snowBall(0, -3.7 * s, 1.1 * s * k2);
    if (k2 > .5) for (let i = 0; i < 2; i++) paint(ellPts(0, -3.4 * s + i * 1.15 * s, .12 * s, .12 * s, 6), { wash: PAL.ink, ink: null });
    if (o.head !== false && k3 > .02) { push(); translate(0, -5.4 * s); scale(-1, 1); snowBall(0, 0, .95 * s * k3, { face: true }); pop(); }
    pop();
  }
  const carrot = (x, y, len, rot) => { push(); translate(x, y); rotate(rot); paint([[0, -len * .16], [len, 0], [0, len * .16]], { wash: '#E8832B', ink: PAL.ink, sw: .6 }); pop(); };
  function snowBurst(x, y, age) {
    if (age < 0 || age > .6) return; boilSeed('burst');
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, d = 230 * easeOut(age / .6) * (.6 + .5 * hash(i + 2)); paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 + 60 * age * age, 16 + 10 * hash(i + 5), 14 + 8 * hash(i + 7), 10), { wash: '#F6F9FF', ink: PAL.ink, sw: .5 }); }
  }
  function shot8(t, lt, dur) {
    camBegin(CAMN[0], CAMN[1], CAMN[2]);
    hillPl('snow');
    const cap = ease(seg(t, 23.3, 26.4)), fy = FEET(CX);
    mailbox(MBX, MBY, MB_S, { key: 's8', snow: .3 + .7 * cap });
    // the snowman goes up in three pops, then talks, then loses its head
    const hit = 27.85;
    const sk = [seg(t, 24.7, 24.95), seg(t, 25.08, 25.33), seg(t, 25.42, 25.67), seg(t, 25.6, 25.8)];
    const gone = t >= hit;
    snowmanS(SNX, FEET(SNX), SNS, { k1: sk[0], k2: sk[1], k3: sk[2], ka: sk[3], head: !gone, lean: gone ? .04 * Math.exp(-(t - hit) * 4) * Math.sin((t - hit) * 20) : 0 });
    if (gone) {   // the head: knocked off, bounces, rolls away off the cliff; the carrot nose flies to 呆呆's hand
      const f = seg(t, hit, 28.25), r = .95 * SNS, hp0 = [SNX, FEET(SNX) - 5.4 * SNS], hp1 = [1240, FEET(1240) - r];
      let hx, hy, rot;
      if (t < 28.25) { const p = arcPt(hp0, hp1, 110, f); hx = p[0]; hy = p[1]; rot = f * 9; }
      else { const a = t - 28.25, bounce = Math.max(0, Math.sin(Math.min(a, .35) * Math.PI / .35)) * 26 * Math.exp(-a * 5); hx = 1240 + 330 * a; hy = FEET(hx) - r - bounce + (hx > 1500 ? 700 * Math.pow((hx - 1500) / 330, 2) : 0); rot = 9 + a * 14; }
      push(); translate(hx, hy); scale(-1, 1); snowBall(0, 0, r, { face: false, rot: -rot }); pop();
      if (t < 28.25) { const nf = seg(t, hit + .05, 28.2); const cp = arcPt([hp0[0] - r * .8, hp0[1] + 4], [CX + 120, fy - 7.2 * U], 80, easeOut(nf)); if (nf < 1) carrot(cp[0], cp[1], 34, -2.6 + nf * 9); }
    }
    // 呆呆
    const shiver = t < 24.4 ? Math.sin(t * 44) * .16 : 0;
    const talk = whenIn(t, 25.85, 27.8) || whenIn(t, 28.7, 29.4);
    const ce = emotions(t, [[23.2, 'sad', { emote: null }], [24.4, 'determined'], [25.75, 'happy'], [25.95, 'sad', { emote: null }], [26.9, 'cry'], [hit, 'surprised', { emote: null }], [28.7, 'neutral', { eyes: 'normal', mouth: 'o' }]]);
    let pose = { view: 'front' };
    if (t >= 24.4 && t < 25.9) pose = turn(t, 24.4, 24.55, 0, .125); else if (t >= 25.9) pose = { view: 'q' };
    if (t >= 25.9) pose = turn(t, 25.9, 26.0, .125, .125);   // keeps facing the snowman in q view
    const sw = Math.sin(t * 7);
    const gest = whenIn(t, 25.95, 27.75) ? { aL: .5 + .9 * Math.max(0, sw), aR: .5 + .9 * Math.max(0, -sw) } : {};
    const hops = [24.75, 25.12, 25.46].reduce((a, tp) => { const j = jump(t, tp - .18, tp, 1.1); return { dy: a.dy + j.dy, sq: a.sq + j.sq }; }, { dy: 0, sq: 0 });
    const wind = t >= 27.2 ? ease(seg(t, 27.2, 27.85)) : 0;
    const tw = whenIn(t, 28.0, 29.4) ? 1 : 0;
    const shake = t >= 29.3 ? Math.sin(t * 70) * .45 * (1 - seg(t, 29.3, 29.6) * .3) : 0;
    daidai(CX, fy, U, { ...ce, ...pose, ...gest, dx: (ce.dx || 0) + shiver + shake, dy: (ce.dy || 0) + hops.dy, sq: (ce.sq || 0) + hops.sq, mouth: talk ? yap(t, true) : (ce.mouth), wind: .2 + .9 * wind, seed: 1, boilKey: 1,
      lookX: t >= 28.0 && t < 28.7 ? 1 : ce.lookX, aR: t >= 28.0 ? (t < 28.2 ? 1.2 : 1.1) : (gest.aR ?? ce.aR), aL: gest.aL ?? ce.aL,
      draw: (u, sw2) => { snowCap(pose.view || 'front', cap * (t >= 29.3 ? 1 - seg(t, 29.4, 29.55) : 1))(u, sw2); if (t >= 28.15) carrot((4.9 + 2.2 * Math.cos(1.1) + .2) * u, (-4.5 - 2.2 * Math.sin(1.1)) * u, 1.9 * u, -1.2); } });
    snowBurst(CX, fy - 7 * U, t - 29.4);
    camEnd();
    snowFall(t, { n: 70, lean: 140, seed: 1 });
    windLines(t, wind * .95, { n: 11, y0: 120, y1: 760, dir: -1, seed: 3 });
    wipeIn(lt, PINKW);
    flash(seg(t, 29.45, 29.78));
  }

  // ======================= 10. the wings (29.79–33.08) =======================
  const HW_WIN = [2043, 555];
  function shot10(t, lt, dur) {
    const k = ease(seg(t, 30.45, 31.1));
    camBegin(lerp(HW.cx, CAMN[0], k), lerp(HW.cy, CAMN[1], k), lerp(HW.zoom, CAMN[2], k));
    hillPl('snow', ease(seg(k, .78, .98)));
    glow(HW_WIN[0], HW_WIN[1], 90 + 14 * Math.sin(t * 5), '#FFD890', .85);
    mailbox(MBX, MBY, MB_S, { key: 's8', snow: 1 });
    const fy = FEET(CX);
    // snow chunks from the burst settle at his feet
    boilSeed('chunks'); for (let i = 0; i < 7; i++) { const a = lt * 1.0, land = clamp(a * 2.2 - hash(i) * .5), x = CX + (hash(i + 1) - .5) * 300, y = lerp(fy - 200 - 60 * hash(i + 3), FEET(x) + 8, easeIn(land)); paint(ellPts(x, y, 14 + 8 * hash(i + 4), 10 + 5 * hash(i + 5), 9), { wash: '#F6F9FF', ink: PAL.ink, sw: .5 }); }
    // the cardboard on the ground in front of him
    const sawing = whenIn(t, 30.62, 31.43), hamm = whenIn(t, 31.43, 32.25), done = t >= 32.25;
    if (t >= 30.62 && !done) { const pop = backOut(seg(t, 30.62, 30.8)); if (t < 31.2) cardSheet(CX + 150, fy - 55 * pop, 150 * pop, 100 * pop, .08); else { cardSheet(CX + 120, fy - 22, 96, 60, .1); cardSheet(CX + 190, fy - 24, 96, 60, -.1); } }
    const ce = emotions(t, [[29.79, 'determined', { aL: .2, aR: .2 }], [31.8, 'surprised', { emote: '!' }], [32.1, 'determined'], [32.3, 'proud', { emote: 'spark' }], [32.75, 'excited']]);
    let pose = { view: 'front' };
    if (t >= 30.05) pose = turn(t, 30.05, 30.2, 0, .25);
    const sawK = Math.sin(t * 22) * .35;
    const hj = jump(t, 31.78, 32.0, 2.5);
    let armHook = {};
    if (sawing) armHook = { armL: sawHook, aL: .4, dx: sawK * .6 };
    else if (hamm) { const sw3 = t < 31.78 ? Math.sin((t - 31.43) * 9) * .9 : -.4; armHook = { armL: (u, sw2) => hammerHook(u, sw2, sw3), aL: t < 31.78 ? .9 + .5 * Math.sin((t - 31.43) * 9) : .1 }; }
    const flap = done ? ease(seg(t, 32.3, 32.45)) * (.3 + .6 * Math.max(0, Math.sin((t - 32.5) * 14))) : 0;
    daidai(CX, fy, U, { ...ce, ...pose, ...armHook, dy: (ce.dy || 0) + (hamm ? hj.dy : 0), sq: (ce.sq || 0) + (hamm ? hj.sq : 0), tint: t >= 31.78 && t < 32.15 ? 'flush' : ce.tint, tintK: t >= 31.78 && t < 32.15 ? .8 : ce.tintK, wind: .3 + .5 * Math.max(0, Math.sin(t * 6)), seed: 1, boilKey: 1, wings: done, flap, goggles: done && t > 32.3 });
    if (sawing) { boilSeed('dust'); for (let i = 0; i < 5; i++) { const a = frac(t * 3 + i / 5); paint(ellPts(CX + 150 + 20 * hash(i) - 12 * a, fy - 70 + a * 60, 3, 3, 6), { wash: '#C9A06B', washOp: 255 * (1 - a), ink: null }); } }
    camEnd();
    snowFall(t, { n: 40, lean: 100, seed: 1 });
    flash(1 - seg(lt, 0, .3));
  }

  // ======================= 11. the cliff edge (33.08–36.36) =======================
  const HC = { cx: 1380, cy: 820, zoom: 1.35 }, HZ = { cx: 1500, cy: 800, zoom: 1 }, EDGE = 1452;
  const wingFlap = t => .3 + .6 * Math.max(0, Math.sin((t - 32.5) * 14));   // the same flapping as the end of shot 10, so the cut matches
  function shot11(t, lt, dur) {
    camBegin(1380, 820, 1.4);
    usePlate('hillC-snow', () => hillSet('snow'), HC);
    const w = stroll(t, 33.1, 33.95, 1240, EDGE, U), fy = FEET(w.x), walking = t < 33.95;
    const fear = ease(seg(t, 34.0, 34.4)) * (1 - ease(seg(t, 35.4, 35.7))), crouch = ease(seg(t, 36.05, 36.3));
    const ce = emotions(t, [[33.08, 'excited'], [34.05, 'scared'], [35.4, 'relieved'], [36.1, 'determined']]);
    const tremble = t >= 34.4 && t < 35.4 ? Math.sin(t * 58) * .14 : 0, breath = t >= 35.4 && t < 36.05 ? -.1 * Math.sin((t - 35.4) / .65 * Math.PI) : 0;
    daidai(w.x, fy, U, { ...ce, view: 'side', walk: walking ? w.walk : undefined, dy: (walking ? w.dy : 0) + (ce.dy || 0) * .3, dx: tremble, rot: .14 * fear, lookY: fear > .2 ? 1 : 0,
      sq: (ce.sq || 0) * .4 + breath + .28 * crouch, wings: true, goggles: true, flap: fear > .05 ? .12 + .1 * Math.sin(t * 46) : wingFlap(t), wind: .3, seed: 1, boilKey: 1 });
    // a pebble goes over the edge; a long, long way down it makes a tiny puff
    if (t >= 34.3) {
      const a = t - 34.3;
      if (a < 1.1) paint(ellPts(lerp(1500, 1596, easeOut(seg(a, 0, .35))), 905 + 260 * a, 9, 7, 8), { wash: '#8A8076', ink: PAL.ink, sw: .5 });
      else if (a < 1.9) { const g = (a - 1.1) / .8; boilSeed('puff'); for (let i = 0; i < 4; i++) paint(ellPts(1596 + (i - 1.5) * 26 * g, 1190 - 14 * g - 6 * i, 12 + 22 * g, 9 + 14 * g, 10), { wash: '#F4F1EA', washOp: 255 * (1 - g), ink: null }); }
    }
    camEnd();
    snowFall(t, { n: 30, lean: 80, seed: 2 });
  }

  // ======================= 12. the jump (36.36–39.65) =======================
  function riseLines(t, t0, t1, x0, x1) {
    const k = Math.sin(Math.PI * seg(t, t0, t1)); if (k <= .02) return; boilSeed('rise');
    for (let i = 0; i < 9; i++) {
      const x = lerp(x0, x1, i / 8), L = 120 + 90 * hash(i), yb = 1230 - frac(hash(i + 3) + t * 1.5) * 760, P = [];
      for (let j = 0; j <= 5; j++) { const a = j / 5; P.push([x + 16 * Math.sin(a * 4 + i + t * 3), yb + a * L]); }
      inkLine(P, .8 + 1.8 * k, '#FBE2BE', 'dry', .5); inkLine(P, .9, '#E39A62', 'inkfine', .5);
    }
  }
  // 呆呆's flight path through the jump, in world coordinates
  function jumpPos(t) {
    const tj = 36.78, y0 = FEET(EDGE), a = t - tj;
    if (a < 0) return { x: EDGE, y: y0, rot: 0 };
    const yFall = y0 - 420 * a + 1200 * a * a, yRise = 1095 - 560 * easeOut(seg(a, .62, 1.7)) - 70 * Math.max(0, a - 1.7);
    const s = ease(seg(a, .55, .75));
    const x = a < .62 ? EDGE + 330 * a : Math.min(2150, EDGE + 330 * .62 + 230 * (a - .62));
    return { x, y: lerp(yFall, yRise, s), rot: lerp(.5, -.28, ease(seg(a, .55, 1.0))) };
  }
  function shot12(t, lt, dur) {
    camBegin(HZ.cx, HZ.cy, HZ.zoom);
    usePlate('hillZ-snow', () => hillSet('snow'), HZ);
    const a = t - 36.78, P = jumpPos(t), y0 = FEET(EDGE);
    riseLines(t, 37.25, 38.9, 1560, 1760);
    const crouch = a < 0 ? ease(seg(t, 36.38, 36.6)) * .28 + .0 : 0;
    const stretch = a >= 0 && a < .55 ? -.3 * ease(seg(a, 0, .1)) : a >= .55 && a < .75 ? .22 * Math.sin(seg(a, .55, .75) * Math.PI) - .12 : 0;
    const ce = emotions(t, [[36.36, 'determined'], [36.78, 'scared'], [37.4, 'surprised'], [37.7, 'excited'], [38.4, 'starstruck']]);
    const fall = a >= 0 && a < .75;
    daidai(P.x, P.y, U, { ...ce, view: 'side', rot: P.rot, sq: crouch + (a < 0 ? 0 : stretch), wings: true, goggles: true, flap: fall ? .7 + .9 * Math.sin(t * 48) : .4 + .6 * Math.sin(t * 15), wind: a < .75 ? -.9 : -.5,
      aL: a > 1.0 ? 1.2 + .4 * Math.sin(t * 12) : ce.aL, seed: 1, boilKey: 1, noShadow: a > .1 });
    camEnd();
    if (t > bar(12) - .3) { boilSeed('wipe'); dropWipe((t - (bar(12) - .3)) / .6, SUNW, true); }
  }

  // ======================= 13. flying through the dusk (39.65–42.94) =======================
  const DUSKC = { cx: 960, cy: 540, zoom: 1 }, UF = 26, CAM13 = t => 330 * (t - 39.65);
  function flightBG(t) {
    usePlate('dusk', duskSky, DUSKC);
    boilSeed('fclouds');
    for (let i = 0; i < 7; i++) { const sp = 70 + 140 * hash(i), x = (((hash(i + 1) * 2600 - t * sp) % 2600) + 2600) % 2600 - 300, y = 150 + 480 * hash(i + 2); puffCloud(x, y, 80 + 100 * hash(i + 3), i % 2 ? '#F2B4C0' : '#E7A6B6', 215); }
  }
  // her hill and house grow as 呆呆 flies in; returns where her window is
  function girlHill(k) {
    const s = lerp(70, 440, k), hx = lerp(1880, 1530, k), hy = lerp(640, 930, k);
    boilSeed('ghill'); paint(ellPts(hx + s * .1, hy + s * .9, s * 2.7, s * .9, 30), { wash: '#5A5C8E', fill: '#464B80', fillOp: 70, ink: PAL.ink, sw: .8 });
    girlHouse(hx, hy, s, { lit: true });
    return { x: hx + .17 * s, sill: hy - .06 * s, top: hy - .36 * s, left: hx + .04 * s, w: .26 * s, h: .3 * s, s };
  }
  function heartStream(t) {
    boilSeed('hstream');
    for (let i = 0; i < 12; i++) {
      const te = 38.9 + i * .34, a = (t - te) / 2.2; if (a < 0 || a > 1) continue;
      const wx = 1211 + 18 * Math.sin(i * 2.3), x = wx - CAM13(t) + Math.sin(a * 7 + i) * 18, y = 880 - a * 640, r = 12 + 22 * Math.sin(Math.min(1, a * 1.4) * Math.PI / 2), al = 255 * Math.min(1, a * 6) * (1 - seg(a, .8, 1));
      paint(heartPts(x, y, r, 22), { wash: i % 2 ? PINK : PINK_LT, washOp: al, ink: a < .7 ? PAL.ink : null, sw: .6 });
    }
  }
  function shot13(t, lt, dur) {
    flightBG(t);
    const hk = ease(seg(t, 39.65, 43.4)), hh = girlHill(hk);
    // the little stone cottage drifts by below, its chimney sending up hearts
    boilSeed('cot13'); cottage(1162 - CAM13(t), 1070, 170, { wall: '#59587A', roof: '#2E2A4A', lit: '#F6B8C8', key: 'c13' });
    heartStream(t);
    // 呆呆 flies with steady wingbeats, and doesn't notice
    const ce = emotions(t, [[39.65, 'excited'], [40.7, 'starstruck'], [41.8, 'love', { emote: 'hearts' }]]);
    daidai(700, 430 + 18 * Math.sin(t * 3), UF, { ...ce, view: 'side', rot: -.1, wings: true, goggles: true, flap: .4 + .6 * Math.sin(t * 15), wind: -.9, aL: t > 41.9 ? 1.2 + .45 * Math.sin(t * 13) : ce.aL, noShadow: true, seed: 1, boilKey: 1 });
    // she stands at the window as it grows
    if (t > 41.7) { const ga = ease(seg(t, 41.7, 42.1)); girl(hh.x, hh.sill + (1 - ga) * 30, hh.s * .024, { ...feelAs(GIRL, 'neutral', t), boilKey: 77, noShadow: true }); }
    if (t < 39.95) { boilSeed('wipe'); dropWipe(.5 + (t - 39.65) / .6, SUNW, true); }
  }

  // ======================= 14. the north wind comes back (42.94–46.23) =======================
  function shot14(t, lt, dur) {
    flightBG(t);
    const hh = girlHill(1);
    // the window: she closes the curtains
    const close = ease(seg(t, 45.35, 46.05));
    const gc = emoAs(GIRL, t, [[42.94, 'neutral'], [44.8, 'bored'], [45.4, 'neutral', { lookX: -.8 }]]);
    girl(hh.x, hh.sill, 10.5, { ...gc, boilKey: 77, noShadow: true });
    curtains(hh.left, hh.top, hh.w, hh.h, close);
    // 呆呆: a wing flips inside out, and he spirals
    const th = 2 * Math.PI * 2.2 * easeIn(seg(t, 43.0, 45.9)), sp = ease(seg(t, 43.0, 43.5)), sink = seg(t, 43.3, 46.0);
    const ce = emotions(t, [[42.94, 'love', { emote: 'hearts' }], [43.1, 'scared'], [44.4, 'dizzy']]);
    const px = 700 + 130 * Math.sin(th * .5) * sp, py = lerp(430 + 18 * Math.sin(t * 3), 760, easeIn(sink));
    daidai(px, py, UF, { ...ce, view: 'side', rot: -.1 + th, wings: true, goggles: true, flap: t < 43.05 ? .4 + .6 * Math.sin(t * 15) : -1.2 + .35 * Math.sin(t * 30), wind: -1, noShadow: true, seed: 1, boilKey: 1, smear: sp * .35, smearDir: -1 });
    windLines(t, ease(seg(t, 43.0, 43.25)) * (1 - ease(seg(t, 45.6, 46.1))) * .95, { n: 12, y0: 80, y1: 760, dir: -1, seed: 7, speed: 3400 });
    leafFall(t, { n: 4, lean: -400, seed: 8, speed: 2.2 });
    wipeOut(lt, dur, PURPW);
  }

  // ======================= 15. the fall and the roof (46.23–49.52) =======================
  const R15 = x => 350 - .587 * (x - 940);   // the left slope of 铁山's roof
  const YDC = { cx: 900, cy: 760, zoom: 1.4 }, YW2 = { cx: 960, cy: 540, zoom: 1 };
  const fallA = t => t - 48.95;
  function fallPos(t) { const a = fallA(t); return { x: 940 - 150 * a, y: 350 + 600 * a * a, rot: -.52 + 5.9 * Math.min(a, .62) }; }
  function shot15(t, lt, dur) {
    if (t < 47.45) {
      camBegin(HW.cx, HW.cy, HW.zoom);
      usePlate('hill-snowNight', () => hillSet('snowNight'), HW);
      mailbox(MBX, MBY, MB_S, { key: 's15', snow: 1 });
      camEnd();
      const f = seg(t, 46.4, 47.45), x = 880 - 90 * f + 50 * Math.sin(f * 8), y = lerp(-190, 1220, easeIn(f) * .75 + .25 * f), spin = f * 17;
      boilSeed('fallines'); for (let i = 0; i < 7; i++) { const lx = x + (i - 3) * 22 + 8 * hash(i); inkLine([[lx, y - 170 - 120 * hash(i + 2)], [lx, y - 30]], .5, '#F6F1E8', 'dry', 0); }
      const ce = emotions(t, [[46.23, 'scared'], [46.8, 'cry']]);
      daidai(x, y, 22, { ...ce, view: 'front', rot: spin, wings: true, goggles: true, flap: -1 + .5 * Math.sin(t * 30), wind: -.8, noShadow: true, seed: 1, boilKey: 1 });
      wipeIn(lt, PURPW);
    } else {
      camBegin(YW2.cx, YW2.cy, YW2.zoom);
      usePlate('yard-night', () => yardSet('night'), YW2);
      const t1 = 47.9, t2 = 48.5, t3 = 48.95;
      let x, y, rot, sq = 0;
      if (t < t1) { const f = seg(t, 47.45, t1); x = 1190 - 8 * f; y = lerp(-170, R15(1190) - 6, easeIn(f)); rot = -.2 + f * 2.2; sq = -.2 * f; }
      else if (t < t2) { const f = seg(t, t1, t2), p = arcPt([1190, R15(1190) - 6], [1075, R15(1075) - 6], 150, f); x = p[0]; y = p[1]; rot = lerp(-.52, -.52 + 6.28, f); sq = f < .12 ? .3 * (1 - f / .12) : 0; }
      else if (t < t3) { const f = ease(seg(t, t2, t3)); x = lerp(1075, 948, f); y = R15(x) - 6; rot = -.52 + .1 * Math.sin(t * 30); sq = t < t2 + .1 ? .3 * (1 - (t - t2) / .1) : 0; }
      else { const P = fallPos(t); x = P.x; y = P.y; rot = P.rot; }
      const ce = emotions(t, [[47.45, 'scared'], [t1, 'ko', { emote: null }], [t2 + .4, 'dizzy']]);
      daidai(x, y, 22, { ...ce, view: 'front', rot, sq: (ce.sq || 0) * .3 + sq, wings: true, goggles: true, flap: -.9, wind: -.4, noShadow: true, seed: 1, boilKey: 1 });
      if (t >= t1 && t < t1 + .5) snowBurst(1190, R15(1190) - 20, t - t1);
      if (t >= t2 && t < t2 + .5) snowBurst(1075, R15(1075) - 20, t - t2);
      camEnd();
      snowFall(t, { n: 40, lean: 80, seed: 4 });
    }
  }

  // ======================= the night yard, shots 16–19 =======================
  const YD = { cx: 900, cy: 760, zoom: 1.4 }, YD2 = { cx: 930, cy: 700, zoom: 1.8 };
  const NY = 884;   // ground / step level in the yard
  // where 呆呆 is while he dives into the drift (continues the fall of shot 15) and gets stuck
  function dive(t) {
    const a = fallA(t), P = fallPos(t);
    if (a < .62) return { x: P.x, y: P.y, rot: P.rot };
    const f = easeOut(seg(a, .62, .95)), wig = a > .95 ? .2 * Math.sin((t - 49.9) * 16) * (a < 1.8 ? 1 : .8) : 0;
    return { x: 847, y: lerp(580, 698, f), rot: Math.PI + wig };
  }
  const driftCover = () => { boilSeed('drift'); paint(driftPts(), { wash: '#EAF0FA', fill: '#B9C8E6', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1, curv: .5 }); };
  const giantHold = (u, sw, aL, aR, o = {}) => {   // bouquet in the screen-left hand, the letter on the chest
    if (o.bouquet) bouquet(-(4.9 + 2.2 * Math.cos(aL) + .3) * u, -(4.5 + 2.2 * Math.sin(aL) + 2.2) * u, u * .85, -.1);
  };
  function pigeonFence(t, o = {}) { pigeon(600, 764, 17, { mood: o.mood || 'scared', bag: false, headDY: o.headDY || 0, key: 'p16', sweat: o.sweat !== false, flap: o.flap || 0 }); }

  // ======================= 16. head first into the snowdrift (49.52–52.80) =======================
  function shot16(t, lt, dur) {
    camBegin(YD.cx, YD.cy, YD.zoom);
    usePlate('yardN-night', () => yardSet('night'), YD);
    const open = ease(seg(t, 51.35, 51.85));
    if (open > 0) glow(1400, 720, 300 * open, '#F6B8C8', .9);
    door(open);
    // the pigeon, on the fence, covering its face
    pigeonFence(t, { mood: t < 50.6 ? 'scared' : 'blank', headDY: t > 50.6 ? 1.0 : 0 });
    // 呆呆, upside down in the drift: two legs, kicking
    const D = dive(t);
    const ce = emotions(t, [[49.52, 'scared'], [49.6, 'ko', { emote: null }]]);
    daidai(D.x, D.y, U, { ...ce, view: 'front', rot: D.rot, wings: true, goggles: true, flap: -.5, noShadow: true, wind: 0, seed: 1, boilKey: 1 });
    driftCover();
    if (t >= 49.57 && t < 50.2) snowBurst(850, 735, t - 49.57);
    // 铁山 comes out, scrubbed up, with a bouquet and the pink scarf
    if (t > 51.7) {
      const ge = gEmo(t, [[51.7, 'shy'], [52.4, 'surprised']]), sb = ease(seg(t, 51.7, 52.2));
      giant(lerp(1440, 1400, sb), NY, GIANT_U, { ...ge, view: 'front', brow: -.35, moDroop: .5, scarf: true, wind: .15, aL: 1.0, aR: .6, lookX: t > 52.3 ? -1 : 0, lookY: t > 52.3 ? .6 : 0, boilKey: 34,
        draw: (u, sw) => { bouquet(-(4.9 + 2.2 * Math.cos(1.0) + .1) * u, -(4.5 + 2.2 * Math.sin(1.0) + 2.0) * u, u * .85, -.12); letterHeart((4.9 + 2.2 * Math.cos(.6) + .3) * u, -(4.5 + 2.2 * Math.sin(.6)) * u, u * .6, .2); } });
    }
    camEnd();
    snowFall(t, { n: 50, lean: 90, seed: 5 });
  }

  // ======================= 17. pulled out (52.80–56.09) =======================
  function shot17(t, lt, dur) {
    camBegin(YD.cx, YD.cy, YD.zoom);
    usePlate('yardN-night', () => yardSet('night'), YD);
    door(1);
    const walk = stroll(t, 52.8, 53.55, 1400, 995, GIANT_U), GX2 = 995;
    const pullA = ease(seg(t, 53.55, 53.8)), swing = ease(seg(t, 53.8, 53.95));
    const aR = lerp(.2, .8, pullA) + (t >= 53.8 ? 1.1 * swing : 0), release = 53.95;
    const ge = gEmo(t, [[52.8, 'surprised'], [53.55, 'determined'], [54.1, 'love'], [55.3, 'shy']]);
    giant(t < 53.55 ? walk.x : GX2, NY, GIANT_U, { ...ge, ...(t < 53.55 ? { view: 'q', flip: true, walk: walk.walk, dy: walk.dy } : { view: 'q', flip: true }), brow: -.3, moDroop: .5, scarf: true, wind: .1,
      aR, sq: t >= 53.65 && t < 53.8 ? .16 : 0, lookX: 0, boilKey: 34,
      draw: (u, sw) => { letterHeart(3.4 * u, -3.5 * u, u * .75, .1); } });
    // 呆呆: legs out of the drift → yanked → flies up, flips, lands dazed
    const hand = [GX2 - (5 + 2.2 * Math.cos(.8)) * GIANT_U, NY - (4.5 + 2.2 * Math.sin(.8)) * GIANT_U];
    let x, y, rot, pose = {};
    if (t < release) { const f = swing; x = lerp(847, hand[0] - 10, ease(seg(t, 53.55, 53.8))); y = lerp(698, hand[1] - 8, ease(seg(t, 53.55, 53.8))) - 20 * f; rot = Math.PI + (t < 53.55 ? .2 * Math.sin((t - 52.8) * 16) : 0); }
    else {
      const f = seg(t, release, 54.7), p = arcPt([hand[0] - 10, hand[1] - 28], [790, NY], 230, f); x = p[0]; y = p[1];
      rot = f < 1 ? lerp(Math.PI, 3 * Math.PI, easeOut(f)) : 0; pose = f >= 1 ? { sq: .22 * Math.exp(-9 * (t - 54.7)) * Math.cos(20 * (t - 54.7)) } : {};
    }
    const ce = emotions(t, [[52.8, 'ko', { emote: null }], [release, 'surprised', { emote: null }], [54.7, 'dizzy'], [55.15, 'surprised']]);
    // after landing: turns to face 铁山, sees the letter, then looks at the pigeon
    let view = { view: 'front' };
    if (t >= 54.9) view = turn(t, 54.9, 55.05, 0, .125);
    if (t >= 55.55) view = turn(t, 55.55, 55.7, .125, -.125);
    const pointing = t >= 55.2 && t < 55.55 ? { aR: .55 + .1 * Math.sin(t * 20) } : {};
    daidai(x, y, U, { ...ce, ...(t < 54.7 ? { view: 'front' } : view), ...pose, ...pointing, rot: t < 54.7 ? rot : 0, wings: true, goggles: true, flap: -.4, noShadow: t < 54.7, wind: 0, seed: 1, boilKey: 1 });
    if (t >= release && t < release + .55) snowBurst(847, 740, t - release);
    driftCover();
    if (t < release) { /* the drift hides his body */ }
    // the pigeon whistles at the sky
    const sly = t >= 55.55;
    pigeonFence(t, { mood: sly ? 'sly' : 'blank', headDY: sly ? -.9 : .8, sweat: false });
    if (sly) emote('music', 600 + 38, 764 - 125, 16, seg(t, 55.7, 55.9), t - 55.7);
    camEnd();
    snowFall(t, { n: 40, lean: 80, seed: 6 });
    if (t >= 54.7 && t < 55.4) { /* snow brushed off 呆呆 */ }
  }

  // ======================= 18. a misunderstanding in mime (56.09–59.38) =======================
  function shot18(t, lt, dur) {
    camBegin(YD.cx, YD.cy, YD.zoom);
    usePlate('yardN-night', () => yardSet('night'), YD);
    door(1);
    glow(990, 700, 150 + 160 * ease(seg(t, 58.3, 58.9)), '#F6B8C8', .35 + .45 * ease(seg(t, 58.3, 58.9)));
    // 铁山: puzzled, then he thinks it's for him, then he's hurt, then he lights up
    const ge = gEmo(t, [[56.09, 'confused'], [57.05, 'shy'], [57.6, 'cry'], [58.35, 'love']]);
    giant(990, NY, GIANT_U, { ...ge, view: 'q', flip: true, brow: t < 57.6 ? 0 : -.6, moDroop: t < 57.6 ? .5 : 1, scarf: true, wind: .1, boilKey: 34, aL: .3, aR: .3,
      draw: (u, sw) => letterHeart(3.4 * u, -3.5 * u, u * .75, .1) });
    // 呆呆: points far away, points at himself, points at the letter, shakes his head, gives in and nods
    const ce = emotions(t, [[56.09, 'nervous'], [57.45, 'scared'], [57.95, 'sad', { emote: null }], [58.3, 'relieved']]);
    let aR = .2, aL = ce.aL, view = 'q', flip = false, dy = ce.dy || 0;
    if (t >= 56.2 && t < 56.75) aR = .85 + .15 * Math.sin(t * 14);          // far away, that window
    else if (t >= 56.75 && t < 57.15) { aR = -.3; dy = -.8 * Math.abs(Math.sin((t - 56.75) * 8)); }   // me
    else if (t >= 57.15 && t < 57.5) aR = .5 + .1 * Math.sin(t * 20);        // the letter
    else if (t >= 57.5 && t < 57.95) { flip = Math.floor((t - 57.5) * 10) % 2 === 1; aL = .3; aR = .3; }   // no no no
    else if (t >= 58.3) { dy = -.7 * Math.abs(Math.sin((t - 58.3) * 9)) * (t < 59.0 ? 1 : 0); }          // a resigned nod, twice
    daidai(800, NY, U, { ...ce, view, flip, aR, aL, dy, wings: true, goggles: true, flap: -.4, wind: 0, seed: 1, boilKey: 1 });
    camEnd();
    snowFall(t, { n: 40, lean: 80, seed: 6 });
    // a pigeon that has discovered the sky
    camBegin(YD.cx, YD.cy, YD.zoom);
    pigeonFence(t, { mood: 'sly', headDY: -.9, sweat: false });
    if (Math.floor(t * 2) % 2) emote('music', 600 + 38, 764 - 125, 16, 1, t);
    camEnd();
  }

  // ======================= 19. the hug (59.38–62.67) =======================
  const limb = (x0, y0, x1, y1, w, col) => paint(ribbon([[x0, y0], [(x0 + x1) / 2 + 3, (y0 + y1) / 2 - 3], [x1, y1]], w, w), { wash: col, ink: PAL.ink, sw: .9 });
  function shot19(t, lt, dur) {
    camBegin(YD2.cx, YD2.cy, YD2.zoom);
    usePlate('yardN2-night', () => yardSet('night'), YD2);
    door(1);
    const walkIn = ease(seg(t, 59.4, 60.2)), grab = ease(seg(t, 60.2, 60.55)), lift = ease(seg(t, 60.45, 60.85)), spin = seg(t, 61.7, 62.67);
    const gx0 = lerp(990, 905, walkIn) + 46 * Math.sin(spin * TAU * 1.2) * (t >= 61.7 ? 1 : 0), ox = t >= 61.7 ? Math.sin(spin * TAU * 1.2) : 0;
    const gu = GIANT_U, gdy = -.5 * Math.abs(Math.sin(spin * TAU * 2.4)) * (t >= 61.7 ? 1 : 0);
    const ge = gEmo(t, [[59.38, 'love'], [60.5, 'happy']]);
    glow(gx0, NY - 5 * gu, 280, '#F6B8C8', .45);
    giant(gx0, NY, gu, { ...ge, view: 'front', brow: -.5, moDroop: 1, scarf: true, wind: .15 + .4 * ox, rot: .1 * ox, dy: gdy, sq: .1 * grab * (1 - lift), noArms: true, boilKey: 34 });
    // 呆呆: walks in, is scooped up, squeezed, and looks into the lens with a single tear
    const cx0 = t < 60.2 ? lerp(800, gx0 - 50, walkIn) : gx0 - 50;
    const kdy = -lift * 1.4, squeeze = t < 60.45 ? 0 : t < 60.75 ? Math.sin(seg(t, 60.45, 60.75) * Math.PI) : t < 61.7 ? .5 * Math.abs(Math.sin((t - 60.9) * 7)) * (t > 60.9 ? 1 : 0) : 0;
    // the giant's arms (drawn as limbs): open wide while 呆呆 walks in, then folded round his flanks from behind
    const shY = NY - 4.5 * gu + gdy * gu, yC = NY + kdy * U - 5 * U, flank = s => [cx0 + s * 4.3 * U, yC + .2 * U];
    for (const s of [-1, 1]) {
      const sh = [gx0 + s * 4.9 * gu, shY], open = [sh[0] + s * 2.2 * gu * Math.cos(1.05), sh[1] - 2.2 * gu * Math.sin(1.05)], fl = flank(s);
      const e = [lerp(open[0], fl[0], grab), lerp(open[1], fl[1], grab)];
      const mid = [(sh[0] + e[0]) / 2 + s * 14 * grab, (sh[1] + e[1]) / 2 + 10 * grab];
      paint(ribbon([sh, mid, e], .95 * gu * .78, .95 * gu * .7), { wash: GI.col, fill: GI.dk, fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 });
    }
    const ce = emotions(t, [[59.38, 'neutral', { eyes: 'normal', mouth: 'flat', emote: null }], [60.45, 'surprised', { emote: null }], [60.9, 'neutral', { eyes: 'normal', mouth: 'flat', emote: null }]]);
    const tear = seg(t, 61.0, 61.7);
    daidai(cx0, NY, U, { ...ce, view: 'front', dy: kdy + (ce.dy || 0) * .3, sq: (ce.sq || 0) * .2, sx: 1 - .1 * squeeze, rot: .1 * ox, wings: false, goggles: true, aL: lerp(.2, -.3, grab), aR: lerp(.2, -.3, grab), wind: .1, seed: 1, boilKey: 1,
      draw: (u, sw) => { if (tear > 0 && tear < 1) paint(ellPts(2.9 * u, lerp(-5.6, -2.8, easeIn(tear)) * u, .32 * u, .5 * u, 8, 0), { wash: '#8EC3E6', ink: PAL.ink, sw: .4 }); } });
    // his hands, pressing on 呆呆's sides
    if (grab > .5) for (const s of [-1, 1]) { const fl = flank(s); paint(rrPts(fl[0] - .7 * U, fl[1] - .75 * U, 1.4 * U, 1.5 * U, .3 * U), { wash: GI.col, fill: GI.dk, fillOp: 60, ink: PAL.ink, sw: .9 }); }
    camEnd();
    // hearts everywhere
    camBegin(YD2.cx, YD2.cy, YD2.zoom);
    for (let i = 0; i < 9; i++) { const k = frac(t * .8 + i / 9); if (t > 60.4) heartPuff(gx0 + (hash(i) - .5) * 360, NY - 120 - (hash(i + 3)) * 120, 20, k, i % 2 ? PINK : PINK_LT); }
    camEnd();
    // the heart iris closes on them
    const cl = seg(t, 62.2, 62.66);
    if (cl > 0) { boilSeed('hirisC'); irisShape(heartPts(960, 600, lerp(1900, 0, easeIn(cl)) + 2, 40), HEARTPINK); }
    snowFall(t, { n: 30, lean: 60, seed: 7 });
  }

  // ======================= 20. the empty mailbox (62.67–65.78) =======================
  function shot20(t, lt, dur) {
    camBegin(HW.cx, HW.cy, HW.zoom);
    usePlate('hill-snowNight', () => hillSet('snowNight'), HW);
    mailbox(MBX, MBY, MB_S, { key: 's20', snow: 1 });
    // 铁山's chimney, far down in the valley, puffs the odd little heart
    for (let i = 0; i < 2; i++) heartPuff(1909, 990, 24, frac(t * .4 + i * .5), PINK);
    // the last leaf comes down onto the mailbox
    const f = seg(t, 63.1, 64.8), lx = MBX - 8 + 260 * (1 - easeOut(f)) + 40 * Math.sin(f * 11) * (1 - f), ly = lerp(-60, MB_TOP - 12, easeIn(f) * .6 + .4 * f);
    push(); translate(lx, ly); rotate(f < 1 ? f * 9 + .4 : .4 + 9); scale(1, f < 1 ? Math.cos(f * 17) * .5 + .6 : .3); leafShape(34, SETC.autumn.leaf[1]); pop();
    const sc = toScreen(lx, ly);
    camEnd();
    windLines(t, .7 * Math.sin(Math.PI * seg(t, 63.3, 64.4)), { n: 7, y0: 120, y1: 560, dir: 1, seed: 11, speed: 2400 });
    snowFall(t, { n: 40, lean: 60, seed: 8 });
    // in: a heart opens onto the mailbox; out: the picture closes on the leaf
    const op = seg(t, 62.67, 63.4), mbs = [960 + (MBX - HW.cx) * HW.zoom, 540 + (MBY - 3 * MB_S - HW.cy) * HW.zoom];
    if (op < 1) { boilSeed('hirisD'); irisShape(heartPts(mbs[0], mbs[1], lerp(0, 1900, easeOut(op)) + 2, 40), HEARTPINK); }
    const cl = seg(t, 64.85, 65.76);
    if (cl > 0) { boilSeed('irisout'); iris(sc[0], sc[1], lerp(1500, 0, easeIn(cl)), PAL.paper); }
  }

  shots([[0, shot1], [bar(1), shot2], [bar(2), shot3], [bar(3), shot4], [bar(4), shot5], [bar(5), shot6], [bar(6), shot7], [bar(7), shot8], [bar(9), shot10], [bar(10), shot11], [bar(11), shot12], [bar(12), shot13], [bar(13), shot14], [bar(14), shot15], [bar(15), shot16], [bar(16), shot17], [bar(17), shot18], [bar(18), shot19], [bar(19), shot20]]);
})();
