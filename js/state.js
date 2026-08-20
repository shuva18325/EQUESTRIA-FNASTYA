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

var STATIONS = ['CASTING', 'CAP_BENCH', 'GRINDING', 'STAMPING'];

/* The four ways the floor takes something off you. Output is per twelve-hour
   shift at skill 50, steady pace, proper care, guards on. */
var STATION_DEF = {
  CASTING:  { baseOutput: 230, quotaWeight: 5.00, pieceRate: 0.145, accident: 0.045,
              wear: { fatigue: 19, health: -2, lead: 2, dust: 0, tremor: 0 },
              injuries: ['scald', 'burn', 'back'], catastrophe: 'cruciblespill', catRisk: 0.0035 },
  CAP_BENCH:{ baseOutput: 950, quotaWeight: 1.20, pieceRate: 0.032, accident: 0.032,
              wear: { fatigue: 16, health: -1, lead: 0, dust: 0, tremor: 2 },
              injuries: ['burn', 'cutArm', 'back'], catastrophe: 'flash', catRisk: 0.0040 },
  GRINDING: { baseOutput: 95,  quotaWeight: 12.0, pieceRate: 0.300, accident: 0.040,
              wear: { fatigue: 18, health: -2, lead: 0, dust: 3, tremor: 0 },
              injuries: ['cutArm', 'wheelSplinter', 'back'], catastrophe: 'burst', catRisk: 0.0030 },
  STAMPING: { baseOutput: 160, quotaWeight: 7.15, pieceRate: 0.165, accident: 0.062,
              wear: { fatigue: 21, health: -1, lead: 0, dust: 0, tremor: 1 },
              injuries: ['crushedHand', 'back', 'hernia'], catastrophe: 'press', catRisk: 0.0028 }
};

var PACE  = {
  slow:   { output: 0.82, fatigue: 0.75, accident: 0.60, foreman: -2 },
  steady: { output: 1.00, fatigue: 1.00, accident: 1.00, foreman: 0 },
  driven: { output: 1.28, fatigue: 1.45, accident: 1.90, foreman: 2 }
};
var CARE  = {
  sloppy:     { output: 1.12, reject: 0.115, accident: 1.25, foreman: 0 },
  proper:     { output: 1.00, reject: 0.050, accident: 1.00, foreman: 0 },
  meticulous: { output: 0.86, reject: 0.015, accident: 0.85, foreman: 1 }
};
var GUARD = {
  on:  { output: 1.00, accident: 1.00, foreman: 0 },
  off: { output: 1.15, accident: 2.60, foreman: 2 }
};

