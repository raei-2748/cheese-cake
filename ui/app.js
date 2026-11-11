import { courses, templates } from './data.js?v=__V__';
import { parseQuickAdd, nextRepeat, repeatLabels } from './parse.js?v=__V__';

const smart = [['today','Today','sun'],['next7','Next 7 days','week7'],['inbox','Inbox','inbox'],['all','All tasks','list'],['done','Completed','done']];
const tools = [['calendar','Calendar','grid'],['matrix','Matrix','matrix'],['habits','Habits','repeat']];
const views = [
  ['week','Weekly plan','calendar'], ['assess','Assessments','flag'], ['topics','Syllabus & priorities','layers'],
  ['practice','Practice & repair','bolt'], ['papers','Past papers','paper'], ['feedback','Teacher feedback','message'], ['review','Weekly reviews','check']
];
const dash = ['dash','Overview','home'];
const icons = {
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18m-13 5h2m4 0h2"/>',
  flag:'<path d="M5 21V4m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  message:'<path d="M21 11a8 8 0 0 1-8 8H4l2-4a8 8 0 1 1 15-4Z"/><path d="M9 10h7m-7 4h5"/>',
  check:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 3 3 5-6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  inbox:'<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  done:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  week7:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18M8 15h8"/>',
  grid:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M9 9v12M15 9v12M3 15h18"/>',
  matrix:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  repeat:'<path d="m17 2 3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  hash:'<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M4.9 4.9 7 7m10 10 2.1 2.1M2 12h3m14 0h3M4.9 19.1 7 17m10-10 2.1-2.1"/>',
  notes:'<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>',
  sub:'<path d="M5 4v10a3 3 0 0 0 3 3h11m-4-4 4 4-4 4"/>',
  play:'<path d="M7 4v16l13-8Z"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',
  book:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  status:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  repeat:'<path d="M4 12a7 7 0 0 1 12-5l2 2M20 12a7 7 0 0 1-12 5l-2-2M18 4v5h-5M6 20v-5h5"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5h4"/>',
  shape:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  text:'<path d="M5 6h14M5 12h14M5 18h9"/>',
  paper:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7M9 8h3"/>'
};
const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
const main = document.querySelector('#main');
const dialog = document.querySelector('#editor');
const indicator = document.querySelector('#save-status');
const toast = document.querySelector('#toast');
const nav = document.querySelector('#nav');
const $ = id => document.getElementById(id);
const h = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const br = value => h(value).replace(/\n/g,'<br>');
const uid = () => crypto.randomUUID();
const sydney = new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'});
const today = () => sydney.format(new Date());
const date = iso => new Date(iso+'T12:00:00Z');
const iso = d => d.toISOString().slice(0,10);
function addDays(value,n) { const d = date(value); d.setUTCDate(d.getUTCDate()+n); return iso(d); }
const monday = d => addDays(d,-((date(d).getUTCDay()+6)%7));
const daysFrom = (a,b) => Math.round((date(a)-date(b))/86400000);
const pretty = (d, options = {day:'numeric',month:'short'}) => new Intl.DateTimeFormat('en-AU',{...options,timeZone:'UTC'}).format(date(d));
const minutes = m => m < 60 ? m+'m' : Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':'');
const percent = n => Number(n.toFixed(1))+'%';
const defaultWeek = () => ({ energy:'Steady', reserve:15, capacity:[75,75,75,75,45,120,90], review:null });
const empty = () => ({version:1, weeks:{}, tasks:[], commitments:[], assessments:[], topics:{}, customTopics:[], errors:[], feedback:[], lists:[], habits:[], habitLog:{}, focus:[], papers:[], settings:{pomo:{focus:25,short:5,long:15,every:4},studyGoal:120,trialStart:'',hscStart:'',lastExport:''}});
// Fill in fields added by Stacky so older records keep working, and repair
// any collection that a damaged or hand-edited backup left as the wrong type.
function normalise(d) {
  const base = empty();
  const out = {...base, ...d, settings:{...base.settings, ...(d?.settings||{}), pomo:{...base.settings.pomo, ...(d?.settings?.pomo||{})}}};
  for (const [k,v] of Object.entries(base)) {
    if (Array.isArray(v) && !Array.isArray(out[k])) out[k]=[];
    else if (v && typeof v==='object' && !Array.isArray(v) && (typeof out[k]!=='object' || out[k]===null || Array.isArray(out[k]))) out[k]=structuredClone(v);
  }
  for (const k of Object.keys(base)) if (Array.isArray(out[k])) out[k]=out[k].filter(x=>x && typeof x==='object');
  out.tasks.forEach(t=>{ if (!t.id) t.id=uid(); if (typeof t.title!=='string') t.title=String(t.title??'Untitled'); });
  out.tasks = (out.tasks||[]).map(t=>({priority:0, tags:[], subtasks:[], time:'', repeat:'', list:'', completedAt:null, ...t, minutes:Number(t.minutes)||0}));
  return out;
}
let data, revision, saving = false, dirty = false, conflict = false, saveTimer, toastTimer;
let week = monday(today()), courseId = 'mx1', assessmentFilter = 'All', practiceFilter = 'Open', priorityOnly = false;
function weekData() {
  const current = data.weeks[week] ?? {};
  const prior = Object.keys(data.weeks).filter(key=>key<week && data.weeks[key].capacity).sort().at(-1);
  const baseline = prior ? data.weeks[prior] : defaultWeek();
  return { ...defaultWeek(), capacity:baseline.capacity, reserve:baseline.reserve, ...current };
}
const course = id => courses.find(c => c.id === id);
const study = ['focus','Study','timer'];
const routeNames = Object.fromEntries([dash,study,...smart,...tools,...views].map(([k,n])=>[k,n]));
function route() {
  const raw = location.hash.slice(1), cut = raw.indexOf('/');
  const name = cut<0 ? raw : raw.slice(0,cut);
  let arg = '';
  try { arg = cut<0 ? '' : decodeURIComponent(raw.slice(cut+1)); } catch { arg = raw.slice(cut+1); }
  if (['list','tag','search'].includes(name)) return {name,arg};
  return routeNames[name] ? {name,arg:''} : {name:'dash',arg:''};
}
const courseOptions = () => courses.map(c => [c.id,c.name]);
const row = (key,id) => data[key].find(item=>item.id === id);
const change = fn => { fn(); dirty = true; render(); queueSave(); };
function notify(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{toast.hidden=true;},3400);
}
const LOCAL_KEY = 'hsc-study-desk:state:v1'; // key kept so existing records carry over
const SNAP_KEY = 'hsc-stack:snapshots:v1';
let localMode = false;
// Browser-only mode keeps a copy of the records as they were when first opened
// each day, for the last 7 days, so one bad edit or import can be undone.
function snapshots() { try { return JSON.parse(localStorage.getItem(SNAP_KEY)) || {}; } catch { return {}; } }
function snapshot() {
  const snaps = snapshots(), day = today();
  if (snaps[day] || !data.tasks.length && !data.assessments.length && !data.focus.length) return;
  snaps[day] = data;
  const keep = Object.keys(snaps).sort().slice(-7);
  try { localStorage.setItem(SNAP_KEY, JSON.stringify(Object.fromEntries(keep.map(k=>[k,snaps[k]])))); }
  catch { try { localStorage.setItem(SNAP_KEY, JSON.stringify({[day]:data})); } catch {} }
}
function status(label, mode = '') {
  indicator.textContent = label;
  indicator.dataset.mode = mode;
}
function queueSave() {
  clearTimeout(saveTimer);
  if (conflict) return;
  status('Saving…','busy');
  saveTimer = setTimeout(save,180);
}
async function save() {
  if (saving || !dirty || conflict) return;
  saving = true;
  dirty = false;
  try {
    if (localMode) {
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }
      catch (error) {
        // Usually a full quota. Old snapshots are the first thing to give up.
        try { localStorage.removeItem(SNAP_KEY); localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }
        catch { throw new Error('This browser would not save your changes (storage may be full or blocked). Export a backup now from Backup & settings.'); }
      }
      if (!dirty) status(syncOn() ? 'Saved · syncing…' : 'Saved in this browser');
      saving = false;
      queueSync();
      return;
    }
    const response = await fetch('api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision,data})});
    const result = await response.json();
    if (!response.ok) {
      conflict = response.status === 409;
      throw new Error(result.error);
    }
    revision = result.revision;
    if (!dirty) status('Changes saved');
  } catch (error) {
    dirty = true;
    status(conflict ? 'Sync conflict · reload' : 'Save failed · retry','error');
    notify(error.message);
    saving = false;
    return;
  }
  saving = false;
  if (dirty) queueSave();
}
indicator.addEventListener('click',()=>{ if (!conflict && dirty) save(); else if (lastSyncError) syncNow(); });
window.addEventListener('beforeunload', event => {
  if (saving || dirty) { event.preventDefault(); event.returnValue = ''; }
});
async function open() {
  try {
    let result = null;
    try {
      const response = await fetch('api/state');
      result = await response.json();
      if (!response.ok) result = null;
    } catch { result = null; }
    if (result) {
      revision = result.revision;
      data = normalise(result.data ?? empty());
      status('Private workspace');
    } else {
      // No backend (e.g. GitHub Pages): keep records in this browser only.
      localMode = true;
      let stored = null;
      try { stored = JSON.parse(localStorage.getItem(LOCAL_KEY)); } catch {}
      data = normalise(stored ?? empty());
      status('Saved in this browser');
      snapshot();
    }
    render();
    if (localMode && syncOn()) syncNow();
  } catch (error) {
    status('Storage unavailable','error');
    main.innerHTML = '<div class="card empty"><h2>Could not open your records</h2><p>'+h(error.message)+'</p><button class="button" data-action="reload">Try again</button></div>';
  }
}

// ───────────────────────── Sync across devices ─────────────────────────
// The site is static, so devices meet in one private (secret) GitHub Gist on the
// student's own account. Each device keeps the copy it last synced (the base).
// When two devices both changed things, a three-way merge keeps both sets of
// edits: records are matched by id and merged field by field, and only a field
// changed differently on both sides falls back to this device's version.
const SYNC_KEY = 'hsc-stack:sync:v1', BASE_KEY = 'hsc-stack:sync-base:v1', GIST_FILE = 'hsc-stack.json', GIST_DESC = 'Stacky sync (private study records)';  // file and storage keys keep the old name so existing data still matches
let syncCfg = (()=>{ try { return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}; } catch { return {}; } })();
let syncing = false, syncAgain = false, syncTimer, lastSyncError = '';
const syncOn = () => !!(syncCfg.token && syncCfg.gistId);
const forceNextSync = () => { if (syncOn()) { syncCfg.force = true; storeSync(); } };
const storeSync = () => { try { localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg)); } catch {} };
const same = (a,b) => JSON.stringify(a)===JSON.stringify(b);
const plain = v => v && typeof v==='object' && !Array.isArray(v);
const keyed = v => Array.isArray(v) && v.every(x=>plain(x) && x.id!=null);
function merge3(base, mine, theirs) {
  if (same(mine,theirs)) return mine;
  if (base!==undefined && same(mine,base)) return theirs;
  if (base!==undefined && same(theirs,base)) return mine;
  if (keyed(mine) && keyed(theirs) && (base===undefined || keyed(base))) {
    const b=new Map((base||[]).map(x=>[x.id,x])), t=new Map(theirs.map(x=>[x.id,x])), m=new Map(mine.map(x=>[x.id,x]));
    const out=[];
    for (const x of mine) {
      if (t.has(x.id)) out.push(merge3(b.get(x.id),x,t.get(x.id)));
      else if (!b.has(x.id) || !same(x,b.get(x.id))) out.push(x);   // new here, or edited here after being deleted there
    }
    for (const x of theirs) if (!m.has(x.id) && (!b.has(x.id) || !same(x,b.get(x.id)))) out.push(x);
    return out;
  }
  if (plain(mine) && plain(theirs) && (base===undefined || plain(base))) {
    const out={}, b=base||{};
    for (const k of new Set([...Object.keys(mine),...Object.keys(theirs)])) {
      const inM=Object.hasOwn(mine,k), inT=Object.hasOwn(theirs,k), inB=Object.hasOwn(b,k);
      if (inM && inT) out[k]=merge3(inB?b[k]:undefined,mine[k],theirs[k]);
      else if (inM) { if (!inB || !same(mine[k],b[k])) out[k]=mine[k]; }
      else if (!inB || !same(theirs[k],b[k])) out[k]=theirs[k];
    }
    return out;
  }
  return mine;
}
async function gh(path, options={}) {
  const response = await fetch('https://api.github.com'+path,{cache:'no-store',...options,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+syncCfg.token,'X-GitHub-Api-Version':'2022-11-28',...(options.body?{'Content-Type':'application/json'}:{})}});
  if (response.status===401) throw new Error('GitHub rejected the sync token. It may have expired. Reconnect in Backup & settings.');
  if (response.status===403 || response.status===404) throw new Error(path.startsWith('/gists/') && response.status===404 ? 'The sync gist was not found. Reconnect in Backup & settings.' : 'GitHub refused access. Check the token has Gists read and write permission.');
  if (!response.ok) throw new Error('GitHub sync failed ('+response.status+'). It will retry.');
  return response.json();
}
// The last copy this tab saw on GitHub. Asking again with its ETag gets a tiny
// "not modified" reply when nothing changed, so checking often costs almost nothing.
let seen = null;   // {gistId, etag, rev, json}
async function readRemote() {
  const known = seen && seen.gistId===syncCfg.gistId ? seen : null;
  const response = await fetch('https://api.github.com/gists/'+syncCfg.gistId,{cache:'no-store',headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+syncCfg.token,'X-GitHub-Api-Version':'2022-11-28',...(known?{'If-None-Match':known.etag}:{})}});
  if (response.status===304 && known) return {unchanged:true, rev:known.rev, json:known.json};
  if (response.status===401) throw new Error('GitHub rejected the sync token. It may have expired. Reconnect in Backup & settings.');
  if (response.status===404) throw new Error('The sync gist was not found. Reconnect in Backup & settings.');
  if (response.status===403) throw new Error('GitHub refused access. Check the token has Gists read and write permission.');
  if (!response.ok) throw new Error('GitHub sync failed ('+response.status+'). It will retry.');
  const etag = response.headers.get('ETag');
  const gist = await response.json();
  const parsed = await parseRemote(gist);
  seen = etag && parsed ? {gistId:syncCfg.gistId, etag, rev:parsed.rev||0, json:JSON.stringify(parsed.data)} : null;
  return parsed;
}
async function parseRemote(gist) {
  const file = gist.files?.[GIST_FILE];
  if (!file) return null;
  const text = file.truncated ? await (await fetch(file.raw_url,{cache:'no-store'})).text() : file.content;
  const parsed = JSON.parse(text);
  return parsed?.data?.version===1 ? parsed : null;
}
const writeRemote = (rev) => gh('/gists/'+syncCfg.gistId,{method:'PATCH',body:JSON.stringify({files:{[GIST_FILE]:{content:JSON.stringify({rev,savedAt:new Date().toISOString(),device:syncCfg.device||'',data})}}})});
function readBase() { try { return JSON.parse(localStorage.getItem(BASE_KEY)); } catch { return null; } }
function writeBase() { try { localStorage.setItem(BASE_KEY, JSON.stringify(data)); } catch {} }
const hasRecords = d => !!(d.tasks.length||d.assessments.length||d.focus.length||d.papers.length||d.habits.length||Object.keys(d.topics).length);
function queueSync(delay=700) { if (!localMode || !syncOn()) return; clearTimeout(syncTimer); syncTimer=setTimeout(syncNow,delay); }
async function syncNow() {
  if (!localMode || !syncOn() || !data) return;
  if (syncing) { syncAgain=true; return; }
  // Never swap the records out from under an open form or an unsaved edit.
  if (dialog.open || dirty || saving) { queueSync(4000); return; }
  if (!navigator.onLine) { status('Offline · will sync later','busy'); return; }
  try { const stored=JSON.parse(localStorage.getItem(SYNC_KEY)); if (stored?.gistId===syncCfg.gistId) syncCfg=stored; } catch {}
  syncing=true;
  try {
    const remote = await readRemote();
    if (dialog.open || dirty || saving) { syncing=false; queueSync(4000); return; }
    let rev = remote?.rev || 0;
    if (remote?.unchanged && rev===syncCfg.rev && !syncCfg.force) {
      // Nothing new on GitHub. Send this device's changes if it has any.
      if (JSON.stringify(data)!==remote.json) { rev += 1; seen = null; await writeRemote(rev); syncCfg.rev = rev; writeBase(); }
      syncCfg.lastSync = new Date().toISOString(); storeSync();
      lastSyncError = '';
      status('Synced '+hhmm(Date.now()));
      syncing=false;
      if (syncAgain) { syncAgain=false; queueSync(300); }
      return;
    }
    if (remote?.unchanged) { seen = null; syncing=false; return syncNow(); }   // another tab moved on: read the full copy
    if (remote && rev!==syncCfg.rev && !syncCfg.force) {
      const base = readBase();
      const local = data;
      const merged = !base && !hasRecords(local) ? remote.data : merge3(base ?? undefined, local, remote.data);
      data = normalise(merged);
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch {}
      if (!same(local,data)) { if (selected && !row('tasks',selected)) selected=null; render(); }
    }
    if (!remote || !same(data,remote.data)) { rev += 1; seen = null; await writeRemote(rev); }
    syncCfg.rev = rev; syncCfg.lastSync = new Date().toISOString(); delete syncCfg.force; storeSync(); writeBase();
    lastSyncError = '';
    status('Synced '+hhmm(Date.now()));
  } catch (error) {
    lastSyncError = error.message;
    status('Sync failed · tap to retry','error');
    queueSync(30000);
  }
  syncing=false;
  if (syncAgain) { syncAgain=false; queueSync(500); }
}
async function connectSync(token, device) {
  syncCfg = {token, device};
  const mine = await gh('/gists?per_page=100');
  const found = mine.find(g=>g.files?.[GIST_FILE] && [GIST_DESC,'HSC Stack sync (private study records)'].includes(g.description));
  if (found) syncCfg.gistId = found.id;
  else {
    const made = await gh('/gists',{method:'POST',body:JSON.stringify({description:GIST_DESC,public:false,files:{[GIST_FILE]:{content:JSON.stringify({rev:1,savedAt:new Date().toISOString(),device,data})}}})});
    Object.assign(syncCfg,{gistId:made.id,rev:1});
    writeBase();
  }
  storeSync();
  return !!found;
}
function syncModal() {
  const on = syncOn();
  modal('Sync across devices', on
    ? '<div class="form-grid"><div class="field full"><span>Status</span><small class="note">'+(syncCfg.device?'This device: '+h(syncCfg.device)+'. ':'')+(syncCfg.lastSync?'Last synced '+h(pretty(sydney.format(new Date(syncCfg.lastSync)),{day:'numeric',month:'short'}))+' at '+h(hhmm(Date.parse(syncCfg.lastSync)))+'.':'Not synced yet.')+'</small>'+
      (lastSyncError?'<small class="form-error">'+h(lastSyncError)+'</small>':'')+
      '<div class="line wrap">'+button('Sync now','sync-now','','primary')+'<a class="button secondary" href="https://gist.github.com/'+h(syncCfg.gistId)+'" target="_blank" rel="noopener">Open gist ↗</a>'+button('Disconnect this device','sync-off','','danger')+'</div></div>'+
      '<p class="note full">Changes are sent about a second after you make them. Changes from your other devices arrive within about 10 seconds while this tab is open. Your records stay in this browser if you disconnect.</p></div>'
    : '<div class="form-grid"><p class="note full">Your records are kept in a private gist on your own GitHub account. Every device you connect reads and writes the same copy. If two devices change different things, both changes are kept.</p>'+
      '<ol class="steps full"><li>On GitHub, open <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Settings → Developer settings → Fine-grained tokens → Generate</a>.</li><li>Under <strong>Account permissions</strong>, set <strong>Gists</strong> to <em>Read and write</em>. Leave everything else off. Pick an expiry date after the HSC.</li><li>Copy the token, paste it below, and connect. Do the same on each device, using the same token or a new one.</li></ol>'+
      field('token','GitHub token','',{type:'password',full:true,required:true,placeholder:'github_pat_…'})+
      field('device','Name for this device','',{placeholder:'e.g. School laptop, iPad'})+
      '<p class="note full">The token is stored only in this browser. A secret gist is unlisted, but anyone who has its exact link can read it. On a shared computer, disconnect when you finish.</p></div>',
    on?'':'Connect', on?null:v=>{
      const token=v.token.replace(/\s+/g,'');
      if (!/^(github_pat_|ghp_|gho_)[A-Za-z0-9_]{20,}$/.test(token)) { formError('That does not look like a GitHub token. It should start with github_pat_.'); return false; }
      const submit=dialog.querySelector('[type=submit]'); submit.disabled=true; submit.textContent='Connecting…';
      connectSync(token, v.device||'').then(found=>{
        dialog.close();
        notify(found?'Connected. Merging the records from your other devices…':'Connected. This device’s records are now in your private gist.');
        syncCfg.rev = found ? -1 : syncCfg.rev; storeSync();
        syncNow();
      }).catch(error=>{ syncCfg={}; storeSync(); submit.disabled=false; submit.textContent='Connect'; formError(error.message); });
      return false;
    });
}
addEventListener('online',()=>queueSync(300));
document.addEventListener('visibilitychange',()=>{ if (document.visibilityState==='visible') queueSync(300); else if (dirty) save(); });
setInterval(()=>{ if (document.visibilityState==='visible' && syncOn() && !lastSyncError) syncNow(); },10000);

