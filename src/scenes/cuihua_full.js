// Full-song continuation of the approved Cuihua sample. All shots are pure
// functions of song time so the renderer can draw frames out of order.
(() => {
  const S = window.CUIHUA_SAMPLE;
  const C = { paper:'#F3EBDC', ink:'#383448', soil:'#C7AF82', hill:'#AAB99A', leaf:'#759568', water:'#9FB9B6', orange:'#D58A68', green:'#8BA98C', cool:'#DCE3DF', red:'#B74F3D' };
  const F = (pts,col,o={}) => paint(pts,{wash:col,ink:null,...o});
  const L = (pts,sw=1,col=C.ink,curv=.4) => inkLine(pts,sw,col,'inkfine',curv);
  const shade = (a,b,k) => mixCol(a,b,k);

  function rural(t,cold=0,road=false) {
    boilSeed('full-sky');F(rectPts(-120,-120,W+240,H+240),shade('#F7E8CE',C.cool,cold));
    boilSeed('far mountain');F([[-200,650],[60,430],[320,500],[590,360],[845,492],[1110,376],[1440,510],[1710,392],[2070,525],[2120,850],[-200,850]],shade('#B1BE9D','#9CADAA',cold),{curv:.4});
    boilSeed('near hill');F([[-180,670],[165,563],[455,642],[790,510],[1100,630],[1410,530],[1800,625],[2090,555],[2110,930],[-180,930]],shade('#87996F','#8EA5A0',cold),{curv:.45});
    // Small stilt houses and a winding ochre road make the village legible at a glance.
    for(let i=0;i<4;i++){
      const x=180+i*450,y=515+(i%2)*58,s=.78+(i%3)*.10;
      boilSeed('stilt-house'+i);
      F([[x-100*s,y],[x-62*s,y-78*s],[x+12*s,y-119*s],[x+94*s,y-75*s],[x+112*s,y]],shade('#C28C68','#A6AFA5',cold),{ink:C.ink,sw:1});
      F(rectPts(x-80*s,y-2,165*s,84*s,2),shade('#D9B783','#B7C3BE',cold),{ink:C.ink,sw:1});
      for(let j=0;j<4;j++)L([[x-69*s+j*42*s,y+63],[x-68*s+j*42*s,y+166]],1,shade('#84735B','#7B8A87',cold));
      F(rectPts(x-99*s,y+151,205*s,11*s,1),shade('#8D7B61','#72827F',cold));
      F(rectPts(x-10*s,y+19,45*s,38*s,1),shade('#A5AF91','#94AAA8',cold),{ink:C.ink,sw:.7});
    }
    boilSeed('rural foreground');F(rectPts(-200,780,W+400,430,4),shade('#C9B488','#B9C4BE',cold));
    if(road){
      F([[-100,1010],[250,838],[525,770],[615,772],[360,915],[-100,1150]],shade('#E5C998','#CCD2C9',cold),{curv:.38});
      for(let i=0;i<7;i++){const x=45+i*72,y=965-i*22;L([[x,y],[x+24,y-6]],.8,'#B19A72');}
    }
    S.tree(t,1800,780,.60,cold,.35);S.tree(t,87,790,.55,cold,.22);
    for(let i=0;i<9;i++){
      boilSeed('village grass'+i);const x=90+i*220,y=936+(i%3)*17;
      L([[x,y],[x+3*Math.sin(t+i),y-22]],.75,shade(C.leaf,'#92A7A0',cold));
      L([[x,y],[x-12,y-15]],.65,shade(C.leaf,'#92A7A0',cold));
    }
  }
  function kiosk(t,cold=0){
    rural(t,cold,true);
    const x=1320,y=500;
    boilSeed('kiosk shadow');F(ellPts(1500,843,354,35,32,3),'#756A52',{fill:'#6F695B',fillOp:75,ink:null});
    boilSeed('kiosk walls');F(rectPts(x,y,410,315,3),shade('#D8B984','#B8C2BD',cold),{ink:C.ink,sw:1.5});
    F([[x-30,y+8],[x+180,y-126],[x+455,y+2],[x+427,y+24],[x+185,y-77],[x-14,y+31]],shade('#B47759','#91A3A0',cold),{ink:C.ink,sw:1.4});
    F(rectPts(x+49,y+76,280,137,2),shade('#5E574A','#71817F',cold),{ink:C.ink,sw:1.2});
    // The shelves hold quiet color blocks; no lettering or product branding.
    for(let row=0;row<2;row++){
      L([[x+65,y+143+row*48],[x+316,y+143+row*48]],2,shade('#D5C39C','#B5C2BD',cold));
      for(let j=0;j<6;j++){
        const bx=x+77+j*39,by=y+104+row*48;
        F(rectPts(bx,by,20,34,1),[shade('#C96E4D','#889995',cold),shade('#D7B467','#94A9A2',cold),shade('#86936C','#A1B0A9',cold)][(j+row)%3],{ink:null});
      }
    }
    F(rectPts(x-15,y+222,440,20,1),shade('#A57453','#879692',cold),{ink:C.ink,sw:1});
    for(let i=0;i<5;i++)L([[x+27+i*93,y+244],[x+18+i*95,y+344]],1,shade('#A7825E','#849491',cold));
    F(rectPts(x-25,y+332,466,13,1),shade('#8D7358','#778B87',cold),{ink:C.ink,sw:.8});
  }
  function pack(x,y,s=1,tilt=0){
    push();translate(x,y);rotate(tilt);boilSeed('plain red packet');
    F(rectPts(-28*s,-42*s,56*s,84*s,3*s),C.red,{ink:C.ink,sw:1.25});
    F(rectPts(-23*s,-11*s,46*s,22*s,1*s),'#E8D9B8',{ink:null});
    L([[-19*s,-35*s],[18*s,-35*s]],.6,'#D58E74');pop();
  }
  function coin(x,y,r=11){F(ellPts(x,y,r,r,18,1),'#D9AC56',{ink:'#805D34',sw:.8});L([[x-r*.45,y],[x+r*.45,y]],.55,'#F1D69A');}
  function motorbike(t,x,y,s=1){
    const spin=t*5.8;
    for(const wx of [x-145*s,x+125*s]){
      boilSeed('wheel'+wx);F(ellPts(wx,y,62*s,62*s,36,1),'#49464A',{fill:'#726C62',fillOp:105,ink:C.ink,sw:2});
      F(ellPts(wx,y,43*s,43*s,28,1),'#D6C8A8',{fill:'#858982',fillOp:70,ink:'#565651',sw:1.2});
      F(ellPts(wx,y,10*s,10*s,16,0),'#9C947D',{ink:C.ink,sw:.8});
      for(let j=0;j<6;j++){const a=spin+j*Math.PI/3;L([[wx+Math.cos(a)*12*s,y+Math.sin(a)*12*s],[wx+Math.cos(a+Math.PI)*40*s,y+Math.sin(a+Math.PI)*40*s]],.8,'#78766D');}
    }
    L([[x-145*s,y],[x-54*s,y-72*s],[x+34*s,y-12*s],[x+125*s,y]],5*s,'#3F4141',.12);
    L([[x-54*s,y-72*s],[x+12*s,y-86*s],[x+91*s,y-40*s],[x+34*s,y-12*s]],4*s,'#A55F45',.1);
    F([[x-57*s,y-93*s],[x+25*s,y-105*s],[x+65*s,y-76*s],[x+16*s,y-65*s],[x-45*s,y-71*s]],'#C7684C',{ink:C.ink,sw:1.1});
    F(rectPts(x-46*s,y-111*s,84*s,12*s,2*s),'#38383A',{ink:C.ink,sw:1});
    L([[x+45*s,y-74*s],[x+102*s,y-112*s],[x+130*s,y-108*s]],2*s,'#4A4844');
    L([[x+102*s,y-112*s],[x+120*s,y-132*s],[x+143*s,y-132*s]],2*s,'#5A5751');
    F(ellPts(x+54*s,y-52*s,23*s,16*s,20,1),'#8E8A75',{ink:C.ink,sw:1});
    L([[x-12*s,y-34*s],[x-78*s,y-2*s],[x-122*s,y-2*s]],3*s,'#58524B');
    F(ellPts(x+132*s,y-18*s,11*s,10*s,16,1),'#E3BC73',{ink:'#67593F',sw:.8});
  }
  function seamOut(lt,dur){if(lt>dur-.24)brushWipe((lt-(dur-.24))/.48,['#D5B57D','#F3EBDC']);}
  function seamIn(lt){if(lt<.24)brushWipe(.5+lt/.48,['#D5B57D','#F3EBDC']);}
  function dust(x,y,t,k=1){for(let i=0;i<4;i++){const q=frac(t*.9+i*.25),xx=x+q*130,yy=y-18*Math.sin(q*Math.PI)-i*10;F(ellPts(xx,yy,7+5*(1-q),4+3*(1-q),12,1),'#E9D6B5',{fill:'#F4E7CE',fillOp:40,ink:null});}}

  // 0.00–3.95 — a boast about the village turns into a real invitation.
  function heard(t,lt,dur){
    camBegin(960+8*Math.sin(lt*.7),550,1.0);
    rural(t,0,true);
    const friend=emotions(lt,[[0,'happy'],[1.25,'proud'],[2.4,'playful']],{take:.5});
    const boy=emotions(lt,[[0,'neutral',{lookX:.7}],[.65,'surprised'],[1.75,'hopeful'],[3.1,'determined']],{take:.55});
    S.person('boy',670-45*ease(seg(lt,1.2,3.2)),860,40,t,boy,{view:lt<2.2?'front':'q',flip:lt>=2.2,aL:-.12,aR:.20,rot:-.015});
    S.person('girl',1460,868,38,t,friend,{flip:true,view:'q',aL:.68,aR:.16,lookX:-.8,rot:.025});
    // A little pointing gesture carries the off-screen bragging energy without dialogue cards.
    const bx=1110,by=735;L([[bx,by],[bx+105,by-74],[bx+173,by-79]],2.2,'#68523E');
    F(starPts(bx+186,by-80,15,.56,5,-Math.PI/2),'#DBA747',{ink:null});
    for(let i=0;i<4;i++)S.leaf(t+i*.6,i,0,.62);
    camEnd();
    if(lt<.30)iris(965,600,lerp(0,1660,ease(lt/.30)),C.paper);
    seamOut(lt,dur);
  }
  // 3.95–6.55 — the motorcycle pulls in at the village foot.
  function arrival(t,lt,dur){
    camBegin(950,565,1.04);
    rural(t,0,true);
    const x=lerp(235,950,ease(seg(lt,.22,2.25))), y=850;
    motorbike(t,x,y,.84);dust(x-205,y+16,t,seg(lt,.3,1.9));
    const ride=emotions(lt,[[0,'nervous',{lookX:.9}],[1.0,'happy'],[2.0,'proud']],{take:.45});
    S.person('boy',x-13,765,31,t,ride,{view:'side',walk:lt<2.35?lt*1.15:0,aL:.16,aR:.20,rot:-.04,dy:-.15});
    const girl=emotions(lt,[[0,'curious',{lookX:-.9}],[1.05,'surprised'],[1.65,'shy']],{take:.42});
    S.person('girl',1480-35*ease(seg(lt,1.0,1.75)),872,38,t,girl,{view:'front',flip:true,aL:.38,aR:-.32,lookX:-.75});
    for(let i=0;i<5;i++)L([[155+i*340,930],[174+i*340,926]],.9,'#B09B77');
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 6.55–9.95 — she chooses the packet, pays, and passes it through the counter.
  function purchase(t,lt,dur){
    camBegin(1040,590,1.0+.03*Math.sin(lt*.7));
    kiosk(t);
    const gy=877,u=38;
    const seller=emotions(lt,[[0,'neutral'],[1.6,'happy']],{take:.3});
    S.person('dad',1668,775,32,t,seller,{view:'side',flip:true,aL:-.16,aR:.12,hat:null});
    const girl=emotions(lt,[[0,'curious',{lookX:.6}],[.95,'happy'],[2.45,'hopeful']],{take:.45});
    const gx=lerp(800,1120,ease(seg(lt,.15,1.5)));
    S.person('girl',gx,gy,u,t,girl,{view:'q',flip:true,walk:lt<1.55?lt*1.25:0,aR:.65,aL:-.08,lookX:.5});
    const boy=emotions(lt,[[0,'hopeful',{lookX:-.6}],[1.65,'happy']],{take:.4});
    S.person('boy',620,gy,38,t,boy,{view:'front',aR:.48,aL:.18,lookX:.3});
    const transfer=ease(seg(lt,1.38,2.28));
    pack(lerp(1507,1152,transfer),lerp(625,735,transfer),.84,-.10*transfer);
    const coinK=ease(seg(lt,.78,1.48));
    if(lt<1.5)coin(1070+coinK*40,756-coinK*35,10);
    F(rectPts(1192,729,144,19,2),'#9B7351',{ink:C.ink,sw:.8});
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 9.95–12.00 — the remembered tenderness of the trouser cuff.
  function cuffMemory(t,lt,dur){
    camBegin(960,704,1.23);
    S.ground(t,0,true,.2);
    const girl=emotions(lt,[[0,'shy'],[.9,'happy'],[1.65,'playful']],{take:.3});
    const boy=emotions(lt,[[0,'happy'],[1.5,'shy']],{take:.32});
    const lean=ease(seg(lt,.45,1.25));
    S.person('boy',1010,880,40,t,boy,{view:'front',sq:.12*lean,dy:.18*lean,aL:-.34,aR:-.12,lookY:.3,rot:.025});
    // A visible rolled edge marks the cuff she is finishing, then her hand withdraws.
    F(rectPts(900,842,76,13,1),'#E0D2B7',{ink:'#4A4A4A',sw:1});
    L([[902,848],[974,848]],1.1,'#9C8F7A');
    const girlX=lerp(1380,1155,lean);
    S.person('girl',girlX,875,36,t,girl,{view:'q',flip:true,aR:lerp(.18,.67,lean),aL:-.1,dy:.08*lean,lookX:-.45});
    F(ellPts(960,900,390,15,28,2),'#716858',{fill:'#716858',fillOp:45,ink:null});
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 12.00–25.50 — approved sample: melon theft, caught, years, reunion.
  const sampleShot=(name,duration)=> (t,lt,dur)=>{
    S[name](t,lt,duration);
    // Scene functions use the full song time for their cyclical background boils.
    if(name==='reunion' && lt>dur-.24) seamOut(lt,dur);
  };
  // 25.50–32.25 — she walks away; he tries the cuff alone and a flower drifts off.
  function parting(t,lt,dur){
    const cold=.92;
    camBegin(960,570,1.03-.05*ease(seg(lt,5.5,6.4)));
    S.ground(t,cold,true,1);
    const leave=seg(lt,.5,4.4), bx=980+78*ease(seg(lt,1.0,2.2));
    const girl=emotions(lt,[[0,'sad',{lookY:.5}],[1.0,'determined'],[4.0,'sad']],{take:.3});
    S.person('girl',1390-520*ease(leave),874,39,t,girl,{view:'qback',walk:leave*1.15,flip:true,dy:-.1,lookY:.5,rot:.03});
    const boy=emotions(lt,[[0,'sad',{lookX:-.5}],[.65,'confused'],[2.6,'sad']],{take:.4});
    S.person('boy',bx,874,41,t,boy,{view:'front',aL:-.14,aR:lerp(.45,-.45,ease(seg(lt,1.2,2.65))),sq:.08*seg(lt,2.0,2.4),lookX:-.7,rot:-.02});
    // He rolls one cuff for himself. The other empty trouser hem stays plain.
    const settle=ease(seg(lt,2.35,3.4));
    F(rectPts(bx-95,856,69+17*settle,12,1),'#DFD6C3',{ink:'#686B67',sw:1});
    L([[bx-94,862],[bx-27+17*settle,862]],.8,'#9EA29D');
    // Her flower comes loose into the creek; it floats toward frame right.
    const drift=seg(lt,4.65,6.15),fx=lerp(630,1110,drift),fy=lerp(901,964,drift)+Math.sin(lt*3)*5;
    F(ellPts(fx,fy,13,8,16,1),'#E8A9A7',{ink:'#9A7771',sw:.65});
    for(let i=0;i<4;i++)F(ellPts(fx+Math.cos(i*Math.PI/2)*10,fy+Math.sin(i*Math.PI/2)*7,7,5,12,1),'#D99590',{ink:null});
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  function farBridge(t,zoom=1){
    S.ground(t,.96,true,1);
    // A faint trail of the former warm palette remains on the far bank.
    F([[-80,614],[230,536],[412,583],[606,514],[804,600],[788,690],[-70,713]],'#B6BAA6',{fill:'#BCC2B0',fillOp:80,ink:null});
  }
  // 32.25–36.20 — he says her name, she cannot meet his eyes.
  function callFromBridge(t,lt,dur){
    camBegin(960,559,1.0);
    farBridge(t);
    const boy=emotions(lt,[[0,'hopeful'],[.7,'sad'],[2.8,'sad']],{take:.4});
    S.person('boy',821,872,43,t,boy,{view:'front',aL:.55,aR:.35,lookX:.15});
    const girl=emotions(lt,[[0,'sad'],[1.4,'shy'],[2.7,'sad']],{take:.2});
    S.person('girl',1488,871,38,t,girl,{view:'qback',flip:true,lookY:.65,aL:-.25,aR:.1});
    // An unspoken reply is shown in her hand tightening around the case handle.
    L([[1422,700],[1398,725],[1422,746]],1.4,'#777F79');
    for(let i=0;i<2;i++)F(ellPts(988+i*33,690,4,9,12,1),'#E8D8B7',{ink:null});
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 36.20–38.50 — the question lands on his knees.
  function kneel(t,lt,dur){
    camBegin(950,566,1.07);
    farBridge(t);
    const drop=ease(seg(lt,.13,.75)), settle=seg(lt,.76,1.35);
    const boy=emotions(lt,[[0,'confused'],[.68,'sad'],[1.45,'sad']],{take:.45});
    S.person('boy',930,876,45,t,boy,{view:'front',sq:.14*drop-.03*settle,dy:1.1*drop,aL:lerp(.4,-.03,settle),aR:lerp(.48,-.12,settle),rot:-.07*drop,lookY:.55});
    S.person('girl',1450,872,37,t,feel('sad',t,{lookY:.8}),{view:'qback',flip:true});
    // A small splash ring makes the descent feel physical, not symbolic only.
    const ringK=seg(lt,.58,.82);
    if(ringK<1){L([[844-ringK*53,920],[884,915-ringK*17],[936,915-ringK*17],[988+ringK*48,920]],1.3*(1-ringK),'#DEE5DD');}
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 38.50–42.65 — he cannot fill the silence by himself.
  function monologue(t,lt,dur){
    camBegin(960,575,1.0);
    farBridge(t);
    const boy=emotions(lt,[[0,'sad'],[.35,'confused'],[1.15,'sad'],[2.45,'sad']],{take:.2});
    S.person('boy',925,878,44,t,boy,{view:'front',aL:.22,aR:.24,lookX:.1,rot:.012});
    // Bare, uneven rings appear and vanish before reaching the vacant side of frame.
    for(let i=0;i<5;i++){
      const age=lt-i*.59;if(age<0||age>1.12)continue;
      const q=age/1.12, x=1090+q*250, y=630-i*12-20*q;
      L(ellPts(x,y,22+q*18,12+q*9,18,.8),1.0*(1-q*.65),shade('#A9B9B2','#AEBBB9',q));
    }
    if(lt>3.4)F(rectPts(-80,-80,W+160,H+160),C.paper,{washOp:155*seg(lt,3.4,dur)});
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 42.65–48.10 — searching the road and the empty doorway.
  function search(t,lt,dur){
    camBegin(960,572,1.0+.025*Math.sin(lt*1.7));
    S.ground(t,.94,true,1);
    const walk=seg(lt,.35,3.65),x=lerp(1280,760,ease(walk));
    const boy=emotions(lt,[[0,'hopeful'],[1.0,'sad'],[3.4,'sad']],{take:.3});
    S.person('boy',x,868,39,t,boy,{view:walk<1?'q':'front',flip:true,walk:walk*1.35,aL:.22,aR:.5,lookX:-.55});
    // A shuttered, empty kiosk recalls where she used to wait.
    F(rectPts(1540,586,210,143,1),'#9EAA9C',{ink:'#535E5B',sw:1.2});
    L([[1547,617],[1743,617]],1.4,'#687571');
    for(let i=0;i<5;i++)L([[1560+i*38,622],[1564+i*38,720]],1,'#78847C');
    for(let i=0;i<5;i++)S.leaf(t+i*.4,i,.95,.55);
    const flowerX=lerp(700,1250,seg(lt,2.2,5.0));
    F(ellPts(flowerX,920+Math.sin(lt*2)*5,11,7,16,1),'#D69D99',{ink:'#9A7771',sw:.5});
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 48.10–58.10 — instrumental recollections, each one recedes into the paper.
  function memoryMontage(t,lt,dur){
    const cold=ease(seg(lt,0,9.2));
    camBegin(960,540,1);
    F(rectPts(-100,-100,W+200,H+200),shade('#E7D5B5','#DFE5DE',cold));
    // Three postcard memories move past like leaves; they never stop being drawings.
    const cards=[
      {x:330,y:535,w:420,h:375,tag:'melon'},
      {x:960,y:535,w:420,h:375,tag:'bridge'},
      {x:1590,y:535,w:420,h:375,tag:'kiosk'}
    ];
    cards.forEach((c,i)=>{
      const phase=lt*.32+i*.333, drift=85*Math.sin(phase*TAU), reveal=ease(seg(lt,i*.55,i*.55+.7));
      push();translate(c.x+drift, c.y+Math.sin(lt*.65+i)*9);rotate((i-1)*.022);
      F(rectPts(-215,-189,430,378,3),shade('#FFF6E2','#EEF0E7',cold),{ink:'#776C5D',sw:1.1});
      if(c.tag==='melon'){
        F(rectPts(-208,-171,416,338,2),'#E4D8BD',{ink:null});
        F([[-208,13],[-132,-60],[-55,-17],[28,-78],[116,-28],[208,-58],[208,150],[-208,150]],'#B9C1A5',{ink:null});
        F(rectPts(-208,72,416,92,1),'#C5B38B',{ink:null});
        for(let j=0;j<4;j++){L([[-190+j*110,115],[-150+j*110,108],[-117+j*110,119]],1,'#71845F');S.melon(-154+j*105,118,20,j*.16);}
        S.person('boy',-65,128,25,t,feel('happy',lt),{view:'q',aR:.55});
        S.person('girl',111,128,23,t,feel('playful',lt),{view:'q',flip:true,aL:.42});
      } else if(c.tag==='bridge'){
        // Draw a miniature cold bridge as a simple resting line with two figures facing apart.
        F(rectPts(-185,91,370,18,2),'#A99F88',{ink:'#756E61',sw:.8});
        F([[-215,113],[-120,102],[-15,119],[100,106],[215,115],[215,190],[-215,190]],'#A5BCB7',{ink:null});
        S.person('boy',-62,103,26,t,feel('sad',lt),{view:'front',aL:-.1});
        S.person('girl',102,103,24,t,feel('sad',lt),{view:'qback',flip:true});
        F(ellPts(16,133,8,5,12,1),'#D69D99',{ink:'#9A7771',sw:.4});
      } else {
        F(rectPts(-208,-171,416,338,2),'#D8C69F',{ink:null});
        F([[-208,-20],[-120,-90],[-34,-40],[54,-109],[160,-33],[208,-48],[208,165],[-208,165]],'#B5BCA2',{ink:null});
        F(rectPts(-208,89,416,76,1),'#B7A984',{ink:null});
        F(rectPts(-175,-92,350,190,1),'#D5BB8D',{ink:'#766853',sw:.9});
        F(rectPts(-138,-69,275,97,1),'#665B4C',{ink:null});
        S.person('girl',-31,98,24,t,feel('happy',lt),{view:'side',aR:.45});
        S.person('boy',114,105,24,t,feel('hopeful',lt),{view:'front',aL:.35});
        pack(42,8,.47,-.1);
      }
      F(rectPts(-215,-189,430,378,3),C.paper,{washOp:255*(1-reveal),ink:null});
      pop();
    });
    // One present-day figure watches the cards travel beyond him.
    if(lt>5.2){
      const alpha=seg(lt,5.2,6.7)*(1-seg(lt,9.25,9.95));
      S.person('boy',960,997,33,t,emotions(lt,[[0,'sad'],[1,'hopeful']],{take:.2}),{view:'qback',flip:true,dy:0});
      F(rectPts(-40,-40,W+80,H+80),C.cool,{washOp:110*alpha,ink:null});
    }
    camEnd();seamIn(lt);seamOut(lt,dur);
  }
  // 58.10–62.9167 — the flower returns to the water, then the paper goes still.
  function ending(t,lt,dur){
    camBegin(960,580,1.0+.08*ease(seg(lt,0,2.2)));
    S.ground(t,.94,true,1);
    const fall=ease(seg(lt,.15,1.7)),fx=lerp(1120,975,fall),fy=lerp(850,960,fall)+Math.sin(lt*4)*5*(1-fall);
    F(ellPts(fx,fy,18,11,18,1),'#D99C97',{ink:'#876E68',sw:.8});
    for(let i=0;i<5;i++)F(ellPts(fx+Math.cos(i*TAU/5)*12,fy+Math.sin(i*TAU/5)*8,8,5,12,1),'#E8B4A5',{ink:null});
    F(ellPts(fx,fy,4,4,12,0),'#DEBD69',{ink:null});
    for(let i=0;i<4;i++)L([[fx+24+i*44,fy+14+i*4],[fx+55+i*44,fy+11+i*4]],.7,'#DDE4DE');
    camEnd();seamIn(lt);
    const fade=ease(seg(lt,dur-.52,dur-.05));
    if(fade>0)F(rectPts(-100,-100,W+200,H+200),C.paper,{washOp:255*fade,ink:null});
    if(lt>dur-.05)F(rectPts(-100,-100,W+200,H+200),C.paper,{washOp:255,ink:null});
  }

  shots([
    [0,heard],
    [3.95,arrival],
    [6.55,purchase],
    [9.95,cuffMemory],
    [12.00,sampleShot('steal',3.35)],
    [15.35,sampleShot('caught',2.40)],
    [17.75,sampleShot('years',2.35)],
    [20.10,sampleShot('reunion',5.40)],
    [25.50,parting],
    [32.25,callFromBridge],
    [36.20,kneel],
    [38.50,monologue],
    [42.65,search],
    [48.10,memoryMontage],
    [58.10,ending]
  ]);
})();
