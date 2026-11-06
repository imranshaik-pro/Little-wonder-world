const postcss=require('postcss'),parse=require('postcss-value-parser');
// Preserve modern declarations, preceded by valid WebView 74 fallbacks.
module.exports=function cssCompat(source){
 const root=postcss.parse(source);
 root.walkDecls(d=>{
  if(d.prop==='inset'){
   const v=postcss.list.space(d.value),sides=[v[0],v[1]||v[0],v[2]||v[0],v[3]||v[1]||v[0]];
   ['top','right','bottom','left'].forEach((prop,i)=>d.cloneBefore({prop,value:sides[i]}));
  }
  const value=parse(d.value);let changed=false;
  value.walk(n=>{
   if(n.type!=='function'||!['clamp','min','max'].includes(n.value))return;
   const args=[];let part=[];for(const token of n.nodes){if(token.type==='div'&&token.value===','){args.push(parse.stringify(part));part=[];}else part.push(token);}args.push(parse.stringify(part));
   if(n.value==='clamp'&&args.length===3){n.type='word';n.value=args[1].trim();delete n.nodes;changed=true;}
   else if(n.value==='min'&&args.length===2){
    if(d.prop==='width')d.cloneBefore({prop:'max-width',value:args[1].trim()});
    n.type='word';n.value=args[0].trim();delete n.nodes;changed=true;
   }else throw Error('Unsupported CSS math fallback: '+d.toString());
  });
  if(changed)d.cloneBefore({value:value.toString()});
 });
 return root.toString();
};
