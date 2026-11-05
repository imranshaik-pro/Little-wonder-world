# Little Wonder World — Complete Feature Audit & New Feature Blueprint

**Date:** 28 October 2026  
**Android build:** v1.3 (test release, English, offline, landscape)  
**Audience:** Preschool children, approximately 2–6 years, with parent-managed controls

## 1. What is genuinely in the app?

- **26 learning worlds with 225 selectable activity configurations.** Many activities reuse the same learning/game engine with different content. They are not 225 individually coded games.
- **Six original MVP games remain:** Color & Shape Sorting, Animal Sounds, Memory Matching, Alphabet Tracing, Coloring, and Balloon Pop.
- **16 broad flashcard themes**, the existing Animal Flashcards atlas of **123 different animals**, and **45 Object Sound Cards**.
- **34 matching animal sound files** (nine separately sourced and documented real animal recordings, plus 25 existing sampled/effect clips); **17 matched object sound entries**, including six new or replaced recordings. For all remaining cards, speak the name rather than mislabel a made-up sound.
- **Three bundled offline, muted animal mini-films:** cow, dog, elephant. They are not externally streamed videos.
- **Parent-managed family photographs** with roles, names and a child-facing “Who's Who?” quiz; **one original animated safety walkthrough**, “Knock Knock! Door Safety”.
- **Four original child-friendly speaking guides**, sampled musical instruments, a full sketchpad and on-device art gallery, activity progress, reduced-motion/sound settings.
- No advertisement SDK, tracking, Internet permission, remote login, payment, or cloud photo service. Photos stay inside the app's local WebView data and are not backed up by this prototype.

## 2. Screen-by-screen experience

| Screen | What a child or grown-up sees | Main actions |
| --- | --- | --- |
| Onboarding | Storybook welcome, four learning buddies, age choices 2–3 / 4–5 / 5–6 | Choose a companion and age; enter the home screen |
| Home — six learning lands | Learning Land, Thinking Forest, Discovery Island, Creative Garden, Little Life Town, Adventure Funfair | Tap a land; choose Surprise; ask a guide for help; enter Parent Corner |
| World selection | Up to several brightly colored world tiles within a land | Pick a learning world |
| Activity selection | At most nine big game tiles per page, with page arrows when needed | Choose a specific game mode |
| Play | Contextual buddy, large targets, optional spoken prompt, game-specific interactions | Listen, tap, drag/trace, draw, pop, play music, turn pages |
| Celebration | Stars and positive feedback | Replay, next adventure, home |
| Parent gate | Grown-up arithmetic question | Answer correctly to open Parent Corner |
| Parent Corner | Progress dashboard, art gallery, family editor, companion and sound controls | Add/remove family photos; manage local preferences and progress |

Child-facing play screens are designed for the fixed landscape display. Parent Corner can scroll to accommodate settings and family entries.

## 3. The 26 learning worlds, all features

