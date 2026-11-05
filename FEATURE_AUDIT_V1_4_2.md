# Little Wonder World v1.4.2 — Full-Screen Real-Estate & Feature Preservation Audit

**Date:** 28 October 2026  
**Android package:** `com.littlewonderworld.app.v11`  
**New build:** `LittleWonderWorld-v1.4.2.apk`, versionCode 16  
**Baseline:** v1.3 (26 worlds/225 activities), v1.4 (225), v1.4.1 (226)

## Summary

**All 26 worlds and all 225 v1.3 activities are retained, plus the separate Real Films mode from v1.4.1 and the new Pop the Bubbles mode: 227 selectable activities.** None of the earlier 16 Wonder Flashcard themes, 123 animal names, 34 matching animal sounds, 45 object cards, 17 object sounds, family photos, safety story, music recordings or six muted locally bundled films were deleted.

The principal changes are substantial increases in the size of the *playable surface* on musical instruments, a real new Bubble Pop game and a small-screen fix for animal multiple-choice questions.

## 1. Music: before and after

The prior Piano/Xylophone play area was restricted by its duplicated title, text line and fixed ~50%-height instrument. v1.4.2 keeps the contextual instruction in the already compact top strip, then dedicates most of the remaining field to the instrument. The notes-played counter and Finish button share one slim bottom row.

| Landscape viewport | Piano key area (% playfield width × height) | Xylophone bars/frame area | Drums area |
| --- | --- | --- | --- |
| 800×360 | 97% × 72% | 97% × 72% | 97% × 72% |
| 1000×480 | 98% × 80% | 98% × 80% | 98% × 80% |
| 1280×720 | 97% × 85% | 97% × 85% | 97% × 85% |
| 2400×1080 | 99% × 89% | 99% × 89% | 99% × 89% |

Piano retains eight white notes, five raised black keys and the recorded acoustic offline samples. Xylophone retains eight pitch-shifted notes from its licensed offline acoustic sample. Drums retain six recorded percussion pads. The control test plays six Piano keys, checks that the Finish button enables and completes the activity, and checks that a Xylophone tap increments the count.

**Acoustic-quality limitation:** no new studio samples were recorded in this release. Xylophone still uses one source note pitch-shifted to several pitches. Real-device speaker/headphone evaluation and licensed multi-note samples remain future audio-quality work.

## 2. New: Pop the Bubbles

**Where:** Home → Adventure Funfair → Wonder Mini Arcade → **Pop the Bubbles** (first tile). The older **Bubble Catch** remains a separate game.

- Rounded translucent pastel bubbles arranged in a predictable 3-row grid without overlapping neighbors.
- Age 2–3: **9** pops, age 4–5: **12**, age 5–6: **15**.
- Each unique bubble tap triggers the existing gentle pop sound, disappears into a sparkle, updates a visible progress count and may announce every third pop when speech is on.
- The same bubble cannot score twice; tapping a wrong part of the field has no penalty. No countdown, racing, in-app purchases or advertisements.
- After all bubbles are popped, the regular celebration screen appears and the activity is recorded in local progress.
- The bubble visuals are CSS-native; they work offline and respect the app's reduced-motion setting.
- Tested clickable bubble targets remain approximately 52–165 pixels across the four viewports.

## 3. Whole-app screen real-estate review

The updated browser QA traversed all **227 game activities** plus **40 navigation/onboarding/land/mode-selection/Parent Corner screens** independently at four landscape resolutions: 800×360, 1000×480, 1280×720 and 2400×1080. That is 908 activity-screen render checks and 160 navigation-screen checks. It inspected field overflow, out-of-bounds active controls, missing navigation entries and JavaScript errors.

| Screen area | Observation/action | Result |
| --- | --- | --- |
| Home and six lands | Six lands, all world entries reachable | PASS |
| All world activity selectors | First/second pages show expected mode tiles | PASS |
| Music | Piano, Xylophone, Drums made much taller and wider | PASS; ratios above |
| Animal Foods with six choices | Prior two-row answers squeezed labels at 800×360 | FIXED: smaller hero, 3-column answer grid with two rows |
| Letter Hunt / phonics | Large real-letter answer boxes remain | PASS |
| Alphabet and shape tracing | Expanded guide and Next/Skip retained | PASS in prior v1.4.1 acceptance |
| Animal encyclopedia | All 123 named cards default, realistic images for six, 34-call filter | PASS |
| Real Films | Six offline, muted clips with replay | PASS |
| Family Album and Parent Corner | Parent screens remain available | PASS structural |
| Sketch Pad | Custom full-canvas screen, intentionally not `.playfield` | PASS |
| Balloon Pop | Moving balloons intentionally enter and exit a clipped road scene | PASS; motion is intentional, not a clipped static button |
| New Pop the Bubbles | Separate interactive grid, no duplicate scoring, age levels, completion | PASS |

**Outcome:** 0 actionable overflow or off-screen control findings across the tested sizes. The browser simulation is not a substitute for real-device touch testing or TalkBack review.

## 4. Regression and packaging gates

- `node smoke-roadmap.js`: **PASS** for all ten historical releases from v0.3 through v1.4.2; current release has 26 worlds, **227** selectable activities and 13 shared interaction types. Tests verify that the complete v1.3 world/mode-ID inventory is a subset of v1.4.2.
- `node qa-v141.js`: v1.4.1 restoration/media/tracing regression checks are independent and retained.
- `node qa-v142.js`: **PASS** four landscape viewports, all 227 game renders, all 40 navigation renders, gameplay touch events and no JavaScript errors.
- Six animal videos remain video-only WebM assets, approximately 4.6 s each, with CC0 attribution and offline still posters; six original watercolor animal illustrations remain bundled. See `ASSET_CREDITS.md` and `FEATURE_AUDIT_V1_4_1.md`.
- All file paths that existed under `app/src/main/assets/` in the v1.3 source archive remain present in the new APK.
- Signed with the same **development/test** certificate and package ID as the v1.3/v1.4/v1.4.1 builds. Increasing versionCode to 16 allows normal in-place upgrading when the installed APK uses that same signer.
- No Internet permission, advertising SDK, tracking service or payment subsystem added.

## 5. What still needs hands-on review

1. Install/update v1.3 or v1.4 → v1.4.2 on a real Android phone, check progress and family pictures persist, and lock/unlock while a music note, background music or film is active.
2. Play Piano/Xylophone on phone speakers and headphones. Compare note timbre, volume uniformity, tap latency, black-key accuracy and stereo behavior. Consider multi-sampled Xylophone and a full velocity/notes recording set for later production.
3. Have a parent and preschooler test bubble diameter, visual feedback, calm pacing, button legibility and fatigue. Include both right- and left-hand use.
4. Review display cutouts, very narrow phone ratios, TalkBack/focus order, color contrast and font scaling on multiple devices.
5. Validate drawing/tracing correctness and curriculum content; current tracing only measures meaningful gesture distance, not actual letter-form accuracy.

This is a **functional test APK**, not a claim of production readiness. The automated evidence supports preservation of all v1.3 content and improved responsive layout, with the above real-device gates still open.
