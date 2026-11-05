#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION="${1:-v1.0}"
case "$VERSION" in
  v0.3) VERSION_CODE=3 ;;
  v0.5) VERSION_CODE=5 ;;
  v0.8) VERSION_CODE=8 ;;
  v1.0) VERSION_CODE=10 ;;
  v1.1) VERSION_CODE=11 ;;
  v1.2) VERSION_CODE=12 ;;
  v1.3) VERSION_CODE=13 ;;
  v1.4) VERSION_CODE=14 ;;
  v1.4.1) VERSION_CODE=15 ;;
  v1.4.2) VERSION_CODE=16 ;;
  v1.5) VERSION_CODE=17 ;;
  v1.5.1) VERSION_CODE=18 ;;
  v2.0.0) VERSION_CODE=20 ;;
  *) echo "Use: bash build-apk.sh {v0.3|v0.5|v0.8|v1.0|v1.1|v1.2|v1.3|v1.4|v1.4.1|v1.4.2|v1.5|v1.5.1|v2.0.0}" >&2; exit 2 ;;
esac
SDK_DIR="${LWW_ANDROID_SDK:-/tmp/lww-v2-tools/sdk}"
BUILD="$PROJECT_DIR/build"
SRC="$PROJECT_DIR/app/src/main"
TOOLS="$SDK_DIR/build-tools/35.0.0"
PLATFORM="$SDK_DIR/platforms/android-35/android.jar"
MANIFEST="$SRC/AndroidManifest.xml"
if command -v javac >/dev/null 2>&1; then
  JAVAC=("$(command -v javac)")
  JAR=("$(command -v jar)")
elif [ -x /tmp/lww-build-tools/jdk-17.0.21.0.2+1/bin/javac ]; then
  JAVAC=(/tmp/lww-build-tools/jdk-17.0.21.0.2+1/bin/javac)
  JAR=(/tmp/lww-build-tools/jdk-17.0.21.0.2+1/bin/jar)
elif [ -x /tmp/lww-v2-tools/jdk-17.0.20.1+1/bin/javac ]; then
  JAVAC=(/tmp/lww-v2-tools/jdk-17.0.20.1+1/bin/javac)
  JAR=(/tmp/lww-v2-tools/jdk-17.0.20.1+1/bin/jar)
elif java --list-modules | grep -q '^jdk.compiler@'; then
  # Some slim runtimes include the JDK compiler modules without shell launchers.
  JAVAC=(java com.sun.tools.javac.Main)
  JAR=(java sun.tools.jar.Main)
else
  echo "JDK 17 is required: install it and put javac and jar on PATH." >&2
  exit 1
fi
mkdir -p "$BUILD/classes" "$BUILD/dex" "$BUILD/staged-assets"
if [ "$VERSION" = "v1.5" ] || [ "$VERSION" = "v1.5.1" ] || [ "$VERSION" = "v2.0.0" ]; then
  cp "$SRC/AndroidManifest-v15.xml" "$BUILD/AndroidManifest.xml"
  MANIFEST="$BUILD/AndroidManifest.xml"
fi
cp -R "$SRC/assets/." "$BUILD/staged-assets/"
cp "$PROJECT_DIR/releases/$VERSION.js" "$BUILD/staged-assets/release.js"
"${JAVAC[@]}" -source 8 -target 8 -cp "$PLATFORM" -d "$BUILD/classes" "$SRC/java/com/littlewonderworld/app/MainActivity.java"
"${JAR[@]}" cf "$BUILD/classes.jar" -C "$BUILD/classes" .
"$TOOLS/d8" --min-api 23 --lib "$PLATFORM" --output "$BUILD/dex" "$BUILD/classes.jar"
"$TOOLS/aapt" package -f -M "$MANIFEST" -S "$SRC/res" -A "$BUILD/staged-assets" -I "$PLATFORM" \
  --version-code "$VERSION_CODE" --version-name "$VERSION" -F "$BUILD/unsigned.apk"
cd "$BUILD/dex"
zip -q -j "$BUILD/unsigned.apk" classes.dex
"$TOOLS/zipalign" -f 4 "$BUILD/unsigned.apk" "$BUILD/aligned.apk"
if [ "$VERSION" = "v1.5" ] || [ "$VERSION" = "v1.5.1" ] || [ "$VERSION" = "v2.0.0" ]; then DEFAULT_KEYSTORE=/tmp/lww-v15-test.jks; else DEFAULT_KEYSTORE=/tmp/lww-v11-test.jks; fi
KEYSTORE="${LWW_KEYSTORE:-$DEFAULT_KEYSTORE}"
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -alias lww-v11-test -keystore "$KEYSTORE" -storepass wondertest123 -keypass wondertest123 \
    -dname "CN=Little Wonder World v1.1 Test,O=Little Wonder World,C=IN" -keyalg RSA -keysize 2048 -validity 3650 -noprompt
fi
"$TOOLS/apksigner" sign --ks "$KEYSTORE" --ks-key-alias lww-v11-test \
  --ks-pass pass:wondertest123 --key-pass pass:wondertest123 \
  --out "$PROJECT_DIR/LittleWonderWorld-$VERSION.apk" "$BUILD/aligned.apk"
"$TOOLS/apksigner" verify --verbose "$PROJECT_DIR/LittleWonderWorld-$VERSION.apk"
"$TOOLS/aapt" dump badging "$PROJECT_DIR/LittleWonderWorld-$VERSION.apk" | head -12
echo "Built: $PROJECT_DIR/LittleWonderWorld-$VERSION.apk"
