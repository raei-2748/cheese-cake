# HSC Stack · 2027

A TickTick-style study system for the HSC, built around Year 12 school assessments and Trials. Live at **https://raei-2748.github.io/cheese-cake/**.

## What's in it

**Tasks** (modelled on TickTick)
- **Quick add with smart parsing.** Type `Phys depth study fri 4pm #phy !high 1h` and the date, time, subject, priority and duration are picked out as you type.
  - Dates: `today`, `tmr`, `fri`, `next mon`, `in 3 days`, `14/11`, `3 feb`
  - Times: `4pm`, `16:30`, `at 4`
  - `#tag`, or `#phy` / `#mx2` / `#eco` etc. for a subject
  - `^List` for a custom list
  - Priority: `!high`, `!med`, `!low` (or `!3`, `!2`, `!1`)
  - Duration: `45m`, `1h30m`
  - Repeat: `every day`, `every weekday`, `every wed`, `weekly`, `monthly`
- **Smart lists:** Today (includes overdue), Next 7 days, Inbox, All, Completed. Also one list per subject, your own lists, and tags.
- **Task details panel:** subtasks, notes, priority, repeat, estimate vs actual time, status and work type.
- **Calendar:** month and week (hourly) views. Drag a task to reschedule it. Assessments show as flags.
- **Eisenhower matrix:** quadrants follow priority, as in TickTick's default. Drag a task to another quadrant to change its priority.
- **Focus:** a Pomodoro timer linked to a task. Logs minutes to the task, shows per-day and per-subject stats, and keeps running across tabs and reloads.
- **Habits:** daily or chosen weekdays, with streaks, a 16-week heatmap and today's habits on the Today page.

**HSC tools** (from the original Study Desk)
Weekly plan with capacity budgets, assessments and Trials with weighted marks, syllabus checklist and priorities, the error log with retests, teacher feedback and weekly reviews. Any study block you plan there is a normal task in the lists, calendar and matrix too.

**Keyboard:** `q` quick add · `/` search · `Esc` close details.

## Data

On GitHub Pages your records are saved in this browser's local storage. Use **Backup & settings** (bottom of the sidebar) to export a `.json` backup, or import one on another device.

## Run locally

Requires Node.js 20 or later and Bash. There are no packages to install.

```sh
npm run dev
```

Open http://localhost:3000. Local preview uses an in-memory database that resets when the dev server stops.

## Deploy

- **GitHub Pages:** `.github/workflows/pages.yml` publishes `ui/` on every push to `main`. In Settings → Pages, set **Source** to **GitHub Actions**.
- **Synced version (optional):** `npm run build && npm run validate` builds a Worker in `dist/server/index.js`. It expects a D1 binding called `DB` with the schema in `drizzle/`, and a trusted sign-in gateway that supplies the user ID.
