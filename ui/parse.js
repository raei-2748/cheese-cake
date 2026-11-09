// Natural-language quick add, in the spirit of TickTick's smart recognition.
// Pure functions only, so this file can be unit-tested in Node.
//
//   "Phys prac report fri 4pm #phy !high 45m"   -> Physics, Friday 16:00, high, 45 min
//   "Anki deck every day #mx2"                  -> repeats daily, Maths Ext 2
//   "Draft mod C essay 14/11 ^Essays #draft"    -> 14 Nov, list "Essays", tag "draft"

const DAYS = ['sun','mon','tue','wed','thu','fri','sat'];
const DAY_RE = '(sun(?:day)?|mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?)';
const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const MONTH_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';

const pad = n => String(n).padStart(2, '0');
const toDate = s => new Date(s + 'T12:00:00Z');
const fmt = d => d.toISOString().slice(0, 10);
export function shiftDays(iso, n) { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return fmt(d); }
export function shiftMonths(iso, n) {
  const d = toDate(iso), day = d.getUTCDate();
  d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + n);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return fmt(d);
}
const weekday = iso => toDate(iso).getUTCDay();
const dayIndex = word => DAYS.indexOf(word.slice(0, 3).toLowerCase());
const monthIndex = word => MONTHS.indexOf(word.slice(0, 3).toLowerCase());
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');

// Next date (today included) that falls on weekday `dow`.
function upcoming(today, dow, skipWeek = false) {
  let gap = (dow - weekday(today) + 7) % 7;
  if (skipWeek) gap += 7;
  return shiftDays(today, gap);
}

function validDate(y, m, d) {
  const dt = new Date(Date.UTC(y, m, d, 12));
  return dt.getUTCMonth() === m && dt.getUTCDate() === d ? fmt(dt) : null;
}
// A day/month without a year means the next time that date comes round.
function nextOccurrence(today, m, d, y) {
  if (y) return validDate(y < 100 ? 2000 + y : y, m, d);
  const year = Number(today.slice(0, 4));
  const thisYear = validDate(year, m, d);
  return thisYear && thisYear >= today ? thisYear : validDate(year + 1, m, d);
}

