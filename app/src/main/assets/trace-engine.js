/* Little Wonder World v1.5 — path-based, on-device tracing validation.
 * A random scribble never completes a glyph: strokes must begin near the
 * start marker and cover the intended trajectory in order.
 */
window.WonderTrace=(function(){
 const line=s=>s.split(' ').map(v=>v.split(',').map(Number));
 const curve=(x,y,rx,ry,from,to,n=24)=>Array.from({length:n+1},(_,i)=>{
  const a=(from+(to-from)*i/n)*Math.PI/180;return [x+rx*Math.cos(a),y+ry*Math.sin(a)];
 });
 const oval=()=>curve(.5,.5,.37,.41,-90,270,36);
 const heart=()=>[...curve(.32,.34,.18,.22,140,325,15),[.5,.94],...curve(.68,.34,.18,.22,215,400,15).reverse()];
 const star=()=>Array.from({length:11},(_,i)=>{const a=(-90+i*144)*Math.PI/180;return [.5+(.43)*Math.cos(a),.5+(.43)*Math.sin(a)]});
 const M={
  A:['.12,.92 .5,.08 .88,.92','.25,.62 .75,.62'],
  B:['.19,.08 .19,.92','.19,.08 .60,.10 .80,.23 .80,.34 .65,.49 .19,.50','.19,.5 .66,.5 .83,.64 .83,.79 .62,.91 .19,.92'],
  C:[curve(.52,.5,.34,.41,-48,-312)],
  D:['.19,.08 .19,.92','.19,.08 .58,.12 .81,.29 .84,.50 .79,.74 .57,.91 .19,.92'],
  E:['.78,.08 .2,.08 .2,.92 .78,.92','.2,.50 .7,.50'],
  F:['.2,.92 .2,.08 .8,.08','.2,.5 .7,.5'],
  G:[curve(.52,.5,.34,.41,-48,-315),'.85,.53 .54,.53'],
  H:['.18,.08 .18,.92','.82,.08 .82,.92','.18,.5 .82,.5'],
  I:['.22,.08 .78,.08','.5,.08 .5,.92','.22,.92 .78,.92'],
  J:['.72,.08 .72,.72 .63,.89 .41,.92 .24,.84'],
  K:['.20,.08 .20,.92','.8,.08 .21,.55 .83,.92'],
  L:['.20,.08 .20,.92 .8,.92'],
  M:['.13,.92 .13,.08 .5,.52 .87,.08 .87,.92'],
  N:['.18,.92 .18,.08 .82,.92 .82,.08'],
  O:[oval()],P:['.19,.92 .19,.08 .62,.08 .82,.24 .78,.42 .61,.53 .19,.53'],
  Q:[oval(),'.6,.73 .88,.97'],R:['.19,.92 .19,.08 .62,.08 .82,.24 .78,.42 .61,.53 .19,.53','.48,.53 .85,.92'],
  S:[curve(.52,.29,.29,.22,-40,-210,13),curve(.48,.71,.29,.22,145,-50,13)],
  T:['.13,.08 .87,.08','.5,.08 .5,.92'],U:['.18,.08 .18,.67 .28,.87 .5,.93 .72,.87 .82,.67 .82,.08'],
  V:['.14,.08 .5,.92 .86,.08'],W:['.1,.08 .27,.92 .5,.47 .73,.92 .9,.08'],
  X:['.16,.08 .84,.92','.84,.08 .16,.92'],Y:['.15,.08 .5,.48 .85,.08','.5,.48 .5,.92'],
  Z:['.17,.08 .83,.08 .17,.92 .83,.92'],
  '0':[oval()],'1':['.35,.25 .52,.08 .52,.92'],'2':[curve(.5,.29,.31,.22,-170,20,16),'.79,.36 .19,.92 .82,.92'],
  '3':['.2,.10 .77,.10 .49,.50 .76,.5 .83,.72 .7,.89 .25,.90'],
  '4':['.68,.92 .68,.08 .16,.63 .84,.63'],
  '5':['.8,.08 .22,.08 .2,.46 .62,.47 .83,.64 .71,.88 .19,.90'],
  '6':['.74,.13 .39,.20 .19,.5 .25,.80 .49,.92 .77,.79 .78,.62 .55,.52 .24,.61'],
  '7':['.17,.08 .84,.08 .36,.92'],
  '8':[curve(.5,.30,.26,.22,-90,270,22),curve(.5,.70,.31,.22,-90,270,22)],
  '9':[curve(.5,.30,.29,.22,-90,270,22),'.78,.29 .75,.69 .56,.91 .25,.91'],
  '○':[oval()],'□':['.18,.14 .82,.14 .82,.86 .18,.86 .18,.14'],
  '△':['.5,.08 .89,.90 .11,.90 .5,.08'],'☆':[star()],
  '♡':[heart()],'◇':['.5,.08 .87,.50 .5,.92 .13,.50 .5,.08'],
  '∿':['.1,.6 .24,.35 .4,.6 .56,.35 .72,.6 .9,.35'],
  '⌁':['.1,.68 .31,.24 .5,.68 .68,.24 .9,.68'],
  '⌒':[curve(.5,.85,.4,.55,210,330)],
  '﹀':['.13,.22 .5,.80 .87,.22'],
  '∩':[curve(.5,.78,.38,.58,200,340)],
  '≈':['.1,.4 .28,.29 .45,.4 .62,.29 .8,.4','.1,.7 .28,.59 .45,.7 .62,.59 .8,.7'],
  '〰':['.08,.5 .21,.25 .36,.5 .51,.75 .67,.5 .82,.25 .93,.5'],
  '⌣':[curve(.5,.18,.4,.6,150,30)],
  '∽':['.1,.44 .29,.25 .47,.55 .65,.78 .88,.48'],
  '∞':[curve(.31,.5,.22,.25,-90,270,18),curve(.69,.5,.22,.25,90,450,18)],
  '♪':['.68,.1 .68,.76',curve(.48,.77,.2,.13,0,360,18)],
  '☾':[curve(.58,.5,.35,.4,-65,65,18),curve(.7,.5,.25,.32,65,-65,18)],
  '☀':[oval().map(([x,y])=>[.5+(x-.5)*.55,.5+(y-.5)*.55])],
  '✿':[oval().map(([x,y])=>[.5+(x-.5)*.7,.5+(y-.5)*.7])]
 };
 const lowercase={
  a:[oval().map(([x,y])=>[x,.2+y*.69]),'.85,.28 .85,.91'],
  b:['.20,.06 .20,.92',curve(.52,.64,.32,.28,-90,270,24)],
  c:[curve(.52,.65,.31,.28,-52,-308,22)],d:[curve(.46,.63,.31,.28,-90,270,24),'.8,.06 .8,.92'],
  e:[curve(.5,.64,.31,.27,-60,-305,24),'.2,.63 .8,.63'],
  f:['.34,.92 .39,.28 .5,.08 .75,.08','.19,.36 .65,.36'],
  g:[curve(.46,.42,.28,.27,-90,270,20),'.74,.38 .74,.88 .61,.98 .3,.98'],
  h:['.22,.08 .22,.92','.22,.62 .4,.38 .61,.38 .78,.54 .78,.92'],
  i:['.5,.38 .5,.92','.5,.14 .5,.18'],
  j:['.69,.38 .69,.87 .58,.97 .35,.96','.69,.14 .69,.18'],
  k:['.24,.08 .24,.92','.77,.39 .25,.68 .79,.93'],
  l:['.48,.08 .48,.92'],
  m:['.15,.42 .15,.92','.15,.58 .27,.42 .43,.42 .52,.57 .52,.92','.52,.57 .63,.42 .78,.42 .85,.58 .85,.92'],
  n:['.24,.42 .24,.92','.24,.58 .43,.42 .65,.42 .78,.59 .78,.92'],
  o:[oval().map(([x,y])=>[x,.24+y*.68])],
  p:['.22,.40 .22,.98',curve(.51,.61,.3,.27,-90,270,22)],
  q:[curve(.47,.61,.3,.27,-90,270,22),'.77,.4 .77,.98'],
  r:['.23,.40 .23,.92','.23,.62 .44,.42 .69,.42'],
  s:[curve(.52,.54,.27,.14,-38,-210,12),curve(.47,.77,.27,.14,145,-45,12)],
  t:['.47,.16 .47,.77 .58,.91 .73,.91','.27,.39 .72,.39'],
  u:['.2,.4 .2,.74 .32,.91 .54,.91 .77,.75 .77,.40','.77,.75 .77,.92'],
  v:['.17,.42 .5,.92 .83,.42'],w:['.1,.42 .28,.92 .5,.62 .72,.92 .9,.42'],
  x:['.18,.42 .82,.92','.82,.42 .18,.92'],
  y:['.17,.42 .5,.82 .82,.42','.50,.82 .37,.98'],
  z:['.18,.42 .82,.42 .18,.92 .82,.92']
 };
 function pathsFor(symbol){
  const chars=[...symbol].filter(c=>c!==" "&&c!=="\uFE0F");
  return chars.map(c=>({letter:c,strokes:(lowercase[c]||M[c]||M[c.toUpperCase()]||M['○']).map(p=>typeof p==="string"?line(p):p)}));
 }
 function sample(poly,step=3){
  let points=[poly[0]];for(let i=1;i<poly.length;i++){
   const a=poly[i-1],b=poly[i],length=Math.hypot(a[0]-b[0],a[1]-b[1]);
   for(let j=1;j<=Math.max(1,Math.ceil(length/step));j++){const t=j/Math.max(1,Math.ceil(length/step));points.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
  }return points;
 }
 function mount(canvas,symbol,age,onReady,onProgress,onHint){
  const rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height;
  const ratio=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
  const ctx=canvas.getContext("2d");ctx.scale(ratio,ratio);ctx.lineCap="round";ctx.lineJoin="round";
  const chars=pathsFor(symbol),n=chars.length||1;
  const glyphW=Math.min(w*.65/n,h*.77),glyphH=Math.min(h*.83,glyphW*1.28);
  const totalW=n*glyphW+(n-1)*Math.min(14,w*.01),left=(w-totalW)/2,top=(h-glyphH)/2;
  let strokes=[];chars.forEach((item,i)=>item.strokes.forEach(poly=>{
   const origin=left+i*(glyphW+Math.min(14,w*.01));
   strokes.push(sample(poly.map(p=>[origin+p[0]*glyphW,top+p[1]*glyphH])));
  }));
  const tolerance=Math.max(15,Math.min(34,h*(age==="2-3"?.115:age==="4-5"?.09:.073)));
  const threshold=age==="2-3"?.69:age==="4-5"?.76:.83;
  let complete=0,active=false,last=null,visited=new Set(),outside=0,totalSamples=0,progress=0;
  const point=e=>{const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  const nearest=(p,arr)=>{let index=0,d=Infinity;arr.forEach((a,i)=>{const k=Math.hypot(p[0]-a[0],p[1]-a[1]);if(k<d){d=k;index=i;}});return {index,d};};
  function draw(){
   ctx.clearRect(0,0,w,h);
   strokes.forEach((path,i)=>{
    ctx.lineWidth=Math.max(8,h*.058);ctx.strokeStyle=i<complete?"#6cc69f":i===complete?"#b19bdf":"#ddd1ed";
    ctx.setLineDash(i<complete?[]:[8,11]);ctx.beginPath();path.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.setLineDash([]);if(i>=complete){ctx.fillStyle=i===complete?"#44b984":"#c4b4d9";ctx.beginPath();ctx.arc(path[0][0],path[0][1],Math.max(8,h*.031),0,2*Math.PI);ctx.fill();}
   });
   if(complete<strokes.length&&progress>0){const p=strokes[complete],end=Math.floor(progress*(p.length-1));ctx.strokeStyle="#7250bd";ctx.lineWidth=Math.max(8,h*.055);ctx.beginPath();p.slice(0,end+1).forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.stroke();}
  }
  const update=()=>onProgress(Math.round(100*(complete+progress)/Math.max(1,strokes.length)));
  const begin=e=>{
   e.preventDefault();if(complete===strokes.length)return;
   const start=strokes[complete][0],p=point(e);
   if(Math.hypot(p[0]-start[0],p[1]-start[1])>tolerance*1.6){onHint("Start at the green dot ✨");return;}
   active=true;last=p;progress=0;visited=new Set();outside=0;totalSamples=0;
   try{canvas.setPointerCapture(e.pointerId);}catch(_){}onHint("Follow the dotted path slowly ✏️");
  };
  const move=e=>{
   if(!active)return;e.preventDefault();const p=point(e),dist=Math.hypot(p[0]-last[0],p[1]-last[1]);
   if(dist>Math.max(80,h*.35)){outside+=8;last=p;return;}
   const steps=Math.max(1,Math.ceil(dist/5)),path=strokes[complete];
   for(let j=1;j<=steps;j++){
    const pos=[last[0]+(p[0]-last[0])*j/steps,last[1]+(p[1]-last[1])*j/steps],near=nearest(pos,path);
    totalSamples++;
    if(near.d>tolerance){outside++;continue;}
    const portion=near.index/Math.max(1,path.length-1);
    if(portion+0.13<progress)continue;
    visited.add(Math.min(19,Math.floor(portion*20)));
    progress=Math.max(progress,portion);
   }last=p;draw();update();
  };
  const end=()=>{
   if(!active)return;active=false;
   const coverage=visited.size/20,path=strokes[complete];
   const finish=last&&Math.hypot(last[0]-path[path.length-1][0],last[1]-path[path.length-1][1])<=tolerance*1.6;
   const shortDot=path.length<12&&last&&Math.hypot(last[0]-path[0][0],last[1]-path[0][1])<tolerance;
   if((coverage>=threshold&&finish&&outside<=totalSamples*.28)||shortDot){
    complete++;progress=0;onHint(complete===strokes.length?"Beautiful tracing! Tap Next ⭐":"Great stroke! Start at the next green dot 🌟");
    if(complete===strokes.length)onReady();
   }else{progress=0;onHint("Good try! Follow the dots to the end 💛");}
   draw();update();
  };
  canvas.addEventListener("pointerdown",begin);canvas.addEventListener("pointermove",move);
  canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
  let demoRunning=false;
  function demo(){
   if(demoRunning||active||typeof window.requestAnimationFrame!=="function")return;
   demoRunning=true;onHint("Watch the golden pencil follow each stroke 👀");
   const all=strokes.flat(),length=all.length;let started=0;
   const frame=ts=>{
    if(!canvas.isConnected||active){demoRunning=false;draw();return;}
    if(!started)started=ts;const count=Math.min(length,Math.ceil((ts-started)/3400*length));
    draw();ctx.strokeStyle="#f2ab4d";ctx.lineWidth=Math.max(6,h*.044);ctx.beginPath();
    let offset=0;for(const path of strokes){
     const part=Math.max(0,Math.min(path.length,count-offset));
     if(part){path.slice(0,part).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.beginPath();}
     offset+=path.length;
    }
    if(count<length)window.requestAnimationFrame(frame);else{demoRunning=false;draw();onHint("Your turn! Start at the green dot ✨");}
   };window.requestAnimationFrame(frame);
  }
  draw();update();return {strokes:strokes.length,paths:strokes,demo};
 }
 return {mount,pathsFor};
})();
