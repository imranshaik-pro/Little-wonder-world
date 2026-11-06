#!/usr/bin/env bash
set -euo pipefail
ADB="${LWW_ANDROID_SDK:?}/platform-tools/adb"
mkdir -p evidence
"$ADB" install --no-incremental -r LittleWonderWorld-v2.0.1.apk
"$ADB" install --no-incremental -r build/android-test/qa.apk
"$ADB" shell svc wifi disable
"$ADB" shell svc data disable
"$ADB" shell settings put secure immersive_mode_confirmations confirmed
"$ADB" logcat -c
"$ADB" shell am instrument -w com.littlewonderworld.qa/com.littlewonderworld.qa.AndroidSmoke | tee evidence/instrumentation.txt
"$ADB" logcat -d -v time > evidence/android-full.log
"$ADB" logcat -d -b crash -v time > evidence/android-crash.log
"$ADB" pull /sdcard/Android/data/com.littlewonderworld.app.v15/files/. evidence/
"$ADB" shell dumpsys webviewupdate > evidence/webview.txt
"$ADB" shell dumpsys activity activities > evidence/activities.txt
grep -q 'PASS COMPLETE' evidence/android-full.log
! grep -E 'Uncaught (SyntaxError|ReferenceError|TypeError)|FATAL EXCEPTION' evidence/android-full.log
"$ADB" shell input keyevent KEYCODE_HOME
"$ADB" shell am start -W -n com.littlewonderworld.app.v15/com.littlewonderworld.app.MainActivity > evidence/resume.txt
"$ADB" shell am force-stop com.littlewonderworld.app.v15
"$ADB" shell am start -W -n com.littlewonderworld.app.v15/com.littlewonderworld.app.MainActivity > evidence/relaunch.txt
"$ADB" shell am instrument -w -e verify true com.littlewonderworld.qa/com.littlewonderworld.qa.AndroidSmoke | tee evidence/relaunch-verification.txt
"$ADB" logcat -d -v time > evidence/android-full.log
"$ADB" pull /sdcard/Android/data/com.littlewonderworld.app.v15/files/relaunch.png evidence/relaunch.png
grep -q 'PASS RELAUNCH' evidence/android-full.log
