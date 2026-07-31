/* English Coach — App shell, router, and views. */
window.EC = window.EC || {};

EC.app = (function () {
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function mount() {
    return document.getElementById("view");
  }
  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  // ---------- top bar ----------
  function renderTopbar() {
    const s = EC.store.state;
    const bar = document.getElementById("topbar");
    bar.innerHTML = "";
    const brand = el("a", "brand");
    brand.href = "#/home";
    brand.innerHTML = "<span class='brand-logo'>🦅</span> English Coach";
    const stats = el("div", "top-stats");
    stats.appendChild(pill("🔥", s.streak, "streak"));
    stats.appendChild(pill("⭐", s.xp, "XP"));
    const due = EC.store.dueCount();
    stats.appendChild(pill("🔁", due, "due"));
    bar.appendChild(brand);
    bar.appendChild(stats);
  }
  function pill(icon, value, label) {
    const p = el("div", "top-pill");
    p.title = label;
    p.innerHTML = "<span class='pi'>" + icon + "</span><span class='pv'>" + value + "</span>";
    return p;
  }

  // ---------- bottom nav ----------
  function renderNav(active) {
    const nav = document.getElementById("nav");
    const items = [
      { id: "home", icon: "🏠", label: "Home" },
      { id: "learn", icon: "📚", label: "Learn" },
      { id: "practice", icon: "🎮", label: "Practice" },
      { id: "review", icon: "🔁", label: "Review" },
      { id: "reference", icon: "📖", label: "Reference" }
    ];
    nav.innerHTML = "";
    items.forEach((it) => {
      const a = el("a", "nav-item" + (active === it.id ? " active" : ""));
      a.href = "#/" + it.id;
      a.innerHTML = "<span class='nav-icon'>" + it.icon + "</span><span class='nav-label'>" + it.label + "</span>";
      nav.appendChild(a);
    });
  }

  // ---------- views ----------
  function viewHome() {
    renderNav("home");
    const s = EC.store.state;
    const m = mount();
    m.innerHTML = "";

    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const header = el("div", "hero");
    header.appendChild(el("div", "hero-greet", greet + " 👋"));
    header.appendChild(el("div", "hero-sub", "Let's sound more American today."));
    m.appendChild(header);

    // daily goal ring
    const goalPct = Math.min(100, Math.round((s.todayXp / s.dailyGoal) * 100));
    const goalCard = el("div", "card goal-card");
    const ring = el("div", "ring");
    ring.style.background =
      "conic-gradient(var(--brand) " + goalPct * 3.6 + "deg, var(--ring-bg) 0deg)";
    ring.appendChild(el("div", "ring-inner", "<div class='ring-pct'>" + goalPct + "%</div><div class='ring-lbl'>daily goal</div>"));
    const goalText = el("div", "goal-text");
    goalText.appendChild(el("div", "goal-xp", s.todayXp + " / " + s.dailyGoal + " XP today"));
    goalText.appendChild(el("div", "goal-hint", "🔥 " + s.streak + "-day streak · keep it alive!"));
    const contBtn = el("button", "btn btn-cta", "▶ Continue learning");
    contBtn.onclick = () => go("#/learn");
    goalText.appendChild(contBtn);
    goalCard.appendChild(ring);
    goalCard.appendChild(goalText);
    m.appendChild(goalCard);

    // quick actions
    const quick = el("div", "quick-grid");
    quick.appendChild(quickCard("🔁", "Smart Review", EC.store.dueCount() + " words due", () => go("#/review")));
    quick.appendChild(quickCard("🎧", "Listening", "American accent drills", () => go("#/practice/listen")));
    quick.appendChild(quickCard("🃏", "Flashcards", "Fast vocab review", () => go("#/practice/flash")));
    quick.appendChild(quickCard("🗽", "Idioms & Slang", "Sound like a local", () => go("#/practice/idioms")));
    m.appendChild(el("div", "section-title", "Quick practice"));
    m.appendChild(quick);

    // continue path — next lesson
    const next = nextLesson();
    if (next) {
      m.appendChild(el("div", "section-title", "Up next"));
      m.appendChild(lessonRow(next.unit, next.lesson));
    }

    // stats
    const st = s.stats;
    const acc = st.answersRight + st.answersWrong ? Math.round((st.answersRight / (st.answersRight + st.answersWrong)) * 100) : 0;
    const statCard = el("div", "card stats-card");
    statCard.appendChild(miniStat(st.lessonsDone, "lessons"));
    statCard.appendChild(miniStat(st.answersRight, "correct"));
    statCard.appendChild(miniStat(acc + "%", "accuracy"));
    m.appendChild(statCard);
  }

  function quickCard(icon, title, sub, onClick) {
    const c = el("div", "quick-card");
    c.innerHTML = "<div class='quick-icon'>" + icon + "</div><div class='quick-title'>" + title + "</div><div class='quick-sub'>" + sub + "</div>";
    c.onclick = onClick;
    return c;
  }
  function miniStat(v, l) {
    return el("div", "mini-stat", "<div class='mini-v'>" + v + "</div><div class='mini-l'>" + l + "</div>");
  }

  function nextLesson() {
    for (const unit of EC.curriculum) {
      for (const lesson of unit.lessons) {
        if (!EC.store.isLessonDone(lesson.id)) return { unit, lesson };
      }
    }
    // all done -> first lesson for review
    return { unit: EC.curriculum[0], lesson: EC.curriculum[0].lessons[0] };
  }

  function viewLearn() {
    renderNav("learn");
    const m = mount();
    m.innerHTML = "";
    m.appendChild(el("div", "page-title", "📚 Learning Path"));
    m.appendChild(el("div", "page-sub", "Structured units from A2 to C1 — vocabulary, grammar, and tenses."));
    EC.curriculum.forEach((unit) => {
      const done = unit.lessons.filter((l) => EC.store.isLessonDone(l.id)).length;
      const u = el("div", "unit");
      const head = el("div", "unit-head");
      head.style.setProperty("--unit-color", unit.color);
      head.innerHTML =
        "<div class='unit-badge' style='background:" + unit.color + "'>" + unit.level + "</div>" +
        "<div class='unit-titles'><div class='unit-title'>" + unit.title + "</div>" +
        "<div class='unit-progress'>" + done + " / " + unit.lessons.length + " lessons</div></div>";
      u.appendChild(head);
      unit.lessons.forEach((lesson) => u.appendChild(lessonRow(unit, lesson)));
      m.appendChild(u);
    });
  }

  function lessonRow(unit, lesson) {
    const meta = EC.store.state.completed[lesson.id];
    const row = el("div", "lesson-row");
    const stars = meta ? "★★★".slice(0, meta.stars) + "☆☆☆".slice(0, 3 - meta.stars) : "";
    row.innerHTML =
      "<div class='lesson-emoji' style='background:" + unit.color + "22;color:" + unit.color + "'>" + lesson.emoji + "</div>" +
      "<div class='lesson-info'><div class='lesson-name'>" + lesson.title + "</div>" +
      "<div class='lesson-stars'>" + (meta ? stars : "not started") + "</div></div>" +
      "<div class='lesson-go'>" + (meta ? "↺" : "▶") + "</div>";
    row.onclick = () => go("#/lesson/" + lesson.id);
    return row;
  }

  function findLesson(id) {
    for (const unit of EC.curriculum) {
      const lesson = unit.lessons.find((l) => l.id === id);
      if (lesson) return { unit, lesson };
    }
    return null;
  }

  function viewLesson(id) {
    document.getElementById("nav").innerHTML = "";
    const found = findLesson(id);
    const m = mount();
    if (!found) {
      m.innerHTML = "<div class='card'>Lesson not found.</div>";
      return;
    }
    const exercises = EC.games.buildLessonSession(found.lesson);
    EC.games.start(m, exercises, { title: found.lesson.title }, (res) => {
      EC.store.completeLesson(found.lesson.id, res.score, res.total);
      renderTopbar();
    });
  }

  function viewPractice() {
    renderNav("practice");
    const m = mount();
    m.innerHTML = "";
    m.appendChild(el("div", "page-title", "🎮 Practice Games"));
    m.appendChild(el("div", "page-sub", "Pick a game. Everything you practice feeds your Smart Review."));
    const modes = [
      { id: "flash", icon: "🃏", title: "Flashcards", sub: "Flip & recall vocabulary" },
      { id: "mc", icon: "✅", title: "Multiple Choice", sub: "Pick the right meaning" },
      { id: "listen", icon: "🎧", title: "Listening", sub: "Hear it, choose it (US accent)" },
      { id: "match", icon: "🧲", title: "Word Match", sub: "Match English to Hebrew" },
      { id: "build", icon: "🧱", title: "Sentence Builder", sub: "Native word order" },
      { id: "grammar", icon: "🔤", title: "Grammar & Tenses", sub: "Fill-in-the-blank drills" },
      { id: "idioms", icon: "🗽", title: "Idioms & Slang", sub: "Talk like an American" }
    ];
    const grid = el("div", "practice-grid");
    modes.forEach((mode) => {
      const c = el("div", "practice-card");
      c.innerHTML = "<div class='pc-icon'>" + mode.icon + "</div><div class='pc-title'>" + mode.title + "</div><div class='pc-sub'>" + mode.sub + "</div>";
      c.onclick = () => go("#/practice/" + mode.id);
      grid.appendChild(c);
    });
    m.appendChild(grid);
  }

  function viewPracticeMode(modeId) {
    document.getElementById("nav").innerHTML = "";
    const m = mount();
    const exercises = EC.games.buildPracticeSession(modeId);
    EC.games.start(m, exercises, { title: modeId }, () => renderTopbar());
  }

  function viewReview() {
    document.getElementById("nav").innerHTML = "";
    const m = mount();
    const due = EC.store.getDueWords(15);
    if (!due.length) {
      renderNav("review");
      m.innerHTML = "";
      const c = el("div", "card empty-card");
      c.innerHTML = "<div class='empty-emoji'>🎉</div><div class='empty-title'>All caught up!</div>" +
        "<div class='empty-sub'>No words are due for review right now. Finish a lesson to add new words to your review queue.</div>";
      const b = el("button", "btn btn-cta", "Go to lessons");
      b.onclick = () => go("#/learn");
      c.appendChild(b);
      m.appendChild(c);
      return;
    }
    const exercises = EC.games.buildReviewSession(due);
    EC.games.start(m, exercises, { title: "Smart Review" }, () => renderTopbar());
  }

  // ---------- reference ----------
  function viewReference() {
    renderNav("reference");
    const m = mount();
    m.innerHTML = "";
    m.appendChild(el("div", "page-title", "📖 Reference Library"));
    m.appendChild(el("div", "page-sub", "Look things up any time. Tap 🔊 to hear American pronunciation."));
    const grid = el("div", "ref-grid");
    grid.appendChild(refCard("⏱️", "The 12 Tenses", "Form, usage & Hebrew notes", "#/ref/tenses"));
    grid.appendChild(refCard("🔤", "Grammar Rules", "Common Hebrew-speaker mistakes", "#/ref/grammar"));
    grid.appendChild(refCard("📇", "Vocabulary Decks", "All themed word lists", "#/ref/vocab"));
    grid.appendChild(refCard("🗽", "Idioms & Slang", "Sound like a local", "#/ref/idioms"));
    grid.appendChild(refCard("⚙️", "Settings", "Daily goal & voice speed", "#/settings"));
    m.appendChild(grid);
  }
  function refCard(icon, title, sub, href) {
    const c = el("div", "quick-card");
    c.innerHTML = "<div class='quick-icon'>" + icon + "</div><div class='quick-title'>" + title + "</div><div class='quick-sub'>" + sub + "</div>";
    c.onclick = () => go(href);
    return c;
  }

  function backBtn(m, to) {
    const b = el("button", "back-btn", "← Back");
    b.onclick = () => go(to);
    m.appendChild(b);
  }
  function speak(text) {
    EC.speech.speak(text);
  }
  function sp(text) {
    return "<button class='inline-speak' onclick=\"EC.speech.speak('" + String(text).replace(/'/g, "\\'") + "')\">🔊</button>";
  }

  function viewRefTenses() {
    document.getElementById("nav").innerHTML = "";
    const m = mount();
    m.innerHTML = "";
    backBtn(m, "#/reference");
    m.appendChild(el("div", "page-title", "⏱️ The 12 Tenses"));
    EC.tenses.forEach((t) => {
      const c = el("div", "card ref-item");
      c.appendChild(el("div", "ref-item-head", "<span class='ref-badge'>" + t.level + "</span> <b>" + t.name + "</b>"));
      c.appendChild(el("div", "ref-when", t.when));
      c.appendChild(el("div", "ref-form", "<b>Form:</b> " + t.form.aff + "<br><span class='muted'>Neg:</span> " + t.form.neg + " · <span class='muted'>Q:</span> " + t.form.q));
      if (t.signals && t.signals.length)
        c.appendChild(el("div", "ref-signals", "🔑 " + t.signals.join(" · ")));
      const ex = el("div", "ref-examples");
      t.examples.forEach((e) => {
        const row = el("div", "ref-ex");
        row.innerHTML = sp(e.en) + " <span class='ex-en'>" + e.en + "</span><span class='ex-he'>" + e.he + "</span>";
        ex.appendChild(row);
      });
      c.appendChild(ex);
      m.appendChild(c);
    });
  }

  function viewRefGrammar() {
    document.getElementById("nav").innerHTML = "";
    const m = mount();
    m.innerHTML = "";
    backBtn(m, "#/reference");
    m.appendChild(el("div", "page-title", "🔤 Grammar Rules"));
    EC.grammar.forEach((g) => {
      const c = el("div", "card ref-item");
      c.appendChild(el("div", "ref-item-head", "<span class='ref-badge'>" + g.level + "</span> <b>" + g.title + "</b>"));
      c.appendChild(el("div", "ref-when", g.summary));
      const ul = el("ul", "ref-rules");
      g.rules.forEach((r) => ul.appendChild(el("li", null, r)));
      c.appendChild(ul);
      const ex = el("div", "ref-examples");
      g.examples.forEach((e) => {
        const row = el("div", "ref-ex");
        row.innerHTML = sp(e.en) + " <span class='ex-en'>" + e.en + "</span><span class='ex-he'>" + e.he + "</span>";
        ex.appendChild(row);
      });
      c.appendChild(ex);
      m.appendChild(c);
    });
  }

  function viewRefVocab() {
    document.getElementById("nav").innerHTML = "";
    const m = mount();
    m.innerHTML = "";
    backBtn(m, "#/reference");
    m.appendChild(el("div", "page-title", "📇 Vocabulary Decks"));
    EC.vocabulary.forEach((d) => {
      const c = el("div", "card ref-item");
      c.appendChild(el("div", "ref-item-head", d.emoji + " <b>" + d.title + "</b> <span class='ref-badge'>" + d.level + "</span>"));
      const list = el("div", "vocab-list");
      d.words.forEach((w) => {
        const row = el("div", "vocab-row");
        row.innerHTML =
          sp(w.en) +
          " <span class='v-en'>" + w.en + "</span>" +
          "<span class='v-pos'>" + w.pos + "</span>" +
          "<span class='v-he'>" + w.he + "</span>";
        list.appendChild(row);
      });
      c.appendChild(list);
      m.appendChild(c);
    });
  }

  function viewRefIdioms() {
    document.getElementById("nav").innerHTML = "";
    const m = mount();
    m.innerHTML = "";
    backBtn(m, "#/reference");
    m.appendChild(el("div", "page-title", "🗽 Idioms & Slang"));
    m.appendChild(el("div", "page-sub", "The stuff textbooks skip — this is how Americans actually talk."));
    const c = el("div", "card ref-item");
    const list = el("div", "vocab-list");
    EC.idioms.forEach((it) => {
      const row = el("div", "idiom-row");
      row.innerHTML =
        sp(it.phrase) +
        " <span class='v-en'>" + it.phrase + "</span>" +
        "<span class='v-pos'>" + it.register + "</span>" +
        "<span class='v-he'>" + it.meaning + "</span>" +
        "<div class='idiom-ex'>" + it.example + " — " + it.exampleHe + "</div>";
      list.appendChild(row);
    });
    c.appendChild(list);
    m.appendChild(c);
  }

  function viewSettings() {
    document.getElementById("nav").innerHTML = "";
    const s = EC.store.state;
    const m = mount();
    m.innerHTML = "";
    backBtn(m, "#/reference");
    m.appendChild(el("div", "page-title", "⚙️ Settings"));

    const goalCard = el("div", "card");
    goalCard.appendChild(el("div", "set-label", "Daily goal (XP)"));
    const goalRow = el("div", "goal-options");
    [10, 20, 30, 50].forEach((g) => {
      const b = el("button", "chip" + (s.dailyGoal === g ? " active" : ""), g + " XP");
      b.onclick = () => {
        EC.store.setGoal(g);
        viewSettings();
      };
      goalRow.appendChild(b);
    });
    goalCard.appendChild(goalRow);
    m.appendChild(goalCard);

    const voiceCard = el("div", "card");
    voiceCard.appendChild(el("div", "set-label", "Voice speed"));
    const vrow = el("div", "goal-options");
    [
      { r: 0.7, l: "🐢 Slow" },
      { r: 0.95, l: "🚶 Normal" },
      { r: 1.15, l: "🏃 Fast" }
    ].forEach((o) => {
      const b = el("button", "chip" + (Math.abs(s.settings.rate - o.r) < 0.01 ? " active" : ""), o.l);
      b.onclick = () => {
        EC.store.setRate(o.r);
        EC.speech.speak("This is how fast I'll speak.");
        viewSettings();
      };
      vrow.appendChild(b);
    });
    voiceCard.appendChild(vrow);
    const test = el("button", "btn btn-ghost", "🔊 Test American voice");
    test.onclick = () => EC.speech.speak("Hey! Let's get you sounding like a native.");
    voiceCard.appendChild(test);
    if (!EC.speech.supported())
      voiceCard.appendChild(el("div", "warn", "⚠️ Your browser doesn't support speech. Try Chrome/Safari."));
    m.appendChild(voiceCard);

    const dangerCard = el("div", "card");
    dangerCard.appendChild(el("div", "set-label", "Reset progress"));
    dangerCard.appendChild(el("div", "muted", "Erases XP, streak, and review data on this device."));
    const reset = el("button", "btn btn-danger", "Reset everything");
    reset.onclick = () => {
      if (confirm("Reset all progress? This cannot be undone.")) {
        EC.store.reset();
        renderTopbar();
        go("#/home");
      }
    };
    dangerCard.appendChild(reset);
    m.appendChild(dangerCard);
  }

  // ---------- router ----------
  function render() {
    document.onkeydown = null; // clear session key handler
    renderTopbar();
    const hash = location.hash || "#/home";
    const parts = hash.replace(/^#\//, "").split("/");
    const route = parts[0] || "home";
    window.scrollTo(0, 0);
    if (route === "home") return viewHome();
    if (route === "learn") return viewLearn();
    if (route === "lesson") return viewLesson(parts[1]);
    if (route === "practice") return parts[1] ? viewPracticeMode(parts[1]) : viewPractice();
    if (route === "review") return viewReview();
    if (route === "reference") return viewReference();
    if (route === "ref") {
      if (parts[1] === "tenses") return viewRefTenses();
      if (parts[1] === "grammar") return viewRefGrammar();
      if (parts[1] === "vocab") return viewRefVocab();
      if (parts[1] === "idioms") return viewRefIdioms();
    }
    if (route === "settings") return viewSettings();
    return viewHome();
  }

  function init() {
    window.addEventListener("hashchange", render);
    if (!location.hash) location.hash = "#/home";
    else render();
  }

  return { init, go, render };
})();

window.addEventListener("DOMContentLoaded", function () {
  EC.app.init();
});
