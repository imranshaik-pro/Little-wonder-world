# Little Wonder World — Four-stage Android Prototype Roadmap

## Latest: v1.5.1 — Vivid Storybook UI refresh

This is an in-place update for the v1.5 standalone test package
`com.littlewonderworld.app.v15` (version code 18), signed with the same
development key. Do not uninstall the earlier app to update; the package stays
the same, so Android can retain its local app data.

- A calm cool-blue canvas (`#F3FAFF`), deep legible text (`#20324A`),
  orange Play (`#FFB000`), blue Listen (`#1769E0`), green Continue
  (`#157F52`), plus distinct learning-land accents. Read
  `DESIGN_SYSTEM_V1_5_1.md` for the exact roles and wireframe guidance.
- Creative Garden appears first on the main menu, with an oversized visual
  card. Thinking Forest is a second featured card, but all six lands are kept.
  Individual land cards use different color and icon cues.
- Learning screens keep a white activity canvas, clear dark instructions,
  distinct answer cards and accent-colored feedback without filling the entire
  screen with saturated color. Existing touch surfaces are preserved.
- All 27 worlds / 257 selectable activities and v1.5's learning logic remain.
  Run `node qa-v15.js`, `node qa-v15-render.js`, and
  `node smoke-roadmap.js` to verify the inventory and learning-engine checks.

Build with `LWW_ANDROID_SDK=/path/to/sdk bash build-apk.sh v1.5.1`.
This is a working offline test APK, not a device-tested production release.
The 30 rhyme activities are narrated original stories, **not** 30 finished
musical sing-alongs. Piano samples and toddler touch ergonomics still merit
real-device evaluation.

## Latest: v1.5 — Child-led quality improvements (separate test install)

**Nothing from v1.4.2 has been removed.** All 26 previous worlds and 227 selectable
activities remain available. This test release adds Rhyme & Storytime (30 original
picture stories inspired by familiar nursery-rhyme themes): 27 worlds and 257
selectable activities. It retains the original Read-aloud Stories and Rhyme Time
quiz separately.

What's new:

- Piano/Xylophone now recognize touches in the whole large instrument surface,
  including between/above the drawn bars; multiple fingers and finger sliding
  can produce chords and glissandos. Sounds are preloaded when possible.
- Eight separately rendered offline xylophone pitch assets ensure distinguishable
  notes even on WebViews where playback-rate shifts are inconsistent. The piano
  continues to use recorded Meta Open Sound samples (see ASSET_CREDITS.md).
- Tracing uses guide paths, starting points, direction/coverage checks and
  age-adjusted tolerance. Random scribbling no longer completes an item, and
  explicit Next/Skip remains. **Show me** demonstrates the path before tracing.
- Counts are more distinct: stars ask how many, apples go into a basket, fish
  are counted one at a time, and addition presents two visible groups.
- Thinking Forest is arranged teacher-first, sorting categories use visually
  different baskets, and the size activity uses meaningfully sized examples.
- **My Sketch Pad** is the first activity in Coloring Studio.
- Brush Your Teeth teaches through demonstration, guided actions and finger
  movements before asking the child to act independently.
- Repeating question, counting, logic, coding and pretend games extend in
  five-star milestones rather than forcing a completion screen; Bubble Pop
  and catcher games replenish their play objects for another round. Finite
  stories and life-skill lessons still have natural endings and replay access.
- Rhyme & Storytime contains **thirty original three-page, read-aloud stories**;
  these are not yet commercial song recordings, synchronized lyrics or karaoke.

**Install/test safety:** v1.5 uses package `com.littlewonderworld.app.v15`,
because the earlier v1.4.2 test signing key was not included in the archived
source. It installs *beside* v1.4.2 rather than overwriting or migrating that
app's private progress. Do not uninstall the older app solely to test this one.
This is still a prototype, not a production release. Actual child-device audio,
touch and tracing usability tests remain required. The rhyme narration uses
Android's installed English TTS voice; sung rhyme recordings require separately
produced/licensed content.

Build with `LWW_ANDROID_SDK=/path/to/android-sdk bash build-apk.sh v1.5` using
JDK 17/Android SDK 35. Run `node qa-v15.js`, `node qa-v15-render.js`, and
`node smoke-roadmap.js`. Some full-browser QA scripts require a separate local
Chromium installation.

