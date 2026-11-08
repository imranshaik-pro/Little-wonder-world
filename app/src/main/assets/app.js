/* Little Wonder World: offline-first preschool activity engine.
 * Original interface, local-only progress, zero ads, and large touch targets.
 */
"use strict";
const $ = s => document.querySelector(s);
const rand = n => Math.floor(Math.random() * n);
const pick = a => a[rand(a.length)];
const shuffle = a => [...a].sort(() => Math.random() - .5);
const WonderDB=(function(){
 let dbP=null;
 function open(){
  if(typeof indexedDB==="undefined")return Promise.resolve(null);
  if(dbP)return dbP;
  dbP=new Promise(res=>{
   try{
    const req=indexedDB.open("LittleWonderWorldDB",1);
    req.onupgradeneeded=e=>{try{e.target.result.createObjectStore("kv");}catch(_){}};
    req.onsuccess=e=>res(e.target.result);
    req.onerror=()=>res(null);
   }catch(_){res(null);}
  });
  return dbP;
 }
 return {
  set(k,v){open().then(db=>{if(!db)return;try{const tx=db.transaction("kv","readwrite");tx.objectStore("kv").put(v,k);}catch(_){}});},
  get(k,cb){open().then(db=>{if(!db)return;try{const tx=db.transaction("kv","readonly"),r=tx.objectStore("kv").get(k);r.onsuccess=()=>{if(r.result!==undefined)cb(r.result);};}catch(_){}});}
 };
})();
const persist = (k,v) => {
 try { localStorage.setItem(k,JSON.stringify(v)); } catch(e){}
 if(k==="lww3_family"||k==="lww2_gallery")WonderDB.set(k,v);
 if(k==="lww3_family"&&typeof window!=="undefined"&&window.WonderNative?.saveFamilyAlbum){
  try{window.WonderNative.saveFamilyAlbum(JSON.stringify(v));}catch(_){}
 }
};
const restore = (k,fallback) => {
 try {
  const v=localStorage.getItem(k);
  if(v!==null)return JSON.parse(v);
  if(k==="lww3_family"&&typeof window!=="undefined"&&window.WonderNative?.loadFamilyAlbum){
   const nv=window.WonderNative.loadFamilyAlbum();
   if(nv)return JSON.parse(nv);
  }
  return fallback;
 } catch(e){return fallback;}
};
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const worlds = {
 sorting:{name:"Color & Shape Sorting",short:"Sorting",icon:"🧩",color:"#fbdce6",modes:[
  ["colors","Color Garden","🌈"],["shapes","Shape Boxes","🔷"],["sizes","Big or Small","🐘"],
  ["patterns","Pattern Train","🚂"],["food","Food Baskets","🧺"],["habitat","Nature Homes","🏡"]]},
 animals:{name:"Animal Sounds",short:"Animals",icon:"🦁",color:"#d4f0e0",modes:[
  ["listen","Listen & Find","👂"],["safari","Sound Safari","🦓"],["farm","Farm Friends","🐮"],
  ["baby","Baby Animals","🐣"],["homes","Animal Homes","🪺"],["shadow","Shadow Guess","🕵️"]]},
 memory:{name:"Memory Matching",short:"Memory",icon:"🧠",color:"#e1dafc",modes:[
  ["animals","Animal Pairs","🐨"],["colors","Color Pairs","🎨"],["fruits","Fruit Pairs","🍉"],
  ["letters","Letter Pairs","🔤"],["numbers","Number Pairs","🔢"],["vehicles","Vehicle Pairs","🚜"]]},
 tracing:{name:"Alphabet Tracing",short:"Tracing",icon:"✏️",color:"#fef0b7",modes:[
  ["capitals","Big ABC","🅰️"],["lower","Little abc","🔡"],["numbers","Trace 123","🔢"],
  ["shapes","Draw Shapes","⭐"],["lines","Fun Lines","〰️"],["words","First Words","📚"]]},
 coloring:{name:"Coloring Studio",short:"Coloring",icon:"🎨",color:"#cdebf8",modes:[
  ["flowers","Flower Garden","🌸"],["ocean","Under the Sea","🐠"],["bear","Teddy Bear","🧸"],
  ["car","Happy Car","🚗"],["fruits","Fruit Basket","🍎"],["dino","Dinosaur Land","🦕"]]},
 balloon:{name:"Balloon Pop Adventure",short:"Balloon Pop",icon:"🎈",color:"#fce1c9",modes:[
  ["alphabet","Alphabet Pop","🔤"],["colors","Color Pop","🌈"],["numbers","Number Pop","🔢"],
  ["shapes","Shape Pop","🔶"],["animals","Animal Pop","🦊"],["cartoons","Cartoon Pop","🧚"],
  ["fruits","Fruit Pop","🍓"],["food","Food Pop","🍔"],["vehicles","Vehicle Pop","🚒"]]}
};
/* Preserve the original six learning games and extend them in every release. */
const release=window.__LWW_RELEASE__||{id:"v1.0",worlds:["sorting","animals","memory","tracing","coloring","balloon",...Object.keys(WonderContent.worlds)],landed:true,path:true,progress:0};
const expandedRelease=["v1.2","v1.3","v1.4","v1.4.1","v1.4.2","v1.5"].includes(release.id);
const familyRelease=["v1.3","v1.4","v1.4.1","v1.4.2","v1.5"].includes(release.id);
const restoredRelease=["v1.4.1","v1.4.2","v1.5"].includes(release.id);
const spaciousRelease=["v1.4.2","v1.5"].includes(release.id);
Object.assign(worlds,WonderContent.worlds);
if(familyRelease){
 worlds.flashbook={name:"Wonder Flashcards",short:"Flashcards",icon:"🗂️",land:"discovery",color:"#d7edf7",modes:[
  ["vehicles","Vehicles & Sirens","🚑"],["fruits","Juicy Fruits","🍓"],["vegetables","Vegetables","🥦"],
  ["food","Food & Snacks","🥗"],["helpers","Community Helpers","👩‍🚒"],["familywords","Family Words","👨‍👩‍👧"],
  ["home","Things at Home","🏠"],["body","My Body","👂"],["nature","Nature & Weather","🌦️"],
  ["instruments","Music Makers","🎺"],["feelings","Big Feelings","🥰"],["shapes","Colors & Shapes","🔷"],
  ["places","Places We Go","🏫"],["opposites","Opposites","⬆️"],["birds","Birds","🦉"],
  ["farm","Farm Animals","🐮"]]};
 worlds.family={name:"My Family Album",short:"My Family",icon:"🏡",land:"wellbeing",color:"#ffe2d2",modes:[
  ["familycards","Meet My Family","🖼️"],["familyquiz","Who's Who?","💗"]]};
 worlds.body.modes.push(["doorstory","Knock Knock! Door Safety","🚪"]);
}
const legacyLand={sorting:"thinking",animals:"discovery",memory:"thinking",tracing:"foundations",coloring:"creative",balloon:"funfair"};
Object.keys(legacyLand).forEach(id=>worlds[id].land=legacyLand[id]);
worlds.sorting.modes.push(["toys","Toy Sorting","🧸"],["weather","Weather Sort","🌦️"],["tools","Helper Tools","🛠️"]);
worlds.animals.modes.push(["tracks","Animal Footprints","🐾"],["diets","Animal Food","🥕"],["babyhomes","Baby & Parent","🐣"]);
worlds.memory.modes.push(["emotions","Feeling Pairs","🥰"],["foods","Food Pairs","🥕"],["toys","Toy Pairs","🪀"]);
worlds.tracing.modes.push(["curves","Swirly Curves","🌀"],["patterns","Trace Patterns","🔶"],["symbols","Fun Symbols","🎵"]);
worlds.coloring.modes.push(["space","Space Friends","🚀"],["rainbow","Rainbow Sky","🌈"],["castle","Fairy Castle","🏰"]);
worlds.balloon.modes.push(["weather","Weather Pop","🌦️"],["toys","Toy Pop","🪀"],["lettersounds","Sound Pop","🅰️"]);
const visibleWorldIds=release.worlds.filter(id=>worlds[id]);
if(expandedRelease){
 worlds.animals.modes.push(["flashcards","Animal Flashcards","🗂️"],["objectcards","Object Sound Cards","🚗"]);
 if(release.id==="v1.5")worlds.coloring.modes.unshift(["sketch","My Sketch Pad","🖍️"]);
 else worlds.coloring.modes.push(["sketch","My Sketch Pad","🖍️"]);
 worlds.alphabet.modes.push(["abcjourney","ABC Journey","🅰️","journey"]);
 worlds.numbers.modes.push(["numbertrail","Numbers 1–100","🔢","journey"]);
}
if(restoredRelease){
 // Keep every v1.3 animal activity; put the missing-looking encyclopedias first.
 const previous=worlds.animals.modes.filter(m=>!["flashcards","objectcards"].includes(m[0]));
 worlds.animals.modes=[
  ["flashcards","All Animal Cards · 123","🦁"],
  ["realfilms","Real Films · 6","🎬"],
  ["objectcards","Object Sound Cards · 45","🚗"],
  ...previous
 ];
}
if(spaciousRelease){
 // A separate pop-the-bubble activity; the existing Bubble Catch is not removed.
 worlds.arcade.modes.unshift(["bubblepop","Pop the Bubbles","🫧","bubblepop"]);
}
const colorNames = ["Red","Blue","Yellow","Green","Purple","Orange","Pink"];
const colorHex = ["#fe6b80","#5da8f9","#ffd859","#69d59a","#bc8bea","#ffad6b","#f5a2ca"];
const SHAPES = ["Circle","Square","Triangle","Star","Heart","Diamond"];
const shapeGlyph = {"Circle":"●","Square":"■","Triangle":"▲","Star":"★","Heart":"♥","Diamond":"◆"};
const animals = [
 {name:"Cow",icon:"🐮",sound:"Moo",home:"Farm",baby:"Calf"},
 {name:"Dog",icon:"🐶",sound:"Woof",home:"House",baby:"Puppy"},
 {name:"Cat",icon:"🐱",sound:"Meow",home:"House",baby:"Kitten"},
 {name:"Duck",icon:"🦆",sound:"Quack",home:"Pond",baby:"Duckling"},
 {name:"Sheep",icon:"🐑",sound:"Baa",home:"Farm",baby:"Lamb"},
 {name:"Lion",icon:"🦁",sound:"Roar",home:"Jungle",baby:"Cub"},
 {name:"Bird",icon:"🐦",sound:"Tweet",home:"Nest",baby:"Chick"},
 {name:"Elephant",icon:"🐘",sound:"Trumpet",home:"Forest",baby:"Calf"},
 {name:"Pig",icon:"🐷",sound:"Oink",home:"Farm",baby:"Piglet"},
 {name:"Horse",icon:"🐴",sound:"Neigh",home:"Stable",baby:"Foal"},
 {name:"Frog",icon:"🐸",sound:"Ribbit",home:"Pond",baby:"Tadpole"},
 {name:"Bee",icon:"🐝",sound:"Buzz",home:"Hive",baby:"Larva"}
];
if(expandedRelease)animals.push(
 {name:"Wolf",icon:"🐺",sound:"Howl",home:"Forest",baby:"Pup"},
 {name:"Owl",icon:"🦉",sound:"Hoot",home:"Nest",baby:"Owlet"},
 {name:"Hen",icon:"🐔",sound:"Cluck",home:"Farm",baby:"Chick"},
 {name:"Rooster",icon:"🐓",sound:"Crow",home:"Farm",baby:"Chick"},
 {name:"Bat",icon:"🦇",sound:"Squeak",home:"Forest",baby:"Pup"},
 {name:"Tiger",icon:"🐅",sound:"Roar",home:"Forest",baby:"Cub"},
 {name:"Monkey",icon:"🐒",sound:"Chatter",home:"Forest",baby:"Infant"},
 {name:"Goat",icon:"🐐",sound:"Bleat",home:"Farm",baby:"Kid"},
 {name:"Donkey",icon:"🫏",sound:"Bray",home:"Stable",baby:"Foal"},
 {name:"Dolphin",icon:"🐬",sound:"Click",home:"Ocean",baby:"Calf"},
 {name:"Eagle",icon:"🦅",sound:"Screech",home:"Nest",baby:"Eaglet"},
 {name:"Parrot",icon:"🦜",sound:"Squawk",home:"Nest",baby:"Chick"},
 {name:"Penguin",icon:"🐧",sound:"Call",home:"Ocean",baby:"Chick"},
 {name:"Deer",icon:"🦌",sound:"Bleat",home:"Forest",baby:"Fawn"},
 {name:"Crocodile",icon:"🐊",sound:"Growl",home:"Pond",baby:"Hatchling"},
 {name:"Crow",icon:"🐦",sound:"Caw",home:"Nest",baby:"Chick"},
 {name:"Pigeon",icon:"🕊️",sound:"Coo",home:"Nest",baby:"Squab"},
 {name:"Hyena",icon:"🐕",sound:"Laugh",home:"Forest",baby:"Cub"},
 {name:"Coyote",icon:"🐺",sound:"Howl",home:"Forest",baby:"Pup"}
);
// Explore a broad animal encyclopedia. Only cards with a bundled recording display "Hear animal".
const extraAnimalCatalog={
 Farm:"Goat|🐐,Donkey|🫏,Buffalo|🐃,Ox|🐂,Lamb|🐑,Turkey|🦃,Goose|🪿,Rabbit|🐇,Alpaca|🦙,Llama|🦙",
 Pets:"Hamster|🐹,Guinea Pig|🐹,Parrot|🦜,Goldfish|🐠,Tortoise|🐢,Ferret|🦦,Budgie|🐦,Mouse|🐁",
 Wild:"Tiger|🐅,Giraffe|🦒,Zebra|🦓,Monkey|🐒,Gorilla|🦍,Chimpanzee|🐒,Bear|🐻,Panda|🐼,Koala|🐨,Kangaroo|🦘,Leopard|🐆,Cheetah|🐆,Rhinoceros|🦏,Hippopotamus|🦛,Camel|🐪,Fox|🦊,Deer|🦌,Moose|🫎,Hedgehog|🦔,Sloth|🦥,Otter|🦦,Raccoon|🦝,Skunk|🦨,Squirrel|🐿️,Beaver|🦫,Bison|🦬,Wild Boar|🐗,Crocodile|🐊,Snake|🐍,Lizard|🦎",
 Birds:"Eagle|🦅,Hawk|🦅,Falcon|🦅,Peacock|🦚,Flamingo|🦩,Swan|🦢,Penguin|🐧,Ostrich|🐦,Emu|🐦,Toucan|🐦,Macaw|🦜,Pigeon|🕊️,Sparrow|🐦,Crow|🐦,Robin|🐦,Woodpecker|🐦,Pelican|🐦,Heron|🐦,Kingfisher|🐦,Hummingbird|🐦",
 Ocean:"Dolphin|🐬,Whale|🐋,Shark|🦈,Octopus|🐙,Squid|🦑,Jellyfish|🪼,Sea Turtle|🐢,Starfish|⭐,Crab|🦀,Lobster|🦞,Shrimp|🦐,Seahorse|🐠,Clownfish|🐠,Ray|🐟,Seal|🦭,Walrus|🦭,Orca|🐋,Pufferfish|🐡,Angelfish|🐠,Eel|🐍",
 "Tiny Friends":"Butterfly|🦋,Ladybug|🐞,Ant|🐜,Cricket|🦗,Grasshopper|🦗,Dragonfly|🪰,Firefly|🪲,Snail|🐌,Caterpillar|🐛,Spider|🕷️,Beetle|🪲,Moth|🦋,Praying Mantis|🦗,Centipede|🐛,Worm|🪱"
};
const animalAtlas=[...animals.map(a=>({name:a.name,icon:a.icon,group:["Cow","Sheep","Pig","Horse","Hen","Rooster"].includes(a.name)?"Farm":["Dog","Cat"].includes(a.name)?"Pets":"Wild"})),
 ...Object.entries(extraAnimalCatalog).flatMap(([group,text])=>text.split(",").map(item=>{const [name,icon]=item.split("|");return {name,icon,group};}))];
