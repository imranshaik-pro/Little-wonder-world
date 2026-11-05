# Little Wonder World — Vivid Storybook Design System (v1.5.1)

**Audience:** children 2–6, guided by a grown-up as needed.
**Platform:** Android, landscape-first WebView; English in this build.
**Principle:** saturated colors for discoverable actions and expressive art;
calm backgrounds for visual breathing room. Do not assume one universal
preschool color preference: age, context, brightness and saturation interact.

## Tokens

| Role | Hex | Usage | Text color |
|---|---|---|---|
| Canvas | `#F3FAFF` | full-screen calm, cool background | `#20324A` |
| Card/surface | `#FFFFFF` | game, heading, reading surfaces | `#20324A` |
| Primary Play | `#FFB000` | Start, Surprise, Play Again | `#20324A` |
| Listen / Help | `#1769E0` | voice prompts, hints, tutorials | `#FFFFFF` |
| Next / correct | `#157F52` | validated Next, successful action | `#FFFFFF` |
| Stop / exit | `#C83439` | reserved for explicit stopping / destructive operations | `#FFFFFF` |
| Ink | `#20324A` | labels, instructions, counts, all light surfaces | — |
| Sunrise accent | `#F06A32` | Creative Garden card outline, character scarf | `#20324A` on light surface |
| Sun yellow | `#FFD43B` | stars, badges, cheerful illustration highlights | `#20324A` |
| Pink accent | `#FD4B8B` | caring characters, wellbeing decoration | `#20324A` on light surface |
| Light sky | `#E6F5FF` | Learning Land, alternating option | `#20324A` |
| Light mint | `#E8F8EC` | Discovery Island, alternating option | `#20324A` |
| Light peach | `#FFF0D6` | Creative Garden / warm answers | `#20324A` |
| Light lavender | `#F3EAFF` | Thinking Forest | `#20324A` |
| Light blush | `#FDE5ED` | Little Life Town | `#20324A` |
| Golden cream | `#FFF4CB` | Adventure Funfair | `#20324A` |

Checked contrast ratios: ink on canvas **12.33:1**, ink on Play orange
**7.09:1**, white on Help blue **5.08:1**, white on Continue green **5.01:1**,
white on Stop red **5.24:1**. These meet WCAG's 4.5:1 text-contrast
criterion; iconography and component boundaries require separate testing.
**Never use white labels on yellow or Play orange.**

## Main menu

1. Top bar: 8–12% height, nearly white with deep-ink branding. Parent Corner
   stays at the right, visually secondary and behind its parent gate.
2. Invitation band: 13–17% height, white. Buddy icon at left, a short
   welcoming sentence, **blue Hear** and **orange Surprise** on the right.
3. Six-land grid: remaining 68–76%; 4 equal columns × 2 rows, deliberately
   asymmetrical. Creative Garden spans the first two columns, row one; Thinking
   Forest spans the first two columns, row two. The other four lands occupy
   smaller single cells. Every card has an emoji, readable name, hint and count.
4. Card differentiation: Creative peach + sunrise outline; Learning sky +
   blue; Discovery mint + green; Thinking lavender + purple; Life blush +
   pink; Funfair gold + golden border. A thick colored edge reinforces each
   theme without requiring hue alone for recognition.
5. A toddler can tap the whole card. Avoid ads, moving carousels, tiny text,
   timers and simultaneous animated decorations in this navigation layer.

## Typical game

1. Top bar (10–12%): back at far left, short activity name in the center,
   voice plus progress on the right. Back uses a neutral warm surface.
2. Mission strip (10–15%): white canvas, buddy portrait at left; bold
   one-sentence instruction, quieter subtitle; **blue Listen** action at right.
3. Playfield (remaining 73–80%): white, rounded panel with strong separation
   from the calm-blue background. The focus object appears upper-middle.
4. Answer region (lower 35–45% of playfield): use 2–4 oversized answers,
   alternate sky/peach/mint lightly. Text ink, 3px card edges, and generous
   gaps. Do not rely on color to identify the right answer.
5. Confirmation: validated success adds green outline and positive spoken
   feedback. Wrong choices use a brief warm-orange outline and a helpful
   correction, never a humiliating red X. The green Next action is enabled
   only when tracing/game criteria are satisfied.
6. Instrument games are *not* forced into answer grids: keep full-height
   keyboard/bars, full-region touch mapping, multi-touch and drag-across
   feedback. Narrated read-aloud uses an illustrated page with
   read/repeat/next controls.

## Preschool interaction principles

- Make tappable elements at least 48 CSS px when space permits; music keys,
  card surfaces and primary controls are much larger. Verify physical size on
  actual phones and tablets rather than assuming CSS px always equal dp.
- One highlighted primary action per screen. Keep accent colors below about
  a quarter of the visual area as a practical design heuristic, not a proven
  developmental rule.
- Pair color with words, icons, animation and spoken prompts; do not make a
  green/red distinction the *only* route to understanding.
- Reward **effort and exploration**; no forced level changes at five rounds.
  Make Next / Play More / Home explicit choices.
- Run accessibility and child-observation QA across small phones, tablets,
  left/right-handed grips, and children 2–3 versus 4–6.

## Previous user-feedback checklist (carry-forward)

1. Piano/Xylophone: independent note samples and wider touch handling.
2. Tracing: path start, direction, coverage and order validation; show-me demo.
3. Counting: differentiated stars, apples, fish and addition activity mechanics.
4. Rhymes: 30 narrated rhyme-inspired **story** activities; **song-quality
   interactive musical productions are still a future phase**.
5. Thinking Forest: teacher-first mode order and contrasting card sizes/categories.
6. Creativity: Sketch Pad leads inside the coloring activities.
7. Little Life Town: toothbrushing has watch → guided practice → independent
   action, other life skills need the same approach in future.
8. Repeated-play games: milestones at five rounds, no automatic forced exit;
   naturally finite stories and lessons allow replay.

Remaining validation: real Android child testing; high-end piano timbre and
latency refinement; richer interactive nursery-rhyme music/animation;
additional life-skills teaching sequences and audit of repeated counting
prompts for pedagogic distinctness.
