/* ==========================================================================
   GRIMWICK WORKS — js/town.js
   The evening. Two action points, three places, and no way to have all of it.
   Full town map + destitution track: Prompt 3.
   ========================================================================== */

var TOWN_ACTIONS = {

  buyBread: {
    ap: 1,
    labelKey: 'town.actions.buyBread',
    hintKey: 'town.actions.buyBreadHint',
    price: function () { return Economy.priceOf('bread'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('bread')) ? true : 'disabled.noPennies'; },
    run: function () {
      Economy.spend(Economy.priceOf('bread'));
      S.house.larder += ITEMS.bread.meals;
      UI.log(T('log.spent', { amt: Economy.money(Economy.priceOf('bread')) }));
      return 'town.results.boughtBread';
    }
  },

  buyCoal: {
    ap: 1,
    labelKey: 'town.actions.buyCoal',
    hintKey: 'town.actions.buyCoalHint',
    price: function () { return Economy.priceOf('coal'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('coal')) ? true : 'disabled.noPennies'; },
    run: function () {
      Economy.spend(Economy.priceOf('coal'));
      S.house.coal += ITEMS.coal.fuel;
      UI.log(T('log.spent', { amt: Economy.money(Economy.priceOf('coal')) }));
      return 'town.results.boughtCoal';
    }
  },

  buyPhysic: {
    ap: 1,
    labelKey: 'town.actions.buyPhysic',
    hintKey: 'town.actions.buyPhysicHint',
    price: function () { return Economy.priceOf('physic'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('physic')) ? true : 'disabled.noPennies'; },
    run: function () {
      Economy.spend(Economy.priceOf('physic'));
      S.house.physic += 1;
      UI.log(T('log.spent', { amt: Economy.money(Economy.priceOf('physic')) }));
      return 'town.results.boughtPhysic';
    }
  },

  /* The action that guarantees the game can never lock: bread with no money. */
  tick: {
    ap: 1,
    labelKey: 'town.actions.tick',
    hintKey: 'town.actions.tickHint',
    enabled: function () { return S.purse.debt < WAGE.tickCap ? true : 'disabled.tickCapped'; },
    run: function () {
      S.purse.debt += WAGE.tickAmount;
      S.house.larder += ITEMS.bread.meals;
      State.applyMind({ resolve: -2 });
      UI.log(T('log.debtUp', { amt: Economy.money(S.purse.debt) }), 'bad');
      return 'town.results.tookTick';
    }
  },

  readNotice: {
    ap: 1,
    labelKey: 'town.actions.readNotice',
    hintKey: 'town.actions.readNoticeHint',
    enabled: function () { return S.mind.literacy >= 1 ? true : 'disabled.illiterate'; },
    run: function () {
      State.applyMind({ resolve: 2 });
      S.flags.readTheBoard = true;
      return 'town.results.readNotice';
    }
  },

  tendKin: {
    ap: 1,
    labelKey: 'town.actions.tendKin',
    hintKey: 'town.actions.tendKinHint',
    enabled: function () {
      var k = State.kin();
      return (k && k.status !== 'DEAD') ? true : 'disabled.noKin';
    },
    run: function () {
      var k = State.kin();
      State.applyKin({ health: 5, mood: 14 });
      State.applyMind({ resolve: 4 });
      State.applyBody({ fatigue: 3 });
      return (k && k.health < 45) ? 'town.results.tendedBad' : 'town.results.tended';
    }
  },

  rest: {
    ap: 1,
    labelKey: 'town.actions.rest',
    hintKey: 'town.actions.restHint',
    enabled: function () { return S.evening.rested ? 'disabled.alreadyRested' : true; },
    run: function () {
      S.evening.rested = true;
      State.applyBody({ fatigue: -14, warmth: S.house.coal > 0 ? 2 : -3 });
      State.applyMind({ resolve: 1 });
      return 'town.results.rested';
    }
  },

  dressWound: {
    ap: 1,
    labelKey: 'town.actions.dressWound',
    hintKey: 'town.actions.dressWoundHint',
    enabled: function () { return S.body.injury ? true : 'disabled.noWound'; },
    run: function () {
      var hadPhysic = S.house.physic > 0;
      if (hadPhysic) {
        S.house.physic -= 1;
        S.body.injury.daysLeft = Math.max(1, S.body.injury.daysLeft - 1);
        State.applyBody({ health: 3 });
      } else {
        State.applyBody({ health: 1 });
      }
      S.flags.dressedToday = hadPhysic ? 2 : 1;
      return hadPhysic ? 'town.results.dressedPhysic' : 'town.results.dressedRag';
    }
  },

  mend: {
    ap: 1,
    labelKey: 'town.actions.mend',
    hintKey: 'town.actions.mendHint',
    enabled: function () { return S.house.coatMended ? 'disabled.noCoat' : true; },
    run: function () {
      S.house.coatMended = true;
      State.applyBody({ warmth: 8, fatigue: 4 });
      return 'town.results.mended';
    }
  },

  drink: {
    ap: 1,
    labelKey: 'town.actions.drink',
    hintKey: 'town.actions.drinkHint',
    price: function () { return Economy.priceOf('beer'); },
    enabled: function () { return Economy.canAfford(Economy.priceOf('beer')) ? true : 'disabled.noPennies'; },
    run: function () {
      Economy.spend(Economy.priceOf('beer'));
      State.applyMind({ resolve: 6 });
      State.applyBody({ fatigue: -6, hunger: -4, health: -1, warmth: 4 });
      State.applyStanding({ workmates: 3 });
      UI.log(T('log.spent', { amt: Economy.money(Economy.priceOf('beer')) }));
      return 'town.results.drank';
    }
  },

  listen: {
    ap: 1,
    labelKey: 'town.actions.listen',
    hintKey: 'town.actions.listenHint',
    enabled: function () { return true; },
    run: function () {
      S.flags.heardTheTalk = (S.flags.heardTheTalk || 0) + 1;
      State.applyStanding({ workmates: 2, notice: 1 });
      State.applyMind({ resolve: 2 });
      return 'town.results.listened';
    }
  }
};

var Town = {

  locations: function () { return LOCATIONS; },

  location: function (id) {
    for (var i = 0; i < LOCATIONS.length; i++) if (LOCATIONS[i].id === id) return LOCATIONS[i];
    return null;
  },

  /* Every action resolves to acts-or-says-why. Nothing silently does nothing. */
  describe: function (actionId) {
    var def = TOWN_ACTIONS[actionId];
    if (!def) return null;
    var priceParams = def.price ? { price: Economy.money(def.price()) } : null;
    var reason = null;

    if (S.time.phase !== 'EVENING') reason = 'disabled.notEvening';
    else if (S.evening.ap < def.ap) reason = 'disabled.noAp';
    else {
      var ok = def.enabled();
      if (ok !== true) reason = ok;
    }

    return {
      id: actionId,
      label: T(def.labelKey, priceParams),
      hint: T(def.hintKey),
      ap: def.ap,
      disabledReason: reason ? T(reason) : null
    };
  },

  perform: function (actionId) {
    var def = TOWN_ACTIONS[actionId];
    var d = Town.describe(actionId);
    if (!def || !d || d.disabledReason) return null;
    var resultKey = def.run();
    S.evening.ap -= def.ap;
    Audio.thunk();
    return resultKey;
  }
};
