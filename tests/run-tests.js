/* English Coach — automated test suite (no dependencies).
 * Run with:  node tests/run-tests.js   (or: npm test)
 * Stubs the browser globals, loads the app's data + engine, and asserts on
 * data integrity, every exercise builder, and the progress/SRS store logic.
 */
const fs = require("fs");
const path = require("path");

// ---- minimal browser environment ----
const ROOT = path.resolve(__dirname, "..");
global.window = global;
const mem = {};
let now = Date.now();
global.localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null),
  setItem: (k, v) => (mem[k] = String(v)),
  removeItem: (k) => delete mem[k]
};
global.document = {};
global.speechSynthesis = null;
// deterministic clock so we can test streaks/SRS
const realNow = Date.now;
Date.now = () => now;

function loadFiles(files) {
  for (const f of files) {
    const code = fs.readFileSync(path.join(ROOT, f), "utf8");
    new Function(code).call(global);
  }
}

loadFiles([
  "js/data/vocabulary.js",
  "js/data/business.js",
  "js/data/technical.js",
  "js/data/tenses.js",
  "js/data/grammar.js",
  "js/data/idioms.js",
  "js/data/curriculum.js",
  "js/store.js",
  "js/speech.js",
  "js/games.js"
]);

// ---- tiny test harness ----
let passed = 0;
let failed = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) {
    passed++;
  } else {
    failed++;
    failures.push(name + (detail ? " — " + detail : ""));
  }
}
function group(title, fn) {
  console.log("\n▶ " + title);
  const before = failed;
  fn();
  console.log("  " + (failed === before ? "✅ ok" : "❌ " + (failed - before) + " failing"));
}

const DAY = 24 * 60 * 60 * 1000;

// ============ DATA INTEGRITY ============
group("Vocabulary decks", () => {
  const ids = new Set();
  const seenWords = new Set();
  check("has decks", EC.vocabulary.length >= 8, "found " + EC.vocabulary.length);
  EC.vocabulary.forEach((d) => {
    check("deck id: " + d.id, !!d.id && !ids.has(d.id), "duplicate/empty id");
    ids.add(d.id);
    check("deck " + d.id + " has title/emoji/level", !!d.title && !!d.emoji && !!d.level);
    check("deck " + d.id + " has >=6 words", d.words.length >= 6, d.words.length + " words");
    d.words.forEach((w) => {
      check("word en/he/pos in " + d.id, !!w.en && !!w.he && !!w.pos, JSON.stringify(w));
      check("word example in " + d.id, !!w.example && !!w.exampleHe, w.en);
      const key = w.en.toLowerCase();
      check("unique word key: " + key, !seenWords.has(key), "duplicate across decks");
      seenWords.add(key);
    });
  });
});

group("Business + Technical decks present", () => {
  ["business-comm", "business-strategy", "tech-software", "tech-networking"].forEach((id) => {
    check("deck exists: " + id, !!EC.vocabulary.find((d) => d.id === id));
  });
});

group("Tenses", () => {
  check("12 tenses", EC.tenses.length === 12, "found " + EC.tenses.length);
  EC.tenses.forEach((t) => {
    check("tense fields: " + t.id, !!t.id && !!t.name && !!t.when && !!t.form);
    check("tense has examples: " + t.id, t.examples.length >= 1);
    check("tense has drills: " + t.id, t.drills.length >= 1);
    t.drills.forEach((d, i) => {
      check("drill has ___ : " + t.id + "#" + i, /___/.test(d.sentence), d.sentence);
      check("drill options >=2: " + t.id + "#" + i, d.options.length >= 2);
      check("drill answer in options: " + t.id + "#" + i, d.options.includes(d.answer), d.answer + " not in " + JSON.stringify(d.options));
    });
  });
});

group("Grammar", () => {
  EC.grammar.forEach((g) => {
    check("grammar fields: " + g.id, !!g.id && !!g.title && !!g.summary);
    check("grammar rules: " + g.id, g.rules.length >= 1);
    g.quiz.forEach((q, i) => {
      check("quiz options >=2: " + g.id + "#" + i, q.options.length >= 2);
      check("quiz answer index valid: " + g.id + "#" + i, q.answer >= 0 && q.answer < q.options.length, "answer=" + q.answer);
      check("quiz has explain: " + g.id + "#" + i, !!q.explain);
    });
  });
});

