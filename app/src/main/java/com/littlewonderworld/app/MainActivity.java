package com.littlewonderworld.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.net.Uri;
import android.graphics.Color;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.ValueCallback;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import java.util.Locale;

public class MainActivity extends Activity implements TextToSpeech.OnInitListener {
    private WebView web;
    private TextToSpeech voice;
    private volatile boolean voiceReady = false;
    private ValueCallback<Uri[]> photoPickerResult;
    private static final int PHOTO_PICK_REQUEST = 413;

    @Override
    public void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        voice = new TextToSpeech(this, this);
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(255, 250, 238));
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (photoPickerResult != null) photoPickerResult.onReceiveValue(null);
                photoPickerResult = callback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/*");
                try { startActivityForResult(Intent.createChooser(intent, "Choose a family photo"), PHOTO_PICK_REQUEST); }
                catch (Exception error) { photoPickerResult = null; callback.onReceiveValue(null); return false; }
                return true;
            }
        });
        web.addJavascriptInterface(new VoiceBridge(), "WonderNative");
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PHOTO_PICK_REQUEST && photoPickerResult != null) {
            Uri[] chosen = null;
            if (resultCode == RESULT_OK && data != null && data.getData() != null)
                chosen = new Uri[]{data.getData()};
            photoPickerResult.onReceiveValue(chosen);
            photoPickerResult = null;
        }
    }
    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            voiceReady = voice.setLanguage(Locale.US) >= TextToSpeech.LANG_AVAILABLE;
            // Prefer the best locally installed English voice: no network access needed.
            try {
                Voice selected = null;
                int bestScore = Integer.MIN_VALUE;
                if (voice.getVoices() != null) for (Voice candidate : voice.getVoices()) {
                    if (candidate.isNetworkConnectionRequired() || !"en".equals(candidate.getLocale().getLanguage())) continue;
                    int score = candidate.getQuality() + (Locale.US.equals(candidate.getLocale()) ? 100 : 0);
                    if (score > bestScore) { bestScore = score; selected = candidate; }
                }
                if (selected != null) voice.setVoice(selected);
            } catch (Exception ignored) { /* Android's default offline voice remains available. */ }
            voice.setSpeechRate(0.96f);
            voice.setPitch(1.02f);
        }
    }
    private class VoiceBridge {
        @JavascriptInterface
        public void speak(final String text) {
            if (!voiceReady || text == null || text.length() > 220) return;
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    if (voice != null) voice.speak(text, TextToSpeech.QUEUE_FLUSH, null, "wonder_prompt");
                }
            });
        }
        @JavascriptInterface
        public void stopSpeech() {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    if (voice != null) voice.stop();
                }
            });
        }
    }
    @Override
    public void onBackPressed() {
        if (web != null) web.evaluateJavascript("window.wonderBack && window.wonderBack()", null);
        else super.onBackPressed();
    }
    @Override
    protected void onPause() {
        // The screen may be locked while an HTML5 Audio element is looping.
        // Suspend JS media as well as native speech before Android backgrounds us.
        if (web != null) {
            web.evaluateJavascript("window.wonderPause && window.wonderPause()", null);
            web.onPause();
            web.pauseTimers();
        }
        if (voice != null) voice.stop();
        super.onPause();
    }
    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) {
            web.resumeTimers();
            web.onResume();
            web.evaluateJavascript("window.wonderResume && window.wonderResume()", null);
        }
    }
    @Override
    protected void onDestroy() {
        if (voice != null) { voice.stop(); voice.shutdown(); voice = null; }
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
