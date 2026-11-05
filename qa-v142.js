/* v1.4.2 music + Bubble Pop acceptance and whole-app screen-space audit. */
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/tmp/lww-v2-tools/chrome-headless-shell-linux64/chrome-headless-shell',args:['--no-sandbox']});
 const results=[];
 try{
  for(const viewport of [{width:800,height:360},{width:1000,height:480},{width:1280,height:720},{width:2400,height:1080}]){
   const page=await browser.newPage({viewport});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/release.js',route=>route.fulfill({body:fs.readFileSync(path.join(__dirname,'releases/v1.4.2.js'),'utf8'),contentType:'text/javascript'}));
   await page.goto('file://'+path.join(__dirname,'app/src/main/assets/index.html'));
   await page.click('[data-action="enter"]');
   const music={};
   for(const mode of ['piano','xylophone','drums']){
    await page.evaluate(m=>beginMode('music',m),mode);
    const field=await page.locator('.playfield').boundingBox();
    const surface=await page.locator('.music-surface').boundingBox();
    const instrument=await page.locator(mode==='piano'?'.piano-board':mode==='xylophone'?'.xylo-frame':'.drum-kit').boundingBox();
    const finish=await page.locator('#musicDone').boundingBox();
    assert(instrument.width/field.width>.91,`${mode} width ${viewport.width}`);
    assert(instrument.height/field.height>.64,`${mode} height ${viewport.width}`);
    assert(finish.y+finish.height<=field.y+field.height+3,`${mode} Finish visible ${viewport.width}`);
    music[mode]={widthPct:Math.round(instrument.width/field.width*100),heightPct:Math.round(instrument.height/field.height*100),surfacePct:Math.round(surface.height/field.height*100)};
    if(viewport.width===1000||viewport.width===2400)
     await page.screenshot({path:path.join(__dirname,`qa-v142-${mode}-${viewport.width}.png`)});
   }
   await page.evaluate(()=>beginMode('music','piano'));
   for(let i=0;i<6;i++)await page.locator('.piano-white').nth(i).dispatchEvent('click');
   assert.strictEqual(await page.evaluate(()=>state.engine.taps),6,'Real piano keys increment notes played');
   assert.strictEqual(await page.locator('#musicDone').isEnabled(),true,'Six notes enable Finish');
   await page.locator('#musicDone').dispatchEvent('click');
   assert.strictEqual(await page.evaluate(()=>state.screen),'complete','Music finishes and credits progress');
   await page.evaluate(()=>beginMode('music','xylophone'));
   await page.locator('.xylo-bar').nth(1).dispatchEvent('click');
   assert.strictEqual(await page.evaluate(()=>state.engine.taps),1,'Xylophone bars really play/increment');
   await page.evaluate(()=>{state.age='4-5';beginMode('arcade','bubblepop');});
   assert.strictEqual(await page.locator('.pop-bubble').count(),12,'New game has twelve bubbles at ages 4–5');
   const arena=await page.locator('.bubble-game-grid').boundingBox();
   const bubbleSizes=await page.locator('.pop-bubble').evaluateAll(els=>els.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
   assert(bubbleSizes.every(b=>b.w>=50&&b.h>=50),`Easy bubble tap targets ${viewport.width}`);
   const firstBubble=await page.locator('.pop-bubble[data-value="0"]').boundingBox();
   await page.mouse.click(firstBubble.x+firstBubble.width/2,firstBubble.y+firstBubble.height/2);
   assert.strictEqual(await page.evaluate(()=>state.engine.taps),1,'Touch actually pops a bubble');
   assert.strictEqual(await page.locator('.pop-bubble').count(),11,'Popped bubble leaves arena');
   for(let i=1;i<12;i++)await page.locator(`.pop-bubble[data-value="${i}"]`).dispatchEvent('click');
   assert.strictEqual(await page.evaluate(()=>state.screen),'complete','Bubbles lead to real celebration');
   await page.evaluate(()=>beginMode('arcade','bubblepop'));
   if(viewport.width===1000||viewport.width===2400)
    await page.screenshot({path:path.join(__dirname,`qa-v142-bubbles-${viewport.width}.png`)});
   if(viewport.width===800){
    for(const [world,mode] of [['animals','diets'],['alphabet','letterhunt'],['balloon','alphabet']]){
     await page.evaluate(({world,mode})=>beginMode(world,mode),{world,mode});
     await page.screenshot({path:path.join(__dirname,`qa-v142-review-${world}-${mode}-800.png`)});
    }
   }
   // Screen-space audit across every selectable mode; identify hidden buttons
   // and overflow, not only whether JavaScript renders some content.
   const audit=await page.evaluate(()=>{
    const faults=[];let scanned=0,navScreens=0;
    state.screen='onboarding';render();
    if(!document.querySelector('[data-action="enter"]'))faults.push('onboarding: missing enter');
    navScreens++;
    state.screen='home';render();
    if(document.querySelectorAll('.land-card').length!==6)faults.push('home: missing learning lands');
    navScreens++;
    for(const land of WonderContent.lands){
     state.land=land.id;state.screen='land';render();navScreens++;
     const expected=visibleWorldIds.filter(id=>worlds[id].land===land.id).length;
     if(document.querySelectorAll('.world-card').length!==expected)faults.push(`land/${land.id}: missing worlds`);
    }
    for(const world of visibleWorldIds){
     state.world=world;state.modePage=0;state.screen='modes';render();navScreens++;
     const firstCount=Math.min(9,worlds[world].modes.length);
     if(document.querySelectorAll('.mode-card').length!==firstCount)faults.push(`modes/${world}: missing first page`);
     if(worlds[world].modes.length>9){
      state.modePage=1;render();navScreens++;
      const rest=worlds[world].modes.length-9;
      if(document.querySelectorAll('.mode-card').length!==Math.min(9,rest))faults.push(`modes/${world}: missing second page`);
     }
    }
    state.screen='parentGate';render();navScreens++;
    if(!document.querySelector('[data-action="gate"]'))faults.push('parent gate: missing answer buttons');
    state.screen='parent';render();navScreens++;
    if(!document.querySelector('.parent-card'))faults.push('parent: missing settings');
    for(const world of visibleWorldIds){
     for(const mode of worlds[world].modes){
      beginMode(world,mode[0]);scanned++;
      const field=document.querySelector('.playfield');
      if(!field){
       // Sketchpad deliberately owns the whole canvas instead of a .playfield.
       if(world==='coloring'&&mode[0]==='sketch'&&document.querySelector('.sketch-screen'))continue;
       faults.push(`${world}/${mode[0]}: missing field`);continue;
      }
      const b=field.getBoundingClientRect();
      // Moving balloons enter/exit the road on purpose; their overflow is
      // clipped by the road and is not inaccessible static UI.
      const movingBalloons=world==='balloon';
      if(!movingBalloons&&(field.scrollWidth>field.clientWidth+12||field.scrollHeight>field.clientHeight+12))
       faults.push(`${world}/${mode[0]}: field overflow ${field.scrollWidth-field.clientWidth}/${field.scrollHeight-field.clientHeight}`);
      let hidden=0;
      field.querySelectorAll('button').forEach(el=>{
       if(el.disabled||getComputedStyle(el).display==='none')return;
       const r=el.getBoundingClientRect();
       if(r.width<1||r.height<1)return;
       if(r.x<b.x-3||r.right>b.right+3||r.y<b.y-3||r.bottom>b.bottom+3)hidden++;
      });
      if(hidden&&!movingBalloons)faults.push(`${world}/${mode[0]}: ${hidden} off-edge buttons`);
      if(document.body.scrollWidth>innerWidth+6||document.body.scrollHeight>innerHeight+6)
       faults.push(`${world}/${mode[0]}: page overflow`);
     }
    }
    return {scanned,navScreens,faults};
   });
   results.push({viewport,music,arenaHeight:arena.height,bubbleMinPx:Math.round(Math.min(...bubbleSizes.map(b=>Math.min(b.w,b.h)))),audit,errors});
   await page.close();
  }
  console.log(JSON.stringify(results,null,2));
  assert(results.every(r=>!r.errors.length),'No browser JavaScript errors');
  assert(results.every(r=>r.audit.scanned===227),'All 227 modes checked at each size');
  assert(results.every(r=>r.audit.faults.length===0),'No missing or clipped UI in whole-app audit');
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exit(1)});