/* Typed, visible, and often permanent. */
var INJURY_DEF = {
  scald:         { severity: 3, days: 6,  health: -10, output: 0.10 },
  burn:          { severity: 2, days: 4,  health: -5,  output: 0.05 },
  cutArm:        { severity: 2, days: 3,  health: -5,  output: 0.05 },
  back:          { severity: 2, days: 9,  health: -6,  output: 0.08 },
  hernia:        { severity: 2, days: 12, health: -8,  output: 0.10 },
  crushedHand:   { severity: 3, days: 8,  health: -12, output: 0.16 },
  lostFingers:   { severity: 4, days: 10, health: -16, output: 0.16, permanent: true, scar: { output: 0.09 } },
  wheelSplinter: { severity: 4, days: 7,  health: -14, output: 0.12, permanent: true, scar: { output: 0.07, eye: true } },
  fulminateFlash:{ severity: 4, days: 9,  health: -18, output: 0.14, tremor: 18, permanent: true, scar: { output: 0.05 } }
};

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
      dust: 5, tremor: 8, lead: 3,
      injury: null,
      scars: [],
      lastHarm: null
    },

    mind: { resolve: 52, literacy: 1 },

    purse: { pennies: 11, debt: 18 },

    standing: { foreman: 0, workmates: 6, garrison: 0, notice: 3 },

    /* what the empire is doing somewhere else, and what it costs here */
    empire: { war: 24, glut: 12, levy: 0, week: 0, lastNews: null },

    house: {
      cloth: 0,
      housed: true,
      node: 'rows',            /* 'rows' | 'street' | 'workhouse' */
      rentDue: 7,
      rentAmount: WAGE.rent,
      arrears: 0,
      rentMissed: 0,
      deposit: WAGE.rent + 20,
      coal: 2,
      larder: 2,
      physic: 0,
      laudanum: 0,
      coatMended: false,
      goods: Util.deepClone(STARTING_GOODS),
      pawned: [],              /* {id, day, redeem} */
      stash: [],               /* ids under the floorboard */
      kin: []
    },

    job: { employed: true, shiftsMissed: 0, warnings: 0, lastWarningDay: 0 },

    factory: {
      station: 'CAP_BENCH',
      pace: 'steady', care: 'proper', guard: 'on',
      skills: { CASTING: 12, CAP_BENCH: 50, GRINDING: 9, STAMPING: 18 },
      worked: false,
      lastOutcome: null,
      shift: null,
      transfer: null,
      guardsOffShifts: 0,
      quota: { week: 1, target: 5200, made: 0, lastTarget: 0, weeksBeaten: 0, weeksMissed: 0, lastResult: null, lastMade: 0, unseen: false },
      floor: []
    },

    foreman: {
      standingKnown: true,
      skimUntil: 0,
      spiteUntil: 0,
      flatterCooldown: 0,
      bribedUntil: 0,
      reported: false,
      inspectorDay: 0,
      inspectorVisited: false
    },

    evening: { ap: 2, apMax: 2, at: 'rows', ended: false, rested: false, travelled: 0 },

    night: { resolved: false, share: null },

    /* the town's prices, and what the empire is doing to them */
    market: { week: 0, prices: {}, last: {}, wageMult: 1 },

    /* the road down, and the road back up */
    destitution: {
      ever: false, days: 0, begs: 0, scavenges: 0, casualDays: 0,
      workhouse: false, workhouseDays: 0, applied: false, kinTaken: false
    },

    /* narrative.js reads this map and nothing else writes English into it */
    flags: {},

    /* accrued charges for tonight's docket, cleared each dawn */
    pending: { fines: [], breakages: 0, extra: [], pieceWage: 0, kinWage: 0, bonus: 0, quotaFine: 0 },

    eventsSeen: {},
    eventsRecent: {},        /* id -> day fired; nothing repeats inside 15 days */
    lastEventId: null,

    docket: null,
    dockets: [],

    ledger: { grossTotal: 0, deductTotal: 0, netTotal: 0, daysWorked: 0 },

    log: [],

    tutorial: { active: true, step: 0, done: false },

    settings: { god: false, audio: true, volume: 0.7 },

    dead: false,
    endingId: null
  };
  s.time.season = Util.seasonFor(1);
  s.time.act = Util.actFor(1);
  s.factory.floor = Util.deepClone(FLOOR_HANDS);
  s.house.kin = [Util.deepClone(KIN_OPTIONS[0].kin)];
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
      if (k === 'dust' || k === 'tremor' || k === 'lead') {
        /* permanent damage. it never goes down, whatever anyone promises,
           whatever the debug panel does, whatever an event tries to give back. */
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
    var taken = k.status === 'TAKEN';
    if (typeof d.health === 'number') k.health = Util.clamp100(k.health + d.health);
    if (typeof d.mood === 'number') k.mood = Util.clamp100(k.mood + d.mood);
    if (k.health <= 0) {
      /* wherever it happens — an event, a night, a week without medicine —
         a death in the house is announced once and changes the ending set */
      k.status = 'DEAD';
      if (!S.flags.kinDied) {
        S.flags.kinDied = true;
        S.mind.resolve = Util.clamp100(S.mind.resolve - 25);
        if (typeof UI !== 'undefined' && UI.log) UI.log(T('night.kinDied'), 'bad');
      }
      return;
    }
    if (taken) return;   /* the poorhouse keeps them; their health still moves */
    k.status = k.health < 35 ? 'FEVERED' : (k.health < 60 ? 'AILING' : 'WELL');
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
  isDead: function () { return S.dead || S.body.health <= 0; },

  /* ---- goods, which are also warmth, and also the rent when it comes to it */
  hasGood: function (id) {
    for (var i = 0; i < S.house.goods.length; i++) if (S.house.goods[i].id === id) return true;
    return false;
  },
  takeGood: function (id) {
    for (var i = 0; i < S.house.goods.length; i++) {
      if (S.house.goods[i].id === id) return S.house.goods.splice(i, 1)[0];
    }
    return null;
  },
  giveGood: function (id) {
    if (GOODS[id] && !State.hasGood(id)) S.house.goods.push({ id: id, stashed: false });
  },
  goodsWarmth: function () {
    var w = 0;
    for (var i = 0; i < S.house.goods.length; i++) {
      var g = GOODS[S.house.goods[i].id];
      if (g && g.warmth) w += g.warmth;
    }
    return w;
  },

  /* ---- kin */
  kinAlive: function () {
    var k = State.kin();
    return !!k && k.status !== 'DEAD' && k.status !== 'TAKEN' && k.status !== 'GONE';
  },
  kinPresent: function () {
    var k = State.kin();
    return !!k && k.status !== 'DEAD' && k.status !== 'TAKEN';
  },

  /* ---- the two ways down */
  destitute: function () { return !S.house.housed || !S.job.employed; },
  onStreet: function () { return !S.house.housed && !S.destitution.workhouse; },

  /* Everything a scar takes off your output, forever. */
  scarPenalty: function () {
    var p = 0;
    for (var i = 0; i < S.body.scars.length; i++) p += S.body.scars[i].output || 0;
    return Math.min(0.45, p);
  },

  addScar: function (type, def) {
    S.body.scars.push({ type: type, output: def.output || 0, eye: !!def.eye, day: S.time.day });
  },

  /* The three that never go down. */
  permanentSnapshot: function () {
    return { dust: S.body.dust, tremor: S.body.tremor, lead: S.body.lead };
  },

  /* Returns a list of violations; empty is the only acceptable answer. */
  assertPermanents: function (before) {
    var out = [], keys = ['dust', 'tremor', 'lead'], i;
    for (i = 0; i < keys.length; i++) {
      if (S.body[keys[i]] < before[keys[i]]) {
        out.push(keys[i] + ': ' + before[keys[i]] + ' -> ' + S.body[keys[i]]);
      }
    }
    return out;
  }
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
  if (fx.giveGood) State.giveGood(fx.giveGood);
  if (fx.takeGood) State.takeGood(fx.takeGood);
  if (typeof fx.cloth === 'number') S.house.cloth = Math.max(0, (S.house.cloth || 0) + fx.cloth);
  if (typeof fx.laudanum === 'number') S.house.laudanum = Math.max(0, S.house.laudanum + fx.laudanum);
  if (typeof fx.breakages === 'number') S.pending.breakages += fx.breakages;
}
