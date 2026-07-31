/* English Coach — Game engine
 * Builds mixed exercise sessions from curriculum content and renders an
 * interactive session player (progress bar, hearts, XP, end screen).
 * Exercise types: mc, listen, blank, flash, match, build.
 */
window.EC = window.EC || {};

EC.games = (function () {
  // ---------- helpers ----------
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function sample(a, n) {
    return shuffle(a).slice(0, n);
  }
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function findDeck(id) {
    return EC.vocabulary.find((d) => d.id === id);
  }
  function findGrammar(id) {
    return EC.grammar.find((g) => g.id === id);
  }
  function findTense(id) {
    return EC.tenses.find((t) => t.id === id);
  }
  function allWords() {
    return EC.vocabulary.reduce((acc, d) => acc.concat(d.words), []);
  }

  // ---------- exercise generators ----------
  function mcFromWordMeaning(word, pool) {
    const others = sample(
      pool.filter((w) => w.he !== word.he),
      3
    ).map((w) => ({ text: w.he, correct: false }));
    const choices = shuffle(others.concat([{ text: word.he, correct: true }]));
    return {
      type: "mc",
      word: word,
      promptLabel: "What does this word mean?",
      promptMain: word.en,
      promptSub: word.ipa ? "🔊 " + word.ipa : "",
      speakText: word.en,
      choices: choices,
      explain: word.en + " = " + word.he + " · " + word.example
    };
  }

  function mcFromWordReverse(word, pool) {
    const others = sample(
      pool.filter((w) => w.en !== word.en),
      3
    ).map((w) => ({ text: w.en, correct: false }));
    const choices = shuffle(others.concat([{ text: word.en, correct: true }]));
    return {
      type: "mc",
      word: word,
      promptLabel: "Choose the English word",
      promptMain: word.he,
      promptSub: "",
      choices: choices,
      explain: word.he + " = " + word.en
    };
  }

  function listenFromWord(word, pool) {
    const others = sample(
      pool.filter((w) => w.en !== word.en),
      3
    ).map((w) => ({ text: w.en, correct: false }));
    const choices = shuffle(others.concat([{ text: word.en, correct: true }]));
    return {
      type: "listen",
      word: word,
      speakText: word.en,
      choices: choices,
      explain: "You heard: " + word.en + " (" + word.he + ")"
    };
  }

  function flashFromWord(word) {
    return {
      type: "flash",
      word: word,
      front: word.en,
      frontSub: word.ipa ? "🔊 " + word.ipa + " · " + word.pos : word.pos,
      back: word.he,
      backSub: word.example + "  —  " + word.exampleHe,
      speakText: word.en
    };
  }

  function blankFromDrill(drill, tense) {
    const choices = shuffle(
      drill.options.map((o) => ({ text: o, correct: o === drill.answer }))
    );
    return {
      type: "blank",
      promptLabel: tense ? tense.name : "Fill in the blank",
      sentence: drill.sentence,
      choices: choices,
      explain: "✔ " + drill.answer + (drill.hint ? " — " + drill.hint : "")
    };
  }

  function mcFromGrammar(q, grammar) {
    const choices = q.options.map((o, i) => ({ text: o, correct: i === q.answer }));
    return {
      type: "blank",
      promptLabel: grammar.title,
      sentence: q.prompt,
      choices: shuffle(choices),
      explain: "✔ " + q.options[q.answer] + " — " + q.explain
    };
  }

  function buildFromWord(word) {
    // Sentence builder from the example sentence (native word order practice).
    const clean = word.example.replace(/[.!?]$/, "");
    const tokens = clean.split(/\s+/);
    if (tokens.length < 3 || tokens.length > 8) return null;
    return {
      type: "build",
      tokens: tokens,
      speakText: word.example,
      translation: word.exampleHe
    };
  }

  function mcFromIdiom(item, pool) {
    const others = sample(
      pool.filter((w) => w.meaning !== item.meaning),
      3
    ).map((w) => ({ text: w.meaning, correct: false }));
    const choices = shuffle(others.concat([{ text: item.meaning, correct: true }]));
    return {
      type: "mc",
      promptLabel: "American expression — what does it mean?",
      promptMain: item.phrase,
      promptSub: item.register,
      speakText: item.phrase,
      choices: choices,
      explain: '"' + item.phrase + '" = ' + item.meaning + " · " + item.example
    };
  }

  // ---------- session builders ----------
  function buildLessonSession(lesson) {
    let ex = [];
    if (lesson.deck) {
      const deck = findDeck(lesson.deck);
      const pool = deck.words;
      const words = shuffle(pool);
      words.forEach((w, i) => {
        EC.store.ensureSrs(w);
        const kind = i % 4;
        if (kind === 0) ex.push(flashFromWord(w));
        else if (kind === 1) ex.push(mcFromWordMeaning(w, pool));
        else if (kind === 2) ex.push(listenFromWord(w, pool));
        else ex.push(mcFromWordReverse(w, pool));
      });
      // a couple of sentence-builders for word order
      shuffle(pool)
        .map(buildFromWord)
        .filter(Boolean)
        .slice(0, 2)
        .forEach((b) => ex.push(b));
    }
    if (lesson.grammar) {
      lesson.grammar.forEach((gid) => {
        const g = findGrammar(gid);
        if (g) g.quiz.forEach((q) => ex.push(mcFromGrammar(q, g)));
      });
    }
    if (lesson.tenses) {
      lesson.tenses.forEach((tid) => {
        const t = findTense(tid);
        if (t) t.drills.forEach((d) => ex.push(blankFromDrill(d, t)));
      });
    }
    if (lesson.idioms) {
      const pool = EC.idioms;
      sample(pool, 8).forEach((it) => ex.push(mcFromIdiom(it, pool)));
    }
    ex = shuffle(ex);
    // Keep bite-sized: cap length.
    return ex.slice(0, 14);
  }

  function buildReviewSession(words) {
    const pool = allWords();
    return shuffle(
      words.map((w, i) =>
        i % 3 === 0 ? listenFromWord(w, pool) : i % 3 === 1 ? mcFromWordMeaning(w, pool) : flashFromWord(w)
      )
    );
  }

  function buildPracticeSession(mode) {
    const words = allWords();
    const pool = words;
    if (mode === "flash") return sample(words, 12).map(flashFromWord);
    if (mode === "mc") return sample(words, 12).map((w) => mcFromWordMeaning(w, pool));
    if (mode === "listen") return sample(words, 12).map((w) => listenFromWord(w, pool));
    if (mode === "match") {
      const chunks = [];
      const chosen = sample(words, 20);
      for (let i = 0; i < chosen.length; i += 5) {
        const group = chosen.slice(i, i + 5);
        if (group.length >= 3) chunks.push({ type: "match", pairs: group.map((w) => ({ a: w.en, b: w.he, speak: w.en })) });
      }
      return chunks;
    }
    if (mode === "build") {
      return sample(words, 30)
        .map(buildFromWord)
        .filter(Boolean)
        .slice(0, 8);
    }
    if (mode === "grammar") {
      let ex = [];
      EC.grammar.forEach((g) => g.quiz.forEach((q) => ex.push(mcFromGrammar(q, g))));
      EC.tenses.forEach((t) => t.drills.forEach((d) => ex.push(blankFromDrill(d, t))));
      return sample(ex, 12);
    }
    if (mode === "idioms") {
      return sample(EC.idioms, 12).map((it) => mcFromIdiom(it, EC.idioms));
    }
    return sample(words, 10).map((w) => mcFromWordMeaning(w, pool));
  }

  // ---------- session player ----------
  const XP = { mc: 10, listen: 10, blank: 10, flash: 6, match: 16, build: 16 };

  function start(mount, exercises, meta, onDone) {
    meta = meta || {};
    const state = { i: 0, score: 0, xp: 0, mistakes: 0, total: exercises.length };
    if (!exercises.length) {
      mount.innerHTML = "<div class='card'>Nothing to practice right now. 🎉</div>";
      if (onDone) onDone(state);
      return;
    }

    const wrap = el("div", "session");
    const top = el("div", "session-top");
    const bar = el("div", "progress");
    const fill = el("div", "progress-fill");
    bar.appendChild(fill);
    const hearts = el("div", "hearts");
    const closeBtn = el("button", "icon-btn", "✕");
    closeBtn.title = "Exit session";
    closeBtn.onclick = () => EC.app.go("#/home");
    top.appendChild(closeBtn);
    top.appendChild(bar);
    top.appendChild(hearts);
    wrap.appendChild(top);

    const stage = el("div", "stage");
    wrap.appendChild(stage);

    const footer = el("div", "session-footer");
    wrap.appendChild(footer);

    mount.innerHTML = "";
    mount.appendChild(wrap);

    function renderHearts() {
      const max = 5;
      const left = Math.max(0, max - state.mistakes);
      hearts.innerHTML = "";
      for (let i = 0; i < max; i++) {
        hearts.appendChild(el("span", "heart" + (i < left ? "" : " lost"), i < left ? "❤️" : "🤍"));
      }
    }
    function renderProgress() {
      fill.style.width = Math.round((state.i / state.total) * 100) + "%";
    }

    function next() {
      state.i++;
      if (state.i >= state.total) return finish();
      renderProgress();
      render();
    }

    function grade(correct, ex, xpGain) {
      EC.store.recordAnswer(correct);
      if (ex && ex.word) EC.store.reviewWord(ex.word, correct);
      if (correct) {
        state.score++;
        const g = xpGain != null ? xpGain : XP[ex.type] || 10;
        state.xp += g;
        EC.store.addXp(g);
      } else {
        state.mistakes++;
      }
      renderHearts();
    }

    function showFeedback(correct, explain, onNext) {
      footer.className = "session-footer " + (correct ? "good" : "bad");
      footer.innerHTML = "";
      const title = el("div", "fb-title", correct ? "✅ Nice!" : "❌ Not quite");
      const exp = el("div", "fb-explain", explain || "");
      const btn = el("button", "btn btn-cta", "Continue");
      btn.onclick = () => {
        footer.className = "session-footer";
        footer.innerHTML = "";
        onNext();
      };
      footer.appendChild(title);
      if (explain) footer.appendChild(exp);
      footer.appendChild(btn);
      // keyboard: Enter to continue
      footer._cont = btn;
    }

    function speakBtn(text) {
      const b = el("button", "speak-btn", "🔊");
      b.title = "Hear it (American English)";
      b.onclick = () => EC.speech.speak(text);
      return b;
    }

    // ---- per-type renderers ----
    function renderMC(ex) {
      stage.innerHTML = "";
      const card = el("div", "ex-card");
      card.appendChild(el("div", "ex-label", ex.promptLabel || ""));
      const main = el("div", "ex-main");
      main.appendChild(el("span", null, ex.promptMain));
      if (ex.speakText) main.appendChild(speakBtn(ex.speakText));
      card.appendChild(main);
      if (ex.promptSub) card.appendChild(el("div", "ex-sub", ex.promptSub));
      const opts = el("div", "options");
      let answered = false;
      ex.choices.forEach((c) => {
        const b = el("button", "option", c.text);
        b.onclick = () => {
          if (answered) return;
          answered = true;
          Array.from(opts.children).forEach((x) => (x.disabled = true));
          b.classList.add(c.correct ? "correct" : "wrong");
          if (!c.correct) {
            const right = Array.from(opts.children).find((x, idx) => ex.choices[idx].correct);
            if (right) right.classList.add("correct");
          }
          grade(c.correct, ex);
          showFeedback(c.correct, ex.explain, next);
        };
        opts.appendChild(b);
      });
      card.appendChild(opts);
      stage.appendChild(card);
      if (ex.speakText && ex.type !== "mc") EC.speech.speak(ex.speakText);
    }

    function renderListen(ex) {
      stage.innerHTML = "";
      const card = el("div", "ex-card");
      card.appendChild(el("div", "ex-label", "Listen and choose what you hear"));
      const big = el("button", "listen-big", "🔊");
      big.onclick = () => EC.speech.speak(ex.speakText);
      card.appendChild(big);
      const slow = el("button", "link-btn", "🐢 slower");
      slow.onclick = () => EC.speech.speak(ex.speakText, { rate: 0.6 });
      card.appendChild(slow);
      const opts = el("div", "options");
      let answered = false;
      ex.choices.forEach((c) => {
        const b = el("button", "option", c.text);
        b.onclick = () => {
          if (answered) return;
          answered = true;
          Array.from(opts.children).forEach((x) => (x.disabled = true));
          b.classList.add(c.correct ? "correct" : "wrong");
          if (!c.correct) {
            const right = Array.from(opts.children).find((x, idx) => ex.choices[idx].correct);
            if (right) right.classList.add("correct");
          }
          grade(c.correct, ex);
          showFeedback(c.correct, ex.explain, next);
        };
        opts.appendChild(b);
      });
      card.appendChild(opts);
      stage.appendChild(card);
      if (EC.speech.supported()) EC.speech.speak(ex.speakText);
    }

    function renderBlank(ex) {
      stage.innerHTML = "";
      const card = el("div", "ex-card");
      card.appendChild(el("div", "ex-label", ex.promptLabel || "Fill in the blank"));
      const sentence = ex.sentence.replace(/___/g, "<span class='blank'>_____</span>");
      card.appendChild(el("div", "ex-sentence", sentence));
      const opts = el("div", "options");
      let answered = false;
      ex.choices.forEach((c) => {
        const b = el("button", "option", c.text);
        b.onclick = () => {
          if (answered) return;
          answered = true;
          Array.from(opts.children).forEach((x) => (x.disabled = true));
          b.classList.add(c.correct ? "correct" : "wrong");
          if (!c.correct) {
            const right = Array.from(opts.children).find((x, idx) => ex.choices[idx].correct);
            if (right) right.classList.add("correct");
          }
          grade(c.correct, ex);
          const filled = ex.sentence.replace(/___/g, "<b>" + ex.choices.find((x) => x.correct).text + "</b>");
          if (c.correct && ex.speakText == null) EC.speech.speak(ex.sentence.replace(/___/g, ex.choices.find((x) => x.correct).text));
          showFeedback(c.correct, filled + "<br>" + ex.explain, next);
        };
        opts.appendChild(b);
      });
      card.appendChild(opts);
      stage.appendChild(card);
    }

    function renderFlash(ex) {
      stage.innerHTML = "";
      const card = el("div", "ex-card");
      card.appendChild(el("div", "ex-label", "Flashcard — do you know it?"));
      const flip = el("div", "flashcard");
      const front = el("div", "flash-face flash-front");
      front.appendChild(el("div", "flash-word", ex.front));
      if (ex.frontSub) front.appendChild(el("div", "flash-sub", ex.frontSub));
      const back = el("div", "flash-face flash-back");
      back.appendChild(el("div", "flash-word", ex.back));
      if (ex.backSub) back.appendChild(el("div", "flash-sub", ex.backSub));
      flip.appendChild(front);
      flip.appendChild(back);
      let flipped = false;
      flip.onclick = () => {
        flipped = !flipped;
        flip.classList.toggle("flipped", flipped);
        if (flipped) EC.speech.speak(ex.speakText);
        judge.style.display = flipped ? "flex" : "none";
      };
      card.appendChild(flip);
      const hintSpeak = speakBtn(ex.speakText);
      hintSpeak.classList.add("flash-speak");
      card.appendChild(hintSpeak);
      const tip = el("div", "ex-sub", "Tap the card to flip");
      card.appendChild(tip);
      const judge = el("div", "judge");
      judge.style.display = "none";
      const miss = el("button", "btn btn-ghost", "😕 Missed it");
      const got = el("button", "btn btn-cta", "😎 Got it");
      miss.onclick = () => {
        grade(false, ex, 0);
        showFeedback(false, ex.front + " = " + ex.back, next);
      };
      got.onclick = () => {
        grade(true, ex);
        next();
      };
      judge.appendChild(miss);
      judge.appendChild(got);
      card.appendChild(judge);
      stage.appendChild(card);
      EC.speech.speak(ex.speakText);
    }

    function renderMatch(ex) {
      stage.innerHTML = "";
      const card = el("div", "ex-card");
      card.appendChild(el("div", "ex-label", "Match the pairs"));
      const grid = el("div", "match-grid");
      const left = el("div", "match-col");
      const right = el("div", "match-col");
      const leftItems = shuffle(ex.pairs.map((p, i) => ({ text: p.a, id: i, speak: p.speak })));
      const rightItems = shuffle(ex.pairs.map((p, i) => ({ text: p.b, id: i })));
      let selected = null;
      let matched = 0;
      let mistakes = 0;
      function tile(item, side) {
        const b = el("button", "match-tile", item.text);
        b.onclick = () => {
          if (b.classList.contains("done")) return;
          if (side === "l" && item.speak) EC.speech.speak(item.speak);
          if (!selected) {
            selected = { item, node: b, side };
            b.classList.add("sel");
            return;
          }
          if (selected.side === side) {
            selected.node.classList.remove("sel");
            selected = { item, node: b, side };
            b.classList.add("sel");
            return;
          }
          // compare
          if (selected.item.id === item.id) {
            selected.node.classList.remove("sel");
            selected.node.classList.add("done");
            b.classList.add("done");
            selected = null;
            matched++;
            if (matched === ex.pairs.length) {
              const correct = mistakes === 0;
              grade(correct, ex, correct ? XP.match : 6);
              showFeedback(correct, correct ? "Perfect match!" : "Matched with " + mistakes + " slip(s).", next);
            }
          } else {
            mistakes++;
            const a = selected.node;
            a.classList.add("miss");
            b.classList.add("miss");
            const s = selected;
            selected = null;
            setTimeout(() => {
              a.classList.remove("miss", "sel");
              b.classList.remove("miss");
            }, 500);
          }
        };
        return b;
      }
      leftItems.forEach((it) => left.appendChild(tile(it, "l")));
      rightItems.forEach((it) => right.appendChild(tile(it, "r")));
      grid.appendChild(left);
      grid.appendChild(right);
      card.appendChild(grid);
      stage.appendChild(card);
    }

    function renderBuild(ex) {
      stage.innerHTML = "";
      const card = el("div", "ex-card");
      card.appendChild(el("div", "ex-label", "Build the sentence"));
      card.appendChild(el("div", "ex-sub", ex.translation));
      const answer = el("div", "build-answer");
      const bank = el("div", "build-bank");
      const picked = [];
      function refresh() {
        answer.innerHTML = "";
        picked.forEach((tok, idx) => {
          const t = el("button", "token", tok);
          t.onclick = () => {
            picked.splice(idx, 1);
            bankTokens.push(tok);
            renderBank();
            refresh();
          };
          answer.appendChild(t);
        });
      }
      let bankTokens = shuffle(ex.tokens.slice());
      function renderBank() {
        bank.innerHTML = "";
        bankTokens.forEach((tok, idx) => {
          const t = el("button", "token", tok);
          t.onclick = () => {
            picked.push(tok);
            bankTokens.splice(idx, 1);
            renderBank();
            refresh();
          };
          bank.appendChild(t);
        });
      }
      renderBank();
      card.appendChild(answer);
      card.appendChild(bank);
      const check = el("button", "btn btn-cta", "Check");
      check.onclick = () => {
        if (picked.length !== ex.tokens.length) return;
        const correct = picked.join(" ") === ex.tokens.join(" ");
        grade(correct, ex);
        if (correct) EC.speech.speak(ex.speakText);
        showFeedback(correct, "✔ " + ex.tokens.join(" "), next);
      };
      card.appendChild(check);
      stage.appendChild(card);
    }

    function render() {
      const ex = exercises[state.i];
      if (ex.type === "mc") renderMC(ex);
      else if (ex.type === "listen") renderListen(ex);
      else if (ex.type === "blank") renderBlank(ex);
      else if (ex.type === "flash") renderFlash(ex);
      else if (ex.type === "match") renderMatch(ex);
      else if (ex.type === "build") renderBuild(ex);
    }

    function finish() {
      renderProgress();
      fill.style.width = "100%";
      const pct = Math.round((state.score / state.total) * 100);
      stage.innerHTML = "";
      footer.innerHTML = "";
      footer.className = "session-footer";
      const done = el("div", "done-card");
      done.appendChild(el("div", "done-emoji", pct >= 90 ? "🏆" : pct >= 70 ? "🎉" : "💪"));
      done.appendChild(el("div", "done-title", pct >= 90 ? "Outstanding!" : pct >= 70 ? "Well done!" : "Keep going!"));
      const stats = el("div", "done-stats");
      stats.appendChild(statPill("Accuracy", pct + "%"));
      stats.appendChild(statPill("XP earned", "+" + state.xp));
      stats.appendChild(statPill("Correct", state.score + "/" + state.total));
      done.appendChild(stats);
      const again = el("button", "btn btn-ghost", "🏠 Home");
      again.onclick = () => EC.app.go("#/home");
      done.appendChild(again);
      stage.appendChild(done);
      if (onDone) onDone(state);
    }

    function statPill(label, value) {
      const p = el("div", "stat-pill");
      p.appendChild(el("div", "stat-value", value));
      p.appendChild(el("div", "stat-label", label));
      return p;
    }

    // keyboard: Enter to continue when feedback shown
    document.onkeydown = (e) => {
      if (e.key === "Enter" && footer._cont && footer.className.indexOf("good") + footer.className.indexOf("bad") > -2) {
        footer._cont.click();
      }
    };

    renderHearts();
    renderProgress();
    render();
  }

  return {
    buildLessonSession,
    buildReviewSession,
    buildPracticeSession,
    start
  };
})();
