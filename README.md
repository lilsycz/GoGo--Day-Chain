# GoGo Day Chain

An anchor-based daily planning PWA built to minimize decision fatigue. Instead of fixed clock times, tasks follow a flexible sequence triggered by the previous one.

🔗 **Live Demo**: [lilsycz.github.io/GoGo--Day-Chain](https://lilsycz.github.io/GoGo--Day-Chain/)

---

## Features

- **Anchor-based sequence** — Tasks flow in order, not by clock time
- **Wake time selector** — Adjustable start from 7:30–9:30 in 30-minute increments
- **Drag sliders** — Log actual time spent per block; downstream estimates shift automatically
- **Block library** — Insert extra blocks (meeting, call, break, errand, reading) via sidebar
- **Bedtime checklist** — End-of-day review with a "tomorrow's first task" field
- **PWA support** — Installable on mobile, works offline
- **Dark mode** — Follows system preference

---

## Tech Stack

- Vanilla HTML (Inline CSS / JavaScript)
- localStorage for persistence
- GitHub Pages for hosting

---

## Known Issues

- localStorage persistence across reloads not yet fully implemented — state resets on page refresh

---

## Local Development

No build step needed. Open `index.html` directly in a browser, or use a local server:

```bash
npx serve .
```
