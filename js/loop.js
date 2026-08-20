/* ==========================================================================
   GRIMWICK WORKS — js/loop.js
   The day machine: SHIFT -> EVENING -> NIGHT -> docket -> the next one.
   Every transition is an explicit call. Nothing advances behind your back.
   ========================================================================== */

var Loop = {

  /* ---- boot ----------------------------------------------------------- */
  newGame: function (seed) {
    S = newState(seed);
    UI.log(T('log.dayBegins', {
      d: S.time.day,
      season: T('seasons.' + S.time.season),
      weather: T('weather.' + S.time.weather)
    }), 'head');
    Loop.startDay(true);
  },

  resumeLoaded: function () {
    UI.render();
    if (S.dead) UI.showEnding(S.endingId);
  },

  /* ---- day ------------------------------------------------------------ */
  startDay: function (isFirst) {
    S.time.season = Util.seasonFor(S.time.day);
    S.time.act = Util.actFor(S.time.day);
    S.time.weather = Util.pick(WEATHERS[S.time.season]);
    S.time.phase = 'SHIFT';

    S.factory.worked = false;
    S.factory.lastOutcome = null;
    S.evening.ap = 2;
    S.evening.ended = false;
    S.evening.rested = false;
    S.night.resolved = false;
    S.night.share = null;
    S.flags.dressedToday = 0;
    S.docket = null;
    if (S.time.day % 7 === 1) S.house.coatMended = false;

    Empire.tick();
    Coom.tick();
    Factory.assignStation();
    S.pending.pieceWage = 0;

    if (!isFirst) {
      UI.log(T('log.dayBegins', {
        d: S.time.day,
        season: T('seasons.' + S.time.season),
        weather: T('weather.' + S.time.weather)
      }), 'head');
    }
    UI.log(T('log.phaseShift'));
    UI.render();
    Tutorial.onPhase('SHIFT');
    if (S.flags.spitedToStation) {
      S.flags.spitedToStation = false;
      UI.log(T('foreman.spiteNotice'), 'bad');
    }
    if (Coom.inspectorDue()) UI.showInspector();
  },

  /* ---- shift ---------------------------------------------------------- */
  work: function () {
    if (S.time.phase !== 'SHIFT' || S.factory.worked) return;
    if (Factory.canWork() !== true) return;
    var rec = Factory.resolveShift();
    Audio.shiftStart(rec.station);
    UI.playShift(rec, function () {
      Audio.shiftEnd();
      Loop.checkDeath();
      if (S.dead) { UI.showEnding(S.endingId); return; }
      Loop.afterShiftAction();
    });
  },

  setDial: function (kind, value) {
    if (Factory.setDial(kind, value)) UI.render();
  },

  askTransfer: function (to) {
    var res = Factory.requestTransfer(to);
    UI.showResult(T(res.key), function () { UI.render(); });
    Audio.dial();
  },

  foremanChoice: function (id) {
    var key = Coom.choose(id);
    if (!key) { UI.render(); return; }
    UI.showResult(T(key), function () { UI.render(); });
  },

  skip: function () {
    if (S.time.phase !== 'SHIFT' || S.factory.worked) return;
    Factory.skipShift();
    S.factory.worked = false;
    S.factory.lastOutcome = 'absent';
    S.evening.ended = false;
    /* an absent day still ends: you go out into the evening either way */
    UI.render();
  },

  gateWait: function () {
    if (S.time.phase !== 'SHIFT') return;
    var res = Factory.waitAtGate();
    UI.showResult(T('shift.' + (res === 'casual_got' ? 'casualGot' : 'casualNone')), function () {
      Loop.checkDeath();
      UI.render();
    });
  },

  afterShiftAction: function () {
    var evt = Events.roll('SHIFT');
    if (evt) {
      UI.showEvent(evt, function () { Loop.checkDeath(); UI.render(); });
    } else {
      Loop.checkDeath();
      UI.render();
    }
  },

  toEvening: function () {
    if (S.time.phase !== 'SHIFT') return;
    S.time.phase = 'EVENING';
    UI.log(T('log.phaseEvening'));
    UI.render();
    Tutorial.onPhase('EVENING');
    var evt = Events.roll('EVENING');
    if (evt) UI.showEvent(evt, function () { Loop.checkDeath(); UI.render(); });
  },

  /* ---- evening -------------------------------------------------------- */
  act: function (actionId) {
    if (S.time.phase !== 'EVENING') return;
    var key = Town.perform(actionId);
    if (!key) { UI.render(); return; }
    UI.showResult(T(key), function () { Loop.checkDeath(); UI.render(); });
  },

  endEvening: function () {
    if (S.time.phase !== 'EVENING') return;
    S.evening.ended = true;
    S.time.phase = 'NIGHT';
    UI.log(T('log.phaseNight'));
    UI.render();
    Tutorial.onPhase('NIGHT');
    var evt = Events.roll('NIGHT');
    if (evt) UI.showEvent(evt, function () { Loop.checkDeath(); UI.render(); });
  },

  /* ---- night ---------------------------------------------------------- */
  needsShareChoice: function () {
    var k = State.kin();
    return !!k && k.status !== 'DEAD' && S.house.larder === 1;
  },

  bedDown: function (share) {
    if (S.time.phase !== 'NIGHT' || S.night.resolved) return;
    S.night.share = share || null;
    Loop.resolveNight();
  },

  resolveNight: function () {
    var k = State.kin();
    var alive = !!k && k.status !== 'DEAD';
    var bite = WEATHER_BITE[S.time.weather] || 6;

    /* the body charges rent too, and it charges it nightly */
    State.applyBody({ hunger: 6 });

    /* --- eating --- */
    var needed = alive ? 2 : 1;
    if (S.house.larder >= needed) {
      S.house.larder -= needed;
      State.applyBody({ hunger: -30 });
      if (alive) State.applyKin({ health: 3, mood: 3 });
      UI.log(T('night.ate'));
    } else if (S.house.larder === 1 && alive) {
      S.house.larder = 0;
      if (S.night.share === 'kin') {
        State.applyKin({ health: 6, mood: 6 });
        State.applyBody({ hunger: 16 });
        State.applyMind({ resolve: 3 });
        UI.log(T('night.kinAte'));
      } else if (S.night.share === 'split') {
        State.applyKin({ health: 1, mood: 2 });
        State.applyBody({ hunger: -14 });
        UI.log(T('night.sharedHalf'));
      } else {
        State.applyBody({ hunger: -28 });
        State.applyKin({ health: -7, mood: -8 });
        State.applyMind({ resolve: -4 });
        UI.log(T('night.youWentWithout'));
      }
    } else if (S.house.larder === 1) {
      S.house.larder = 0;
      State.applyBody({ hunger: -30 });
      UI.log(T('night.ate'));
    } else {
      State.applyBody({ hunger: 20, health: -3 });
      S.body.lastHarm = 'starve';
      if (alive) State.applyKin({ health: -7, mood: -6 });
      UI.log(T('night.ateNothing'), 'bad');
    }

    /* a stocked larder is no use to a starving man who will not open it */
    if (S.body.hunger > 55 && S.house.larder >= 1) {
      S.house.larder -= 1;
      State.applyBody({ hunger: -18 });
      UI.log(T('night.secondHelping'));
    }

    /* --- fire --- */
    if (S.house.coal > 0) {
      S.house.coal -= 1;
      State.applyBody({ warmth: 24 - Math.floor(bite / 3) });
      UI.log(T('night.burned'));
    } else {
      State.applyBody({ warmth: -bite, health: bite > 12 ? -3 : -1 });
      if (S.body.warmth < 30) S.body.lastHarm = 'cold';
      if (alive) State.applyKin({ health: bite > 12 ? -5 : -2 });
      UI.log(T('night.noCoal'), 'bad');
    }
    State.applyBody({ warmth: -Math.floor(bite / 2) });

    /* --- sleep --- */
    var rest = 34;
    if (S.body.hunger > 70) rest -= 10;
    if (S.body.warmth < 28) rest -= 10;
    if (S.body.injury) rest -= 6;
    State.applyBody({ fatigue: -Math.max(8, rest) });
    if (rest >= 28 && !S.body.injury && S.body.hunger < 50 && S.body.warmth > 55) {
      /* the only thing that mends you here is an ordinary night, and they
         are not ordinary often */
      State.applyBody({ health: 3 });
      S.body.lastHarm = null;
    }
    UI.log(T(rest >= 28 ? 'night.slept' : 'night.sleptBadly'));

    /* --- the wound, and what gets into it --- */
    if (S.body.injury) {
      var inj = S.body.injury;
      if (typeof inj.infection !== 'number') inj.infection = 0;

      if (S.flags.surgeonDay === S.time.day) {
        /* the apothecary cut away what was dead and dressed it properly */
        inj.infection = 0;
        inj.fever = false;
        inj.daysLeft = Math.max(1, inj.daysLeft - 2);
      } else {
        var care = S.flags.dressedToday || 0;          /* 0 nothing, 1 rag, 2 bottle */
        var gain = Util.rndInt(12, 22) - care * 8;
        if (S.house.physic > 0) gain -= 2;
        if (S.body.warmth < 30) gain += 5;
        if (S.body.hunger > 70) gain += 5;
        if (inj.severity >= 4) gain += 4;
        inj.infection = Util.clamp(inj.infection + gain, 0, 100);
      }

      if (!inj.fever && inj.infection >= 55) {
        inj.fever = true;
        UI.log(T('fever.onset'), 'bad');
      } else if (inj.fever && inj.infection < 35) {
        inj.fever = false;
        UI.log(T('fever.breaking'), 'good');
      }

      if (inj.fever) {
        State.applyBody({ health: -7, fatigue: 8 });
        State.applyMind({ resolve: -3 });
        S.body.lastHarm = 'injury';
        UI.log(T(inj.infection >= 85 ? 'fever.tooLate' : 'fever.burning'), 'bad');
      } else if (inj.infection >= 30) {
        State.applyBody({ health: -2 });
        S.body.lastHarm = 'injury';
        UI.log(T('night.woundWorse'), 'bad');
      } else {
        inj.daysLeft -= 1;
        if (inj.daysLeft <= 0) {
          UI.log(T('log.healed', { what: T('injuries.' + inj.type) }), 'good');
          if (inj.permanent) State.applyBody({ tremor: 4 });
          S.body.injury = null;
        }
      }
    }

    /* --- the chest --- */
    if (S.body.dust > 45 && Util.chance(S.body.dust / 300)) {
      State.applyBody({ health: -3 });
      S.body.lastHarm = 'sick';
      UI.log(T('night.coughing'), 'bad');
    }

    /* --- kin --- */
    if (alive) {
      if (k.status === 'FEVERED' && Util.chance(0.3)) {
        State.applyKin({ health: 8 });
        UI.log(T('night.kinBetter'), 'good');
      } else if (k.health < 55) {
        UI.log(T('night.kinWorse'));
      }
      if (k.health <= 0) {
        k.status = 'DEAD';
        State.applyMind({ resolve: -25 });
        S.flags.kinDied = true;
        UI.log(T('night.kinDied'), 'bad');
      }
    }

    /* --- rent --- */
    if (S.time.day === S.house.rentDue) {
      if (S.house.rentPaidFor === S.house.rentDue) {
        S.flags.rentPaidEarly = false;
        UI.log(T('night.rentPaid'));
      } else if (S.purse.pennies >= S.house.rentAmount) {
        S.purse.pennies -= S.house.rentAmount;
        UI.log(T('night.rentPaid'));
        UI.log(T('log.spent', { amt: Economy.money(S.house.rentAmount) }));
      } else {
        var short = S.house.rentAmount - S.purse.pennies;
        S.purse.pennies = 0;
        S.house.arrears += short;
        S.house.rentMissed += 1;
        S.flags.rentAtSource = true;
        State.applyMind({ resolve: -6 });
        UI.log(T('night.rentMissed'), 'bad');
      }
      S.house.rentDue += WAGE.rentEvery;
    }

    /* --- the store book grows on Sundays --- */
    if (S.time.day % 7 === 0) {
      var added = Economy.compoundDebt();
      if (added > 0) UI.log(T('log.debtUp', { amt: Economy.money(S.purse.debt) }), 'bad');
    }

    /* --- the week's count, every seventh night --- */
    if (S.time.day % 7 === 0 && S.job.employed) Factory.quotaRollover();

    S.night.resolved = true;
    Loop.checkDeath();
    Loop.issueDocket();
  },

  /* ---- the docket ----------------------------------------------------- */
  issueDocket: function () {
    var docket = Economy.settle(Economy.buildDocket());
    if (!S.dead) Save.autosave();
    UI.showDocket(docket, function () {
      if (S.dead) { UI.showEnding(S.endingId); return; }
      if (S.factory.quota.unseen && S.factory.quota.lastResult) {
        var q = S.factory.quota.lastResult;
        S.factory.quota.unseen = false;
        UI.showQuota(q, function () {
          if (q.dismissed) { UI.showResult(T('shift.quota.dismissal'), function () { Loop.nextDay(); }); }
          else Loop.nextDay();
        });
        return;
      }
      Loop.nextDay();
    });
  },

  nextDay: function () {
    if (S.time.day >= 60) {
      S.endingId = 'survived_winter';
      UI.showEnding('survived_winter');
      return;
    }
    var wasDay = S.time.day;
    S.time.day += 1;
    Loop.startDay(false);
    if (wasDay === 10) UI.showMilestone();
  },

  /* ---- death ---------------------------------------------------------- */
  checkDeath: function () {
    if (S.dead) return true;
    if (S.settings.god) {
      if (S.body.health <= 0) S.body.health = 1;
      return false;
    }
    if (S.body.health <= 0) {
      S.body.health = 0;
      S.dead = true;
      S.endingId = Narrative.deathId();
      return true;
    }
    return false;
  },

  /* Used by the ending screen and the menu. */
  restart: function () {
    UI.closeAll();
    S.log = [];
    Loop.newGame();
  }
};
