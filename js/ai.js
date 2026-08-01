/* English Coach — AI tutor (Google Gemini, bring-your-own-key).
 * The API key is stored ONLY in this browser (localStorage) and calls go
 * straight from the browser to Google. No server, no cost to the app owner.
 * Get a free key at https://aistudio.google.com/app/apikey
 */
window.EC = window.EC || {};

EC.ai = (function () {
  const KEY_STORE = "english-coach:ai";
  const DEFAULT_MODEL = "gemini-2.0-flash";

  function cfg() {
    try {
      return JSON.parse(localStorage.getItem(KEY_STORE)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveCfg(c) {
    try {
      localStorage.setItem(KEY_STORE, JSON.stringify(c));
    } catch (e) {}
  }
  function getKey() {
    return cfg().key || "";
  }
  function setKey(k) {
    const c = cfg();
    c.key = (k || "").trim();
    saveCfg(c);
  }
  function getModel() {
    return cfg().model || DEFAULT_MODEL;
  }
  function hasKey() {
    return !!getKey();
  }

  function focusText() {
    const p = EC.store.activeProfile ? EC.store.activeProfile() : null;
    if (!p) return "general English";
    const f = (p.focus && p.focus.length ? p.focus.join(", ") : "general English").toLowerCase();
    return f;
  }
  function levelText() {
    const p = EC.store.activeProfile ? EC.store.activeProfile() : null;
    return (p && p.level) || "A2";
  }
  function learnerName() {
    const p = EC.store.activeProfile ? EC.store.activeProfile() : null;
    return (p && p.name) || "the learner";
  }

  function systemPrompt(mode) {
    const base =
      "You are Coach, a warm, encouraging American English tutor. " +
      "The learner's name is " + learnerName() + ". Their level is " + levelText() +
      " (CEFR) and their native language is Hebrew. They want to focus on: " + focusText() + ". " +
      "Always use natural, everyday American English (contractions, common phrasal verbs). ";
    if (mode === "voice") {
      return (
        base +
        "This is a SPOKEN conversation. Reply in 1-2 short sentences that are easy to say out loud. " +
        "Do NOT use markdown, bullet points, or emojis. Keep it casual and always end with a simple question " +
        "to keep the learner talking. If they make a small mistake, briefly model the correct phrasing inside your reply " +
        "instead of listing corrections."
      );
    }
    return (
      base +
      "This is a WRITING practice chat. Reply in 1-3 friendly sentences and always ask a follow-up question. " +
      "If the learner's message has grammar, spelling, or word-choice mistakes, after your reply add a new line starting with " +
      "'📝 Fix:' followed by the corrected version of their sentence, then a new line 'Tip:' with one short, specific tip. " +
      "If there are no mistakes, add a new line '✅ Great English!'. If they write in Hebrew, answer their question but " +
      "encourage them to try it in English next time."
    );
  }

  // history: [{role:'user'|'model', text}]
  async function chat(history, mode) {
    if (!hasKey()) throw new Error("NO_KEY");
    const model = getModel();
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(model) +
      ":generateContent";
    // Gemini requires the conversation to start with a 'user' turn.
    let hist = history;
    const firstUser = hist.findIndex((m) => m.role === "user");
    if (firstUser > 0) hist = hist.slice(firstUser);
    const body = {
      systemInstruction: { parts: [{ text: systemPrompt(mode) }] },
      contents: hist.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      generationConfig: { temperature: 0.8, maxOutputTokens: 400, topP: 0.95 }
    };
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // recommended header auth — works for both AIza… and newer AQ.… keys
          "x-goog-api-key": getKey()
        },
        body: JSON.stringify(body)
      });
    } catch (e) {
      throw new Error("NETWORK");
    }
    if (!res.ok) {
      let msg = "HTTP " + res.status;
      try {
        const err = await res.json();
        if (err && err.error && err.error.message) msg = err.error.message;
      } catch (e) {}
      if (res.status === 400 || res.status === 403) throw new Error("BAD_KEY:" + msg);
      throw new Error(msg);
    }
    const data = await res.json();
    const text =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.map((p) => p.text || "").join("").trim();
    if (!text) throw new Error("EMPTY");
    return text;
  }

  // strip written corrections / markdown so the spoken reply sounds natural
  function speakable(text) {
    return text
      .replace(/📝[\s\S]*$/m, "")
      .replace(/✅.*$/m, "")
      .replace(/Tip:.*$/gim, "")
      .replace(/[*_#>`]/g, "")
      .trim();
  }

  return { getKey, setKey, hasKey, getModel, chat, speakable };
})();
