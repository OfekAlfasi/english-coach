# English Coach 🦅

A personal app to learn **American English** day-to-day — vocabulary, grammar, tenses, idioms & slang — built for a Hebrew speaker aiming for native-level fluency.

### ▶️ Live app: **https://ofekalfasi.github.io/english-coach/**

Open it on any phone or computer — no install required. To use it like a native app:

- **iPhone / iPad (Safari):** tap **Share** → **Add to Home Screen**.
- **Android (Chrome):** tap **⋮** menu → **Install app** / **Add to Home Screen**.
- **Desktop (Chrome/Edge):** click the **Install** icon in the address bar.

It then opens full-screen with its own icon and **works offline** after the first load. Your progress, streak, and review schedule are saved **on your own device** — no account needed.

Inspired by the best of the market: **Duolingo** (streaks, XP, spaced repetition, bite-sized games), **Babbel** (explicit grammar with Hebrew explanations), **Busuu** (CEFR-aligned A2→C1), and **Memrise** (native audio — here via built-in American text-to-speech).

## How to run

No build step, no install. Two options:

**Option A — just open it**
- Double-click `index.html`.

**Option B — local server (recommended, best audio support)**
```bash
cd english-coach
python3 -m http.server 5188
# then open http://localhost:5188
```

Your progress (XP, streak, review schedule) is saved in the browser's local storage on your device.

## What's inside

- **Home** — daily-goal ring, streak, XP, quick practice.
- **Learn** — 4 CEFR units (Foundations A2 → Sound Native C1), each with lessons mixing vocab, grammar & tenses.
- **Practice** — 7 game modes: Flashcards, Multiple Choice, Listening (US accent), Word Match, Sentence Builder, Grammar & Tenses drills, Idioms & Slang.
- **Smart Review** — spaced-repetition of the words you struggle with (Leitner/half-life scheduling).
- **Reference** — all 12 English tenses, grammar rules Hebrew speakers get wrong, every vocab deck, and an American idioms & slang list — each with 🔊 audio.
- **Settings** — daily goal, voice speed (🐢/🚶/🏃), reset progress.

## Add your own content

Everything is plain data files — edit and refresh:
- `js/data/vocabulary.js` — themed word decks (`en`, `he`, `pos`, `ipa`, `example`).
- `js/data/tenses.js` — the 12 tenses + fill-in-the-blank drills.
- `js/data/grammar.js` — grammar topics + quizzes.
- `js/data/idioms.js` — idioms, phrasal verbs, slang.
- `js/data/curriculum.js` — how lessons are grouped into units.

## Tech
Plain HTML / CSS / vanilla JS. American pronunciation uses the browser's Web Speech API (works best in Chrome/Safari).
