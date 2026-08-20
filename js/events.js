/* ==========================================================================
   GRIMWICK WORKS — js/events.js
   The draw. Definitions live in data/events.js; this file decides only what
   is eligible, what fires, and what a choice does.

   Two rules it enforces on itself:
     - nothing fires whose requirements are unmet (asserted, not assumed)
     - nothing repeats inside fifteen days
   ========================================================================== */

var PHASE_EVENT_CHANCE = { SHIFT: 0.55, EVENING: 0.45, NIGHT: 0.45 };
var EVENT_COOLDOWN_DAYS = 15;

/* The whole deck: the keyed events from Build 1 and the Build 3 deck. */
function eventDeck() {
  return EVENTS.concat(EVENTS_DECK);
}

var Events = {

  drawsChecked: 0,
  drawsRejected: 0,

  all: function () { return eventDeck(); },

  byId: function (id) {
    var deck = eventDeck();
    for (var i = 0; i < deck.length; i++) if (deck[i].id === id) return deck[i];
    return null;
  },

  /* ---- requirements --------------------------------------------------- */
  statValue: function (key) {
    var k = State.kin();
    switch (key) {
      case 'pennies':   return S.purse.pennies;
      case 'debt':      return S.purse.debt;
      case 'coal':      return S.house.coal;
      case 'larder':    return S.house.larder;
      case 'physic':    return S.house.physic;
      case 'laudanum':  return S.house.laudanum;
      case 'cloth':     return S.house.cloth || 0;
      case 'literacy':  return S.mind.literacy;
      case 'resolve':   return S.mind.resolve;
      case 'health':    return S.body.health;
      case 'hunger':    return S.body.hunger;
      case 'warmth':    return S.body.warmth;
      case 'fatigue':   return S.body.fatigue;
      case 'dust':      return S.body.dust;
      case 'tremor':    return S.body.tremor;
      case 'lead':      return S.body.lead;
      case 'notice':    return S.standing.notice;
      case 'foreman':   return S.standing.foreman;
      case 'workmates': return S.standing.workmates;
      case 'garrison':  return S.standing.garrison;
      case 'kinHealth': return k ? k.health : 0;
      case 'day':       return S.time.day;
      default:          return 0;
    }
  },

  /* One checker for events and for individual choices. */
  meets: function (req, location) {
    if (!req) return true;
    if (req.minAct && S.time.act < req.minAct) return false;
    if (req.maxAct && S.time.act > req.maxAct) return false;
    if (req.season && req.season !== S.time.season) return false;
    if (req.weather && req.weather !== S.time.weather) return false;
    if (req.location && req.location !== location) return false;
    if (typeof req.housed === 'boolean' && S.house.housed !== req.housed) return false;
    if (typeof req.employed === 'boolean' && S.job.employed !== req.employed) return false;
    if (typeof req.kin === 'boolean' && State.kinPresent() !== req.kin) return false;

    var key;
    if (req.flags) {
      for (key in req.flags) {
        if (!Object.prototype.hasOwnProperty.call(req.flags, key)) continue;
        var want = req.flags[key];
        var have = S.flags[key];
        if (want === true && !have) return false;
        if (want !== true && have !== want) return false;
      }
    }
    if (req.notFlags) {
      for (var i = 0; i < req.notFlags.length; i++) if (S.flags[req.notFlags[i]]) return false;
    }
    if (req.stats) {
      for (key in req.stats) {
        if (!Object.prototype.hasOwnProperty.call(req.stats, key)) continue;
        var band = req.stats[key];
        var v = Events.statValue(key);
        if (typeof band.min === 'number' && v < band.min) return false;
        if (typeof band.max === 'number' && v > band.max) return false;
      }
    }
    return true;
  },

  /* Build 1's events carry a cond() instead of a requires block. */
  eventAllowed: function (e, location) {
    if (e.cond) {
      try { if (!e.cond(S)) return false; } catch (err) { return false; }
    }
    return Events.meets(e.requires, location);
  },

  recentlySeen: function (id) {
    var last = S.eventsRecent[id];
    return typeof last === 'number' && (S.time.day - last) < EVENT_COOLDOWN_DAYS;
  },

  eligible: function (phase, location) {
    var out = [], deck = eventDeck();
    for (var i = 0; i < deck.length; i++) {
      var e = deck[i];
      if (e.phase !== phase && e.phase !== 'ANY') continue;
      if (e.id === S.lastEventId) continue;
      if (e.once && S.eventsSeen[e.id]) continue;
      if (Events.recentlySeen(e.id)) continue;
      if (!Events.eventAllowed(e, location)) continue;
      out.push(e);
    }
    return out;
  },

  /* Weighted draw, damped by how often this one has already come round. */
  roll: function (phase, location) {
    if (S.dead) return null;
    if (!Util.chance(PHASE_EVENT_CHANCE[phase] || 0.4)) return null;
    return Events.draw(phase, location);
  },

  /* The draw itself, without the probability gate — used by the tests. */
  draw: function (phase, location) {
    var pool = Events.eligible(phase, location);
    if (!pool.length) return null;

    var weights = [], total = 0, i;
    for (i = 0; i < pool.length; i++) {
      var seen = S.eventsSeen[pool[i].id] || 0;
      var w = Math.max(1, (pool[i].weight || 5) / Math.pow(1.6, seen));
      weights.push(w);
      total += w;
    }
    var r = Util.rnd() * total, picked = pool[pool.length - 1];
    for (i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) { picked = pool[i]; break; }
    }

    /* assert, do not assume: an event that fires with unmet requirements is
       a bug, and it is the kind of bug nobody notices for a month */
    Events.drawsChecked += 1;
    if (!Events.eventAllowed(picked, location) || Events.recentlySeen(picked.id)) {
      Events.drawsRejected += 1;
      if (typeof console !== 'undefined' && console.error) {
        console.error('[events] draw violated its own requirements: ' + picked.id);
      }
      return null;
    }
    return picked;
  },

  /* ---- text, from either shape --------------------------------------- */
  titleOf: function (e) { return e.title || (e.titleKey ? T(e.titleKey) : ''); },
  textOf:  function (e) { return e.text  || (e.textKey  ? T(e.textKey)  : ''); },

  describeChoices: function (evt, location) {
    var out = [];
    for (var i = 0; i < evt.choices.length; i++) {
      var c = evt.choices[i];
      var reason = null;
      if (c.enabled) {
        var ok = c.enabled(S);
        if (ok !== true) reason = T(ok);
      }
      if (!reason && c.requires && !Events.meets(c.requires, location)) {
        reason = Events.whyNot(c.requires);
      }
      out.push({
        id: c.id || String(i),
        label: c.text || (c.labelKey ? T(c.labelKey) : ''),
        hint: c.hint || (c.hintKey ? T(c.hintKey) : ''),
        disabledReason: reason
      });
    }
    return out;
  },

  /* A stated reason, in the player's language, for a barred choice. */
  whyNot: function (req) {
    if (req.stats) {
      if (req.stats.pennies) return T('disabled.noPennies');
      if (req.stats.literacy) return T('disabled.illiterate');
      if (req.stats.physic) return T('disabled.noPhysic');
      if (req.stats.laudanum) return T('disabled.noLaudanum');
      if (req.stats.coal) return T('disabled.noCoal');
      if (req.stats.larder) return T('disabled.noFood');
    }
    if (typeof req.employed === 'boolean') return T(req.employed ? 'disabled.sacked' : 'disabled.haveWork');
    if (typeof req.housed === 'boolean') return T(req.housed ? 'disabled.noRoom' : 'disabled.haveRoom');
    if (typeof req.kin === 'boolean') return T('disabled.noKin');
    return T('disabled.notNow');
  },

  choose: function (evt, choiceId, location) {
    var c = null, i;
    for (i = 0; i < evt.choices.length; i++) {
      if ((evt.choices[i].id || String(i)) === String(choiceId)) c = evt.choices[i];
    }
    if (!c) return '';
    if (c.enabled && c.enabled(S) !== true) return '';
    if (c.requires && !Events.meets(c.requires, location)) return '';

    applyEffects(c.effects);
    if (c.effectsAlt && Util.chance(0.5)) applyEffects(c.effectsAlt);

    if (S.flags.rentPaidEarly) S.house.rentPaidFor = S.house.rentDue;
    if (S.flags.doctorsBook && !S.flags.doctorsBookDays) S.flags.doctorsBookDays = 8;
    if (S.house.pawned && S.house.pawned.length) S.flags.hasTicketOut = true;

    S.eventsSeen[evt.id] = (S.eventsSeen[evt.id] || 0) + 1;
    S.eventsRecent[evt.id] = S.time.day;
    S.lastEventId = evt.id;

    if (c.log) UI.log(c.log);

    var result = c.result || (c.resultKey ? T(c.resultKey) : '');
    if (evt.id === 'e_pamphlet' && c.id === 'read' && S.mind.literacy < 1) {
      result = T('events.e_pamphlet.r_readIlliterate');
    }
    return result;
  },

  force: function (id, onDone) {
    var evt = Events.byId(id);
    if (!evt) return false;
    UI.showEvent(evt, onDone || function () { UI.render(); });
    return true;
  },

  ids: function () {
    var out = [], deck = eventDeck();
    for (var i = 0; i < deck.length; i++) out.push(deck[i].id);
    return out;
  },

  categories: function () {
    var out = {}, deck = eventDeck();
    for (var i = 0; i < deck.length; i++) {
      var c = deck[i].cat || 'untagged';
      out[c] = (out[c] || 0) + 1;
    }
    return out;
  }
};
