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
  paper:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7M9 8h3"/>',
  sliders:'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  // Subject icons (data.js names one per course).
  graph:'<path d="M4 4v16h16"/><path d="M7 16c3 0 3.5-9 6.5-9S16.5 13 20 8"/>',
  pi:'<path d="M5 7h14M9 7v11M15 7v9a2 2 0 0 0 2 2h1"/>',
  atom:'<circle cx="12" cy="12" r="1.1"/><ellipse cx="12" cy="12" rx="9.5" ry="3.9"/><ellipse cx="12" cy="12" rx="9.5" ry="3.9" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.9" transform="rotate(120 12 12)"/>',
  flask:'<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
  trend:'<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  feather:'<path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.5V19h8.5z"/><path d="M16 8 2 22M17.5 15H9"/>'
};
const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
// A subject's own icon in its colour; General (or an unknown id) gets the book.
const subjectIcon = id => icon(courses.find(c=>c.id===id)?.icon||'book').replace('<svg ','<svg class="subj-ico" ');
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
  out.tasks = (out.tasks||[]).map(t=>({priority:0, tags:[], subtasks:[], time:'', repeat:'', list:'', completedAt:null, ...t, minutes:Number(t.minutes)||0, actual:(t.actual==null||Number.isNaN(Number(t.actual)))?'':t.actual}));
  out.focus = out.focus.filter(f=>Number.isFinite(Number(f.minutes))).map(f=>({...f,minutes:Number(f.minutes)}));
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
const routeNames = Object.fromEntries([dash,study,...smart,...tools,...views,['settings','Settings']].map(([k,n])=>[k,n]));
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
      gQueuePush();
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
  if (gist.owner?.login && syncCfg.owner!==gist.owner.login) { syncCfg.owner=gist.owner.login; storeSync(); }
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
// The same gist also carries stacky.ics, a calendar Apple and Google Calendar can subscribe to.
const FEED_FILE='stacky.ics';
function icsFeed() {
  const esc=t=>String(t??'').replace(/\\/g,'\\\\').replace(/;/g,'\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
  const utc=ms=>new Date(ms).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const day=d=>d.replace(/-/g,''), stamp=utc(Date.now());
  const from=addDays(today(),-60), to=addDays(today(),180), ev=[];
  const push=(uid,lines)=>ev.push('BEGIN:VEVENT\r\nUID:'+uid+'@stacky\r\nDTSTAMP:'+stamp+'\r\n'+lines.join('\r\n')+'\r\nEND:VEVENT');
  for (const t of data.tasks) {
    if (!t.date||t.date<from||t.date>to||t.status==='Dropped') continue;
    const name=(t.status==='Done'?'✓ ':'')+t.title+(course(t.course)?' · '+course(t.course).short:'');
    if (t.time) { const st=Date.parse(t.date+'T'+t.time); push('task-'+t.id,['DTSTART:'+utc(st),'DTEND:'+utc(st+Math.max(15,Number(t.minutes)||30)*60000),'SUMMARY:'+esc(name)]); }
    else push('task-'+t.id,['DTSTART;VALUE=DATE:'+day(t.date),'DTEND;VALUE=DATE:'+day(addDays(t.date,1)),'SUMMARY:'+esc(name)]);
  }
  for (const a of data.assessments) if (a.date&&a.date>=from&&a.date<=to) push('assess-'+a.id,['DTSTART;VALUE=DATE:'+day(a.date),'DTEND;VALUE=DATE:'+day(addDays(a.date,1)),'SUMMARY:'+esc((a.kind==='Trial'?'Trial: ':'Due: ')+a.title)]);
  if (data.settings.calSessions!==false) for (const f of data.focus) if (f.date>=from) { const st=sessionStart(f); push('study-'+f.id,['DTSTART:'+utc(st),'DTEND:'+utc(st+f.minutes*60000),'SUMMARY:'+esc('Studied '+(course(f.course)?.short??'')+(f.note?' · '+f.note.split('\n')[0]:'')),'TRANSP:TRANSPARENT']); }
  return 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Stacky//HSC study//EN\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME:Stacky\r\nX-PUBLISHED-TTL:PT15M\r\nREFRESH-INTERVAL;VALUE=DURATION:PT15M\r\n'+ev.join('\r\n')+'\r\nEND:VCALENDAR\r\n';
}
const writeRemote = (rev) => gh('/gists/'+syncCfg.gistId,{method:'PATCH',body:JSON.stringify({files:{[GIST_FILE]:{content:JSON.stringify({rev,savedAt:new Date().toISOString(),device:syncCfg.device||'',data})},[FEED_FILE]:{content:icsFeed()}}})});
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
const badge = (label, tone='neutral') => label ? '<span class="badge '+tone+'">'+h(label)+'</span>' : '';
const subject = id => id && course(id) ? '<span class="subject" style="--subject:'+course(id).colour+'">'+subjectIcon(id)+h(course(id).short)+'</span>' : '<span class="subject general">'+subjectIcon()+'General</span>';
const emptyCard = (title, description, action='') => '<div class="empty" title="'+h(description)+'"><strong>'+h(title)+'</strong>'+action+'</div>';
const pageHead = (eyebrow,title,copy,action='') => '<div class="page-head"><div>'+(eyebrow?'<div class="eyebrow">'+h(eyebrow)+'</div>':'')+'<h1>'+h(title)+'</h1>'+(copy?'<p>'+h(copy)+'</p>':'')+'</div><div class="head-action">'+action+'</div></div>';
const section = (title, sub, body, action='') => '<section class="card">'+(title||action?'<div class="card-head"><div>'+(title?'<h2>'+h(title)+'</h2>':'')+(sub?'<p>'+h(sub)+'</p>':'')+'</div>'+action+'</div>':'')+body+'</section>';
const metric = (label,value,detail,tone='') => '<div class="metric '+tone+(value==='—'?' unset':'')+'"><span>'+h(label)+'</span><strong>'+h(value==='—'?'Not set':value)+'</strong>'+(detail!==''&&detail!=null?'<small>'+h(detail)+'</small>':'')+'</div>';
const tabGroup = (label,action,selected,items) => '<div class="tabs" role="group" aria-label="'+h(label)+'">'+items.map(item=>{const [id,name]=Array.isArray(item)?item:[item,item];return '<button type="button" aria-pressed="'+(id===selected)+'" class="'+(id===selected?'selected':'')+'" data-action="'+action+'" data-id="'+h(id)+'">'+h(name)+'</button>';}).join('')+'</div>';
const weekLabel = () => pretty(week)+' – '+pretty(addDays(week,6),{day:'numeric',month:'short',year:'numeric'});
const weekPicker = () => '<div class="week-picker"><button type="button" aria-label="Previous week" data-action="shift-week" data-id="-7">‹</button><strong>'+h(weekLabel())+'</strong><button type="button" aria-label="Next week" data-action="shift-week" data-id="7">›</button>'+button('Current week','current-week','','text')+button('Jump to date','jump-week','','text')+'</div>';
const weekTasks = () => data.tasks.filter(t=>t.date && monday(t.date)===week);
const deadlines = () => data.assessments.filter(a=>a.date && !['Sat / submitted','Returned'].includes(a.status)).sort((a,b)=>a.date.localeCompare(b.date));
const retests = () => data.errors.filter(e=>e.stage!=='Passed' && e.retest && e.retest<=addDays(week,6)).sort((a,b)=>a.retest.localeCompare(b.retest));
const carry = () => data.tasks.filter(t=>t.date && t.date<week && !['Done','Dropped'].includes(t.status));
const taskDone = t => t.status==='Done';
const taskOpen = t => !['Done','Dropped'].includes(t.status);
// Minutes a finished task took: the logged actual time if there is one, else the estimate.
const spentMins = t => { const a=Number(t.actual); return t.actual!==''&&t.actual!=null&&Number.isFinite(a) ? a : (Number(t.minutes)||0); };
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
    const completed = tasks.filter(taskDone).reduce((sum,t)=>sum+spentMins(t),0);
    return {day,available,commitments,tasks,remaining,completed};
  });
}

