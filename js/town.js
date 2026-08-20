/* ==========================================================================
   GRIMWICK WORKS — js/town.js
   Eleven nodes, three districts, two hours. Mechanics only: every word the
   player reads comes out of ACTION_TEXT in data/locations.js.
   ========================================================================== */

/* Fill {p}, {n} and {kin} in a line of action text. */
function txt(id, variant, params) {
  var entry = ACTION_TEXT[id];
  if (!entry) return '';
  var line = entry[variant || 'r'];
  if (typeof line !== 'string') return '';
  var k = State.kin();
  var p = params || {};
  if (p.kin === undefined) p.kin = k ? k.name : T('hud.nothing');
  return interpolate(line, p);
}

var TOWN_ACTIONS = {

  /* ================================================================ ROWS */
  rest: {
    ap: 1, at: 'rows',
    enabled: function () { return S.evening.rested ? 'disabled.alreadyRested' : true; },
    run: function () {
      S.evening.rested = true;
      State.applyBody({ fatigue: -14, warmth: S.house.coal > 0 ? 2 : -3 });
      State.applyMind({ resolve: 1 });
      return txt('rest');
    }
  },

  tendKin: {
    ap: 1, at: 'rows',
    enabled: function () { return State.kinPresent() ? true : 'disabled.noKin'; },
    run: function () {
      var k = State.kin();
      State.applyKin({ health: 5, mood: 14 });
      State.applyMind({ resolve: 4 });
      State.applyBody({ fatigue: 3 });
      S.flags.tendedToday = true;
      return txt('tendKin', (k && k.health < 45) ? 'rBad' : 'r');
    }
  },

  dressWound: {
    ap: 1, at: 'rows',
    enabled: function () { return S.body.injury ? true : 'disabled.noWound'; },
    run: function () {
      var had = S.house.physic > 0;
      if (had) {
        S.house.physic -= 1;
        S.body.injury.daysLeft = Math.max(1, S.body.injury.daysLeft - 1);
        State.applyBody({ health: 3 });
      } else {
        State.applyBody({ health: 1 });
      }
      S.flags.dressedToday = had ? 2 : 1;
      return txt('dressWound', had ? 'rPhysic' : 'r');
    }
  },

  mend: {
    ap: 1, at: 'rows',
    enabled: function () { return S.house.coatMended ? 'disabled.noCoat' : true; },
    run: function () {
      S.house.coatMended = true;
      var cloth = S.house.cloth > 0;
      if (cloth) S.house.cloth -= 1;
      State.applyBody({ warmth: cloth ? 14 : 8, fatigue: 4 });
      return txt('mend', cloth ? 'rCloth' : 'r');
    }
  },

  stash: {
    ap: 1, at: 'rows',
    enabled: function () { return S.house.housed ? true : 'disabled.noRoom'; },
    run: function () {
      var moved = 0, i;
      for (i = 0; i < S.house.goods.length; i++) {
        if (!S.house.goods[i].stashed) { S.house.goods[i].stashed = true; moved++; }
      }
      if (S.flags.carryingPrint) { S.flags.carryingPrint = false; S.house.stash.push('print'); moved++; }
      S.flags.hasStash = true;
      State.applyStanding({ notice: -3 });
      return txt(moved ? 'stash' : 'stash', moved ? 'r' : 'rEmpty');
    }
  },

  kinToBench: {
    ap: 1, at: 'rows',
    enabled: function () {
      var k = State.kin();
      if (!k || !k.canWork) return 'disabled.kinCannotWork';
      if (k.status === 'DEAD' || k.status === 'TAKEN') return 'disabled.noKin';
      if (k.working) return 'disabled.kinAlreadyWorks';
      if (!S.job.employed) return 'disabled.sacked';
      return true;
    },
    run: function () {
      var k = State.kin();
      k.working = true;
      S.flags.putKinToWork = true;
      State.applyMind({ resolve: -10 });
      State.applyKin({ mood: 6 });
      return txt('kinToBench');
    }
  },

  payMinder: {
    ap: 0, at: 'rows',
    price: function () { return 2; },
    enabled: function () {
      var k = State.kin();
      if (!k || !k.needsMinding || k.status === 'DEAD' || k.status === 'TAKEN') return 'disabled.noMinding';
      if (S.flags.mindedDay === S.time.day) return 'disabled.alreadyMinded';
      return Economy.canAfford(2) ? true : 'disabled.noPennies';
    },
    run: function () {
      Economy.spend(2);
      S.flags.mindedDay = S.time.day;
      S.evening.ap += 1;
      return txt('payMinder', 'r', { p: Economy.money(2) });
    }
  },

  /* ---- the same address, with no room in it ---- */
  shelterGrate: {
    ap: 1, at: 'rows',
    enabled: function () { return S.house.housed ? 'disabled.haveRoom' : true; },
    run: function () {
      S.flags.grateTonight = true;
      State.applyBody({ warmth: 12, fatigue: -6 });
      return txt('shelterGrate');
    }
  },

  begDoorways: {
    ap: 1, at: 'rows',
    enabled: function () { return State.destitute() ? true : 'disabled.notDestitute'; },
    run: function () {
      S.destitution.begs += 1;
      State.applyMind({ resolve: -5 });
      if (Util.chance(0.55)) {
        S.house.larder += 1;
        State.applyPurse({ pennies: Util.rndInt(1, 3) });
        return txt('begDoorways');
      }
      return txt('begDoorways', 'rNothing');
    }
  },

  scavengeRows: {
    ap: 1, at: 'rows',
    enabled: function () { return State.destitute() ? true : 'disabled.notDestitute'; },
    run: function () {
      S.destitution.scavenges += 1;
      State.applyBody({ fatigue: 8, warmth: -4 });
      if (Util.chance(0.6)) {
        S.house.coal += 1;
        State.applyPurse({ pennies: Util.rndInt(1, 4) });
        return txt('scavengeRows');
      }
      return txt('scavengeRows', 'rNothing');
    }
  },

  /* =============================================================== WORKS */
  nightShift: {
    ap: 1, at: 'works',
    enabled: function () {
      if (!S.job.employed) return 'disabled.sacked';
      if (S.flags.nightShiftDay === S.time.day) return 'disabled.alreadyNight';
      if (S.body.fatigue > 82) return 'disabled.tooTired';
      return true;
    },
    run: function () {
      S.flags.nightShiftDay = S.time.day;
      var est = Factory.estimate();
      var pay = Math.round(est.wage * 0.55);
      S.pending.pieceWage += pay;
      State.applyBody({ fatigue: 26, health: -4, hunger: 12, warmth: -4 });
      var wear = STATION_DEF[S.factory.station].wear;
      State.applyBody({ dust: wear.dust, tremor: wear.tremor, lead: wear.lead });
      S.factory.quota.made += Math.round(est.credits * 0.5);
      State.applyStanding({ foreman: 2 });
      return txt('nightShift');
    }
  },

  gateHiring: {
    ap: 1, at: 'works',
    enabled: function () { return S.job.employed ? 'disabled.haveWork' : true; },
    run: function () {
      S.destitution.casualDays += 1;
      State.applyBody({ fatigue: 12, hunger: 10, warmth: -8 });
      if (Util.chance(0.45)) {
        var pay = Util.rndInt(7, 14);
        State.applyPurse({ pennies: pay });
        S.flags.casualWorked = (S.flags.casualWorked || 0) + 1;
        return txt('gateHiring');
      }
      State.applyMind({ resolve: -3 });
      return txt('gateHiring', 'rNothing');
    }
  },

  yardTalk: {
    ap: 1, at: 'works',
    enabled: function () { return true; },
    run: function () {
      State.applyStanding({ workmates: 4 });
      State.applyMind({ resolve: 2 });
      S.flags.heardTheTalk = (S.flags.heardTheTalk || 0) + 1;
      if (S.time.act >= 2) S.flags.knowsAboutTheCut = true;
      return txt('yardTalk');
    }
  },

  askTally: {
    ap: 1, at: 'works',
    enabled: function () { return S.job.employed ? true : 'disabled.sacked'; },
    run: function () {
      if (Util.chance(0.3)) {
        var back = Util.rndInt(2, 6);
        State.applyPurse({ pennies: back });
        State.applyStanding({ foreman: -2 });
        return txt('askTally', 'rFound');
      }
      State.applyStanding({ foreman: -1 });
      return txt('askTally');
    }
  },

  /* ============================================================== MARKET */
  marketBoard: {
    ap: 0, at: 'market',
    enabled: function () { return true; },
    run: function () { return { open: 'board' }; }
  },

  buyBread: {
    ap: 1, at: 'market', price: function () { return Economy.priceOf('bread'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('bread')) ? true : 'disabled.noPennies'; },
    run: function () {
      var p = Economy.priceOf('bread');
      Economy.spend(p);
      S.house.larder += 2;
      UI.log(T('log.spent', { amt: Economy.money(p) }));
      return txt('buyBread', 'r', { p: Economy.money(p) });
    }
  },

  buyCoal: {
    ap: 1, at: 'market', price: function () { return Economy.priceOf('coal'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('coal')) ? true : 'disabled.noPennies'; },
    run: function () {
      var p = Economy.priceOf('coal');
      Economy.spend(p);
      S.house.coal += 2;
      UI.log(T('log.spent', { amt: Economy.money(p) }));
      return txt('buyCoal', 'r', { p: Economy.money(p) });
    }
  },

  buyCloth: {
    ap: 1, at: 'market', price: function () { return Economy.priceOf('cloth'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('cloth')) ? true : 'disabled.noPennies'; },
    run: function () {
      var p = Economy.priceOf('cloth');
      Economy.spend(p);
      S.house.cloth = (S.house.cloth || 0) + 1;
      UI.log(T('log.spent', { amt: Economy.money(p) }));
      return txt('buyCloth', 'r', { p: Economy.money(p) });
    }
  },

  haggle: {
    ap: 1, at: 'market',
    enabled: function () { return Economy.canAfford(Economy.priceOf('bread')) ? true : 'disabled.noPennies'; },
    run: function () {
      var p = Economy.priceOf('bread');
      var win = Util.chance(0.45);
      Economy.spend(Math.max(1, p - (win ? 1 : 0)));
      S.house.larder += 2;
      return txt('haggle', win ? 'r' : 'rNothing');
    }
  },

  /* =============================================================== STORE */
  storeBread: {
    ap: 1, at: 'store', price: function () { return Economy.storePrice('bread'); },
    enabled: function () { return S.purse.debt < WAGE.tickCap ? true : 'disabled.tickCapped'; },
    run: function () {
      var p = Economy.storePrice('bread');
      S.purse.debt += p;
      S.house.larder += 2;
      State.applyMind({ resolve: -1 });
      UI.log(T('log.debtUp', { amt: Economy.money(S.purse.debt) }), 'bad');
      return txt('storeBread', 'r', { p: Economy.money(p) });
    }
  },

  storeCoal: {
    ap: 1, at: 'store', price: function () { return Economy.storePrice('coal'); },
    enabled: function () { return S.purse.debt < WAGE.tickCap ? true : 'disabled.tickCapped'; },
    run: function () {
      var p = Economy.storePrice('coal');
      S.purse.debt += p;
      S.house.coal += 2;
      UI.log(T('log.debtUp', { amt: Economy.money(S.purse.debt) }), 'bad');
      return txt('storeCoal', 'r', { p: Economy.money(p) });
    }
  },

  storeCloth: {
    ap: 1, at: 'store', price: function () { return Economy.storePrice('cloth'); },
    enabled: function () { return S.purse.debt < WAGE.tickCap ? true : 'disabled.tickCapped'; },
    run: function () {
      var p = Economy.storePrice('cloth');
      S.purse.debt += p;
      S.house.cloth = (S.house.cloth || 0) + 1;
      UI.log(T('log.debtUp', { amt: Economy.money(S.purse.debt) }), 'bad');
      return txt('storeCloth', 'r', { p: Economy.money(p) });
    }
  },

  settleBook: {
    ap: 1, at: 'store',
    price: function () { return Math.min(S.purse.debt, Math.max(1, S.purse.pennies)); },
    enabled: function () {
      if (S.purse.debt <= 0) return 'disabled.noDebt';
      return S.purse.pennies > 0 ? true : 'disabled.noPennies';
    },
    run: function () {
      var pay = Math.min(S.purse.debt, S.purse.pennies);
      Economy.spend(pay);
      S.purse.debt -= pay;
      return txt('settleBook', 'r', { p: Economy.money(pay) });
    }
  },

  readLedger: {
    ap: 0, at: 'store',
    enabled: function () { return true; },
    run: function () { return { open: 'ledger' }; }
  },

  /* ================================================================ PAWN */
  pawnGood: {
    ap: 0, at: 'pawn',
    enabled: function () { return S.house.goods.length ? true : 'disabled.nothingToPawn'; },
    run: function () { return { open: 'pawn' }; }
  },

  redeemGood: {
    ap: 0, at: 'pawn',
    enabled: function () { return S.house.pawned.length ? true : 'disabled.nothingPawned'; },
    run: function () { return { open: 'redeem' }; }
  },

  sellOutright: {
    ap: 0, at: 'pawn',
    enabled: function () { return S.house.goods.length ? true : 'disabled.nothingToPawn'; },
    run: function () { return { open: 'sell' }; }
  },

  askOstrek: {
    ap: 1, at: 'pawn',
    enabled: function () { return true; },
    run: function () {
      S.flags.askedOstrek = (S.flags.askedOstrek || 0) + 1;
      State.applyMind({ resolve: 1 });
      if (S.time.act >= 2) S.flags.knowsAboutTheCut = true;
      return txt('askOstrek');
    }
  },

  /* ========================================================== APOTHECARY */
  buyPhysic: {
    ap: 1, at: 'apothecary', price: function () { return Economy.priceOf('physic'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('physic')) ? true : 'disabled.noPennies'; },
    run: function () {
      var p = Economy.priceOf('physic');
      Economy.spend(p);
      S.house.physic += 1;
      UI.log(T('log.spent', { amt: Economy.money(p) }));
      return txt('buyPhysic', 'r', { p: Economy.money(p) });
    }
  },

  buyLaudanum: {
    ap: 1, at: 'apothecary', price: function () { return Economy.priceOf('laudanum'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('laudanum')) ? true : 'disabled.noPennies'; },
    run: function () {
      var p = Economy.priceOf('laudanum');
      Economy.spend(p);
      S.house.laudanum += 1;
      return txt('buyLaudanum', 'r', { p: Economy.money(p) });
    }
  },

  surgeon: {
    ap: 1, at: 'apothecary', price: function () { return Economy.priceOf('surgeon'); },
    enabled: function () {
      if (!S.body.injury) return 'disabled.noWound2';
      return Economy.canAfford(Economy.priceOf('surgeon')) ? true : 'disabled.noPennies';
    },
    run: function () {
      var p = Economy.priceOf('surgeon');
      Economy.spend(p);
      S.flags.surgeonDay = S.time.day;
      S.body.injury.infection = 0;
      S.body.injury.fever = false;
      State.applyBody({ health: 6 });
      UI.log(T('log.spent', { amt: Economy.money(p) }));
      return txt('surgeon', 'r', { p: Economy.money(p) });
    }
  },

  advice: {
    ap: 0, at: 'apothecary',
    enabled: function () { return true; },
    run: function () { return { open: 'advice' }; }
  },

  /* ================================================================= EWE */
  drink: {
    ap: 1, at: 'ewe', price: function () { return ITEMS.beer.price; },
    enabled: function () { return Economy.canAfford(ITEMS.beer.price) ? true : 'disabled.noPennies'; },
    run: function () {
      Economy.spend(ITEMS.beer.price);
      S.flags.drinksThisWeek = (S.flags.drinksThisWeek || 0) + 1;
      State.applyMind({ resolve: 6 });
      State.applyBody({ fatigue: -6, hunger: -4, health: -1, warmth: 4 });
      State.applyStanding({ workmates: 3 });
      return txt('drink', 'r', { p: Economy.money(ITEMS.beer.price) });
    }
  },

  listen: {
    ap: 1, at: 'ewe',
    enabled: function () { return true; },
    run: function () {
      S.flags.heardTheTalk = (S.flags.heardTheTalk || 0) + 1;
      State.applyStanding({ workmates: 2, notice: 1 });
      State.applyMind({ resolve: 2 });
      if (S.time.act >= 2 && Util.chance(0.5)) S.flags.knowsAboutTheCut = true;
      return txt('listen');
    }
  },

  cards: {
    ap: 1, at: 'ewe', price: function () { return 4; },
    enabled: function () { return Economy.canAfford(4) ? true : 'disabled.noPennies'; },
    run: function () {
      Economy.spend(4);
      if (Util.chance(0.38)) {
        State.applyPurse({ pennies: 9 });
        State.applyMind({ resolve: 4 });
        State.applyStanding({ workmates: 2 });
        return txt('cards', 'rWin', { p: Economy.money(4) });
      }
      State.applyMind({ resolve: -4 });
      return txt('cards', 'rLose', { p: Economy.money(4) });
    }
  },

  contact: {
    ap: 1, at: 'ewe',
    enabled: function () { return S.time.act >= 2 ? true : 'disabled.nothingYet'; },
    run: function () {
      S.flags.knowsAboutTheCut = true;
      State.applyStanding({ workmates: 3 });
      return txt('contact');
    }
  },

  /* ============================================================== CHAPEL */
  dole: {
    ap: 1, at: 'chapel',
    enabled: function () {
      if (S.flags.doleWeek === Math.floor(S.time.day / 7)) return 'disabled.doleTaken';
      return true;
    },
    run: function () {
      S.flags.doleWeek = Math.floor(S.time.day / 7);
      var deserving = S.standing.notice < 45 && !S.flags.informer;
      if (deserving) {
        S.house.larder += 2;
        S.house.coal += 1;
        State.applyMind({ resolve: -6 });
        S.flags.tookTheDole = (S.flags.tookTheDole || 0) + 1;
        return txt('dole');
      }
      State.applyMind({ resolve: -4 });
      return txt('dole', 'rRefused');
    }
  },

  burialClub: {
    ap: 1, at: 'chapel', price: function () { return 1; },
    enabled: function () {
      if (S.flags.burialWeek === Math.floor(S.time.day / 7)) return 'disabled.alreadyPaid';
      return Economy.canAfford(1) ? true : 'disabled.noPennies';
    },
    run: function () {
      Economy.spend(1);
      S.flags.burialWeek = Math.floor(S.time.day / 7);
      S.flags.burialClub = (S.flags.burialClub || 0) + 1;
      State.applyMind({ resolve: 2 });
      return txt('burialClub', 'r', { p: Economy.money(1) });
    }
  },

  almoner: {
    ap: 1, at: 'chapel',
    enabled: function () {
      if (!State.kinPresent()) return 'disabled.noKin';
      if (S.flags.almonerWeek === Math.floor(S.time.day / 7)) return 'disabled.askedThisWeek';
      return true;
    },
    run: function () {
      S.flags.almonerWeek = Math.floor(S.time.day / 7);
      var attends = (S.flags.naveSat || 0) >= 2;
      var sober = (S.flags.drinksThisWeek || 0) < 3;
      if (attends && sober) {
        State.applyPurse({ pennies: 12 });
        State.applyKin({ health: 4, mood: 6 });
        return txt('almoner');
      }
      State.applyMind({ resolve: -4 });
      return txt('almoner', 'rRefused');
    }
  },

  sitInNave: {
    ap: 1, at: 'chapel',
    enabled: function () { return true; },
    run: function () {
      S.flags.naveSat = (S.flags.naveSat || 0) + 1;
      State.applyMind({ resolve: 5 });
      State.applyBody({ fatigue: -4, warmth: -3 });
      return txt('sitInNave');
    }
  },

  /* =========================================================== RAIL YARD */
  loadWork: {
    ap: 1, at: 'railyard',
    enabled: function () { return S.body.fatigue > 88 ? 'disabled.tooTired' : true; },
    run: function () {
      var pay = Util.rndInt(8, 15);
      State.applyPurse({ pennies: pay });
      State.applyBody({ fatigue: 18, hunger: 10, health: -1 });
      if (Util.chance(0.12)) State.injure({ type: 'back', severity: 2, daysLeft: 9, permanent: false });
      S.destitution.casualDays += 1;
      UI.log(T('log.gained', { amt: Economy.money(pay) }), 'good');
      return txt('loadWork');
    }
  },

  pilfer: {
    ap: 1, at: 'railyard',
    enabled: function () { return true; },
    run: function () {
      var caught = Util.chance(0.22 + S.standing.notice / 300);
      if (caught) {
        State.applyStanding({ notice: 18, garrison: -12 });
        S.flags.caughtPilfering = (S.flags.caughtPilfering || 0) + 1;
        State.applyMind({ resolve: -6 });
        return txt('pilfer', 'rCaught');
      }
      S.house.larder += 2;
      S.flags.hasBrass = (S.flags.hasBrass || 0) + 1;
      State.applyStanding({ notice: 5 });
      return txt('pilfer', 'rGot');
    }
  },

  smuggler: {
    ap: 1, at: 'railyard',
    enabled: function () { return true; },
    run: function () {
      S.flags.knowsSerrel = true;
      if (S.flags.hasBrass > 0) {
        S.flags.hasBrass -= 1;
        State.applyPurse({ pennies: 11 });
        State.applyStanding({ notice: 3 });
      }
      return txt('smuggler');
    }
  },

  roadOut: {
    ap: 1, at: 'railyard',
    enabled: function () { return true; },
    run: function () {
      S.flags.knowsTheRoad = true;
      S.flags.roadPrice = 480;
      return txt('roadOut');
    }
  },

  /* ============================================================ GARRISON */
  sellBrass: {
    ap: 1, at: 'garrison',
    enabled: function () { return (S.flags.hasBrass || 0) > 0 ? true : 'disabled.noBrass'; },
    run: function () {
      S.flags.hasBrass -= 1;
      State.applyPurse({ pennies: 8 });
      State.applyStanding({ notice: 6, garrison: 2 });
      return txt('sellBrass');
    }
  },

  bounty: {
    ap: 1, at: 'garrison',
    enabled: function () {
      if (S.flags.informer) return 'disabled.alreadyInformer';
      if (!(S.flags.heardTheTalk > 0 || S.flags.knowsAboutTheCut)) return 'disabled.noName';
      return true;
    },
    run: function () {
      S.flags.informer = true;
      State.applyPurse({ pennies: 18 });
      State.applyStanding({ workmates: -25, garrison: 12, notice: -8 });
      State.applyMind({ resolve: -12 });
      return txt('bounty');
    }
  },

  enlistAsk: {
    ap: 1, at: 'garrison',
    enabled: function () { return true; },
    run: function () {
      S.flags.heardTheRecruiter = true;
      State.applyStanding({ garrison: 3 });
      return txt('enlistAsk');
    }
  },

  reportTheft: {
    ap: 1, at: 'garrison',
    enabled: function () { return true; },
    run: function () {
      State.applyStanding({ garrison: 6, workmates: -8, notice: 8 });
      S.flags.reportedToGarrison = true;
      return txt('reportTheft');
    }
  },

  /* ================================================================= CUT */
  hearSpeaker: {
    ap: 1, at: 'cut',
    enabled: function () { return true; },
    run: function () {
      S.flags.heardTheSpeaker = (S.flags.heardTheSpeaker || 0) + 1;
      State.applyMind({ resolve: 7 });
      State.applyStanding({ notice: 4, workmates: 3 });
      return txt('hearSpeaker');
    }
  },

  takePamphlets: {
    ap: 1, at: 'cut',
    enabled: function () { return S.flags.carryingPrint ? 'disabled.haveBundle' : true; },
    run: function () {
      S.flags.carryingPrint = true;
      State.applyStanding({ notice: 10, workmates: 4 });
      State.applyMind({ resolve: 4 });
      return txt('takePamphlets');
    }
  },

  payDues: {
    ap: 1, at: 'cut', price: function () { return 2; },
    enabled: function () { return Economy.canAfford(2) ? true : 'disabled.noPennies'; },
    run: function () {
      Economy.spend(2);
      S.flags.unionDues = (S.flags.unionDues || 0) + 1;
      State.applyStanding({ workmates: 5 });
      return txt('payDues', 'r', { p: Economy.money(2) });
    }
  },

  askHarrick: {
    ap: 1, at: 'cut',
    enabled: function () { return true; },
    run: function () {
      S.flags.askedHarrick = true;
      State.applyMind({ resolve: 5 });
      return txt('askHarrick');
    }
  },

  takeRoom: {
    ap: 1, at: 'rows', price: function () { return RENT.deposit; },
    enabled: function () {
      if (S.house.housed) return 'disabled.haveRoom';
      return Economy.canAfford(RENT.deposit) ? true : 'disabled.noPennies';
    },
    run: function () {
      Economy.spend(RENT.deposit);
      S.house.housed = true;
      S.house.node = 'rows';
      S.house.rentDue = S.time.day + RENT.every;
      S.house.rentMissed = 0;
      S.house.coatMended = false;
      State.applyMind({ resolve: 12 });
      S.flags.rehoused = (S.flags.rehoused || 0) + 1;
      /* whoever the poorhouse holds can come back to an address */
      var k = State.kin();
      if (k && k.status === 'TAKEN') { k.status = 'AILING'; S.destitution.kinTaken = false; }
      return txt('takeRoom', 'r', { p: Economy.money(RENT.deposit) });
    }
  },

  askForPlace: {
    ap: 1, at: 'works',
    enabled: function () {
      if (S.job.employed) return 'disabled.haveWork';
      if (S.destitution.casualDays < 3) return 'disabled.notEnoughDays';
      if (S.standing.foreman < -60) return 'disabled.foremanCold';
      return true;
    },
    run: function () {
      var chance = 0.45 + (S.standing.foreman + 60) / 300;
      if (Util.chance(chance)) {
        S.job.employed = true;
        S.job.warnings = 0;
        S.flags.sacked = false;
        S.factory.quota.made = 0;
        State.applyMind({ resolve: 14 });
        return txt('askForPlace');
      }
      State.applyMind({ resolve: -5 });
      State.applyStanding({ foreman: -2 });
      return txt('askForPlace', 'rRefused');
    }
  },

  enterWorkhouse: {
    ap: 1, at: 'chapel',
    enabled: function () {
      if (S.destitution.workhouse) return 'disabled.inWorkhouse';
      return State.destitute() ? true : 'disabled.notDestitute';
    },
    run: function () {
      S.destitution.workhouse = true;
      S.destitution.applied = false;
      S.destitution.ever = true;
      S.house.housed = false;
      S.house.node = 'workhouse';
      State.applyMind({ resolve: -14 });
      var k = State.kin();
      if (k && k.status !== 'DEAD') {
        k.status = 'TAKEN';
        S.destitution.kinTaken = true;
        S.flags.kinTaken = true;
      }
      return txt('enterWorkhouse');
    }
  },

  /* =========================================================== WORKHOUSE */
  pickOakum: {
    ap: 1, at: 'workhouse',
    enabled: function () { return true; },
    run: function () {
      State.applyBody({ fatigue: 14, health: -1 });
      State.applyMind({ resolve: -4 });
      S.destitution.workhouseDays += 1;
      return txt('pickOakum');
    }
  },

  workhouseChapel: {
    ap: 1, at: 'workhouse',
    enabled: function () { return true; },
    run: function () {
      S.flags.wardChapel = (S.flags.wardChapel || 0) + 1;
      State.applyMind({ resolve: 1 });
      return txt('workhouseChapel');
    }
  },

  askAfterKin: {
    ap: 1, at: 'workhouse',
    enabled: function () { return S.destitution.kinTaken ? true : 'disabled.noKin'; },
    run: function () {
      State.applyMind({ resolve: -3 });
      return txt('askAfterKin');
    }
  },

  applyToLeave: {
    ap: 1, at: 'workhouse',
    enabled: function () { return S.destitution.applied ? 'disabled.alreadyApplied' : true; },
    run: function () {
      S.destitution.applied = true;
      return txt('applyToLeave');
    }
  }
};