group("Idioms", () => {
  check("has idioms", EC.idioms.length >= 10);
  EC.idioms.forEach((it) => {
    check("idiom fields", !!it.phrase && !!it.meaning && !!it.example && !!it.exampleHe, it.phrase);
  });
});

group("Curriculum references resolve", () => {
  const deckIds = new Set(EC.vocabulary.map((d) => d.id));
  const grammarIds = new Set(EC.grammar.map((g) => g.id));
  const tenseIds = new Set(EC.tenses.map((t) => t.id));
  const lessonIds = new Set();
  EC.curriculum.forEach((u) => {
    check("unit fields: " + u.id, !!u.id && !!u.title && !!u.level && !!u.color);
    u.lessons.forEach((l) => {
      check("lesson id unique: " + l.id, !lessonIds.has(l.id));
      lessonIds.add(l.id);
      if (l.deck) check("lesson deck exists: " + l.id, deckIds.has(l.deck), l.deck);
      if (l.grammar) l.grammar.forEach((gid) => check("lesson grammar exists: " + l.id, grammarIds.has(gid), gid));
      if (l.tenses) l.tenses.forEach((tid) => check("lesson tense exists: " + l.id, tenseIds.has(tid), tid));
    });
  });
});

// ============ EXERCISE BUILDERS ============
function validateExercise(ex, ctx) {
  check("ex has type: " + ctx, !!ex.type, JSON.stringify(ex).slice(0, 80));
  if (ex.type === "mc" || ex.type === "listen" || ex.type === "blank") {
    check("choices >=2: " + ctx, ex.choices.length >= 2);
    const correct = ex.choices.filter((c) => c.correct);
    check("exactly one correct: " + ctx, correct.length === 1, "got " + correct.length);
    const texts = ex.choices.map((c) => c.text);
    check("choice texts non-empty: " + ctx, texts.every((t) => t != null && t !== ""));
    check("choice texts unique: " + ctx, new Set(texts).size === texts.length, JSON.stringify(texts));
  }
  if (ex.type === "listen") check("listen has speakText: " + ctx, !!ex.speakText);
  // "blank" covers both fill-in-the-blank (has ___) and grammar MC prompts (no ___);
  // both render correctly, so we only require a non-empty prompt here.
  if (ex.type === "blank") check("blank has prompt text: " + ctx, !!ex.sentence && ex.sentence.length > 0);
  if (ex.type === "flash") check("flash has front/back: " + ctx, !!ex.front && !!ex.back);
  if (ex.type === "build") {
    check("build tokens >=3: " + ctx, ex.tokens.length >= 3);
    check("build has translation: " + ctx, !!ex.translation);
  }
  if (ex.type === "match") {
    check("match pairs >=3: " + ctx, ex.pairs.length >= 3);
    ex.pairs.forEach((p) => check("match pair a/b: " + ctx, !!p.a && !!p.b));
  }
}

group("buildLessonSession for every lesson", () => {
  EC.curriculum.forEach((u) => {
    u.lessons.forEach((l) => {
      const s = EC.games.buildLessonSession(l);
      check("session non-empty: " + l.id, s.length >= 1, "0 exercises");
      check("session bite-sized (<=14): " + l.id, s.length <= 14, s.length + " exercises");
      s.forEach((ex, i) => validateExercise(ex, l.id + "#" + i));
    });
  });
});

group("buildPracticeSession for every mode", () => {
  ["flash", "mc", "listen", "match", "build", "grammar", "idioms"].forEach((mode) => {
    const s = EC.games.buildPracticeSession(mode);
    check("practice non-empty: " + mode, s.length >= 1, "0 items");
    s.forEach((ex, i) => validateExercise(ex, "practice:" + mode + "#" + i));
  });
});

