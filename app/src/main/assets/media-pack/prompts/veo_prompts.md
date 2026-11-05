# Little Wonder World 2.0 — Google Veo Video Production Prompts

## Video Generation Guidelines & Technical Specifications
- **Target Resolution**: 1280 × 720 (720p HD, 16:9 widescreen).
- **Target Duration**: 5.0 to 8.0 seconds per clip.
- **Target Codec**: H.264 (AVC) Baseline/High Profile, yuv420p, 24–30 fps.
- **Audio Codec**: AAC stereo, 128 kbps, 44.1 kHz.
- **Visual Continuity Rule**: To preserve child learner familiarity, the subject animal's appearance in the movement clip must strictly match the photographic still card in `animals/`. Provide the still image as an initial frame reference in Veo 2 / Image-to-Video mode where available.

---

## Batch 01 — Animal Movement Prompts (Veo 2 Specification)

### 1. Elephant Gentle Walking & Ear Flapping
* **Target File**: `videos/animals/elephant_movement.mp4`
* **Duration**: 6.0 seconds
* **Camera**: Medium full-body tracking shot moving slowly parallel to the elephant.
* **Prompt**:
  > `Cinematic wildlife documentary footage of an adult African bush elephant walking slowly and peacefully across a sunlit golden savanna. The elephant flaps its large ears gently to stay cool and swings its long trunk in a natural, calm rhythm. Natural daylight, warm savanna tones, realistic physics and skin wrinkles, stable tripod tracking shot, no people, no text, no logos, no violence, child-friendly educational clip.`
* **Reference Image**: `animals/wild/elephant.webp` (use as Image-to-Video seed).

### 2. Lion Head Turn & Peaceful Survey
* **Target File**: `videos/animals/lion_movement.mp4`
* **Duration**: 5.5 seconds
* **Camera**: Steady eye-level telephoto shot on a rocky outcrop.
* **Prompt**:
  > `An adult male African lion with a lush dark golden mane resting comfortably on a warm flat rock in the Serengeti. The lion calmly blinks its eyes, breathes steadily, and turns its head smoothly toward the camera with a majestic, gentle expression. Golden hour sunlight, shallow depth of field, gentle breeze rustling mane hairs, stable camera, no hunting, no aggression, peaceful educational footage.`
* **Reference Image**: `animals/wild/lion.webp`

### 3. Tiger Slow Prowl Through Forest
* **Target File**: `videos/animals/tiger_movement.mp4`
* **Duration**: 6.0 seconds
* **Camera**: Slow panning side-profile shot through dappled forest light.
* **Prompt**:
  > `A majestic Bengal tiger walking slowly and gracefully through green forest grass and dappled sunlight. Beautiful muscle movement beneath vibrant orange and black striped fur, calm steady pace, tail gently swaying. Natural wildlife documentary style, smooth camera pan, no roaring or aggression, completely calm and child-friendly educational scene.`
* **Reference Image**: `animals/wild/tiger.webp`

### 4. Golden Retriever Sitting & Wagging Tail
* **Target File**: `videos/animals/dog_movement.mp4`
* **Duration**: 5.0 seconds
* **Camera**: Ground-level medium shot at dog eye level.
* **Prompt**:
  > `A friendly Golden Retriever dog sitting happily on a sunny green park lawn. The dog wags its fluffy golden tail cheerfully back and forth, pants softly with a happy smile, and tilts its head with alert, playful curiosity. Bright natural daylight, vibrant green grass, ultra-realistic fur physics, steady camera, warm friendly tone for young children.`
* **Reference Image**: `animals/domestic/dog.webp`

### 5. Tabby Cat Cleaning Paw & Purring
* **Target File**: `videos/animals/cat_movement.mp4`
* **Duration**: 5.0 seconds
* **Camera**: Soft indoor macro-medium shot.
* **Prompt**:
  > `A cute short-hair tabby cat sitting comfortably on a soft woven rug in a brightly lit living room. The cat gently licks its front paw to groom itself, rubs its face with the paw, and blinks its green eyes in contented relaxation. Soft natural window lighting, gentle breathing movement, peaceful domestic scene for children.`
* **Reference Image**: `animals/domestic/cat.webp`

---

## Veo Production Workflow & Export Checklist
1. **Tool Access**: Run prompts in Google AI Studio / Google Vertex AI Veo 2 console.
2. **Settings**:
   - Aspect Ratio: `16:9`
   - Resolution: `720p`
   - Motion: `Low to Medium` (avoid high-speed jitter)
3. **Post-Processing with ffmpeg for Android WebView**:
   ```bash
   ffmpeg -i veo_raw_output.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -profile:v high -level 3.1 -pix_fmt yuv420p -an -movflags +faststart output_optimized.mp4
   ```
4. **Integration**: Copy the resulting MP4 into `LittleWonderWorld_MediaPack/videos/animals/<animal_id>_movement.mp4` and update `reports/missing_assets.csv`.
