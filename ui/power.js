// Stacky's power tools: the command palette, undo, list views (board, grouping, sorting,
// filters), keyboard-driven lists with multi-select, the scheduler popover and quick-add
// autocomplete. app.js owns the records and the render loop and hands this module the few
// things it needs (`api`); everything here is extra, so the app still works if a piece is unused.

const VIEW_KEY = 'stacky:views', RECENT_KEY = 'stacky:recent';
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const slug = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = isMac ? '⌘' : 'Ctrl';
const svg = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const ICO = {
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>'),
  cal: svg('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
  more: svg('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'),
  view: svg('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  check: svg('<path d="m5 12 5 5 9-10"/>'),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  move: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>'),
  x: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  undo: svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>'),
  bolt: svg('<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  sofa: svg('<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/>'),
  next: svg('<path d="M5 6l6 6-6 6M13 6l6 6-6 6"/>'),
  none: svg('<circle cx="12" cy="12" r="8"/><path d="m6.5 6.5 11 11"/>')
};

export function initPower(api) {
  const { h, icon, courses } = api;
  const dow = iso => new Date(iso + 'T12:00:00Z').getUTCDay();
  const taskOf = id => api.data().tasks.find(t => t.id === id);
  const el = (tag, id, cls) => { const e = document.createElement(tag); e.id = id; e.className = cls || ''; e.hidden = true; document.body.append(e); return e; };

  // ───────────────────────── Undo and redo ─────────────────────────
  // Every edit goes through app.js's change(), which calls before() first. A step is the whole
  // record set as text: simple, and it undoes anything — a tick, a delete, a bulk move, an import.
  let undoStack = [], redoStack = [];
  const before = () => {
    const now = JSON.stringify(api.data());
    if (undoStack.at(-1) !== now) { undoStack.push(now); if (undoStack.length > 25) undoStack.shift(); }
    redoStack = [];
  };
  // Records that arrived from another device or tab are not this device's edits to take back.
  const reset = () => { undoStack = []; redoStack = []; };
  function undo() {
    const current = JSON.stringify(api.data());
    let last = undoStack.pop();
    while (last === current) last = undoStack.pop();
    if (!last) { api.notify('Nothing to undo.'); return; }
    redoStack.push(current);
    api.replace(JSON.parse(last));
    api.notify('Undone.', { label: 'Redo', run: redo });
  }
  function redo() {
    const next = redoStack.pop();
    if (!next) { api.notify('Nothing to redo.'); return; }
    undoStack.push(JSON.stringify(api.data()));
    api.replace(JSON.parse(next));
    api.notify('Redone.', { label: 'Undo', run: undo });
  }
  const undoable = message => api.notify(message, { label: 'Undo', run: undo });

  // ───────────────────────── List views ─────────────────────────
  // Each list remembers its own layout, grouping, sorting and filters in this browser.
  const DEFAULT_VIEW = { layout: 'list', group: 'date', sort: 'smart', pri: [], course: [] };
  const GROUPS = [['date', 'Date'], ['priority', 'Priority'], ['course', 'Subject'], ['status', 'Status'], ['none', 'None']];
  const SORTS = [['smart', 'Date'], ['priority', 'Priority'], ['title', 'Title'], ['minutes', 'Longest']];
  let views = read(VIEW_KEY, {});
  const viewKey = r => r.name + (r.arg ? '/' + r.arg : '');
  const view = r => ({ ...DEFAULT_VIEW, ...(views[viewKey(r)] || {}) });
  const changed = v => Object.keys(DEFAULT_VIEW).some(k => JSON.stringify(v[k]) !== JSON.stringify(DEFAULT_VIEW[k]));
  function setView(r, patch) {
    const next = { ...view(r), ...patch };
    if (changed(next)) views[viewKey(r)] = next; else delete views[viewKey(r)];
    write(VIEW_KEY, views);
  }
  const applyFilter = (tasks, v) => tasks.filter(t =>
    (!v.pri.length || v.pri.includes(Number(t.priority) || 0)) && (!v.course.length || v.course.includes(t.course || '')));
  function sorted(tasks, v) {
    const base = api.sortTasks(tasks);
    if (v.sort === 'priority') return base.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    if (v.sort === 'title') return base.sort((a, b) => a.title.localeCompare(b.title));
    if (v.sort === 'minutes') return base.sort((a, b) => (b.minutes || 0) - (a.minutes || 0));
    return base;
  }
  // Groups for a list. On a board, empty columns a task could be dropped into are kept.
  function groupsFor(tasks, v, spec, board) {
    const t0 = api.today(), out = [];
    const fits = patch => { try { return !!spec.open({ tags: [], subtasks: [], status: 'Planned', priority: 0, course: '', list: '', date: '', ...spec.defaults, ...patch }); } catch { return false; } };
    const add = (key, label, items, drop, defaults, extra = {}) => { if (items.length || (board && extra.keep)) out.push({ key, label, items: sorted(items, v), drop, defaults, ...extra }); };
    if (v.group === 'priority') {
      [...api.PRI].reverse().forEach(([k, l, colour]) => add('p' + k, k === '0' ? 'No priority' : l, tasks.filter(t => String(t.priority || 0) === k), ['priority', k], { priority: Number(k) }, { colour, keep: true }));
    } else if (v.group === 'course') {
      courses.forEach(c => add('c' + c.id, c.short, tasks.filter(t => t.course === c.id), ['course', c.id], { course: c.id }, { colour: c.colour, keep: fits({ course: c.id }) }));
      add('c', 'General', tasks.filter(t => !t.course || !api.course(t.course)), ['course', ''], { course: '' }, { keep: fits({ course: '' }) });
    } else if (v.group === 'status') {
      add('sPlanned', 'To do', tasks.filter(t => t.status !== 'In progress'), ['status', 'Planned'], { status: 'Planned' }, { keep: true });
      add('sDoing', 'In progress', tasks.filter(t => t.status === 'In progress'), ['status', 'In progress'], { status: 'In progress' }, { colour: 'var(--biro)', keep: true });
      if (board) {
        const done = api.data().tasks.filter(t => t.status === 'Done' && spec.done(t)).sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || '')).slice(0, 15);
        out.push({ key: 'sDone', label: 'Done', items: done, drop: ['status', 'Done'], defaults: null, colour: 'var(--faint)', done: true });
      }
    } else if (v.group === 'none') {
      add('all', 'Tasks', tasks, null, {}, { keep: true });
    } else {
      const day = n => api.addDays(t0, n);
      add('d0', 'Overdue', tasks.filter(t => t.date && t.date < t0), null, null, { tone: 'overdue' });
      for (let n = 0; n < 7; n++) {
        const d = day(n);
        add('d' + d, n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : api.pretty(d, { weekday: 'long', day: 'numeric', month: 'short' }), tasks.filter(t => t.date === d), ['date', d], { date: d },
          { keep: fits({ date: d }), sub: n < 2 ? api.pretty(d, { weekday: 'short', day: 'numeric' }) : '' });
      }
      add('d8', 'Later', tasks.filter(t => t.date > day(6)), null, null);
      add('d9', 'No date', tasks.filter(t => !t.date), ['date', ''], { date: '' }, { keep: fits({ date: '' }) });
    }
    return out;
  }
  const dropAttr = g => g.drop ? ' data-drop-' + g.drop[0] + '="' + h(g.drop[1]) + '"' : '';
  function card(t) {
    const c = api.course(t.course), done = t.status === 'Done', subs = t.subtasks || [];
    const overdue = t.date && t.date < api.today() && !done;
    const due = api.dueLabel(t);
    return '<div class="bcard' + (api.selected() === t.id ? ' selected' : '') + (done ? ' done' : '') + '" data-select="' + h(t.id) + '" draggable="true" data-drag="' + h(t.id) + '">' +
      '<button type="button" class="check' + (done ? ' on' : '') + '" style="--p:' + api.priColour(t.priority) + '" aria-label="' + h((done ? 'Reopen ' : 'Complete ') + t.title) + '" aria-pressed="' + done + '" data-action="toggle-task" data-id="' + h(t.id) + '">' + (done ? '✓' : '') + '</button>' +
      '<div class="bcard-body"><span class="bcard-title">' + h(t.title) + '</span><span class="bcard-meta">' +
        (c ? '<span class="dot-label" style="--c:' + c.colour + '">' + api.subjectIcon(c.id) + h(c.short) + '</span>' : '') +
        (due ? '<span class="bcard-due' + (overdue ? ' overdue' : '') + '">' + h(due) + '</span>' : '') +
        (t.minutes ? '<span>' + api.minutes(t.minutes) + '</span>' : '') +
        (subs.length ? '<span>' + subs.filter(x => x.done).length + '/' + subs.length + '</span>' : '') +
        (t.tags || []).slice(0, 2).map(g => '<span class="tag-chip">#' + h(g) + '</span>').join('') +
      '</span></div></div>';
  }
  // The body of a task list: grouped rows, or a board of columns.
  function body(r, spec, tasks, v) {
    const groups = groupsFor(tasks, v, spec, v.layout === 'board');
    if (v.layout === 'board') {
      return '<div class="board" data-cols="' + groups.length + '">' + groups.map(g =>
        '<section class="bcol' + (g.tone ? ' ' + g.tone : '') + '"' + dropAttr(g) + '><header class="bcol-head">' + (g.colour ? '<i style="--c:' + g.colour + '"></i>' : '') + '<strong>' + h(g.label) + '</strong>' + (g.sub ? '<small>' + h(g.sub) + '</small>' : '') + '<span>' + g.items.length + '</span></header>' +
        '<div class="bcol-body">' + g.items.map(card).join('') + '</div>' +
        (g.defaults ? '<form class="quick bquick" data-defaults="' + h(JSON.stringify({ ...spec.defaults, ...g.defaults })) + '"><input id="bq-' + h(g.key) + '" name="q" autocomplete="off" placeholder="+ Add task" aria-label="Add a task to ' + h(g.label) + '"><div class="quick-preview" aria-live="polite"></div></form>' : '') +
        '</section>').join('') + '</div>';
    }
    return groups.map(g => '<section class="group"' + dropAttr(g) + '><h2 class="group-title' + (g.tone ? ' ' + g.tone : '') + '">' + (g.colour ? '<i class="g-dot" style="--c:' + g.colour + '"></i>' : '') + h(g.label) + '<span>' + g.items.length + '</span>' +
      (g.tone === 'overdue' ? api.button('Move all to today', 'postpone-overdue', r.name + '|' + r.arg, 'text') : '') + '</h2>' + g.items.map(t => api.stackRow(t)).join('') + '</section>').join('');
  }
  const viewButton = (r, v) => '<button type="button" class="view-btn' + (changed(v) ? ' on' : '') + '" data-pact="view" aria-haspopup="dialog" title="Layout, grouping, sorting and filters">' + ICO.view + '<span>View</span></button>';
  // Chips under the heading say what is filtered out, each with its own way back.
  function filterBar(r, v, hidden) {
    const chips = [];
    v.pri.forEach(p => chips.push(['pri', p, api.PRI[p][1] + (p ? ' priority' : ' (no priority)'), api.PRI[p][2]]));
    v.course.forEach(c => chips.push(['course', c, api.course(c)?.short ?? 'General', api.course(c)?.colour ?? 'var(--faint)']));
    if (!chips.length) return '';
    return '<div class="filter-bar"><span class="filter-label">Showing only</span>' + chips.map(([k, val, label, colour]) =>
      '<button type="button" class="filter-chip" data-pact="unfilter" data-k="' + k + '" data-v="' + h(val) + '" style="--c:' + colour + '" title="Remove this filter"><i></i>' + h(label) + ICO.x + '</button>').join('') +
      (hidden ? '<span class="filter-note">' + hidden + ' hidden</span>' : '') + '<button type="button" class="filter-clear" data-pact="unfilter-all">Clear</button></div>';
  }
  // Today's ring: how much of the day's list is ticked off.
  function progress(done, open) {
    const total = done + open;
    if (!total) return '';
    const frac = done / total, R = 8, C = 2 * Math.PI * R;
    return '<span class="day-ring' + (frac === 1 ? ' full' : '') + '" title="' + done + ' of ' + total + ' done today"><svg viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="' + R + '"/><circle class="arc" cx="11" cy="11" r="' + R + '" stroke-dasharray="' + (frac * C).toFixed(2) + ' ' + C.toFixed(2) + '" transform="rotate(-90 11 11)"/></svg>' + done + '/' + total + ' done</span>';
  }
  function viewPopHtml() {
    const r = api.route(), v = view(r);
    const seg = (key, items, value) => '<div class="vp-seg" role="group">' + items.map(([k, l]) => '<button type="button" aria-pressed="' + (value === k) + '" data-vp="' + key + '" data-v="' + k + '">' + h(l) + '</button>').join('') + '</div>';
    const toggles = (key, items, on) => '<div class="vp-chips">' + items.map(([k, l, colour]) => '<button type="button" aria-pressed="' + on.includes(k) + '" data-vp="' + key + '" data-v="' + h(k) + '" style="--c:' + colour + '"><i></i>' + h(l) + '</button>').join('') + '</div>';
    return '<div class="vp">' +
      '<div class="vp-row"><span>Layout</span>' + seg('layout', [['list', 'List'], ['board', 'Board']], v.layout) + '</div>' +
      '<div class="vp-row col"><span>Group by</span>' + seg('group', GROUPS, v.group) + '</div>' +
      '<div class="vp-row col"><span>Sort by</span>' + seg('sort', SORTS, v.sort) + '</div>' +
      '<div class="vp-row col"><span>Priority</span>' + toggles('pri', [...api.PRI].reverse().map(([k, l, c]) => [Number(k), l, c]), v.pri) + '</div>' +
      '<div class="vp-row col"><span>Subject</span>' + toggles('course', [...courses.map(c => [c.id, c.short, c.colour]), ['', 'General', 'var(--faint)']], v.course) + '</div>' +
      (changed(v) ? '<button type="button" class="vp-reset" data-vp="reset">Reset this view</button>' : '') + '</div>';
  }
  function openViewPop() {
    const anchor = document.querySelector('[data-pact=view]');
    if (!anchor) return;
    openPop(anchor.getBoundingClientRect(), viewPopHtml(), {
      label: 'View options', align: 'right',
      click: b => {
        const k = b.dataset.vp; if (!k) return;
        const r = api.route(), v = view(r), raw = b.dataset.v;
        if (k === 'reset') { delete views[viewKey(r)]; write(VIEW_KEY, views); }
        else if (k === 'pri' || k === 'course') { const val = k === 'pri' ? Number(raw) : raw; setView(r, { [k]: v[k].includes(val) ? v[k].filter(x => x !== val) : [...v[k], val] }); }
        else setView(r, { [k]: raw });
        api.render();
        pop.querySelector('.pop-body').innerHTML = viewPopHtml();
        const again = document.querySelector('[data-pact=view]');
        if (again) placePop(again.getBoundingClientRect(), 'right');
      }
    });
  }

  // ───────────────────────── Popover ─────────────────────────
  const pop = el('div', 'pop', 'pop');
  let popOpts = null;
  function placePop(rect, align) {
    const w = pop.offsetWidth, ht = pop.offsetHeight, pad = 8;
    let left = align === 'right' ? rect.right - w : rect.left, top = rect.bottom + 6;
    if (top + ht > innerHeight - pad) top = Math.max(pad, rect.top - ht - 6);
    pop.style.left = Math.max(pad, Math.min(left, innerWidth - w - pad)) + 'px';
    pop.style.top = Math.max(pad, top) + 'px';
  }
  function openPop(rect, html, opts = {}) {
    closeAc();
    popOpts = opts;
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', opts.label || 'Options');
    pop.innerHTML = '<div class="pop-body">' + html + '</div>';
    pop.hidden = false;
    placePop(rect, opts.align);
    (pop.querySelector('[autofocus]') || pop.querySelector('button,input'))?.focus({ preventScroll: true });
  }
  const closePop = () => { if (!pop.hidden) { pop.hidden = true; pop.innerHTML = ''; popOpts = null; } };
  pop.addEventListener('click', event => { const b = event.target.closest('button'); if (b && popOpts?.click) popOpts.click(b, event); });
  pop.addEventListener('input', event => popOpts?.input?.(event.target));

  // ───────────────────────── Scheduler ─────────────────────────
  // One place to give tasks a date: type it, pick a shortcut or pick a day.
  let schIds = [], schMonth = '';
  const dayLabel = d => api.pretty(d, { weekday: 'short', day: 'numeric', month: 'short' });
  function schedHtml() {
    const t0 = api.today(), cur = schIds.length === 1 ? taskOf(schIds[0])?.date : '';
    const toSat = (6 - dow(t0) + 7) % 7, sat = api.addDays(t0, toSat || 7), nextMon = api.addDays(api.monday(t0), 7);
    const quick = [[t0, 'Today', ICO.sun], [api.addDays(t0, 1), 'Tomorrow', ICO.next], [sat, toSat ? 'This weekend' : 'Next weekend', ICO.sofa], [nextMon, 'Next week', ICO.cal], ['', 'No date', ICO.none]];
    const first = schMonth + '-01', lead = (dow(first) + 6) % 7, start = api.addDays(first, -lead);
    let cells = '';
    for (let i = 0; i < 42; i++) {
      const d = api.addDays(start, i);
      if (i >= 35 && d.slice(0, 7) !== schMonth) break;
      cells += '<button type="button" class="' + (d.slice(0, 7) !== schMonth ? 'out' : '') + (d === t0 ? ' today' : '') + (d === cur ? ' cur' : '') + (d < t0 ? ' past' : '') + '" data-day="' + d + '" title="' + h(dayLabel(d)) + '">' + Number(d.slice(8)) + '</button>';
    }
    return '<div class="sch"><input class="sch-in" autofocus autocomplete="off" placeholder="Type a date: fri 4pm, in 3 days, 14/11" aria-label="Type a date"><div class="sch-hint" aria-live="polite"></div>' +
      '<div class="sch-quick">' + quick.map(([d, l, ico]) => '<button type="button" data-day="' + d + '">' + ico + '<span>' + l + '</span><small>' + (d ? h(api.pretty(d, { weekday: 'short', day: 'numeric' })) : '') + '</small></button>').join('') + '</div>' +
      '<div class="sch-cal"><div class="sch-month"><strong>' + h(api.pretty(first, { month: 'long', year: 'numeric' })) + '</strong><button type="button" data-month="-1" aria-label="Previous month">‹</button><button type="button" data-month="1" aria-label="Next month">›</button></div>' +
      '<div class="sch-grid"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>' + cells + '</div></div></div>';
  }
  function applyDate(date, time) {
    const tasks = schIds.map(taskOf).filter(Boolean);
    if (!tasks.length) return;
    api.change(() => tasks.forEach(t => { t.date = date; if (time != null) t.time = time; if (!date) t.time = ''; }));
    closePop(); multi.clear(); paint();
    undoable((tasks.length === 1 ? '“' + tasks[0].title + '”' : tasks.length + ' tasks') + (date ? ' moved to ' + dayLabel(date) + (time ? ', ' + time : '') : ' now have no date') + '.');
  }
  const typedDate = text => { const p = api.parse(text); return p.date ? p : null; };
  function schedule(ids, rect) {
    schIds = ids.filter(taskOf);
    if (!schIds.length) return;
    schMonth = (schIds.length === 1 && taskOf(schIds[0]).date || api.today()).slice(0, 7);
    openPop(rect, schedHtml(), {
      label: 'Schedule',
      click: b => {
        if (b.dataset.day != null) return applyDate(b.dataset.day);
        if (b.dataset.month) {
          const d = new Date(schMonth + '-01T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() + Number(b.dataset.month));
          schMonth = d.toISOString().slice(0, 7);
          const typed = pop.querySelector('.sch-in').value;
          pop.querySelector('.pop-body').innerHTML = schedHtml();
          pop.querySelector('.sch-in').value = typed;
        }
      },
      input: field => {
        if (!field.classList.contains('sch-in')) return;
        const p = typedDate(field.value);
        pop.querySelector('.sch-hint').innerHTML = !field.value.trim() ? '' : p ? '<kbd>↩</kbd> ' + h(dayLabel(p.date) + (p.time ? ', ' + p.time : '')) : 'Not a date yet';
      },
      enter: field => { const p = typedDate(field.value); if (p) applyDate(p.date, p.time || undefined); }
    });
  }
  const rectAt = (x, y) => ({ left: x, right: x, top: y, bottom: y });
  const rowRect = id => document.querySelector('#main [data-select="' + CSS.escape(id) + '"]')?.getBoundingClientRect() ?? rectAt(innerWidth / 2 - 140, innerHeight / 3);

  // ───────────────────────── Keyboard lists and multi-select ─────────────────────────
  let cursor = null, multi = new Set(), lastPoint = [innerWidth / 2, innerHeight / 3];
  const rows = () => [...api.main.querySelectorAll('[data-select]')].filter(x => x.offsetParent !== null);
  const targets = () => multi.size ? [...multi] : cursor && taskOf(cursor) ? [cursor] : api.selected() ? [api.selected()] : [];
  const bulk = el('div', 'bulk', 'bulk');
  function paint() {
    api.main.querySelectorAll('.kcursor,.multi').forEach(x => x.classList.remove('kcursor', 'multi'));
    for (const id of multi) if (!taskOf(id)) multi.delete(id);
    api.main.querySelectorAll('[data-select]').forEach(x => {
      if (x.dataset.select === cursor) x.classList.add('kcursor');
      if (multi.has(x.dataset.select)) x.classList.add('multi');
    });
    bulk.hidden = !multi.size;
    document.body.classList.toggle('has-bulk', multi.size > 0);
    if (multi.size) bulk.innerHTML = '<strong>' + multi.size + ' selected</strong>' +
      '<button type="button" data-bulk="done" title="Complete (E)">' + ICO.check + '<span>Complete</span></button>' +
      '<button type="button" data-bulk="today" title="Move to today">' + ICO.sun + '<span>Today</span></button>' +
      '<button type="button" data-bulk="sched" title="Schedule (T)">' + ICO.cal + '<span>Schedule</span></button>' +
      '<span class="bulk-pri" role="group" aria-label="Priority">' + [...api.PRI].reverse().map(([k, l, c]) => '<button type="button" data-bulk="pri" data-v="' + k + '" title="' + l + ' priority" style="--c:' + c + '"><i></i></button>').join('') + '</span>' +
      '<button type="button" data-bulk="move" title="Move to a subject or list">' + ICO.move + '<span>Move</span></button>' +
      '<button type="button" data-bulk="delete" class="danger" title="Delete (⌫)">' + ICO.trash + '</button>' +
      '<button type="button" data-bulk="clear" title="Clear selection (Esc)">' + ICO.x + '</button>';
  }
  function afterRender() {
    api.main.querySelectorAll('.srow[data-select],.bcard[data-select]').forEach(x => {
      if (!x.querySelector('.row-acts')) x.insertAdjacentHTML('beforeend', '<span class="row-acts"><button type="button" data-pact="sched" title="Schedule (T)" aria-label="Schedule">' + ICO.cal + '</button><button type="button" data-pact="more" title="More actions" aria-label="More actions">' + ICO.more + '</button></span>');
    });
    paint();
  }
  function moveCursor(step) {
    const list = rows();
    if (!list.length) return false;
    let at = list.findIndex(x => x.dataset.select === cursor);
    if (at < 0) at = list.findIndex(x => x.dataset.select === api.selected());
    const next = list[at < 0 ? (step > 0 ? 0 : list.length - 1) : Math.max(0, Math.min(list.length - 1, at + step))];
    cursor = next.dataset.select;
    paint();
    next.scrollIntoView({ block: 'nearest' });
    if (api.selected() && api.selected() !== cursor) api.selectTask(cursor);   // the open panel follows the cursor
    return true;
  }
  const names = ids => ids.length === 1 ? '“' + (taskOf(ids[0])?.title ?? 'Task') + '”' : ids.length + ' tasks';
  function complete(ids) {
    const tasks = ids.map(taskOf).filter(Boolean);
    if (!tasks.length) return;
    const finishing = tasks.some(t => t.status !== 'Done'), label = names(ids);
    api.change(() => tasks.forEach(t => { if (finishing ? t.status !== 'Done' : true) api.setDone(t, finishing); }));
    multi.clear(); paint();
    undoable(label + (finishing ? ' completed.' : ' reopened.'));
  }
  function remove(ids) {
    const gone = new Set(ids.filter(taskOf));
    if (!gone.size) return;
    const label = names([...gone]);
    // Step the cursor to a neighbour so the keyboard can keep going down the list.
    const list = rows().map(x => x.dataset.select), at = list.findIndex(id => gone.has(id));
    const neighbour = list.slice(at).find(id => !gone.has(id)) ?? list.slice(0, Math.max(0, at)).reverse().find(id => !gone.has(id)) ?? null;
    if (gone.has(cursor)) cursor = neighbour;
    multi.clear();
    api.removeTasks(gone);
    undoable(label + ' deleted.');
  }
  function setPriority(ids, p) {
    const tasks = ids.map(taskOf).filter(Boolean);
    if (!tasks.length) return;
    api.change(() => tasks.forEach(t => { t.priority = p; }));
    api.notify(names(ids) + ': ' + (p ? api.PRI[p][1].toLowerCase() + ' priority.' : 'priority cleared.'), { label: 'Undo', run: undo });
  }
  function movePop(ids, rect) {
    const lists = api.data().lists;
    openPop(rect, '<div class="mv"><div class="mv-title">Move to</div>' +
      '<button type="button" data-mv="inbox">' + icon('inbox') + '<span>Inbox</span></button>' +
      courses.map(c => '<button type="button" data-mv="c:' + c.id + '">' + api.subjectIcon(c.id).replace('<svg ', '<svg style="--c:' + c.colour + '" ') + '<span>' + h(c.short) + '</span></button>').join('') +
      (lists.length ? '<div class="mv-sep"></div>' + lists.map(l => '<button type="button" data-mv="l:' + h(l.id) + '"><i class="dot" style="--c:' + (l.colour || '#8e978d') + '"></i><span>' + h(l.name) + '</span></button>').join('') : '') + '</div>', {
      label: 'Move to', click: b => {
        const to = b.dataset.mv; if (!to) return;
        const tasks = ids.map(taskOf).filter(Boolean);
        api.change(() => tasks.forEach(t => { if (to === 'inbox') { t.course = ''; t.list = ''; } else if (to.startsWith('c:')) t.course = to.slice(2); else t.list = to.slice(2); }));
        closePop(); multi.clear(); paint();
        undoable(names(ids) + ' moved to ' + (b.querySelector('span')?.textContent || 'the list') + '.');
      }
    });
  }
  bulk.addEventListener('click', event => {
    const b = event.target.closest('[data-bulk]'); if (!b) return;
    const ids = [...multi], what = b.dataset.bulk;
    if (what === 'done') complete(ids);
    else if (what === 'today') { schIds = ids; applyDate(api.today()); }
    else if (what === 'sched') schedule(ids, b.getBoundingClientRect());
    else if (what === 'pri') setPriority(ids, Number(b.dataset.v));
    else if (what === 'move') movePop(ids, b.getBoundingClientRect());
    else if (what === 'delete') remove(ids);
    else { multi.clear(); paint(); }
  });
  // Row buttons, and ⌘-click / Shift-click to select several tasks.
  document.addEventListener('click', event => {
    if (!api.data()) return;
    const act = event.target.closest?.('[data-pact]');
    if (act) {
      event.preventDefault(); event.stopPropagation();
      const what = act.dataset.pact, rowEl = act.closest('[data-select]'), rect = act.getBoundingClientRect();
      if (what === 'view') pop.hidden || popOpts?.label !== 'View options' ? openViewPop() : closePop();
      else if (what === 'sched' && rowEl) schedule([rowEl.dataset.select], rect);
      else if (what === 'more' && rowEl) rowEl.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: rect.left, clientY: rect.bottom + 4 }));
      else if (what === 'unfilter') { const r = api.route(), v = view(r), k = act.dataset.k, val = k === 'pri' ? Number(act.dataset.v) : act.dataset.v; setView(r, { [k]: v[k].filter(x => x !== val) }); api.render(); }
      else if (what === 'unfilter-all') { setView(api.route(), { pri: [], course: [] }); api.render(); }
      return;
    }
    const rowEl = event.target.closest?.('#main [data-select]');
    if (rowEl && (event.metaKey || event.ctrlKey || event.shiftKey) && !event.target.closest('a,input,select,textarea,label,button')) {
      event.preventDefault(); event.stopPropagation();
      const id = rowEl.dataset.select;
      if (event.shiftKey && cursor) {
        const list = rows().map(x => x.dataset.select), a = list.indexOf(cursor), b = list.indexOf(id);
        if (a >= 0 && b >= 0) list.slice(Math.min(a, b), Math.max(a, b) + 1).forEach(x => multi.add(x));
      } else multi.has(id) ? multi.delete(id) : multi.add(id);
      cursor = id;
      getSelection()?.removeAllRanges();
      paint();
    }
  }, true);
  document.addEventListener('pointerdown', event => {
    lastPoint = [event.clientX, event.clientY];
    if (!pop.hidden && !event.target.closest?.('#pop,#ac,[data-pact=view]')) closePop();
    if (!ac.hidden && !event.target.closest?.('#ac')) closeAc();
  }, true);
  document.addEventListener('contextmenu', event => { lastPoint = [event.clientX, event.clientY]; }, true);

  // ───────────────────────── Quick-add autocomplete ─────────────────────────
  // Typing #, ^ or ! in any quick-add box offers subjects and tags, lists, and priorities.
  const ac = el('div', 'ac', 'ac');
  let acState = null;
  const acField = x => x?.matches?.('.quick input[name=q], .pal-input, dialog input[name=q]');
  function acItems(mark, word) {
    const s = slug(word), d = api.data();
    if (mark === '!') return [['!high', 'High priority', api.PRI[3][2]], ['!med', 'Medium priority', api.PRI[2][2]], ['!low', 'Low priority', api.PRI[1][2]]]
      .filter(([k, l]) => !s || k.slice(1).startsWith(s) || slug(l).startsWith(s)).map(([insert, label, colour]) => ({ insert, label, colour, kind: 'Priority' }));
    if (mark === '^') return d.lists.filter(l => !s || slug(l.name).includes(s)).map(l => ({ insert: '^' + l.name.replace(/[^\p{L}\p{N}_-]+/gu, ''), label: l.name, colour: l.colour || '#8e978d', kind: 'List' }));
    const subjects = courses.filter(c => !s || [c.id, c.code, c.short, c.name].some(x => slug(x).includes(s))).map(c => ({ insert: '#' + c.id, label: c.name, colour: c.colour, kind: 'Subject' }));
    const tags = [...new Set(d.tasks.flatMap(t => t.tags || []))].sort().filter(g => !s || g.includes(s)).map(g => ({ insert: '#' + g, label: '#' + g, colour: 'var(--faint)', kind: 'Tag' }));
    return [...subjects, ...tags];
  }
  function closeAc() { if (!ac.hidden) { ac.hidden = true; ac.innerHTML = ''; } acState = null; }
  function paintAc() {
    ac.innerHTML = acState.items.map((it, i) => '<button type="button" role="option" aria-selected="' + (i === acState.at) + '" data-ac="' + i + '"><i style="--c:' + it.colour + '"></i><span>' + h(it.label) + '</span><small>' + it.kind + '</small></button>').join('');
  }
  function updateAc(field) {
    if (!acField(field) || palMode === 'find' && field.classList.contains('pal-input')) return closeAc();
    const caret = field.selectionStart ?? field.value.length, m = field.value.slice(0, caret).match(/(^|\s)([#^!])([\p{L}\p{N}_-]*)$/u);
    if (!m) return closeAc();
    const items = acItems(m[2], m[3]).slice(0, 7), typed = m[2] + m[3];
    if (!items.length || items.length === 1 && items[0].insert.toLowerCase() === typed.toLowerCase()) return closeAc();
    acState = { field, items, at: 0, from: caret - typed.length, to: caret };
    paintAc();
    ac.hidden = false;
    const r = field.getBoundingClientRect();
    ac.style.left = Math.max(8, Math.min(r.left, innerWidth - ac.offsetWidth - 8)) + 'px';
    ac.style.top = (r.bottom + 4 + ac.offsetHeight > innerHeight - 8 ? r.top - ac.offsetHeight - 4 : r.bottom + 4) + 'px';
  }
  function acceptAc(i = acState.at) {
    const { field, items, from, to } = acState, text = items[i].insert + ' ';
    field.value = field.value.slice(0, from) + text + field.value.slice(to).replace(/^\s+/, '');
    const caret = from + text.length;
    closeAc();
    field.focus();
    try { field.setSelectionRange(caret, caret); } catch {}
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
  ac.addEventListener('pointerdown', event => { event.preventDefault(); const b = event.target.closest('[data-ac]'); if (b && acState) acceptAc(Number(b.dataset.ac)); });
  document.addEventListener('input', event => updateAc(event.target), true);
  document.addEventListener('focusout', event => { if (acState && event.target === acState.field) setTimeout(() => { if (acState && document.activeElement !== acState.field) closeAc(); }, 80); }, true);

  // ───────────────────────── Command palette ─────────────────────────
  const pal = el('div', 'palette', 'pal');
  let palMode = 'find', palItems = [], palAt = 0, palIndex = null, palFrom = null;
  const palOpen = () => !pal.hidden;
  // Fuzzy match: every typed word must be found, as a run of letters or scattered in order.
  function fuzzy(query, text) {
    const t = text.toLowerCase();
    let total = 0; const marks = new Set();
    for (const word of query.toLowerCase().split(/\s+/).filter(Boolean)) {
      const at = t.indexOf(word);
      if (at >= 0) {
        total += 60 + (at === 0 ? 30 : /[\s#·\-_/(]/.test(t[at - 1]) ? 20 : 0) - Math.min(at, 20) * .5 + word.length * 2;
        for (let i = 0; i < word.length; i++) marks.add(at + i);
        continue;
      }
      // Scattered letters count only when they start at a word and do not wander far.
      const starts = [...t.matchAll(/(?:^|[\s#·\-_/(])(\S)/g)].map(m => m.index + m[0].length - 1).filter(i => t[i] === word[0]);
      let best = null;
      for (const start of starts) {
        let from = start, score = 20, last = start - 1; const found = [];
        for (const ch of word) {
          const i = t.indexOf(ch, from);
          if (i < 0) { score = -99; break; }
          score += i === last + 1 ? 3 : /[\s#·\-_/(]/.test(t[i - 1] || ' ') ? 2 : -3;
          found.push(i); last = i; from = i + 1;
        }
        if (score >= 20 + word.length && (!best || score > best.score)) best = { score, found };
      }
      if (!best) return null;
      best.found.forEach(i => marks.add(i));
      const score = best.score;
      total += score;
    }
    return { score: total - t.length * .05, marks };
  }
  const marked = (text, marks) => { let out = ''; for (let i = 0; i < text.length; i++) out += marks?.has(i) ? '<mark>' + h(text[i]) + '</mark>' : h(text[i]); return out.replace(/<\/mark><mark>/g, ''); };
  const go = hash => () => { location.hash = '#' + hash; };
  function openTask(id) {
    write(RECENT_KEY, [id, ...read(RECENT_KEY, []).filter(x => x !== id)].slice(0, 6));
    const t = taskOf(id), spec = api.listSpec(api.route());
    // Show it in a list that contains it, so closing the panel leaves you somewhere sensible.
    if (!spec || !(t.status === 'Done' ? spec.done(t) : spec.open(t)) || !document.querySelector('#main [data-select="' + CSS.escape(id) + '"]')) location.hash = t.status === 'Done' || t.status === 'Dropped' ? '#done' : '#all';
    setTimeout(() => { api.selectTask(id); cursor = id; paint(); document.querySelector('#main [data-select="' + CSS.escape(id) + '"]')?.scrollIntoView({ block: 'center' }); }, 0);
  }
  function buildIndex() {
    const d = api.data(), t0 = api.today(), items = [];
    const taskIco = t => '<span class="pal-check' + (t.status === 'Done' ? ' on' : '') + '" style="--p:' + api.priColour(t.priority) + '">' + (t.status === 'Done' ? '✓' : '') + '</span>';
    d.tasks.forEach(t => items.push({ group: 'Tasks', id: t.id, title: t.title, more: (t.tags || []).map(g => '#' + g).join(' ') + ' ' + (t.notes || ''), done: t.status !== 'Planned' && t.status !== 'In progress',
      sub: [api.course(t.course)?.short, api.customList(t.list)?.name, api.dueLabel(t), t.status === 'Done' ? 'Done' : t.status === 'Dropped' ? "Won't do" : ''].filter(Boolean).join(' · '), ico: taskIco(t), run: () => openTask(t.id), hint: 'Open' }));
    api.pages.forEach(([k, n, ic]) => items.push({ group: 'Go to', title: n, ico: icon(ic), run: go(k), hint: 'Page' }));
    courses.forEach(c => items.push({ group: 'Go to', title: c.name, more: c.short + ' ' + c.id, ico: api.subjectIcon(c.id).replace('<svg ', '<svg style="--c:' + c.colour + '" '), run: go('list/' + c.id), hint: 'Subject' }));
    d.lists.forEach(l => items.push({ group: 'Go to', title: l.name, ico: '<i class="dot" style="--c:' + (l.colour || '#8e978d') + '"></i>', run: go('list/' + encodeURIComponent(l.id)), hint: 'List' }));
    [...new Set(d.tasks.flatMap(t => t.tags || []))].sort().forEach(g => items.push({ group: 'Go to', title: '#' + g, ico: icon('hash'), run: go('tag/' + encodeURIComponent(g)), hint: 'Tag' }));
    d.assessments.forEach(a => items.push({ group: 'Assessments', title: a.title, sub: [api.course(a.course)?.short, a.date ? api.pretty(a.date, { weekday: 'short', day: 'numeric', month: 'short' }) : '', a.date && a.date >= t0 ? 'in ' + api.daysFrom(a.date, t0) + 'd' : ''].filter(Boolean).join(' · '), ico: icon('flag'), run: go('assess'), hint: 'Assessment' }));
    api.topics().forEach(t => items.push({ group: 'Syllabus', title: t.title, sub: (api.course(t.course)?.short ?? '') + ' · ' + t.module, ico: icon('layers'), run: () => api.openTopics(t.course), hint: 'Topic' }));
    const cmd = (title, ico, run, keys = '', more = '') => items.push({ group: 'Commands', title, ico, run, keys, more, cmd: true });
    const r = api.route(), onList = !!api.listSpec(r);
    cmd('New task', ICO.plus, () => palette('add'), MOD + ' N', 'add create todo');
    cmd(api.timerRunning() ? 'Pause the timer' : 'Start the timer', icon('timer'), api.toggleTimer, MOD + ' ↩', 'study pomodoro stopwatch');
    cmd('Full-screen timer', icon('timer'), api.fullTimer, 'F', 'focus mode');
    cmd('Log a study session you already did', icon('clock'), () => api.runAction('log-past'), '', 'past manual');
    cmd('Undo', ICO.undo, undo, MOD + ' Z', 'revert');
    cmd('Redo', ICO.undo, redo, MOD + ' ⇧ Z');
    if (onList) {
      const v = view(r);
      cmd(v.layout === 'board' ? 'Show this list as rows' : 'Show this list as a board', icon(v.layout === 'board' ? 'list' : 'matrix'), () => { setView(r, { layout: v.layout === 'board' ? 'list' : 'board' }); api.render(); }, '', 'kanban layout view columns');
      GROUPS.filter(([k]) => k !== v.group).forEach(([k, l]) => cmd('Group this list by ' + l.toLowerCase(), ICO.view, () => { setView(r, { group: k }); api.render(); }, '', 'view'));
    }
    if (d.tasks.some(t => api.taskOpen(t) && t.date && t.date < t0)) cmd('Move every overdue task to today', ICO.sun, () => { api.change(() => d.tasks.forEach(t => { if (api.taskOpen(t) && t.date && t.date < t0) t.date = t0; })); undoable('Overdue tasks moved to today.'); }, '', 'postpone reschedule');
    cmd('New list', icon('folder'), () => api.runAction('edit-list'), '', 'project');
    cmd('New assessment', icon('flag'), () => { location.hash = '#assess'; api.runAction('edit-assessment'); }, '', 'exam task due');
    cmd('New habit', icon('repeat'), () => { location.hash = '#habits'; api.runAction('edit-habit'); });
    [['light', 'Light'], ['dark', 'Dark'], ['auto', 'Match the system']].forEach(([k, l]) => cmd('Theme: ' + l, ICO.sun, () => api.runAction('set-theme', k), '', 'appearance mode colour'));
    cmd('Export a backup file', icon('paper'), () => api.runAction('export'), '', 'download save json');
    cmd('Sync across devices', icon('repeat'), () => api.runAction('sync-setup'), '', 'github gist');
    cmd('Connect Google Calendar or iCloud', icon('calendar'), () => api.runAction('calendars'), '', 'ics');
    cmd('Keyboard shortcuts', icon('grid'), api.shortcuts, MOD + ' /', 'help keys');
    return items;
  }
  function palResults(q) {
    const d = api.data(), t0 = api.today();
    if (palMode === 'add') {
      if (!q.trim()) return [{ note: 'Type the task. Dates, times, <b>#subject</b>, <b>#tags</b>, <b>^list</b>, <b>!priority</b> and durations like <b>45m</b> are picked up as you type.' }];
      const p = api.parse(q), chips = api.previewChips(q);
      return [{ group: 'New task', title: p.title, html: h(p.title) + (chips ? '<span class="pal-chips">' + chips.replace(/<span class="pv-title">.*?<\/span>/, '') + '</span>' : ''), ico: ICO.plus, hint: '↩ Add', run: keep => addTask(q, keep) },
        { note: '<kbd>↩</kbd> adds it · <kbd>⇧</kbd><kbd>↩</kbd> adds it and keeps this open for the next one' }];
    }
    const only = q.startsWith('>'), query = (only ? q.slice(1) : q).trim();
    if (!query) {
      const recent = read(RECENT_KEY, []).map(taskOf).filter(Boolean).slice(0, 4);
      const today = api.sortTasks(d.tasks.filter(t => api.taskOpen(t) && t.date && t.date <= t0)).filter(t => !recent.includes(t)).slice(0, 5 - Math.min(recent.length, 2));
      const pick = ids => ids.map(id => palIndex.find(x => x.id === id)).filter(Boolean);
      const cmds = palIndex.filter(x => x.cmd).slice(0, only ? 40 : 4).map(x => ({ ...x, group: only ? 'Commands' : 'Suggested' }));
      return only ? cmds : [...cmds, ...pick(recent.map(t => t.id)).map(x => ({ ...x, group: 'Recently opened' })), ...pick(today.map(t => t.id)).map(x => ({ ...x, group: 'Due today' }))];
    }
    const hits = [];
    for (const it of palIndex) {
      if (only && !it.cmd) continue;
      let m = fuzzy(query, it.title), viaMore = false;
      if (!m && it.more) { const lower = it.more.toLowerCase(); if (query.toLowerCase().split(/\s+/).every(w => lower.includes(w) || it.title.toLowerCase().includes(w))) { m = { score: 30, marks: null }; viaMore = true; } }
      if (!m) continue;
      hits.push({ ...it, score: m.score - (it.done ? 25 : 0) + (it.cmd ? -4 : 0), html: marked(it.title, m.marks), viaMore });
    }
    const caps = { Tasks: 7, 'Go to': 5, Assessments: 3, Syllabus: 4, Commands: 5 }, byGroup = new Map();
    hits.sort((a, b) => b.score - a.score).forEach(x => { const list = byGroup.get(x.group) ?? byGroup.set(x.group, []).get(x.group); if (list.length < (caps[x.group] ?? 5)) list.push(x); });
    const out = [...byGroup.values()].sort((a, b) => b[0].score - a[0].score).flat();
    if (!only) {
      const p = api.parse(query);
      out.push({ group: 'Or', title: 'Create task “' + p.title + '”', ico: ICO.plus, hint: 'New task', run: () => addTask(query) });
      out.push({ group: 'Or', title: 'List every task matching “' + query + '”', ico: ICO.search, hint: 'Search', run: go('search/' + encodeURIComponent(query)) });
    }
    return out;
  }
  function addTask(text, keep) {
    const spec = api.listSpec(api.route());
    const t = api.createFromQuick(text, spec?.defaults ?? {});
    api.notify('Added “' + t.title + '”' + (t.date ? ' for ' + dayLabel(t.date) : '') + '.', { label: 'Open', run: () => openTask(t.id) });
    if (keep) { const input = pal.querySelector('.pal-input'); input.value = ''; paintPal(); input.focus(); return true; }
  }
  function paintPal() {
    const q = pal.querySelector('.pal-input').value;
    palItems = palResults(q);
    const runnable = palItems.filter(x => x.run);
    palAt = Math.min(palAt, Math.max(0, runnable.length - 1));
    let last = '', n = -1;
    pal.querySelector('.pal-list').innerHTML = palItems.length ? palItems.map(it => {
      if (it.note) return '<div class="pal-note">' + it.note + '</div>';
      n++;
      const head = it.group !== last ? '<div class="pal-group">' + h(last = it.group) + '</div>' : '';
      return head + '<button type="button" role="option" class="pal-item' + (it.done ? ' done' : '') + '" aria-selected="' + (n === palAt) + '" data-pal="' + n + '"><span class="pal-ico">' + (it.ico || '') + '</span><span class="pal-text"><span class="pal-title">' + (it.html ?? h(it.title)) + '</span>' +
        (it.sub ? '<small>' + h(it.sub) + '</small>' : '') + '</span>' + (it.keys ? '<span class="pal-keys">' + it.keys.split(' ').map(k => '<kbd>' + h(k) + '</kbd>').join('') + '</span>' : it.hint ? '<span class="pal-hint">' + h(it.hint) + '</span>' : '') + '</button>';
    }).join('') : '<div class="pal-note">Nothing matches. Try fewer letters, or <b>&gt;</b> for commands only.</div>';
    pal.querySelector('[aria-selected=true]')?.scrollIntoView({ block: 'nearest' });
  }
  function runPal(n, keep) {
    const it = palItems.filter(x => x.run)[n];
    if (!it) return;
    if (palMode === 'add') { if (it.run(keep) !== true) closePal(false); return; }
    closePal(false);
    it.run();
  }
  function closePal(restore = true) {
    if (!palOpen()) return;
    pal.hidden = true; closeAc();
    document.body.classList.remove('pal-open');
    if (restore && palFrom?.isConnected) palFrom.focus({ preventScroll: true });
    palFrom = null;
  }
  function palette(mode = 'find', text = '') {
    if (!api.data() || api.dialog.open) return;
    closePop(); api.closeCtx();
    if (!palOpen()) palFrom = document.activeElement;
    palMode = mode; palAt = 0; palIndex = buildIndex();
    pal.innerHTML = '<div class="pal-box" role="dialog" aria-modal="true" aria-label="' + (mode === 'add' ? 'New task' : 'Search and commands') + '"><div class="pal-top">' + (mode === 'add' ? ICO.plus : ICO.search) +
      '<input class="pal-input" type="text" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="pal-list" placeholder="' + (mode === 'add' ? 'New task: Chem prac fri 4pm #che !high 1h' : 'Search tasks, pages and commands') + '"><kbd>esc</kbd></div>' +
      '<div class="pal-list" id="pal-list" role="listbox"></div>' +
      '<div class="pal-foot">' + (mode === 'add' ? '<span><kbd>#</kbd> subject or tag</span><span><kbd>^</kbd> list</span><span><kbd>!</kbd> priority</span>' : '<span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↩</kbd> open</span><span><kbd>&gt;</kbd> commands only</span>') + '</div></div>';
    pal.hidden = false;
    document.body.classList.add('pal-open');
    const input = pal.querySelector('.pal-input');
    input.value = text;
    paintPal();
    input.focus();
  }
  pal.addEventListener('input', event => { if (event.target.classList.contains('pal-input')) { palAt = 0; paintPal(); } });
  pal.addEventListener('click', event => {
    const b = event.target.closest('[data-pal]');
    if (b) runPal(Number(b.dataset.pal), event.shiftKey);
    else if (!event.target.closest('.pal-box')) closePal();
  });
  pal.addEventListener('pointermove', event => {
    const b = event.target.closest('[data-pal]');
    if (b && Number(b.dataset.pal) !== palAt && (event.movementX || event.movementY)) { palAt = Number(b.dataset.pal); pal.querySelectorAll('[data-pal]').forEach(x => x.setAttribute('aria-selected', x === b)); }
  });
  // The sidebar's Search box opens the palette instead of filtering in place.
  const side = document.getElementById('search');
  if (side) {
    side.readOnly = true;
    side.addEventListener('focus', () => { side.blur(); palette(); });
    side.addEventListener('pointerdown', event => { event.preventDefault(); document.body.classList.remove('nav-open'); palette(); });
  }

  // ───────────────────────── Keys ─────────────────────────
  // Runs before the page's own shortcuts, and only swallows the keys it uses.
  document.addEventListener('keydown', event => {
    if (!api.data()) return;
    const target = event.target, key = event.key, mod = event.metaKey || event.ctrlKey;
    if (acState) {
      if (key === 'ArrowDown' || key === 'ArrowUp') { event.preventDefault(); event.stopPropagation(); acState.at = (acState.at + (key === 'ArrowDown' ? 1 : -1) + acState.items.length) % acState.items.length; paintAc(); return; }
      if (key === 'Enter' || key === 'Tab') { event.preventDefault(); event.stopPropagation(); acceptAc(); return; }
      if (key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeAc(); return; }
    }
    if (palOpen()) {
      const count = palItems.filter(x => x.run).length;
      if (key === 'Escape') { event.preventDefault(); closePal(); }
      else if (key === 'ArrowDown' || key === 'ArrowUp') { event.preventDefault(); if (count) { palAt = (palAt + (key === 'ArrowDown' ? 1 : -1) + count) % count; pal.querySelectorAll('[data-pal]').forEach(x => x.setAttribute('aria-selected', Number(x.dataset.pal) === palAt)); pal.querySelector('[aria-selected=true]')?.scrollIntoView({ block: 'nearest' }); } }
      else if (key === 'Enter') { event.preventDefault(); runPal(palAt, event.shiftKey); }
      else if (mod && key.toLowerCase() === 'k') { event.preventDefault(); closePal(); }
      else if (key === 'Tab') event.preventDefault();
      event.stopPropagation();   // nothing typed here is a page shortcut
      return;
    }
    if (!pop.hidden) {
      if (key === 'Escape') { event.preventDefault(); event.stopPropagation(); closePop(); return; }
      if (key === 'Enter' && target.matches?.('.sch-in')) { event.preventDefault(); event.stopPropagation(); popOpts?.enter?.(target); return; }
      if (target.closest?.('#pop')) { if (key.length === 1 && !mod) event.stopPropagation(); return; }
    }
    if (api.dialog.open || api.isFull() || target.closest?.('#ctx-menu')) return;
    if (mod && !event.altKey && key.toLowerCase() === 'k') { event.preventDefault(); event.stopPropagation(); palette(event.shiftKey ? 'add' : 'find'); return; }
    const typing = !!target.closest?.('input,textarea,select,[contenteditable]');
    if (typing) return;
    if (mod && !event.altKey && key.toLowerCase() === 'z') { event.preventDefault(); event.stopPropagation(); event.shiftKey ? redo() : undo(); return; }
    if (mod && !event.altKey && !event.shiftKey && key.toLowerCase() === 'a' && api.listSpec(api.route()) && rows().length) { event.preventDefault(); event.stopPropagation(); rows().forEach(x => multi.add(x.dataset.select)); paint(); return; }
    if (mod || event.altKey || api.route().name === 'calendar') return;   // the calendar has its own single-key shortcuts
    const used = () => { event.preventDefault(); event.stopPropagation(); };
    if (key === 'Escape' && multi.size) { used(); multi.clear(); paint(); return; }
    if (key === 'j' || key === 'ArrowDown') { if (moveCursor(1)) used(); return; }
    if (key === 'k' || key === 'ArrowUp') { if (moveCursor(-1)) used(); return; }
    const ids = targets();
    if (!ids.length || !document.querySelector('#main [data-select]')) return;
    const onControl = !!target.closest?.('button,a,summary');
    if ((key === 'Enter' || key === 'o') && cursor && !(key === 'Enter' && onControl)) { used(); api.selected() === cursor ? api.closeDetail() : api.selectTask(cursor); }
    else if (key === 'x' && cursor) { used(); multi.has(cursor) ? multi.delete(cursor) : multi.add(cursor); paint(); }
    else if (key === 'e') { used(); complete(ids); }
    else if (['1', '2', '3', '4'].includes(key)) { used(); setPriority(ids, 4 - Number(key)); }
    else if (key === 't' && api.route().name !== 'calendar') { used(); schedule(ids, multi.size ? bulk.getBoundingClientRect() : rowRect(ids[0])); }
    else if ((key === 'Backspace' || key === 'Delete') && !onControl) { used(); remove(ids); }
  }, true);
  for (const type of ['hashchange', 'resize']) addEventListener(type, () => { closePop(); closeAc(); if (type === 'hashchange') { multi.clear(); cursor = null; closePal(false); } });

  return { before, reset, undo, redo, undoable, view, applyFilter, body, viewButton, filterBar, progress, afterRender, palette, schedule: ids => schedule(ids, rectAt(...lastPoint)), remove, closePal };
}
