/* ==========================================================================
   GRIMWICK WORKS — js/audio.js
   Sound arrives in a later prompt. This is the real interface, defaulted off,
   so nothing has to be rewired later and nothing can throw in the meantime.
   ========================================================================== */

var Audio = {
  ctx: null,
  enabled: false,

  init: function () {
    Audio.enabled = !!(S && S.settings && S.settings.audio);
  },

  setEnabled: function (on) {
    S.settings.audio = !!on;
    Audio.enabled = !!on;
  },

  /* a short dead knock — the press, the docket, the door */
  thunk: function () { Audio.tone(70, 0.05, 0.05); },
  chime: function () { Audio.tone(320, 0.12, 0.03); },

  tone: function (freq, dur, gain) {
    if (!Audio.enabled) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!Audio.ctx) Audio.ctx = new AC();
      var o = Audio.ctx.createOscillator();
      var g = Audio.ctx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g); g.connect(Audio.ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, Audio.ctx.currentTime + dur);
      o.stop(Audio.ctx.currentTime + dur);
    } catch (e) { /* audio is never allowed to break the game */ }
  }
};
