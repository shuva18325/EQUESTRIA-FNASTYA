/* ==========================================================================
   GRIMWICK WORKS — js/factory.js
   The twelve hours. Three dials, four floors, one count, one overseer.

   The shift resolves in full before a single beat-line is shown, so a player
   who closes the tab mid-animation loses nothing and gains nothing.
   ========================================================================== */

var STATION_SEVERE = {
  CASTING:  'scald',
  CAP_BENCH:'burn',
  GRINDING: 'wheelSplinter',
  STAMPING: 'lostFingers'
};

var CATASTROPHE_INJURY = {
  flash:         'fulminateFlash',
  burst:         'wheelSplinter',
  cruciblespill: 'scald',
  press:         'lostFingers'
};

/* Foreman standing needed before Coom will move you there. Nobody has to be
   persuaded to let you into the stamping shop. */
var TRANSFER_GATE = { CASTING: 25, CAP_BENCH: -20, GRINDING: -40, STAMPING: -100 };

var RARITY_WEIGHT = { COMMON: 60, UNCOMMON: 22, FINE: 12, RARE: 5, PROTOTYPE: 2 };

var Factory = {

  def: function (station) { return STATION_DEF[station || S.factory.station]; },

  /* ---------------------------------------------------------- day order
     The Ordnance Division sends down what it wants made. Common ball most
     days. Now and then a breech block for a pattern with no name, worth
     eleven times the ball and charged at eleven times the ball if you
     spoil one.
     ------------------------------------------------------------------- */
  order: function () {
    var o = S.factory.order && ORDERS[S.factory.order];
    return o || ORDERS.ball_common;
  },

  eligibleOrders: function (station) {
    var out = [], id;
    for (id in ORDERS) {
      if (!Object.prototype.hasOwnProperty.call(ORDERS, id)) continue;
      var o = ORDERS[id];
      if (o.stations.indexOf(station) < 0) continue;
      if (o.minAct && S.time.act < o.minAct) continue;
      if (o.requiresWar && S.empire.war < o.requiresWar) continue;
      out.push(o);
    }
    return out;
  },

  assignOrder: function () {
    var pool = Factory.eligibleOrders(S.factory.station);
    if (!pool.length) { S.factory.order = 'ball_common'; return; }
    var weights = [], total = 0, i;
    for (i = 0; i < pool.length; i++) {
      var w = RARITY_WEIGHT[pool[i].rarity] || 10;
      /* a war wants the new patterns, and wants them faster than it can gauge them */
      if (pool[i].rarity === 'PROTOTYPE' || pool[i].rarity === 'RARE') w *= 1 + S.empire.war / 60;
      if (pool[i].rarity === 'COMMON') w *= 1 + S.empire.levy / 90;
      weights.push(w);
      total += w;
    }
    var r = Util.rnd() * total, pick = pool[pool.length - 1];
    for (i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) { pick = pool[i]; break; }
    }
    S.factory.order = pick.id;
    if (RARITY[pick.rarity].rank >= 3) S.flags.sawRareOrder = (S.flags.sawRareOrder || 0) + 1;
  },
  skill: function (station) { return S.factory.skills[station || S.factory.station] || 0; },

  /* ---------------------------------------------------------------- dials */
  setDial: function (kind, value) {
    if (S.factory.worked || S.time.phase !== 'SHIFT') return false;
    if (kind === 'pace' && PACE[value]) S.factory.pace = value;
    else if (kind === 'care' && CARE[value]) S.factory.care = value;
    else if (kind === 'guard' && GUARD[value]) S.factory.guard = value;
    else return false;
    Audio.dial();
    return true;
  },

  /* ---------------------------------------------------------- assignment */
  assignStation: function () {
    /* You stay where you are. Coom moves you only to make a point. */
    if (S.foreman.spiteUntil >= S.time.day) {
      var worst = Factory.skill('STAMPING') <= Factory.skill('GRINDING') ? 'STAMPING' : 'GRINDING';
      if (S.factory.station !== worst) {
        S.factory.station = worst;
        S.flags.spitedToStation = true;
      }
    }
    if (!STATION_DEF[S.factory.station]) S.factory.station = 'CAP_BENCH';
  },

  canWork: function () {
    if (S.time.phase !== 'SHIFT') return 'disabled.notEvening';
    if (S.factory.worked) return 'disabled.shiftDone';
    if (!S.job.employed) return 'disabled.sacked';
    return true;
  },

  /* ------------------------------------------------------------- the math
     Condition multiplier: everything the body and the week are doing to your
     hands before you have made a single piece.
     --------------------------------------------------------------------- */
  condition: function (station) {
    var b = S.body, c = 1;
    if (b.hunger > 80) c -= 0.15; else if (b.hunger > 60) c -= 0.08;
    if (b.warmth < 30) c -= 0.06;
    c -= (b.fatigue / 100) * 0.22;
    if (b.injury) c -= (INJURY_DEF[b.injury.type] ? INJURY_DEF[b.injury.type].output : 0.08);
    if (b.injury && b.injury.fever) c -= 0.15;
    c -= State.scarPenalty();
    if (station === 'CAP_BENCH') c -= (b.tremor / 100) * 0.30;
    if (station === 'GRINDING') c -= (b.tremor / 100) * 0.12 + (b.dust / 100) * 0.15;
    if (station === 'CASTING' && b.lead > 40) c -= 0.06;
    if (b.lead > 40) c -= 0.05;                 /* the colic, and the fog with it */
    if (S.mind.resolve < 25) c -= 0.05;
    return Util.clamp(c, 0.25, 1.15);
  },

  rejectRate: function (station) {
    var care = CARE[S.factory.care];
    var r = care.reject;
    var skill = Factory.skill(station);
    if (skill < 25) r *= 1.9; else if (skill < 50) r *= 1.35;
    r *= 1 + S.body.fatigue / 300;
    if (station === 'CAP_BENCH') r *= 1 + S.body.tremor / 90;
    if (S.body.lead > 40) r *= 1.15;
    return Util.clamp(r, 0.005, 0.6);
  },

  accidentRisk: function (station) {
    var d = STATION_DEF[station];
    var risk = d.accident
      * PACE[S.factory.pace].accident
      * CARE[S.factory.care].accident
      * GUARD[S.factory.guard].accident
      * (1 - Factory.skill(station) / 160)
      * (1 + S.body.fatigue / 110);
    if (S.body.injury) risk *= 1.35;
    if (S.body.hunger > 75) risk *= 1.2;
    if (station === 'CAP_BENCH' || station === 'GRINDING') risk *= 1 + S.body.tremor / 150;
    if (S.body.lead > 50) risk *= 1.1;
    return Util.clamp(risk, 0, 0.85);
  },

  catastropheRisk: function (station) {
    var d = STATION_DEF[station];
    var r = d.catRisk;
    if (S.factory.guard === 'off') r *= 1.5;
    if (S.factory.pace === 'driven') r *= 1.4;
    if (S.factory.care === 'meticulous') r *= 0.8;
    if (S.factory.care === 'sloppy') r *= 1.2;
    return r;
  },

  /* Deterministic forecast, used by the dials panel and the transfer preview.
     No dice: this is what the player is promised, not what they will get. */
  estimate: function (station, dials) {
    station = station || S.factory.station;
    var d = STATION_DEF[station];
    var keep = { p: S.factory.pace, c: S.factory.care, g: S.factory.guard };
    if (dials) {
      S.factory.pace = dials.pace || keep.p;
      S.factory.care = dials.care || keep.c;
      S.factory.guard = dials.guard || keep.g;
    }
    var ord = Factory.order();
    var skillMult = 0.55 + Factory.skill(station) / 100 * 0.65;
    var output = d.baseOutput * skillMult
      * PACE[S.factory.pace].output * CARE[S.factory.care].output * GUARD[S.factory.guard].output
      * Factory.condition(station) * ord.output;
    output = Math.max(0, Math.round(output));
    var rejects = Math.round(output * Factory.rejectRate(station) * ord.reject);
    var good = Math.max(0, output - rejects);
    var out = {
      station: station,
      order: ord.id,
      rarity: ord.rarity,
      output: output,
      rejects: rejects,
      good: good,
      credits: Math.round(good * d.quotaWeight * ord.quota),
      wage: Math.max(WAGE.dayFloor, Math.round(good * d.pieceRate * ord.value)),
      spoilage: Factory.spoilCharge(output, rejects, ord, Math.max(WAGE.dayFloor, Math.round(good * d.pieceRate * ord.value))),
      accident: Factory.accidentRisk(station),
      catastrophe: Factory.catastropheRisk(station)
    };
    S.factory.pace = keep.p; S.factory.care = keep.c; S.factory.guard = keep.g;
    return out;
  },

  /* ------------------------------------------------------------ the shift */
  resolveShift: function () {
    var station = S.factory.station;
    var d = STATION_DEF[station];
    var beats = [];
    var rec = {
      station: station,
      pace: S.factory.pace, care: S.factory.care, guard: S.factory.guard,
      hours: WAGE.hours,
      output: 0, rejects: 0, good: 0, credits: 0, wage: 0,
      skillBefore: Factory.skill(station), skillGain: 0,
      injury: null, catastrophe: null, nearMiss: false, died: null,
      outcome: 'normal',
      beats: []
    };

    beats.push({ key: 'shift.beats.open.' + station });
    beats.push({ key: 'shift.beats.pace.' + S.factory.pace });
    beats.push({ key: 'shift.beats.care.' + S.factory.care });
    beats.push({ key: 'shift.beats.guard.' + S.factory.guard, kind: S.factory.guard === 'off' ? 'bad' : null });

    /* two beats off this floor, one off the yard */
    var floorBeats = T('shift.beats.' + station);
    var i1 = Util.rndInt(0, floorBeats.length - 1);
    var i2 = (i1 + 1 + Util.rndInt(0, floorBeats.length - 2)) % floorBeats.length;
    beats.push({ text: floorBeats[i1] });
    var common = T('shift.beats.common');
    beats.push({ text: common[Util.rndInt(0, common.length - 1)] });
    beats.push({ text: floorBeats[i2] });

    /* --- output --- */
    var ord = Factory.order();
    rec.order = ord.id;
    rec.rarity = ord.rarity;
    var skillMult = 0.55 + Factory.skill(station) / 100 * 0.65;
    var swing = 0.94 + Util.rnd() * 0.12;
    var output = d.baseOutput * skillMult
      * PACE[S.factory.pace].output * CARE[S.factory.care].output * GUARD[S.factory.guard].output
      * Factory.condition(station) * ord.output * swing;
    rec.output = Math.max(0, Math.round(output));
    rec.rejects = Math.round(rec.output * Factory.rejectRate(station) * ord.reject);
    rec.good = Math.max(0, rec.output - rec.rejects);
    rec.credits = Math.round(rec.good * d.quotaWeight * ord.quota);
    rec.wage = Math.max(WAGE.dayFloor, Math.round(rec.good * d.pieceRate * ord.value));

    /* The Works allows four in the hundred. Everything condemned above that
       is charged at the value of the article, and on a breech block the value
       of the article is a fortnight. Meticulous work is the only defence. */
    rec.spoilage = Factory.spoilCharge(rec.output, rec.rejects, ord, rec.wage);
    S.pending.spoilage = (S.pending.spoilage || 0) + rec.spoilage;

    /* --- what the floor takes --- */
    var wear = d.wear;
    var fatigue = wear.fatigue * PACE[S.factory.pace].fatigue
      + (S.body.hunger > 60 ? 5 : 0) + (S.body.warmth < 30 ? 4 : 0);
    State.applyBody({
      fatigue: Math.round(fatigue),
      hunger: 26,
      warmth: -6,
      health: wear.health,
      dust: wear.dust,
      tremor: wear.tremor,
      lead: wear.lead
    });
    if (wear.dust) S.body.lastHarm = null;

    /* --- catastrophe, then ordinary accident --- */
    var catRisk = Factory.catastropheRisk(station);
    var accRisk = Factory.accidentRisk(station);

    if (Util.chance(catRisk)) {
      rec.catastrophe = d.catastrophe;
      rec.outcome = 'hurt';
      var victim = Factory.pickNeighbour(station);
      rec.died = victim ? { name: victim.name, age: victim.age } : null;
      if (victim) victim.alive = false;
      Factory.inflict(CATASTROPHE_INJURY[d.catastrophe], rec);
      State.applyMind({ resolve: -18 });
      State.applyStanding({ workmates: 4, notice: 2 });
      S.flags.sawACatastrophe = (S.flags.sawACatastrophe || 0) + 1;
      beats.push({ key: 'shift.beats.hurt', kind: 'cat' });
    } else if (Util.chance(accRisk)) {
      rec.outcome = 'hurt';
      var type = d.injuries[Util.rndInt(0, d.injuries.length - 1)];
      if (S.factory.guard === 'off' && Util.chance(0.45)) type = STATION_SEVERE[station];
      Factory.inflict(type, rec);
      beats.push({ key: 'shift.beats.hurt', kind: 'hurt' });
    } else if (Util.rnd() < accRisk * 1.8) {
      rec.nearMiss = true;
      beats.push({ key: 'shift.beats.nearMiss.' + station, kind: 'bad' });
    }

    /* --- how it read, in the end --- */
    if (rec.outcome !== 'hurt') {
      var expected = d.baseOutput * skillMult;
      if (rec.good > expected * 1.12) rec.outcome = 'good';
      else if (rec.good < expected * 0.78) rec.outcome = 'bad';
    }
    beats.push({ key: 'shift.beats.close.' + rec.outcome, kind: rec.outcome === 'good' ? 'good' : (rec.outcome === 'normal' ? null : 'bad') });

    /* --- the count --- */
    S.factory.quota.made += rec.credits;

    /* --- the hand comes up, slowly --- */
    var gain = Math.max(0.4, 3.2 * (1 - Factory.skill(station) / 100));
    if (S.factory.pace === 'driven') gain *= 0.85;
    if (S.factory.care === 'meticulous') gain *= 1.2;
    S.factory.skills[station] = Util.clamp(Factory.skill(station) + gain, 0, 100);
    rec.skillGain = Math.round((S.factory.skills[station] - rec.skillBefore) * 10) / 10;

    /* --- Coom watches the dials, not the man --- */
    var fm = PACE[S.factory.pace].foreman + CARE[S.factory.care].foreman + GUARD[S.factory.guard].foreman;
    if (fm) State.applyStanding({ foreman: fm });
    if (S.factory.guard === 'off') S.factory.guardsOffShifts += 1;

    S.factory.worked = true;
    S.factory.lastOutcome = rec.outcome;
    rec.beats = beats;
    S.factory.shift = {
      station: rec.station, output: rec.output, rejects: rec.rejects, good: rec.good,
      credits: rec.credits, wage: rec.wage, outcome: rec.outcome, hours: rec.hours,
      order: rec.order, rarity: rec.rarity, spoilage: rec.spoilage,
      skillGain: rec.skillGain, injury: rec.injury, catastrophe: rec.catastrophe,
      died: rec.died, nearMiss: rec.nearMiss, beats: beats
    };

    /* the docket pays piece rate, not a day rate */
    S.pending.pieceWage = rec.wage;

    UI.log(T('shift.workedFor', { h: WAGE.hours, station: T('shift.stations.' + station + '.name') }));
    return rec;
  },

  /* Four in the hundred is the Works' own tolerance. Above it, you pay. */
  spoilCharge: function (output, rejects, ord, wage) {
    var allowance = Math.ceil(output * 0.04);
    var excess = Math.max(0, rejects - allowance);
    return Math.min(Math.round(excess * ord.spoil), Math.max(0, wage));
  },

  /* Whoever is nearest when it goes. Usually somebody's daughter. */
  pickNeighbour: function (station) {
    var here = [], all = [];
    for (var i = 0; i < S.factory.floor.length; i++) {
      var h = S.factory.floor[i];
      if (!h.alive) continue;
      all.push(h);
      if (h.station === station) here.push(h);
    }
    var pool = here.length ? here : all;
    if (!pool.length) return null;
    return pool[Util.rndInt(0, pool.length - 1)];
  },

  inflict: function (type, rec) {
    var def = INJURY_DEF[type];
    if (!def) return;
    rec.injury = type;
    State.injure({
      type: type,
      severity: def.severity,
      daysLeft: def.days,
      permanent: !!def.permanent
    });
    if (S.body.injury && S.body.injury.type === type) {
      S.body.injury.infection = S.body.injury.infection || 0;
      S.body.injury.fever = false;
      S.body.injury.tended = 0;
    }
    State.applyBody({ health: def.health, tremor: def.tremor || 0 });
    S.body.lastHarm = 'injury';
    if (def.scar) State.addScar(type, def.scar);
    State.applyMind({ resolve: -6 });
    UI.log(T('log.hurt', { what: T('injuries.' + type) }), 'bad');
  },

  /* ----------------------------------------------------------- the count */
  quotaProgress: function () {
    var q = S.factory.quota;
    var dayInWeek = ((S.time.day - 1) % 7) + 1;
    return {
      week: q.week,
      target: q.target,
      made: q.made,
      remaining: Math.max(0, q.target - q.made),
      shiftsLeft: Math.max(0, 7 - dayInWeek),
      lastTarget: q.lastTarget
    };
  },

  /* Called at the end of every seventh night. The ratchet lives here. */
  quotaRollover: function () {
    var q = S.factory.quota;
    var beaten = q.made >= q.target;
    var result = {
      week: q.week,
      made: q.made,
      target: q.target,
      beaten: beaten,
      bonus: 0,
      fine: 0,
      next: q.target,
      warnings: S.job.warnings,
      dismissed: false
    };

    if (beaten) {
      result.bonus = QUOTA.bonus;
      S.pending.bonus += QUOTA.bonus;
      /* the ratchet: the figure follows what you proved you could do */
      var byPct = Math.round(q.target * (100 + QUOTA.ratchetPct) / 100);
      var byMade = Math.round(q.made * 1.04);
      result.next = Math.max(byPct, byMade);
      q.weeksBeaten += 1;
      S.job.warnings = Math.max(0, S.job.warnings - 1);
      result.warnings = S.job.warnings;
      State.applyStanding({ foreman: 3 });
    } else {
      result.fine = QUOTA.fine;
      S.pending.quotaFine += QUOTA.fine;
      q.weeksMissed += 1;
      S.job.warnings += 1;
      S.job.lastWarningDay = S.time.day;
      result.warnings = S.job.warnings;
      State.applyStanding({ foreman: -6 });
      State.applyMind({ resolve: -5 });
      if (S.job.warnings >= QUOTA.warningsToDismissal) {
        S.job.employed = false;
        S.flags.sacked = true;
        result.dismissed = true;
      }
    }

    /* a warning three weeks clean falls off the book. Coom does not mention it. */
    if (S.job.warnings > 0 && S.time.day - (S.job.lastWarningDay || 0) >= 21) {
      S.job.warnings -= 1;
      result.warnings = S.job.warnings;
    }

    q.lastTarget = q.target;
    q.lastMade = q.made;
    q.target = result.next;
    q.made = 0;
    q.week += 1;
    q.lastResult = result;
    q.unseen = true;        /* lives in S so a reload cannot lose the reckoning */
    return result;
  },

  /* --------------------------------------------------------- the transfer */
  transferOptions: function () {
    var out = [];
    for (var i = 0; i < STATIONS.length; i++) {
      var st = STATIONS[i];
      var reason = null;
      if (st === S.factory.station) reason = 'shift.transfer.alreadyThere';
      else if (S.standing.foreman < TRANSFER_GATE[st]) reason = 'shift.transfer.needStanding';
      else if (S.factory.transfer && S.factory.transfer.day === S.time.day) reason = 'shift.transfer.pending';
      out.push({ station: st, reason: reason });
    }
    return out;
  },

  transferPreview: function (to) {
    var here = Factory.estimate(S.factory.station);
    var there = Factory.estimate(to);
    return {
      from: S.factory.station,
      to: to,
      fromSkill: Math.round(Factory.skill(S.factory.station)),
      toSkill: Math.round(Factory.skill(to)),
      wageNow: here.wage,
      wageThere: there.wage,
      hazardKey: 'shift.stations.' + to + '.hazard'
    };
  },

  requestTransfer: function (to) {
    if (!STATION_DEF[to] || to === S.factory.station) return { ok: false, key: 'shift.transfer.alreadyThere' };
    if (S.standing.foreman < TRANSFER_GATE[to]) return { ok: false, key: 'shift.transfer.needStanding' };
    if (S.factory.transfer && S.factory.transfer.day === S.time.day) return { ok: false, key: 'shift.transfer.pending' };

    S.factory.transfer = { to: to, day: S.time.day };
    /* he can still say no, and the nearer you are to the line, the likelier */
    var margin = S.standing.foreman - TRANSFER_GATE[to];
    var refuseChance = Util.clamp(0.4 - margin / 100, 0.02, 0.5);
    if (Util.chance(refuseChance)) {
      State.applyStanding({ foreman: -2 });
      return { ok: false, key: 'shift.transfer.refused' };
    }
    S.factory.station = to;
    State.applyStanding({ foreman: -3 });
    S.flags.hasTransferred = true;
    return { ok: true, key: 'shift.transfer.granted' };
  },

  /* ------------------------------------------------------ not going in */
  skipShift: function () {
    S.factory.worked = false;
    S.factory.lastOutcome = 'absent';
    S.factory.shift = null;
    S.pending.pieceWage = 0;
    S.job.shiftsMissed += 1;
    S.job.warnings += 1;
    State.applyStanding({ foreman: -12 });
    State.applyBody({ fatigue: -18, hunger: 12, warmth: -2 });
    State.applyMind({ resolve: -2 });
    UI.log(T('shift.abstained'), 'bad');
    UI.log(T('shift.foremanNotes'));
    if (S.job.warnings >= QUOTA.warningsToDismissal || S.standing.foreman <= -70) {
      S.job.employed = false;
      S.flags.sacked = true;
    }
    return 'absent';
  },

  waitAtGate: function () {
    S.factory.worked = false;
    S.factory.lastOutcome = 'casual';
    S.pending.pieceWage = 0;
    State.applyBody({ fatigue: 8, hunger: 14, warmth: -10 });
    if (Util.chance(0.4)) {
      var pay = Util.rndInt(6, 13);
      State.applyPurse({ pennies: pay });
      UI.log(T('log.gained', { amt: Economy.money(pay) }), 'good');
      return 'casual_got';
    }
    State.applyMind({ resolve: -3 });
    return 'casual_none';
  }
};