## Latest: v1.4.2 — More instrument space & Bubble Pop

**Little Piano** and **Xylophone** now have a play-first landscape layout: keys and bars occupy nearly the whole screen's game area with a small notes/Finish strip. **Drums** and other music activities use the same responsive template. A new **Pop the Bubbles** mini-game under Adventure Funfair → Wonder Mini Arcade provides 9/12/15 big colorful bubbles by age group, gentle sounds, bubble pops, no timer, and completion celebration.

This version also fixes crowded six-option Animal Food questions at small phone sizes. A whole-app automated layout pass checked **227 activities and 40 navigation/parent screens at four landscape sizes** with no flagged static overflow, off-screen controls or page errors. All 26 worlds and every mode from v1.3/v1.4/v1.4.1 are still present, including **123 animal cards, six offline Real Films, 16 themed flashcards, family photos, safety stories and the prior v1.4 tracing/media improvements**.

Install `LittleWonderWorld-v1.4.2.apk` over an existing v1.3/v1.4/v1.4.1 test build signed by the same development key. Build with `bash build-apk.sh v1.4.2`; verify with `node smoke-roadmap.js`, `node qa-v141.js` (for v1.4.1-specific checks using its release script) and `node qa-v142.js`. See `FEATURE_AUDIT_V1_4_2.md`. This remains a functional offline prototype pending real-device and caregiver testing.

## Previous: v1.4.1 — Restore every v1.3 feature; keep six Real Films

This corrective update fixes v1.4's misleading Animal Flashcards default, which showed only six video animals. The full 123-card Animal Encyclopedia now opens directly. The Animal Sounds selector puts the encyclopedia, six-film collection and 45 object cards first; Wonder Flashcards (16 themes) is prominent in Discovery Island. Six realistic original storybook illustrations and child-friendly habitat/baby/food facts enhance the video-enabled animal cards. All six muted offline CC0-sourced Real Films remain available.

All 26 v1.3 learning worlds and 225 previous activities are retained; the dedicated Real Films activity raises v1.4.1 to **226** selectable modes. The package ID, development signing identity and local-storage keys are unchanged, so v1.4.1 is intended to update v1.3/v1.4 in place while preserving local progress. See `FEATURE_AUDIT_V1_4_1.md` and `RELEASE_NOTES.md` for the regression checklist and limitations.

Build with `bash build-apk.sh v1.4.1`, then run `node smoke-roadmap.js` and `node qa-v141.js` (headless Chromium required). This remains an offline test APK, not a Play Store production build.

## Previous: v1.4 — Child-first layout, reliable tracing & real animal films

The latest test APK **v1.4** retains all **26 learning worlds and 225 selectable activities** from v1.3, with focused improvements from parent feedback:

- Android and browser lifecycle media suspension: stop music, sound clips, voice narration, and videos when the app loses foreground (including phone locking), resume music only in the foreground.
- A compact, horizontal instruction strip frees the former 24%-wide mission sidebar; oversized animal videos, alphabet tiles, tracing shapes, and other play surfaces now occupy the main screen.
- Alphabet Tracing: visible effort bar, reliable automatic advance after a meaningful finger stroke, an explicit Next button, and a Skip control to avoid getting stuck at C or another letter.
- Letter Hunt, First Sounds, Little Letters, Word Starts and Sound Explorer show their **actual letter** in large high-contrast answer tiles, not a generic ABC book icon.
- Animal Flashcards has a new default **Real films** filter with **six 4.6-second muted and offline CC0 clips**, better quality and much larger viewing area; other species retain familiar illustrated cards and matching sound/narration where available.

Build with `bash build-apk.sh v1.4` using Android SDK 35 and JDK 17. The test package ID and signing key are unchanged from v1.3, so Android can update that version in place. The APK still requires real-device and family usability validation before public distribution.

## Previous: v1.3 — Family & Real Sounds

**See [FEATURE_AUDIT_V1_3.md](FEATURE_AUDIT_V1_3.md) for the detailed screen-by-screen and game-by-game inventory.**

