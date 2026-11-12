# Stacky

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
- **Calendar (time blocking):** the week view is an hour grid. Drag down on empty space to draw a block, then type what it is for (quick-add words like `#che !high` work). Drag a block to move it, including to another day; drag its bottom edge to change its length; click it to open it. Click an empty slot for a one-hour block. On a phone it shows 3 days; tap to add. Month view shows everything at a glance, and unscheduled tasks can be dragged onto either view.
- **Connected calendars:** open **Calendar → Calendars**.
  - **Google Calendar (two-way):** your Google events show in Stacky, and Stacky's timed blocks are kept as events in a Google calendar you pick. Move or rename one there and the task updates here. Needs a free Google client ID made once (the dialog walks you through it); sign-in stays on each device and lasts about an hour, then the calendar shows **Reconnect Google**.
  - **iCloud and others (read-only):** add the calendar to Google Calendar (*Other calendars → From URL*) so it comes through Google, paste its `webcal://` link, or import an `.ics` file. Weekly timetables (repeating events) are supported.
- **Eisenhower matrix:** quadrants follow priority, as in TickTick's default. Drag a task to another quadrant to change its priority.
- **Study:** pick a subject (and optionally a task) and start. Open sessions count up until you finish; timed sessions run Pomodoro rounds with breaks. Finishing asks for the minutes, what you did and how it went, then saves it to the study log. The log is grouped by day with start and end times; click any entry to edit it, or log a session you did without the timer. Shows a daily goal, a streak, this week per day and per subject. The timer keeps running across tabs and reloads, and minutes go onto the linked task.
- **Habits:** daily or chosen weekdays, with streaks, a 16-week heatmap and today's habits on the Today page.

**Power tools** (in the spirit of Todoist and Notion)
- **Command palette:** `⌘K` (or `/`, or the sidebar's Search) finds tasks, pages, subjects, lists, tags, assessments and syllabus topics as you type, and runs commands such as *Start the timer*, *Show this list as a board* or *Theme: Dark*. Start with `>` for commands only. `⌘⇧K` opens it as a new-task box from anywhere.
- **Undo:** every edit can be taken back with `⌘Z` (redo with `⌘⇧Z`). Completing, deleting, moving and rescheduling show a toast with an **Undo** button, so deleting no longer asks first.
- **Views:** each list has a **View** button: show it as rows or as a **board**, group by date, priority, subject or status, sort it, and filter by priority or subject. Drag a card or row to another column or group to change that field. Each list remembers its own view in this browser.
- **Keyboard lists:** `J`/`K` (or the arrows) move down a list, `Enter` opens, `E` completes, `T` schedules, `1`–`4` set the priority, `⌫` deletes. `X`, `⌘`-click or Shift-click select several tasks; a bar then completes, reschedules, re-prioritises, moves or deletes them together.
- **Scheduler:** hover a task for its calendar button (or press `T`): type a date such as `fri 4pm`, pick Today, Tomorrow, the weekend or next week, or pick a day from the month.
- **Autocomplete:** typing `#`, `^` or `!` in any quick-add box suggests subjects and tags, lists, and priorities.
- **Today** shows how much of the day's list is done.

**Overview** (the home page)
- Countdowns to the next assessment, the Trials and the first HSC exam. Set the Trial and HSC dates in **Backup & settings**.
- Today's tasks, topics due for review, retests due this week and teacher feedback you have not acted on yet.
- **Subject balance:** for each course, the study time over 7 and 28 days, syllabus topics practised, reviews due, open errors, past-paper average and next assessment. A course is flagged when it got no study this week but has an assessment within 3 weeks or reviews due.

**HSC tools**
- **Weekly plan** with capacity budgets, **assessments and Trials** with weighted marks, the **error log** with retests, **teacher feedback** and **weekly reviews**. Any study block you plan there is a normal task in the lists, calendar and matrix too.
- **Syllabus & spaced review:** press **Review** on any syllabus topic after recalling it from memory, then rate it Again / Hard / Good / Easy. The next review is set from that rating, from 1 day up to 60. Topics that are due show on the Overview and at the top of the syllabus page.
- **Past papers:** log each paper with its mark, time used and time allowed, and where you lost marks. Each course shows its latest, average and best score with a trend line. **Log error** turns a lost mark into an error-log entry with a retest date.

**Exam mode:** on the Study page choose **Exam** and a paper. Times follow the NESA HSC format: Maths Ext 1 has 10 min reading and 2 h writing, Ext 2 has 10 min and 3 h, Physics, Chemistry and Economics have 5 min and 3 h, and English Advanced has Paper 1 (10 min and 1.5 h) and Paper 2 (5 min and 2 h). **Custom** sets any other paper. Writing time starts as soon as reading time ends. A chime and a notification come at 30 and 5 minutes left. At pens down the sitting is logged and the Past papers form opens with the paper and times filled in, ready for your mark. Timed mode also has a **Custom** round length. The timer's buttons, selected pills and progress bar take the colour of the chosen subject.

**Full-screen timer:** press **Full screen** on the Study page (or `f`). It shows a large clock with the subject, task and round, keeps the screen awake, and fades the controls after a few seconds while the timer runs. `Space` starts or pauses, `Esc` exits. On iPhone it fills the browser window, because Safari there does not allow true full screen.

**Keyboard:** `⌘K` search and commands · `q` quick add · `s` start or pause studying · `f` full-screen timer · `⌘Z` undo · `?` the full list.

## Data and sync

On GitHub Pages your records are saved in this browser's local storage.

**Sync across devices:** open **Backup & settings → Set up sync** on each device (laptop, iPad, phone) and paste a GitHub fine-grained token whose only permission is **Gists: Read and write**. The records are kept in one secret gist on your own GitHub account. Changes are sent about a second after you make them. Changes from your other devices arrive within about 10 seconds while the tab is open, and straight away when you come back to it. If two devices changed different things, both changes are kept. Records are matched by id and merged field by field. Only a field changed differently on both devices keeps the version from the device that syncs.
- The token stays in that browser's local storage. A secret gist is unlisted, but anyone with its exact link can read it. On a shared computer, use **Disconnect this device** when you finish.

**Safety nets:**
- Export a `.json` backup now and then. The Overview reminds you after 7 days.
- The browser keeps a snapshot of your records from the first time you open the app each day, for the last 7 days. You can restore one in **Backup & settings**.
- Records are repaired on load if a backup was damaged. Two open tabs pick up each other's changes.

## Run locally

Requires Node.js 20 or later and Bash. There are no packages to install.

```sh
npm run dev
```

Open http://localhost:3000. Local preview uses an in-memory database that resets when the dev server stops. The preview reads `ui/` on every request, so an edit shows on reload.

The UI is plain ES modules with no build step: `app.js` (records, pages, timer, calendar, sync), `power.js` (palette, undo, views, keyboard lists, scheduler, autocomplete), `parse.js` (quick-add parsing), `data.js` (courses) and `motion.js` (theme and sidebar).

## Deploy

- **GitHub Pages:** `.github/workflows/pages.yml` publishes `ui/` on every push to `main`. In Settings → Pages, set **Source** to **GitHub Actions**.
- **Synced version (optional):** `npm run build && npm run validate` builds a Worker in `dist/server/index.js`. It expects a D1 binding called `DB` with the schema in `drizzle/`, and a trusted sign-in gateway that supplies the user ID.