const animalAtlasUnique=[...new Map(animalAtlas.map(a=>[a.name,a])).values()];
if(familyRelease)animalAtlasUnique.push({name:"Beluga Whale",icon:"🐋",group:"Ocean"});
const animalLearningFacts={
 Cow:{habitat:"Farms and grasslands",baby:"Calf",food:"Grass and hay",fact:"Cows graze on grass and rest with their herd."},
 Dog:{habitat:"Homes and communities",baby:"Puppy",food:"Dog food",fact:"Dogs use their keen noses to explore."},
 Elephant:{habitat:"Savannas and forests",baby:"Calf",food:"Grass, leaves and bark",fact:"An elephant uses its trunk to smell, drink and pick up food."},
 Cat:{habitat:"Homes and farms",baby:"Kitten",food:"Meat-based food",fact:"A cat's whiskers help it sense nearby things."},
 Horse:{habitat:"Farms and grasslands",baby:"Foal",food:"Grass and hay",fact:"A horse can rest standing up."},
 Goat:{habitat:"Farms and rocky hills",baby:"Kid",food:"Leaves and grass",fact:"Goats are good climbers."}
};
const objectCards=[
 ["Car","🚗","car"],["Train","🚂","train"],["Bicycle","🚲","bicycle"],["Helicopter","🚁","helicopter"],["Truck","🚚","truck"],
 ["Plane","✈️","plane"],["Boat","⛵","boat"],["Telephone","📞","telephone"],["Doorbell","🔔","doorbell"],["Clock","⏰","clock"],
 ["Rain","🌧️","rain"],["Thunder","⛈️","thunder"],["Water","💧","water"],["Wind","💨","wind"],["Drum","🥁","drum"],
 ["Piano","🎹","piano"],["Guitar","🎸",null],["Bell","🛎️","bell"],["Book","📚",null],["Pencil","✏️",null],
 ["Scissors","✂️",null],["Spoon","🥄",null],["Cup","🥤",null],["Camera","📷",null],["Umbrella","☂️",null],
 ["Apple","🍎",null],["Banana","🍌",null],["Orange","🍊",null],["Ball","⚽",null],["Toy Car","🚙",null],
 ["Chair","🪑",null],["Bed","🛏️",null],["Toothbrush","🪥",null],["Key","🔑",null],["Shoes","👟",null],
 ["Bus","🚌",null],["Fire Engine","🚒",null],["Rocket","🚀",null],["Bee","🐝",null],["Bird","🐦",null]
].map(([name,icon,sound])=>({name,icon,sound}));
if(familyRelease)objectCards.push(
 {name:"Ambulance",icon:"🚑"},{name:"Motorcycle",icon:"🏍️"},{name:"Police Car",icon:"🚓"},
 {name:"Bicycle Bell",icon:"🔔"},{name:"Knocking Door",icon:"🚪"}
);
const extraFlashcards={
 vehicles:"Ambulance|🚑,Fire Engine|🚒,Police Car|🚓,Car|🚗,Bicycle|🚲,Motorcycle|🏍️,Bus|🚌,Truck|🚚,Train|🚂,Helicopter|🚁,Plane|✈️,Boat|⛵",
 fruits:"Apple|🍎,Banana|🍌,Mango|🥭,Grapes|🍇,Strawberry|🍓,Orange|🍊,Watermelon|🍉,Pineapple|🍍,Cherry|🍒,Pear|🍐",
 vegetables:"Carrot|🥕,Broccoli|🥦,Tomato|🍅,Potato|🥔,Corn|🌽,Peas|🫛,Cucumber|🥒,Pepper|🫑,Onion|🧅,Mushroom|🍄",
 food:"Rice|🍚,Bread|🍞,Egg|🥚,Milk|🥛,Cheese|🧀,Pizza|🍕,Sandwich|🥪,Soup|🥣,Salad|🥗,Cake|🍰",
 helpers:"Doctor|👨‍⚕️,Nurse|👩‍⚕️,Firefighter|🧑‍🚒,Teacher|👩‍🏫,Police Officer|👮,Farmer|👨‍🌾,Chef|👩‍🍳,Pilot|👩‍✈️,Bus Driver|🚌,Postal Worker|📬",
 familywords:"Grandpa|👴,Grandma|👵,Mom|👩,Dad|👨,Brother|👦,Sister|👧,Aunt|👩,Uncle|👨,Cousin|🧒,Baby|👶",
 home:"Doorbell|🔔,Door|🚪,Window|🪟,Bed|🛏️,Chair|🪑,Table|🪑,Spoon|🥄,Cup|🥤,Clock|⏰,Telephone|📞,Toothbrush|🪥,Book|📖",
 body:"Eye|👁️,Ear|👂,Nose|👃,Mouth|👄,Hand|✋,Foot|🦶,Knee|🦵,Heart|❤️,Tooth|🦷,Hair|💇",
 nature:"Sun|☀️,Moon|🌙,Star|⭐,Rain|🌧️,Thunder|⛈️,Cloud|☁️,Wind|💨,Rainbow|🌈,Tree|🌳,Flower|🌸,River|🏞️,Snow|❄️",
 instruments:"Piano|🎹,Drum|🥁,Guitar|🎸,Bell|🔔,Violin|🎻,Trumpet|🎺,Xylophone|🎶,Flute|🪈",
 feelings:"Happy|😊,Sad|😢,Angry|😠,Excited|🤩,Calm|😌,Sleepy|😴,Surprised|😮,Worried|😟,Proud|😄,Shy|☺️",
 shapes:"Red|🔴,Blue|🔵,Yellow|🟡,Green|🟢,Orange|🟠,Purple|🟣,Circle|⚪,Square|🟦,Triangle|🔺,Star|⭐,Heart|❤️,Diamond|🔷",
 places:"Home|🏠,School|🏫,Hospital|🏥,Park|🛝,Library|📚,Shop|🏪,Zoo|🦒,Beach|🏖️,Farm|🚜,Fire Station|🚒",
 opposites:"Big|🐘,Small|🐭,Up|⬆️,Down|⬇️,Hot|🔥,Cold|🧊,Fast|🏎️,Slow|🐢,Day|☀️,Night|🌙",
 birds:"Owl|🦉,Eagle|🦅,Parrot|🦜,Duck|🦆,Hen|🐔,Rooster|🐓,Penguin|🐧,Peacock|🦚,Swan|🦢,Pigeon|🕊️",
 farm:"Cow|🐮,Pig|🐷,Goat|🐐,Sheep|🐑,Horse|🐴,Donkey|🫏,Duck|🦆,Rooster|🐓,Hen|🐔,Rabbit|🐇"
};
const flashcardCatalog=Object.fromEntries(Object.entries(extraFlashcards).map(([category,s])=>[category,s.split(",").map(e=>{const [name,icon]=e.split("|");return {name,icon};})]));
const balloonData = {
 alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(x=>({name:x,icon:x})),
 colors:colorNames.map((x,i)=>({name:x,icon:"●",color:colorHex[i]})),
 numbers:Array.from({length:20},(_,i)=>({name:String(i+1),icon:String(i+1)})),
 shapes:SHAPES.map(x=>({name:x,icon:shapeGlyph[x]})),
 animals:animals.map(x=>({name:x.name,icon:x.icon})),
 cartoons:[["Friendly Dragon","🐲"],["Rainbow Unicorn","🦄"],["Little Robot","🤖"],["Magic Fairy","🧚"],["Space Alien","👽"],["Happy Ghost","👻"],["Snow Friend","⛄"],["Smiley Monster","👾"],["Funny Clown","🤡"]].map(x=>({name:x[0],icon:x[1]})),
 fruits:[["Apple","🍎"],["Banana","🍌"],["Grapes","🍇"],["Strawberry","🍓"],["Watermelon","🍉"],["Orange","🍊"],["Pineapple","🍍"],["Cherry","🍒"],["Mango","🥭"]].map(x=>({name:x[0],icon:x[1]})),
 food:[["Pizza","🍕"],["Sandwich","🥪"],["Bread","🍞"],["Rice","🍚"],["Cheese","🧀"],["Egg","🥚"],["Carrot","🥕"],["Corn","🌽"],["Cake","🍰"]].map(x=>({name:x[0],icon:x[1]})),
 vehicles:[["Car","🚗"],["Bus","🚌"],["Train","🚂"],["Truck","🚚"],["Plane","✈️"],["Boat","⛵"],["Tractor","🚜"],["Fire Engine","🚒"],["Bicycle","🚲"]].map(x=>({name:x[0],icon:x[1]})),
 weather:[["Sun","☀️"],["Rain","🌧️"],["Snow","❄️"],["Rainbow","🌈"],["Cloud","☁️"],["Wind","💨"]].map(x=>({name:x[0],icon:x[1]})),
 toys:[["Teddy","🧸"],["Yo-yo","🪀"],["Ball","⚽"],["Blocks","🧱"],["Kite","🪁"],["Puzzle","🧩"]].map(x=>({name:x[0],icon:x[1]})),
 lettersounds:"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(x=>({name:x,icon:x}))
};
const palettes=["#ff7185","#ffb56b","#ffdf5d","#82d89e","#76c7f7","#af93e9","#f69fc6","#d9b18a"];
const traceDecks={
 capitals:"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
 lower:"abcdefghijklmnopqrstuvwxyz".split(""),
 numbers:["1","2","3","4","5","6","7","8","9","10"],
 shapes:["○","□","△","☆","♡","◇"],
 lines:["∿","⌁","⌒","﹀","∩","≈"],
 words:["CAT","DOG","SUN","BUS","MOM","DAD"],
 curves:["〰","∿","⌣","⌒","∽","∞"],patterns:["△ ○ △","○ □ ○","★ ○ ★","∿ ∿ ∿"],symbols:["☀","♪","♡","☆","☾","✿"]
};
const memoryDecks={
 animals:["🐸","🐼","🐥","🦊","🐻","🐨","🐶","🐱","🐷","🐰"],
 colors:["🔴","🟡","🟢","🔵","🟣","🟠","🟤","⚪"],
 fruits:["🍓","🍒","🍉","🍍","🍎","🍌","🍊","🍐"],
 letters:["A","B","C","D","E","F","G","H","I"],
 numbers:["1","2","3","4","5","6","7","8","9"],
 vehicles:["🚕","🚜","🚒","🚲","🚌","🚀","🚂","🚁"],
 emotions:["😊","🥰","😲","😴","😢","🤩","😌","😎"],
 foods:["🍕","🥕","🥪","🍚","🥦","🍞","🍰","🍳"],
 toys:["🪀","🧸","🪁","⚽","🛝","🪇","🧩","🎲"]
};
const settingsDefault={voice:true,fx:true,music:true,slow:true,reduced:false,goal:4};
// Multi-child profile support
let profiles=[],currentChildId=null,editChildId=null;
// Migration: check for old single profile and convert to array
const oldProfile=restore("lww2_profile",null);
let loadedProfiles=restore("lww2_profiles",null);
if(!Array.isArray(loadedProfiles)){
 if(oldProfile&&typeof oldProfile==="object"){
  loadedProfiles=[{id:"child_1",name:"My Explorer",age:oldProfile.age||"4-5",avatar:oldProfile.avatar||"🐻",color:"#FFB000"}];
 }else{
  loadedProfiles=[];
 }
 if(Array.isArray(loadedProfiles)){try{localStorage.setItem("lww2_profiles",JSON.stringify(loadedProfiles));}catch(e){}}
}
profiles=loadedProfiles;
// Load per-child settings and stats
let stats={total:0,byWorld:{},byMode:{},daily:{},pathProgress:0},settings={...settingsDefault};
if(profiles.length){
 currentChildId=profiles[0].id;
 const childSettings=restore("lww2_settings_"+currentChildId,{});
 settings={...settingsDefault,...childSettings};
 const childStats=restore("lww2_stats_"+currentChildId,{total:0,byWorld:{},byMode:{},daily:{},pathProgress:0});
 stats=childStats;
}
// Helper: get current child profile
function getCurrentChild(id){if(!id) return profiles[0]||null;return profiles.find(p=>p.id===id)||profiles[0]||null;}
// Helper: get per-child progress (for Agent D - learning path)
function getChildProgress(childId){const st=restore("lww2_stats_"+childId,{total:0,byWorld:{},byMode:{},daily:{}});return{total:st.total||0,byWorld:st.byWorld||{},byMode:st.byMode||{},attempts:st.attempts||0,correct:st.correct||0};}
// Export for other modules
window.getCurrentChild=getCurrentChild;
window.getChildProgress=getChildProgress;
let familyPeople=restore("lww3_family",[]);
if(!Array.isArray(familyPeople))familyPeople=[];
WonderDB.get("lww3_family",val=>{if(Array.isArray(val)&&val.length&&!familyPeople.length){familyPeople=val;}});
let pinnedGames=restore("lww2_pinned",["balloon:colors","music:xylophone","pretend:vet","science:sinkfloat"]);
if(!Array.isArray(pinnedGames))pinnedGames=["balloon:colors","music:xylophone","pretend:vet","science:sinkfloat"];
let recentGames=restore("lww2_recent",["puzzles:jigsaw","coloring:flowers"]);
if(!Array.isArray(recentGames))recentGames=["puzzles:jigsaw","coloring:flowers"];
const toyBoxStations=[
 {key:"balloon:colors",world:"balloon",mode:"colors",icon:"🎈",label:"Balloons",bg:"#FFF0D6",accent:"#F06A32"},
 {key:"music:xylophone",world:"music",mode:"xylophone",icon:"🎹",label:"Music",bg:"#FDE5ED",accent:"#FD4B8B"},
 {key:"coloring:flowers",world:"coloring",mode:"flowers",icon:"🎨",label:"Paint",bg:"#E6F5FF",accent:"#1769E0"},
 {key:"puzzles:jigsaw",world:"puzzles",mode:"jigsaw",icon:"🧩",label:"Puzzles",bg:"#F3EAFF",accent:"#7854C8"},
 {key:"pretend:vet",world:"pretend",mode:"vet",icon:"🐶",label:"Puppy Wash",bg:"#E8F8EC",accent:"#157F52"},
 {key:"science:sinkfloat",world:"science",mode:"sinkfloat",icon:"🌊",label:"Water Lab",bg:"#E6F5FF",accent:"#0E4CA8"}
];
function nextGuidedAdventure(){
 const path23=[["animals","shadow"],["sorting","colors"],["arcade","bubblepop"],["pretend","vet"],["music","xylophone"],["tracing","lower"],["coloring","flowers"]];
 const path45=[["alphabet","firstsound"],["science","sinkfloat"],["puzzles","jigsaw"],["numbers","count"],["tracing","lower"],["pretend","doctor"],["balloon","animals"]];
 const list=state.age==="2-3"?path23:path45;
 const step=(stats.total||0)%list.length;
 return list[step];
}
let pendingFamilyPhoto=null;
let curChild=getCurrentChild();
let state={screen:profiles.length?"home":"onboarding",currentChildId:curChild?.id||null,name:curChild?.name||"My Explorer",age:curChild?.age||"4-5",avatar:curChild?.avatar||"🐻",color:curChild?.color||"#FFB000",world:null,mode:null,
 round:0,goal:5,question:null,options:[],memory:null,traceLength:0,traceDeck:[],paint:{},paintUndo:[],color:palettes[0],feedback:"",locked:false,editChildId:null};
const sketchColors=["#e94352","#ff8c40","#ffe16a","#69bf68","#26bad1","#3d7ddd","#8056bf","#e772b3","#b27c59","#212d40","#888f9d","#ffffff"];
const sketchSizes=[3,7,13,24,39];
let sketch={color:sketchColors[0],size:13,tool:"pen",snapshot:null,history:[],strokes:0};
// Original storybook companions; independent of the child's existing saved avatar.
const guides={
 bramble:{name:"Bramble",role:"the gentle bear",color:"#b9855f",accent:"#f7c98b",intro:"Let's explore together. You can always try again!"},
 pippa:{name:"Pippa",role:"the curious explorer",color:"#db9d70",accent:"#68c9a8",intro:"Hello, explorer! Let's discover something wonderful!"},
 nova:{name:"Nova",role:"the little robot",color:"#79a9ec",accent:"#ffca71",intro:"Beep boop! I'm ready to learn with you!"},
 comet:{name:"Comet",role:"the brave star hero",color:"#967be7",accent:"#f9cf69",intro:"Every little try makes you a superstar!"}
};
let guideId=restore("lww2_guide","bramble");if(!guides[guideId])guideId="bramble";
function guideArt(id=guideId){
 const g=guides[id]||guides.bramble,robot=id==="nova",hero=id==="comet",explorer=id==="pippa";
 const ears=robot?'':hero?'<path d="M19 37 L25 15 L39 30 M61 30 L75 15 L81 37" fill="'+g.accent+'"/>':
  '<circle cx="25" cy="31" r="14" fill="'+g.color+'"/><circle cx="75" cy="31" r="14" fill="'+g.color+'"/>';
 return '<svg class="buddy-art" viewBox="0 0 100 105" role="img" aria-label="'+g.name+' the '+g.role+'">'+
  '<ellipse cx="50" cy="96" rx="36" ry="8" fill="#5e6380" opacity=".14"/>'+
  (hero?'<path d="M30 70 L10 99 L90 99 L70 70" fill="#e86680"/>':'')+
  (robot?'<path d="M50 15 V7" stroke="#5976aa" stroke-width="5"/><circle cx="50" cy="6" r="5" fill="#f5c651"/>':'')+
  ears+'<rect x="18" y="26" width="64" height="63" rx="'+(robot?'16':'30')+'" fill="'+g.color+'" stroke="#fff" stroke-width="3"/>'+
  (explorer?'<path d="M19 32 Q50 -3 81 32 L89 40 Q50 49 11 40 Z" fill="'+g.accent+'" stroke="#ffffff" stroke-width="3"/>':'')+
  (robot?'<rect x="26" y="40" width="48" height="30" rx="10" fill="#f0f8fe"/>':'<ellipse cx="50" cy="66" rx="22" ry="16" fill="'+g.accent+'" opacity=".9"/>')+
  '<circle cx="36" cy="52" r="5" fill="#38395e"/><circle cx="64" cy="52" r="5" fill="#38395e"/>'+
  '<circle cx="37" cy="50" r="1.7" fill="#fff"/><circle cx="65" cy="50" r="1.7" fill="#fff"/>'+
  '<path d="M43 71 Q50 78 57 71" fill="none" stroke="#533e58" stroke-width="3.5" stroke-linecap="round"/>'+
  (hero?'<path d="M50 31 L53 37 L60 38 L55 43 L56 50 L50 46 L44 50 L45 43 L40 38 L47 37 Z" fill="#ffe98e"/>':'')+
  '</svg>';
}
function guidePicks(){return '<div class="buddy-picks">'+Object.keys(guides).map(id=>'<button class="buddy-pick '+(id===guideId?'selected':'')+'" data-action="guidePick" data-value="'+id+'">'+guideArt(id)+'<strong>'+guides[id].name+'</strong><small>'+guides[id].role+'</small></button>').join('')+'</div>';}
function guideHint(){
 if(state.world==="family")return "Look at the people who love you. Say their names and family roles!";
 if(state.world==="flashbook")return "Look at the picture and tap Hear to learn new things!";
 if(state.mode==="doorstory")return "Leave the door closed and ask a trusted grown-up for help.";
 if(state.mode==="sketch")return "Pick a color on the left, choose your brush size on the right, and draw whatever you imagine!";
 if(["flashcards","objectcards"].includes(state.mode))return "Look at the picture. Tap Hear to listen, or Next for another surprise!";
 if(state.mode==="abcjourney")return "Say the letter with me! Tap Hear, then Next to learn another letter.";
 if(state.mode==="numbertrail")return "Let's count together! Look at the number and the counting blocks.";
 if(state.screen==="game"&&state.world==="music")return "Tap the instruments and listen to their real sounds. Make your own tune!";
 if(state.screen==="game"&&state.world==="animals")return "Look at the animal, watch its tiny film, and listen to its call.";
 if(state.screen==="game"&&state.world==="tracing")return "Follow the letter lines slowly with your finger.";
 if(state.screen==="game"&&state.world==="coloring")return "Pick a color and make your own masterpiece.";
 if(state.screen==="game"&&state.world==="balloon")return "Watch carefully. Pop the matching balloon when you see it!";
 return guides[guideId].intro;
}
let audioCtx=null,roundTimer=null,gestureStarted=false;
let backgroundMusic=null,musicDuckedUntil=0,duckTimer=null;
let appActive=true;
function syncBackgroundMusic(){
 if(typeof Audio==="undefined")return;
 const shouldPlay=appActive&&!document.hidden&&settings.music&&!(["parent","parentGate","onboarding"].includes(state.screen))&&!(state.screen==="game"&&state.world==="music");
 if(!shouldPlay){if(backgroundMusic)backgroundMusic.pause();return;}
 if(!backgroundMusic){backgroundMusic=new Audio("music/wonder-garden.mp3");backgroundMusic.loop=true;backgroundMusic.preload="auto";}
 backgroundMusic.volume=Date.now()<musicDuckedUntil?.035:.14;
 if(backgroundMusic.paused){const p=backgroundMusic.play();if(p?.catch)p.catch(()=>{});}
}
function duckBackgroundMusic(text){
 if(!backgroundMusic||backgroundMusic.paused)return;
 const ms=Math.max(1200,Math.min(4500,String(text).length*78));
 musicDuckedUntil=Date.now()+ms;backgroundMusic.volume=.025;
 clearTimeout(duckTimer);duckTimer=setTimeout(()=>{if(backgroundMusic)backgroundMusic.volume=.14;},ms);
}
let liveAnimalClip=null;
const animalFootage={Cow:"cow.webm",Dog:"dog.webm",Elephant:"elephant.webm",Cat:"cat.webm",Horse:"horse.webm",Goat:"goat.webm"};
const animalClips={
 "Cow":"Moo.mp3","Dog":"Bark.mp3","Cat":"Meow.mp3","Sheep":"Bleat.mp3",
 "Horse":"Whinny.mp3","Pig":"Squeal.mp3","Bird":"Peeps.mp3",
 "Lion":"extended/lion.mp3","Wolf":"extended/wolf.mp3","Frog":"extended/frog.mp3",
 "Owl":"extended/owl.mp3","Hen":"extended/chicken.mp3","Rooster":"extended/rooster.mp3",
 "Duck":"extended/duck.mp3","Bat":"extended/bat.mp3",
 "Elephant":"extended/elephant.mp3","Tiger":"extended/tiger.mp3","Monkey":"extended/monkey.mp3",
 "Goat":"extended/goat.mp3","Donkey":"extended/donkey.mp3","Dolphin":"extended/dolphin.mp3",
 "Eagle":"extended/eagle.mp3","Parrot":"extended/parrot.mp3","Penguin":"extended/penguin.mp3",
 "Deer":"extended/deer.mp3","Crocodile":"extended/crocodile.mp3","Crow":"extended/crow.mp3",
 "Pigeon":"extended/pigeon.mp3","Hyena":"extended/hyena.mp3","Coyote":"extended/coyote.mp3"
};
if(familyRelease)Object.assign(animalClips,{
 Cow:"field/cow.mp3",Dog:"field/dog.mp3",Horse:"field/horse.mp3",Lion:"field/lion.mp3",Elephant:"field/elephant.mp3",
 Goose:"field/goose.mp3","Beluga Whale":"field/beluga.mp3",Orca:"field/orca.mp3",Cricket:"field/cricket.mp3"
});
const objectSoundClips={Train:"train.mp3",Bicycle:"bicycle.mp3",Car:"car.mp3",Truck:"truck.mp3",Helicopter:"helicopter.mp3",Doorbell:"doorbell.mp3",Telephone:"telephone.mp3",Clock:"clock.mp3",Rain:"rain.mp3",Thunder:"thunder.mp3",Water:"water.mp3",Bell:"bell.mp3"};
if(familyRelease)Object.assign(objectSoundClips,{Ambulance:"ambulance.mp3","Fire Engine":"fire-engine.mp3",Motorcycle:"motorcycle.mp3","Bicycle Bell":"bicycle.mp3","Knocking Door":"door-knock.mp3"});
let liveObjectClip=null;
function playObjectSound(name){
 const clip=objectSoundClips[name];if(!settings.fx||!appActive||!clip)return false;
 if(typeof Audio==="undefined")return false;
 duckBackgroundMusic("a real object sound effect");
 try{if(liveObjectClip){liveObjectClip.pause();liveObjectClip.currentTime=0;}liveObjectClip=new Audio("sounds/objects/"+clip);liveObjectClip.volume=.9;
  const p=liveObjectClip.play();if(p?.catch)p.catch(()=>speak(name));return true;
 }catch(e){return false;}
}
const recordedNotes={C4:261.63,"C#4":277.18,D4:293.66,"D#4":311.13,E4:329.63,F4:349.23,"F#4":369.99,G4:392,"G#4":415.3,A4:440,"A#4":466.16,B4:493.88,C5:523.25};
const drumSamples={kick:"drum-kick.mp3",snare:"drum-snare.mp3",hat:"drum-closed-hat.mp3",tom:"drum-mid-tom.mp3",crash:"drum-crash.mp3",ride:"drum-ride.mp3"};
const instrumentVoices=[];
const instrumentSamples=new Map();
function prepareWonderInstrument(mode){
 if(release.id!=="v1.5"||typeof Audio==="undefined")return;
 const notes=mode==="xylophone"?Object.keys(recordedNotes).filter(n=>!n.includes('#')):Object.keys(recordedNotes).filter(n=>!n.includes('#'));
 const files=notes.map(n=>(mode==="xylophone"?'xylophone-':'piano-')+n+'.mp3');
 for(const file of files){
  if(instrumentSamples.has(file))continue;
  try{const sample=new Audio('instruments/'+file);sample.preload='auto';sample.load?.();instrumentSamples.set(file,sample);}catch(_){}
 }
}
// Offline recorded acoustic instruments, with gentle synthesis only if a file is unavailable.
window.playWonderInstrument=function(mode,key){
 if(!settings.fx||!appActive)return;
 const freq=recordedNotes[key]||392;
 let file="",speed=1,volume=.78;
 if(mode==="piano"){
  const base=key.includes("#")?key.replace("#","").replace(/([A-G])4$/,"$14"):key;
  const sample=base==="C#4"?"C4":base;
  file="piano-"+sample+".mp3";speed=key.includes("#")?Math.pow(2,1/12):1;
 }else if(mode==="xylophone"){
  if(release.id==="v1.5"){
   file="xylophone-"+(recordedNotes[key]?key:"C5")+".mp3";
   speed=1;
  }else{file="xylophone-C5.mp3";speed=freq/523.25;}
  volume=.95;
 }else if(mode==="drums"){
  file=drumSamples[key]||drumSamples.kick;volume=.93;
 }else if(mode==="bells"){
  soundTone(freq*2,.8,"sine",.14);return;
 }else{
  soundTone(freq,.35,"triangle",.12);return;
 }
 if(typeof Audio==="undefined"){soundTone(freq,.25,"triangle",.12);return;}
 try{
  const source=instrumentSamples.get(file);
  const audio=source?.cloneNode?.(true)||new Audio("instruments/"+file);
  audio.preload="auto";audio.playbackRate=speed;audio.volume=volume;
  instrumentVoices.push(audio);
  if(instrumentVoices.length>18){const old=instrumentVoices.shift();old.pause();}
  const played=audio.play();if(played?.catch)played.catch(()=>soundTone(freq,.25,"triangle",.12));
 }catch(e){soundTone(freq,.25,"triangle",.12);}
};

