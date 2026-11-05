# Little Wonder World — v1.4.1 Regression Restoration Audit

**Date:** 28 October 2026  
**Build:** `LittleWonderWorld-v1.4.1.apk` (Android test update, English, landscape, fully offline)  
**Baseline:** `LittleWonderWorld-v1.3-source.zip` and `FEATURE_AUDIT_V1_3.md`  
**Purpose:** Fix the v1.4 missing-flashcards perception and prove the full v1.3 activity inventory survives.

## 1. Root cause and repair

The previous v1.4 implementation changed the initial Animal Flashcards filter to **Real films**, selecting only the six video-enabled species out of 123. Although the rest of the atlas existed in the code, the opening experience made the animal encyclopedia appear to have been removed.

The new v1.4.1 experience is:

1. **Home → Discovery Island → Wonder Flashcards** (first world): all **16** themed decks for vehicles/sirens, fruit, vegetables, food, helpers, family, home, body, nature/weather, instruments, feelings, colors/shapes, places, opposites, birds and farm animals. Each card retains Previous, Next and Hear Name/Play Sound as applicable.
2. **Home → Discovery Island → Animal Sounds → All Animal Cards** (first mode): **123** named animal cards immediately, not six. The **With sounds** filter displays all **34** species with matching bundled calls; the others pronounce their name rather than play an unrelated noise.
3. **Animal Sounds → Real Films** (second mode): six locally bundled, muted films. A film-enabled animal detail card also offers **Watch real film**, and **All 123 animals** returns directly to the full atlas.
4. **Animal Sounds → Object Sound Cards** (third mode): all **45** named object cards, including **17** with appropriate audio clips.

## 2. Full v1.3 learning-world comparison

The regression test captures the exact v1.3 world-to-mode-ID inventory and asserts that every old mode exists in v1.4.1. There are **zero removed v1.3 modes**.

| World (v1.3 baseline) | v1.3 modes | v1.4.1 modes | Status |
| --- | ---: | ---: | --- |
| Color & Shape Sorting | 9 | 9 | Retained |
| Animal Sounds | 11 | **12** | Retained + dedicated Real Films |
| Memory Matching | 9 | 9 | Retained |
| Alphabet Tracing | 9 | 9 | Retained |
| Coloring Studio | 10 | 10 | Retained |
| Balloon Pop Adventure | 12 | 12 | Retained |
| Alphabet & Phonics | 9 | 9 | Retained |
| Numbers & Math | 9 | 9 | Retained |
| Read-aloud Stories | 8 | 8 | Retained |
| Puzzles & Logic | 8 | 8 | Retained |
| Music & Rhythm | 8 | 8 | Retained |
| Vehicles & Helpers | 8 | 8 | Retained |
| Early Coding | 8 | 8 | Retained |
| Plants & Nature | 8 | 8 | Retained |
| Science & Space | 8 | 8 | Retained |
| Pretend Play | 8 | 8 | Retained |
| Feelings & Friendship | 8 | 8 | Retained |
| Everyday Skills | 8 | 8 | Retained |
| Building & Design | 8 | 8 | Retained |
| Body & Safety | 9 | 9 | Retained (including Knock Knock! Door Safety) |
| Movement & Mindfulness | 8 | 8 | Retained |
| Wonder Mini Arcade | 8 | 8 | Retained |
| Festivals & Seasons | 8 | 8 | Retained |
| Little Chef | 8 | 8 | Retained |
| Wonder Flashcards | 16 | 16 | Retained |
| My Family Album | 2 | 2 | Retained |
| **Total** | **225** | **226** | **All 225 old activities preserved** |

These numbers are selectable activity configurations, not 226 distinct game engines. All shared engines and the six original MVP games remain present.

## 3. Realistic animal content and the six offline films

New, locally stored, **realistic watercolor/gouache illustrations** were created for the six video species. These give young learners a clear whole-animal visual, instead of a tiny subject in a landscape movie frame. The new informational panel includes a simple home/habitat, baby, food and observation for each. The other 117 animal cards still use their familiar emoji or illustrations; broader photorealistic coverage has **not** been claimed.

