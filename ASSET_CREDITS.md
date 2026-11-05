# Little Wonder World v1.1 — audio & footage attribution

All media in the app is bundled locally for offline playback. The guide characters and user-interface drawings are original artwork created for Little Wonder World.

## Recorded piano

- Source: [Meta Open Sound, `meta-piano` recordings](https://github.com/facebookincubator/Meta-open-sound/tree/main/systems/instruments/meta-piano).
- License: CC0 1.0 / public-domain dedication as stated by Meta Open Sound.
- Adaptations: selected velocity-3 notes C4–C5 trimmed to 2.6 seconds, faded out, and converted from OGG to MP3. Sharps are played one semitone above the preceding recorded white key.

## Recorded xylophone

- Source: [Nathan Brosowsky, `tonejs-instruments`, xylophone sample](https://github.com/nbrosowsky/tonejs-instruments/tree/master/samples/xylophone). The source-info file credits Versilian Studios' VSO2 collection as the underlying recording source.
- License: [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/) as specified in that repository's README. Credit to Nathan Brosowsky and Versilian Studios.
- Adaptations: sample C5 is pitch-shifted in playback for the eight-bar instrument. The original MP3 recording is included unchanged.
- v1.5 adaptation: seven additional pitch-shifted **offline MP3 note files**
  (C4 through B4) are rendered from that same attributed C5 recording using
  FFmpeg, as a more reliable per-key source than changing `playbackRate` in an
  Android WebView. The original C5 file is retained.

## Recorded drums

- Source: [SFXMint Acoustic Drum Kit](https://sfxmint.com/sets/acoustic-drum-kit).
- License: CC0 1.0 as indicated by the sample set API. Six selected acoustic drum/cymbal recordings included without editing.

## Animal mini-films

Footage is from [Wikimedia Commons](https://commons.wikimedia.org) and confirmed CC0 1.0 through the Wikimedia file metadata API. Each is adapted into a muted ~4-second, 220-pixel-high WebM video for offline child-friendly playback.

- [Cow in Cantabria](https://commons.wikimedia.org/wiki/File:Cow_in_Cantabria.webm) — CC0 1.0
- [Miss Oreo (O-Dog)](https://commons.wikimedia.org/wiki/File:Miss_Oreo_(O-Dog).webm) — CC0 1.0
- [Elephant](https://commons.wikimedia.org/wiki/File:Elephant.webm) — CC0 1.0

Other animals in the app still use the illustrated interface and their corresponding recorded or synthesized animal calls; they do not yet have footage.

## v1.4 real-animal film upgrade

The original three CC0 films (Cow in Cantabria, Miss Oreo, Elephant) were re-cut from the original uploads at up to 480p, muted, and compressed for larger offline playback. Three additional CC0 films were adapted the same way into approximately 4.6-second silent snippets:

- [Stray cat from Istambul](https://commons.wikimedia.org/wiki/File:Stray_cat_from_Istambul.webm) — ErikaGuetti, CC0 1.0; real cat
- [Two Horse Drawn Covered Wagons](https://commons.wikimedia.org/wiki/File:Two_Horse_Drawn_Covered_Wagons.webm) — Thomas Farley, CC0 1.0; horses walking with wagons
- [Anglo-Nubian goats grooming themselves](https://commons.wikimedia.org/wiki/File:Anglo-Nubian_goats_grooming_themselves.webm) — Rivadavia.vila, CC0 1.0; real goats

There are **six** video-enabled animal cards in v1.4. All other animals retain a large, recognizable illustrated image instead of a video, and the footage stays muted so narrated instructions and intentionally selected animal calls remain distinct.

## v1.4.1 animal learning artwork and video posters

Six original, AI-assisted storybook watercolor illustrations were generated for Little Wonder World: Elephant, Cow, Dog, Cat, Horse and Goat. The full-resolution source images (`artwork-sources/*-illustration.png`) are preserved in the source archive; optimized offline display assets are `app/src/main/assets/animal-stills/*-illustration.jpg`. They are **illustrations**, not wildlife photos. The six animals also have still frames extracted from the CC0 video footage above (`animal-stills/*.jpg`) for offline film posters. Other encyclopedia cards retain their previous illustrated/emoji artwork.

The illustration-generation brief specified a naturalistic watercolor/gouache style, a whole recognizable animal, accurate silhouette, uncluttered meadow and no captions or watermarks. Animal artwork and learning facts still require editorial review before commercial release.

## Other existing app media

Seven animal calls provided by the v1.0 project under `app/src/main/assets/sounds/` are retained without modification. See the original release documentation for their provenance.

The bundled `fonts/NotoColorEmoji.ttf` is the open-licensed [Google Noto Emoji](https://github.com/googlefonts/noto-emoji) font, distributed under the [SIL Open Font License 1.1](https://openfontlicense.org/open-font-license-official-text/).

## v1.2 additional audio

- **Music:** `music/wonder-garden.mp3` is a new, original short background composition assembled from selected CC0 `meta-piano` notes above, mixed and looped at low volume. It does not reproduce a commercial nursery-rhyme tune.
- **Animal calls:** Fifteen CC0 clips in `sounds/extended/` originated in the previous Little Wonder World v0.2 prototype's [SFXMint Animal Calls](https://sfxmint.com/sets/animal-calls) set; fifteen additional species-specific CC0 sound effects (including elephant, tiger, dolphin, eagle and others) are from [SFXMint Animal Sounds](https://sfxmint.com/category/animal).
- **Object sound effects:** Twelve CC0 effects (car horn, train whistle, bicycle bell, truck horn, helicopter rotor, doorbell, telephone ring, clock tick, rain, thunder, water and bell) are from [SFXMint](https://sfxmint.com/category/vehicle) and its [sound catalog](https://sfxmint.com/). They are retained as offline MP3 files under `sounds/objects/`.
- SFXMint explicitly states that some content is AI-generated or procedurally synthesized. These are species- or object-labelled effects, **not independently certified field recordings**. The child interface distinguishes cards with sound clips from cards that can only speak their names.
- Android's installed English text-to-speech engine still narrates the learning prompts. The build tries to select the best offline voice and speaks at a calmer pace, but human narration has not been recorded.

## v1.3 verified sound recordings

These are actual recordings from independently documented source media, not the synthetic/species-labelled effects used for some v1.2 animal cards. They were trimmed to short child-friendly clips (usually 2–6 seconds), normalized/downmixed, and encoded as local MP3s. Each adapted audio clip retains the original source license, including share-alike where required.

| Offline sound | Original recording and author | License |
| --- | --- | --- |
| Cow | [Mudchute Cow 1](https://commons.wikimedia.org/wiki/File:Mudchute_cow_1.ogg), Secretlondon, farm cow moo | CC BY-SA 3.0 |
| Dog | [George vuf 1996](https://commons.wikimedia.org/wiki/File:George_vuf_1996.ogg), Broadbeer, dog bark | Public domain |
| Horse | [Wiehern](https://commons.wikimedia.org/wiki/File:Wiehern.ogg), Hü, horse neigh | Public domain |
| Lion | [Lion raring sound](https://commons.wikimedia.org/wiki/File:Lion_raring-sound1TamilNadu178.ogg), தகவலுழவன், captive lion roar | Public domain |
| Elephant | [Elephant voice trumpeting](https://commons.wikimedia.org/wiki/File:Elephant_voice_-_trumpeting.ogg), தகவலுழவன் | CC0 1.0 |
| Goose | [Geese Honking (distant)](https://commons.wikimedia.org/wiki/File:Geese_Honking_(distant).ogg), US Fish and Wildlife Service | Public domain (US government) |
| Beluga Whale | [Beluga vocalizations](https://commons.wikimedia.org/wiki/File:Beluga_vocalizations.ogg), NOAA-supported scientific source | Public domain (NOAA source) |
| Orca | [Killer whale](https://commons.wikimedia.org/wiki/File:Killer_whale.ogg), National Park Service | Public domain (US government) |
| Cricket | [Field cricket Gryllus pennsylvanicus](https://commons.wikimedia.org/wiki/File:Field_cricket_Gryllus_pennsylvanicus.ogg), Thatcher | CC BY-SA 3.0 |
| Ambulance | [St John ambulance, Dunedin](https://commons.wikimedia.org/wiki/File:St_John_ambulance,_Dunedin,_New_Zealand.ogv), Benchill; extracted vehicle siren audio | CC BY-SA 3.0 |
| Fire Engine | [WWS Fireenginesiren](https://commons.wikimedia.org/wiki/File:WWS_Fireenginesiren.ogg), Work With Sounds / Konrad Gutkowski | CC BY 4.0 |
| Motorcycle | [Motorbike 1](https://commons.wikimedia.org/wiki/File:Motorbike_1.ogg), ezwa, motorcycle passing | Public domain |
| Car | [Car Horn](https://commons.wikimedia.org/wiki/File:Car_Horn.wav), 15HPanska_Ruttner_Jan | CC0 1.0 |
| Bicycle | [Bsumusictech bike-bell](https://commons.wikimedia.org/wiki/File:Bsumusictech_bike-bell.wav), a real bicycle bell | CC0 1.0 |
| Door knock | [Door knocker audio](https://commons.wikimedia.org/wiki/File:Door_knocker_audio.ogg), Mx. Granger | CC0 1.0 |

Corresponding adaptation paths: `sounds/field/*.mp3` for the nine animals, and `sounds/objects/*.mp3` for the six objects (replacing the former car and bicycle effects). All other v1.2 effects remain as credited above. **Do not represent the full animal catalog as authentic field recordings**: 34 of the 123 animal species have matching audio clips, only nine of which were separately source-verified in this release. Some remaining 25 species-specific clips are sample/effect assets; 89 cards read the animal name aloud rather than play a fake call.
