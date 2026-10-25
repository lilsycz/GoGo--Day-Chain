# GoGo Day Chain

An anchor-based daily planning PWA built to minimize decision fatigue. Instead of fixed clock times, tasks follow a flexible sequence triggered by the previous one — you only ever see the one thing to do now, start it with the smallest possible step, and let the next one follow.

🔗 **Live Demo**: [lilsycz.github.io/GoGo--Day-Chain](https://lilsycz.github.io/GoGo--Day-Chain/)

---

## Features

- **Anchor-based sequence** — Tasks flow in order, not by clock time. Only the current task is open; finishing it unlocks the next
- **Checklist tasks** — e.g. "Leave the house" only completes once every item is packed
- **Undo** — Step back to the previous task
- **Block library** — Insert extra blocks (meeting, call, break, errand, reading…) right after the current task via the sidebar, or create your own
- **Long-press to reorder** — Drag tasks into a new order
- **Edit mode** — Rename tasks, hints and checklist items in place; changes become your default chain
- **Bedtime checklist** — Pack-your-bag review with a "tomorrow's first thing" field for study and work
- **PWA support** — Add to the iPhone home screen and use it like an app
- **Light / dark theme** — Toggle from the top bar

---

## Tech Stack

- Vanilla HTML, CSS and JavaScript (ES modules, no build step)
- localStorage for persistence
- GitHub Pages for hosting

---

## Known Issues

- Progress doesn't reset automatically on a new day — use the reset button in the top bar

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
| `src/models/` | Default tasks, block templates, checklists | `Models/` |
| `src/store/store.js` | App state and every data action (no DOM) | `Store/ChainStore.swift` |
| `src/store/storage.js` | localStorage reads and writes | SwiftData |
| `src/views/` | UI for the chain, sidebar, bedtime, edit mode, jobs | `Views/` |
| `src/services/` | Network requests (job feed) | `Services/` |
| `src/styles/` | CSS | `Assets.xcassets` colors |

---

## Roadmap

- [x] Split into modules
- [ ] Auto-reset on a new day
- [ ] A "smallest first step" on every task
- [ ] Rest between tasks: pick when to be reminded, then "start now / later"
- [ ] English / Chinese UI
- [ ] Unified visual style
- [ ] Export / import data
- [ ] Native SwiftUI app for the App Store
