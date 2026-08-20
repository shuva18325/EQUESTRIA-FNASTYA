/* ==========================================================================
   GRIMWICK WORKS — js/loop.js
   The day machine: SHIFT -> EVENING -> NIGHT -> docket -> the next one.
   Every transition is an explicit call. Nothing advances behind your back.
   ========================================================================== */

var Loop = {

  /* A child who cannot be left alone costs you an hour of every evening. */
  apMax: function () {
    var base = 2;
    var k = State.kin();
    if (k && k.needsMinding && k.status !== 'DEAD' && k.status !== 'TAKEN') base -= 1;
    return Math.max(1, base);
  },

  /* Discharge is processed overnight, because everything there is. */
  workhouseMorning: function () {
    if (!S.destitution.workhouse) return;
    S.destitution.workhouseDays += 1;
    if (S.destitution.applied) {
      S.destitution.workhouse = false;
      S.destitution.applied = false;
      S.house.node = 'street';
      S.evening.at = 'rows';
      UI.log(T('destitution.discharged'), 'good');
    }
  },

  /* ---- boot ----------------------------------------------------------- */
  newGame: function (seed, kinId) {
    S = newState(seed);
    Loop.chooseKin(kinId || 'sister');
    Economy.recomputeMarket();
    UI.log(T('log.dayBegins', {
      d: S.time.day,
      season: T('seasons.' + S.time.season),
      weather: T('weather.' + S.time.weather)
    }), 'head');
    Loop.startDay(true);
  },

  /* Chosen once, at the start, and never chosen again. */
  chooseKin: function (kinId) {
    var opt = null;
    for (var i = 0; i < KIN_OPTIONS.length; i++) if (KIN_OPTIONS[i].id === kinId) opt = KIN_OPTIONS[i];
    if (!opt) opt = KIN_OPTIONS[0];
    S.house.kin = [Util.deepClone(opt.kin)];
    S.flags.kinKind = opt.id;
    if (opt.apply) opt.apply(S);
    S.evening.apMax = Loop.apMax();
    S.evening.ap = S.evening.apMax;
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
    S.evening.apMax = Loop.apMax();
    S.evening.ap = S.evening.apMax;
    S.evening.at = S.destitution.workhouse ? 'workhouse' : 'rows';
    S.evening.travelled = 0;
    S.evening.ended = false;
    S.evening.rested = false;
    S.night.resolved = false;
    S.night.share = null;
    S.flags.dressedToday = 0;
    S.docket = null;
    if (S.time.day % 7 === 1) S.house.coatMended = false;

    /* the week turns: the war moves, and the market with it */
    if ((S.time.day - 1) % 7 === 0 || !S.market.prices || !S.market.prices.bread) {
      Empire.week();
      S.flags.drinksThisWeek = 0;
    }
    Empire.tick();
    Coom.tick();
    Loop.workhouseMorning();
    Factory.assignStation();
    Factory.assignOrder();
    Empire.releaseCheck();
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

    /* the acts turn on the calendar or on the world, whichever comes first */
    var turn = Acts.check();
    if (turn) {
      UI.showActCard(turn, function () {
        Loop.morningPressure();
        UI.render();
      });
      return;
    }
    Loop.morningPressure();
  },

  /* Everything the world does to you before you have had breakfast. */
  morningPressure: function () {
    if (S.dead) return;

    /* the regiment leaves whether or not you are ready */
    if (S.flags.enlisted && S.time.day >= S.flags.departureDay) {
      S.endingId = 'the_shilling';
      UI.showEnding('the_shilling');
      return;
    }

    /* names you gave come back with what happened to them attached */
    var fates = Endings.fatesToShow();
    if (fates.length && (S.time.act >= 3 || S.time.day - fates[0].day >= 9)) {
      Endings.assignFates();
      UI.showFates(Endings.fatesToShow());
    }

    if (Coom.inspectorDue()) { UI.showInspector(); return; }

    var g = Empire.garrisonDay();
    if (!g) { UI.render(); return; }

    if (g.kind === 'hanged') {
      S.flags.condemned = true;
      S.endingId = 'the_drop';
      UI.showGarrison(g, function () { UI.showEnding('the_drop'); });
      return;
    }
    if (g.kind === 'arrested') {
      Empire.arrest(S.tracks.union.joined || S.flags.carryingPrint ? 'sedition' : 'suspicion');
      UI.showGarrison(g, function () { UI.render(); });
      return;
    }
    if (g.kind === 'searched') {
      var found = g.found;
      if (found.length) {
        /* the floorboard trick is in a manual somewhere */
        var hidden = S.flags.hasStash && Util.chance(0.45);
        if (!hidden) {
          State.applyStanding({ notice: 14, garrison: -10 });
          State.addFine('talk');
          S.flags.carryingPrint = false;
          S.flags.holdingParcel = false;
          S.flags.contrabandFound = true;
        } else {
          g.missed = true;
        }
      }
      UI.showGarrison(g, function () { UI.render(); });
      return;
    }
    if (g.kind === 'pressgang') {
      S.tracks.enlist.joined = true;
      S.tracks.enlist.known = true;
      S.flags.enlisted = true;
      S.flags.pressed = true;
      S.flags.departureDay = S.time.day + 2;
      UI.showGarrison(g, function () { UI.render(); });
      return;
    }
    UI.showGarrison(g, function () { UI.render(); });
  },

  /* ---- shift ---------------------------------------------------------- */
  /* Held. The day is spent, and the shifts are not made up. */
  holdDay: function () {
    if (!S.arrest) return;
    S.factory.worked = false;
    S.factory.lastOutcome = 'held';
    State.applyBody({ hunger: 18, warmth: -8, fatigue: 4 });
    State.applyMind({ resolve: -4 });
    S.time.phase = 'NIGHT';
    UI.log(T('garrison.arrested.cells'), 'bad');
    UI.render();
    Tutorial.onPhase('NIGHT');
  },

  /* Enlisted, and not gone yet. */
  drill: function () {
    if (!S.flags.enlisted || S.factory.lastOutcome === 'drill') return;
    S.factory.worked = false;
    S.factory.lastOutcome = 'drill';
    State.applyBody({ fatigue: 16, hunger: -22, warmth: 6, health: 1 });
    State.applyMind({ resolve: 2 });
    S.flags.drilled = (S.flags.drilled || 0) + 1;
    UI.showResult(T('enlist.drillResult'), function () { UI.render(); });
  },

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
    var evt = Events.roll('EVENING', Town.here());
    if (evt) UI.showEvent(evt, function () { Loop.checkDeath(); UI.render(); });
  },

  /* ---- evening -------------------------------------------------------- */
  travel: function (nodeId) {
    if (S.time.phase !== 'EVENING') return;
    if (Town.travelTo(nodeId)) UI.render();
  },

  act: function (actionId) {
    if (S.time.phase !== 'EVENING') return;
    var res = Town.perform(actionId);
    if (!res) { UI.render(); return; }
    if (res.open) {
      if (res.open === 'board') UI.showBoard();
      else if (res.open === 'ledger') UI.showLedger();
      else if (res.open === 'advice') UI.showAdvice();
      else if (res.open === 'broadsheet') UI.showBroadsheet(false);
      else if (res.open === 'broadsheetAloud') UI.showBroadsheet(true);
      else if (res.open === 'inform') UI.showInform();
      else UI.showPawn(res.open);
      UI.render();
      return;
    }
    if (!res.text) { UI.render(); return; }
    UI.showResult(res.text, function () { Loop.checkDeath(); UI.render(); });
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

    /* --- no room, no fire, no argument --- */
    if (!S.house.housed && !S.destitution.workhouse) {
      var rough = Math.round(bite * 1.5) - (S.flags.grateTonight ? 8 : 0) - State.goodsWarmth();
      State.applyBody({ warmth: -Math.max(4, rough), health: -3, fatigue: 6 });
      if (S.body.warmth < 30) S.body.lastHarm = 'cold';
      S.destitution.days += 1;
      if (State.kinPresent()) State.applyKin({ health: -6, mood: -8 });
      UI.log(T('destitution.sleptRough'), 'bad');
      S.flags.grateTonight = false;
      Loop.poorhouseRisk();
    } else if (S.destitution.workhouse) {
      /* the house feeds you, houses you, and takes everything else */
      State.applyBody({ hunger: -30, warmth: 30, health: 1, fatigue: -20 });
      State.applyMind({ resolve: -4 });
      UI.log(T('destitution.workhouseNight'));
    } else if (S.house.coal > 0) {
      S.house.coal -= 1;
      State.applyBody({ warmth: 24 - Math.floor(bite / 3) });
      UI.log(T('night.burned'));
    } else {
      State.applyBody({ warmth: -bite + State.goodsWarmth(), health: bite > 12 ? -3 : -1 });
      if (S.body.warmth < 30) S.body.lastHarm = 'cold';
      if (alive) State.applyKin({ health: bite > 12 ? -5 : -2 });
      UI.log(T('night.noCoal'), 'bad');
    }
    if (S.house.housed) State.applyBody({ warmth: -Math.floor(bite / 2) });

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
        var gain = Util.rndInt(11, 19) - care * 10;
        /* a clean dressing on a warm, fed body holds the line. that is the
           whole of nineteenth-century wound care and it is nearly enough.
           An undressed wound gets no benefit from any of it. */
        if (care > 0 && S.body.warmth > 50 && S.body.hunger < 62) gain -= 4;
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
      /* a death in the house is announced by State.applyKin, wherever it falls */
    }

    /* --- what the kin did with the day --- */
    Loop.kinUpkeep();

    /* --- rent --- */
    if (S.house.housed && S.time.day === S.house.rentDue) {
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
        if (S.house.rentMissed >= RENT.missesToEviction) Loop.evict();
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

  /* ---- the household -------------------------------------------------- */
  kinUpkeep: function () {
    var k = State.kin();
    if (!k || k.status === 'DEAD' || k.status === 'TAKEN') return;

    /* the sister on the cap bench: six pence, and the shake, which is hers now */
    if (k.working && S.job.employed) {
      S.pending.kinWage = (S.pending.kinWage || 0) + 6;
      k.tremor = Util.clamp((k.tremor || 0) + 2, 0, 100);
      State.applyKin({ health: -1, mood: -1 });
      if (k.tremor >= 40 && !S.flags.kinTremorNoted) {
        S.flags.kinTremorNoted = true;
        UI.log(T('kin.tremorNoted', { name: k.name }), 'bad');
      }
    }

    /* the father's lungs: a week's medicine, or the week takes it out of him */
    if (k.chronic === 'lungs') {
      if (S.time.day % 7 === 0) {
        if (S.house.physic > 0) {
          S.house.physic -= 1;
          State.applyKin({ health: 6, mood: 3 });
          UI.log(T('kin.medicineGiven', { name: k.name }));
        } else {
          State.applyKin({ health: -9, mood: -4 });
          UI.log(T('kin.medicineMissed', { name: k.name }), 'bad');
        }
      } else {
        State.applyKin({ health: -1 });
      }
    }

    /* the child, left alone all evening */
    if (k.needsMinding && S.evening.travelled > 0 && S.flags.mindedDay !== S.time.day) {
      State.applyKin({ mood: -6, health: -2 });
      UI.log(T('kin.leftAlone', { name: k.name }), 'bad');
    }

    if (S.flags.tendedToday) { S.flags.tendedToday = false; }
  },

  evict: function () {
    if (!S.house.housed) return;
    S.house.housed = false;
    S.house.node = 'street';
    S.destitution.ever = true;
    S.house.rentMissed = 0;
    S.house.coatMended = false;
    /* what was not under the floorboard is on the street, and then it is gone */
    var kept = [], lost = 0, i;
    for (i = 0; i < S.house.goods.length; i++) {
      if (S.house.goods[i].stashed) kept.push(S.house.goods[i]); else lost++;
    }
    S.house.goods = kept;
    S.house.coal = 0;
    S.flags.evicted = (S.flags.evicted || 0) + 1;
    State.applyMind({ resolve: -18 });
    UI.log(T('destitution.evicted', { n: lost }), 'bad');
    Loop.poorhouseRisk();
  },

  /* Children of the destitute are taken. It is lawful and it is routine. */
  poorhouseRisk: function () {
    var k = State.kin();
    if (!k || k.status === 'DEAD' || k.status === 'TAKEN') return;
    if (S.house.housed) return;
    var risk = 0.12 + (k.health < 40 ? 0.15 : 0) + (S.destitution.days > 4 ? 0.12 : 0);
    if (Util.chance(risk)) {
      k.status = 'TAKEN';
      S.destitution.kinTaken = true;
      S.flags.kinTaken = true;
      State.applyMind({ resolve: -20 });
      UI.log(T('kin.takenByParish', { name: k.name }), 'bad');
    }
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
      S.endingId = Endings.pick();
      UI.showEnding(S.endingId);
      return;
    }
    var wasDay = S.time.day;
    S.time.day += 1;
    Loop.startDay(false);
    if (wasDay === 10) UI.showMilestone();
  },

  /* ---- death ---------------------------------------------------------- */
  checkDeath: function () {
    if (S.flags.condemned && !S.dead) { S.endingId = 'the_drop'; return false; }
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
    UI.showCreation(function (kinId) { Loop.newGame(null, kinId); });
  }
};
