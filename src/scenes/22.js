// 22.js: 《22》MV. See STORYBOARD_22.md for the plan.
// 92.8 BPM, first downbeat 0.34 s, 62.6 s total. Cuts follow the supplied recording's vocal phrases.
//   1 intro   窗外花开,Clawd 醒来推窗         2 春天是她最爱的季节    3 微风吹乱头发
//   4 不在意嘈杂                              5 想着生命中的变化      6 还有15分钟在午休
//   7 从早到晚没那么好过                       8 安定不一定幸福        9 忘不掉心里的梦
//  10 刚满22                                  11 甩开课本离开家       12 发现许多烦恼要面对
(() => {
  // Scene-local seconds below describe the original choreography. Registration at
  // the end maps them to the recording-aligned cuts S while keeping global t for rhythm.
  // ---------- constants & small helpers ----------
  const fr = x => x - Math.floor(x);
  const mod = (a, b) => ((a % b) + b) % b;
  const BAR = 4 * BEAT;
  const bar = k => PROJECT.offset + k * BAR;
  const bPulse = (t, k = 5) => pulse(t, k);
  const REF = [0, ...[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map(bar)];
  // The recording starts on the first sung line; the package's 5.5s intro was an estimate.
  // Keep a brief spring reveal, then fit each complete acted shot to its vocal phrase.
  const S = [0, 1.2, 4.5, 9.82, 14.86, 20.7, 24.96, 30.56, 35.88, 41.48, 46.46, 51.3];

  const MATCH = { x: 1180, y: 330, r: 210 };   // the thought bubble of shot 5 becomes the wall clock of shots 6–7
  const C = {
    blossom: '#F2A7BC', blossomLt: '#F9D6DE', leaf: '#8FC46A', leafDk: '#5E9A52', warm: '#F6C76B', wood: '#7A5A44',
    kite: '#E0524A', dayS: '#BFE3F2', duskS: '#F3B58A', nightS: '#27315A', grey: '#A7ADB3', worry: '#8E83A8',
    greyWall: '#D9DAD7', greyFloor: '#BDBFBC', greyTint: '#9AA0A6',
  };
  const PINK = [C.blossom, C.blossomLt], GREEN = [C.leaf, C.blossomLt], GREY = [C.grey, '#E3E5E6'];

  // acted emotions keyed in shot-local time but evaluated on video time, so they stay locked to the beat
  const E = (t, o, keys) => emotions(t, keys.map(k => [o + k[0], ...k.slice(1)]));
  const merge = (mood, pose) => ({ ...mood, ...pose, dy: (mood.dy || 0) + (pose.dy || 0), sq: (mood.sq || 0) + (pose.sq || 0) });

  const wash = (key, pts, col, o = {}) => { boilSeed(key); paint(pts, { wash: col, ink: null, ...o }); };
  const solid = (key, pts, col, o = {}) => { boilSeed(key); paint(pts, { wash: col, ink: PAL.ink, sw: .9, ...o }); };
  const soft = (key, pts, col, op = 140, o = {}) => { boilSeed(key); paint(pts, { fill: col, fillOp: op, bleed: .15, tex: .5, ink: null, ...o }); };
  const backdrop = (key, col) => wash(key, rectPts(-3000, -1200, W + 6000, H + 2400), col);
  const wipeOut = (lt, dur, cols) => { boilSeed('transition'); if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, cols); };
  const wipeIn = (lt, cols) => { boilSeed('transition'); if (lt < .3) brushWipe(.5 + lt / .6, cols); };

  // ---------- Clawd at 22: the kit's Clawd plus one tuft of hair that the wind plays with ----------
  function tuft(u, sw, wind, t) {
    const s = clamp(wind + .22 * Math.sin(t * 6), -1.4, 1.4), w = Math.max(.5, sw * 1.1);
    inkLine([[-.7 * u, -8 * u], [-.4 * u + s * .3 * u, -9.2 * u], [.2 * u + s * 1.0 * u, -9.7 * u]], w, PAL.ink, 'ink', .7);
    inkLine([[.1 * u, -8 * u], [.5 * u + s * .5 * u, -9.0 * u], [1.2 * u + s * 1.3 * u, -9.0 * u + .3 * u * s]], w, PAL.ink, 'ink', .7);
    inkLine([[.8 * u, -8 * u], [1.0 * u + s * .3 * u, -8.8 * u], [1.6 * u + s * .9 * u, -8.7 * u]], w * .9, PAL.ink, 'ink', .7);
  }
  function hero(x, y, u, o = {}, wind = 0, t = 0) {
    const own = o.draw;
    return clawd(x, y, u, { ...o, emote: ['zzz', '?', '!', '!!', '!?'].includes(o.emote) ? null : o.emote,
      draw: (uu, sw) => {
        tuft(uu, sw, wind, t);
        boilSeed('hero scarf');
        paint(ribbon([[-2.5 * uu, -3.2 * uu], [0, -3 * uu], [2.5 * uu, -3.2 * uu]], .48 * uu, .4 * uu), { wash: '#B2CF92', ink: PAL.ink, sw: sw * .35 });
        paint(ribbon([[2.1 * uu, -3.1 * uu], [(3.5 + wind * 1.4) * uu, (-2.5 - wind) * uu], [(4 + wind * 2) * uu, (-1.6 - wind * 1.8) * uu]], .42 * uu, .2 * uu), { wash: '#B2CF92', ink: PAL.ink, sw: sw * .35 });
        if (own) own(uu, sw);
      } });
  }

  // Exact arm-tip transform from clawd.js. Props hang upright in world space;
  // their handles/strings start at this point through every view and squash.
  function handAt(x, y, u, pose, which) {
    const arms = {
      front: { L: [-4.9, -1], R: [4.9, 1] }, q: { L: [-4.7, -1], R: [5, 1] },
      side: { L: [1.6, 0] }, qback: { L: [4.7, 1], R: [-5, -1] }, back: { L: [4.9, 1], R: [-4.9, -1] },
    };
    const [px, dir] = arms[pose.view || 'front'][which];
    const a = pose[which === 'L' ? 'aL' : 'aR'] ?? .2;
    const ang = dir === 0 ? .7 - a : dir < 0 ? a : -a, tip = (dir || 1) * (dir === 0 ? 2.1 : 2.2);
    const sq = pose.sq || 0, sm = clamp(pose.smear || 0);
    const hx = (px + dir * .55 * clamp((Math.abs(a) - .7) / .9) + Math.cos(ang) * tip) * u * (pose.flip ? -1 : 1) * (pose.sx ?? 1) * (1 + sq * .6) * (1 + sm * .35);
    const hy = (-4.5 + (dir === 0 ? .3 : 0) + Math.sin(ang) * tip) * u * (pose.sy ?? 1) * (1 - sq);
    const rot = pose.rot || 0;
    return [x + (pose.dx || 0) * u + hx * Math.cos(rot) - hy * Math.sin(rot), y + (pose.dy || 0) * u + hx * Math.sin(rot) + hy * Math.cos(rot)];
  }
  function suitcaseAt(key, at, u) {
    boilSeed(key);
    const [x, y] = at;
    inkLine([[x - .4 * u, y + .65 * u], [x - .4 * u, y], [x + .4 * u, y], [x + .4 * u, y + .65 * u]], .8, PAL.ink, 'ink', 0);
    paint(rrPts(x - .9 * u, y + .55 * u, 1.8 * u, 1.4 * u, .2 * u, 0), { wash: '#C9795F', ink: PAL.ink, sw: .9 });
  }
  function carriedKite(key, hand, lift, t, lean = 0) {
    const at = [hand[0] + 40 + 38 * lift, hand[1] - 65 - 375 * lift];
    boilSeed(key + 'string');
    inkLine([hand, [lerp(hand[0], at[0], .5) + 12 * Math.sin(t * 3) * lift, lerp(hand[1], at[1], .5) + 12 * lift], at], .8, PAL.ink, 'inkfine', .5);
    push(); translate(at[0], at[1]); rotate(lean);
    kiteTail(key + 'tail', 0, 0, 1.2, t);
    kite(key, 0, 0, 1.2);
    pop();
    return at;
  }

  // ---------- shared props ----------
  function flower(key, x, y, r, b, rot = 0, col = C.blossomLt) {
    boilSeed(key);
    if (b < .35) { paint(ellPts(x, y, r * .3, r * .45, 10, 0, rot), { wash: mixCol(C.leaf, C.blossom, b * 2.5), ink: PAL.ink, sw: .6 }); return; }
    const k = seg(b, .35, 1);
    for (let i = 0; i < 5; i++) {
      const a = rot + i * TAU / 5;
      paint(ellPts(x + Math.cos(a) * r * .55 * k, y + Math.sin(a) * r * .55 * k, r * .5 * k, r * .36 * k, 10, 0, a), { wash: col, ink: PAL.ink, sw: .5 });
    }
    paint(ellPts(x, y, r * .2 * k, r * .2 * k, 8), { wash: C.warm, ink: null });
  }
  function blossomTree(key, x, y, s) {   // (x, y) = foot of the trunk
    boilSeed(key + 'trunk');
    paint(rrPts(x - 14 * s, y - 280 * s, 28 * s, 280 * s, 6, 1), { wash: C.wood, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 5; i++) {
      boilSeed(key + 'c' + i);
      paint(ellPts(x + (hash(i + x) - .5) * 250 * s, y - 310 * s + (hash(i + 9) - .5) * 110 * s, 120 * s, 88 * s, 20, 4), { fill: i % 2 ? C.blossom : C.blossomLt, fillOp: 170, bleed: .2, tex: .5, ink: null });
    }
  }
  function petals(t, n, o = {}) {
    const { vx = 60, vy = 90, seed = 'p', size = 9 } = o;
    for (let i = 0; i < n; i++) {
      boilSeed(seed + i);
      const px = mod(hash(i) * (W + 300) + t * vx * (.6 + .8 * hash(i + 40)) + Math.sin(t * 1.7 + i) * 30, W + 300) - 150;
      const py = mod(hash(i + 80) * (H + 200) + t * vy * (.6 + .8 * hash(i + 60)), H + 200) - 100;
      const r = size * (.6 + .8 * hash(i + 20));
      paint(ellPts(px, py, r * 1.4, r * .8, 8, 0, t * 2 + i), { wash: i % 3 ? C.blossomLt : C.blossom, ink: null });
    }
  }
  function kite(key, x, y, s, rot = 0) {
    boilSeed(key);
    push(); translate(x, y); rotate(rot);
    paint([[0, -34 * s], [22 * s, 0], [0, 44 * s], [-22 * s, 0]], { wash: C.kite, ink: PAL.ink, sw: Math.max(.4, .8 * s) });
    inkLine([[0, -34 * s], [0, 44 * s]], Math.max(.3, .5 * s), PAL.ink, 'inkfine', 0);
    inkLine([[-22 * s, 0], [22 * s, 0]], Math.max(.3, .5 * s), PAL.ink, 'inkfine', 0);
    pop();
  }
  function kiteTail(key, x, y, s, t) {
    boilSeed(key);
    const P = []; for (let j = 0; j <= 5; j++) P.push([x + Math.sin(t * 4 + j * 1.1) * 14 * s * (j / 5 + .2), y + 44 * s + j * 22 * s]);
    paint(ribbon(P, 3 * s + .5, 1), { wash: C.kite, ink: null });
  }
  function bubble(key, x, y, r, tailFrom) {   // thought bubble with a trail of small circles from the thinker
    if (r < 3) return;
    boilSeed(key + 'tail');
    for (let i = 0; i < 3; i++) {
      const k = (i + 1) / 4.2, rr = 8 + i * 8;
      paint(ellPts(lerp(tailFrom[0], x, k * .75), lerp(tailFrom[1], y + r * .8, k * .75), rr, rr, 14, 0), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
    }
    boilSeed(key);
    paint(ellPts(x, y, r, r, 36, 1.5), { wash: PAL.cream, ink: PAL.ink, sw: 1.4 });
  }

  // =====================================================================================================
  // 1  window (0 – bar 2)   iris opens on the blossom branch → pull back → Clawd asleep → bird → wakes, pushes the window
  // =====================================================================================================
  function shotWindow(t, lt, dur) {
    const o = t - lt;
    camBegin(kf(lt, [[0, 1450], [1.7, 1450], [3.5, 960]], ease), kf(lt, [[0, 360], [1.7, 360], [3.5, 540]], ease), kf(lt, [[0, 1.7], [1.7, 1.7], [3.5, 1]], ease));
    backdrop('sky', '#CDE9EF');
    soft('sky2', ellPts(1500, 140, 700, 260, 30, 8), '#F9E7C9', 120);
    wash('wall', rectPts(-300, 200, W + 600, 1000), '#EADFC8');
    const wx = 660, wy = 330, ww = 600, wh = 420;
    wash('room', rectPts(wx, wy, ww, wh), '#F2D8A8');
    wash('roomfloor', rectPts(wx, wy + wh - 80, ww, 80), '#D9B48A');
    solid('bed', rrPts(700, 640, 520, 110, 18, 1), '#D9826A');
    // Clawd: asleep, wakes to the bird, stretches
    const mood = E(t, o, [[0, 'sleepy'], [4.3, 'surprised'], [4.8, 'happy']]);
    const st = backOut(seg(lt, 4.35, 4.85)), arms = lt > 4.35 ? lerp(.1, 1.45, st) : (mood.aL || 0);
    const pose = lt > 4.35 ? { aL: arms, aR: arms, sq: -.2 * Math.sin(Math.PI * seg(lt, 4.35, 5.0)) } : {};
    hero(960, 660, 14, merge(mood, pose), 0, t);
    solid('blanket', ellPts(960, 668, 270, 46, 28, 2), '#E9A08A');
    // window panes swing open at the end
    const open = easeOut(seg(lt, 5.0, 5.45)), pw = 300 * (1 - open * .92);
    boilSeed('panes');
    paint(rectPts(wx, wy, pw, wh), { wash: '#DFF1F5', washOp: 110, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(wx + ww - pw, wy, pw, wh), { wash: '#DFF1F5', washOp: 110, ink: PAL.ink, sw: 1.2 });
    solid('sill', rectPts(630, 745, 660, 26, 3), '#B98B62');
    boilSeed('frame');
    inkLine([[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh], [wx, wy]], 1.4, PAL.ink, 'ink', 0);
    // the branch and its blossoms (time-lapse)
    boilSeed('branch');
    paint(ribbon([[2150, 240], [1750, 330], [1500, 360], [1330, 440]], 12, 3), { wash: C.wood, ink: PAL.ink, sw: .8 });
    const F = [[1760, 300, .2], [1630, 338, .5], [1510, 352, .8], [1400, 392, 1.1], [1320, 440, 1.4], [1690, 235, 1.0]];
    F.forEach(([fx, fy, ft], i) => flower('fl' + i, fx, fy, 46, easeOut(seg(lt, ft, ft + .9)), i * 1.1));
    // the bird that wakes him
    const bk = easeOut(seg(lt, 2.9, 3.4)), bp = arcPt([2050, 40], [1500, 332], 160, bk);
    const hop = lt > 3.5 ? 10 * Math.abs(Math.sin((lt - 3.5) * 9)) : 0, bx = bp[0], by = bp[1] - hop;
    boilSeed('bird');
    paint(ellPts(bx, by, 26, 20, 14, 0), { wash: '#7FB4D6', ink: PAL.ink, sw: .7 });
    paint(ellPts(bx + 18, by - 14, 12, 11, 12, 0), { wash: '#7FB4D6', ink: PAL.ink, sw: .7 });
    paint([[bx + 28, by - 16], [bx + 44, by - 12], [bx + 28, by - 9]], { wash: PAL.ochre, ink: PAL.ink, sw: .5 });
    paint(ellPts(bx + 21, by - 16, 2.5, 2.5, 6), { wash: PAL.ink, ink: null });
    inkLine([[bx - 7, by + 17], [bx - 7, by + 28], [bx - 1, by + 28]], .6, PAL.ink, 'inkfine', 0);
    inkLine([[bx + 5, by + 17], [bx + 5, by + 28], [bx + 11, by + 28]], .6, PAL.ink, 'inkfine', 0);
    inkLine([[bx - 24, by], [bx - 44, by + 8 + hop * .4]], .8, PAL.ink, 'ink', 0);
    if (lt > 3.5 && lt < 4.7) {   // chirp
      for (let i = 0; i < 3; i++) {
        const k = fr((lt - 3.5) * 2.6 - i * .22), a = (i - 1) * .5;
        if (k < .7) inkLine([[bx + 50 + 20 * k * 3, by - 20 + a * 20 * k * 3], [bx + 58 + 24 * k * 3, by - 14 + a * 26 * k * 3]], .8, PAL.ink, 'inkfine', .3);
      }
    }
    camEnd();
    if (lt < .6) iris(960, 540, lerp(0, 1500, easeIn(lt / .6)));   // iris opens on the branch
    wipeOut(lt, dur, PINK);
  }

  // =====================================================================================================
  // 2  lane (bar 2 – 4)   春天是她最爱的季节: blossom lane, Clawd hops in, spins in the petals, hugs a tree. Whip pan out.
  // =====================================================================================================
  function shotLane(t, lt, dur) {
    const o = t - lt, out = seg(lt, dur - .28, dur), G = 860, u = 26;
    camBegin(kf(lt, [[0, 820], [2.4, 960], [dur, 1050]]) + 1500 * easeIn(out), 540, kf(lt, [[0, 1], [dur, 1.1]]));
    backdrop('sky', '#CDE9F3');
    soft('sun', ellPts(1500, 150, 400, 160, 30, 6), '#FBE9C6', 150);
    soft('h1', ellPts(900, 760, 1300, 260, 40, 3), '#B9DDA0', 150);
    soft('h2', ellPts(1700, 820, 1000, 200, 40, 3), '#A5D18E', 150);
    for (const [tx, s] of [[300, .8], [640, .9], [1000, .8], [1700, 1], [2050, .9]]) blossomTree('tr' + tx, tx, 830, s);
    wash('ground', rectPts(-800, 830, W + 2400, 700), '#9FCB7C');
    soft('path', ellPts(1000, 900, 1500, 70, 36, 3), '#E7D3A8', 160);
    blossomTree('hug', 1330, 900, 1.35);   // the tree he hugs
    // Clawd: walks in, hops and spins in the petals, walks to the tree, hugs it
    const w1 = stroll(lt, 0, 1.6, 250, 640, u), w2 = stroll(lt, 3.1, 4.2, 640, 1215, u);
    const x = lt < 3.1 ? w1.x : w2.x, mood = E(t, o, [[0, 'happy'], [1.6, 'excited'], [3.2, 'happy'], [4.2, 'love']]);
    let pose;
    if (lt < 1.7) pose = { view: 'side', walk: w1.walk, dy: w1.dy };
    else if (lt < 3.0) { const j = jump(lt, 1.7, 3.0, 1.4); pose = { ...spinView(fr(lerp(.25, 1.25, ease(seg(lt, 1.7, 3.0))))), aL: 1.2, aR: 1.0, dy: j.dy, sq: j.sq }; }
    else if (lt < 4.2) pose = { view: 'side', walk: w2.walk, dy: w2.dy };
    else pose = { view: 'side', aL: .7, aR: .15 };
    if (out > 0) pose = { ...pose, smear: .9 * out, smearDir: 1 };
    hero(x, G, u, merge(mood, pose), .25, t);
    petals(t, 22, { vx: 80, vy: 70, seed: 'lp' });
    camEnd();
    wipeIn(lt, PINK);
    if (out > .15) for (let i = 0; i < 7; i++) { boilSeed('streak' + i); inkLine([[-100, 120 + i * 140], [W + 100, 110 + i * 140]], 3, PAL.cream, 'inkfine', .2); }
  }

  // =====================================================================================================
  // 3  wind (bar 4 – 6)   微风吹乱头发: close-up, gusts on the 2-beat, the tuft and petals fly, Clawd laughs into it
  // =====================================================================================================
  function shotWind(t, lt, dur) {
    const o = t - lt, inK = 1 - easeOut(seg(lt, 0, .28));
    const gust = tt => Math.pow(Math.max(0, Math.sin(fr((tt - PROJECT.offset) / (2 * BEAT)) * Math.PI)), 1.5);
    const g = gust(t);
    camBegin(960 - 1500 * inK, 540, kf(lt, [[0, 1], [dur, 1.08]]));
    backdrop('sky', '#CFE8F3');
    soft('b1', ellPts(400, 500, 520, 300, 30, 6), C.blossom, 120);
    soft('b2', ellPts(1600, 380, 560, 280, 30, 6), C.blossomLt, 150);
    soft('b3', ellPts(1000, 160, 700, 160, 30, 6), '#F9E7C9', 130);
    soft('gr', ellPts(960, 1120, 1300, 220, 36, 3), '#A5D18E', 190);
    for (let i = 0; i < 9; i++) {   // wind streaks, always blowing left → right
      boilSeed('ws' + i);
      const y = 120 + hash(i) * 840, x = mod(t * 1500 * (.7 + hash(i + 5)) + hash(i + 9) * W * 2, W * 2.2) - 400;
      inkLine([[x, y], [x + 260, y - 12], [x + 520, y]], .8, PAL.cream, 'inkfine', .5);
    }
    const mood = E(t, o, [[0, 'neutral'], [1.0, 'surprised', { lookX: .8 }], [1.7, 'happy'], [3.3, 'laugh']]);
    hero(960, 1010, 56, merge(mood, { rot: -.04 * g, sq: -.04 * g }), g * 1.1, t);
    petals(t, 28, { vx: 720, vy: 110, seed: 'wp', size: 14 });
    camEnd();
    wipeOut(lt, dur, PINK);
  }

  // =====================================================================================================
  // 4  street (bar 6 – 8)   不在意嘈杂: a busy street; the noise bounces off Clawd, who hums with closed eyes
  // =====================================================================================================
  function shotStreet(t, lt, dur) {
    const o = t - lt, G = 900, u = 22;
    camBegin(960, 540, 1 + .03 * lt / dur);
    backdrop('sky', '#D8ECF4');
    const B = [[-60, 360, 300, '#F2C9B0'], [260, 480, 260, '#E9D8A6'], [540, 300, 300, '#C9DDB8'], [850, 520, 280, '#F4C2C2'], [1150, 380, 320, '#BFD8E8'], [1500, 460, 260, '#EBD3A0'], [1780, 330, 300, '#D8C6E3']];
    B.forEach(([bx, bh, bw, bc], i) => {
      wash('bld' + i, rectPts(bx, 840 - bh, bw, bh), bc, { ink: PAL.ink, sw: .8 });
      for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) wash('win' + i + r + c, rectPts(bx + 40 + c * (bw / 2 - 20), 840 - bh + 40 + r * 90, 60, 50), '#FFF3D6');
    });
    wash('road', rectPts(-200, 840, W + 400, 400), '#B9BEC6');
    wash('curb', rectPts(-200, 836, W + 400, 14), '#8F95A0');
    const P = [[100, 70, '#E8A25E'], [420, -90, '#7FB4D6'], [700, 55, '#B79AD6'], [1000, -75, '#F08A9A'], [1300, 95, '#8FC46A'], [1600, -60, '#F6C76B'], [1850, 80, '#E58F7A']];
    P.forEach(([x0, sp, col], i) => {
      const x = mod(x0 + sp * lt + 200, W + 400) - 200, by = G - 8 * Math.abs(Math.sin(lt * 6 + i * 1.3)), fl = sp > 0 ? 1 : -1;
      boilSeed('pp' + i);
      paint(rrPts(x - 34, by - 118, 68, 118, 16, 1), { wash: col, ink: PAL.ink, sw: .9 });
      paint(ellPts(x + 10 * fl - 8, by - 84, 5, 7, 8), { wash: PAL.ink, ink: null });
      paint(ellPts(x + 10 * fl + 12, by - 84, 5, 7, 8), { wash: PAL.ink, ink: null });
      const amp = 16 + 22 * bPulse(t + i * .21, 4);   // the noise: a jagged scribble above every second head
      if (i % 2 === 0) { boilSeed('nz' + i); const Z = []; for (let j = 0; j < 7; j++) Z.push([x - 40 + j * 13, by - 160 - (j % 2 ? amp : 0)]); inkLine(Z, 1.1, PAL.ink, 'dry', 0); }
    });
    // Clawd walks through with closed eyes and a hum; the noise sparks bounce off him
    const w = stroll(lt, .2, 4.6, 250, 1650, u), mood = E(t, o, [[0, 'happy', { emote: 'music' }]]);
    hero(w.x, G, u, merge(mood, { view: 'side', walk: w.walk, dy: w.dy, eyes: 'closed', mouth: 'smile' }), 0, t);
    const hx = w.x, hy = G - 5 * u, pk = bPulse(t, 7);
    if (pk > .08) for (let i = 0; i < 6; i++) { boilSeed('bn' + i); const a = -Math.PI * .9 + i * .62, r0 = 120 + 30 * (1 - pk), r1 = r0 + 36 * pk; inkLine([[hx + Math.cos(a) * r0, hy + Math.sin(a) * r0], [hx + Math.cos(a) * r1, hy + Math.sin(a) * r1]], 1.2, '#E58F7A', 'inkfine', 0); }
    petals(t, 10, { vx: 40, vy: 60, seed: 'sp', size: 8 });
    camEnd();
    wipeIn(lt, PINK);
    wipeOut(lt, dur, GREEN);
  }

  // =====================================================================================================
  // 5  think (bar 8 – 10)   想着生命中的变化: on a hill; in the thought bubble a seed grows into a flowering tree,
  //                         then the bubble swells into a blank disc: it is the clock of shot 6 (match cut)
  // =====================================================================================================
  function shotThink(t, lt, dur) {
    const o = t - lt, G = 860, u = 26, BC = [MATCH.x, MATCH.y];
    const dr = ease(seg(lt, 0, 4.3));
    camBegin(lerp(1000, 960, dr), 540, lerp(1.08, 1, dr));
    backdrop('sky', '#CFE9F2');
    soft('sun', ellPts(300, 180, 420, 170, 30, 6), '#FBE9C6', 150);
    soft('h1', ellPts(1100, 940, 1300, 300, 40, 3), '#B9DDA0', 170);
    wash('ground', rectPts(-800, 850, W + 1700, 700), '#9FCB7C');
    boilSeed('bench');   // a bench behind him
    paint(rrPts(900, 770, 300, 26, 5, 1), { wash: '#B98B62', ink: PAL.ink, sw: .8 });
    paint(rectPts(920, 796, 18, 62), { wash: '#8A6A58', ink: PAL.ink, sw: .6 });
    paint(rectPts(1160, 796, 18, 62), { wash: '#8A6A58', ink: PAL.ink, sw: .6 });
    const mood = E(t, o, [[0, 'neutral'], [.9, 'thinking'], [3.8, 'hopeful']]);
    hero(1010, G, u, merge(mood, { view: 'q', dy: -.45, noLegs: true }), .1, t);
    // the bubble
    const R = lt > 4.35 ? lerp(150, MATCH.r, ease(seg(lt, 4.35, 4.85))) : 150 * backOut(seg(lt, .4, .9));
    bubble('bub', BC[0], BC[1], R, [1050, 640]);
    const p = seg(lt, 1.0, 4.0), sc = 1 - ease(seg(lt, 4.1, 4.5)), r = 150 * sc;
    if (R > 20 && r > 4 && lt > 1.0) {
      const bx = BC[0], by = BC[1] + r * .55;
      boilSeed('soil'); paint(ellPts(bx, by + 6 * sc, r * .5, r * .12, 14, 1), { wash: '#8A6A58', ink: null });
      if (p < .12) { boilSeed('seed'); paint(ellPts(bx, by - 4 * sc, 9 * sc, 6 * sc, 8, 0), { wash: '#6B4E3A', ink: PAL.ink, sw: .5 }); }
      const sh = r * 1.1 * easeOut(seg(p, .1, .7)), top = by - sh;
      if (sh > 2) {
        boilSeed('stem'); inkLine([[bx, by], [bx + 3, by - sh * .5], [bx - 2, top]], 1.8 * sc + .4, C.leafDk, 'ink', .6);
        const lk = easeOut(seg(p, .2, .6));
        boilSeed('lv');
        paint(ellPts(bx - 22 * sc * lk, top + 10 * sc, 22 * sc * lk, 10 * sc * lk, 12, 0, -.5), { wash: C.leaf, ink: PAL.ink, sw: .5 });
        paint(ellPts(bx + 22 * sc * lk, top + 4 * sc, 22 * sc * lk, 10 * sc * lk, 12, 0, .5), { wash: C.leaf, ink: PAL.ink, sw: .5 });
        const cb = easeOut(seg(p, .55, .95));
        if (cb > 0) for (let i = 0; i < 5; i++) flower('bf' + i, bx + (i - 2) * 30 * sc, top - 20 * sc - 14 * sc * Math.abs(i - 2) + 10 * sc, 22 * sc, cb, i, C.blossom);
      }
    }
    camEnd();
    wipeIn(lt, GREEN);
  }

  // =====================================================================================================
  // office background shared by shots 6 and 7
  // =====================================================================================================
  function office(skyCol, sun, o = {}) {
    backdrop('wall', '#F2E5C5');
    wash('floor', rectPts(-300, 790, W + 600, 400), '#CDB99A');
    const wx = 140, wy = 160, ww = 660, wh = 400;   // window on the left
    wash('winSky', rectPts(wx, wy, ww, wh), skyCol);
    if (sun) sun();
    boilSeed('winFrame');
    inkLine([[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh], [wx, wy]], 1.6, PAL.ink, 'ink', 0);
    inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 1.2, PAL.ink, 'ink', 0);
    inkLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 1.2, PAL.ink, 'ink', 0);
  }
  function clockFace(cx, cy, r, theta, handA, key, ticks = true) {   // theta: the red sector's angle (minutes left until the hour)
    boilSeed(key);
    paint(ellPts(cx, cy, r, r, 40, 1.5), { wash: PAL.cream, ink: PAL.ink, sw: 1.4 });
    if (ticks) for (let i = 0; i < 12; i++) { const a = i * TAU / 12; inkLine([[cx + Math.cos(a) * r * .86, cy + Math.sin(a) * r * .86], [cx + Math.cos(a) * r * .94, cy + Math.sin(a) * r * .94]], 1, PAL.ink, 'ink', 0); }
    if (theta > .03) {
      const pts = [[cx, cy]], a0 = -Math.PI / 2 - theta;
      for (let i = 0; i <= 14; i++) { const a = a0 + theta * i / 14; pts.push([cx + Math.cos(a) * (r - 16), cy + Math.sin(a) * (r - 16)]); }
      boilSeed(key + 'sec'); paint(pts, { wash: C.kite, washOp: 235, ink: null });
    }
    if (ticks) { boilSeed(key + 'hand');
    inkLine([[cx, cy], [cx + Math.cos(handA) * r * .78, cy + Math.sin(handA) * r * .78]], 2, PAL.ink, 'ink', 0);
    inkLine([[cx, cy], [cx + Math.cos(handA * .08) * r * .5, cy + Math.sin(handA * .08) * r * .5]], 2.6, PAL.ink, 'ink', 0);
    paint(ellPts(cx, cy, 8, 8, 8), { wash: PAL.ink, ink: null }); }
  }
  function desk(key) {
    wash(key, rectPts(-200, 760, W + 400, 70), '#B98B62', { ink: PAL.ink, sw: 1 });
    wash(key + 'f', rectPts(-200, 830, W + 400, 300), '#9A7050');
  }
  function sleeper(key, x, t, col) {
    boilSeed(key);
    paint(rrPts(x - 55, 700, 110, 110, 20, 1), { wash: col, ink: PAL.ink, sw: .9 });
    paint(ellPts(x, 712 + 3 * Math.sin(t * 1.6 + x), 46, 22, 16, 1), { wash: '#6B5444', ink: PAL.ink, sw: .8 });
  }

  // =====================================================================================================
  // 6  lunch (bar 10 – 12)   还有15分钟在午休: the clock's red sector is the 15 minutes; he wolfs his lunch, then falls asleep
  // =====================================================================================================
  function shotLunch(t, lt, dur) {
    const o = t - lt, G = 820, u = 24, cl = lt < .9 ? (Math.PI / 2) * backOut(seg(lt, .15, .7)) : (Math.PI / 2) * (1 - .93 * seg(lt, .9, 4.9));
    camBegin(960, 540, 1 + .02 * Math.max(0, lt - .6));
    office('#BFE3F2');
    glow(470, 360, 420, '#FFF0C8', .35);
    clockFace(MATCH.x, MATCH.y, MATCH.r, cl, -Math.PI / 2 - cl, 'clk', lt > .12);
    sleeper('s1', 1100, t, '#7FB4D6'); sleeper('s2', 1500, t + 1.1, '#B79AD6'); sleeper('s3', 1790, t + .5, '#8FC46A');
    const lie = easeOut(seg(lt, 2.9, 3.5)), eat = lt > 1.3 && lt < 2.8;
    const mood = E(t, o, [[0, 'neutral'], [.8, 'surprised'], [1.2, 'excited'], [2.8, 'sleepy']]);
    hero(620, G, u, merge(mood, { dy: 2.0 * lie, mouth: eat ? (fr(t / (BEAT / 2)) < .5 ? 'grin' : 'open') : mood.mouth }), 0, t);
    desk('dk');
    boilSeed('lunchbox');
    paint(rrPts(760, 712, 150, 52, 10, 1), { wash: '#E58F7A', ink: PAL.ink, sw: .9 });
    paint(ellPts(835, 712, 62, 14, 14, 1), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
    const food = 1 - ease(seg(lt, 1.3, 2.8));
    if (food > .02) { boilSeed('lunch food'); paint(ellPts(835, 706, 48 * food, 9 * food, 14, 0), { wash: '#DFAC64', ink: null }); }
    camEnd();
  }

  // =====================================================================================================
  // 7  grind (bar 12 – 14)   从早到晚没那么好过: three days and nights in 5 s; paper piles up, cups pile up, Clawd greys out
  // =====================================================================================================
  function shotGrind(t, lt, dur) {
    const o = t - lt, G = 820, u = 24, p = fr(lt / 1.55);
    const skyAt = q => q < .3 ? C.dayS : q < .45 ? mixCol(C.dayS, C.duskS, seg(q, .3, .45)) : q < .6 ? mixCol(C.duskS, C.nightS, seg(q, .45, .6)) : q < .85 ? C.nightS : mixCol(C.nightS, C.dayS, seg(q, .85, 1));
    camBegin(960, 540, 1);
    office(skyAt(p), () => {
      const wx = 140, ww = 660, wy = 160;
      if (p < .55) { const k = p / .55, sx = lerp(wx + 60, wx + ww - 60, k), sy = wy + 250 - 190 * Math.sin(Math.PI * k); glow(sx, sy, 150, '#FFD66B', .7); wash('sun', ellPts(sx, sy, 34, 34, 20, 0), '#FFD66B'); }
      if (p > .5) { const k = (p - .5) / .5, sx = lerp(wx + 60, wx + ww - 60, k), sy = wy + 250 - 170 * Math.sin(Math.PI * k); wash('moon', ellPts(sx, sy, 28, 28, 20, 0), PAL.cream); }
    });
    clockFace(MATCH.x, MATCH.y, MATCH.r, 0, lt * 11, 'clk');
    const down = seg(lt, .5, 4.4);
    const mood = E(t, o, [[0, 'neutral'], [1.3, 'bored'], [3.0, 'sad']]);
    hero(620, G, u, merge(mood, { dy: 1.2 * down, tint: 'blue', tintK: .7 * down, gloom: .8 * seg(lt, 1, 4.4) }), 0, t);
    desk('dk');
    const n = Math.min(12, 1 + Math.floor(lt * 3.2)), cups = Math.min(7, 1 + Math.floor(lt * 1.5));
    for (let i = 0; i < n; i++) { boilSeed('paper' + i); const fall = easeIn(seg(lt, i / 3.2, i / 3.2 + .28)); paint(rrPts(1010 + (hash(i) - .5) * 14, lerp(-50, 744 - i * 14, fall), 190, 14, 3, 1), { wash: i % 2 ? PAL.cream : '#EFE3C8', ink: PAL.ink, sw: .6 }); }
    for (let i = 0; i < cups; i++) { boilSeed('cup' + i); const k = easeOut(seg(lt, i / 1.5, i / 1.5 + .3)), cx = 760 + i * 40 + 100 * (1 - k), cy = lerp(610, 722, k); paint(rrPts(cx, cy, 28, 38, 6, 1), { wash: '#F6F1E7', ink: PAL.ink, sw: .7 }); paint(rectPts(cx + 3, cy + 4, 22, 8), { wash: '#6B4E3A', ink: null }); }
    camEnd();
    if (lt < .3) flash(Math.max(0, 1 - lt / .3), PAL.cream);   // cut on the chime
    wipeOut(lt, dur, GREY);
  }

  // =====================================================================================================
  // 8  grey room (bar 14 – 16)   安定的日子不一定就是幸福: a tidy colourless room; he paces the same line, then sees spring outside
  // =====================================================================================================
  function shotGreyRoom(t, lt, dur) {
    const o = t - lt, G = 880, u = 24;
    camBegin(960, 540, 1);
    backdrop('wall', C.greyWall);
    wash('floor', rectPts(-300, 800, W + 600, 400), C.greyFloor);
    wash('rug', ellPts(800, 930, 640, 70, 36, 2), '#C2C4C1');
    // the only colour: spring outside the window
    const wx = 1380, wy = 200, ww = 400, wh = 420;
    wash('winSky', rectPts(wx, wy, ww, wh), '#CFE9F2');
    soft('wb1', ellPts(wx + 120, wy + 150, 150, 110, 20, 4), C.blossom, 210);
    soft('wb2', ellPts(wx + 290, wy + 250, 140, 100, 20, 4), C.blossomLt, 220);
    soft('wgr', ellPts(wx + 200, wy + wh, 260, 90, 20, 3), '#9FCB7C', 220);
    boilSeed('winFrame');
    inkLine([[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh], [wx, wy]], 1.6, PAL.ink, 'ink', 0);
    inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 1.2, PAL.ink, 'ink', 0);
    const pull = clamp(seg(lt, 2.4, 3.4));
    if (pull > 0) glow(wx + ww / 2, wy + wh / 2, 460, '#FFD0DC', .55 * pull);
    // sofa, lamp, frames (all grey)
    solid('sofa', rrPts(140, 700, 420, 170, 30, 2), '#A5AAB0'); solid('sofab', rrPts(110, 740, 60, 130, 20, 2), '#9A9FA6');
    boilSeed('lamp'); inkLine([[1250, 880], [1250, 520]], 2, PAL.ink, 'ink', 0); paint(rrPts(1200, 460, 100, 70, 14, 1), { wash: '#CFC9B8', ink: PAL.ink, sw: .9 });
    solid('fr1', rectPts(700, 220, 160, 120, 4), '#E3E5E6'); solid('fr2', rectPts(900, 260, 110, 150, 4), '#E3E5E6');
    // the worn line he keeps pacing
    boilSeed('wear');
    inkLine([[480, 905], [800, 909], [1100, 905]], .8 + lt * .35, '#8E918E', 'dry', .4);
    // Clawd paces right-left-right (3 legs), then stops at the window and looks out
    const legs = [[0, .55, 480, 1100], [.8, 1.35, 1100, 480], [1.6, 2.15, 480, 1100]];
    const leg = lt < .8 ? 0 : lt < 1.6 ? 1 : 2, right = leg % 2 === 0;
    const w = stroll(lt, ...legs[leg], u);
    const x = w.x;
    const mood = E(t, o, [[0, 'neutral'], [1.4, 'bored'], [2.4, 'thinking', { lookX: .9 }], [3.5, 'sad', { lookX: .9 }]]);
    let pose = { view: 'side', flip: !right, walk: w.walk, dy: w.dy };
    if (lt >= .55 && lt < .8) pose = { ...pose, ...turn(lt, .55, .8, .25, -.25) };
    if (lt >= 1.35 && lt < 1.6) pose = { ...pose, ...turn(lt, 1.35, 1.6, -.25, .25) };
    if (lt >= 2.15) pose = { view: 'side' };
    hero(x, G, u, merge(mood, { ...pose, tint: C.greyTint, tintK: .55 }), 0, t);
    const eye = toScreen(x, G - 4 * u);
    camEnd();
    wipeIn(lt, GREY);
    if (lt > dur - .5) iris(eye[0], eye[1], lerp(1500, 0, easeIn(seg(lt, dur - .5, dur - .05))), PAL.ink);   // iris to ink on Clawd
  }

  // =====================================================================================================
  // 9  dream (bar 16 – 18)   忘不掉她在心里做过的梦: night; in his dream a red kite flies over blossoming hills; he wakes with empty hands
  // =====================================================================================================
  function shotDream(t, lt, dur) {
    const o = t - lt, G = 740, u = 18;
    camBegin(960, 540, 1);
    backdrop('wall', '#232B4F');
    wash('floor', rectPts(-300, 800, W + 600, 400), '#1A2040');
    const wx = 1560, wy = 160, ww = 300, wh = 360;   // moonlit window
    wash('winSky', rectPts(wx, wy, ww, wh), '#3A4A86');
    wash('moon', ellPts(wx + 190, wy + 100, 36, 36, 20, 0), PAL.cream);
    glow(wx + 150, wy + 180, 380, '#BFD3FF', .35);
    boilSeed('winFrame'); inkLine([[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh], [wx, wy]], 1.4, '#7F8FC8', 'ink', 0);
    // the wall sketch of the kite
    solid('sketch', rectPts(250, 250, 190, 230, 4), '#E9DCC4');
    boilSeed('sk'); inkLine([[345, 300], [378, 345], [345, 400], [312, 345], [345, 300]], 1.2, C.kite, 'ink', 0); inkLine([[345, 300], [345, 400]], .8, PAL.ink, 'inkfine', 0); inkLine([[345, 400], [335, 430], [355, 450]], .8, C.kite, 'ink', 0);
    // bed and Clawd, asleep → reaching → awake
    solid('bed', rrPts(420, 700, 560, 120, 20, 1), '#5B6FA8');
    const reach = ease(seg(lt, 1.5, 2.4)) * (1 - ease(seg(lt, 3.5, 4.1)));
    const mood = E(t, o, [[0, 'sleepy'], [3.4, 'surprised', { lookX: -.8 }], [4.0, 'sad', { lookX: -.9 }], [4.7, 'hopeful', { lookX: .9 }]]);
    const arm = lt > 1.5 && lt < 4.1 ? { aR: lerp(.1, 1.4, reach) + (lt < 3.4 ? .08 * Math.sin(lt * 7) * reach : 0) } : {};
    hero(700, 720, u, merge(mood, arm), 0, t);
    solid('blanket', ellPts(700, 728, 250, 40, 28, 2), '#7F93CC');
    // the dream
    const BC = [1230, 300], R = lt < 3.4 ? 250 * backOut(seg(lt, .7, 1.3)) : 250 * (1 - easeIn(seg(lt, 3.4, 3.7)));
    if (R > 6) {
      bubble('bub', BC[0], BC[1], R, [760, 600]);
      const k = R / 250;
      soft('dsky', ellPts(BC[0], BC[1] - 20 * k, 210 * k, 170 * k, 28, 4), '#F7DFA8', 230);
      soft('dh1', ellPts(BC[0] - 40 * k, BC[1] + 130 * k, 160 * k, 60 * k, 24, 3), '#A5D18E', 235);
      soft('dh2', ellPts(BC[0] + 70 * k, BC[1] + 140 * k, 130 * k, 52 * k, 24, 3), '#8FC46A', 235);
      for (let i = 0; i < 5; i++) soft('dbl' + i, ellPts(BC[0] - 120 * k + i * 55 * k, BC[1] + 100 * k, 26 * k, 18 * k, 12, 2), C.blossom, 230);
      const kx = BC[0] + 100 * k * Math.sin(lt * 1.3), ky = BC[1] - 50 * k + 45 * k * Math.sin(lt * 2.1);
      boilSeed('dstr'); inkLine([[kx, ky + 44 * k], [kx - 20 * k, ky + 110 * k], [BC[0] - 50 * k, BC[1] + 150 * k]], .9, PAL.ink, 'inkfine', .6);
      kiteTail('dtail', kx, ky, .85 * k, t);
      kite('dkite', kx, ky, .85 * k, .3 * Math.sin(lt * 2.1));
    }
    const eye = toScreen(700, 640);
    camEnd();
    if (lt < .5) iris(eye[0], eye[1], lerp(0, 1500, easeIn(lt / .5)), PAL.ink);   // iris opens on the sleeper
    wipeOut(lt, dur, [C.nightS, C.blossomLt]);
  }

  // =====================================================================================================
  // 10  birthday (bar 18 – 20)   刚满22: moon, a blossom branch, a cake with two candles; wish, blow; smoke becomes a kite
  // =====================================================================================================
  function shotBirthday(t, lt, dur) {
    const o = t - lt, G = 900, u = 28;
    camBegin(960, 540, kf(lt, [[0, 1], [dur, 1.05]]));
    backdrop('wall', '#3B3A5A');
    wash('floor', rectPts(-300, 860, W + 600, 400), '#2B2A45');
    const wx = 1240, wy = 120, ww = 520, wh = 460;
    wash('winSky', rectPts(wx, wy, ww, wh), '#232B4F');
    wash('moonA', ellPts(wx + 360, wy + 130, 54, 54, 24, 0), PAL.cream);
    wash('moonB', ellPts(wx + 388, wy + 118, 50, 50, 24, 0), '#232B4F');   // the crescent
    glow(wx + 340, wy + 130, 300, '#BFD3FF', .3);
    boilSeed('wfr'); inkLine([[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh], [wx, wy]], 1.6, '#8A7F9F', 'ink', 0);
    boilSeed('br'); paint(ribbon([[wx - 140, wy + 400], [wx + 100, wy + 330], [wx + 250, wy + 290], [wx + 420, wy + 300]], 12, 3), { wash: C.wood, ink: PAL.ink, sw: .8 });
    [[wx + 60, wy + 350], [wx + 190, wy + 300], [wx + 330, wy + 290], [wx + 450, wy + 300]].forEach(([fx, fy], i) => flower('bfl' + i, fx, fy, 36, 1, i));
    // flames flicker, then go out
    const f0 = 3.9, lit = lt > 1.2 && lt < f0;
    const flick = Math.sin(lt * 17) * 3;
    if (lit) glow(1100, 700, 520, '#FFB066', .5 + .1 * Math.sin(lt * 13));
    // Clawd
    const mood = E(t, o, [[0, 'neutral'], [1.3, 'hopeful'], [3.1, 'neutral'], [4.6, 'happy']]);
    const wish = lt > 1.4 && lt < 3.1, blow = lt > 3.2 && lt < 4.0;
    hero(640, G, u, merge(mood, { view: 'q', aL: wish ? 1.0 : mood.aL, aR: wish ? 1.0 : mood.aR, eyes: wish ? 'closed' : mood.eyes, mouth: blow ? 'O' : mood.mouth, sq: blow ? .05 : 0 }), 0, t);
    // table, cake, candles
    wash('table', rectPts(300, 800, 1300, 300), '#8A6A58', { ink: PAL.ink, sw: 1 });
    solid('cake', rrPts(1000, 740, 200, 62, 12, 1), '#F7E7D4');
    solid('icing', rrPts(1000, 728, 200, 28, 12, 1), '#F08A9A');
    [[1070, 0], [1130, 1]].forEach(([cx, i]) => {
      solid('cd' + i, rectPts(cx - 5, 690, 10, 40, 1), i ? '#7FB4D6' : '#F6C76B');
      const fk = lt < 1.2 ? 0 : clamp(seg(lt, 1.2, 1.5)) * (lt < f0 + i * .06 ? 1 : 0);
      if (fk > 0) { boilSeed('fl' + i); paint(ellPts(cx + flick * .5 + (blow ? 6 : 0), 674 - 4 * fk, 7 * fk, 14 * fk, 12, 0), { wash: '#FFC857', ink: null }); }
      const sk = seg(lt, f0 + i * .06, f0 + i * .06 + 1.0);   // smoke rises
      if (sk > 0 && sk < 1) { const P = []; for (let j = 0; j < 6; j++) P.push([cx + Math.sin(j * 1.2 + lt * 4) * (8 + j * 3), 680 - j * 34 * sk]); boilSeed('sm' + i); paint(ribbon(P, 4, 1), { wash: '#CFCFE0', washOp: Math.round(200 * (1 - sk)), ink: null }); }
    });
    const kk = seg(lt, 4.2, dur);   // the smoke becomes a kite and flies out the window
    if (kk > 0) { const kp = arcPt([1100, 640], [wx + 320, 230], 200, easeOut(kk)); kiteTail('mt', kp[0], kp[1], .4, t); kite('mk', kp[0], kp[1], .4 + .1 * kk, .3 * Math.sin(lt * 3)); }
    camEnd();
    wipeIn(lt, [C.nightS, C.blossomLt]);
  }

  // =====================================================================================================
  // 11  leave (bar 20 – 22)   刚甩开课本要离开家: books fly up and turn into petals and birds; suitcase and kite; wave to mum; run right
  // =====================================================================================================
  function shotLeave(t, lt, dur) {
    const o = t - lt, G = 860, u = 24, X0 = 640, run = stroll(lt, 4.15, dur, X0, 2300, u);
    camBegin(960, 540, 1);
    backdrop('sky', '#FBE3C4');
    glow(300, 300, 700, '#FFD9A0', .5);
    soft('h1', ellPts(1200, 900, 1500, 260, 40, 3), '#B9DDA0', 170);
    wash('ground', rectPts(-800, 850, W + 1700, 700), '#A5D18E');
    // the house and mum at the door
    wash('wall', rectPts(-300, 220, 780, 680), '#F7E3C8', { ink: PAL.ink, sw: 1 });
    wash('door', rectPts(150, 380, 220, 480), '#F9D9A0', { ink: PAL.ink, sw: 1.2 });
    boilSeed('mum'); paint(rrPts(215, 650, 90, 200, 20, 1), { wash: '#E8A25E', ink: PAL.ink, sw: .9 });
    paint(ellPts(245, 700, 5, 7, 8), { wash: PAL.ink, ink: null }); paint(ellPts(272, 700, 5, 7, 8), { wash: PAL.ink, ink: null });
    boilSeed('mumarm'); inkLine([[300, 740], [350, 690 + 18 * Math.sin(lt * 7)], [372, 640 + 24 * Math.sin(lt * 7 + 1)]], 3, '#E8A25E', 'ink', .5);
    // Clawd: books overhead → throw → suitcase → turns to wave at mum → runs right
    const j = jump(lt, 1.0, 1.7, 1.6), holdArms = lerp(1.25, .25, ease(seg(lt, 1.5, 2.2)));
    const mood = E(t, o, [[0, 'determined'], [1.7, 'laugh'], [2.7, 'happy'], [3.3, 'shy'], [3.95, 'excited']]);
    let pose = { view: 'front', aL: -.35, aR: holdArms, dy: j.dy, sq: j.sq };
    if (lt >= 2.05 && lt < 2.75) {
      const bend = Math.sin(Math.PI * seg(lt, 2.05, 2.75));
      pose = { ...pose, aL: -.35 - 1.15 * bend, dy: .7 * bend, sq: .1 * bend };
    }
    if (lt >= 2.75) pose = { ...pose, aL: -.35, aR: lt < 3.9 ? .55 + .18 * Math.sin((lt - 3) * 9) : .25 };
    if (lt > 2.6 && lt < 4.0) pose = { ...pose, lookX: -.8 };
    if (lt >= 3.9 && lt < 4.15) pose = { ...pose, ...turn(lt, 3.9, 4.15, 0, .125) };
    if (lt >= 4.15) pose = { ...pose, view: 'q', walk: run.walk, dy: run.dy, aL: -.35, aR: .25, smear: .25, smearDir: 1 };
    const x = lt < 4.15 ? X0 : run.x;
    const acted = merge(mood, pose), leftHand = handAt(x, G, u, acted, 'L'), rightHand = handAt(x, G, u, acted, 'R');
    hero(x, G, u, acted, 0, t);
    const pickup = ease(seg(lt, 2.4, 2.75));
    // One suitcase exists throughout: the left hand reaches its handle at 2.4s,
    // then it follows the same hand instead of disappearing/reappearing.
    const reachMood = E(o + 2.4, o, [[0, 'determined'], [1.7, 'laugh'], [2.7, 'happy'], [3.3, 'shy'], [3.95, 'excited']]);
    const bendAt = Math.sin(Math.PI * seg(2.4, 2.05, 2.75));
    const groundHand = handAt(X0, G, u, merge(reachMood, { view: 'front', aL: -.35 - 1.15 * bendAt, aR: .25, dy: .7 * bendAt, sq: .1 * bendAt }), 'L');
    suitcaseAt('suitcase', [lerp(groundHand[0], leftHand[0], pickup), lerp(groundHand[1], leftHand[1], pickup)], u);
    const kitePickup = ease(seg(lt, 2.75, 3.05));
    const groundKite = [900, G - 90];
    // The kite is visible beside the house before being carried out.
    carriedKite('leave kite', [lerp(groundKite[0], rightHand[0], kitePickup), lerp(groundKite[1], rightHand[1], kitePickup)], 0, t, .08 * Math.sin(t * 3));
    // the books
    const colsB = ['#E0524A', '#4C7DB8', '#F0B84A', '#7CB06A', '#8E6BB0', '#D9826A'];
    for (let i = 0; i < 6; i++) {
      const tT = 1.15 + .06 * i, k = seg(lt, tT, tT + 1.4);
      const releaseJump = jump(tT, 1.0, 1.7, 1.6);
      const releaseMood = E(o + tT, o, [[0, 'determined'], [1.7, 'laugh']]);
      const releaseHand = handAt(X0, G, u, merge(releaseMood, { view: 'front', aL: -.35, aR: 1.25, dy: releaseJump.dy, sq: releaseJump.sq }), 'R');
      const base = lt < tT ? [rightHand[0], rightHand[1] - i * 15] : [releaseHand[0], releaseHand[1] - i * 15];
      const tx = X0 + (i - 2.5) * 170 + 260, ty = 130 + hash(i) * 170;
      boilSeed('bk' + i);
      if (lt < tT) { paint(rrPts(base[0] - 46, base[1] - 7, 92, 14, 3, 0), { wash: colsB[i], ink: PAL.ink, sw: .7 }); continue; }
      if (k >= 1) continue;
      const pp = arcPt(base, [tx, ty], 220, easeOut(k));
      if (k < .62) { push(); translate(pp[0], pp[1]); rotate(k * 9 * (i % 2 ? 1 : -1)); paint(rrPts(-34, -22, 68, 44, 4, 0), { wash: colsB[i], ink: PAL.ink, sw: .8 }); inkLine([[-26, -22], [-26, 22]], .8, PAL.ink, 'inkfine', 0); pop(); }
      else if (i % 2 === 0) paint(ellPts(pp[0], pp[1] + 40 * (k - .62), 16, 9, 8, 0, k * 12), { wash: C.blossomLt, ink: PAL.ink, sw: .5 });
      else { const fl = Math.sin(k * 40) * 9; boilSeed('bd' + i); inkLine([[pp[0] - 22, pp[1] + fl], [pp[0], pp[1] - 6], [pp[0] + 22, pp[1] + fl]], 2.2, PAL.ink, 'ink', .8); }
    }
    petals(t, 8, { vx: 50, vy: 40, seed: 'lv', size: 9 });
    camEnd();
    if (lt < .3) flash(Math.max(0, 1 - lt / .3), '#FFF1CC');   // smash cut on the downbeat
  }

  // =====================================================================================================
  // 12  worries (bar 22 – end)   却发现许多烦恼要面对: clouds of worry rise over the horizon; he gulps, grips the kite string, stands firm; wind lifts the kite
  // =====================================================================================================
  function shotWorries(t, lt, dur) {
    const o = t - lt, G = 880, u = 24, wlk = stroll(lt, 0, 1.4, -200, 820, u), wind = clamp(seg(lt, 4.2, 4.8));
    camBegin(960, 540, 1);
    backdrop('sky', mixCol('#B7B3C9', '#F6D9B0', wind * .6));
    soft('h1', ellPts(1100, 600, 1500, 120, 40, 3), '#A9C58A', 200);
    wash('ground', rectPts(-800, 560, W + 1700, 700), '#A9D58A');
    boilSeed('road'); paint([[900, 560], [1020, 560], [1500, 1100], [420, 1100]], { wash: '#D9C29B', ink: null });
    // the worries
    for (let i = 0; i < 8; i++) {
      const rise = easeOut(seg(lt, 1.2 + .1 * i, 2.6 + .1 * i)), cx = 1250 + hash(i) * 600 - 30 * lt - i * 12, cy = 380 + hash(i + 7) * 170 + 420 * (1 - rise), s = .8 + .5 * hash(i + 3);
      if (rise <= 0) continue;
      boilSeed('wc' + i);
      paint(ellPts(cx, cy, 90 * s, 54 * s, 20, 3), { wash: C.worry, ink: PAL.ink, sw: .8 });
      paint(ellPts(cx - 60 * s, cy + 10 * s, 52 * s, 38 * s, 16, 3), { wash: C.worry, ink: PAL.ink, sw: .8 });
      paint(ellPts(cx + 62 * s, cy + 14 * s, 56 * s, 36 * s, 16, 3), { wash: C.worry, ink: PAL.ink, sw: .8 });
      if (i < 4) { boilSeed('we' + i); inkLine([[cx - 28 * s, cy - 6 * s], [cx - 12 * s, cy - 2 * s]], 1.4, PAL.ink, 'ink', 0); inkLine([[cx + 12 * s, cy - 2 * s], [cx + 28 * s, cy - 6 * s]], 1.4, PAL.ink, 'ink', 0); paint(ellPts(cx - 20 * s, cy + 6 * s, 3, 3, 6), { wash: PAL.ink, ink: null }); paint(ellPts(cx + 20 * s, cy + 6 * s, 3, 3, 6), { wash: PAL.ink, ink: null }); }
    }
    if (wind > 0) glow(980, 300, 420, '#FFE2A8', .5 * wind);
    // Clawd: runs in, sees them, gulps, grips, stands firm
    const x = (lt < 1.4 ? wlk.x : 820) - 35 * Math.sin(Math.PI * seg(lt, 2.1, 3.3));
    const grip = ease(seg(lt, 3.3, 3.8)), lift = ease(seg(lt, 3.8, 4.85));
    const mood = E(t, o, [[0, 'excited'], [1.3, 'surprised'], [2.0, 'nervous'], [3.3, 'determined'], [4.3, 'hopeful']]);
    let pose = { view: 'q', aL: -.35, aR: .25 };
    if (lt < 1.4) pose = { ...pose, walk: wlk.walk, dy: wlk.dy };
    else if (lt < 1.65) pose = { ...pose, ...turn(lt, 1.4, 1.65, .125, 0) };
    else pose = { ...pose, view: 'front' };
    if (lt > 1.9 && lt < 3.3) pose = { ...pose, lookX: .8, lookY: .3, sq: .04 * Math.sin(lt * 8) };   // nervous
    if (lt >= 3.3) pose = { ...pose, aR: lerp(.25, 1.1, grip), sq: .1 * Math.sin(Math.PI * seg(lt, 3.3, 3.8)) };
    const acted = merge(mood, pose);
    hero(x, G, u, acted, wind * 1.3, t);
    suitcaseAt('suitcase', handAt(x, G, u, acted, 'L'), u);
    const kiteAt = carriedKite('final kite', handAt(x, G, u, acted, 'R'), lift, t, .08 * Math.sin(t * 3));
    const eye = toScreen(...kiteAt);
    camEnd();
    // Close before the last sampled 24fps frame, and hold ink for the final beat's tail.
    if (lt > 4.9) iris(eye[0], eye[1], lt < 5.15 ? lerp(1500, 260, ease(seg(lt, 4.9, 5.15))) : lerp(260, 0, easeIn(seg(lt, 5.15, dur - .12))), PAL.ink);
  }

  shots(S.map((s, i) => {
    const fn = [shotWindow, shotLane, shotWind, shotStreet, shotThink, shotLunch, shotGrind, shotGreyRoom, shotDream, shotBirthday, shotLeave, shotWorries][i];
    const refDur = (REF[i + 1] ?? PROJECT.duration) - REF[i];
    return [s, (t, lt, dur) => fn(t, lt / dur * refDur, refDur)];
  }));
})();
