/* Produce a clean, offline runtime. Never package raw modern JavaScript. */
const fs=require('fs'),path=require('path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'..'),src=path.join(root,'app/src/main/assets');
const out=path.join(root,'build/staged-assets'),version=process.argv[2]||'v2.0.1';
if(!/^v\d+\.\d+(\.\d+)?$/.test(version))throw Error('Invalid release');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
fs.cpSync(src,out,{recursive:true});
fs.copyFileSync(path.join(root,'releases',version+'.js'),path.join(out,'release.js'));
const media=path.join(out,'media-pack'),catalog={};
for(const name of ['animals','objects','lessons'])catalog[name]=JSON.parse(fs.readFileSync(path.join(media,'metadata',name+'.json'))).items||[];
catalog.files=JSON.parse(fs.readFileSync(path.join(media,'hybrid-available.json'))).files;
fs.writeFileSync(path.join(out,'media-catalog.js'),'window.__LWW_MEDIA_CATALOG__='+JSON.stringify(catalog)+';\n');
let count=0;
function compile(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);
 if(entry.isDirectory())compile(file);
 else if(file.endsWith('.js')){
  const result=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceType:'script',presets:[['@babel/preset-env',{targets:{chrome:'74'},modules:false,bugfixes:true}]],comments:true});
  fs.writeFileSync(file,result.code+'\n');count++;
 }
}}
compile(out);console.log(`Staged ${version}: ${count} scripts targeting WebView 74`);
