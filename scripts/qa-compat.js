const fs=require('fs'),path=require('path'),assert=require('assert'),acorn=require('acorn'),vm=require('vm');
const root=path.resolve(__dirname,'..'),assets=path.join(root,'build/staged-assets');
assert(fs.existsSync(assets),'Run npm run stage first');
let scripts=0,files=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else{files++;
 if(p.endsWith('.js')){acorn.parse(fs.readFileSync(p,'utf8'),{ecmaVersion:2019,sourceType:'script'});scripts++;}
}}}
walk(assets);
const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g))assert(fs.existsSync(path.join(assets,match[1])),match[1]);
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(assets,'media-catalog.js'),'utf8'),sandbox);
const c=sandbox.window.__LWW_MEDIA_CATALOG__;
for(const file of c.files)assert(fs.existsSync(path.join(assets,'media-pack',file)),'Manifest missing '+file);
let missing=0;for(const entry of [...c.animals,...c.objects,...c.lessons])for(const [key,value] of Object.entries(entry))if(key.endsWith('_filename')&&value&&!c.files.includes(value))missing++;
assert(!/\bfetch\s*\(|replaceChildren\s*\(/.test(fs.readFileSync(path.join(assets,'hybrid-media.js'),'utf8')),'File-origin media must not fetch or use replaceChildren');
// Test the actual packaged assets with the full existing render harness.
const harness=fs.readFileSync(path.join(root,'qa-v15-render.js'),'utf8').replace("path.join(__dirname,'app/src/main/assets')","path.join(__dirname,'build/staged-assets')");
const testProcess={env:{},exitCode:0};
vm.runInNewContext(harness,{require,__dirname:root,console,process:testProcess}, {filename:'packaged-render.js'});
assert.strictEqual(testProcess.exitCode,0,'Packaged render harness failed');
console.log(JSON.stringify({status:'PASS',scripts,files,mediaManifest:c.files.length,unavailableMediaReferences:missing,syntax:'ES2019 / WebView 74'},null,2));
