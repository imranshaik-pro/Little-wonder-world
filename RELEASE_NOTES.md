# Little Wonder World — Release notes

## v1.4.2 — Playful Full-Screen Instruments & Bubble Pop

- **Little Piano:** the eight sampled white keys and five sharps now fill almost all available playfield space, instead of occupying approximately half its height. The duplicate large music heading was removed; one compact strip contains the notes-played count and Finish control. Instrument playback, note count, and Finish-after-six-taps are preserved.
- **Xylophone:** eight colorful acoustic bars now span the playfield width and most of its height, with large finger-friendly hit targets, an outer wooden frame and slimmer controls. Existing offline xylophone sample and pitch-shifted notes are preserved.
- **Happy Drums and other music modes:** benefit from the same wide, tall playfield template and minimal bottom control row. No remote samples or music streaming added.
- **New Pop the Bubbles:** a dedicated, unhurried activity at the start of Wonder Mini Arcade, separate from the existing Bubble Catch. Children tap individual shiny pastel bubbles to pop them, hear gentle sounds, see sparkles, build a score and finish with a celebration. Ages 2–3 receive nine bubbles, ages 4–5 twelve and ages 5–6 fifteen. There is no timer, lost lives or ad prompt.
- **End-to-end screen-space review:** audited all 227 selectable modes and 40 additional navigation/onboarding/parent screens at **800×360, 1000×480, 1280×720 and 2400×1080**. Piano, Xylophone and Drums use approximately **97–99%** of playfield width and **72–89%** of playfield height (depending on viewport). Fixed a six-option Animal Food layout that squeezed answers on small phones. Existing moving balloons intentionally enter and leave the clipped road scene; this is not counted as clipped static UI.
- **Regression:** all 26 worlds and every prior v1.3/v1.4/v1.4.1 mode remain, now **227 selectable modes** and 13 shared interaction types. The v1.4 improvements (app-lock media pause, C→D tracing, compact instruction strip, real letter tiles, full-width shapes, large Real Films), 123 animal cards, 16 flashcard decks and six offline films remain in place.
- **Build/update:** same offline Android package and development signing key as v1.3–v1.4.1, Android versionCode **16**. This is an in-place test upgrade path and should preserve existing local progress when installed over a build from the same signer.

**Limitations:** no physical Android-device, audio-volume, child-usability, accessibility or Play Store testing yet. A xylophone recording is still pitch-shifted from one acoustic sample; this release improves its playable layout, not the source recording library. See `FEATURE_AUDIT_V1_4_2.md` for the detailed acceptance evidence.

## v1.4.1 — Complete Flashcard Restoration & Realistic Animal Atlas

- **Regression fixed:** v1.4 had opened Animal Flashcards on the six-film filter, making the other animals seem missing. The default is now **All 123 animals**. The 34-card audio filter remains available, and children can switch back from films in one tap.
- **Animal Sounds selector:** its first three tiles are **All Animal Cards · 123**, **Real Films · 6** and **Object Sound Cards · 45**, with every previous v1.3 animal game retained. The dedicated Real Films tile makes footage discoverable without hiding the encyclopedia.
- **Realistic animal illustrations:** six newly created, anatomically recognizable watercolor-style storybook illustrations (Elephant, Cow, Dog, Cat, Horse and Goat) appear in the corresponding animal flashcards. High-resolution original PNGs are preserved in `artwork-sources/` inside the source archive; optimized JPGs are bundled in the APK.
- **Animal learning facts:** these six illustrated animals include habitat/home, baby-animal name, typical food and a simple child-friendly fact, with a Watch real film button. The remaining 117 encyclopedia entries preserve the v1.3 names, groups, emoji illustrations and available calls; they have **not** all been converted to realistic artwork.
- **Real Films retained:** all six muted ~4.6-second WebM clips stay bundled offline, with still-image posters. The three new clips—Cat, Horse and Goat—are CC0 Wikimedia Commons footage documented in `ASSET_CREDITS.md`. No external streaming or Internet permission was added.
- **v1.3 feature parity:** all 26 worlds and 225 previous v1.3 activities are retained; the separate Real Films mode makes **226** selectable modes in v1.4.1. This includes 16 themed Wonder Flashcards, 123 animal cards/34 sound entries, 45 object cards/17 sound entries, family album and quiz, safety walkthrough, sketch gallery, and the original six games.
- **Validation:** automated mode/engine smoke tests pass for v0.3–v1.4.1; browser layout/navigation passes at 2400×1080 and 1000×480 with no missing local media or JavaScript errors. Every file listed under `app/src/main` in the v1.3 source archive is present in v1.4.1. APK signature and payload verified; same package ID and development signing certificate as v1.3/v1.4, Android versionCode 15.

