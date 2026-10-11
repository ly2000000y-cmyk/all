import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('.', import.meta.url)));
function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
if (!process.argv.includes('--encode-only')) {
  run(process.execPath, ['render.mjs', '--frames', '--workers=3', ...process.argv.slice(2)]);
}
mkdirSync('outputs', { recursive: true });
// Limit the image input while preserving every sample of the original soundtrack.
run(process.env.FFMPEG_PATH || 'ffmpeg', [
  '-y', '-hide_banner', '-loglevel', 'error', '-stats',
  '-framerate', '24', '-start_number', '0', '-t', '62.875', '-i', 'out/frames/f%05d.jpg',
  '-i', 'assets/cuihua.mp3', '-map', '0:v:0', '-map', '1:a:0',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2',
  '-movflags', '+faststart', '-metadata', 'title=翠花 MV',
  'outputs/翠花_MV_完整成片.mp4'
]);