function to24(h, min, ampm) {
  h = Number(h); min = Number(min || 0);
  if (ampm) {
    ampm = ampm.toLowerCase();
    if (h < 1 || h > 12) return null;
    if (ampm === 'pm' && h !== 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
  }
  if (h > 23 || min > 59) return null;
  return pad(h) + ':' + pad(min);
}

export function nextRepeat(iso, repeat) {
  if (!iso || !repeat) return null;
  if (repeat === 'daily') return shiftDays(iso, 1);
  if (repeat === 'weekdays') { let d = shiftDays(iso, 1); while ([0, 6].includes(weekday(d))) d = shiftDays(d, 1); return d; }
  if (repeat === 'weekly') return shiftDays(iso, 7);
  if (repeat === 'fortnightly') return shiftDays(iso, 14);
  if (repeat === 'monthly') return shiftMonths(iso, 1);
  return null;
}
export const repeatLabels = { '': 'Does not repeat', daily: 'Daily', weekdays: 'Every weekday', weekly: 'Weekly', fortnightly: 'Every 2 weeks', monthly: 'Monthly' };

/**
 * @param {string} input
 * @param {{today:string, courses?:{id:string,short:string,code:string,name:string}[], lists?:{id:string,name:string}[]}} ctx
 */
export function parseQuickAdd(input, ctx) {
  const today = ctx.today;
  const courses = ctx.courses || [];
  const lists = ctx.lists || [];
  const out = { title: '', date: '', time: '', priority: 0, tags: [], course: '', list: '', minutes: 0, repeat: '', tokens: [] };
  let text = ' ' + String(input) + ' ';

  // Remove a match from the text and remember what was recognised.
  const take = (re, fn) => {
    const m = text.match(re);
    if (!m) return false;
    const ok = fn(m);
    if (ok === false) return false;
    out.tokens.push({ type: ok || 'token', text: m[0].trim() });
    text = text.slice(0, m.index) + ' ' + text.slice(m.index + m[0].length);
    return true;
  };
  const courseFor = word => {
    const s = slug(word);
    return courses.find(c => [c.id, c.code, c.short, c.name].some(v => slug(v) === s)) ||
      courses.find(c => s.length >= 3 && slug(c.name).startsWith(s));
  };

  // Priority: !high / !med / !low or !3 / !2 / !1
  take(/\s!(high|hi|h|3|medium|med|m|2|low|lo|l|1)(?=\s)/i, m => {
    const w = m[1].toLowerCase();
    out.priority = /^(h|3)/.test(w) ? 3 : /^(m|2)/.test(w) ? 2 : 1;
    return 'priority';
  });

  // ^list (custom list or subject)
  take(/\s\^([\p{L}\p{N}_-]+)(?=\s)/u, m => {
    const s = slug(m[1]);
    const list = lists.find(l => slug(l.name) === s) || lists.find(l => slug(l.name).startsWith(s));
    if (list) { out.list = list.id; return 'list'; }
    const c = courseFor(m[1]);
    if (c) { out.course = c.id; return 'course'; }
    return false;
  });

  // #tags (a tag that names a subject sets the subject)
  let guard = 0;
  while (guard++ < 20 && take(/\s#([\p{L}\p{N}_-]+)(?=\s)/u, m => {
    const c = !out.course && courseFor(m[1]);
    if (c) { out.course = c.id; return 'course'; }
    const tag = m[1].toLowerCase();
    if (!out.tags.includes(tag)) out.tags.push(tag);
    return 'tag';
  }));

  // Repeat
  take(new RegExp('\\s(?:every\\s+(day|weekday|week|fortnight|month|' + DAY_RE + ')|(daily|weekly|fortnightly|monthly|weekdays))(?=\\s)', 'i'), m => {
    const w = (m[1] || m[3]).toLowerCase();
    if (w === 'day' || w === 'daily') out.repeat = 'daily';
    else if (w.startsWith('weekday')) out.repeat = 'weekdays';
    else if (w === 'week' || w === 'weekly') out.repeat = 'weekly';
    else if (w.startsWith('fortnight')) out.repeat = 'fortnightly';
    else if (w === 'month' || w === 'monthly') out.repeat = 'monthly';
    else { out.repeat = 'weekly'; out.date = upcoming(today, dayIndex(w)); }
    return 'repeat';
  });

  // Duration: 45m, 90 min, 1h, 1.5h, 1h30m, 2 hrs
  take(/\s(?:for\s+)?(\d+(?:\.\d+)?)\s?(?:h|hr|hrs|hour|hours)(?:\s?(\d{1,2})\s?(?:m|min|mins))?(?=\s)/i, m => {
    out.minutes = Math.round(Number(m[1]) * 60 + Number(m[2] || 0));
    return out.minutes > 0 && out.minutes <= 720 ? 'duration' : false;
  }) || take(/\s(?:for\s+)?(\d{1,3})\s?(?:m|min|mins|minutes)(?=\s)/i, m => {
    out.minutes = Number(m[1]);
    return out.minutes > 0 && out.minutes <= 720 ? 'duration' : false;
  });

  // Time: 4pm, 4:30 pm, at 16:00, 9am
  take(/\s(?:at\s+|@)?(\d{1,2})(?::(\d{2}))?\s?(am|pm)(?=\s)/i, m => {
    const t = to24(m[1], m[2], m[3]);
    if (!t) return false;
    out.time = t; return 'time';
  }) || take(/\s(?:at\s+|@)?([01]?\d|2[0-3]):([0-5]\d)(?=\s)/i, m => { out.time = pad(m[1]) + ':' + m[2]; return 'time'; })
     || take(/\s(?:at|@)\s?(\d{1,2})(?=\s)/i, m => {
    // "at 4" with no am/pm: assume the next sensible study hour (1-7 means pm).
    let hh = Number(m[1]);
    if (hh < 1 || hh > 23) return false;
    if (hh <= 7) hh += 12;
    out.time = pad(hh) + ':00'; return 'time';
  });

  // Date (first match wins)
  if (!out.date) {
    take(/\s(today|tod|tonight)(?=\s)/i, () => { out.date = today; return 'date'; }) ||
    take(/\s(tomorrow|tmrw|tmr|tom)(?=\s)/i, () => { out.date = shiftDays(today, 1); return 'date'; }) ||
    take(/\s(day after tomorrow)(?=\s)/i, () => { out.date = shiftDays(today, 2); return 'date'; }) ||
    take(/\snext\s+week(?=\s)/i, () => { out.date = upcoming(shiftDays(today, 1), 1); return 'date'; }) ||
    take(/\sin\s+(\d{1,3})\s+(day|days|week|weeks|month|months)(?=\s)/i, m => {
      const n = Number(m[1]), u = m[2].toLowerCase();
      out.date = u.startsWith('month') ? shiftMonths(today, n) : shiftDays(today, u.startsWith('week') ? n * 7 : n);
      return 'date';
    }) ||
    take(new RegExp('\\s(?:on\\s+)?(next\\s+|this\\s+)?' + DAY_RE + '(?=\\s)', 'i'), m => {
      out.date = upcoming(today, dayIndex(m[2]), /next/i.test(m[1] || ''));
      return 'date';
    }) ||
    take(/\s(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?(?=\s)/, m => {
      // Australian order: day/month
      const d = nextOccurrence(today, Number(m[2]) - 1, Number(m[1]), m[3] && Number(m[3]));
      if (!d) return false;
      out.date = d; return 'date';
    }) ||
    take(new RegExp('\\s(?:on\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\s+' + MONTH_RE + '(?:\\s+(\\d{4}))?(?=\\s)', 'i'), m => {
      const d = nextOccurrence(today, monthIndex(m[2]), Number(m[1]), m[3] && Number(m[3]));
      if (!d) return false;
      out.date = d; return 'date';
    }) ||
    take(new RegExp('\\s(?:on\\s+)?' + MONTH_RE + '\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s+(\\d{4}))?(?=\\s)', 'i'), m => {
      const d = nextOccurrence(today, monthIndex(m[1]), Number(m[2]), m[3] && Number(m[3]));
      if (!d) return false;
      out.date = d; return 'date';
    });
  }
  // A time or repeat with no date means today.
  if (!out.date && (out.time || out.repeat)) out.date = today;

  out.title = text.replace(/\s+/g, ' ').trim() || String(input).trim();
  return out;
}
