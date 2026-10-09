// cut_shots.mjs: 把已渲好的无字幕手绘版 out/aicuo_mv.mp4 切成给 MiniMax H3 的"参考包"。
//   h3/ref/sNN.mp4      每个镜头一段（1280x720、24fps、去掉音轨；不足 4 秒的末尾定格补到 4 秒）
//   h3/stills/sNN_mid.png   该镜头正中间的一帧（画风/构图参考图）
//   h3/stills/cast_*.png    角色参考图（从成片里抽的一帧）
//   h3/prompts.md           每个镜头的提示词、该传哪些图、生成多少秒
//   h3/ref_pack.zip         以上全部打成一个包，直接上传到云端 5090
// 用法（项目根目录）: node h3_kit/cut_shots.mjs [out/aicuo_mv.mp4] [--only=s01,s03,s19]   （不加 --only 就是全部 19 个镜头）
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, rmSync } from 'node:fs';
import { SHOTS, CAST, STYLE, FPS, MIN_REF, secs } from './shots.mjs';

const args = process.argv.slice(2), ONLY = (args.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const SRC = args.find(a => !a.startsWith('--')) || 'out/aicuo_mv.mp4';
const PICK = ONLY.length ? SHOTS.filter(s => ONLY.includes(s.id)) : SHOTS;
if (!PICK.length) { console.error('[错误] --only 里没有认识的镜头编号（s01…s20，没有 s09）'); process.exit(1); }
if (!existsSync(SRC)) { console.error('[错误] 找不到 ' + SRC + '，请先用 render.bat 渲出视频。'); process.exit(1); }

const ff = args => {
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
  if (r.status !== 0) { console.error('[错误] ffmpeg 失败：' + args.join(' ')); process.exit(1); }
};
for (const d of ['h3/ref', 'h3/stills']) rmSync(d, { recursive: true, force: true });   // 每次重切，包里不留上次的旧文件（h3/out 里 H3 生成的片子不动）
for (const d of ['h3/ref', 'h3/stills', 'h3/out', 'h3/seg']) mkdirSync(d, { recursive: true });

console.log('[1/3] 切 ' + PICK.length + ' 个镜头的参考片段和中间帧 ...');
for (const s of PICK) {
  const len = secs(s), pad = Math.max(0, MIN_REF - len);
  const vf = `scale=1280:720:flags=lanczos,fps=${FPS}` + (pad > 0 ? `,tpad=stop_mode=clone:stop_duration=${pad.toFixed(3)}` : '') + ',format=yuv420p';
  ff(['-ss', s.t0.toFixed(3), '-t', len.toFixed(3), '-i', SRC, '-an', '-vf', vf, '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', `h3/ref/${s.id}.mp4`]);
  ff(['-ss', ((s.t0 + s.t1) / 2).toFixed(3), '-i', SRC, '-frames:v', '1', '-vf', 'scale=1280:720:flags=lanczos', `h3/stills/${s.id}_mid.png`]);
  process.stdout.write('  ' + s.id + ' ');
}
console.log('\n[2/3] 抽角色参考图 ...');
const USED = new Set(PICK.flatMap(s => s.cast));
for (const [k, c] of Object.entries(CAST)) if (USED.has(k)) ff(['-ss', String(c.t), '-i', SRC, '-frames:v', '1', '-vf', c.crop ? `crop=iw*${c.crop[2]}:ih*${c.crop[3]}:iw*${c.crop[0]}:ih*${c.crop[1]},scale=1280:-2:flags=lanczos` : 'scale=1280:720:flags=lanczos', `h3/stills/cast_${k}.png`]);

// 提示词清单
let md = '# 《爱错》× MiniMax H3 提示词清单\n\n'
  + '用法：在 ComfyUI 的 "MiniMax H3: Reference to Video" 模板里，每个镜头——\n'
  + '- **Video 1** 传 `ref/sNN.mp4`；**Image 1** 传 `stills/sNN_mid.png`；Image 2、3… 按下表顺序传角色图。\n'
  + '- 时长填表里的"生成秒数"；出来之后用 `sNN.mp4` 命名，放进电脑的 `h3\\out\\`。\n'
  + '- 如果模板/模型不认 "Image 1 / Video 1" 这种叫法，就把提示词里的叫法改成"the first image / the video"。\n'
  + '- 建议设置（来自 ComfyUI 官方文档，未在我们的片子上验证）：先用 864×480 快速试；要看画质再用 1344×768（Megapixels 0.98、Multiple 32，别用 1.0）；步数 20，参考不贴再加到 25；先不要开 4 步/8 步加速 LoRA（官方提醒少步数会让参考几乎不起作用）；用 int8_convrot 模型时别开 Sage Attention。\n\n'
  + '## 通用画风句（每条提示词开头都有）\n\n> ' + STYLE + '\n\n';
for (const s of PICK) {
  const len = secs(s), gen = Math.max(MIN_REF, Math.ceil(len));
  const imgs = ['`stills/' + s.id + '_mid.png`（本镜头中间帧）', ...s.cast.map(k => '`stills/cast_' + k + '.png`（' + CAST[k].zh + '）')];
  const castLines = s.cast.map((k, i) => `Image ${i + 2} shows ${CAST[k].en}.`).join(' ');
  const prompt = [
    STYLE,
    'Image 1 is a still from this very film: copy its colours, line quality, paper texture and layout.',
    castLines,
    'Video 1 is a rough animatic of this shot: follow its exact motion, timing, staging and camera move, and keep every character looking exactly like in the images.',
    'Action: ' + s.en,
    'Do not add new characters, objects or text; keep the same set and colours as Image 1.',
  ].filter(Boolean).join('\n');
  md += `## ${s.name}（${s.t0.toFixed(2)}–${s.t1.toFixed(2)} 秒，原长 ${len.toFixed(2)} 秒）\n\n`
    + `- 中文：${s.zh}\n- Video 1：\`ref/${s.id}.mp4\`\n- 图片：${imgs.map((x, i) => `Image ${i + 1} = ${x}`).join('；')}\n- 生成秒数：**${gen}**（出来后会按原长裁剪）\n- 输出文件名：\`${s.id}.mp4\`\n\n`
    + '```text\n' + prompt + '\n```\n\n';
}
writeFileSync('h3/prompts.md', md, 'utf8');

console.log('[3/3] 打包 h3/ref_pack.zip ...');
const z = spawnSync('tar', ['-a', '-cf', 'h3/ref_pack.zip', '-C', 'h3', 'ref', 'stills', 'prompts.md'], { stdio: 'inherit' });
if (z.status !== 0) console.warn('[提示] 自动打包失败；请手动把 h3 文件夹里的 ref、stills、prompts.md 压缩后上传。');
console.log('完成。参考包在 h3\\ref_pack.zip，提示词在 h3\\prompts.md');
