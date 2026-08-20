/* ==========================================================================
   GRIMWICK WORKS — js/economy.js
   Money, charges, and the wage docket.
   12 pence = 1 shilling. 20 shillings = 1 crown. Never a decimal.
   ========================================================================== */

var Economy = {

  /* ---- money ---------------------------------------------------------- */
  money: function (pence) {
    var neg = pence < 0;
    var p = Math.abs(Math.round(pence));
    var crowns = Math.floor(p / 240);
    var rem = p % 240;
    var shillings = Math.floor(rem / 12);
    var d = rem % 12;
    var parts = [];
    if (crowns) parts.push(crowns + 'c');
    if (shillings) parts.push(shillings + 's');
    if (d || !parts.length) parts.push(d + 'd');
    return (neg ? '−' : '') + parts.join(' ');
  },

  /* ---- the market -----------------------------------------------------
     Prices move weekly, and they move because of the war. The board by the
     pump shows the player exactly that, in chalk.
     -------------------------------------------------------------------- */
  priceOf: function (id) {
    if (S.market && S.market.prices && typeof S.market.prices[id] === 'number') return S.market.prices[id];
    return BASE_PRICES[id] || (ITEMS[id] ? ITEMS[id].price : 0);
  },

  storePrice: function (id) {
    return Math.max(1, Math.round(Economy.priceOf(id) * STORE_DISCOUNT));
  },

  /* Recomputed at the top of every week. Last week is kept for the board. */
  recomputeMarket: function () {
    var week = Math.floor((S.time.day - 1) / 7) + 1;
    S.market.last = Util.deepClone(S.market.prices || {});
    var prices = {};
    var seasonMods = SEASON_PRICE[S.time.season] || {};
    for (var id in BASE_PRICES) {
      if (!Object.prototype.hasOwnProperty.call(BASE_PRICES, id)) continue;
      var base = BASE_PRICES[id];
      var sens = PRICE_SENSITIVITY[id] || 0.5;
      var warPush = 1 + (S.empire.war / 100) * 0.55 * sens;
      var season = seasonMods[id] || 1;
      var noise = 0.95 + Util.rnd() * 0.11;
      prices[id] = Math.max(1, Math.round(base * warPush * season * noise));
    }
    S.market.prices = prices;
    S.market.week = week;
    /* a labour glut is the other half of a war: more hands than places */
    S.market.wageMult = Util.clamp(1 - S.empire.glut / 260, 0.72, 1);
    if (!S.market.last || !Object.keys(S.market.last).length) S.market.last = Util.deepClone(prices);
    return prices;
  },

  /* What the board by the pump actually says. */
  board: function () {
    var rows = [], id;
    var order = ['bread', 'coal', 'cloth', 'physic', 'laudanum', 'surgeon'];
    for (var i = 0; i < order.length; i++) {
      id = order[i];
      var now = Economy.priceOf(id);
      var was = (S.market.last && S.market.last[id]) || now;
      rows.push({
        id: id,
        now: now,
        was: was,
        delta: now - was,
        store: Economy.storePrice(id)
      });
    }
    return rows;
  },

  canAfford: function (pence) { return S.purse.pennies >= pence; },

  spend: function (pence) {
    if (S.purse.pennies < pence) return false;
    S.purse.pennies -= pence;
    return true;
  },

  /* ---- weekly interest on the store book ------------------------------ */
  compoundDebt: function () {
    if (S.purse.debt <= 0) return 0;
    var add = Math.ceil(S.purse.debt * WAGE.debtInterestPct / 100);
    S.purse.debt += add;
    return add;
  },

  /* ---- the docket ------------------------------------------------------
     Built fresh each night from S. Lines carry string KEYS, never English,
     so a docket survives being saved and reloaded.
     ---------------------------------------------------------------------- */
  buildDocket: function () {
    var worked = S.factory.worked;
    var hours = worked ? WAGE.hours : 0;
    var gross = 0;

    /* Piece work. The count you made is the wage you get, and the day money
       is the floor beneath a ruined shift. */
    if (worked) {
      /* the glut does not change your count, only what a count is worth */
      var piece = Math.round((S.pending.pieceWage || 0) * (S.market.wageMult || 1));
      gross = Math.max(WAGE.dayFloor, piece);
    } else if (S.pending.pieceWage > 0) {
      /* a night shift taken while off the roll still pays */
      gross = Math.round(S.pending.pieceWage * (S.market.wageMult || 1));
    }
    if (S.pending.bonus > 0) gross += S.pending.bonus;
    /* a child's wage is paid to the head of the household. that is the law. */
    if (S.pending.kinWage > 0) gross += S.pending.kinWage;

    var lines = [];
    function add(key, amount, params) {
      if (amount > 0) lines.push({ key: key, amount: amount, params: params || null });
    }

    /* standing charges — taken whether or not you stood at the bench */
    add(CHARGES.lampOil.key, CHARGES.lampOil.base + (S.flags.lampOilUp ? 1 : 0));
    add(CHARGES.toolHire.key, CHARGES.toolHire.base);

    /* breakages: what you broke, plus what they say you broke */
    var breakages = S.pending.breakages;
    if (worked && Util.chance(0.28)) breakages += Util.rndInt(1, 5);
    /* and now and then, a charge that swallows the day whole: a cracked
       wheel, a bent die, a crate of caps condemned at inspection */
    if (worked && Util.chance(0.07)) breakages += Util.rndInt(12, 26);
    add(CHARGES.breakages.key, breakages);

    /* fines accrued today */
    for (var i = 0; i < S.pending.fines.length; i++) {
      var f = FINES[S.pending.fines[i]];
      if (f) add(f.key, f.amount);
    }
    if (!worked && S.job.employed) add(FINES.absent.key, FINES.absent.amount);

    /* subscriptions */
    if (S.time.day % 7 === 6) add(CHARGES.burialClub.key, CHARGES.burialClub.base);
    if (S.time.day % 7 === 0) add(CHARGES.chapelRate.key, CHARGES.chapelRate.base);

    /* the doctor's book has a long memory */
    if (S.flags.doctorsBookDays > 0) {
      add(CHARGES.doctorsBook.key, 3);
      S.flags.doctorsBookDays -= 1;
    }

    /* rent stopped at source, once Kell has applied to the Works */
    if (S.flags.rentAtSource && S.house.arrears > 0) {
      var stop = Math.min(6, S.house.arrears);
      add(CHARGES.rentAtSource.key, stop);
      S.house.arrears -= stop;
      if (S.house.arrears <= 0) { S.house.arrears = 0; S.flags.rentAtSource = false; }
    }

    /* condemned pieces, charged at the value of the article */
    if (S.pending.spoilage > 0) add(CHARGES.spoilage.key, S.pending.spoilage);

    /* the week's count came up short */
    if (S.pending.quotaFine > 0) add(CHARGES.quotaFine.key, S.pending.quotaFine);

    /* charges Coom writes in because he can */
    var skims = Coom.skims();
    for (var k = 0; k < skims.length; k++) add(skims[k].key, skims[k].amount);

    /* the company store takes its cut off the top */
    if (S.purse.debt > 0) {
      var take = Math.max(2, Math.round(gross * 0.15));
      take = Math.min(take, S.purse.debt);
      add(CHARGES.store.key, take);
      S.storeTakeThisDay = take;
    } else {
      S.storeTakeThisDay = 0;
    }

    var deducted = 0;
    for (var j = 0; j < lines.length; j++) deducted += lines[j].amount;

    var net = gross - deducted;

    return {
      day: S.time.day,
      season: S.time.season,
      weather: S.time.weather,
      worked: worked,
      hours: hours,
      stationKey: 'shift.stations.' + S.factory.station + '.name',
      pieces: S.factory.shift ? S.factory.shift.good : 0,
      unitKey: 'shift.stations.' + S.factory.station + '.units',
      orderId: S.factory.shift ? S.factory.shift.order : (S.factory.order || null),
      bonus: S.pending.bonus,
      kinWage: S.pending.kinWage,
      kinName: State.kin() ? State.kin().name : '',
      gross: gross,
      lines: lines,
      deducted: deducted,
      net: net,
      carried: net < 0 ? -net : 0,
      debtBefore: S.purse.debt,
      debtAfter: 0,
      noteKey: null
    };
  },

  /* Pay it in, or write it up. Returns the settled docket. */
  settle: function (docket) {
    /* the store's cut comes off the book */
    if (S.storeTakeThisDay) {
      S.purse.debt = Math.max(0, S.purse.debt - S.storeTakeThisDay);
      S.storeTakeThisDay = 0;
    }
    if (docket.net > 0) {
      S.purse.pennies += docket.net;
    } else if (docket.net < 0) {
      /* a week where the charges beat the wage. it happens. it is legal. */
      S.purse.debt += -docket.net;
    }
    docket.debtAfter = S.purse.debt;
    docket.noteKey = Narrative.bodyNoteKey(docket);

    S.ledger.grossTotal += docket.gross;
    S.ledger.deductTotal += docket.deducted;
    S.ledger.netTotal += docket.net;
    if (docket.worked) S.ledger.daysWorked += 1;

    S.docket = docket;
    S.dockets.push({ day: docket.day, gross: docket.gross, net: docket.net });
    if (S.dockets.length > 70) S.dockets.shift();

    /* charges are settled; tomorrow starts its own tab */
    S.pending.fines = [];
    S.pending.breakages = 0;
    S.pending.extra = [];
    S.pending.pieceWage = 0;
    S.pending.kinWage = 0;
    S.pending.bonus = 0;
    S.pending.quotaFine = 0;
    S.pending.spoilage = 0;
    return docket;
  }
};
