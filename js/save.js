/* ==========================================================================
   GRIMWICK WORKS — js/save.js
   3 slots + an autosave every night. Versioned, and migration-safe: an old
   record is brought forward field by field rather than thrown away.
   ========================================================================== */

var SAVE_PREFIX = 'grimwick.save.';
var SAVE_SLOTS = ['1', '2', '3', 'auto'];

/* localStorage can be missing or blocked (private mode, odd file:// setups).
   The game must never break because of it, so fall back to memory. */
var Store = (function () {
  var mem = {};
  var ok = false;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('grimwick.probe', '1');
      localStorage.removeItem('grimwick.probe');
      ok = true;
    }
  } catch (e) { ok = false; }
  return {
    available: ok,
    get: function (k) { try { return ok ? localStorage.getItem(k) : (mem[k] || null); } catch (e) { return mem[k] || null; } },
    set: function (k, v) { try { if (ok) localStorage.setItem(k, v); else mem[k] = v; } catch (e) { mem[k] = v; } },
    del: function (k) { try { if (ok) localStorage.removeItem(k); else delete mem[k]; } catch (e) { delete mem[k]; } }
  };
})();

var Save = {

  key: function (slot) { return SAVE_PREFIX + slot; },

  write: function (slot) {
    var record = {
      v: GRIMWICK_VERSION,
      savedAt: Date.now(),
      day: S.time.day,
      season: S.time.season,
      act: S.time.act,
      state: S
    };
    Store.set(Save.key(slot), JSON.stringify(record));
    return true;
  },

  autosave: function () { return Save.write('auto'); },

  peek: function (slot) {
    var raw = Store.get(Save.key(slot));
    if (!raw) return null;
    try {
      var rec = JSON.parse(raw);
      return { slot: slot, v: rec.v, day: rec.day, season: rec.season, act: rec.act, savedAt: rec.savedAt };
    } catch (e) { return { slot: slot, corrupt: true }; }
  },

  list: function () {
    var out = [];
    for (var i = 0; i < SAVE_SLOTS.length; i++) out.push({ slot: SAVE_SLOTS[i], meta: Save.peek(SAVE_SLOTS[i]) });
    return out;
  },

  read: function (slot) {
    var raw = Store.get(Save.key(slot));
    if (!raw) return null;
    var rec;
    try { rec = JSON.parse(raw); } catch (e) { return null; }
    if (!rec || !rec.state) return null;
    return Save.migrate(rec.state, rec.v || 1);
  },

  load: function (slot) {
    var st = Save.read(slot);
    if (!st) return false;
    S = st;
    return true;
  },

  erase: function (slot) { Store.del(Save.key(slot)); return true; },

  /* ---- migration ------------------------------------------------------
     Versioned steps first, then a structural backfill against a fresh state
     so any field added later exists with a sane value.
     -------------------------------------------------------------------- */
  migrate: function (state, fromVersion) {
    var v = fromVersion || state.version || 1;

    if (v < 2) {
      /* v1 kept a single 'money' number in shillings */
      if (typeof state.money === 'number' && state.purse) {
        state.purse.pennies = Math.round(state.money * 12);
        delete state.money;
      }
      v = 2;
    }
    if (v < 3) {
      /* v2 had no arrears / rent-at-source machinery */
      if (state.house && typeof state.house.arrears !== 'number') state.house.arrears = 0;
      if (state.house && typeof state.house.rentMissed !== 'number') state.house.rentMissed = 0;
      v = 3;
    }

    var fresh = newStateTemplate();
    var merged = Save.backfill(state, fresh);
    merged.version = GRIMWICK_VERSION;
    return merged;
  },

  /* Fill anything the record is missing, keep everything it has. */
  backfill: function (obj, template) {
    if (obj === undefined) return Util.deepClone(template);
    /* a null default (injury, docket, lastEventId) carries no shape to merge
       against, so whatever the record holds is the truth */
    if (template === null || template === undefined) return obj;
    if (obj === null) return Util.deepClone(template);
    if (Array.isArray(template)) return Array.isArray(obj) ? obj : Util.deepClone(template);
    if (typeof template !== 'object') return typeof obj === typeof template ? obj : template;
    if (typeof obj !== 'object') return Util.deepClone(template);
    var out = {}, k;
    for (k in template) {
      if (Object.prototype.hasOwnProperty.call(template, k)) {
        out[k] = Save.backfill(obj[k], template[k]);
      }
    }
    for (k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k) && !(k in out)) out[k] = obj[k];
    }
    return out;
  },

  /* ---- verification (used by debug.js and the acceptance checks) ------ */
  deepDiff: function (a, b, path, out) {
    path = path || '';
    out = out || [];
    if (a === b) return out;
    var ta = a === null ? 'null' : typeof a;
    var tb = b === null ? 'null' : typeof b;
    if (ta !== tb) { out.push(path + ': ' + ta + ' -> ' + tb); return out; }
    if (ta !== 'object') {
      if (a !== b) out.push(path + ': ' + JSON.stringify(a) + ' -> ' + JSON.stringify(b));
      return out;
    }
    var keys = {}, k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) keys[k] = 1;
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) keys[k] = 1;
    for (k in keys) {
      Save.deepDiff(a[k], b[k], path ? path + '.' + k : k, out);
    }
    return out;
  },

  /* Write, re-read, deep-compare. Returns [] when the round trip is exact. */
  roundTripTest: function () {
    var before = Util.deepClone(S);
    Save.write('3');
    var after = Save.read('3');
    return Save.deepDiff(before, after);
  }
};

/* A fresh state used only as a shape template for migration; it must not
   disturb the live RNG or the live S. */
function newStateTemplate() {
  var keep = S;
  var t = newState(1);
  S = keep;
  return t;
}