/* ==========================================================================
   OVERSEER COOM — a standing meter, not a friend.
   ========================================================================== */
var Coom = {

  moodKey: function () {
    if (S.foreman.spiteUntil >= S.time.day) return 'foreman.blurbSpite';
    if (S.foreman.skimUntil >= S.time.day) return 'foreman.blurbBad';
    if (S.standing.foreman >= 25) return 'foreman.blurbGood';
    return 'foreman.blurbFlat';
  },

  /* What exists at all is gated by standing. Not just how it reads. */
  options: function () {
    var out = [];
    out.push({ id: 'endure', labelKey: 'foreman.endure', hintKey: 'foreman.endureHint', reason: null });

    out.push({
      id: 'flatter', labelKey: 'foreman.flatter', hintKey: 'foreman.flatterHint',
      reason: S.foreman.flatterCooldown >= S.time.day ? 'disabled.askedAlready'
            : (S.standing.foreman <= -55 ? 'disabled.foremanCold' : null)
    });

    out.push({
      id: 'bribe', labelKey: 'foreman.bribe', hintKey: 'foreman.bribeHint',
      params: { amt: Economy.money(12) },
      reason: S.purse.pennies < 12 ? 'disabled.noPennies'
            : (S.foreman.bribedUntil >= S.time.day ? 'disabled.askedAlready' : null)
    });

    /* the letter needs letters, or a scribe who has them */
    var canWrite = S.mind.literacy >= 2;
    out.push({
      id: 'report',
      labelKey: canWrite ? 'foreman.report' : 'foreman.scribe',
      hintKey: canWrite ? 'foreman.reportHint' : 'foreman.scribeHint',
      params: canWrite ? null : { amt: Economy.money(8) },
      reason: S.foreman.reported ? 'disabled.reportedAlready'
            : (!canWrite && S.purse.pennies < 8 ? 'disabled.noScribe' : null)
    });

    return out;
  },

  choose: function (id) {
    var o = null, opts = Coom.options(), i;
    for (i = 0; i < opts.length; i++) if (opts[i].id === id) o = opts[i];
    if (!o || o.reason) return null;

    if (id === 'endure') {
      return 'foreman.r_endure';
    }
    if (id === 'flatter') {
      State.applyStanding({ foreman: 6, workmates: -2 });
      State.applyMind({ resolve: -4 });
      S.foreman.flatterCooldown = S.time.day + 1;
      return 'foreman.r_flatter';
    }
    if (id === 'bribe') {
      Economy.spend(12);
      State.applyStanding({ foreman: 12 });
      S.foreman.bribedUntil = S.time.day + 7;
      S.foreman.skimUntil = 0;
      return 'foreman.r_bribe';
    }
    if (id === 'report') {
      if (S.mind.literacy < 2) Economy.spend(8);
      S.foreman.reported = true;
      S.foreman.inspectorDay = S.time.day + 3;
      S.flags.wroteToInspector = true;
      State.applyStanding({ notice: 6 });
      return 'foreman.r_report';
    }
    return null;
  },

  /* Called at the start of every day. Spite, skimming, and the Inspectorate. */
  tick: function () {
    if (S.standing.foreman <= -30 && S.foreman.skimUntil < S.time.day && Util.chance(0.35)) {
      S.foreman.skimUntil = S.time.day + Util.rndInt(2, 6);
    }
    if (S.standing.foreman <= -45 && S.foreman.spiteUntil < S.time.day && Util.chance(0.3)) {
      S.foreman.spiteUntil = S.time.day + Util.rndInt(2, 5);
    }
  },

  /* The full chain, fired the morning the Inspector arrives. */
  inspectorDue: function () {
    return S.foreman.reported && !S.foreman.inspectorVisited && S.time.day >= S.foreman.inspectorDay;
  },

  inspectorVisit: function () {
    S.foreman.inspectorVisited = true;
    S.flags.inspectorCame = true;
    State.applyStanding({ workmates: -30, foreman: -25, notice: 12 });
    State.applyMind({ resolve: -8 });
    S.foreman.spiteUntil = S.time.day + 12;
    S.foreman.skimUntil = S.time.day + 12;
    UI.log(T('inspector.aftermath'), 'bad');
    return true;
  },

  /* Invented deductions, for the docket. */
  skims: function () {
    if (S.foreman.skimUntil < S.time.day) return [];
    var out = [];
    var n = Util.rndInt(1, 2);
    var pool = COOM_SKIMS.slice();
    for (var i = 0; i < n && pool.length; i++) {
      var idx = Util.rndInt(0, pool.length - 1);
      out.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return out;
  }
};
