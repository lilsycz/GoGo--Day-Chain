# Go Go Day

An anchor-based daily planning PWA built to minimize decision fatigue. Instead of fixed clock times, tasks follow a flexible sequence triggered by the previous one. You only see the one thing to do now, start it with the smallest possible step, rest when you're done, and let the next one follow.

🔗 **Live Demo**: [lilsycz.github.io/GoGo--Day-Chain](https://lilsycz.github.io/GoGo--Day-Chain/)

---

## How it works

1. Tap **Start today**.
2. Do the one task on screen; its first step is on the card.
3. Rest as long as you like (no countdown). Write the next task's first step; get nudged if you want.
4. Repeat. **Swap**, push back or skip anytime.

---

## Features

- **Focus view**: only what's now and what's next
- **Calendar** (date, top left): each day as a ring of what you did; tap a day for its timeline
- **Edit** (✎): changes today only · hold ≡ to reorder · tap the dot/icon for color & icon · insert tray at the bottom
- **Templates**: save today as one, switch in one tap
- **Bedtime** (☾, top right): review today, then preview and edit tomorrow's whole chain (changes apply to tomorrow only)
- **Settings** (···): past days (what you did, with the note and first step as they were when you finished) · light / dark · English / 中文 · export / import · works offline

---

## Limitations

- Reminders only fire while the app is open.
- Data stays in this browser; export to back up.

---

## Development

```bash
python3 -m http.server 5173
```

Open http://localhost:5173. Vanilla JS modules, no build step. `src/store` = data, `src/views` = UI, `src/i18n` = text (laid out to mirror the planned SwiftUI app).

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
