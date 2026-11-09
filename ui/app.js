import { courses, templates } from './data.js';

const views = [
  ['week','Weekly plan','calendar'], ['assess','Assessments','flag'], ['topics','Syllabus & priorities','layers'],
  ['practice','Practice & repair','bolt'], ['feedback','Teacher feedback','message'], ['review','Weekly reviews','check']
];
const icons = {
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18m-13 5h2m4 0h2"/>',
  flag:'<path d="M5 21V4m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  message:'<path d="M21 11a8 8 0 0 1-8 8H4l2-4a8 8 0 1 1 15-4Z"/><path d="M9 10h7m-7 4h5"/>',
  check:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 3 3 5-6"/>'
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
const empty = () => ({version:1, weeks:{}, tasks:[], commitments:[], assessments:[], topics:{}, customTopics:[], errors:[], feedback:[]});
let data, revision, saving = false, dirty = false, conflict = false, saveTimer, toastTimer;
let week = monday(today()), courseId = 'mx1', assessmentFilter = 'All', practiceFilter = 'Open', priorityOnly = false;
function weekData() {
  const current = data.weeks[week] ?? {};
  const prior = Object.keys(data.weeks).filter(key=>key<week && data.weeks[key].capacity).sort().at(-1);
  const baseline = prior ? data.weeks[prior] : defaultWeek();
  return { ...defaultWeek(), capacity:baseline.capacity, reserve:baseline.reserve, ...current };
}
const course = id => courses.find(c => c.id === id);
const view = () => views.some(([key])=>location.hash === '#'+key) ? location.hash.slice(1) : 'week';
const courseOptions = () => courses.map(c => [c.id,c.name]);
const row = (key,id) => data[key].find(item=>item.id === id);
const change = fn => { fn(); dirty = true; render(); queueSave(); };
function notify(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{toast.hidden=true;},3400);
}
const LOCAL_KEY = 'hsc-study-desk:state:v1';
let localMode = false;
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
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      if (!dirty) status('Saved in this browser');
      saving = false;
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
indicator.addEventListener('click',()=>{ if (!conflict && dirty) save(); });
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
      data = result.data ?? empty();
      status('Private workspace');
    } else {
      // No backend (e.g. GitHub Pages): keep records in this browser only.
      localMode = true;
      let stored = null;
      try { stored = JSON.parse(localStorage.getItem(LOCAL_KEY)); } catch {}
      data = stored ?? empty();
      status('Saved in this browser');
    }
    render();
  } catch (error) {
    status('Storage unavailable','error');
    main.innerHTML = '<div class="card empty"><h2>Could not open your records</h2><p>'+h(error.message)+'</p><button class="button" data-action="reload">Try again</button></div>';
  }
}

