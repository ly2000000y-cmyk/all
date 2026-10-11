// tests22.js: model sheets for the 《22》 cast and props (standalone loops: --loop=cast22, --loop=props22)
LOOPS.cast22 = t => {
  boilSeed('bg');
  inkLine([[40, 520], [1880, 520]], .6, PAL.ink, 'inkfine', 0); inkLine([[40, 1000], [1880, 1000]], .6, PAL.ink, 'inkfine', 0);
  girl(230, 500, 16, feel('happy', t));
  girl(560, 500, 16, { ...feel('shy', t), view: 'q' });
  girl(880, 500, 16, { ...feel('neutral', t), view: 'side', walk: t * 2 });
  girl(1180, 500, 16, { ...feel('neutral', t), view: 'back' });
  girl(1480, 500, 16, { ...feel('excited', t), wind: 1 , view: 'side'});
  girl(1760, 500, 16, { ...feel('sleepy', t), loose: 1 });
  girl(230, 980, 16, { ...feel('determined', t), pack: true });
  girl(560, 980, 16, { ...feel('determined', t), pack: true, view: 'side', walk: t * 2 });
  girl(880, 980, 16, { ...feel('sad', t), pack: true, view: 'back' });
  girl(1180, 980, 16, { ...feel('happy', t), hat: 'headphones' });
  drone(1480, 980, 16, { ...feel('bored', t), k: 0 });
  drone(1620, 980, 16, { ...feel('angry', t), k: 1, view: 'q' });
  drone(1760, 980, 16, { ...feel('neutral', t), k: 2, view: 'side', walk: t * 2 });
};
LOOPS.cast22.len = 4;
LOOPS.props22 = t => {
  boilSeed('props');
  blossomTree(200, 520, 330);
  clockFace(520, 330, 110, 45, {});
  clockFace(760, 330, 110, 20, { shake: 1, bells: true });
  bento(1000, 400, 70, { steam: true });
  cupcake(1300, 440, 60, { lit: 1 });
  cupcake(1560, 440, 60, { smoke: (t % 2) / 2 });
  bookStack(1790, 440, 50, 5);
  potPlant(190, 1000, 36, .0); potPlant(380, 1000, 36, .3); potPlant(570, 1000, 36, .6); potPlant(760, 1000, 36, .9);
  petalBoat(1000, 940, 36, .05, { glowK: .5 }); crane(1220, 880, 40, t * 6); crane(1340, 930, 30, t * 6 + 2);
  lantern(1460, 800, 40); flapBook(1620, 880, 36, .2, Math.sin(t * 6));
  scribbleCloud(1760, 880, 150, t, .8); rock(1900, 1000, 30); thorns(1520, 1010, 40, t);
  taxi(1160, 1000, 22);
};
LOOPS.props22.len = 4;
// one loop per set, for the plate contact sheet
const SET_TESTS = {
  lane: t => { laneSet('day'); const tip = laneBranch(t); },
  lanewet: t => { laneSet('wet'); const tip = laneBranch(t); hangRibbon(1330, 300, t); },
  ridge: t => ridgeSet(), city: t => citySet(), balcony: t => { balconySet(); balconySun(.3); }, officeday: t => { officeSet('day'); officeLight('day'); girl(960, 900, 26, feel('neutral', t)); officeDesk(t, { papers: 12, lamp: 0 }); clockFace(1300, 230, 80, 45); },
  officenight: t => { officeSet('night'); girl(960, 900, 26, feel('sleepy', t)); officeDesk(t, { papers: 40, lamp: 1 }); },
  room: t => { roomSet(); roomCalendar(t, [[0.2]]); girl(900, 940, 26, feel('bored', t)); },
  dream: t => { dreamSet(); petalBoat(900, 800, 40, .05, { glowK: .5 }); },
  park: t => { parkSet(); girl(960, 930, 26, feel('happy', t)); benchFront(); },
  homeroad: t => { homeRoadSet(); houseDoor(.6); },
  cross: t => { crossroadsSet(); scribbleCloud(960, 200, 420, t); },
};
for (const k in SET_TESTS) { LOOPS['set_' + k] = SET_TESTS[k]; LOOPS['set_' + k].len = 4; }
