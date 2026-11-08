/* Multi-Child Profile Support Module v2.0 */
const CHILD_AVATARS = ["🐻","🐰","🦁","🐼","🐨","🐶","🐱","🐭","🐹","🐺","🦊","🐰","🐇","🦔"];
const CHILD_AGES = ["2-3","4-5","5-6"];
const CHILD_COLORS = ["#FFB000","#FF6B6B","#4ECDC4","#95E1D3","#FCE38E","#F38BA8","#7C3AED"];
const PROFILES_KEY = "lww2_profiles";

function loadProfiles() {
 try { const stored = localStorage.getItem(PROFILES_KEY); if (stored) { const parsed = JSON.parse(stored); if (Array.isArray(parsed)) return parsed; } } catch(e) {}
 const oldProfile = localStorage.getItem("lww2_profile");
 if (oldProfile) {
  try { const parsed = JSON.parse(oldProfile); if (parsed && typeof parsed === "object") { localStorage.setItem(PROFILES_KEY, JSON.stringify([{id:"child_1",name:"My Explorer",age:parsed.age||"4-5",avatar:parsed.avatar||"🐻",color:"#FFB000"}])); return [{id:"child_1",name:"My Explorer",age:parsed.age||"4-5",avatar:parsed.avatar||"🐻",color:"#FFB000"}]; } } catch(e) {}
 }
 return [];
}
function saveProfiles(profiles) { try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); } catch(e) {} }
function getCurrentChild(id) { const p = loadProfiles(); if (!id) return p[0]||null; return p.find(x=>x.id===id)||p[0]||null; }
function getChildStats(id) { try { const stored = localStorage.getItem("lww2_stats_"+id); if (stored) return JSON.parse(stored); } catch(e) {} return {total:0,byWorld:{},byMode:{},daily:{},pathProgress:0,tickets:0,ticketsEarnedMode:[],purchases:[],equipped:{},attempts:0,correct:0}; }
function saveChildStats(id, stats) { try { localStorage.setItem("lww2_stats_"+id, JSON.stringify(stats)); } catch(e) {} }
function getChildSettings(id) { try { const stored = localStorage.getItem("lww2_settings_"+id); if (stored) return JSON.parse(stored); } catch(e) {} return {}; }
function saveChildSettings(id, settings) { try { localStorage.setItem("lww2_settings_"+id, JSON.stringify(settings)); } catch(e) {} }
function getChildProgress(id) { const s = getChildStats(id); return {total:s.total||0,byWorld:s.byWorld||{},byMode:s.byMode||{},attempts:s.attempts||0,correct:s.correct||0}; }
function addChild(name, age, avatar, color) { const p = loadProfiles(); if (p.length >= 3) return null; const id = "child_"+Date.now()+"_"+Math.floor(Math.random()*1000); const newP = {id, name: name||"My Explorer", age: age||"4-5", avatar: avatar||"🐻", color: color||"#FFB000"}; const updated = [...p, newP]; saveProfiles(updated); return newP; }
function switchToChild(id) { const p = loadProfiles(); if (!p.some(x=>x.id===id)) return null; const child = getCurrentChild(id); return {child, settings:getChildSettings(id), stats:getChildStats(id)}; }
function updateChild(id, updates) { const p = loadProfiles(); const idx = p.findIndex(x=>x.id===id); if (idx===-1) return false; p[idx] = {...p[idx], ...updates}; saveProfiles(p); return true; }
function removeChild(id) { let p = loadProfiles(); const idx = p.findIndex(x=>x.id===id); if (idx===-1) return false; p = p.filter(x=>x.id!==id); saveProfiles(p); try { localStorage.removeItem("lww2_stats_"+id); localStorage.removeItem("lww2_settings_"+id); } catch(e) {} return true; }
window.loadProfiles = loadProfiles; window.saveProfiles = saveProfiles; window.getCurrentChild = getCurrentChild;
window.getChildStats = getChildStats; window.saveChildStats = saveChildStats; window.getChildSettings = getChildSettings;
window.saveChildSettings = saveChildSettings; window.getChildProgress = getChildProgress; window.addChild = addChild;
window.switchToChild = switchToChild; window.updateChild = updateChild; window.removeChild = removeChild;