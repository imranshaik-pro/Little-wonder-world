/* Release-gated, deterministic-structure and randomized-gameplay smoke checks.
 * These tests do not replace Android device, accessibility or child/parent tests.
 */
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'app/src/main/assets');
const src=name=>fs.readFileSync(path.join(root,name),'utf8');
const versions=[['v0.3',6,57],['v0.5',12,105],['v0.8',18,153],['v1.0',24,201],['v1.1',24,201],['v1.2',24,206],['v1.3',26,225],['v1.4',26,225],['v1.4.1',26,226],['v1.4.2',26,227]];
const result=[];
let v13Inventory;
for(const [version,wantedWorlds,wantedModes] of versions){
 const host={innerHTML:''},store={};
 const handlers={},formFields={'#familyName':{value:'Ravi Junior'},'#familyRole':{value:'Grandpa'}};
 const context=vm.createContext({
  console,Math,Date,Array,Object,Number,String,JSON,Set,Map,
  setTimeout:()=>1,clearTimeout:()=>{},
  localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v;}},
  document:{hidden:false,querySelector:selector=>selector==='#app'?host:formFields[selector]||null,querySelectorAll:()=>[],addEventListener:(event,fn)=>{handlers[event]=fn;},createElement:()=>({remove(){}})},
  confirm:()=>true,
 });
 context.window=context;
 context.addEventListener=(event,fn)=>{handlers['window:'+event]=fn;};
 vm.runInContext(fs.readFileSync(path.join(__dirname,'releases',version+'.js'),'utf8'),context);
 for(const f of ['content.js','engines.js','app.js'])vm.runInContext(src(f),context,{filename:f});
 const run=s=>vm.runInContext(s,context);
 const ids=run('visibleWorldIds');
 assert.strictEqual(ids.length,wantedWorlds,version+' world count');
 const count=run('visibleWorldIds.reduce((n,id)=>n+worlds[id].modes.length,0)');
 assert.strictEqual(count,wantedModes,version+' activity count');
 const inventory=JSON.parse(run('JSON.stringify(Object.fromEntries(visibleWorldIds.map(id=>[id,worlds[id].modes.map(m=>m[0])])))'));
 if(version==='v1.3')v13Inventory=inventory;
 if(['v1.4.1','v1.4.2'].includes(version)){
  for(const [world,modes] of Object.entries(v13Inventory)){
   assert(inventory[world],`Missing v1.3 world: ${world}`);
   for(const mode of modes)assert(inventory[world].includes(mode),`Missing v1.3 activity: ${world}/${mode}`);
  }
 }
 assert.match(host.innerHTML,/little explorer/i,'Onboarding appears');
 if(version==='v1.1'){
  assert.match(host.innerHTML,/Bramble/,'Guide characters selectable during onboarding');
  for(const [mode,selector] of [['piano','piano-board'],['xylophone','xylo-bars'],['drums','drum-kit']]){
   run('beginMode("music",'+JSON.stringify(mode)+')');
   assert(host.innerHTML.includes(selector),'Real instrument interface for '+mode);
  }
  run('state.screen="game";state.world="animals";state.mode="baby";state.question={animal:"Cow",icon:"🐮",title:"Cow",prompt:"Watch me",options:[{value:"Calf",label:"Calf",icon:"🐮"}]};render()');
  assert.match(host.innerHTML,/animal-videos\/cow.webm/,'Offline animal footage connected');
  for(const asset of ['piano-C4.mp3','piano-C5.mp3','xylophone-C5.mp3','drum-kick.mp3','drum-snare.mp3'])
   assert(fs.existsSync(path.join(root,'instruments',asset)),'Missing recorded instrument: '+asset);
 }
 if(version==='v1.2'){
  assert.strictEqual(run('animalAtlasUnique.length'),122,'Animal atlas should contain 122 unique animals');
  assert.strictEqual(run('Object.keys(animalClips).length'),30,'30 animal-specific sound clips are expected');
  assert.strictEqual(run('objectCards.length'),40,'40 object picture cards are expected');
  assert.strictEqual(run('Object.keys(objectSoundClips).length'),12,'12 object effects are expected');
  for(const asset of ['music/wonder-garden.mp3','sounds/extended/elephant.mp3','sounds/extended/dolphin.mp3','sounds/objects/train.mp3','sounds/objects/rain.mp3'])
   assert(fs.existsSync(path.join(root,asset)),'Missing offline learning sound: '+asset);
  run('beginMode("tracing","capitals")');assert.strictEqual(run('state.traceDeck.length'),26,'Tracing must continue through the full uppercase alphabet');
  run('beginMode("animals","flashcards")');assert.match(host.innerHTML,/30/,'All 30 sound-enabled animal cards must be available');
  run('beginMode("animals","objectcards")');assert.match(host.innerHTML,/40/,'Object flashcards must include 40 objects');
  run('beginMode("coloring","sketch")');assert.match(host.innerHTML,/sketchCanvas/,'Sketchpad must include drawing canvas');
 }
 if(version==='v1.3'){
  assert.strictEqual(run('Object.keys(flashcardCatalog).length'),16,'16 broad flashcard themes');
  assert.strictEqual(run('objectCards.length'),45,'Extended object atlas');
  assert(run('Object.keys(objectSoundClips).length')>=15,'Vehicle effects expanded');
  run('state.screen="parent";render()');assert.match(host.innerHTML,/My Family Album/,'Family manager in Parent Corner');
  run('familyPeople.push({id:"p1",name:"Ravi",role:"Grandpa",photo:"data:image/jpeg;base64,AAAA"})');
  run('familyPeople.push({id:"p2",name:"Maya",role:"Grandma",photo:"data:image/jpeg;base64,AAAA"})');
  run('beginMode("family","familycards")');assert.match(host.innerHTML,/Grandpa/,'Names and roles on family cards');
  run('beginMode("family","familyquiz")');assert.match(host.innerHTML,/familyGuess/,'Family photo quiz available');
  run('state.screen="parent";pendingFamilyPhoto="data:image/jpeg;base64,AAAA";render()');
  const fireClick=(action,value)=>handlers.click({target:{closest:selector=>selector==='[data-paint]'?null:{dataset:{action,value}}}});
  fireClick('familyAdd');
  assert.strictEqual(run('familyPeople.length'),3,'Parent photo form must save a new member');
  assert.match(store.lww3_family,/Ravi Junior/,'Family data is saved to local device storage');
  fireClick('familyDelete',run('familyPeople[2].id'));
  assert.strictEqual(run('familyPeople.length'),2,'Parent can delete a personal photo');
  run('beginMode("body","doorstory")');assert.match(host.innerHTML,/doorChoose/,'Safety story choices available');
  fireClick('doorChoose','grownup');assert.strictEqual(run('state.round'),1,'Correct safety decision moves to the next scene');
 }
 if(version==='v1.4'){
  assert.strictEqual(run('Object.keys(flashcardCatalog).length'),16,'Keep all v1.3 flashcards');
  run('beginMode("alphabet","letterhunt")');
  assert(run('state.question.options.every(x=>x.icon===x.value)'), 'Letter Hunt must display actual letter glyphs');
  run('beginMode("alphabet","firstsound")');
  assert(run('state.question.options.every(x=>x.icon===x.value)'), 'First Sounds must display actual letter glyphs');
  assert.match(host.innerHTML,/letter-choice/, 'Letter choices have large readable tiles');
  run('beginMode("tracing","capitals")');
  assert.match(host.innerHTML,/skipTrace/,'Tracing needs a reliable Next/Skip escape');
  run('state.round=2;state.traceReady=true;nextTrace()');
  assert.strictEqual(run('state.round'),3,'Tracing C advances to D');
  run('state.locked=false;state.traceReady=false;nextTrace(true)');
  assert.strictEqual(run('state.round'),4,'Skip control must advance');
  run('beginMode("animals","flashcards")');
  assert.strictEqual(run('cardCollection().length'),6, 'Six real animal films reachable via default filter');
  run('state.cardIndex=cardCollection().findIndex(x=>x.name==="Elephant");render()');
  assert.match(host.innerHTML,/has-film/, 'Animal film is the main media on flashcard');
  assert.match(host.innerHTML,/elephant.webm/, 'Elephant film embedded');
  run('window.wonderPause()');
  assert.strictEqual(run('appActive'),false,'Audio must suspend on Android pause');
  run('window.wonderResume()');
  assert.strictEqual(run('appActive'),true,'Audio resumes only when foreground');
 }
 if(['v1.4.1','v1.4.2'].includes(version)){
  assert.strictEqual(run('animalAtlasUnique.length'),123,'All 123 v1.3 animals retained');
  assert.strictEqual(run('Object.keys(animalClips).length'),34,'All 34 v1.3 animal sound mappings retained');
  assert.strictEqual(run('objectCards.length'),45,'All 45 v1.3 object cards retained');
  assert.strictEqual(run('Object.keys(objectSoundClips).length'),17,'All 17 v1.3 object sound mappings retained');
  assert.strictEqual(run('Object.keys(flashcardCatalog).length'),16,'All 16 themed v1.3 flashcard decks retained');
  for(const mode of run('Object.keys(flashcardCatalog)')){
   run('beginMode("flashbook",'+JSON.stringify(mode)+')');
   assert.match(host.innerHTML,/flashcard-illustration/,`${mode} themed flashcards must render`);
  }
  run('beginMode("animals","flashcards")');
  assert.strictEqual(run('state.cardFilter'),'all','Show full animal encyclopedia by default');
  assert.strictEqual(run('cardCollection().length'),123,'All animal flashcards visible immediately');
  assert.match(host.innerHTML,/All 123 animals/,'Clearly labelled full animal atlas');
  run('state.cardIndex=cardCollection().findIndex(a=>a.name==="Cat");render()');
  assert.match(host.innerHTML,/cat-illustration.jpg/,'Realistic animal illustration bundled for cards');
  assert.match(host.innerHTML,/Kitten/,'Animal-specific baby details preserved and expanded');
  assert.match(host.innerHTML,/viewFilm/,'Film reachable directly from animal details');
  run('state.cardFilter="sounds";state.cardIndex=0;render()');
  assert.strictEqual(run('cardCollection().length'),34,'34 sound-enabled animal cards filter');
  run('beginMode("animals","objectcards")');
  assert.strictEqual(run('cardCollection().length'),45,'All object cards visible by default');
  run('state.cardFilter="sounds";render()');
  assert.strictEqual(run('cardCollection().length'),17,'17 sound-enabled object cards filter');
  run('beginMode("animals","realfilms")');
  assert.strictEqual(run('cardCollection().length'),6,'Dedicated six-film collection');
  for(const name of ['Elephant','Cow','Dog','Cat','Horse','Goat']){
   const index=run('cardCollection().findIndex(a=>a.name==='+JSON.stringify(name)+')');
   assert(index>=0,`Real Films includes ${name}`);
   run('state.cardIndex='+index+';render()');
   assert.match(host.innerHTML,new RegExp('animal-videos/'+name.toLowerCase()+'\\.webm'),`${name} footage bundled`);
   assert.match(host.innerHTML,/muted playsinline/,`${name} clip must be muted offline`);
   for(const ext of ['webm'])assert(fs.statSync(path.join(root,'animal-videos',name.toLowerCase()+'.'+ext)).size>1000,`${name} clip bytes present`);
   assert(fs.statSync(path.join(root,'animal-stills',name.toLowerCase()+'-illustration.jpg')).size>1000,`${name} storybook illustration present`);
   assert(fs.statSync(path.join(root,'animal-stills',name.toLowerCase()+'.jpg')).size>1000,`${name} movie poster present`);
  }
  run('beginMode("animals","flashcards")');
  const fireClick=(action,value)=>handlers.click({target:{closest:selector=>selector==='[data-paint]'?null:{dataset:{action,value}}}});
  fireClick('openRealFilms');assert.strictEqual(run('state.mode'),'realfilms','Real Films navigation opens a distinct activity');
  fireClick('openAnimalAtlas');assert.strictEqual(run('state.mode'),'flashcards','Return to all 123 animals');
  run('state.screen="parent";render()');assert.match(host.innerHTML,/My Family Album/,'v1.3 family editor retained');
  run('beginMode("family","familyquiz")');assert.match(host.innerHTML,/familyGuess|Ask a grown-up to add photos/i,'v1.3 family quiz retained');
  run('beginMode("body","doorstory")');assert.match(host.innerHTML,/doorChoose/,'v1.3 safety story retained');
  run('beginMode("coloring","sketch")');assert.match(host.innerHTML,/sketchCanvas/,'v1.3 sketchpad retained');
  run('beginMode("tracing","capitals")');assert.match(host.innerHTML,/skipTrace/,'v1.4 tracing advancement retained');
  run('window.wonderPause()');assert.strictEqual(run('appActive'),false,'v1.4 lock-suspend remains');
  run('window.wonderResume()');assert.strictEqual(run('appActive'),true,'v1.4 foreground resume remains');
 }
 if(version==='v1.4.2'){
  assert.strictEqual(run('worlds.arcade.modes[0][0]'),'bubblepop','Pop the Bubbles is prominent in arcade');
  run('beginMode("music","piano")');assert.match(host.innerHTML,/music-fullscreen/,'Piano owns the playfield');
  assert.match(host.innerHTML,/piano-board/,'Real sampled piano keys retained');
  run('beginMode("music","xylophone")');assert.match(host.innerHTML,/music-fullscreen/,'Xylophone owns the playfield');
  assert.match(host.innerHTML,/xylo-bars/,'Real sampled xylophone bars retained');
  run('beginMode("music","drums")');assert.match(host.innerHTML,/music-fullscreen/,'Drums benefit from the same space gains');
  run('state.age="2-3";beginMode("arcade","bubblepop")');
  assert.strictEqual(run('state.goal'),9,'Youngest children get nine bubbles');
  assert((host.innerHTML.match(/class="pop-bubble"/g)||[]).length===9,'Nine independent pop buttons');
  run('WonderEngines.handle("0",{})');assert.strictEqual(run('state.engine.taps'),1,'Bubble really pops');
  run('WonderEngines.handle("0",{})');assert.strictEqual(run('state.engine.taps'),1,'Same bubble cannot score twice');
  for(let i=1;i<9;i++)run('WonderEngines.handle('+JSON.stringify(String(i))+',{})');
  assert.strictEqual(run('state.screen'),'complete','Bubble pop has an actual finish state');
  run('state.age="5-6";beginMode("arcade","bubblepop")');
  assert.strictEqual(run('state.goal'),15,'Older children get fifteen bubbles');
  assert((host.innerHTML.match(/class="pop-bubble"/g)||[]).length===15,'Fifteen independent pop buttons');
 }
 run('state.screen="home";render()');
 assert(!host.innerHTML.includes('data-action="mode"'),'Home is one screen above the activities');
 if(version!=='v0.3')assert.match(host.innerHTML,/land-card/,'Lands on home');
 const types=new Set(),interactive={quiz:0,sequence:0,count:0,story:0,puzzle:0,music:0,coding:0,build:0,pretend:0,movement:0,tap:0,journey:0,bubblepop:0};
 for(const w of ids){
  const modes=run('worlds['+JSON.stringify(w)+'].modes.map(x=>x[0])');
  for(const m of modes){
   run('beginMode('+JSON.stringify(w)+','+JSON.stringify(m)+')');
   if(w==='coloring'&&m==='sketch')assert.match(host.innerHTML,/sketch-screen/,version+' sketchpad missing');
   else assert.match(host.innerHTML,/playfield/,version+' '+w+'.'+m+' no playfield');
   assert(!host.innerHTML.includes('undefined'),version+' '+w+'.'+m+' renders undefined');
   assert(run('state.screen==="game"'));
   if(w==='coloring'&&m==='sketch'){assert.match(host.innerHTML,/sketchCanvas/,'Sketchpad missing');}
   else if(w==='coloring')assert((host.innerHTML.match(/data-paint=/g)||[]).length>=3,w+'.'+m+' paint target count');
   if(w==='memory')assert(run('state.memory.cards.length')>=6);
   if(w==='balloon'){
    for(let j=0;j<10;j++){
     run('nextBalloon()');assert(run('state.options.some(x=>x.name===state.question.target)'),m+' missing balloon');
    }
   }
   if(w==='sorting'||w==='animals'){
    for(let j=0;j<10;j++){
     const valid=run(w==='sorting'?'makeSorting()':'makeAnimalQuestion()');
     assert(valid.options.some(x=>x.value===valid.correct),w+'.'+m+' missing correct answer');
    }
   }
   if(w==='body'&&m==='doorstory')continue;
   if(!run('WonderEngines.isExtra(state.world)'))continue;
   const type=run('state.engine.type');types.add(type);interactive[type]++;
   if(type==='quiz'||type==='pretend'){
    for(let j=0;j<20;j++){
     run('state.age='+JSON.stringify('2-3')+';WonderEngines.next()');
     assert(run('state.question.options.some(x=>x.value===state.question.correct)'),w+'.'+m+' missing correct');
     assert(run('state.question.options.length<=3'),w+'.'+m+' too many answers for youngest');
     run('state.age="4-5";WonderEngines.next()');
     assert(run('state.question.options.some(x=>x.value===state.question.correct)'),w+'.'+m+' older child missing correct');
    }
    run('WonderEngines.handle(String(state.question.correct),{classList:{add(){}}})');
    assert(run('state.round')===1,'Quiz answer failed');
   }
   if(type==='sequence'||type==='puzzle'){
    run('WonderEngines.handle("0",{classList:{add(){}}})');
    assert(run('state.engine.'+(type==='sequence'?'sequence':'puzzle')+'.index')===1,type+' tap failed');
   }
   if(type==='count'){
    run('WonderEngines.handle("0",{classList:{add(){}}})');
    assert(run('state.engine.count.tapped.length')===1,'Count tap failed');
   }
   if(type==='music'){
    run('WonderEngines.handle("0",{classList:{add(){}}})');
    assert(run('state.engine.taps')===1,'Music key failed');
   }
   if(type==='journey'){
    assert.match(host.innerHTML,/journeyNext/,'Continuous lesson missing');
    run('WonderEngines.handle("journeyNext",{classList:{add(){}}})');
    assert(run('state.engine.step')>=1,'Journey did not advance');
   }
   if(type==='story'||type==='movement'){
    run('WonderEngines.handle("next",{classList:{add(){}}})');
    assert(run('state.round')===1,'Page turn failed');
   }
   if(type==='coding'){
    run('WonderEngines.handle("right",{classList:{add(){}}})');
    assert(run('state.engine.robot.x')===1,'Robot did not move');
   }
   if(type==='tap'){
    run('WonderEngines.handle("0",{classList:{add(){}}})');
    assert(run('state.engine.taps')===1,'Tap failed');
   }
   if(type==='build'){
    run('WonderEngines.handle("🌳",{classList:{add(){}}})');
    run('state.engine.placed.push({x:10,y:20,icon:state.engine.selected})');
    assert(run('state.engine.placed.length')===1,'Builder failed');
   }
  }
 }
 run('state.screen="parentGate";render()');assert.match(host.innerHTML,/Grown-ups only/);
 run('state.screen="parent";render()');assert.match(host.innerHTML,/Parent controls/);
 result.push({version,worlds:ids.length,modes:count,engines:types.size,engineModes:Object.values(interactive).reduce((a,b)=>a+b,0),status:'PASS'});
}
console.log(JSON.stringify(result,null,2));
