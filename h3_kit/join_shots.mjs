// join_shots.mjs: 把 H3 生成的镜头拼回整片。
//   h3/out/sNN.mp4 存在 → 用 H3 的版本（裁到该镜头原长、放大到 1920x1080）
//   不存在           → 自动用原来程序手绘的那一段
// 音轨直接取原 mv 的（和之前成片完全一样）。所以只试跑 2～3 个镜头也能拼出一个完整的"混合版"。
// 用法（项目根目录）: node h3_kit/join_shots.mjs [out/aicuo_h3.mp4]
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { SHOTS, FPS, frameRange } from './shots.mjs';

const ORIG = 'out/aicuo_mv.mp4', OUT = process.argv[2] || 'out/aicuo_h3.mp4';
if (!existsSync(ORIG)) { console.error('[错误] 找不到 ' + ORIG); process.exit(1); }
mkdirSync('h3/seg', { recursive: true });

const ff = args => {
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
  if (r.status !== 0) { console.error('[错误] ffmpeg 失败：' + args.join(' ')); process.exit(1); }
};
const enc = ['-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-r', String(FPS)];
const vfBase = `fps=${FPS},scale=1920:1080:flags=lanczos,setsar=1`;

let nH3 = 0, list = '';
for (const s of SHOTS) {
  const [f0, f1] = frameRange(s), n = f1 - f0, h3 = `h3/out/${s.id}.mp4`;
  if (existsSync(h3)) {
    // H3 的片子不够长就定格最后一帧补足
    ff(['-i', h3, '-vf', vfBase + ',tpad=stop_mode=clone:stop_duration=2', '-frames:v', String(n), ...enc, `h3/seg/${s.id}.mp4`]);
    nH3++; console.log('  ' + s.id + '  ← H3');
  } else {
    ff(['-ss', (f0 / FPS).toFixed(4), '-i', ORIG, '-vf', vfBase, '-frames:v', String(n), ...enc, `h3/seg/${s.id}.mp4`]);
    console.log('  ' + s.id + '  ← 原手绘版');
  }
  list += `file '${s.id}.mp4'\n`;
}
writeFileSync('h3/seg/list.txt', list, 'utf8');

console.log('拼接并换回原曲 ...');
ff(['-f', 'concat', '-safe', '0', '-i', 'h3/seg/list.txt', '-i', ORIG, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', OUT]);
console.log(`完成：${OUT}（其中 ${nH3} 个镜头来自 H3，${SHOTS.length - nH3} 个是原手绘版）`);
