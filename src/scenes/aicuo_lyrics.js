// aicuo_lyrics.js: the lyrics of 《爱错》, hand-lettered INTO the film (no subtitle line anywhere).
// Every phrase is split into words that belong to the scene: they are blown in by the wind, fall like leaves, rain out of
// the little cloud, tumble off the cliff, wear snow caps, run away on tiny legs... Each character appears on the beat it is
// sung (times measured from the song). Lettering is composited over the painted layer, so wipes/irises can't cover it:
// HIDE lists the moments the picture is covered, and the words fade out of them.
(() => {
  const INK = '#2B2430', CREAM = '#FFF6E2', FONT = '"MaShanZheng", KaiTi, STKaiti, serif';
  const gy = x => HILL_Y + 8 * Math.sin(x * .006), FEET = x => gy(x) + 12;
  const CAMN = { cx: 820, cy: 700, zoom: 1.4, rot: 0 }, HT = { cx: 1000, cy: 760, zoom: 1.9, rot: 0 }, CLIFF = { cx: 1380, cy: 820, zoom: 1.4, rot: 0 }, YD = { cx: 900, cy: 760, zoom: 1.4, rot: 0 };
  const sc = (cam, x, y) => toScreen(x, y, cam);

  // ---- the lyrics (one place to fix a wrong character) ----
  const LY = {
    s1a: ['北风', [1.08, 1.32]], s1b: ['毫不留情', [2.10, 2.34, 2.82, 3.06]],
    s2: ['把叶子吹落', [5.04, 5.70, 5.88, 6.20, 6.38]],
    s3a: ['脆弱的她', [7.74, 7.98, 8.40, 8.76]], s3b: ['选择了', [9.30, 9.60, 10.40]], s4: ['逃脱', [11.04, 11.34]],
    s5a: ['叶子', [14.34, 14.58]], s5: ['失去消息', [15.06, 15.30, 15.90, 16.20]],
    s6w: ['风', [17.16]], s6a: ['才感觉', [17.58, 18.24, 18.66]], s6b: ['寂寞', [19.38, 19.56]],
    s8a: ['整个冬天', [23.22, 23.58, 24.18, 24.42]], s9a: ['北风的痛', [26.52, 26.94, 27.36, 27.72]], s9b: ['没人能说', [28.38, 28.56, 29.04, 29.46]],
    s11a: ['我从来', [32.58, 33.24, 33.48]], s11b: ['没想过', [33.90, 34.20, 35.10]],
    s12a: ['我会这样', [36.24, 36.66, 37.14, 37.50]], s12b: ['做', [38.40]],
    s13a: ['从来没爱过', [39.84, 40.08, 40.44, 41.04, 41.70]], s14a: ['所以爱', [42.90, 43.32, 43.68]], s14b: ['错', [44.16]],
    s15: ['我从哪里起飞', [46.62, 46.75, 46.90, 47.04, 47.82, 48.30]], s16: ['从哪里降落', [49.50, 49.98, 50.34, 51.06, 51.42]],
    s17a: ['多少', [52.86, 53.16]], s17b: ['不能原谅', [53.82, 54.12, 54.66, 54.84]], s17c: ['的错', [55.26, 55.56]],
    s18a: ['却不能', [56.10, 56.52, 57.00]], s18b: ['重来过', [57.48, 58.70, 59.40]],
  };

  // ---- the picture is covered (wipes, irises, flashes): the lettering fades out of these windows ----
  const HIDE = [[6.5, 7.1], [9.85, 10.35], [11.75, 12.5], [16.3, 17.0], [19.62, 20.35], [22.9, 23.5], [29.5, 30.0], [39.35, 39.95], [45.9, 46.6], [62.2, 63.3]];
  const vis = t => { let a = 1; for (const [s, e] of HIDE) a = Math.min(a, 1 - ease(seg(t, s, s + .08)) * (1 - ease(seg(t, e - .08, e)))); return a; };

  // one painted character. o: rot, a (alpha), age (pop-in clock, s), sx/sy, col2 (darker foot), edge, cap (snow), k (boil id), shake, legs (run phase), glow
  function ch(c, x, y, size, col, o = {}) {
    const a = (o.a ?? 1) * vis(T); if (a <= .01 || size < 6) return;
    letter(c, x, y, size, col, { fn: drawCh, screen: true, alpha: a, rot: o.rot || 0, pop: o.age != null ? o.age * 5 : undefined, edge: o.edge || INK, col2: o.col2, sx: o.sx ?? 1, sy: o.sy ?? 1, cap: o.cap || 0, k: o.k || 0, shake: o.shake || 0, legs: o.legs, halo: o.halo, ew: o.ew });
  }
  function drawCh(c, L) {
    const s = L.size, j = BOILN * 5 + L.k * 11 + 3;
    c.translate((hash(j) - .5) * s * .035 + (L.shake ? (hash(j + 3) - .5) * L.shake : 0), (hash(j + 1) - .5) * s * .035 + (L.shake ? (hash(j + 4) - .5) * L.shake : 0));
    c.rotate((hash(j + 2) - .5) * .05); c.scale(L.sx, L.sy);
    c.font = `${s}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineCap = 'round';
    if (L.halo) { const g = c.createRadialGradient(0, 0, 0, 0, 0, s * .9); g.addColorStop(0, L.halo + 'AA'); g.addColorStop(1, L.halo + '00'); c.fillStyle = g; c.fillRect(-s, -s, 2 * s, 2 * s); }
    if (L.legs != null) {   // tiny running legs
      c.strokeStyle = L.edge; c.lineWidth = s * .07;
      for (const d of [-1, 1]) { const sw = Math.sin(L.legs + (d > 0 ? Math.PI : 0)); c.beginPath(); c.moveTo(d * s * .16, s * .38); c.lineTo(d * s * .16 + sw * s * .26, s * .66 - Math.max(0, -sw) * s * .12); c.lineTo(d * s * .16 + sw * s * .34 + s * .1, s * .68 - Math.max(0, -sw) * s * .12); c.stroke(); }
    }
    c.fillStyle = 'rgba(30,20,40,.2)'; c.fillText(L.txt, s * .045, s * .065);
    c.lineWidth = s * (L.ew ?? .14); c.strokeStyle = L.edge; c.strokeText(L.txt, 0, 0);
    const g = c.createLinearGradient(0, -s * .5, 0, s * .5); g.addColorStop(0, L.color); g.addColorStop(1, L.col2 || L.color);
    c.fillStyle = g; c.fillText(L.txt, 0, 0);
    const a0 = c.globalAlpha; c.globalAlpha = a0 * .2; c.fillStyle = '#fff'; c.fillText(L.txt, -s * .014, -s * .024); c.globalAlpha = a0;
    if (L.cap > 0.01) {   // a cap of snow on the top stroke
      const k = L.cap; c.fillStyle = '#F8FBFF'; c.strokeStyle = INK; c.lineWidth = s * .018;
      c.beginPath(); c.moveTo(-s * .4 * k, -s * .4); c.quadraticCurveTo(-s * .2, -s * (.4 + .2 * k), 0, -s * (.42 + .13 * k)); c.quadraticCurveTo(s * .22, -s * (.4 + .22 * k), s * .4 * k, -s * .4);
      c.quadraticCurveTo(s * .1, -s * (.4 - .05 * k), -s * .4 * k, -s * .4); c.fill(); c.stroke();
    }
  }
  const age = (t, t0) => t - t0;
  const each = (id, t, f) => { const [txt, on] = LY[id]; for (let i = 0; i < txt.length; i++) { const a = t - on[i]; if (a >= 0) f(txt[i], i, a, on[i]); } };
  const WIND = '#5A86BF', WIND2 = '#34578F', WINDE = '#1F3354';
  const LEAFC = ['#E08A2E', '#C0482C', '#E8AE3E', '#A8402A', '#D26A2C'], LEAFE = '#4A2418';

  // ================= S1: 北风 is blown in by the wind; 毫不留情 slaps across and is blown off =================
  function s1(t) {
    if (t > 3.6) return;
    each('s1a', t, (c, i, a) => {
      const inP = easeOut(seg(a, 0, .45)), out = easeIn(seg(t, 2.85, 3.45));
      ch(c, 560 + i * 235 - 140 * (1 - inP) + out * 1500 + Math.sin(a * 3 + i) * 12, 235 + i * 44 + Math.sin(a * 5 + i * 2) * 10 - out * 40, 230, WIND, { col2: WIND2, edge: WINDE, rot: -.1 + .07 * Math.sin(a * 4 + i) + out * .9, k: i, age: a, a: 1 - seg(t, 3.25, 3.5) });
    });
    each('s1b', t, (c, i, a) => {
      const out = easeIn(seg(t, 3.15, 3.5));
      ch(c, 1010 + i * 200 + out * 1300, 405 + (i % 2) * 30 + Math.sin(a * 9 + i) * 3 * (1 - seg(a, 0, .5)) - out * 70, 150, '#3E2B22', { col2: '#6B3F2A', edge: CREAM, ew: .06, rot: -.06 + .04 * i + out * .6, k: 4 + i, age: a, a: 1 - seg(t, 3.3, 3.5) });
    });
  }

  // ================= S2: 把叶子坠落 falls like leaves (and rides the downward whip) =================
  function s2(t) {
    if (t < 5 || t > 6.9) return;
    const X = [330, 720, 930, 1230, 1500], Y0 = [-90, -140, -110, -60, -100];
    each('s2', t, (c, i, a) => {
      const y = Y0[i] + a * (i < 3 ? 330 + 120 * a : 520 + 900 * a), x = X[i] + 70 * Math.sin(a * 4.2 + i * 1.7) + 40 * a;
      ch(c, x, y, 165, LEAFC[i % 5], { col2: '#8A3A1E', edge: LEAFE, rot: .6 * Math.sin(a * 4.2 + i * 1.7 + 1.2), sy: .78 + .22 * Math.abs(Math.cos(a * 5 + i)), k: 8 + i, age: a < .2 ? a : null });
    });
  }

  // ================= S3: 最脆弱的他 trembles; 选择了 jumps to the front; S4: 逃脱 runs away on tiny legs =================
  function s3(t) {
    if (t < 7.2 || t > 10.4) return;
    each('s3a', t, (c, i, a) => {
      const shrink = seg(t, 9.35, 9.8), x = 420 + i * 230, y = 215 + 30 * Math.sin(i * 1.3);
      ch(c, x, y, 150 * (1 - .25 * shrink), '#F0EAFF', { col2: '#B5ACDA', edge: INK, ew: .12, rot: -.05 + .04 * i, shake: 9 + 4 * (i === 3 ? 1 : 0), k: 14 + i, age: a < .2 ? a : null, a: 1 - seg(t, 9.55, 9.85) });
    });
    each('s3b', t, (c, i, a) => {
      if (i < 2) ch(c, 560 + i * 330, 520 + i * 40, 235, '#F4EEDC', { col2: '#D8CDB6', edge: INK, rot: -.12 + .18 * i, k: 20 + i, age: a, shake: 4 });
      else ch(c, 1330, 300, 200, '#F4EEDC', { col2: '#D8CDB6', edge: INK, rot: .1, k: 22, age: a });
    });
  }
  function s4(t) {
    if (t < 11 || t > 12) return;
    each('s4', t, (c, i, a) => { const x = 2100 - a * 2250, y = 960 - 24 * Math.abs(Math.sin(a * 20 + i)); ch(c, x, y, 150, '#F6EEDC', { col2: '#DDCFB2', edge: INK, rot: -.12, k: 26 + i, legs: a * 26 + i, a: 1 }); });
  }

  // ================= S5: 叶子 drops onto the pile; 失去消息 drifts out of the open mailbox with the moth =================
  function s5(t) {
    if (t < 14.3 || t > 16.5) return;
    const LX = [800, 1450];
    each('s5a', t, (c, i, a) => {
      const f = seg(a, 0, .9), y = lerp(-100, 770, easeIn(f)), settle = f >= 1 ? 1 : 0;
      ch(c, LX[i] + 40 * Math.sin(a * 5 + i) * (1 - f), y, 150, LEAFC[i * 2], { col2: '#8A3A1E', edge: LEAFE, rot: (i ? .35 : -.3) + .5 * Math.sin(a * 6) * (1 - f), sy: .8 + .2 * Math.abs(Math.cos(a * 5)) * (1 - settle), k: 28 + i, age: a < .2 ? a : null, a: 1 - seg(t, 15.8, 16.2) });
    });
    const m = sc(CAMN, 828, 755), TG = [[1260, 330], [1450, 230], [1620, 360], [1780, 250]];
    each('s5', t, (c, i, a) => {
      const f = easeOut(seg(a, 0, 1.1)), x = lerp(m[0], TG[i][0], f) + 16 * Math.sin(a * 3 + i), y = lerp(m[1], TG[i][1], f) + 12 * Math.sin(a * 4.1 + i * 2) + 18 * a;
      ch(c, x, y, 95 + 60 * f, '#EEEAF8', { col2: '#B4ADD2', edge: '#2E2A48', ew: .13, rot: .35 * Math.sin(a * 2 + i) - .1, k: 30 + i, age: a < .2 ? a : null, a: 1 - seg(t, 16.2, 16.4) });
    });
  }

  // ================= S6: 风 blows through; 才感觉 rises as steam from the tea; 寂寞 rains out of the little cloud =================
  function s6(t) {
    if (t < 17.1 || t > 19.7) return;
    each('s6w', t, (c, i, a) => { const f = seg(a, 0, .9); ch(c, lerp(-200, 2150, easeIn(f * .5 + f * .5)), 330 + 40 * Math.sin(a * 6), 230, WIND, { col2: WIND2, edge: WINDE, rot: .2 * Math.sin(a * 8), k: 42, age: a < .15 ? a : null, a: 1 - seg(f, .8, 1) }); });
    const cup = sc(HT, 1028, 820);
    each('s6a', t, (c, i, a) => {
      const f = seg(a, 0, 1.5), x = 850 + i * 34 + 22 * Math.sin(a * 3.4 + i * 2), y = 520 - f * 330;
      ch(c, x, y, 118, '#FBFAFF', { col2: '#CFCBE6', edge: '#2E2A48', ew: .13, rot: .15 * Math.sin(a * 3 + i), k: 40 + i, age: a < .2 ? a : null, a: (1 - ease(seg(f, .55, 1))) * ease(seg(a, 0, .12)) });
    });
    const cl = sc(HT, 1110, 600);
    each('s6b', t, (c, i, a) => {
      const f = a / .5, x = cl[0] + 190 + i * 100, y = lerp(cl[1] + 80, 960, easeIn(f)), sq = f > 1 ? 0 : 1;
      if (f < 1.0) ch(c, x, y, 130, '#8EA3CF', { col2: '#566A9C', edge: '#232C48', rot: .12 * (i ? 1 : -1), sy: 1.12, k: 44 + i, age: a < .15 ? a : null });
    });
  }

  // ================= S8–S9 snow: 整个冬天 falls and gets buried; 被风吹的痛 is blown in and knocks off the snowman's head; 没人能说 hangs unsaid =================
  function s8(t) {
    if (t < 23.4 || t > 26.6) return;
    const X = [380, 560, 1640, 1800];
    each('s8a', t, (c, i, a) => {
      const f = easeOut(seg(a, 0, 1.2)), ground = 770 + 8 * Math.sin(i * 2), y = lerp(-120, ground, f * f * (3 - 2 * f)) + 6 * Math.sin(a * 6) * (1 - f), cap = ease(seg(a, 1, 2.6));
      ch(c, X[i] + 26 * Math.sin(a * 2.5 + i) * (1 - f), y, 150, '#EAF1FA', { col2: '#B7C7E0', edge: '#2E3F63', rot: (i % 2 ? .12 : -.1) + .3 * Math.sin(a * 3 + i) * (1 - f), cap, k: 50 + i, age: a < .2 ? a : null, a: 1 - seg(t, 25.9, 26.5) });
    });
  }
  function s9(t) {
    if (t < 26.4 || t > 29.6) return;
    const head = sc(CAMN, 1090, 756);
    each('s9a', t, (c, i, a) => {
      if (i < 3) { const f = seg(a, 0, .8), x = lerp(-200, 2150, f * (.55 + .45 * f)), y = 330 + i * 38 + 40 * Math.sin(a * 6 + i); ch(c, x, y, 130, WIND, { col2: WIND2, edge: WINDE, rot: .3 * Math.sin(a * 7 + i), k: 56 + i, a: 1 }); }
      else if (t < 28.5) {   // 痛 dives onto the snowman's head
        const f = seg(t, 27.55, 27.85), x = lerp(800, head[0], easeIn(f)), y = lerp(260, head[1] - 20, easeIn(f)), hit = t >= 27.85, b = hit ? seg(t, 27.85, 28.45) : 0;
        ch(c, x + b * 700, y - 260 * Math.sin(b * Math.PI) * .5 + b * b * 700, 215 * (hit ? 1 - .35 * b : 1), '#9FB6E0', { col2: '#566EA8', edge: '#1F2D4E', rot: f * 6 + b * 9, k: 60, age: a < .15 ? a : null, a: 1 - seg(b, .7, 1) });
      }
    });
    each('s9b', t, (c, i, a) => {
      const x = 1090 + i * 150 + 14 * Math.sin(a * 2 + i), y = 360 + 38 * Math.sin(i * 1.7) + 26 * a, cap = ease(seg(a, .3, 1.4));
      ch(c, x, y, 118, '#E7F0FB', { col2: '#A9BAD6', edge: '#2E3F63', rot: .1 * Math.sin(i * 2 + a * 2), cap, k: 64 + i, age: a < .2 ? a : null, shake: 3 });
    });
  }

  // ================= S10–S11: 我从来 hangs in the sky; 没想过 tumbles off the cliff after the pebble =================
  function s11(t) {
    if (t < 32.5 || t > 36.5) return;
    each('s11a', t, (c, i, a) => ch(c, 330 + i * 190 + 6 * Math.sin(a * 2 + i), 230 + 30 * Math.sin(i * 2.1) + 6 * Math.sin(a * 3), 175, '#FFF8EA', { col2: '#E3CCD0', edge: '#3A2442', ew: .12, rot: -.06 + .05 * i, k: 70 + i, age: a < .2 ? a : null, a: 1 - seg(t, 35.9, 36.3) }));
    each('s11b', t, (c, i, a) => {
      const far = i === 2 ? 1.4 : 1, f = seg(a, 0, 1.9 * far), x = 1310 + i * 125 + 70 * f, y = lerp(430, 1500, easeIn(f)), k = lerp(1, .38, easeIn(f));
      ch(c, x, y, 165 * k, '#F2E6D0', { col2: '#C9B79A', edge: INK, rot: .5 * a * (i % 2 ? 1 : -1), k: 74 + i, age: a < .2 ? a : null, a: 1 - seg(f, .75, 1) });
    });
  }

  // ================= S12: the jump: 我会这样 streams upward past him as he falls; 做 blooms gold =================
  function s12(t) {
    if (t < 36.2 || t > 39.5) return;
    const X = [330, 520, 1500, 1690];
    each('s12a', t, (c, i, a) => {
      const sp = 1 - ease(seg(a, 0, 1.6)), y = 1000 - (a * 140 + 620 * a * sp * .9), x = X[i] + 20 * Math.sin(a * 5 + i);
      ch(c, x, y, 150, '#FFF0C6', { col2: '#F2B94E', edge: '#7A3E1D', rot: -.1 + .07 * i, k: 80 + i, age: a < .2 ? a : null, a: 1 - seg(y, 220, 90) });
    });
    each('s12b', t, (c, i, a) => ch(c, 760, 330 - 20 * easeOut(seg(a, 0, 1)), 330 * (1 + .06 * Math.sin(a * 9)), '#FFD861', { col2: '#F29B3A', edge: '#7A3E1D', rot: -.08, k: 90, age: a, halo: '#FFE9A8', a: 1 - seg(t, 39.1, 39.4) }));
  }

  // ================= S13: 从来没爱过 drifts by with the clouds; 爱 blushes pink =================
  function s13(t) {
    if (t < 39.8 || t > 43.2) return;
    const P = [[1110, 400], [1320, 350], [1530, 410], [1360, 660], [1620, 650]], SZ = [150, 140, 150, 235, 150];
    each('s13a', t, (c, i, a) => {
      const pink = i === 3, x = P[i][0] - 55 * a, y = P[i][1] + 14 * Math.sin(a * 2 + i);
      ch(c, x, y, SZ[i] * (pink ? 1 + .08 * Math.sin(a * 8) : 1), pink ? '#FF8FB0' : '#FFF4DE', { col2: pink ? '#E04F7C' : '#F2D2C6', edge: pink ? '#7A1F44' : '#4E3068', ew: .13, rot: -.08 + .05 * Math.sin(a * 2 + i), k: 100 + i, age: a < .2 ? a : null, halo: pink ? '#FFB6CC' : null, a: 1 - seg(t, 42.45, 42.85) });
    });
  }

  // ================= S14: 所以爱 whirls round him in the gale; 错 slams down, huge, and topples over =================
  function s14(t) {
    if (t < 42.8 || t > 46) return;
    each('s14a', t, (c, i, a) => {
      const ang = t * 3.4 + i * 2.1, r = 470 - 30 * i, x = 960 + r * Math.cos(ang) * 1.2, y = 500 + r * Math.sin(ang) * .6, out = easeIn(seg(a, 1.5, 2.2));
      ch(c, x + out * 700 * (i - 1), y - out * 300, 185 - 10 * i, i === 2 ? '#FF9DB7' : '#F4F0FF', { col2: i === 2 ? '#E05A82' : '#B3A9DC', edge: '#2E2455', ew: .13, rot: .3 * Math.sin(ang), k: 110 + i, age: a < .2 ? a : null, a: 1 - out });
    });
    each('s14b', t, (c, i, a) => {
      const slam = easeOut(seg(a, 0, .22)), tip = ease(seg(a, 1.0, 1.7)), fall = easeIn(seg(a, 1.7, 2.0));
      ch(c, 560 + 40 * tip, lerp(-250, 640, slam) + 380 * fall, 450 + 40 * Math.sin(a * 22) * (1 - seg(a, 0, .5)), '#E8394C', { col2: '#A8182E', edge: '#3A0B16', rot: .02 + 1.45 * tip * (1 + .12 * fall), k: 120, age: a < .1 ? a : null, a: 1 - seg(t, 45.75, 46.0), shake: a < .3 ? 14 : 0 });
    });
  }

  // ================= S15: 从哪里起飞 stays up in the sky as he falls away from it =================
  function s15(t) {
    if (t < 46.6 || t > 49.6) return;
    const P = [[170, 330], [335, 400], [500, 330], [665, 400], [330, 650], [560, 700]];
    each('s15', t, (c, i, a) => {
      const up = a * (240 + 150 * (i > 3 ? 1 : 0)), x = P[i][0] + 20 * Math.sin(a * 2 + i), y = P[i][1] - up + 10 * Math.sin(a * 3 + i);
      ch(c, x, y, i > 3 ? 200 : 160, '#F0EEFF', { col2: '#A8A2DC', edge: '#17143A', ew: .13, rot: -.1 + .06 * i, k: 130 + i, age: a < .2 ? a : null, a: 1 - seg(y, 90, -30) });
    });
  }

  // ================= S16: 从哪里降落 comes down like snow and lands, snow caps and all =================
  function s16(t) {
    if (t < 49.5 || t > 52.8) return;
    const X = [330, 1180, 1340, 1090, 270], GY = 790;
    each('s16', t, (c, i, a) => {
      const f = seg(a, 0, 1.0), y = lerp(-110, GY, easeIn(f)), b = f >= 1 ? Math.exp(-(a - 1) * 7) * Math.abs(Math.cos((a - 1) * 18)) * 34 : 0, sqz = f >= 1 ? 1 - .22 * Math.exp(-(a - 1) * 9) : 1;
      ch(c, X[i] + 30 * Math.sin(a * 3 + i) * (1 - f), y - b, 175, '#F3F7FF', { col2: '#B9C8E6', edge: '#1B2748', rot: (i % 2 ? .14 : -.12), sy: sqz, cap: ease(seg(a, 1, 2.2)), k: 140 + i, age: a < .2 ? a : null, a: 1 - seg(t, 52.2, 52.7) });
    });
  }

  // ================= S17–S19: the mistakes pile up =================
  function s17(t) {
    if (t < 52.8 || t > 56.2) return;
    each('s17a', t, (c, i, a) => ch(c, 520 + i * 190, 300 + 30 * i, 150, '#EDEBFF', { col2: '#A9A3D6', edge: '#17143A', rot: -.08 + .1 * i, k: 150 + i, age: a < .2 ? a : null, a: 1 - seg(t, 54.0, 54.4) }));
    each('s17b', t, (c, i, a) => {
      const f = seg(a, 0, 1.15), x = 640 + i * 120 + 120 * Math.sin(f * 2 + i) * (1 - f) + 70 * f * (i - 1.5), y = lerp(560, 320, easeOut(seg(a, 0, .45))) + (a > .45 ? 260 * easeIn(seg(a, .45, 1.2)) : 0), land = a > 1.2;
      ch(c, x, land ? 790 : y, 138, '#EDEBFF', { col2: '#A9A3D6', edge: '#17143A', rot: .5 * Math.sin(a * 6 + i) * (land ? .2 : 1) + (i - 1.5) * .12, k: 154 + i, age: a < .2 ? a : null, a: 1 - seg(t, 55.6, 56.0) });
    });
    each('s17c', t, (c, i, a) => ch(c, 1160 + i * 190, 270 + (i ? 14 : 0), i ? 215 : 150, i ? '#E8394C' : '#EDEBFF', { col2: i ? '#A8182E' : '#A9A3D6', edge: '#17143A', rot: -.05 + .08 * i, k: 160 + i, age: a < .2 ? a : null, a: 1 - seg(t, 56.0, 56.3) }));
  }
  function s18(t) {
    if (t < 56.0 || t > 60.3) return;
    each('s18a', t, (c, i, a) => {
      const sh = i > 0 && t >= 57.0 && t < 58.1 ? Math.sin((t - 57.0) * 40) * 14 : 0;
      ch(c, 470 + i * 205 + sh, 250 + (i ? 20 : 0) + 18 * Math.sin(i), i ? 165 : 130, i ? '#FFE9E4' : '#EDEBFF', { col2: i ? '#E9B0A6' : '#A9A3D6', edge: '#17143A', rot: -.06 + .05 * i, k: 170 + i, age: a < .2 ? a : null, a: 1 - seg(t, 58.4, 58.8) });
    });
    each('s18b', t, (c, i, a) => {
      const droop = ease(seg(t, 58.3, 59.3)), x = 1100 + i * 210, y = 250 + 25 * i + 120 * droop * (1 + i * .2);
      ch(c, x, y, 150, '#D7DDF2', { col2: '#8F9BC8', edge: '#17143A', rot: .35 * droop * (i % 2 ? 1 : -1) + (i - 1) * .06, sy: 1 + .18 * droop, k: 176 + i, age: a < .2 ? a : null, a: 1 - seg(t, i === 2 ? 59.9 : 59.3, i === 2 ? 60.2 : 59.5) });
    });
  }
  const ALL = [s1, s2, s3, s4, s5, s6, s8, s9, s11, s12, s13, s14, s15, s16, s17, s18];
  const _drawWorld = drawWorld;
  drawWorld = function (t) { if (!window.LYRICS_ONLY) _drawWorld(t); if (!window.LOOP && !window.NO_LYRICS) for (const f of ALL) f(t); };
})();