function initAudio(){
 if(!settings.fx||!appActive) return null;
 try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx;}catch(e){return null;}
}
function soundTone(freq,duration,type="sine",volume=.12,delay=0,endFreq=null){
 const ac=initAudio();if(!ac)return;const at=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();
 o.type=type;o.frequency.setValueAtTime(Math.max(30,freq),at);
 if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),at+duration);
 g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume),at+.017);
 g.gain.exponentialRampToValueAtTime(.0001,at+duration);
 o.connect(g);g.connect(ac.destination);o.start(at);o.stop(at+duration+.025);
}
function soundFX(type){
 if(!settings.fx)return;
 if(type==="pop"){soundTone(520,.08,"sine",.12);soundTone(190,.11,"triangle",.13,.04,100);}
 if(type==="good"){soundTone(520,.14,"sine",.13);soundTone(700,.14,"sine",.12,.12);soundTone(940,.2,"sine",.12,.24);}
 if(type==="oops"){soundTone(280,.11,"triangle",.07);soundTone(240,.15,"triangle",.06,.12);}
 if(type==="paint"){soundTone(420,.09,"sine",.07,0,640);}
 if(type==="flip"){soundTone(400,.07,"triangle",.06);}
 if(type==="win"){[523,659,784,1047].forEach((f,i)=>soundTone(f,.28,"sine",.1,i*.13));}
}
function animalSound(name){
 if(!settings.fx||!appActive)return;
 duckBackgroundMusic("animal call sound lasting a few seconds");
 const clip=animalClips[name];
 if(clip && typeof Audio!=="undefined"){
  try{
   if(liveAnimalClip){liveAnimalClip.pause();liveAnimalClip.currentTime=0;}
   liveAnimalClip=new Audio("sounds/"+clip);
   liveAnimalClip.volume=.84;
   const playback=liveAnimalClip.play();
   if(playback&&playback.catch)playback.catch(()=>soundTone(380,.36,"sawtooth",.09));
   return;
  }catch(e){/* Fall back to a synthesized call. */}
 }
 // Never invent a generic animal call in the expanded release: speak the name instead.
 if(expandedRelease&&!clip){speak(name);return;}
 const n=name.toLowerCase();
 switch(n){
 case "cow": soundTone(175,.68,"sawtooth",.12,0,95);soundTone(120,.45,"sine",.1,.29,87);break;
 case "dog": for(let i=0;i<3;i++){soundTone(220,.16,"sawtooth",.15,i*.21,105);soundTone(110,.13,"square",.045,i*.21);}break;
 case "cat":soundTone(400,.3,"sawtooth",.07,0,670);soundTone(680,.45,"sawtooth",.07,.28,250);break;
 case "duck":for(let i=0;i<3;i++)soundTone(370,.16,"square",.075,i*.20,190);break;
 case "sheep":for(let i=0;i<5;i++)soundTone(305-i*22,.20,"sawtooth",.055,i*.11,190-i*13);break;
 case "lion":soundTone(155,.85,"sawtooth",.12,0,70);soundTone(90,.74,"square",.045,.08,57);break;
 case "bird":for(let i=0;i<4;i++)soundTone(960,.14,"sine",.11,i*.18,1400);break;
 case "elephant":soundTone(200,.6,"sawtooth",.12,0,510);soundTone(460,.28,"sine",.06,.35,300);break;
 case "pig":for(let i=0;i<3;i++)soundTone(190,.19,"sawtooth",.10,i*.2,130);break;
 case "horse":soundTone(590,.28,"sawtooth",.06,0,850);soundTone(800,.43,"sawtooth",.08,.26,270);break;
 case "frog":for(let i=0;i<3;i++)soundTone(130,.17,"square",.08,i*.24,88);break;
 case "bee":soundTone(210,.85,"sawtooth",.09);soundTone(233,.85,"sawtooth",.04);break;
 default:soundTone(480,.25,"sine",.09);
 }
}
function speak(text){
 if(!settings.voice||!appActive||!text)return;
 const msg=String(text).slice(0,200);
 duckBackgroundMusic(msg);
 if(typeof document!=="undefined")document.querySelectorAll(".buddy-mission,.buddy-top-button").forEach(el=>{
  el.classList.add("buddy-talking");setTimeout(()=>el.classList.remove("buddy-talking"),1600);
 });
 if(window.WonderNative?.speak){try{window.WonderNative.speak(msg);return;}catch(e){}}
 if("speechSynthesis" in window){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(msg);u.lang="en-US";u.rate=.96;u.pitch=1.02;speechSynthesis.speak(u);}catch(e){}}
}
function stopVoice(){try{window.WonderNative?.stopSpeech?.();}catch(e){}try{speechSynthesis?.cancel?.();}catch(e){}}

// Helper for path progress access in switch cases
function getPathProgress(){return stats.pathProgress||0;}

function awaitPathStep(step){
 // Check if this is a quiz step that needs validation
 if(step.quiz===true && typeof WonderEngines!=='undefined'){
  // Start the quiz mode
  speak("Let's play the " + step.biome + " quiz!");
  return true;
 }
 return true;
}

/* Phone-lock / app-switch safety: every audio source and silent video stops.
 * Android calls these explicitly; visibility/pagehide are fallback paths. */
function suspendWonderMedia(){
 appActive=false;clearTimeout(duckTimer);clearTimeout(roundTimer);clearTimeout(traceAdvanceTimer);
 if(backgroundMusic)backgroundMusic.pause();
 for(const clip of [liveAnimalClip,liveObjectClip,...instrumentVoices]){
  if(clip){try{clip.pause();clip.currentTime=0;}catch(e){}}
 }
 instrumentVoices.length=0;
 document.querySelectorAll("video,audio").forEach(media=>{try{media.pause();}catch(e){}});
 if(audioCtx?.state==="running")audioCtx.suspend()?.catch?.(()=>{});
 stopVoice();
}
window.wonderPause=suspendWonderMedia;
window.wonderResume=function(){
 if(document.hidden)return;
 appActive=true;
 document.querySelectorAll("video").forEach(v=>{
  if(v.hasAttribute("autoplay")&&!settings.reduced)v.play()?.catch?.(()=>{});
 });
 syncBackgroundMusic();
};
document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendWonderMedia();else window.wonderResume();});
window.addEventListener("pagehide",suspendWonderMedia);
function announce(message,kind="good"){
 const el=$(".playfield")||$(".content");if(!el)return;
 $(".feedback")?.remove();
 const div=document.createElement("div");div.className="feedback";div.textContent=message;el.appendChild(div);
 setTimeout(()=>{if(div.isConnected)div.remove();},650);
 if(kind!=="none")soundFX(kind);
}
function delayNext(ms,fn){clearTimeout(roundTimer);roundTimer=setTimeout(fn,ms);}
function currentMode(){return worlds[state.world]?.modes.find(m=>m[0]===state.mode);}
function modeTitle(){return currentMode()?.[1]||"";}
function header(){
 const home=state.screen==="home",onboard=state.screen==="onboarding",parent=state.screen==="parent";
 if(onboard)return '<div class="topbar"><div class="brand"><span class="brand-spark">🌟</span> Little Wonder World</div><div class="top-right"><span class="progress-pill"><span class="emoji">✨</span> Learn through play</span></div></div>';
 const back=home?"":'<button class="bubble-btn back-btn" data-action="back" aria-label="Go back">←</button>';
 const title=home?'Little Wonder World':state.screen==="land"?WonderContent.lands.find(l=>l.id===state.land)?.name||"Learning Land":state.screen==="modes"?worlds[state.world].name:
   state.screen==="game"||state.screen==="complete"?modeTitle():parent?"Parent Corner":state.screen==="parentGate"?"For grown-ups":"Little Wonder World";
 return '<div class="topbar"><div class="top-left">'+back+(home?'<span class="brand"><span class="brand-spark">🌟</span> Wonder World</span>':'')+'</div><div class="top-title">'+esc(title)+'</div><div class="top-right">'+
 (state.screen==="game"?'<span class="progress-pill">'+(state.mode==="sketch"?'<span class="emoji">🎨</span> Free drawing':state.world==="flashbook"||state.world==="family"&&state.mode==="familycards"||["flashcards","realfilms","objectcards"].includes(state.mode)?'<span class="emoji">📖</span> '+(state.mode==="realfilms"?'Real Films':'Flashcards'):state.engine?.type==="journey"?'<span class="emoji">📖</span> Keep learning':state.world==="music"&&state.engine?.type==="music"?'<span class="emoji">🎵</span> Free play':'<span class="emoji">⭐</span> '+state.round+' / '+state.goal)+'</span>':'')+
 (state.screen==="game"||home?'<button class="buddy-top-button" data-action="guideSpeak" aria-label="Ask '+guides[guideId].name+' for help">'+guideArt()+'</button>':'')+
 (state.screen==="game"&&release.id==="v1.5"?'<button class="bubble-btn pin-top-btn '+(pinnedGames.includes(state.world+":"+state.mode)?"is-pinned":"")+'" data-action="togglePin" data-value="'+state.world+':'+state.mode+'" aria-label="Pin to Toy Box">'+(pinnedGames.includes(state.world+":"+state.mode)?"📌":"⭐")+'</button>':'')+
 '<button class="bubble-btn" data-action="voice" aria-label="Toggle voice"><span class="emoji">'+(settings.voice?"🔊":"🔇")+'</span></button>'+
 (home?'<button class="bubble-btn profile-badge-btn" data-action="childPicker" aria-label="Switch child">'+esc(getCurrentChild()?.avatar||"🐻")+'</button>':'')+
 (home?'<button class="bubble-btn ticket-badge" data-action="shop" aria-label="Shop - Tickets: '+(stats.tickets||0)+' 🎫">🛍️ <span class="ticket-count">'+ (stats.tickets||0) +'</span></button>':'')+
 (home?'<button class="bubble-btn" data-action="parentGate" aria-label="Parent Corner">👨‍👩‍👧</button>':'')+'</div></div>';
}
function dots(n,total){
 if(total>9)return '<div class="progress-pill small-progress">Step '+(Math.min(n+1,total))+' / '+total+'</div>';
 return '<div class="dots">'+Array.from({length:total},(_,i)=>'<b class="'+(i<n?"on":"")+'"></b>').join("")+'</div>';
}
function render(){
 clearTimeout(roundTimer);
 const className="screen"+(settings.reduced?" reduced-motion":"")+(release.id==="v1.5"&&release.code>=18?" vivid-theme":"");
 const screens={onboarding:renderOnboarding,home:renderHome,shop:renderShop,land:renderLand,modes:renderModes,game:renderGame,complete:renderComplete,parentGate:renderGate,parent:renderParent};
 $("#app").innerHTML='<div class="'+className+'">'+header()+'<main class="content">'+(screens[state.screen]||renderHome)()+'</main></div>';
 if(state.screen==="game"&&state.world==="tracing")setupTrace();
 if(state.screen==="game"&&state.world==="coloring"&&state.mode==="sketch")setupSketch();
 if(state.screen==="game"&&state.world==="music"&&["piano","xylophone"].includes(state.mode)&&release.id==="v1.5")WonderEngines.mountMusicTouch();
 if(state.screen==="game"&&state.world==="life"&&state.mode==="teeth"&&release.id==="v1.5")WonderEngines.mountBrushingTouch();
 if(state.screen==="game"&&release.id==="v1.5"&&WonderEngines.mountTactileEngines)WonderEngines.mountTactileEngines();
 if(state.screen==="game"&&state.world==="sorting"&&release.id==="v1.5")mountSortingDrag();
 if(state.screen==="parentGate"&&release.id==="v1.5")mountParentGateHold();
 if(state.screen==="game"&&state.world==="balloon"&&settings.reduced)document.querySelectorAll(".balloon").forEach((b,i)=>b.style.setProperty("--still-left",(15+(i%3)*28)+"%"));
 syncBackgroundMusic();
}
function renderOnboarding(){
 return '<section class="onboard"><div class="hero-art"><div class="hero-cloud">🌈</div><div class="hero-spark">🌟 🦋 🧸</div></div>'+
 '<div class="intro-box"><h1>Hello, little explorer!</h1><p>Choose your learning buddy and let the story begin.</p>'+
 guidePicks()+
 '<p>How old is our explorer?</p><div class="choice-row">'+["2-3","4-5","5-6"].map(a=>'<button class="pick '+(a===state.age?"selected":"")+'" data-action="age" data-value="'+a+'">'+a+'<small>years</small></button>').join("")+'</div>'+
 '<button class="big-primary" data-action="enter">Let’s explore! <span class="emoji">✨</span></button></div></section>';
}
function renderHome(){
 if(release.landed){
  // Child-led entry: creative free play is the first invitation, followed by
  // foundational learning, discovery, thinking, life skills and free play.
  const landOrder=["creative","foundations","discovery","thinking","wellbeing","funfair"];
  const vivid=release.id==="v1.5"&&release.code>=18;
  const orderedLands=vivid?[...WonderContent.lands].sort((a,b)=>landOrder.indexOf(a.id)-landOrder.indexOf(b.id)):WonderContent.lands;
  const cards=orderedLands.map(l=>{
   const items=visibleWorldIds.filter(id=>worlds[id].land===l.id);
   const label=items.length+' worlds · '+items.reduce((n,id)=>n+worlds[id].modes.length,0)+' games';
   const copy=vivid?'<span class="land-copy"><strong>'+l.name+'</strong><span class="land-meta">'+label+'</span><small>'+(l.id==="creative"?'Start here: draw and create ✏️':l.hint)+'</small></span>':'<strong>'+l.name+'</strong><span>'+label+'</span><small>'+l.hint+'</small>';
   return !items.length?'':'<button class="land-card" style="background:'+l.color+'" data-action="land" data-value="'+l.id+'" aria-label="Open '+l.name+'"><span class="land-emoji">'+l.icon+'</span>'+copy+'</button>';
  }).join('');
  const title=vivid?'Welcome, little explorer!':guides[guideId].name+' says hello!';
  const subtitle=vivid?'Tap Start Adventure or pick a favorite toy below 🌟':'Pick a magical learning land ✨';
  // Learning Path card - shows current progress and next step
  const pathProgress=stats.pathProgress||0;
  const nextStep=typeof WonderPath!=='undefined'?WonderPath.getNextStep(stats||{pathProgress:0}):null;
  const biomeName=nextStep?.biome||"My Learning Path";
  const biomeEmoji=nextStep?.icon||"📖";
  const pathCard=release.path!==false?
   '<button class="path-card" style="background:#E6F5FF;color:#20324A;border:2px solid #BFE5FF" data-action="pathJump" aria-label="My Learning Path">'+
    '<span class="path-icon">'+biomeEmoji+'</span>'+
    '<div class="path-content"><strong>📖 My Learning Path</strong>'+
    '<span class="path-subtitle">'+biomeName+'</span>'+
    '<span class="path-progress">'+pathProgress+' steps completed</span></div>'+
    '<button class="path-btn" data-action="pathNext" aria-label="Continue My Learning Path">▶ Continue My Path</button>' +
   '</button>':
   '';
  if(vivid){
   const trayKeys=[...new Set([...pinnedGames,...recentGames])].slice(0,4);
   const stationButtons=toyBoxStations.map(s=>
    '<button class="toybox-station" style="--station-bg:'+s.bg+';--station-accent:'+s.accent+'" data-action="quickPlay" data-value="'+s.key+'" aria-label="Play '+s.label+'">'+
    '<span class="station-icon">'+s.icon+'</span><strong>'+s.label+'</strong>'+(pinnedGames.includes(s.key)?'<i class="pin-dot" aria-hidden="true">📌</i>':'')+'</button>'
   ).join('');
   const recentBadges=trayKeys.map(k=>{
    const [wId,mId]=String(k).split(":");
    const wObj=worlds[wId],mObj=wObj?.modes?.find(m=>m[0]===mId)||wObj?.modes?.[0];
    if(!wObj||!mObj)return '';
    return '<button class="recent-badge" data-action="quickPlay" data-value="'+wId+':'+mObj[0]+'" aria-label="Replay '+esc(mObj[1])+'">'+
     '<span class="recent-emoji">'+mObj[2]+'</span><small>'+esc(mObj[1])+'</small></button>';
   }).join('');
   return '<div class="land-home v16-hub">'+
    '<div class="land-greeting two-door-bar">'+
     '<span class="home-buddy">'+guideArt()+'</span>'+
     '<div class="greeting-copy"><h1>'+title+'</h1><p>'+subtitle+'</p></div>'+
     '<button class="adventure-door-btn" data-action="adventureStart">▶ Start Adventure!</button>'+
     '<button class="tiny-cta" data-action="guideSpeak">🔊 Hear buddy</button>'+
     '<button class="tiny-cta" data-action="surprise">🎲 Surprise!</button>'+
    '</div>'+
    '<section class="learning-path-section" aria-label="My Learning Path">'+pathCard+'</section>'+
    '<section class="toybox-ribbon" aria-label="Visual Toy Box and Favorites">'+
     '<div class="toybox-stations">'+stationButtons+'</div>'+
     '<div class="toybox-recents"><span class="shelf-tag">⭐ My Shelf</span>'+recentBadges+'</div>'+
    '</section>'+
    '<section class="land-grid">'+cards+'</section></div>';
  }
  return '<div class="land-home">'+pathCard+
   '<div class="land-greeting"><span class="home-buddy">'+guideArt()+'</span><div><h1>'+title+'</h1><p>'+subtitle+'</p></div><button class="tiny-cta" data-action="guideSpeak">🔊 '+(vivid?'Hear my buddy':'Ask my buddy')+'</button><button class="tiny-cta" data-action="surprise">🎲 '+(vivid?'Surprise play!':'Surprise!')+'</button></div><section class="land-grid">'+cards+'</section></div>';
 }
 // Child profile badge
 const curChild=getCurrentChild();
 const profileBadge='<button class="profile-badge" data-action="childPicker" aria-label="Child profile: '+esc(curChild?.name||"My Explorer")+'"><span class="child-avatar">'+esc(curChild?.avatar||"🐻")+'</span><span class="child-name">'+esc(curChild?.name||"My Explorer")+'</span></button>';
 const cards=visibleWorldIds.map(id=>{const w=worlds[id];return '<button class="world-card" style="background:'+w.color+'" data-action="world" data-value="'+id+'">'+
 '<span class="world-icon">'+w.icon+'</span><span class="world-name">'+w.name+'</span><span class="world-count">'+w.modes.length+' adventures ✦</span></button>';}).join("");
 return '<div class="home-wrap">'+profileBadge+'<section class="side-story"><div class="mascot">'+state.avatar+'</div><h2>Hi, '+esc(curChild?.name||"explorer")+'!</h2><p>Pick a world to discover today.</p>'+
 '<button class="tiny-cta" data-action="surprise">🎲 Surprise me!</button></section><section class="world-grid">'+cards+'</section></div>';
}
function renderShop(){
 const tickets=stats.tickets||0;
 const purchases=stats.purchases||[];
 const equipped=stats.equipped||{};
 const categories=[
  {id:"avatar",name:"Avatar Customization",icon:"👤",items:WonderShop.catalog.avatar},
  {id:"aquarium",name:"Aquarium Decor",icon:"🐠",items:WonderShop.catalog.aquarium},
  {id:"room",name:"Room Decor",icon:"🏠",items:WonderShop.catalog.room}
 ];

 let html='<div class="shop-screen"><header class="shop-header">'+
  '<div class="ticket-display">🎫 <span class="ticket-amount">'+tickets+'</span> <small>Tickets Earned</small></div>'+
  '<h1>Wonder Shop</h1><p>Trade your stars for fun surprises! Earnt by playing, never for real money.</p></header>'+
  '<div class="shop-content">';

 categories.forEach(cat=>{
  html+='<section class="shop-category"><h2>'+cat.icon+' '+cat.name+'</h2><div class="shop-grid">';
  cat.items.forEach(item=>{
   const isBought=purchases.includes(item.id);
   const isEquipped=equipped[cat.id]===item.id;
   const canAfford=tickets>=item.cost;

   html+='<div class="shop-item '+(isBought?'purchased':'')+' '+(isEquipped?'equipped':'')+'">'+
    '<div class="item-icon">'+item.icon+'</div>'+
    '<h3>'+item.name+'</h3>'+
    '<div class="item-cost">'+(isBought?'Unlocked':'🎫 '+item.cost)+'</div>'+
    (isBought?
     '<button class="shop-btn '+(isEquipped?'is-equipped':'')+'" data-action="equipItem" data-cat="'+cat.id+'" data-id="'+item.id+'">'+(isEquipped?'Equipped':'Equip')+'</button>':
     '<button class="shop-btn buy" '+(canAfford?'':'disabled')+' data-action="buyItem" data-cat="'+cat.id+'" data-id="'+item.id+'" data-cost="'+item.cost+'">Buy Item</button>')+
    '</div>';
  });
  html+='</div></section>';
 });

 html+='</div><footer class="shop-footer"><button class="big-primary" data-action="home">Back to Playroom</button></footer></div>';
 return html;
}

