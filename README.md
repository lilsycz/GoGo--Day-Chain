# GoGo Day Chain

An anchor-based daily planning PWA built to minimize decision fatigue. Instead of fixed clock times, tasks follow a flexible sequence triggered by the previous one — you only ever see the one thing to do now, start it with the smallest possible step, and let the next one follow.

🔗 **Live Demo**: [lilsycz.github.io/GoGo--Day-Chain](https://lilsycz.github.io/GoGo--Day-Chain/)

---

## Features

- **Anchor-based sequence** — Tasks flow in order, not by clock time. Only the current task is open; finishing it unlocks the next
- **Focus view** — You see the task in front of you and the next one; the rest of the day stays folded away until you ask for it
- **Rest without a countdown** — After each task the page greys out and you rest as long as you like. Pick when to be nudged (or not at all); the nudge shows the next task's first step with "start now" / "later"
- **Swap, later, skip** — Not feeling the current task? Pick another one, push it to the end, or skip it for today
- **Start today** — The day begins when you tap "Start today", not at a fixed hour. No timers while you work
- **Smallest first step** — Each task can carry a tiny starter action ("put the pan on the stove"); write it right on the card
- **Automatic day log** — Start and end times are recorded in the background; finished cards show their time range
- **Calendar** — Tap the date (top left, which also shows today's ring) for a month view; each day is a circle with a thin ring split into the colors of what you did, in order and by time spent. Tap a day to see its timeline
- **Today's timeline** — The calendar icon (top right) shows what ran from when to when today, plus rests, color-coded by category
- **New day at 4 AM** — Yesterday is archived automatically; staying up past midnight still counts as today
- **Checklist tasks** — e.g. "Leave the house" only completes once every item is packed
- **Undo** — Step back to the previous task; removing a task can be undone for a few seconds
- **Block library** — Insert extra blocks (meeting, call, break, errand, reading…) right after the current task for today only, or create your own with a first step and category
- **Reorder in edit mode** — Drag the ≡ handle on each row to change the order
- **Today vs. every day** — Inserting, swapping and skipping only change today. Editing text, reordering and removing (in edit mode) change your daily chain; a one-off task can be pinned to the daily chain
- **Edit mode** — Rename tasks, hints, first steps and checklist items in place
- **Bedtime checklist** — Pack-your-bag review with a "tomorrow's first thing" field for study and work
- **English / 中文** — Switch in the menu. Built-in task names follow the language; anything you renamed stays as you wrote it
- **PWA support** — Add to the iPhone home screen and use it like an app
- **Swiss-inspired design** — Warm stone background, vermilion / cobalt / amber / ink category colors, big bold type and round shapes. The current task is a full-color block; light and dark versions of the same style

---

## Tech Stack

- Vanilla HTML, CSS and JavaScript (ES modules, no build step)
- localStorage for persistence
- GitHub Pages for hosting

---

## Local Development

ES modules don't load from `file://`, so opening `index.html` directly won't work. Run a local server from the project folder:

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173 (`npx serve .` works too).

---

## Project Structure

The layout mirrors a planned SwiftUI version, so each part maps over one-to-one.

| Path | What's in it | SwiftUI counterpart |
|---|---|---|
| `index.html` | Page skeleton | — |
| `src/main.js` | Entry point | `GoGoDayChainApp.swift` |
| `src/models/` | Default tasks, block templates, checklists, categories & colors | `Models/` |
| `src/store/store.js` | App state and every data action (no DOM) | `Store/ChainStore.swift` |
| `src/store/storage.js` | localStorage reads and writes | SwiftData |
| `src/views/` | UI for the chain, sidebar, bedtime, records, edit mode, jobs | `Views/` |
| `src/services/` | Network requests, reminders | `Services/` |
| `src/i18n/` | Chinese / English text | `Localizable.xcstrings` |
| `src/styles/` | CSS | `Assets.xcassets` colors |

---

## Roadmap

- [x] Split into modules
- [x] Auto-reset on a new day, with archived history
- [x] A "smallest first step" on every task
- [x] Automatic time log and records page
- [x] Rest between tasks: pick when to be reminded, then "start now / later"
- [x] Focus view, swap / later / skip, today-only vs daily edits
- [x] English / Chinese UI
- [x] Unified visual style, top bar cleanup, in-app dialogs, readable sizes and 44pt tap targets
- [ ] Bedtime page: review today + write tomorrow's first steps
- [ ] First-run onboarding, job card as an optional module
- [ ] Export / import data
- [ ] Native SwiftUI app for the App Store
