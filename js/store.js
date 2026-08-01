/* English Coach — Progress store (multi-profile)
 * Each profile has its own XP, streak, daily goal, completed lessons, and
 * spaced-repetition schedule. A registry tracks all profiles + the active one.
 * Persists to localStorage. Migrates the old single-user save into a profile.
 */
window.EC = window.EC || {};

EC.store = (function () {
  const REG_KEY = "english-coach:reg";
  const LEGACY_KEY = "english-coach:v1";
  const stateKey = (id) => "english-coach:state:" + id;
  const DAY = 24 * 60 * 60 * 1000;
  const INTERVALS = [0, 1, 3, 7, 16, 35, 75];

  const FOCUS_OPTIONS = [
    "Vocabulary",
    "Grammar",
    "Tenses",
    "Speaking",
    "Listening",
    "Business",
    "Technical",
    "Idioms & Slang"
  ];

  const stateDefaults = {
    createdAt: Date.now(),
    xp: 0,
    streak: 0,
    lastActiveDay: null,
    dailyGoal: 30,
    todayXp: 0,
    todayDay: null,
    completed: {},
    srs: {},
    stats: { lessonsDone: 0, answersRight: 0, answersWrong: 0 },
    settings: { rate: 0.95 }
  };

  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  function genId() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  let reg = null; // { activeId, profiles: [ {id,name,avatar,level,focus,why,onboarded,createdAt} ] }
  let activeId = null;
  let state = null;

  function loadReg() {
    try {
      return JSON.parse(localStorage.getItem(REG_KEY));
    } catch (e) {
      return null;
    }
  }
  function saveReg() {
    try {
      localStorage.setItem(REG_KEY, JSON.stringify(reg));
    } catch (e) {}
  }
  function loadState(id) {
    try {
      const raw = localStorage.getItem(stateKey(id));
      if (!raw) return clone(stateDefaults);
      const parsed = JSON.parse(raw);
      return Object.assign(clone(stateDefaults), parsed, {
        settings: Object.assign({}, stateDefaults.settings, parsed.settings || {}),
        stats: Object.assign({}, stateDefaults.stats, parsed.stats || {})
      });
    } catch (e) {
      return clone(stateDefaults);
    }
  }
  function save() {
    try {
      localStorage.setItem(stateKey(activeId), JSON.stringify(state));
    } catch (e) {}
  }

  function makeProfile(meta) {
    meta = meta || {};
    return {
      id: genId(),
      name: meta.name || "You",
      avatar: meta.avatar || "🦅",
      level: meta.level || "A2",
      focus: meta.focus || [],
      why: meta.why || "",
      onboarded: !!meta.onboarded,
      createdAt: Date.now()
    };
  }

  function init() {
    reg = loadReg();
    if (!reg || !reg.profiles || !reg.profiles.length) {
      reg = { activeId: null, profiles: [] };
      const legacy = localStorage.getItem(LEGACY_KEY);
      const prof = makeProfile({ name: "You", onboarded: !!legacy });
      reg.profiles.push(prof);
      reg.activeId = prof.id;
      saveReg();
      if (legacy) {
        // migrate old single-user progress into this first profile
        try {
          localStorage.setItem(stateKey(prof.id), legacy);
        } catch (e) {}
      }
    }
    activeId = reg.activeId || reg.profiles[0].id;
    reg.activeId = activeId;
    state = loadState(activeId);
    rollTodayIfNeeded();
    save();
    saveReg();
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
  function touchStreak() {
    const today = dayString();
    if (state.lastActiveDay === today) return;
    if (state.lastActiveDay === dayString(Date.now() - DAY)) state.streak += 1;
    else state.streak = 1;
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

  // ---- spaced repetition ----
  function srsKey(word) {
    return "w:" + word.en.toLowerCase();
  }
  function ensureSrs(word) {
    const k = srsKey(word);
    if (!state.srs[k]) state.srs[k] = { box: 0, due: Date.now(), reps: 0, lapses: 0, word: word };
    else state.srs[k].word = word;
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
    state = clone(stateDefaults);
    state.createdAt = Date.now();
    save();
  }

  // ---- profiles ----
  function profiles() {
    return reg.profiles;
  }
  function activeProfile() {
    return reg.profiles.find((p) => p.id === activeId);
  }
  function needsOnboarding() {
    const p = activeProfile();
    return !p || !p.onboarded;
  }
  function setOnboarded(v) {
    const p = activeProfile();
    if (p) p.onboarded = v !== false;
    saveReg();
  }
  function updateActiveProfile(patch) {
    const p = activeProfile();
    if (!p) return;
    Object.assign(p, patch);
    saveReg();
  }
  function createProfile(meta) {
    const p = makeProfile(Object.assign({ onboarded: true }, meta));
    reg.profiles.push(p);
    saveReg();
    switchProfile(p.id);
    if (meta && meta.dailyGoal) {
      state.dailyGoal = meta.dailyGoal;
      save();
    }
    return p;
  }
  function switchProfile(id) {
    if (id === activeId) return;
    save(); // persist current
    activeId = id;
    reg.activeId = id;
    saveReg();
    state = loadState(id);
    rollTodayIfNeeded();
    save();
  }
  function deleteProfile(id) {
    if (reg.profiles.length <= 1) return false; // keep at least one
    reg.profiles = reg.profiles.filter((p) => p.id !== id);
    try {
      localStorage.removeItem(stateKey(id));
    } catch (e) {}
    if (activeId === id) {
      activeId = reg.profiles[0].id;
      reg.activeId = activeId;
      state = loadState(activeId);
      rollTodayIfNeeded();
      save();
    }
    saveReg();
    return true;
  }
  function profileStats(id) {
    const p = reg.profiles.find((x) => x.id === id);
    const s = id === activeId ? state : loadState(id);
    const st = s.stats || { answersRight: 0, answersWrong: 0, lessonsDone: 0 };
    const answered = st.answersRight + st.answersWrong;
    return {
      id: id,
      name: p ? p.name : "?",
      avatar: p ? p.avatar : "🙂",
      level: p ? p.level : "A2",
      xp: s.xp || 0,
      streak: s.streak || 0,
      lessonsDone: st.lessonsDone || 0,
      accuracy: answered ? Math.round((st.answersRight / answered) * 100) : 0
    };
  }
  function leaderboard() {
    return reg.profiles
      .map((p) => profileStats(p.id))
      .sort((a, b) => b.xp - a.xp || b.streak - a.streak);
  }

  init();

  return {
    get state() {
      return state;
    },
    FOCUS_OPTIONS,
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
    reset,
    // profiles
    profiles,
    activeProfile,
    activeId: () => activeId,
    needsOnboarding,
    setOnboarded,
    updateActiveProfile,
    createProfile,
    switchProfile,
    deleteProfile,
    profileStats,
    leaderboard
  };
})();
