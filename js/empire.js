/* ==========================================================================
   GRIMWICK WORKS — js/empire.js
   The Mountain War, the scarcity, the unrest and the levy.

   The player never sees these numbers and never will. They see a broadsheet
   they may not be able to read, a tavern where three rumours in ten are
   false and none of them are labelled, and a town with more soldiers in it
   than there were last month.
   ========================================================================== */

var METER_BANDS = ['none', 'low', 'rising', 'high', 'total'];

var Empire = {

  /* ---------------------------------------------------------------- bands */
  band: function (value) {
    if (value >= 78) return 'total';
    if (value >= 56) return 'high';
    if (value >= 34) return 'rising';
    if (value >= 15) return 'low';
    return 'none';
  },

  bandOf: function (meter) { return Empire.band(S.empire[meter] || 0); },

  /* Kept for the market board's one-line headline. */
  newsBand: function () {
    var w = S.empire.war;
    if (w >= 78) return 'total';
    if (w >= 58) return 'hard';
    if (w >= 38) return 'open';
    if (w >= 18) return 'rumour';
    return 'quiet';
  },

  /* ---------------------------------------------------------------- weekly
     The four meters move together, because they are the same war seen from
     four different windows.
     -------------------------------------------------------------------- */
  week: function () {
    var e = S.empire;
    e.week += 1;

    var actPush = (S.time.act - 1) * 3;
    e.war = Util.clamp100(e.war + Util.rndInt(-2, 5) + actPush);

    /* an army eats first, and what it does not eat it requisitions */
    e.scarcity = Util.clamp100(e.scarcity + Util.rndInt(-3, 4) + Math.round(e.war / 22));
    if (S.time.season === 'WINTER') e.scarcity = Util.clamp100(e.scarcity + 3);

    /* hungry towns are restless towns, and the garrison reads the same figures */
    e.unrest = Util.clamp100(e.unrest + Util.rndInt(-3, 3) + Math.round(e.scarcity / 25)
      + (S.flags.strikeCalled ? 12 : 0));

    /* the levy follows the casualty lists, at about a month's delay */
    e.levy = Util.clamp100(e.levy + Util.rndInt(-2, 4) + Math.round(e.war / 26));

    /* the glut is the other end of the levy: men released, men returned */
    e.glut = Util.clamp100(e.glut + Util.rndInt(-2, 3) + (e.war > 60 ? 2 : 0));

    /* what the town can see without being told anything */
    e.patrols = 1 + (e.unrest >= 34 ? 1 : 0) + (e.unrest >= 56 ? 1 : 0) + (e.unrest >= 78 ? 1 : 0);
    if (!e.gallows && e.unrest >= 62) {
      e.gallows = true;
      S.flags.gallowsRaised = true;
      UI.log(T('world.gallowsRaised'), 'bad');
    }

    Economy.recomputeMarket();
    return e;
  },

  /* ---------------------------------------------------------------- daily */
  tick: function () {
    /* attention fades if you give it nothing to look at, and slowly */
    if (S.standing.notice > 0 && Util.chance(0.4)) {
      S.standing.notice = Util.clamp100(S.standing.notice - 1);
    }
    if (S.flags.carryingPrint) S.standing.notice = Util.clamp100(S.standing.notice + 2);
    if (S.flags.holdingParcel) S.standing.notice = Util.clamp100(S.standing.notice + 1);
    if (S.standing.garrison < -40) S.standing.notice = Util.clamp100(S.standing.notice + 1);
    if (S.tracks.union.joined && S.empire.unrest >= 56) S.standing.notice = Util.clamp100(S.standing.notice + 1);
  },

  /* --------------------------------------------------------------- signs
     What the town looks like this week. In-world only.
     ------------------------------------------------------------------- */
  signs: function () {
    var out = [];
    var e = S.empire;
    out.push(T('world.patrols.' + Math.min(3, e.patrols - 1)));
    out.push(T('world.shelves.' + Empire.band(e.scarcity)));
    if (e.gallows) out.push(T('world.gallows'));
    if (e.levy >= 70) out.push(T('world.pressGang'));
    else if (e.levy >= 45) out.push(T('world.recruiters'));
    if (e.unrest >= 56) out.push(T('world.unrest'));
    return out;
  },

  /* ---------------------------------------------------------- broadsheet
     The truth, in print, for anybody who can read print.
     ------------------------------------------------------------------- */
  broadsheet: function () {
    var out = [];
    out.push(T('broadsheet.war.' + Empire.bandOf('war')));
    out.push(T('broadsheet.scarcity.' + Empire.bandOf('scarcity')));
    out.push(T('broadsheet.unrest.' + Empire.bandOf('unrest')));
    out.push(T('broadsheet.levy.' + Empire.bandOf('levy')));
    S.empire.lastHeadlines = out;
    S.flags.readBroadsheet = (S.flags.readBroadsheet || 0) + 1;
    return out;
  },

  /* ------------------------------------------------------------- rumours
     Three in ten are false. The game does not know how to tell you which,
     because nobody in the Black Ewe knows either.
     ------------------------------------------------------------------- */
  rumour: function () {
    var meters = ['war', 'scarcity', 'unrest', 'levy'];
    var meter = meters[Util.rndInt(0, meters.length - 1)];
    var trueBand = Empire.bandOf(meter);
    var isTrue = !Util.chance(0.3);
    var band = trueBand;

    if (!isTrue) {
      /* a false rumour is a true-sounding one about the wrong state of the
         world: the same voice, the same confidence, the wrong band */
      var idx = METER_BANDS.indexOf(trueBand);
      var wrong = idx;
      while (wrong === idx) wrong = Util.rndInt(0, METER_BANDS.length - 1);
      band = METER_BANDS[wrong];
    }

    var pool = T('rumours.' + meter + '.' + band);
    var text = (pool && pool.length) ? pool[Util.rndInt(0, pool.length - 1)] : T('rumours.generic');

    /* recorded for the historian, never for the player */
    S.flags.rumoursHeard = (S.flags.rumoursHeard || 0) + 1;
    return { text: text, meter: meter, wasTrue: isTrue };
  },

  /* ---------------------------------------------------------- the garrison
     watched 30 / searched 55 / arrested 75 / hanged 90
     ------------------------------------------------------------------- */
  noticeBand: function () {
    var n = S.standing.notice;
    if (n >= 90) return 'hanged';
    if (n >= 75) return 'arrested';
    if (n >= 55) return 'searched';
    if (n >= 30) return 'watched';
    return 'unknown';
  },

  contraband: function () {
    var items = [];
    if (S.flags.carryingPrint) items.push('print');
    if (S.flags.holdingParcel) items.push('parcel');
    if ((S.flags.hasBrass || 0) > 0) items.push('brass');
    if (S.flags.stealingCaps) items.push('caps');
    return items;
  },

  /* Called at the top of every day. This is where the meters arrive at the
     door, which is the only way the player ever meets them. */
  garrisonDay: function () {
    if (S.dead || S.arrest) return null;
    var band = Empire.noticeBand();
    var pressure = 1 + S.empire.unrest / 90;

    if (band === 'hanged') {
      /* there is a rope up in the square and your name is on the calendar */
      S.flags.condemned = true;
      return { kind: 'hanged' };
    }

    if (band === 'arrested' && Util.chance(0.42 * pressure)) {
      return { kind: 'arrested' };
    }

    if (band === 'searched' && Util.chance(0.34 * pressure)) {
      return { kind: 'searched', found: Empire.contraband() };
    }

    if (band === 'watched' && Util.chance(0.28 * pressure)) {
      return { kind: 'watched' };
    }

    /* the press gang works Grimwick when the levy is high enough */
    if (S.empire.levy >= 70 && S.job.employed === false && Util.chance(0.2)) {
      return { kind: 'pressgang' };
    }
    return null;
  },

  /* Taken up. Days in the cells, shifts lost, and a charge that decides
     whether you come out at all. */
  arrest: function (charge) {
    var days = Util.rndInt(2, 4);
    var seditious = charge === 'sedition';
    S.arrest = { day: S.time.day, daysHeld: days, charge: charge || 'suspicion' };
    S.flags.arrested = (S.flags.arrested || 0) + 1;
    S.standing.notice = Util.clamp100(S.standing.notice - (seditious ? 4 : 12));
    State.applyStanding({ garrison: -10, foreman: -8 });
    State.applyMind({ resolve: -10 });
    if (S.job.employed) {
      S.job.warnings += 1;
      S.job.lastWarningDay = S.time.day;
      if (S.job.warnings >= QUOTA.warningsToDismissal) {
        S.job.employed = false;
        S.flags.sacked = true;
      }
    }
    return S.arrest;
  },

  releaseCheck: function () {
    if (!S.arrest) return false;
    if (S.time.day - S.arrest.day < S.arrest.daysHeld) return false;
    var charge = S.arrest.charge;
    S.arrest = null;
    S.flags.released = (S.flags.released || 0) + 1;
    if (charge === 'sedition' && S.tracks.informant.names.length === 0 && Util.chance(0.35)) {
      /* committed for trial. the assizes are not in Grimwick and neither are you */
      S.flags.committed = true;
    }
    return true;
  }
};

