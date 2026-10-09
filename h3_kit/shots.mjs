// shots.mjs: 《爱错》MV 的镜头表（与 src/scenes/aicuo.js 同一条小节线）+ 给 MiniMax H3 的提示词。
// 三个脚本共用这一份数据：cut_shots.mjs（切参考片段）、join_shots.mjs（拼回整片）。
const BEAT = 60 / 73, OFF = 0.2, END = 65.78;
const bar = n => OFF + n * 4 * BEAT;

export const FPS = 24;
export const MIN_REF = 4.0;   // H3 一次至少生成 4 秒；短于 4 秒的镜头，参考片段末尾定格补足，生成后再裁回原长

// 角色参考图：从已渲好的 aicuo_mv.mp4 里抽的一帧（t 秒），保证和成片同一个画风；crop = [x, y, 宽, 高]（占整帧的比例），把小角色裁大
export const CAST = {
  clawd:         { t: 18.1, crop: [.469, .278, .333, .444], zh: '呆呆（橘色方块，红白条纹围巾）',        en: 'Clawd: a small orange rounded-rectangle block creature with two tiny dark eyes, stubby legs and a long red-and-white striped scarf' },
  clawd_wings:   { t: 60.8, zh: '呆呆戴纸板翅膀和飞行护目镜',            en: 'Clawd again, now wearing cardboard wings and round flying goggles' },
  pigeon:        { t: 5.9,  crop: [.652, .028, .292, .389], zh: '咕咕（灰蓝信鸽，背小邮包）',            en: 'the pigeon: a round blue-grey pigeon with an iridescent purple neck and a tiny mail satchel' },
  tieshan:       { t: 11.0, zh: '铁山（石板灰大块头，八字胡、粗眉、额头疤）', en: 'Tieshan: a huge slate-grey block giant with a thick moustache, heavy angry eyebrows and a scar on his forehead' },
  tieshan_scarf: { t: 57.5, zh: '铁山围着粉色围巾',                      en: 'Tieshan again, wearing a long pink scarf' },
};

export const STYLE = 'Hand-painted 2D animation: gouache and watercolour on cream paper, visible brush strokes and paper grain, slightly wobbly hand-drawn outlines that redraw every frame, flat storybook shapes, muted limited palette, like a picture book that moves. No on-screen text, no captions, no subtitles, no speech.';

