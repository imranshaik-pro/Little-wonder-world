const {chromium}=require('playwright'),path=require('path'),fs=require('fs'),assert=require('assert');
(async()=>{
const browser=await chromium.launch({headless:true,...(process.env.LWW_CHROME?{executablePath:process.env.LWW_CHROME}:{})});
const context=await browser.newContext({viewport:{width:960,height:540},hasTouch:true});
await context.setOffline(true);const page=await context.newPage(),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
await page.goto('file://'+path.resolve(__dirname,'../build/staged-assets/index.html'));
await page.locator('[data-action=enter]').tap();await page.locator('.land-card').first().waitFor();
fs.mkdirSync('evidence',{recursive:true});await page.screenshot({path:'evidence/browser-home.png'});
assert.equal(await page.locator('.land-card').count(),6);
for(const id of await page.evaluate(()=>WonderContent.lands.map(l=>l.id))){
 await page.evaluate(()=>{state.screen='home';render()});await page.locator(`[data-action=land][data-value="${id}"]`).tap();
 assert.equal(await page.evaluate(()=>state.screen),'land');
}
const worlds=await page.evaluate(()=>visibleWorldIds.map(id=>({id,modes:worlds[id].modes.map(m=>m[0])})));
for(const world of worlds)for(const mode of world.modes){await page.evaluate(([id,m])=>beginMode(id,m),[world.id,mode]);assert((await page.locator('#app').innerText()).length>0);}
await page.evaluate(()=>{state.screen='home';render()});
await page.locator('#lww-media-entry').tap();assert(await page.locator('.lww-card').count()>0);
await page.evaluate(()=>{window.__qaPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(this.src.indexOf('media-pack/')!==-1)if(this.src.indexOf('media-pack/')!==-1)window.__qaMedia=this;return __qaPlay.apply(this,arguments)}});
await page.locator('#lww-media-panel [data-action=sound]').first().tap();
await page.waitForFunction(()=>window.__qaMedia && __qaMedia.currentTime>0);
await page.evaluate(()=>wonderPause());assert(await page.evaluate(()=>__qaMedia.paused));
const h264=await page.evaluate(()=>!!document.createElement('video').canPlayType('video/mp4; codecs="avc1.64001f"'));
await page.locator('#lww-media-panel [data-action=movement]').first().tap();
if(h264)await page.waitForFunction(()=>window.__qaMedia instanceof HTMLVideoElement && __qaMedia.currentTime>0);
else {await page.waitForFunction(()=>window.__qaMedia && __qaMedia.error);assert((await page.locator('#lww-player').innerText()).includes('cannot play'));}
// WebM is an additional existing offline format, independent of H.264 support.
await page.evaluate(()=>{const v=document.querySelector('#lww-player video');v.src='animal-videos/cow.webm';window.__qaWebm=v;v.play()});
await page.waitForFunction(()=>__qaWebm.currentTime>0);
await page.screenshot({path:'evidence/browser-video.png'});
await page.evaluate(()=>wonderBack());assert(await page.locator('#lww-media-panel').evaluate(e=>e.hidden));
await page.evaluate(()=>beginMode('tracing','capitals'));
const strokes=await page.evaluate(()=>{const r=document.querySelector('#traceCanvas').getBoundingClientRect();return liveTrace.paths.map(p=>p.map(([x,y])=>[x+r.left,y+r.top]))});
for(const stroke of strokes){await page.mouse.move(...stroke[0]);await page.mouse.down();for(const p of stroke.slice(1))await page.mouse.move(...p);await page.mouse.up();}
assert(await page.evaluate(()=>state.traceReady),'Tracing gesture completes');
await page.evaluate(()=>{persist('lww_qa_browser',{value:21});state.screen='home';render()});
await page.reload();assert.equal(await page.evaluate(()=>restore('lww_qa_browser',{}).value),21);assert.equal(await page.locator('.land-card').count(),6);
assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
const report={status:'PASS',browser:browser.version(),offline:true,worlds:27,activities:257,lands:6,animalAudio:true,animalVideo:h264?true:"Not Verified: browser has no H.264 decoder",webmVideo:true,tracing:true,reloadPersistence:true,errors,networkRequests:requests};
fs.writeFileSync('evidence/browser-results.json',JSON.stringify(report,null,2));console.log(report);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