function renderLand(){
 const land=WonderContent.lands.find(l=>l.id===state.land);
 const ids=visibleWorldIds.filter(id=>worlds[id].land===state.land);
 const teacherOrder={foundations:["rhymebook","stories","alphabet","numbers","tracing"],
  thinking:["sorting","memory","puzzles","coding"],
  discovery:["flashbook","animals","nature","transport","science"],
  creative:["coloring","building","pretend","music"],
  wellbeing:["life","emotions","family","body","movement"],
  funfair:["balloon","arcade","cooking","festivals"]};
 if(release.id==="v1.5"){
  const order=teacherOrder[state.land]||[];
  ids.sort((a,b)=>(order.indexOf(a)<0?99:order.indexOf(a))-(order.indexOf(b)<0?99:order.indexOf(b)));
 }else if(restoredRelease&&state.land==="discovery")ids.sort((a,b)=>
  (["flashbook","animals"].indexOf(a)<0?99:["flashbook","animals"].indexOf(a))-
  (["flashbook","animals"].indexOf(b)<0?99:["flashbook","animals"].indexOf(b)));
 return '<div class="land-detail"><div class="land-guide"><span>'+land.icon+'</span><div><h2>'+land.name+'</h2><p>Choose a world! Each has little adventures.</p></div></div><section class="land-world-grid '+(release.id==="v1.5"?'v15-grid grid-'+ids.length:'')+'">'+ids.map(id=>{
  const w=worlds[id];return '<button class="world-card" style="background:'+w.color+'" data-action="world" data-value="'+id+'"><span class="world-icon">'+w.icon+'</span><span class="world-name">'+w.name+'</span><span class="world-count">'+w.modes.length+' adventures ✦</span></button>';
 }).join('')+'</section></div>';
}
function renderModes(){
 const w=worlds[state.world],m=w.modes;
 const page=state.modePage||0,pages=Math.ceil(m.length/9),items=m.slice(page*9,page*9+9);
 return '<div class="modes-layout"><section class="modes-intro"><span class="big-emoji">'+w.icon+'</span><h2>'+w.short+' World</h2><p>Choose a little adventure!</p>'+
 (pages>1?'<div class="mode-pages"><button data-action="modePrev" '+(page===0?'disabled':'')+'>←</button><span>'+ (page+1)+' / '+pages+'</span><button data-action="modeNext" '+(page===pages-1?'disabled':'')+'>→</button></div>':'')+'</section>'+
 '<section class="mode-grid '+(items.length===6?"six":"")+'">'+items.map(x=>'<button class="mode-card" data-action="mode" data-value="'+x[0]+'"><span class="mode-emoji">'+x[2]+'</span><span class="mode-text">'+x[1]+'</span></button>').join("")+'</section></div>';
}
function renderQuickSwitchBar(){
 if(release.id!=="v1.5"||state.screen!=="game"||!worlds[state.world])return "";
 const quickWorlds=["balloon","music","coloring","sorting","puzzles","pretend","animals","science"];
 if(!quickWorlds.includes(state.world))return "";
 const modes=worlds[state.world].modes.slice(0,6);
 return '<div class="quick-switch-bar" role="tablist" aria-label="Quick switch activity">'+
  modes.map(m=>'<button class="quick-tab '+(m[0]===state.mode?"active":"")+'" data-action="mode" data-value="'+esc(m[0])+'" title="'+esc(m[1])+'" aria-label="'+esc(m[1])+'"><span>'+m[2]+'</span></button>').join("")+
  '</div>';
}
function renderMission(title,sub,icon,more=""){
 return '<section class="mission"><button class="buddy-mission" data-action="guideSpeak" aria-label="Ask your learning buddy">'+guideArt()+'</button><h2>'+esc(title)+'</h2><p>'+esc(sub||"Tap the correct answer!")+'</p>'+
 renderQuickSwitchBar()+
 (release.id==="v1.5"&&state.goal>10?'<span class="progress-pill">⭐ '+state.round+' earned</span>':dots(Math.min(state.round,state.goal),state.goal))+'<button class="bubble-btn" data-action="repeat"><span class="emoji">🔊</span> Listen</button>'+more+'</section>';
}
function playPrompt(){
 if(WonderEngines.isExtra(state.world))speak(WonderEngines.instruction());
 else if(state.world==="animals"&&["listen","safari","farm","tracks"].includes(state.mode)){
   speak("Listen carefully. Which animal is it?");
   const matchingAnimal=state.question?.animal;
   setTimeout(()=>{if(state.screen==="game"&&state.world==="animals"&&state.question?.animal===matchingAnimal)animalSound(matchingAnimal);},1450);
 } else speak(state.question?.voice||state.question?.prompt||"Let's play!");
}
function renderGame(){
 if(state.world==="family")return renderFamily();
 if(state.world==="flashbook")return renderWideCards();
 if(state.world==="body"&&state.mode==="doorstory")return renderDoorStory();
 if(state.world==="coloring"&&state.mode==="sketch")return renderSketch();
 if(state.world==="animals"&&["flashcards","realfilms"].includes(state.mode))return renderCards("animal");
 if(state.world==="animals"&&state.mode==="objectcards")return renderCards("object");
 if(WonderEngines.isExtra(state.world))return WonderEngines.render();
 if(state.world==="balloon")return renderBalloon();
 if(state.world==="sorting")return renderSorting();
 if(state.world==="animals")return renderAnimals();
 if(state.world==="memory")return renderMemory();
 if(state.world==="tracing")return renderTracing();
 if(state.world==="coloring")return renderColoring();
 return "";
}
function familyPhoto(p){
 return typeof p?.photo==="string"&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.photo)?'<img src="'+p.photo+'" alt="Family photo"/>':'<span class="family-placeholder">💗</span>';
}
function renderFamily(){
 const people=familyPeople;
 if(!people.length)return '<div class="game-shell">'+renderMission("Our special people","Every family looks different.","💗")+
  '<section class="playfield"><h2>Let’s make your family album!</h2><p>Ask a grown-up to add photos, names and roles in Parent Corner.</p><button class="big-primary" data-action="back">Back to games</button></section></div>';
 if(state.mode==="familyquiz"){
  if(people.length<2)return '<div class="game-shell">'+renderMission("Who’s who?","Add two or more people to start.","🖼️")+
   '<section class="playfield"><h2>Just one photo so far!</h2><p>Ask a grown-up to add another family member.</p></section></div>';
  if(!state.familyQuestion)makeFamilyQuestion();
  const q=state.familyQuestion;
  return '<div class="game-shell">'+renderMission("Who’s who?","Find "+q.target.role+" "+q.target.name+"!", "💗")+
   '<section class="playfield family-field"><h2>Can you find '+esc(q.target.role)+' '+esc(q.target.name)+'?</h2><div class="family-choices">'+q.options.map(p=>
    '<button class="family-guess" data-action="familyGuess" data-value="'+esc(p.id)+'">'+familyPhoto(p)+'<span>Tap me!</span></button>').join('')+'</div></section></div>';
 }
 const index=Math.max(0,(state.familyIndex||0)%people.length),p=people[index];
 return '<div class="game-shell">'+renderMission("Meet my family","Say their role and name.","💗")+
  '<section class="playfield family-field"><div class="flashcard-top"><strong>'+ (index+1)+' / '+people.length+'</strong><span>Our family, our story 💞</span></div>'+
  '<div class="family-card"><div class="family-photo">'+familyPhoto(p)+'</div><div class="family-identity"><small>MY '+esc(p.role.toUpperCase())+'</small><h2>'+esc(p.name)+'</h2><p>This is my '+esc(p.role)+'!</p></div></div>'+
  '<div class="flashcard-actions"><button data-action="familyPrev">◀ Previous</button><button class="flashcard-hear" data-action="familySpeak">🔊 Hear name</button><button data-action="familyNext">Next ▶</button></div></section></div>';
}
function makeFamilyQuestion(){
 const target=pick(familyPeople),others=shuffle(familyPeople.filter(p=>p.id!==target.id)).slice(0,2);
 state.familyQuestion={target,options:shuffle([target,...others])};
}
function renderWideCards(){
 const cards=flashcardCatalog[state.mode]||[],i=Math.max(0,(state.cardIndex||0)%cards.length),c=cards[i];
 if(!c)return '<section class="playfield"><h2>More cards coming soon!</h2></section>';
 const sound=!!(objectSoundClips[c.name]||animalClips[c.name]);
 return '<div class="game-shell">'+renderMission("Wonder Flashcards","Look, listen and learn!","📖")+
 '<section class="playfield flashcard-field"><div class="flashcard-top"><strong>'+esc(modeTitle())+'</strong><strong>'+(i+1)+' / '+cards.length+'</strong></div>'+
 '<div class="flashcard-main"><div class="flashcard-illustration"><span>'+c.icon+'</span></div><div class="flashcard-caption"><h2>'+esc(c.name)+'</h2><p>'+(sound?'Hear the matching sound!':'Hear the name and say it aloud!')+'</p></div></div>'+
 '<div class="flashcard-actions"><button data-action="widePrev">◀ Previous</button><button class="flashcard-hear" data-action="wideHear">'+(sound?'🔊 Play sound':'🗣️ Hear name')+'</button><button data-action="wideNext">Next ▶</button></div></section></div>';
}
function hearWideCard(){
 const c=(flashcardCatalog[state.mode]||[])[state.cardIndex||0];if(!c)return;
 if(objectSoundClips[c.name])playObjectSound(c.name);
 else if(animalClips[c.name])animalSound(c.name);
 else speak(c.name);
}
const doorSteps=[
 {text:"Knock, knock! Someone is outside. You can't see who it is.",question:"What should you do?",correct:"grownup",choices:[["grownup","Keep the door closed and tell a grown-up","👨‍👩‍👧"],["open","Open the door myself","🔓"]]},
 {text:"A voice outside says: 'I have a parcel for you!'",question:"What is the safe choice?",correct:"wait",choices:[["wait","Wait for a grown-up to check","💗"],["take","Open the door to take it","📦"]]},
 {text:"Your grown-up comes to help. The door is still closed.",question:"Who decides whether to open?",correct:"adult",choices:[["adult","My trusted grown-up","🙋"],["child","I unlock it first","🔑"]]}
];
function renderDoorStory(){
 const step=doorSteps[Math.min(state.round,doorSteps.length-1)];
 return '<div class="game-shell">'+renderMission("Knock, knock!","A gentle safety story","🚪")+
 '<section class="playfield door-story"><div class="door-story-scene"><div class="storybook-door"><span>🚪</span><i class="visitor-shape">?</i></div><div class="story-cloud">'+esc(step.text)+'</div></div>'+
 '<h2>'+esc(step.question)+'</h2><div class="door-story-options">'+step.choices.map(choice=>
 '<button class="choice-card" data-action="doorChoose" data-value="'+choice[0]+'"><span class="choice-icon">'+choice[2]+'</span><span class="choice-label">'+esc(choice[1])+'</span></button>').join('')+'</div></section></div>';
}
function optionButton(x,action="answer"){
 const icon=x.icon||"",label=x.label||x.value;
 const iconStyle=x.color?' style="color:'+x.color+'"':'';
 const letter=state.world==="alphabet"&&/^[A-Za-z]$/.test(String(x.value))&&String(icon).toLowerCase()===String(x.value).toLowerCase();
 return '<button class="choice-card '+(letter?'letter-choice':'')+'" data-action="'+action+'" data-value="'+esc(x.value)+'">'+
 (icon?'<span class="choice-icon"'+iconStyle+'>'+icon+'</span>':'')+
 (letter?'':'<span class="choice-label">'+esc(label)+'</span>')+'</button>';
}
function makeSorting(){
 const mode=state.mode,r=state.round;
 let q={title:"Let's sort!",prompt:"Find the matching basket!",voice:"Find the matching basket."};
 if(mode==="colors"){
  const i=(r+rand(7))%colorNames.length;
  q={...q,title:"Find "+colorNames[i],icon:"●",color:colorHex[i],correct:colorNames[i],prompt:"Tap the "+colorNames[i]+" basket",
  voice:"Find the color "+colorNames[i]+".",
  options:shuffle(colorNames.map((c,j)=>({value:c,label:c,icon:"●",color:colorHex[j]}))).slice(0,4)};
  if(!q.options.some(o=>o.value===q.correct))q.options[0]={value:q.correct,label:q.correct,icon:"●",color:colorHex[i]};
 }else if(mode==="shapes"){
  const target=SHAPES[(r+rand(6))%SHAPES.length];
  q={...q,title:target+"!",icon:shapeGlyph[target],correct:target,prompt:"Which shape matches?",voice:"Find the "+target+".",
   options:shuffle(SHAPES.filter(x=>x!==target)).slice(0,3).concat([target]).map(v=>({value:v,label:v,icon:shapeGlyph[v]}))};
 }else if(mode==="sizes"){
  const types=[["Big","🐘","big"],["Medium","🐕","medium"],["Small","🐭","small"]];
  const t=types[(r+rand(3))%3];
  q={...q,title:t[0]+" or small?",icon:t[1],correct:t[0],prompt:"Which size is this?",voice:"Find the "+t[0]+" size.",
    options:types.map(x=>({value:x[0],label:x[0],icon:x[1]}))};
 }else if(mode==="patterns"){
  const patterns=[{seq:"🔴 🔵 🔴  ❓",answer:"🔵",options:["🔴","🔵","🟡","🟢"]},
    {seq:"⭐ 🌙 ⭐  ❓",answer:"🌙",options:["🌙","⭐","☁️","❤️"]},
    {seq:"🍎 🍌 🍎  ❓",answer:"🍌",options:["🍎","🍌","🍇","🍐"]},
    {seq:"🟢 🟢 🟡 🟢 🟢  ❓",answer:"🟡",options:["🟢","🔵","🟡","🔴"]}];
  const t=patterns[(r+rand(patterns.length))%patterns.length];
  q={...q,title:"What comes next?",icon:t.seq,correct:t.answer,prompt:"Finish the pattern!",voice:"Look at the pattern. What comes next?",
   options:shuffle(t.options.map(x=>({value:x,label:"",icon:x})))};
 }else if(mode==="food"){
  const foods=[["🍎","Fruit"],["🥦","Vegetable"],["🍰","Treat"],["🍌","Fruit"],["🌽","Vegetable"],["🍪","Treat"],["🍇","Fruit"]];
  const t=foods[(r+rand(foods.length))%foods.length];
  q={...q,title:"Food basket!",icon:t[0],correct:t[1],prompt:"Where does it belong?",voice:"Sort the food into the right basket.",
   options:[{value:"Fruit",label:"Fruit",icon:"🍎"},{value:"Vegetable",label:"Veggies",icon:"🥕"},{value:"Treat",label:"Treats",icon:"🧁"}]};
 }else if(["toys","weather","tools"].includes(mode)){
  const banks={
   toys:[["🧸","Soft Toy"],["⚽","Sports Toy"],["🧩","Puzzle"],["🪀","Sports Toy"],["🐻","Soft Toy"],["🔢","Puzzle"]],
   weather:[["☀️","Sunny"],["🌧️","Rainy"],["❄️","Snowy"],["🌈","Sunny"],["☂️","Rainy"],["⛄","Snowy"]],
   tools:[["🩺","Doctor"],["🚒","Firefighter"],["🖌️","Artist"],["🧑‍⚕️","Doctor"],["🧯","Firefighter"],["🎨","Artist"]]
  };
  const t=pick(banks[mode]),categories=[...new Set(banks[mode].map(x=>x[1]))];
  q={...q,title:"Let's match!",icon:t[0],correct:t[1],prompt:"Which group matches?",voice:"Which group matches this picture?",
    options:categories.map(x=>({value:x,label:x,icon:x==="Doctor"?"🩺":x==="Artist"?"🎨":"✨"}))};
 }else{
  const places=[["🐠","Sea"],["🦁","Forest"],["🐄","Farm"],["🐦","Sky"],["🦀","Sea"],["🐘","Forest"],["🐎","Farm"],["🦋","Sky"]];
  const t=places[(r+rand(places.length))%places.length];
  q={...q,title:"Nature home!",icon:t[0],correct:t[1],prompt:"Where does it live?",voice:"Where does the animal belong?",
  options:[{value:"Sea",label:"Sea",icon:"🌊"},{value:"Forest",label:"Forest",icon:"🌳"},{value:"Farm",label:"Farm",icon:"🏡"},{value:"Sky",label:"Sky",icon:"☁️"}]};
 }
 q.options=shuffle(q.options);
 if(state.age==="2-3"&&q.options.length>3){
  q.options=shuffle([q.options.find(x=>x.value===q.correct),...q.options.filter(x=>x.value!==q.correct).slice(0,2)]);
 }
 return q;
}
function renderSorting(){
 const q=state.question;
 const itemStyle=q.color?' style="color:'+q.color+'"':'';
 if(release.id==="v1.5"){
  const scenes={colors:['🌈','Color Garden'],shapes:['🔷','Shape Workshop'],sizes:['📏','Size Trail'],
   patterns:['🚂','Pattern Path'],food:['🧺','Food Market'],habitat:['🏡','Animal Homes'],
   toys:['🧸','Toy Shelves'],weather:['🌤️','Weather Station'],tools:['🛠️','Helper Workshop']};
  const scene=scenes[state.mode]||['🧩','Thinking Forest'];
  const hues={Red:'#ffe1e5',Blue:'#dcf0ff',Yellow:'#fff3b7',Green:'#dff5da',Purple:'#eae0fa',Orange:'#ffe6c8',Pink:'#ffe2f4',
   Fruit:'#ffe5cc',Vegetable:'#d9f2d0',Treat:'#f5dfee',Sea:'#ccecf8',Forest:'#dcefd7',Farm:'#fff2d4',Sky:'#e3efff',
   Sunny:'#fff0bc',Rainy:'#cfe7fb',Snowy:'#e9f5ff',Big:'#ffe1ca',Medium:'#e9e0ff',Small:'#d4f4ea'};
  const critters=['🐰','🐻','🦊','🐼'];
  const cards=q.options.map((x,idx)=>{
   const bg=hues[x.value]||'#fff5e8',size=state.mode==='sizes'?' sort-'+String(x.value).toLowerCase():'';
   return '<button class="sorting-choice drop-basket'+size+'" style="background:'+bg+'" data-action="answer" data-value="'+esc(x.value)+'" data-basket-value="'+esc(x.value)+'">'+
    '<span class="basket-critter" aria-hidden="true">'+critters[idx%critters.length]+'</span>'+
    '<span class="sorting-choice-icon" '+(x.color?'style="color:'+x.color+'"':'')+'>'+x.icon+'</span><strong>'+esc(x.label||x.value)+'</strong></button>';
  }).join('');
  return '<div class="game-shell">'+renderMission(q.title,'Drag the item into the matching basket, or tap!',scene[0])+
   '<section class="playfield sorting-v15"><div class="sorting-scene"><span>'+scene[0]+'</span><strong>'+scene[1]+' · Drag & Drop!</strong></div>'+
   '<div id="sortDragItem" class="sorting-target draggable-token"'+itemStyle+' role="button" aria-label="Drag item to matching basket">'+q.icon+'<small class="drag-me-tag">✋ Drag me!</small></div><h2>'+q.prompt+'</h2>'+
   '<div class="sorting-options">'+cards+'</div></section></div>';
 }
 return '<div class="game-shell">'+renderMission(q.title,"Look, think, and tap!",state.avatar)+
 '<section class="playfield"><div class="focus-item"'+itemStyle+'>'+q.icon+'</div><h2 class="play-question">'+q.prompt+'</h2>'+
 '<div class="choice-grid '+(q.options.length===3?"three":"")+'">'+q.options.map(x=>optionButton(x)).join("")+'</div></section></div>';
}

