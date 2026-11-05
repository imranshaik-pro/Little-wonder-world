/* Reusable offline, no-scroll interaction engines for the learning lands.
 * Games are intentionally gentle: no timers, life counters, ads or penalties.
 */
window.WonderEngines=(function(){
const C=window.WonderContent;
const isExtra=w=>!!C.worlds[w];
const plain=arr=>arr.map(x=>({value:String(x[0]),label:String(x[0]),icon:x[1]}));
const opt=(value,label,icon)=>({value:String(value),label:String(label||value),icon:icon||""});
function ageChoices(){return state.age==="2-3"?3:4;}
function buildOptions(correct,pool){
 const unique=new Map();unique.set(correct.value,correct);
 for(const x of shuffle(pool)){if(!unique.has(x.value))unique.set(x.value,x);if(unique.size>=ageChoices())break;}
 return shuffle([...unique.values()]);
}
function genericBank(w){
 if(["alphabet"].includes(w))return C.letterPairs.map(x=>[x[1],x[2]]);
 if(["transport"].includes(w))return C.things.vehicles;
 if(["science"].includes(w))return C.things.science;
 if(["nature"].includes(w))return C.things.nature;
 if(["emotions"].includes(w))return C.things.feelings;
 if(["body"].includes(w))return C.things.body;
 if(["music"].includes(w))return C.things.instruments;
 if(["cooking","life"].includes(w))return C.things.food;
 if(["festivals"].includes(w))return C.things.nature;
 if(["puzzles"].includes(w))return C.things.animals;
 if(["arcade"].includes(w))return C.things.fruits;
 if(["coding"].includes(w))return [["Left","⬅️"],["Right","➡️"],["Up","⬆️"],["Down","⬇️"]];
 return C.things.animals;
}
function question(){
 const w=state.world,m=state.mode,r=state.round;
 let q={title:"Look and learn",prompt:"Which one matches?",icon:"🌟",voice:"Look at the picture and find the right answer.",correct:"",options:[]};
 const exact=(icon,correct,prompt,options,voice=prompt)=>{
  q={title:modeTitle(),icon,correct:String(correct),prompt,voice,
   options:buildOptions(opt(correct,correct,options.find(x=>x[0]===correct)?.[1]),plain(options))};
 };
 if(w==="alphabet"){
  const pair=C.letterPairs[(r+rand(C.letterPairs.length))%C.letterPairs.length],letter=pair[0],word=pair[1],picture=pair[2];
  if(m==="rhyme"){
   const rhymes=[["cat","hat","sun","dog","cup"],["sun","fun","dog","tree","red"],["bee","tree","hat","bed","pig"],["cake","lake","sock","bus","top"]];
   const t=rhymes[rand(rhymes.length)];
   q={...q,title:"Rhyme Time",icon:"🎶",correct:t[1],prompt:"What rhymes with "+t[0]+"?",voice:"What rhymes with "+t[0]+"?",
    options:buildOptions(opt(t[1],t[1],"🎵"),t.slice(2).map(x=>opt(x,x,"🎵")))};
  }else if(m==="lowercase"){
   const distract=shuffle(C.letterPairs.filter(x=>x[0]!==letter)).slice(0,3).map(x=>[x[0].toLowerCase(),x[0].toLowerCase()]);
   exact(letter,letter.toLowerCase(),"Find the little letter "+letter.toLowerCase(),[[letter.toLowerCase(),letter.toLowerCase()],...distract]);
  }else if(["firstsound","wordstart","soundgame"].includes(m)){
   const pool=shuffle(C.letterPairs.filter(x=>x[0]!==letter)).slice(0,4).map(x=>[x[0],x[0]]);
   exact(picture,letter,"Which letter starts "+word+"? ("+letter+" / "+letter.toLowerCase()+")",[[letter,letter],...pool],"Listen to the first sound in "+word+". "+word+" starts with "+letter.toLowerCase()+". Find "+letter+".");
  }else{
   const pool=shuffle(C.letterPairs.filter(x=>x[0]!==letter)).slice(0,4).map(x=>[x[0],x[0]]);
   exact(picture,letter,"Find the letter "+letter+"!",[[letter,letter],...pool],"Find the letter "+letter+". "+letter+" is for "+word+".");
  }
 }else if(w==="numbers"){
  const n=1+((r+rand(9))%9);
  if(m==="moreless"){
   const correct=n+2;exact("⚖️",String(correct),"Which number is greater than "+n+"?",
    [[String(correct),"🔢"],[String(n-1),"🔢"],[String(Math.max(0,n-2)),"🔢"],[String(n),"🔢"]]);
  }else{
   exact("🔢",String(n),"Find number "+n+"!",
    [[String(n),"⭐"],[String((n%9)+1),"⭐"],[String(((n+2)%9)+1),"⭐"],[String(((n+4)%9)+1),"⭐"]]);
  }
 }else if(w==="science"&&m==="sinkfloat"){
  const lab=C.sinkFloatLab?C.sinkFloatLab[(r+rand(C.sinkFloatLab.length))%C.sinkFloatLab.length]:{name:"Rock",icon:"🪨",result:"Sink",why:"Heavy rocks sink to the bottom!"};
  exact(lab.icon,lab.result,"Drop the "+lab.name+" in the tank! Does it float or sink?",[["Float","🛶"],["Sink","⬇️"]],"Let's test the "+lab.name+" in the water tank! Does it float on top or sink down?");
  q.labItem=lab;
 }else if(w==="science"&&m==="dino"){
  const t=pick([["🦕","Plants","What did many long-necked dinosaurs eat?"],["🥚","Eggs","How did baby dinosaurs hatch?"],
   ["🦖","Long ago","When did dinosaurs live?"],["🦴","Fossils","What can scientists find from ancient animals?"]]);
  exact(t[0],t[1],t[2],[[t[1],"🦕"],["Today","🕒"],["Cars","🚗"],["Clouds","☁️"],["Plants","🌿"],["Eggs","🥚"],["Fossils","🦴"]]);
 }else if(w==="science"&&m==="weather"){
  const t=pick([["☀️","Sunny"],["🌧️","Rainy"],["❄️","Snowy"],["💨","Windy"]]);
  exact(t[0],t[1],"What is the weather?",[["Sunny","☀️"],["Rainy","🌧️"],["Snowy","❄️"],["Windy","💨"]]);
 }else if(w==="nature"&&m==="seasons"){
  const t=pick([["🌸","Spring"],["🏖️","Summer"],["🍂","Autumn"],["⛄","Winter"]]);
  exact(t[0],t[1],"Which season does this picture show?",[["Spring","🌸"],["Summer","☀️"],["Autumn","🍁"],["Winter","❄️"]]);
 }else if(w==="body"&&m==="time"){
  const t=pick([["🌅","Morning"],["🌞","Afternoon"],["🌙","Night"],["🌇","Evening"]]);
  exact(t[0],t[1],"What time of day might this be?",[["Morning","🌅"],["Afternoon","☀️"],["Evening","🌇"],["Night","🌙"]]);
 }else if(w==="music"&&m==="highlow"){
  const pitch=rand(2)?"High":"Low";
  q={...q,title:"High or Low?",icon:pitch==="High"?"🐦":"🐘",prompt:"Listen to the pitch. Is it high or low?",voice:"Listen carefully. Is this sound high or low?",pitch:pitch==="High"?900:180,
   correct:pitch,options:[opt("High","High","⬆️"),opt("Low","Low","⬇️")]};
 }else if(w==="puzzles"&&m==="missingpiece"){
  const patterns=[["⭐ 🌙 ⭐  ?","🌙",["🌙","⭐","☀️","🌈"]],["🍎 🍌 🍎  ?","🍌",["🍇","🍌","🍎","🍓"]]];
  const t=pick(patterns);q={...q,title:"Missing Picture",icon:t[0],prompt:"Which picture comes next?",voice:"Look at the pattern. What comes next?",correct:t[1],
   options:buildOptions(opt(t[1],t[1],t[1]),t[2].filter(x=>x!==t[1]).map(x=>opt(x,x,x)))};
 }else if(w==="festivals"&&["winter","summer"].includes(m)){
  const t=m==="winter"?pick([["❄️","Snow"],["🧣","Scarf"],["⛄","Snowman"]]):pick([["🏖️","Beach"],["🌞","Sun"],["🍉","Watermelon"]]);
  exact(t[0],t[1],"What do you see in "+m+"?",[[t[1],t[0]],["Train","🚂"],["Book","📚"],["Ball","⚽"]]);
 }else if(w==="cooking"&&m==="veggies"){
  const t=pick([["🥕","Carrot"],["🥦","Broccoli"],["🌽","Corn"],["🥬","Lettuce"]]);
  exact(t[0],t[1],"Which vegetable is this?",[[t[1],t[0]],["Apple","🍎"],["Banana","🍌"],["Bread","🍞"]]);
 }else if(w==="life"&&m==="healthyfood"){
  const t=pick([["🍎","Apple"],["🥦","Broccoli"],["🍇","Grapes"],["🥕","Carrot"]]);
  exact(t[0],t[1],"Which everyday food is this?",[[t[1],t[0]],["Toy","🧸"],["Car","🚗"],["Shoe","👟"]]);
 }else if(w==="emotions"&&["comfort","friendship"].includes(m)){
  const prompts=[["A friend is sad. What helps?","Kind words",["Kind words","Shouting","Taking toys","Ignoring"]],["You want a toy. What is kind?","Ask nicely",["Ask nicely","Grab it","Push","Yell"]],["Someone falls. What can you do?","Ask if they're okay",["Ask if they're okay","Laugh","Run away","Ignore"]]];
  const t=prompts[(r+rand(prompts.length))%prompts.length];
  exact("🤗",t[1],t[0],t[2].map(x=>[x,x===t[1]?"💗":"☁️"]));
 }else if(w==="life"&&m==="recycle"){
  const t=[["🍌","Compost"],["📰","Paper"],["🥤","Plastic"],["🍎","Compost"]][(r+rand(4))%4];
  exact(t[0],t[1],"Where does it belong?",[["Compost","🌱"],["Paper","📄"],["Plastic","♻️"],["Glass","🫙"]]);
 }else if(w==="body"&&m==="senses"){
  const t=[["👀","Eyes"],["👂","Ears"],["👃","Nose"],["✋","Hands"]][(r+rand(4))%4];
  exact(t[0],t[1],"Which body part helps?",[["Eyes","👀"],["Ears","👂"],["Nose","👃"],["Hands","✋"]]);
 }else if(w==="science"&&m==="daynight"){
  const t=pick([["🌙","Night"],["☀️","Day"],["⭐","Night"],["🌈","Day"]]);
  exact(t[0],t[1],"Is this day or night?",[["Day","☀️"],["Night","🌙"],["Rainy","🌧️"],["Snowy","❄️"]]);
 }else if(w==="transport"&&m==="travel"){
  const t=pick([["✈️","Air"],["⛵","Water"],["🚗","Land"],["🚂","Land"],["🚀","Space"]]);
  exact(t[0],t[1],"Where does it travel?",[["Land","🛣️"],["Air","☁️"],["Water","🌊"],["Space","🌌"]]);
 }else if(w==="transport"&&m==="rescue"){
  const t=pick([["🔥","Firefighter"],["🏥","Doctor"],["🏫","Teacher"],["🌾","Farmer"]]);
  exact(t[0],t[1],"Who can help here?",C.things.helpers);
 }else if(w==="body"&&m==="safe"){
  exact("🚦","Stop","What should we do at a red traffic light?",[["Stop","🛑"],["Run","🏃"],["Jump","🦘"],["Dance","💃"]]);
 }else if(w==="cooking"&&m==="foodgroup"){
  const t=pick([["🥕","Vegetable"],["🍎","Fruit"],["🥦","Vegetable"],["🍌","Fruit"]]);
  exact(t[0],t[1],"Is this a fruit or vegetable?",[["Vegetable","🥦"],["Fruit","🍎"],["Toy","🧸"],["Vehicle","🚙"]]);
 }else if(w==="puzzles"&&m==="odd"){
  q={title:"Odd One Out",icon:"🐱 🐶 🐰 🚗",prompt:"Which one is different?",voice:"Find the one that does not belong.",correct:"Car",
   options:buildOptions(opt("Car","Car","🚗"),plain([["Car","🚗"],["Cat","🐱"],["Dog","🐶"],["Rabbit","🐰"]]))};
 }else if(w==="puzzles"&&m==="shadows"){
  const t=pick(C.things.animals),others=C.things.animals.filter(x=>x[0]!==t[0]);
  q={title:"Shadow Puzzle",icon:t[1],shadow:true,prompt:"Who is hiding in the shadow?",voice:"Who is hiding in the shadow?",correct:t[0],
   options:buildOptions(opt(t[0],t[0],t[1]),plain(others))};
 }else{
  const deck=genericBank(w),t=deck[(r+rand(deck.length))%deck.length],other=deck.filter(x=>x[0]!==t[0]);
  const modePrompt=({
   nature:"What do we see in nature?",science:"What is this in our world?",music:"Which musical instrument is this?",
   body:"Name the body part.",transport:"What is this vehicle?",cooking:"What food is this?",
   emotions:"What feeling is this?",festivals:"What do you see?",puzzles:"Find the matching picture."})[w]||"What is this?";
  exact(t[1],t[0],modePrompt,shuffle([t,...shuffle(other).slice(0,4)]),modePrompt+" Find "+t[0]+".");
 }
 if(!q.options.some(x=>x.value===q.correct))throw Error("Quiz missing correct option: "+w+"."+m);
 return q;
}
function makeSequence(){
 const key=state.world+"."+state.mode;
 const base=C.sequenceSets[key]||["🌰","🌱","🌿","🌸"];
 const offset=state.round%Math.max(1,base.length-3),ordered=base.slice(offset,offset+4);
 return {ordered,choices:shuffle(ordered.map((icon,i)=>({id:i,icon}))),index:0};
}
function makePuzzle(){
 const deck=genericBank(state.world);
 const items=shuffle(deck).slice(0,state.age==="2-3"?3:4);
 return {ordered:items,choices:shuffle(items.map((x,i)=>({id:i,icon:x[1],name:x[0]}))),index:0};
}
function start(){
 const mode=currentMode(),type=mode[3]||"quiz";
 state.engine={type,correct:0,wrong:0,taps:0,tappedIds:[],selected:"",placed:[],notes:[],index:0};
 state.round=0;state.locked=false;state.goal=type==="story"||type==="movement"?3:type==="count"||type==="quiz"?5:type==="sequence"||type==="puzzle"||type==="coding"?3:type==="pretend"?4:1;
 if(type==="journey"){
  const progress=restore("lww2_journey",{});state.engine.step=Math.max(0,Number(progress[state.mode])||0);state.goal=0;
 }
 if(type==="quiz"||type==="pretend")state.question=type==="quiz"?question():makePretend();
 if(type==="sequence")state.engine.sequence=makeSequence();
 if(release.id==="v1.5"&&state.world==="life"&&state.mode==="teeth"){
  state.engine.brush={step:0,zone:0};state.goal=5;
 }
 if(type==="puzzle")state.engine.puzzle=makePuzzle();
 if(type==="count")state.engine.count=makeCount();
 if(type==="tap")state.goal=6;
 if(type==="bubblepop"){
  state.goal=state.age==="2-3"?9:state.age==="4-5"?12:15;
  state.engine.poppedIds=[];
 }
 if(type==="story")state.engine.pages=C.stories[state.mode]||makeStory();
 if(type==="movement")state.engine.moves=C.movements[state.mode]||C.movements.breathe;
 if(type==="coding")resetRobot();
 render();delayNext(220,()=>speak(instruction()));
}
function instruction(){
 const type=state.engine.type;
 if(type==="quiz"||type==="pretend"){
  if(state.question.pitch)delayNext(240,()=>soundTone(state.question.pitch,.6,"sine",.14));
  return state.question.voice;
 }
 if(type==="sequence")return "Tap these pictures in the right order.";
 if(type==="puzzle")return "Find each matching piece, one by one.";
 if(type==="count")return state.engine.count.prompt;
 if(type==="music")return "Let's make beautiful music. Tap the colorful notes.";
 if(type==="story")return state.engine.pages[state.round][1];
 if(type==="movement")return state.engine.moves[state.round][1];
 if(type==="coding")return "Help the little robot reach the shining star.";
 if(type==="build")return "Choose a piece, then tap the scene to build.";
 if(type==="tap")return "Catch the floating treasures.";
 if(type==="bubblepop")return "Pop the colorful bubbles! Tap each big bubble. Let's count together.";
 if(type==="journey")return journeySpeech();
 return "Let's play and learn.";
}
function next(){
 state.locked=false;
 if(state.engine){state.engine.tankDropped=false;state.engine.scrubDone=false;}
 const type=state.engine.type;
 if(type==="quiz")state.question=question();
 if(type==="pretend")state.question=makePretend();
 if(type==="count")state.engine.count=makeCount();
 if(type==="sequence")state.engine.sequence=makeSequence();
 if(type==="puzzle")state.engine.puzzle=makePuzzle();
 if(type==="coding")resetRobot();
 render();delayNext(140,()=>speak(instruction()));
}
function makeCount(){
 const icon=state.mode.includes("apple")?"🍎":state.mode.includes("fish")?"🐠":"⭐";
 const a=1+rand(state.age==="2-3"?3:5),b=state.mode==="add"?1+rand(3):0;
 const target=a+b;
 if(release.id==="v1.5"){
  const task=state.mode==="add"?"addition":state.mode.includes("apple")?"basket":state.mode.includes("fish")?"pond":"howmany";
  const options=shuffle([...new Set([target,Math.max(1,target-1),target+1,target+2])]).slice(0,3);
  if(!options.includes(target))options[0]=target;
  return {icon,target,a,b,task,options,tapped:[],prompt:task==="addition"?"How many altogether?":task==="basket"?"Pick "+target+" apples for the basket.":task==="pond"?"Touch every fish and count aloud.":"How many stars can you see?"};
 }
 return {icon,target,tapped:[],prompt:b?"Count "+a+" plus "+b+" things. Tap "+target+".":"Tap "+target+" "+(icon==="🍎"?"apples":icon==="🐠"?"fish":"stars")+"."};
}
function makePretend(){
 const tasks=C.roleTasks[state.mode]||C.roleTasks.doctor;
 const t=tasks[state.round%tasks.length],others=shuffle(tasks.filter(x=>x[1]!==t[1])).slice(0,3);
 const options=buildOptions(opt(t[1],t[1],t[1]),[...others.map(x=>opt(x[1],x[1],x[1]))]);
 return {title:modeTitle(),prompt:t[0],voice:t[0]+". Tap the right picture.",correct:t[1],icon:"🎭",options};
}
function makeStory(){
 const m=modeTitle();
 return [["🌅","Today was a lovely day for "+m.toLowerCase()+"."],["🤗","Our friends helped each other and explored together."],["🌈","They went home smiling after their adventure."]];
}
function resetRobot(){state.engine.robot={x:0,y:0,targetX:3,targetY:2};}
function renderer(){
 const type=state.engine.type;
 if(type==="quiz"||type==="pretend")return renderQuiz();
 if(type==="sequence")return renderSequence();
 if(type==="count")return renderCount();
 if(type==="story")return renderStory();
 if(type==="puzzle")return renderPuzzle();
 if(type==="music")return renderMusic();
 if(type==="coding")return renderCoding();
 if(type==="build")return renderBuild();
 if(type==="movement")return renderMovement();
 if(type==="tap")return renderTap();
 if(type==="bubblepop")return renderBubblePop();
 if(type==="journey")return renderJourney();
 return "";
}
function stage(title,sub,icon,content,css=""){
 return '<div class="game-shell">'+renderMission(title,sub,icon||state.avatar)+
 '<section class="playfield '+css+'">'+content+'</section></div>';
}
function journeySpeech(){
 const step=state.engine.step||0;
 if(state.mode==="abcjourney"){
  const pair=C.letterPairs[step%26],lower=step>=26;
  return lower?"Small letter "+pair[0].toLowerCase()+". "+pair[0]+" is for "+pair[1]+". Can you say it?":
   "Letter "+pair[0]+". "+pair[0]+" is for "+pair[1]+". Your turn!";
 }
 return "Number "+(step+1)+". Let's count together.";
}
function renderJourney(){
 const letterMode=state.mode==="abcjourney",step=state.engine.step||0,total=letterMode?52:100;
 if(step>=total)return stage("You did it!","Wonderful learning. Play again or explore another world.","🌟",
  '<div class="journey-finish"><span class="emoji">🏆</span><h2>'+ (letterMode?'All the letters!':'You counted to 100!')+'</h2><p>You can return whenever you want.</p></div><button class="big-primary purple" data-action="engine" data-value="journeyRestart">Start again ↻</button>');
 const pair=letterMode?C.letterPairs[step%26]:null,n=step+1;
 const display=letterMode?(step>=26?pair[0].toLowerCase():pair[0]):String(n);
 const word=letterMode?display+' is for '+pair[1]:n<=10?'Count these dots':Math.floor(n/10)+' tens and '+(n%10)+' ones';
 const object=letterMode?'<div class="journey-illustration">'+pair[2]+'</div>':
   '<div class="journey-count">'+(n<=10?Array.from({length:n},()=>'<span class="count-dot"></span>').join(''):
    Array.from({length:Math.floor(n/10)},()=>'<span class="ten-block">10</span>').join('')+
    Array.from({length:n%10},()=>'<span class="count-dot"></span>').join(''))+'</div>';
 return stage(letterMode?"ABC Journey":"Numbers 1–100",letterMode?"Learn A to Z, then little a to z.":"Count one number at a time.",letterMode?'🔤':'🔢',
  '<div class="journey-top"><span>'+ (letterMode&&step>=26?'Little letters':'Keep going!')+'</span><strong>Step '+(step+1)+' / '+total+'</strong></div>'+
  '<div class="journey-main"><button class="journey-feature" data-action="engine" data-value="journeyHear" aria-label="Hear lesson">'+esc(display)+'</button>'+
  '<div class="journey-side">'+object+'<h2>'+esc(word)+'</h2></div></div>'+
  '<div class="journey-actions"><button data-action="engine" data-value="journeyPrev" '+(step===0?'disabled':'')+'>← Previous</button>'+
  '<button data-action="engine" data-value="journeyHear"><span class="emoji">🔊</span> Hear it</button>'+
  '<button class="journey-next" data-action="engine" data-value="journeyNext">Next '+(step+1===total?'⭐':'→')+'</button></div>');
}
function renderPhonicsTrainBar(){
 if(release.id!=="v1.5"||state.world!=="alphabet"||!C.phonicsCvc)return "";
 const item=C.phonicsCvc[(state.round||0)%C.phonicsCvc.length];
 const cars=item.letters.map((l,idx)=>
  '<button class="cvc-car" data-action="engine" data-value="cvcPhoneme:'+idx+'" aria-label="Sound '+l+'">'+
  '<span class="cvc-letter">'+l+'</span><small class="cvc-phoneme">'+item.phonemes[idx]+'</small></button>'
 ).join('<span class="cvc-link">+</span>');
 return '<div class="phonics-train-bar" aria-label="Phonics sound blending train">'+
  '<span class="train-engine">🚂</span><div class="cvc-cars">'+cars+'</div>'+
  '<button class="cvc-blend-btn" data-action="engine" data-value="cvcBlend">🔊 Blend: <strong>'+item.word+'</strong> '+item.icon+'</button></div>';
}
function renderSinkFloatLab(q){
 const dropped=!!state.engine.tankDropped;
 const isFloat=q.correct==="Float";
 const lab=q.labItem||{name:"Item",icon:q.icon,why:isFloat?"It floats on the waves!":"It sinks to the bottom!"};
 const stateClass=dropped?(isFloat?"tank-dropped is-floating":"tank-dropped is-sinking"):"tank-ready";
 return stage(q.title,"Drop the object into the water tank to test buoyancy!",'🌊',
  '<div class="water-tank-lab '+stateClass+'">'+
   '<div class="tank-experiment-col">'+
    '<button id="tankTestItem" class="tank-test-object" data-action="engine" data-value="tankDrop" aria-label="Drop '+esc(lab.name)+' into water">'+
     '<span class="tank-obj-icon">'+q.icon+'</span><small>'+(dropped?esc(lab.name):'👇 Tap or drag to drop!')+'</small></button>'+
    '<div class="aquarium-tank" data-tank-dropzone="true">'+
     '<div class="water-surface-waves"></div>'+
     '<div class="water-bubbles"><span>○</span><span>◌</span><span>○</span></div>'+
     '<div class="tank-floor">🐚 🪨 🌿</div>'+
    '</div>'+
   '</div>'+
   '<div class="tank-question-col">'+
    '<h2 class="play-question">'+esc(q.prompt)+'</h2>'+
    (dropped?'<p class="tank-discovery-note">✨ '+esc(lab.why)+'</p>':'<p class="tank-discovery-note">💧 Drop it in the water first or guess below!</p>')+
    '<div class="choice-grid two">'+q.options.map(x=>optionButton(x,"engine")).join("")+'</div>'+
   '</div>'+
  '</div>');
}
function renderCareStudio(q){
 const care=C.careStudioTasks?.[state.mode];
 const stepIdx=state.round%4;
 const toolInfo=care?.tools?.[stepIdx]||["🧽",q.prompt,"scrub"];
 const scrubbed=state.engine.scrubDone||false;
 const hero=care?.hero||q.icon||"🐶";
 return stage(care?.title||q.title,"Rub the character with your finger or tap the matching tool!",hero,
  '<div class="care-studio-layout">'+
   '<div id="careScrubTarget" class="care-scrub-stage '+(scrubbed?"scrub-complete":"")+'" data-correct-tool="'+esc(q.correct)+'" role="button" aria-label="Interactive care area: rub with your finger">'+
    '<div class="care-hero-wrap"><span class="care-hero-icon">'+hero+'</span>'+
     '<span class="care-overlay-badge">'+(scrubbed?'✨ Sparkling clean!':toolInfo[0]+' Rub here!')+'</span>'+
    '</div>'+
    '<div class="care-scrub-bar"><span id="careScrubFill" style="width:'+(scrubbed?100:0)+'%"></span></div>'+
    '<small id="careScrubHint">👋 Rub across '+hero+' with your finger, or tap the right tool!</small>'+
   '</div>'+
   '<div class="care-controls-col">'+
    '<h2 class="play-question">'+esc(q.prompt)+'</h2>'+
    '<div class="choice-grid '+(q.options.length===3?"three":"")+'">'+q.options.map(x=>optionButton(x,"engine")).join("")+'</div>'+
   '</div>'+
  '</div>');
}
function renderQuiz(){
 const q=state.question;
 if(release.id==="v1.5"&&state.world==="science"&&state.mode==="sinkfloat")return renderSinkFloatLab(q);
 if(release.id==="v1.5"&&state.engine.type==="pretend")return renderCareStudio(q);
 const phonicsBar=renderPhonicsTrainBar();
 return stage(q.title,"Look, listen, and choose.",state.avatar,
 phonicsBar+
 '<div class="focus-item"'+(q.shadow?' style="filter:brightness(0);opacity:.65"':'')+'>'+q.icon+'</div>'+
 '<h2 class="play-question">'+esc(q.prompt)+'</h2><div class="choice-grid '+(q.options.length===3?"three":"")+'">'+
 q.options.map(x=>optionButton(x,"engine")).join("")+'</div>');
}
function renderSequence(){
 if(release.id==="v1.5"&&state.world==="life"&&state.mode==="teeth")return renderBrushingLesson();
 const s=state.engine.sequence;
 return stage("What comes next?","Tap the pictures in order.",'🚂',
 '<div class="sequence-guide">'+s.ordered.map((icon,i)=>'<div class="sequence-slot '+(i<s.index?"complete":"")+'">'+(i<s.index?icon:"❔")+'</div>').join("")+'</div>'+
 '<div class="sequence-grid">'+s.choices.map(x=>'<button class="choice-card '+(x.id<s.index?"done":"")+'" data-action="engine" data-value="'+x.id+'" '+
 (x.id<s.index?"disabled":"")+'><span class="choice-icon">'+x.icon+'</span></button>').join("")+'</div>');
}
function renderBrushingLesson(){
 const b=state.engine.brush||{step:0,zone:0},step=b.step;
 const steps=[
  ['Watch the gentle circles','A grown-up shows us how to clean our teeth. Watch the soft brush move in little circles.','🪥','I watched!','brushNext'],
  ['Choose a soft toothbrush','A small, soft toothbrush is the right tool for little teeth.','🪥','Pick the toothbrush','brushNext'],
  ['Ask a grown-up for toothpaste',state.age==="2-3"?'For very little children, a grown-up chooses a tiny, rice-sized amount of fluoride toothpaste.':'For ages three to six, a grown-up uses no more than a pea-sized amount of fluoride toothpaste.','🫛','Ready to practice','brushNext'],
  ['Brush together','Move your finger gently in little circles over each section of the teeth. Remember the front, chewing, and back areas.','😁','',''],
  ['Spit and finish','Spit out the toothpaste—do not swallow. Rinse the toothbrush and let a grown-up check your smile.','💧','All done!','brushFinish']
 ];
 const current=steps[Math.min(step,4)];
 let interaction=step===3?
  '<div class="brushing-zones">'+['Front teeth','Chewing teeth','Back teeth'].map((name,i)=>
    '<div class="brushing-zone '+(i<b.zone?'done':i===b.zone?'active':'waiting')+'" data-brush-zone="'+i+'"><span>'+(i<b.zone?'✨':'🦷')+'</span><strong>'+name+'</strong><small>'+(i===b.zone?'Slide your finger gently':'')+'</small></div>').join('')+'</div>':
  '<button class="big-primary purple brushing-next" data-action="engine" data-value="'+current[4]+'">'+current[3]+' →</button>';
 return stage('Brush Your Teeth',"Let's learn together, one step at a time.",'🪥',
  '<div class="brushing-lesson"><div class="brushing-picture">'+current[2]+'</div><h2>'+current[0]+'</h2><p>'+current[1]+'</p>'+
  interaction+'<div class="brushing-steps">'+(step+1)+' / 5</div></div>');
}
function handleBrushLesson(value){
 const b=state.engine.brush;if(!b)return;
 if(value==="brushNext"&&b.step<3){b.step++;state.round=b.step;render();speak(b.step===3?'Try the gentle circles, front teeth first.':'Watch and learn. Then give it a try.');return;}
 if(value.startsWith("brushZone")&&b.step===3){
  const zone=Number(value.slice(9));if(zone!==b.zone)return;
  b.zone++;soundFX('good');
  if(b.zone>=3){b.step=4;state.round=4;speak('Lovely brushing! Spit, do not swallow.');}
  else speak('Good gentle circles! Now brush the next part.');
  render();return;
 }
 if(value==="brushFinish"&&b.step===4){state.round=state.goal;finishGame();}
}
function mountBrushingTouch(){
 if(release.id!=="v1.5"||state.world!=="life"||state.mode!=="teeth"||state.engine?.brush?.step!==3)return;
 document.querySelectorAll("[data-brush-zone]").forEach(el=>{
  if(Number(el.dataset.brushZone)!==state.engine.brush.zone)return;
  let active=false,last=null,distance=0;
  el.addEventListener("pointerdown",e=>{e.preventDefault();active=true;last=[e.clientX,e.clientY];try{el.setPointerCapture(e.pointerId);}catch(_){};});
  el.addEventListener("pointermove",e=>{
   if(!active)return;e.preventDefault();const p=[e.clientX,e.clientY];
   distance+=Math.min(45,Math.hypot(p[0]-last[0],p[1]-last[1]));last=p;
   if(distance>135){active=false;handleBrushLesson("brushZone"+el.dataset.brushZone);}
  });
  el.addEventListener("pointerup",()=>{active=false;});el.addEventListener("pointercancel",()=>{active=false;});
 });
}
function renderCount(){
 const c=state.engine.count;
 if(release.id==="v1.5"){
  const icons=Array.from({length:c.task==="basket"?Math.max(7,c.target+2):c.target},(_,i)=>
   '<button class="count-object count-'+c.task+' '+(c.tapped.includes(i)?'counted':'')+'" data-action="engine" data-value="'+i+'" '+(c.tapped.includes(i)?'disabled':'')+'>'+c.icon+'</button>').join('');
  const choices='<div class="count-answer-options">'+c.options.map(n=>'<button data-action="engine" data-value="answer:'+n+'" aria-label="Answer '+n+'">'+n+'</button>').join('')+'</div>';
  const middle=c.task==="addition"?
   '<div class="count-math-groups"><span>'+Array(c.a).fill('🍎').join(' ')+'</span><b>+</b><span>'+Array(c.b).fill('🍊').join(' ')+'</span></div>'+choices:
   c.task==="howmany"?'<div class="count-stars">'+Array(c.target).fill('⭐').join(' ')+'</div>'+choices:
   '<div class="count-landscape count-'+c.task+'-scene"><div class="count-pieces">'+icons+'</div>'+
   (c.task==="basket"?'<div class="count-basket">🧺 '+c.tapped.length+' apples collected</div>':'<div class="count-basket">🐟 '+c.tapped.length+' fish counted</div>')+'</div>';
  return stage(c.prompt,c.task==="addition"||c.task==="howmany"?'Count the pictures, then pick a number.':'Touch each picture to count.','🔢',
   '<div class="count-lesson"><h2>'+c.prompt+'</h2>'+middle+'</div>');
 }
 return stage(c.prompt,"Tap and count aloud.",'🔢',
 '<h2 class="play-question">'+c.prompt+'</h2><div class="count-grid">'+Array.from({length:Math.max(7,c.target+2)},(_,i)=>
 '<button class="count-object '+(c.tapped.includes(i)?"counted":"")+'" data-action="engine" data-value="'+i+'" '+(c.tapped.includes(i)?"disabled":"")+'>'+c.icon+'</button>').join("")+'</div>'+
 '<div class="count-readout">'+c.tapped.length+' / '+c.target+' ⭐</div>');
}
function renderStory(){
 const pages=state.engine.pages,p=pages[Math.min(state.round,pages.length-1)];
 return stage("Storytime","Listen and turn the page.",'📖',
 '<div class="storybook-page"><div class="storybook-picture">'+p[0]+'</div><p>'+esc(p[1])+'</p>'+
 '<div class="story-pagination">'+(state.round+1)+' of '+pages.length+'</div></div>'+
 '<button class="big-primary purple" data-action="engine" data-value="next">Turn page →</button>');
}
function renderPuzzle(){
 const p=state.engine.puzzle;
 if(release.id==="v1.5"){
  return stage("Wooden Peg Puzzle","Drag each wooden piece into its matching recessed slot!",'🧩',
   '<div class="peg-board sequence-guide">'+p.ordered.map((x,i)=>'<div class="sequence-slot peg-slot '+(i<p.index?"complete":i===p.index?"active-slot":"")+'" data-slot-id="'+i+'">'+
   '<span class="peg-silhouette">'+(i<p.index?x[1]:x[1])+'</span><small class="peg-slot-label">'+esc(x[0])+'</small>'+
   (i<p.index?'<span class="peg-check">✨</span>':'')+'</div>').join("")+'</div>'+
   '<div class="sequence-grid peg-tray">'+p.choices.map(x=>'<button class="choice-card peg-piece '+(x.id<p.index?"done":"")+'" data-action="engine" data-value="'+x.id+'" data-peg-id="'+x.id+'" '+(x.id<p.index?"disabled":"")+'>'+
   '<span class="peg-knob" aria-hidden="true"></span><span class="choice-icon">'+x.icon+'</span><span class="choice-label">'+esc(x.name)+'</span></button>').join("")+'</div>');
 }
 return stage("Match the pieces","Choose the matching picture.",'🧩',
 '<div class="sequence-guide">'+p.ordered.map((x,i)=>'<div class="sequence-slot '+(i<p.index?"complete":"")+'">'+
 (i<p.index?'✅':x[1])+'</div>').join("")+'</div>'+
 '<div class="sequence-grid">'+p.choices.map(x=>'<button class="choice-card" data-action="engine" data-value="'+x.id+'" '+(x.id<p.index?"disabled":"")+'>'+
 '<span class="choice-icon">'+x.icon+'</span><span class="choice-label">'+x.name+'</span></button>').join("")+'</div>');
}
function renderMusic(){
 const palette=["#fa899b","#ffc86b","#fff18a","#91d9a4","#8bcaf7","#aaa8f2","#eab5de","#ffca91"];
 const notes=["C4","D4","E4","F4","G4","A4","B4","C5"],isDrums=state.mode==="drums",isPiano=state.mode==="piano",isXylo=state.mode==="xylophone";
 const noteAttr=n=>release.id==="v1.5"?'data-note="'+n+'" aria-label="Play '+n+'"':'data-action="engine" data-value="'+n+'"';
 let instrument;
 if(isDrums){
  const pads=[["kick","🥁","KICK"],["snare","🪘","SNARE"],["hat","✨","HI-HAT"],["tom","🎵","TOM"],["crash","💥","CRASH"],["ride","🔔","RIDE"]];
  instrument='<div class="drum-kit">'+pads.map((p,i)=>'<button class="drum-pad drum-'+p[0]+'" data-action="engine" data-value="'+p[0]+'"><span>'+p[1]+'</span><strong>'+p[2]+'</strong></button>').join('')+'</div>';
 }else if(isPiano){
  const black=[["C#4",12.5],["D#4",25],["F#4",50],["G#4",62.5],["A#4",75]];
  instrument='<div class="piano-board"><div class="piano-whites">'+notes.map((n,i)=>'<button class="piano-white" '+noteAttr(n)+'><span>'+n.replace(/[45]/,'')+'</span></button>').join('')+'</div>'+
   black.map(([n,pos])=>'<button class="piano-black" '+noteAttr(n)+' style="left:'+pos+'%" aria-label="'+n+'">♩</button>').join('')+'</div>';
 }else if(isXylo){
  instrument='<div class="xylo-frame"><div class="xylo-bars">'+notes.map((n,i)=>'<button class="xylo-bar" style="background:'+palette[i]+';height:'+(95-i*6)+'%" '+noteAttr(n)+'><span>'+n.replace(/[45]/,'')+'</span></button>').join('')+'</div><div class="xylo-rails"></div></div>';
 }else{
  instrument='<div class="music-keys">'+notes.map((n,i)=>'<button data-action="engine" data-value="'+n+'" style="background:'+palette[i]+'">'+n.replace(/[45]/,'')+'</button>').join('')+'</div>';
 }
 const typeHint=isDrums?'Play a rhythm! Try kick, snare and cymbals.':isPiano?'Play the real piano keys. Make your own melody.':isXylo?'Tap the colorful wooden xylophone bars.':'Tap the notes to hear their sounds.';
 if(spaciousRelease){
  // No duplicate music heading or half-height instrument: reserve nearly the
  // entire playfield for keys/bars and just one slim control row.
  return '<div class="game-shell">'+renderMission(modeTitle(),typeHint,isDrums?'🥁':isXylo?'🌈':'🎹')+
   '<section class="playfield music-fullscreen music-'+esc(state.mode)+'"><div class="music-surface">'+instrument+'</div>'+
   '<div class="music-toolbar"><span class="music-live-count" id="musicCounter">'+state.engine.taps+' sounds played · Keep making music!</span>'+
   '<button id="musicDone" class="music-finish" data-action="engine" data-value="done" '+(state.engine.taps<6?'disabled':'')+'>Finish my song ⭐</button></div></section></div>';
 }
 return stage(modeTitle(),typeHint,isDrums?'🥁':isXylo?'🌈':'🎹',
 '<div class="music-head"><span class="emoji">'+(isDrums?'🥁':isXylo?'🌈':isPiano?'🎹':'🎵')+'</span> '+esc(modeTitle())+'</div>'+instrument+
 '<div class="music-foot" id="musicCounter">'+state.engine.taps+' sounds played · Keep making music!</div>'+
 '<button id="musicDone" class="big-primary purple music-done" data-action="engine" data-value="done" '+(state.engine.taps<6?"disabled":"")+'>Finish my song <span class="emoji">⭐</span></button>');
}
function renderCoding(){
 const r=state.engine.robot;
 return stage("Guide the robot","Tap arrows to reach the star.",'🤖',
 '<div class="coding-layout"><div class="robot-grid">'+Array.from({length:12},(_,i)=>'<div class="robot-cell '+(r.x===i%4&&r.y===Math.floor(i/4)?"robot-on":"")+'">'+
 (r.x===i%4&&r.y===Math.floor(i/4)?"🤖":i===11?"⭐":"")+'</div>').join("")+'</div>'+
 '<div class="arrows"><button data-action="engine" data-value="up">⬆️</button><div><button data-action="engine" data-value="left">⬅️</button>'+
 '<button data-action="engine" data-value="down">⬇️</button><button data-action="engine" data-value="right">➡️</button></div>'+
 '<div class="tiny">Reach the star!</div></div></div>');
}
function renderBuild(){
 const parts=["🧱","🪟","🚪","🌳","🌼","⭐","🏠","🌈","🚀","🦖","👑","🎈"];
 const selected=state.engine.selected||parts[0];
 return stage("Sticker & Builder Studio","Tap the scene to place stickers, or drag them around!",'🏗️',
 '<div class="build-stage" data-action="buildPlace" role="button" aria-label="Place or drag stickers in the scene">'+
 state.engine.placed.map((p,idx)=>'<span class="built-object" data-sticker-index="'+idx+'" style="left:'+p.x+'%;top:'+p.y+'%;transform:scale('+(p.scale||1)+')">'+p.icon+'</span>').join("")+
 '<span class="build-hint">🌿 Tap anywhere to place '+selected+' · Drag stickers to move them! 🏡</span></div>'+
 '<div class="build-tools">'+parts.slice(0,release.id==="v1.5"?10:8).map(x=>'<button data-action="engine" data-value="'+x+'" class="'+(selected===x?"selected":"")+'">'+x+'</button>').join("")+'</div>'+
 '<button class="tiny-cta" data-action="engine" data-value="done" '+(state.engine.placed.length<4?"disabled":"")+'>My creation is ready ⭐</button>');
}
function renderMovement(){
 const moves=state.engine.moves,m=moves[Math.min(state.round,moves.length-1)];
 return stage("Move together","A grown-up can join the fun.",'❤️',
 '<div class="movement-card"><span>'+m[0]+'</span><h2>'+esc(m[1])+'</h2><p>Try this gently, if it feels comfortable.</p></div>'+
 '<button class="big-primary purple" data-action="engine" data-value="done">I tried it! ⭐</button>');
}
function renderTap(){
 const icons=state.mode==="fishing"?["🐟","🐠","🐡"]:state.mode==="butterflies"?["🦋","🌸","🐝"]:state.mode==="stars"?["⭐","🌟","✨"]:["🫧","💎","🌈"];
 const t=state.engine.taps;
 return stage("Catch the treasures","Tap the floating pictures.",'🫧',
 '<div class="tap-field">'+Array.from({length:6},(_,i)=>state.engine.tappedIds.includes(i)?'':'<button class="catch-object" style="--x:'+(5+((i*15+(state.engine.cycles||0)*8)%85))+'%;--y:'+(7+((i+(state.engine.cycles||0))%3)*25)+'%;--d:'+(1.1+i*.14)+'s" data-action="engine" data-value="'+i+'">'+
 icons[i%icons.length]+'</button>').join("")+'</div><div class="count-readout">'+t+' / 6 catches ⭐</div>');
}
function renderBubblePop(){
 const e=state.engine;
 const total=state.goal;
 const columns=total===9?3:total===15?5:4;
 const tones=['#8edaf6','#f7a1c6','#f9d56a','#a6e4b5','#cdb3fa','#ffc2a2'];
 const bubbles=Array.from({length:total},(_,i)=>e.poppedIds.includes(i)?
  '<span class="bubble-burst" aria-label="Popped bubble">✦</span>':
  '<button class="pop-bubble" data-action="engine" data-value="'+i+'" style="--bubble-color:'+tones[i%tones.length]+';--bubble-delay:'+((i%4)*-.23)+'s" aria-label="Pop bubble '+(i+1)+'"><span></span></button>');
 return stage('Pop the Bubbles!','Every bubble you pop makes a happy sound.','🫧',
  '<div class="bubble-game-top"><strong>'+e.poppedIds.length+' / '+total+' popped!</strong><span>Tap a bubble to make it sparkle ✨</span></div>'+
  '<div class="bubble-game-grid" style="--bubble-cols:'+columns+'">'+bubbles.join('')+'</div>',
  'bubble-pop-playfield');
}
function completeRound(){
 state.round++;announce("Wonderful! ⭐","good");speak("Lovely work!");
 if(state.round>=state.goal){
  if(release.id==="v1.5"&&["quiz","count","sequence","puzzle","coding","pretend"].includes(state.engine.type)&&!(state.world==="life"||state.world==="body")){
   state.goal+=5;announce("You earned five stars! Keep exploring ✨","good");delayNext(570,advance);
  }else delayNext(550,finishGame);
 }else delayNext(570,advance);
}
function handle(value,element){
 if(state.locked)return;
 const e=state.engine,type=e.type;
 if(release.id==="v1.5"&&state.world==="life"&&state.mode==="teeth"){
  handleBrushLesson(String(value));return;
 }
 if(String(value).startsWith("cvcPhoneme:")){
  const idx=Number(String(value).split(":")[1])||0;
  const item=C.phonicsCvc?.[(state.round||0)%C.phonicsCvc.length];
  if(item){soundFX("flip");speak(item.sounds[idx]);}
  return;
 }
 if(value==="cvcBlend"){
  const item=C.phonicsCvc?.[(state.round||0)%C.phonicsCvc.length];
  if(item){soundFX("good");speak(item.sounds.join(" ... ")+" ... "+item.word+"!");}
  return;
 }
 if(value==="tankDrop"){
  state.engine.tankDropped=true;
  soundFX("paint");
  const lab=state.question?.labItem;
  speak(lab?lab.why:"Splash! Look what happened in the water!");
  render();
  return;
 }
 if(type==="quiz"||type==="pretend"){
  if(value!==String(state.question.correct)){recordAttempt(false);e.wrong++;announce("Let's try another! 💛","oops");speak("Good try. Look carefully.");return;}
  recordAttempt(true);
  e.correct++;state.locked=true;element.classList.add("correct");completeRound();return;
 }
 if(type==="sequence"||type==="puzzle"){
  const s=type==="sequence"?e.sequence:e.puzzle;
  if(Number(value)!==s.index){recordAttempt(false);e.wrong++;soundFX("oops");announce("Try another picture 💛","none");return;}
  recordAttempt(true);
  soundFX("good");s.index++;render();
  if(s.index===s.ordered.length){state.locked=true;completeRound();}
  return;
 }
 if(type==="count"){
  if(release.id==="v1.5"&&["addition","howmany"].includes(e.count.task)){
   if(String(value)!=="answer:"+e.count.target){recordAttempt(false);announce("Count once more, little star 💛","none");return;}
   recordAttempt(true);state.locked=true;completeRound();return;
  }
  const c=e.count,index=Number(value);
  if(c.tapped.includes(index))return;
  c.tapped.push(index);speak(String(c.tapped.length));soundFX("pop");render();
  if(c.tapped.length>=c.target){state.locked=true;completeRound();}
  return;
 }
 if(type==="story"||type==="movement"){state.locked=true;completeRound();return;}
 if(type==="music"){
  if(value==="done"){if(e.taps>=6)finishGame();return;}
  if(typeof window.playWonderInstrument==="function")window.playWonderInstrument(state.mode,value);
  else soundTone(262,.25,"sine",.1);
  e.taps++;
  const counter=typeof document!=="undefined"?document.querySelector("#musicCounter"):null;
  if(counter)counter.textContent=e.taps+" sounds played · Keep making music!";
  const done=typeof document!=="undefined"?document.querySelector("#musicDone"):null;
  if(done&&e.taps>=6)done.disabled=false;
  return;
 }
 if(type==="journey"){
  const total=state.mode==="abcjourney"?52:100;
  if(value==="journeyHear"){speak(journeySpeech());return;}
  if(value==="journeyRestart")e.step=0;
  else if(value==="journeyNext")e.step=Math.min(total,e.step+1);
  else if(value==="journeyPrev")e.step=Math.max(0,e.step-1);
  else return;
  const progress=restore("lww2_journey",{});progress[state.mode]=e.step;persist("lww2_journey",progress);
  soundFX("flip");render();if(e.step<total)speak(journeySpeech());return;
 }
 if(type==="coding"){
  const r=e.robot;
  const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[value];
  if(!delta)return;
  r.x=Math.max(0,Math.min(3,r.x+delta[0]));r.y=Math.max(0,Math.min(2,r.y+delta[1]));
  soundFX("flip");render();
  if(r.x===r.targetX&&r.y===r.targetY){state.locked=true;completeRound();}
  return;
 }
 if(type==="build"){
  if(value==="done"){if(e.placed.length>=4)finishGame();return;}
  e.selected=value;soundFX("flip");render();return;
 }
 if(type==="tap"){
  const id=Number(value);if(!Number.isInteger(id)||id<0||id>=6||e.tappedIds.includes(id))return;
  e.tappedIds.push(id);e.taps++;soundFX("pop");render();
  if(e.taps>=state.goal){
   if(release.id==="v1.5"){
    e.cycles=(e.cycles||0)+1;e.tappedIds=[];e.taps=0;
    announce("Amazing catches! More are coming 🌟","good");render();
   }else finishGame();
  }
 }
 if(type==="bubblepop"){
  const id=Number(value);
  if(!Number.isInteger(id)||id<0||id>=state.goal||e.poppedIds.includes(id))return;
  e.poppedIds.push(id);e.taps++;state.round=e.taps;
  soundFX('pop');
  if(e.taps>=state.goal){
   if(release.id==="v1.5"){
    e.cycles=(e.cycles||0)+1;e.taps=0;e.poppedIds=[];state.round=0;
    announce("Wonderful popping! Here come more bubbles 🫧","good");render();return;
   }
   state.locked=true;finishGame();return;
  }
  render();
  if(e.taps%3===0)speak(e.taps+' bubbles popped!');
 }
}
// A child may touch anywhere over the instrument, not just painted bars. Map
// the whole surface to eight note lanes, retaining black-key priority.
function mountMusicTouch(){
 if(release.id!=="v1.5"||!(["piano","xylophone"].includes(state.mode)))return;
 const surface=document.querySelector(".music-surface");if(!surface)return;
 const notes=["C4","D4","E4","F4","G4","A4","B4","C5"],last=new Map();
 const locate=e=>{
  const b=surface.getBoundingClientRect();
  const px=Math.max(0,Math.min(.999,(e.clientX-b.left)/Math.max(1,b.width)));
  if(state.mode==="piano"){
   const over=document.elementFromPoint(e.clientX,e.clientY)?.closest?.(".piano-black");
   if(over&&surface.contains(over))return over.dataset.note;
  }
  return notes[Math.min(7,Math.floor(px*8))];
 };
 const play=e=>{
  const note=locate(e);if(last.get(e.pointerId)===note)return;
  last.set(e.pointerId,note);handle(note,{classList:{add(){}}});
  surface.querySelectorAll("[data-note]").forEach(b=>b.classList.toggle("playing",b.dataset.note===note));
 };
 surface.addEventListener("pointerdown",e=>{e.preventDefault();try{surface.setPointerCapture(e.pointerId);}catch(_){}play(e);});
 surface.addEventListener("pointermove",e=>{if(last.has(e.pointerId)){e.preventDefault();play(e);}});
 const end=e=>{last.delete(e.pointerId);surface.querySelectorAll(".playing").forEach(b=>b.classList.remove("playing"));};
 surface.addEventListener("pointerup",end);surface.addEventListener("pointercancel",end);
 surface.addEventListener("click",e=>{if(e.detail>0){e.stopPropagation();e.preventDefault();}},true);
 surface.addEventListener("keydown",e=>{const note=e.target?.dataset?.note;if(note&&(e.key==="Enter"||e.key===" ")){e.preventDefault();handle(note,{classList:{add(){}}});}});
}
function placeBuild(event){
 if(state.engine?.type!=="build")return;
 const stage=event.target.closest(".build-stage");
 if(!stage)return;
 const b=stage.getBoundingClientRect();
 const x=Math.max(5,Math.min(88,((event.clientX-b.left)/Math.max(1,b.width))*100));
 const y=Math.max(5,Math.min(82,((event.clientY-b.top)/Math.max(1,b.height))*100));
 state.engine.placed.push({x,y,icon:state.engine.selected||"🧱"});soundFX("paint");render();
}
function mountTactileEngines(){
 if(release.id!=="v1.5"||typeof document==="undefined")return;
 const scrubStage=document.querySelector("#careScrubTarget");
 if(scrubStage&&state.engine?.type==="pretend"&&!state.engine.scrubDone){
  let active=false,last=null,dist=0;
  const fill=document.querySelector("#careScrubFill"),hint=document.querySelector("#careScrubHint");
  scrubStage.addEventListener("pointerdown",e=>{
   e.preventDefault();active=true;last=[e.clientX,e.clientY];
   try{scrubStage.setPointerCapture(e.pointerId);}catch(_){}
   soundFX("paint");
  });
  scrubStage.addEventListener("pointermove",e=>{
   if(!active)return;e.preventDefault();
   const p=[e.clientX,e.clientY];
   dist+=Math.min(45,Math.hypot(p[0]-last[0],p[1]-last[1]));last=p;
   const pct=Math.min(100,Math.round((dist/150)*100));
   if(fill)fill.style.width=pct+"%";
   if(dist>=150){
    active=false;state.engine.scrubDone=true;
    if(hint)hint.textContent="✨ Great scrubbing!";
    handle(String(state.question.correct),{classList:{add(){}}});
   }
  });
  const end=()=>{active=false;};
  scrubStage.addEventListener("pointerup",end);scrubStage.addEventListener("pointercancel",end);
 }
 if(state.engine?.type==="puzzle"){
  const pieces=document.querySelectorAll(".peg-piece:not(.done)");
  pieces.forEach(piece=>{
   let dragging=false,startX=0,startY=0;
   piece.addEventListener("pointerdown",e=>{
    if(piece.disabled)return;
    dragging=true;startX=e.clientX;startY=e.clientY;
    piece.style.zIndex="30";piece.style.transition="none";
    try{piece.setPointerCapture(e.pointerId);}catch(_){}
   });
   piece.addEventListener("pointermove",e=>{
    if(!dragging)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    piece.style.transform="translate("+dx+"px,"+dy+"px) scale(1.08)";
   });
   const finishDrag=e=>{
    if(!dragging)return;dragging=false;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    piece.style.zIndex="";
    if(Math.hypot(dx,dy)<12){piece.style.transform="";return;}
    const pegId=Number(piece.dataset.pegId);
    const targetSlot=document.querySelector('.peg-slot[data-slot-id="'+pegId+'"]');
    if(targetSlot&&pegId===state.engine.puzzle?.index){
     const sb=targetSlot.getBoundingClientRect(),pb=piece.getBoundingClientRect();
     const dist=Math.hypot((sb.left+sb.width/2)-(pb.left+pb.width/2),(sb.top+sb.height/2)-(pb.top+pb.height/2));
     if(dist<130){
      handle(String(pegId),piece);return;
     }
    }
    piece.style.transition="transform .3s cubic-bezier(.2,.9,.3,1.2)";
    piece.style.transform="";
   };
   piece.addEventListener("pointerup",finishDrag);piece.addEventListener("pointercancel",finishDrag);
  });
 }
 const tankItem=document.querySelector("#tankTestItem"),tankZone=document.querySelector("[data-tank-dropzone]");
 if(tankItem&&tankZone&&!state.engine?.tankDropped){
  let dragging=false,sx=0,sy=0;
  tankItem.addEventListener("pointerdown",e=>{
   dragging=true;sx=e.clientX;sy=e.clientY;tankItem.style.transition="none";
   try{tankItem.setPointerCapture(e.pointerId);}catch(_){}
  });
  tankItem.addEventListener("pointermove",e=>{
   if(!dragging)return;
   tankItem.style.transform="translate("+(e.clientX-sx)+"px,"+(e.clientY-sy)+"px) scale(1.1)";
  });
  const endTank=e=>{
   if(!dragging)return;dragging=false;
   const dy=e.clientY-sy;
   if(dy>35){handle("tankDrop",{classList:{add(){}}});return;}
   tankItem.style.transition="transform .25s ease";tankItem.style.transform="";
  };
  tankItem.addEventListener("pointerup",endTank);tankItem.addEventListener("pointercancel",endTank);
 }
 if(state.engine?.type==="build"){
  const stageEl=document.querySelector(".build-stage");
  document.querySelectorAll(".built-object[data-sticker-index]").forEach(sticker=>{
   let dragging=false;
   sticker.addEventListener("pointerdown",e=>{
    e.stopPropagation();e.preventDefault();dragging=true;
    try{sticker.setPointerCapture(e.pointerId);}catch(_){}
   });
   sticker.addEventListener("pointermove",e=>{
    if(!dragging||!stageEl)return;
    const b=stageEl.getBoundingClientRect();
    const x=Math.max(5,Math.min(88,((e.clientX-b.left)/Math.max(1,b.width))*100));
    const y=Math.max(5,Math.min(82,((e.clientY-b.top)/Math.max(1,b.height))*100));
    const idx=Number(sticker.dataset.stickerIndex);
    if(state.engine.placed[idx]){state.engine.placed[idx].x=x;state.engine.placed[idx].y=y;}
    sticker.style.left=x+"%";sticker.style.top=y+"%";
   });
   const stopSticker=e=>{if(!dragging)return;dragging=false;e.stopPropagation();soundFX("flip");};
   sticker.addEventListener("pointerup",stopSticker);sticker.addEventListener("pointercancel",stopSticker);
  });
 }
}
return {isExtra,start,next,render:renderer,handle,placeBuild,instruction,mountMusicTouch,mountBrushingTouch,mountTactileEngines};
})();
