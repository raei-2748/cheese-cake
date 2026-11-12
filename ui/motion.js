// Small motion hooks that sit outside the app's render loop.
const root = document.documentElement;

// Theme: auto → light → dark, remembered in this browser.
const themeButton = document.getElementById('theme-toggle');
const order = ['auto', 'light', 'dark'];
const currentTheme = () => root.dataset.theme || 'auto';
const showTheme = () => { (themeButton.querySelector('span') || themeButton).textContent = 'Theme: ' + currentTheme(); };
themeButton.addEventListener('click', () => {
  const next = order[(order.indexOf(currentTheme()) + 1) % order.length];
  if (next === 'auto') delete root.dataset.theme; else root.dataset.theme = next;
  try { next === 'auto' ? localStorage.removeItem('hsc-theme') : localStorage.setItem('hsc-theme', next); } catch {}
  showTheme();
});
showTheme();

// Ticking a task or habit pops the new checkmark once.
document.addEventListener('click', event => {
  const el = event.target.closest('[data-action=toggle-task],[data-action=habit-toggle]');
  if (!el || !el.dataset.id) return;
  let selector = '.on[data-action="' + el.dataset.action + '"][data-id="' + CSS.escape(el.dataset.id) + '"]';
  if (el.dataset.date) selector += '[data-date="' + CSS.escape(el.dataset.date) + '"]';
  setTimeout(() => document.querySelectorAll(selector).forEach(x => x.classList.add('pop')), 0);
}, true);

// Sidebar: drag its right edge to resize, collapse it, and remember both in this browser.
const SIDE_KEY = 'stacky-side', SIDE_MIN = 180, SIDE_MAX = 420;
const wide = matchMedia('(min-width:761px)');
const grip = document.getElementById('side-grip'), collapseButton = document.getElementById('side-collapse');
const menuButton = document.querySelector('.menu-btn'), sidebar = document.querySelector('.sidebar');
const readSide = () => { try { return JSON.parse(localStorage.getItem(SIDE_KEY)) || {}; } catch { return {}; } };
const writeSide = patch => { try { localStorage.setItem(SIDE_KEY, JSON.stringify({ ...readSide(), ...patch })); } catch {} };
const collapsed = () => root.dataset.side === 'collapsed';
const labelMenu = () => menuButton.setAttribute('aria-label', wide.matches && collapsed() ? 'Show sidebar' : 'Open menu');
const setWidth = (px, keep = true) => {
  const w = Math.round(Math.min(SIDE_MAX, Math.max(SIDE_MIN, px)));
  root.style.setProperty('--side-w', w + 'px');
  if (keep) writeSide({ w });
};
const setCollapsed = on => {
  if (on) root.dataset.side = 'collapsed'; else delete root.dataset.side;
  writeSide({ collapsed: on });
  labelMenu();
  labelCollapse();
};
// Collapsed, the sidebar becomes an icon rail; the same corner button opens it again.
const labelCollapse = () => { const l = collapsed() ? 'Expand sidebar' : 'Collapse sidebar'; collapseButton.setAttribute('aria-label', l); collapseButton.title = l; };
collapseButton.addEventListener('click', () => setCollapsed(!collapsed()));
// On a wide screen the top-bar menu button brings the sidebar back; on a phone it still opens the drawer.
document.addEventListener('click', event => {
  if (!wide.matches || !event.target.closest('.menu-btn')) return;
  event.stopPropagation();
  setCollapsed(!collapsed());
}, true);
document.addEventListener('keydown', event => {
  if (event.key === '\\' && (event.metaKey || event.ctrlKey) && wide.matches) { event.preventDefault(); setCollapsed(!collapsed()); }
});
grip.addEventListener('pointerdown', event => {
  if (event.button) return;
  event.preventDefault();
  grip.setPointerCapture(event.pointerId);
  root.classList.add('side-dragging');
  const left = sidebar.getBoundingClientRect().left;
  const move = e => setWidth(e.clientX - left, false);
  const stop = e => {
    grip.removeEventListener('pointermove', move);
    grip.removeEventListener('pointerup', stop);
    grip.removeEventListener('pointercancel', stop);
    root.classList.remove('side-dragging');
    setWidth(sidebar.getBoundingClientRect().width);
  };
  grip.addEventListener('pointermove', move);
  grip.addEventListener('pointerup', stop);
  grip.addEventListener('pointercancel', stop);
});
grip.addEventListener('dblclick', () => { root.style.removeProperty('--side-w'); writeSide({ w: null }); });
grip.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  setWidth(sidebar.getBoundingClientRect().width + (event.key === 'ArrowRight' ? 16 : -16));
});
// Also applied here in case the page's early inline script was blocked.
{ const s = readSide(); if (s.w) root.style.setProperty('--side-w', s.w + 'px'); if (s.collapsed) root.dataset.side = 'collapsed'; labelCollapse(); }
wide.addEventListener('change', labelMenu);
labelMenu();

