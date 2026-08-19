/* ==========================================================================
   GRIMWICK WORKS — js/state.js
   One serializable object, S. Nothing about the run lives in the DOM.
   The RNG seed lives in S too, so a loaded save rolls the same dice.
   ========================================================================== */

var GRIMWICK_VERSION = 3;
var S = null;

var SEASON_OF_DAY = [
  { until: 14, season: 'LATE SUMMER' },
  { until: 30, season: 'AUTUMN' },
  { until: 48, season: 'WINTER' },
  { until: 60, season: 'THAW' }
];

var ACT_OF_DAY = [
  { until: 20, act: 1 },
  { until: 42, act: 2 },
  { until: 60, act: 3 }
];

var WEATHERS = {
  'LATE SUMMER': ['soot', 'still', 'rain', 'fog'],
  'AUTUMN':      ['rain', 'fog', 'wind', 'soot'],
  'WINTER':      ['frost', 'sleet', 'fog', 'wind'],
  'THAW':        ['rain', 'fog', 'wind', 'soot']
};

/* Warmth cost per night by weather. Winter is not a mood, it is arithmetic. */
var WEATHER_BITE = { soot: 4, still: 3, rain: 8, fog: 6, wind: 10, sleet: 14, frost: 16 };

var STATIONS = ['CAPPING', 'CASTING', 'STAMPING', 'GRINDING'];

var Util = {
  clamp: function (v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); },
  clamp100: function (v) { return Util.clamp(Math.round(v), 0, 100); },
  clampStanding: function (v) { return Util.clamp(Math.round(v), -100, 100); },

  /* deterministic LCG so a reload continues the same run, not a new one */
  rnd: function () {
    S.rng = (S.rng * 1664525 + 1013904223) >>> 0;
    return S.rng / 4294967296;
  },
  rndInt: function (lo, hi) { return lo + Math.floor(Util.rnd() * (hi - lo + 1)); },
  chance: function (p) { return Util.rnd() < p; },
  pick: function (arr) { return arr[Math.floor(Util.rnd() * arr.length)]; },
  deepClone: function (o) { return JSON.parse(JSON.stringify(o)); },

  seasonFor: function (day) {
    for (var i = 0; i < SEASON_OF_DAY.length; i++) {
      if (day <= SEASON_OF_DAY[i].until) return SEASON_OF_DAY[i].season;
    }
    return 'THAW';
  },
  actFor: function (day) {
    for (var i = 0; i < ACT_OF_DAY.length; i++) {
      if (day <= ACT_OF_DAY[i].until) return ACT_OF_DAY[i].act;
    }
    return 3;
  }
};

function newState(seed) {
  var s = {
    version: GRIMWICK_VERSION,
    rng: (typeof seed === 'number' ? seed : (Date.now() >>> 0)) || 1,
    startedAt: Date.now(),

    time: { day: 1, act: 1, phase: 'SHIFT', season: 'LATE SUMMER', weather: 'soot' },

    body: {
      health: 76, fatigue: 24, hunger: 34, warmth: 58,
      dust: 5, tremor: 2,
      injury: null,
      lastHarm: null
    },

    mind: { resolve: 52, literacy: 1 },

    purse: { pennies: 11, debt: 18 },

    standing: { foreman: 0, workmates: 6, garrison: 0, notice: 3 },

    house: {
      rentDue: 7,
      rentAmount: WAGE.rent,
      arrears: 0,
      rentMissed: 0,
      coal: 2,
      larder: 2,
      physic: 0,
      coatMended: false,
      kin: Util.deepClone(STARTING_KIN)
    },

    job: { employed: true, shiftsMissed: 0, warnings: 0 },

    factory: { station: 'CAPPING', worked: false, lastOutcome: null, tally: 0 },

    evening: { ap: 2, ended: false, rested: false },

    night: { resolved: false, share: null },

    /* narrative.js reads this map and nothing else writes English into it */
    flags: {},

    /* accrued charges for tonight's docket, cleared each dawn */
    pending: { fines: [], breakages: 0, extra: [] },

    eventsSeen: {},
    lastEventId: null,

    docket: null,
    dockets: [],

    ledger: { grossTotal: 0, deductTotal: 0, netTotal: 0, daysWorked: 0 },

    log: [],

    tutorial: { active: true, step: 0, done: false },

    settings: { god: false, audio: false },

    dead: false,
    endingId: null
  };
  s.time.season = Util.seasonFor(1);
  s.time.act = Util.actFor(1);
  s.factory.station = STATIONS[0];
  return s;
}