**Remaining limitations:** no physical-device, child-usability, screen-reader or Play Store test has been completed. Only six species currently have new realistic illustrated cards and films; other animal visuals remain older illustrations/emoji. Tracing still measures movement, not letterform accuracy. This development signer is **not** a production signing identity.

## v1.4 — More Play, Less Chrome

- **Landscape space reclamation**: the mascot/instruction/progress/listen controls form one compact top strip rather than a quarter-screen left panel, on both game and activity-selection screens. The activity itself becomes the focal point.
- **Alphabet tracing and shape drawing**: near-full-width guide surface, expanded letters and shapes, a visible stroke-effort bar, auto-advance after a meaningful pointer gesture, and accessible Next/Skip controls. The stuck-at-C symptom is covered by an automated test. This still checks meaningful movement, **not handwriting correctness**.
- **Letters instead of ABC-book emoji** in Letter Hunt, First Sounds, Little Letters, Word Starts and Sound Explorer. Large, distinct typography and colored answer backgrounds are used.
- **Animal film experience**: enlarged widescreen footage and a new Real films filter as the default Animal Flashcards view. Six locally stored muted real-animal snippets (Cow, Dog, Elephant, Cat, Horse and Goat) are about 4.6 seconds each, with replay and audio-name/call controls. All are sourced from confirmed CC0 uploads and documented in `ASSET_CREDITS.md`. The original three clips were re-encoded at higher resolution.
- **Phone lock and app switching**: native Android Activity lifecycle handling, browser visibility handling, Text-to-Speech interruption, Web Audio suspension, and explicit pausing of background music, active clips and videos. Background music may restart only when the app becomes visible again.
- **Regression**: all 26 worlds, 225 modes and previous releases pass structural smoke tests; headless Chromium checks at 2400×1080 and 1000×480 confirm large video and tracing surfaces, readable letter options, tracing advance C → D, and audio pause.

### v1.4 limitations

- This is a signed, locally compiled test APK; lifecycle behavior must still be checked with lock/unlock and audio focus on real Android devices.
- Six of 123 animal encyclopedia entries have film; species without footage remain illustrated. Audio coverage is unchanged from v1.3.
- The automatic tracing threshold measures drawing movement and enables a friendly progression, not whether the child followed the exact letter contour.
- Monetization and analytics remain disabled; family photos remain private to local app storage.

## v1.3 — Family, Real Sounds & Safe Stories
- **26 learning worlds, 225 selectable modes**: retains v1.2's 24 worlds/206 modes and adds two worlds plus the three-step safety activity.
- **My Family Album** world: Parent Corner can select a photo, enter a name, choose a family role (Grandpa, Grandma, Mom, Dad, brother, sister, aunt, uncle, cousin, baby, guardian, family friend or other), and remove an entry. Maximum 16 people. Photos are resized/compressed to JPEG and stored locally in the app's WebView data. Children can view family-role cards and try a personalized photo-identification quiz.
- **Wonder Flashcards** world adds 16 themed decks: vehicles/sirens, fruits, vegetables, food, helpers, family-role words, home objects, body, nature/weather, instruments, feelings, colors/shapes, places, opposites, birds, and farm animals.
- Original Animal Flashcards now have 123 species, 34 with matching clips. Nine clips are independently sourced animal recordings, including five replacements of synthetic/sampled core-animal clips and four newly sound-enabled animals: goose, beluga whale, orca, and cricket.
- Object Sound Cards expand to 45 pictures with 17 matched audio effects. New real-world vehicle/sound samples: ambulance siren, fire-engine siren, motorcycle pass-by, car horn, bicycle bell and door knocking (some replace previous clips).
- **Knock Knock! Door Safety**: a three-step gently animated, voiced, tappable story with real knocking sound and feedback about keeping the door closed and seeking a trusted adult. It shows an anonymous visitor, not a frightening or stigmatized 'thief' character.
- No remote video streaming, account, advertisements, or payment services. Existing three offline animal mini-films and background music remain available.

### v1.3 limitations
- The family album is on-device only and has no export, backup, PIN/encryption layer, or multi-profile synchronization. It is intended for consenting family members on a family-controlled device; device loss/app-data clearing may erase photos.
- The arithmetic Parent Corner gate is a preschool deterrent rather than secure identity verification. New photo selection uses Android's system document picker, without requesting broad storage permission.
- 89 animal species still have name narration only; many existing effects are not field-verified. Real, species-accurate field recording coverage for all animals is still an open production task.
- The additional flashcard decks use visual emoji and spoken names (sound where a verified or previously credited clip exists). They are not yet photographic cards. Safety scenes are CSS-based story animation, not licensed videos.
- Automated smoke tests verify all 26 worlds/225 modes render structurally. Source/audio licensing is documented in `ASSET_CREDITS.md`. On-device child usability and photo-picker testing remain required before distribution.