| Learning world | Modes | Activities and skills |
| --- | ---: | --- |
| Color & Shape Sorting | 9 | Colors, shapes, big/small, pattern recognition, food baskets, animal habitats, toys, weather, tools |
| Animal Sounds | 11 | Listen & Find, Sound Safari, Farm Friends, Baby Animals, Animal Homes, Shadow Guess, Footprints, Animal Food, Baby & Parent, Animal Flashcards, Object Sound Cards |
| Memory Matching | 9 | Match animals, colors, fruits, letters, numbers, vehicles, feelings, food, toys |
| Alphabet Tracing | 9 | Uppercase, lowercase, numbers, shapes, lines, first words, curves, patterns, symbols. A–Z/a–z sessions resume from the child's next letter |
| Coloring Studio | 10 | Flower, ocean, bear, car, fruits, dinosaur, space, rainbow, castle and full-screen My Sketch Pad |
| Balloon Pop Adventure | 12 | Alphabet, colors, numbers, shapes, animal calls, original characters, fruit, food, vehicles, weather, toys, letter clues |
| Alphabet & Phonics | 9 | Letter Hunt, First Sounds, Little Letters, Rhyme Time, Missing ABC, Letter Train, Word Starts, Sound Explorer, 52-lesson ABC Journey |
| Numbers & Math | 9 | Count stars/apples/fish, number hunt, addition, sequencing, comparisons, number steps and 1–100 journey |
| Read-aloud Stories | 8 | Six short picture-based stories about friendship, discovery, nature and bedtime, plus story-order and picture-words games |
| Puzzles & Logic | 8 | Jigsaws, shadows, animal/picture pieces, missing piece, odd-one-out, size and shape sequences |
| Music & Rhythm | 8 | Playable acoustic piano, xylophone, drum kit, echo beat, bird orchestra, bells, instrument recognition and pitch |
| Vehicles & Helpers | 8 | Vehicle identification, travel type, traffic lights, emergency/community helpers, garages, vehicle puzzles, sounds, delivery sequences |
| Early Coding | 8 | Tap arrows to guide a robot, routes, mazes, ordered steps and pattern/direction activities |
| Plants & Nature | 8 | Flowers, seed growth, insects, trees, seasons, gardens, butterfly lifecycle |
| Science & Space | 8 | Weather, day/night, planets, float/sink, dinosaurs, natural cycles, solar order, star puzzles |
| Pretend Play | 8 | Doctor, baker, firefighter, veterinarian, shopkeeper, teacher, astronaut, farmer |
| Feelings & Friendship | 8 | Identify expressions, choose kind actions, practise sharing, helping and calming breaths |
| Everyday Skills | 8 | Handwashing, toothbrushing, dressing, tidying, routines, healthy foods, recycling, manners |
| Building & Design | 8 | Towers, bridges, houses, roads, castles, gardens, train tracks, rockets |
| Body & Safety | 9 | Body parts, five senses, health, safe crossing, dental care, time, helpers, safe choices, **new Knock Knock! Door Safety** |
| Movement & Mindfulness | 8 | Age-appropriate yoga, star breaths, dancing, stretching, balance, animal moves, jumping, bedtime calm |
| Wonder Mini Arcade | 8 | Bubble, fish, star and butterfly catchers, treasure, little maze, pieces, hidden objects |
| Festivals & Seasons | 8 | Spring/winter/summer, seasonal ordering, parties, gifts, festival music, kindness stories |
| Little Chef | 8 | Fruit salad, pizza, vegetables, cake, soup, breakfast, food groups, kitchen design |
| **Wonder Flashcards** | **16** | **New** themed cards: vehicles/sirens, fruits, vegetables, foods, helpers, family words, home, body, weather, instruments, feelings, colors/shapes, places, opposites, birds, farm animals |
| **My Family Album** | **2** | **New** family photo-and-name cards and “Who's Who?” photo matching |

### Interaction quality, not just quantity

The shared mechanics include quiz choices, sorting, sequences, counting, pairs, free drawing, page-turning, music taps, movement prompts, building scenes and basic directional coding. The large mode count reflects curriculum breadth; before a commercial launch, each activity still needs age-specific difficulty, richer questions, artwork consistency and testing with children.

## 4. New: My Family Album

**Goal:** A child should recognize familiar faces and learn personally meaningful names and relationships—“This is my grandpa Ravi,” not just “This is a man.”

**Parent flow**

1. Open Parent Corner through the arithmetic gate.
2. In My Family Album, enter a name such as **Ravi**.
3. Choose a role: Grandpa, Grandma, Mom, Dad, Brother, Sister, Aunt, Uncle, Cousin, Baby, Guardian, Family Friend or Other.
4. Select a JPEG/PNG/WebP image through Android's system document picker. The photo is resized to fit within 320×320 pixels and compressed to JPEG.
5. Tap **Add family member**. Up to 16 entries are saved locally. Each appears with a Remove action.