var Town = {

  locations: function () { return LOCATIONS; },

  location: function (id) {
    for (var i = 0; i < LOCATIONS.length; i++) if (LOCATIONS[i].id === id) return LOCATIONS[i];
    return null;
  },

  /* A node the player can see on the map at all. */
  visible: function (loc) {
    if (!loc.requires) return true;
    if (loc.requires.minAct && S.time.act < loc.requires.minAct) return false;
    if (loc.requires.flag && !S.flags[loc.requires.flag]) return false;
    return true;
  },

  here: function () { return S.evening.at || 'rows'; },

  districtOf: function (id) {
    var loc = Town.location(id);
    return loc ? loc.district : 'CENTRE';
  },

  travelCost: function (toId) {
    var from = Town.districtOf(Town.here());
    var to = Town.districtOf(toId);
    return TRAVEL[from] && typeof TRAVEL[from][to] === 'number' ? TRAVEL[from][to] : 1;
  },

  canTravel: function (toId) {
    var loc = Town.location(toId);
    if (!loc) return 'disabled.noSuchPlace';
    if (S.destitution.workhouse) return 'disabled.inWorkhouse';
    if (!Town.visible(loc)) return 'disabled.notYet';
    if (S.time.phase !== 'EVENING') return 'disabled.notEvening';
    if (toId === Town.here()) return 'disabled.alreadyHere';
    if (S.evening.ap < Town.travelCost(toId)) return 'disabled.noTimeToWalk';
    return true;
  },

  travelTo: function (toId) {
    var ok = Town.canTravel(toId);
    if (ok !== true) return false;
    var cost = Town.travelCost(toId);
    S.evening.ap -= cost;
    S.evening.at = toId;
    S.evening.travelled += cost;
    Audio.thunk();
    return true;
  },

  /* Which actions this node offers right now. */
  actionsAt: function (nodeId) {
    if (S.destitution.workhouse) return WORKHOUSE_ACTIONS.slice();
    var loc = Town.location(nodeId);
    if (!loc) return [];
    if (loc.id === 'rows' && !S.house.housed) {
      return loc.streetActions.concat(['tendKin', 'dressWound']);
    }
    var list = loc.actions.slice();
    if (loc.id === 'rows' && State.destitute()) list = list.concat(['begDoorways', 'scavengeRows']);
    return list;
  },

  describe: function (actionId) {
    var def = TOWN_ACTIONS[actionId];
    if (!def) return null;
    var text = ACTION_TEXT[actionId] || {};
    var params = {};
    if (def.price) params.p = Economy.money(def.price());
    var k = State.kin();
    params.kin = k ? k.name : T('hud.nothing');

    var reason = null;
    if (S.time.phase !== 'EVENING') reason = 'disabled.notEvening';
    else if (S.evening.ap < def.ap) reason = 'disabled.noAp';
    else {
      var ok = def.enabled();
      if (ok !== true) reason = ok;
    }

    return {
      id: actionId,
      label: interpolate(text.label || actionId, params),
      hint: interpolate(text.hint || '', params),
      ap: def.ap,
      free: def.ap === 0,
      disabledReason: reason ? T(reason) : null
    };
  },

  perform: function (actionId) {
    var def = TOWN_ACTIONS[actionId];
    var d = Town.describe(actionId);
    if (!def || !d || d.disabledReason) return null;
    var result = def.run();
    S.evening.ap -= def.ap;
    if (def.ap > 0) Audio.thunk();
    if (result && result.open) return result;
    return { text: result };
  },

  /* ---- Ostrek's counter: the pickers commit the action point ---------- */
  pawnList: function () {
    var out = [];
    for (var i = 0; i < S.house.goods.length; i++) {
      var g = GOODS[S.house.goods[i].id];
      if (g) out.push({ id: g.id, name: g.name, note: g.note, pawn: g.pawn, redeem: g.redeem });
    }
    return out;
  },

  pawnedList: function () {
    var out = [];
    for (var i = 0; i < S.house.pawned.length; i++) {
      var t = S.house.pawned[i];
      var g = GOODS[t.id];
      if (g) out.push({ id: g.id, name: g.name, redeem: t.redeem, day: t.day });
    }
    return out;
  },

  pawnItem: function (id, outright) {
    if (S.evening.ap < 1) return null;
    var g = GOODS[id];
    if (!g || !State.hasGood(id)) return null;
    State.takeGood(id);
    S.evening.ap -= 1;
    if (outright) {
      State.applyPurse({ pennies: g.pawn + 2 });
      S.flags.soldOutright = (S.flags.soldOutright || 0) + 1;
      State.applyMind({ resolve: -4 });
      UI.log(T('log.gained', { amt: Economy.money(g.pawn + 2) }), 'good');
      return txt('sellOutright');
    }
    State.applyPurse({ pennies: g.pawn });
    S.house.pawned.push({ id: id, day: S.time.day, redeem: g.redeem });
    S.flags.hasTicketOut = true;
    State.applyMind({ resolve: -2 });
    UI.log(T('log.gained', { amt: Economy.money(g.pawn) }), 'good');
    return txt('pawnGood');
  },

  redeemItem: function (id) {
    if (S.evening.ap < 1) return null;
    var idx = -1, i;
    for (i = 0; i < S.house.pawned.length; i++) if (S.house.pawned[i].id === id) idx = i;
    if (idx < 0) return null;
    var ticket = S.house.pawned[idx];
    if (!Economy.canAfford(ticket.redeem)) return null;
    Economy.spend(ticket.redeem);
    S.house.pawned.splice(idx, 1);
    State.giveGood(id);
    S.evening.ap -= 1;
    State.applyMind({ resolve: 5 });
    UI.log(T('log.spent', { amt: Economy.money(ticket.redeem) }));
    return txt('redeemGood');
  }
};
