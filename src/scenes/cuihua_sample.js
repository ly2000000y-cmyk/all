// Original adaptation of the user's timed lyrics. This file contains only the
// 12.00–25.50s review sample, not the whole music video.
(() => {
  const C = { paper:'#F3EBDC', ink:'#383448', soil:'#C7AF82', hill:'#BCC49A', leaf:'#759568', water:'#9FB9B6', orange:'#D58A68', green:'#8BA98C', cool:'#DCE3DF' };
  const F = (pts,col,o={}) => paint(pts,{wash:col,ink:null,...o});
  const L = (pts,sw=1,col=C.ink,curv=.4) => inkLine(pts,sw,col,'inkfine',curv);
  const GLOBAL = t=>t+12;

  function tree(t,x,y,s=1,cold=0,grow=0) {
    boilSeed('tree'+x);push();translate(x,y);scale(s);
    const w=48+grow*30;
    F([[-w,30],[-w*.7,-160],[-w*.5,-345],[-26,-425],[12,-437],[w*.45,-290],[w*.8,-140],[w,30]],mixCol('#987964','#75827B',cold),{ink:C.ink,sw:1.1});
    L([[-3,-275],[-86,-345],[-126,-398]],1.1);L([[10,-220],[94,-318],[130,-378]],1.1);
    const leafCol=mixCol(C.leaf,'#8D9F99',cold);
    for(let i=0;i<6;i++){
      boilSeed('tree canopy '+x+' '+i);
      F(ellPts((i%3-1)*113,-425-Math.floor(i/3)*82,145,91,16,5),leafCol,{fill:mixCol(leafCol,C.paper,.25),fillOp:80,bleed:.12,tex:.55});
    }
    for(let i=0;i<4;i++)L([[-120+i*74,-386],[-146+i*81+7*Math.sin(t*.8+i),-445]],.6,mixCol(leafCol,C.ink,.25));
    pop();
  }
  function ground(t,cold=0,bridge=false,grow=0) {
    boilSeed('sky');F(rectPts(-240,-160,W+480,H+320),mixCol('#F6E8CE',C.cool,cold));
    boilSeed('far wash');F(ellPts(1040,400,1160,360,26,6),mixCol('#DDDAB8','#B9CCCA',cold),{fill:mixCol('#EFD4A2','#BFCFD3',cold),fillOp:100,bleed:.20,tex:.60});
    boilSeed('distant hills');F([[-250,625],[150,440],[460,510],[720,390],[1050,485],[1370,395],[2020,540],[2100,920],[-250,920]],mixCol('#AAB99A','#91AAA9',cold),{curv:.42});
    boilSeed('soil');F(rectPts(-250,675,W+500,700,7),mixCol(C.soil,'#B8C4BD',cold));
    if(bridge){
      boilSeed('creek');F([[-100,849],[220,800],[550,823],[900,852],[1420,895],[2000,879],[2100,1220],[-100,1220]],mixCol(C.water,'#9EB5BF',cold),{curv:.4});
      for(let i=0;i<7;i++){boilSeed('ripple'+i);let yy=935+i*25;L([[210+i*150+Math.sin(t+i)*9,yy],[280+i*153,yy-3],[340+i*150,yy]],.6,'#DDE3D9');}
      boilSeed('bridge');F(rectPts(190,789,1530,64,4),'#B7A792',{ink:'#6E726E',sw:1});
      for(let i=0;i<11;i++)L([[220+i*137,794],[225+i*137,849]],.65,'#838780');
      for(const x of [280,1620]){F(rectPts(x,704,24,118,1),'#9C9985',{ink:'#6E726E',sw:.8});}
      L([[292,719],[845,728],[1630,719]],2.0,'#AAA694');
    }
    tree(t,245,760,.83,cold,grow);
    if(!bridge){
      for(let i=0;i<8;i++){
        boilSeed('vine'+i);const x=390+i*175, yy=895+(i%2)*85;
        L([[x-65,yy],[x,yy-12],[x+55,yy+9],[x+105,yy-5]],1,'#7E9360');
        F(ellPts(x-22,yy-18,35,12,12,1,-.55),C.leaf);F(ellPts(x+65,yy-1,29,11,12,1,.4),C.leaf);
        if(i!==3)melon(x+40,yy+4,28, i*.1);
      }
    }
    for(let i=0;i<10;i++){
      boilSeed('grass'+i);let x=80+i*200,yy=bridge?958:1015;
      L([[x,yy],[x+4*Math.sin(t+i),yy-28]],.7,mixCol(C.leaf,'#8DA59E',cold));
      L([[x,yy],[x-13+3*Math.sin(t*.8+i),yy-19]],.7,mixCol(C.leaf,'#8DA59E',cold));
    }
  }
  function melon(x,y,r,rot=0) {
    push();translate(x,y);rotate(rot);
    F(ellPts(0,0,r,r*.84,24,r*.015),'#70966A',{ink:'#3C5E51',sw:.9});
    for(let j=-1;j<=1;j++)L([[j*r*.42,-r*.75],[j*r*.50-r*.09,-r*.3],[j*r*.50+r*.06,r*.3],[j*r*.42,r*.74]],r/35,'#476D55',.45);
    L([[r*.1,-r*.83],[r*.22,-r*.95],[r*.43,-r*.91]],.7,'#526C50');
    pop();
  }
  function clothes(kind,old,view) {
    return (u,sw)=>{
      boilSeed('clothes '+kind);
      const side=view==='side',left=side?-2.9:-4.8,width=side?5.8:9.6;
      F(rectPts(left*u,-2.85*u,width*u,.77*u,.05*u),kind==='boy'?'#617A8B':old?'#BDC7BC':'#CFD8B3',{ink:null});
      if(kind==='boy'&&!old){
        const legs=side?[-2.6,.9]:[-4,-2,1,3];
        for(const xx of legs)F(rectPts((xx-.05)*u,-.57*u,1.03*u,.37*u,.02*u),'#EDE2C6');
      }
    };
  }
  function person(kind,x,gy,u,t,mood,pose={},old=false) {
    const view=pose.view||'front';
    clawd(x,gy,u,{...mood,tintK:.20,noShadow:false,hat:kind==='girl'?'flower':null,
      col:kind==='boy'?C.orange:kind==='girl'?(old?'#9FAFA2':C.green):'#C7A879',
      dk:kind==='boy'?'#A56950':kind==='girl'?'#748A79':'#A28C67',
      lt:kind==='boy'?'#EDB392':kind==='girl'?'#C6D4B9':'#DFC8A6',
      draw:clothes(kind,old,view),boilKey:kind,...pose});
  }
  function leaf(t,i,cold=0,spread=1) {
    boilSeed('travelling leaf'+i);
    const p=frac(t*.30+i*.173),x=-250+p*2400,y=140+(i%4)*180+85*Math.sin(p*TAU+i);
    push();translate(x,y);rotate(p*7+i);
    F(ellPts(0,0,(36+i%3*10)*spread,(12+i%3*3)*spread,12,1),mixCol('#D9AE5F','#A5B5AA',cold),{ink:null});pop();
  }
  function handPoint(x,gy,u,o,which='R',offset=.55) {
    const V=VIEWS[o.view]||VIEWS.front;
    const arm=V.arms.find(a=>a[2]===which)||V.arms[0];
    const [px,dir]=arm,a=which==='L'?(o.aL??.2):(o.aR??.2);
    const sq=o.sq||0,sm=clamp(o.smear||0);
    let ax=(px+dir*.55*clamp((Math.abs(a)-.7)/.9))*u,ay=-4.5*u,ang,tip;
    if(dir===0){ay+=.3*u;ang=.7-a;tip=(2.1+offset)*u;}
    else{ang=dir<0?a:-a;tip=dir*(2.2+offset)*u;}
    ax+=Math.cos(ang)*tip;ay+=Math.sin(ang)*tip;
    ax*=((o.flip?-1:1)*(1+sq*.6)*(1+sm*.35));ay*=1-sq;
    const r=o.rot||0;
    return [x+(o.dx||0)*u+ax*Math.cos(r)-ay*Math.sin(r),gy+(o.dy||0)*u+ax*Math.sin(r)+ay*Math.cos(r)];
  }
  function opening(lt) {
    if(lt<.30)iris(975,760,lerp(0,1600,easeIn(lt/.30)),C.paper);
  }

  // Read 1: check the path; read 2: the heavy melon; read 3: shared delight.
  function steal(t,lt,dur) {
    camBegin(962+10*Math.sin(lt*.65),552,1.015+lt*.006);
    ground(t);
    const gy=870,u=40, lift=seg(lt,.92,1.78);
    const boyMood=emotions(lt,[[0,'nervous',{lookX:.8}],[.70,'determined'],[2.12,'proud']],{take:.62});
    const girlMood=emotions(lt,[[0,'mischief',{lookX:-.8}],[1.95,'playful']],{take:.52});
    const crouch=.32*Math.sin(Math.PI*seg(lt,.45,1.90));
    const ready=seg(lt,2.62,3.35),x=820+105*ease(ready);
    const a=lerp(-1.08,.28,easeOut(lift));
    const boyPose={sq:(boyMood.sq||0)+crouch,dy:(boyMood.dy||0)*.25,aR:a,aL:-.13,rot:-.04+.07*ready};
    person('boy',x,gy,u,t,boyMood,boyPose);
    const target=handPoint(x,gy,u,{...boyMood,...boyPose},'R');
    const reach=ease(seg(lt,.87,1.42));
    boilSeed('picked melon');melon(lerp(1094,target[0],reach),lerp(844,target[1],reach),58,.08-.18*reach);
    person('girl',1540-30*ready,gy,u*.94,t,girlMood,{aL:.38,aR:.74+.2*Math.sin(t*3),lookX:-.6,rot:-.025});
    camEnd();opening(lt);
  }
  // Cause, then take, then alternating strides. The melon is attached to the arm hook.
  function caught(t,lt,dur) {
    camBegin(1000+40*ease(seg(lt,.6,dur)),552,1.035);
    ground(t);
    const gy=870, u=40, start=.50;
    const dash=seg(lt,start,2.25), bx=925+400*ease(dash),gx=1510+400*ease(dash);
    const step=lt>start?(lt-start)*3:0;
    const bm=emotions(lt,[[0,'proud'],[.20,'surprised'],[.56,'scared']],{take:.70});
    const gm=emotions(lt,[[0,'playful'],[.32,'surprised'],[.72,'nervous']],{take:.60});
    const dm=emotions(lt,[[0,'suspicious'],[.28,'angry'],[1.40,'confused']],{take:.52});
    person('dad',420+50*ease(seg(lt,0,.45)),gy,45,t,dm,{hat:null,aR:.24,aL:-.15,lookX:.9,
      draw:(uu,sw)=>{
        F(ellPts(0,-8.9*uu,3.75*uu,1.25*uu,20,.035*uu),'#CAB281',{ink:C.ink,sw:.9});
        F(ellPts(0,-8.25*uu,6.25*uu,.52*uu,24,.04*uu),'#D9C69A',{ink:C.ink,sw:.9});
        F([[-2.8*uu,-4.5*uu],[-1.5*uu,-4.2*uu],[0,-4.55*uu],[1.5*uu,-4.2*uu],[2.8*uu,-4.5*uu],[1.5*uu,-3.8*uu],[0,-4.05*uu],[-1.5*uu,-3.8*uu]],'#E3DDC9',{ink:null});}});
    const facing=turn(lt,.45,.68,0,.25);
    const boyPose={...facing,walk:step,dy:(bm.dy||0)*.45-.18*Math.abs(Math.sin(step*TAU)),aL:.10,aR:.22,sq:(bm.sq||0)*.45};
    person('boy',bx,gy,u,t,bm,boyPose);
    // The carried object moves continuously through the drawn turn, with the
    // far hand visible before profile and the near hand visible afterwards.
    const fhand=handPoint(bx,gy,u,{...bm,...boyPose,view:'front'},'R');
    const shand=handPoint(bx,gy,u,{...bm,...boyPose,view:'side'},'L',.22);
    const transfer=ease(seg(lt,.45,.68));
    boilSeed('carried melon');melon(lerp(fhand[0],shand[0],transfer),lerp(fhand[1],shand[1],transfer),58,-.1);
    person('girl',gx,gy,u*.94,t,gm,{...turn(lt,.62,.84,0,.25),walk:Math.max(0,step-.18),dy:(gm.dy||0)*.50-.19*Math.abs(Math.sin((step-.18)*TAU)),aL:.24,aR:-.30});
    if(lt>dur-.55)for(let i=0;i<5;i++)leaf(t+i*.2,i,0,1+1.8*seg(lt,dur-.55,dur));
    camEnd();
    if(lt>dur-.24){boilSeed('seasons seam');F(rectPts(-100,-100,W+200,H+200),C.paper,{washOp:255*ease(seg(lt,dur-.24,dur))});}
  }
  // A single read: the shared place changes while years pass.
  function years(t,lt,dur) {
    const k=ease(lt/dur), cold=seg(lt,.9,dur-.15);
    camBegin(960,560,1.03+.026*lt);
    ground(t,cold,true,k);
    for(let i=0;i<10;i++)leaf(t+lt*.8+i*.3,i,cold,1+.7*Math.sin(k*Math.PI));
    boilSeed('years colour wash');
    if(lt<.45)F(rectPts(-200,-200,W+400,H+400),C.paper,{washOp:255*(1-ease(lt/.45))});
    camEnd();
    // The final leaf sweep creates the seam into the colder bridge shot.
    if(lt>dur-.24)brushWipe((lt-(dur-.24))/.48,['#B7C8C1','#DCE3DF']);
  }
  function caseBag(x,y,t) {
    boilSeed('case');F(rrPts(x-50,y-115,100,112,12,1),'#BCABA0',{ink:'#667875',sw:.8});
    L([[x-19,y-115],[x-19,y-131],[x+19,y-131],[x+19,y-115]],1,'#667875',0);
    L([[x-26,y-104],[x-26,y-10]],.6,'#8F9488');
  }
  function reunion(t,lt,dur) {
    camBegin(963,557,1.06+lt*.009);
    ground(t,1,true,1);
    const gy=798,u=43;
    const offer=seg(lt,2.35,2.9),withdraw=seg(lt,3.32,4.08),foot=offer*(1-withdraw);
    const bx=630+45*ease(seg(lt,.15,1.1));
    const bm=emotions(lt,[[0,'hopeful',{lookX:.7}],[1.45,'confused',{lookX:.7}],[3.0,'sad',{lookX:.2}]],{take:.35});
    const gm=emotions(lt,[[0,'shy',{lookX:-.6}],[2.55,'sad',{lookX:-.2,lookY:.8}]],{take:.25});
    // Foreground foot is drawn as a joined leg, ending at its actual ground contact.
    const view='front';
    person('boy',bx,gy,u,t,bm,{view,dy:(bm.dy||0)*.18,aL:-.15,aR:.15-.18*withdraw,rot:.02,stepOffer:foot,emote:null},true);
    caseBag(1710,gy,t);
    person('girl',1370+35*ease(seg(lt,3.25,4.8)),gy,u*.94,t,gm,{aL:lt<2.1?.38+.12*Math.sin(lt*4):lerp(.45,-.42,ease(seg(lt,2.15,3.25))),aR:-.55,emote:null,
      rot:-.022,lookX:lt<2.8?-.6:0,lookY:lt<2.6?-.05:.65,
      ... (lt>4.3?turn(lt,4.3,4.65,0,.125):{})},true);
    camEnd();
    if(lt<.24)brushWipe(.5+lt/.48,['#B7C8C1','#DCE3DF']);
    // Sample-only exit; the approved whole MV will continue into the next shot.
    if(!window.CUIHUA_FULL && lt>dur-.42)iris(1060,650,lerp(1550,0,ease(seg(lt,dur-.42,dur-.10))),C.paper);
  }
  window.CUIHUA_SAMPLE = { steal, caught, years, reunion, ground, tree, melon, person, leaf, handPoint, caseBag };
  if(!window.CUIHUA_FULL) shots([[0,steal],[3.35,caught],[5.75,years],[8.10,reunion]]);
})();
