# Little Wonder World 2.0 — Offline Hybrid Alpha

## What is implemented
- Uses v1.5.1 full Android source as buildable project foundation.
- Integrates v1.6.0 APK's updated `app.js`, `content.js`, `engines.js`, and `vivid.css` (Toy Box, tactile activities, phonics).
- Retains v1.5.1 storybook CSS layers, existing media, and Android offline wrapper.
- Adds an offline **Real World** gallery with five realistic animal images, five object images, and a 25-second local lesson video.
- Includes the supplied media pack and its original metadata and provenance reports.
- Does not claim absent authentic sounds or individual Veo videos are present. UI marks them unavailable.

## Build and test
The Android SDK and build tools were not available in this environment, so this deliverable is a **source project ZIP**, not a tested APK. Use Android build-tools 35 and JDK 17 with the existing build script, using `bash build-apk.sh v2.0.0`. Review and test all changes on actual Android hardware. The v1.6.0 code was recovered from the supplied APK, not from its original development source.

## Important caveats
- The media pack's QA_REPORT claims 100% pass even though all five animal sounds and all five individual movement videos are missing.
- Media licensing/provenance is not independently proven. Review rights before commercial distribution.
- Video and narration were codec-checked, not independently certified for spoken factual correctness.
- v1.6.0's parent hold-to-unlock behavior remains and requires redesign before public release.
- No new internet permissions were introduced.
- English is the currently available narrated video language; Telugu/Hindi subtitle files exist but need language review and conversion to WebVTT if used as HTML video tracks.

## Integration detail
`app/src/main/assets/hybrid-media.js` adds an isolated gallery, minimizing risk of breaking the v1.6.0 application engine. The gallery uses only local relative paths. Replace pending animal sound/video files in `media-pack/` and update metadata status fields when authenticated files are available.
