const fs=require('fs'), vm=require('vm');
const errs=new Map(); const note=(m)=>{ errs.set(m,(errs.get(m)||0)+1); };
const hexOK=c=>typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c);
const fin=(v,w)=>{ if(typeof v==='number'&&!isFinite(v)) note('NaN/Inf in '+w); };
const chkPts=(p,w)=>{ if(!Array.isArray(p)||p.length<2){note('bad pts '+w);return;} for(const q of p){ if(!Array.isArray(q)||q.length<2||!isFinite(q[0])||!isFinite(q[1])){note('NaN pt in '+w);return;} } };
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>x*x*(3-2*x), easeIn=x=>x*x, easeOut=x=>1-(1-x)*(1-x), backOut=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
const seg=(t,a,b)=>{ if(b===a) note('seg a==b'); return clamp((t-a)/(b-a)); };
const lerp=(a,b,k)=>a+(b-a)*k;
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mixCol=(a,b,k)=>{ if(!hexOK(a)||!hexOK(b)){note('mixCol bad colour '+a+' '+b);return '#888888';} if(!(k>=0&&k<=1)) note('mixCol k out of 0..1: '+k); const A=hx(a),B=hx(b); return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],clamp(k))).toString(16).padStart(2,'0')).join(''); };
const PAL={paper:'#F3EBDD',ink:'#2B2623',clay:'#C96F4F',clayDk:'#A5553A',clayLt:'#E0917A',night:'#1C2347',indigo:'#2E3A78',rose:'#E58F9C',ochre:'#D9A441',sap:'#7FA860',teal:'#4F9C93',violet:'#6C5BA8',cream:'#FBF3DF',sky:'#BFE3F2'};
const BR=new Set(['ink','inkfine','dry','2B','HB','charcoal','marker','pen','cpencil','rotring','spray']);
const PO=new Set(['wash','washOp','fill','fillOp','bleed','tex','border','hatch','ink','sw','br','curv']);
let cam=0, stack=0, hooksCalled=0;
const EMOS=new Set('happy excited laugh love proud starstruck playful hopeful relieved smug cool mischief suspicious sad cry bored sleepy ko angry furious determined disgusted scared nervous surprised confused dizzy neutral thinking idea shy'.split(' '));
const EYES=new Set('normal look wide happy closed sleepy wink narrow angry determined sad teary cry squeeze shine scared blank spark red heart x swirl dot shades'.split(' '));
const MOUTHS=new Set('o O smile grin flat wobble cat frown smirk laugh open wail teeth tongue pout yawn'.split(' '));
const COPT=new Set('dx dy sq rot flip sx sy aL aR walk noLegs noShadow view smear smearDir eyes mouth lookX lookY squint blush gloom lid seed tint tintK col dk lt hat emote emoteK emoteAge draw armL armR boilKey'.split(' '));
const G={
 PAL, W:1920, H:1080, TAU:Math.PI*2, BEAT:60/92.8, PROJECT:{duration:62.6,bpm:92.8,offset:.34,audio:'assets/22.mp3'},
 clamp, ease, easeIn, easeOut, backOut, seg, lerp, mixCol,
 pulse:(t,k=6)=>Math.exp(-((t-.34)/(60/92.8)-Math.floor((t-.34)/(60/92.8)))*k),
 hash:i=>{ fin(i,'hash'); const x=Math.sin(i*127.1+311.7)*43758.5453; return x-Math.floor(x); },
 jit:a=>0, random:()=>.5, boilSeed:k=>{ if(k===undefined||k===null) note('boilSeed no key'); },
 kf:(t,pts,e)=>{ fin(t,'kf t'); if(t<=pts[0][0])return pts[0][1]; for(let i=1;i<pts.length;i++){ if(t<=pts[i][0]){ let k=(t-pts[i-1][0])/(pts[i][0]-pts[i-1][0]); if(e)k=e(clamp(k)); return lerp(pts[i-1][1],pts[i][1],k);} } return pts[pts.length-1][1]; },
 arcPt:(a,b,h,k)=>{ chkPts([a,b],'arcPt'); fin(k,'arcPt k'); return [lerp(a[0],b[0],k), lerp(a[1],b[1],k)-h*4*k*(1-k)]; },
 rectPts:(x,y,w,h)=>{[x,y,w,h].forEach(v=>fin(v,'rectPts')); return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];},
 rrPts:(x,y,w,h,r,j)=>{[x,y,w,h,r].forEach(v=>fin(v,'rrPts')); if(w<=0||h<=0)note('rrPts nonpositive size'); return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];},
 ellPts:(cx,cy,rx,ry,n,j,rot)=>{[cx,cy,rx,ry,n].forEach(v=>fin(v,'ellPts')); if(rx<0||ry<0)note('ellPts negative radius'); return Array.from({length:n||24},(_,i)=>[cx+rx*Math.cos(i),cy+ry*Math.sin(i)]);},
 starPts:(cx,cy,r)=>[[cx,cy],[cx+r,cy],[cx,cy+r]], heartPts:(cx,cy,r)=>[[cx,cy],[cx+r,cy],[cx,cy+r]],
 ribbon:(P,w0,w1)=>{ chkPts(P,'ribbon'); fin(w0,'ribbon');fin(w1,'ribbon'); return P.concat(P.slice().reverse()); },
 paint:(pts,o={})=>{ chkPts(pts,'paint'); for(const k in o){ if(!PO.has(k)) note('paint unknown option '+k); } for(const k of ['wash','fill']) if(o[k]!==undefined&&!hexOK(o[k])) note('paint bad colour '+k+'='+o[k]); if(o.ink!==undefined&&o.ink!==null&&!hexOK(o.ink)) note('paint bad ink '+o.ink); ['washOp','fillOp','sw','bleed','tex'].forEach(k=>{ if(o[k]!==undefined) fin(o[k],'paint '+k); }); if(o.washOp>255||o.washOp<0) note('washOp range '+o.washOp); },
 inkLine:(pts,sw,col,br,cv)=>{ chkPts(pts,'inkLine'); fin(sw,'inkLine sw'); if(!(sw>0)) note('inkLine sw<=0 '+sw); if(!hexOK(col)) note('inkLine bad colour '+col); if(br&&!BR.has(br)) note('inkLine brush '+br); if(cv!==undefined) fin(cv,'inkLine curv'); },
 glow:(x,y,r,c,a)=>{[x,y,r,a].forEach(v=>fin(v,'glow')); if(!hexOK(c))note('glow bad colour '+c); if(r<=0)note('glow r<=0'); },
 push:()=>{stack++;}, pop:()=>{stack--; if(stack<0)note('pop without push');}, translate:(x,y)=>{fin(x,'translate');fin(y,'translate');}, rotate:a=>fin(a,'rotate'),
 camBegin:(x,y,z,r)=>{ [x,y,z].forEach(v=>fin(v,'camBegin')); if(!(z>0))note('zoom<=0'); if(cam)note('nested camBegin'); cam=1; }, camEnd:()=>{ if(!cam)note('camEnd without begin'); cam=0; },
 toScreen:(x,y)=>{ if(!cam)note('toScreen outside camera'); fin(x,'toScreen');fin(y,'toScreen'); return [x,y]; },
 iris:(x,y,r,c)=>{ if(cam)note('iris inside camera'); [x,y,r].forEach(v=>fin(v,'iris')); if(r<0)note('iris r<0 '+r); if(c!==undefined&&!hexOK(c))note('iris colour'); },
 brushWipe:(p,cols)=>{ if(cam)note('brushWipe inside camera'); fin(p,'brushWipe'); if(p<0||p>1)note('brushWipe p out of range '+p); if(cols) cols.forEach(c=>{ if(!hexOK(c))note('wipe colour '+c); }); },
 flash:(k,c)=>{ if(cam)note('flash inside camera'); fin(k,'flash'); if(c&&!hexOK(c))note('flash colour'); },
 stroll:(t,t0,t1,x0,x1,u)=>{ [t,t0,t1,x0,x1,u].forEach(v=>fin(v,'stroll')); if(t1<=t0)note('stroll t1<=t0'); const k=ease(seg(t,t0,t1)); return {x:lerp(x0,x1,k),walk:t*3,view:'q',flip:x1<x0,dy:0}; },
 jump:(t,t0,t1,h)=>{ [t,t0,t1,h].forEach(v=>fin(v,'jump')); if(t1<=t0)note('jump t1<=t0'); return {dy:-h*Math.sin(Math.PI*seg(t,t0,t1)),sq:0}; },
 turn:(t,t0,t1,a0,a1)=>{ [t,t0,t1,a0,a1].forEach(v=>fin(v,'turn')); if(t1<=t0)note('turn t1<=t0'); return {view:'q'}; },
 spinView:a=>{ fin(a,'spinView'); if(a<0||a>=1.0001)note('spinView out of 0..1 '+a); return {view:'q'}; },
 emotions:(t,keys,o)=>{ fin(t,'emotions t'); let last=-1e9; for(const k of keys){ fin(k[0],'emotions key time'); if(!EMOS.has(k[1]))note('unknown emotion '+k[1]); if(k[0]<last)note('emotion keys out of order'); last=k[0]; if(k[2]) for(const f in k[2]) if(!COPT.has(f)&&f!=='emote')note('emotion override field '+f); } return {dy:0,sq:0,aL:.2,aR:.2,eyes:'normal',mouth:null}; },
 clawd:(x,y,u,o={})=>{ [x,y,u].forEach(v=>fin(v,'clawd xyu')); if(u<10)note('tiny Clawd u='+u); for(const k in o){ if(!COPT.has(k))note('clawd unknown option '+k); else if(typeof o[k]==='number') fin(o[k],'clawd.'+k); } if(o.view&&!['front','q','side','qback','back'].includes(o.view))note('bad view '+o.view); for(const e of [].concat(o.eyes||[])) if(e&&!EYES.has(e))note('bad eyes '+e); if(o.mouth&&!MOUTHS.has(o.mouth))note('bad mouth '+o.mouth); if(o.tint&&!hexOK(o.tint)&&!['pale','flush','blue','rosy','green','gold'].includes(o.tint))note('bad tint '+o.tint); if(o.tint&&o.tintK===undefined)note('tint without tintK'); for(const h of ['draw','armL','armR']) if(o[h]){ stack=0; o[h](u,1); hooksCalled++; if(stack!==0)note('unbalanced push/pop in hook '+h); } },
 shots:l=>{ G._shots=l; },
};
const ctx=vm.createContext(G);
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..','src','scenes','22.js'),'utf8'),ctx,{filename:'scene.js'});
const L=G._shots; const total=62.6; let frames=0;
if(L.length!==12) note('shot count '+L.length);
for(let s=0;s<L.length;s++){
  const a=L[s][0], b=s+1<L.length?L[s+1][0]:total, dur=b-a;
  const steps=Math.ceil(dur*24);
  for(let f=0;f<steps;f++){ const lt=f/24, t=a+lt; cam=0; stack=0;
    try{ L[s][1](t,lt,dur); frames++; if(cam)note('camera left open in shot '+(s+1)); if(stack)note('push/pop unbalanced shot '+(s+1)); }
    catch(e){ note('THROW shot '+(s+1)+' @lt='+lt.toFixed(2)+': '+e.message); break; } }
  console.log('shot',s+1,'start',a.toFixed(2),'dur',dur.toFixed(2));
}
console.log('frames',frames,'hooks',hooksCalled);
if(!errs.size) console.log('NO PROBLEMS FOUND'); else { for(const [m,c] of errs) console.log('PROBLEM x'+c+':',m); process.exitCode=1; }