// 每镜：id、名字、起止秒、用到的角色参考图、中文说明、英文动作描述
const S = (id, name, t0, t1, cast, zh, en) => ({ id, name, t0, t1, cast, zh, en });
export const SHOTS = [
  S('s01', 'S1 山坡·暖秋', 0, bar(1), ['clawd'],
    '圆形光圈打开；呆呆给情书封红心蜡、亲一下、跟着节拍蹦；北风来了围巾横飞、叶子刷过，他护住信；鸽子落在信箱上。',
    'A circular iris opens on a warm autumn hillside. Clawd seals a love letter with a red heart wax seal, kisses it and bounces happily on the beat. Then a cold north wind arrives: his scarf streams out horizontally, autumn leaves sweep across the frame and he hugs the letter against the wind. A pigeon lands on the mailbox at the end. The camera pushes in from a wide view to Clawd.'),
  S('s02', 'S2 山坡·送信', bar(1), bar(2), ['clawd', 'pigeon'],
    '呆呆把信装进鸽子邮包，用力指向远山亮灯的窗口；鸽子敬礼起飞，被风像叶子一样吹偏、打转掉向山谷；呆呆还在挥手，毫无察觉。镜头甩下去跟着鸽子。',
    'Clawd tucks the letter into the pigeon\'s satchel and points firmly at the lit window on the far hill, where a tiny mint-green square girl waves. The pigeon salutes and takes off, but a gust blows it off course like a leaf and it tumbles down toward the valley. Clawd keeps waving cheerfully, unaware. The camera whip-pans down, following the pigeon.'),
  S('s03', 'S3 铁山院子', bar(2), bar(3), ['pigeon', 'tieshan'],
    '鸽子摔在带尖刺的围栏上，信掉在门垫；门开，铁山堵满门框；鸽子僵住后炸毛逃跑；铁山捡起带红心的信。',
    'A grim stone house with a spiked fence and a skull sign under a grey sky. The pigeon crashes onto the fence and the letter drops onto the doormat. The heavy door opens and Tieshan fills the whole doorway. The pigeon freezes, then puffs up and flees in a burst of feathers. Tieshan picks up the letter and stares at the red heart seal.'),
  S('s04', 'S4 铁山读信', bar(3), bar(4), ['tieshan', 'clawd'],
    '铁山拆信，凶脸一格一格软化：眉毛抬起、脸红、眼冒爱心，把信按在胸口、偷偷闻一下；心形光圈收拢，再在呆呆脸上打开，他在信箱旁期待地看天。',
    'Close on Tieshan reading the letter. His fierce face melts step by step: eyebrows rise, he blushes, hearts appear in his eyes, he presses the letter to his chest and sneaks a sniff. A heart-shaped iris closes, then opens on Clawd bouncing beside the mailbox and looking hopefully at the sky.'),
  S('s05', 'S5 等信·日夜', bar(4), bar(5), ['clawd'],
    '呆呆守着信箱，天色快速日→夜→日，叶子越堆越高；他打开信箱，飞出蜘蛛网和飞蛾，肩膀垮下来。',
    'Clawd waits by the mailbox while the sky flickers quickly from day to night to day and fallen leaves pile up around him. He opens the mailbox: cobwebs and a moth fly out, and his shoulders slump.'),
  S('s06', 'S6 凉茶·雨云', bar(5), bar(6), ['clawd'],
    '灰天。呆呆摆小桌倒两杯茶，第二杯的热气消失，风把叶子吹到对面空椅子；头顶长出一朵小雨云只淋他一人，他面无表情抬头；雨云膨胀盖满画面。',
    'Overcast grey day. Clawd sets up a small table and pours two cups of tea. The steam over the second cup fades and the wind blows a leaf onto the empty chair opposite. A small rain cloud appears over his head and rains only on him; he looks up, deadpan. The cloud swells until it covers the whole frame in grey.'),
  S('s07', 'S7 铁山织围巾', bar(6), bar(7), ['tieshan_scarf', 'pigeon'],
    '暖色屋内：铁山哼着歌用巨大织针织粉围巾，毛线拖到门外；鸽子被扣在茶杯下发抖；铁山用手指"温柔"地摸它，把它按扁；他举起织好的围巾吸鼻子。',
    'A warm cosy room. Tieshan hums while knitting a long pink scarf with giant needles, the yarn trailing out through the door. The pigeon is trapped under an upturned teacup, peeking out and trembling. Tieshan strokes it "gently" with one finger and squashes it flat, then holds up the finished scarf and sniffles.'),
  S('s08', 'S8-9 冬雪·雪人', bar(7), bar(9), ['clawd'],
    '下雪，雪堆在呆呆头肩；他堆个小雪人陪他守信箱，手舞足蹈地对雪人倾诉；北风"啪"地拍掉雪人脑袋，脑袋滚走，胡萝卜鼻子飞进他手里；他对着没头的雪人张着嘴，一片雪落在头上；最后抖掉雪，雪团炸成白闪。',
    'Winter hillside, snow falling and piling on Clawd\'s head and shoulders beside the mailbox. He builds a small snowman to keep him company and pours out his heart to it with big gestures. A gust of north wind slaps the snowman\'s head off; it rolls away down the slope and the carrot nose flies into Clawd\'s hand. He stares at the headless snowman with his mouth open as a snowflake lands on his head. At the end he shakes off the snow and it bursts into a white flash.'),
  S('s10', 'S10 做翅膀', bar(9), bar(10), ['clawd', 'clawd_wings'],
    '呆呆站起，身上的雪保持坐姿掉下；看远山亮灯的窗，眼神坚定；三拍动手：锯纸板、锤子砸手指、绑翅膀戴护目镜；试扇一下，围巾甩到脸上。',
    'Winter dusk. Clawd stands up and the snow slides off him still holding its sitting shape. He looks at the lit window on the far hill, resolve in his eyes. Then three quick beats: he saws a piece of cardboard, hits his finger with a hammer, and ties on cardboard wings and puts on flying goggles. He flaps once and his scarf whips into his face.'),
  S('s11', 'S11 崖边', bar(10), bar(11), ['clawd_wings'],
    '呆呆走到崖边往下看，一粒小石子掉下去，很久才扬起一点灰；他腿抖、冒汗、闭眼深呼吸。',
    'Clawd with cardboard wings and goggles walks to the cliff edge and looks down. A small pebble falls and a very long time later a tiny puff of dust rises. His legs shake, he sweats, closes his eyes and breathes deeply.'),
  S('s12', 'S12 起跳', bar(11), bar(12), ['clawd_wings'],
    '蹲下蓄力，在拍点上跳出去；先直线下坠（挤压），拼命扇翅膀，一股上升气流托起他，越飞越高，得意欢呼。镜头随他下摇再上摇。',
    'Clawd crouches and jumps off the cliff on the beat. He drops straight down at first, squashed by the fall, flaps frantically, then an updraft lifts him higher and higher and he cheers proudly. The camera tilts down with him and then back up.'),
  S('s13', 'S13 飞越山谷', bar(12), bar(13), ['clawd_wings'],
    '粉紫黄昏、金色光。呆呆飞过山谷，脚下烟囱冒出一串心形的烟擦着他飘过，他毫无察觉；前方远山窗口越来越大，窗边有姑娘的身影，他挥手。',
    'A beautiful pink-purple dusk with golden light. Clawd glides over the valley. A string of heart-shaped smoke rises from the chimney of the little house below and drifts past him unnoticed. Ahead, the lit window on the far hill grows larger with a girl\'s silhouette in it, and he waves.'),
  S('s14', 'S14 北风再来', bar(13), bar(14), ['clawd_wings'],
    '冷蓝风线横扫，一只翅膀被吹翻成伞，呆呆螺旋翻滚、晕眩转圈；窗里的姑娘平静地拉上窗帘；紫色刷子扫过画面。',
    'Cold blue wind lines sweep across the frame. One wing is flipped inside out like an umbrella and Clawd spirals and tumbles, dizzy. In the far window the girl calmly draws her curtain. A purple brush wipe sweeps across the picture.'),
  S('s15', 'S15 坠落', bar(14), bar(15), ['clawd_wings'],
    '呆呆翻着跟头往下掉，身后山坡上的信箱缩成一个小点；屋顶、烟囱迎面而来，撞到屋顶弹起，滑下积雪的屋面。',
    'Clawd falls head over heels; the mailbox on the distant hill shrinks to a tiny dot behind him. Rooftops and chimneys rush up at him, he bounces off a roof and slides down the snowy slope of the roof.'),
  S('s16', 'S16 雪堆·门开', bar(15), bar(16), ['clawd_wings', 'pigeon', 'tieshan_scarf'],
    '雪夜院子。呆呆一头扎进门口雪堆，只剩两条腿抽动；鸽子在围栏上用翅膀捂脸；门开，铁山捧着花束、围着粉围巾、头发梳得整整齐齐，呆住脸红。',
    'A snowy night in the yard. Clawd dives head-first into the snow mound by the door, only his two legs twitching out. The pigeon on the fence covers its face with a wing. The door opens and Tieshan stands there holding a bouquet, wearing the pink scarf, his hair neatly combed, frozen and blushing.'),
  S('s17', 'S17 拔出雪堆', bar(16), bar(17), ['clawd_wings', 'tieshan_scarf', 'pigeon'],
    '铁山把呆呆从雪里"噗"地拔出来，轻轻掸雪，呆呆晕乎乎；他看见铁山手里带红心的信，惊叹号；转头看鸽子，鸽子心虚地望天吹口哨。',
    'Tieshan pulls Clawd out of the snow with a pop and gently brushes the snow off him; Clawd is dizzy. He notices the letter with the red heart in Tieshan\'s hand and an exclamation mark pops up. He turns to the pigeon, which guiltily looks at the sky and whistles.'),
  S('s18', 'S18 比划解释', bar(17), bar(18), ['clawd_wings', 'tieshan_scarf'],
    '呆呆比划着解释（指远山窗口、指自己、指信、摇头）；铁山由害羞变成受伤、眼泪汪汪；呆呆冒汗说不出口，叹口气点点头；铁山瞬间亮起来。',
    'Clawd gestures to explain: pointing at the far window, at himself, at the letter, shaking his head. Tieshan\'s face goes from shy to hurt, his eyes welling up. Clawd sweats, cannot say it, sighs and nods. Tieshan instantly lights up.'),
  S('s19', 'S19 熊抱', bar(18), bar(19), ['clawd_wings', 'tieshan_scarf'],
    '铁山熊抱，呆呆被抱离地面、眼珠鼓出；对着镜头面无表情，一滴眼泪滑下；爱心满天飞，铁山抱着他转圈；心形光圈合上。',
    'Tieshan gives Clawd a huge bear hug and lifts him off the ground, Clawd\'s eyes bulging. Then Clawd stares into the camera, deadpan, as a single tear rolls down. Hearts fly everywhere and Tieshan spins him around. A heart-shaped iris closes.'),
  S('s20', 'S20 空信箱', bar(19), END, [],
    '心形光圈在空信箱上打开，宽景（与 S1 同构图）：雪夜里信箱落满雪，远山窗口灯已熄，谷底铁山家窗口亮着粉色暖光、烟囱冒出小小的心；北风吹过，最后一片叶子落在信箱上，光圈收拢到叶子。',
    'A heart-shaped iris opens on a wide locked-off view, framed like the opening shot: an empty mailbox covered in snow on a snowy night, the window on the far hill dark, while in the valley below Tieshan\'s window glows warm pink and a tiny heart rises from his chimney. The north wind blows past and the very last leaf falls onto the mailbox; the round iris closes down onto the leaf.'),
];

export const secs = s => s.t1 - s.t0;
// 帧边界用累计四舍五入，避免 19 个镜头逐个取整后整体漂移
export const frameRange = s => [Math.round(s.t0 * FPS), Math.round(s.t1 * FPS)];
