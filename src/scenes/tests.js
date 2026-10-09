// tests.js: model sheets for the MV's cast and props (standalone loops: --loop=cast, --loop=props)
LOOPS.cast = t => {
  boilSeed('bg'); 
  inkLine([[40, 520], [1880, 520]], .6, PAL.ink, 'inkfine', 0); inkLine([[40, 1000], [1880, 1000]], .6, PAL.ink, 'inkfine', 0);
  clawd(230, 500, 16, feel('happy', t));
  cuihua(560, 500, 16, feel('happy', t));
  cuihua(880, 500, 16, { ...feel('shy', t), view: 'q' });
  cuihua(1160, 500, 16, { ...feel('neutral', t), view: 'side', walk: t * 2 });
  cuihua(1460, 500, 16, { ...feel('neutral', t), view: 'back' });
  cuihua(1740, 500, 16, { ...feel('love', t), aR: 1.2 });
  cuihua(230, 980, 16, { ...feel('smug', t), city: true });
  cuihua(560, 980, 16, { ...feel('disgusted', t), city: true });
  cuihua(880, 980, 16, { ...feel('cool', t), city: true, view: 'q', shadesOff: true, eyes: 'narrow' });
  rival(1200, 980, 16, feel('cool', t));
  rival(1520, 980, 16, { ...feel('smug', t), view: 'q' });
  cuihua(1780, 980, 16, { ...feel('happy', t), ghost: true });
};
LOOPS.cast.len = 4;
LOOPS.props = t => {
  boilSeed('props');
  const [px, py] = seatPos(560, 470, 22, 'passenger'), [dx, dy] = seatPos(560, 470, 22, 'driver');
  cuihua(px, py, 11, { ...feel('cool', t), city: true, noLegs: true, noShadow: true, bag: false });
  rival(dx, dy, 11, { ...feel('cool', t), noLegs: true, noShadow: true });
  car(560, 470, 22, { spin: t * 8 });
  bus(1400, 470, 22, { part: 'back' });
  cuihua(1400 + BUS_WIN[1] * 22, 470 - 6.0 * 22, 9, { ...feel('happy', t), noLegs: true, noShadow: true, aR: 1.2 + .4 * Math.sin(t * 9), aL: -.5 });
  bus(1400, 470, 22, { part: 'front', door: .7 });
  melon(160, 900, 90);
  melon(400, 900, 90, { flower: true, braids: true });
  halfMelon(660, 880, 100, { scoop: .7 });
  slice(900, 940, 90, { rot: .2 });
  stiltHouse(1200, 980, 300);
  tree(1520, 980, 320, 1); tree(1700, 980, 320, .3);
  lantern(1840, 700, 60); packet(1840, 950, 40, .2);
};
LOOPS.props.len = 4;
const SET_TESTS = [['village-day', () => villageSet('day')], ['village-night', () => villageSet('night')], ['village-dawn', () => villageSet('dawn')], ['shop', shopSet],
  ['patch-day', () => patchSet('day')], ['patch-sunset', () => patchSet('sunset')], ['road-day', () => roadSet('day')], ['road-over', () => roadSet('overcast', { tree: true })],
  ['roadv-dusk', () => roadVSet('dusk')], ['roadv-rain', () => roadVSet('rain')], ['porch', porchSet], ['summit', summitSet]];
LOOPS.sets = t => { const [k, f] = SET_TESTS[Math.floor(t) % SET_TESTS.length]; usePlate('test-' + k, f, { cx: 960, cy: 540, zoom: .9 }); };
LOOPS.sets.len = SET_TESTS.length;
