/* Little Wonder World: Child Usability Fixes (Agent 5)
 * Pre-reader optimizations: large touch targets, icon-only nav, audio cues
 * Designed for ages 2-6, text-free navigation where possible
 */
window.WonderUsability=(function(){
 const BIG_TOUCH_MIN = 48; // CSS px minimum for tappable elements
 const PREFERRED_CONTRAST = 4.5; // WCAG AA minimum

 // Reduce motion for sensitive users
 function applyReducedMotion(){
  if(typeof document==="undefined")return;
  document.body.classList.add("reduced-motion");
 }

 // Increase touch target size for critical buttons
 function enhanceTouchTargets(){
  if(typeof document==="undefined")return;
  // Make mode cards larger on small screens
  document.querySelectorAll(".mode-card,.world-card,.choice-card").forEach(btn=>{
   const computed = window.getComputedStyle(btn);
   const minWidth = parseFloat(computed.minWidth) || 0;
   if(minWidth < BIG_TOUCH_MIN){
    btn.style.minWidth = BIG_TOUCH_MIN+"px";
    btn.style.minHeight = BIG_TOUCH_MIN+"px";
   }
  });
 }

 // Add audio labels to icon-only buttons
 function addAudioLabels(){
  if(typeof document==="undefined")return;
  document.querySelectorAll('[data-action]').forEach(btn=>{
   if(!btn.getAttribute("aria-label") && btn.textContent.trim()===""){
    const action = btn.dataset.action;
    const hints = {
     shop:"Shop - Buy items with tickets",
     home:"Go home",
     back:"Go back",
     repeat:"Listen again",
     next:"Next",
     prev:"Previous",
     done:"Finish",
     skip:"Skip"
    };
    if(hints[action]){
     btn.setAttribute("aria-label", hints[action]);
    }
    // Add emoji visual hint for common actions
    const emojiMap = {shop:"🛍️",home:"🏠",back:"←",next:"▶",prev:"◀",done:"✓"};
    if(emojiMap[action] && !btn.querySelector(".emoji")){
     const span=document.createElement("span");
     span.textContent = emojiMap[action];
     span.className = "visual-hint";
     span.style.fontSize = "18px";
     span.style.marginLeft = "6px";
     btn.appendChild(span);
    }
   }
  });
 }

 // Ensure color contrast for critical elements
 function checkContrast(el, bg, fg){
  // Simplified contrast check - in production use a proper algorithm
  const bgHex = bg.replace("#","0x");
  const fgHex = fg.replace("#","0x");
  // Basic luminance calculation
  const lum = (c)=>0.2126*Math.pow(c/255,2.2)+0.7152*Math.pow(c/255,2.2)+0.0722*Math.pow(c/255,2.2);
  const L = (a,b)=>Math.abs(lum(a)-lum(b));
  // This is a placeholder - full implementation would contrast ratios
  return L(bgHex,fgHex) >= 0.5;
 }

 // Make progress dots larger for toddler interaction
 function enhanceProgressDots(){
  if(typeof document==="undefined")return;
  const dots = document.querySelectorAll(".dots b");
  dots.forEach(dot=>{
   dot.style.width = "24px";
   dot.style.height = "24px";
   dot.style.minWidth = "24px";
   dot.style.minHeight = "24px";
  });
 }

 // Parent gate visual/audio feedback
 function enhanceParentGate(){
  if(typeof document==="undefined")return;
  const holdBtn = document.querySelector("#parentHoldBtn");
  if(!holdBtn)return;
  holdBtn.style.fontSize = "20px";
  holdBtn.style.padding = "14px 24px";
  holdBtn.style.minWidth = "180px";
  holdBtn.style.minHeight = "60px";
  // Add haptic-like visual feedback during hold
  let pressCount=0;
  holdBtn.addEventListener("pointerdown",()=>{ pressCount++; holdBtn.style.transform="scale(1.05)"; });
  holdBtn.addEventListener("pointerup",()=>{ holdBtn.style.transform="scale(1)"; });
  holdBtn.addEventListener("pointerleave",()=>{ holdBtn.style.transform="scale(1)"; });
 }

 // Initialize all usability enhancements
 function initUsability(){
  enhanceTouchTargets();
  addAudioLabels();
  enhanceProgressDots();
  enhanceParentGate();
 }

 // Wait for DOM ready
 if(typeof document!=="undefined"){
  if(document.readyState==="loading"){
   document.addEventListener("DOMContentLoaded", initUsability);
  }else{
   initUsability();
  }
 }

 return {
  applyReducedMotion,
  enhanceTouchTargets,
  addAudioLabels,
  enhanceProgressDots,
  enhanceParentGate,
  initUsability
 };
})();