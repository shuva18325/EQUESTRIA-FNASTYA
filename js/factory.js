/* ==========================================================================
   GRIMWICK WORKS — js/factory.js
   Prompt 1: one button, one flat outcome. The bench-by-bench system lands in
   Prompt 2 — this file is shaped to be replaced from the inside, not rewritten.
   ========================================================================== */

var STATION_WEAR = {
  CAPPING:  { tremor: 2, dust: 0, fatigue: 16, injuryRisk: 0.03, health: -1 },
  CASTING:  { tremor: 0, dust: 1, fatigue: 19, injuryRisk: 0.05, health: -2 },
  STAMPING: { tremor: 1, dust: 0, fatigue: 21, injuryRisk: 0.08, health: -1 },
  GRINDING: { tremor: 0, dust: 3, fatigue: 18, injuryRisk: 0.05, health: -2 }
};

var INJURY_TYPES = [
  { type: 'crushedHand', severity: 3, daysLeft: 6, permanent: false },
  { type: 'burn',        severity: 2, daysLeft: 4, permanent: false },
  { type: 'cutArm',      severity: 2, daysLeft: 3, permanent: false },
  { type: 'brokenRib',   severity: 3, daysLeft: 8, permanent: false }
];

var Factory = {

  /* Hollick puts you where the gap is. There is always a gap. */
  assignStation: function () {
    var pool = STATIONS.slice();
    if (S.body.tremor > 60) pool = pool.filter(function (s) { return s !== 'CAPPING'; });
    if (!pool.length) pool = STATIONS.slice();
    S.factory.station = pool[(S.time.day + (S.rng % 3)) % pool.length];
  },

  canWork: function () {
    if (S.time.phase !== 'SHIFT') return 'disabled.notEvening';
    if (S.factory.worked) return 'disabled.shiftDone';
    return true;
  },

  /* The flat outcome. Wage is computed later, on the docket, out of your hands. */
  workShift: function () {
    var wear = STATION_WEAR[S.factory.station];
    var outcome = 'normal';
    var roll = Util.rnd();

    if (roll < 0.16) outcome = 'good';
    else if (roll > 0.82) outcome = 'bad';

    var fatigue = wear.fatigue + (S.body.hunger > 60 ? 5 : 0) + (S.body.warmth < 30 ? 4 : 0);
    if (outcome === 'bad') fatigue += 6;

    State.applyBody({
      fatigue: fatigue,
      hunger: 26,
      warmth: -6,
      dust: wear.dust,
      tremor: wear.tremor,
      health: wear.health
    });

    /* injury: the press does not consult you */
    var risk = wear.injuryRisk
      + (S.body.fatigue > 70 ? 0.05 : 0)
      + (S.body.tremor > 50 ? 0.04 : 0)
      + (outcome === 'bad' ? 0.03 : 0);
    if (!S.body.injury && Util.chance(risk)) {
      outcome = 'hurt';
      var inj = Util.pick(INJURY_TYPES);
      State.injure(inj);
      State.applyBody({ health: -8 });
      S.body.lastHarm = 'injury';
      S.pending.breakages += Util.rndInt(0, 3);
      UI.log(T('log.hurt', { what: T('injuries.' + inj.type) }), 'bad');
    }

    if (outcome === 'good') State.applyStanding({ foreman: 2 });
    if (outcome === 'bad') { State.applyStanding({ foreman: -1 }); S.pending.breakages += Util.rndInt(0, 2); }

    S.factory.worked = true;
    S.factory.lastOutcome = outcome;
    S.job.warnings = Math.max(0, S.job.warnings - (outcome === 'good' ? 1 : 0));

    UI.log(T('shift.workedFor', { h: WAGE.hours, station: T(Narrative.stationNameKey()) }));
    return outcome;
  },

  /* Not going in is a legal move. It is not a free one. */
  skipShift: function () {
    S.factory.worked = false;
    S.factory.lastOutcome = 'absent';
    S.job.shiftsMissed += 1;
    S.job.warnings += 1;
    State.applyStanding({ foreman: -12 });
    State.applyBody({ fatigue: -18, hunger: 12, warmth: -2 });
    State.applyMind({ resolve: -2 });
    UI.log(T('shift.abstained'), 'bad');
    UI.log(T('shift.foremanNotes'));

    if (S.job.warnings >= 3 || S.standing.foreman <= -70) {
      S.job.employed = false;
      S.flags.sacked = true;
    }
    return 'absent';
  },

  /* Off the roll: the gate still opens, it just does not open for you. */
  waitAtGate: function () {
    S.factory.worked = false;
    S.factory.lastOutcome = 'casual';
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