**Child flow A — Meet My Family:** A large real photo appears alongside the role and name. Previous/Next and Hear Name allow the child to repeat at their own pace. The installed Android offline English text-to-speech voice pronounces the person's role and name; pronunciations of family-specific names can vary by device.

**Child flow B — Who's Who?:** The child hears a prompt such as “Find Grandpa Ravi” and chooses among two or three faces. Correct choices receive gentle celebration; incorrect ones are encouragement to try again. With fewer than two saved people, the quiz asks a grown-up to add another photograph.

**Privacy and safety:** Photos are chosen only by a grown-up, are not transmitted to our servers, and are stored in the app's local browser-style data. Ask each family member for permission before adding their image. The gallery is not encrypted separately, has no export/backup, and is erased when Android app data is cleared or the app is uninstalled. The arithmetic parent gate is not strong authentication. Stronger protected family storage and consent/erasure controls remain production requirements.

## 5. New: Flashcards that go well beyond animals

The app now has **16 themes** in a dedicated Wonder Flashcards world. Examples:

- **People & relationships:** grandparents, caregivers, siblings, cousins, community helpers.
- **Everyday objects:** bed, chair, clock, doorbell, book, spoon, toothbrush, cup.
- **Things that move:** ambulance, fire engine, police car, motorcycle, bus, train, car, bicycle, helicopter, plane, boat.
- **Food and nature:** fruits, vegetables, meals, animals, birds, plants, rain, thunder, sun, moon.
- **Foundations:** colors, shapes, opposites, feelings, body parts, places, musical instruments.

The learner sees an illustration or emoji, a large printed name, Next/Previous and a **Hear Name / Play Sound** button. Audio only plays a sound file if an appropriate clip is bundled; abstract items speak the name. This avoids a pretend tiger roar or fictitious sound for a triangle.

## 6. Sound inventory and the path to fully authentic audio

| Content | v1.2 | New v1.3 | Remaining gap |
| --- | ---: | ---: | --- |
| Animal species cards | 122 | **123** | None for picture/name coverage; more species can be added |
| Animal cards with matching audio | 30 | **34** | **89** species lack individual audio |
| Separately source-verified real animal recordings | Not independently verified in the expansion | **9** (five replace old clips, four add sound to species) | Many of the other 25 sound-enabled animals use labelled effects, not proven field recordings |
| Object cards | 40 | **45** | Can expand into hundreds of household and community objects |
| Object cards with matching effects | 12 | **17** | **28** object cards lack audio effects; many are ordinarily silent objects |
| Muted, offline animal film clips | 3 | **3** | More verified footage optional |

Nine sourced animal sounds in v1.3: **cow, dog, horse, lion, elephant, goose, beluga whale, orca and cricket**. New or replaced real-object recordings: **ambulance siren, fire-engine siren, motorcycle passing, car horn, bicycle bell, door knock**. Sirens are relatively quiet and short. Sources and license terms are in [ASSET_CREDITS.md](ASSET_CREDITS.md).

**Important distinction:** a recorded animal roar and a procedurally generated imitation are not the same. This release does not claim to have genuine recordings for all 123 animal species. Building a commercial-quality collection for every species needs identifiable source attribution, license review, species verification, sensible playback levels, and pronunciation QA. The current app does *not* silently substitute the wrong animal call.

## 7. New: Animated stories and a practical safety walkthrough

### Implemented: Knock Knock! Door Safety

One short, original illustrated walkthrough uses a softly animated door and real knocking sound. It avoids a frightening thief character: the visitor's identity is unknown, and the lesson is about **safe actions**, not guessing who is “bad.”

| Step | Story scene | Correct action |
| --- | --- | --- |
| 1 | Someone knocks; the child cannot see who it is | Keep door closed and tell a trusted grown-up |
| 2 | Visitor says “I have a parcel for you!” | Wait while the grown-up checks; don't open it yourself |
| 3 | A trusted grown-up arrives | Let the grown-up decide whether/how to open the door |