| Animal | Illustrated learning card | Offline muted film | Footage source |
| --- | --- | --- | --- |
| Elephant | Yes | Yes, ~4.6 s | Wikimedia Commons, `Elephant.webm`, CC0 |
| Cow | Yes | Yes, ~4.6 s | Wikimedia Commons, `Cow in Cantabria.webm`, CC0 |
| Dog | Yes | Yes, ~4.6 s | Wikimedia Commons, `Miss Oreo (O-Dog).webm`, CC0 |
| Cat | Yes | Yes, ~4.6 s | Wikimedia Commons, `Stray cat from Istambul.webm`, CC0 |
| Horse | Yes | Yes, ~4.6 s | Wikimedia Commons, `Two Horse Drawn Covered Wagons.webm`, CC0 |
| Goat | Yes | Yes, ~4.6 s | Wikimedia Commons, `Anglo-Nubian goats grooming themselves.webm`, CC0 |

Each WebM's inspected stream inventory contains **video only, no audio stream**, with duration 4.600 s. Six locally extracted JPG stills serve as the video posters. Each new illustration also exists as an optimized JPG in the APK and an original high-resolution PNG in the source archive. Full media provenance is documented in `ASSET_CREDITS.md`.

## 4. v1.3 features confirmed in source/tests

- **16 Wonder Flashcard decks:** all retain an illustration, printed term, previous/next, hear/play action; all deck modes render.
- **Animal atlas and sounds:** 123 species, 34 matching animal calls, including the nine separately source-verified recordings (cow, dog, horse, lion, elephant, goose, beluga whale, orca and cricket). The other 25 matched calls may be labelled sample effects, not verified field recordings; 89 species remain name-only.
- **Object cards:** 45 named objects, 17 with sound files (including emergency sirens, vehicle sounds and door knocking).
- **Family Album:** parent photo editor, roles/names, up to 16 local images, child-facing family cards and Who's Who? quiz. Existing storage key `lww3_family` remains unchanged.
- **Stories & safety:** three-step Knock Knock! Door Safety interactive story, plus earlier read-aloud stories.
- **Learning & making:** full tracing decks and continuation, 52-letter ABC Journey, 1–100 numbers journey, sketchpad and locally saved art, coloring, memory, sorting, all 12 Balloon Pop themes, coding, music and remaining worlds.
- **Parent Corner:** learning progress/accuracy, gallery, family manager, guides, age, voice/music/effects and reduced-motion controls retained.
- **v1.4 enhancements preserved:** compact child-first layout, large tracing surface/Next/Skip, distinct letter tiles and foreground/background media pausing.
- **Privacy/offline:** no advertising, account, payment, Internet permission or streamed media added in this corrective update.

## 5. Automated verification

| Gate | Result |
| --- | --- |
| `node smoke-roadmap.js` | PASS on all nine versions v0.3–v1.4.1; v1.4.1 26 worlds/226 modes |
| Exact v1.3 mode ID inclusion | PASS; all 225 prior modes retained |
| Exact v1.3 app source-asset path inclusion | PASS; no missing path listed by v1.3 archive |
| Browser UI 2400×1080 | PASS; atlas, 16-themed world, six films, family/safety, media loads, no JS errors |
| Browser UI 1000×480 | PASS; same navigation and media; child screen avoids body scrolling |
| Six original v1.4 improvements | PASS browser/code checks: lifecycle pause/resume, tracing C→D, Next/Skip and effort bar, full-width instruction strip, actual letter tiles, wide Draw Shapes, large film + Replay |
| Film display width | 54% of playfield at 2400×1080 and 52% at 1000×480; genuinely the main visual |
| Offline film payloads | PASS; six `.webm` videos, 4.600 seconds each, video-only streams |
| Optimized art/posters in APK | PASS; six watercolor JPGs plus six locally extracted poster JPGs |
| APK signature | PASS v1/v2/v3; exactly same development signing SHA-256 as v1.3/v1.4 |
| Android package & update sequencing | `com.littlewonderworld.app.v11`, versionCode 15 (v1.4 was 14), min SDK 23, target 35 |
| APK archive integrity | PASS; all entries decompress without errors |

## 6. What has NOT been proven yet

- Physical Android-device playback, video decoding on older Android versions, locked-screen behavior, headset audio focus, and any platform-specific installation issues.
- Child/parent usability testing, TalkBack/accessibility and color/print perception in diverse environments.
- Correct letter formation in tracing (only meaningful finger movement is measured).
- Zoological/editorial review of every animal fact, and professional illustration review of AI-assisted anatomy.
- Full realistic illustration/photo coverage for all 123 species (only six currently upgraded).
- Production family-photo security, backup/export, Play Families policy review and production signing.

This is a **signed functional test build**, not yet a market-ready preschool product. The v1.4.1 change is deliberately additive: it restores discoverability and retains every verified v1.3 learning activity while preserving the v1.4 improvements.
