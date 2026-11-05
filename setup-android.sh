#!/usr/bin/env bash
set -euo pipefail
SDK_DIR=/tmp/lww-build-tools/android-sdk
TOOLS_ZIP=/tmp/lww-build-tools/cmdline-tools.zip
mkdir -p "$SDK_DIR/cmdline-tools"
if [ ! -f "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" ]; then
  unzip -qo "$TOOLS_ZIP" -d "$SDK_DIR/cmdline-tools"
  mv "$SDK_DIR/cmdline-tools/cmdline-tools" "$SDK_DIR/cmdline-tools/latest"
fi
yes | "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK_DIR" --licenses >/tmp/lww-build-tools/license-log.txt || true
"$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK_DIR" "platforms;android-35" "build-tools;35.0.0"
echo "Android build tools installed."
