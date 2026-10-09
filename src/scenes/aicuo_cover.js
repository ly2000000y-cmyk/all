// aicuo_cover.js: the title card in front of the 《爱错》 MV. A standalone loop (LOOPS.cover), rendered on its own and
// joined in front of the film:  node render.mjs --soft-gl --loop=cover --frames --dir=out/cover
// Frame 0 is the full poster (platforms that take the first frame as the thumbnail get the cover). It holds, alive,
// then the north wind blows the lettering off and an iris closes on 呆呆 — the film opens with an iris on the same spot
// (same camera as the first frame of shot 1, so the two irises meet on his face).
(() => {
  const LEN = 4.0, T_GUST = 2.7, T_IRIS = 3.3;
  const INK = '#2B2430', CREAM = '#FFF6E2', ZH = '"MaShanZheng", KaiTi, STKaiti, serif', EN = '"CaveatBrush", "MaShanZheng", cursive';
  const gy = x => HILL_Y + 8 * Math.sin(x * .006), FEET = x => gy(x) + 12, U = 20, CX = 930;
  const HW = { cx: 1100, cy: 640, zoom: .9 }, MBY = gy(MBX) + 6, MB_S = 26;

  // A painted line of lettering in the lyrics' hand (ink edge, two-tone fill, soft shadow, a little boil).
  // parts = [[text, font, size multiplier, dy], ...] are laid out side by side and centred as one line.
  function line(parts, x, y, size, col, o = {}) {
    if ((o.a ?? 1) <= .01) return;
    letter('', x, y, size, col, { fn: drawLine, screen: true, alpha: o.a ?? 1, rot: o.rot || 0, parts, edge: o.edge || INK, col2: o.col2, ew: o.ew, sh: o.sh ?? 1, k: o.k || 0, gap: o.gap ?? .3 });
  }
  function drawLine(c, L) {
    const s = L.size, j = BOILN * 5 + L.k * 11 + 3;
    c.translate((hash(j) - .5) * s * .025, (hash(j + 1) - .5) * s * .025);
    c.rotate((hash(j + 2) - .5) * .025);
    c.textAlign = 'left'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineCap = 'round';
    const P = L.parts.map(([txt, font, m = 1, dy = 0]) => { const sz = s * m; c.font = `${sz}px ${font}`; return { txt, font: c.font, sz, dy: dy * s, w: c.measureText(txt).width }; });
    const gap = s * L.gap, tw = P.reduce((a, p) => a + p.w, 0) + gap * (P.length - 1);
    const pass = f => { let x = -tw / 2; for (const p of P) { c.font = p.font; f(p, x); x += p.w + gap; } };
    c.fillStyle = `rgba(40,20,30,${.2 * L.sh})`; pass((p, x) => c.fillText(p.txt, x + p.sz * .035, p.dy + p.sz * .05));
    c.strokeStyle = L.edge; pass((p, x) => { c.lineWidth = p.sz * (L.ew ?? .09); c.strokeText(p.txt, x, p.dy); });
    const g = c.createLinearGradient(0, -s * .5, 0, s * .5); g.addColorStop(0, L.color); g.addColorStop(1, L.col2 || L.color);
    c.fillStyle = g; pass((p, x) => c.fillText(p.txt, x, p.dy));
    const a0 = c.globalAlpha; c.globalAlpha = a0 * .22; c.fillStyle = '#fff'; pass((p, x) => c.fillText(p.txt, x - p.sz * .012, p.dy - p.sz * .02)); c.globalAlpha = a0;
  }

  const letterHand = (ce, s = .62) => (u, sw) => { const a = ce.aR ?? .2; letterHeart((4.9 + 2.2 * Math.cos(a) + .7) * u, (-4.5 - 2.2 * Math.sin(a) - .3) * u, u * s, .35 - a * .3); };
  const letterChest = (u, sw) => letterHeart(0, -3.3 * u, u * .72, -.1);

  // the title block, blown off left to right by the gust (stagger d)
  const TITLE = [
    { parts: [['爱', ZH]], x: 1112, y: 200, s: 262, c: '#FFB2C5', c2: '#DE6F8F', rot: -.06, ew: .075, edge: '#3A1C2A', d: .10 },
    { parts: [['错', ZH]], x: 1378, y: 232, s: 284, c: '#EC4256', c2: '#A9192F', rot: .16, ew: .075, edge: '#3A1C2A', d: .24 },
    { parts: [['王力宏', ZH], ['Leehom Wang', EN, .9, .02]], x: 1250, y: 432, s: 64, c: '#4A3226', c2: '#5E3E2E', edge: CREAM, ew: .1, sh: .6, gap: .35, d: .0 },
    { parts: [['词：王力宏 / 崔惟楷', ZH], ['曲：王力宏', ZH]], x: 1250, y: 500, s: 38, c: '#6A4A38', c2: '#7C5644', edge: CREAM, ew: .1, sh: .5, gap: 1.6, d: .04 },
  ];
  // A few streaks of the north wind already nosing at the title from the left (screen space): head at hx, length L.
  // They breathe in place during the hold, then the gust shoves them across the frame with the lettering.
  const STREAKS = [[985, 128, 330, 0], [930, 300, 260, 1], [1010, 372, 200, 2]];
  function streaks(t) {
    const g = easeIn(seg(t, T_GUST - .1, T_GUST + .5));
    boilSeed('cover-streaks');
    for (const [hx0, y0, L0, i] of STREAKS) {
      const a = 1 - seg(g, .7, 1); if (a <= .02) continue;
      const hx = hx0 + 14 * Math.sin(t * 1.9 + i * 2) + g * 1400, y = y0 + 6 * Math.sin(t * 1.3 + i), L = L0 * (1 + .08 * Math.sin(t * 2.3 + i) + .6 * g);
      const P = []; for (let j = 0; j <= 6; j++) { const k = j / 6; P.push([hx - L * k, y + Math.sin(k * 5 + i + t * 2) * 7]); }
      const r = 22 + 6 * i, C = []; for (let j = 0; j <= 8; j++) { const an = Math.PI / 2 - j / 8 * 4.6; C.push([hx + 4 + Math.cos(an) * r * (1 - j / 14), y - r + Math.sin(an) * r * (1 - j / 14)]); }
      inkLine(P, 1.5, '#D6E6F8', 'dry', .5);
      inkLine(P.concat(C), 1.25, WINDDK, 'inkfine', .5);
    }
  }
  // The gust takes the lettering: 爱 is blown up and away to the right, while 错 tumbles down into the valley and lands
  // on 铁山's roof (where the letter will end up too) with a little pink puff.
  const T_LAND = T_GUST + .06 + .65;
  function title(t) {
    TITLE.forEach((L, i) => {
      const bob = Math.sin(t * 2.1 + i * 1.3) * (i < 2 ? 5 : 2), sway = Math.sin(t * 1.6 + i) * (i < 2 ? .02 : .006);
      let x, y, rot, sc = 1, a;
      if (i === 1) {
        const g = seg(t, T_GUST + .06, T_LAND), e = Math.pow(g, 1.5);
        x = lerp(L.x, 1690, e) + 230 * Math.sin(g * Math.PI); y = lerp(L.y + bob, 868, Math.pow(g, 1.8)) - 70 * Math.sin(g * Math.PI);
        rot = L.rot + sway + g * 5.2; sc = 1 - .8 * ease(g); a = 1 - seg(g, .88, 1);
      } else {
        const g = easeIn(seg(t, T_GUST + L.d, T_GUST + L.d + .55));
        x = L.x + g * 1500 + 30 * Math.sin(g * 6); y = L.y + bob - g * (i === 0 ? 260 : 160) + 60 * Math.sin(g * 4);
        rot = (L.rot || 0) + sway + g * (i === 0 ? 1.4 : .8); a = 1 - seg(g, .55, 1);
      }
      line(L.parts, x, y, L.s * sc, L.c, { col2: L.c2, rot, edge: L.edge, ew: L.ew, sh: L.sh, gap: L.gap, k: i, a });
    });
    if (t > T_LAND) for (let j = 0; j < 3; j++) heartPuff(1676 + 26 * j, 872 - 10 * (j % 2), 13 + 3 * (j % 2), seg(t, T_LAND + j * .06, T_LAND + .9 + j * .06), PINK);
  }

  LOOPS.cover = t => {
    const wk = ease(seg(t, T_GUST - .2, T_GUST + .25));   // the north wind arrives
    camBegin(HW.cx, HW.cy, HW.zoom);
    usePlate('hill-autumn', () => hillSet('autumn'), HW);
    // 铁山's chimney down in the valley already breathes little pink hearts (nobody has noticed yet)
    for (let i = 0; i < 2; i++) heartPuff(1897 + 10 * i, 990, 14, frac(t * .35 + i * .5), PINK);
    mailbox(MBX, MBY, MB_S, { key: 'cv' });
    const ce = emotions(t, [[0, 'hopeful'], [T_GUST, 'nervous', { aL: -1, aR: -1 }]]);   // the gust: he hugs the letter
    daidai(CX, FEET(CX), U, { ...ce, wind: .3 + .85 * wk, seed: 1, rot: -.1 * wk, draw: t > T_GUST + .06 ? letterChest : letterHand(ce) });
    const hc = toScreen(CX, FEET(CX) - 4 * U);
    camEnd();
    leafFall(t, { n: 7, lean: 90, seed: 1 });
    windLines(t, .95 * wk, { n: 10, y0: 90, y1: 760, dir: 1, seed: 1 });
    streaks(t);
    title(t);
    if (t > T_IRIS) iris(hc[0], hc[1], 1320 * (1 - ease(seg(t, T_IRIS, LEN - .02))), PAL.paper);
  };
  LOOPS.cover.len = LEN;
})();
