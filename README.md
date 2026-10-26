# GoGo Day Chain

An anchor-based daily planning PWA built to minimize decision fatigue. Instead of fixed clock times, tasks follow a flexible sequence triggered by the previous one. You only see the one thing to do now, start it with the smallest possible step, rest when you're done, and let the next one follow.

🔗 **Live Demo**: [lilsycz.github.io/GoGo--Day-Chain](https://lilsycz.github.io/GoGo--Day-Chain/)

---

## How a day works

1. **Start today.** The day begins when you tap *Start today*, not at a fixed hour.
2. **Do the one thing in front of you.** The current task is a big full-color card showing its *first step* ("put the pan on the stove"). Tap the round button when it's done.
3. **Rest as long as you like.** The page greys out. There's no countdown: pick when to be nudged, or not at all. While you rest, write the next task's smallest first step (each task suggests an example). The nudge shows it with *Start now* / *Later*.
4. **Repeat.** Not feeling the next task? *Swap* it, push it to the end, or skip it for today.
5. **Look back.** Start and end times are logged in the background, so you can see what your day actually looked like.

---

## Features

**Doing**
- **Focus view**: only the current task and the next one are shown; the rest stays folded until you ask
- **Smallest first step**: written while you rest before a task (or on the start card for the first one), with a grey example tailored to the task; the task card then just shows it
- **Swap / later / skip**: change today's order without touching your daily routine
- **Checklist tasks**: e.g. *Head out* only completes once everything is packed
- **Undo**: step back to the previous task

**Resting**
- **Rest without a countdown**: optional reminder in 5 / 15 / 30 / 60 minutes, with a sound and vibration
- Rest periods show up in your timeline

**Looking back**
- **Calendar** (tap the date, top left): a month view where each day is a circle with a thin ring split into the colors of what you did, in order and by time spent. The date badge shows today's ring as it grows
- **Today's timeline** (calendar icon, top right): what ran from when to when, plus rests, color-coded by category
- **New day at 4 AM**: yesterday is archived automatically; staying up past midnight still counts as today

**Editing** (✎ in the top right): edits change **today only**, so you can rearrange freely. To keep a setup, save it as a template
- Tap a task's color dot and icon to change its category color and icon; tap ＋ to add a note or first step; rename tasks and checklist items in place; hold the ≡ handle to reorder; remove with a few seconds to undo
- **Add something**: a tray sits at the bottom of edit mode, with events grouped by category color (meals, focus, health, life, other; 23 to start with). Swipe it up to see more; tap an event to add it after the current task, or hold and drag it into the list to drop it exactly where you want. The new row flashes and a message tells you where it went (with undo). Create your own events with an icon, category color and first step

**Settings** (the ··· menu)
- **Templates** (buttons at the bottom of edit mode): *Save as template* overwrites one of yours or creates a new one by name; *Templates* switches the whole routine in one tap (done tasks stay, undo in the toast). Each template shows a row of category-color dots as a preview. New users start from *Basic*; people coming from the old version get their routine saved as *Personal*. First steps you write are remembered in the current template
- **Bedtime**: today's ring, which template tomorrow uses, the first step for tomorrow's first task, and a short checklist
- **Light / dark mode** and **English / 中文**: built-in task names follow the language; anything you renamed stays as you wrote it
- **Export / import**: save a backup file (on iPhone, via the share sheet to Files or iCloud Drive) and restore it on any device
- **Reset today**

**Design**
- Swiss-inspired: warm stone background, vermilion / cobalt / amber / ink category colors, big bold type, circles and hairlines
- Line icons for every task; 44 pt tap targets; respects *reduce motion*
- Add to the iPhone home screen and use it like an app (PWA); works offline after the first visit
- First-use hints are motion, not text: the ≡ handles wiggle the first time you edit, the tray bounces once

---

## Known limitations (web version)

- **Reminders only fire while the page is open.** On a locked iPhone they usually won't arrive; when you come back, the app shows *Time to start* if the reminder is due. Lock-screen notifications are planned for the native app.
- **Data lives in this browser only** (localStorage). Clearing site data removes it, and on iPhone Safari may clear it after 7 days without a visit (home-screen apps are exempt). Use *Export data* now and then as a backup; there's no automatic sync yet.
- **Needs a connection on the very first visit**; after that a service worker keeps a copy for offline use and makes sure updates arrive all at once.

---

## Tech Stack

- Vanilla HTML, CSS and JavaScript (ES modules, no build step)
- [SortableJS](https://github.com/SortableJS/Sortable) for drag-to-reorder
- localStorage for persistence
- GitHub Pages for hosting

---

## Local Development

ES modules don't load from `file://`, so opening `index.html` directly won't work. Run a local server from the project folder:

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173 (`npx serve .` works too). If the browser shows an old version after editing, hard-reload with Cmd+Shift+R.

---

## Project Structure

The layout mirrors a planned SwiftUI version, so each part maps over one-to-one.

| Path | What's in it | SwiftUI counterpart |
|---|---|---|
| `index.html` | Page skeleton | — |
| `sw.js` | Service worker: offline copy, fresh files after each update | — |
| `src/main.js` | Entry point | `GoGoDayChainApp.swift` |
| `src/models/` | Default tasks, block templates, checklists, categories | `Models/` |
| `src/store/store.js` | App state and every data action (no DOM) | `Store/ChainStore.swift` |
| `src/store/storage.js` | localStorage reads and writes | SwiftData |
| `src/views/` | Chain, rest, swap, calendar, timeline, palette, bedtime, edit mode, dialogs | `Views/` |
| `src/services/` | Job feed, reminders | `Services/` |
| `src/i18n/` | Chinese / English text, built-in task names | `Localizable.xcstrings` |
| `src/styles/` | CSS and color tokens | `Assets.xcassets` colors |

---

## Roadmap

- [x] Split into modules
- [x] Start today, first steps, automatic time log
- [x] Rest between tasks with optional reminders
- [x] Focus view, swap / later / skip, today-only vs daily edits
- [x] Swiss-style redesign, line icons, calendar with day rings
- [x] English / Chinese UI
- [x] Templates and a basic starter routine for new users
- [x] Change a task's category and icon in edit mode
- [x] Bedtime page: review today + choose tomorrow's template and first step
- [x] Export / import data
- [x] Edit mode in the top bar with a drag-in insert tray
- [ ] Job card as an optional module (for now: open the app with `?jobfeed=<json url>` to enable it)
- [ ] Native SwiftUI app for the App Store
