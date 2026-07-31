/* English Coach — Speech (American English text-to-speech)
 * Uses the browser's built-in Web Speech API. Prefers a US English voice
 * so pronunciation practice sounds American.
 */
window.EC = window.EC || {};

EC.speech = (function () {
  let voices = [];
  let preferred = null;
  const synth = window.speechSynthesis || null;

  function pickVoice() {
    if (!synth) return null;
    voices = synth.getVoices() || [];
    // Prefer natural-sounding US voices, then any en-US, then any English.
    const nice = ["Samantha", "Alex", "Google US English", "Aaron", "Nicky", "Ava"];
    preferred =
      voices.find((v) => nice.includes(v.name) && /en[-_]US/i.test(v.lang)) ||
      voices.find((v) => /en[-_]US/i.test(v.lang)) ||
      voices.find((v) => nice.includes(v.name)) ||
      voices.find((v) => /^en/i.test(v.lang)) ||
      null;
    return preferred;
  }

  if (synth) {
    pickVoice();
    synth.onvoiceschanged = pickVoice;
  }

  function speak(text, opts) {
    opts = opts || {};
    if (!synth || !text) return false;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      if (!preferred) pickVoice();
      if (preferred) u.voice = preferred;
      u.lang = (preferred && preferred.lang) || "en-US";
      u.rate = opts.rate != null ? opts.rate : (EC.store && EC.store.state.settings.rate) || 0.95;
      u.pitch = opts.pitch != null ? opts.pitch : 1;
      synth.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  function supported() {
    return !!synth;
  }

  return { speak, supported };
})();
