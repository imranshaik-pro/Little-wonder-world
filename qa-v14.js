/* Headless visual/layout and interaction smoke checks for the v1.4 play-first update. */
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
const assert=require('assert');

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/tmp/lww-v2-tools/chrome-headless-shell-linux64/chrome-headless-shell',args:['--no-sandbox']});
 const output=[];
 try{
  for(const viewport of [{width:2400,height:1080},{width:1000,height:480}]){
   const page=await browser.newPage({viewport});
   const errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   await page.goto('file://'+path.join(__dirname,'app/src/main/assets/index.html'));
   await page.evaluate(()=>{localStorage.clear();location.reload();});
   await page.waitForSelector('[data-action="enter"]');
   await page.click('[data-action="enter"]');
   const id=viewport.width===2400?'large':'small';

   await page.evaluate(()=>beginMode('alphabet','letterhunt'));
   await page.waitForSelector('.letter-choice');
   const letters=await page.locator('.letter-choice .choice-icon').allTextContents();
   assert(letters.every(x=>/^[A-Z]$/.test(x)),`Actual letter tiles ${id}`);
   if(id==='large')await page.screenshot({path:path.join(__dirname,'qa-v14-letter.png')});
   const mission=await page.locator('.mission').boundingBox(),shell=await page.locator('.game-shell').boundingBox();
   assert(mission.width/shell.width>.92,`Mission compact width ${id}`);

   await page.evaluate(()=>{beginMode('animals','flashcards');state.cardIndex=cardCollection().findIndex(x=>x.name==='Elephant');render();});
   await page.waitForSelector('.flash-video');
   const video=await page.locator('.flash-video').boundingBox(),field=await page.locator('.playfield').boundingBox();
   assert(video.width/field.width>.44,`Animal video fills card ${id}, video=${video.width} field=${field.width}`);
   if(id==='large')await page.screenshot({path:path.join(__dirname,'qa-v14-elephant.png')});

   await page.evaluate(()=>beginMode('tracing','shapes'));
   await page.waitForSelector('#traceCanvas');
   const pad=await page.locator('.trace-pad').boundingBox(),traceField=await page.locator('.playfield').boundingBox();
   assert(pad.width/traceField.width>.88,`Full width shape tracing ${id}`);
   assert(pad.height/traceField.height>.55,`Large shape tracing ${id}`);
   await page.screenshot({path:path.join(__dirname,`qa-v14-shape-${id}.png`)});

   await page.evaluate(()=>{beginMode('tracing','capitals');state.round=2;state.traceLength=0;state.traceReady=false;render();});
   const canvas=await page.locator('#traceCanvas').boundingBox();
   await page.mouse.move(canvas.x+canvas.width*.32,canvas.y+canvas.height*.36);
   await page.mouse.down();
   await page.mouse.move(canvas.x+canvas.width*.66,canvas.y+canvas.height*.66,{steps:12});
   await page.mouse.up();
   await page.waitForTimeout(1600);
   const round=await page.evaluate(()=>state.round);
   assert(round===3,`Tracing must advance past C on complete stroke: ${round} (${id})`);
   const suspended=await page.evaluate(()=>{window.wonderPause();return {active:appActive,musicPaused:!backgroundMusic||backgroundMusic.paused};});
   assert(!suspended.active&&suspended.musicPaused,`Phone lock pauses all audio (${id})`);
   output.push({viewport:id,realLetters:letters,missionWidthPct:Math.round(mission.width/shell.width*100),videoWidthPct:Math.round(video.width/field.width*100),traceWidthPct:Math.round(pad.width/traceField.width*100),autoAdvancedToRound:round,errors});
   await page.close();
  }
  console.log(JSON.stringify(output,null,2));
  assert(output.every(o=>!o.errors.length),'No browser page errors');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
