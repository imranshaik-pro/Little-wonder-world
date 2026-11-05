/* Render all v1.5 modes in a DOM-light harness to catch runtime exceptions. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const assets=path.join(__dirname,'app/src/main/assets');
const app={innerHTML:''};
const sandbox={console,Math,Date,JSON,Map,Set,Number,String,Array,Object,
 setTimeout:()=>1,clearTimeout:()=>{},setInterval:()=>1,clearInterval:()=>{},
 localStorage:{getItem:()=>null,setItem:()=>{}},
 document:{hidden:false,querySelector:s=>s==='#app'?app:null,querySelectorAll:()=>[],addEventListener:()=>{}},
 navigator:{},addEventListener:()=>{}};
sandbox.window=sandbox;const context=vm.createContext(sandbox);
for(const file of ['release.js','content.js','engines.js','trace-engine.js','app.js']){
 const source=file==='release.js'&&process.env.LWW_RELEASE_SCRIPT?path.join(__dirname,process.env.LWW_RELEASE_SCRIPT):path.join(assets,file);
 vm.runInContext(fs.readFileSync(source,'utf8'),context,{filename:file});
}
if(process.env.LWW_RELEASE_SCRIPT){
 vm.runInContext('state.screen="home";render()',context);
 assert(app.innerHTML.includes('vivid-theme'),'Refreshed release must enable the vivid theme');
 const cards=app.innerHTML.match(/class="land-card"/g)||[];
 assert.strictEqual(cards.length,6,'No learning lands removed');
 assert(app.innerHTML.indexOf('data-value="creative"')<app.innerHTML.indexOf('data-value="foundations"'),'Creativity-first home layout');
 const css=fs.readFileSync(path.join(assets,'vivid.css'),'utf8');
 for(const swatch of ['#F3FAFF','#20324A','#FFB000','#1769E0','#157F52','#FD4B8B'])assert(css.includes(swatch),'Required accessible palette '+swatch);
}
const list=vm.runInContext('visibleWorldIds.map(id=>({id,modes:worlds[id].modes.map(m=>m[0])}))',context);
const count=list.reduce((sum,w)=>sum+w.modes.length,0);
assert.strictEqual(list.length,27);assert.strictEqual(count,257,'All 227 activities plus 30 rhyme stories');
const failures=[];
for(const world of list){
 for(const mode of world.modes){
  try{
   vm.runInContext('beginMode('+JSON.stringify(world.id)+','+JSON.stringify(mode)+')',context);
   assert(app.innerHTML.includes('game-shell')||app.innerHTML.includes('sketch-screen')||app.innerHTML.includes('family')||app.innerHTML.includes('flashcard')||app.innerHTML.includes('film'),world.id+'.'+mode+' must render');
  }catch(e){failures.push({world:world.id,mode,error:e.message});}
 }
}
if(failures.length){console.error(JSON.stringify(failures.slice(0,15),null,2));process.exitCode=1;}
else console.log(JSON.stringify({status:'PASS',worlds:list.length,activities:count,rendered:count},null,2));
