// Small motion hooks that sit outside the app's render loop.
const root = document.documentElement;

// Theme: auto → light → dark, remembered in this browser.
const themeButton = document.getElementById('theme-toggle');
const order = ['auto', 'light', 'dark'];
const currentTheme = () => root.dataset.theme || 'auto';
const showTheme = () => { themeButton.textContent = 'Theme: ' + currentTheme(); };
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