function mountSortingDrag(){
 if(typeof document==="undefined")return;
 const token=document.querySelector("#sortDragItem");
 const baskets=document.querySelectorAll(".sorting-choice.drop-basket");
 if(!token||!baskets.length)return;
 let dragging=false,sx=0,sy=0;
 token.addEventListener("pointerdown",e=>{
  if(state.locked)return;
  e.preventDefault();dragging=true;sx=e.clientX;sy=e.clientY;
  token.style.transition="none";token.classList.add("is-dragging");
  try{token.setPointerCapture(e.pointerId);}catch(_){}
  soundFX("flip");
 });
 token.addEventListener("pointermove",e=>{
  if(!dragging)return;e.preventDefault();
  const dx=e.clientX-sx,dy=e.clientY-sy;
  token.style.transform="translate("+dx+"px,"+dy+"px) scale(1.12)";
  const tb=token.getBoundingClientRect(),tcx=tb.left+tb.width/2,tcy=tb.top+tb.height/2;
  baskets.forEach(b=>{
   const r=b.getBoundingClientRect();
   const near=Math.hypot((r.left+r.width/2)-tcx,(r.top+r.height/2)-tcy)<95;
   b.classList.toggle("basket-magnet",near);
  });
 });
 const finish=e=>{
  if(!dragging)return;dragging=false;
  token.classList.remove("is-dragging");
  baskets.forEach(b=>b.classList.remove("basket-magnet"));
  const tb=token.getBoundingClientRect(),tcx=tb.left+tb.width/2,tcy=tb.top+tb.height/2;
  let hit=null,best=999;
  baskets.forEach(b=>{
   const r=b.getBoundingClientRect(),d=Math.hypot((r.left+r.width/2)-tcx,(r.top+r.height/2)-tcy);
   if(d<105&&d<best){best=d;hit=b;}
  });
  if(hit){
   const val=hit.getAttribute("data-value");
   if(String(val)===String(state.question?.correct)){
    onAnswer(val,hit);return;
   }else{
    hit.classList.add("wrong");
    setTimeout(()=>hit.classList.remove("wrong"),450);
    announce("Oops! Try another basket 💛","oops");
    speak("Good try! Let's try a different basket.");
   }
  }
  token.style.transition="transform .32s cubic-bezier(.2,.9,.3,1.2)";
  token.style.transform="";
 };
 token.addEventListener("pointerup",finish);token.addEventListener("pointercancel",finish);
}