function nextActions() {
  const list = deadlines().slice(0,3);
  const repairs = retests().slice(0,3);
  return list.length || repairs.length ? '<div class="focus-list">'+[
    ...list.map(a=>({meta:subject(a.course)+(a.kind==='Trial'?' '+badge('Trial','gold'):''), title:a.title,
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
    (moved.length?'<div class="carry"><strong>'+moved.length+' unfinished from earlier weeks</strong>'+button('Triage carry-over','show-carry','','text')+'</div>':''))+'</div>'+
    section('Week at a glance','', '<div class="day-grid">'+plan.map(({day,available,commitments,tasks,remaining,completed})=>{
      const used=remaining+completed;
      return '<article class="day '+(day===today()?'today ':'')+(used>available?'over':'')+'"><div class="day-heading"><div><strong>'+pretty(day,{weekday:'short'})+'</strong><small>'+pretty(day)+'</small></div><button type="button" aria-label="Add block on '+h(pretty(day))+'" data-action="task-day" data-id="'+day+'">+</button></div><div class="load"><span>'+minutes(used)+' / '+minutes(available)+'</span><div class="bar"><i style="width:'+Math.min(100,available ? used/available*100 : used?100:0)+'%"></i></div></div>'+
      commitments.map(c=>'<button type="button" class="commit" data-action="edit-commitment" data-id="'+h(c.id)+'">'+h(c.title)+' <span>'+minutes(c.minutes)+'</span></button>').join('')+
      tasks.map(taskRow).join('')+''+'</article>';
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
// Epoch milliseconds for a wall-clock time in Sydney (handles daylight saving).
function sydneyEpoch(day, time='09:00') {
  const [y,m,d]=day.split('-').map(Number), [hh,mm]=(time||'09:00').split(':').map(Number);
  const guess=Date.UTC(y,m-1,d,hh,mm);
  const parts=t=>Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Australia/Sydney',hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}).formatToParts(t).map(x=>[x.type,x.value]));
  const offset=t=>{const p=parts(t);return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute)-t;};
  return guess-offset(guess-offset(guess));
}
const assessDone = a => a.status==='Sat / submitted' || a.status==='Returned';
const assessTime = a => sydneyEpoch(a.date, a.time);
// Countdown text, refreshed every second by the ticker below.
function countdownParts(ms) {
  const s=Math.max(0,Math.floor(ms/1000));
  return [['days',Math.floor(s/86400)],['hrs',Math.floor(s%86400/3600)],['min',Math.floor(s%3600/60)],['sec',s%60]];
}
const countdownHtml = ms => countdownParts(ms).map(([u,n])=>'<span><b>'+String(n).padStart(2,'0')+'</b><small>'+u+'</small></span>').join('');
setInterval(()=>{ document.querySelectorAll('[data-countdown]').forEach(el=>{ const left=Number(el.dataset.countdown)-Date.now(); el.innerHTML=left>0?countdownHtml(left):'<span class="cd-now">Now</span>'; }); },1000);
const daysLeftLabel = n => n===0?'Today':n===1?'Tomorrow':n<0?Math.abs(n)+'d ago':n+' days';
const urgency = n => n<=3?'urgent':n<=7?'soon':'later';
function assessSteps(a, compact) {
  const steps=a.kind==='Trial'?trialSteps:assessmentSteps;
  return '<div class="prep-steps'+(compact?' compact':'')+'">'+steps.map((step,i)=>'<label class="prep-step'+(a.checks?.[i]?' on':'')+'"><input type="checkbox" data-assess="'+h(a.id)+'" data-step="'+i+'" '+(a.checks?.[i]?'checked':'')+'><span>'+h(step)+'</span></label>').join('')+'</div>';
}
const prepCount = a => (a.kind==='Trial'?trialSteps:assessmentSteps).filter((_,i)=>a.checks?.[i]).length;
function assessHero(a, rest) {
  const c=course(a.course), steps=(a.kind==='Trial'?trialSteps:assessmentSteps).length, done=prepCount(a);
  const settings=data.settings, extra=[['Trials',settings.trialStart],['HSC exams',settings.hscStart]].filter(([,d])=>d&&d>=today());
  return '<section class="assess-hero" style="--c:'+(c?.colour||'#8b94a1')+'">'+
    '<div class="hero-top"><span class="hero-eyebrow">Next up</span>'+subject(a.course)+(a.kind==='Trial'?badge('Trial','gold'):'')+'</div>'+
    '<h2>'+h(a.title)+'</h2>'+
    '<p class="hero-when">'+h(pretty(a.date,{weekday:'long',day:'numeric',month:'long'}))+' · '+(a.time?h(a.time):'9:00 am (set a time in Edit)')+(a.weight!==''?' · '+h(a.weight)+'% weighting':'')+'</p>'+
    '<div class="countdown" role="timer" aria-label="Time until '+h(a.title)+'" data-countdown="'+assessTime(a)+'">'+countdownHtml(assessTime(a)-Date.now())+'</div>'+
    '<div class="hero-prep"><div class="hero-prep-head"><span>Preparation</span><b>'+done+' / '+steps+'</b></div><div class="prep-bar"><i style="width:'+(done/steps*100)+'%"></i></div>'+assessSteps(a)+'</div>'+
    '<div class="hero-actions">'+button('Plan prep','prep-assessment',a.id,'primary')+button('Edit','edit-assessment',a.id)+'</div>'+
    (rest.length||extra.length?'<div class="hero-then">'+rest.slice(0,3).map(x=>'<span>'+subjectIcon(x.course)+h(course(x.course)?.short||'General')+' '+h(x.title)+' <b>'+daysLeftLabel(daysFrom(x.date,today()))+'</b></span>').join('')+extra.map(([l,d])=>'<span>'+h(l)+' <b>'+daysFrom(d,today())+' days</b></span>').join('')+'</div>':'')+
  '</section>';
}
// Eight weeks from this Monday, with each assessment as a dot in its subject's colour.
function assessRunway(list) {
  const t0=today(), from=monday(t0), span=56, pos=d=>Math.min(100,Math.max(0,daysFrom(d,from)/span*100));
  const marks=list.filter(a=>a.date&&daysFrom(a.date,from)>=0&&daysFrom(a.date,from)<span);
  const settings=data.settings, flags=[['Trials',settings.trialStart],['HSC',settings.hscStart]].filter(([,d])=>d&&daysFrom(d,from)>=0&&daysFrom(d,from)<span);
  return '<div class="runway" aria-label="Next eight weeks">'+
    '<div class="rw-track">'+Array.from({length:8},(_,i)=>'<span class="rw-week" style="left:'+(i/8*100)+'%">'+h(pretty(addDays(from,i*7)))+'</span>').join('')+
    '<i class="rw-today" style="left:'+pos(t0)+'%" title="Today"></i>'+
    flags.map(([l,d])=>'<span class="rw-flag" style="left:'+pos(d)+'%">'+h(l)+'</span>').join('')+
    marks.map(a=>'<button type="button" class="rw-dot'+(assessDone(a)?' done':'')+'" style="left:'+pos(a.date)+'%;--c:'+(course(a.course)?.colour||'#8b94a1')+'" data-action="edit-assessment" data-id="'+h(a.id)+'" title="'+h((course(a.course)?.short||'General')+' · '+a.title+' · '+pretty(a.date))+'">'+subjectIcon(a.course)+'</button>').join('')+
    '</div></div>';
}
function assessRow(a) {
  const c=course(a.course), n=a.date?daysFrom(a.date,today()):null, past=assessDone(a)||(n!==null&&n<0);
  const steps=(a.kind==='Trial'?trialSteps:assessmentSteps).length, done=prepCount(a);
  const right = past
    ? (hasMark(a)?'<span class="ar-mark"><b>'+percent(a.mark/a.outOf*100)+'</b><small>'+h(a.mark)+' / '+h(a.outOf)+'</small></span>':'<span class="ar-mark pending"><small>'+h(a.status==='Scheduled'||a.status==='Preparing'?'Mark pending':a.status)+'</small></span>')
    : (n!==null?'<span class="ar-left '+urgency(n)+'">'+daysLeftLabel(n)+'</span>':'');
  return '<article class="assess-row'+(past?' past':'')+'" style="--c:'+(c?.colour||'#8b94a1')+'">'+
    (a.date?'<div class="ar-date"><small>'+h(pretty(a.date,{weekday:'short'}))+'</small><b>'+h(pretty(a.date,{day:'numeric'}))+'</b><small>'+h(pretty(a.date,{month:'short'}))+'</small></div>':'<div class="ar-date none"><small>No</small><b>?</b><small>date</small></div>')+
    '<div class="ar-main"><div class="line">'+subject(a.course)+(a.kind==='Trial'?badge('Trial','gold'):'')+(a.status!=='Scheduled'?badge(a.status,a.status==='Returned'?'green':'neutral'):'')+'</div>'+
      '<h3><button type="button" data-action="edit-assessment" data-id="'+h(a.id)+'">'+h(a.title)+'</button></h3>'+
      '<p>'+(a.time?h(a.time)+' · ':'')+(a.weight!==''?h(a.weight)+'% weighting':'Weight pending')+(past?'':' · Prep '+done+'/'+steps)+'</p>'+
      (past?'':assessSteps(a,true))+'</div>'+
    '<div class="ar-side">'+right+'<div class="ar-actions">'+(past?'':button('Plan prep','prep-assessment',a.id,'text'))+button('Edit','edit-assessment',a.id,'text')+'</div></div>'+
  '</article>';
}
function assessments() {
  const t0=today(), thisWeekEnd=addDays(monday(t0),6), nextWeekEnd=addDays(thisWeekEnd,7);
  const all=dated(data.assessments.filter(a=>assessmentFilter==='All'||a.kind===assessmentFilter));
  const upcoming=all.filter(a=>a.date&&a.date>=t0&&!assessDone(a));
  const live=upcoming.filter(a=>assessTime(a)>Date.now());
  const groups=[
    ['This week',upcoming.filter(a=>a.date<=thisWeekEnd)],
    ['Next week',upcoming.filter(a=>a.date>thisWeekEnd&&a.date<=nextWeekEnd)],
    ['Later',upcoming.filter(a=>a.date>nextWeekEnd)],
    ['No date yet',all.filter(a=>!a.date&&!assessDone(a))]
  ].filter(([,l])=>l.length);
  const past=all.filter(a=>assessDone(a)||(a.date&&a.date<t0)).reverse();
  const marks = courses.map(c=>{
    const entries = data.assessments.filter(a=>a.course===c.id);
    const marked = entries.filter(a=>hasMark(a)&&a.weight!=='');
    const loggedWeight = entries.reduce((sum,a)=>sum+Number(a.weight),0);
    const covered = marked.reduce((sum,a)=>sum+Number(a.weight),0);
    const points = marked.reduce((sum,a)=>sum+a.mark/a.outOf*a.weight,0);
    return '<tr><th scope="row">'+subject(c.id)+'</th><td>'+percent(loggedWeight)+(loggedWeight>100?' '+badge('Check weights','alert'):'')+'</td><td>'+percent(covered)+'</td><td>'+(covered?percent(points/covered*100):'—')+'</td><td>'+(covered?Number(points.toFixed(2))+' / 100':'—')+'</td></tr>';
  }).join('');
  return pageHead('','Assessments & Trials','',button('+ Assessment','edit-assessment','','primary'))+
    (live.length?assessHero(live[0],live.slice(1)):'')+
    section('Next eight weeks','',assessRunway(all))+
    section('Upcoming','',tabGroup('Assessment type','assessment-filter',assessmentFilter,['All','Assessment','Trial'])+
      (groups.length?groups.map(([label,list])=>'<div class="assess-group"><h3 class="ag-title">'+h(label)+' <span>'+list.length+'</span></h3>'+list.map(assessRow).join('')+'</div>').join('')
        :emptyCard('Nothing coming up','Add your next '+(assessmentFilter==='Trial'?'Trial':'assessment')+' with its date and the countdown starts.',button('+ Add '+(assessmentFilter==='Trial'?'Trial':'assessment'),assessmentFilter==='Trial'?'new-trial':'edit-assessment'))))+
    (past.length?'<details class="card assess-past"><summary><h2>Sat and returned</h2><span>'+past.length+'</span></summary>'+past.map(assessRow).join('')+'</details>':'')+
    section('Marks by course','', '<div class="table-scroll"><table><thead><tr><th>Course</th><th>Weight logged</th><th>Weight marked</th><th>Marked average</th><th>Points earned</th></tr></thead><tbody>'+marks+'</tbody></table></div>');
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
  return '<article class="record"><div class="record-head"><div><div class="line">'+subject(e.course)+(e.stage!=='Logged'?badge(e.stage,tone):'')+'</div><h3>'+h(e.title)+'</h3><p>'+(e.source?h(e.source)+' · ':'')+h(e.cause)+' · '+h(label)+'</p></div><div class="line">'+button('Edit','edit-error',e.id)+(e.stage!=='Passed'?button('Plan repair','plan-error',e.id)+button('Record retest','retest',e.id,'primary'):'')+'</div></div>'+
    (e.repair?'<p class="record-detail"><strong>Repair</strong> '+br(e.repair)+'</p>':'')+
    ((e.attempts||[]).length?'<details class="attempts"><summary>'+e.attempts.length+' retest'+(e.attempts.length===1?'':'s')+' · latest '+h(e.attempts.at(-1).outcome)+'</summary>'+e.attempts.map(at=>'<p>'+h(pretty(at.date))+' · '+h(at.outcome)+' · '+br(at.evidence)+'</p>').join('')+'</details>':'')+'</article>';
}
function practice() {
  const items=dated(data.errors.filter(e=>practiceFilter==='All'||(practiceFilter==='Passed'?e.stage==='Passed':e.stage!=='Passed')),'retest');
  const sessions=dated(data.tasks.filter(t=>Object.hasOwn(templates,t.kind))).reverse();
  return pageHead('','Practice & repair','',button('+ Log error','edit-error','','primary'))+
    '<div class="template-row" role="group" aria-label="Start from a template">'+Object.entries(templates).map(([key,t])=>'<button type="button" class="template-pick" data-action="template" data-id="'+h(key)+'" title="'+h(t.text)+'">'+icon(key==='Active retrieval'?'bolt':key==='Timed practice'?'clock':'check')+'<span>'+h(key)+'</span><small>'+t.minutes+'m</small></button>').join('')+'</div>'+
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
    metric('Time completed',minutes(done.reduce((n,t)=>n+spentMins(t),0)),'')+
    metric('Retests passed',data.errors.flatMap(e=>e.attempts||[]).filter(a=>monday(a.date)===week&&a.outcome==='Passed').length,'')+
    metric('Assessments due',data.assessments.filter(a=>a.date&&monday(a.date)===week).length,'')+'</div>'+
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
  if (data) applyHighlight();
  const r=route();
  quickCount=0;
  // Remember focus so typing in the detail panel or quick add survives a re-render.
  const active=document.activeElement;
  const focusKey=active?.dataset?.field ? '[data-field="'+active.dataset.field+'"]' : active?.id && active.id!=='search' ? '#'+CSS.escape(active.id) : null;
  $('section-label').textContent=routeLabel(r);
  nav.innerHTML=navHtml(r);
  const opened=[...main.querySelectorAll('details.module[open] summary strong')].map(x=>x.textContent);
  const pages={week:weekly,assess:assessments,topics:topicsPage,practice,feedback,review:reviews,
    calendar:calendarPage,matrix:matrixPage,focus:focusPage,habits:habitsPage,done:completedPage,dash:dashPage,papers:papersPage,settings:settingsPage};
  main.dataset.route=r.name;
  main.innerHTML=(pages[r.name]??taskPage)(r);
  if (r.name==='calendar') calAfterRender();
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
  renderFloat();
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
  const v=record??{title:'',course:courseDefault(),kind:kind||'Assessment',date:'',time:'',weight:'',mark:'',outOf:'',status:'Scheduled',scope:'',checks:{}};
  crud('assessments',record,required('title','Task name',v.title)+chooseCourse(v.course)+select('kind','Type',v.kind,['Assessment','Trial'])+
    dateField('date','Due date / exam date',v.date)+field('time','Start time (for the countdown)',v.time||'',{type:'time'})+number('weight','School weighting (%)',v.weight,{max:100,step:.01})+
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
let selected = null, showDone = false, calMode = 'week', calAnchor = today(), habitOpen = null, dragging = null, grabY = 0;
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
    c?'<span class="dot-label" style="--c:'+c.colour+'">'+subjectIcon(c.id)+h(c.short)+'</span>':'',
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
    '<input id="'+id+'" name="q" autocomplete="off" aria-label="Add a task to '+h(where)+'" placeholder="Add a task" title="Dates, times, #subject, #tags and !priority are picked up as you type">'+
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
// Week view is a time-blocking grid: drag on empty space to draw a block, drag a block
// to move it (across days too), drag its bottom edge to change its length.
const HOUR_PX=48, SNAP=15, DAY_MINS=24*60;
let calScroll=null, calDrag=null, swallowClick=false;
const calTasks = day => sortTasks(data.tasks.filter(t=>t.date===day&&t.status!=='Dropped')).sort((a,b)=>(a.time||'00').localeCompare(b.time||'00'));
const calAssess = day => data.assessments.filter(a=>a.date===day);
const toMin = t => { const [hh,mm]=String(t||'0:0').split(':').map(Number); return (hh||0)*60+(mm||0); };
const fromMin = m => pad2(Math.floor(m/60))+':'+pad2(m%60);
const hm = m => { const hh=Math.floor(m/60)%24, mm=m%60; return (hh%12||12)+(mm?':'+pad2(mm):'')+(hh<12?'am':'pm'); };
const blockLen = t => Math.max(SNAP, Number(t.minutes)||30);
const calDays = () => matchMedia('(max-width:760px)').matches ? 3 : 7;
const calStart = () => calDays()===7 ? monday(calAnchor) : calAnchor;
const chip = t => '<div class="cal-chip'+(t.status==='Done'?' done':'')+'" draggable="true" data-drag="'+h(t.id)+'" data-select="'+h(t.id)+'" style="--c:'+listColour(t.course||t.list)+'">'+(t.time?'<b>'+hm(toMin(t.time))+'</b>':'')+'<span>'+h(t.title||'Untitled')+'</span></div>';
const assessChip = a => '<a class="cal-chip assess" href="#assess" style="--c:'+(course(a.course)?.colour??'#795922')+'"><b>⚑</b><span>'+h(a.title)+'</span></a>';
const extChip = e => '<a class="cal-chip ext"'+(e.link?' href="'+h(e.link)+'" target="_blank" rel="noopener"':'')+' style="--c:'+h(e.colour)+'" title="'+h(e.title+' · '+e.calName)+'">'+(e.time?'<b>'+hm(toMin(e.time))+'</b>':'')+'<span>'+h(e.title)+'</span></a>';
function calTitle() {
  if (calMode==='month') return pretty(calAnchor.slice(0,8)+'01',{month:'long',year:'numeric'});
  const s=calStart(), e=addDays(s,calDays()-1);
  return s.slice(0,7)===e.slice(0,7) ? pretty(s,{month:'long',year:'numeric'}) : pretty(s,{month:'short'})+' – '+pretty(e,{month:'short',year:'numeric'});
}
function calendarPage() {
  const unscheduled=data.tasks.filter(t=>taskOpen(t)&&!t.date);
  const range = calMode==='month' ? [monday(calAnchor.slice(0,8)+'01'), addDays(monday(calAnchor.slice(0,8)+'01'),41)] : [calStart(), addDays(calStart(),calDays()-1)];
  extEnsure(range[0], range[1]);
  return '<div class="cal-head"><div class="cal-title"><h1>'+h(calTitle())+'</h1>'+extStatus()+'</div><div class="cal-tools">'+
    '<div class="week-picker"><button type="button" aria-label="Previous" data-action="cal-shift" data-id="-1">‹</button>'+button('Today','cal-today','','text')+'<button type="button" aria-label="Next" data-action="cal-shift" data-id="1">›</button></div>'+
    tabGroup('Calendar view','cal-mode',calMode,[['week','Week'],['month','Month']])+
    '<button type="button" class="icon-btn cal-cals" data-action="calendars" title="Calendars" aria-label="Calendars">'+icon('calendar')+'</button></div></div>'+
    '<div class="cal-wrap'+(unscheduled.length?'':' no-side')+'">'+(calMode==='month'?monthGrid():weekGrid())+
    (unscheduled.length?'<aside class="cal-side"><h2 title="Drag onto the grid to plan it">Unscheduled</h2>'+sortTasks(unscheduled).map(chip).join('')+'</aside>':'')+'</div>';
}
function monthGrid() {
  const monthStart=calAnchor.slice(0,8)+'01', start=monday(monthStart), month=monthStart.slice(0,7), t0=today();
  const cells=Array.from({length:42},(_,i)=>addDays(start,i));
  const ext=extFor(cells[0],cells[41]);
  return '<div class="month"><div class="month-head">'+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="month-grid">'+cells.map(day=>{
    const items=[...calAssess(day).map(assessChip),...ext.filter(e=>e.date<=day&&e.endDate>=day).map(extChip),...calTasks(day).map(chip)];
    return '<div class="cal-cell'+(day.slice(0,7)!==month?' other':'')+(day===t0?' today':'')+'" data-drop-date="'+day+'"><div class="cal-top"><button type="button" class="cal-num" data-action="cal-open-day" data-id="'+day+'" aria-label="Open the week of '+h(pretty(day))+'">'+Number(day.slice(8))+'</button><button type="button" class="cal-add" data-action="cal-add" data-id="'+day+'" aria-label="Add a task on '+h(pretty(day))+'">+</button></div>'+
      items.slice(0,4).join('')+(items.length>4?'<button type="button" class="cal-more" data-action="cal-open-day" data-id="'+day+'">'+(items.length-4)+' more</button>':'')+'</div>';
  }).join('')+'</div></div>';
}
// All-day row: events lasting several days are one bar across their days, stacked in lanes
// above the single-day chips, as in Notion Calendar and Apple Calendar.
function allDayRow(days,ext) {
  const n=days.length, first=days[0], last=days[n-1];
  const multi=ext.filter(e=>e.allDay&&e.endDate>e.date&&e.date<=last&&e.endDate>=first)
    .map(e=>({e,a:Math.max(0,daysFrom(e.date,first)),b:Math.min(n-1,daysFrom(e.endDate,first))}))
    .sort((x,y)=>x.a-y.a||(y.b-y.a)-(x.b-x.a));
  const lanes=[];
  multi.forEach(m=>{ let l=lanes.findIndex(end=>end<m.a); if (l<0) { l=lanes.length; lanes.push(m.b); } else lanes[l]=m.b; m.lane=l; });
  const L=lanes.length, LANE=24;
  return '<div class="wk-allday" style="grid-template-rows:'+(L?'repeat('+L+','+LANE+'px) ':'')+'minmax(30px,auto)">'+
    '<span class="wk-gutter" style="grid-row:1/span '+(L+1)+'">all day</span>'+
    days.map((d,i)=>'<div class="wk-allcell" data-drop-date="'+d+'" data-drop-allday="1" style="grid-column:'+(i+2)+';grid-row:1/span '+(L+1)+';padding-top:'+(L*LANE+3)+'px">'+
      calAssess(d).map(assessChip).join('')+ext.filter(e=>e.allDay&&e.endDate<=e.date&&e.date===d).map(extChip).join('')+calTasks(d).filter(t=>!t.time).map(chip).join('')+'</div>').join('')+
    multi.map(m=>'<a class="cal-span'+(m.e.endDate<today()?' past':'')+(m.e.date<first?' cont-l':'')+(m.e.endDate>last?' cont-r':'')+'"'+(m.e.link?' href="'+h(m.e.link)+'" target="_blank" rel="noopener"':'')+' style="grid-column:'+(m.a+2)+'/'+(m.b+3)+';grid-row:'+(m.lane+1)+';--c:'+h(m.e.colour)+'" title="'+h(m.e.title+' · '+m.e.calName)+'"><span>'+h(m.e.title)+'</span></a>').join('')+
  '</div>';
}
function weekGrid() {
  const n=calDays(), start=calStart(), days=Array.from({length:n},(_,i)=>addDays(start,i)), t0=today();
  const ext=extFor(days[0],days[n-1],true);
  const now=new Date(), nowMins=Number(new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',hour:'numeric',hourCycle:'h23'}).format(now))*60+now.getMinutes();
  return '<div class="wk" style="--days:'+n+';--hour:'+HOUR_PX+'px">'+
    '<div class="wk-head"><span class="wk-gutter"></span>'+days.map(d=>'<div class="wk-day'+(d===t0?' today':'')+(d<t0?' past':'')+'"><small>'+pretty(d,{weekday:'short'})+'</small><strong>'+Number(d.slice(8))+'</strong></div>').join('')+'</div>'+
    allDayRow(days,ext)+
    '<div class="wk-scroll"><div class="wk-body"><div class="wk-gutter">'+Array.from({length:23},(_,i)=>'<span style="top:'+((i+1)*HOUR_PX)+'px">'+hm((i+1)*60)+'</span>').join('')+'</div>'+
    days.map(d=>{
      const items=[...calTasks(d).filter(t=>t.time).map(t=>({t,s:toMin(t.time),e:Math.min(DAY_MINS,toMin(t.time)+blockLen(t))})),
                   ...ext.filter(e=>!e.allDay&&e.date===d).map(x=>({x,s:toMin(x.time),e:Math.min(DAY_MINS,toMin(x.time)+Math.max(SNAP,x.minutes))}))].sort((a,b)=>a.s-b.s||b.e-a.e);
      // Overlapping blocks share the column side by side.
      const lanes=[]; let group=[], groupEnd=-1; const groups=[];
      items.forEach(it=>{ if (it.s>=groupEnd && group.length) { groups.push(group); group=[]; lanes.length=0; }
        let lane=lanes.findIndex(end=>end<=it.s); if (lane<0) { lane=lanes.length; lanes.push(it.e); } else lanes[lane]=it.e;
        it.lane=lane; group.push(it); groupEnd=Math.max(groupEnd,it.e); });
      if (group.length) groups.push(group);
      groups.forEach(g=>{ const k=Math.max(...g.map(it=>it.lane))+1; g.forEach(it=>it.lanes=k); });
      return '<div class="wk-col'+(d===t0?' today':'')+(d<t0?' past':'')+'" data-day="'+d+'" data-drop-date="'+d+'" data-drop-col="1">'+
        (d===t0?'<i class="now-line" style="top:'+(nowMins/60*HOUR_PX)+'px"></i>':'')+
        items.map(it=>{
          const top=it.s/60*HOUR_PX, height=Math.max(18,(it.e-it.s)/60*HOUR_PX-2), pos='top:'+top+'px;height:'+height+'px;left:calc('+(it.lane*100/it.lanes)+'% + 1px);width:calc('+(100/it.lanes)+'% - 3px)';
          const short=it.e-it.s<=45?' short':'', past=(d<t0||(d===t0&&it.e<=nowMins))?' past':'';
          if (it.x?.kind==='session') return '<button type="button" class="wk-event session'+short+past+'" data-action="edit-session" data-id="'+h(it.x.id)+'" style="--c:'+h(it.x.colour)+';'+pos+'" title="Studied · '+h(it.x.title)+'"><b>'+h(it.x.title)+'</b><span>'+hm(it.s)+' – '+hm(it.e)+' · '+minutes(it.x.minutes)+'</span></button>';
          if (it.x) return '<a class="wk-event ext'+short+past+'"'+(it.x.link?' href="'+h(it.x.link)+'" target="_blank" rel="noopener"':'')+' style="--c:'+h(it.x.colour)+';'+pos+'" title="'+h(it.x.title+' · '+it.x.calName)+'"><b>'+h(it.x.title)+'</b><span>'+hm(it.s)+' – '+hm(it.e)+'</span></a>';
          const t=it.t;
          return '<div class="wk-event'+(t.status==='Done'?' done':'')+(t.id===selected?' picked':'')+short+'" data-task="'+h(t.id)+'" data-select="'+h(t.id)+'" style="--c:'+listColour(t.course||t.list)+';'+pos+'"><b>'+h(t.title||'Untitled')+'</b><span>'+hm(it.s)+' – '+hm(it.e)+'</span><i class="wk-resize" aria-hidden="true"></i></div>';
        }).join('')+'</div>';
    }).join('')+'</div></div></div>';
}
function calAfterRender() {
  const sc=main.querySelector('.wk-scroll');
  if (!sc) return;
  sc.scrollTop = calScroll ?? 7*HOUR_PX;
  sc.addEventListener('scroll',()=>{ calScroll=sc.scrollTop; },{passive:true});
}
// Drawing, moving and resizing blocks with the mouse, pen or a finger.
const minuteAt = (col,y) => Math.max(0,Math.min(DAY_MINS,(y-col.getBoundingClientRect().top)/HOUR_PX*60));
const snapMin = m => Math.round(m/SNAP)*SNAP;
function paintBlock(el,s,e) {
  el.style.top=(s/60*HOUR_PX)+'px'; el.style.height=Math.max(18,(e-s)/60*HOUR_PX-2)+'px';
  const label=el.querySelector('span'); if (label) label.textContent=hm(s)+' – '+hm(e);
}
document.addEventListener('pointerdown',event=>{
  if (!data || event.button!==0 || calDrag) return;
  const col=event.target.closest('.wk-col');
  if (!col || event.target.closest('.wk-new,a.wk-event,.wk-event.session')) return;
  const block=event.target.closest('.wk-event[data-task]');
  const touch=event.pointerType!=='mouse';
  if (block) {
    if (touch && !event.target.closest('.wk-resize')) return;   // on touch a block is tapped to open it; the edge still resizes
    const t=row('tasks',block.dataset.task); if (!t) return;
    const s=toMin(t.time);
    calDrag={mode:event.target.closest('.wk-resize')?'resize':'move',el:block,t,x:event.clientX,y:event.clientY,s,len:blockLen(t),day:t.date,grab:minuteAt(col,event.clientY)-s,moved:false};
    event.preventDefault();
    return;
  }
  const a=Math.floor(minuteAt(col,event.clientY)/SNAP)*SNAP;
  calDrag={mode:'create',col,x:event.clientX,y:event.clientY,a,b:a+60,touch,moved:false};
  if (!touch) event.preventDefault();
});
document.addEventListener('pointermove',event=>{
  const d=calDrag; if (!d) return;
  if (!d.moved && Math.hypot(event.clientX-d.x,event.clientY-d.y)<5) return;
  if (d.mode==='create' && d.touch) { calDrag=null; return; }   // a finger drag on empty space scrolls
  if (!d.moved) {
    d.moved=true;
    if (d.mode==='create') { d.ghost=document.createElement('div'); d.ghost.className='wk-event wk-ghost'; d.ghost.innerHTML='<b>New block</b><span></span>'; d.col.append(d.ghost); }
    else d.el.classList.add('lifted');
    document.documentElement.classList.add('cal-dragging');
  }
  if (d.mode==='create') {
    const m=snapMin(minuteAt(d.col,event.clientY));
    if (m>=d.a) { d.s=d.a; d.e=Math.max(d.a+SNAP,m); } else { d.s=m; d.e=d.a+SNAP; }
    paintBlock(d.ghost,d.s,d.e);
  } else if (d.mode==='move') {
    const over=document.elementFromPoint(event.clientX,event.clientY)?.closest('.wk-col');
    if (over && over!==d.el.parentElement) { over.append(d.el); d.el.style.left='1px'; d.el.style.width='calc(100% - 3px)'; }
    const col=d.el.parentElement;
    d.day=col.dataset.day;
    d.ns=Math.max(0,Math.min(DAY_MINS-d.len,snapMin(minuteAt(col,event.clientY)-d.grab)));
    paintBlock(d.el,d.ns,d.ns+d.len);
  } else {
    const col=d.el.parentElement;
    d.nlen=Math.max(SNAP,Math.min(DAY_MINS-d.s,snapMin(minuteAt(col,event.clientY))-d.s));
    paintBlock(d.el,d.s,d.s+d.nlen);
  }
});
document.addEventListener('pointerup',event=>{
  const d=calDrag; if (!d) return;
  calDrag=null;
  document.documentElement.classList.remove('cal-dragging');
  if (d.mode==='create') {
    if (!d.moved) { if (event.target.closest('.wk-col')!==d.col) return; d.s=d.a; d.e=Math.min(DAY_MINS,d.a+60); d.ghost=document.createElement('div'); d.ghost.className='wk-event wk-ghost'; d.ghost.innerHTML='<b></b><span></span>'; d.col.append(d.ghost); paintBlock(d.ghost,d.s,d.e); }
    nameBlock(d);
    return;
  }
  if (!d.moved) return;
  swallowClick=true; setTimeout(()=>{ swallowClick=false; },0);   // only the click that ends this drag
  if (d.mode==='move') change(()=>{ d.t.date=d.day; d.t.time=fromMin(d.ns); });
  else change(()=>{ d.t.minutes=d.nlen; });
});
document.addEventListener('pointercancel',()=>{ if (calDrag) { calDrag=null; document.documentElement.classList.remove('cal-dragging'); render(); } });
document.addEventListener('click',event=>{ if (swallowClick) { swallowClick=false; event.stopPropagation(); event.preventDefault(); } },true);
// A drawn block asks what it is for. Quick-add words work here too: "Chem prac #che !high".
function nameBlock(d) {
  const g=d.ghost;
  g.classList.add('naming');
  g.innerHTML='<input class="wk-new" placeholder="What are you working on?" aria-label="Name this block" autocomplete="off"><span>'+hm(d.s)+' – '+hm(d.e)+'</span>';
  const input=g.querySelector('input');
  let done=false;
  const finish=keep=>{
    if (done) return; done=true;
    const text=input.value.trim();
    if (keep && text) createFromQuick(text,{date:d.col.dataset.day,time:fromMin(d.s),minutes:d.e-d.s});
    else g.remove();
  };
  input.addEventListener('keydown',e=>{ if (e.key==='Enter') { e.preventDefault(); finish(true); } if (e.key==='Escape') { e.preventDefault(); e.stopPropagation(); finish(false); } });
  input.addEventListener('blur',()=>setTimeout(()=>finish(true),0));
  input.focus();
}
document.addEventListener('keydown',event=>{ if (event.key==='Escape' && calDrag) { calDrag=null; document.documentElement.classList.remove('cal-dragging'); render(); } });

// ───────────────────────── Connected calendars ─────────────────────────
// Google Calendar: two-way. Your Google events show in Stacky, and Stacky's timed blocks
// are kept as events in one Google calendar you choose (moved or renamed there, they
// update here too). iCloud and other calendars are read from an .ics link or file.
// The settings sync with your records; the Google sign-in stays on each device.
const TZ='Australia/Sydney', EXT_KEY='stacky-ext-cache:v1', GTOKEN_KEY='stacky-gtoken';
const G_SCOPE='https://www.googleapis.com/auth/calendar.calendarlist.readonly https://www.googleapis.com/auth/calendar.events';
const ICS_COLOURS=['#8e6bbf','#d9730d','#0f7b6c','#c4554d','#2e78c7','#a5793c'];
const calCfg = () => {
  const c=data.settings.calendars ??= {};
  c.google ??= {clientId:'',show:{},pushTo:'primary',push:true,list:[]};
  c.ics ??= [];
  return c;
};
let extCache=(()=>{ try { return JSON.parse(localStorage.getItem(EXT_KEY))||{}; } catch { return {}; } })();   // {google:{from,to,at,events}, ics:{id:{at,vevents,error}}}
const storeExt = () => { try { localStorage.setItem(EXT_KEY,JSON.stringify(extCache)); } catch {} };
let gToken=(()=>{ try { const x=JSON.parse(sessionStorage.getItem(GTOKEN_KEY)); return x&&x.exp>Date.now()?x:null; } catch { return null; } })();
let gPullError='', gPullNote='', gNeedConsent=false, gClient=null, gScript=null, gBusy=false, gError='', gPushTimer, gPushing=false, gPushAgain=false;
const gOn = () => !!calCfg().google.clientId;
const gReady = () => !!(gToken && gToken.exp>Date.now());

// Sydney wall-clock date and time for an instant.
const sydParts = new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function sydWall(ms) {
  const p=Object.fromEntries(sydParts.formatToParts(new Date(ms)).map(x=>[x.type,x.value]));
  return {date:p.year+'-'+p.month+'-'+p.day,time:p.hour+':'+p.minute};
}
// The instant for a wall-clock time in a named zone (falls back to Sydney for unknown names).
function zoneToMs(y,mo,d,hh,mm,zone) {
  const guess=Date.UTC(y,mo-1,d,hh,mm);
  let tz=TZ; try { new Intl.DateTimeFormat('en',{timeZone:zone}); tz=zone||TZ; } catch {}
  const f=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const off=ms=>{ const p=Object.fromEntries(f.formatToParts(new Date(ms)).map(x=>[x.type,x.value])); return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute)-ms; };
  let t=guess-off(guess); t=guess-off(t); return t;
}

// ── Events shown on the calendar ──
// Logged study sessions appear on the week calendar as finished blocks (Settings can hide them).
function sessionEvents(from,to) {
  if (data.settings.calSessions===false) return [];
  return data.focus.filter(f=>f.date>=from&&f.date<=to).map(f=>{
    const st=sessionStart(f), c=course(f.course), day=sydney.format(new Date(st));
    return {kind:'session',id:f.id,date:day,endDate:day,allDay:false,time:hhmm(st),minutes:Math.max(1,Number(f.minutes)||0),title:(c?.short??'Study')+(f.note?' · '+f.note.split('\n')[0]:''),colour:c?.colour??'#787774',calName:'Study log',link:''};
  });
}
function extFor(from,to,withSessions=false) {
  const out=withSessions?sessionEvents(from,to):[], cfg=calCfg();
  if (gOn()) for (const e of extCache.google?.events||[]) if (cfg.google.show[e.cal]!==false && e.date<=to && e.endDate>=from) out.push(e);
  for (const c of cfg.ics) {
    const vevents=c.vevents||extCache.ics?.[c.id]?.vevents||[];
    for (const v of vevents) for (const occ of expandEvent(v,from,to)) out.push({...occ,colour:c.colour,calName:c.name,link:''});
  }
  return out;
}
function extStatus() {
  const cfg=calCfg(), bits=[];
  if (gOn()) bits.push(!gReady()?'<button type="button" class="ext-pill warn" data-action="g-connect" title="Sign in again to sync">Reconnect Google</button>'
    : (gPullError||gError)?(e=>'<button type="button" class="ext-pill warn" data-action="g-connect" title="'+h(e)+'">Google: '+h(e.length>60?e.slice(0,57)+'…':e)+' · Fix</button>')(gPullError||gError)
    : '<span class="ext-pill ok" title="'+h(gPullNote||'Connected to Google Calendar')+'">Google'+(extCache.google?.events?' · '+extCache.google.events.length+' events':'')+'</span>');
  if (cfg.ics.length) bits.push('<span class="ext-pill ok">'+cfg.ics.length+' iCal</span>');
  if (gBusy) bits.push('<span class="ext-pill">Syncing…</span>');
  return bits.length?'<div class="ext-status">'+bits.join('')+'</div>':'';
}
let extWant=null;
function extEnsure(from,to) {
  const cfg=calCfg(), now=Date.now();
  if (gOn()) gPreload();
  const g=extCache.google;
  if (gOn() && gReady() && !gBusy && (!g || g.from>from || g.to<to || now-g.at>5*60e3)) { extWant=[from,to]; setTimeout(()=>gPull(from,to),0); }
  for (const c of cfg.ics) if (c.url && !gBusyIcs.has(c.id)) { const x=extCache.ics?.[c.id]; if (!x || now-x.at>30*60e3) setTimeout(()=>icsFetch(c),0); }
}

// ── Google ──
function gPreload() {
  if (gScript || !gOn()) return gScript;
  gScript=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://accounts.google.com/gsi/client'; s.async=true; s.onload=res; s.onerror=()=>{ gScript=null; rej(new Error('Google sign-in could not load. Check your connection.')); }; document.head.append(s); });
  gScript.catch(()=>{});
  return gScript;
}
function gConnect() {   // must run from a click, so the Google window is allowed to open
  if (!gOn()) { calendarsModal(); return; }
  if (!window.google?.accounts?.oauth2) { gPreload()?.then(()=>notify('Google is ready. Press Connect again.')).catch(e=>notify(e.message)); return; }
  gClient ??= google.accounts.oauth2.initTokenClient({client_id:calCfg().google.clientId,scope:G_SCOPE,callback:r=>{
    if (r.error) { gError='Google did not connect ('+r.error+').'; notify(gError); render(); return; }
    if (google.accounts.oauth2.hasGrantedAllScopes && !google.accounts.oauth2.hasGrantedAllScopes(r,...G_SCOPE.split(' '))) { gToken=null; gError='Calendar access was not allowed. Press Fix and tick both calendar boxes on Google’s screen.'; gNeedConsent=true; notify(gError); render(); return; }
    gNeedConsent=false;
    gToken={t:r.access_token,exp:Date.now()+(Number(r.expires_in)-60)*1000};
    try { sessionStorage.setItem(GTOKEN_KEY,JSON.stringify(gToken)); } catch {}
    gError=''; notify('Connected to Google Calendar.');
    gPull(extWant?.[0]??addDays(today(),-14), extWant?.[1]??addDays(today(),60), true).then(()=>gQueuePush(300));
  }});
  gClient.requestAccessToken({prompt:gNeedConsent?'consent':gToken?'':undefined});
}
async function gApi(path,options={}) {
  if (!gReady()) throw new Error('Not signed in to Google.');
  const r=await fetch('https://www.googleapis.com/calendar/v3'+path,{...options,headers:{Authorization:'Bearer '+gToken.t,...(options.body?{'Content-Type':'application/json'}:{})}});
  if (r.status===401) { gToken=null; try { sessionStorage.removeItem(GTOKEN_KEY); } catch {} if (data) render(); throw new Error('Google sign-in expired. Press Reconnect Google.'); }
  if (r.status===204) return null;
  const body=await r.json().catch(()=>null);
  if (r.status===403 && /insufficient/i.test(body?.error?.message||'')) { gNeedConsent=true; throw new Error('Calendar access was not allowed. Press Fix and tick both calendar boxes.'); }
  if (!r.ok) throw new Error((body?.error?.message||('Google error '+r.status)).replace(/\s+/g,' '));
  return body;
}
const gTime = d => encodeURIComponent(new Date(zoneToMs(+d.slice(0,4),+d.slice(5,7),+d.slice(8,10),0,0,TZ)).toISOString());
async function gPull(from,to,force=false) {
  if (!gReady() || (gBusy && !force)) return;
  gBusy=true;
  try {
    const cfg=calCfg().google;
    // The calendar list needs its own permission; without it, still read your main calendar.
    let list;
    try { list=(await gApi('/users/me/calendarList?minAccessRole=reader&maxResults=250')).items||[]; }
    catch (e) { list=[{id:'primary',summary:'Google Calendar',backgroundColor:'#4285f4',primary:true,accessRole:'owner',selected:true}]; gPullNote='Showing your main Google calendar only. Press Reconnect in Settings → Calendar and tick every box to see your other calendars.'; }
    if (list.length>1||list[0]?.id!=='primary') gPullNote='';
    const fresh=list.map(c=>({id:c.id,name:c.summaryOverride||c.summary,colour:c.backgroundColor||'#4285f4',primary:!!c.primary,writable:['owner','writer'].includes(c.accessRole)}));
    if (JSON.stringify(fresh)!==JSON.stringify(cfg.list)) { cfg.list=fresh; list.forEach(c=>{ if (cfg.show[c.id]==null) cfg.show[c.id]=c.selected!==false; }); dirty=true; queueSave(); }
    const lo=addDays(from,-7), hi=addDays(to,35), events=[];
    for (const c of fresh) {
      if (cfg.show[c.id]===false) continue;
      let page='';
      do {
        const r=await gApi('/calendars/'+encodeURIComponent(c.id)+'/events?singleEvents=true&orderBy=startTime&maxResults=2500&timeZone='+encodeURIComponent(TZ)+'&timeMin='+gTime(lo)+'&timeMax='+gTime(hi)+(page?'&pageToken='+page:''));
        for (const e of r.items||[]) {
          if (e.status==='cancelled' || e.extendedProperties?.private?.stacky) continue;   // Stacky's own blocks are shown as tasks
          const base={id:c.id+'|'+e.id,cal:c.id,calName:c.name,colour:c.colour,title:e.summary||'(No title)',link:e.htmlLink||''};
          if (e.start?.date) events.push({...base,allDay:true,date:e.start.date,endDate:addDays(e.end?.date||e.start.date,-1),time:'',minutes:0});
          else if (e.start?.dateTime) { const s=sydWall(Date.parse(e.start.dateTime)), mins=Math.round((Date.parse(e.end.dateTime)-Date.parse(e.start.dateTime))/60000); events.push({...base,allDay:false,date:s.date,endDate:s.date,time:s.time,minutes:mins}); }
        }
        page=r.nextPageToken;
      } while (page);
    }
    extCache.google={from:lo,to:hi,at:Date.now(),events}; storeExt();
    gPullError='';
  } catch (e) { gPullError=e.message; extCache.google={...(extCache.google||{events:[]}),from:extCache.google?.from??from,to:extCache.google?.to??to,at:Date.now()}; }
  gBusy=false;
  if (data && route().name==='calendar') render();
}
// Stacky blocks → Google. Each event carries the task id and a signature of what was sent,
// so a block edited in Google is copied back to the task, and one edited here is updated there.
const taskSig = t => [t.title||'Untitled',t.date,t.time,blockLen(t)].join('|');
function eventSig(e) {
  if (!e.start?.dateTime || !e.end?.dateTime) return null;
  const s=sydWall(Date.parse(e.start.dateTime));
  return [e.summary||'Untitled',s.date,s.time,Math.max(SNAP,Math.round((Date.parse(e.end.dateTime)-Date.parse(e.start.dateTime))/60000))].join('|');
}
function eventBody(t,sig) {
  const s=toMin(t.time), e=s+blockLen(t), endDate=addDays(t.date,Math.floor(e/DAY_MINS));
  return JSON.stringify({summary:t.title||'Untitled',description:'Planned in Stacky'+(course(t.course)?' · '+course(t.course).name:''),
    start:{dateTime:t.date+'T'+t.time+':00',timeZone:TZ},end:{dateTime:endDate+'T'+fromMin(e%DAY_MINS)+':00',timeZone:TZ},
    extendedProperties:{private:{stacky:'1',stackyId:t.id,stackySig:sig}}});
}
// Logged study sessions go to Google as finished events (one way: Stacky's log is the record).
const sessionSummary = f => 'Studied '+(course(f.course)?.short??'')+(f.note?' · '+f.note.split('\n')[0]:'');
const sessionSig = f => [sessionSummary(f),sessionStart(f),f.minutes].join('|');
function sessionBody(f,sig) {
  const st=sessionStart(f);
  return JSON.stringify({summary:sessionSummary(f),description:'Logged in Stacky'+(course(f.course)?' · '+course(f.course).name:''),
    start:{dateTime:new Date(st).toISOString(),timeZone:TZ},end:{dateTime:new Date(st+f.minutes*60000).toISOString(),timeZone:TZ},
    transparency:'transparent',extendedProperties:{private:{stacky:'1',stackyId:'s:'+f.id,stackySig:sig}}});
}
function gQueuePush(delay=2500) { if (!gOn() || !calCfg().google.push) return; clearTimeout(gPushTimer); gPushTimer=setTimeout(gPush,delay); }
async function gPush() {
  if (!gReady() || !data) return;
  if (gPushing) { gPushAgain=true; return; }
  gPushing=true;
  const cfg=calCfg().google, cal=encodeURIComponent(cfg.pushTo||'primary');
  try {
    const from=addDays(today(),-60), to=addDays(today(),400), ours=new Map();
    let page='';
    do {
      const r=await gApi('/calendars/'+cal+'/events?privateExtendedProperty=stacky%3D1&singleEvents=true&maxResults=2500&timeMin='+gTime(from)+'&timeMax='+gTime(to)+(page?'&pageToken='+page:''));
      (r.items||[]).forEach(e=>{ if (e.status!=='cancelled') ours.set(e.extendedProperties.private.stackyId,e); });
      page=r.nextPageToken;
    } while (page);
    const fromGoogle=[];
    for (const t of data.tasks.filter(t=>t.date&&t.time&&t.status!=='Dropped'&&t.date>=from&&t.date<=to)) {
      const sig=taskSig(t), ev=ours.get(t.id); ours.delete(t.id);
      if (!ev) { await gApi('/calendars/'+cal+'/events',{method:'POST',body:eventBody(t,sig)}); continue; }
      const now=eventSig(ev), sent=ev.extendedProperties.private.stackySig;
      if (now && now!==sent && now!==sig) fromGoogle.push([t,ev]);                         // changed in Google: copy it back
      else if (sig!==sent || now!==sig) await gApi('/calendars/'+cal+'/events/'+encodeURIComponent(ev.id),{method:'PATCH',body:eventBody(t,sig)});
    }
    if (data.settings.calSessions!==false) for (const f of data.focus.filter(f=>f.date>=from&&f.date<=to)) {
      const sig=sessionSig(f), ev=ours.get('s:'+f.id); ours.delete('s:'+f.id);
      if (!ev) await gApi('/calendars/'+cal+'/events',{method:'POST',body:sessionBody(f,sig)});
      else if (ev.extendedProperties.private.stackySig!==sig) await gApi('/calendars/'+cal+'/events/'+encodeURIComponent(ev.id),{method:'PATCH',body:sessionBody(f,sig)});
    }
    for (const ev of ours.values()) await gApi('/calendars/'+cal+'/events/'+encodeURIComponent(ev.id),{method:'DELETE'});   // deleted or unscheduled here
    if (fromGoogle.length) {
      change(()=>fromGoogle.forEach(([t,ev])=>{ const s=sydWall(Date.parse(ev.start.dateTime)); t.title=ev.summary||t.title; t.date=s.date; t.time=s.time; t.minutes=Math.round((Date.parse(ev.end.dateTime)-Date.parse(ev.start.dateTime))/60000); }));
      notify(fromGoogle.length===1?'Updated a block you changed in Google Calendar.':'Updated '+fromGoogle.length+' blocks you changed in Google Calendar.');
      gPushAgain=true;   // record the new signatures in Google
    }
    gError='';
  } catch (e) { gError=e.message; }
  gPushing=false;
  if (gPushAgain) { gPushAgain=false; gQueuePush(800); }
}

// ── iCal (.ics) ──
function parseICS(text) {
  const lines=text.replace(/\r?\n[ \t]/g,'').split(/\r?\n/), out=[], overrides=[];
  let ev=null;
  const val=(raw,params)=>{
    const m=raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
    if (!m) return null;
    if (!m[4] || /VALUE=DATE(?!-)/.test(params)) return {date:m[1]+'-'+m[2]+'-'+m[3],time:''};
    if (m[7]) return sydWall(Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5]));
    const tz=(params.match(/TZID=("?)([^;:"]+)\1/)||[])[2];
    return tz && !/Sydney|Melbourne|Canberra|Hobart|Australia\/ACT|Australia\/NSW/i.test(tz) ? sydWall(zoneToMs(+m[1],+m[2],+m[3],+m[4],+m[5],tz)) : {date:m[1]+'-'+m[2]+'-'+m[3],time:m[4]+':'+m[5]};
  };
  for (const line of lines) {
    if (line==='BEGIN:VEVENT') { ev={exdates:[]}; continue; }
    if (line==='END:VEVENT') { if (ev?.start) (ev.recur?overrides:out).push(ev); ev=null; continue; }
    if (!ev) continue;
    const i=line.indexOf(':'); if (i<0) continue;
    const head=line.slice(0,i), raw=line.slice(i+1), name=head.split(';')[0].toUpperCase(), params=head.slice(name.length);
    if (name==='SUMMARY') ev.title=raw.replace(/\\n/gi,' ').replace(/\\([,;\\])/g,'$1');
    else if (name==='UID') ev.uid=raw;
    else if (name==='DTSTART') ev.start=val(raw,params);
    else if (name==='DTEND') ev.end=val(raw,params);
    else if (name==='DURATION') { const m=raw.match(/P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/); if (m) ev.dur=((+m[1]||0)*7*1440)+((+m[2]||0)*1440)+((+m[3]||0)*60)+(+m[4]||0); }
    else if (name==='RRULE') ev.rrule=Object.fromEntries(raw.split(';').map(x=>x.split('=')));
    else if (name==='EXDATE') raw.split(',').forEach(x=>{ const v=val(x,params); if (v) ev.exdates.push(v.date+(v.time?'T'+v.time:'')); });
    else if (name==='RECURRENCE-ID') { const v=val(raw,params); if (v) ev.recur=v.date+(v.time?'T'+v.time:''); }
    else if (name==='STATUS' && raw==='CANCELLED') ev.cancelled=true;
  }
  for (const o of overrides) { const master=out.find(e=>e.uid===o.uid); if (master) master.exdates.push(o.recur); if (!o.cancelled) out.push({...o,recur:undefined}); }
  const keepFrom=addDays(today(),-60);
  return out.filter(e=>!e.cancelled).map(e=>{
    const allDay=!e.start.time;
    let minutes=e.dur ?? (e.end ? (allDay ? 0 : Math.round((Date.parse(e.end.date+'T'+(e.end.time||'00:00')+'Z')-Date.parse(e.start.date+'T'+e.start.time+'Z'))/60000)) : (allDay?0:60));
    const days=allDay ? Math.max(1,e.end ? Math.round((Date.parse(e.end.date)-Date.parse(e.start.date))/864e5) : 1) : 1;
    const r=e.rrule&&{freq:e.rrule.FREQ,interval:+e.rrule.INTERVAL||1,count:+e.rrule.COUNT||0,until:e.rrule.UNTIL?(val(e.rrule.UNTIL,'')?.date||''):'',byday:e.rrule.BYDAY?e.rrule.BYDAY.split(',').map(x=>x.slice(-2)):null};
    return {title:e.title||'(No title)',date:e.start.date,time:e.start.time,minutes,days,allDay,rrule:r||null,exdates:e.exdates};
  }).filter(e=>e.rrule ? !(e.rrule.until && e.rrule.until<keepFrom) : addDays(e.date,e.days)>=keepFrom);
}
const DOW=['SU','MO','TU','WE','TH','FR','SA'];
function expandEvent(v,from,to) {
  const occ=d=>({id:v.title+'|'+d+'|'+v.time,title:v.title,allDay:v.allDay,date:d,endDate:addDays(d,v.days-1),time:v.time,minutes:v.minutes});
  const skip=d=>v.exdates?.includes(d+(v.time?'T'+v.time:''));
  if (!v.rrule) return v.date<=to && addDays(v.date,v.days-1)>=from ? [occ(v.date)] : [];
  const r=v.rrule, out=[]; let n=0;
  const take=d=>{ if (d<v.date) return true; if (r.until && d>r.until) return false; n++; if (r.count && n>r.count) return false; if (d>to) return false; if (addDays(d,v.days-1)>=from && !skip(d)) out.push(occ(d)); return true; };
  if (r.freq==='DAILY') { for (let d=v.date,i=0;i<3000&&take(d);i++) d=addDays(d,r.interval); }
  else if (r.freq==='WEEKLY') {
    const days=(r.byday||[DOW[date(v.date).getUTCDay()]]).map(x=>(DOW.indexOf(x)+6)%7).sort((a,b)=>a-b);
    outer: for (let wk=monday(v.date),i=0;i<600;i++,wk=addDays(wk,7*r.interval)) for (const k of days) if (!take(addDays(wk,k))) break outer;
  }
  else if (r.freq==='MONTHLY') { for (let i=0;i<240;i++) { const d=addMonth(v.date,i*r.interval); if (d.slice(8)!==v.date.slice(8)) continue; if (!take(d)) break; } }
  else if (r.freq==='YEARLY') { for (let i=0;i<60;i++) { const d=(+v.date.slice(0,4)+i*r.interval)+v.date.slice(4); if (!take(d)) break; } }
  else if (v.date<=to && v.date>=from) out.push(occ(v.date));
  return out;
}
const gBusyIcs=new Set();
async function icsFetch(c,loud=false) {
  gBusyIcs.add(c.id);
  try {
    const r=await fetch(c.url.replace(/^webcal:/i,'https:'),{cache:'no-store'});
    if (!r.ok) throw new Error('The calendar link answered '+r.status+'.');
    const vevents=parseICS(await r.text());
    (extCache.ics??={})[c.id]={at:Date.now(),vevents}; storeExt();
    if (loud) notify('Loaded '+vevents.length+' events from '+c.name+'.');
  } catch (e) {
    (extCache.ics??={})[c.id]={...(extCache.ics?.[c.id]||{vevents:[]}),at:Date.now(),error:'Could not read this link from the browser. Import the .ics file instead, or add the calendar to Google Calendar and it will show here through Google.'};
    storeExt();
    if (loud) notify(extCache.ics[c.id].error);
  }
  gBusyIcs.delete(c.id);
  if (data && route().name==='calendar') render();
}
async function icsImport(file) {
  const text=await file.text();
  if (!/BEGIN:VCALENDAR/.test(text)) { notify('That file is not a calendar (.ics) file.'); return; }
  const vevents=parseICS(text), cfg=calCfg();
  if (JSON.stringify(vevents).length>400000) { notify('That calendar is too large to keep in sync. Export a shorter range, or add it to Google Calendar instead.'); return; }
  const name=file.name.replace(/\.ics$/i,'')||'Imported calendar';
  change(()=>cfg.ics.push({id:uid(),name,colour:ICS_COLOURS[cfg.ics.length%ICS_COLOURS.length],vevents}));
  notify('Imported '+vevents.length+' events from '+name+'.');
  if (dialog.open) calendarsModal();
}

// ── Settings ──
function calendarsModal() {
  const cfg=calCfg(), g=cfg.google, origin=location.origin;
  const googleBlock = !g.clientId
    ? '<p class="note full">Stacky talks to Google Calendar straight from your browser. Google needs a free “client ID” for that, made once in your own Google account (about 5 minutes):</p>'+
      '<ol class="steps full"><li>Open <a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noopener">Google Cloud → New project</a>, name it “Stacky”, and create it.</li>'+
      '<li>Open <a href="https://console.cloud.google.com/apis/library/calendar-json.googleapis.com" target="_blank" rel="noopener">Google Calendar API</a> and press <strong>Enable</strong>.</li>'+
      '<li>Open <a href="https://console.cloud.google.com/auth/overview" target="_blank" rel="noopener">Google Auth Platform</a> → <strong>Get started</strong>. App name “Stacky”, your email, audience <strong>External</strong>. Then under <strong>Audience → Test users</strong>, add your own Gmail.</li>'+
      '<li>Open <a href="https://console.cloud.google.com/auth/clients" target="_blank" rel="noopener">Clients → Create client</a>: type <strong>Web application</strong>, and under <strong>Authorised JavaScript origins</strong> add <code>'+h(origin)+'</code>. Create, then copy the Client ID.</li></ol>'+
      field('gclient','Google client ID','',{full:true,placeholder:'1234…apps.googleusercontent.com'})
    : '<div class="field full"><span>Google Calendar</span><div class="line wrap">'+(gReady()?'<small class="note">Connected on this device.</small>':button('Connect Google','g-connect','','primary'))+button('Disconnect','g-forget','','text')+'</div>'+(gError?'<small class="form-error">'+h(gError)+'</small>':'')+'</div>'+
      (g.list.length?'<fieldset class="field full cal-pick"><legend>Show these calendars</legend>'+g.list.map(c=>'<label><input type="checkbox" name="show:'+h(c.id)+'" value="1" '+(g.show[c.id]!==false?'checked':'')+'><i style="background:'+h(c.colour)+'"></i>'+h(c.name)+'</label>').join('')+'</fieldset>'+
        select('pushTo','Put Stacky blocks in',g.pushTo||'primary',g.list.filter(c=>c.writable).map(c=>[c.primary?'primary':c.id,c.name+(c.primary?' (main)':'')]))+
        '<label class="field toggle-field"><span>Send blocks to Google</span><input type="checkbox" name="push" value="1" '+(g.push?'checked':'')+'></label>':'<p class="note full">Connect to choose which calendars show here.</p>');
  const icsBlock='<p class="note full"><strong>iCloud:</strong> the most reliable way is to add your iCloud calendar to Google Calendar (on iPhone: Calendar → Calendars → ⓘ → Public Calendar → Share link; then in Google Calendar: Other calendars → From URL). It then shows here through Google and stays up to date. You can also paste the link below, or import an .ics file.</p>'+
    (cfg.ics.length?'<div class="field full"><span>Added</span>'+cfg.ics.map(c=>'<div class="ics-row"><i style="background:'+h(c.colour)+'"></i><span>'+h(c.name)+(c.url?'':' · file')+((extCache.ics?.[c.id]?.error&&c.url)?' · <em>could not load</em>':'')+'</span>'+button('Remove','ics-remove',c.id,'text')+'</div>').join('')+'</div>':'')+
    field('icsUrl','iCloud or other calendar link','',{full:true,placeholder:'webcal://p01-caldav.icloud.com/published/…'})+
    '<div class="field full"><span>Or import a file</span><label class="button secondary file-btn">Choose .ics file<input type="file" id="ics-file" accept=".ics,text/calendar" hidden></label></div>';
  modal('Calendars','<div class="form-grid">'+googleBlock+'<div class="full rule"></div>'+icsBlock+'</div>','Save',v=>{
    const id=(v.gclient||'').trim();
    if (!g.clientId && id && !/\.apps\.googleusercontent\.com$/.test(id)) { formError('That does not look like a Google client ID. It ends in .apps.googleusercontent.com.'); return false; }
    const url=(v.icsUrl||'').trim();
    if (url && !/^(webcal|https?):\/\//i.test(url)) { formError('The calendar link should start with webcal:// or https://.'); return false; }
    let added=null;
    change(()=>{
      if (!g.clientId && id) g.clientId=id;
      if (g.list.length) { g.list.forEach(c=>{ g.show[c.id]=v['show:'+c.id]==='1'; }); g.pushTo=v.pushTo||'primary'; g.push=v.push==='1'; }
      if (url) { added={id:uid(),name:url.includes('icloud')?'iCloud':'Calendar link',colour:ICS_COLOURS[cfg.ics.length%ICS_COLOURS.length],url}; cfg.ics.push(added); }
    });
    if (extCache.google) extCache.google.at=0;
    if (added) icsFetch(added,true);
    if (id && !g.list.length) { gPreload(); notify('Saved. Press Connect Google to sign in.'); }
    gQueuePush(500);
  });
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
// HSC exam formats (NESA): minutes of reading time, then writing time.
const examPresets = [
  {id:'mx1',name:'Maths Ext 1 paper',course:'mx1',reading:10,writing:120},
  {id:'mx2',name:'Maths Ext 2 paper',course:'mx2',reading:10,writing:180},
  {id:'phy',name:'Physics paper',course:'phy',reading:5,writing:180},
  {id:'che',name:'Chemistry paper',course:'che',reading:5,writing:180},
  {id:'eco',name:'Economics paper',course:'eco',reading:5,writing:180},
  {id:'eng1',name:'English Adv Paper 1',course:'eng',reading:10,writing:90},
  {id:'eng2',name:'English Adv Paper 2',course:'eng',reading:5,writing:120}
];
const examFor = id => examPresets.find(e=>e.course===id) ?? examPresets[0];
const examCfg = () => timer.exam ?? examFor(timer.course);
const isBreak = p => p==='short' || p==='long';
const phaseSecs = p => (p==='reading'?examCfg().reading:p==='writing'?examCfg().writing:p==='focus'?pomo().focus:p==='short'?pomo().short:pomo().long)*60;
const hrs = m => m%60 ? minutes(m) : (m/60)+'h';
const elapsedSecs = () => Math.floor((timer.elapsed+(timer.running?Date.now()-timer.runFrom:0))/1000);
const countsUp = () => timer.mode==='open' && timer.phase==='focus';
const shownSecs = () => countsUp() ? elapsedSecs() : Math.max(0,phaseSecs(timer.phase)-elapsedSecs());
const sessionActive = () => timer.running || timer.elapsed>0;
const clock = s => (s>=3600?Math.floor(s/3600)+':':'')+pad2(Math.floor(s%3600/60))+':'+pad2(s%60);
const phaseName = {focus:'Study',short:'Short break',long:'Long break',reading:'Reading time',writing:'Writing time'};
const ratings = ['Focused','OK','Distracted'];
const sydneyTime = new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const hhmm = ms => sydneyTime.format(new Date(ms));
function storeTimer() { try { localStorage.setItem(TIMER_KEY,JSON.stringify(timer)); } catch {} }
function resetTimer(extra={}) { Object.assign(timer,{running:false,elapsed:0,runFrom:0,startedAt:null},extra); storeTimer(); }
function startTimer() {
  if (timer.running) return;
  if ((timer.phase==='focus'||timer.phase==='reading') && !timer.startedAt) timer.startedAt=Date.now();
  timer.runFrom=Date.now();
  timer.running=true;
  storeTimer();
  if (timer.mode!=='open' && 'Notification' in window && Notification.permission==='default') Notification.requestPermission().catch(()=>{});
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
function announce(msg) {
  notify(msg);
  try { if ('Notification' in window && Notification.permission==='granted' && document.hidden) new Notification('Stacky',{body:msg}); } catch {}
}
// Exam mode: reading time rolls straight into writing time, as in the exam room.
// Pens down logs the whole sitting and opens the past-paper form to record the mark.
function finishExamPhase() {
  const ex=examCfg();
  if (timer.phase==='reading') {
    Object.assign(timer,{phase:'writing',elapsed:0,runFrom:Date.now(),running:true,warned:[]});
    storeTimer(); chime(); announce('Reading time is over. You may start writing.');
    if (data) render();
    return;
  }
  const end=Date.now(), mins=ex.reading+ex.writing, startMs=timer.startedAt??end-mins*60000;
  change(()=>addSession({taskId:timer.taskId,course:timer.course,date:sydney.format(new Date(startMs)),start:new Date(startMs).toISOString(),end:new Date(end).toISOString(),minutes:mins,note:'Exam conditions · '+ex.name}));
  resetTimer({phase:'reading',warned:[]});
  chime(); closeFull(); announce('Pens down. '+ex.name+' is logged. Mark it, then save the result.');
  editPaper(null,{title:ex.name+' (timed practice)',course:timer.course||ex.course,source:'HSC',minutes:ex.writing,limit:ex.writing,date:today()});
}
// Time checks during writing, like the supervisor's announcements.
function examWarnings() {
  if (timer.mode!=='exam' || timer.phase!=='writing' || !timer.running) return;
  const left=shownSecs(), done=timer.warned||[];
  for (const w of [30,5]) {
    if (examCfg().writing>w && left<=w*60 && left>0 && !done.includes(w)) {
      timer.warned=[...done,w]; storeTimer(); chime(); announce(w+' minutes of writing time left.'); return;
    }
  }
}
function finishPhase() {
  if (timer.mode==='exam') { finishExamPhase(); return; }
  const was=timer.phase;
  if (was==='focus') {
    const mins=pomo().focus, end=Date.now(), startMs=timer.startedAt??end-mins*60000;
    change(()=>addSession({taskId:timer.taskId,course:timer.course,date:sydney.format(new Date(startMs)),start:new Date(startMs).toISOString(),end:new Date(end).toISOString(),minutes:mins}));
    timer.cycle=(timer.cycle||0)+1;
    resetTimer({phase:timer.cycle%pomo().every===0?'long':'short'});
  } else resetTimer({phase:'focus'});
  chime();
  announce(was==='focus'?'Logged '+minutes(pomo().focus)+'. Time for a '+phaseName[timer.phase].toLowerCase()+'.':'Break over. Start the next round when you are ready.');
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
      if (!s.id) { resetTimer({phase:timer.mode==='exam'?'reading':'focus',warned:[]}); notify('Logged '+minutes(mins)+(course(next.course)?' of '+course(next.course).short:'')+'.'); render(); }
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
  renderFloat();
  const el = fsEl();
  if (!el) return;
  el.hidden = !fullTimer;
  if (!fullTimer) { el.innerHTML=''; return; }
  const onBreak = isBreak(timer.phase), active = sessionActive(), secs = shownSecs();
  const c = course(timer.course), t = row('tasks',timer.taskId);
  const s = studyStats(), goal = studyGoal();
  const controls = timerControls('Start studying');
  el.dataset.phase = timer.phase;
  el.classList.toggle('running', timer.running);
  el.style.setProperty('--c', onBreak ? 'var(--sky)' : c?.colour ?? '#787774');
  el.innerHTML = '<div class="fs-top"><span class="fs-state">'+(timer.running?'<i></i>':'')+h(timerState())+'</span>'+
      '<button type="button" class="fs-exit" data-action="timer-full-exit" aria-label="Exit full screen" title="Exit (Esc)">'+icon('close')+'</button></div>'+
    '<div class="fs-centre">'+
      (onBreak?'<p class="fs-what">Stand up, look away from the screen, drink some water.</p>'
        :'<p class="fs-what"><span class="fs-subject">'+subjectIcon(c?.id)+h(c?.short??'General')+'</span>'+(t?'<span class="fs-task">'+h(t.title)+'</span>':'')+'</p>')+
      '<div id="fs-text" class="fs-clock" role="timer" aria-live="off">'+clock(secs)+'</div>'+
      (countsUp()?'<p class="fs-sub">'+(active&&timer.startedAt?'Started '+hhmm(timer.startedAt):'Counts up until you finish')+'</p>'
        :'<div class="fs-bar"><i id="fs-bar" style="width:'+(100*(1-secs/phaseSecs(timer.phase)))+'%"></i></div><p class="fs-sub">'+h(timerInfo())+'</p>')+
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
  const secs=timer.phase==='writing'?examCfg().reading*60+elapsedSecs():isBreak(timer.phase)?0:elapsedSecs();
  const mins=Math.max(1,Math.round(secs/60)), startMs=timer.startedAt??Date.now()-secs*1000;
  sessionForm({taskId:timer.taskId,course:timer.course,date:sydney.format(new Date(startMs)),start:new Date(startMs).toISOString(),minutes:mins,note:timer.mode==='exam'?'Exam conditions · '+examCfg().name+' (ended early)':''},
    'Finish session · '+clock(secs),'Save to log',
    {label:'Discard',title:'Discard this session?',body:'The timer resets and nothing is logged.',run:()=>{resetTimer({phase:timer.mode==='exam'?'reading':'focus',warned:[]});render();}});
  render();
}
const logPast = () => sessionForm({course:timer.course,date:today(),start:new Date(Date.now()-3600000).toISOString(),minutes:60},'Log a past session','Save to log');
const editSession = s => sessionForm(s,'Edit session','Save',{label:'Delete',title:'Delete this session?',body:'It is removed from your log and its minutes come off the task.',run:()=>change(()=>{
  const t=row('tasks',s.taskId); if (t) t.actual=Math.max(0,(Number(t.actual)||0)-s.minutes);
  data.focus=data.focus.filter(f=>f.id!==s.id);
})});

// Ring fill: elapsed share of a timed phase; the stopwatch sweeps once an hour.
const ringFrac = secs => countsUp() ? (secs%3600)/3600 : 1-secs/phaseSecs(timer.phase);
// ───────────────────────── Floating timer ─────────────────────────
// A small timer that stays in the corner on every page, so studying starts in one click.
// It hides on the Study page (the big timer is there) and in full screen.
const floatEl = (()=>{ const el=document.createElement('div'); el.id='float-timer'; el.className='float-timer'; el.setAttribute('role','region'); el.setAttribute('aria-label','Study timer'); el.hidden=true; document.body.append(el); return el; })();
const svgIcon = d => '<svg viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>';
const FI = {
  play:svgIcon('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),
  pause:svgIcon('<path d="M8 5.5h2.6v13H8zM13.4 5.5H16v13h-2.6z" fill="currentColor"/>'),
  stop:svgIcon('<rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor"/>'),
  skip:svgIcon('<path d="M6 6l8 6-8 6zM16 6h2v12h-2z" fill="currentColor"/>'),
  full:svgIcon('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>')
};
function renderFloat() {
  const show = data && data.settings.floatTimer!==false && route().name!=='focus' && !fullTimer;
  floatEl.hidden = !show;
  if (!show) { floatEl.innerHTML=''; return; }
  const active=sessionActive(), brk=isBreak(timer.phase), c=course(timer.course);
  const colour = brk ? 'var(--sky)' : c?.colour ?? '#787774';
  const mode = timer.mode==='exam' ? examCfg().name : timer.mode==='timed' ? pomo().focus+' min' : 'Open';
  const what = brk ? phaseName[timer.phase] : (c?.short ?? 'General');
  floatEl.style.setProperty('--c', colour);
  floatEl.classList.toggle('running', timer.running);
  floatEl.classList.toggle('active', active);
  const ib = (action,icon,label,primary) => '<button type="button" class="ft-btn'+(primary?' primary':'')+'" data-action="'+action+'" title="'+h(label)+'" aria-label="'+h(label)+'">'+icon+'</button>';
  floatEl.innerHTML =
    (active
      ? ib(timer.running?'timer-pause':'timer-start', timer.running?FI.pause:FI.play, timer.running?'Pause (s)':'Resume (s)', true)
      : ib('timer-start', FI.play, (brk?'Start break':'Start studying')+' (s)', true))+
    '<a class="ft-body" href="#focus" title="Open the Study page"><span class="ft-what"><i></i>'+h(what)+'</span>'+
      (active ? '<span id="float-time" class="ft-time">'+clock(shownSecs())+'</span>' : '<span class="ft-mode">'+h(mode)+'</span>')+'</a>'+
    (active ? (brk ? ib('timer-skip', FI.skip, 'Skip break') : ib('timer-finish', FI.stop, timer.mode==='exam'?'End exam':'Finish and log')) : '')+
    ib('timer-full', FI.full, 'Full screen (f)');
}
function updateTimerDom() {
  const secs=shownSecs();
  const ft=$('float-time'); if (ft) ft.textContent=clock(secs);
  const ring=$('timer-ring'); if (ring) ring.style.strokeDashoffset=String(2*Math.PI*92*(1-ringFrac(secs)));
  const text=$('timer-text'); if (text) text.textContent=clock(secs);
  const bar=$('timer-bar'); if (bar) bar.style.width=(countsUp()?0:100*(1-secs/phaseSecs(timer.phase)))+'%';
  const fsText=$('fs-text'); if (fsText) fsText.textContent=clock(secs);
  const fsBar=$('fs-bar'); if (fsBar) fsBar.style.width=(100*(1-secs/phaseSecs(timer.phase)))+'%';
  const mini=$('mini-timer');
  if (mini) {
    mini.hidden=!sessionActive() || route().name==='focus' || !floatEl.hidden;   // the floating timer already shows it
    const who=timer.mode==='exam'?phaseName[timer.phase]:timer.phase==='focus'?(course(timer.course)?.short??'Study'):phaseName[timer.phase];
    mini.textContent=(timer.running?'● ':'❚❚ ')+who+' '+clock(secs);
    mini.dataset.phase=timer.phase;
  }
  document.title=timer.running?clock(secs)+' · '+(timer.phase==='focus'?(course(timer.course)?.short??'Study'):phaseName[timer.phase])+' · Stacky':'Stacky';
}
setInterval(()=>{ if (!data) return; if (timer.running && !countsUp() && elapsedSecs()>=phaseSecs(timer.phase)) finishPhase(); else { examWarnings(); updateTimerDom(); } },1000);

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
// Shared by the Study page and the full-screen timer.
function timerState() {
  const brk=isBreak(timer.phase), active=sessionActive();
  if (timer.mode==='exam') return timer.running ? phaseName[timer.phase] : active ? 'Paused' : 'Ready';
  return timer.running ? (brk?'On a break':'Studying') : active ? 'Paused' : brk ? phaseName[timer.phase] : 'Ready';
}
function timerInfo() {
  const brk=isBreak(timer.phase), active=sessionActive();
  if (timer.mode==='exam') { const ex=examCfg();
    return timer.phase==='reading' ? (active?'Read only, no writing yet · '+hrs(ex.writing)+' writing follows':ex.name+' · '+ex.reading+' min reading, '+hrs(ex.writing)+' writing')
      : 'Writing · '+ex.name+(active&&timer.startedAt?' · started '+hhmm(timer.startedAt):''); }
  return brk ? 'Round '+((timer.cycle||0)%pomo().every||pomo().every)+' of '+pomo().every+' done'
    : timer.mode==='timed' ? 'Round '+((timer.cycle||0)%pomo().every+1)+' of '+pomo().every+' · '+pomo().focus+' min'
    : active ? 'Started '+hhmm(timer.startedAt) : 'Counts up until you finish';
}
function timerControls(startLabel) {
  const brk=isBreak(timer.phase), active=sessionActive(), exam=timer.mode==='exam';
  const finish=brk?button('Skip break','timer-skip','','text'):button(exam?'End exam':'Finish','timer-finish','','secondary');
  if (timer.running) return button('Pause','timer-pause','','primary')+finish;
  if (active) return button('Resume','timer-start','','primary')+finish;
  if (brk) return button('Start '+phaseName[timer.phase].toLowerCase(),'timer-start','','primary')+button('Skip break','timer-skip','','text');
  return button(exam?(timer.phase==='reading'?'Start reading time':'Start writing'):startLabel,'timer-start','','primary');
}
const focusLengths = [25,45,60,90];
function focusPage() {
  const s=studyStats(), secs=shownSecs(), active=sessionActive(), onBreak=isBreak(timer.phase);
  const open=sortTasks(data.tasks.filter(taskOpen));
  const goal=studyGoal(), pct=Math.min(100,s.today/goal*100);
  const c=course(timer.course);
  const subjects=[['','General','#787774'],...courses.map(x=>[x.id,x.short,x.colour])].map(([id,label,col])=>
    '<button type="button" class="subj" style="--c:'+col+'" aria-pressed="'+((timer.course||'')===id)+'" data-action="study-course" data-id="'+id+'">'+subjectIcon(id)+h(label)+'</button>').join('');
  const controls = timerControls('Start'), state = timerState(), info = timerInfo();
  const lengths = timer.mode==='timed' && !active && !onBreak
    ? '<span class="lengths" role="group" aria-label="Round length">'+[...new Set([...focusLengths,pomo().focus])].sort((a,b)=>a-b).map(m=>'<button type="button" aria-pressed="'+(pomo().focus===m)+'" data-action="focus-length" data-id="'+m+'">'+m+'</button>').join('')+'<button type="button" data-action="focus-custom" title="Pick any length">Custom</button><small>min</small></span>'
    : timer.mode==='exam' && !active
    ? '<span class="lengths exam-pick"><label><span class="sr">Exam paper</span><select data-exam-preset>'+examPresets.map(e=>'<option value="'+e.id+'" '+(examCfg().id===e.id?'selected':'')+'>'+h(e.name)+' · '+e.reading+'+'+hrs(e.writing)+'</option>').join('')+(examCfg().id==='custom'?'<option value="custom" selected>'+h(examCfg().name)+' · '+examCfg().reading+'+'+hrs(examCfg().writing)+'</option>':'')+'</select></label><button type="button" data-action="exam-custom">Custom</button></span>' : '';
  const R=92, C=2*Math.PI*R;
  const modeTabs='<div class="tt-modes" role="group" aria-label="Timer type">'+[['open','Stopwatch'],['timed','Pomo'],['exam','Exam']].map(([k,l])=>'<button type="button" aria-pressed="'+(timer.mode===k)+'" data-action="study-mode" data-id="'+k+'">'+l+'</button>').join('')+'</div>';
  const focusOn = onBreak
    ? '<p class="tt-break">Stand up, look away from the screen, drink some water.</p>'
    : '<div class="tt-focus-on">'+
        '<label class="tt-pick"><span class="sr">Subject</span>'+subjectIcon(timer.course)+'<select data-study-course>'+[['','General'],...courses.map(x=>[x.id,x.short])].map(([id,l])=>'<option value="'+id+'" '+((timer.course||'')===id?'selected':'')+'>'+h(l)+'</option>').join('')+'</select></label>'+
        '<label class="tt-pick task"><span class="sr">Task</span><select data-timer-task><option value="">No task, just the subject</option>'+open.map(x=>'<option value="'+h(x.id)+'" '+(x.id===timer.taskId?'selected':'')+'>'+h(x.title)+'</option>').join('')+'</select></label>'+
      '</div>';
  const overview = [[minutes(s.today),'Today'],[String(s.todayCount),'Sessions today'],[minutes(s.week),'This week'],[s.streak+(s.streak===1?' day':' days'),'Streak']];
  return '<div class="tt">'+
    '<section class="tt-main timer'+(timer.running?' running':'')+(onBreak?' break':'')+(active?' active':'')+'" style="--c:'+(onBreak?'var(--sky)':c?.colour??'#787774')+'">'+
      '<div class="tt-top"><h1 class="sr">Study</h1>'+modeTabs+'<div class="tt-top-tools">'+
        '<button type="button" class="icon-btn" data-action="settings" data-id="timer" title="Timer settings" aria-label="Timer settings">'+icon('sliders')+'</button>'+
        '<button type="button" class="icon-btn" data-action="timer-full" title="Full screen (f)" aria-label="Full screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button></div></div>'+
      focusOn+
      '<div class="tt-ring"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="tt-track" cx="100" cy="100" r="'+R+'"/><circle id="timer-ring" class="tt-prog" cx="100" cy="100" r="'+R+'" stroke-dasharray="'+C.toFixed(2)+'" stroke-dashoffset="'+(C*(1-ringFrac(secs))).toFixed(2)+'"/></svg>'+
        '<div class="tt-centre"><div id="timer-text" class="tt-clock" role="timer" aria-live="off">'+clock(secs)+'</div><span class="tt-state">'+(timer.running?'<i></i>':'')+h(state)+'</span></div></div>'+
      '<p class="tt-info">'+h(info)+'</p>'+
      (lengths?'<div class="tt-lengths">'+lengths+'</div>':'')+
      '<div class="tt-buttons">'+controls+'</div>'+
    '</section>'+
    '<aside class="tt-side">'+
      '<h2>Overview</h2><div class="tt-cards">'+overview.map(([v,l])=>'<div class="tt-card"><small>'+h(l)+'</small><b>'+h(v)+'</b></div>').join('')+'</div>'+
      '<div class="tt-goal"><div><span>Daily goal</span><b>'+minutes(s.today)+' / '+minutes(goal)+'</b></div><div class="goal-bar"><i style="width:'+pct+'%"></i></div></div>'+
      '<div class="tt-week"><h3>This week</h3><div class="bars">'+s.days.map(([d,m])=>'<div class="bar-col'+(d===today()?' today':'')+(m>=goal?' hit':'')+'"><i style="height:'+(m/s.dmax*100)+'%"></i><span>'+pretty(d,{weekday:'narrow'})+'</span><small>'+(m?minutes(m):'')+'</small></div>').join('')+'</div>'+
        (s.bySubject.length?'<div class="tt-subjects">'+s.bySubject.map(([x,m])=>'<div class="hbar"><span>'+h(x.short)+'</span><div><i style="width:'+(m/s.max*100)+'%;background:'+x.colour+'"></i></div><b>'+minutes(m)+'</b></div>').join('')+'</div>':'')+'</div>'+
      '<section class="study-log tt-log"><div class="log-head"><h2>Focus record</h2>'+button('+ Add','log-past','','text')+'</div>'+studyLog()+'</section>'+
    '</aside>'+
  '</div>';
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
  const rows=subjectBalance();
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
    '<div class="dash-board"><div class="dash-col">'+
      section('Today',todays.length?todays.length+' open'+(overdue.length?' · '+overdue.length+' overdue':''):'',
        (todays.length?todays.slice(0,6).map(t=>stackRow(t,true)).join('')+(todays.length>6?'<a class="subtle-link more-link" href="#today">'+(todays.length-6)+' more →</a>':''):emptyCard('Nothing due today',''))+quickAdd('Today',{date:t0},true),
        '<a class="subtle-link" href="#today">Open →</a>')+
    '</div><div class="dash-col">'+
      section('Reviews',due.length?String(due.length):'',
        due.length?reviewList(due.slice(0,6))+(due.length>6?'<a class="subtle-link more-link" href="#topics">'+(due.length-6)+' more →</a>':''):emptyCard('No reviews due','Press Review on a syllabus topic after you study it.'),
        '<a class="subtle-link" href="#topics">Syllabus →</a>')+
      section('Retests & feedback','',
        (retestsDue.length||newFeedback.length?'<div class="focus-list">'+
          retestsDue.slice(0,5).map(e=>'<div class="focus-row"><div><div class="line">'+subject(e.course)+badge(e.retest<t0?'Overdue':'Retest','gold')+'</div><strong>'+h(e.title)+'</strong><small>'+h(dueLabel({date:e.retest}))+'</small></div>'+button('Record','retest',e.id,'text')+'</div>').join('')+
          newFeedback.slice(0,3).map(f=>'<div class="focus-row"><div><div class="line">'+subject(f.course)+badge('Feedback')+'</div><strong>'+h(f.title)+'</strong><small>'+h(f.next||'No change planned yet')+'</small></div>'+button('Plan','plan-feedback',f.id,'text')+'</div>').join('')+'</div>'
          :emptyCard('Nothing waiting','Logged errors and new feedback show here.')),
        '<a class="subtle-link" href="#practice">Errors →</a>')+
    '</div></div>'+
    section('Subjects','',
      '<div class="table-scroll"><table class="balance"><thead><tr><th>Course</th><th title="Study in the last 7 days">This week</th><th title="Syllabus topics practised">Syllabus</th><th>Next task</th></tr></thead><tbody>'+
      rows.map(r=>'<tr'+(r.flag?' class="flag"':'')+'><th scope="row"><a href="#list/'+r.c.id+'">'+subject(r.c.id)+'</a>'+(r.flag?' '+badge('Needs time','alert'):'')+'</th>'+
        '<td>'+(r.week?minutes(r.week):'—')+'</td>'+
        '<td>'+r.covered+'<small> / '+r.topics+'</small></td>'+
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
      (trend!=null?'<small class="trend '+(trend>=0?'up':'down')+'">'+(trend>=0?'▲ ':'▼ ')+Math.abs(trend).toFixed(1)+' points, last 3 vs previous 3</small>':'')+'</section>';
  }).join('');
  return pageHead('','Past papers','',button('+ Log paper','edit-paper','','primary'))+
    (cards?'<div class="paper-grid">'+cards+'</div>':'')+
    section('','',
      tabGroup('Course','paper-filter',paperFilter,[['all','All'],...courses.map(c=>[c.id,c.short])])+
      (shown.length?'<div class="record-list">'+shown.map(p=>{
        const pct=paperPct(p), over=p.minutes&&p.limit&&Number(p.minutes)>Number(p.limit);
        return '<article class="record"><div class="record-head"><div><div class="line">'+subject(p.course)+badge(p.source&&p.source!=='Paper'?p.source:'',p.source==='HSC'?'gold':'neutral')+(over?badge('Over time','alert'):'')+'</div><h3>'+h(p.title)+'</h3><p>'+(p.date?h(pretty(p.date,{day:'numeric',month:'short',year:'numeric'})):'Undated')+' · '+(pct!=null?h(p.mark)+' / '+h(p.outOf)+' ('+percent(pct)+')':'Not marked yet')+(p.minutes?' · '+minutes(Number(p.minutes))+(p.limit?' of '+minutes(Number(p.limit)):''):'')+'</p></div>'+
          '<div class="line">'+button('Log error','paper-error',p.id)+button('Edit','edit-paper',p.id)+'</div></div>'+(p.notes?'<p class="record-detail">'+br(p.notes)+'</p>':'')+'</article>';
      }).join('')+'</div>':emptyCard('No papers logged'+(paperFilter==='all'?'':' for '+course(paperFilter).short),'Log each past paper you sit with its mark and time. Trends per course appear above once you have two.',button('+ Log paper','edit-paper'))));
}
function editPaper(record, prefill={}) {
  const v=record??{title:'',course:paperFilter!=='all'?paperFilter:courseDefault(),source:'HSC',date:today(),mark:'',outOf:'',minutes:'',limit:'',notes:'',...prefill};
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
let navClosed = (()=>{ try { return new Set(JSON.parse(localStorage.getItem('stacky:nav-closed'))||[]); } catch { return new Set(); } })();
function navHtml(r) {
  const count=fn=>data.tasks.filter(t=>taskOpen(t)&&fn(t)).length;
  const t0=today();
  const cur=(name,arg='')=>r.name===name&&r.arg===arg;
  const link=(href,label,glyph,current,n)=>'<a href="#'+href+'" title="'+h(label)+'" '+(current?'aria-current="page"':'')+'>'+glyph+'<span>'+h(label)+'</span>'+(n?'<b>'+n+'</b>':'')+'</a>';
  const sec=(title,body,extra='')=>{ const shut=navClosed.has(title); return '<div class="nav-sec'+(shut?' closed':'')+'"><div class="nav-title"><button type="button" class="nav-toggle" data-action="nav-toggle" data-id="'+h(title)+'" aria-expanded="'+!shut+'"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 3l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>'+title+'</span></button>'+extra+'</div><div class="nav-body">'+body+'</div></div>'; };
  const counts={today:count(t=>t.date&&t.date<=t0),next7:count(t=>t.date&&t.date<=addDays(t0,6)),inbox:count(t=>!t.course&&!t.list),all:count(()=>true)};
  const tags=allTags();
  const studied=data.focus.filter(f=>f.date===t0).reduce((n,f)=>n+f.minutes,0);
  const reviews=dueTopics().length;
  return link('dash','Overview',icon('home'),cur('dash'),reviews?reviews+' due':0)+link('focus','Study',icon('timer'),cur('focus'),studied?minutes(studied):0).replace('<a ','<a class="nav-study" ')+'<div class="nav-gap"></div>'+smart.map(([k,n,ic])=>link(k,n,icon(ic),cur(k),k==='done'?0:counts[k])).join('')+
    sec('Subjects',courses.map(c=>link('list/'+c.id,c.short,subjectIcon(c.id).replace('<svg ','<svg style="--c:'+c.colour+'" '),cur('list',c.id),count(t=>t.course===c.id))).join(''))+
    sec('Lists',data.lists.map(l=>link('list/'+encodeURIComponent(l.id),l.name,'<i class="dot" style="--c:'+(l.colour||'#8e978d')+'"></i>',cur('list',l.id),count(t=>t.list===l.id))).join('')||'<span class="nav-empty">No lists yet</span>','<button type="button" class="nav-add" data-action="edit-list" aria-label="New list">+</button>')+
    (tags.length?sec('Tags',tags.map(g=>link('tag/'+encodeURIComponent(g),g,icon('hash'),cur('tag',g),count(t=>(t.tags||[]).includes(g)))).join('')):'')+
    sec('Plan',[tools[0],views[0],tools[1],tools[2]].map(([k,n,ic])=>link(k,n,icon(ic),cur(k),0)).join(''))+
    sec('HSC',views.slice(1).map(([k,n,ic])=>link(k,n,icon(ic),cur(k),0)).join(''));
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
// One quiet settings row: label on the left, a small input (and unit) on the right.
const setRow = (key,label,value,unit,min,max,step=1) => '<label class="set-row"><span>'+h(label)+'</span><span class="set-input"><input name="'+key+'" type="number" value="'+h(value)+'" min="'+min+'" max="'+max+'" step="'+step+'" required>'+(unit?'<small>'+h(unit)+'</small>':'')+'</span></label>';
const setDate = (key,label,value) => '<label class="set-row"><span>'+h(label)+'</span><span class="set-input"><input name="'+key+'" type="date" value="'+h(value||'')+'"></span></label>';
// scope 'timer' (from the Study page) shows only the timer; otherwise the full, still short, settings.
// ───────────────────────── Settings page ─────────────────────────
const HIGHLIGHTS=[['yellow','Yellow','#f5d547'],['green','Green','#7dd38d'],['blue','Blue','#74b9f0'],['pink','Pink','#f490c0'],['orange','Orange','#f7ac63'],['purple','Purple','#b99af2']];
function applyHighlight() {
  const k=data?.settings?.highlight||'yellow';
  if (k==='yellow') delete document.documentElement.dataset.hl; else document.documentElement.dataset.hl=k;
  try { localStorage.setItem('stacky-hl',k); } catch {}
}
function setTheme(t) {
  const root=document.documentElement;
  if (t==='auto') delete root.dataset.theme; else root.dataset.theme=t;
  try { t==='auto' ? localStorage.removeItem('hsc-theme') : localStorage.setItem('hsc-theme',t); } catch {}
  const b=document.getElementById('theme-toggle'); if (b) (b.querySelector('span')||b).textContent='Theme: '+t;
  render();
}
const feedUrl = scheme => syncOn()&&syncCfg.owner ? (scheme==='webcal'?'webcal':'https')+'://gist.githubusercontent.com/'+syncCfg.owner+'/'+syncCfg.gistId+'/raw/'+FEED_FILE : '';
function settingsPage() {
  const p=pomo(), theme=document.documentElement.dataset.theme||'auto', hl=data.settings.highlight||'yellow', cal=calCfg();
  const snaps=localMode?Object.keys(snapshots()).sort().reverse():[];
  const group=(title,body,note='')=>'<section class="set-sec"><h2>'+h(title)+'</h2>'+(note?'<p class="set-note">'+note+'</p>':'')+'<div class="set-list">'+body+'</div></section>';
  const choice=(label,body)=>'<div class="set-row"><span>'+h(label)+'</span>'+body+'</div>';
  const feed=feedUrl('webcal');
  return '<div class="list-head"><div><h1>Settings</h1></div></div><div class="settings-page">'+
    group('Appearance',
      choice('Theme','<span class="seg" role="group" aria-label="Theme">'+[['auto','Auto'],['light','Light'],['dark','Dark']].map(([k,l])=>'<button type="button" aria-pressed="'+(theme===k)+'" data-action="set-theme" data-id="'+k+'">'+l+'</button>').join('')+'</span>')+
      choice('Highlighter','<span class="swatches" role="radiogroup" aria-label="Highlighter colour">'+HIGHLIGHTS.map(([k,l,c])=>'<button type="button" role="radio" aria-checked="'+(hl===k)+'" title="'+l+'" aria-label="'+l+'" data-action="set-hl" data-id="'+k+'" style="--sw:'+c+'"></button>').join('')+'</span>'))+
    group('Study timer',
      setRow('goal','Daily goal',studyGoal(),'min',15,720,15)+setRow('focus','Round length',p.focus,'min',5,240)+
      setRow('short','Short break',p.short,'min',1,60)+setRow('long','Long break',p.long,'min',1,90)+setRow('every','Long break every',p.every,'rounds',2,12)+
      '<label class="set-row"><span>Floating timer<small>A small timer in the corner of every page</small></span><input type="checkbox" class="switch" name="floatTimer" '+(data.settings.floatTimer!==false?'checked':'')+'></label>')+
    group('Exam dates',setDate('trialStart','Trials start',data.settings.trialStart)+setDate('hscStart','First HSC exam',data.settings.hscStart),'The Overview counts down to these.')+
    group('Calendar',
      '<label class="set-row"><span>Show study sessions<small>Logged sessions show on the week view, in Google Calendar when it is connected, and in the subscribed calendar feed</small></span><input type="checkbox" class="switch" name="calSessions" '+(data.settings.calSessions!==false?'checked':'')+'></label>'+
      '<div class="set-row"><span>Google Calendar and iCloud<small>'+h(extStatusText())+'</small></span>'+button('Manage','calendars','','text')+'</div>'+
      '<div class="set-row feed-row"><span>Show Stacky in Apple or Google Calendar<small>'+(feed?'Subscribe to this link. Tasks, assessments and study sessions update as Stacky syncs.':'Turn on sync first. Stacky then publishes a calendar link you can subscribe to.')+'</small></span>'+
        (feed?'<span class="set-actions"><a class="button text" href="'+h(feed)+'">Open in Calendar</a>'+button('Copy link','copy-feed','','text')+'</span>':button('Set up sync','sync-setup','','text'))+'</div>')+
    (localMode?group('Sync','<div class="set-row"><span>Across your devices<small>'+(syncOn()?'On'+(syncCfg.device?' · '+h(syncCfg.device):'')+(syncCfg.lastSync?' · last synced '+h(hhmm(Date.parse(syncCfg.lastSync))):''):'Off. Records stay in this browser.')+'</small></span>'+button(syncOn()?'Manage':'Set up','sync-setup','','text')+'</div>'):'')+
    group('Backup',
      '<div class="set-row"><span>Backup file'+(data.settings.lastExport?'<small>Last exported '+h(pretty(data.settings.lastExport,{day:'numeric',month:'short'}))+'</small>':'')+'</span><span class="set-actions">'+button('Export','export','','text')+'<label class="button text file-btn">Import<input type="file" id="import-file" accept="application/json,.json" hidden></label></span></div>'+
      (snaps.length?'<div class="set-row"><span>Daily snapshots<small>Your records as they were each morning</small></span><span class="set-actions">'+snaps.slice(0,4).map(d=>button(pretty(d,{weekday:'short',day:'numeric'}),'restore-snap',d,'text')).join('')+'</span></div>':''))+
  '</div>';
}
// Settings save as you change them.
function saveSettingField(el) {
  const v=el.type==='checkbox'?el.checked:el.value, n=el.name;
  const num=k=>{ const x=Number(v); return Number.isFinite(x)&&x>0?x:pomo()[k]; };
  change(()=>{
    if (n==='goal') data.settings.studyGoal=num('goal')||120;
    else if (['focus','short','long','every'].includes(n)) data.settings.pomo={...pomo(),[n]:num(n)};
    else if (n==='trialStart'||n==='hscStart') data.settings[n]=v;
    else if (n==='calSessions') data.settings.calSessions=!!v;
    else if (n==='floatTimer') data.settings.floatTimer=!!v;
  });
  if (el.type!=='checkbox') notify('Saved.');
}
function extStatusText() { const c=calCfg(); const bits=[]; if (gOn()) bits.push('Google connected'); if (c.ics.length) bits.push(c.ics.length+' iCal'); return bits.join(' · ')||'Not connected'; }
function settingsModal(scope) {
  const p=pomo(), timerOnly=scope==='timer';
  const timerRows='<div class="set-group">'+(timerOnly?'':'<h3>Study</h3>')+
    setRow('goal','Daily goal',studyGoal(),'min',15,720,15)+setRow('focus','Pomo length',p.focus,'min',5,120)+
    setRow('short','Short break',p.short,'min',1,60)+setRow('long','Long break',p.long,'min',1,90)+setRow('every','Long break every',p.every,'rounds',2,12)+'</div>';
  const snaps=localMode?Object.keys(snapshots()).sort().reverse():[];
  const rest=timerOnly?'':
    '<div class="set-group"><h3>Exam dates</h3>'+setDate('trialStart','Trials start',data.settings.trialStart)+setDate('hscStart','First HSC exam',data.settings.hscStart)+'</div>'+
    '<div class="set-group"><h3>Data</h3>'+
      (localMode?'<div class="set-row"><span>Sync'+'<small>'+(syncOn()?'On'+(syncCfg.lastSync?' · '+h(hhmm(Date.parse(syncCfg.lastSync))):''):'Off')+'</small></span>'+button(syncOn()?'Manage':'Set up','sync-setup','','text')+'</div>':'')+
      '<div class="set-row"><span>Backup'+(localMode&&data.settings.lastExport?'<small>Last '+h(pretty(data.settings.lastExport))+'</small>':'')+'</span><span class="set-actions">'+button('Export','export','','text')+'<label class="button text file-btn">Import<input type="file" id="import-file" accept="application/json,.json" hidden></label></span></div>'+
      (snaps.length?'<details class="set-more"><summary>Restore a daily snapshot</summary><div class="set-actions">'+snaps.map(d=>button(pretty(d,{weekday:'short',day:'numeric',month:'short'}),'restore-snap',d,'text')).join('')+'</div></details>':'')+
    '</div>';
  modal(timerOnly?'Timer':'Settings','<div class="set-list">'+timerRows+rest+'</div>','Save',v=>change(()=>{
    data.settings.pomo={focus:+v.focus,short:+v.short,long:+v.long,every:+v.every}; data.settings.studyGoal=+v.goal;
    if (!timerOnly) { data.settings.trialStart=v.trialStart; data.settings.hscStart=v.hscStart; }
  }));
  dialog.classList.add('set-dialog');
  dialog.addEventListener('close',()=>dialog.classList.remove('set-dialog'),{once:true});
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
    'nav-toggle':()=>{ navClosed.has(id)?navClosed.delete(id):navClosed.add(id); try { localStorage.setItem('stacky:nav-closed',JSON.stringify([...navClosed])); } catch {} render(); },
    'delete-list':()=>modal('Delete this list?','<p>Its tasks stay and move to the Inbox (or their subject).</p>','Delete list',()=>{change(()=>{data.lists=data.lists.filter(l=>l.id!==id);data.tasks.forEach(t=>{if(t.list===id)t.list='';});});location.hash='#inbox';}),
    'cal-shift':()=>{calAnchor=calMode==='month'?addMonth(calAnchor.slice(0,8)+'01',Number(id)):addDays(calAnchor,calDays()*Number(id));render();},
    'cal-today':()=>{calAnchor=today();calScroll=null;render();},
    'calendars':calendarsModal,
    'g-connect':gConnect,
    'g-forget':()=>{ const c=calCfg(); if (gToken && window.google?.accounts?.oauth2) google.accounts.oauth2.revoke(gToken.t,()=>{}); gToken=null; gClient=null; try { sessionStorage.removeItem(GTOKEN_KEY); } catch {} extCache.google=null; storeExt(); change(()=>{ c.google={clientId:'',show:{},pushTo:'primary',push:true,list:[]}; }); calendarsModal(); notify('Google Calendar disconnected. Blocks already sent stay in Google.'); },
    'ics-remove':()=>{ const c=calCfg(); change(()=>{ c.ics=c.ics.filter(x=>x.id!==id); }); if (extCache.ics) delete extCache.ics[id]; storeExt(); calendarsModal(); },
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
    'study-mode':()=>{ if (sessionActive()) { notify('Finish or discard this session to switch timer type.'); return; } if (id==='exam' && !timer.exam) timer.exam={...examFor(timer.course)}; if (id==='exam' && timer.exam) timer.course=timer.exam.course; resetTimer({mode:id,phase:id==='exam'?'reading':'focus',cycle:0,warned:[]}); render(); },
    'focus-custom':()=>{ if (sessionActive()) { notify('Finish this round to change its length.'); return; } modal('Round length',number('mins','Minutes per round',pomo().focus,{min:5,max:240,required:true}),'Set length',v=>{ const m=Math.round(Number(v.mins)); if (!(m>=5&&m<=240)) { formError('Pick between 5 and 240 minutes.'); return false; } change(()=>{ data.settings.pomo={...pomo(),focus:m}; }); }); },
    'exam-custom':()=>{ if (sessionActive()) { notify('Finish this exam to change it.'); return; } const ex=examCfg(); modal('Custom exam','<div class="form-grid">'+required('name','Paper',ex.id==='custom'?ex.name:'Practice paper')+number('reading','Reading time (min)',ex.reading,{min:0,max:30,required:true})+number('writing','Writing time (min)',ex.writing,{min:10,max:300,required:true})+'</div>','Use this exam',v=>{ timer.exam={id:'custom',name:v.name,course:timer.course||'',reading:Math.round(Number(v.reading)),writing:Math.round(Number(v.writing))}; resetTimer({phase:timer.exam.reading?'reading':'writing',warned:[]}); render(); }); },
    'study-course':()=>{ timer.course=id; if (timer.mode==='exam' && !sessionActive() && timer.exam?.id!=='custom') timer.exam={...examFor(id)}; const t=row('tasks',timer.taskId); if (t&&(t.course||'')!==id) timer.taskId=null; storeTimer(); render(); },
    'edit-session':()=>{ const s=row('focus',id); if (s) editSession(s); },
    'log-past':logPast,
    'log-more':()=>{logDays+=14;render();},
    'edit-habit':()=>editHabit(data.habits.find(x=>x.id===id)),
    'habit-open':()=>{habitOpen=habitOpen===id?null:id;render();},
    'habit-toggle':()=>change(()=>{ const log=(data.habitLog[id]??={}); const d=el.dataset.date; if(log[d]) delete log[d]; else log[d]=1; }),
    'habit-suggest':()=>{ const [name,c]=id.split('|'); change(()=>data.habits.push({id:uid(),name,course:c,days:Array(7).fill(true),created:today()})); },
    settings:()=>{ if (id==='timer') settingsModal('timer'); else location.hash='#settings'; },
    'set-theme':()=>setTheme(id),
    'set-hl':()=>change(()=>{ data.settings.highlight=id; applyHighlight(); }),
    'copy-feed':()=>{ navigator.clipboard?.writeText(feedUrl('https')).then(()=>notify('Link copied. Paste it into your calendar app.'),()=>notify(feedUrl('https'))); },
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
  if (el.id==='ics-file') { if (el.files[0]) icsImport(el.files[0]); return true; }
  if (el.closest('.settings-page') && el.name) { saveSettingField(el); return true; }
  if (el.matches('[data-exam-preset]')) { if (el.value!=='custom') { const ex=examPresets.find(e=>e.id===el.value); timer.exam={...ex}; timer.course=ex.course; resetTimer({phase:'reading',warned:[]}); render(); } return true; }
  if (el.matches('[data-study-course]')) { const id=el.value; timer.course=id; if (timer.mode==='exam' && !sessionActive() && timer.exam?.id!=='custom') timer.exam={...examFor(id)}; const t=row('tasks',timer.taskId); if (t&&(t.course||'')!==id) timer.taskId=null; storeTimer(); render(); return true; }
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