The original roadmap through v1.0 used `com.littlewonderworld.app`. The v1.1 and v1.2 test builds share `com.littlewonderworld.app.v11` and the same development signer in this environment, so v1.2 can update v1.1 and preserve its local progress. Neither replaces the original v1.0 installation.

## v1.2 — Little Learning Stories
- **24 worlds, 206 activity modes**, retaining everything from v1.0 and v1.1.
- An immersive, near-full-screen **My Sketch Pad**, with 12 color swatches on the left, five brush thicknesses on the right, pen, eraser, undo, clear and a locally saved artwork gallery in Parent Corner.
- **ABC Journey**: 26 uppercase + 26 lowercase lessons, with picture associations, speak/repeat/previous/next controls and automatic lesson-position saving.
- **Numbers 1–100**: 100 self-paced cards with visual grouping and resume. Existing capital/lowercase tracing now continues through the whole 26-letter deck and resumes from the next letter on return.
- **Animal Flashcards**: 122 unique animal species, with 30 species-specific audio clips and three offline animal film clips; **Object Sound Cards**: 40 pictures, 12 matched sound-effect clips and spoken names for the other 28.
- Animal Balloon Pop and the sound-led animal games choose from the 30 audio-enabled animals. A matching animal call takes precedence over the generic pop effect; answer feedback does not talk over the call.
- Soft original background piano melody, looped during non-musical play, paused in music games and ducked during speech/animal calls; Parent Corner on/off control.
- Guide speech cadence and pitch adjusted toward a natural pace; the Android engine's highest-quality available offline English voice is preferred. This **does not replace text-to-speech with a human narrator**.
- Android package remains `com.littlewonderworld.app.v11` for in-place test upgrading from v1.1. Re-tested 24 worlds/206 modes with automated browser interactions and regression checks.

### Still open
- Clips for 30 animals are sound effects or sampled calls, not all independently verified wildlife field recordings. Species without clips have names read aloud, not misleading generic pop effects.
- Three real-life animal video clips; more video coverage and professional voice recordings are planned.
- Dedicated alphabet/number journeys are continuous; the original short quiz modes remain short by design.

## v1.1 — Real Music & Learning Buddies (based on v1.0)
- **All 24 worlds and 201 selectable modes retained.** This is an incremental build of v1.0, not the smaller v0.1/v0.2 demo.
- Recorded acoustic piano samples and realistic white-and-black keys; playable rainbow xylophone; six-pad acoustic drum kit with kick/snare/hi-hat/tom/crash/ride.
- Four original, talking guides: Bramble the bear, Pippa the explorer, Nova the robot and Comet the star hero. Choose in onboarding or Parent Corner. Each offers contextual hints.
- Three real-life animal video clips (cow, dog, elephant), muted and bundled for offline viewing.
- Source and licensing credits in `ASSET_CREDITS.md`; regression checks extended to v1.1.

## v0.3 — Wonder Buddies
- **6 worlds, 57 activity modes** including all original games.
- Balloon Pop grows from nine themes to twelve: Weather Pop, Toy Pop and Sound Pop join letters, colors, numbers, shapes, animals, cartoons, fruits, food and vehicles.
- Sorting gains toys/weather/helpers; animal play gains footprints/food/baby themes; memory decks, tracing strokes and paint scenes grow.
- Child home and mode pages remain fixed; balloon themes are paged nine at a time.

## v0.5 — Learning Lands
- **12 worlds, 105 modes**, introducing alphabet and phonics, numbers, stories, puzzles, music and vehicles.
- A child-friendly fixed-grid Learning Lands home groups the accessible worlds; no scroll.
- New offline game engines for sequencing, counting, picture puzzles, story pages, music keys and scene creation.

## v0.8 — Curious Explorers
- **18 worlds, 153 modes**, adding coding, plants/nature, science/space, pretend play, emotions/friendship, and everyday skills.
- Interactive robot navigation, role-choice activities, calm movement cards and science concept questions.
- Spoken directions and local parent progress retained.

## v1.0 — Wonder World
- **24 worlds, 201 modes** across six learning lands, with building, body/safety, movement/mindfulness, mini arcade, seasons/celebrations and little chef.
- 11 shared expansion interaction mechanisms; local answer accuracy is visible to grown-ups (not a developmental assessment).
- Storybook-inspired styling, gentle effects, optional animation reduction, and a parent-only gate.

## Known limitations

- This is an **expansive functional prototype**, not a proven best-in-class learning product. Many mode themes reuse mechanics or question banks.
- Seven original audio clips are bundled for common animals. Most other sounds are synthesized; English narration depends on a suitable Android text-to-speech voice being installed.
- Tracing recognizes drawing movement, not true letterform correctness. Activity quality and visual fit require testing with real children on real devices.
- No ads, accounts or payments. Monetization is intentionally **not implemented** while child safety and educational quality are being validated.