function makeAnimalQuestion(){
 const m=state.mode,r=state.round,groups={
  listen:animals.filter(a=>animalClips[a.name]),safari:animals.filter(a=>animalClips[a.name]&&!(["Cow","Sheep","Pig","Horse","Hen","Rooster"].includes(a.name))),
  farm:animals.filter(a=>animalClips[a.name]&&["Cow","Dog","Cat","Duck","Sheep","Pig","Horse","Hen","Rooster","Goat","Donkey"].includes(a.name)),tracks:animals.filter(a=>animalClips[a.name])
 };
 const pool=groups[m]||animals;
 const a=pool[(r+rand(pool.length))%pool.length];
 const q={animal:a.name,icon:a.icon,title:"Listen closely!",prompt:"Who makes this sound?",voice:"Listen and choose the animal."};
 if(["listen","safari","farm"].includes(m)){
  q.correct=a.name;
  q.options=shuffle([a,...shuffle(animals.filter(x=>x.name!==a.name)).slice(0,3)]).map(x=>({value:x.name,label:x.name,icon:x.icon}));
  q.hidden=true;
 }else if(m==="baby"||m==="babyhomes"){
  q.title="Hello, baby!";q.prompt="Find the "+a.baby+"!";
  q.voice="Which baby belongs to the "+a.name+"?";
  q.correct=a.baby;
  q.options=shuffle([{value:a.baby,label:a.baby,icon:"🐣"},...shuffle([...new Set(animals.map(x=>x.baby))].filter(x=>x!==a.baby)).slice(0,3).map(x=>({value:x,label:x,icon:"🐾"}))]);
 }else if(m==="homes"||m==="tracks"||m==="diets"){
  if(m==="tracks"){
   q.title="Follow the tracks!";q.prompt="Listen! Who left these tracks?";q.voice="Listen to the animal call. Who left these tracks?";q.icon="🐾";q.correct=a.name;q.hidden=true;
   q.options=shuffle([a,...shuffle(animals.filter(x=>x.name!==a.name)).slice(0,3)]).map(x=>({value:x.name,label:x.name,icon:x.icon}));
  }else if(m==="diets"){
   const diet={Cow:"Grass",Dog:"Meat",Cat:"Meat",Duck:"Plants",Sheep:"Grass",Lion:"Meat",Bird:"Seeds",Elephant:"Plants",Pig:"Plants",Horse:"Grass",Frog:"Insects",Bee:"Nectar",Wolf:"Meat",Owl:"Meat",Hen:"Seeds",Rooster:"Seeds",Bat:"Insects",Tiger:"Meat",Monkey:"Plants",Goat:"Grass",Donkey:"Grass",Dolphin:"Fish",Eagle:"Meat",Parrot:"Seeds",Penguin:"Fish",Deer:"Grass",Crocodile:"Meat",Crow:"Insects",Pigeon:"Seeds",Hyena:"Meat",Coyote:"Meat"};
   q.title="Animal meal!";q.prompt="What might a "+a.name+" eat?";q.voice=q.prompt;q.correct=diet[a.name];
   q.options=[["Grass","🌾"],["Meat","🍖"],["Plants","🌿"],["Seeds","🌻"],["Insects","🐛"],["Nectar","🌺"],["Fish","🐟"]].map(x=>({value:x[0],label:x[0],icon:x[1]}));
  }else{
  q.title="Where is my home?";q.prompt="Help the "+a.name+" find a home!";
  q.voice="Where does the "+a.name+" live?";
  q.correct=a.home;
  const homes=[["Farm","🏡"],["House","🏠"],["Pond","💧"],["Jungle","🌳"],["Nest","🪺"],["Forest","🌲"],["Stable","🏇"],["Hive","🍯"],["Ocean","🌊"]];
  q.options=shuffle([homes.find(x=>x[0]===a.home),...shuffle(homes.filter(x=>x[0]!==a.home)).slice(0,3)]).map(x=>({value:x[0],label:x[0],icon:x[1]}));
  }
 }else{
  q.title="Who is hiding?";q.prompt="Find the shadow animal!";
  q.voice="Look at the shadow. Which animal is hiding?";
  q.correct=a.name;
  q.options=shuffle([a,...shuffle(animals.filter(x=>x.name!==a.name)).slice(0,3)]).map(x=>({value:x.name,label:x.name,icon:x.icon}));
  q.shadow=true;
 }
 if(state.age==="2-3"&&q.options.length>3)
  q.options=shuffle([q.options.find(x=>x.value===q.correct),...q.options.filter(x=>x.value!==q.correct).slice(0,2)]);
 return q;
}
function renderAnimals(){
 const q=state.question;
 const peekOpen=!!state.peekabooOpen;
 const hero=(release.id==="v1.5"&&(q.hidden||q.shadow))?
  '<button class="sound-hero peekaboo-barn '+(peekOpen?"peekaboo-open":"")+'" data-action="peekabooReveal" aria-label="Peekaboo! Tap to peek and hear the animal">'+
   '<span class="peekaboo-animal" '+(q.shadow&&!peekOpen?'style="filter:brightness(0);opacity:.68"':'')+'>'+q.icon+'</span>'+
   '<span class="peekaboo-doors"><span>🌿</span><small>'+(peekOpen?'🔊 Tap to hear!':'👀 Peekaboo! Tap bush!')+'</small><span>🌿</span></span>'+
  '</button>':
  q.hidden?'<button class="sound-hero" data-action="animalSound" aria-label="Play animal sound">🔊</button>':
  q.shadow?'<div class="sound-hero"><span style="filter:brightness(0);opacity:.63">'+q.icon+'</span></div>':
  '<button class="sound-hero" data-action="animalSound" aria-label="Play animal sound">'+q.icon+'</button>';
 const film=!q.hidden&&!q.shadow&&animalFootage[q.animal]?'<div class="animal-film"><video src="animal-videos/'+animalFootage[q.animal]+'" muted playsinline loop preload="metadata" '+(!settings.reduced?'autoplay':'')+' aria-label="Real '+q.animal+' animal video"></video><span class="film-label">🎬 Real '+q.animal+'</span><button class="animal-video-replay" data-action="animalVideo" aria-label="Replay animal film">↻ Replay</button></div>':'';
 return '<div class="game-shell">'+renderMission(q.title,"Use your listening ears!",state.avatar)+
 '<section class="playfield animal-playfield '+(spaciousRelease&&q.options.length>4?'has-many-options':'')+'"><div class="animal-hero-wrap">'+(film||hero)+(film?hero:'')+'</div><h2 class="play-question">'+q.prompt+'</h2>'+
 '<div class="choice-grid '+(q.options.length===3?"three":"")+'">'+q.options.map(o=>optionButton(o)).join("")+'</div></section></div>';
}
function cardCollection(){
 const animal=["flashcards","realfilms"].includes(state.mode);
 const source=animal?animalAtlasUnique:objectCards;
 const soundMap=animal?animalClips:objectSoundClips;
 if(restoredRelease){
  if(state.mode==="realfilms")return source.filter(a=>animalFootage[a.name]);
  return state.cardFilter==="sounds"?source.filter(a=>soundMap[a.name]):source;
 }
 if(release.id==="v1.4"&&state.mode==="flashcards"){
  if(state.cardFilter==="video")return source.filter(a=>animalFootage[a.name]);
  if(state.cardFilter==="all")return source;
  return source.filter(a=>soundMap[a.name]);
 }
 return state.cardSoundsOnly?source.filter(a=>soundMap[a.name]):source;
}
function renderCards(){
 if(restoredRelease)return renderRestoredCards();
 const list=cardCollection(),index=Math.max(0,Math.min(state.cardIndex||0,list.length-1)),card=list[index];
 if(!card)return '<section class="playfield"><h2>New flashcards are on the way!</h2></section>';
 const animal=state.mode==="flashcards",hasSound=!!(animal?animalClips[card.name]:objectSoundClips[card.name]);
 const video=animal&&animalFootage[card.name]?'<video class="flash-video '+(card.name==='Cat'?'portrait-film':'')+'" src="animal-videos/'+animalFootage[card.name]+'" muted playsinline loop preload="metadata" '+(!settings.reduced?'autoplay':'')+' aria-label="Real '+esc(card.name)+' animal mini-film"></video>':'';
 const filterTabs=release.id==="v1.4"&&animal?
  '<button class="'+(state.cardFilter==="video"?'selected':'')+'" data-action="cardFilter" data-value="video">🎬 Real films</button>'+
  '<button class="'+(state.cardFilter==="sounds"?'selected':'')+'" data-action="cardFilter" data-value="sounds">🔊 With sounds</button>'+
  '<button class="'+(state.cardFilter==="all"?'selected':'')+'" data-action="cardFilter" data-value="all">All animals</button>':
  '<button class="'+(state.cardSoundsOnly?'selected':'')+'" data-action="cardFilter" data-value="sounds"><span class="emoji">🔊</span> With sounds</button>'+
  '<button class="'+(!state.cardSoundsOnly?'selected':'')+'" data-action="cardFilter" data-value="all">All '+(animal?'animals':'objects')+'</button>';
 return '<div class="game-shell">'+renderMission(animal?"Animal Friends":"Everyday Sounds","Tap and listen to learn!",state.avatar)+
 '<section class="playfield flashcard-field"><div class="flashcard-top"><div class="flashcard-filter">'+
 filterTabs+'</div><strong>'+ (index+1)+' / '+list.length+'</strong></div>'+
 '<div class="flashcard-main"><div class="flashcard-illustration '+(video?'has-film':'')+'">'+(video||'<span>'+card.icon+'</span>')+(video?'<span class="film-stamp">Real animal film</span><button class="animal-video-replay" data-action="animalVideo" aria-label="Replay animal film">↻ Replay</button>':'')+'</div><div class="flashcard-caption"><h2>'+esc(card.name)+'</h2><p>'+esc(animal?card.group:(hasSound?'Listen to its matching sound effect':'Learn the object name'))+'</p>'+(video?'<div class="film-note">Watch how it moves in real life!</div>':'')+'</div></div>'+
 '<div class="flashcard-actions"><button data-action="cardPrev">◀ Previous</button><button class="flashcard-hear" data-action="cardHear">'+
 (hasSound?'<span class="emoji">🔊</span> Hear '+(animal?'animal':'sound'):'<span class="emoji">🗣️</span> Hear name')+'</button><button data-action="cardNext">Next ▶</button></div></section></div>';
}
function renderRestoredCards(){
 const list=cardCollection(),index=Math.max(0,Math.min(state.cardIndex||0,list.length-1)),card=list[index];
 if(!card)return '<section class="playfield"><h2>No cards found.</h2></section>';
 const animal=["flashcards","realfilms"].includes(state.mode),films=state.mode==="realfilms";
 const hasSound=!!(animal?animalClips[card.name]:objectSoundClips[card.name]);
 const hasFilm=animal&&!!animalFootage[card.name];
 const still=hasFilm?'animal-stills/'+card.name.toLowerCase()+'.jpg':'';
 const illustration=hasFilm?'animal-stills/'+card.name.toLowerCase()+'-illustration.jpg':'';
 const media=films?'<video class="flash-video '+(card.name==="Cat"?'portrait-film':'')+'" src="animal-videos/'+animalFootage[card.name]+'" poster="'+still+'" muted playsinline loop preload="metadata" '+(!settings.reduced?'autoplay':'')+' aria-label="Real '+esc(card.name)+' animal film"></video>':
  illustration?'<img class="flash-real-photo" src="'+illustration+'" alt="Realistic storybook illustration of a '+esc(card.name.toLowerCase())+'"/>':
  '<span class="animal-card-emoji">'+card.icon+'</span>';
 const facts=animalLearningFacts[card.name];
 const detail=animal?(facts?'<div class="animal-detail"><div><strong>🏡 Home</strong><span>'+esc(facts.habitat)+'</span></div><div><strong>🐣 Baby</strong><span>'+esc(facts.baby)+'</span></div><div><strong>🌱 Food</strong><span>'+esc(facts.food)+'</span></div><p>'+esc(facts.fact)+'</p></div>':
  '<div class="animal-detail animal-detail-simple"><strong>🌿 Animal group</strong><span>'+esc(card.group)+'</span><p>Look at this animal. Say its name aloud!</p></div>'):
  '<div class="animal-detail animal-detail-simple"><strong>👀 Look and learn</strong><p>'+esc(hasSound?'Listen to the matching object sound.':'Say the object name aloud!')+'</p></div>';
 const filters=animal?(films?
  '<button data-action="openAnimalAtlas">🦁 All 123 animals</button><button class="selected" disabled>🎬 Real Films · 6</button>':
  '<button class="'+(state.cardFilter==="all"?'selected':'')+'" data-action="cardFilter" data-value="all">🦁 All 123 animals</button>'+ 
  '<button class="'+(state.cardFilter==="sounds"?'selected':'')+'" data-action="cardFilter" data-value="sounds">🔊 With sounds · 34</button>'+ 
  '<button data-action="openRealFilms">🎬 Real Films · 6</button>'):
  '<button class="'+(state.cardFilter==="all"?'selected':'')+'" data-action="cardFilter" data-value="all">All 45 objects</button>'+ 
  '<button class="'+(state.cardFilter==="sounds"?'selected':'')+'" data-action="cardFilter" data-value="sounds">🔊 With sounds · 17</button>';
 return '<div class="game-shell">'+renderMission(films?'Real Animal Films':animal?'Animal Encyclopedia':'Everyday Sound Cards',films?'Watch real animals move!':'Look, listen and explore!',state.avatar)+
 '<section class="playfield flashcard-field restored-cards"><div class="flashcard-top"><div class="flashcard-filter">'+filters+'</div><strong>'+ (index+1)+' / '+list.length+'</strong></div>'+
 '<div class="flashcard-main"><div class="flashcard-illustration '+(films?'has-film':'')+'">'+media+
 (films?'<span class="film-stamp">🎬 Muted offline footage</span><button class="animal-video-replay" data-action="animalVideo" aria-label="Replay real film">↻ Replay</button>':
  hasFilm?'<span class="film-stamp">🎨 Realistic animal illustration</span>':'')+'</div>'+
 '<div class="flashcard-caption"><h2>'+esc(card.name)+'</h2><p>'+esc(animal?card.group:'Everyday object')+'</p>'+detail+
 (hasFilm&&!films?'<button class="see-real-film" data-action="viewFilm" data-value="'+esc(card.name)+'">🎬 Watch real film</button>':'')+'</div></div>'+
 '<div class="flashcard-actions"><button data-action="cardPrev">◀ Previous</button><button class="flashcard-hear" data-action="cardHear">'+
 (hasSound?'🔊 Hear '+(animal?'animal':'sound'):'🗣️ Hear name')+'</button><button data-action="cardNext">Next ▶</button></div></section></div>';
}
function hearCard(){
 const card=cardCollection()[state.cardIndex||0];if(!card)return;
 if(["flashcards","realfilms"].includes(state.mode)){
  if(animalClips[card.name])animalSound(card.name);else speak("This is a "+card.name+".");
 }else if(!playObjectSound(card.name))speak("This is a "+card.name+".");
}
function makeMemory(){
 const count=state.age==="2-3"?3:4;
 const sample=shuffle(memoryDecks[state.mode]).slice(0,count);
 return {cards:shuffle([...sample,...sample]).map((item,i)=>({id:i,item,open:false,done:false})),
    selected:[],pairs:0,total:count,moves:0,locked:false};
}
function renderMemory(){
 const m=state.memory;
 const cards=m.cards.map(c=>'<button class="memory-tile '+(c.done?"done":c.open?"open":"")+'" data-action="flip" data-value="'+c.id+'" '+
 (c.done?'disabled':'')+' aria-label="'+(c.open||c.done?esc(c.item):"Hidden matching card")+'">'+(c.open||c.done?c.item:"✿")+'</button>').join("");
 return '<div class="game-shell">'+renderMission("Find the pairs!","Tap two cards to match.",state.avatar)+
 '<section class="playfield"><div class="memory-grid">'+cards+'</div></section></div>';
}
function renderTracing(){
 const symbol=state.traceDeck[state.round]||"A";
 const isShape=state.mode==="shapes";
 return '<div class="game-shell">'+renderMission(isShape?"Draw the shape":"Trace the letter","Follow the big guide with your finger.",state.avatar)+
 '<section class="playfield tracing-playfield"><div class="trace-pad '+(isShape?'shape-trace':'')+' '+(release.id==="v1.5"?'trace-validated':'')+'"><div class="trace-letter" style="'+(symbol.length>1?'font-size:clamp(60px,24vh,250px)':'')+'">'+esc(symbol)+'</div>'+
 '<canvas id="traceCanvas" aria-label="Trace the letter with your finger"></canvas>'+(release.id==="v1.5"?'<button class="trace-demo" data-action="traceDemo">👀 Show me</button>':'')+'</div>'+
 '<div class="trace-actions"><button data-action="clearTrace">↻ Try again</button><span class="trace-progress"><span id="traceProgressFill"></span></span><span id="traceHint" role="status">Trace to earn your star!</span><button data-action="skipTrace">Skip ↪</button><button id="traceNext" data-action="nextTrace" disabled>Next '+(isShape?'shape':'letter')+' ⭐</button></div></section></div>';
}
let traceAdvanceTimer=null,liveTrace=null;
function setupTrace(){
 const c=$("#traceCanvas");if(!c)return;
 if(release.id==="v1.5"){
  state.traceLength=0;state.traceReady=false;
  liveTrace=WonderTrace.mount(c,state.traceDeck[state.round]||"A",state.age,
   ()=>{state.traceReady=true;const b=$("#traceNext");if(b)b.disabled=false;soundFX("good");},
   percent=>{const fill=$("#traceProgressFill");if(fill)fill.style.width=percent+"%";},
   msg=>{const hint=$("#traceHint");if(hint)hint.textContent=msg;});
  return;
 }
 const r=c.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2);
 c.width=Math.round(r.width*ratio);c.height=Math.round(r.height*ratio);
 const ctx=c.getContext("2d");ctx.scale(ratio,ratio);ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=Math.max(12,r.height*.045);
 ctx.strokeStyle="#a885e5";
 let active=false,last=null,moving=false,strokes=0;
 const needed=Math.max(65,Math.min(190,Math.min(r.width,r.height)*.29));
 const point=e=>{const b=c.getBoundingClientRect();return {x:e.clientX-b.left,y:e.clientY-b.top}};
 const markReady=()=>{
  if(state.traceReady)return;
  state.traceReady=true;
  const b=$("#traceNext"),hint=$("#traceHint");if(b)b.disabled=false;
  if(hint)hint.textContent="Wonderful! Moving to the next one…";
  soundFX("good");
 };
 const update=()=>{const fill=$("#traceProgressFill");if(fill)fill.style.width=Math.min(100,Math.round(state.traceLength/needed*100))+"%";if(state.traceLength>=needed)markReady();};
 const begin=e=>{e.preventDefault();clearTimeout(traceAdvanceTimer);try{c.setPointerCapture(e.pointerId);}catch(err){}active=true;moving=false;last=point(e);ctx.beginPath();ctx.moveTo(last.x,last.y);strokes++;};
 const move=e=>{if(!active)return;e.preventDefault();const p=point(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();
  const dx=p.x-last.x,dy=p.y-last.y,segment=Math.hypot(dx,dy);
  if(segment>1)moving=true;
  state.traceLength+=Math.min(segment,75);last=p;update();
 };
 const end=()=>{active=false;last=null;
  if(moving&&state.traceReady){
   traceAdvanceTimer=setTimeout(()=>{if(state.screen==="game"&&state.world==="tracing"&&!state.locked)nextTrace();},800);
  }
 };
 c.addEventListener("pointerdown",begin);c.addEventListener("pointermove",move);c.addEventListener("pointerup",end);c.addEventListener("pointercancel",end);
}
function paintPath(key,markup){return markup.replace(/<([a-z]+)(\s)/, '<$1 data-paint="'+key+'" $2').replace(/fill="[^"]*"/, 'fill="'+(state.paint[key]||"#fffaf1")+'"');}
function paintScene(){
 const p=paintPath;
 const circle=(id,x,y,r)=>p(id,'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fffaf1"/>');
 const ellipse=(id,x,y,rx,ry)=>p(id,'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="#fffaf1"/>');
 const rect=(id,x,y,w,h,rx=0)=>p(id,'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="#fffaf1"/>');
 const path=(id,d)=>p(id,'<path d="'+d+'" fill="#fffaf1"/>');
 let art="";
 switch(state.mode){
 case "flowers":
  art='<path d="M0 214 H500" stroke="#95bb88" stroke-width="10"/><path d="M180 213 V118 M330 213 V111" stroke="#73ac78" stroke-width="12"/>';
  [[180,88],[330,80]].forEach(([x,y],i)=>{
   for(let j=0;j<6;j++){let a=j*Math.PI/3;art+=ellipse("petal"+i+"_"+j,Math.round(x+40*Math.cos(a)),Math.round(y+39*Math.sin(a)),24,27);}
   art+=circle("center"+i,x,y,26);
  });art+=path("leaf1","M180 184 Q115 127 114 170 Q133 205 180 184Z")+path("leaf2","M330 169 Q394 129 391 173 Q365 209 330 169Z");
  break;
 case "ocean":
  art='<path d="M0 210 Q100 195 200 208 T500 209" stroke="#70b2db" fill="none" stroke-width="9"/>';
  art+=ellipse("fish",225,122,105,67)+path("tail","M128 125 L45 60 L45 190Z")+circle("eye",263,106,12)+ellipse("fin",225,78,35,24);
  art+=circle("bubble1",390,70,25)+circle("bubble2",425,117,15)+circle("bubble3",392,148,11);
  art+=path("seaweed","M60 212 Q34 140 70 94 Q82 151 70 211Z");
  break;
 case "bear":
  art+=circle("earL",165,60,47)+circle("earR",332,60,47)+circle("head",248,119,120)+ellipse("muzzle",248,162,48,34);
  art+=circle("nose",249,148,12)+'<circle cx="206" cy="116" r="8" fill="#53466a"/><circle cx="292" cy="116" r="8" fill="#53466a"/>';
  art+=ellipse("bowL",193,22,36,22)+ellipse("bowR",265,22,36,22)+circle("bowMiddle",228,22,12);
  break;
 case "car":
  art+=rect("body",78,108,343,93,28)+path("roof","M147 109 L203 49 H327 L373 109 Z");
  art+=path("window1","M211 61 L166 109 H248 V61Z")+path("window2","M265 61 V109 H355 L318 61Z");
  art+=circle("wheel1",165,202,36)+circle("wheel2",346,202,36)+circle("light1",407,147,14)+circle("light2",93,147,14);
  break;
 case "fruits":
  art+=path("apple","M163 100 C110 58 79 108 94 156 C120 239 163 204 176 210 C195 218 241 230 254 151 C260 100 211 61 163 100Z");
  art+='<path d="M177 99 L189 45" stroke="#7a9777" stroke-width="10"/>'+ellipse("leaf",210,53,28,16);
  art+=path("banana","M260 182 Q347 216 421 94 Q398 187 298 213 Q275 209 260 182Z");
  art+=circle("grape1",340,72,24)+circle("grape2",386,72,24)+circle("grape3",361,109,25)+circle("grape4",343,143,22);
  break;
 case "dino":
  art+=ellipse("dinoBody",257,148,121,65)+path("neck","M319 137 Q326 46 364 35 Q411 24 402 71 Q394 108 367 115 L370 159Z");
  art+=path("tail","M158 152 Q76 130 58 74 Q50 158 159 197Z")+path("leg1","M190 189 V227 H231 L239 190Z")+
   path("leg2","M281 189 V227 H323 L331 178Z")+circle("sun",92,49,31)+circle("spot1",240,143,16)+circle("spot2",280,167,14);
  art+='<circle cx="385" cy="57" r="5" fill="#554763"/>';
  break;
 case "space":
  art+=path("rocket","M210 204 Q190 106 250 30 Q310 106 290 204Z")+circle("window",250,111,32)+path("finL","M210 155 L158 208 L211 206Z")+
   path("finR","M290 155 L344 208 L289 206Z")+path("flame","M231 205 L250 239 L270 205Z")+circle("planet",85,78,40)+circle("star",403,72,25);
  break;
 case "rainbow":
  art+=circle("sun",91,70,41)+circle("cloudL",94,195,53)+circle("cloudR",395,194,54);
  for(let i=0;i<5;i++)art+=path("bow"+i,"M"+(118+i*25)+" 200 Q250 "+(-90+i*18)+" "+(383-i*25)+" 200 L"+(367-i*21)+" 200 Q250 "+(-58+i*18)+" "+(133+i*21)+" 200 Z");
  break;
 case "castle":
  art+=rect("castle",135,85,230,140)+rect("towerL",87,49,72,175)+rect("towerR",341,49,72,175)+
   path("roofL","M76 49 L123 1 L170 49Z")+path("roofR","M330 49 L377 1 L424 49Z")+
   rect("door",226,152,48,72,24)+rect("windowL",166,111,32,38,14)+rect("windowR",302,111,32,38,14)+circle("sun",455,46,29);
  break;
 }
 return '<svg viewBox="0 0 500 240" role="img" aria-label="Tap the picture parts to color them">'+art+'</svg>';
}
function renderColoring(){
 return '<div class="game-shell">'+renderMission("Paint the story!","Pick a color, tap a shape.",state.avatar)+
 '<section class="playfield"><div class="paint-art">'+paintScene()+'</div><div class="palette">'+
 palettes.map(c=>'<button aria-label="Paint '+c+'" class="paint-dot '+(state.color===c?"selected":"")+'" style="background:'+c+'" data-action="color" data-value="'+c+'"></button>').join("")+
 '<div class="paint-tools"><button data-action="undoPaint">↶ Undo</button><button data-action="finishPaint">Done ⭐</button></div></div></section></div>';
}
// Full-canvas, child-led drawing studio (distinct from tap-to-fill coloring scenes).
function renderSketch(){
 const colors=sketchColors.map(c=>'<button class="sketch-color '+(sketch.color===c&&sketch.tool==="pen"?'chosen':'')+'" data-action="sketchColor" data-value="'+c+'" style="--swatch:'+c+'" aria-label="Choose drawing color '+c+'"></button>').join('');
 const sizes=sketchSizes.map(n=>'<button class="sketch-size '+(sketch.size===n?'chosen':'')+'" data-action="sketchSize" data-value="'+n+'" aria-label="Pen thickness '+n+'"><span style="width:'+Math.max(5,n*.65)+'px;height:'+Math.max(5,n*.65)+'px"></span><small>'+n+'</small></button>').join('');
 return '<section class="sketch-screen"><div class="sketch-body"><aside class="sketch-rail sketch-colors"><strong>Colors</strong><div class="sketch-swatches">'+colors+'</div></aside>'+
 '<div class="sketch-paper"><canvas id="sketchCanvas" aria-label="Full-size drawing canvas. Draw with your finger."></canvas></div>'+
 '<aside class="sketch-rail sketch-thickness"><strong>Brush</strong>'+sizes+'</aside></div>'+
 '<div class="sketch-footer"><button class="'+(sketch.tool==="pen"?'chosen':'')+'" data-action="sketchTool" data-value="pen"><span class="emoji">✏️</span> Pen</button>'+
 '<button class="'+(sketch.tool==="eraser"?'chosen':'')+'" data-action="sketchTool" data-value="eraser"><span class="emoji">🧽</span> Eraser</button>'+
 '<button data-action="sketchUndo">↶ Undo</button><button data-action="sketchClear"><span class="emoji">🗑️</span> Clear</button>'+
 '<button class="save-art" data-action="sketchSave"><span class="emoji">🌟</span> Save my art</button></div></section>';
}
function sketchCurrent(){const c=$("#sketchCanvas");if(!c)return sketch.snapshot;try{return c.toDataURL("image/png");}catch(e){return sketch.snapshot;}}
function sketchRefresh(){sketch.snapshot=sketchCurrent();render();}
function setupSketch(){
 const c=$("#sketchCanvas");if(!c)return;
 const r=c.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2);
 c.width=Math.max(1,Math.round(r.width*ratio));c.height=Math.max(1,Math.round(r.height*ratio));
 const ctx=c.getContext("2d");ctx.scale(ratio,ratio);ctx.fillStyle="#fffef8";ctx.fillRect(0,0,r.width,r.height);
 if(sketch.snapshot&&typeof Image!=="undefined"){
  const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,r.width,r.height);img.src=sketch.snapshot;
 }
 const xy=ev=>{const b=c.getBoundingClientRect();return {x:ev.clientX-b.left,y:ev.clientY-b.top}};
 let drawing=false;
 c.addEventListener("pointerdown",ev=>{
  ev.preventDefault();try{c.setPointerCapture(ev.pointerId);}catch(e){}
  try{sketch.history.push(c.toDataURL("image/png"));if(sketch.history.length>12)sketch.history.shift();}catch(e){}
  const p=xy(ev);drawing=true;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineCap="round";ctx.lineJoin="round";
  ctx.lineWidth=sketch.tool==="eraser"?sketch.size*1.8:sketch.size;
  ctx.strokeStyle=sketch.tool==="eraser"?"#fffef8":sketch.color;
  ctx.lineTo(p.x+.05,p.y+.05);ctx.stroke();sketch.strokes++;
 });
 c.addEventListener("pointermove",ev=>{if(!drawing)return;ev.preventDefault();const p=xy(ev);ctx.lineTo(p.x,p.y);ctx.stroke();});
 const stop=()=>{drawing=false;sketch.snapshot=sketchCurrent();};
 c.addEventListener("pointerup",stop);c.addEventListener("pointercancel",stop);
}
function sketchSave(){
 const canvas=$("#sketchCanvas");if(!canvas)return;
 try{
  const small=document.createElement("canvas"),w=Math.min(360,canvas.width);small.width=w;small.height=Math.round(w*canvas.height/canvas.width);
  const ctx=small.getContext("2d");ctx.fillStyle="#fffef8";ctx.fillRect(0,0,small.width,small.height);ctx.drawImage(canvas,0,0,small.width,small.height);
  const gallery=restore("lww2_gallery",[]);gallery.unshift(small.toDataURL("image/jpeg",.65));
  persist("lww2_gallery",gallery.slice(0,8));sketch.snapshot=sketchCurrent();toast("Saved to Parent Corner! 🌟");speak("What beautiful colors!");
 }catch(e){toast("Storage is full. Please ask a grown-up.");}
}
function nextBalloon(){
 const data=state.mode==="animals"?balloonData.animals.filter(a=>animalClips[a.name]):balloonData[state.mode],items=shuffle(data).slice(0,state.age==="2-3"?4:6),target=pick(items);
 state.question={target:target.name,prompt:"Pop "+target.name+"!",voice:"Find "+target.name+". Pop the balloon!"};
 if(state.mode==="lettersounds"){
  const word=WonderContent.letterPairs.find(x=>x[0]===target.name)?.[1]||target.name;
  state.question.prompt="Pop the letter for "+word+"!";
  state.question.voice="Listen carefully. "+word+" begins with the letter "+target.name+". Find the letter "+target.name+"!";
 }
 state.options=shuffle(items);
}
function renderBalloon(){
 const q=state.question;
 const balloons=state.options.map((item,i)=>{
  const bg=item.color||["#ff8d9a","#85c8fa","#ffe183","#adedd0","#d6b7fb","#f7ae75"][i%6];
  const lane=[8,47,25,60,3,37][i],speed=settings.slow?16:11;
  return '<button class="balloon" data-action="pop" data-value="'+esc(item.name)+'" aria-label="Pop '+esc(item.name)+'" '+
   'style="--lane:'+lane+'%;--speed:'+(speed+i%3*1.2)+'s;--delay:-'+(i*2.2+2)+'s;--bg:'+bg+'">'+
   '<div class="balloon-body"><span class="balloon-icon">'+item.icon+'</span>'+
   '<span class="balloon-label">'+(state.mode==="colors"||state.mode==="shapes"?esc(item.name):state.mode==="alphabet"||state.mode==="numbers"?"":esc(item.name))+'</span></div>'+
   '<div class="balloon-string"></div></button>';
 }).join("");
 return '<div class="game-shell">'+renderMission(q.prompt,"Watch them travel along the road!",'🎈')+
 '<section class="playfield road-scene"><div class="road-hill"></div><div class="road-cloud a">☁️</div><div class="road-cloud b">☁️</div>'+
 balloons+'</section></div>';
}
function finishGame(){
 const w=state.world,m=state.mode;
 stats.total=(stats.total||0)+1;
 stats.byWorld[w]=(stats.byWorld[w]||0)+1;
 const key=w+"."+m;stats.byMode[key]=(stats.byMode[key]||0)+1;
 const day=new Date().toISOString().slice(0,10);
 stats.daily[day]=(stats.daily[day]||0)+1;
 // Ticket economy: tickets are earned only by playing. No purchases, no ads.
 let earned=5; // base: 5 tickets per completed game
 const modeKey=w+"."+m;
 const modeAcc=stats.byModeAccuracy&&stats.byModeAccuracy[modeKey];
 const acc=modeAcc?(modeAcc.correct/Math.max(1,modeAcc.attempts)):(stats.attempts?(stats.correct||0)/stats.attempts:0);
 if(acc>=0.8)earned+=2; // accuracy bonus: +2 when accuracy is 80% or higher
 if(stats.ticketsEarnedMode){
  if(!stats.ticketsEarnedMode.includes(modeKey)){earned+=1;stats.ticketsEarnedMode.push(modeKey);} // first completion bonus
 }else{stats.ticketsEarnedMode=[modeKey];earned+=1;}
 stats.tickets=(stats.tickets||0)+earned;
 state.lastTicketEarned=earned;
 persist("lww2_stats",stats);
 state.screen="complete";state.locked=false;soundFX("win");render();
 setTimeout(()=>speak("Fantastic! You did it! You are a star!"),200);
}
function recordAttempt(correct){
 stats.attempts=(stats.attempts||0)+1;
 if(correct)stats.correct=(stats.correct||0)+1;
 const key=state.world+"."+state.mode;
 if(!stats.byModeAccuracy)stats.byModeAccuracy={};
 const a=stats.byModeAccuracy[key]||{attempts:0,correct:0};
 a.attempts++;if(correct)a.correct++;stats.byModeAccuracy[key]=a;
 persist("lww2_stats",stats);
}
function renderComplete(){
 const mIcon=currentMode()?.[2]||worlds[state.world]?.icon||"🌟";
 // Display path progress if WonderPath is available
 const pathProgress=stats.pathProgress||0;
 const totalSteps=typeof WonderPath!=='undefined'?WonderPath.getTotalSteps():0;
 const progressInfo=totalSteps>0?'<div class="path-progress-display">Step '+pathProgress+' of '+totalSteps+' in your learning path</div>':'';
 const tickets=stats.tickets||0;
 const earned=state.lastTicketEarned;
 const ticketInfo=earned?
  '<div class="ticket-earned-banner"><span class="ticket-icon">🎫</span> <strong>+'+earned+' tickets!</strong> <span class="ticket-total">Total: '+tickets+'</span></div>':
  '';
 const ticketBalance='<div class="ticket-balance"><span class="ticket-icon">🎫</span> <span class="ticket-count">'+tickets+'</span></div>';
 return '<section class="complete-wrap"><div class="complete-mascot">'+state.avatar+'🎉</div>'+
 '<div class="complete-card">'+
 '<h1>Hooray, Superstar!</h1>'+
 '<div class="stars">⭐ 🌟 ⭐</div>'+
 '<p>You finished <strong>'+esc(modeTitle())+'</strong>!</p>'+
 ticketInfo+
 '<div class="complete-actions">'+
 '<button class="big-primary replay-pulse-btn" data-action="again"><span class="emoji">'+mIcon+'</span> Play Again! ↻</button>'+
 '<button class="big-primary purple" data-action="nextMode">Next adventure →</button>'+
 '<button class="bubble-btn home-return-btn" data-action="home" aria-label="Return Home">🏡 Home</button></div>'+
 progressInfo+
 '</div></section>';
}
const numWords={8:"Eight",9:"Nine",10:"Ten",11:"Eleven",12:"Twelve",13:"Thirteen",14:"Fourteen",15:"Fifteen",16:"Sixteen",17:"Seventeen",18:"Eighteen",19:"Nineteen",20:"Twenty",21:"Twenty-one",22:"Twenty-two",23:"Twenty-three",24:"Twenty-four",25:"Twenty-five",26:"Twenty-six"};
function makeGate(){
 const a=12+rand(14),b=8+rand(12),correct=a+b;
 const distractors=release.id==="v1.5"?[correct-4,correct-2,correct+1,correct+3,correct+6]:[correct-3,correct+4];
 state.gate={a,b,correct,options:shuffle([correct,...distractors])};
}
function renderGate(){
 const g=state.gate||{a:13,b:8,correct:21,options:[18,19,21,22,24,27]};
 const wordA=numWords[g.a]||String(g.a),wordB=numWords[g.b]||String(g.b);
 return '<section class="parent-gate"><div class="gate-card"><h2>👨‍👩‍👧 Grown-ups only</h2><p>Ask a parent to solve this or press &amp; hold the Grown-Up button for 2 seconds.</p>'+
 '<h2>'+(release.id==="v1.5"?wordA+' plus '+wordB+' ('+g.a+' + '+g.b+') = ?':g.a+' + '+g.b+' = ?')+'</h2>'+
 '<div class="choice-row gate-keypad">'+g.options.map(n=>'<button data-action="gate" data-value="'+n+'">'+n+'</button>').join("")+'</div>'+
 (release.id==="v1.5"?'<div class="gate-hold-wrap"><button id="parentHoldBtn" class="tiny-cta" type="button">🔒 Press &amp; Hold (2s) to Unlock</button></div>':'')+
 '</div></section>';
}
function mountParentGateHold(){
 if(typeof document==="undefined")return;
 const btn=document.querySelector("#parentHoldBtn");if(!btn)return;
 let timer=null;
 const start=e=>{e.preventDefault();btn.textContent="🔓 Holding... keep pressing";timer=setTimeout(()=>{state.screen="parent";render();},1600);};
 const cancel=()=>{clearTimeout(timer);btn.textContent="🔒 Press & Hold (2s) to Unlock";};
 btn.addEventListener("pointerdown",start);btn.addEventListener("pointerup",cancel);btn.addEventListener("pointerleave",cancel);btn.addEventListener("pointercancel",cancel);
}
function settingButtons(key,values){
 return '<div class="switches">'+values.map(v=>'<button class="'+(settings[key]===v[0]?"selected":"")+'" data-action="setting" data-key="'+key+'" data-value="'+v[0]+'">'+v[1]+'</button>').join("")+'</div>';
}
function renderParent(){
 const total=stats.total||0,used=Object.keys(stats.byMode||{}).length;
 const daily=stats.daily[new Date().toISOString().slice(0,10)]||0;
 const accuracy=stats.attempts?Math.round(100*(stats.correct||0)/stats.attempts):null;
 const landed=WonderContent.lands.map(l=>({land:l,total:visibleWorldIds.filter(id=>worlds[id].land===l.id).reduce((a,id)=>a+(stats.byWorld[id]||0),0)}));
 return '<section class="parent-panel"><div class="parent-card"><h2>🌱 Learning journey</h2>'+
 '<div class="stat-grid"><div class="stat"><strong>'+total+'</strong>sessions</div><div class="stat"><strong>'+used+'</strong>activities tried</div>'+
 '<div class="stat"><strong>'+daily+'</strong>today</div></div>'+
 '<p>Answer accuracy: '+(accuracy===null?'Play a game to begin tracking':accuracy+'% across '+stats.attempts+' attempts')+'. This is practice feedback, not a developmental assessment.</p>'+
 '<p>Learning lands explored:</p><div class="stat-grid">'+landed.map(({land,total})=>'<div class="stat">'+land.icon+' '+land.name+'<strong>'+total+'</strong></div>').join("")+'</div>'+
 '<p>Worlds explored:</p><div class="stat-grid">'+visibleWorldIds.map(id=>{const w=worlds[id];return '<div class="stat">'+w.icon+' '+w.short+'<strong>'+(stats.byWorld[id]||0)+'</strong></div>';}).join("")+'</div>'+
 '<p class="tiny">Progress is stored only on this device. No accounts, ads, tracking, or external links. Six animal mini-films and all instrument sounds are playable offline.</p></div>'+
 (release.id==="v1.5"?'<div class="parent-card"><h2>📌 Child’s Toy Box Favorites</h2><p>Pin your child’s favorite games so they appear directly on the front Playroom shelf for instant 1-tap replay without reading menus.</p><div class="switches">'+
  toyBoxStations.map(s=>'<button class="'+(pinnedGames.includes(s.key)?"selected":"")+'" data-action="togglePin" data-value="'+s.key+'">'+s.icon+' '+s.label+' '+(pinnedGames.includes(s.key)?"📌":"")+'</button>').join("")+
  '</div></div>':'')+
 '<div class="parent-card"><h2>🖼️ My child’s art gallery</h2>'+
 (restore("lww2_gallery",[]).length?'<div class="sketch-gallery">'+restore("lww2_gallery",[]).map(src=>'<img src="'+src+'" alt="Saved drawing"/>').join('')+'</div><button class="tiny-cta" data-action="sketchGalleryClear">Clear saved artwork</button>':'<p>Draw something in My Sketch Pad and tap Save my art to see it here.</p>')+'</div>'+
 (familyRelease?'<div class="parent-card family-manager"><h2>📷 My Family Album</h2><p>Only grown-ups can add family photos, names and roles. Photos stay on this device, with no account or upload. Ask permission before adding someone’s picture.</p>'+
 '<div class="family-form"><label for="familyName">Name</label><input id="familyName" type="text" maxlength="34" placeholder="e.g. Ravi" autocomplete="off" />'+
 '<label for="familyRole">Family role</label><select id="familyRole">'+["Grandpa","Grandma","Mom","Dad","Brother","Sister","Aunt","Uncle","Cousin","Baby","Guardian","Family Friend","Other"].map(r=>'<option value="'+r+'">'+r+'</option>').join('')+'</select>'+
 '<label for="familyFile">Choose a photo</label><input id="familyFile" type="file" accept="image/*"/><small id="familyPhotoStatus">No photo selected (choose an image).</small>'+
 '<button class="tiny-cta" data-action="familyAdd">+ Add family member</button></div>'+
 '<div class="family-managed-list">'+familyPeople.map(p=>'<div class="family-managed"><span class="mini-family-photo">'+familyPhoto(p)+'</span><strong>'+esc(p.role)+' '+esc(p.name)+'</strong><button class="tiny-cta" data-action="familyDelete" data-value="'+esc(p.id)+'">Remove</button></div>').join('')+'</div>'+
 '<p class="tiny">You can add up to 16 people. Removing a person deletes their saved photo. Clearing app data also deletes this album; the prototype has no backup or transfer feature.</p></div>':'')+
 '<div class="parent-card"><h2>⚙️ Parent controls</h2>'+
 '<div class="parent-buddy"><h3>🌟 Learning buddy</h3><p>Choose an original storybook character to guide your child with gentle spoken hints.</p>'+guidePicks()+'</div>'+
 '<div class="setting-line"><label>Spoken guidance</label>'+settingButtons("voice",[[true,"On"],[false,"Off"]])+'</div>'+
 '<div class="setting-line"><label>Gentle background music</label>'+settingButtons("music",[[true,"On"],[false,"Off"]])+'</div>'+
 '<div class="setting-line"><label>Sound effects & animal calls</label>'+settingButtons("fx",[[true,"On"],[false,"Off"]])+'</div>'+
 '<div class="setting-line"><label>Balloon motion</label>'+settingButtons("slow",[[true,"Gentle"],[false,"Normal"]])+'</div>'+
 '<div class="setting-line"><label>Reduce all animations</label>'+settingButtons("reduced",[[true,"On"],[false,"Off"]])+'</div>'+
 '<div class="setting-line"><label>Suggested daily sessions</label>'+settingButtons("goal",[[2,"2"],[4,"4"],[6,"6"]])+'</div>'+
 '<p class="tiny">Daily goal: '+daily+' of '+settings.goal+' suggested activities today. This is a suggestion, never a lockout.</p>'+
 '<div class="setting-line"><button class="tiny-cta" data-action="changeAge">Change child profile</button>'+
 '<button class="tiny-cta" data-action="resetConfirm">Reset progress</button></div></div></section>';
}
function beginMode(world,mode){
 stopVoice();clearTimeout(roundTimer);
 state.world=world;state.land=worlds[world].land;state.mode=mode;state.screen="game";state.round=0;state.locked=false;state.goal=5;state.peekabooOpen=false;
 const rKey=world+":"+mode;
 recentGames=[rKey,...recentGames.filter(k=>k!==rKey)].slice(0,4);
 persist("lww2_recent",recentGames);
 state.memory=null;state.paint={};state.paintUndo=[];state.color=palettes[0];state.traceLength=0;state.traceReady=false;

 // Path gating: Check if this mode is gated by the learning path
 if(typeof WonderPath!=='undefined'&& WonderPath.isGated(world,mode,stats)){
  const nextStep=WonderPath.getNextStep(stats);
  if(nextStep&&(nextStep.world!==world||nextStep.mode!==mode)){
   toast("Continue your learning path first!");
   state.screen="home";render();
   return;
  }
 }

 if(world==="family"){
  state.familyIndex=0;state.familyQuestion=null;state.goal=mode==="familyquiz"?5:0;
  state.question={voice:"Let's meet the people in your family!"};render();return;
 }
 if(world==="flashbook"){
  state.cardIndex=0;state.goal=0;state.question={voice:"Let's look at pictures and hear their names!"};render();return;
 }
 if(world==="body"&&mode==="doorstory"){
  state.goal=doorSteps.length;state.question={voice:"Knock, knock! What is the safe choice?"};render();
  playObjectSound("Knocking Door");setTimeout(()=>{if(state.screen==="game"&&state.mode==="doorstory")speak(doorSteps[0].text);},1750);return;
 }
 if(world==="coloring"&&mode==="sketch"){
  sketch={color:sketchColors[0],size:13,tool:"pen",snapshot:sketch.snapshot,history:[],strokes:0};
  state.goal=0;state.question={voice:"Choose a color and draw anything you imagine!"};render();return;
 }
 if(world==="animals"&&["flashcards","realfilms","objectcards"].includes(mode)){
  state.cardIndex=0;state.cardSoundsOnly=mode==="flashcards"&&!restoredRelease;
  state.cardFilter=restoredRelease?(mode==="realfilms"?"video":"all"):
   release.id==="v1.4"&&mode==="flashcards"?"video":mode==="flashcards"?"sounds":"all";
  state.goal=0;
  state.question={voice:"Let's explore pictures and sounds!"};render();return;
 }
 if(WonderEngines.isExtra(world)){if(world==="music"&&["piano","xylophone"].includes(mode))prepareWonderInstrument(mode);WonderEngines.start();return;}
 if(world==="memory"){
   state.memory=makeMemory();state.goal=state.memory.total;state.question={voice:"Find all the matching pairs!"};
 }else if(world==="tracing"){
   const all=traceDecks[mode];
   if(expandedRelease){
    const progress=restore("lww2_trace_progress",{}),offset=Number(progress[mode]||0)%all.length;
    state.traceDeck=[...all.slice(offset),...all.slice(0,offset)];state.goal=state.traceDeck.length;
   }else{state.traceDeck=shuffle(all).slice(0,3);state.goal=3;}
   state.question={voice:"Trace the shape with your finger. Follow the dotted letter."};
 }else if(world==="coloring"){
   state.goal=1;state.question={voice:"Choose a color and tap the picture to paint!"};
 }else if(world==="sorting")state.question=makeSorting();
 else if(world==="animals")state.question=makeAnimalQuestion();
 else if(world==="balloon")nextBalloon();
 render();
 delayNext(300,()=>{
  if(state.screen==="game") {
   if(state.world==="animals"&&["listen","safari","farm","tracks"].includes(state.mode))playPrompt();
   else speak(state.question.voice);
  }
 });
}
function advance(){
 if(state.round>=state.goal){
  if(release.id==="v1.5"&&["sorting","animals","balloon"].includes(state.world)){
   state.goal+=5;announce("Five more stars! Keep playing 🌟","good");
  }else{finishGame();return;}
 }
 state.locked=false;state.peekabooOpen=false;
 if(WonderEngines.isExtra(state.world)){WonderEngines.next();return;}
 if(state.world==="sorting")state.question=makeSorting();
 else if(state.world==="animals")state.question=makeAnimalQuestion();
 else if(state.world==="balloon")nextBalloon();
 else if(state.world==="tracing"){state.traceLength=0;state.traceReady=false;state.question={voice:"Trace the next letter!"};}
 render();
 delayNext(190,()=>{
  if(state.screen==="game"){
   if(state.world==="animals"&&["listen","safari","farm","tracks"].includes(state.mode))playPrompt();
   else speak(state.question?.voice||"Well done. Let's try another!");
  }
 });
}
function onAnswer(value,element){
 if(state.locked)return;
 const good=String(value)===String(state.question.correct);
 recordAttempt(good);
 if(!good){
  element.classList.add("wrong");
  announce("Try again, little star! 💛","oops");
  speak("Good try! Look carefully and try again.");
  delayNext(400,()=>element.classList.remove("wrong"));
  return;
 }
 state.locked=true;element.classList.add("correct");state.round++;
 if(state.world==="animals"&&state.question?.animal){
  announce(state.question.animal+"! 🐾","none");animalSound(state.question.animal);
  delayNext(1200,advance);return;
 }
 announce("Wonderful! ⭐","good");speak("Yes! Great job!");delayNext(670,advance);
}
function onBalloon(value,element){
 if(state.locked)return;
 if(value!==state.question.target){
  recordAttempt(false);
  announce("Find "+state.question.target+" 💛","oops");
  speak("Try to find "+state.question.target+".");
  return;
 }
 state.locked=true;element.classList.add("pop");
 recordAttempt(true);
 if(state.mode==="animals"){
  animalSound(value);state.round++;announce(value+"! 🐾","none");
  delayNext(1150,advance);return;
 }
 soundFX("pop");state.round++;announce("POP! ⭐","good");
 speak("Yay! You found "+value+".");delayNext(590,advance);
}
function flipMemory(id){
 const m=state.memory;if(!m||m.locked||state.locked)return;
 const c=m.cards.find(x=>x.id===id);
 if(!c||c.done||c.open)return;
 c.open=true;m.selected.push(id);soundFX("flip");
 if(m.selected.length===1){render();return;}
 m.moves++;m.locked=true;render();
 const [first,second]=m.selected.map(i=>m.cards.find(c=>c.id===i));
 if(first.item===second.item){
  recordAttempt(true);
  state.round++;first.done=true;second.done=true;m.pairs++;m.selected=[];m.locked=false;
  announce("A match! ⭐","good");speak("A perfect match!");
  delayNext(510,()=>m.pairs===m.total?finishGame():render());
 }else{
  recordAttempt(false);
  soundFX("oops");
  delayNext(720,()=>{first.open=false;second.open=false;m.selected=[];m.locked=false;render();});
 }
}
function nextTrace(skipped=false){
 if(state.locked)return;
 if(!state.traceReady&&!skipped)return;
 clearTimeout(traceAdvanceTimer);
 state.locked=true;state.round++;
 if(!skipped){soundFX("good");speak("Lovely tracing!");}
 else speak("Let's try the next one!");
 if(expandedRelease&&!skipped){
  const progress=restore("lww2_trace_progress",{}),len=traceDecks[state.mode]?.length||1;
  progress[state.mode]=((Number(progress[state.mode])||0)+1)%len;persist("lww2_trace_progress",progress);
 }
 if(!skipped)announce("Beautiful lines! ✨","none");
 delayNext(skipped?200:480,advance);
}
function paintShape(el){
 const key=el.getAttribute("data-paint");if(!key)return;
 const old=state.paint[key]||null;
 state.paintUndo.push({key,old});state.paint[key]=state.color;
 el.setAttribute("fill",state.color);soundFX("paint");
}
function colorReset(){
 if(state.paintUndo.length){
  const item=state.paintUndo.pop();if(item.old)state.paint[item.key]=item.old;else delete state.paint[item.key];
  render();
 }
}
function back(){
 clearTimeout(roundTimer);clearTimeout(traceAdvanceTimer);stopVoice();
 if(state.screen==="game"||state.screen==="complete"){state.screen="modes";state.locked=false;}
 else if(state.screen==="modes"){state.screen=release.landed?"land":"home";}
 else if(["land","parentGate","parent"].includes(state.screen)){state.screen="home";}
 else if(state.screen==="onboarding"&&profile){state.screen="home";}
 else{state.screen="home";}
 render();
}
window.wonderBack=back;
function toast(msg){
 $(".status-toast")?.remove();const e=document.createElement("div");e.className="status-toast";e.textContent=msg;$(".screen")?.appendChild(e);
 setTimeout(()=>e.remove(),2200);
}
document.addEventListener("change",event=>{
 if(event.target.id!=="familyFile"||state.screen!=="parent")return;
 const file=event.target.files?.[0],status=$("#familyPhotoStatus");pendingFamilyPhoto=null;
 if(!file)return;
 if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>10*1024*1024){
  if(status)status.textContent="Please use a JPEG, PNG or WebP image under 10 MB.";return;
 }
 const reader=new FileReader();
 reader.onload=()=>{
  const image=new Image();
  image.onload=()=>{
   const canvas=document.createElement("canvas"),ratio=Math.min(1,320/Math.max(image.width,image.height));
   canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));
   const ctx=canvas.getContext("2d");ctx.drawImage(image,0,0,canvas.width,canvas.height);
   pendingFamilyPhoto=canvas.toDataURL("image/jpeg",.72);
   if(status)status.textContent="Photo ready! Tap Add family member.";
  };
  image.onerror=()=>{if(status)status.textContent="Could not read this image.";};
  image.src=String(reader.result);
 };
 reader.onerror=()=>{if(status)status.textContent="Could not open the photo.";};
 reader.readAsDataURL(file);
});
document.addEventListener("click",event=>{
 // The vector coloring book is directly tappable, with no toolbar selection step after choosing a color.
 const paint=event.target.closest("[data-paint]");
 if(paint&&state.screen==="game"&&state.world==="coloring"){paintShape(paint);return;}
 const el=event.target.closest("[data-action]");if(!el)return;
 const action=el.dataset.action,value=el.dataset.value,key=el.dataset.key;
 initAudio();
 switch(action){
 case "adventureStart":{
  const [w,m]=nextGuidedAdventure();
  beginMode(w,m);
  break;
 }
 case "quickPlay":{
  const [w,m]=String(value).split(":");
  if(worlds[w]){
   const targetMode=worlds[w].modes.some(x=>x[0]===m)?m:worlds[w].modes[0][0];
   beginMode(w,targetMode);
  }
  break;
 }
 case "togglePin":{
  const k=String(value);
  if(pinnedGames.includes(k)){
   pinnedGames=pinnedGames.filter(x=>x!==k);
   toast("Removed from Toy Box shelf");
  }else{
   pinnedGames=[k,...pinnedGames].slice(0,6);
   toast("Pinned to Child's Toy Box! 📌");
  }
  persist("lww2_pinned",pinnedGames);
  render();
  break;
 }
 case "peekabooReveal":{
  state.peekabooOpen=true;
  soundFX("pop");
  render();
  animalSound(state.question?.animal||"Cow");
  break;
 }
 case "widePrev":{const n=(flashcardCatalog[state.mode]||[]).length;state.cardIndex=(state.cardIndex-1+n)%n;render();hearWideCard();break;}
 case "wideNext":{const n=(flashcardCatalog[state.mode]||[]).length;state.cardIndex=(state.cardIndex+1)%n;render();hearWideCard();break;}
 case "wideHear":hearWideCard();break;
 case "familyPrev":state.familyIndex=(state.familyIndex-1+familyPeople.length)%familyPeople.length;render();speak(familyPeople[state.familyIndex].role+" "+familyPeople[state.familyIndex].name);break;
 case "familyNext":state.familyIndex=(state.familyIndex+1)%familyPeople.length;render();speak(familyPeople[state.familyIndex].role+" "+familyPeople[state.familyIndex].name);break;
 case "familySpeak":{const p=familyPeople[state.familyIndex||0];if(p)speak("This is my "+p.role+", "+p.name);break;}
 case "familyGuess":{
  const correct=value===state.familyQuestion?.target?.id;
  recordAttempt(correct);
  if(!correct){announce("Let's look again. You can do it! 💗","oops");break;}
  const p=state.familyQuestion.target;state.round++;
  soundFX("good");speak("Yes! That's "+p.role+" "+p.name+"!");
  if(state.round>=state.goal){state.locked=true;delayNext(850,finishGame);}else{makeFamilyQuestion();render();}
  break;
 }
 case "doorChoose":{
  const step=doorSteps[state.round];const correct=value===step?.correct;
  recordAttempt(correct);
  if(!correct){announce("Let's keep the door closed and ask a grown-up. 💗","none");speak("A grown-up can check. We keep the door closed.");break;}
  state.round++;soundFX("good");
  if(state.round>=doorSteps.length){state.locked=true;delayNext(950,finishGame);speak("Well done! Ask a grown-up before opening the door.");}
  else {render();speak(doorSteps[state.round].text);}
  break;
 }
 case "familyAdd":{
  if(state.screen!=="parent")break;
  const name=($("#familyName")?.value||"").trim().slice(0,34),role=$("#familyRole")?.value;
  if(!name){toast("Enter a family member's name.");break;}
  if(!role||!["Grandpa","Grandma","Mom","Dad","Brother","Sister","Aunt","Uncle","Cousin","Baby","Guardian","Family Friend","Other"].includes(role)){toast("Choose a family role.");break;}
  if(!pendingFamilyPhoto){toast("Choose a family photo first.");break;}
  if(familyPeople.length>=16){toast("The album is full (16 people).");break;}
  const candidate={id:"p"+Date.now()+rand(1000),name,role,photo:pendingFamilyPhoto};
  try{localStorage.setItem("lww3_family",JSON.stringify([...familyPeople,candidate]));familyPeople.push(candidate);pendingFamilyPhoto=null;render();toast("Photo saved on this device! 💗");}
  catch(e){toast("Not enough device storage. Try a smaller photo.");}
  break;
 }
 case "familyDelete":{
  if(state.screen!=="parent")break;
  const p=familyPeople.find(p=>p.id===value);
  if(p&&window.confirm("Remove "+p.name+" and their photo from this device?")){
   familyPeople=familyPeople.filter(p=>p.id!==value);persist("lww3_family",familyPeople);render();
  }
  break;
 }
 case "cardFilter":state.cardFilter=value;state.cardSoundsOnly=value==="sounds";state.cardIndex=0;render();hearCard();break;
 case "openRealFilms":beginMode("animals","realfilms");break;
 case "openAnimalAtlas":beginMode("animals","flashcards");break;
 case "viewFilm":{
  beginMode("animals","realfilms");
  const ix=cardCollection().findIndex(c=>c.name===value);
  if(ix>=0){state.cardIndex=ix;render();}
  break;
 }
 case "cardPrev":{const n=cardCollection().length;state.cardIndex=(state.cardIndex-1+n)%n;render();hearCard();break;}
 case "cardNext":{const n=cardCollection().length;state.cardIndex=(state.cardIndex+1)%n;render();hearCard();break;}
 case "cardHear":hearCard();break;
 case "sketchColor":sketch.snapshot=sketchCurrent();sketch.color=value;sketch.tool="pen";render();break;
 case "sketchSize":sketch.snapshot=sketchCurrent();sketch.size=Number(value);render();break;
 case "sketchTool":sketch.snapshot=sketchCurrent();sketch.tool=value;render();break;
 case "sketchUndo":sketch.snapshot=sketch.history.pop()||sketchCurrent();render();break;
 case "sketchClear":sketch.history.push(sketchCurrent());sketch.snapshot=null;render();break;
 case "sketchSave":sketchSave();break;
 case "sketchGalleryClear":if(window.confirm("Remove the saved artwork on this device?")){persist("lww2_gallery",[]);render();}break;
 case "guidePick":if(guides[value]){guideId=value;persist("lww2_guide",guideId);render();speak(guides[guideId].intro);}break;
 case "guideSpeak":speak(guideHint());break;
 case "age":state.age=value;render();break;
 case "avatar":state.avatar=value;render();break;
 case "enter":{
  const currentChild=getCurrentChild();
  if(!state.currentChildId||profiles.length===0){
   const newChild = addChild(state.name||"My Explorer", state.age||"4-5", state.avatar||"🐻", state.color||"#FFB000");
   if(newChild){state.currentChildId=newChild.id;profiles=loadProfiles();}
  }else if(state.editChildId===state.currentChildId){
   updateChild(state.currentChildId,{age:state.age,avatar:state.avatar,name:state.name||currentChild.name,color:state.color||currentChild.color});
  }
  if(state.currentChildId){
   const childStats=getChildStats(state.currentChildId);
   if(!childStats.total){const freshStats={total:0,byWorld:{},byMode:{},daily:{},pathProgress:0,attempts:0,correct:0};saveChildStats(state.currentChildId,freshStats);stats=freshStats;}
   else stats=childStats;
   const childSettings=getChildSettings(state.currentChildId);
   settings={...settingsDefault,...childSettings};
   curChild=getCurrentChild();
  }
  state.screen="home";state.editChildId=null;render();speak("Welcome to Little Wonder World. Pick a game!");
  break;
 }
 case "land":state.land=value;state.screen="land";render();speak("Pick a world to explore!");break;
 case "world":state.world=value;state.modePage=0;state.screen="modes";render();speak("Choose an adventure!");break;
 case "modePrev":state.modePage=Math.max(0,(state.modePage||0)-1);render();break;
 case "modeNext":state.modePage=Math.min(Math.ceil(worlds[state.world].modes.length/9)-1,(state.modePage||0)+1);render();break;
 case "mode":beginMode(state.world,value);break;
 case "surprise":{
  const w=pick(visibleWorldIds),m=pick(worlds[w].modes);beginMode(w,m[0]);break;
 }
 case "home":state.screen="home";render();break;
 case "back":back();break;
 case "voice":settings.voice=!settings.voice;persist("lww2_settings",settings);if(!settings.voice)stopVoice();render();break;
 case "repeat":
  if(state.mode==="doorstory"){playObjectSound("Knocking Door");speak(doorSteps[Math.min(state.round,doorSteps.length-1)].text);}
  else if(state.world==="family")speak("Meet the people in your family.");
  else if(state.world==="flashbook")hearWideCard();
  else if(state.world==="animals"&&["flashcards","realfilms","objectcards"].includes(state.mode))hearCard();
  else if(WonderEngines.isExtra(state.world))speak(WonderEngines.instruction());
  else if(state.world==="memory")speak("Find the matching pairs!");
  else if(state.world==="tracing")speak("Use your finger to trace!");
  else if(state.world==="coloring")speak("Choose a color. Tap the picture!");
  else playPrompt();
  break;
 case "answer":onAnswer(value,el);break;
 case "engine":WonderEngines.handle(value,el);break;
 case "buildPlace":WonderEngines.placeBuild(event);break;
 case "animalSound":animalSound(state.question.animal||"Cow");break;
 case "animalVideo":{const video=el.parentElement?.querySelector("video");if(video){video.currentTime=0;video.play()?.catch?.(()=>{});}break;}
 case "flip":flipMemory(Number(value));break;
 case "clearTrace":clearTimeout(traceAdvanceTimer);state.traceLength=0;state.traceReady=false;render();speak("Let's trace again!");break;
 case "traceDemo":if(liveTrace?.demo){speak("Watch the pencil, then follow the green dots!");liveTrace.demo();}break;
 case "nextTrace":nextTrace();break;
 case "skipTrace":nextTrace(true);break;
 case "color":state.color=value;render();break;
 case "undoPaint":colorReset();break;
 case "finishPaint":
  if(Object.keys(state.paint).length<3){toast("Color 3 parts first! 🎨");speak("Let's color a little more!");break;}
  state.round=state.goal;finishGame();break;
 case "pop":onBalloon(value,el);break;
 case "again":beginMode(state.world,state.mode);break;
 case "nextMode":{
  const modes=worlds[state.world].modes,idx=modes.findIndex(m=>m[0]===state.mode);
  beginMode(state.world,modes[(idx+1)%modes.length][0]);break;
 }
 case "parentGate":makeGate();state.screen="parentGate";render();break;
 case "gate":if(Number(value)===state.gate?.correct){state.screen="parent";render();}else{toast("Please ask a grown-up 💛");soundFX("oops");}break;
 case "setting":{
  let v=value;if(value==="true")v=true;if(value==="false")v=false;if(key==="goal")v=Number(value);
  if(Object.prototype.hasOwnProperty.call(settings,key)){settings[key]=v;persist("lww2_settings",settings);render();}
  break;
 }
 case "changeAge":{
  const curChild=getCurrentChild();
  if(!curChild){toast("No child profile to edit");break;}
  state.name=curChild.name||"";
  state.age=curChild.age||"4-5";
  state.avatar=curChild.avatar||"🐻";
  state.color=curChild.color||"#FFB000";
  state.editChildId=state.currentChildId;
  state.screen="onboarding";
  speak("Let's update your profile!");
  render();
  break;
 }
 case "pathNext":{
  if(typeof WonderPath==='undefined'){toast("Path not loaded");break;}
  const next=WonderPath.getNextStep(stats);
  if(!next){toast("Path complete! Explore other worlds");break;}
  const result=awaitPathStep(next);
  if(result){beginMode(next.world,next.mode);speak("Let's start "+next.biome+"!");}
  break;
 }
 case "pathJump":{
  if(typeof WonderPath==='undefined'){toast("Path not loaded");break;}
  const stepIndex=Number(value)||0;
  const targetStep=stepIndex>=0&&stepIndex<WonderPath.getTotalSteps()? WonderPath.learningPath[stepIndex]:null;
  if(!targetStep){toast("Invalid path step");break;}
  // Check if this step is unlocked (either first step or previous step completed)
  const currentProgress=getPathProgress();
  if(stepIndex>0&&stepIndex>currentProgress){
   toast("Continue the path from where you left off!");
   break;
  }
  beginMode(targetStep.world,targetStep.mode);
  speak("Welcome to "+targetStep.biome+"!");
  break;
 }
 case "shop":{
  state.screen="shop";
  render();
  break;
 }
 case "childPicker":{
  if(state.screen!=="home"){toast("Not available here");break;}
  if(profiles.length===0){state.screen="onboarding";render();break;}
  const pickerHtml='<div class="child-picker-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000"><div class="picker-content" style="background:#fff;padding:20px;border-radius:12px;max-width:90%;text-align:center"><button class="tiny-cta" data-action="childPickerClose" style="position:absolute;top:10px;right:10px">✕</button><h2>Switch Child</h2><div class="child-list">'+profiles.map(p=>'<button class="bubble-btn" style="display:block;margin:5px 0" data-action="selectChild" data-value="'+p.id+'"><span style="font-size:1.5em">'+p.avatar+'</span> <span>'+esc(p.name||"Child")+'</span></button>').join('')+'</div><button class="tiny-cta" data-action="showAddChild">＋ Add child (max 3)</button></div></div>';
  $("#app").insertAdjacentHTML("beforeend",pickerHtml);
  break;
 }
 case "childPickerClose":{
  const modal=$(".child-picker-modal");
  if(modal)modal.remove();
  break;
 }
 case "selectChild":{
  const selectedId=value;
  const idx=profiles.findIndex(p=>p.id===selectedId);
  if(idx>=0){
   state.currentChildId=selectedId;currentChildId=selectedId;curChild=getCurrentChild();
   state.name=curChild?.name||"My Explorer";state.age=curChild?.age||"4-5";state.avatar=curChild?.avatar||"🐻";state.color=curChild?.color||"#FFB000";
   const childSettings=getChildSettings(selectedId);
   settings={...settingsDefault,...childSettings};
   const childStats=getChildStats(selectedId);
   stats=childStats;
   state.screen="home";state.editChildId=null;
   const modal=$(".child-picker-modal");if(modal)modal.remove();
   toast("Switched to "+(curChild?.name||"child"));
   render();
  }
  break;
 }
 case "showAddChild":{
  const modal=$(".child-picker-modal");
  if(modal){
   modal.innerHTML='<div class="picker-content" style="background:#fff;padding:20px;border-radius:12px;max-width:90%;text-align:center"><button class="tiny-cta" data-action="childPickerClose" style="position:absolute;top:10px;right:10px">✕</button><h2>Add New Child</h2><p>Name:</p><input type="text" id="newChildName" maxlength="20" placeholder="e.g. Maya"/><p>Age:</p><div class="choice-row">'+["2-3","4-5","5-6"].map(a=>'<button class="pick '+(a===state.age?"selected":"")+'" data-action="age" data-value="'+a+'">'+a+'</button>').join('')+'</div><p>Avatar:</p><div class="choice-row">'+["🐻","🐰","🦁","🐼","🐨","🐶","🐱","🐭","🐹","🐺","🦊"].map(a=>'<button class="pick '+(state.avatar===a?"selected":"")+'" data-action="avatar" data-value="'+a+'">'+a+'</button>').join('')+'</div><p>Color:</p><div class="choice-row">'+["#FFB000","#FF6B6B","#4ECDC4","#95E1D3","#FCE38E","#F38BA8","#7C3AED"].map(c=>'<button class="pick '+(state.color===c?"selected":"")+'" style="background:'+c+'" data-action="color" data-value="'+c+'"></button>').join('')+'</div><button class="big-primary" data-action="addItem">Create Child ✅</button></div>';
   $("#app").prepend(modal);
  }
  break;
 }
 case "addItem":{
  const name=($("#newChildName")?.value||"").trim().slice(0,20)||"My Explorer";
  const age=state.age||"4-5";
  const avatar=state.avatar||"🐻";
  const color=state.color||"#FFB000";
  const newChild = addChild(name,age,avatar,color);
  if(newChild){
   state.currentChildId=newChild.id;currentChildId=newChild.id;curChild=newChild;profiles=loadProfiles();
   const childStats={total:0,byWorld:{},byMode:{},daily:{},pathProgress:0,attempts:0,correct:0};
   saveChildStats(newChild.id,childStats);
   saveChildSettings(newChild.id,{});
   settings={...settingsDefault,...getChildSettings(newChild.id)};stats=childStats;
   const modal=$(".child-picker-modal");if(modal)modal.remove();
   state.screen="home";state.editChildId=null;
   toast("Welcome, "+name+"!");
   render();
  }else{toast("Maximum 3 children allowed");}
  break;
 }
 case "buyItem":{
  const cat=el.dataset.cat;
  const id=el.dataset.id;
  const cost=Number(el.dataset.cost);
  if(!WonderShop)break;
  const item=WonderShop.getItem(cat,id);
  if(!item)break;
  if((stats.tickets||0)<cost){toast("Not enough tickets! Keep playing to earn more 🎫");soundFX("oops");break;}
  if((stats.purchases||[]).includes(item.id)){toast("Already unlocked!");break;}
  stats.tickets-=cost;
  stats.purchases=(stats.purchases||[]);
  stats.purchases.push(item.id);
  stats.equipped=stats.equipped||{};
  stats.equipped[cat]=item.id; // auto-equip on purchase
  persist("lww2_stats",stats);
  render();
  soundFX("win");
  toast("Purchased "+item.name+"! 🎉");
  speak("You got a new "+item.name+"!");
  break;
 }
 case "equipItem":{
  const cat=el.dataset.cat;
  const id=el.dataset.id;
  if(!WonderShop)break;
  const item=WonderShop.getItem(cat,id);
  if(!item)break;
  stats.equipped=stats.equipped||{};
  stats.equipped[cat]=item.id;
  persist("lww2_stats",stats);
  render();
  soundFX("good");
  toast(item.name+" equipped!");
  speak(item.name+" is now equipped!");
  break;
 }
 case "resetConfirm":
  if(window.confirm("Reset all learning progress on this device?")){
   stats={total:0,byWorld:{},byMode:{},daily:{},attempts:0,correct:0,byModeAccuracy:{}};persist("lww2_stats",stats);render();
  }break;
 }
});
document.addEventListener("contextmenu",event=>event.preventDefault());

// Dynamically load path.js if available (for the learning path feature)
if(typeof window.WonderPath==='undefined'){
 try{
  const script=document.createElement("script");
  script.src="path.js";
  document.head.appendChild(script);
 }catch(e){}
}
render();