const button = (label, action, id='', tone='secondary') => '<button type="button" class="button '+tone+'" data-action="'+action+'" data-id="'+h(id)+'">'+h(label)+'</button>';
const badge = (label, tone='neutral') => '<span class="badge '+tone+'">'+h(label)+'</span>';
const subject = id => id && course(id) ? '<span class="subject" style="--subject:'+course(id).colour+'"><i></i>'+h(course(id).short)+'</span>' : '<span class="subject general"><i></i>General</span>';
const emptyCard = (title, description, action='') => '<div class="empty"><strong>'+h(title)+'</strong><p>'+h(description)+'</p>'+action+'</div>';
const pageHead = (eyebrow,title,copy,action='') => '<div class="page-head"><div><div class="eyebrow">'+h(eyebrow)+'</div><h1>'+h(title)+'</h1><p>'+h(copy)+'</p></div><div class="head-action">'+action+'</div></div>';
const section = (title, sub, body, action='') => '<section class="card"><div class="card-head"><div><h2>'+h(title)+'</h2>'+(sub?'<p>'+h(sub)+'</p>':'')+'</div>'+action+'</div>'+body+'</section>';
const metric = (label,value,detail,tone='') => '<div class="metric '+tone+'"><span>'+h(label)+'</span><strong>'+h(value)+'</strong><small>'+h(detail)+'</small></div>';
const tabGroup = (label,action,selected,items) => '<div class="tabs" role="group" aria-label="'+h(label)+'">'+items.map(item=>{const [id,name]=Array.isArray(item)?item:[item,item];return '<button type="button" aria-pressed="'+(id===selected)+'" class="'+(id===selected?'selected':'')+'" data-action="'+action+'" data-id="'+h(id)+'">'+h(name)+'</button>';}).join('')+'</div>';
const weekLabel = () => pretty(week)+' – '+pretty(addDays(week,6),{day:'numeric',month:'short',year:'numeric'});
const weekPicker = () => '<div class="week-picker"><button type="button" aria-label="Previous week" data-action="shift-week" data-id="-7">‹</button><strong>'+h(weekLabel())+'</strong><button type="button" aria-label="Next week" data-action="shift-week" data-id="7">›</button>'+button('Current week','current-week','','text')+button('Jump to date','jump-week','','text')+'</div>';
const weekTasks = () => data.tasks.filter(t=>monday(t.date)===week);
const deadlines = () => data.assessments.filter(a=>a.date && !['Sat / submitted','Returned'].includes(a.status)).sort((a,b)=>a.date.localeCompare(b.date));
const retests = () => data.errors.filter(e=>e.stage!=='Passed' && e.retest && e.retest<=addDays(week,6)).sort((a,b)=>a.retest.localeCompare(b.retest));
const carry = () => data.tasks.filter(t=>t.date<week && !['Done','Dropped'].includes(t.status));
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
    : emptyCard('Start with the next school task','Add the due date and weighting from your school assessment notice. It will show here until you sit or submit it.',button('+ Add assessment','edit-assessment'));
}