const button = (label, action, id='', tone='secondary') => '<button type="button" class="button '+tone+'" data-action="'+action+'" data-id="'+h(id)+'">'+h(label)+'</button>';
const badge = (label, tone='neutral') => '<span class="badge '+tone+'">'+h(label)+'</span>';
const subject = id => id && course(id) ? '<span class="subject" style="--subject:'+course(id).colour+'"><i></i>'+h(course(id).short)+'</span>' : '<span class="subject general"><i></i>General</span>';
const emptyCard = (title, description, action='') => '<div class="empty"><strong>'+h(title)+'</strong><p>'+h(description)+'</p>'+action+'</div>';
const pageHead = (eyebrow,title,copy,action='') => '<div class="page-head"><div>'+(eyebrow?'<div class="eyebrow">'+h(eyebrow)+'</div>':'')+'<h1>'+h(title)+'</h1>'+(copy?'<p>'+h(copy)+'</p>':'')+'</div><div class="head-action">'+action+'</div></div>';
const section = (title, sub, body, action='') => '<section class="card"><div class="card-head"><div><h2>'+h(title)+'</h2>'+(sub?'<p>'+h(sub)+'</p>':'')+'</div>'+action+'</div>'+body+'</section>';
const metric = (label,value,detail,tone='') => '<div class="metric '+tone+(value==='—'?' unset':'')+'"><span>'+h(label)+'</span><strong>'+h(value==='—'?'Not set':value)+'</strong><small>'+h(detail)+'</small></div>';
const tabGroup = (label,action,selected,items) => '<div class="tabs" role="group" aria-label="'+h(label)+'">'+items.map(item=>{const [id,name]=Array.isArray(item)?item:[item,item];return '<button type="button" aria-pressed="'+(id===selected)+'" class="'+(id===selected?'selected':'')+'" data-action="'+action+'" data-id="'+h(id)+'">'+h(name)+'</button>';}).join('')+'</div>';
const weekLabel = () => pretty(week)+' – '+pretty(addDays(week,6),{day:'numeric',month:'short',year:'numeric'});
const weekPicker = () => '<div class="week-picker"><button type="button" aria-label="Previous week" data-action="shift-week" data-id="-7">‹</button><strong>'+h(weekLabel())+'</strong><button type="button" aria-label="Next week" data-action="shift-week" data-id="7">›</button>'+button('Current week','current-week','','text')+button('Jump to date','jump-week','','text')+'</div>';
const weekTasks = () => data.tasks.filter(t=>t.date && monday(t.date)===week);
const deadlines = () => data.assessments.filter(a=>a.date && !['Sat / submitted','Returned'].includes(a.status)).sort((a,b)=>a.date.localeCompare(b.date));
const retests = () => data.errors.filter(e=>e.stage!=='Passed' && e.retest && e.retest<=addDays(week,6)).sort((a,b)=>a.retest.localeCompare(b.retest));
const carry = () => data.tasks.filter(t=>t.date && t.date<week && !['Done','Dropped'].includes(t.status));
const taskDone = t => t.status==='Done';
const taskOpen = t => !['Done','Dropped'].includes(t.status);
function capacity() {
  const setup = weekData();
  const factor = {Low:0.65,Steady:0.85,High:1}[setup.energy];
  return setup.capacity.map((gross,i)=>{
    const day = addDays(week,i);
    const commitments = data.commitments.filter(c=>c.date===day);
    const blocked = commitments.reduce((sum,c)=>sum+c.minutes,0);
    const net = Math.max(0,gross-blocked);
    const available = Math.floor(net*factor*(1-setup.reserve/100)/5)*5;
    const tasks = weekTasks().filter(t=>t.date===day);
    const remaining = tasks.filter(taskOpen).reduce((sum,t)=>sum+t.minutes,0);
    const completed = tasks.filter(taskDone).reduce((sum,t)=>sum+(t.actual!=='' ? Number(t.actual) : t.minutes),0);
    return {day,available,commitments,tasks,remaining,completed};
  });
}

function nextActions() {
  const list = deadlines().slice(0,3);
  const repairs = retests().slice(0,3);
  return list.length || repairs.length ? '<div class="focus-list">'+[
    ...list.map(a=>({meta:subject(a.course)+' '+badge(a.kind,a.kind==='Trial'?'gold':'neutral'), title:a.title,
      detail:(a.weight!==''?a.weight+'% of course · ':'')+(a.date<today()?'Overdue · ':'Due ')+pretty(a.date), action:button('Plan prep','prep-assessment',a.id,'text')})),
    ...repairs.map(e=>({meta:subject(e.course)+' '+badge('Retest','gold'),title:e.title,detail:(e.retest<today()?'Overdue · ':'Due ')+pretty(e.retest),action:button('Plan retest','plan-retest',e.id,'text')}))
  ].map(x=>'<div class="focus-row"><div><div class="line">'+x.meta+'</div><strong>'+h(x.title)+'</strong><small>'+h(x.detail)+'</small></div>'+x.action+'</div>').join('')+'</div>'
    : emptyCard('No assessments yet','Add one from your school assessment notice.',button('+ Add assessment','edit-assessment'));
}

function taskRow(t) {
  const label = t.status==='Done'?'Reopen '+t.title:'Mark '+t.title+' done';
  return '<div class="task-row'+(t.status==='Dropped'?' dropped':'')+'"><button type="button" class="tick '+(taskDone(t)?'checked':'')+'" aria-label="'+h(label)+'" aria-pressed="'+taskDone(t)+'" data-action="toggle-task" data-id="'+h(t.id)+'">'+(taskDone(t)?'✓':'')+'</button><button class="task-name" type="button" data-action="edit-task" data-id="'+h(t.id)+'"><strong>'+h(t.title)+'</strong><small>'+h(course(t.course)?.short ?? t.kind)+(t.course?' · '+h(t.kind):'')+'</small></button><span class="task-time">'+(t.minutes?minutes(t.minutes):'')+'</span></div>';
}
function weekly() {
  const plan = capacity();
  const totals = plan.reduce((a,d)=>({available:a.available+d.available, remaining:a.remaining+d.remaining, completed:a.completed+d.completed}),{available:0,remaining:0,completed:0});
  const headroom = totals.available-totals.remaining-totals.completed;
  const moved = carry();
  return pageHead('','Weekly plan','',button('+ Study block','edit-task','','primary'))+
    '<div class="toolbar">'+weekPicker()+'<div class="line">'+button('+ Commitment','edit-commitment')+button('Set capacity','edit-capacity')+'</div></div>'+
    '<div class="metrics">'+metric('Usable time',minutes(totals.available),weekData().energy+' energy · '+weekData().reserve+'% buffer')+
      metric('Work left',minutes(totals.remaining),weekTasks().filter(taskOpen).length+' open blocks')+
      metric('Completed',minutes(totals.completed),weekTasks().filter(taskDone).length+' finished blocks')+
      metric(headroom<0?'Over budget':'Unallocated',minutes(Math.abs(headroom)),plan.filter(d=>d.remaining+d.completed>d.available).length+' days over capacity',headroom<0?'alert':'accent')+'</div>'+
    '<div class="overview-grid">'+section('Coming up','',nextActions(),'<a class="subtle-link" href="#assess">Assessments →</a>')+
    section('Energy this week','',tabGroup('Energy','energy',weekData().energy,['Low','Steady','High'])+
    '<p class="note">Low uses 65% of free time, Steady 85%, and High 100%. Your buffer is applied after commitments and the energy adjustment.</p>'+
    (moved.length?'<div class="carry"><strong>'+moved.length+' unfinished from earlier weeks</strong>'+button('Triage carry-over','show-carry','','text')+'</div>':'<div class="carry"><strong>Carry-over is clear</strong><span>Earlier unfinished blocks show here.</span></div>'))+'</div>'+
    section('Week at a glance','', '<div class="day-grid">'+plan.map(({day,available,commitments,tasks,remaining,completed})=>{
      const used=remaining+completed;
      return '<article class="day '+(day===today()?'today ':'')+(used>available?'over':'')+'"><div class="day-heading"><div><strong>'+pretty(day,{weekday:'short'})+'</strong><small>'+pretty(day)+'</small></div><button type="button" aria-label="Add block on '+h(pretty(day))+'" data-action="task-day" data-id="'+day+'">+</button></div><div class="load"><span>'+minutes(used)+' / '+minutes(available)+'</span><div class="bar"><i style="width:'+Math.min(100,available ? used/available*100 : used?100:0)+'%"></i></div></div>'+
      commitments.map(c=>'<button type="button" class="commit" data-action="edit-commitment" data-id="'+h(c.id)+'">'+h(c.title)+' <span>'+minutes(c.minutes)+'</span></button>').join('')+
      tasks.map(taskRow).join('')+(tasks.length?'':'<span class="day-empty">Open space</span>')+'</article>';
    }).join('')+'</div>');
}

