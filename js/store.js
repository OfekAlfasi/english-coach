/* English Coach — Progress store
 * Persists to localStorage: XP, daily goal, streak, completed lessons,
 * and a spaced-repetition (SRS) schedule for vocabulary.
 * Streak + SRS logic inspired by Duolingo (habit loop) and half-life review.
 */
window.EC = window.EC || {};

EC.store = (function () {
  const KEY = "english-coach:v1";
  const DAY = 24 * 60 * 60 * 1000;
  // Leitner-style spacing (in days) — grows as you keep getting a word right.
  const INTERVALS = [0, 1, 3, 7, 16, 35, 75];

  const defaults = {
    createdAt: Date.now(),
    xp: 0,
    streak: 0,
    lastActiveDay: null, // yyyy-mm-dd
    dailyGoal: 30, // XP per day
    todayXp: 0,
    todayDay: null,
    completed: {}, // lessonId -> { stars, bestScore }
    srs: {}, // key -> { box, due, reps, lapses, word }
    stats: { lessonsDone: 0, answersRight: 0, answersWrong: 0 },
    settings: { rate: 0.95 }
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredCloneSafe(defaults);
      const parsed = JSON.parse(raw);
      return Object.assign(structuredCloneSafe(defaults), parsed, {
        settings: Object.assign({}, defaults.settings, parsed.settings || {}),
        stats: Object.assign({}, defaults.stats, parsed.stats || {})
      });
    } catch (e) {
      return structuredCloneSafe(defaults);
    }
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function dayString(ts) {
    const d = new Date(ts != null ? ts : Date.now());
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function rollTodayIfNeeded() {
    const today = dayString();
    if (state.todayDay !== today) {
      state.todayDay = today;
      state.todayXp = 0;
    }
  }

  // Called whenever the user does any activity — maintains the daily streak.
  function touchStreak() {
    const today = dayString();
    if (state.lastActiveDay === today) return; // already counted today
    if (state.lastActiveDay === dayString(Date.now() - DAY)) {
      state.streak += 1; // consecutive day
    } else {
      state.streak = 1; // reset (missed a day or first ever)
    }
    state.lastActiveDay = today;
    save();
  }

  function addXp(n) {
    rollTodayIfNeeded();
    state.xp += n;
    state.todayXp += n;
    touchStreak();
    save();
  }

  function recordAnswer(correct) {
    if (correct) state.stats.answersRight += 1;
    else state.stats.answersWrong += 1;
    save();
  }

  function completeLesson(lessonId, score, total) {
    const pct = total ? score / total : 0;
    const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
    const prev = state.completed[lessonId];
    const isNew = !prev;
    state.completed[lessonId] = {
      stars: Math.max(stars, prev ? prev.stars : 0),
      bestScore: Math.max(score, prev ? prev.bestScore : 0)
    };
    if (isNew) state.stats.lessonsDone += 1;
    save();
    return { stars, isNew };
  }

  function isLessonDone(lessonId) {
    return !!state.completed[lessonId];
  }

  // ---- Spaced repetition ----
  function srsKey(word) {
    return "w:" + word.en.toLowerCase();
  }

  function ensureSrs(word) {
    const k = srsKey(word);
    if (!state.srs[k]) {
      state.srs[k] = { box: 0, due: Date.now(), reps: 0, lapses: 0, word: word };
    } else {
      state.srs[k].word = word; // keep freshest content
    }
    return state.srs[k];
  }

  function reviewWord(word, correct) {
    const item = ensureSrs(word);
    if (correct) {
      item.box = Math.min(item.box + 1, INTERVALS.length - 1);
      item.reps += 1;
    } else {
      item.box = Math.max(0, item.box - 2);
      item.lapses += 1;
    }
    item.due = Date.now() + INTERVALS[item.box] * DAY;
    save();
    return item;
  }

  function getDueWords(limit) {
    const now = Date.now();
    const due = Object.values(state.srs)
      .filter((it) => it.due <= now && it.word)
      .sort((a, b) => a.due - b.due)
      .map((it) => it.word);
    return limit ? due.slice(0, limit) : due;
  }

  function dueCount() {
    const now = Date.now();
    return Object.values(state.srs).filter((it) => it.due <= now).length;
  }

  function setGoal(n) {
    state.dailyGoal = n;
    save();
  }

  function setRate(r) {
    state.settings.rate = r;
    save();
  }

  function reset() {
    state = structuredCloneSafe(defaults);
    state.createdAt = Date.now();
    save();
  }

  // Make sure today's counters are correct on load.
  rollTodayIfNeeded();
  save();

  return {
    get state() {
      return state;
    },
    save,
    addXp,
    recordAnswer,
    completeLesson,
    isLessonDone,
    ensureSrs,
    reviewWord,
    getDueWords,
    dueCount,
    setGoal,
    setRate,
    reset
  };
})();