/* ==========================================================================
   THE ACTS — on schedule, or on the trigger, whichever comes first.
   ========================================================================== */
var Acts = {

  ACT1_END_DAY: 20,
  ACT2_END_DAY: 45,

  /* Called every morning. Returns an id when the world turns over. */
  check: function () {
    if (S.time.act === 1 && (S.time.day > Acts.ACT1_END_DAY || S.empire.war >= 55)) {
      return Acts.beginAct2();
    }
    if (S.time.act === 2 && (S.time.day > Acts.ACT2_END_DAY || Acts.act3Trigger())) {
      return Acts.beginAct3();
    }
    return null;
  },

  act3Trigger: function () {
    return !!(S.flags.strikeCalled || S.tracks.emigrate.booked || S.tracks.enlist.joined
      || S.flags.committed || S.flags.condemned);
  },

  /* The retooling: quotas double, three floors go. */
  beginAct2: function () {
    S.time.act = 2;
    S.flags.retooling = true;
    S.flags.act2Day = S.time.day;

    S.factory.quota.target = Math.round(S.factory.quota.target * 2);
    S.factory.quota.lastTarget = Math.round(S.factory.quota.target / 2);

    /* three floors laid off. the roster shortens and everyone counts it. */
    var laid = [];
    for (var i = 0; i < S.factory.floor.length && laid.length < 3; i++) {
      var h = S.factory.floor[i];
      if (h.alive && !h.laidOff && h.station !== S.factory.station) {
        h.laidOff = true;
        laid.push(h.name);
      }
    }
    S.flags.laidOff = laid;
    State.applyStanding({ workmates: -6 });
    State.applyMind({ resolve: -8 });

    /* and the roads out become visible, because people start taking them */
    S.tracks.union.known = true;
    S.tracks.informant.known = true;
    S.tracks.enlist.known = true;
    S.tracks.emigrate.known = true;
    S.tracks.criminal.known = true;

    return { id: 'retooling', laid: laid };
  },

  beginAct3: function () {
    S.time.act = 3;
    S.flags.act3Day = S.time.day;
    S.flags.reckoning = true;
    /* whatever was being built is called in now */
    var struck = Endings.callStrike();
    Endings.assignFates();
    return { id: 'reckoning', struck: struck };
  },

  /* Which roads the player is actually on. */
  active: function () {
    var out = [];
    for (var k in S.tracks) {
      if (Object.prototype.hasOwnProperty.call(S.tracks, k) && S.tracks[k].joined) out.push(k);
    }
    return out;
  }
};