The new v1.3 APK includes **26 learning worlds / 225 selectable activities**. Additions over v1.2:

- **My Family Album**: grown-ups choose up to 16 private family photos with names and roles; children view photo-name cards and answer "Who's Who?" quizzes. Photos stay locally on the device.
- **Wonder Flashcards**: 16 topic decks going beyond animals (food, transport, family, helpers, body, places, feelings, opposites, nature, etc.).
- **Recorded field sounds**: genuine sourced recordings for nine animals, including four newly sound-enabled species, plus sourced emergency vehicles, motorcycle, car horn, bicycle bell and door knocking.
- **Knock Knock! Door Safety**: a gentle, animated, interactive, parent-friendly safety walkthrough with real door knocking.
- Animal atlas **123 species, 34 sound files**; object cards **45 objects, 17 matching audio effects**. Remaining cards pronounce the name rather than play a misleading sound.

Build with `bash build-apk.sh v1.3`, using the same test signer and package as v1.1/v1.2. This release still needs real Android-device testing and is not Play Store ready.

## What is included

- Offline Android landscape WebView app, English, storybook visual style.
- All child-facing screens are fixed and **do not scroll**.
- Four independently packaged releases: **v0.3 (6 worlds/57 modes), v0.5
  (12 worlds/105 modes), v0.8 (18 worlds/153 modes), v1.0 (24 worlds/201 modes)**.
- The **v1.1 update** retains 24 worlds/201 modes while adding sampled piano, xylophone, drums, four original speaking guides and three offline animal mini-films.
- **v1.2 (24 worlds/206 selectable modes)** adds the actual full-canvas Sketch Pad, 52-step alphabet journey, 100-step number journey, 122-species animal flashcards, 40 object cards, 30 animal sound clips, 12 matched object effects and a gentle original piano background melody.
- Twelve moving Balloon Pop themes: alphabet, colors, numbers, shapes, animals,
  original cartoon-themed characters, fruit, food, vehicles, weather, toys, letter clues.
- Nine sorting modes: colors, shapes, size, pattern, food, habitat, toys, weather, tools.
- Eleven animal games in v1.2 including audio-led tracks, animal foods, babies, animal flashcards and object-sound flashcards.
- Nine memory decks, nine tracing themes, nine tappable coloring pictures and a separate full-canvas sketchpad.
- Eighteen additional themed worlds arranged in six fixed-grid learning lands
  covering phonics, numbers, stories, puzzles, music, vehicles, coding, nature,
  science, pretend play, emotions, life skills, building, body/safety, movement,
  arcade play, festivals and cooking.
- Twelve shared expansion engines: quiz, sequence, counting, storytelling,
  picture matching, music, simple arrow coding, scene building, pretend play,
  movement cards, floating-object tapping and continuous lessons.
- Spoken prompts via the device's installed Android Text-to-Speech voice.
- v1.2 bundles 30 species-specific animal sound clips and speaks the names of animals without clips; 12 matched object effects. Some CC0 clips are generated sound effects, not wildlife field recordings.
- Locally stored age/profile, activity completions, answer accuracy and settings.
- Parent-only arithmetic gate. No advertisements, analytics, network requests,
  purchases, accounts, or Android permissions.

## Current prototype limitations

- It is an installable **prototype** intended for user/device testing, not Play
  Store submission, clinical/developmental assessment, or commercial launch.
- The 30 animal clips need expert sound-quality and species-accuracy review before commercial launch; 92 animal encyclopedia cards are name-only for now.
- Text-to-Speech requires an English voice installed on the Android device.
- Tracing checks drawing effort rather than precise letter-stroke recognition.
- Some activity modes share a reusable game mechanic; production needs richer
  content banks, curricula, and structured age-specific levels.
- The demo APK uses a self-generated development signing key. Protect and retain
  a separate production signing key before launch.
- The v1.1 test APK has package ID `com.littlewonderworld.app.v11` and an independent test signing key: it installs alongside v1.0 and does not inherit its progress.
- v1.2 uses that same test package ID and local test signer to update v1.1. It does not update v1.0.
- Test on several phones and tablets (small landscape screens, touch accuracy,
  Android lifecycle, accessibility, audio settings) before release.

