# Little Wonder World 2.0 — ChatGPT & Android Integration Instructions

## Target Audience
This guide is specifically written for the **ChatGPT Development Assistant** and the **Android Engineering Team** responsible for integrating the media pack into the existing Little Wonder World Android application.

No access to prior Gemini conversations or external cloud APIs is required. Everything needed is self-contained within this ZIP archive (`LWW_MediaPack_Batch01.zip`).

---

## 1. Directory Tree & Asset Placement

Extract the ZIP into your Android project's `app/src/main/assets/` directory:

```text
app/src/main/assets/
└── LittleWonderWorld_MediaPack/
    ├── manifest.json                  <-- Master asset manifest with SHA-256 hashes
    ├── README.md                      <-- High-level overview
    ├── LICENSES.csv                   <-- Commercial & educational rights matrix
    ├── QA_REPORT.md                   <-- Complete validation test results
    ├── INTEGRATION_INSTRUCTIONS.md    <-- This integration guide
    ├── animals/
    │   ├── domestic/                  <-- dog.webp, cat.webp
    │   └── wild/                      <-- elephant.webp, lion.webp, tiger.webp
    ├── objects/
    │   ├── fruits/                    <-- apple.webp, banana.webp, mango.webp
    │   ├── vehicles/                  <-- bus.webp, car.webp
    │   └── shapes/                    <-- circle.svg, square.svg, triangle.svg, star.svg, heart.svg
    ├── videos/
    │   └── animal_lessons/            <-- wild_and_domestic_animals_lesson.mp4, *.srt subtitles
    ├── audio/
    │   └── narration/                 <-- wild_and_domestic_animals_lesson_en.mp3
    ├── thumbnails/                    <-- wild_and_domestic_animals_thumb.webp
    ├── metadata/                      <-- animals.json, objects.json, lessons.json, translations_*.json
    ├── prompts/                       <-- Master image and Veo prompt recipes
    └── reports/                       <-- asset_inventory.csv, missing_assets.csv, optimization_report.csv
```

---

## 2. Parsing Metadata in Android

### A. Animals Metadata (`metadata/animals.json`)
Each item contains:
- `id`: Unique string key (e.g., `"wild_elephant"`, `"domestic_dog"`).
- `common_name`: English name.
- `scientific_name`: Latin binomen.
- `category`: `"wild"` or `"domestic"`.
- `facts`: Array of 2 child-friendly strings.
- `image_filename`: Relative path from the pack root (e.g., `"animals/wild/elephant.webp"`).
- `audio_filename`: Relative path to animal sound (e.g., `"audio/animal_sounds/elephant_trumpet.mp3"`).
- `video_filename`: Relative path to movement video (e.g., `"videos/animals/elephant_movement.mp4"`).

### B. Objects Metadata (`metadata/objects.json`)
Contains items for fruits, vehicles, and vector shapes with:
- `id`: e.g. `"fruit_apple"`, `"vehicle_bus"`, `"shape_circle"`.
- `name`: English object name.
- `category`: `"fruits"`, `"vehicles"`, or `"shapes"`.
- `color`: Primary color.
- `learning_prompt`: Interactive question for the child.
- `image_filename`: Relative path to `.webp` or `.svg`.

### C. Multilingual Support (`metadata/translations_{en,te,hi}.json`)
To switch the app language dynamically:
1. Load `translations_en.json` (English), `translations_te.json` (Telugu), or `translations_hi.json` (Hindi).
2. Lookup by `category` and `animal_id` to retrieve translated names, phonetics/transliterations, facts, and interactive activities.
3. For videos, load the corresponding subtitle track:
   - English: `wild_and_domestic_animals_lesson.srt`
   - Telugu: `wild_and_domestic_animals_lesson.te.srt`
   - Hindi: `wild_and_domestic_animals_lesson.hi.srt`

---

## 3. WebView Offline Playback & Best Practices

1. **Local Asset Loading**:
   Use `file:///android_asset/` or the AndroidX `WebViewAssetLoader` (recommended for modern Android):
   ```java
   WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
       .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(context))
       .build();
   ```
2. **HTML5 Video Playback**:
   The packaged lesson video `wild_and_domestic_animals_lesson.mp4` is encoded in standard **H.264 Baseline/High Profile Level 3.1 with AAC audio**. It plays natively in HTML5 `<video>` tags:
   ```html
   <video width="100%" height="auto" controls poster="thumbnails/wild_and_domestic_animals_thumb.webp">
       <source src="videos/animal_lessons/wild_and_domestic_animals_lesson.mp4" type="video/mp4">
       <track label="English" kind="subtitles" srclang="en" src="videos/animal_lessons/wild_and_domestic_animals_lesson.srt" default>
       <track label="Telugu" kind="subtitles" srclang="te" src="videos/animal_lessons/wild_and_domestic_animals_lesson.te.srt">
       <track label="Hindi" kind="subtitles" srclang="hi" src="videos/animal_lessons/wild_and_domestic_animals_lesson.hi.srt">
   </video>
   ```
3. **WebP and SVG Support**:
   - WebP images load natively in Android WebView across all supported Android versions (Android 4.2+).
   - SVG vector files in `objects/shapes/` render with zero pixelation and can be embedded directly via `<img>` tags or inline `<svg>`.

---

## 4. Handling Missing or Pending Assets

Consult `reports/missing_assets.csv` for any asset marked pending:
1. **Authentic Animal Sounds**:
   - The pilot package intentionally omits synthetic animal sounds to avoid misrepresenting real animal vocalizations.
   - When authentic field recordings (e.g. from Freesound CC0 or Macauley Library) are acquired, drop them directly into:
     `audio/animal_sounds/<animal_id>.mp3`
   - The metadata references in `animals.json` already point to these exact relative paths. No code changes required!
2. **Google Veo 2 Movement Clips**:
   - Run the ready-to-use prompts from `prompts/veo_prompts.md` in the Google Veo / Vertex AI studio.
   - Export 720p H.264 MP4 clips and place them into `videos/animals/<animal_id>_movement.mp4`.

---

## 5. Summary of Ready-to-Integrate Assets in Batch 01
- **10 Photographic Learning Cards** (5 Animals + 5 Objects) in optimized WebP.
- **5 Precision Vector Shapes** in SVG.
- **1 Complete 25-Second Educational Video Lesson** with subtitles and standalone narration audio.
- **1 16:9 Video Thumbnail**.
- **6 JSON Metadata and Translation Files** (Complete schemas + EN, TE, HI language packs).
- **4 Comprehensive Documentation & Audit Files** (`manifest.json`, `README.md`, `LICENSES.csv`, `QA_REPORT.md`).