function taskRow(t) {
  const label = t.status==='Done'?'Reopen '+t.title:'Mark '+t.title+' done';
  return '<div class="task-row'+(t.status==='Dropped'?' dropped':'')+'"><button type="button" class="tick '+(taskDone(t)?'checked':'')+'" aria-label="'+h(label)+'" aria-pressed="'+taskDone(t)+'" data-action="toggle-task" data-id="'+h(t.id)+'">'+(taskDone(t)?'✓':'')+'</button><button class="task-name" type="button" data-action="edit-task" data-id="'+h(t.id)+'"><strong>'+h(t.title)+'</strong><small>'+h(course(t.course)?.short ?? t.kind)+(t.course?' · '+h(t.kind):'')+'</small></button><span class="task-time">'+minutes(t.minutes)+'</span></div>';
}
function weekly() {
  const plan = capacity();
  const totals = plan.reduce((a,d)=>({available:a.available+d.available, remaining:a.remaining+d.remaining, completed:a.completed+d.completed}),{available:0,remaining:0,completed:0});
  const headroom = totals.available-totals.remaining-totals.completed;
  const moved = carry();
  return pageHead('01 / PLAN','Weekly plan','Make room for the school work that carries marks, then fit revision into the time you have.',button('+ Study block','edit-task','','primary'))+
    '<div class="toolbar">'+weekPicker()+'<div class="line">'+button('+ Commitment','edit-commitment')+button('Set capacity','edit-capacity')+'</div></div>'+
    '<div class="metrics">'+metric('Usable time',minutes(totals.available),weekData().energy+' energy · '+weekData().reserve+'% buffer')+
      metric('Work left',minutes(totals.remaining),weekTasks().filter(taskOpen).length+' open blocks')+
      metric('Completed',minutes(totals.completed),weekTasks().filter(taskDone).length+' finished blocks')+
      metric(headroom<0?'Over budget':'Unallocated',minutes(Math.abs(headroom)),plan.filter(d=>d.remaining+d.completed>d.available).length+' days over capacity',headroom<0?'alert':'accent')+'</div>'+
    '<div class="overview-grid">'+section('Protect school marks','Upcoming assessments and due retests',nextActions(),'<a class="subtle-link" href="#assess">Assessments →</a>')+
    section('Adjust the week','Energy changes the usable budget',tabGroup('Energy','energy',weekData().energy,['Low','Steady','High'])+
    '<p class="note">Low uses 65% of free time, Steady 85%, and High 100%. Your buffer is applied after commitments and the energy adjustment.</p>'+
    (moved.length?'<div class="carry"><strong>'+moved.length+' unfinished from earlier weeks</strong>'+button('Triage carry-over','show-carry','','text')+'</div>':'<div class="carry"><strong>Carry-over is clear</strong><span>Earlier unfinished blocks show here.</span></div>'))+'</div>'+
    section('Week at a glance','Day budgets use estimated minutes for open work and actual minutes where logged.', '<div class="day-grid">'+plan.map(({day,available,commitments,tasks,remaining,completed})=>{
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
  return pageHead('02 / SCHOOL MARKS','Assessments & Trials','Use your school notices for dates, task weightings and assessed content.',button('+ Assessment','edit-assessment','','primary'))+
    section('Assessment register','Upcoming work and returned marks',tabGroup('Assessment type','assessment-filter',assessmentFilter,['All','Assessment','Trial'])+
    (shown.length?'<div class="record-list">'+shown.map(a=>{
      const steps=a.kind==='Trial'?trialSteps:assessmentSteps;
      return '<article class="record"><div class="record-head"><div><div class="line">'+subject(a.course)+badge(a.kind,a.kind==='Trial'?'gold':'neutral')+badge(a.status,a.status==='Returned'?'green':'neutral')+'</div><h3>'+h(a.title)+'</h3><p>'+(a.date?h(pretty(a.date,{day:'numeric',month:'short',year:'numeric'})):'Date pending')+' · '+(a.weight!==''?h(a.weight)+'% weighting':'Weight pending')+' · '+(hasMark(a)?h(a.mark)+' / '+h(a.outOf)+' ('+percent(a.mark/a.outOf*100)+')':'Mark pending')+'</p></div><div class="line">'+button('Plan prep','prep-assessment',a.id)+button('Edit','edit-assessment',a.id)+'</div></div>'+
      (a.scope?'<p class="record-detail">'+br(a.scope)+'</p>':'')+'<div class="check-strip">'+steps.map((step,i)=>'<label><input type="checkbox" data-assess="'+h(a.id)+'" data-step="'+i+'" '+(a.checks?.[i]?'checked':'')+'> '+h(step)+'</label>').join('')+'</div></article>';
    }).join('')+'</div>':emptyCard('No '+(assessmentFilter==='Trial'?'Trials':'assessments')+' logged','Dates, marks and school weightings are ready for you to enter.',button('+ Add '+(assessmentFilter==='Trial'?'Trial':'assessment'),assessmentFilter==='Trial'?'new-trial':'edit-assessment'))))+
    section('Weighted marks by course','Each task contributes its score fraction × its school weighting. Marked average uses only tasks with both a score and weighting.', '<div class="table-scroll"><table><thead><tr><th>Course</th><th>Weight logged</th><th>Weight marked</th><th>Marked average</th><th>Points earned</th></tr></thead><tbody>'+marks+'</tbody></table></div>');
}
function topicsFor(c) {
  return c.modules.flatMap(([module,...topics],i)=>topics.map((title,j)=>({id:c.id+'-'+i+'-'+j,title,module,course:c.id})))
    .concat(data.customTopics.filter(t=>t.course===c.id));
}
function topicRecord(id) { return courses.flatMap(topicsFor).find(t=>t.id===id); }
function topicState(id) { return data.topics[id] ?? {stage:'Unstarted',priority:'Normal',evidence:''}; }
function topicsPage() {
  const c=course(courseId);
  const all=topicsFor(c);
  const flagged=courses.flatMap(topicsFor).filter(t=>topicState(t.id).priority!=='Normal')
    .sort((a,b)=>priorities.indexOf(topicState(b.id).priority)-priorities.indexOf(topicState(a.id).priority));
  const courseTabs=tabGroup('Course','course',courseId,courses.map(c=>[c.id,c.short]));
  return pageHead('03 / COVERAGE','Syllabus & priorities','Track evidence at topic level and turn the weakest areas into specific study blocks.',button('+ Custom topic','new-topic','','primary'))+
    section('Revision priorities','Urgent topics first, then high-priority topics across all courses.',flagged.length?'<div class="focus-list">'+flagged.map(t=>'<div class="focus-row"><div><div class="line">'+subject(t.course)+badge(topicState(t.id).priority,topicState(t.id).priority==='Urgent'?'alert':'gold')+'</div><strong>'+h(t.title)+'</strong><small>'+h(t.module)+'</small></div>'+button('Plan practice','plan-topic',t.id,'text')+'</div>').join('')+'</div>':emptyCard('Your priority list is clear','Open a topic and set its priority when marked work, feedback or a deadline gives you a reason.'))+
    section(c.name,'Year 12 · '+c.year+' syllabus · '+all.filter(t=>topicState(t.id).stage==='Retested').length+' of '+all.length+' topics retested',courseTabs+
    '<div class="topic-tools"><label><input type="checkbox" id="priority-only" '+(priorityOnly?'checked':'')+'> Priorities only</label><a class="subtle-link" href="'+h(c.url)+'" target="_blank" rel="noopener">Official NESA syllabus ↗</a></div>'+
    '<p class="note">Module titles follow NESA. The smaller checklist items are starter revision prompts. Add class-specific texts, dot points or skills as custom topics.</p>'+
    [...new Set(all.map(t=>t.module))].map(module=>{
      const subset=all.filter(t=>t.module===module);
      const shown=priorityOnly?subset.filter(t=>topicState(t.id).priority!=='Normal'):subset;
      if (!shown.length) return '';
      return '<details class="module" '+(priorityOnly||module===all[0]?.module?'open':'')+'><summary><strong>'+h(module)+'</strong><span>'+subset.filter(t=>topicState(t.id).stage==='Retested').length+'/'+subset.length+' retested</span></summary>'+shown.map(t=>{
        const rec=topicState(t.id);
        return '<div class="topic-row"><div><strong>'+h(t.title)+'</strong>'+(rec.evidence?'<small>'+h(rec.evidence)+'</small>':'')+'</div><div class="line">'+badge(rec.stage,rec.stage==='Retested'?'green':'neutral')+(rec.priority!=='Normal'?badge(rec.priority,rec.priority==='Urgent'?'alert':'gold'):'')+button('Update','edit-topic',t.id,'text')+'</div></div>';
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
  return pageHead('04 / PRACTICE','Practice & repair','Retrieve from memory, practise under time, then use fresh questions to check whether a repair worked.',button('+ Log error','edit-error','','primary'))+
    '<div class="template-grid">'+Object.entries(templates).map(([key,t])=>'<section class="card template"><span class="template-icon">'+icon(key==='Active retrieval'?'bolt':key==='Timed practice'?'calendar':'check')+'</span><h2>'+h(key)+'</h2><p>'+br(t.text)+'</p>'+button('Use template · '+t.minutes+'m','template',key)+'</section>').join('')+'</div>'+
    section('Error log','Capture the cause, then move from repair to a fresh retest with evidence.',tabGroup('Error status','practice-filter',practiceFilter,['Open','Passed','All'])+
    (items.length?'<div class="record-list">'+items.map(errorRow).join('')+'</div>':emptyCard('No '+practiceFilter.toLowerCase()+' errors here','When a question costs you marks, log the specific error and set a date to test the fix.')))+
    section('Practice history','Open a session to log actual time, score and what to change next.',sessions.length?'<div class="record-list">'+sessions.map(t=>'<article class="record compact"><div><div class="line">'+subject(t.course)+badge(t.status,t.status==='Done'?'green':'neutral')+'</div><h3>'+h(t.title)+'</h3><p>'+h(pretty(t.date))+' · '+h(t.kind)+(t.result?' · '+h(t.result):'')+'</p></div>'+button('Open session','edit-task',t.id)+'</article>').join('')+'</div>':emptyCard('No practice sessions yet','Use a template to create a block in the weekly plan.'));
}
function feedback() {
  return pageHead('05 / FEEDBACK','Teacher feedback','Capture what your teacher said, the criterion it affects, and a specific change to test.',button('+ Feedback note','edit-feedback','','primary'))+
    section('Feedback notes','Convert the feedback that could save marks into a scheduled action.',data.feedback.length?'<div class="record-list">'+dated(data.feedback).reverse().map(f=>'<article class="record"><div class="record-head"><div><div class="line">'+subject(f.course)+badge(f.status,f.status==='Applied'?'green':'neutral')+'</div><h3>'+h(f.title)+'</h3><p>'+h(pretty(f.date))+(f.context?' · '+h(f.context):'')+'</p></div><div class="line">'+button('Plan action','plan-feedback',f.id)+button('Edit','edit-feedback',f.id)+'</div></div><p class="record-detail">'+br(f.note)+'</p>'+(f.next?'<p class="record-detail"><strong>Next change</strong> '+br(f.next)+'</p>':'')+(f.evidence?'<p class="record-detail"><strong>Evidence</strong> '+br(f.evidence)+'</p>':'')+'</article>').join('')+'</div>':emptyCard('No feedback recorded yet','Use the next returned task or teacher conversation to log one change you can test.'));
}
function reviews() {
  const tasks=weekTasks();
  const done=tasks.filter(taskDone);
  const open=tasks.filter(taskOpen);
  const review=weekData().review;
  const history=Object.entries(data.weeks).filter(([key,w])=>key!==week&&w.review).sort(([a],[b])=>b.localeCompare(a));
  return pageHead('06 / REFLECT','Weekly reviews','Use evidence from the week to decide what to protect, repair and carry forward.',button(review?'Edit review':'+ Write review','edit-review','','primary'))+
    '<div class="toolbar">'+weekPicker()+'</div><div class="metrics">'+
    metric('Blocks finished',done.length,open.length+' still open')+
    metric('Time completed',minutes(done.reduce((n,t)=>n+(t.actual!==''?Number(t.actual):t.minutes),0)),'Actual time where logged')+
    metric('Retests passed',data.errors.flatMap(e=>e.attempts||[]).filter(a=>monday(a.date)===week&&a.outcome==='Passed').length,'Fresh attempts this week')+
    metric('Assessments due',data.assessments.filter(a=>a.date&&monday(a.date)===week).length,'School tasks and Trials')+'</div>'+
    section('This week’s review',weekLabel(),review?'<div class="review-notes">'+[['Marks protected',review.win],['What cost marks or time',review.gap],['Adjustment for next week',review.adjust]].map(([label,value])=>'<div><h3>'+h(label)+'</h3><p>'+br(value||'—')+'</p></div>').join('')+'</div>':emptyCard('Ready when you finish the week','Save what moved your marks, what slipped and one realistic change for next week.'))+
    (open.length?section('Unfinished blocks','Move a block or shrink the remaining work before carrying it forward.','<div class="record-list">'+open.map(t=>'<div class="record compact"><div><strong>'+h(t.title)+'</strong><p>'+h(pretty(t.date))+' · '+minutes(t.minutes)+'</p></div>'+button('Triage','carry-task',t.id)+'</div>').join('')+'</div>'):'')+
    section('Past reviews','Reopen a week to see its notes and completed work.',history.length?'<div class="record-list">'+history.map(([key,w])=>'<div class="record compact"><div><strong>'+h(pretty(key,{day:'numeric',month:'short',year:'numeric'}))+'</strong><p>'+h(w.review.adjust||w.review.win)+'</p></div>'+button('Open week','open-week',key)+'</div>').join('')+'</div>':emptyCard('No earlier reviews','Saved reviews build a history across the year.'));
}
function render() {
  const key=view();
  const label=views.find(([k])=>k===key)[1];
  $('section-label').textContent=label;
  nav.innerHTML=views.map(([id,name,symbol])=>'<a href="#'+id+'" '+(id===key?'aria-current="page"':'')+'>'+icon(symbol)+'<span>'+h(name)+'</span></a>').join('');
  const opened=[...main.querySelectorAll('details.module[open] summary strong')].map(x=>x.textContent);
  main.innerHTML={week:weekly,assess:assessments,topics:topicsPage,practice,feedback,review:reviews}[key]();
  if(key==='topics'&&opened.some(title=>[...main.querySelectorAll('details.module summary strong')].some(x=>x.textContent===title))) {
    main.querySelectorAll('details.module').forEach(d=>{d.open=priorityOnly||opened.includes(d.querySelector('summary strong').textContent);});
  }
}
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus();});
window.addEventListener('hashchange',()=>{ if(data) {render(); window.scrollTo(0,0);} });

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
const defaultTask = () => ({title:'',course:'',date:startDay(),minutes:30,actual:'',kind:'Assessment prep',status:'Planned',notes:'',result:'',link:null});
const taskKinds = ['Assessment prep','Active retrieval','Timed practice','Repair & retest','Teacher feedback','Homework','Other'];
let currentEditor;
function modal(title,body,submit,onSubmit,remove) {
  currentEditor={onSubmit,remove};
  dialog.innerHTML='<div class="dialog-head"><h2 id="editor-title">'+h(title)+'</h2><button type="button" data-action="close-dialog" aria-label="Close">×</button></div><form id="edit-form"><div class="dialog-content">'+body+'<p id="form-error" class="form-error" role="alert" hidden></p></div><div class="dialog-actions">'+(remove?button('Delete','delete-record','','danger'):'')+'<div></div>'+button('Cancel','close-dialog')+(submit?'<button class="button primary" type="submit">'+h(submit)+'</button>':'')+'</div></form>';
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
    required('title','Study block',v.title)+chooseCourse(v.course,true)+select('kind','Work type',v.kind,taskKinds)+dateField('date','Date',v.date,true)+
    select('status','Status',v.status,['Planned','In progress','Done','Dropped'])+number('minutes','Estimated minutes',v.minutes,{min:5,max:720,required:true})+
    number('actual','Actual minutes',v.actual,{max:720})+textArea('notes','Plan or instructions',v.notes)+textArea('result','Result, score or next change',v.result),
    triage?'Triage unfinished block':record?'Edit study block':'Plan a study block',x=>asNumbers(x,['minutes','actual']),v);
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
      data.topics[id]={stage:v.stage,priority:v.priority,evidence:v.evidence};
    }),custom?()=>change(()=>{data.customTopics=data.customTopics.filter(x=>x.id!==t.id);delete data.topics[t.id];}):null);
}
function editError(record) {
  const v=record??{title:'',course:courseDefault(),source:'',cause:'Concept',stage:'Logged',retest:addDays(today(),2),repair:'',attempts:[]};
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

document.addEventListener('click',event=>{
  const el=event.target.closest('[data-action]');
  if(!el) return;
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
    'edit-task':()=>editTask(row('tasks',id)),
    'task-day':()=>editTask(null,{date:id}),
    'carry-task':()=>{const t=row('tasks',id);editTask(t,{date:t.date<week?startDay():addDays(week,7)},true);},
    'show-carry':()=>modal('Triage carry-over','<div class="record-list">'+carry().map(t=>'<div class="record compact"><div><strong>'+h(t.title)+'</strong><p>'+h(pretty(t.date))+' · '+minutes(t.minutes)+'</p></div>'+button('Move or drop','carry-task',t.id)+'</div>').join('')+'</div>','',null),
    'toggle-task':()=>change(()=>{const t=row('tasks',id);t.status=t.status==='Done'?'Planned':'Done';}),
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
      modal('Delete this record?','<p>This removes the record from your study workspace.</p>','Delete',()=>remove());
    }
  };
  actions[action]?.();
});
document.addEventListener('change',event=>{
  const el=event.target;
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
