# GoGo Day Chain

An anchor-based daily planning PWA built to minimize decision fatigue. Instead of fixed clock times, tasks follow a flexible sequence triggered by the previous one. You only see the one thing to do now, start it with the smallest possible step, rest when you're done, and let the next one follow.

🔗 **Live Demo**: [lilsycz.github.io/GoGo--Day-Chain](https://lilsycz.github.io/GoGo--Day-Chain/)

---

## How a day works

1. **Start today.** The day begins when you tap *Start today*, not at a fixed hour.
2. **Do the one thing in front of you.** The current task is a big full-color card showing its *first step* ("put the pan on the stove"). Tap the round button when it's done.
3. **Rest as long as you like.** The page greys out. There's no countdown: pick when to be nudged, or not at all. The nudge shows the next task's first step with *Start now* / *Later*.
4. **Repeat.** Not feeling the next task? *Swap* it, push it to the end, or skip it for today.
5. **Look back.** Start and end times are logged in the background, so you can see what your day actually looked like.

---

## Features

**Doing**
- **Focus view**: only the current task and the next one are shown; the rest stays folded until you ask
- **Smallest first step**: every task can carry a tiny starter action, written right on the card
- **Swap / later / skip**: change today's order without touching your daily routine
- **Add something**: a tray rises from the bottom with events grouped by category color. Tap one to add it right after the current task, or hold and drag it up into the list to drop it exactly where you want (today only). Create your own with an icon, category color and first step
- **Checklist tasks**: e.g. *Head out* only completes once everything is packed
- **Undo**: step back to the previous task

**Resting**
- **Rest without a countdown**: optional reminder in 5 / 15 / 30 / 60 minutes, with a sound and vibration
- Rest periods show up in your timeline

**Looking back**
- **Calendar** (tap the date, top left): a month view where each day is a circle with a thin ring split into the colors of what you did, in order and by time spent. The date badge shows today's ring as it grows
- **Today's timeline** (calendar icon, top right): what ran from when to when, plus rests, color-coded by category
- **New day at 4 AM**: yesterday is archived automatically; staying up past midnight still counts as today

**Setting up** (the ··· menu)
- **Edit tasks**: rename tasks, notes, first steps and checklist items in place; drag the ≡ handle to reorder; remove with a few seconds to undo
- **Today vs. every day**: adding, swapping and skipping only change today. Editing, reordering and removing in edit mode change your daily routine; a one-off task can be pinned to it
- **Bedtime checklist**: pack your bag and write tomorrow's first thing for study and work
- **Light / dark mode** and **English / 中文**: built-in task names follow the language; anything you renamed stays as you wrote it
- **Reset today**

**Design**
- Swiss-inspired: warm stone background, vermilion / cobalt / amber / ink category colors, big bold type, circles and hairlines
- Line icons for every task; 44 pt tap targets; respects *reduce motion*
- Add to the iPhone home screen and use it like an app (PWA)

---

## Known limitations (web version)

- **Reminders only fire while the page is open.** On a locked iPhone they usually won't arrive; when you come back, the app shows *Time to start* if the reminder is due. Lock-screen notifications are planned for the native app.
- **Data lives in this browser only** (localStorage). Clearing site data removes it; there's no sync or export yet.
- **Needs a connection on first load** for the drag-and-drop library and the font (falls back to the system font offline).

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
- [ ] Change a task's category and icon in edit mode
- [ ] Bedtime page: review today + write tomorrow's first steps
- [ ] Export / import data
- [ ] First-run onboarding; job card as an optional module
- [ ] Native SwiftUI app for the App Store