Each step has two large choices and reassuring feedback for a wrong tap. It teaches the general KidSmartz/NCMEC principle that children should check with their trusted adults and avoid answering the door alone. Parents should talk through the practice with the child.

### Proposed story-video roadmap (not yet in the APK)

The app should favor **original, parent-reviewed, 60–120-second interactive animations** over a direct feed of the web's “top-rated” videos. Video rankings fluctuate and do not guarantee safety or educational value. Suggested themes:

1. **Everyday safety:** doorbell, crossing roads, lost in a shop, fire alarm, helper recognition.
2. **Daily habits:** brushing teeth, washing hands, packing a bag, bedtime routine.
3. **Emotional learning:** sharing, saying no, asking for help, kind words, handling disappointment.
4. **Early learning:** counting through stories, phonics, colors, shapes, animal homes and jobs.
5. **Family stories:** “Who is at the family picnic?”, relationships, birthdays, respectful greetings.

For each theme, use 3–5 scenes, 1 meaningful child choice, calm narration, replay, subtitles where possible, and a short parent conversation prompt. If external videos are ever integrated, place approval and playback controls in Parent Corner, review creator/content rights, and comply with child privacy policies. No third-party videos are downloaded or reproduced here.

## 8. Parent Corner, progression and child wellbeing

- Local counts of completed sessions, distinct modes tried and activity completions per world/land.
- Aggregate right/wrong answer attempts (practice signal, **not** a cognitive or developmental diagnosis).
- Saved sketch gallery and separate family-photo list.
- Four learning buddy selections.
- Toggle device spoken guidance, gentle background music, game sound effects/animal calls, balloon speed and reduced animation.
- Suggested daily 2/4/6-session goal. It is guidance, not a child lockout.
- Change child age profile and reset learning-progress counters. Reset Progress does **not** delete personal photographs; use each album entry's Remove control.
- No ads, purchases or monetization screen in the current v1.3 production line. The earlier one-time unlock price was a commercial hypothesis, not a payment feature.

## 9. Technology and release notes

- Native Android Activity wraps a fully offline HTML/CSS/JavaScript game inside WebView. Android Text-to-Speech speaks English prompts. Local storage holds progress and family/gallery images.
- Android min SDK 23 (Android 6), target SDK 35. The app is designed for landscape and works without Internet permission.
- v1.3 keeps test package `com.littlewonderworld.app.v11` and the v1.1/v1.2 test signing key, so it can update those versions *if they were installed from the same test build family*. It does not update the older v1.0 package.
- Local automated smoke tests cover **all releases v0.3 through v1.3** and confirm 26 worlds/225 modes render and basic question/engine invariants hold. APK is signed and its package metadata checked. **No physical Android test, caregiver usability test, accessibility audit or Play Store review has been completed.**

## 10. Highest-value next quality gates

1. **Family data safety:** dedicated encrypted Android app storage, stronger Parent Corner authentication, easy export/import/delete, device-transfer policy and family consent UX.
2. **Authentic multimedia:** expand and quality-check recorded species calls, vehicles and everyday object sounds; document license terms per asset; test volume and identify correct species.
3. **Animated story studio:** 6–12 original short stories with choices, voice and optional captions; parent approval and trauma-informed safety content.
4. **Pedagogy and UX:** age-appropriate difficulty; genuine letter-trace correctness; child testing on small screens and tablets; accessibility and hearing support.
5. **Android readiness:** test gallery/photo chooser on Android 6–15, local-data storage limits, install/update/uninstall behavior and app backup expectations; Play Families and privacy compliance before release.

---

*This report distinguishes features actually coded into the v1.3 test build from ideas, planned enhancements, and functionality that requires real-device or professional validation.*