const assessmentStatuses = ['Scheduled','Preparing','Sat / submitted','Returned'];
const stages = ['Logged','Repairing','Retest due','Passed'];
const topicStages = ['Unstarted','Learning','Practised','Retested'];
const priorities = ['Normal','High','Urgent'];
const assessmentSteps = ['Scope checked','Timed rehearsal','Errors retested','Ready'];
const trialSteps = ['Scope & timing checked','Timed paper completed','Paper marked','Errors retested'];
const dated = (items,key='date') => [...items].sort((a,b)=>(a[key]||'9999').localeCompare(b[key]||'9999'));
const hasMark = a => a.mark!=='' && a.outOf!=='' && a.outOf>0;
function assessments() {
  const shown = dated(data.assessments.filter(a=>assessmentFilter==='All'||a.kind===assessmentFilter));
  const marks = courses.map(c=>{
    const entries = data.assessments.filter(a=>a.course===c.id);
    const marked = entries.filter(a=>hasMark(a)&&a.weight!=='');
    const loggedWeight = entries.reduce((sum,a)=>sum+Number(a.weight),0);
    const covered = marked.reduce((sum,a)=>sum+Number(a.weight),0);
    const points = marked.reduce((sum,a)=>sum+a.mark/a.outOf*a.weight,0);
    return '<tr><th scope="row">'+subject(c.id)+'</th><td>'+percent(loggedWeight)+(loggedWeight>100?' '+badge('Check weights','alert'):'')+'</td><td>'+percent(covered)+'</td><td>'+(covered?percent(points/covered*100):'—')+'</td><td>'+(covered?Number(points.toFixed(2))+' / 100':'—')+'</td></tr>';
  }).join('');
  return pageHead('','Assessments & Trials','',button('+ Assessment','edit-assessment','','primary'))+
    section('Register','',tabGroup('Assessment type','assessment-filter',assessmentFilter,['All','Assessment','Trial'])+
    (shown.length?'<div class="record-list">'+shown.map(a=>{
      const steps=a.kind==='Trial'?trialSteps:assessmentSteps;
      return '<article class="record"><div class="record-head"><div><div class="line">'+subject(a.course)+badge(a.kind,a.kind==='Trial'?'gold':'neutral')+badge(a.status,a.status==='Returned'?'green':'neutral')+'</div><h3>'+h(a.title)+'</h3><p>'+(a.date?h(pretty(a.date,{day:'numeric',month:'short',year:'numeric'})):'Date pending')+' · '+(a.weight!==''?h(a.weight)+'% weighting':'Weight pending')+' · '+(hasMark(a)?h(a.mark)+' / '+h(a.outOf)+' ('+percent(a.mark/a.outOf*100)+')':'Mark pending')+'</p></div><div class="line">'+button('Plan prep','prep-assessment',a.id)+button('Edit','edit-assessment',a.id)+'</div></div>'+
      (a.scope?'<p class="record-detail">'+br(a.scope)+'</p>':'')+'<div class="check-strip">'+steps.map((step,i)=>'<label><input type="checkbox" data-assess="'+h(a.id)+'" data-step="'+i+'" '+(a.checks?.[i]?'checked':'')+'> '+h(step)+'</label>').join('')+'</div></article>';
    }).join('')+'</div>':emptyCard('No '+(assessmentFilter==='Trial'?'Trials':'assessments')+' logged','Dates, marks and school weightings are ready for you to enter.',button('+ Add '+(assessmentFilter==='Trial'?'Trial':'assessment'),assessmentFilter==='Trial'?'new-trial':'edit-assessment'))))+
    section('Marks by course','The average counts only tasks that have both a mark and a weighting.', '<div class="table-scroll"><table><thead><tr><th>Course</th><th>Weight logged</th><th>Weight marked</th><th>Marked average</th><th>Points earned</th></tr></thead><tbody>'+marks+'</tbody></table></div>');
}
function topicsFor(c) {
  return c.modules.flatMap(([module,...topics],i)=>topics.map((title,j)=>({id:c.id+'-'+i+'-'+j,title,module,course:c.id})))
    .concat(data.customTopics.filter(t=>t.course===c.id));
}
function topicRecord(id) { return courses.flatMap(topicsFor).find(t=>t.id===id); }
function topicState(id) { return data.topics[id] ?? {stage:'Unstarted',priority:'Normal',evidence:''}; }
// Spaced review. Each review sets the gap to the next one from how well recall
// went: Again → tomorrow, Hard → a little longer, Good → about double, Easy → triple.
const grades = [['Again','Could not recall it'],['Hard','Got there with effort'],['Good','Recalled with small slips'],['Easy','Fluent and accurate']];
function nextGap(prev, grade) {
  const i = Number(prev)||0;
  const gap = grade==='Again' ? 1 : grade==='Hard' ? Math.max(2,Math.round(i*1.3)) : grade==='Good' ? (i?Math.round(i*2.2):3) : (i?Math.round(i*3):6);
  return Math.min(60,Math.max(1,gap));
}
const reviewDue = st => !!st.next && st.next<=today();
const dueTopics = () => courses.flatMap(topicsFor).filter(t=>reviewDue(topicState(t.id))).sort((a,b)=>topicState(a.id).next.localeCompare(topicState(b.id).next));
function reviewLabel(st) {
  if (!st.next) return '';
  const d = daysFrom(st.next,today());
  return d<0 ? 'Review overdue '+(-d)+'d' : d===0 ? 'Review today' : 'Next review '+pretty(st.next);
}
function reviewTopic(t) {
  const st = topicState(t.id);
  modal('Review · '+t.title,'<div class="form-grid"><p class="note full">'+h(course(t.course).short)+' · '+h(t.module)+(st.reviews?' · reviewed '+st.reviews+' time'+(st.reviews===1?'':'s')+(st.last?', last '+h(pretty(st.last)):''):' · first review')+'</p>'+
    '<p class="note full">Close your notes and answer two or three questions on this topic from memory first. Then rate how it went.</p>'+
    '<fieldset class="field full grade-pick"><legend>How did recall go?</legend>'+grades.map(([g,d],i)=>'<label><input type="radio" name="grade" value="'+g+'" '+(i===2?'checked':'')+'><strong>'+g+'</strong><small>'+d+' · next in '+nextGap(st.gap,g)+'d</small></label>').join('')+'</fieldset>'+
    textArea('evidence','What you tested, or the gap you found',st.evidence,false,'e.g. Two Le Châtelier questions, forgot temperature effect on K')+'</div>','Save review',v=>{
      const gap = nextGap(st.gap,v.grade);
      change(()=>{
        const stage = st.stage==='Unstarted' ? 'Learning' : st.stage;
        const priority = v.grade==='Again' && st.priority==='Normal' ? 'High' : st.priority;
        data.topics[t.id] = {...st, stage, priority, evidence:v.evidence, gap, next:addDays(today(),gap), last:today(), reviews:(st.reviews||0)+1, history:[...(st.history||[]).slice(-19),{date:today(),grade:v.grade}]};
      });
      notify('Next review of “'+t.title+'” on '+pretty(addDays(today(),gap),{weekday:'short',day:'numeric',month:'short'})+'.');
    });
}
function topicsPage() {
  const c=course(courseId);
  const all=topicsFor(c);
  const flagged=courses.flatMap(topicsFor).filter(t=>topicState(t.id).priority!=='Normal')
    .sort((a,b)=>priorities.indexOf(topicState(b.id).priority)-priorities.indexOf(topicState(a.id).priority));
  const courseTabs=tabGroup('Course','course',courseId,courses.map(c=>[c.id,c.short]));
  const due=dueTopics();
  return pageHead('','Syllabus & priorities','',button('+ Custom topic','new-topic','','primary'))+
    (due.length?section('Due for review',String(due.length),reviewList(due.slice(0,12))):'')+
    section('Priorities','',flagged.length?'<div class="focus-list">'+flagged.map(t=>'<div class="focus-row"><div><div class="line">'+subject(t.course)+badge(topicState(t.id).priority,topicState(t.id).priority==='Urgent'?'alert':'gold')+'</div><strong>'+h(t.title)+'</strong><small>'+h(t.module)+'</small></div>'+button('Plan practice','plan-topic',t.id,'text')+'</div>').join('')+'</div>':emptyCard('Nothing flagged','Set a topic to High or Urgent with its Update button.'))+
    section(c.name,'Year 12 · '+c.year+' syllabus · '+all.filter(t=>topicState(t.id).stage==='Retested').length+' of '+all.length+' topics retested',courseTabs+
    '<div class="topic-tools"><label><input type="checkbox" id="priority-only" '+(priorityOnly?'checked':'')+'> Priorities only</label><a class="subtle-link" href="'+h(c.url)+'" target="_blank" rel="noopener">Official NESA syllabus ↗</a></div>'+
    '<p class="note">Module titles follow NESA. The smaller checklist items are starter revision prompts. Add class-specific texts, dot points or skills as custom topics.</p>'+
    [...new Set(all.map(t=>t.module))].map(module=>{
      const subset=all.filter(t=>t.module===module);
      const shown=priorityOnly?subset.filter(t=>topicState(t.id).priority!=='Normal'):subset;
      if (!shown.length) return '';
      return '<details class="module" '+(priorityOnly||module===all[0]?.module?'open':'')+'><summary><strong>'+h(module)+'</strong><span>'+subset.filter(t=>topicState(t.id).stage==='Retested').length+'/'+subset.length+' retested</span></summary>'+shown.map(t=>{
        const rec=topicState(t.id);
        return '<div class="topic-row"><div><strong>'+h(t.title)+'</strong>'+(rec.evidence?'<small>'+h(rec.evidence)+'</small>':'')+(rec.next?'<small class="'+(reviewDue(rec)?'due':'')+'">'+h(reviewLabel(rec))+'</small>':'')+'</div><div class="line">'+badge(rec.stage,rec.stage==='Retested'?'green':'neutral')+(rec.priority!=='Normal'?badge(rec.priority,rec.priority==='Urgent'?'alert':'gold'):'')+button(reviewDue(rec)?'Review now':'Review','review-topic',t.id,reviewDue(rec)?'secondary':'text')+button('Update','edit-topic',t.id,'text')+'</div></div>';
      }).join('')+'</details>';
    }).join('')+(priorityOnly&&!all.some(t=>topicState(t.id).priority!=='Normal')?emptyCard('No flagged topics for this course','Turn off the filter to see the full checklist.'):''), '');
}
function errorRow(e) {
  const tone=e.stage==='Passed'?'green':e.retest&&e.retest<=today()?'alert':'gold';
  const label=e.retest?(e.retest<today()&&e.stage!=='Passed'?'Overdue · ':'Retest ')+pretty(e.retest):'No retest date yet';
  return '<article class="record"><div class="record-head"><div><div class="line">'+subject(e.course)+badge(e.stage,tone)+badge(e.cause)+'</div><h3>'+h(e.title)+'</h3><p>'+h(e.source||'Source unspecified')+' · '+h(label)+'</p></div><div class="line">'+button('Edit','edit-error',e.id)+(e.stage!=='Passed'?button('Plan repair','plan-error',e.id)+button('Record retest','retest',e.id,'primary'):'')+'</div></div>'+
    (e.repair?'<p class="record-detail"><strong>Repair</strong> '+br(e.repair)+'</p>':'')+
    ((e.attempts||[]).length?'<details class="attempts"><summary>'+e.attempts.length+' retest'+(e.attempts.length===1?'':'s')+' · latest '+h(e.attempts.at(-1).outcome)+'</summary>'+e.attempts.map(at=>'<p>'+h(pretty(at.date))+' · '+h(at.outcome)+' · '+br(at.evidence)+'</p>').join('')+'</details>':'')+'</article>';
}
function practice() {
  const items=dated(data.errors.filter(e=>practiceFilter==='All'||(practiceFilter==='Passed'?e.stage==='Passed':e.stage!=='Passed')),'retest');
  const sessions=dated(data.tasks.filter(t=>Object.hasOwn(templates,t.kind))).reverse();
  return pageHead('','Practice & repair','',button('+ Log error','edit-error','','primary'))+
    '<div class="template-grid">'+Object.entries(templates).map(([key,t])=>'<section class="card template"><span class="template-icon">'+icon(key==='Active retrieval'?'bolt':key==='Timed practice'?'calendar':'check')+'</span><h2>'+h(key)+'</h2><p>'+br(t.text)+'</p>'+button('Use template · '+t.minutes+'m','template',key)+'</section>').join('')+'</div>'+
    section('Error log','',tabGroup('Error status','practice-filter',practiceFilter,['Open','Passed','All'])+
    (items.length?'<div class="record-list">'+items.map(errorRow).join('')+'</div>':emptyCard('No '+practiceFilter.toLowerCase()+' errors here','When a question costs you marks, log the specific error and set a date to test the fix.')))+
    section('Practice history','',sessions.length?'<div class="record-list">'+sessions.map(t=>'<article class="record compact"><div><div class="line">'+subject(t.course)+badge(t.status,t.status==='Done'?'green':'neutral')+'</div><h3>'+h(t.title)+'</h3><p>'+h(pretty(t.date))+' · '+h(t.kind)+(t.result?' · '+h(t.result):'')+'</p></div>'+button('Open session','edit-task',t.id)+'</article>').join('')+'</div>':emptyCard('No practice sessions yet','Start one from a template above.'));
}
function feedback() {
  return pageHead('','Teacher feedback','',button('+ Feedback note','edit-feedback','','primary'))+
    section('Feedback','',data.feedback.length?'<div class="record-list">'+dated(data.feedback).reverse().map(f=>'<article class="record"><div class="record-head"><div><div class="line">'+subject(f.course)+badge(f.status,f.status==='Applied'?'green':'neutral')+'</div><h3>'+h(f.title)+'</h3><p>'+h(pretty(f.date))+(f.context?' · '+h(f.context):'')+'</p></div><div class="line">'+button('Plan action','plan-feedback',f.id)+button('Edit','edit-feedback',f.id)+'</div></div><p class="record-detail">'+br(f.note)+'</p>'+(f.next?'<p class="record-detail"><strong>Next change</strong> '+br(f.next)+'</p>':'')+(f.evidence?'<p class="record-detail"><strong>Evidence</strong> '+br(f.evidence)+'</p>':'')+'</article>').join('')+'</div>':emptyCard('No feedback yet','Log it when a marked task comes back.'));
}
function reviews() {
  const tasks=weekTasks();
  const done=tasks.filter(taskDone);
  const open=tasks.filter(taskOpen);
  const review=weekData().review;
  const history=Object.entries(data.weeks).filter(([key,w])=>key!==week&&w.review).sort(([a],[b])=>b.localeCompare(a));
  return pageHead('','Weekly reviews','',button(review?'Edit review':'+ Write review','edit-review','','primary'))+
    '<div class="toolbar">'+weekPicker()+'</div><div class="metrics">'+
    metric('Blocks finished',done.length,open.length+' still open')+
    metric('Time completed',minutes(done.reduce((n,t)=>n+(t.actual!==''?Number(t.actual):t.minutes),0)),'Actual time where logged')+
    metric('Retests passed',data.errors.flatMap(e=>e.attempts||[]).filter(a=>monday(a.date)===week&&a.outcome==='Passed').length,'Fresh attempts this week')+
    metric('Assessments due',data.assessments.filter(a=>a.date&&monday(a.date)===week).length,'School tasks and Trials')+'</div>'+
    section('This week’s review',weekLabel(),review?'<div class="review-notes">'+[['Marks protected',review.win],['What cost marks or time',review.gap],['Adjustment for next week',review.adjust]].map(([label,value])=>'<div><h3>'+h(label)+'</h3><p>'+br(value||'—')+'</p></div>').join('')+'</div>':emptyCard('Not written yet','Write it at the end of the week.'))+
    (open.length?section('Unfinished','','<div class="record-list">'+open.map(t=>'<div class="record compact"><div><strong>'+h(t.title)+'</strong><p>'+h(pretty(t.date))+' · '+minutes(t.minutes)+'</p></div>'+button('Triage','carry-task',t.id)+'</div>').join('')+'</div>'):'')+
    section('Past reviews','',history.length?'<div class="record-list">'+history.map(([key,w])=>'<div class="record compact"><div><strong>'+h(pretty(key,{day:'numeric',month:'short',year:'numeric'}))+'</strong><p>'+h(w.review.adjust||w.review.win)+'</p></div>'+button('Open week','open-week',key)+'</div>').join('')+'</div>':emptyCard('No earlier reviews','Saved reviews are listed here.'));
}
function routeLabel(r) {
  if (r.name==='list') return course(r.arg)?.name ?? data.lists.find(l=>l.id===r.arg)?.name ?? 'List';
  if (r.name==='tag') return '#'+r.arg;
  if (r.name==='search') return 'Search';
  return routeNames[r.name];
}
function render() {
  const r=route();
  quickCount=0;
  // Remember focus so typing in the detail panel or quick add survives a re-render.
  const active=document.activeElement;
  const focusKey=active?.dataset?.field ? '[data-field="'+active.dataset.field+'"]' : active?.id && active.id!=='search' ? '#'+CSS.escape(active.id) : null;
  $('section-label').textContent=routeLabel(r);
  nav.innerHTML=navHtml(r);
  const opened=[...main.querySelectorAll('details.module[open] summary strong')].map(x=>x.textContent);
  const pages={week:weekly,assess:assessments,topics:topicsPage,practice,feedback,review:reviews,
    calendar:calendarPage,matrix:matrixPage,focus:focusPage,habits:habitsPage,done:completedPage,dash:dashPage,papers:papersPage};
  main.dataset.route=r.name;
  main.innerHTML=(pages[r.name]??taskPage)(r);
  if(r.name==='topics'&&opened.some(title=>[...main.querySelectorAll('details.module summary strong')].some(x=>x.textContent===title))) {
    main.querySelectorAll('details.module').forEach(d=>{d.open=priorityOnly||opened.includes(d.querySelector('summary strong').textContent);});
  }
  if (selected && !row('tasks',selected)) selected=null;
  const panel=$('detail');
  panel.innerHTML=selected?detailPanel(row('tasks',selected)):'';
  panel.hidden=!selected;
  document.querySelector('.panes').classList.toggle('with-detail',!!selected);
  if (r.name!=='search' && document.activeElement!==$('search')) $('search').value='';
  if (focusKey) document.querySelector(focusKey)?.focus();
  renderFull();
  updateTimerDom();
}
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus();});
window.addEventListener('hashchange',()=>{ if(data) {selected=null; render(); window.scrollTo(0,0);} });

