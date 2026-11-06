package com.littlewonderworld.qa;
import android.app.*;
import android.content.*;
import android.os.*;
import android.webkit.*;
import android.util.Log;
import android.view.MotionEvent;
import java.io.FileOutputStream;
import java.io.File;
import android.graphics.Bitmap;
import java.util.concurrent.*;
import java.lang.reflect.*;
import org.json.*;

/** Runs inside the real target APK; no debugging bridge or production test hooks. */
public class AndroidSmoke extends Instrumentation {
 private Activity activity; private WebView web; private boolean verify;
 @Override public void onCreate(Bundle args){super.onCreate(args);verify=args!=null && "true".equals(args.getString("verify"));start();}
 private String eval(final String js) throws Exception {
  final CountDownLatch done=new CountDownLatch(1);final String[] result={null};
  runOnMainSync(()->web.evaluateJavascript(js,v->{result[0]=v;done.countDown();}));
  if(!done.await(30,TimeUnit.SECONDS))throw new Exception("JS timeout");return result[0];
 }
 private void check(String name,String js)throws Exception{
  String result=eval("(function(){try{return !!("+js+");}catch(e){console.error(e);return false;}})()");
  if(!"true".equals(result))throw new Exception(name+": "+result);Log.i("LWW_QA","PASS "+name);
 }
 private void screenshot(String name)throws Exception{
  Thread.sleep(500);Bitmap bitmap=getUiAutomation().takeScreenshot();
  if(bitmap==null)throw new Exception("Screenshot unavailable");
  File file=new File(getTargetContext().getExternalFilesDir(null),name+".png");
  try(FileOutputStream out=new FileOutputStream(file)){bitmap.compress(Bitmap.CompressFormat.PNG,100,out);}bitmap.recycle();
 }
 private void tap(String selector)throws Exception{
  String raw=eval("(function(){var e=document.querySelector("+JSONObject.quote(selector)+");e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return JSON.stringify([(r.left+r.width/2)*devicePixelRatio,(r.top+r.height/2)*devicePixelRatio]);})()");
  JSONArray point=new JSONArray((String)new JSONTokener(raw).nextValue());
  int[] location=new int[2];runOnMainSync(()->web.getLocationOnScreen(location));
  float x=(float)point.getDouble(0)+location[0],y=(float)point.getDouble(1)+location[1];
  long t=SystemClock.uptimeMillis();sendPointerSync(MotionEvent.obtain(t,t,MotionEvent.ACTION_DOWN,x,y,0));
  sendPointerSync(MotionEvent.obtain(t,t+80,MotionEvent.ACTION_UP,x,y,0));Thread.sleep(300);
 }
 private void playing(String name)throws Exception{
  for(int i=0;i<40;i++){if("true".equals(eval("!!window.__qaLastMedia && __qaLastMedia.currentTime>0 && !__qaLastMedia.error"))){Log.i("LWW_QA","PASS "+name);return;}Thread.sleep(250);}
  throw new Exception(name+" did not advance: "+eval("__qaLastMedia && [__qaLastMedia.readyState,__qaLastMedia.error && __qaLastMedia.error.code]"));
 }
 @Override public void onStart(){Bundle result=new Bundle();try{
  Intent launch=getTargetContext().getPackageManager().getLaunchIntentForPackage(getTargetContext().getPackageName());
  launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);activity=startActivitySync(launch);
  Field field=activity.getClass().getDeclaredField("web");field.setAccessible(true);web=(WebView)field.get(activity);
  boolean ready=false;for(int i=0;i<60;i++){if("true".equals(eval("typeof beginMode==='function' && !!document.querySelector('#app').children.length"))){ready=true;break;}Thread.sleep(1000);}
  if(!ready)throw new Exception("Startup did not initialize");
  if(verify){check("cold relaunch persistence","restore('lww_qa_persistence',{}).value===21 && document.querySelectorAll('.land-card').length===6");screenshot("relaunch");Log.i("LWW_QA","PASS RELAUNCH");result.putString("result","PASS RELAUNCH");finish(Activity.RESULT_OK,result);return;}
  check("startup", "document.querySelector('#app').textContent.length>20");
  eval("window.__qaErrors=[];window.addEventListener('error',function(e){__qaErrors.push(e.message)});document.querySelector('[data-action=enter]') && document.querySelector('[data-action=enter]').click()");
  check("home six lands", "document.querySelectorAll('.land-card').length===6");
  screenshot("home");
  tap(".land-card");check("touch land navigation","state.screen==='land'");
  tap("[data-action=world]");check("touch world navigation","state.screen==='modes'");
  tap("[data-action=mode]");check("touch activity navigation","state.screen==='game'");
  check("27 worlds / 257 activities", "visibleWorldIds.length===27 && visibleWorldIds.reduce(function(n,id){return n+worlds[id].modes.length},0)===257");
  String inventory=eval("JSON.stringify(visibleWorldIds.map(function(id){return {id:id,modes:worlds[id].modes.map(function(m){return m[0]})}}))");
  JSONArray worlds=new JSONArray((String)new JSONTokener(inventory).nextValue());int count=0;
  for(int i=0;i<worlds.length();i++){JSONObject world=worlds.getJSONObject(i);JSONArray modes=world.getJSONArray("modes");
   for(int j=0;j<modes.length();j++){String id=world.getString("id"),mode=modes.getString(j);
    check("render "+id+"/"+mode,"(beginMode("+JSONObject.quote(id)+","+JSONObject.quote(mode)+"),document.querySelector('#app').textContent.length>0)");count++;
   }
  }
  check("no runtime errors", "__qaErrors.length===0");
  eval("state.screen='home';render();document.querySelector('#lww-media-entry').click()");
  check("offline animal catalog", "document.querySelectorAll('#lww-media-panel .lww-card').length>0");
  screenshot("animals");
  eval("window.__qaOriginalPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(this.src.indexOf('media-pack/')!==-1)window.__qaLastMedia=this;return __qaOriginalPlay.apply(this,arguments)}");
  tap("#lww-media-panel [data-action=sound]");playing("offline animal audio");
  eval("window.wonderPause()");check("audio pauses on background hook","__qaLastMedia.paused");
  tap("#lww-media-panel [data-action=movement]");playing("offline animal video");screenshot("video");
  eval("window.wonderBack()");
  check("native back closes media", "document.querySelector('#lww-media-panel').hidden");
  eval("persist('lww_qa_persistence',{value:21});window.wonderPause();window.wonderResume();state.screen='home';render()");
  check("persistence", "restore('lww_qa_persistence',{}).value===21");
  screenshot("home-final");Log.i("LWW_QA","PASS COMPLETE activities="+count);result.putString("result","PASS activities="+count);finish(Activity.RESULT_OK,result);
 }catch(Throwable e){Log.e("LWW_QA","FAIL",e);result.putString("error",e.toString());finish(Activity.RESULT_CANCELED,result);}}
}