// Sidebar highlight glides to the page you open. Highlights elsewhere appear instantly.
// The marker lives beside the nav list (the list is re-rendered often), and slides
// from the previous current item to the new one.
const rail = document.querySelector('.sidebar');
const liveNav = () => document.getElementById('nav');
const glide = document.createElement('i');
glide.className = 'nav-glide'; glide.setAttribute('aria-hidden', 'true');
rail.prepend(glide);
let glideAt = null;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function placeGlide(animate = true) {
  const nav = liveNav(); if (!nav) return;
  const cur = nav.querySelector('a[aria-current] span');
  if (!cur || !cur.offsetWidth) { glide.style.opacity = '0'; rail.classList.remove('has-glide'); glideAt = null; return; }
  // Positions are in the sidebar's own scrolled coordinates, so a scrolled sidebar still lines up.
  const s = rail.getBoundingClientRect(), r = cur.getBoundingClientRect();
  const box = { x: r.left - s.left - rail.clientLeft + rail.scrollLeft, y: r.top - s.top - rail.clientTop + rail.scrollTop, w: r.width, h: r.height };
  // Hide the marker when its row is scrolled out of whichever element actually scrolls.
  let clip = cur.parentElement;
  while (clip && clip !== rail && !(/(auto|scroll)/.test(getComputedStyle(clip).overflowY) && clip.clientHeight)) clip = clip.parentElement;
  const c = (clip || rail).getBoundingClientRect();
  const hidden = c.height > 0 && (r.bottom < c.top || r.top > c.bottom);
  const moved = glideAt && (Math.abs(glideAt.y - box.y) > 1 || Math.abs(glideAt.x - box.x) > 1 || Math.abs(glideAt.w - box.w) > 1);
  // Re-placing at the same spot must not touch the transition, or a slide in progress snaps.
  if (!glideAt || moved) {
    glide.style.transition = animate && moved && !reduceMotion() ? '' : 'none';
    glide.style.transform = 'translate(' + box.x + 'px,' + box.y + 'px)';
    glide.style.width = box.w + 'px'; glide.style.height = box.h + 'px';
  }
  glide.style.opacity = hidden ? '0' : '1';
  rail.classList.add('has-glide');
  glideAt = box;
}
let glideQueued = false;
new MutationObserver(records => {
  // Ignore the sidebar's own has-glide class flips, which this code makes.
  if (records.every(m => m.target === rail && m.attributeName === 'class')) return;
  if (glideQueued) return; glideQueued = true; setTimeout(() => { glideQueued = false; placeGlide(true); }, 0); })
  .observe(rail, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-current', 'class'] });
addEventListener('hashchange', () => setTimeout(() => placeGlide(true), 0));
rail.addEventListener('scroll', () => placeGlide(false), { passive: true, capture: true });
addEventListener('resize', () => placeGlide(false));
placeGlide(false);
