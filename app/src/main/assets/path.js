/* Linear Learning Path curriculum for Little Wonder World.
 * A step-by-step curriculum that guides children through biome-based learning.
 * Each biome contains 4-8 sequential activities ending in a "Show What You Know" quiz.
 */
window.WonderPath=(function(){
"use strict";

// Biome definitions - thematic chapters with sequential activities
// Each step: {world, mode, biome, unlockAfter: null|"quiz", quiz: false|true}
const learningPath=[
 // Pacific Island (biome 0) - Introduction to phonics and basic concepts
 {world:"alphabet",mode:"firstsound",biome:"Pacific Island",unlockAfter:null,quiz:false,icon:"🌺"},
 {world:"alphabet",mode:"rhyme",biome:"Pacific Island",unlockAfter:null,quiz:false,icon:"🎶"},
 {world:"alphabet",mode:"letterhunt",biome:"Pacific Island",unlockAfter:null,quiz:false,icon:"🔠"},
 {world:"alphabet",mode:"wordstart",biome:"Pacific Island",unlockAfter:"quiz",quiz:true,icon:"🌟"},

 // Deciduous Forest (biome 1) - Numbers and counting
 {world:"numbers",mode:"count",biome:"Deciduous Forest",unlockAfter:null,quiz:false,icon:"🌳"},
 {world:"numbers",mode:"apples",biome:"Deciduous Forest",unlockAfter:null,quiz:false,icon:"🍎"},
 {world:"numbers",mode:"order",biome:"Deciduous Forest",unlockAfter:null,quiz:false,icon:"🚂"},
 {world:"numbers",mode:"moreless",biome:"Deciduous Forest",unlockAfter:"quiz",quiz:true,icon:"⚖️"},

 // Savanna (biome 2) - Memory and matching
 {world:"puzzles",mode:"jigsaw",biome:"Savanna",unlockAfter:null,quiz:false,icon:"🦁"},
 {world:"memory",mode:"animals",biome:"Savanna",unlockAfter:null,quiz:false,icon:"🧠"},
 {world:"puzzles",mode:"odd",biome:"Savanna",unlockAfter:null,quiz:false,icon:"🔎"},
 {world:"puzzles",mode:"shadows",biome:"Savanna",unlockAfter:"quiz",quiz:true,icon:"🌙"},

 // Ocean Reef (biome 3) - Animals and nature awareness
 {world:"animals",mode:"listen",biome:"Ocean Reef",unlockAfter:null,quiz:false,icon:"🐠"},
 {world:"animals",mode:"farm",biome:"Ocean Reef",unlockAfter:null,quiz:false,icon:"🐄"},
 {world:"animals",mode:"safari",biome:"Ocean Reef",unlockAfter:null,quiz:false,icon:"🦓"},
 {world:"animals",mode:"baby",biome:"Ocean Reef",unlockAfter:"quiz",quiz:true,icon:"🐣"},

 // Farm & Field (biome 4) - Practical skills and life concepts
 {world:"life",mode:"hands",biome:"Farm & Field",unlockAfter:null,quiz:false,icon:"🌾"},
 {world:"life",mode:"teeth",biome:"Farm & Field",unlockAfter:null,quiz:false,icon:"🪥"},
 {world:"life",mode:"tidy",biome:"Farm & Field",unlockAfter:null,quiz:false,icon:"🧹"},
 {world:"life",mode:"healthyfood",biome:"Farm & Field",unlockAfter:"quiz",quiz:true,icon:"🥦"},

 // Arctic (biome 5) - Creative expression and art
 {world:"coloring",mode:"flowers",biome:"Arctic",unlockAfter:null,quiz:false,icon:"❄️"},
 {world:"coloring",mode:"ocean",biome:"Arctic",unlockAfter:null,quiz:false,icon:"🐠"},
 {world:"building",mode:"tower",biome:"Arctic",unlockAfter:null,quiz:false,icon:"🧱"},
 {world:"building",mode:"bridge",biome:"Arctic",unlockAfter:"quiz",quiz:true,icon:"🌉"},

 // Desert (biome 6) - Vehicle recognition and community helpers
 {world:"transport",mode:"vehicles",biome:"Desert",unlockAfter:null,quiz:false,icon:"🏜️"},
 {world:"transport",mode:"traffic",biome:"Desert",unlockAfter:null,quiz:false,icon:"🚦"},
 {world:"transport",mode:"travel",biome:"Desert",unlockAfter:null,quiz:false,icon:"🛩️"},
 {world:"transport",mode:"delivery",biome:"Desert",unlockAfter:"quiz",quiz:true,icon:"📦"},

 // City & Home (biome 7) - Emotions and daily life
 {world:"emotions",mode:"faces",biome:"City & Home",unlockAfter:null,quiz:false,icon:"🏙️"},
 {world:"emotions",mode:"expressions",biome:"City & Home",unlockAfter:null,quiz:false,icon:"😮"},
 {world:"emotions",mode:"sharing",biome:"City & Home",unlockAfter:null,quiz:false,icon:"🤝"},
 {world:"emotions",mode:"friendship",biome:"City & Home",unlockAfter:"quiz",quiz:true,icon:"💗"},

 // Space (biome 8) - Science and environment
 {world:"science",mode:"weather",biome:"Space",unlockAfter:null,quiz:false,icon:"🚀"},
 {world:"science",mode:"planets",biome:"Space",unlockAfter:null,quiz:false,icon:"🪐"},
 {world:"body",mode:"senses",biome:"Space",unlockAfter:null,quiz:false,icon:"👂"},
 {world:"body",mode:"time",biome:"Space",unlockAfter:"quiz",quiz:true,icon:"🕒"},

 // Prehistoric (biome 9) - Body safety and advanced concepts
 {world:"body",mode:"parts",biome:"Prehistoric",unlockAfter:null,quiz:false,icon:"🦕"},
 {world:"body",mode:"food",biome:"Prehistoric",unlockAfter:null,quiz:false,icon:"🥕"},
 {world:"body",mode:"helpers",biome:"Prehistoric",unlockAfter:null,quiz:false,icon:"👩‍⚕️"},
 {world:"body",mode:"safe",biome:"Prehistoric",unlockAfter:"quiz",quiz:true,icon:"🛟"}
];

// Biome metadata for display
const biomes=[
 {id:"pacific",name:"Pacific Island",icon:"🌺",color:"#FFE4E1"},
 {id:"forest",name:"Deciduous Forest",icon:"🌳",color:"#DFF5DA"},
 {id:"savanna",name:"Savanna",icon:"🦁",color:"#FDE5EA"},
 {id:"reef",name:"Ocean Reef",icon:"🐠",color:"#E6F5FF"},
 {id:"farm",name:"Farm & Field",icon:"🌾",color:"#FFF8E7"},
 {id:"arctic",name:"Arctic",icon:"❄️",color:"#F0F8FF"},
 {id:"desert",name:"Desert",icon:"🏜️",color:"#F5DEB3"},
 {id:"city",name:"City & Home",icon:"🏙️",color:"#F5F5F5"},
 {id:"space",name:"Space",icon:"🚀",color:"#E6F7FF"},
 {id:"prehistoric",name:"Prehistoric",icon:"🦕",color:"#E8E8E8"}
];

// Get path progress from stats (integer = number of steps completed)
function getPathProgress(stats){
 return stats?.pathProgress||0;
}

// Set path progress in stats object
function setPathProgress(stats,progress){
 stats.pathProgress=progress;
 if(typeof window !=="undefined"&&typeof persist==="function"){
  persist("lww2_stats",stats);
 }
}

// Get current step index (0-based)
function getCurrentStepIndex(stats){
 return getPathProgress(stats);
}

// Get current step details
function getCurrentStep(stats){
 const idx=getCurrentStepIndex(stats);
 return idx<learningPath.length?learningPath[idx]:null;
}

// Check if a world/mode is gated by path progress
function isGated(world,mode,stats){
 // Only gate worlds that are part of the learning path
 const stepIndex=learningPath.findIndex(s=>s.world===world&&s.mode===mode);
 if(stepIndex===-1)return false;

 // A step is gated if it's not yet unlocked (i.e., not the current step and not before it)
 const currentIdx=getCurrentStepIndex(stats);
 // Steps before the current index are already completed (unlocked)
 // The current step is the next one to do (unlocked)
 // Steps after the current index are locked
 return stepIndex>currentIdx;
}

// Check if a step is the next required step
function getNextStep(stats){
 const idx=getPathProgress(stats);
 return idx<learningPath.length?learningPath[idx]:null;
}

// Get biome name for a given step index
function getBiomeName(stepIndex){
 if(stepIndex>=learningPath.length)return null;
 return learningPath[stepIndex].biome||"My Learning Path";
}

// Get biome index from step index
function getBiomeIndex(stepIndex){
 if(stepIndex<0||stepIndex>=learningPath.length)return null;
 const biome=learningPath[stepIndex].biome;
 return biomes.findIndex(b=>b.name===biome);
}

// Check if step is a quiz
function isQuizStep(stepIndex){
 if(stepIndex<0||stepIndex>=learningPath.length)return false;
 return learningPath[stepIndex].quiz===true;
}

// Award progress for completing a path step
function awardPathProgress(stats,world,mode){
 const stepIndex=learningPath.findIndex(s=>s.world===world&&s.mode===mode);
 if(stepIndex===-1)return stats;

 const currentIdx=getCurrentStepIndex(stats);
 if(stepIndex===currentIdx){
  setPathProgress(stats,currentIdx+1);
 }
 return stats;
}

// Check if biome is complete (all steps in biome done)
function isBiomeComplete(biomeName,stats){
 const stepsInBiome=learningPath.filter(s=>s.biome===biomeName);
 if(stepsInBiome.length===0)return false;

 const completedIdx=getCurrentStepIndex(stats);
 const lastStepInBiome=stepsInBiome[stepsInBiome.length-1];
 const lastStepIndex=learningPath.indexOf(lastStepInBiome);

 // If we've completed past the last step of this biome, it's complete
 return completedIdx>lastStepIndex;
}

// Get biome completion bonuses
function getBiomeBonuses(stats){
 const bonuses=[];
 for(const biome of biomes){
  if(isBiomeComplete(biome.name,stats)){
   bonuses.push({biome:biome.name,bonus:true});
  }
 }
 return bonuses;
}

// Calculate total steps in path
function getTotalSteps(){
 return learningPath.length;
}

// Calculate steps remaining
function getStepsRemaining(stats){
 const completed=getPathProgress(stats);
 return Math.max(0,getTotalSteps()-completed);
}

// Check if a world/mode is a path step (part of the curriculum)
function isPathStep(world,mode){
 return learningPath.some(s=>s.world===world&&s.mode===mode);
}

return {
 learningPath,
 biomes,
 getPathProgress,
 setPathProgress,
 getCurrentStepIndex,
 getCurrentStep,
 isGated,
 getNextStep,
 getBiomeName,
 getBiomeIndex,
 isQuizStep,
 awardPathProgress,
 isBiomeComplete,
 getBiomeBonuses,
 getTotalSteps,
 getStepsRemaining,
 isPathStep
};
})();