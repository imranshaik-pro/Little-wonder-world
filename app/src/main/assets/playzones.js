/* Little Wonder World: Immersive Play Zones (Agent 4)
 * Pettown, Safari, Hamster Maze, Aquarium - themed free-play worlds
 * Built on existing wonder engines (pretend, animal, tap, puzzle)
 */
window.WonderPlayZones=(function(){
const C=window.WonderContent||{worlds:{},things:{}};
const isExtra=w=>!!C.worlds[w]||["pettown","safari","hamster","aquarium"].includes(w);

// World definitions for Play Zones
const playZoneWorlds={
 pettown:{name:"Pettown",short:"Pettown",icon:"🐾",land:"wellbeing",color:"#ffe5da",type:"pretend",modes:[
  ["pet_vet","Pet Vet","🐶"],["pet_bath","Bath Time","🛁"],["pet_feed","Feed Pets","🍽️"],["pet_play","Playtime","🎾"]
 ]},
 safari:{name:"Safari",short:"Safari",icon:"🦁",land:"discovery",color:"#d4f0e0",type:"animals",modes:[
  ["safari_animals","Safari Animals","🦓"],["safari_sounds","Animal Sounds","👂"],["safari_tracks","Track Prints","🐾"],
  ["safari_habitat","Animal Homes","🏡"]
 ]},
 hamster:{name:"Hamster Maze",short:"Maze",icon:"🐹",land:"thinking",color:"#e1dafc",type:"tap",modes:[
  ["maze_collect","Collect Seeds","🌱"],["maze_nest","Build Nest","🏠"],["maze_escape","Escape Maze","🧩"]
 ]},
 aquarium:{name:"Aquarium",short:"Aquarium",icon:"🐠",land:"creative",color:"#c9eff8",type:"tap",modes:[
  ["fish_collect","Collect Fish","🐠"],["coral_grow","Grow Coral","🌸"],["treasure_hunt","Treasure Hunt","💎"]
 ]}
};

function buildModesForWorld(worldId){
 const w=playZoneWorlds[worldId];
 if(!w)return[];
 return w.modes.map(m=>({world:worldId,mode:m[0],label:m[1],icon:m[2]}));
}

function isPlayZone(world){
 return !!playZoneWorlds[world];
}

function getPlayZoneType(world){
 return playZoneWorlds[world]?.type||"pretend";
}

function startPlayZone(world,mode){
 if(!isPlayZone(world)){
  toast("Play Zone not found!");
  return;
 }
 const w=playZoneWorlds[world];
 speak(w.name+"! Let's explore "+w.name+".");
 beginMode(world,mode||w.modes[0][0]);
}

// Return the play zone data and helpers
return {
 isExtra,
 getPlayZoneType,
 buildModesForWorld,
 startPlayZone,
 worlds:playZoneWorlds,
 // Export for integration with content.js
 extendWorlds:function(targetObj){
  Object.assign(targetObj,playZoneWorlds);
 }
};
})();