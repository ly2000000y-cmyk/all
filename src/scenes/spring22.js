// spring22.js: the 12 shots of the 《22》 MV (see STORYBOARD.md). Times are video seconds; the song is 92.9 BPM with its
// first downbeat at 0.34 s, so one lyric line = 2 bars = 5.167 s and every shot starts on a bar line (B below).
(() => {
  const B = [0, 5.507, 10.674, 15.841, 21.008, 26.175, 31.342, 36.509, 41.676, 46.843, 52.010, 57.177];
  const wipeIn = (lt, cols) => { boilSeed('wipe'); if (lt < .3) brushWipe(.5 + lt / .6, cols); };
  const wipeOut = (lt, dur, cols) => { boilSeed('wipe'); if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, cols); };
  const PINK = ['#F2A0B3', '#FBD6DE'], TEAL = [RIB_DK, RIB], GREY = ['#6C7388', '#8E96A8'], STORM = ['#2F3350', '#4B5470'], RAINC = ['#2B3566', '#9FB2E0'];
  const handR = (x, y, u, a) => [x + (4.9 + 2.2 * Math.cos(a)) * u, y - (4.5 + 2.2 * Math.sin(a)) * u];
  const handL = (x, y, u, a) => [x - (4.9 + 2.2 * Math.cos(a)) * u, y - (4.5 + 2.2 * Math.sin(a)) * u];
  // looped scrolling coordinate: x0 moving left at sp px/s over a period, with a margin so things enter and leave off-screen
  const scr = (t, t0, x0, sp, per, m = 260) => ((x0 - sp * (t - t0)) % per + per) % per - m;
  const GL = o => ({ loose: 1, noTie: true, ...o });   // her hair since the ribbon blew away
  // petals falling from a source band: n petals, each a pure function of t
  function petalFall(t, t0, dur, n, xs, ys, seed, size = 14, sway = 40, drift = 20) {
    boilSeed('pf' + seed);
    for (let i = 0; i < n; i++) {
      const delay = hash(i + seed) * dur * .6, a = t - t0 - delay, T = 1.7 + 1.3 * hash(i + seed + 5); if (a < 0 || a > T) continue;
      const k = a / T, x = lerp(xs[0], xs[1], hash(i + seed + 9)) + Math.sin(a * 2.4 + i) * sway + a * drift, y = lerp(ys[0], ys[1], k * (.6 + .4 * k));
      petal(x, y, size * (.7 + .6 * hash(i + seed + 11)), a * (2 + 3 * hash(i + seed + 13)) + i, BLOOM[i % 4]);
    }
  }

  // ======================= 1. the blossom lane (0.00–5.51) =======================
  function shot1(t, lt, dur) {
    const whip = easeIn(seg(t, 5.05, B[1]));
    camBegin(lerp(985, 1010, ease(seg(t, .3, 5.1))) + 120 * whip, 700 - 10 * ease(seg(t, 0, 5)), lerp(1.3, 1.38, ease(seg(t, .4, 5.0))));
    usePlate('lane', () => laneSet('day'), { cx: 1000, cy: 540, zoom: .95 });
    const gx = 930, gy = 990, u = 34;
    // the gust at 2.1 shakes the branch; petals come down 2.2–4
    const sway = 34 * (Math.exp(-(t - 2.1) * 2.2) * Math.sin((t - 2.1) * 9)) * (t > 2.1 ? 1 : 0);
    petalFall(t, 2.2, 1.6, 46, [740, 1250], [260, 1010], 1, 15, 46, 30);
    // her: breathes in with her eyes closed, startles, spins, catches one petal
    const inh = t < 2.1 ? Math.sin(clamp((t - .5) / 1.5) * Math.PI) : 0;
    const ce = emoAs(GIRL, t, [[0, 'happy', { eyes: 'closed', mouth: 'smile' }], [2.15, 'surprised', { lookY: -.8 }], [2.75, 'excited'], [4.05, 'hopeful', { lookX: .5, lookY: .5 }]]);
    const sp = turn(t, 2.85, 3.75, 0, 1), jp = jump(t, 2.9, 3.65, 1.3);
    const pose = t < 2.1 ? { aL: .3 + .9 * inh, aR: .3 + .9 * inh, sq: -.07 * inh, dy: -.2 * inh }
      : t < 2.85 ? { aL: 1.2 + .1 * Math.sin(t * 12), aR: 1.2 - .1 * Math.sin(t * 12) }
      : t < 3.8 ? { ...sp, aL: .15, aR: .15, dy: jp.dy, sq: jp.sq }
      : t < 4.05 ? { aL: .2, aR: lerp(.2, 1.0, ease(seg(t, 3.8, 4.05))) }
      : t < 4.75 ? { aL: .3, aR: 1.0 + .08 * Math.sin(t * 6) }
      : { ...turn(t, 4.78, 5.0, 0, .25), aL: .3, aR: lerp(1.0, .6, seg(t, 4.78, 5.0)), walk: (t - 5.0) * 4, dy: -.5 * Math.abs(Math.sin(Math.max(0, t - 5.0) * 9)) };
    const gxx = gx + (t > 5.0 ? 380 * easeIn(seg(t, 5.0, B[1])) : 0);
    const caught = t > 4.05;
    girl(gxx, gy, u, GL({ ...ce, ...pose, aL: pose.aL ?? ce.aL, aR: pose.aR ?? ce.aR, dy: (t < 2.85 ? ce.dy : 0) + (pose.dy || 0), sq: (ce.sq || 0) * (t < 2.85 || t > 3.8 ? 1 : 0) + (pose.sq || 0),
      armR: caught ? (uu, sw) => petal(.55 * uu, -.35 * uu, uu * .95, .5 + .2 * Math.sin(t * 5)) : undefined, noTie: false, loose: 0 }));
    if (t > 3.3 && t < 4.06) {   // the petal she catches drifts down into her hand
      const h = handR(gx, gy, u, 1.0), k = seg(t, 3.3, 4.05), P = arcPt([h[0] - 90, 330], [h[0] + 30, h[1] - 14], -30, easeOut(k));
      petal(P[0], P[1], 20, k * 8, '#F2A0B3');
    }
    laneBranch(t, { sway });
    camEnd();
    if (t < .75) { const at = toScreen(gx, gy - 4.6 * u); iris(...at, lerp(0, 1500, ease(t / .75)), PAL.paper); }
    speedLines(whip, -1, PAL.cream);
  }

  // ======================= 2. the windy ridge (5.51–10.67) =======================
  function shot2(t, lt, dur) {
    const wind = kf(t, [[5.5, .12], [6.5, .15], [7.0, 1], [8.4, 1], [9.2, .55], [10.7, .4]], ease);
    const v = 380;
    camBegin(960 + 8 * Math.sin(lt * .8), 600 + 4 * Math.sin(lt * 1.3), 1.15);
    usePlate('ridge', ridgeSet, { cx: 960, cy: 540, zoom: 1 });
    boilSeed('rtrees2');
    for (let i = 0; i < 3; i++) blossomTree(scr(t, 5.5, 200 + i * 900, 130, 2700), 860, 320 + 60 * hash(i + 3), { lean: .08 + .14 * wind, ink: false });
    // the ribbon: ties her ponytail until it pops at 7.9, then flies off left on the wind
    const gx = 820 + 18 * wind * Math.sin(t * 2) , gy = 990, u = 30;
    const popped = t > 7.9, lo = popped ? ease(seg(t, 7.9, 8.3)) : 0;
    const ce = emoAs(GIRL, t, [[5.51, 'happy', { emote: 'music' }], [6.6, 'surprised', { emote: null }], [7.2, 'determined', { squint: .55 }], [7.95, 'surprised', { lookX: -.9, lookY: -.5 }], [8.7, 'laugh'], [9.55, 'happy', { emote: null }]], { take: .7 });
    const reach = t > 7.95 && t < 8.7 ? { aL: lerp(.3, 1.45, ease(seg(t, 7.95, 8.2))) } : t < 6.9 ? {} : t < 7.9 ? { aL: 1.2 } : t < 9.6 ? { aL: lerp(1.4, .9, seg(t, 8.7, 9.2)) } : {};
    const lean = .1 * wind * (t < 8.7 ? 1 : .5);
    girl(gx, gy, u, { ...ce, view: 'side', walk: (t - 5.5) * v / (4 * u), rot: lean, wind, loose: lo, noTie: popped, ...reach, dy: (ce.dy || 0) * .4 - .5 * Math.abs(Math.sin((t - 5.5) * v / (4 * u) * Math.PI)) });
    if (t > 7.9) {   // the ribbon
      const k = seg(t, 7.9, 10.7), p0 = [gx - 2.75 * u, gy - 7.6 * u], pos = kk => { const c = clamp(kk), a = arcPt(p0, [-380, 330], 230, 1 - Math.pow(1 - c, 1.8)); return [a[0], a[1] + 22 * Math.sin(kk * 17)]; };
      const P = []; for (let j = 0; j < 7; j++) P.push(pos(k - j * .028));
      boilSeed('ribbonfly'); paint(ribbon(P, 30, 10), { wash: RIB, ink: PAL.ink, sw: .7 });
    }
    boilSeed('rgrass'); for (let i = 0; i < 16; i++) tuft(scr(t, 5.5, i * 170 + 60 * hash(i), v, 2720), 1045 + 22 * hash(i + 3), 38, '#5E9A4E', t, i, .9, .2 + .7 * wind);
    // petals streaming past on the wind
    boilSeed('rpetals');
    for (let j = 0; j < 30; j++) if (j < 6 + 24 * wind) { const sp = 520 + 700 * hash(j + 40) * (.4 + wind), x = scr(t, 5.5, hash(j) * 2500, sp, 2500, 280), y = 130 + 760 * hash(j + 20) + 36 * Math.sin(t * 3 + j); petal(x, y, 9 + 6 * hash(j + 30), t * 6 + j, BLOOM[j % 4]); }
    camEnd();
    speedLines(Math.max(wind - .15, 0) * .6 + (1 - seg(lt, 0, .35)) * .8, -1, PAL.cream, 11);
    wipeOut(lt, dur, TEAL);
  }

  // ======================= 3. rush-hour street (10.67–15.84) =======================
  function shot3(t, lt, dur) {
    camBegin(960 + lerp(-26, 30, lt / dur), 570, 1.08);
    usePlate('city', citySet, { cx: 960, cy: 540, zoom: 1 });
    const gx = 770, gy = 1000, u = 28, stop = ease(seg(t, 14.3, 14.55)), v = 300 * (1 - stop);
    const dist = t < 14.3 ? (t - B[2]) * 300 : (14.3 - B[2]) * 300 + 300 * (14.3 + .25 - 14.3 > 0 ? (1 - Math.cos(Math.PI * seg(t, 14.3, 14.55))) / 2 * .0 : 0);
    // scrolling street furniture (bins), so she keeps walking
    boilSeed('bins'); const bs = t < 14.3 ? 1 : 1 - stop;
    for (let i = 0; i < 4; i++) { const x = scr(t, B[2], 200 + i * 700, 300 * (t < 14.3 ? 1 : 0), 2800, 240) - (t >= 14.3 ? 300 * (14.3 - B[2]) % 2800 * 0 : 0); paint(rrPts(x - 24, 940, 48, 62, 8), { wash: '#6C8B7A', ink: PAL.ink, sw: .8 }); paint(rectPts(x - 28, 930, 56, 14), { wash: '#587766', ink: PAL.ink, sw: .7 }); }
    // the taxi leans on its horn
    const tx = 2300 - 900 * (t - 12.7);
    if (t > 12.7 && t < 15.3) { taxi(tx, 870, 28, { flip: true, bob: 2 * Math.abs(Math.sin(t * 18)) }); }
    // the crowd, walking the other way, bumping along; each is a pure function of t
    const crowd = [];
    for (let i = 0; i < 7; i++) {
      const sp = 380 + 110 * hash(i + 2), x = scr(t, B[2], 300 + i * 420, sp, 2900, 300), yy = 925 + 50 * hash(i + 9), uu = 21 + 2 * hash(i + 4), k = i;
      crowd.push({ x, y: yy, u: uu, k, sp });
    }
    crowd.sort((a, b) => a.y - b.y);
    const gDraw = () => {
      const ce = emoAs(GIRL, t, [[10.67, 'happy', { emote: 'music' }], [14.3, 'surprised', { emote: null, lookY: -.9 }], [14.95, 'hopeful', { lookX: .4, lookY: .4 }]], { take: .6 });
      const base = { ...ce, hat: 'headphones', dy: (ce.dy || 0) + (t < 14.3 ? -.6 * Math.abs(Math.sin(bpOf(t) * Math.PI)) : 0) };
      const caught = t > 15.25;
      if (t < 14.3) girl(gx, gy, u, GL({ ...base, view: 'side', walk: dist / (4 * u), aL: .3 + .6 * Math.sin(bpOf(t) * Math.PI), rot: .03 * Math.sin(bpOf(t) * Math.PI * 2) }));
      else girl(gx, gy, u, GL({ ...base, ...turn(t, 14.3, 14.5, .25, .125), aR: t < 15.0 ? .3 : lerp(.3, 1.0, ease(seg(t, 15.0, 15.3))), armR: caught ? (uu, sw) => petal(.55 * uu, -.35 * uu, uu * .95, .5) : undefined }));
    };
    // the glow bubble she lives in, then the people (behind and in front of her)
    glow(gx, gy - 110, 320, '#FFE0A0', .4 + .1 * pulse(t, 5));
    for (const c of crowd) if (c.y <= gy) drone(c.x, c.y, c.u, { ...feel(c.k % 3 === 0 ? 'angry' : c.k % 3 === 1 ? 'bored' : 'neutral', t + c.k), k: c.k, view: 'side', flip: true, walk: (c.sp * (t - B[2])) / (4 * c.u), dy: -.5 * Math.abs(Math.sin((c.sp * (t - B[2])) / (4 * c.u) * Math.PI)), emote: null });
    gDraw();
    for (const c of crowd) if (c.y > gy) drone(c.x, c.y, c.u, { ...feel(c.k % 3 === 0 ? 'angry' : c.k % 3 === 1 ? 'bored' : 'neutral', t + c.k), k: c.k, view: 'side', flip: true, walk: (c.sp * (t - B[2])) / (4 * c.u), dy: -.5 * Math.abs(Math.sin((c.sp * (t - B[2])) / (4 * c.u) * Math.PI)), emote: null });
    // noise: scribble bursts around the street, horn bursts that die at her bubble
    boilSeed('noise');
    for (const [t0, x, y, s, col] of [[11.2, 1280, 760, 80, '#D9B8B0'], [11.9, 1500, 700, 70, '#C9C0D4'], [12.5, 1100, 820, 70, '#D9B8B0'], [13.35, tx - 230, 790, 100, '#F2D36A'], [13.7, tx - 250, 770, 110, '#F2D36A'], [14.0, 1400, 720, 80, '#C9C0D4']]) noiseBurst(x, y, s, col, (t - t0) / .45, Math.round(t0 * 10));
    if (t > 13.3 && t < 14.2) for (let i = 0; i < 3; i++) soundRing(tx - 200, 800, 40 + (t - 13.3 - i * .12) * 600, '#6C7388', 2.4, Math.PI - .9, Math.PI + .9);
    // the petal drifting down out of the strip of sky
    if (t > 14.3 && t < 15.25) { const h = handR(gx, gy, u, 1.0), k = seg(t, 14.3, 15.25), P = arcPt([h[0] + 160, 70], [h[0] + 22, h[1] - 14], -40, easeOut(k)); petal(P[0] + 30 * Math.sin(k * 9) * (1 - k), P[1], 20, k * 7); }
    camEnd();
    wipeIn(lt, TEAL);
    if (t > 15.35) { const at = toScreen(gx, gy - 5 * u); iris(...at, lerp(1500, 0, easeIn(seg(t, 15.35, B[3] - .02)) ), PAL.paper); }
  }

  // ======================= 4. the golden balcony (15.84–21.01) =======================
  function shot4(t, lt, dur) {
    const p = ease(seg(lt, 0, 5.1)), potS = 30, potX = 1380, potY = 770;
    camBegin(lerp(1000, 1120, p), lerp(660, 680, p), lerp(1.3, 1.45, p));
    usePlate('balcony', balconySet, { cx: 960, cy: 540, zoom: 1 });
    const sunK = seg(t, 15.9, 21.0); balconySun(sunK);
    // she walks in, stops, drops the petal into the pot, then watches it grow
    const w = stroll(t, 15.95, 16.65, 700, 1060, 30), gy = 960, u = 30;
    const k = ease(seg(t, 17.4, 20.3));
    const ce = emoAs(GIRL, t, [[15.84, 'neutral', { lookX: .6 }], [16.7, 'thinking', { emote: null, lookX: 1, lookY: .2 }], [17.45, 'surprised', { lookX: 1 }], [18.5, 'hopeful', { lookX: 1, lookY: -.2 }], [19.7, 'starstruck'], [20.4, 'love', { emote: 'hearts' }]]);
    const drop = t > 16.8 && t < 17.45, dropped = t >= 17.3;
    const pose = t < 16.7 ? { view: 'q', walk: w.walk, dy: w.dy } : t < 17.5 ? { view: 'q', aR: lerp(.3, 1.0, ease(seg(t, 16.75, 17.1))) * (1 - ease(seg(t, 17.2, 17.6))) + .3 * ease(seg(t, 17.2, 17.6)) } : { view: 'q', aR: .4 };
    girl(w.x, gy, u, GL({ ...ce, ...pose, aR: pose.aR ?? ce.aR, dy: (pose.dy ?? 0) + (ce.dy || 0) * .5, armR: !dropped ? (uu, sw) => petal(.55 * uu, -.35 * uu, uu * .95, .6) : undefined }));
    if (t > 17.1 && t < 17.5) { const h = handR(w.x, gy, u, 1.0), kk = seg(t, 17.1, 17.5), P = arcPt([h[0] + 10, h[1]], [potX, potY - 2.9 * potS - 6], 80, ease(kk)); petal(P[0], P[1], 18, kk * 6); }
    // the pot (on the ledge), the plant growing; pot drawn after her so the rail hides nothing important
    boilSeed('pot'); const tip = potPlant(potX, potY, potS, k) || [potX, potY - 2.9 * potS];
    if (k > .55) glow(tip[0], tip[1], 140 * seg(k, .55, 1) + (t > 19.7 ? 120 * seg(t, 19.7, 20.2) : 0), '#FFD0DA', .5);
    if (t > 19.8 && t < 21) petalFall(t, 19.8, .8, 12, [tip[0] - 60, tip[0] + 60], [tip[1] - 40, tip[1] + 180], 5, 9, 20, -30);
    camEnd();
    if (t < B[3] + .5) { const at = toScreen(w.x, gy - 4.6 * u); iris(...at, lerp(0, 1500, easeOut(seg(lt, 0, .5))), PAL.paper); }
    if (t > 20.45) { const at = toScreen(tip[0], tip[1] - 8); iris(...at, lerp(1500, 0, easeIn(seg(t, 20.45, B[4] - .02))), PAL.paper); }
  }

  // ======================= 5. office lunch break (21.01–26.18) =======================
  const CLOCK = [1250, 350, 90];
  function shot5(t, lt, dur) {
    const mins = t < 22.2 ? 45 : lerp(45, 59.3, ease(seg(t, 22.2, 24.9)));
    const alarm = t > 24.95 && t < 25.8 ? 1 : 0;
    camBegin(1000, 640, lerp(1.22, 1.3, ease(seg(lt, 0, 5.1))));
    usePlate('office-day', () => officeSet('day'), { cx: 960, cy: 540, zoom: 1 });
    officeLight('day');
    clockFace(CLOCK[0], CLOCK[1], CLOCK[2], mins, { shake: alarm, bells: alarm > 0, hour: 12.2 });
    if (alarm) for (let i = 0; i < 3; i++) soundRing(CLOCK[0], CLOCK[1], 130 + ((t - 24.95) * 400 + i * 60) % 180, '#6C7388', 2.4, -2.4, -.7);
    const gx = 900, gy = 905, u = 30;
    const eat = t > 22.45 && t < 24.2, nod = t >= 24.2 && t < 24.95;
    const yap = ['open', 'o', 'open', 'grin'][Math.floor(t * 9) % 4];
    const ce = emoAs(GIRL, t, [[21.0, 'neutral', { lookX: .8, lookY: -.9 }], [22.05, 'surprised'], [22.45, 'determined', { emote: 'sweat' }], [24.2, 'sleepy'], [24.95, 'surprised', { lookY: -.7 }]], { take: .8 });
    const bite = Math.abs(Math.sin(t * TAU * 2.4));
    const jp = jump(t, 25.15, 25.65, 2.6);
    const pose = eat ? { aR: .55 + .6 * bite, aL: .2, mouth: yap, dy: (ce.dy || 0) * .3, sq: .05 * bite } : nod ? { rot: .08 * Math.sin((t - 24.2) * 7) * (1 - seg(t, 24.7, 24.95)), aL: -.5, aR: -.5, dy: .2 * Math.abs(Math.sin((t - 24.2) * 7)) } : t > 25.1 ? { dy: jp.dy + (ce.dy || 0) * .2, sq: jp.sq, aL: 1.2, aR: 1.2 } : {};
    girl(gx, gy, u, GL({ ...ce, ...pose, dy: (pose.dy ?? ce.dy), sq: (pose.sq ?? 0) + (ce.sq || 0) * .6, armR: eat ? (uu, sw) => { inkLine([[0, 0], [1.9 * uu, -.5 * uu]], sw * .8, '#C9A870', 'ink', 0); inkLine([[0, .15 * uu], [1.9 * uu, -.3 * uu]], sw * .8, '#C9A870', 'ink', 0); } : undefined }));
    officeDesk(t, { papers: 0 });
    bento(gx, 838, 54, { steam: t < 23, eaten: seg(t, 22.4, 24.2) });
    if (t > 25.15 && t < 25.8) { const kk = seg(t, 25.15, 25.8), P = arcPt([gx + 90, 800], [gx + 330, 1060], 220, kk); inkLine([[P[0], P[1]], [P[0] + 60, P[1] - 14]], 3, '#C9A870', 'ink', 0); }   // chopsticks fly
    camEnd();
    if (t < B[4] + .8) { const at = toScreen(CLOCK[0], CLOCK[1]); iris(...at, lerp(0, 1500, easeOut(seg(lt, 0, .8))), PAL.paper); }
    wipeOut(lt, dur, GREY);
  }

  // ======================= 6. from morning to night at one desk (26.18–31.34) =======================
  function shot6(t, lt, dur) {
    camBegin(1000, 640, 1.3);
    usePlate('office-day', () => officeSet('day'), { cx: 960, cy: 540, zoom: 1 });
    const dusk = ease(seg(t, 27.4, 28.5)), night = ease(seg(t, 28.9, 29.9));
    if (dusk > .01) usePlate('office-dusk', () => officeSet('dusk'), { cx: 960, cy: 540, zoom: 1 }, { alpha: dusk });
    if (night > .01) usePlate('office-night', () => officeSet('night'), { cx: 960, cy: 540, zoom: 1 }, { alpha: night });
    officeLight(night > .5 ? 'night' : dusk > .5 ? 'dusk' : 'day');
    clockFace(CLOCK[0], CLOCK[1], CLOCK[2], 40, { noWedge: true, hour: 9 + lerp(0, 9, seg(t, 26.2, 30.5)) , rim: night > .5 ? '#4A5070' : '#6C7A92' });
    const gx = 900, gy = 905, u = 30;
    const ce = emoAs(GIRL, t, [[26.18, 'determined', { emote: null }], [27.5, 'bored'], [28.7, 'sad', { emote: null }], [29.6, 'sleepy', { emote: null }], [30.3, 'sad', { gloom: .8 }]], { take: .7 });
    const typing = t < 27.5 ? { aL: .05 + .35 * Math.sin(t * 25), aR: .05 - .35 * Math.sin(t * 25 + 1) } : {};
    const sink = ease(seg(t, 27.4, 30.2));
    girl(gx, gy, u, GL({ ...ce, ...typing, sq: (ce.sq || 0) + .22 * sink, dy: (ce.dy || 0) + .5 * sink }));
    const n = Math.floor(Math.max(0, (t - 26.5)) / BEAT) * 3;
    officeDesk(t, { papers: Math.min(n, 42), lamp: seg(t, 29.2, 29.7) * (t > 30.85 ? Math.max(0, 1 - seg(t, 30.85, 31.2)) : 1) });
    // the second pile, in front of her, and a sheet that lands on her head
    boilSeed('pile2');
    const n2 = Math.min(Math.floor(Math.max(0, t - 28.4) / BEAT) * 4, 26);
    for (let i = 0; i < n2; i++) { push(); translate(1060 + (hash(i * 5.1) - .5) * 24, 832 - i * 13); rotate((hash(i + 40) - .5) * .1); paint(rectPts(-100, -14, 200, 14), { wash: i % 3 ? '#FBF8EE' : '#F2EBD8', ink: PAL.ink, sw: .6 }); pop(); }
    if (t > 30.0) { const kk = seg(t, 30.0, 30.6), P = arcPt([gx - 30, 330], [gx + 6, gy - 8.6 * u], -60, easeOut(kk)); push(); translate(P[0], P[1]); rotate(-.3 + .35 * kk); paint(rectPts(-90, -8, 180, 10), { wash: '#FBF8EE', ink: PAL.ink, sw: .7 }); pop(); }
    camEnd();
    wipeIn(lt, GREY);
    if (t > 30.9) { boilSeed('dark'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1A1626', washOp: 255 * ease(seg(t, 30.9, B[6] - .03)), ink: null }); }
  }

  // ======================= 7. her room: the same day, four times (31.34–36.51) =======================
  function shot7(t, lt, dur) {
    const p = ease(seg(lt, 3.0, 4.9));
    camBegin(lerp(900, 1090, p), 600, lerp(1.2, 1.32, p));
    usePlate('room', roomSet, { cx: 960, cy: 540, zoom: 1 });
    glow(940, 300, 700, '#FFD9A0', .22);
    const falls = [0, 1, 2, 3].map(i => [32.2 + i * BEAT * 1.0]);
    roomCalendar(t, falls);
    const gy = 960, u = 30, nw = seg(t, 34.5, 35.4), gx = lerp(870, 1440, ease(nw));
    const rip = falls.map(f => f[0]).reduce((s, f0) => s + (t > f0 - .25 && t < f0 + .35 ? Math.sin((t - f0 + .25) / .6 * Math.PI) : 0), 0);
    const ce = emoAs(GIRL, t, [[31.34, 'bored'], [34.3, 'surprised', { lookX: 1, lookY: -.3 }], [34.9, 'hopeful', { lookX: 1 }], [35.6, 'sleepy', { eyes: 'closed', emote: null, lookX: 1 }]], { take: .7 });
    const walking = t > 34.5 && t < 35.4;
    const pose = t < 34.3 ? { view: 'q', flip: true, aR: lerp(.2, 1.4, clamp(rip)), aL: -.7, walk: 0 } : walking ? { view: 'q', walk: (gx - 870) / (4 * u), dy: -.4 * Math.abs(Math.sin((gx - 870) / (4 * u) * Math.PI)) } : { view: 'q' };
    girl(gx, gy, u, GL({ ...ce, ...pose, aL: pose.aL ?? ce.aL, aR: pose.aR ?? ce.aR, wind: t > 35.4 ? .35 : 0 }));
    // the petal: taps the glass from outside, flutters, then drifts in
    if (t > 34.0) { const a = t - 34.0, wx = 1570, wy = 430, px = wx + 20 * Math.sin(a * 6) * Math.exp(-a * .4) + (t > 35.6 ? -150 * seg(t, 35.6, 36.3) : 0), py = wy + 14 * Math.sin(a * 9) + (t > 35.6 ? 130 * seg(t, 35.6, 36.3) : 0); glow(px, py, 90, '#FFE0E8', .5); petal(px, py, 34, .6 + .5 * Math.sin(a * 6), '#F2A0B3'); }
    boilSeed('sill'); camEnd();
    // lights come up from the dark; at the end her dream bubble swells out of her head
    if (lt < 1.0) { boilSeed('dark'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1A1626', washOp: 255 * (1 - ease(seg(lt, .1, 1.0))), ink: null }); }
    if (t > 35.95) { const at = toScreen(gx, gy - 9.5 * u); boilSeed('bubble'); const r = lerp(30, 1700, easeIn(seg(t, 35.95, B[7] - .02))); paint(ellPts(at[0], at[1], r, r, 40, 2), { wash: '#171B4A', ink: PAL.cream, sw: 3 }); }
  }

  // ======================= 8. the dream: a petal boat on a sea of clouds (36.51–41.68) =======================
  function shot8(t, lt, dur) {
    const bob = 10 * Math.sin(lt * 2.2), tilt = .04 * Math.sin(lt * 2.2 + 1);
    camBegin(960 + 26 * Math.sin(lt * .5), 600, 1.2);
    usePlate('dream', dreamSet, { cx: 960, cy: 540, zoom: 1 });
    // lanterns rising out of the waves, then one comes down to her
    boilSeed('lanterns');
    for (let i = 0; i < 9; i++) {
      const t0 = 37.9 + i * .28, a = t - t0; if (a < 0) continue;
      const x = 300 + 1450 * hash(i + 2) + 20 * Math.sin(a * 1.5 + i), y = 820 - a * (130 + 60 * hash(i + 3));
      if (y > -150) lantern(x, y, 30 + 12 * hash(i + 6), { col: ['#F0A64A', '#F28C6E', '#F5C65A'][i % 3] });
      glow(x, y + 36, 130, '#FFC766', .5);
    }
    const bx = 760 + 14 * Math.sin(lt * .8), by = 800 + bob;
    const hold = t > 40.35;
    const lan = hold ? [bx + 4 * 26 + 6, by + 8 * 26 - 8 * 26 - 150] : arcPt([1180, 640], [bx + 90, by - 150], 90, ease(seg(t, 39.2, 40.3)));
    if (t > 39.2) { glow(lan[0], lan[1] + 36, 190 + (hold ? 110 * seg(t, 40.4, 41.3) : 0), '#FFC766', .8); }
    petalBoat(bx, by, 70, tilt, { glowK: .35, part: 'back' });
    const ce = emoAs(GIRL, t, [[36.5, 'excited', { emote: null }], [38.3, 'hopeful', { lookX: .6, lookY: -.7 }], [39.3, 'laugh'], [40.4, 'love', { emote: 'hearts' }]], { take: .6 });
    const arms = t < 39.3 ? { aL: lerp(.5, 1.3, ease(seg(t, 38.3, 38.9))), aR: lerp(.5, 1.3, ease(seg(t, 38.3, 38.9))) } : t < 40.3 ? { aL: 1.25, aR: 1.25 } : { aL: lerp(1.2, .1, ease(seg(t, 40.3, 40.7))), aR: lerp(1.2, .1, ease(seg(t, 40.3, 40.7))) };
    girl(bx + 10, by + .15 * 70 + 2 * 26 - 4, 26, GL({ ...ce, ...arms, view: 'q', noLegs: true, wind: .7, rot: tilt * 2 }));
    petalBoat(bx, by, 70, tilt, { part: 'front' });
    if (t < 40.4 && t > 39.2) lantern(lan[0], lan[1], 34, { col: '#F5C65A' });
    if (hold) lantern(lan[0] - 6, lan[1] + 26, 38, { col: '#F5C65A' });
    // cranes sweeping past
    boilSeed('cranes');
    for (let i = 0; i < 7; i++) { const a = t - 39.0 - i * .13; if (a < 0 || a > 3.2) continue; crane(-200 + a * 760 + 40 * i, 330 + 70 * Math.sin(a * 2 + i) + 36 * i, 34 - 2 * i, t * 7 + i); }
    // near waves, in front of the boat
    for (let k = 0; k < 2; k++) { boilSeed('nwave' + k); band(-500, 2420, x => 880 + k * 90 + 16 * Math.sin(x * .005 + lt * 1.6 * (k ? -1 : 1) + k), 1200, ['#86AECF', '#A2C2DA'][k], { n: 50, j: 2, ink: PAL.ink, sw: .5, op: 240 }); }
    camEnd();
    if (t < 37.0) { const at = [960, 520]; iris(...at, lerp(0, 1700, easeOut(seg(lt, 0, .5))), '#171B4A'); }
    if (t > 41.2) flash(easeIn(seg(t, 41.2, B[8] - .02)), '#FFF5E2');
  }

  // ======================= 9. noon bench: a cupcake and a wish (41.68–46.84) =======================
  function shot9(t, lt, dur) {
    const p = ease(seg(lt, .2, 4.8));
    camBegin(960, lerp(580, 700, p), lerp(1.1, 1.35, p));
    usePlate('park', parkSet, { cx: 960, cy: 540, zoom: 1 });
    const gx = 905, gy = 950, u = 30;
    const lit = t < 45.12 ? backOut(seg(t, 42.8, 43.1)) : 0, smoke = t > 45.12 ? seg(t, 45.12, 46.3) : 0;
    const cakeY = lerp(1100, 926, easeOut(seg(t, 42.0, 42.6)));
    const look = t > 43.3 && t < 44.3 ? (t < 43.75 ? -1 : 1) : 0;
    const ce = emoAs(GIRL, t, [[41.68, 'neutral', { lookX: .2 }], [42.7, 'happy', { emote: null }], [43.3, 'neutral', { lookX: look }], [43.8, 'sad', { emote: null, lookX: 1 }], [44.35, 'hopeful', { eyes: 'closed', emote: null }], [45.2, 'surprised', { emote: null }], [45.8, 'love', { emote: 'hearts' }]], { take: .7 });
    const inhale = t > 44.5 && t < 45.1 ? ease(seg(t, 44.6, 45.05)) : 0, blow = t > 45.05 && t < 45.5 ? 1 : 0;
    girl(gx, gy, u, GL({ ...ce, view: 'front', aL: .1, aR: .1, sq: -.12 * inhale + .08 * blow, mouth: blow ? 'O' : ce.mouth, dy: (ce.dy || 0) * .3 }));
    cupcake(gx + 125, cakeY, 52, { lit, smoke });
    benchFront();
    petalFall(t, 45.1, 1.4, 34, [520, 1380], [180, 960], 8, 15, 50, 40);
    if (t > 46.0) { const k = seg(t, 46.0, 46.4); petal(gx + 125 - 10 * (1 - k), lerp(700, cakeY - 3.1 * 52, easeIn(k)), 20, 1 - k, '#F2A0B3'); }
    camEnd();
    flash((1 - seg(lt, 0, .35)) * .9, '#FFF5E2');
    wipeOut(lt, dur, PINK);
  }

  // ======================= 10. leaving home at dawn (46.84–52.01) =======================
  function shot10(t, lt, dur) {
    const pull = ease(seg(t, 50.2, 51.6)), gxFinal = lerp(1000, 1620, easeIn(seg(t, 50.25, B[10])));
    const cx = lerp(900, 1380, pull), cz = lerp(1.2, 1.0, pull);
    camBegin(cx, lerp(610, 600, pull), cz);
    usePlate('homeroad', homeRoadSet, { cx: 1300, cy: 540, zoom: .8 });
    const open = ease(seg(t, 46.95, 47.35)), u = 23, gy = 950;
    // the door bursts open, she steps out with the books piled over her head, then throws them
    const out = t > 47.25, w = stroll(t, 47.25, 47.95, 575, 930, u);
    const jp = jump(t, 48.2, 48.95, 3.2);
    const ce = emoAs(GIRL, t, [[46.84, 'determined', { lookX: .8 }], [48.15, 'excited', { emote: null }], [49.0, 'laugh'], [49.5, 'relieved', { emote: 'sweat' }], [50.2, 'determined'], [51.0, 'excited', { emote: null }]], { take: .8 });
    let pose = {}, gx = w.x;
    if (t < 47.25) pose = {};
    else if (t < 48.2) pose = { view: 'q', walk: w.walk, aL: 1.45, aR: 1.45 };
    else if (t < 49.2) pose = { view: 'q', dy: jp.dy, sq: jp.sq, aL: lerp(1.45, 1.1, seg(t, 48.2, 48.6)), aR: lerp(1.45, 1.1, seg(t, 48.2, 48.6)) };
    else if (t < 50.1) { const gl = ease(seg(t, 49.4, 49.7)) * (1 - ease(seg(t, 49.95, 50.1))); pose = { ...turn(t, 49.4, 49.65, .125, -.125), aL: .2, aR: .2 + .6 * gl * Math.sin(t * 14) }; if (t > 49.9) pose = { ...turn(t, 49.95, 50.1, -.125, .25), aL: .2, aR: .2 }; }
    else pose = { view: 'side', walk: (t - 50.1) * 7, aL: .5 * Math.sin((t - 50.1) * 14), dy: -.9 * Math.abs(Math.sin((t - 50.1) * 7)), rot: .08, wind: .6 };
    if (t >= 50.1) gx = lerp(930, 1700, easeIn(seg(t, 50.25, B[10] + .2)));
    // she is drawn after the door; the door leaf swings in front of the lit doorway (before and after)
    houseDoor(open);
    if (t > 47.0) {
      const hand = [gx, gy - 8.6 * u];
      girl(gx, gy, u, GL({ ...ce, ...pose, aL: pose.aL ?? ce.aL, aR: pose.aR ?? ce.aR, sq: (pose.sq || 0) + (ce.sq || 0) * .5, dy: (pose.dy ?? 0) + (ce.dy || 0) * .4, pack: true, view: pose.view || 'front' }));
      if (t > 47.25 && t < 48.2) bookStack(gx + 2 * (w.view === 'q' ? 1 : 0), gy - 8.9 * u, 38, 5);
    }
    // the books: five flap away as birds
    if (t > 48.2) for (let i = 0; i < 5; i++) {
      const a = t - 48.2 - i * .06, kk = a / 3.2; if (a < 0 || kk > 1.1) continue;
      const P = arcPt([930, gy - 9 * u], [900 + 700 * (.4 + .4 * hash(i + 2)) + i * 120, 120 + 80 * i], 160 + 40 * hash(i + 4), easeOut(clamp(kk))), fl = Math.sin(a * 16 + i * 1.7);
      boilSeed('book' + i); flapBook(P[0], P[1], 44 - i * 3 + 10 * kk, -.25 + .2 * Math.sin(a * 3 + i), fl, BOOKCOLS[i % 5]);
    }
    boilSeed('grass10'); for (let i = 0; i < 20; i++) tuft(60 + i * 140 + 50 * hash(i + 5), 1068 + 14 * hash(i + 8), 34, '#7CB06A', t, i + 90, .8);
    camEnd();
    wipeIn(lt, PINK);
    wipeOut(lt, dur, STORM);
  }

  // ======================= 11. the crossroads under a scribble storm (52.01–57.18) =======================
  function shot11(t, lt, dur) {
    const pan = ease(seg(t, 52.4, 56.6));
    camBegin(lerp(920, 1000, pan), 560, lerp(1.1, 1.2, pan));
    usePlate('cross', crossroadsSet, { cx: 960, cy: 540, zoom: 1 });
    // four troubles pop up on the forks, one per beat
    const pops = [[53.0, 'rock', 330], [53.65, 'thorn', 740], [54.3, 'books', 1190], [54.95, 'river', 1640]];
    for (const [t0, kind, x] of pops) {
      const g = backOut(seg(t, t0, t0 + .35)); if (g <= 0) continue;
      boilSeed('trouble' + kind);
      if (kind === 'rock') rock(x, 905, 52 * g); else if (kind === 'thorn') thorns(x, 905, 52 * g, t); else if (kind === 'books') bookStack(x, 905, 52 * g, 6, { seed: 2 });
      else { paint(ellPts(x, 905, 190 * g, 30 * g, 24, 2), { wash: '#6F8FC0', ink: PAL.ink, sw: .8 }); for (let i = 0; i < 4; i++) inkLine([[x - 120 + i * 70, 898 + 4 * Math.sin(t * 3 + i)], [x - 80 + i * 70, 898 - 4 * Math.sin(t * 3 + i)]], 1.4, '#B7CBEA', 'inkfine', .5); }
    }
    // the cloud grows, lightning, rain
    const ck = ease(seg(t, 54.3, 55.4));
    scribbleCloud(lerp(960, 960, 0) + 20 * Math.sin(t), lerp(240, 200, ck), 520, t, ck);
    lightning(1150, 220, 520, clamp((t - 55.05) / .28));
    // her: back to us at the forks → turns to face the cloud → braces → steps in
    const gy = 1010, u = 26, step = seg(t, 56.15, B[11]);
    const ce = emoAs(GIRL, t, [[52.01, 'neutral'], [54.4, 'scared', { emote: 'sweat' }], [55.3, 'nervous'], [55.85, 'determined']], { take: .8 });
    const arrive = stroll(t, 52.1, 52.9, 330, 960, u);
    let pose;
    if (t < 52.9) pose = { view: 'side', walk: arrive.walk, dy: arrive.dy };
    else if (t < 53.2) pose = { ...turn(t, 52.9, 53.15, .25, .5) };
    else if (t < 54.4) pose = { view: 'back', rot: .02 * Math.sin(t * 2), aL: .2, aR: .2 };
    else if (t < 54.65) pose = { ...turn(t, 54.4, 54.62, .5, 1) };
    else if (t < 55.9) pose = { view: 'front' };
    else if (t < 56.15) pose = { ...turn(t, 55.9, 56.12, 1, .5) };
    else pose = { view: 'back', walk: (t - 56.15) * 5, dy: -.6 * Math.abs(Math.sin((t - 56.15) * 5 * Math.PI)) };
    const front = pose.view === 'front' || (t > 54.4 && t < 55.95);
    const gx = t < 52.9 ? arrive.x : 960 + 40 * Math.sin(t * 0), gyy = gy - 70 * step, uu = u - 6 * step;
    girl(gx, gyy, uu, GL({ ...(front || t < 53.2 ? ce : { ...ce, eyes: undefined }), ...pose, pack: true, aL: pose.aL ?? ce.aL, aR: pose.aR ?? ce.aR, wind: t > 55 ? .3 : 0 }));
    camEnd();
    if (t > 55.1) rainStreaks(t, 90, '#B8C4EA', 56, .22, .9, 'storm');
    if (t > 55.0 && t < 55.12) flash(.5, '#FFF8D0');
    wipeIn(lt, STORM);
    wipeOut(lt, dur, RAINC);
  }

  // ======================= 12. the same blossom lane, washed (57.18–62.60) =======================
  function shot12(t, lt, dur) {
    const up = ease(seg(t, 58.2, 58.9)) * (1 - ease(seg(t, 60.3, 61.5)));
    camBegin(lerp(985, 1060, up), lerp(700, 540, up), lerp(1.3, 1.12, up) + .06 * ease(seg(t, 61.5, 62.4)));
    usePlate('lane-wet', () => laneSet('wet'), { cx: 1000, cy: 540, zoom: .95 });
    const gx = 940, gy = 990, u = 34;
    const sway = 6 * Math.sin(t * 1.4);
    // water drops falling from the branch, sparkling
    boilSeed('drips'); for (let i = 0; i < 7; i++) { const a = frac(t * .7 + hash(i)), x = 1150 + 320 * hash(i + 3), y = 330 + a * a * 640; paint(ellPts(x, y, 3.2, 5.5, 8), { wash: '#BFE3F5', ink: PAL.ink, sw: .4 }); }
    const found = t > 58.3, taken = t > 59.65;
    // pose: eyes closed like shot 1; she sees the ribbon, jumps for it, ties it on, catches a petal, smiles
    const ce = emoAs(GIRL, t, [[B[11], 'happy', { eyes: 'closed', mouth: 'smile', emote: null }], [58.35, 'surprised', { lookX: .8, lookY: -.9 }], [59.0, 'determined', { lookX: .6, lookY: -.9 }], [59.7, 'excited', { emote: null }], [60.5, 'hopeful', { emote: null }], [60.95, 'starstruck'], [61.35, 'happy', { emote: 'hearts' }]], { take: .8 });
    const jp = jump(t, 59.05, 59.7, 4.4);
    const inh = t < 58.3 ? Math.sin(clamp((t - 57.5) / .8) * Math.PI) : 0;
    let pose;
    if (t < 58.3) pose = { aL: .3 + .8 * inh, aR: .3 + .8 * inh, sq: -.05 * inh };
    else if (t < 59.0) pose = { aL: .3, aR: lerp(.3, 1.0, ease(seg(t, 58.5, 58.95))), dy: 0 };
    else if (t < 59.75) pose = { aL: .5, aR: 1.5, dy: jp.dy, sq: jp.sq };
    else if (t < 60.5) pose = { ...turn(t, 59.8, 60.0, 0, .25), aL: 1.2 + .1 * Math.sin(t * 10), aR: 1.25 };
    else if (t < 61.2) pose = { ...turn(t, 60.5, 60.7, .25, 0), aL: .4, aR: lerp(.6, 1.0, ease(seg(t, 60.9, 61.15))) };
    else pose = { view: 'front', aL: .3, aR: 1.0 };
    const tied = t > 60.3;
    girl(gx, gy, u, { ...ce, ...pose, aL: pose.aL ?? ce.aL, aR: pose.aR ?? ce.aR, dy: (pose.dy ?? 0) + (ce.dy || 0) * (t < 59 ? .3 : 0), sq: (pose.sq || 0) + (ce.sq || 0) * .4,
      loose: tied ? 0 : 1, noTie: !tied, wind: .1,
      armR: t > 59.7 && t < 60.3 ? (uu, sw) => paint(ribbon([[0, 0], [.9 * uu, .5 * uu], [1.5 * uu, 1.8 * uu]], .6 * uu, .3 * uu), { wash: RIB, ink: PAL.ink, sw: .6 }) : t > 61.1 ? (uu, sw) => petal(.55 * uu, -.35 * uu, uu * .95, .5 + .2 * Math.sin(t * 5)) : undefined });
    petalFall(t, 60.9, .5, 4, [1000, 1180], [300, 900], 21, 15, 24, 10);
    // the branch, with the ribbon snagged on it until she takes it
    const tip = laneBranch(t, { sway });
    if (!taken) hangRibbon(1110, 238, t, 1, 2.3);
    else if (t < 59.9) { const k = seg(t, 59.65, 59.9); hangRibbon(1110, 238, t, 1 - k * .8, 2.3); }
    if (t > 58.3 && t < 59.2) glow(1110, 300, 200 * Math.sin(seg(t, 58.3, 59.2) * Math.PI), '#FFFDF0', .9);
    camEnd();
    wipeIn(lt, RAINC);
    if (t > 61.85) { const at = toScreen(gx, gy - 4.6 * u); iris(...at, lerp(1500, 0, easeIn(seg(t, 61.85, 62.5))), PAL.paper); }
    if (t > 62.5) { boilSeed('endpaper'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: PAL.paper, ink: null }); }
  }

  shots([[B[0], shot1], [B[1], shot2], [B[2], shot3], [B[3], shot4], [B[4], shot5], [B[5], shot6], [B[6], shot7], [B[7], shot8], [B[8], shot9], [B[9], shot10], [B[10], shot11], [B[11], shot12]]);
})();
