// cuihua.js: the 14 shots of the 《翠花》 MV (see STORYBOARD.md). Times are video seconds; the song is 90 BPM with its
// first downbeat at 0.31 s, and every emotion key below sits on the phrase it acts.
(() => {
  const GOLD = ['#E09A3A', '#F2C26A'], RAINC = ['#2F3C7A', '#1F2550'], DAWNC = ['#E9A39A', '#F6CFA0'];
  const wipeIn = (lt, cols) => { boilSeed('wipe'); if (lt < .3) brushWipe(.5 + lt / .6, cols); };
  const wipeOut = (lt, dur, cols) => { boilSeed('wipe'); if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, cols); };
  // talking mouth, cycling while talking
  const yap = (t, on) => on ? ['open', 'smile', 'o', 'grin', 'open', 'flat'][Math.floor(t * 9) % 6] : undefined;

  // ======================= 1. the village (0.00–6.20) =======================
  function shot1(t, lt, dur) {
    const whip = t > 5.92 ? easeIn(seg(t, 5.92, 6.2)) : 0;
    camBegin(lerp(960, 1120, ease(seg(t, .3, 5.6))) + 150 * whip, 560 + 20 * ease(seg(t, 0, 6)), lerp(1, 1.06, ease(seg(t, 2.4, 5.8))));
    usePlate('village-day', () => villageSet('day'), { cx: 1070, cy: 540, zoom: .87 });
    // 翠花 at the shop door, humming; she notices Clawd, goes shy, then waves
    const [sx] = SHOP_DOOR;
    const cm = emoAs(CH, t, [[0, 'happy', { emote: 'music' }], [4.7, 'shy', { lookX: .9 }], [5.3, 'happy', { lookX: .5 }]]);
    const cv = t < 4.55 ? { view: 'front' } : turn(t, 4.55, 4.7, 0, -.125);
    const wave = t > 5.3 ? { aR: lerp(cm.aR ?? .2, 1.35 + .4 * Math.sin((t - 5.3) * 15), ease(seg(t, 5.3, 5.45))) } : {};
    cuihua(sx - 40, 965, 19, { ...cm, ...cv, ...wave });
    // Clawd trots in, stops, notices her, falls for her
    const w = stroll(t, .55, 2.5, 430, 990, 20);
    const ce = emotions(t, [[0, 'happy'], [2.62, 'surprised', { lookX: .9 }], [3.6, 'love']]);
    const pose = t < .55 ? {} : t < 2.5 ? { view: 'side', walk: w.walk, dy: (ce.dy || 0) * .3 + w.dy } : turn(t, 2.5, 2.65, .25, .125);
    const melt = t > 5.4 ? { sq: (ce.sq || 0) + .12 * ease(seg(t, 5.4, 5.8)), rot: -.05 } : {};
    clawd(t < .55 ? 430 : w.x, 965, 20, { ...ce, ...pose, ...melt });
    boilSeed('grass1');
    for (let i = 0; i < 16; i++) tuft(120 + i * 140 + 50 * hash(i), 1068 + 20 * hash(i + 3), 34, '#5E9A4E', t, i, .8);
    const at = toScreen(430, 965 - 4 * 20);
    camEnd();
    if (t < .55) iris(...at, lerp(0, 1500, easeIn(t / .55)));
    speedLines(whip, -1, PAL.cream);
  }

  // ======================= 2. the shop (6.20–9.80) =======================
  function shot2(t, lt, dur) {
    const settle = 1 - easeOut(seg(lt, 0, .3));
    camBegin(960 - 200 * settle + 10 * Math.sin(lt * .7), 690, 1.1 + .03 * lt);
    usePlate('shop', shopSet, { cx: 860, cy: 620, zoom: .9 });
    // 翠花 turns from the counter with a packet and holds it out
    const hand = 8.5;   // the packet changes hands
    const ce = emoAs(CH, t, [[6.2, 'happy'], [7.75, 'shy', { lookX: .8 }], [8.75, 'playful']]);
    const dash = seg(t, 9.25, 9.8);
    const cpos = t < 6.62 ? { view: 'qback', flip: true } : t < 9.2 ? turn(t, 6.62, 6.82, -.375, .125) : { view: 'side', walk: (t - 9.2) * 5 };
    const offer = t > 6.85 && t < hand + .15 ? { aR: lerp(.2, 0, ease(seg(t, 6.9, 7.25))) } : {};
    const cx = 640 + 1700 * easeIn(dash);
    cuihua(cx, 990, 24, { ...ce, ...cpos, ...offer, armR: t < hand ? (u, sw) => packet(.8 * u, 0, u * 1.1, .2) : undefined, smear: dash > .05 ? .5 : 0, smearDir: 1 });
    // Clawd: surprised → shy → steps in, takes it, hugs it → yanked away
    const ke = emotions(t, [[6.2, 'love'], [7.3, 'surprised', { lookX: -.8 }], [7.75, 'shy', { lookX: -.6 }], [8.62, 'love'], [9.4, 'surprised']]);
    const step = stroll(t, 8.05, 8.4, 1330, 1030, 24);
    const kdash = seg(t, 9.42, 9.8);
    const kpos = t < 9.38 ? { view: 'q', flip: true, walk: step.walk } : t < 9.45 ? turn(t, 9.38, 9.45, -.125, .25) : { view: 'side', walk: (t - 9.4) * 5 };
    const reach = t > 8.25 && t < hand ? { aR: lerp(.2, 0, ease(seg(t, 8.25, 8.45))) } : t >= hand && t < 9.38 ? { aR: lerp(0, -.35, ease(seg(t, hand, hand + .3))) } : {};
    clawd(step.x + 1600 * easeIn(kdash), 980, 24, { ...ke, ...kpos, ...reach, armR: t >= hand && t < 9.42 ? (u, sw) => packet(.6 * u, -.2 * u, u * 1.1, -.3) : undefined, smear: kdash > .05 ? .5 : 0, smearDir: 1 });
    camEnd();
    speedLines(settle, -1, PAL.cream);
    speedLines(easeIn(seg(t, 9.55, 9.8)) * .8, -1, PAL.cream);
  }

  // ======================= 3. the watermelon patch (9.80–14.30) =======================
  const BIG = [1260, 1012], BIGR = 110;
  function shot3(t, lt, dur) {
    // Clawd's lift: walk over, crouch, heave the giant melon overhead
    const kw = stroll(t, 12.5, 12.98, 470, 1110, 25);
    const lift = backOut(seg(t, 13.12, 13.45)), u = 25;
    const kx = t < 10.45 ? lerp(-520, 330, easeOut(seg(t, 9.82, 10.45))) : t < 11.2 ? lerp(330, 470, seg(t, 10.45, 11.2)) : kw.x;
    const top = 1012 - 8 * u;
    const mel = t < 13.12 ? [BIG[0], BIG[1] - .78 * BIGR] : [lerp(BIG[0], kx + 5, lift), lerp(BIG[1] - .78 * BIGR, top - .78 * BIGR - 4, lift)];
    // camera: drift, then push in on the melon held overhead (it becomes the sun of the next shot)
    const push = ease(seg(t, 13.85, 14.3)), z = lerp(1.03, 1.65, push);
    camBegin(lerp(lerp(900, 980, seg(t, 9.8, 13.8)), mel[0], push), lerp(650, mel[1], push), lerp(1.1, z, push));
    usePlate('patch-day', () => patchSet('day'), { cx: 960, cy: 610, zoom: .95 });
    // 翠花: dash in, tiptoe, point, beckon, cheer
    const cx = t < 10.4 ? lerp(-280, 560, easeOut(seg(t, 9.8, 10.4))) : t < 11.2 ? lerp(560, 700, seg(t, 10.4, 11.2)) : 700;
    const ce = emoAs(CH, t, [[9.8, 'mischief'], [11.25, 'excited', { lookX: .9 }], [11.9, 'playful'], [13.5, 'starstruck']]);
    let cp;
    if (t < 10.4) cp = { view: 'side', walk: (t - 9.8) * 4 };
    else if (t < 11.2) cp = { view: 'side', walk: (t - 10.4) * 1.3, dy: -1.1 * Math.abs(Math.sin((t - 10.4) * Math.PI * 2.6)), sq: .05 };
    else if (t < 11.85) cp = { ...turn(t, 11.2, 11.32, .25, .125), aR: lerp(.2, .25, seg(t, 11.3, 11.45)) };
    else if (t < 12.6) cp = { ...turn(t, 11.85, 12.0, .125, -.125), aR: 1.0 + .55 * Math.sin((t - 11.95) * 16) };   // beckons Clawd
    else cp = turn(t, 12.6, 12.75, -.125, .125);
    cuihua(cx, 1018, 25, { ...ce, ...cp });
    // the melon (and Clawd)
    const ke = emotions(t, [[9.8, 'mischief'], [11.95, 'determined'], [13.12, 'determined', { squint: .6 }], [13.5, 'proud']]);
    let kp;
    if (t < 10.45) kp = { view: 'side', walk: (t - 9.82) * 4 };
    else if (t < 11.2) kp = { view: 'side', walk: (t - 10.45) * 1.3, dy: -1.1 * Math.abs(Math.sin((t - 10.5) * Math.PI * 2.6)), sq: .05 };
    else if (t < 12.5) kp = turn(t, 11.2, 11.35, .25, .125);
    else if (t < 12.98) kp = { view: 'side', walk: kw.walk };
    else if (t < 13.12) kp = { ...turn(t, 12.98, 13.08, .25, 0), sq: .2 * ease(seg(t, 13.0, 13.12)), aL: -.6, aR: -.6 };
    else { const strain = t < 13.5 ? Math.sin(t * 70) * .12 : 0; kp = { aL: lerp(-.6, 1.45, lift), aR: lerp(-.6, 1.45, lift), dx: strain, sq: -.08 * lift + .1 * spring(t, 13.45, 7, 20) }; }
    if (t >= 13.12) melon(mel[0], mel[1], BIGR, { rot: Math.sin(t * 70) * .02 * (t < 13.5 ? 1 : 0) });
    clawd(kx, 1012, u, { ...ke, ...kp, sq: (ke.sq || 0) + (kp.sq || 0) });
    if (t < 13.12) melon(mel[0], mel[1], BIGR);
    boilSeed('grass3');
    for (let i = 0; i < 12; i++) tuft(100 + i * 170 + 60 * hash(i + 40), 1090, 30, '#4E8B3A', t, i + 40, .8);
    camEnd();
  }

  // ======================= 4. sunset on the ridge (14.30–16.60) =======================
  function shot4(t, lt, dur) {
    const back = ease(seg(t, 14.3, 15.0));
    camBegin(960, lerp(SUN4[1], 600, back), lerp(1.2, 1.0, back));
    usePlate('ridge-sunset', ridgeSunsetSet, { cx: 960, cy: 580, zoom: .95 });
    const g = x => 872 + 6 * Math.sin(x * .01);
    // eating: the melon half bobs up to the mouth on the beat
    const chew = t => { const b = bpOf(t); return .35 * Math.max(0, Math.sin(b * Math.PI)); };
    // Clawd spits a seed
    const tsp = 15.22;
    const ke = emotions(t, [[14.3, 'happy'], [15.0, 'determined', { squint: .8 }], [tsp, 'surprised'], [16.0, 'laugh']]);
    const spit = t > 15.0 && t < 15.5 ? { sq: t < tsp ? .14 * seg(t, 15.0, tsp) : -.18 * Math.exp(-(t - tsp) * 8), mouth: t < tsp ? 'pout' : 'O' } : {};
    clawd(700, g(700), 24, { ...ke, view: 'q', ...spit, aR: -.35 + chew(t) * (t < 15 ? 1 : 0), armR: (u, sw) => halfMelon(.8 * u, .3 * u, 1.4 * u, { scoop: .6 }) });
    const ce = emoAs(CH, t, [[14.3, 'happy'], [15.25, 'surprised', { lookX: .9, lookY: -.6 }], [15.85, 'laugh']]);
    cuihua(1230, g(1230), 24, { ...ce, view: 'q', flip: true, aR: -.35 + chew(t + .3) * (t < 15.2 ? 1 : 0), armR: (u, sw) => halfMelon(.8 * u, .3 * u, 1.4 * u, { scoop: .4 }) });
    // the seed flies off into the sunset
    if (t > tsp && t < 16.1) {
      const k = seg(t, tsp, 16.0), p = arcPt([700 + 5.5 * 24, g(700) - 4.4 * 24], [1700, 300], 260, easeOut(k));
      boilSeed('seed'); for (let j = 1; j < 4; j++) { const q = arcPt([700 + 5.5 * 24, g(700) - 4.4 * 24], [1700, 300], 260, easeOut(Math.max(0, k - j * .03))); paint(ellPts(q[0], q[1], 4 - j, 4 - j, 8), { wash: PAL.cream, washOp: 200, ink: null }); }
      push(); translate(p[0], p[1]); rotate(t * 20); paint(ellPts(0, 0, 14 * (1 - k * .5), 9 * (1 - k * .5), 10), { wash: PAL.ink, ink: PAL.cream, sw: .5 }); pop();
    }
    camEnd();
    wipeOut(lt, dur, GOLD);
  }

  // ======================= 5. the bus stop: she leaves, six years pass (16.60–20.00) =======================
  function shot5(t, lt, dur) {
    camBegin(960, 560, 1);
    const c = clamp((t - 17.9) / 1.7 * 6, 0, 6), ph = frac(c), lapse = t > 17.9 && t < 19.6;
    const night = lapse ? (1 - Math.cos(ph * TAU)) / 2 : 0, snow = lapse ? clamp(1 - Math.abs(c - 3.3) / 1.1) : 0;
    usePlate('road-day', () => roadSet('day'), { cx: 960, cy: 540, zoom: .95 });
    if (snow > .01) usePlate('road-snow', () => roadSet('day', { snow: true }), { cx: 960, cy: 540, zoom: .95 }, { alpha: snow });
    if (night > .01) usePlate('road-night', () => roadSet('night'), { cx: 960, cy: 540, zoom: .95 }, { alpha: night });
    // the sun and moon race over in the time-lapse, as streaks
    if (lapse) {
      boilSeed('sky5');
      const day = ph < .5, k = day ? ph * 2 : (ph - .5) * 2, arc = kk => [lerp(-100, 2020, kk), 420 - 330 * Math.sin(kk * Math.PI)];
      const P = []; for (let i = 0; i < 6; i++) P.push(arc(clamp(k - i * .05)));
      paint(ribbon(P.reverse(), 20, 70), { wash: day ? '#FFE79A' : '#F4EED8', washOp: 220, ink: null });
    }
    // the tree grows from a sapling
    boilSeed('tree5'); tree(TREE_X, ROAD_Y - 40, 620, .12 + .88 * ease(seg(t, 17.9, 19.6)), { leaf: '#5E9A4E', snow: snow > .5 });
    // the bus: leaves with 翠花 waving from the window → comes back the other way
    const out = easeIn(seg(t, 16.95, 17.9)), back = t > 19.5;
    const bx = back ? lerp(2400, 1400, easeOut(seg(t, 19.5, 20.0))) : 1150 + 1700 * out, by = 965, s = 22;
    if (t < 17.95 || back) {
      bus(bx, by, s, { part: 'back', flip: back, spin: back ? -(t - 19.5) * 8 * (1 - seg(t, 19.6, 20)) : -out * 30, bob: back ? 0 : 3 * Math.sin(t * 30) * out });
      if (!back) {
        const ce = emoAs(CH, t, [[16.6, 'happy'], [17.15, 'sad', { emote: null }]]);
        cuihua(bx + BUS_WIN[1] * s, by - 6.05 * s, 9, { ...ce, noLegs: true, noShadow: true, aR: 1.25 + .45 * Math.sin(t * 15), aL: -.6, braidSway: -out * 2 });
      }
      bus(bx, by, s, { part: 'front', flip: back, spin: back ? -(t - 19.5) * 8 * (1 - seg(t, 19.6, 20)) : -out * 30 });
    }
    // Clawd: waves, then waits through the years, then sees the bus
    const ke = emotions(t, [[16.6, 'happy'], [17.55, 'sad'], [18.4, 'bored'], [19.1, 'sleepy'], [19.7, 'surprised', { lookX: .9 }]]);
    const wave = t < 17.6 ? { aR: 1.2 + .45 * Math.sin(t * 13) } : {};
    const sit = lapse ? { sq: (ke.sq || 0) + .12 } : {};
    const cap = snow > .3 ? { draw: (u, sw) => paint(ellPts(0, -8.1 * u, 5.4 * u * snow, 1.0 * u, 18), { wash: '#F4F7FA', ink: PAL.ink, sw: sw * .5 }) } : {};
    clawd(520, 1012, 20, { ...ke, view: 'q', ...wave, ...sit, ...cap });
    camEnd();
    wipeIn(lt, GOLD);
  }

  // ======================= 6. she's back (20.00–25.70) =======================
  const HER = [1265, 935];
  const ROAD_NEAR = { cx: 1150, cy: 820, zoom: 1.3 };
  const roadPlates = near => { usePlate('road-over', () => roadSet('overcast', { tree: true }), { cx: 980, cy: 600, zoom: .9 }); if (near > 0) usePlate('road-over-near', () => roadSet('overcast', { tree: true }), ROAD_NEAR, { alpha: near }); };
  function shot6(t, lt, dur) {
    const mv = ease(seg(t, 21.9, 22.9));
    camBegin(lerp(960, 1110, mv), lerp(560, 800, mv), lerp(1, 1.4, mv));
    roadPlates(seg(t, 22.9, 23.2));
    // 翠花, transformed, revealed as the bus pulls away
    const ce = emoAs(CH, t, [[20, 'cool', { emote: null }], [22.85, 'smug', { lookX: -.7 }], [24.42, 'disgusted'], [25.0, 'smug', { lookX: .6, emote: null }]]);
    const lifted = t > 22.85;
    const look = t > 23.0 && t < 23.85 ? { lookY: Math.sin((t - 23.0) * 9) > 0 ? .8 : -.6 } : {};
    const push = t > 24.4 && t < 25.0 ? { aR: lerp(.2, .1, ease(seg(t, 24.4, 24.55))) - .5 * ease(seg(t, 24.6, 25.0)), dx: -.4 * Math.sin(seg(t, 24.4, 24.8) * Math.PI) } : {};
    const hv = t < 24.95 ? { view: 'q', flip: true } : turn(t, 24.95, 25.15, -.125, .125);
    cuihua(...HER, 20, { ...ce, ...hv, ...look, ...push, city: true, shadesOff: lifted, eyes: lifted ? 'narrow' : undefined });
    // the bus leaves to the left
    const go = easeIn(seg(t, 20.9, 21.75)), bx = 1400 - 2400 * go;
    if (go < 1) { bus(bx, 965, 24, { flip: true, spin: go * 30, bob: 2 * Math.sin(t * 40) * (1 - go) * (t < 20.9 ? 1 : .3), noShadow: false }); }
    // Clawd: hopeful → starstruck → runs over → shows the slice → pushed away → sad
    const ke = emotions(t, [[20, 'hopeful', { lookX: .9 }], [21.72, 'starstruck'], [22.85, 'happy'], [23.25, 'confused'], [23.85, 'hopeful', { lookX: .7, lookY: -.3 }], [24.55, 'surprised'], [24.95, 'sad']]);
    const run = stroll(t, 22.25, 22.85, 520, 975, 21);
    const kp = t < 22.25 ? { view: 'q' } : t < 22.85 ? { view: 'side', walk: run.walk * 1.4, dy: run.dy * 2 } : { view: 'q' };
    const offer = t > 23.85 && t < 24.95 ? { aR: lerp(.2, .75, backOut(seg(t, 23.85, 24.15))) } : {};
    const sliceRot = t > 24.5 ? -.6 * ease(seg(t, 24.5, 24.8)) : 0;
    const ky = lerp(1012, 992, seg(t, 22.25, 22.85));
    clawd(run.x, ky, 21, { ...ke, ...kp, ...offer, armR: (u, sw) => slice(.9 * u, 0, 1.6 * u, { rot: .3 + sliceRot }) });
    camEnd();
  }

  // ======================= 7. the sudden brake (25.70–29.30) =======================
  const CAR_X = 1400, CAR_Y = 1060, CAR_S = 27;
  function carX(t) {   // whoosh in, then a hard brake
    if (t < 26.05) return lerp(-700, 1250, (t - 25.7) / .35);
    return lerp(1250, CAR_X, easeOut(seg(t, 26.05, 26.35)));
  }
  function shot7(t, lt, dur) {
    const sh = t > 26.05 ? shakeXY(t, 14 * Math.exp(-(t - 26.05) * 6)) : [0, 0];
    const pin = ease(seg(t, 28.3, 29.0));
    camBegin(lerp(1110, 1280, pin) + sh[0], lerp(800, 880, pin) + sh[1], lerp(1.4, 1.6, pin));
    roadPlates(1);
    const x = carX(t), braking = t > 26.05 && t < 26.6, rot = braking ? -.05 * Math.sin(seg(t, 26.05, 26.6) * Math.PI) : .02 * spring(t, 26.4, 6, 14);
    // 翠花 watches from behind the car
    const ce = emoAs(CH, t, [[25.7, 'smug', { lookX: .6 }], [25.95, 'surprised', { lookX: -.8 }], [26.7, 'cool'], [28.5, 'love', { lookX: .7, emote: 'hearts' }]]);
    cuihua(...HER, 20, { ...ce, view: 'q', flip: t < 28.4, city: true });
    // skid marks
    if (t > 26.05) { boilSeed('skid'); for (const wx of [-5.2, 5.4]) inkLine([[1250 + wx * CAR_S - 10, CAR_Y - 2], [x + wx * CAR_S - 20, CAR_Y - 1]], 2.2, '#3A3340', 'dry', 0); }
    // the rival, driving
    const re = emoAs(RV, t, [[25.7, 'cool'], [28.45, 'smug', { lookX: .8 }]]);
    const [rx, ry] = seatPos(x, CAR_Y, CAR_S, 'driver');
    rival(rx, ry - (braking ? 6 : 0), 13, { ...re, view: 'q', noLegs: true, noShadow: true, dx: braking ? .6 : 0 });
    car(x, CAR_Y, CAR_S, { spin: -x / (1.25 * CAR_S), rot, bob: 0 });
    dust(1250 - 5.2 * CAR_S, CAR_Y - 20, 160, seg(t, 26.05, 27.1));
    dust(x + 6 * CAR_S, CAR_Y - 20, 120, seg(t, 26.2, 27.0));
    // Clawd gets spun by the blast; the slice flies and splats
    const ke = emotions(t, [[25.7, 'sad'], [25.95, 'scared'], [26.45, 'dizzy'], [27.3, 'sad', { lookX: .5, lookY: .8 }]]);
    const spin = t > 25.95 && t < 26.45 ? spinView(seg(t, 25.95, 26.45) * 1.0) : {};
    const blown = -110 * easeOut(seg(t, 25.95, 26.4));
    const hasSlice = t < 26.0;
    clawd(975 + blown, 992, 21, { ...ke, view: 'q', ...spin, smear: t > 25.95 && t < 26.4 ? .4 : 0, armR: hasSlice ? (u, sw) => slice(.9 * u, 0, 1.6 * u, { rot: .3 }) : undefined });
    if (t >= 26.0) {
      const k = seg(t, 26.0, 26.9), p = arcPt([975 + 7 * 21, 992 - 5 * 21], [1080, 1085], 300, k);
      if (k < 1) slice(p[0], p[1], 34, { rot: t * 12 });
      else { boilSeed('splat'); splat(1080, 1085, 64, seg(t, 26.9, 27.1)); }
    }
    camEnd();
    speedLines(t < 26.05 ? 1 : 1 - seg(t, 26.05, 26.2), 1, PAL.cream);
  }

  // ======================= 8. into his car, gone (29.30–33.10) =======================
  function shot8(t, lt, dur) {
    const follow = ease(seg(t, 31.9, 32.8));
    camBegin(lerp(1160, 1080, follow), lerp(820, 845, follow), lerp(1.36, 1.42, follow));
    roadPlates(1);
    const go = easeIn(seg(t, 31.05, 31.9)), x = CAR_X + 2600 * go, rev = t > 30.35 && t < 31.1 ? Math.sin(t * 60) * 3 : 0;
    const [px, py] = seatPos(x, CAR_Y, CAR_S, 'passenger'), [rx, ry] = seatPos(x, CAR_Y, CAR_S, 'driver');
    // 翠花 hops over the door into the passenger seat without looking back
    const hop = seg(t, 29.45, 30.05), seated = t >= 30.05;
    const ce = emoAs(CH, t, [[29.3, 'cool', { lookX: .8 }], [30.1, 'smug', { lookX: .9 }]]);
    const herPos = hop <= 0 ? HER : seated ? [px, py] : arcPt(HER, [px, py], 170, ease(hop));
    const her = { ...ce, view: 'q', city: true, bag: true, noLegs: seated, noShadow: seated || hop > 0, sq: hop > 0 && !seated ? -.12 * Math.sin(hop * Math.PI) : (ce.sq || 0), braidSway: 0 };
    if (seated) cuihua(herPos[0], herPos[1] - rev, 13, her);
    const re = emoAs(RV, t, [[29.3, 'smug', { lookX: .8 }], [30.35, 'cool']]);
    rival(rx, ry - rev, 13, { ...re, view: 'q', noLegs: true, noShadow: true, rot: -.08 * go });
    car(x, CAR_Y, CAR_S, { spin: -x / (1.25 * CAR_S), bob: rev, rot: -.02 * go });
    if (!seated) cuihua(herPos[0], herPos[1], lerp(20, 13, ease(hop)), her);
    // exhaust when he revs, dust when they go
    boilSeed('exhaust');
    for (let i = 0; i < 4; i++) { const a = t - 30.35 - i * .15; if (a > 0 && a < .9 && go < .3) cloudPuff(x - 9.4 * CAR_S - a * 160, CAR_Y - 40 - a * 60, 20 + a * 50, '#B8B4BC', 255 * (1 - a / .9)); }
    dust(CAR_X - 6 * CAR_S, CAR_Y - 20, 150, seg(t, 31.05, 32.6), '#D8CDB4');
    // Clawd, left in the dust
    const ke = emotions(t, [[29.3, 'dizzy'], [29.6, 'confused', { lookX: .8 }], [30.2, 'surprised', { lookX: .9 }], [31.95, 'sad']]);
    clawd(865, 992, 21, { ...ke, view: 'q' });
    camEnd();
    speedLines(go > .1 && go < 1 ? .7 : 0, 1, PAL.cream);
  }

  // ======================= 9. the long road (33.10–36.40) =======================
  const persp = y => clamp((y - VP[1]) / (1080 - VP[1]), .01, 2);
  function shot9(t, lt, dur) {
    const insert = t >= 34.4 && t < 35.3;
    if (!insert) {
      camBegin(960, 540, 1);
      usePlate('roadv-dusk', () => roadVSet('dusk'), { cx: 960, cy: 540, zoom: .95 });
      // the car shrinks toward the horizon
      const k = seg(t, 33.1, 36.2), cy = lerp(990, 566, 1 - Math.pow(1 - k, 1.7)), cs = 27 * persp(cy);
      if (cs > .6) carRear(960 + 130 * persp(cy), cy, cs);
      // Clawd runs after it, then gives up
      const run = seg(t, 33.1, 35.35), ky = lerp(1300, 790, easeOut(run)), ku = 34 * persp(ky);
      const ke = emotions(t, [[33.1, 'determined'], [35.4, 'sad']]);
      const legs = t < 35.35 ? { walk: (t - 33.1) * 4, dy: -Math.abs(Math.sin((t - 33.1) * Math.PI * 4)) * .8, aL: .9 * Math.sin(t * 25), aR: -.9 * Math.sin(t * 25) } : { sq: .1 * ease(seg(t, 35.35, 35.7)), aL: -.8, aR: -.8 };
      clawd(960 - 190 * persp(ky), ky, ku, { ...ke, view: 'back', ...legs, noShadow: false });
      if (t > 35.7) rainStreaks(t, Math.round(40 * seg(t, 35.7, 36.4)), '#B8B4D8', 40, .2, .6);
      camEnd();
    } else {
      // insert: 翠花 in the passenger seat looks back... and away
      camBegin(960, 470, 1.35);
      usePlate('roadv-dusk-sky', () => roadVSet('dusk'), { cx: 960, cy: 380, zoom: 1.2 });
      boilSeed('poles9');
      for (let i = 0; i < 3; i++) { const x = 2400 - frac(t * 1.6 + i / 3) * 3200; paint(rectPts(x, 120, 26, 800), { wash: '#4A3550', ink: null }); }
      camEnd(); speedLines(.8, -1, '#F2D4C0', 10); camBegin(960, 470, 1.35);
      const ce = emoAs(CH, t, [[34.4, 'neutral'], [34.62, 'nervous', { lookX: -.3 }], [35.05, 'cool']]);
      const hv = t < 34.55 ? { view: 'back' } : t < 35.0 ? turn(t, 34.55, 34.68, .5, .125) : turn(t, 35.0, 35.12, .125, .5);
      cuihua(1020, 860, 46, { ...ce, ...hv, city: true, noLegs: true, noShadow: true, bag: false, rot: .02 * Math.sin(t * 20) });
      boilSeed('carside9');
      paint(rrPts(-200, 700, 2400, 500, 60), { wash: '#D9413F', ink: PAL.ink, sw: 1.4 });
      paint(ribbon([[-200, 790], [960, 784], [2200, 792]], 26, 26), { wash: PAL.cream, ink: null });
      camEnd();
    }
    wipeOut(lt, dur, RAINC);
  }

  // ======================= 10. on his knees in the rain (36.40–39.20) =======================
  function dropPts(cx, cy, r) { const P = []; for (let i = 0; i < 32; i++) { const a = i / 32 * TAU; P.push([cx + r * .95 * Math.sin(a) * Math.pow(Math.sin(a / 2), 1.3), cy - r * 1.25 * Math.cos(a) + r * .25]); } return P; }
  function shot10(t, lt, dur) {
    const back = ease(seg(t, 36.7, 39.0));
    camBegin(960, lerp(770, 640, back), lerp(1.35, 1.02, back));
    usePlate('roadv-rain', () => roadVSet('rain'), { cx: 960, cy: 620, zoom: .98 });
    const ke = emotions(t, [[36.4, 'sad'], [36.75, 'cry']]);
    const drop = seg(t, 36.42, 36.75);
    const kneel = { sq: .28 * easeOut(drop) + .04 * Math.sin(t * 9) * (t > 36.8 ? 1 : 0), dy: 0 };
    const arms = t > 36.8 ? { aL: 1.25 + .3 * Math.sin(t * 7), aR: 1.25 + .3 * Math.sin(t * 7 + 1.3) } : {};
    boilSeed('ripples');
    for (let i = 0; i < 6; i++) { const a = frac(t * 1.3 + hash(i + 5)), x = 960 + (hash(i + 1) - .5) * 700, y = 1010 + (hash(i + 2) - .5) * 120; paint(ellPts(x, y, 20 + 60 * a, (20 + 60 * a) * .25, 18), { ink: '#8A9AD0', sw: .5 * (1 - a) + .1 }); }
    clawd(960, 985, 30, { ...ke, ...kneel, ...arms, view: 'front' });
    const face = toScreen(960, 985 - 6 * 30 * (1 - .28));
    camEnd();
    rainStreaks(t, 70, '#A9B6E4', 50, .2, .7);
    if (t < 36.75) flash(.8 * (1 - seg(t, 36.42, 36.75)) * (t > 36.42 ? 1 : 0), '#E8ECFF');
    if (lt > dur - .32) { boilSeed('dropiris'); const k = seg(lt, dur - .32, dur - .02); if (k >= .999) iris(0, 0, 0); else irisShape(dropPts(face[0], face[1], lerp(1300, 0, easeIn(k))), '#151A38'); }
  }

  // ======================= 11. the porch: talking to a watermelon (39.20–42.90) =======================
  const PMELON = [1290, 632], LANT = [1125, 455];
  function shot11(t, lt, dur) {
    camBegin(lerp(1130, 1100, seg(t, 39.2, 42.9)), 700, lerp(1.3, 1.36, seg(t, 39.2, 42.9)));
    usePlate('porch', porchSet, { cx: 1100, cy: 690, zoom: 1.25 });
    melon(PMELON[0], PMELON[1], 88, { flower: true, braids: true, rot: .03 * Math.sin(t * 2) });
    // Clawd: chats away, waits, sighs, takes the lantern and goes
    const talking = t > 40.25 && t < 41.15;
    const ke = emotions(t, [[39.2, 'hopeful', { lookX: .8 }], [40.25, 'happy', { lookX: .8 }], [41.15, 'thinking', { lookX: .9, lookY: -.2 }], [41.65, 'sad', { lookX: .6 }]]);
    const gest = talking ? { aR: .5 + .5 * Math.sin(t * 11), aL: .2 + .3 * Math.sin(t * 7 + 1) } : {};
    const takeL = seg(t, 42.25, 42.55), has = t > 42.55;
    const reach = t > 42.2 ? { aR: lerp(.2, 1.1, ease(seg(t, 42.2, 42.5))) - .9 * ease(seg(t, 42.6, 42.85)) } : {};
    const kx = t > 42.6 ? lerp(985, 1075, ease(seg(t, 42.6, 42.9))) : 985;
    const kp = t > 42.6 ? { view: 'side', walk: (t - 42.6) * 2 } : { view: 'q' };
    const holdL = (u, sw) => lantern(.2 * u, 0, 1.6 * u);
    clawd(kx, 980, 24, { ...ke, ...kp, ...gest, ...reach, mouth: yap(t, talking) ?? ke.mouth, armR: has && kp.view !== 'side' ? holdL : undefined, armL: has && kp.view === 'side' ? holdL : undefined, aL: kp.view === 'side' ? .1 : (gest.aL ?? ke.aL) });
    if (!has) {
      const lx = lerp(LANT[0], LANT[0], takeL), ly = LANT[1];
      inkLine([[lx, 120], [lx, ly]], .8, PAL.ink, 'inkfine', 0);
      boilSeed('lantern'); lantern(lx, ly, 40 + 0 * Math.sin(t)); glow(lx, ly + 48, 220, '#FFC766', .9);
    } else glow(kx + 120, 980 - 6 * 24, 220, '#FFC766', .9);
    camEnd();
    if (lt < .3) { boilSeed('dropiris'); const s = toScreen(...PMELON); irisShape(dropPts(s[0], s[1], lerp(0, 1400, easeIn(seg(lt, 0, .3)))), '#151A38'); }
  }

  // ======================= 12. the search (42.90–48.20) =======================
  // the summit's rock line, for walking up it
  const rockY = x => { const P = [[-500, 880], [320, 800], [540, 750], [740, 760], [910, 790]]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return 790; };
  const SUMMIT_CAM = { cx: 1050, cy: 560, zoom: .85 };
  function shot12(t, lt, dur) {
    if (t < 45.75) {
      camBegin(lerp(1180, 1260, seg(t, 42.9, 45.75)), 760, 1.3);
      usePlate('village-night', () => villageSet('night', { shopLit: false }), { cx: 1220, cy: 740, zoom: 1.22 });
      const w = stroll(t, 42.9, 44.5, 560, 1300, 16), w2 = stroll(t, 45.35, 46.2, 1300, 1900, 16);
      const x = t < 45.35 ? w.x : w2.x;
      const ke = emotions(t, [[42.9, 'determined'], [44.55, 'hopeful', { lookX: .9 }], [44.95, 'nervous'], [45.3, 'sad']]);
      const look = t < 44.5 ? { view: 'side', walk: w.walk, dy: w.dy } : t < 44.95 ? turn(t, 44.5, 44.62, .25, .125) : t < 45.15 ? turn(t, 44.95, 45.05, .125, -.125) : t < 45.35 ? turn(t, 45.15, 45.25, -.125, .125) : { view: 'side', walk: w2.walk };
      clawd(x, 975, 16, { ...ke, ...look, aL: .1, armL: (u, sw) => lantern(.3 * u, 0, 1.6 * u) });
      glow(x + 60, 975 - 5 * 16, 200, '#FFC766', 1);
      camEnd();
    } else {
      const z = 1.25;
      camBegin(lerp(700, 760, seg(t, 45.75, 48.2)), lerp(640, 600, seg(t, 45.75, 48.2)), z);
      usePlate('summit', summitSet, SUMMIT_CAM);
      const w = stroll(t, 45.75, 46.95, 180, 640, 20), x = w.x, y = rockY(x);
      const ke = emotions(t, [[45.75, 'determined'], [47.35, 'determined', { squint: .4 }]]);
      const slope = (rockY(x + 5) - rockY(x - 5)) / 10;
      const set = t > 47.0;
      const inhale = seg(t, 47.4, 48.2);
      const pose = t < 46.95 ? { view: 'side', walk: w.walk, rot: Math.atan(slope) * .8, aL: .1 } : t < 47.35 ? { ...turn(t, 47.15, 47.35, .25, 0), aL: lerp(.1, -.6, seg(t, 47.0, 47.2)) } : { sq: -.14 * ease(inhale), sx: 1 + .08 * ease(inhale), aL: -.7, aR: -.7, dy: -.3 * ease(inhale) };
      clawd(x, y, 20, { ...ke, ...pose, armL: !set ? (u, sw) => lantern(.3 * u, 0, 1.6 * u) : undefined });
      if (set) { boilSeed('lant12'); lantern(520, rockY(520) - 70, 32); glow(520, rockY(520) - 30, 160, '#FFC766', .9); }
      else glow(x + 50, y - 80, 180, '#FFC766', 1);
      camEnd();
    }
  }

  // ======================= 13. the shout (48.20–53.60) =======================
  function shot13(t, lt, dur) {
    const shout = t > 48.3 && t < 49.65;
    const sh = shout ? shakeXY(t, 10 * (1 - seg(t, 48.3, 49.6))) : [0, 0];
    const wide = ease(seg(t, 48.55, 50.3)), home = ease(seg(t, 52.0, 53.4));
    const z = lerp(lerp(1.25 + .12 * ease(seg(t, 48.2, 48.32)), .9, wide), 1.1, home);
    camBegin(lerp(lerp(760, 1100, wide), 860, home) + sh[0], lerp(lerp(600, 560, wide), 640, home) + sh[1], z);
    usePlate('summit', summitSet, SUMMIT_CAM);
    boilSeed('lant13'); lantern(520, rockY(520) - 70, 32); glow(520, rockY(520) - 30, 160, '#FFC766', .9);
    const [mx, my] = [640, rockY(640)], u = 20, mouthY = my - 4.6 * u;
    // the rings of the shout cross the valley
    for (let i = 0; i < 6; i++) {
      const ti = 48.32 + i * .16, a = t - ti; if (a < 0 || a > 2.2) continue;
      boilSeed('ring' + i); soundRing(mx + 6 * u, mouthY, 60 + a * 900, mixCol('#FFF1C8', '#33426E', a / 2.2), 4 * (1 - a / 2.4), -.9, .9);
    }
    // birds burst from the trees on the ridge
    boilSeed('birds');
    for (let i = 0; i < 12; i++) {
      const t0 = 48.85 + .5 * hash(i + 3), a = t - t0; if (a < 0 || a > 3) continue;
      const bx = 950 + i * 105 + 40 * hash(i + 2), by = 760 + 30 * hash(i + 6);
      bird(bx + a * (120 + 60 * hash(i)), by - a * (220 + 80 * hash(i + 1)), 12 + 4 * hash(i + 4), t * 22 + i, '#0F1428');
    }
    // the echoes come back, smaller, and nothing else
    for (let i = 0; i < 3; i++) {
      const ti = 50.9 + i * .45, a = t - ti; if (a < 0 || a > 1.6) continue;
      boilSeed('echo' + i); soundRing(2050, 600, 40 + a * 700, mixCol('#D8DCF0', '#33426E', a / 1.6), 2.6 * (1 - i * .25) * (1 - a / 1.8), Math.PI - .7, Math.PI + .7);
    }
    const ke = emotions(t, [[48.2, 'determined', { squint: .4 }], [48.3, 'furious', { eyes: 'squeeze', emote: null }], [49.65, 'hopeful', { lookX: 1 }], [52.25, 'sad']], { take: .6 });
    const lid = shout ? clamp(seg(t, 48.3, 48.42)) * (1 - seg(t, 49.4, 49.65)) : 0;
    const pose = shout ? { lid: .3 + .7 * lid, sq: -.18 * lid, aL: 1.1 + .1 * Math.sin(t * 30), aR: 1.1 + .1 * Math.sin(t * 31), dy: -.4 * lid } : t > 52.4 ? { sq: (ke.sq || 0) + .18 * ease(seg(t, 52.4, 52.8)) } : {};
    clawd(mx, my, u, { ...ke, ...pose });
    camEnd();
    wipeOut(lt, dur, DAWNC);
  }

  // ======================= 14. dawn: she comes softly, leaves softly; a seed (53.60–60.00) =======================
  function shot14(t, lt, dur) {
    const mv = ease(seg(t, 53.75, 54.6)), drift = seg(t, 54.6, 59.9);
    camBegin(lerp(1150, 1110 - 20 * drift, mv), lerp(600, 840 + 15 * drift, mv), lerp(1.08, 1.48 + .06 * drift, mv));
    usePlate('village-dawn', () => villageSet('dawn'), { cx: 1100, cy: 640, zoom: .95 });
    usePlate('village-dawn-near', () => villageSet('dawn'), { cx: 1100, cy: 860, zoom: 1.45 }, { alpha: seg(t, 54.6, 54.9) });
    const [sx] = SHOP_DOOR;
    // petals gather at the door, she's there; she walks softly to him; she goes to petals that blow away
    const gather = seg(t, 53.75, 54.3), here = t > 54.25 && t < 56.05, gone = seg(t, 56.05, 57.6);
    boilSeed('petals');
    for (let i = 0; i < 18; i++) {
      if (t < 54.3) { const a = hash(i) * TAU, d = (1 - easeOut(gather)) * 380; if (gather > 0) petal(sx - 40 + Math.cos(a) * d, 900 + Math.sin(a) * d * .6, 15, t * 4 + i); }
    }
    if (t > 56.0 && t < 58.2) {
      boilSeed('petalburst');
      const a0 = t - 56.0;
      for (let i = 0; i < 30; i++) {
        const ox = 1190 + (hash(i + 101) - .5) * 190, oy = 965 - 160 * hash(i + 102), d = Math.max(0, a0 - .05 * hash(i + 103));
        const wind = d * d * (260 + 220 * hash(i + 104)), lift = d * (120 + 140 * hash(i + 105)) + d * d * 90;
        const x = ox + d * (70 + 120 * (hash(i + 106) - .3)) + wind + Math.sin(d * 5 + i) * 26, y = oy - lift + Math.sin(d * 3.3 + i * 2) * 18;
        const sz = 19 * (1 - seg(d, 1.2, 2.1)) * (.75 + .5 * hash(i + 107));
        if (sz > 1) petal(x, y, sz, d * (3 + 4 * hash(i + 108)) + i, i % 3 ? '#F6B8C2' : '#FCE3E6');
      }
    }
    if (here) {
      const w = stroll(t, 54.35, 55.6, sx - 40, 1190, 19);
      const ce = emoAs(CH, t, [[54.25, 'happy', { emote: null }], [55.65, 'happy', { eyes: 'closed', mouth: 'smile' }]]);
      cuihua(w.x, 965, 19, { ...ce, view: 'q', flip: true, walk: w.walk, dy: (ce.dy || 0) * .4, ghost: true, rot: t > 55.65 ? -.06 : 0 });
      if (t > 56.0) dust(1190, 915, 120, seg(t, 56.0, 56.5), '#F8D6DC');
    }
    // Clawd: looks up, softens, reaches, lets go, plants the seed; the sprout
    const ke = emotions(t, [[53.6, 'sad'], [54.4, 'surprised', { lookX: .9 }], [54.95, 'love', { emote: null }], [56.25, 'sad', { emote: null, lookX: .9, lookY: -.5 }], [57.0, 'relieved', { emote: null }], [58.32, 'hopeful', { lookX: .5, lookY: .6 }]]);
    const reach = t > 56.0 && t < 57.0 ? { aR: lerp(.2, 1.0, ease(seg(t, 56.0, 56.3))) * (1 - ease(seg(t, 56.6, 57.0))) } : {};
    const plant = t > 57.35 && t < 58.35 ? { rot: .12 * ease(seg(t, 57.35, 57.6)), sq: .12 * ease(seg(t, 57.35, 57.6)), aR: -1.0 + .25 * Math.abs(Math.sin((t - 57.8) * 18)) * (t > 57.8 ? 1 : 0) } : {};
    clawd(980, 990, 20, { ...ke, view: 'q', ...reach, ...plant, sq: (ke.sq || 0) + (plant.sq || 0) + (t < 54.4 ? .12 : 0) });
    sprout(1105, 1000, 36, seg(t, 58.3, 58.75));
    const at = toScreen(1050, 930);
    boilSeed('grass14');
    for (let i = 0; i < 16; i++) tuft(300 + i * 130 + 50 * hash(i + 80), 1068 + 20 * hash(i + 83), 34, '#86A86A', t, i + 80, .8);
    camEnd();
    wipeIn(lt, DAWNC);
    if (t > 58.9) { const r = t < 59.35 ? lerp(1500, 270, ease(seg(t, 58.9, 59.35))) : t < 59.6 ? lerp(270, 250, seg(t, 59.35, 59.6)) : lerp(250, 0, easeIn(seg(t, 59.6, 59.92))); iris(...at, r); }
  }

  shots([[0, shot1], [6.2, shot2], [9.8, shot3], [14.3, shot4], [16.6, shot5], [20.0, shot6], [25.7, shot7], [29.3, shot8],
         [33.1, shot9], [36.4, shot10], [39.2, shot11], [42.9, shot12], [48.2, shot13], [53.6, shot14]]);
})();
