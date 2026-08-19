/* ==========================================================================
   GRIMWICK WORKS — js/events.js
   The engine. Definitions live in data/events.js; this file only decides
   what fires and applies what was chosen.
   ========================================================================== */

var PHASE_EVENT_CHANCE = { SHIFT: 0.55, EVENING: 0.4, NIGHT: 0.45 };

var Events = {

  byId: function (id) {
    for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i];
    return null;
  },

  eligible: function (phase) {
    var out = [];
    for (var i = 0; i < EVENTS.length; i++) {
      var e = EVENTS[i];
      if (e.phase !== phase) continue;
      if (e.id === S.lastEventId) continue;
      if (e.once && S.eventsSeen[e.id]) continue;
      var ok = true;
      try { ok = e.cond ? !!e.cond(S) : true; } catch (err) { ok = false; }
      if (ok) out.push(e);
    }
    return out;
  },

  /* Weighted pick, damped by how often you have already seen it. */
  roll: function (phase) {
    if (S.dead) return null;
    var pool = Events.eligible(phase);
    if (!pool.length) return null;
    if (!Util.chance(PHASE_EVENT_CHANCE[phase] || 0.4)) return null;

    var weights = [], total = 0, i;
    for (i = 0; i < pool.length; i++) {
      var seen = S.eventsSeen[pool[i].id] || 0;
      var w = Math.max(1, (pool[i].weight || 5) / Math.pow(2, seen));
      weights.push(w);
      total += w;
    }
    var r = Util.rnd() * total;
    for (i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  },

  /* Choices resolve to acts-or-says-why, same contract as every button. */
  describeChoices: function (evt) {
    var out = [];
    for (var i = 0; i < evt.choices.length; i++) {
      var c = evt.choices[i];
      var reason = null;
      if (c.enabled) {
        var ok = c.enabled(S);
        if (ok !== true) reason = ok;
      }
      out.push({
        id: c.id,
        label: T(c.labelKey),
        hint: c.hintKey ? T(c.hintKey) : '',
        disabledReason: reason ? T(reason) : null
      });
    }
    return out;
  },

  choose: function (evt, choiceId) {
    var c = null, i;
    for (i = 0; i < evt.choices.length; i++) if (evt.choices[i].id === choiceId) c = evt.choices[i];
    if (!c) return '';
    if (c.enabled && c.enabled(S) !== true) return '';

    applyEffects(c.effects);

    /* the rent man paid off in the doorway settles the week */
    if (S.flags.rentPaidEarly) S.house.rentPaidFor = S.house.rentDue;
    if (S.flags.doctorsBook && !S.flags.doctorsBookDays) S.flags.doctorsBookDays = 8;

    S.eventsSeen[evt.id] = (S.eventsSeen[evt.id] || 0) + 1;
    S.lastEventId = evt.id;

    var resultKey = c.resultKey;
    /* a pamphlet you cannot read has its own, smaller result */
    if (evt.id === 'e_pamphlet' && c.id === 'read' && S.mind.literacy < 1) {
      resultKey = 'events.e_pamphlet.r_readIlliterate';
    }
    return resultKey;
  },

  /* debug.js uses this to force any event on demand */
  force: function (id, onDone) {
    var evt = Events.byId(id);
    if (!evt) return false;
    UI.showEvent(evt, onDone || function () { UI.render(); });
    return true;
  },

  ids: function () {
    var out = [];
    for (var i = 0; i < EVENTS.length; i++) out.push(EVENTS[i].id);
    return out;
  }
};
