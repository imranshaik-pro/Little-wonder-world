/* Original Little Wonder World curriculum catalogue.
 * Activity configurations are not equivalent to independent game engines.
 * Each child screen displays at most nine activities, paginated without scrolling.
 */
window.WonderContent=(function(){
const lands=[
 {id:"foundations",name:"Learning Land",icon:"📚",color:"#e0e9ff",hint:"Letters, stories and numbers"},
 {id:"thinking",name:"Thinking Forest",icon:"🧠",color:"#eee0ff",hint:"Memory, sorting and puzzles"},
 {id:"discovery",name:"Discovery Island",icon:"🌿",color:"#d9f5e1",hint:"Animals, science and vehicles"},
 {id:"creative",name:"Creative Garden",icon:"🎨",color:"#ffe2ed",hint:"Make, imagine and create"},
 {id:"wellbeing",name:"Little Life Town",icon:"❤️",color:"#ffebd7",hint:"Feelings, health and life skills"},
 {id:"funfair",name:"Adventure Funfair",icon:"🎡",color:"#fff0be",hint:"Playful learning adventures"}
];
const worlds={
 // Immersive Play Zones (free exploration worlds)
 pettown:{name:"Pettown",short:"Pettown",icon:"🐾",land:"wellbeing",color:"#ffe5da",modes:[
  ["pet_vet","Pet Vet","🐶","pretend"],["pet_bath","Bath Time","🛁","pretend"],["pet_feed","Feed Pets","🍽️","pretend"],["pet_play","Playtime","🎾","pretend"]]},
 safari:{name:"Safari",short:"Safari",icon:"🦁",land:"discovery",color:"#d4f0e0",modes:[
  ["safari_animals","Safari Animals","🦓","animals"],["safari_sounds","Animal Sounds","👂","animals"],["safari_tracks","Track Prints","🐾","animals"],["safari_habitat","Animal Homes","🏡","animals"]]},
 hamster:{name:"Hamster Maze",short:"Maze",icon:"🐹",land:"thinking",color:"#e1dafc",modes:[
  ["maze_collect","Collect Seeds","🌱","tap"],["maze_nest","Build Nest","🏠","tap"],["maze_escape","Escape Maze","🧩","tap"]]},
 aquarium:{name:"Aquarium",short:"Aquarium",icon:"🐠",land:"creative",color:"#c9eff8",modes:[
  ["fish_collect","Collect Fish","🐠","tap"],["coral_grow","Grow Coral","🌸","tap"],["treasure_hunt","Treasure Hunt","💎","tap"]]},
 alphabet:{name:"Alphabet & Phonics",short:"Phonics",icon:"🔤",land:"foundations",color:"#e0e9ff",modes:[
  ["letterhunt","Letter Hunt","🔠","quiz"],["firstsound","First Sounds","🍎","quiz"],["lowercase","Little Letters","🔡","quiz"],
  ["rhyme","Rhyme Time","🎶","quiz"],["missing","Missing ABC","❓","sequence"],["lettertrain","Letter Train","🚂","sequence"],
  ["wordstart","Word Starts","📖","quiz"],["soundgame","Sound Explorer","🔊","quiz"]]},
 numbers:{name:"Numbers & Math",short:"Numbers",icon:"🔢",land:"foundations",color:"#fff0c5",modes:[
  ["count","Count the Stars","⭐","count"],["apples","Count Apples","🍎","count"],["numberhunt","Number Hunt","🔎","quiz"],
  ["add","Add Together","➕","count"],["order","Number Train","🚂","sequence"],["moreless","More or Less","⚖️","quiz"],
  ["countfish","Count Fish","🐟","count"],["skip","Number Steps","🐾","sequence"]]},
 stories:{name:"Read-aloud Stories",short:"Stories",icon:"📚",land:"foundations",color:"#fce2de",modes:[
  ["bear","Bunny's New Friend","🐰","story"],["star","The Lost Star","⭐","story"],["garden","Milo's Garden","🌻","story"],
  ["sea","Ocean Adventure","🐙","story"],["friendship","Kindness Day","💗","story"],["bedtime","Sleepy Moon","🌙","story"],
  ["storyorder","Story Pictures","🖼️","sequence"],["firstwords","Picture Words","📝","quiz"]]},
 puzzles:{name:"Puzzles & Logic",short:"Puzzles",icon:"🧩",land:"thinking",color:"#f1e2ff",modes:[
  ["jigsaw","Happy Jigsaw","🧩","puzzle"],["shadows","Shadow Puzzle","🌘","quiz"],["animalpiece","Animal Pieces","🦊","puzzle"],
  ["missingpiece","Missing Piece","❓","quiz"],["picturepuzzle","Picture Puzzle","🖼️","puzzle"],["odd","Odd One Out","🔎","quiz"],
  ["sizeorder","Size Tower","📏","sequence"],["shapeorder","Shape Train","🚂","sequence"]]},
 music:{name:"Music & Rhythm",short:"Music",icon:"🎵",land:"creative",color:"#ffdfef",modes:[
  ["piano","Little Piano","🎹","music"],["drums","Happy Drums","🥁","music"],["xylophone","Xylophone","🎶","music"],
  ["echo","Echo the Beat","👏","music"],["birdsong","Bird Orchestra","🐦","music"],["bells","Magic Bells","🔔","music"],
  ["instruments","Instruments","🎺","quiz"],["highlow","High & Low","⬆️","quiz"]]},
 transport:{name:"Vehicles & Helpers",short:"Vehicles",icon:"🚂",land:"discovery",color:"#d7effb",modes:[
  ["vehicles","Vehicle Hunt","🚗","quiz"],["travel","Land, Air or Sea","🛩️","quiz"],["traffic","Traffic Lights","🚦","sequence"],
  ["rescue","Community Helpers","🚒","quiz"],["garage","Build a Garage","🏗️","build"],["shapes","Vehicle Puzzle","🧩","puzzle"],
  ["sounds","Vehicle Sounds","🚂","quiz"],["delivery","Delivery Route","📦","sequence"]]},
 coding:{name:"Early Coding",short:"Coding",icon:"🤖",land:"thinking",color:"#dbe6ff",modes:[
  ["robot","Robot Rescue","🤖","coding"],["maze","Find the Path","🧭","coding"],["arrows","Arrow Train","➡️","coding"],
  ["gardenbot","Garden Robot","🌷","coding"],["spacebot","Space Robot","🚀","coding"],["order","Coding Steps","🔢","sequence"],
  ["patterns","Code Patterns","🟠","sequence"],["direction","Directions","⬅️","quiz"]]},
 nature:{name:"Plants & Nature",short:"Nature",icon:"🌱",land:"discovery",color:"#d3f1d7",modes:[
  ["flowers","Flower Hunt","🌸","quiz"],["grow","Grow a Seed","🌰","sequence"],["bugs","Little Insects","🐞","quiz"],
  ["trees","Tree Friends","🌳","quiz"],["seasons","Four Seasons","🍁","quiz"],["garden","My Garden","🪴","build"],
  ["life","Butterfly Life","🦋","sequence"],["gardenbuild","Garden Designer","🌷","build"]]},
 science:{name:"Science & Space",short:"Science",icon:"🔭",land:"discovery",color:"#e0e7ff",modes:[
  ["weather","Weather Watch","🌦️","quiz"],["daynight","Day and Night","🌞","quiz"],["planets","Planet Friends","🪐","quiz"],
  ["sinkfloat","Float or Sink?","🛶","quiz"],["dino","Dinosaur Facts","🦕","quiz"],["lifecycle","Nature Cycle","🌱","sequence"],
  ["solarsystem","Planet Order","☀️","sequence"],["stars","Space Puzzle","🌟","puzzle"]]},
 pretend:{name:"Pretend Play",short:"Pretend",icon:"🎭",land:"creative",color:"#ffe5da",modes:[
  ["doctor","Little Doctor","🩺","pretend"],["bakery","Busy Bakery","🧁","pretend"],["firefighter","Fire Rescue","🚒","pretend"],
  ["vet","Animal Doctor","🐱","pretend"],["shop","Mini Market","🛒","pretend"],["teacher","Classroom","📚","pretend"],
  ["astronaut","Space Mission","🚀","pretend"],["farmer","Happy Farm","🚜","pretend"]]},
 emotions:{name:"Feelings & Friendship",short:"Feelings",icon:"🥰",land:"wellbeing",color:"#fce5f0",modes:[
  ["faces","Feeling Faces","😊","quiz"],["kindness","Be a Kind Friend","💞","story"],["breathe","Calm Breathing","🌬️","movement"],
  ["expressions","Name That Feeling","😮","quiz"],["sharing","Sharing Stories","🧸","story"],["comfort","Helping Others","🤗","quiz"],
  ["friendship","Friendship Choices","🤝","quiz"],["relax","Quiet Time","🌻","movement"]]},
 life:{name:"Everyday Skills",short:"Life Skills",icon:"🪥",land:"wellbeing",color:"#fcead8",modes:[
  ["hands","Wash Your Hands","🫧","sequence"],["teeth","Brush Your Teeth","🪥","sequence"],["dressing","Get Dressed","👕","pretend"],
  ["tidy","Tidy Up","🧺","pretend"],["routine","Morning Routine","☀️","sequence"],["healthyfood","Good Food","🥦","quiz"],
  ["recycle","Recycle Right","♻️","quiz"],["manners","Kind Words","💬","sequence"]]},
 building:{name:"Building & Design",short:"Building",icon:"🏗️",land:"creative",color:"#fff0d8",modes:[
  ["tower","Block Tower","🧱","build"],["bridge","River Bridge","🌉","build"],["house","Cozy Home","🏠","build"],
  ["roads","Road Builder","🛣️","build"],["castle","Magic Castle","🏰","build"],["garden","Garden Builder","🌳","build"],
  ["train","Train Tracks","🚂","build"],["rocket","Space Rocket","🚀","build"]]},
 body:{name:"Body & Safety",short:"Body & Safety",icon:"🫀",land:"wellbeing",color:"#ffe5de",modes:[
  ["parts","Body Parts","🖐️","quiz"],["senses","Five Senses","👃","quiz"],["food","Healthy Choices","🥕","quiz"],
  ["crossing","Cross Safely","🚸","sequence"],["teeth","Dental Care","🦷","sequence"],["time","Time of Day","🕒","quiz"],
  ["helpers","Who Can Help?","👩‍⚕️","quiz"],["safe","Safe Choices","🛟","quiz"]]},
 movement:{name:"Movement & Mindfulness",short:"Movement",icon:"🧘",land:"wellbeing",color:"#e7f3d9",modes:[
  ["yoga","Animal Yoga","🧘","movement"],["breathe","Star Breathing","⭐","movement"],["dance","Happy Dance","💃","movement"],
  ["stretch","Reach & Stretch","🙆","movement"],["balance","Balance Game","🦩","movement"],["animalmoves","Move Like Animals","🐸","movement"],
  ["jump","Counting Jumps","🦘","movement"],["sleep","Bedtime Calm","🌙","movement"]]},
 arcade:{name:"Wonder Mini Arcade",short:"Arcade",icon:"🫧",land:"funfair",color:"#d8eaff",modes:[
  ["bubbles","Bubble Catch","🫧","tap"],["fishing","Happy Fishing","🎣","tap"],["stars","Catch the Stars","🌟","tap"],
  ["treasure","Treasure Hunt","💎","quiz"],["maze","Tiny Maze","🏁","coding"],["butterflies","Butterfly Catch","🦋","tap"],
  ["picture","Picture Pieces","🧩","puzzle"],["hidden","Hidden Objects","🔍","quiz"]]},
 festivals:{name:"Festivals & Seasons",short:"Festivals",icon:"🎉",land:"funfair",color:"#fce6f8",modes:[
  ["spring","Spring Story","🌼","story"],["winter","Winter Time","⛄","quiz"],["summer","Sunny Days","🏖️","quiz"],
  ["decor","Decorate a Party","🎊","build"],["gifts","Gift Workshop","🎁","build"],["music","Festival Music","🥁","music"],
  ["kindness","Celebrations Together","🤗","story"],["seasons","Season Train","🍂","sequence"]]},
 cooking:{name:"Little Chef",short:"Little Chef",icon:"👩‍🍳",land:"funfair",color:"#ffebd6",modes:[
  ["salad","Fruit Salad","🥗","pretend"],["pizza","Pizza Kitchen","🍕","pretend"],["veggies","Find Vegetables","🥕","quiz"],
  ["bake","Bake a Cake","🎂","pretend"],["soup","Happy Soup","🥣","pretend"],["breakfast","Breakfast Time","🍞","pretend"],
  ["foodgroup","Food Groups","🍇","quiz"],["kitchen","Build a Kitchen","🍳","build"]]}
};
// Every existing activity stays in its original world; this adds a separate
// browseable shelf of thirty original, rhyme-inspired picture-story activities.
const rhymeTitles=[
 ["Baa Baa Black Sheep","🐑"],["Old MacDonald Had a Farm","🚜"],["Five Little Ducks","🦆"],
 ["Five Little Monkeys","🐵"],["Hickory Dickory Dock","🐭"],["The Itsy Bitsy Spider","🕷️"],
 ["Twinkle Twinkle Little Star","⭐"],["Hush Little Baby","🌙"],["Rock-a-bye Baby","🧸"],
 ["Star Light, Star Bright","🌟"],["Are You Sleeping?","😴"],["Hey Diddle Diddle","🐱"],
 ["One, Two, Buckle My Shoe","👟"],["Ten in the Bed","🛏️"],["This Old Man","🎵"],
 ["Five Little Speckled Frogs","🐸"],["The Ants Go Marching","🐜"],["Once I Caught a Fish Alive","🐟"],
 ["Head, Shoulders, Knees and Toes","🙆"],["If You're Happy and You Know It","👏"],
 ["The Wheels on the Bus","🚌"],["Ring Around the Rosie","🌹"],["Teddy Bear, Teddy Bear","🧸"],
 ["Open, Shut Them","👐"],["Row, Row, Row Your Boat","🚣"],["Mary Had a Little Lamb","🐑"],
 ["Humpty Dumpty","🥚"],["Jack and Jill","🪣"],["The Muffin Man","🧁"],["I'm a Little Teapot","🫖"]
];
worlds.rhymebook={name:"Rhyme & Storytime",short:"Rhyme & Storytime",icon:"📖",land:"foundations",color:"#ffe4c7",
 modes:rhymeTitles.map((r,i)=>["rhyme"+String(i+1).padStart(2,"0"),r[0],r[1],"story"])};
const letterPairs=[["A","Apple","🍎"],["B","Ball","⚽"],["C","Cat","🐱"],["D","Dog","🐶"],["E","Elephant","🐘"],["F","Fish","🐠"],
 ["G","Grapes","🍇"],["H","Hat","🎩"],["I","Ice cream","🍦"],["J","Jam","🫙"],["K","Kite","🪁"],["L","Lion","🦁"],
 ["M","Moon","🌙"],["N","Nest","🪺"],["O","Orange","🍊"],["P","Pig","🐷"],["Q","Queen","👑"],["R","Rabbit","🐰"],
 ["S","Sun","☀️"],["T","Tree","🌳"],["U","Umbrella","☂️"],["V","Van","🚐"],["W","Whale","🐳"],["X","Xylophone","🎼"],
 ["Y","Yarn","🧶"],["Z","Zebra","🦓"]];
const things={
 animals:[["Cow","🐮"],["Dog","🐶"],["Cat","🐱"],["Duck","🦆"],["Sheep","🐑"],["Lion","🦁"],["Bird","🐦"],["Elephant","🐘"]],
 vehicles:[["Car","🚗"],["Train","🚂"],["Plane","✈️"],["Boat","⛵"],["Bicycle","🚲"],["Fire engine","🚒"],["Bus","🚌"],["Tractor","🚜"]],
 fruits:[["Apple","🍎"],["Banana","🍌"],["Grapes","🍇"],["Mango","🥭"],["Watermelon","🍉"],["Strawberry","🍓"]],
 nature:[["Flower","🌸"],["Tree","🌳"],["Bee","🐝"],["Butterfly","🦋"],["Leaf","🍃"],["Sun","☀️"],["Rain","🌧️"],["Seed","🌰"]],
 science:[["Sun","☀️"],["Moon","🌙"],["Star","⭐"],["Planet","🪐"],["Rocket","🚀"],["Cloud","☁️"],["Rainbow","🌈"],["Dinosaur","🦕"]],
 helpers:[["Doctor","👩‍⚕️"],["Firefighter","🧑‍🚒"],["Teacher","👩‍🏫"],["Farmer","👩‍🌾"],["Chef","👩‍🍳"],["Pilot","🧑‍✈️"]],
 feelings:[["Happy","😊"],["Sad","😢"],["Angry","😠"],["Surprised","😮"],["Sleepy","😴"],["Calm","😌"],["Excited","🤩"]],
 body:[["Eye","👁️"],["Ear","👂"],["Nose","👃"],["Hand","✋"],["Foot","🦶"],["Tooth","🦷"],["Heart","❤️"]],
 food:[["Carrot","🥕"],["Broccoli","🥦"],["Apple","🍎"],["Rice","🍚"],["Bread","🍞"],["Egg","🥚"],["Corn","🌽"]],
 instruments:[["Drum","🥁"],["Piano","🎹"],["Guitar","🎸"],["Trumpet","🎺"],["Bell","🔔"],["Violin","🎻"]]
};
const sequenceSets={
 "numbers.order":["1","2","3","4"],"numbers.skip":["2","4","6","8"],"alphabet.missing":["A","B","C","D"],
 "alphabet.lettertrain":["M","N","O","P"],"stories.storyorder":["🌱","🌿","🌻","🌼"],
 "puzzles.sizeorder":["🐭","🐱","🐕","🐘"],"puzzles.shapeorder":["🔴","🟡","🟢","🔵"],
 "transport.traffic":["🔴","🟡","🟢","🚗"],"transport.delivery":["📦","🚚","🏠","✅"],
 "coding.order":["1","2","3","4"],"coding.patterns":["🔴","🔵","🔴","🔵"],
 "nature.grow":["🌰","🌱","🌿","🌳"],"nature.life":["🥚","🐛","🦋","🌼"],
 "science.lifecycle":["🌰","🌱","🌸","🍎"],"science.solarsystem":["☀️","☿","♀","🌍"],
 "life.hands":["💧","🧼","🫧","👐"],"life.teeth":["🪥","🦷","💧","😁"],
 "life.routine":["🌞","🪥","🍞","🎒"],"life.manners":["👋","🙂","🙏","💖"],
 "body.crossing":["🛑","👀","🚶","✅"],"body.teeth":["🪥","🦷","💧","😁"],
 "festivals.seasons":["🌸","☀️","🍂","❄️"]
};
const stories={
 bear:[["🐰","Bunny was new in the forest."],["🐻","Bear smiled and said, 'Come play with me!'"],["🌈","Together they made a rainbow of friendship."]],
 star:[["⭐","A little star fell into the meadow."],["🦉","Owl said, 'I will help you find home.'"],["🌌","The star shone brightly in the night sky."]],
 garden:[["🌰","Milo planted a tiny seed."],["💧","Every day Milo watered it gently."],["🌻","Soon a tall sunflower waved hello."]],
 sea:[["🐙","Octopus found a shiny shell."],["🐠","Fish asked, 'Can we explore together?'"],["🪸","They discovered a colorful coral garden."]],
 friendship:[["🧸","Ria saw a friend sitting alone."],["🤝","She asked, 'Would you like to play?'"],["💗","Everyone felt included and happy."]],
 bedtime:[["🌙","The moon peeked through the window."],["📚","Dad read a gentle bedtime story."],["😴","The little bear closed its eyes and dreamed."]]
};
// Original picture-story scripts inspired by familiar rhyme themes. These are
// not copied lyrics or existing commercial sound recordings.
const rhymeScenes=[
 [["🐑","A fluffy black sheep greets a little friend in the meadow."],["🧶","The sheep's warm wool can be made into soft clothes."],["👜","Look! Three little bags. Let's count them together."]],
 [["🚜","A farmer opens the barn as the sun rises."],["🐮","The cow calls out a cheerful moo!"],["🐔","Can you find the hen and the duck? What sounds do they make?"]],
 [["🦆","Five ducklings paddle after their mother."],["🌊","One duckling explores a patch of reeds."],["🦆","Mother calls everyone home. Count the ducklings together!"]],
 [["🐵","Five playful monkeys bounce on soft jungle leaves."],["🍌","A grown-up monkey brings them bananas."],["🌳","The friends settle down for a safe, quiet rest."]],
 [["🐭","A tiny mouse peeks out beside a tall clock."],["🕰️","Tick-tock! The mouse watches the hands move."],["🏠","The mouse hurries home when the clock chimes."]],
 [["🕷️","A little spider starts to climb a garden wall."],["🌧️","Soft raindrops send the spider to a dry leaf."],["☀️","The sun returns, and the brave spider tries again."]],
 [["⭐","The evening sky fills with tiny sparkling lights."],["🔭","A child looks up and wonders about the stars."],["🌙","One bright star twinkles as the moon says good night."]],
 [["🧸","A little child cuddles a favorite teddy bear."],["🌙","A grown-up tells a gentle bedtime story."],["😴","The room grows quiet and everyone rests."]],
 [["🛏️","A sleepy baby nestles in a cozy bed."],["🎶","A soft lullaby floats through the room."],["🌟","Night lights twinkle while the family says good night."]],
 [["🌠","A bright star appears above the rooftops."],["💭","A child wishes for a fun day with friends."],["🤝","The next day brings laughter, sharing and smiles."]],
 [["😴","Two friends are feeling sleepy after a busy morning."],["🔔","A little bell rings softly: time to wake up!"],["☀️","They stretch their arms and greet the day."]],
 [["🐱","A curious cat looks up at the shining moon."],["🎻","A friendly fiddler plays a funny tune."],["🐮","Everyone in the meadow joins a silly nighttime parade."]],
 [["👟","A child finds a pair of shoes by the door."],["1️⃣","One buckle, two shoes! Let's count together."],["🚶","The shoes are ready for an adventure outside."]],
 [["🛏️","Ten little stuffed animals snuggle in a big bed."],["🧸","They make room so everyone fits comfortably."],["⭐","Count the friends while they settle down to sleep."]],
 [["🥁","A friendly grandpa takes out a little drum."],["👏","He taps a slow beat and claps along."],["🎶","Can you clap the rhythm back?"]],
 [["🐸","Five green frogs sit beside a pond."],["🪷","A frog jumps toward a floating lily pad."],["💦","Splash! Count how many frogs you can see."]],
 [["🐜","Little ants follow one another through the garden."],["🍃","They carry tiny leaves back to their nest."],["🏡","The ants work together to reach home."]],
 [["🐟","A shining fish swims past a quiet riverbank."],["🖐️","A curious child counts fish with their fingers."],["🌊","The fish slips safely back into the water."]],
 [["🙆","A friendly teacher points to a head and shoulders."],["🦵","Now touch your knees, then wiggle your toes!"],["👏","Wonderful moving! Can you name another body part?"]],
 [["😊","A little bear feels very happy today."],["👏","The bear claps and dances with friends."],["💗","Everyone finds their own way to show joy."]],
 [["🚌","A yellow bus rolls along a sunny street."],["🚏","Friends wave from the bus stop."],["🏫","The wheels turn as the bus arrives safely at school."]],
 [["🌹","Children discover a circle of colorful flowers."],["🤝","They hold hands and move gently around the garden."],["🌈","The friends laugh and help one another stand tall."]],
 [["🧸","A teddy bear wakes up ready to play."],["🔄","Teddy turns around and waves one paw."],["🌟","Can you copy Teddy's gentle movements?"]],
 [["👐","Two little hands open wide like butterfly wings."],["✊","Now close them softly and open again."],["👏","Can you make a little clap with your hands?"]],
 [["🚣","A small boat floats on a quiet stream."],["🌿","The rowers notice flowers along the bank."],["🌈","Everyone enjoys a peaceful ride together."]],
 [["🐑","A little lamb follows Mary across a green field."],["🏫","The lamb waits outside while Mary learns with friends."],["💗","Mary gently leads her lamb back home."]],
 [["🥚","Humpty sits on a low garden wall."],["😮","Whoops! Humpty slips onto a soft pillow."],["🤝","Friends help Humpty find a safer place to sit."]],
 [["🪣","Jack and Jill carry a small bucket up a hill."],["💧","They fill it with fresh water at the well."],["🤝","Together they walk home carefully and share the task."]],
 [["🧁","A baker opens the bakery early in the morning."],["🥣","Warm muffins are ready on a big tray."],["😋","Can you count the muffins and choose your favorite?"]],
 [["🫖","A little teapot sits beside a colorful cup."],["💨","Steam rises gently while a grown-up pours tea safely."],["🍵","The friends enjoy a pretend tea party together."]]
];
rhymeScenes.forEach((pages,i)=>{stories["rhyme"+String(i+1).padStart(2,"0")]=pages;});
const roleTasks={
 doctor:[["Listen to the heartbeat","🩺"],["Check the temperature","🌡️"],["Give a bandage","🩹"],["Help the patient rest","🛏️"]],
 bakery:[["Mix the flour","🥣"],["Add the milk","🥛"],["Bake the cake","🧁"],["Share the cake","🍰"]],
 firefighter:[["Wear your helmet","⛑️"],["Take the fire truck","🚒"],["Use the hose","🚿"],["Help everyone safely","🤝"]],
 vet:[["Say hello to kitty","🐱"],["Listen to its heart","🩺"],["Give it water","💧"],["Let it rest","🛏️"]],
 shop:[["Pick an apple","🍎"],["Choose bread","🍞"],["Put it in the basket","🧺"],["Say thank you","🙏"]],
 teacher:[["Open a book","📖"],["Find the letter A","🅰️"],["Count three stars","⭐"],["Celebrate learning","🎉"]],
 astronaut:[["Put on a space suit","👩‍🚀"],["Board the rocket","🚀"],["Visit the moon","🌙"],["Look at a star","⭐"]],
 farmer:[["Plant a seed","🌰"],["Water the soil","💧"],["Feed the cow","🐮"],["Pick vegetables","🥕"]],
 dressing:[["Choose a shirt","👕"],["Put on trousers","👖"],["Wear socks","🧦"],["Put on shoes","👟"]],
 tidy:[["Put toys in the box","🧸"],["Put books on the shelf","📚"],["Fold the blanket","🛏️"],["Say 'all done'","⭐"]],
 salad:[["Wash the fruit","💧"],["Choose an apple","🍎"],["Mix the bowl","🥣"],["Enjoy the salad","🥗"]],
 pizza:[["Roll the dough","🫓"],["Add tomatoes","🍅"],["Sprinkle cheese","🧀"],["Bake the pizza","🍕"]],
 bake:[["Mix flour","🥣"],["Add an egg","🥚"],["Bake safely","🧁"],["Share with family","🎂"]],
 soup:[["Choose carrots","🥕"],["Add water","💧"],["Stir gently","🥄"],["Serve the soup","🥣"]],
 breakfast:[["Get the plate","🍽️"],["Choose fruit","🍎"],["Add bread","🍞"],["Have breakfast","🥛"]]
};
const movements={
 yoga:[["🐱","Stretch like a cat."],["🌳","Stand tall like a tree."],["🦋","Sit gently like a butterfly."]],
 breathe:[["⭐","Breathe in as the star glows."],["☁️","Breathe out like a soft cloud."],["💗","Place a hand on your heart."]],
 dance:[["🎵","Move your arms with the music."],["👏","Clap your hands four times."],["🕺","Do your happy dance."]],
 stretch:[["🙆","Reach up to the sky."],["🦶","Touch your toes gently."],["🤗","Give yourself a hug."]],
 balance:[["🦩","Balance on one foot with support."],["🌳","Stretch your arms like branches."],["🧘","Breathe and stand still."]],
 animalmoves:[["🐸","Hop like a frog."],["🐘","Stomp gently like an elephant."],["🐦","Flap like a bird."]],
 jump:[["1️⃣","Jump once gently."],["2️⃣","Jump two times."],["3️⃣","Jump three times."]],
 sleep:[["🌙","Breathe slowly."],["⭐","Relax your shoulders."],["😴","Close your eyes for a moment."]],
 relax:[["🌸","Notice a gentle breath."],["☁️","Exhale slowly."],["🤗","Feel calm and safe."]]
};

// Custom Storybook Vector Art Library (consistent high-clarity SVGs across devices)
const svgArt={
 Apple:'<svg class="wonder-svg" viewBox="0 0 80 80"><circle cx="40" cy="45" r="24" fill="#e94352"/><ellipse cx="32" cy="38" rx="6" ry="10" fill="#ff7b88" opacity=".5"/><path d="M40 22 Q43 10 50 12" stroke="#6d4c3d" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M42 18 Q56 10 58 22 Q48 26 42 18Z" fill="#52b765"/></svg>',
 Cat:'<svg class="wonder-svg" viewBox="0 0 80 80"><path d="M18 36 L22 12 L36 26 M62 36 L58 12 L44 26" fill="#ff9f43"/><circle cx="40" cy="44" r="24" fill="#ffaf5f"/><circle cx="31" cy="40" r="4" fill="#20324A"/><circle cx="49" cy="40" r="4" fill="#20324A"/><polygon points="40,45 36,50 44,50" fill="#fd4b8b"/><path d="M33 54 Q40 59 47 54" stroke="#20324A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
 Dog:'<svg class="wonder-svg" viewBox="0 0 80 80"><ellipse cx="18" cy="42" rx="8" ry="16" fill="#8d5b3e"/><ellipse cx="62" cy="42" rx="8" ry="16" fill="#8d5b3e"/><circle cx="40" cy="42" r="23" fill="#c98c63"/><ellipse cx="40" cy="49" rx="12" ry="9" fill="#f7dfc9"/><circle cx="32" cy="36" r="4" fill="#20324A"/><circle cx="48" cy="36" r="4" fill="#20324A"/><circle cx="40" cy="45" r="4.5" fill="#20324A"/></svg>',
 Cow:'<svg class="wonder-svg" viewBox="0 0 80 80"><circle cx="40" cy="42" r="23" fill="#ffffff" stroke="#20324A" stroke-width="2.5"/><circle cx="29" cy="32" r="6" fill="#354252"/><circle cx="51" cy="38" r="5" fill="#354252"/><ellipse cx="40" cy="52" rx="15" ry="9" fill="#ffb8c9"/><circle cx="35" cy="52" r="2.2" fill="#20324A"/><circle cx="45" cy="52" r="2.2" fill="#20324A"/></svg>',
 Bus:'<svg class="wonder-svg" viewBox="0 0 80 80"><rect x="10" y="22" width="60" height="36" rx="8" fill="#ffd43b" stroke="#d58b00" stroke-width="2.5"/><rect x="16" y="28" width="14" height="12" rx="3" fill="#dcf0ff"/><rect x="34" y="28" width="14" height="12" rx="3" fill="#dcf0ff"/><rect x="52" y="28" width="12" height="12" rx="3" fill="#dcf0ff"/><circle cx="24" cy="58" r="8" fill="#20324A"/><circle cx="56" cy="58" r="8" fill="#20324A"/></svg>',
 Sun:'<svg class="wonder-svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="19" fill="#ffb000"/><g stroke="#ffb000" stroke-width="5" stroke-linecap="round"><line x1="40" y1="8" x2="40" y2="15"/><line x1="40" y1="65" x2="40" y2="72"/><line x1="8" y1="40" x2="15" y2="40"/><line x1="65" y1="40" x2="72" y2="40"/><line x1="17" y1="17" x2="22" y2="22"/><line x1="58" y1="58" x2="63" y2="63"/><line x1="63" y1="17" x2="58" y2="22"/><line x1="22" y1="58" x2="17" y2="63"/></g></svg>'
};
const phonicsCvc=[
 {word:"cat",letters:["c","a","t"],sounds:["kuh","aah","tuh"],phonemes:["/k/","/æ/","/t/"],label:"Cat",icon:"🐱"},
 {word:"dog",letters:["d","o","g"],sounds:["duh","aw","guh"],phonemes:["/d/","/ɒ/","/g/"],label:"Dog",icon:"🐶"},
 {word:"bus",letters:["b","u","s"],sounds:["buh","uh","sss"],phonemes:["/b/","/ʌ/","/s/"],label:"Bus",icon:"🚌"},
 {word:"sun",letters:["s","u","n"],sounds:["sss","uh","nnn"],phonemes:["/s/","/ʌ/","/n/"],label:"Sun",icon:"☀️"},
 {word:"pig",letters:["p","i","g"],sounds:["puh","ih","guh"],phonemes:["/p/","/ɪ/","/g/"],label:"Pig",icon:"🐷"},
 {word:"hat",letters:["h","a","t"],sounds:["huh","aah","tuh"],phonemes:["/h/","/æ/","/t/"],label:"Hat",icon:"🎩"},
 {word:"bed",letters:["b","e","d"],sounds:["buh","eh","duh"],phonemes:["/b/","/ɛ/","/d/"],label:"Bed",icon:"🛏️"},
 {word:"bug",letters:["b","u","g"],sounds:["buh","uh","guh"],phonemes:["/b/","/ʌ/","/g/"],label:"Bug",icon:"🐞"}
];
const sinkFloatLab=[
 {name:"Heavy Rock",icon:"🪨",result:"Sink",why:"Rocks are heavy and dense, so they sink to the bottom!"},
 {name:"Wooden Log",icon:"🪵",result:"Float",why:"Wood is full of tiny air pockets, so it floats on top!"},
 {name:"Toy Boat",icon:"⛵",result:"Float",why:"A boat's hollow shape pushes water aside and floats!"},
 {name:"Metal Coin",icon:"🪙",result:"Sink",why:"Coins are made of dense metal that sinks right down!"},
 {name:"Red Apple",icon:"🍎",result:"Float",why:"Apples have air inside them, so they bob and float!"},
 {name:"Rubber Duck",icon:"🦆",result:"Float",why:"Rubber ducks trap air inside and float on the waves!"},
 {name:"Metal Key",icon:"🔑",result:"Sink",why:"A solid metal key is heavier than water and sinks!"},
 {name:"Green Leaf",icon:"🍃",result:"Float",why:"A light leaf rests gently on top of the water!"}
];
const careStudioTasks={
 vet:{hero:"🐶",title:"Muddy Puppy Wash",tools:[["🧽","Scrub mud","mud"],["🫧","Bubble soap","foam"],["🚿","Warm rinse","rinse"],["✨","Fluffy dry","sparkle"]]},
 doctor:{hero:"🧸",title:"Little Doctor Checkup",tools:[["🩺","Check heartbeat","heart"],["🌡️","Take temperature","warm"],["🩹","Put on bandage","heal"],["🛏️","Tuck in to rest","rest"]]},
 bakery:{hero:"🎂",title:"Busy Bakery Studio",tools:[["🥣","Mix batter","mix"],["🧁","Spread frosting","frost"],["🍓","Add berries","top"],["🍰","Share a slice","share"]]},
 firefighter:{hero:"🚒",title:"Fire Rescue Mission",tools:[["⛑️","Put on helmet","gear"],["🚒","Drive fire truck","drive"],["🚿","Spray water hose","spray"],["🤝","Everyone is safe","safe"]]},
 pizza:{hero:"🍕",title:"Pizza Kitchen",tools:[["🫓","Roll the dough","dough"],["🍅","Spread tomato sauce","sauce"],["🧀","Sprinkle cheese","cheese"],["🍕","Bake golden pizza","bake"]]},
 bake:{hero:"🧁",title:"Cupcake Baker",tools:[["🥣","Whisk the flour","mix"],["🥚","Crack the egg","egg"],["🧁","Swirl frosting","frost"],["🎂","Celebrate & share","share"]]},
 salad:{hero:"🥗",title:"Fresh Fruit Bowl",tools:[["💧","Wash the fruit","wash"],["🍎","Slice crisp apples","slice"],["🥣","Toss in the bowl","toss"],["🥗","Ready to eat","serve"]]},
 soup:{hero:"🥣",title:"Cozy Soup Pot",tools:[["🥕","Chop the carrots","chop"],["💧","Pour warm broth","pour"],["🥄","Stir in circles","stir"],["🥣","Serve warm soup","serve"]]}
};

return {lands,worlds,letterPairs,things,sequenceSets,stories,roleTasks,movements,svgArt,phonicsCvc,sinkFloatLab,careStudioTasks};
})();
