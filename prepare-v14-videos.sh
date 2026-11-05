#!/usr/bin/env bash
set -euo pipefail
asset_dir="$(cd "$(dirname "$0")" && pwd)/app/src/main/assets/animal-videos"
# Public-domain CC0 videos credited in ASSET_CREDITS.md.
for animal in cow dog elephant cat horse goat; do
  source_path="/tmp/lww-v14-${animal}-original.webm"
  test -s "$source_path" || { echo "Missing media source: $source_path" >&2; exit 1; }
  ffmpeg -nostdin -y -hide_banner -loglevel error -ss 1 -i "$source_path" -t 4.6 \
    -vf 'fps=15,scale=854:480:force_original_aspect_ratio=decrease:force_divisible_by=2' \
    -an -c:v libvpx-vp9 -b:v 580k -crf 32 -deadline realtime -cpu-used 5 \
    "$asset_dir/${animal}.webm"
  ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$asset_dir/${animal}.webm"
done
