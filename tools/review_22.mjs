// Real-browser review: per-shot timing sheets, every seam/key motion, face/prop crops,
// text/geometry/camera guards, and out-of-order deterministic frame verification.
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
if (!existsSync(chrome)) throw Error('Set CHROME_PATH to Chrome');
const dir = 'out/check/review'; mkdirSync(dir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--enable-gpu-rasterization', '--disable-renderer-backgrounding'] });
const errors = [], perf = [], evidence = [];
async function pageFor() {
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.ready === true');
  await page.evaluate(() => {
    const oldPaint = paint, oldLine = inkLine;
    const pts = p => { if (!p.every(q => q.every(Number.isFinite))) throw Error('Non-finite geometry'); };
    paint = (p, o) => { pts(p); return oldPaint(p, o); };
    inkLine = (p, ...a) => { pts(p); return oldLine(p, ...a); };
    letter = sfx = () => { throw Error('Forbidden on-screen text'); };
    const oldEmote = emote;
    emote = (kind, ...a) => { if (['zzz', '?', '!', '!!', '!?'].includes(kind)) throw Error('Letter-like emote: ' + kind); return oldEmote(kind, ...a); };
    for (const shot of SHOTS) { const fn = shot[1]; shot[1] = (...a) => { fn(...a); if (CAM) throw Error('Unclosed camera'); }; }
  });
  return page;
}
function range(a,b,step) { const t=[]; for(let v=a;v<=b+.00001;v+=step) t.push(+v.toFixed(6)); return t; }
function strip(a,b) { const t=[]; for(let i=Math.round(a*24);i<=Math.round(b*24);i++) t.push(i/24); return t; }
try {
  const pages = await Promise.all([pageFor(), pageFor()]);
  const starts = await pages[0].evaluate(() => SHOTS.map(s=>s[0]));
  const ref = [0,...[2,4,6,8,10,12,14,16,18,20,22].map(k=>.34+k*4*60/92.8)];
  const at = (i,lt)=>starts[i]+lt/((ref[i+1]??62.6)-ref[i])*((starts[i+1]??62.6)-starts[i]);
  const jobs = [];
  starts.forEach((a,i)=> {
    const b=starts[i+1]??62.6;
    jobs.push({ name:`shot-${String(i+1).padStart(2,'0')}`, ts:range(a+.05,b-.02,.2), cols:6, w:320 });
    const faces = [[960,570],[750,710],[960,650],[1000,775],[1010,710],[620,690],[620,720],[1100,745],[700,620],[640,735],[640,730],[820,740]];
    const [x,y]=faces[i];
    jobs.push({name:`face-${i+1}`,ts:[a+(b-a)*.2,a+(b-a)*.52,a+(b-a)*.85],cols:3,w:420,crop:[x-230,y-220,460,440]});
    if(i>0) jobs.push({name:`seam-${i}-${i+1}`,ts:strip(a-.3,a+.3),cols:6,w:320});
  });
  const motions=[['window',at(0,2.9),at(0,5.5)],['spin',at(1,1.65),at(1,3.15)],['hug',at(1,3.9),at(1,4.65)],
    ['match',starts[5]-.6,starts[5]+.6],['pace-turns',at(7,.48),at(7,1.7)],
    ['reach-dream',at(8,3.25),at(8,4.1)],['candles',at(9,3.65),at(9,4.65)],
    ['throw',at(10,.95),at(10,2.7)],['pickup',at(10,2),at(10,3.15)],
    ['carry-turn',at(10,3.85),at(10,4.45)],['final-grip',at(11,3.15),at(11,4.05)],['final-iris',at(11,4.7),62.58]];
  for(const [name,a,b] of motions) jobs.push({name:`motion-${name}`,ts:strip(a,b),cols:6,w:320});
  jobs.push({name:'crop-pickup',ts:strip(at(10,2.15),at(10,2.85)),cols:6,w:360,crop:[350,570,520,380]});
  jobs.push({name:'crop-final-kite',ts:[at(11,3.3),at(11,4.1),at(11,4.7),62.25,62.5],cols:5,w:420,crop:[880,170,400,660]});
  const only = process.argv.find(a=>a.startsWith('--only='))?.slice(7);
  if (only) { const re=new RegExp(only); for(let i=jobs.length-1;i>=0;i--) if(!re.test(jobs[i].name)) jobs.splice(i,1); }
  let next=0;
  await Promise.all(pages.map(async page=> {
    while(next<jobs.length) {
      const job=jobs[next++];
      const result=await page.evaluate(j=>window.renderSheet(j.ts,j.cols,j.w,j.crop||null),job);
      writeFileSync(`${dir}/${job.name}.jpg`,Buffer.from(result.url.split(',')[1],'base64'));
      perf.push(...result.ms); evidence.push({name:job.name,frames:job.ts.length});
      console.log(`${job.name}: ${job.ts.length} frames`);
    }
  }));
  const hash=buf=>createHash('sha256').update(buf).digest('hex');
  const checks=[];
  for(const t of [4.6,8.05,25.95,38.08,54.52,61.87]) {
    const get=async()=>Buffer.from((await pages[0].evaluate(t=>window.renderAt(t),t)).split(',')[1],'base64');
    const before=hash(await get());
    await pages[0].evaluate(t=>window.renderAt(t),t>30?2.5:60.5);
    const after=hash(await get());
    checks.push({t,hash:before,match:before===after});
    if(before!==after) errors.push(`Nondeterministic frame at ${t}`);
  }
  const report={frames:perf.length,msMean:Math.round(perf.reduce((a,b)=>a+b,0)/perf.length),msMax:Math.max(...perf),errors,determinism:checks,evidence};
  writeFileSync(`${dir}/runtime.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify({frames:report.frames,msMean:report.msMean,msMax:report.msMax,errors,deterministic:checks.every(c=>c.match)}));
  if(errors.length) process.exitCode=1;
} finally { await browser.close(); }
