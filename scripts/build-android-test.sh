#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SDK="${LWW_ANDROID_SDK:?Set SDK path}"
T="$SDK/build-tools/35.0.0"
B="$ROOT/build/android-test"
mkdir -p "$B/classes" "$B/dex"
cat > "$B/AndroidManifest.xml" <<'XML'
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.littlewonderworld.qa">
<uses-sdk android:minSdkVersion="23" android:targetSdkVersion="35"/>
<application android:label="LWW QA"/>
<instrumentation android:name="com.littlewonderworld.qa.AndroidSmoke" android:targetPackage="com.littlewonderworld.app.v15"/>
</manifest>
XML
java com.sun.tools.javac.Main -source 8 -target 8 -cp "$SDK/platforms/android-35/android.jar" -d "$B/classes" "$ROOT/scripts/AndroidSmoke.java"
java sun.tools.jar.Main cf "$B/classes.jar" -C "$B/classes" .
"$T/d8" --min-api 23 --lib "$SDK/platforms/android-35/android.jar" --output "$B/dex" "$B/classes.jar"
"$T/aapt" package -f -M "$B/AndroidManifest.xml" -I "$SDK/platforms/android-35/android.jar" -F "$B/raw.apk"
(cd "$B/dex" && zip -q -j "$B/raw.apk" classes.dex)
"$T/zipalign" -f 4 "$B/raw.apk" "$B/aligned.apk"
export LWW_STORE_PASSWORD="${LWW_STORE_PASSWORD:-$(cat "${TMPDIR:-/tmp}/lww-compat-test.jks.password")}"
"$T/apksigner" sign --ks "${LWW_KEYSTORE:-${TMPDIR:-/tmp}/lww-compat-test.jks}" --ks-key-alias "${LWW_KEY_ALIAS:-lww-test}" --ks-pass env:LWW_STORE_PASSWORD --out "$B/qa.apk" "$B/aligned.apk"
