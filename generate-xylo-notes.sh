#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/app/src/main/assets/instruments"
src="xylophone-C5.mp3"
# Render each pitch to its own offline asset: playback on Android no longer
# depends on HTMLAudioElement.playbackRate support.
while read -r note ratio; do
  ffmpeg -hide_banner -loglevel error -nostdin -y -i "$src" \
    -af "asetrate=44100*$ratio,aresample=44100,atrim=duration=4.5" \
    -codec:a libmp3lame -q:a 4 "xylophone-$note.mp3"
done <<'NOTES'
C4 0.500000
D4 0.561232
E4 0.629961
F4 0.667420
G4 0.749154
A4 0.840896
B4 0.943874
NOTES