/* ---- small mutators every module shares -------------------------------- */

var State = {
  applyBody: function (d) {
    if (!d) return;
    var b = S.body, k;
    for (k in d) {
      if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
      if (k === 'injury' || k === 'lastHarm') continue;
      if (k === 'dust' || k === 'tremor') {
        /* permanent damage. it never goes down, whatever anyone promises. */
        b[k] = Util.clamp100(b[k] + Math.max(0, d[k]));
      } else {
        b[k] = Util.clamp100(b[k] + d[k]);
      }
    }
  },
  applyMind: function (d) {
    if (!d) return;
    if (typeof d.resolve === 'number') S.mind.resolve = Util.clamp100(S.mind.resolve + d.resolve);
    if (typeof d.literacy === 'number') S.mind.literacy = Util.clamp(S.mind.literacy + d.literacy, 0, 3);
  },
  applyStanding: function (d) {
    if (!d) return;
    var k;
    for (k in d) {
      if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
      if (k === 'notice') S.standing.notice = Util.clamp100(S.standing.notice + d.notice);
      else S.standing[k] = Util.clampStanding(S.standing[k] + d[k]);
    }
  },
  applyPurse: function (d) {
    if (!d) return;
    if (typeof d.pennies === 'number') S.purse.pennies = Math.max(0, S.purse.pennies + d.pennies);
    if (typeof d.debt === 'number') S.purse.debt = Math.max(0, S.purse.debt + d.debt);
  },
  applyKin: function (d) {
    if (!d || !S.house.kin.length) return;
    var k = S.house.kin[0];
    if (k.status === 'DEAD') return;
    if (typeof d.health === 'number') k.health = Util.clamp100(k.health + d.health);
    if (typeof d.mood === 'number') k.mood = Util.clamp100(k.mood + d.mood);
    k.status = k.health <= 0 ? 'DEAD' : (k.health < 35 ? 'FEVERED' : (k.health < 60 ? 'AILING' : 'WELL'));
  },
  injure: function (inj) {
    /* a worse wound overwrites a lighter one; the body only has the one hand */
    if (!S.body.injury || inj.severity > S.body.injury.severity) {
      S.body.injury = { type: inj.type, severity: inj.severity, daysLeft: inj.daysLeft, permanent: !!inj.permanent };
    }
  },
  setFlags: function (f) {
    if (!f) return;
    var k;
    for (k in f) { if (Object.prototype.hasOwnProperty.call(f, k)) S.flags[k] = f[k]; }
  },
  addFine: function (id) {
    if (FINES[id]) S.pending.fines.push(id);
  },
  kin: function () { return S.house.kin.length ? S.house.kin[0] : null; },
  isDead: function () { return S.dead || S.body.health <= 0; }
};

/* One entry point for every effect object in data/*.js. */
function applyEffects(fx) {
  if (!fx) return;
  if (typeof fx === 'function') fx = fx(S);
  State.applyBody(fx.body);
  State.applyMind(fx.mind);
  State.applyStanding(fx.standing);
  State.applyPurse(fx.purse);
  State.applyKin(fx.kin);
  State.setFlags(fx.flags);
  if (fx.fine) State.addFine(fx.fine);
  if (typeof fx.larder === 'number') S.house.larder = Math.max(0, S.house.larder + fx.larder);
  if (typeof fx.coal === 'number') S.house.coal = Math.max(0, S.house.coal + fx.coal);
  if (typeof fx.physic === 'number') S.house.physic = Math.max(0, S.house.physic + fx.physic);
  if (fx.injure) State.injure(fx.injure);
  if (typeof fx.breakages === 'number') S.pending.breakages += fx.breakages;
}
