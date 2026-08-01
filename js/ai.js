/* English Coach — AI tutor (bring-your-own-key, no server).
 * Two providers you can choose from, both callable straight from the browser:
 *   • OpenRouter — FREE models, no credit card (recommended).  https://openrouter.ai/keys
 *   • Google Gemini — free tier varies by region/project.       https://aistudio.google.com/app/apikey
 * The key is stored ONLY in this browser (localStorage).
 */
window.EC = window.EC || {};

EC.ai = (function () {
  const STORE = "english-coach:ai";

  const PROVIDERS = {
    openrouter: {
      label: "OpenRouter — free, no card (recommended)",
      keyUrl: "https://openrouter.ai/keys",
      keyHint: "Sign up free with Google (no credit card). Create a key, paste it here. Use a model ending in “free”.",
      keyPlaceholder: "Paste your OpenRouter key (sk-or-…)",
      default: "meta-llama/llama-3.3-70b-instruct:free",
      models: [
        { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B — free (best)" },
        { id: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash — free" },
        { id: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3 — free" },
        { id: "meta-llama/llama-3.1-8b-instruct:free", label: "Llama 3.1 8B — free (fastest)" },
        { id: "qwen/qwen-2.5-72b-instruct:free", label: "Qwen 2.5 72B — free" }
      ]
    },
    gemini: {
      label: "Google Gemini",
      keyUrl: "https://aistudio.google.com/app/apikey",
      keyHint: "Free tier can be limited (limit: 0) in some regions/projects. If it errors, use OpenRouter above.",
      keyPlaceholder: "Paste your Gemini key (AIza… or AQ.…)",
      default: "gemini-2.0-flash",
      models: [
        { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
        { id: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite" },
        { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
        { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" }
      ]
    }
  };

  function saveCfg(c) {
    try {
      localStorage.setItem(STORE, JSON.stringify(c));
    } catch (e) {}
  }
  function cfg() {
    let c;
    try {
      c = JSON.parse(localStorage.getItem(STORE)) || {};
    } catch (e) {
      c = {};
    }
    // migrate old flat {key, model} (Gemini-only) format
    if (c.key && !c.providers) {
      c = {
        provider: "gemini",
        providers: { gemini: { key: c.key, model: c.model || "gemini-2.0-flash" } }
      };
      saveCfg(c);
    }
    if (!c.providers) c.providers = {};
    if (!c.provider) c.provider = "openrouter";
    return c;
  }

  function getProvider() {
    return cfg().provider;
  }
  function setProvider(p) {
    const c = cfg();
    c.provider = PROVIDERS[p] ? p : "openrouter";
    saveCfg(c);
  }
  function providerInfo(p) {
    return PROVIDERS[p || getProvider()];
  }
  function providerList() {
    return Object.keys(PROVIDERS).map((id) => ({ id: id, label: PROVIDERS[id].label }));
  }
  function slot(c, p) {
    p = p || c.provider;
    if (!c.providers[p]) c.providers[p] = {};
    return c.providers[p];
  }
  function getKey() {
    const c = cfg();
    return slot(c).key || "";
  }
  function setKey(k) {
    const c = cfg();
    slot(c).key = (k || "").trim();
    saveCfg(c);
  }
  function getModel() {
    const c = cfg();
    return slot(c).model || providerInfo().default;
  }
  function setModel(m) {
    const c = cfg();
    slot(c).model = m || providerInfo().default;
    saveCfg(c);
  }
  function models() {
    return providerInfo().models;
  }
  function hasKey() {
    return !!getKey();
  }

  function focusText() {
    const p = EC.store.activeProfile ? EC.store.activeProfile() : null;
    if (!p) return "general English";
    return (p.focus && p.focus.length ? p.focus.join(", ") : "general English").toLowerCase();
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

  async function readErr(res) {
    let msg = "HTTP " + res.status;
    try {
      const err = await res.json();
      if (err && err.error && err.error.message) msg = err.error.message;
      else if (err && err.error && typeof err.error === "string") msg = err.error;
      else if (err && err.message) msg = err.message;
    } catch (e) {}
    if (res.status === 401 || res.status === 403 || res.status === 400) throw new Error("BAD_KEY:" + msg);
    if (res.status === 429 || res.status === 402) throw new Error("QUOTA:" + msg);
    if (res.status === 404) throw new Error("NO_MODEL:" + msg);
    throw new Error(msg);
  }

  // ---- Google Gemini ----
  async function geminiCall(history, mode) {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(getModel()) + ":generateContent";
    const body = {
      systemInstruction: { parts: [{ text: systemPrompt(mode) }] },
      contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      generationConfig: { temperature: 0.8, maxOutputTokens: 400, topP: 0.95 }
    };
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": getKey() },
        body: JSON.stringify(body)
      });
    } catch (e) {
      throw new Error("NETWORK");
    }
    if (!res.ok) return readErr(res);
    const data = await res.json();
    const text =
      data && data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.map((p) => p.text || "").join("").trim();
    if (!text) throw new Error("EMPTY");
    return text;
  }

  // ---- OpenRouter (OpenAI-compatible) ----
  async function openrouterCall(history, mode) {
    const url = "https://openrouter.ai/api/v1/chat/completions";
    const messages = [{ role: "system", content: systemPrompt(mode) }].concat(
      history.map((m) => ({ role: m.role === "model" ? "assistant" : "user", content: m.text }))
    );
    const body = { model: getModel(), messages: messages, temperature: 0.8, max_tokens: 400 };
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getKey(),
          "HTTP-Referer": location.origin,
          "X-Title": "English Coach"
        },
        body: JSON.stringify(body)
      });
    } catch (e) {
      throw new Error("NETWORK");
    }
    if (!res.ok) return readErr(res);
    const data = await res.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message && (data.choices[0].message.content || "").trim();
    if (!text) throw new Error("EMPTY");
    return text;
  }

  // history: [{role:'user'|'model', text}]
  async function chat(history, mode) {
    if (!hasKey()) throw new Error("NO_KEY");
    // conversation must start with a user turn
    let hist = history;
    const firstUser = hist.findIndex((m) => m.role === "user");
    if (firstUser > 0) hist = hist.slice(firstUser);
    return getProvider() === "gemini" ? geminiCall(hist, mode) : openrouterCall(hist, mode);
  }

  async function test() {
    return chat([{ role: "user", text: "Say 'ready' in one word." }], "voice");
  }

  function speakable(text) {
    return text
      .replace(/📝[\s\S]*$/m, "")
      .replace(/✅.*$/m, "")
      .replace(/Tip:.*$/gim, "")
      .replace(/[*_#>`]/g, "")
      .trim();
  }

  return {
    getKey, setKey, hasKey,
    getProvider, setProvider, providerInfo, providerList,
    getModel, setModel, models,
    chat, test, speakable
  };
})();