## Build

Requirements: JDK 17 and Android SDK API 35/build-tools 35.0.0.
The build script looks for the SDK at `/tmp/lww-v2-tools/sdk` unless
`LWW_ANDROID_SDK` is supplied; `setup-android.sh` may create a different local SDK path.

```bash
bash setup-android.sh
bash build-apk.sh v0.3
bash build-apk.sh v0.5
bash build-apk.sh v0.8
bash build-apk.sh v1.0
bash build-apk.sh v1.1
bash build-apk.sh v1.2
bash build-apk.sh v1.3
bash build-apk.sh v1.4
bash build-apk.sh v1.4.1
bash build-apk.sh v1.4.2
node smoke-roadmap.js
node qa-v14.js
node qa-v141.js
node qa-v142.js
```

Generated APKs are `LittleWonderWorld-v0.3.apk` through
`LittleWonderWorld-v1.4.2.apk`. The build supports `LWW_ANDROID_SDK` and `LWW_KEYSTORE` environment variables; v1.4.2 updates v1.3/v1.4/v1.4.1 in test installations.
Read `RELEASE_NOTES.md` and `BENCHMARK_REPORT.md` for tested capabilities, gaps,
the comparison against top preschool apps and the production-quality gates.

## Audio attribution / license

Seven sound clips are selected from **Baby Animals - Sounds Pack** by
Technopeasant at OpenGameArt.org, licensed **CC0 1.0**:
https://opengameart.org/content/baby-animals-sounds-pack

These clips were converted from OGG to MP3 for Android compatibility. The
source page states all included assets were released under CC0. The remaining
sound effects and imitations are programmatically generated by the app.
See `ASSET_CREDITS.md` for the recorded instruments and animal film licenses added in v1.1.

## Privacy design

Everything in this demo runs locally. The manifest requests no permissions and
does not request Internet access. No personal data is collected or transferred.
Before production launch, complete applicable Google Play Families, accessibility,
privacy, content, store listing, and in-app payment reviews.

## WebView compatibility fix v2.0.1

Android 6/API 23 remains the OS minimum. **Android System WebView 74 or newer is
required**; older factory WebViews on Android 6 must be updated. The supplied
API 29 diagnostic recorded WebView 74.0.3729.185. Optional chaining and nullish
coalescing in raw source prevented startup. Node 22 + `npm ci` installs the locked
Babel toolchain; `npm run stage` builds a clean `build/staged-assets` tree targeting
Chrome/WebView 74, and `npm test` validates ES2019 syntax, assets, and all 257
activity renders. `build-apk.sh` always regenerates and checks that tree before
packaging. Source JS intentionally retains modern syntax; do not package it directly.

The Real World catalog is generated from the existing JSON metadata into a local
script, avoiding unsupported `fetch(file://...)`. Unsupported `replaceChildren`
is replaced with `textContent`. Audio stops on panel close, tab changes and app
pause. The original package, file origin, localStorage keys and IndexedDB schema
remain unchanged. Unavailable media references are counted by QA and controls
remain hidden; no placeholder files are added. English TTS needs a locally
installed voice.

Build: `npm ci && LWW_ANDROID_SDK=/path/to/sdk bash build-apk.sh v2.0.1`.
The result is version code 21, package `com.littlewonderworld.app.v15`.
For update-compatible signing, provide `LWW_KEYSTORE`, `LWW_KEY_ALIAS`,
`LWW_STORE_PASSWORD`, and optionally `LWW_KEY_PASSWORD` through the environment.
Without those variables a new local test key is used, with a random password
outside the repository. It cannot update an APK signed by a different key.
**Do not uninstall an existing app containing wanted progress**: obtain its
original signing key and rebuild. Android uninstall removes local progress.

Real-device/emulator checks use a separate instrumentation APK, not debug hooks
in the delivered app. Build it with `bash scripts/build-android-test.sh`, then
run `bash scripts/run-android-test.sh` with `LWW_ANDROID_SDK` set and an emulator
connected. This disables emulator Wi-Fi/mobile data and exercises the packaged
app. CI retains its screenshots and Logcat. A passing render harness is not a
substitute for physical-device gesture, audible-output or curriculum review.