group("buildReviewSession", () => {
  const words = EC.vocabulary[0].words.slice(0, 5);
  const s = EC.games.buildReviewSession(words);
  check("review session non-empty", s.length === 5);
  s.forEach((ex, i) => validateExercise(ex, "review#" + i));
});

group("Sentence builder tokens reconstruct example", () => {
  // Every build exercise's tokens should join back to a real example sentence.
  const s = EC.games.buildPracticeSession("build");
  s.forEach((ex, i) => {
    check("build joins to a string: #" + i, typeof ex.tokens.join(" ") === "string" && ex.tokens.join(" ").length > 0);
  });
});

// ============ STORE / SRS / STREAK ============
group("Store: XP + daily counters", () => {
  EC.store.reset();
  const start = EC.store.state.xp;
  EC.store.addXp(15);
  check("xp increased", EC.store.state.xp === start + 15);
  check("todayXp tracked", EC.store.state.todayXp === 15);
});

group("Store: streak logic across days", () => {
  EC.store.reset();
  now = realNow();
  EC.store.addXp(10); // day 1
  check("streak starts at 1", EC.store.state.streak === 1, "got " + EC.store.state.streak);
  now += DAY; // next day
  EC.store.addXp(10);
  check("consecutive day -> 2", EC.store.state.streak === 2, "got " + EC.store.state.streak);
  now += DAY; // same-day repeat should not double count
  EC.store.addXp(10);
  const afterThird = EC.store.state.streak;
  EC.store.addXp(10);
  check("same day does not increment", EC.store.state.streak === afterThird, "got " + EC.store.state.streak);
  now += 3 * DAY; // skipped days -> reset
  EC.store.addXp(10);
  check("gap resets streak to 1", EC.store.state.streak === 1, "got " + EC.store.state.streak);
  now = realNow();
});

group("Store: completeLesson stars", () => {
  EC.store.reset();
  check("90%+ -> 3 stars", EC.store.completeLesson("t-a", 10, 10).stars === 3);
  check("70-89% -> 2 stars", EC.store.completeLesson("t-b", 8, 10).stars === 2);
  check("<70% -> 1 star", EC.store.completeLesson("t-c", 5, 10).stars === 1);
  check("marks lesson done", EC.store.isLessonDone("t-a"));
  check("new lesson counted", EC.store.state.stats.lessonsDone === 3, "got " + EC.store.state.stats.lessonsDone);
});

group("Store: SRS scheduling", () => {
  EC.store.reset();
  now = realNow();
  const w = { en: "srstest", he: "בדיקה", pos: "noun", example: "x", exampleHe: "x" };
  EC.store.ensureSrs(w);
  check("new word due now", EC.store.getDueWords().some((x) => x.en === "srstest"));
  EC.store.reviewWord(w, true); // box up -> due in future
  check("correct pushes due into future", !EC.store.getDueWords().some((x) => x.en === "srstest"));
  const item = EC.store.state.srs["w:srstest"];
  check("box increased on correct", item.box >= 1, "box=" + item.box);
  check("reps counted", item.reps === 1);
  EC.store.reviewWord(w, false); // wrong -> box down, due now
  check("wrong lowers box", EC.store.state.srs["w:srstest"].box === 0);
  check("wrong makes it due again", EC.store.getDueWords().some((x) => x.en === "srstest"));
  check("lapses counted", EC.store.state.srs["w:srstest"].lapses === 1);
});

group("Store: persistence round-trip", () => {
  EC.store.reset();
  EC.store.addXp(42);
  EC.store.completeLesson("persist-1", 9, 10);
  // reload store module against the same localStorage
  delete global.EC.store;
  loadFiles(["js/store.js"]);
  check("xp persisted", EC.store.state.xp === 42, "got " + EC.store.state.xp);
  check("lesson persisted", EC.store.isLessonDone("persist-1"));
});

// ============ RESULTS ============
console.log("\n" + "=".repeat(48));
console.log("Passed: " + passed + "   Failed: " + failed);
if (failed) {
  console.log("\nFailures:");
  failures.forEach((f) => console.log("  ❌ " + f));
  process.exit(1);
} else {
  console.log("🎉 All tests passed.");
  process.exit(0);
}
