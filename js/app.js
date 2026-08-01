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
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // in-memory AI tutor chat histories, reset when the profile changes
  let tutorHistories = { write: null, talk: null };
  let tutorPid = null;
  function clearTutor() {
    tutorHistories = { write: null, talk: null };
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
    const p = EC.store.activeProfile();
    const av = el("a", "top-avatar");
    av.href = "#/profile";
    av.title = (p ? p.name : "Profile") + " — profiles & leaderboard";
    av.textContent = p ? p.avatar : "🙂";
    stats.appendChild(av);
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
      { id: "tutor", icon: "💬", label: "Tutor" },
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
  function curriculumProgress() {
    let total = 0,
      done = 0,
      next = null;
    for (const u of EC.curriculum) {
      for (const l of u.lessons) {
        total++;
        if (EC.store.isLessonDone(l.id)) done++;
        else if (!next) next = { unit: u, lesson: l };
      }
    }
    const currentUnit = next ? next.unit : EC.curriculum[EC.curriculum.length - 1];
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0, next, currentUnit };
  }

  function viewHome() {
    renderNav("home");
    const s = EC.store.state;
    const st = s.stats;
    const m = mount();
    m.innerHTML = "";
    const prog = curriculumProgress();
    const isNew = st.lessonsDone === 0 && s.xp === 0;

    // ---- adaptive hero ----
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const header = el("div", "hero");
    if (isNew) {
      header.appendChild(el("div", "hero-greet", "Welcome to English Coach 🦅"));
      header.appendChild(el("div", "hero-sub", "Your goal: understand and speak American English like a native — built one short lesson a day."));
    } else {
      header.appendChild(el("div", "hero-greet", greet + " 👋"));
      header.appendChild(
        el(
          "div",
          "hero-sub",
          "You're on <b>Level " + prog.currentUnit.level + "</b> · " + prog.done + "/" + prog.total + " lessons · 🔥 " + s.streak + "-day streak"
        )
      );
    }
    m.appendChild(header);

    // ---- "how it works" orientation (first-timers, or until dismissed) ----
    if (isNew || !s.settings.hideIntro) {
      const intro = el("div", "card intro-card");
      intro.appendChild(el("div", "intro-title", "How it works"));
      const rows = [
        ["📚", "Learn", "Follow the path from A2 → C1: vocabulary, grammar & tenses."],
        ["🎮", "Practice", "Quick games to drill what you've learned."],
        ["🔁", "Review", "We resurface tricky words right before you'd forget them."],
        ["📖", "Reference", "Look up any tense, rule, or idiom — with audio."]
      ];
      rows.forEach((r) => {
        const row = el("div", "intro-row");
        row.innerHTML = "<span class='intro-ic'>" + r[0] + "</span><span class='intro-tx'><b>" + r[1] + "</b> — " + r[2] + "</span>";
        intro.appendChild(row);
      });
      intro.appendChild(el("div", "intro-goal", "🎯 <b>Daily goal:</b> " + s.dailyGoal + " XP (about one lesson). Practice every day to grow your 🔥 streak."));
      const dismiss = el("button", "btn btn-ghost intro-dismiss", isNew ? "Let's start →" : "Got it, hide this");
      dismiss.onclick = () => {
        s.settings.hideIntro = true;
        EC.store.save();
        if (isNew && prog.next) go("#/lesson/" + prog.next.lesson.id);
        else viewHome();
      };
      intro.appendChild(dismiss);
      m.appendChild(intro);
    }

    // ---- where you stand (overall progress) ----
    const po = el("div", "card progress-overview");
    const poHead = el("div", "po-head");
    poHead.innerHTML =
      "<span class='po-badge' style='background:" + prog.currentUnit.color + "'>" + prog.currentUnit.level + "</span>" +
      "<span class='po-unit'>" + prog.currentUnit.title + "</span>" +
      "<span class='po-pct'>" + prog.pct + "%</span>";
    po.appendChild(poHead);
    const bar = el("div", "po-bar");
    const fill = el("div", "po-fill");
    fill.style.width = prog.pct + "%";
    fill.style.background = prog.currentUnit.color;
    bar.appendChild(fill);
    po.appendChild(bar);
    po.appendChild(el("div", "po-meta", prog.done + " of " + prog.total + " lessons complete across the whole course"));
    if (prog.next) po.appendChild(el("div", "po-next", "⏭️ Next up: <b>" + prog.next.lesson.title + "</b>"));
    else po.appendChild(el("div", "po-next", "🏆 You finished the whole course — keep reviewing to master it!"));
    m.appendChild(po);

    // ---- daily goal ring ----
    const goalPct = Math.min(100, Math.round((s.todayXp / s.dailyGoal) * 100));
    const goalCard = el("div", "card goal-card");
    const ring = el("div", "ring");
    ring.style.background = "conic-gradient(var(--brand) " + goalPct * 3.6 + "deg, var(--ring-bg) 0deg)";
    ring.appendChild(el("div", "ring-inner", "<div class='ring-pct'>" + goalPct + "%</div><div class='ring-lbl'>today</div>"));
    const goalText = el("div", "goal-text");
    goalText.appendChild(el("div", "goal-xp", s.todayXp + " / " + s.dailyGoal + " XP today"));
    goalText.appendChild(el("div", "goal-hint", goalPct >= 100 ? "✅ Daily goal reached — nice!" : "🔥 " + s.streak + "-day streak · finish a lesson to keep it alive"));
    const contBtn = el("button", "btn btn-cta", prog.next ? "▶ Continue learning" : "🔁 Review");
    contBtn.onclick = () => (prog.next ? go("#/lesson/" + prog.next.lesson.id) : go("#/review"));
    goalText.appendChild(contBtn);
    goalCard.appendChild(ring);
    goalCard.appendChild(goalText);
    m.appendChild(goalCard);

    // ---- AI tutor banner ----
    const tutorCard = el("div", "card tutor-banner");
    tutorCard.innerHTML =
      "<div class='tb-icon'>💬</div><div class='tb-text'><div class='tb-title'>AI Tutor</div>" +
      "<div class='tb-sub'>" +
      (EC.ai.hasKey() ? "Chat or talk with Coach, personalized to you" : "Practice real conversations — set up in 1 min") +
      "</div></div><div class='tb-go'>›</div>";
    tutorCard.onclick = () => go("#/tutor");
    m.appendChild(tutorCard);

    // ---- quick practice ----
    const quick = el("div", "quick-grid");
    quick.appendChild(quickCard("🔁", "Smart Review", EC.store.dueCount() + " words due", () => go("#/review")));
    quick.appendChild(quickCard("🎧", "Listening", "American accent drills", () => go("#/practice/listen")));
    quick.appendChild(quickCard("🃏", "Flashcards", "Fast vocab review", () => go("#/practice/flash")));
    quick.appendChild(quickCard("🗽", "Idioms & Slang", "Sound like a local", () => go("#/practice/idioms")));
    m.appendChild(el("div", "section-title", "Quick practice"));
    m.appendChild(quick);

    // ---- stats ----
    const acc = st.answersRight + st.answersWrong ? Math.round((st.answersRight / (st.answersRight + st.answersWrong)) * 100) : 0;
    const statCard = el("div", "card stats-card");
    statCard.appendChild(miniStat(st.lessonsDone, "lessons"));
    statCard.appendChild(miniStat(s.xp, "total XP"));
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

    const profCard = el("div", "card");
    profCard.appendChild(el("div", "set-label", "Profile & competition"));
    const ap = EC.store.activeProfile();
    profCard.appendChild(el("div", "muted", "Signed in as " + ap.avatar + " " + esc(ap.name) + " · Level " + ap.level + "."));
    const profBtn = el("button", "btn btn-ghost", "👤 Profiles & leaderboard");
    profBtn.onclick = () => go("#/profile");
    profCard.appendChild(profBtn);
    m.appendChild(profCard);

    const aiCard = el("div", "card");
    aiCard.appendChild(el("div", "set-label", "AI Tutor key"));
    aiCard.appendChild(el("div", "muted", EC.ai.hasKey() ? "✅ Gemini key connected." : "No key yet — the AI tutor is locked."));
    const aiBtn = el("button", "btn btn-ghost", EC.ai.hasKey() ? "💬 Open AI Tutor" : "🔑 Connect AI key");
    aiBtn.onclick = () => go("#/tutor");
    aiCard.appendChild(aiBtn);
    m.appendChild(aiCard);

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

  // ---------- profiles ----------
  const AVATARS = ["🦅", "😎", "🧑‍💻", "👩‍🎓", "🧑‍🎓", "🦉", "🚀", "🌟", "🐼", "🦊", "🐱", "🐧"];

  function buildProfileForm(opts) {
    const p = opts.profile;
    const data = {
      name: p ? p.name : "",
      avatar: p ? p.avatar : "🦅",
      level: p ? p.level : "A2",
      focus: p ? (p.focus || []).slice() : [],
      why: p ? p.why : "",
      dailyGoal: opts.dailyGoal || 30
    };
    const wrap = el("div", "card profile-form");

    wrap.appendChild(el("label", "form-label", "Your name"));
    const name = el("input", "form-input");
    name.type = "text";
    name.placeholder = "e.g. Ofek";
    name.value = data.name;
    name.oninput = () => (data.name = name.value);
    wrap.appendChild(name);

    wrap.appendChild(el("label", "form-label", "Pick an avatar"));
    const avRow = el("div", "emoji-row");
    AVATARS.forEach((e) => {
      const b = el("button", "emoji-opt" + (data.avatar === e ? " active" : ""), e);
      b.onclick = () => {
        data.avatar = e;
        Array.from(avRow.children).forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      };
      avRow.appendChild(b);
    });
    wrap.appendChild(avRow);

    wrap.appendChild(el("label", "form-label", "Your current level"));
    const lvRow = el("div", "goal-options");
    [["A2", "Beginner+"], ["B1", "Intermediate"], ["B2", "Upper-int."], ["C1", "Advanced"]].forEach((pair) => {
      const b = el("button", "chip" + (data.level === pair[0] ? " active" : ""), pair[0] + " · " + pair[1]);
      b.onclick = () => {
        data.level = pair[0];
        Array.from(lvRow.children).forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      };
      lvRow.appendChild(b);
    });
    wrap.appendChild(lvRow);

    wrap.appendChild(el("label", "form-label", "What do you want to work on?"));
    const fRow = el("div", "goal-options");
    EC.store.FOCUS_OPTIONS.forEach((opt) => {
      const b = el("button", "chip" + (data.focus.includes(opt) ? " active" : ""), opt);
      b.onclick = () => {
        const i = data.focus.indexOf(opt);
        if (i >= 0) data.focus.splice(i, 1);
        else data.focus.push(opt);
        b.classList.toggle("active");
      };
      fRow.appendChild(b);
    });
    wrap.appendChild(fRow);

    wrap.appendChild(el("label", "form-label", "Why are you learning? (optional)"));
    const why = el("textarea", "form-input");
    why.rows = 2;
    why.placeholder = "e.g. sound native at work, travel, interviews…";
    why.value = data.why;
    why.oninput = () => (data.why = why.value);
    wrap.appendChild(why);

    wrap.appendChild(el("label", "form-label", "Daily goal"));
    const gRow = el("div", "goal-options");
    [10, 20, 30, 50].forEach((g) => {
      const b = el("button", "chip" + (data.dailyGoal === g ? " active" : ""), g + " XP");
      b.onclick = () => {
        data.dailyGoal = g;
        Array.from(gRow.children).forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      };
      gRow.appendChild(b);
    });
    wrap.appendChild(gRow);

    const submit = el("button", "btn btn-cta form-submit", opts.submitLabel || "Save");
    submit.onclick = () => {
      if (!data.name.trim()) {
        name.focus();
        name.classList.add("err");
        return;
      }
      opts.onSubmit(data);
    };
    wrap.appendChild(submit);
    if (opts.onCancel) {
      const c = el("button", "btn btn-ghost", opts.cancelLabel || "Cancel");
      c.onclick = opts.onCancel;
      wrap.appendChild(c);
    }
    return wrap;
  }

  function viewOnboard() {
    document.getElementById("nav").innerHTML = "";
    const m = mount();
    m.innerHTML = "";
    const hero = el("div", "hero");
    hero.appendChild(el("div", "hero-greet", "Welcome to English Coach 🦅"));
    hero.appendChild(el("div", "hero-sub", "Let's set up your profile so I can tailor lessons and your AI tutor to you."));
    m.appendChild(hero);
    m.appendChild(
      buildProfileForm({
        profile: EC.store.activeProfile(),
        dailyGoal: EC.store.state.dailyGoal,
        submitLabel: "Start learning →",
        onSubmit: (d) => {
          EC.store.updateActiveProfile({
            name: d.name.trim(),
            avatar: d.avatar,
            level: d.level,
            focus: d.focus,
            why: d.why,
            onboarded: true
          });
          EC.store.setGoal(d.dailyGoal);
          renderTopbar();
          go("#/home");
        }
      })
    );
    const skip = el("button", "link-btn", "Skip for now");
    skip.onclick = () => {
      EC.store.updateActiveProfile({ onboarded: true });
      renderTopbar();
      go("#/home");
    };
    m.appendChild(skip);
  }

  function showProfileEditor(profile) {
    const m = mount();
    m.innerHTML = "";
    m.appendChild(el("div", "page-title", profile ? "✏️ Edit profile" : "➕ New profile"));
    m.appendChild(
      buildProfileForm({
        profile: profile,
        dailyGoal: profile ? EC.store.state.dailyGoal : 30,
        submitLabel: profile ? "Save changes" : "Create profile",
        cancelLabel: "Cancel",
        onCancel: () => viewProfile(),
        onSubmit: (d) => {
          if (profile) {
            EC.store.updateActiveProfile({
              name: d.name.trim(),
              avatar: d.avatar,
              level: d.level,
              focus: d.focus,
              why: d.why
            });
            EC.store.setGoal(d.dailyGoal);
          } else {
            EC.store.createProfile({
              name: d.name.trim(),
              avatar: d.avatar,
              level: d.level,
              focus: d.focus,
              why: d.why,
              dailyGoal: d.dailyGoal
            });
            clearTutor();
          }
          renderTopbar();
          viewProfile();
        }
      })
    );
  }

  function viewProfile() {
    renderNav("profile");
    const m = mount();
    m.innerHTML = "";
    m.appendChild(el("div", "page-title", "👤 Profiles"));
    const active = EC.store.activeProfile();

    const card = el("div", "card profile-card");
    card.innerHTML =
      "<div class='pf-av'>" + active.avatar + "</div>" +
      "<div class='pf-info'><div class='pf-name'>" + esc(active.name) + "</div>" +
      "<div class='pf-meta'>Level " + active.level +
      (active.focus && active.focus.length ? " · " + active.focus.map(esc).join(", ") : "") + "</div>" +
      (active.why ? "<div class='pf-why'>“" + esc(active.why) + "”</div>" : "") +
      "</div>";
    m.appendChild(card);

    const actions = el("div", "pf-actions");
    const edit = el("button", "btn btn-ghost", "✏️ Edit");
    edit.onclick = () => showProfileEditor(active);
    const create = el("button", "btn btn-ghost", "➕ New profile");
    create.onclick = () => showProfileEditor(null);
    actions.appendChild(edit);
    actions.appendChild(create);
    m.appendChild(actions);

    const profs = EC.store.profiles();
    if (profs.length > 1) {
      m.appendChild(el("div", "section-title", "Switch profile"));
      const list = el("div", "switch-list");
      profs.forEach((p) => {
        const row = el("div", "switch-row" + (p.id === active.id ? " active" : ""));
        row.innerHTML =
          "<span class='sw-av'>" + p.avatar + "</span><span class='sw-name'>" + esc(p.name) +
          "</span><span class='sw-lv'>" + p.level + "</span>";
        if (p.id !== active.id) {
          row.onclick = () => {
            EC.store.switchProfile(p.id);
            clearTutor();
            renderTopbar();
            viewProfile();
          };
        } else {
          row.appendChild(el("span", "sw-you", "you"));
        }
        list.appendChild(row);
      });
      m.appendChild(list);
    }

    m.appendChild(el("div", "section-title", "🏆 Leaderboard (this device)"));
    const lb = EC.store.leaderboard();
    const lbCard = el("div", "card lb-card");
    const medals = ["🥇", "🥈", "🥉"];
    lb.forEach((r, i) => {
      const row = el("div", "lb-row" + (r.id === active.id ? " me" : ""));
      row.innerHTML =
        "<span class='lb-rank'>" + (medals[i] || i + 1) + "</span>" +
        "<span class='lb-av'>" + r.avatar + "</span>" +
        "<span class='lb-name'>" + esc(r.name) + "</span>" +
        "<span class='lb-stat'>⭐ " + r.xp + "</span>" +
        "<span class='lb-stat'>🔥 " + r.streak + "</span>" +
        "<span class='lb-stat'>🎯 " + r.accuracy + "%</span>";
      lbCard.appendChild(row);
    });
    m.appendChild(lbCard);
    m.appendChild(
      el("div", "muted lb-note", "Add profiles for anyone sharing this device to compete. 🌍 Global competition across phones is coming next (cloud sync).")
    );
  }

  // ---------- AI tutor ----------
  function buildKeySetup(onDone) {
    const card = el("div", "card");
    card.appendChild(el("div", "set-label", "Connect your free AI key"));
    card.appendChild(
      el("div", "muted", "The AI tutor runs on Google Gemini. Grab a free key (about 1 minute) and paste it below — it's stored only on this device.")
    );
    const link = el("a", "link-btn", "🔗 Get a free Gemini key");
    link.href = "https://aistudio.google.com/app/apikey";
    link.target = "_blank";
    link.rel = "noopener";
    card.appendChild(link);
    const input = el("input", "form-input");
    input.type = "password";
    input.placeholder = "Paste your Gemini API key";
    input.value = EC.ai.getKey();
    card.appendChild(input);
    const save = el("button", "btn btn-cta", "Save key");
    save.onclick = () => {
      EC.ai.setKey(input.value);
      if (EC.ai.hasKey()) onDone();
      else input.classList.add("err");
    };
    card.appendChild(save);
    return card;
  }

  function viewTutor() {
    renderNav("tutor");
    const m = mount();
    m.innerHTML = "";
    m.appendChild(el("div", "page-title", "💬 AI Tutor"));
    m.appendChild(el("div", "page-sub", "Real conversations, personalized to your level and goals."));
    if (!EC.ai.hasKey()) {
      m.appendChild(buildKeySetup(() => viewTutor()));
      return;
    }
    const grid = el("div", "quick-grid");
    const w = el("div", "quick-card");
    w.innerHTML =
      "<div class='quick-icon'>✍️</div><div class='quick-title'>Writing Chat</div><div class='quick-sub'>Chat by text — I fix your grammar</div>";
    w.onclick = () => go("#/tutor/write");
    const t = el("div", "quick-card");
    t.innerHTML =
      "<div class='quick-icon'>🎙️</div><div class='quick-title'>Voice Talk</div><div class='quick-sub'>Speak with me out loud</div>";
    t.onclick = () => go("#/tutor/talk");
    grid.appendChild(w);
    grid.appendChild(t);
    m.appendChild(grid);
    const change = el("button", "link-btn", "⚙️ Change AI key");
    change.onclick = () => {
      const mm = mount();
      mm.innerHTML = "";
      mm.appendChild(el("div", "page-title", "AI settings"));
      mm.appendChild(buildKeySetup(() => viewTutor()));
    };
    m.appendChild(change);
    m.appendChild(el("div", "muted lb-note", "Powered by your own free Google Gemini key, stored only on this device."));
  }

  function getHistory(mode) {
    if (tutorPid !== EC.store.activeId()) {
      clearTutor();
      tutorPid = EC.store.activeId();
    }
    if (!tutorHistories[mode]) {
      const name = EC.store.activeProfile().name;
      const greet =
        mode === "talk"
          ? "Hey " + name + "! Let's chat out loud. Tap the mic and tell me about your day."
          : "Hi " + name + "! I'm Coach. Write anything in English and I'll reply and fix your mistakes. What's on your mind?";
      tutorHistories[mode] = [{ role: "model", text: greet, intro: true }];
    }
    return tutorHistories[mode];
  }

  function aiErr(err) {
    const msg = String((err && err.message) || err);
    if (msg === "NO_KEY") return "⚠️ Add your Gemini API key first (Tutor → Change AI key).";
    if (msg.indexOf("BAD_KEY") === 0) return "⚠️ That API key was rejected. Check it in Tutor settings.";
    if (msg === "NETWORK") return "⚠️ Network error — check your connection and try again.";
    if (msg === "EMPTY") return "⚠️ I didn't get a reply. Try rephrasing.";
    return "⚠️ Something went wrong: " + msg;
  }
  function formatMsg(t) {
    return esc(t).replace(/\n/g, "<br>");
  }

  function viewTutorWrite() {
    tutorChat("write");
  }
  function viewTutorTalk() {
    tutorChat("talk");
  }

  function tutorChat(mode) {
    const voice = mode === "talk";
    renderNav("tutor");
    const m = mount();
    m.innerHTML = "";
    if (!EC.ai.hasKey()) {
      m.appendChild(el("div", "page-title", "💬 AI Tutor"));
      m.appendChild(buildKeySetup(() => tutorChat(mode)));
      return;
    }
    const history = getHistory(mode);
    let pending = false;

    const wrap = el("div", "chat-wrap");
    const head = el("div", "chat-head");
    const back = el("button", "back-btn", "← Tutor");
    back.onclick = () => go("#/tutor");
    head.appendChild(back);
    head.appendChild(el("div", "chat-title", voice ? "🎙️ Voice Talk" : "✍️ Writing Chat"));
    wrap.appendChild(head);

    const msgs = el("div", "chat-msgs");
    wrap.appendChild(msgs);

    function renderMsgs() {
      msgs.innerHTML = "";
      history.forEach((msg) => {
        const b = el("div", "bubble " + (msg.role === "user" ? "me" : "ai"));
        const body = el("span", "bubble-text");
        body.innerHTML = formatMsg(msg.text);
        b.appendChild(body);
        if (msg.role === "model" && !msg.intro) {
          const sp = el("button", "bubble-speak", "🔊");
          sp.onclick = () => EC.speech.speak(EC.ai.speakable(msg.text));
          b.appendChild(sp);
        }
        msgs.appendChild(b);
      });
      if (pending) msgs.appendChild(el("div", "bubble ai typing", "Coach is typing…"));
      msgs.scrollTop = msgs.scrollHeight;
    }

    async function send(text) {
      text = (text || "").trim();
      if (!text || pending) return;
      history.push({ role: "user", text: text });
      pending = true;
      renderMsgs();
      try {
        const reply = await EC.ai.chat(
          history.filter((x) => !x.intro).map((x) => ({ role: x.role, text: x.text })),
          voice ? "voice" : "writing"
        );
        history.push({ role: "model", text: reply });
        pending = false;
        renderMsgs();
        if (voice) EC.speech.speak(EC.ai.speakable(reply));
      } catch (err) {
        pending = false;
        history.push({ role: "model", text: aiErr(err), intro: true });
        renderMsgs();
      }
    }

    const inputBar = el("div", "chat-input");
    if (!voice) {
      const ta = el("input", "chat-text");
      ta.type = "text";
      ta.placeholder = "Type in English…";
      const sb = el("button", "chat-send", "➤");
      sb.onclick = () => {
        const v = ta.value;
        ta.value = "";
        send(v);
      };
      ta.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sb.onclick();
        }
      };
      inputBar.appendChild(ta);
      inputBar.appendChild(sb);
    } else if (EC.speech.supportsRecognition()) {
      const status = el("div", "voice-status", "Tap the mic to speak");
      const mic = el("button", "mic-btn", "🎤");
      let rec = null,
        listening = false,
        finalText = "";
      mic.onclick = () => {
        if (listening) {
          if (rec) rec.stop();
          return;
        }
        rec = EC.speech.createRecognition();
        finalText = "";
        listening = true;
        mic.classList.add("live");
        status.textContent = "Listening… tap to stop";
        rec.onresult = (e) => {
          let interim = "";
          finalText = "";
          for (let i = 0; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) finalText += r[0].transcript;
            else interim += r[0].transcript;
          }
          status.textContent = finalText || interim || "…";
        };
        rec.onerror = (e) => {
          status.textContent = "Mic error: " + (e.error || "try again");
        };
        rec.onend = () => {
          listening = false;
          mic.classList.remove("live");
          const t = finalText.trim();
          if (t) {
            status.textContent = "Tap the mic to speak";
            send(t);
          } else {
            status.textContent = "Didn't catch that — tap to try again";
          }
        };
        try {
          rec.start();
        } catch (e) {
          listening = false;
          mic.classList.remove("live");
          status.textContent = "Couldn't start mic";
        }
      };
      const micWrap = el("div", "mic-wrap");
      micWrap.appendChild(mic);
      micWrap.appendChild(status);
      inputBar.appendChild(micWrap);
      const fb = el("input", "chat-text");
      fb.type = "text";
      fb.placeholder = "…or type instead";
      fb.onkeydown = (e) => {
        if (e.key === "Enter") {
          const v = fb.value;
          fb.value = "";
          send(v);
        }
      };
      inputBar.appendChild(fb);
    } else {
      inputBar.appendChild(
        el("div", "muted", "🎤 Voice input needs Chrome/Android. You can still type and I'll speak my replies.")
      );
      const ta = el("input", "chat-text");
      ta.type = "text";
      ta.placeholder = "Type in English…";
      const sb = el("button", "chat-send", "➤");
      sb.onclick = () => {
        const v = ta.value;
        ta.value = "";
        send(v);
      };
      ta.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sb.onclick();
        }
      };
      inputBar.appendChild(ta);
      inputBar.appendChild(sb);
    }
    wrap.appendChild(inputBar);
    m.appendChild(wrap);
    renderMsgs();
  }

  // ---------- router ----------
  function render() {
    document.onkeydown = null; // clear session key handler
    renderTopbar();
    const hash = location.hash || "#/home";
    const parts = hash.replace(/^#\//, "").split("/");
    const route = parts[0] || "home";
    window.scrollTo(0, 0);
    // force first-run onboarding until a profile is set up
    if (EC.store.needsOnboarding() && route !== "onboard") return viewOnboard();
    if (route === "onboard") return viewOnboard();
    if (route === "home") return viewHome();
    if (route === "learn") return viewLearn();
    if (route === "lesson") return viewLesson(parts[1]);
    if (route === "practice") return parts[1] ? viewPracticeMode(parts[1]) : viewPractice();
    if (route === "review") return viewReview();
    if (route === "reference") return viewReference();
    if (route === "profile") return viewProfile();
    if (route === "tutor") {
      if (parts[1] === "write") return viewTutorWrite();
      if (parts[1] === "talk") return viewTutorTalk();
      return viewTutor();
    }
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
