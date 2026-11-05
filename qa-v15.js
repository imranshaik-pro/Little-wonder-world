/* Little Wonder World v1.5: fast offline correctness tests (no browser needed). */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=__dirname,assets=path.join(root,'app/src/main/assets');
const contentContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(assets,'content.js'),'utf8'),contentContext);
const C=contentContext.window.WonderContent;
const baseline={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'releases/v1.4.2.js'),'utf8'),baseline);
const updated={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'releases/v1.5.js'),'utf8'),updated);
const oldWorlds=baseline.window.__LWW_RELEASE__.worlds,newWorlds=updated.window.__LWW_RELEASE__.worlds;
assert(oldWorlds.every(id=>newWorlds.includes(id)),'No previously released world may disappear');
assert.strictEqual(newWorlds.length,27,'The original 26 worlds plus rhymebook remain');
assert.strictEqual(C.worlds.rhymebook.modes.length,30,'Thirty rhyme story entries available');
for(const m of C.worlds.rhymebook.modes){assert.strictEqual(C.stories[m[0]].length,3,'Three unique scenes per rhyme');}
const noteNames=['C4','D4','E4','F4','G4','A4','B4','C5'];
const hashes=noteNames.map(note=>{
 const file=path.join(assets,'instruments','xylophone-'+note+'.mp3');
 assert(fs.existsSync(file),'Xylophone note '+note+' is packaged');
 return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
});
assert.strictEqual(new Set(hashes).size,8,'All 8 xylophone note recordings must be distinct');
const context={window:{devicePixelRatio:1}};vm.runInNewContext(fs.readFileSync(path.join(assets,'trace-engine.js'),'utf8'),context);
const Trace=context.window.WonderTrace;
function traced(symbol,mode){
 const listeners={};let accepted=false,percent=0,hint='';
 const noOp=()=>{};
 const ctx={clearRect:noOp,beginPath:noOp,lineTo:noOp,moveTo:noOp,stroke:noOp,setLineDash:noOp,arc:noOp,fill:noOp,scale:noOp};
 const canvas={getBoundingClientRect:()=>({left:0,top:0,width:720,height:300}),getContext:()=>ctx,
  addEventListener:(name,fn)=>{listeners[name]=fn;},setPointerCapture:noOp};
 const model=Trace.mount(canvas,symbol,'4-5',()=>{accepted=true;},p=>{percent=p;},s=>{hint=s;});
 const ev=(xy)=>({clientX:xy[0],clientY:xy[1],pointerId:1,preventDefault:noOp});
 const dispatch=(type,xy)=>listeners[type](ev(xy));
 if(mode==='scribble'){
  dispatch('pointerdown',[10,10]);for(let i=0;i<30;i++)dispatch('pointermove',[i*20,20+i*3]);dispatch('pointerup',[600,110]);
 }else{
  for(const poly of model.paths){
   dispatch('pointerdown',poly[0]);for(const p of poly.slice(1))dispatch('pointermove',p);dispatch('pointerup',poly[poly.length-1]);
  }
 }
 return {accepted,percent,hint,strokes:model.strokes};
}
assert(!traced('A','scribble').accepted,'Random scribbles may not complete A');
assert(!traced('○','scribble').accepted,'Random scribbles may not complete a circle');
const traceCases=['A','B','C','G','O','Z','2','7','0','○','□','△','☆','a','b','i','CAT','∿'];
for(const symbol of traceCases){
 const s=traced(symbol,'correct');assert(s.accepted,'Following every stroke should complete '+symbol+' '+JSON.stringify(s));
}
console.log(JSON.stringify({status:'PASS',retainedWorlds:oldWorlds.length,newWorlds:newWorlds.length,rhymes:30,xylophoneNotes:new Set(hashes).size,tracingValidations:traceCases.length+2},null,2));