const field = (name,label,value='',options={}) => {
  const type=options.type||'text';
  const required=options.required?' required':'';
  const common=' name="'+name+'"'+required;
  let input;
  if(type==='select') input='<select'+common+'>'+options.items.map(item=>{
    const [v,l]=Array.isArray(item)?item:[item,item];
    return '<option value="'+h(v)+'" '+(v===value?'selected':'')+'>'+h(l)+'</option>';
  }).join('')+'</select>';
  else if(type==='textarea') input='<textarea'+common+' rows="'+(options.rows??3)+'" maxlength="4000" placeholder="'+h(options.placeholder)+'">'+h(value)+'</textarea>';
  else input='<input'+common+' type="'+type+'" value="'+h(value)+'" '+(type==='number'?'min="'+(options.min??0)+'" max="'+(options.max??1440)+'" step="'+(options.step??1)+'"':'maxlength="220"')+' placeholder="'+h(options.placeholder)+'">';
  return '<label class="field '+(options.full?'full':'')+'"><span>'+h(label)+(options.required?' <b aria-hidden="true">*</b>':'')+'</span>'+input+'</label>';
};
const select = (key,label,value,items) => field(key,label,value,{type:'select',items});
const textArea = (key,label,value='',required=false,placeholder='') => field(key,label,value,{type:'textarea',full:true,required,placeholder});
const number = (key,label,value,opts={}) => field(key,label,value,{type:'number',...opts});
const dateField = (key,label,value,required=false) => field(key,label,value,{type:'date',required});
const required = (key,label,value='') => field(key,label,value,{required:true,full:true});
const chooseCourse = (id, general=false) => select('course','Course',id,general?[['','General'],...courseOptions()]:courseOptions());
const startDay = () => monday(today())===week ? today() : week;
const courseDefault = () => courseId || 'mx1';
const defaultTask = () => ({title:'',course:'',list:'',date:startDay(),time:'',minutes:30,actual:'',kind:'Assessment prep',status:'Planned',priority:0,tags:[],subtasks:[],repeat:'',notes:'',result:'',link:null,completedAt:null});
const taskKinds = ['Assessment prep','Active retrieval','Timed practice','Repair & retest','Teacher feedback','Homework','Other'];
const PRI = [['0','None','#8b94a1'],['1','Low','#2c6fa8'],['2','Medium','#d98a0f'],['3','High','#c8372d']];
const priColour = p => PRI[Number(p)||0][2];
const parseTags = v => [...new Set(String(v||'').split(/[,\s]+/).map(x=>x.replace(/^#/,'').toLowerCase()).filter(Boolean))];
let currentEditor;
function modal(title,body,submit,onSubmit,remove) {
  currentEditor={onSubmit,remove};
  dialog.innerHTML='<div class="dialog-head"><h2 id="editor-title">'+h(title)+'</h2><button type="button" data-action="close-dialog" aria-label="Close">×</button></div><form id="edit-form"><div class="dialog-content">'+body+'<p id="form-error" class="form-error" role="alert" hidden></p></div><div class="dialog-actions">'+(remove?button(remove.label??'Delete','delete-record','','danger'):'')+'<div></div>'+button('Cancel','close-dialog')+(submit?'<button class="button primary" type="submit">'+h(submit)+'</button>':'')+'</div></form>';
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('input:not([type=hidden]), textarea, select')?.focus();
}
function formError(message) {
  const error = $('form-error');
  error.textContent = message;
  error.hidden = false;
}
function crud(key, record, fields, title, normalize = x=>x, initial={}) {
  modal(title,'<div class="form-grid">'+fields+'</div>','Save',v=>{
    const next=normalize({...initial,...record,...v});
    if (!next) return false;
    change(()=>{
      if (record) Object.assign(record,next);
      else data[key].push({...next,id:uid()});
    });
  },record?()=>change(()=>{data[key]=data[key].filter(x=>x.id!==record.id);}):null);
}
const asNumbers = (value,keys) => { for (const key of keys) if(value[key]!=='') value[key]=Number(value[key]); return value; };
function editTask(record, prefill={}, triage=false) {
  const v={...defaultTask(),...record,...prefill};
  crud('tasks',record, (triage?'<p class="note full">Set a new date and estimate only the work that remains. Choose Dropped if the block is no longer worth doing.</p>':'')+
    required('title','Task',v.title)+chooseCourse(v.course,true)+select('kind','Work type',v.kind,taskKinds)+dateField('date','Date',v.date)+
    field('time','Time',v.time,{type:'time'})+select('priority','Priority',String(v.priority||0),PRI.map(([k,l])=>[k,l]))+
    select('status','Status',v.status,['Planned','In progress','Done','Dropped'])+number('minutes','Estimated minutes',v.minutes,{max:720})+
    number('actual','Actual minutes',v.actual,{max:720})+select('repeat','Repeat',v.repeat||'',Object.entries(repeatLabels))+
    field('tags','Tags',(v.tags||[]).join(', '),{placeholder:'e.g. trial, essay'})+
    textArea('notes','Plan or instructions',v.notes)+textArea('result','Result, score or next change',v.result),
    triage?'Triage unfinished block':record?'Edit task':'Plan a study block',x=>{
      asNumbers(x,['minutes','actual','priority']);
      if (x.minutes==='') x.minutes=0;
      if (x.priority==='') x.priority=0;
      x.tags=parseTags(x.tags);
      x.completedAt=x.status==='Done' ? (x.completedAt||new Date().toISOString()) : null;
      return x;
    },v);
}
function editAssessment(record, kind) {
  const v=record??{title:'',course:courseDefault(),kind:kind||'Assessment',date:'',weight:'',mark:'',outOf:'',status:'Scheduled',scope:'',checks:{}};
  crud('assessments',record,required('title','Task name',v.title)+chooseCourse(v.course)+select('kind','Type',v.kind,['Assessment','Trial'])+
    dateField('date','Due date / exam date',v.date)+number('weight','School weighting (%)',v.weight,{max:100,step:.01})+
    number('mark','Raw mark',v.mark,{max:1000,step:.01})+number('outOf','Out of',v.outOf,{min:.01,max:1000,step:.01})+
    select('status','Status',v.status,assessmentStatuses)+textArea('scope','Scope, conditions and preparation notes',v.scope),record?'Edit assessment':kind==='Trial'?'Add Trial':'Add assessment',x=>{
      asNumbers(x,['weight','mark','outOf']);
      if ((x.mark==='')!==(x.outOf==='') || (x.mark!==''&&x.mark>x.outOf)) { formError('Enter both mark and total. The mark must be at or below the total.'); return null; }
      if (record&&record.kind!==x.kind) x.checks={};
      return x;
    },v);
}
function editCommitment(record) {
  const v=record??{title:'',date:startDay(),minutes:45};
  crud('commitments',record,required('title','Commitment',v.title)+dateField('date','Date',v.date,true)+
    number('minutes','Minutes taken from available time',v.minutes,{min:5,required:true}),record?'Edit commitment':'Add a fixed commitment',x=>asNumbers(x,['minutes']),v);
}
function editCapacity() {
  const w=weekData();
  modal('Set weekly capacity','<div class="form-grid"><p class="note full">Enter the study windows you could use before extra commitments. Leave time for sleep, school, travel, meals and downtime. Add only commitments that overlap these windows.</p>'+
    w.capacity.map((m,i)=>number('d'+i,pretty(addDays(week,i),{weekday:'long'})+' minutes',m,{max:720,required:true})).join('')+
    number('reserve','Reserve buffer (%)',w.reserve,{max:75,required:true})+'</div>','Save capacity',v=>change(()=>{
      data.weeks[week]={...w,reserve:Number(v.reserve),capacity:w.capacity.map((_,i)=>Number(v['d'+i]))};
    }));
}
function editTopic(t) {
  const existing=t?topicState(t.id):{stage:'Unstarted',priority:'Normal',evidence:''};
  const custom=t&&data.customTopics.find(x=>x.id===t.id);
  const details=t&&!custom?'<p class="note full">'+h(t.module)+'</p>':required('title','Topic',t?.title)+chooseCourse(t?.course??courseId)+field('module','Module or grouping',t?.module??'',{full:true,placeholder:'e.g. course module or custom revision'});
  modal(t?t.title:'Add a custom topic','<div class="form-grid">'+details+
    select('stage','Checklist status',existing.stage,topicStages)+select('priority','Revision priority',existing.priority,priorities)+
    textArea('evidence','Evidence or reason for priority',existing.evidence,false,'e.g. Missed direction twice in the timed set')+'</div>','Save topic',v=>change(()=>{
      const id=t?.id??uid();
      if (!t||custom) {
        const info={id,title:v.title,course:v.course,module:v.module||'Custom topics'};
        if(custom) Object.assign(custom,info); else data.customTopics.push(info);
        courseId=info.course;
      }
      data.topics[id]={...(data.topics[id]||{}),stage:v.stage,priority:v.priority,evidence:v.evidence};
    }),custom?()=>change(()=>{data.customTopics=data.customTopics.filter(x=>x.id!==t.id);delete data.topics[t.id];}):null);
}
function editError(record, prefill={}) {
  const v=record??{title:'',course:courseDefault(),source:'',cause:'Concept',stage:'Logged',retest:addDays(today(),2),repair:'',attempts:[],...prefill};
  crud('errors',record,required('title','What went wrong?',v.title)+chooseCourse(v.course)+field('source','Topic / source / question',v.source)+
    select('cause','Error type',v.cause,['Concept','Method','Recall','Misread','Execution','Timing','Expression'])+
    select('stage','Repair status',v.stage,record?.stage==='Passed'?stages:stages.slice(0,-1))+dateField('retest','Next retest date',v.retest)+
    textArea('repair','Repair to try',v.repair,false,'What will you do differently, and what fresh question will test it?'),record?'Edit error':'Log an error',x=>x,v);
}
function editRetest(e) {
  modal('Record a fresh retest','<div class="form-grid"><p class="note full">'+h(e.title)+'</p>'+
    dateField('date','Attempt date',today(),true)+select('outcome','Outcome','Passed',['Passed','Repeat needed'])+
    textArea('evidence','Question, score and evidence','',true)+dateField('retest','Next retest if needed',addDays(today(),3))+'</div>','Save retest',v=>{
      if (v.outcome==='Repeat needed'&&(!v.retest||v.retest<=v.date)) { formError('Choose a next retest date after the attempt.');return false; }
      change(()=>{
        (e.attempts??=[]).push({date:v.date,outcome:v.outcome,evidence:v.evidence});
        e.stage=v.outcome==='Passed'?'Passed':'Retest due';
        e.retest=v.outcome==='Passed'?v.date:v.retest;
      });
    });
}
function editFeedback(record) {
  const v=record??{title:'',course:courseDefault(),date:today(),context:'',note:'',next:'',evidence:'',status:'New'};
  crud('feedback',record,required('title','Feedback title',v.title)+chooseCourse(v.course)+dateField('date','Date',v.date,true)+
    field('context','Teacher, task or criterion',v.context)+select('status','Status',v.status,['New','Planned','Applied'])+
    textArea('note','Teacher feedback',v.note,true)+textArea('next','One change to make',v.next)+textArea('evidence','Evidence of improvement',v.evidence),record?'Edit feedback':'Add teacher feedback',x=>x,v);
}
function editReview() {
  const r=weekData().review??{};
  modal('Review '+weekLabel(),'<div class="form-grid">'+textArea('win','What protected school marks?',r.win,true)+
    textArea('gap','What cost marks or time?',r.gap)+textArea('adjust','What will you change next week?',r.adjust,true)+'</div>','Save review',v=>change(()=>{data.weeks[week]={...data.weeks[week],review:v};}));
}


// ───────────────────────── Task core ─────────────────────────
let selected = null, showDone = false, calMode = 'month', calAnchor = today(), habitOpen = null, dragging = null, grabY = 0;
const pad2 = n => String(n).padStart(2,'0');
const parseCtx = () => ({ today: today(), courses, lists: data.lists });
const doneDay = t => t.completedAt ? sydney.format(new Date(t.completedAt)) : '';
const customList = id => data.lists.find(l=>l.id===id);
const allTags = () => [...new Set(data.tasks.filter(taskOpen).flatMap(t=>t.tags||[]))].sort();
const listColour = id => course(id)?.colour ?? customList(id)?.colour ?? '#6f7d72';

function setDone(t, done) {
  if (!done) { t.status='Planned'; t.completedAt=null; return; }
  t.status='Done';
  t.completedAt=new Date().toISOString();
  if (t.repeat) {
    let next=nextRepeat(t.date||today(),t.repeat);
    while (next<today()) next=nextRepeat(next,t.repeat);
    data.tasks.push({...structuredClone(t),id:uid(),date:next,status:'Planned',completedAt:null,actual:'',result:'',
      subtasks:(t.subtasks||[]).map(x=>({...x,id:uid(),done:false}))});
    t.repeat='';
    notify('Done. Next one is on '+pretty(next,{weekday:'short',day:'numeric',month:'short'})+'.');
  }
}
function selectTask(id) {
  selected = id;
  render();
  if (matchMedia('(max-width:1130px)').matches) $('detail').scrollTop=0;
}
const sortTasks = list => [...list].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999') || (b.priority||0)-(a.priority||0) || (a.time||'99').localeCompare(b.time||'99') || a.title.localeCompare(b.title));
function groupTasks(tasks) {
  const t0=today(), t1=addDays(t0,1), t7=addDays(t0,6), groups=new Map();
  const put=(key,label,t)=>{ if(!groups.has(key)) groups.set(key,{label,items:[]}); groups.get(key).items.push(t); };
  sortTasks(tasks).forEach(t=>{
    if (!t.date) put('9','No date',t);
    else if (t.date<t0) put('0','Overdue',t);
    else if (t.date===t0) put('1','Today',t);
    else if (t.date===t1) put('2','Tomorrow',t);
    else if (t.date<=t7) put('3'+t.date,pretty(t.date,{weekday:'long',day:'numeric',month:'short'}),t);
    else put('8','Later',t);
  });
  return [...groups.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([,g])=>g);
}
function dueLabel(t) {
  if (!t.date) return t.time||'';
  const d=daysFrom(t.date,today());
  let label = d===0?'Today':d===1?'Tomorrow':d===-1?'Yesterday':d>1&&d<7?pretty(t.date,{weekday:'short'}):pretty(t.date);
  return t.time ? label+', '+t.time : label;
}
function stackRow(t, compact=false) {
  const done=t.status==='Done', dropped=t.status==='Dropped', subs=t.subtasks||[];
  const c=course(t.course);
  const meta=[
    c?'<span class="dot-label" style="--c:'+c.colour+'"><i></i>'+h(c.short)+'</span>':'',
    t.list&&customList(t.list)?'<span class="meta-chip" style="--c:'+listColour(t.list)+'">'+icon('folder')+h(customList(t.list).name)+'</span>':'',
    ...(t.tags||[]).map(g=>'<span class="tag-chip">#'+h(g)+'</span>'),
    subs.length?'<span class="meta-chip">'+icon('sub')+subs.filter(x=>x.done).length+'/'+subs.length+'</span>':'',
    t.repeat?'<span class="meta-chip" title="'+h(repeatLabels[t.repeat])+'">'+icon('repeat')+'</span>':'',
    t.notes&&!compact?'<span class="meta-chip" title="Has notes">'+icon('notes')+'</span>':'',
    dropped?badge("Won't do"):''
  ].join('');
  const overdue=t.date&&t.date<today()&&!done;
  return '<div class="srow'+(selected===t.id?' selected':'')+(done||dropped?' done':'')+'" data-select="'+h(t.id)+'" draggable="true" data-drag="'+h(t.id)+'">'+
    '<button type="button" class="check'+(done?' on':'')+'" style="--p:'+priColour(t.priority)+'" aria-label="'+h((done?'Reopen ':'Complete ')+t.title)+'" aria-pressed="'+done+'" data-action="toggle-task" data-id="'+h(t.id)+'">'+(done?'✓':'')+'</button>'+
    '<div class="srow-body"><span class="srow-title">'+h(t.title)+'</span>'+(meta?'<span class="srow-meta">'+meta+'</span>':'')+'</div>'+
    '<span class="srow-due'+(overdue?' overdue':'')+'">'+h(dueLabel(t))+(t.minutes?'<small>'+minutes(t.minutes)+'</small>':'')+'</span></div>';
}
let quickCount = 0;
function quickAdd(where, defaults={}, short=false) {
  const id='quick-'+(quickCount++);
  return '<form class="quick" data-defaults="'+h(JSON.stringify(defaults))+'"><span class="quick-plus" aria-hidden="true">+</span>'+
    '<input id="'+id+'" name="q" autocomplete="off" aria-label="Add a task to '+h(where)+'" placeholder="'+(short?'Add a task':'Add to '+h(where)+' · try “Chem prac fri 4pm #che !high 45m”')+'">'+
    (short?'':'<kbd class="quick-key" aria-hidden="true" title="Press q to add">q</kbd>')+'<button class="button primary quick-go" type="submit">Add</button><div class="quick-preview" aria-live="polite"></div></form>';
}
function previewChips(text) {
  if (!text.trim()) return '';
  const p=parseQuickAdd(text,parseCtx());
  const chips=[];
  if (p.date) chips.push(['date',pretty(p.date,{weekday:'short',day:'numeric',month:'short'})]);
  if (p.time) chips.push(['time',p.time]);
  if (p.course) chips.push(['course',course(p.course).short]);
  if (p.list) chips.push(['list',customList(p.list).name]);
  if (p.priority) chips.push(['priority','! '+PRI[p.priority][1]]);
  if (p.minutes) chips.push(['duration',minutes(p.minutes)]);
  if (p.repeat) chips.push(['repeat',repeatLabels[p.repeat]]);
  p.tags.forEach(g=>chips.push(['tag','#'+g]));
  return chips.length ? '<span class="pv-title">'+h(p.title)+'</span>'+chips.map(([k,v])=>'<span class="pv pv-'+k+'">'+h(v)+'</span>').join('') : '';
}
function createFromQuick(text, defaults={}) {
  const p=parseQuickAdd(text,parseCtx());
  const t={...defaultTask(),date:'',minutes:0,kind:'Other',...defaults,title:p.title,id:uid(),tags:[...new Set([...(defaults.tags||[]),...p.tags])]};
  for (const k of ['date','time','repeat','list','course']) if (p[k]) t[k]=p[k];
  if (p.priority) t.priority=p.priority;
  if (p.minutes) t.minutes=p.minutes;
  change(()=>data.tasks.push(t));
  return t;
}
function listSpec(r) {
  const t0=today(), q=r.arg.toLowerCase();
  switch (r.name) {
    case 'today': return {title:'Today',eyebrow:pretty(t0,{weekday:'long',day:'numeric',month:'long'}),where:'Today',defaults:{date:t0},
      open:t=>t.date&&t.date<=t0, done:t=>doneDay(t)===t0};
    case 'next7': return {title:'Next 7 days',eyebrow:pretty(t0)+' – '+pretty(addDays(t0,6)),where:'Today',defaults:{date:t0},
      open:t=>t.date&&t.date<=addDays(t0,6), done:t=>doneDay(t)>=addDays(t0,-6)};
    case 'inbox': return {title:'Inbox',eyebrow:'',where:'Inbox',defaults:{},open:t=>!t.course&&!t.list,done:t=>!t.course&&!t.list};
    case 'all': return {title:'All tasks',eyebrow:'',where:'Inbox',defaults:{},open:()=>true,done:()=>true};
    case 'tag': return {title:'#'+r.arg,eyebrow:'',where:'#'+r.arg,defaults:{tags:[r.arg]},open:t=>(t.tags||[]).includes(r.arg),done:t=>(t.tags||[]).includes(r.arg)};
    case 'search': return {title:'Search',eyebrow:r.arg?'Results for “'+r.arg+'”':'Type in the search box',where:'Inbox',defaults:{},
      open:t=>!!q&&[t.title,t.notes,t.result,...(t.tags||[])].join(' ').toLowerCase().includes(q), done:t=>!!q&&[t.title,t.notes,...(t.tags||[])].join(' ').toLowerCase().includes(q)};
    case 'list': {
      const c=course(r.arg);
      if (c) return {title:c.name,eyebrow:'',where:c.short,defaults:{course:c.id},open:t=>t.course===c.id,done:t=>t.course===c.id,course:c};
      const l=customList(r.arg);
      return {title:l?.name??'List',eyebrow:'',where:l?.name??'list',defaults:{list:r.arg},open:t=>t.list===r.arg,done:t=>t.list===r.arg,custom:l};
    }
  }
}
function todayStrip() {
  const t0=today();
  const habits=data.habits.filter(hb=>scheduled(hb,t0));
  const due=data.assessments.filter(a=>a.date&&a.date>=t0&&a.date<=addDays(t0,14)&&!['Sat / submitted','Returned'].includes(a.status)).sort((a,b)=>a.date.localeCompare(b.date));
  if (!habits.length && !due.length) return '';
  return '<div class="strip">'+
    (habits.length?'<div class="strip-block"><span class="strip-label">Habits</span>'+habits.map(hb=>'<button type="button" class="habit-chip'+(habitDone(hb,t0)?' on':'')+'" data-action="habit-toggle" data-id="'+h(hb.id)+'" data-date="'+t0+'" aria-pressed="'+habitDone(hb,t0)+'">'+(habitDone(hb,t0)?'✓ ':'')+h(hb.name)+'</button>').join('')+'</div>':'')+
    (due.length?'<div class="strip-block"><span class="strip-label">Due in 14 days</span>'+due.map(a=>'<a class="due-chip" href="#assess" style="--c:'+(course(a.course)?.colour??'#777')+'"><i></i>'+h(a.title)+' <b>'+(daysFrom(a.date,t0)===0?'today':daysFrom(a.date,t0)+'d')+'</b></a>').join('')+'</div>':'')+
  '</div>';
}
function taskPage(r) {
  const spec=listSpec(r);
  const open=data.tasks.filter(t=>taskOpen(t)&&spec.open(t));
  const done=data.tasks.filter(t=>t.status==='Done'&&spec.done(t)).sort((a,b)=>(b.completedAt||'').localeCompare(a.completedAt||''));
  const mins=open.reduce((n,t)=>n+(t.minutes||0),0);
  let actions='';
  if (spec.course) actions=button('Syllabus','open-topics',spec.course.id,'text');
  if (spec.custom) actions=button('Rename','edit-list',spec.custom.id,'text')+button('Delete list','delete-list',spec.custom.id,'text');
  const groups=groupTasks(open);
  return '<div class="list-head"><div>'+(spec.eyebrow?'<div class="eyebrow">'+h(spec.eyebrow)+'</div>':'')+'<h1>'+h(spec.title)+'</h1></div><div class="list-stats"><span>'+open.length+' open</span>'+(mins?'<span>'+minutes(mins)+' planned</span>':'')+actions+'</div></div>'+
    (r.name==='today'?todayStrip():'')+
    (r.name==='search'?'':quickAdd(spec.where,spec.defaults))+
    (groups.length?groups.map(g=>'<section class="group"><h2 class="group-title'+(g.label==='Overdue'?' overdue':'')+'">'+h(g.label)+'<span>'+g.items.length+'</span>'+(g.label==='Overdue'?button('Move all to today','postpone-overdue',r.name+'|'+r.arg,'text'):'')+'</h2>'+g.items.map(t=>stackRow(t)).join('')+'</section>').join('')
      : '<div class="zero"><strong>'+(r.name==='search'?'No matches':'All clear')+'</strong><p>'+(r.name==='search'?'Try another word, tag or subject.':r.name==='today'?'Nothing due today. Add something above or plan from the calendar.':'Add a task above. Dates, times, #subject, #tags and !priority are picked up as you type.')+'</p></div>')+
    (done.length?'<details class="done-group" '+(showDone?'open':'')+'><summary data-action="toggle-done">Completed <span>'+done.length+'</span></summary>'+done.slice(0,60).map(t=>stackRow(t)).join('')+'</details>':'');
}
function completedPage() {
  const list=data.tasks.filter(t=>['Done','Dropped'].includes(t.status)).sort((a,b)=>(b.completedAt||b.date||'').localeCompare(a.completedAt||a.date||''));
  const byDay=new Map();
  list.forEach(t=>{ const k=doneDay(t)||t.date||'Undated'; if(!byDay.has(k)) byDay.set(k,[]); byDay.get(k).push(t); });
  return '<div class="list-head"><div><h1>Completed</h1></div><div class="list-stats"><span>'+list.length+' tasks</span></div></div>'+
    (list.length?[...byDay.entries()].slice(0,40).map(([k,items])=>'<section class="group"><h2 class="group-title">'+h(/^\d{4}-/.test(k)?pretty(k,{weekday:'long',day:'numeric',month:'short'}):k)+'<span>'+items.length+'</span></h2>'+items.map(t=>stackRow(t)).join('')+'</section>').join('')
      :'<div class="zero"><strong>Nothing finished yet</strong><p>Completed tasks are kept here as a record of the work you have done.</p></div>');
}

// ───────────────────────── Detail panel ─────────────────────────
function detailPanel(t) {
  const subs=t.subtasks||[];
  const linked=t.link?{assessment:['Assessment','#assess'],topic:['Syllabus topic','#topics'],error:['Error log','#practice'],feedback:['Teacher feedback','#feedback']}[t.link.type]:null;
  const sessions=data.focus.filter(f=>f.taskId===t.id);
  const done=t.status==='Done';
  // One Notion-style property row: icon and name on the left, a borderless control on the right.
  const prop=(ico,label,control)=>'<div class="prop"><span class="prop-name">'+icon(ico)+h(label)+'</span><div class="prop-value">'+control+'</div></div>';
  const sel=(field,options)=>'<select data-field="'+field+'">'+options+'</select>';
  return '<div class="detail-head">'+
      '<button type="button" class="icon-btn" data-action="close-detail" aria-label="Close details" title="Close (Esc)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l6 6-6 6M13 6l6 6-6 6"/></svg></button>'+
      '<span></span>'+
      '<button type="button" class="peek-btn" data-action="focus-task" data-id="'+h(t.id)+'">'+icon('play')+'Study this</button>'+
      '<button type="button" class="icon-btn" data-action="delete-task" data-id="'+h(t.id)+'" aria-label="Delete task" title="Delete task"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button>'+
    '</div>'+
    '<div class="detail-body">'+
    '<div class="peek-title"><button type="button" class="check big'+(done?' on':'')+'" style="--p:'+priColour(t.priority)+'" data-action="toggle-task" data-id="'+h(t.id)+'" aria-label="'+(done?'Reopen':'Complete')+'">'+(done?'✓':'')+'</button>'+
      '<textarea class="detail-title" data-field="title" rows="1" aria-label="Title" placeholder="Untitled">'+h(t.title)+'</textarea></div>'+
    '<div class="props">'+
      prop('calendar','Date','<input class="detail-date" type="date" data-field="date" value="'+h(t.date)+'" aria-label="Date"><input class="detail-time" type="time" data-field="time" value="'+h(t.time)+'" aria-label="Time">')+
      prop('flag','Priority','<div class="pri-pick" role="group" aria-label="Priority">'+PRI.map(([k,l,c])=>'<button type="button" title="'+l+' priority" aria-pressed="'+(String(t.priority||0)===k)+'" style="--p:'+c+'" data-action="set-priority" data-id="'+k+'">'+(k==='0'?'None':l)+'</button>').join('')+'</div>')+
      prop('book','Subject',sel('course','<option value="">General</option>'+courses.map(c=>'<option value="'+c.id+'" '+(t.course===c.id?'selected':'')+'>'+h(c.name)+'</option>').join('')))+
      prop('list','List',sel('list','<option value="">'+(t.course?'None':'Inbox')+'</option>'+data.lists.map(l=>'<option value="'+h(l.id)+'" '+(t.list===l.id?'selected':'')+'>'+h(l.name)+'</option>').join('')))+
      prop('status','Status',sel('status',['Planned','In progress','Done','Dropped'].map(x=>'<option '+(t.status===x?'selected':'')+'>'+x+'</option>').join('')))+
      prop('repeat','Repeat',sel('repeat',Object.entries(repeatLabels).map(([k,l])=>'<option value="'+k+'" '+((t.repeat||'')===k?'selected':'')+'>'+l+'</option>').join('')))+
      prop('clock','Estimate','<input type="number" min="0" max="720" step="5" data-field="minutes" value="'+h(t.minutes||'')+'" placeholder="Empty" aria-label="Estimate in minutes"><span class="unit">min</span>')+
      prop('clock','Actual','<input type="number" min="0" max="720" data-field="actual" value="'+h(t.actual)+'" placeholder="Empty" aria-label="Actual minutes"><span class="unit">min</span>')+
      prop('shape','Work type',sel('kind',taskKinds.map(x=>'<option '+(t.kind===x?'selected':'')+'>'+x+'</option>').join('')))+
      prop('hash','Tags','<input data-field="tags" value="'+h((t.tags||[]).join(', '))+'" placeholder="Empty" aria-label="Tags">')+
      prop('text','Result','<input data-field="result" value="'+h(t.result)+'" placeholder="Empty" aria-label="Result or next change">')+
    '</div>'+
    (linked||sessions.length?'<p class="detail-link">'+(linked?'Linked to <a href="'+linked[1]+'">'+linked[0]+' →</a>':'')+(linked&&sessions.length?' · ':'')+(sessions.length?sessions.length+' study session'+(sessions.length===1?'':'s')+', '+minutes(sessions.reduce((n,f)=>n+f.minutes,0)):'')+'</p>':'')+
    '<div class="peek-rule"></div>'+
    '<div class="subtasks">'+subs.map(x=>'<div class="sub-row'+(x.done?' done':'')+'"><input type="checkbox" data-sub-toggle="'+h(x.id)+'" '+(x.done?'checked':'')+' aria-label="Complete subtask"><input class="sub-title" data-sub-title="'+h(x.id)+'" value="'+h(x.title)+'" aria-label="Subtask"><button type="button" class="icon-btn small" data-action="sub-delete" data-id="'+h(x.id)+'" aria-label="Delete subtask">'+icon('close')+'</button></div>').join('')+
      '<input id="sub-new" class="sub-new" placeholder="Add a subtask" aria-label="Add subtask"></div>'+
    '<textarea class="detail-notes" data-field="notes" rows="4" placeholder="Add notes, instructions or links…">'+h(t.notes)+'</textarea>'+
    '</div>';
}

// ───────────────────────── Calendar ─────────────────────────
const HOUR_PX=44, DAY_START=6, DAY_END=23;
const calTasks = day => sortTasks(data.tasks.filter(t=>t.date===day&&t.status!=='Dropped')).sort((a,b)=>(a.time||'00').localeCompare(b.time||'00'));
const calAssess = day => data.assessments.filter(a=>a.date===day);
const chip = t => '<div class="cal-chip'+(t.status==='Done'?' done':'')+'" draggable="true" data-drag="'+h(t.id)+'" data-select="'+h(t.id)+'" style="--c:'+listColour(t.course||t.list)+'">'+(t.time?'<b>'+h(t.time)+'</b> ':'')+h(t.title)+'</div>';
const assessChip = a => '<a class="cal-chip assess" href="#assess" style="--c:'+(course(a.course)?.colour??'#795922')+'">⚑ '+h(a.title)+'</a>';
function calendarPage() {
  const monthStart=calAnchor.slice(0,8)+'01';
  const title=calMode==='month'?pretty(monthStart,{month:'long',year:'numeric'}):pretty(monday(calAnchor))+' – '+pretty(addDays(monday(calAnchor),6),{day:'numeric',month:'short',year:'numeric'});
  const unscheduled=data.tasks.filter(t=>taskOpen(t)&&!t.date);
  return '<div class="list-head"><div><h1>'+h(title)+'</h1></div><div class="list-stats">'+
    '<div class="week-picker"><button type="button" aria-label="Previous" data-action="cal-shift" data-id="-1">‹</button>'+button('Today','cal-today','','text')+'<button type="button" aria-label="Next" data-action="cal-shift" data-id="1">›</button></div>'+
    tabGroup('Calendar view','cal-mode',calMode,[['month','Month'],['week','Week']])+'</div></div>'+
    '<div class="cal-wrap">'+(calMode==='month'?monthGrid(monthStart):weekGrid())+
    '<aside class="cal-side card"><h2>No date</h2><p class="note">Drag onto a day to schedule.</p>'+(unscheduled.length?sortTasks(unscheduled).map(chip).join(''):'<p class="note">Everything has a date.</p>')+'</aside></div>';
}
function monthGrid(monthStart) {
  const start=monday(monthStart), month=monthStart.slice(0,7), t0=today();
  const cells=Array.from({length:42},(_,i)=>addDays(start,i));
  return '<div class="month"><div class="month-head">'+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="month-grid">'+cells.map(day=>{
    const tasks=calTasks(day), ass=calAssess(day), items=[...ass.map(assessChip),...tasks.map(chip)];
    return '<div class="cal-cell'+(day.slice(0,7)!==month?' other':'')+(day===t0?' today':'')+'" data-drop-date="'+day+'"><div class="cal-top"><button type="button" class="cal-num" data-action="cal-open-day" data-id="'+day+'" aria-label="Open week of '+h(pretty(day))+'">'+Number(day.slice(8))+'</button><button type="button" class="cal-add" data-action="cal-add" data-id="'+day+'" aria-label="Add task on '+h(pretty(day))+'">+</button></div>'+
      items.slice(0,4).join('')+(items.length>4?'<button type="button" class="cal-more" data-action="cal-open-day" data-id="'+day+'">+'+(items.length-4)+' more</button>':'')+'</div>';
  }).join('')+'</div></div>';
}
function weekGrid() {
  const start=monday(calAnchor), days=Array.from({length:7},(_,i)=>addDays(start,i)), t0=today();
  const hours=Array.from({length:DAY_END-DAY_START},(_,i)=>DAY_START+i);
  const now=new Date(), nowMins=Number(new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',hour:'numeric',hourCycle:'h23'}).format(now))*60+now.getMinutes();
  return '<div class="wk"><div class="wk-head"><span></span>'+days.map(d=>'<button type="button" class="wk-day'+(d===t0?' today':'')+'" data-action="cal-add" data-id="'+d+'"><small>'+pretty(d,{weekday:'short'})+'</small><strong>'+Number(d.slice(8))+'</strong></button>').join('')+'</div>'+
    '<div class="wk-allday"><span class="wk-gutter">All day</span>'+days.map(d=>'<div class="wk-allcell" data-drop-date="'+d+'" data-drop-allday="1">'+calAssess(d).map(assessChip).join('')+calTasks(d).filter(t=>!t.time).map(chip).join('')+'</div>').join('')+'</div>'+
    '<div class="wk-body" style="--hour:'+HOUR_PX+'px"><div class="wk-gutter">'+hours.map(x=>'<span>'+(x%12||12)+(x<12?'am':'pm')+'</span>').join('')+'</div>'+
    days.map(d=>{
      const timed=calTasks(d).filter(t=>t.time);
      const lanes=[]; const placed=timed.map(t=>{
        const [hh,mm]=t.time.split(':').map(Number), s=hh*60+mm, e=s+Math.max(t.minutes||30,20);
        let lane=lanes.findIndex(end=>end<=s); if(lane<0){lane=lanes.length;lanes.push(e);} else lanes[lane]=e;
        return {t,s,e,lane};
      });
      const n=Math.max(1,lanes.length);
      return '<div class="wk-col'+(d===t0?' today':'')+'" data-drop-date="'+d+'" data-drop-col="1" style="height:'+hours.length*HOUR_PX+'px">'+
        (d===t0&&nowMins>DAY_START*60&&nowMins<DAY_END*60?'<i class="now-line" style="top:'+((nowMins-DAY_START*60)/60*HOUR_PX)+'px"></i>':'')+
        placed.map(({t,s,e,lane})=>'<div class="wk-event'+(t.status==='Done'?' done':'')+'" draggable="true" data-drag="'+h(t.id)+'" data-select="'+h(t.id)+'" style="--c:'+listColour(t.course||t.list)+';top:'+Math.max(0,(s-DAY_START*60)/60*HOUR_PX)+'px;height:'+Math.max(20,(e-s)/60*HOUR_PX-2)+'px;left:calc('+(lane*100/n)+'% + 2px);width:calc('+(100/n)+'% - 4px)"><b>'+h(t.time)+'</b> '+h(t.title)+'</div>').join('')+'</div>';
    }).join('')+'</div></div>';
}

// ───────────────────────── Eisenhower matrix ─────────────────────────
// Same default rule as TickTick: the quadrant is the task's priority.
const quads=[[3,'Urgent & important','Do it now'],[2,'Important, not urgent','Schedule it'],[1,'Urgent, not important','Fit it in'],[0,'Not urgent or important','Park or drop it']];
function matrixPage() {
  return '<div class="list-head"><div><h1>Eisenhower matrix</h1></div><div class="list-stats"><span>Drag tasks between boxes to change priority</span></div></div>'+
    '<div class="matrix">'+quads.map(([p,title,sub])=>{
      const items=sortTasks(data.tasks.filter(t=>taskOpen(t)&&(t.priority||0)===p));
      return '<section class="quad" data-drop-priority="'+p+'" style="--p:'+priColour(p)+'"><header><h2>'+h(title)+'</h2><span>'+h(sub)+' · '+items.length+'</span></header>'+
        '<div class="quad-list">'+(items.length?items.map(t=>stackRow(t,true)).join(''):'<p class="note">Nothing here.</p>')+'</div>'+quickAdd(title.toLowerCase(),{priority:p},true)+'</section>';
    }).join('')+'</div>';
}

// ───────────────────────── Study sessions ─────────────────────────
// One timer for the whole app. "open" counts up until you finish; "timed" runs
// Pomodoro rounds. Elapsed time is stored, not derived from a deadline, so
// pausing, reloading and switching tabs never lose minutes.
const TIMER_KEY='hsc-stack:timer:v2';
const freshTimer = () => ({mode:'open',phase:'focus',running:false,elapsed:0,runFrom:0,startedAt:null,taskId:null,course:'',cycle:0});
let timer=(()=>{ try { return {...freshTimer(),...JSON.parse(localStorage.getItem(TIMER_KEY))}; } catch { return freshTimer(); } })();
const pomo = () => data?.settings?.pomo ?? {focus:25,short:5,long:15,every:4};
const studyGoal = () => Number(data?.settings?.studyGoal) || 120;
const phaseSecs = p => (p==='focus'?pomo().focus:p==='short'?pomo().short:pomo().long)*60;
const elapsedSecs = () => Math.floor((timer.elapsed+(timer.running?Date.now()-timer.runFrom:0))/1000);
const countsUp = () => timer.mode==='open' && timer.phase==='focus';
const shownSecs = () => countsUp() ? elapsedSecs() : Math.max(0,phaseSecs(timer.phase)-elapsedSecs());
const sessionActive = () => timer.running || timer.elapsed>0;
const clock = s => (s>=3600?Math.floor(s/3600)+':':'')+pad2(Math.floor(s%3600/60))+':'+pad2(s%60);
const phaseName = {focus:'Study',short:'Short break',long:'Long break'};
const ratings = ['Focused','OK','Distracted'];
const sydneyTime = new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const hhmm = ms => sydneyTime.format(new Date(ms));
function storeTimer() { try { localStorage.setItem(TIMER_KEY,JSON.stringify(timer)); } catch {} }
function resetTimer(extra={}) { Object.assign(timer,{running:false,elapsed:0,runFrom:0,startedAt:null},extra); storeTimer(); }
function startTimer() {
  if (timer.running) return;
  if (timer.phase==='focus' && !timer.startedAt) timer.startedAt=Date.now();
  timer.runFrom=Date.now();
  timer.running=true;
  storeTimer();
  if (timer.mode==='timed' && 'Notification' in window && Notification.permission==='default') Notification.requestPermission().catch(()=>{});
}
function pauseTimer() {
  if (!timer.running) return;
  timer.elapsed+=Date.now()-timer.runFrom;
  timer.running=false;
  storeTimer();
}
const sessionTitle = s => row('tasks',s.taskId)?.title ?? (s.title && s.title!=='Untitled focus' ? s.title : course(s.course)?.short ?? 'Study');
const sessionStart = s => s.start ? Date.parse(s.start) : Date.parse(s.end)-s.minutes*60000;
function addSession(s) {
  const t=s.taskId&&row('tasks',s.taskId);
  data.focus.push({id:uid(),note:'',rating:'',...s,title:t?.title??s.title??''});
  if (t) t.actual=(Number(t.actual)||0)+s.minutes;
}
// Timed mode: a finished round goes straight into the log; you can add a note later.
function finishPhase() {
  const was=timer.phase;
  if (was==='focus') {
    const mins=pomo().focus, end=Date.now(), startMs=timer.startedAt??end-mins*60000;
    change(()=>addSession({taskId:timer.taskId,course:timer.course,date:sydney.format(new Date(startMs)),start:new Date(startMs).toISOString(),end:new Date(end).toISOString(),minutes:mins}));
    timer.cycle=(timer.cycle||0)+1;
    resetTimer({phase:timer.cycle%pomo().every===0?'long':'short'});
  } else resetTimer({phase:'focus'});
  chime();
  const msg=was==='focus'?'Logged '+minutes(pomo().focus)+'. Time for a '+phaseName[timer.phase].toLowerCase()+'.':'Break over. Start the next round when you are ready.';
  notify(msg);
  try { if ('Notification' in window && Notification.permission==='granted' && document.hidden) new Notification('Stacky',{body:msg}); } catch {}
  if (data) render();
}
function chime() {
  try {
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    [0,.25,.5].forEach((d,i)=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.value=[660,880,990][i]; g.gain.setValueAtTime(.0001,ctx.currentTime+d); g.gain.exponentialRampToValueAtTime(.2,ctx.currentTime+d+.02); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d+.22); o.connect(g).connect(ctx.destination); o.start(ctx.currentTime+d); o.stop(ctx.currentTime+d+.25); });
  } catch {}
}
function toggleTimer() {
  if (timer.running) pauseTimer(); else startTimer();
  render();
}

// One form for finishing a session, logging a past one, and editing the log.
function sessionForm(s, title, submit, onDiscard) {
  const open=sortTasks(data.tasks.filter(t=>taskOpen(t)||t.id===s.taskId));
  const start=sessionStart(s);
  modal(title,'<div class="form-grid">'+
    select('course','Subject',s.course||'',[['','General'],...courseOptions()])+
    select('taskId','Task (optional)',s.taskId||'',[['','No task'],...open.map(t=>[t.id,t.title])])+
    dateField('date','Date',s.date,true)+
    field('start','Started at',hhmm(start),{type:'time',required:true})+
    number('minutes','Minutes studied',s.minutes,{min:1,max:720,required:true})+
    select('rating','How it went',s.rating||'',[['','—'],...ratings.map(r=>[r,r])])+
    textArea('note','What you did',s.note||'',false,'e.g. 2023 paper Q11–14, need to redo the projectile question')+
    '</div>',submit,v=>{
      const mins=Math.round(Number(v.minutes));
      if (!(mins>=1&&mins<=720)) { formError('Minutes must be between 1 and 720.'); return false; }
      const startMs=Date.parse(v.date+'T'+v.start);
      if (Number.isNaN(startMs)) { formError('Check the date and start time.'); return false; }
      const t=v.taskId&&row('tasks',v.taskId);
      const next={taskId:v.taskId||null,course:v.course||t?.course||'',date:v.date,start:new Date(startMs).toISOString(),end:new Date(startMs+mins*60000).toISOString(),minutes:mins,rating:v.rating,note:v.note};
      change(()=>{
        if (s.id) {
          const old=row('tasks',s.taskId); if (old) old.actual=Math.max(0,(Number(old.actual)||0)-s.minutes);
          Object.assign(row('focus',s.id),next,{title:t?.title??''});
          if (t) t.actual=(Number(t.actual)||0)+mins;
        } else addSession(next);
      });
      if (!s.id) { resetTimer({phase:'focus'}); notify('Logged '+minutes(mins)+(course(next.course)?' of '+course(next.course).short:'')+'.'); render(); }
    },onDiscard);
}
// ───────────────────────── Full-screen timer ─────────────────────────
// An overlay outside <main>, so re-renders of the page underneath never touch it.
// It asks the browser for real full screen where allowed (not on iPhone Safari,
// where the overlay simply fills the window) and keeps the screen awake.
let fullTimer = false, wakeLock = null, chromeHidden = false, chromeTimer;
const fsEl = () => $('fs-timer');
async function keepAwake() {
  try { if ('wakeLock' in navigator && !wakeLock && document.visibilityState==='visible') { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release',()=>{ wakeLock=null; }); } } catch {}
}
function openFull() {
  fullTimer = true; chromeHidden = false;
  renderFull();
  const el = fsEl();
  if (el.requestFullscreen && !document.fullscreenElement) el.requestFullscreen({navigationUI:'hide'}).catch(()=>{});
  else if (el.webkitRequestFullscreen) { try { el.webkitRequestFullscreen(); } catch {} }
  keepAwake();
  el.focus();
  idleChrome();
}
function closeFull() {
  if (!fullTimer) return;
  fullTimer = false;
  if (document.fullscreenElement) document.exitFullscreen().catch(()=>{});
  else if (document.webkitFullscreenElement) { try { document.webkitExitFullscreen(); } catch {} }
  try { wakeLock?.release(); } catch {}
  wakeLock = null;
  clearTimeout(chromeTimer);
  renderFull();
}
// Controls fade after a few seconds of no movement while the timer runs.
function idleChrome() {
  clearTimeout(chromeTimer);
  if (chromeHidden) { chromeHidden=false; fsEl().classList.remove('calm'); }
  chromeTimer = setTimeout(()=>{ if (fullTimer && timer.running) { chromeHidden=true; fsEl().classList.add('calm'); } },4000);
}
function renderFull() {
  const el = fsEl();
  if (!el) return;
  el.hidden = !fullTimer;
  if (!fullTimer) { el.innerHTML=''; return; }
  const onBreak = timer.phase!=='focus', active = sessionActive(), secs = shownSecs();
  const c = course(timer.course), t = row('tasks',timer.taskId);
  const s = studyStats(), goal = studyGoal();
  const controls = timer.running
    ? button('Pause','timer-pause','','secondary')+(onBreak?button('Skip break','timer-skip','','text'):button('Finish','timer-finish','','primary'))
    : active ? button('Resume','timer-start','','primary')+(onBreak?button('Skip break','timer-skip','','text'):button('Finish','timer-finish','','secondary'))
    : onBreak ? button('Start '+phaseName[timer.phase].toLowerCase(),'timer-start','','primary')+button('Skip break','timer-skip','','text')
    : button('Start studying','timer-start','','primary');
  el.dataset.phase = timer.phase;
  el.classList.toggle('running', timer.running);
  el.style.setProperty('--c', onBreak ? 'var(--sky)' : c?.colour ?? 'var(--biro)');
  el.innerHTML = '<div class="fs-top"><span class="fs-state">'+(timer.running?'<i></i>':'')+h(onBreak?phaseName[timer.phase]:timer.running?'Studying':active?'Paused':'Ready')+'</span>'+
      '<button type="button" class="fs-exit" data-action="timer-full-exit" aria-label="Exit full screen" title="Exit (Esc)">'+icon('close')+'</button></div>'+
    '<div class="fs-centre">'+
      (onBreak?'<p class="fs-what">Stand up, look away from the screen, drink some water.</p>'
        :'<p class="fs-what"><span class="fs-subject"><i></i>'+h(c?.short??'General')+'</span>'+(t?'<span class="fs-task">'+h(t.title)+'</span>':'')+'</p>')+
      '<div id="fs-text" class="fs-clock" role="timer" aria-live="off">'+clock(secs)+'</div>'+
      (countsUp()?'<p class="fs-sub">'+(active&&timer.startedAt?'Started '+hhmm(timer.startedAt):'Counts up until you finish')+'</p>'
        :'<div class="fs-bar"><i id="fs-bar" style="width:'+(100*(1-secs/phaseSecs(timer.phase)))+'%"></i></div><p class="fs-sub">'+(onBreak?'Round '+((timer.cycle||0)%pomo().every||pomo().every)+' of '+pomo().every+' done':'Round '+((timer.cycle||0)%pomo().every+1)+' of '+pomo().every+' · '+pomo().focus+' min')+'</p>')+
      '<div class="fs-buttons">'+controls+'</div>'+
    '</div>'+
    '<div class="fs-foot"><span><b>'+minutes(s.today)+'</b> of '+minutes(goal)+' today</span><span><kbd>Space</kbd> start or pause · <kbd>Esc</kbd> exit</span></div>';
}
document.addEventListener('fullscreenchange',()=>{ if (!document.fullscreenElement && fullTimer) closeFull(); });
document.addEventListener('visibilitychange',()=>{ if (fullTimer && document.visibilityState==='visible') keepAwake(); });
document.addEventListener('pointermove',()=>{ if (fullTimer) idleChrome(); });

function finishSession() {
  closeFull();   // the finish form is a dialog; leave full screen so it can show
  pauseTimer();
  const secs=timer.phase==='focus'?elapsedSecs():0;
  const mins=Math.max(1,Math.round(secs/60)), startMs=timer.startedAt??Date.now()-secs*1000;
  sessionForm({taskId:timer.taskId,course:timer.course,date:sydney.format(new Date(startMs)),start:new Date(startMs).toISOString(),minutes:mins},
    'Finish session · '+clock(secs),'Save to log',
    {label:'Discard',title:'Discard this session?',body:'The timer resets and nothing is logged.',run:()=>{resetTimer({phase:'focus'});render();}});
  render();
}
const logPast = () => sessionForm({course:timer.course,date:today(),start:new Date(Date.now()-3600000).toISOString(),minutes:60},'Log a past session','Save to log');
const editSession = s => sessionForm(s,'Edit session','Save',{label:'Delete',title:'Delete this session?',body:'It is removed from your log and its minutes come off the task.',run:()=>change(()=>{
  const t=row('tasks',s.taskId); if (t) t.actual=Math.max(0,(Number(t.actual)||0)-s.minutes);
  data.focus=data.focus.filter(f=>f.id!==s.id);
})});

function updateTimerDom() {
  const secs=shownSecs();
  const text=$('timer-text'); if (text) text.textContent=clock(secs);
  const bar=$('timer-bar'); if (bar) bar.style.width=(countsUp()?0:100*(1-secs/phaseSecs(timer.phase)))+'%';
  const fsText=$('fs-text'); if (fsText) fsText.textContent=clock(secs);
  const fsBar=$('fs-bar'); if (fsBar) fsBar.style.width=(100*(1-secs/phaseSecs(timer.phase)))+'%';
  const mini=$('mini-timer');
  if (mini) {
    mini.hidden=!sessionActive() || route().name==='focus';
    const who=timer.phase==='focus'?(course(timer.course)?.short??'Study'):phaseName[timer.phase];
    mini.textContent=(timer.running?'● ':'❚❚ ')+who+' '+clock(secs);
    mini.dataset.phase=timer.phase;
  }
  document.title=timer.running?clock(secs)+' · '+(timer.phase==='focus'?(course(timer.course)?.short??'Study'):phaseName[timer.phase])+' · Stacky':'Stacky';
}
setInterval(()=>{ if (!data) return; if (timer.running && !countsUp() && elapsedSecs()>=phaseSecs(timer.phase)) finishPhase(); else updateTimerDom(); },1000);

function studyStats() {
  const t0=today(), wk=monday(t0);
  const sum=list=>list.reduce((n,f)=>n+f.minutes,0);
  const on=d=>data.focus.filter(f=>f.date===d);
  const week=data.focus.filter(f=>f.date>=wk && f.date<=addDays(wk,6));
  const bySubject=courses.map(c=>[c,sum(week.filter(f=>f.course===c.id))]).concat([[{short:'General',colour:'#8b94a1'},sum(week.filter(f=>!course(f.course)))]]).filter(([,m])=>m>0).sort((a,b)=>b[1]-a[1]);
  const days=Array.from({length:7},(_,i)=>addDays(wk,i)).map(d=>[d,sum(on(d))]);
  let streak=0, d=sum(on(t0))>0?t0:addDays(t0,-1);
  while (sum(on(d))>0) { streak++; d=addDays(d,-1); }
  return {sum,today:sum(on(t0)),todayCount:on(t0).length,week:sum(week),weekCount:week.length,bySubject,max:Math.max(1,...bySubject.map(([,m])=>m)),days,dmax:Math.max(1,studyGoal(),...days.map(([,m])=>m)),streak};
}
let logDays=7;
function dayName(d) {
  const n=daysFrom(today(),d);
  return n===0?'Today':n===1?'Yesterday':pretty(d,{weekday:'short',day:'numeric',month:'short'});
}
function studyLog() {
  const dates=[...new Set(data.focus.map(f=>f.date))].sort().reverse();
  if (!dates.length) return '<div class="log-empty"><strong>Nothing logged yet</strong><p>Start a session above, or log one you did without the timer.</p></div>';
  const shown=dates.slice(0,logDays);
  return shown.map(d=>{
    const list=data.focus.filter(f=>f.date===d).sort((a,b)=>sessionStart(b)-sessionStart(a));
    const total=list.reduce((n,f)=>n+f.minutes,0);
    return '<section class="log-day"><header><h3>'+h(dayName(d))+'</h3><span>'+minutes(total)+'</span></header>'+list.map(f=>{
      const c=course(f.course), st=sessionStart(f);
      return '<button type="button" class="log-row" data-action="edit-session" data-id="'+h(f.id)+'" style="--c:'+(c?.colour??'#8b94a1')+'">'+
        '<span class="log-time">'+hhmm(st)+'–'+hhmm(st+f.minutes*60000)+'</span>'+
        '<span class="log-what"><strong><i></i>'+h(c?.short??'General')+'</strong> '+(f.taskId||(f.title&&f.title!=='Untitled focus')?'<span>'+h(sessionTitle(f))+'</span>':'')+
        (f.note?'<small>'+h(f.note)+'</small>':'')+'</span>'+
        (f.rating?'<span class="log-rating" data-rating="'+h(f.rating)+'">'+h(f.rating)+'</span>':'<span></span>')+
        '<span class="log-mins">'+minutes(f.minutes)+'</span></button>';
    }).join('')+'</section>';
  }).join('')+(dates.length>logDays?'<button type="button" class="button text log-more" data-action="log-more">Show older days ('+(dates.length-logDays)+')</button>':'');
}
const focusLengths = [25,45,60,90];
function focusPage() {
  const s=studyStats(), secs=shownSecs(), active=sessionActive(), onBreak=timer.phase!=='focus';
  const open=sortTasks(data.tasks.filter(taskOpen));
  const goal=studyGoal(), pct=Math.min(100,s.today/goal*100);
  const c=course(timer.course);
  const subjects=[['','General','#8b94a1'],...courses.map(x=>[x.id,x.short,x.colour])].map(([id,label,col])=>
    '<button type="button" class="subj" style="--c:'+col+'" aria-pressed="'+((timer.course||'')===id)+'" data-action="study-course" data-id="'+id+'"><i></i>'+h(label)+'</button>').join('');
  const controls = timer.running
    ? button('Pause','timer-pause','','primary')+(onBreak?button('Skip break','timer-skip','','text'):button('Finish','timer-finish','','secondary'))
    : active
      ? button('Resume','timer-start','','primary')+(onBreak?button('Skip break','timer-skip','','text'):button('Finish','timer-finish','','secondary'))
      : onBreak ? button('Start '+phaseName[timer.phase].toLowerCase(),'timer-start','','primary')+button('Skip break','timer-skip','','text')
      : button('Start','timer-start','','primary');
  const state = timer.running ? (onBreak?'On a break':'Studying') : active ? 'Paused' : onBreak ? phaseName[timer.phase] : 'Ready';
  const info = onBreak ? 'Round '+((timer.cycle||0)%pomo().every||pomo().every)+' of '+pomo().every+' done'
    : timer.mode==='timed' ? 'Round '+((timer.cycle||0)%pomo().every+1)+' of '+pomo().every
    : active ? 'Started '+hhmm(timer.startedAt) : 'Counts up until you finish';
  const lengths = timer.mode==='timed' && !active && !onBreak
    ? '<span class="lengths" role="group" aria-label="Round length">'+[...new Set([...focusLengths,pomo().focus])].sort((a,b)=>a-b).map(m=>'<button type="button" aria-pressed="'+(pomo().focus===m)+'" data-action="focus-length" data-id="'+m+'">'+m+'</button>').join('')+'<small>min</small></span>' : '';
  return '<div class="list-head"><div><h1>Study</h1></div><div class="list-stats">'+button('Timer settings','settings','','text')+'</div></div>'+
    '<section class="timer'+(timer.running?' running':'')+(onBreak?' break':'')+(active?' active':'')+'" style="--c:'+(onBreak?'var(--sky)':c?.colour??'var(--ink)')+'">'+
      (onBreak?'<p class="timer-break">Stand up, look away from the screen, drink some water.</p>'
        :'<div class="subjects" role="group" aria-label="Subject">'+subjects+'</div>'+
         '<label class="timer-task"><span class="sr">Task</span><select data-timer-task><option value="">No task, just the subject</option>'+open.map(x=>'<option value="'+h(x.id)+'" '+(x.id===timer.taskId?'selected':'')+'>'+h(x.title)+'</option>').join('')+'</select></label>')+
      '<div id="timer-text" class="timer-clock" role="timer" aria-live="off">'+clock(secs)+'</div>'+
      (countsUp()?'':'<div class="timer-bar"><i id="timer-bar" style="width:'+(100*(1-secs/phaseSecs(timer.phase)))+'%"></i></div>')+
      '<p class="timer-meta"><span class="timer-state">'+(timer.running?'<i></i>':'')+h(state)+'</span><span>'+h(info)+'</span></p>'+
      '<div class="timer-row"><div class="timer-buttons">'+controls+'</div>'+
        '<div class="timer-opts"><span class="modes" role="group" aria-label="Timer type">'+[['open','Open'],['timed','Timed']].map(([k,l])=>'<button type="button" aria-pressed="'+(timer.mode===k)+'" data-action="study-mode" data-id="'+k+'">'+l+'</button>').join('')+'</span>'+lengths+
        '<button type="button" class="full-btn" data-action="timer-full" title="Full screen (f)" aria-label="Full screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button></div></div>'+
      '<p class="timer-keys"><kbd>s</kbd> start / pause &nbsp; <kbd>f</kbd> full screen</p>'+
    '</section>'+
    '<div class="today-line"><div><span>Today</span><strong>'+minutes(s.today)+'</strong><small>of '+minutes(goal)+(s.today>=goal?', goal met':'')+'</small></div><div class="goal-bar"><i style="width:'+pct+'%"></i></div>'+
      '<p><span><b>'+s.streak+'</b> day streak</span><span><b>'+minutes(s.week)+'</b> this week</span><span><b>'+s.todayCount+'</b> session'+(s.todayCount===1?'':'s')+' today</span></p></div>'+
    '<div class="study-grid">'+
      section('This week','','<div class="bars">'+s.days.map(([d,m])=>'<div class="bar-col'+(d===today()?' today':'')+(m>=goal?' hit':'')+'"><i style="height:'+(m/s.dmax*100)+'%"></i><span>'+pretty(d,{weekday:'narrow'})+'</span><small>'+(m?minutes(m):'')+'</small></div>').join('')+'</div>')+
      section('By subject','This week',s.bySubject.length?s.bySubject.map(([x,m])=>'<div class="hbar"><span>'+h(x.short)+'</span><div><i style="width:'+(m/s.max*100)+'%;background:'+x.colour+'"></i></div><b>'+minutes(m)+'</b></div>').join(''):'<p class="note">Nothing logged this week yet.</p>')+
    '</div>'+
    '<section class="study-log"><div class="log-head"><h2>Log</h2>'+button('+ Log a past session','log-past','','text')+'</div>'+studyLog()+'</section>';
}

// ───────────────────────── Habits ─────────────────────────
const habitDone = (hb,d) => !!data.habitLog[hb.id]?.[d];
const scheduled = (hb,d) => !hb.days || hb.days[date(d).getUTCDay()] !== false;
const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function streak(hb) {
  let d=today(), n=0;
  if (!habitDone(hb,d)) d=addDays(d,-1);
  for (let i=0;i<730;i++,d=addDays(d,-1)) {
    if (!scheduled(hb,d)) continue;
    if (habitDone(hb,d)) n++; else break;
  }
  return n;
}
function habitRate(hb, span=30) {
  let due=0, done=0;
  const first=[hb.created||today(),...Object.keys(data.habitLog[hb.id]||{})].sort()[0];
  for (let i=0;i<span;i++) { const d=addDays(today(),-i); if (d<first) break; if (scheduled(hb,d)) { due++; if (habitDone(hb,d)) done++; } }
  return due?Math.round(done/due*100):0;
}
const habitSuggestions=[['Flashcard review',''],['One past-paper question',''],['Read for English','eng'],['Lights out by 11pm',''],['Exercise 30 min','']];
function habitsPage() {
  const days=Array.from({length:7},(_,i)=>addDays(today(),i-6));
  return '<div class="list-head"><div><h1>Habits</h1></div><div class="list-stats">'+button('+ New habit','edit-habit','','primary')+'</div></div>'+
    (data.habits.length?'<div class="card habits"><div class="habit-row head"><span></span>'+days.map(d=>'<span class="hd'+(d===today()?' today':'')+'">'+pretty(d,{weekday:'narrow'})+'<small>'+Number(d.slice(8))+'</small></span>').join('')+'<span>Streak</span></div>'+
      data.habits.map(hb=>'<div class="habit-row"><button type="button" class="habit-name" data-action="habit-open" data-id="'+h(hb.id)+'">'+(course(hb.course)?'<i class="dot" style="--c:'+course(hb.course).colour+'"></i>':'')+'<strong>'+h(hb.name)+'</strong><small>'+(hb.days&&hb.days.includes(false)?dayNames.filter((_,i)=>hb.days[i]).join(' '):'Every day')+' · '+habitRate(hb)+'% last 30 days</small></button>'+
        days.map(d=>scheduled(hb,d)?'<button type="button" class="hcheck'+(habitDone(hb,d)?' on':'')+'" data-action="habit-toggle" data-id="'+h(hb.id)+'" data-date="'+d+'" aria-pressed="'+habitDone(hb,d)+'" aria-label="'+h(hb.name)+' on '+h(pretty(d))+'">'+(habitDone(hb,d)?'✓':'')+'</button>':'<span class="hrest" title="Rest day">·</span>').join('')+
        '<span class="streak"><b>'+streak(hb)+'</b> day'+(streak(hb)===1?'':'s')+'</span></div>'+(habitOpen===hb.id?habitDetail(hb):'')).join('')+'</div>'
      :'<div class="zero"><strong>No habits yet</strong><p>Start with one of these, or add your own.</p><div class="line wrap">'+habitSuggestions.map(([n,c])=>button('+ '+n,'habit-suggest',n+'|'+c)).join('')+'</div></div>');
}
function habitDetail(hb) {
  const end=addDays(monday(today()),6), start=addDays(end,-7*16+1);
  const cells=Array.from({length:7*16},(_,i)=>addDays(start,i));
  const total=Object.keys(data.habitLog[hb.id]||{}).length;
  return '<div class="habit-detail"><div class="heat" aria-label="Last 16 weeks">'+cells.map(d=>'<i class="'+(d>today()?'future':habitDone(hb,d)?'on':scheduled(hb,d)?'':'rest')+'" title="'+h(pretty(d))+'"></i>').join('')+'</div>'+
    '<div class="habit-facts"><span><b>'+streak(hb)+'</b> current streak</span><span><b>'+total+'</b> total check-ins</span><span><b>'+habitRate(hb,90)+'%</b> last 90 days</span>'+button('Edit habit','edit-habit',hb.id,'text')+'</div></div>';
}
function editHabit(hb) {
  const v=hb??{name:'',course:'',days:[true,true,true,true,true,true,true]};
  const d=v.days??Array(7).fill(true);
  modal(hb?'Edit habit':'New habit','<div class="form-grid">'+required('name','Habit',v.name)+chooseCourse(v.course,true)+
    '<fieldset class="field full days-pick"><legend>Days</legend>'+[1,2,3,4,5,6,0].map(i=>'<label><input type="checkbox" name="day'+i+'" value="1" '+(d[i]?'checked':'')+'> '+dayNames[i]+'</label>').join('')+'</fieldset></div>',
    'Save habit',x=>{
      const days=[0,1,2,3,4,5,6].map(i=>x['day'+i]==='1');
      if (!days.some(Boolean)) { formError('Pick at least one day.'); return false; }
      change(()=>{ if (hb) Object.assign(hb,{name:x.name,course:x.course,days}); else data.habits.push({id:uid(),name:x.name,course:x.course,days,created:today()}); });
    }, hb?()=>change(()=>{ data.habits=data.habits.filter(z=>z.id!==hb.id); delete data.habitLog[hb.id]; }):null);
}

// ───────────────────────── Overview dashboard ─────────────────────────
const countdown = (label, day, empty) => {
  if (!day) return metric(label,'—',empty);
  const n=daysFrom(day,today());
  return metric(label, n<0?'Done':n===0?'Today':n+'d', pretty(day,{weekday:'short',day:'numeric',month:'short',year:'numeric'})+(n>0?' · '+Math.ceil(n/7)+' wk'+(Math.ceil(n/7)===1?'':'s'):''), n>=0&&n<=14?'alert':'');
};
function reviewList(list) {
  return '<div class="focus-list">'+list.map(t=>{
    const st=topicState(t.id);
    return '<div class="focus-row"><div><div class="line">'+subject(t.course)+(st.priority!=='Normal'?badge(st.priority,st.priority==='Urgent'?'alert':'gold'):'')+'</div><strong>'+h(t.title)+'</strong><small>'+h(t.module)+' · '+h(reviewLabel(st))+'</small></div>'+button('Review','review-topic',t.id,'text')+'</div>';
  }).join('')+'</div>';
}
const paperPct = p => hasMark(p) ? p.mark/p.outOf*100 : null;
function subjectBalance() {
  const t0=today(), from7=addDays(t0,-6), from28=addDays(t0,-27);
  return courses.map(c=>{
    const mins=from=>data.focus.filter(f=>f.course===c.id&&f.date>=from&&f.date<=t0).reduce((n,f)=>n+f.minutes,0);
    const topics=topicsFor(c), covered=topics.filter(t=>['Practised','Retested'].includes(topicState(t.id).stage)).length;
    const due=topics.filter(t=>reviewDue(topicState(t.id))).length;
    const errors=data.errors.filter(e=>e.course===c.id&&e.stage!=='Passed').length;
    const papers=data.papers.filter(p=>p.course===c.id&&paperPct(p)!=null);
    const avg=papers.length?papers.reduce((n,p)=>n+paperPct(p),0)/papers.length:null;
    const next=deadlines().find(a=>a.course===c.id&&a.date>=t0);
    const soon=next&&daysFrom(next.date,t0)<=21;
    return {c,week:mins(from7),month:mins(from28),topics:topics.length,covered,due,errors,papers:papers.length,avg,next,flag:mins(from7)===0&&(soon||due>0)};
  });
}
function dashPage() {
  const t0=today(), s=studyStats(), goal=studyGoal(), set=data.settings;
  const trial=set.trialStart||data.assessments.filter(a=>a.kind==='Trial'&&a.date&&a.date>=t0).map(a=>a.date).sort()[0]||'';
  const next=deadlines().find(a=>a.date>=t0);
  const overdue=data.tasks.filter(t=>taskOpen(t)&&t.date&&t.date<t0);
  const todays=sortTasks(data.tasks.filter(t=>taskOpen(t)&&t.date&&t.date<=t0));
  const due=dueTopics();
  const retestsDue=data.errors.filter(e=>e.stage!=='Passed'&&e.retest&&e.retest<=addDays(t0,7)).sort((a,b)=>a.retest.localeCompare(b.retest));
  const newFeedback=data.feedback.filter(f=>f.status==='New');
  const rows=subjectBalance(), maxMonth=Math.max(1,...rows.map(r=>r.month));
  const hasRecords=data.tasks.length||data.assessments.length||data.focus.length||data.papers.length;
  const staleBackup=localMode&&hasRecords&&(!set.lastExport||daysFrom(t0,set.lastExport)>=7);
  return '<div class="list-head"><div><div class="eyebrow">'+h(pretty(t0,{weekday:'long',day:'numeric',month:'long'}))+'</div><h1>Overview</h1></div><div class="list-stats">'+button('Exam dates','settings','','text')+button('Start studying','go-study','','primary')+'</div></div>'+
    (staleBackup?'<div class="banner"><div><strong>'+(set.lastExport?'Last backup was '+daysFrom(t0,set.lastExport)+' days ago':'You have not exported a backup yet')+'</strong><span>Your records live only in this browser. Clearing site data or losing the device would lose them.</span></div>'+button('Export backup','export','','primary')+'</div>':'')+
    '<div class="metrics">'+
      (next?metric('Next assessment',daysFrom(next.date,t0)===0?'Today':daysFrom(next.date,t0)+'d',next.title+(next.weight!==''?' · '+next.weight+'%':''),daysFrom(next.date,t0)<=7?'alert':''):metric('Next assessment','—','None logged'))+
      countdown('Trials',trial,'Add a Trial or set the date')+
      countdown('HSC exams',set.hscStart,'Set the first exam date')+
      metric('Studied this week',minutes(s.week),(s.streak?s.streak+' day streak · ':'')+'goal '+minutes(goal*7),s.week>=goal*7?'accent':'')+
    '</div>'+
    '<div class="dash-today">'+
      section('Today',todays.length?todays.length+' open'+(overdue.length?' · '+overdue.length+' overdue':''):'',
        (todays.length?todays.slice(0,6).map(t=>stackRow(t,true)).join('')+(todays.length>6?'<a class="subtle-link more-link" href="#today">'+(todays.length-6)+' more →</a>':''):emptyCard('Nothing due today',''))+quickAdd('Today',{date:t0},true),
        '<a class="subtle-link" href="#today">Open →</a>')+
    '</div><div class="dash-grid">'+
      section('Reviews',due.length?String(due.length):'',
        due.length?reviewList(due.slice(0,6))+(due.length>6?'<a class="subtle-link more-link" href="#topics">'+(due.length-6)+' more →</a>':''):emptyCard('No reviews due','Press Review on a syllabus topic after you study it.'),
        '<a class="subtle-link" href="#topics">Syllabus →</a>')+
      section('Retests & feedback','',
        (retestsDue.length||newFeedback.length?'<div class="focus-list">'+
          retestsDue.slice(0,5).map(e=>'<div class="focus-row"><div><div class="line">'+subject(e.course)+badge(e.retest<t0?'Overdue':'Retest','gold')+'</div><strong>'+h(e.title)+'</strong><small>'+h(dueLabel({date:e.retest}))+'</small></div>'+button('Record','retest',e.id,'text')+'</div>').join('')+
          newFeedback.slice(0,3).map(f=>'<div class="focus-row"><div><div class="line">'+subject(f.course)+badge('Feedback')+'</div><strong>'+h(f.title)+'</strong><small>'+h(f.next||'No change planned yet')+'</small></div>'+button('Plan','plan-feedback',f.id,'text')+'</div>').join('')+'</div>'
          :emptyCard('Nothing waiting','Logged errors and new feedback show here.')),
        '<a class="subtle-link" href="#practice">Errors →</a>')+
    '</div>'+
    section('Subjects','',
      '<div class="table-scroll"><table class="balance"><thead><tr><th>Course</th><th title="Study in the last 7 days">7 days</th><th title="Study in the last 28 days">28 days</th><th title="Syllabus topics practised">Syllabus</th><th title="Reviews due">Reviews</th><th title="Open errors">Errors</th><th title="Past papers">Papers</th><th>Next task</th></tr></thead><tbody>'+
      rows.map(r=>'<tr'+(r.flag?' class="flag"':'')+'><th scope="row"><a href="#list/'+r.c.id+'">'+subject(r.c.id)+'</a>'+(r.flag?' '+badge('Needs time','alert'):'')+'</th>'+
        '<td>'+(r.week?minutes(r.week):'—')+'</td>'+
        '<td>'+(r.month?'<span class="cell-bar"><span>'+minutes(r.month)+'</span><span class="mini-bar"><i style="width:'+(r.month/maxMonth*100)+'%;background:'+r.c.colour+'"></i></span></span>':'—')+'</td>'+
        '<td>'+r.covered+'<small> / '+r.topics+'</small></td>'+
        '<td>'+(r.due?'<b class="due">'+r.due+'</b>':'—')+'</td>'+
        '<td>'+(r.errors||'—')+'</td>'+
        '<td>'+(r.papers?r.papers+' · avg '+percent(r.avg):'—')+'</td>'+
        '<td>'+(r.next?h(r.next.title)+' <small>'+(daysFrom(r.next.date,t0)===0?'today':'in '+daysFrom(r.next.date,t0)+'d')+'</small>':'—')+'</td></tr>').join('')+
      '</tbody></table></div>');
}

// ───────────────────────── Past papers ─────────────────────────
let paperFilter = 'all';
const paperSources = ['HSC','Trial (other school)','Own school past task','Textbook or other'];
function spark(values) {
  if (values.length<2) return '';
  const w=140, ht=36, step=w/(values.length-1);
  const pts=values.map((v,i)=>[+(i*step).toFixed(1), +(ht-3-v/100*(ht-6)).toFixed(1)]);
  return '<svg class="spark" viewBox="-3 0 '+(w+6)+' '+ht+'" aria-hidden="true"><line x1="0" x2="'+w+'" y1="'+(ht-3-0.5*(ht-6))+'" y2="'+(ht-3-0.5*(ht-6))+'" class="spark-mid"/><polyline points="'+pts.map(p=>p.join(',')).join(' ')+'"/>'+pts.map((p,i)=>i===pts.length-1?'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.6"/>':'').join('')+'</svg>';
}
function papersPage() {
  const all=dated(data.papers);
  const shown=all.filter(p=>paperFilter==='all'||p.course===paperFilter).reverse();
  const cards=courses.map(c=>{
    const list=all.filter(p=>p.course===c.id&&paperPct(p)!=null);
    if (!list.length) return '';
    const pcts=list.map(paperPct), last=pcts.at(-1), avg=pcts.reduce((a,b)=>a+b,0)/pcts.length;
    const recent=pcts.slice(-3), earlier=pcts.slice(-6,-3);
    const trend=earlier.length?recent.reduce((a,b)=>a+b,0)/recent.length-earlier.reduce((a,b)=>a+b,0)/earlier.length:null;
    return '<section class="card paper-card" style="--c:'+c.colour+'"><div class="line">'+subject(c.id)+'<span class="note">'+list.length+' marked</span></div><div class="paper-nums"><div><span>Latest</span><strong>'+percent(last)+'</strong></div><div><span>Average</span><strong>'+percent(avg)+'</strong></div><div><span>Best</span><strong>'+percent(Math.max(...pcts))+'</strong></div></div>'+spark(pcts.slice(-12))+
      (trend!=null?'<small class="trend '+(trend>=0?'up':'down')+'">'+(trend>=0?'▲ ':'▼ ')+Math.abs(trend).toFixed(1)+' points, last 3 vs previous 3</small>':'<small class="trend">Trend shows after 4 marked papers</small>')+'</section>';
  }).join('');
  return pageHead('','Past papers','',button('+ Log paper','edit-paper','','primary'))+
    (cards?'<div class="paper-grid">'+cards+'</div>':'')+
    section('Log','',
      tabGroup('Course','paper-filter',paperFilter,[['all','All'],...courses.map(c=>[c.id,c.short])])+
      (shown.length?'<div class="record-list">'+shown.map(p=>{
        const pct=paperPct(p), over=p.minutes&&p.limit&&Number(p.minutes)>Number(p.limit);
        return '<article class="record"><div class="record-head"><div><div class="line">'+subject(p.course)+badge(p.source||'Paper',p.source==='HSC'?'gold':'neutral')+(over?badge('Over time','alert'):'')+'</div><h3>'+h(p.title)+'</h3><p>'+(p.date?h(pretty(p.date,{day:'numeric',month:'short',year:'numeric'})):'Undated')+' · '+(pct!=null?h(p.mark)+' / '+h(p.outOf)+' ('+percent(pct)+')':'Not marked yet')+(p.minutes?' · '+minutes(Number(p.minutes))+(p.limit?' of '+minutes(Number(p.limit)):''):'')+'</p></div>'+
          '<div class="line">'+button('Log error','paper-error',p.id)+button('Edit','edit-paper',p.id)+'</div></div>'+(p.notes?'<p class="record-detail">'+br(p.notes)+'</p>':'')+'</article>';
      }).join('')+'</div>':emptyCard('No papers logged'+(paperFilter==='all'?'':' for '+course(paperFilter).short),'Log each past paper you sit with its mark and time. Trends per course appear above once you have two.',button('+ Log paper','edit-paper'))));
}
function editPaper(record) {
  const v=record??{title:'',course:paperFilter!=='all'?paperFilter:courseDefault(),source:'HSC',date:today(),mark:'',outOf:'',minutes:'',limit:'',notes:''};
  crud('papers',record,required('title','Paper',v.title)+chooseCourse(v.course)+select('source','Source',v.source,paperSources)+dateField('date','Date sat',v.date,true)+
    number('mark','Mark',v.mark,{max:1000,step:.5})+number('outOf','Out of',v.outOf,{min:1,max:1000,step:.5})+
    number('minutes','Time used (min)',v.minutes,{max:600})+number('limit','Time allowed (min)',v.limit,{max:600})+
    textArea('notes','Where marks were lost',v.notes,false,'e.g. Q14(c) projectile range, Section I Q7 misread'),record?'Edit paper':'Log a past paper',x=>{
      asNumbers(x,['mark','outOf','minutes','limit']);
      if ((x.mark==='')!==(x.outOf==='') || (x.mark!==''&&x.mark>x.outOf)) { formError('Enter both mark and total. The mark must be at or below the total.'); return null; }
      return x;
    },v);
}

// ───────────────────────── Sidebar ─────────────────────────
function navHtml(r) {
  const count=fn=>data.tasks.filter(t=>taskOpen(t)&&fn(t)).length;
  const t0=today();
  const cur=(name,arg='')=>r.name===name&&r.arg===arg;
  const link=(href,label,glyph,current,n)=>'<a href="#'+href+'" '+(current?'aria-current="page"':'')+'>'+glyph+'<span>'+h(label)+'</span>'+(n?'<b>'+n+'</b>':'')+'</a>';
  const sec=(title,body,extra='')=>'<div class="nav-sec"><div class="nav-title"><span>'+title+'</span>'+extra+'</div>'+body+'</div>';
  const counts={today:count(t=>t.date&&t.date<=t0),next7:count(t=>t.date&&t.date<=addDays(t0,6)),inbox:count(t=>!t.course&&!t.list),all:count(()=>true)};
  const tags=allTags();
  const studied=data.focus.filter(f=>f.date===t0).reduce((n,f)=>n+f.minutes,0);
  const reviews=dueTopics().length;
  return link('dash','Overview',icon('home'),cur('dash'),reviews?reviews+' due':0)+link('focus','Study',icon('timer'),cur('focus'),studied?minutes(studied):0).replace('<a ','<a class="nav-study" ')+'<div class="nav-gap"></div>'+smart.map(([k,n,ic])=>link(k,n,icon(ic),cur(k),k==='done'?0:counts[k])).join('')+
    sec('Subjects',courses.map(c=>link('list/'+c.id,c.short,'<i class="dot" style="--c:'+c.colour+'"></i>',cur('list',c.id),count(t=>t.course===c.id))).join(''))+
    sec('Lists',data.lists.map(l=>link('list/'+encodeURIComponent(l.id),l.name,'<i class="dot" style="--c:'+(l.colour||'#8e978d')+'"></i>',cur('list',l.id),count(t=>t.list===l.id))).join('')||'<span class="nav-empty">No lists yet</span>','<button type="button" class="nav-add" data-action="edit-list" aria-label="New list">+</button>')+
    (tags.length?sec('Tags',tags.map(g=>link('tag/'+encodeURIComponent(g),g,icon('hash'),cur('tag',g),count(t=>(t.tags||[]).includes(g)))).join('')):'')+
    sec('Tools',tools.map(([k,n,ic])=>link(k,n,icon(ic),cur(k),0)).join(''))+
    sec('HSC',views.map(([k,n,ic])=>link(k,n,icon(ic),cur(k),0)).join(''));
}
function editList(l) {
  const swatches=['#416c55','#376c88','#6b5590','#91602d','#9a4f65','#4a7fb0','#c4513d','#5f6a61'];
  modal(l?'Rename list':'New list','<div class="form-grid">'+required('name','List name',l?.name)+select('colour','Colour',l?.colour??swatches[data.lists.length%swatches.length],swatches.map(c=>[c,c]))+'</div>','Save',v=>{
    let id=l?.id;
    change(()=>{ if (l) Object.assign(l,{name:v.name,colour:v.colour}); else { id=uid(); data.lists.push({id,name:v.name,colour:v.colour}); } });
    location.hash='#list/'+encodeURIComponent(id);
  });
}

// ───────────────────────── Backup & settings ─────────────────────────
function settingsModal() {
  const p=pomo();
  modal('Backup & settings','<div class="form-grid">'+
    number('goal','Daily study goal (min)',studyGoal(),{min:15,max:720,step:15,required:true})+number('focus','Timed round length (min)',p.focus,{min:5,max:120,required:true})+number('short','Short break (min)',p.short,{min:1,max:60,required:true})+
    number('long','Long break (min)',p.long,{min:1,max:90,required:true})+number('every','Long break after (rounds)',p.every,{min:2,max:12,required:true})+
    dateField('trialStart','Trials start',data.settings.trialStart)+dateField('hscStart','First HSC exam',data.settings.hscStart)+
    '<small class="note full">Use your school’s Trial timetable and the NESA HSC timetable. The Overview counts down to both.</small>'+
    (localMode?'<div class="field full"><span>Sync across devices</span><div class="line wrap">'+button(syncOn()?'Sync settings':'Set up sync','sync-setup','',syncOn()?'secondary':'primary')+'<small class="note">'+(syncOn()?'On'+(syncCfg.device?' · '+h(syncCfg.device):'')+(syncCfg.lastSync?' · last synced '+h(hhmm(Date.parse(syncCfg.lastSync))):''):'Off. Records stay in this browser only.')+'</small></div></div>':'')+
    '<div class="field full"><span>Backup</span><div class="line wrap">'+button('Export backup (.json)','export')+'<label class="button secondary file-btn">Import backup<input type="file" id="import-file" accept="application/json,.json" hidden></label></div>'+
    '<small class="note">'+(localMode?(data.settings.lastExport?'Last exported '+h(pretty(data.settings.lastExport,{day:'numeric',month:'short',year:'numeric'}))+'. ':'')+'Export a backup now and then even with sync on, and keep it somewhere safe.':'Your records sync through your account.')+'</small></div>'+
    (localMode&&Object.keys(snapshots()).length?'<div class="field full"><span>Daily snapshots</span><small class="note">This browser keeps your records as they were when you first opened Stacky each day, for the last 7 days.</small><div class="line wrap">'+Object.keys(snapshots()).sort().reverse().map(d=>button('Restore '+pretty(d,{weekday:'short',day:'numeric',month:'short'}),'restore-snap',d,'text')).join('')+'</div></div>':'')+
    '<div class="field full"><span>Shortcuts</span><small class="note"><kbd>s</kbd> start or pause studying · <kbd>q</kbd> quick add · <kbd>/</kbd> search · <kbd>Esc</kbd> close details</small></div></div>',
    'Save settings',v=>change(()=>{ data.settings.pomo={focus:+v.focus,short:+v.short,long:+v.long,every:+v.every}; data.settings.studyGoal=+v.goal; data.settings.trialStart=v.trialStart; data.settings.hscStart=v.hscStart; }));
}
function restoreSnapshot(day) {
  const snap=snapshots()[day];
  if (!snap) { notify('That snapshot is no longer stored.'); return; }
  modal('Restore '+pretty(day,{weekday:'long',day:'numeric',month:'short'})+'?','<p>This replaces your current records with the copy from the start of that day ('+(snap.tasks?.length??0)+' tasks). Anything you changed since is lost'+(syncOn()?', and the restored copy syncs to your other devices':'')+'. Export a backup first if you are unsure.</p>','Restore',()=>{
    change(()=>{ data=normalise(snap); });
    forceNextSync();   // a deliberate restore replaces the synced copy instead of merging with it
    notify('Restored the '+pretty(day)+' snapshot.');
  });
}
function exportData() {
  change(()=>{ data.settings.lastExport=today(); });
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='stacky-backup-'+today()+'.json';
  document.body.append(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
async function importData(file) {
  let parsed;
  try { parsed=JSON.parse(await file.text()); } catch { notify('That file is not valid JSON.'); return; }
  if (!parsed || parsed.version!==1 || !Array.isArray(parsed.tasks)) { notify('That file is not a Stacky backup.'); return; }
  modal('Replace your records?','<p>This replaces everything in Stacky with the backup from the file ('+parsed.tasks.length+' tasks)'+(syncOn()?' on every synced device':'')+'. Export first if you want to keep what is here now.</p>','Replace',()=>{ change(()=>{ data=normalise(parsed); }); forceNextSync(); notify('Backup imported.'); });
}

// ───────────────────────── Actions and input wiring ─────────────────────────
function stackActions(id, el) {
  return {
    'close-detail':()=>{selected=null;render();},
    'set-priority':()=>change(()=>{row('tasks',selected).priority=Number(id);}),
    'delete-task':()=>modal('Delete this task?','<p>'+h(row('tasks',id)?.title)+'</p>','Delete',()=>{change(()=>{data.tasks=data.tasks.filter(t=>t.id!==id);});selected=null;}),
    'sub-delete':()=>change(()=>{const t=row('tasks',selected);t.subtasks=t.subtasks.filter(x=>x.id!==id);}),
    'focus-task':()=>{ const t=row('tasks',id); Object.assign(timer,{taskId:id,course:t?.course??timer.course}); if (timer.phase!=='focus') resetTimer({phase:'focus'}); startTimer(); selected=null; location.hash='#focus'; render(); },
    'toggle-done':()=>{ showDone=!showDone; },
    'postpone-overdue':()=>change(()=>{ data.tasks.filter(t=>taskOpen(t)&&t.date&&t.date<today()).forEach(t=>{t.date=today();}); }),
    'open-topics':()=>{courseId=id;location.hash='#topics';},
    'edit-list':()=>editList(customList(id)),
    'delete-list':()=>modal('Delete this list?','<p>Its tasks stay and move to the Inbox (or their subject).</p>','Delete list',()=>{change(()=>{data.lists=data.lists.filter(l=>l.id!==id);data.tasks.forEach(t=>{if(t.list===id)t.list='';});});location.hash='#inbox';}),
    'cal-shift':()=>{calAnchor=calMode==='month'?addMonth(calAnchor.slice(0,8)+'01',Number(id)):addDays(calAnchor,7*Number(id));render();},
    'cal-today':()=>{calAnchor=today();render();},
    'cal-mode':()=>{calMode=id;render();},
    'cal-open-day':()=>{calMode='week';calAnchor=id;render();},
    'cal-add':()=>modal('Add task · '+pretty(id,{weekday:'long',day:'numeric',month:'short'}),field('q','Task','',{full:true,required:true,placeholder:'e.g. Physics depth study 4pm 1h #phy'}),'Add',v=>{ createFromQuick(v.q,{date:id}); }),
    'timer-start':()=>{startTimer();render();},
    'timer-pause':()=>{pauseTimer();render();},
    'timer-finish':finishSession,
    'timer-full':openFull,
    'timer-full-exit':closeFull,
    'timer-skip':()=>{resetTimer({phase:'focus'});render();},
    'focus-length':()=>{ if (sessionActive()) { notify('Finish this round to change its length.'); return; } change(()=>{ data.settings.pomo={...pomo(),focus:Number(id)}; }); },
    'study-mode':()=>{ if (sessionActive()) { notify('Finish or discard this session to switch timer type.'); return; } resetTimer({mode:id,phase:'focus',cycle:0}); render(); },
    'study-course':()=>{ timer.course=id; const t=row('tasks',timer.taskId); if (t&&(t.course||'')!==id) timer.taskId=null; storeTimer(); render(); },
    'edit-session':()=>{ const s=row('focus',id); if (s) editSession(s); },
    'log-past':logPast,
    'log-more':()=>{logDays+=14;render();},
    'edit-habit':()=>editHabit(data.habits.find(x=>x.id===id)),
    'habit-open':()=>{habitOpen=habitOpen===id?null:id;render();},
    'habit-toggle':()=>change(()=>{ const log=(data.habitLog[id]??={}); const d=el.dataset.date; if(log[d]) delete log[d]; else log[d]=1; }),
    'habit-suggest':()=>{ const [name,c]=id.split('|'); change(()=>data.habits.push({id:uid(),name,course:c,days:Array(7).fill(true),created:today()})); },
    settings:settingsModal,
    export:exportData,
    'go-study':()=>{ location.hash='#focus'; },
    'review-topic':()=>{ const t=topicRecord(id); if (t) reviewTopic(t); },
    'edit-paper':()=>editPaper(row('papers',id)),
    'paper-filter':()=>{ paperFilter=id; render(); },
    'paper-error':()=>{ const p=row('papers',id); editError(null,{course:p.course,source:p.title,retest:addDays(today(),2)}); },
    'restore-snap':()=>restoreSnapshot(id),
    'sync-setup':syncModal,
    'sync-now':()=>{ dialog.close(); syncNow(); },
    'sync-off':()=>{ syncCfg={}; storeSync(); try { localStorage.removeItem(BASE_KEY); } catch {} lastSyncError=''; dialog.close(); status('Saved in this browser'); notify('Sync is off on this device. Your records are still here.'); },
    menu:()=>document.body.classList.toggle('nav-open')
  };
}
function addMonth(value,n){ const d=date(value); d.setUTCMonth(d.getUTCMonth()+n); return iso(d); }
function stackChange(el) {
  if (el.id==='import-file') { if (el.files[0]) importData(el.files[0]); return true; }
  if (el.matches('[data-timer-task]')) { timer.taskId=el.value||null; const t=row('tasks',timer.taskId); if (t) timer.course=t.course||''; storeTimer(); render(); return true; }
  const t=selected&&row('tasks',selected);
  if (el.dataset.subToggle && t) { change(()=>{ t.subtasks.find(x=>x.id===el.dataset.subToggle).done=el.checked; }); return true; }
  if (el.dataset.subTitle && t) { change(()=>{ const x=t.subtasks.find(z=>z.id===el.dataset.subTitle); if (el.value.trim()) x.title=el.value.trim(); else t.subtasks=t.subtasks.filter(z=>z!==x); }); return true; }
  if (el.dataset.field && t) {
    const f=el.dataset.field, v=el.value;
    change(()=>{
      if (f==='tags') t.tags=parseTags(v);
      else if (f==='minutes') t.minutes=Math.max(0,Math.min(720,Number(v)||0));
      else if (f==='actual') t.actual=v===''?'':Math.max(0,Math.min(720,Number(v)||0));
      else if (f==='status') { if (v==='Done') setDone(t,true); else { t.status=v; t.completedAt=null; } }
      else if (f==='title') { if (v.trim()) t.title=v.replace(/\s+/g,' ').trim(); }
      else t[f]=v;
    });
    return true;
  }
  return false;
}
document.addEventListener('input',event=>{
  const el=event.target;
  if (el.closest('.quick') && el.name==='q') el.closest('.quick').querySelector('.quick-preview').innerHTML=previewChips(el.value);
  if (el.id==='search') {
    const q=el.value.trim();
    history.replaceState(null,'',q?'#search/'+encodeURIComponent(q):'#today');
    if (data) render();
  }
  if (el.classList.contains('detail-title')) { el.style.height='auto'; el.style.height=el.scrollHeight+'px'; }
});
document.addEventListener('submit',event=>{
  const form=event.target;
  if (!form.classList.contains('quick')) return;
  event.preventDefault();
  const input=form.querySelector('input[name=q]');
  if (!data || !input.value.trim()) return;
  const defaults=JSON.parse(form.dataset.defaults||'{}');
  const t=createFromQuick(input.value,defaults);
  input.value='';
  const spec=listSpec(route());
  if (spec && !spec.open(t)) notify('Added “'+t.title+'”'+(t.date?' for '+pretty(t.date,{weekday:'short',day:'numeric',month:'short'}):' to the Inbox')+'.');
});
document.addEventListener('keydown',event=>{
  const el=event.target;
  if (el.id==='sub-new' && event.key==='Enter') {
    event.preventDefault();
    const t=row('tasks',selected), v=el.value.trim();
    if (t && v) change(()=>{ (t.subtasks??=[]).push({id:uid(),title:v,done:false}); });
    return;
  }
  if (el.classList?.contains('detail-title') && event.key==='Enter') { event.preventDefault(); el.blur(); return; }
  if (fullTimer && !dialog.open) {
    if (event.key==='Escape') { event.preventDefault(); closeFull(); return; }
    if (event.key===' ' || event.key==='s') { event.preventDefault(); idleChrome(); toggleTimer(); return; }
    if (event.key==='f') { event.preventDefault(); closeFull(); return; }
    idleChrome();
    return;
  }
  if (event.key==='f' && data && !el.closest('input,textarea,select,[contenteditable]') && !event.metaKey && !event.ctrlKey && !event.altKey && !dialog.open) { event.preventDefault(); openFull(); return; }
  if (event.key==='Escape' && !dialog.open) {
    if (document.body.classList.contains('nav-open')) { document.body.classList.remove('nav-open'); return; }
    if (selected) { selected=null; render(); return; }
  }
  if (el.closest('input,textarea,select,[contenteditable]') || event.metaKey || event.ctrlKey || event.altKey || dialog.open) return;
  if (event.key==='q' || event.key==='n') { const q=main.querySelector('.quick input'); if (q) { event.preventDefault(); q.focus(); } }
  if (event.key==='/') { event.preventDefault(); $('search').focus(); }
  if (event.key==='s' && data) { event.preventDefault(); toggleTimer(); }
});
document.addEventListener('dragstart',event=>{
  const el=event.target.closest?.('[data-drag]');
  if (!el) return;
  dragging=el.dataset.drag;
  grabY=el.classList.contains('wk-event') ? event.clientY-el.getBoundingClientRect().top : 0;
  event.dataTransfer.setData('text/plain',dragging);
  event.dataTransfer.effectAllowed='move';
  el.classList.add('dragging');
});
document.addEventListener('dragend',event=>{ event.target.classList?.remove('dragging'); dragging=null; document.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over')); });
document.addEventListener('dragover',event=>{
  const zone=dragging&&event.target.closest?.('[data-drop-date],[data-drop-priority]');
  if (!zone) return;
  event.preventDefault();
  document.querySelectorAll('.drag-over').forEach(x=>{ if (x!==zone) x.classList.remove('drag-over'); });
  zone.classList.add('drag-over');
});
document.addEventListener('drop',event=>{
  const zone=dragging&&event.target.closest?.('[data-drop-date],[data-drop-priority]');
  if (!zone) return;
  event.preventDefault();
  const t=row('tasks',dragging);
  dragging=null;
  if (!t) return;
  change(()=>{
    if (zone.dataset.dropPriority!=null) { t.priority=Number(zone.dataset.dropPriority); return; }
    t.date=zone.dataset.dropDate;
    if (zone.dataset.dropAllday) t.time='';
    if (zone.dataset.dropCol) {
      const y=event.clientY-grabY-zone.getBoundingClientRect().top;
      const mins=Math.min((DAY_END*60)-15,Math.max(DAY_START*60,Math.round((y/HOUR_PX*60+DAY_START*60)/15)*15));
      t.time=pad2(Math.floor(mins/60))+':'+pad2(mins%60);
    }
  });
});
window.addEventListener('storage',event=>{
  if (event.key===TIMER_KEY) { try { timer={...freshTimer(),...JSON.parse(event.newValue)}; } catch {} if (data) render(); }
  // Another tab saved. Pick up its records so this tab does not overwrite them.
  if (event.key===LOCAL_KEY && localMode && data && event.newValue) {
    if (dirty || saving || dialog.open) { notify('This workspace also changed in another tab. The tab that saves last wins.'); return; }
    try { data=normalise(JSON.parse(event.newValue)); status('Updated from another tab'); render(); } catch {}
  }
});
window.addEventListener('hashchange',()=>document.body.classList.remove('nav-open'));

document.addEventListener('click',event=>{
  const el=event.target.closest('[data-action]');
  if(!el) {
    const pick=event.target.closest('[data-select]');
    if (pick && data && !event.target.closest('a,input,select,textarea,label')) selectTask(pick.dataset.select);
    return;
  }
  const action=el.dataset.action, id=el.dataset.id;
  if(action==='reload') { open(); return; }
  if(!data) return;
  const actions = {
    'shift-week':()=>{week=addDays(week,Number(id));render();},
    'current-week':()=>{week=monday(today());render();},
    'jump-week':()=>modal('Jump to a week',dateField('date','Any date in the week',week,true),'Open week',v=>{week=monday(v.date);render();}),
    'open-week':()=>{week=id;render();window.scrollTo(0,0);},
    'edit-capacity':editCapacity,
    energy:()=>change(()=>{data.weeks[week]={...data.weeks[week],energy:id};}),
    'edit-task':()=>id?selectTask(id):editTask(null),
    'task-day':()=>editTask(null,{date:id}),
    'carry-task':()=>{const t=row('tasks',id);editTask(t,{date:t.date<week?startDay():addDays(week,7)},true);},
    'show-carry':()=>modal('Triage carry-over','<div class="record-list">'+carry().map(t=>'<div class="record compact"><div><strong>'+h(t.title)+'</strong><p>'+h(pretty(t.date))+' · '+minutes(t.minutes)+'</p></div>'+button('Move or drop','carry-task',t.id)+'</div>').join('')+'</div>','',null),
    'toggle-task':()=>change(()=>{const t=row('tasks',id);setDone(t,t.status!=='Done');}),
    ...stackActions(id,el),
    'edit-commitment':()=>editCommitment(row('commitments',id)),
    'edit-assessment':()=>editAssessment(row('assessments',id)),
    'new-trial':()=>editAssessment(null,'Trial'),
    'assessment-filter':()=>{assessmentFilter=id;render();},
    'prep-assessment':()=>{const a=row('assessments',id);editTask(null,{title:'Prepare for '+a.title,course:a.course,kind:a.kind==='Trial'?'Timed practice':'Assessment prep',notes:a.scope||'',link:{type:'assessment',id}});},
    course:()=>{courseId=id;render();},
    'new-topic':()=>editTopic(null),
    'edit-topic':()=>editTopic(topicRecord(id)),
    'plan-topic':()=>{const t=topicRecord(id);editTask(null,{title:t.title,course:t.course,kind:'Active retrieval',minutes:templates['Active retrieval'].minutes,notes:templates['Active retrieval'].text,link:{type:'topic',id}});},
    'practice-filter':()=>{practiceFilter=id;render();},
    template:()=>editTask(null,{title:id,kind:id,minutes:templates[id].minutes,notes:templates[id].text}),
    'edit-error':()=>editError(row('errors',id)),
    'plan-error':()=>{const e=row('errors',id);editTask(null,{title:'Repair: '+e.title,course:e.course,kind:'Repair & retest',minutes:25,notes:(e.repair?e.repair+'\n\n':'')+templates['Repair & retest'].text,link:{type:'error',id}});},
    'plan-retest':()=>{const e=row('errors',id);editTask(null,{title:'Retest: '+e.title,course:e.course,kind:'Repair & retest',date:e.retest<today()?startDay():e.retest,minutes:20,notes:'Attempt a fresh question without help, then record the result in the error log.',link:{type:'error',id}});},
    retest:()=>editRetest(row('errors',id)),
    'edit-feedback':()=>editFeedback(row('feedback',id)),
    'plan-feedback':()=>{const f=row('feedback',id);editTask(null,{title:f.next||'Apply: '+f.title,course:f.course,kind:'Teacher feedback',notes:f.note,link:{type:'feedback',id}});},
    'edit-review':editReview,
    'close-dialog':()=>dialog.close(),
    'delete-record':()=>{
      const remove=currentEditor.remove;
      if (typeof remove==='function') modal('Delete this record?','<p>This removes the record from your study workspace.</p>','Delete',()=>remove());
      else modal(remove.title,'<p>'+h(remove.body)+'</p>',remove.label,()=>remove.run());
    }
  };
  actions[action]?.();
});
document.addEventListener('change',event=>{
  const el=event.target;
  if (data && stackChange(el)) return;
  if(el.dataset.assess) change(()=>{const a=row('assessments',el.dataset.assess); (a.checks??={})[el.dataset.step]=el.checked;});
  if(el.id==='priority-only') {priorityOnly=el.checked;render();}
});
dialog.addEventListener('submit',event=>{
  event.preventDefault();
  const values=Object.fromEntries([...new FormData(event.target)].map(([key,value])=>[key,value.trim()]));
  const missing=[...event.target.elements].find(el=>el.required&&values[el.name]==='');
  if (missing) {missing.focus();formError('Fill in the required field.');return;}
  const result=currentEditor.onSubmit?.(values);
  if(result!==false) dialog.close();
});
open();
