/* Wonder Shop — offline catalog + purchase/equip logic.
 * Tickets are earned ONLY through play. No microtransactions, no ads.
 */
window.WonderShop=(function(){
 const catalog={
  avatar:[
   {id:"hat_bear",name:"Bear Cap",icon:"🧢",cost:15},
   {id:"hat_bunny",name:"Bunny Ears",icon:"🐰",cost:15},
   {id:"hat_crown",name:"Golden Crown",icon:"👑",cost:30},
   {id:"hat_astronaut",name:"Astronaut Helmet",icon:"👨‍🚀",cost:25},
   {id:"shirt_stripe",name:"Striped Shirt",icon:"👕",cost:12},
   {id:"shirt_super",name:"Superhero Cape",icon:"🦸",cost:28},
   {id:"shirt_dino",name:"Dino Hoodie",icon:"🦕",cost:20},
   {id:"glasses_round",name:"Round Glasses",icon:"👓",cost:10},
   {id:"glasses_cool",name:"Cool Shades",icon:"😎",cost:18},
   {id:"hair_pigtails",name:"Pigtails",icon:"🧒",cost:12},
   {id:"hair_spiky",name:"Spiky Hair",icon:"👦",cost:12},
   {id:"hair_curly",name:"Curly Curls",icon:"👩",cost:12}
  ],
  aquarium:[
   {id:"fish_clown",name:"Clownfish",icon:"🐠",cost:18},
   {id:"fish_gold",name:"Goldfish",icon:"🐟",cost:10},
   {id:"fish_betta",name:"Betta Fish",icon:"🐠",cost:22},
   {id:"fish_angler",name:"Angler Fish",icon:"🎣",cost:35},
   {id:"coral_brain",name:"Brain Coral",icon:"🧠",cost:15},
   {id:"coral_fan",name:"Fan Coral",icon:"🌸",cost:15},
   {id:"treasure_chest",name:"Treasure Chest",icon:"💰",cost:30},
   {id:"seaweed_kelp",name:"Kelp Forest",icon:"🌿",cost:12},
   {id:"rock_castle",name:"Coral Castle",icon:"🏰",cost:28},
   {id:"shell_pearl",name:"Pearl Shell",icon:"🐚",cost:16},
   {id:"bubbles_stream",name:"Bubble Stream",icon:"🫧",cost:8},
   {id:"starfish",name:"Starfish",icon:"⭐",cost:10}
  ],
  room:[
   {id:"wall_pastel",name:"Pastel Walls",icon:"🎨",cost:20},
   {id:"wall_stars",name:"Starry Night",icon:"🌌",cost:25},
   {id:"wall_cloud",name:"Cloud Wallpaper",icon:"☁️",cost:18},
   {id:"bed_canopy",name:"Canopy Bed",icon:"🛏️",cost:30},
   {id:"bed_bunk",name:"Bunk Bed",icon:"🛌",cost:28},
   {id:"bed_race",name:"Race Car Bed",icon:"🏎️",cost:35},
   {id:"rug_cloud",name:"Cloud Rug",icon:"☁️",cost:15},
   {id:"rug_round",name:"Round Rug",icon:"🟢",cost:12},
   {id:"lamp_moon",name:"Moon Lamp",icon:"🌙",cost:22},
   {id:"lamp_cloud",name:"Cloud Lamp",icon:"☁️",cost:20},
   {id:"window_view",name:"Garden View",icon:"🌳",cost:18},
   {id:"window_space",name:"Space Window",icon:"🪐",cost:25}
  ]
 };

 function getItem(cat,id){
  const arr=catalog[cat];
  if(!arr)return null;
  return arr.find(i=>i.id===id)||null;
 }

 function getEquippedAvatar(){
  const stats=window.restore?window.restore("lww2_stats",{}):(window.stats||{});
  const equipped=stats.equipped||{};
  return {
   hat:equipped.avatar?equipped.avatar.replace("hat_",""):null,
   shirt:equipped.avatar?equipped.avatar.replace("shirt_",""):null,
   glasses:equipped.avatar?equipped.avatar.replace("glasses_",""):null,
   hair:equipped.avatar?equipped.avatar.replace("hair_",""):null
  };
 }

 function getUnlockedDecor(){
  const stats=window.restore?window.restore("lww2_stats",{}):(window.stats||{});
  return stats.unlockedDecor||[];
 }

 return {catalog,getItem,getEquippedAvatar,getUnlockedDecor};
})();

// Provide local storage helpers if not already on window
if(typeof window.persist!=="function"){
 window.persist=function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
}
if(typeof window.restore!=="function"){
 window.restore=function(k,fallback){try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):fallback;}catch(e){return fallback;}};
}