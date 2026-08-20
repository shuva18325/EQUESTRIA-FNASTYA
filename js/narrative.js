/* ==========================================================================
   GRIMWICK WORKS — js/narrative.js
   Reads S.flags and the body, decides what the game says about you.
   Returns {key, params} pairs. Never returns English.
   ========================================================================== */

var Narrative = {

  /* The one line at the bottom of the docket. Worst thing first. */
  bodyNoteKey: function (docket) {
    var b = S.body;
    if (b.injury) return 'docket.bodyNotes.injury';
    if (b.health < 35) return 'docket.bodyNotes.sick';
    if (b.hunger > 75) return 'docket.bodyNotes.hunger';
    if (b.warmth < 22) return 'docket.bodyNotes.cold';
    if (b.dust > 45) return 'docket.bodyNotes.dust';
    if (b.tremor > 40) return 'docket.bodyNotes.tremor';
    if (docket && !docket.worked) return 'docket.bodyNotes.idle';
    if (docket && docket.net <= 0) return 'docket.bodyNotes.broke';
    if (b.fatigue > 72) return 'docket.bodyNotes.fatigue';
    return 'docket.bodyNotes.default';
  },

  /* STANDING ORDERS — what is wanted of you, right now. Most urgent wins. */
  goal: function () {
    var k = State.kin();
    var kk = State.kin();
    if (S.destitution.workhouse) return { key: 'goals.act1_workhouse', params: { name: kk ? kk.name : '' } };
    if (kk && kk.status === 'TAKEN') return { key: 'goals.act1_kinTaken', params: { name: kk.name } };
    if (!S.house.housed) return { key: 'goals.act1_evicted' };
    if (!S.job.employed) return { key: 'goals.act1_sacked' };
    if (S.body.injury && S.body.injury.fever) return { key: 'goals.act1_fever' };
    if (S.body.injury) return { key: 'goals.act1_hurt' };
    if (k && k.status === 'FEVERED') return { key: 'goals.act1_kin' };
    if (S.house.larder <= 0) return { key: 'goals.act1_hungry' };
    if (S.house.coal <= 0 && (S.time.season === 'WINTER' || S.time.season === 'AUTUMN')) {
      return { key: 'goals.act1_cold' };
    }
    if (S.house.rentDue - S.time.day <= 2 && S.purse.pennies < S.house.rentAmount) {
      return { key: 'goals.act1_rent', params: { amt: Economy.money(S.house.rentAmount - S.purse.pennies) } };
    }
    if (S.purse.debt >= 60) return { key: 'goals.act1_debt', params: { amt: Economy.money(S.purse.debt) } };
    var q = Factory.quotaProgress();
    if (S.job.employed && q.remaining > 0) {
      return { key: 'goals.act1_quota', params: { n: q.remaining, d: q.shiftsLeft } };
    }
    if (S.time.act === 2) return { key: 'goals.act2_retool' };
    if (S.time.act === 3) return { key: 'goals.act3_end' };
    return { key: 'goals.act1_survive' };
  },

  /* The next dated thing that will happen to you whether you are ready or not. */
  deadline: function () {
    var candidates = [];
    if (S.house.rentDue >= S.time.day) {
      candidates.push({
        day: S.house.rentDue,
        key: 'goals.deadline_rent',
        params: { d: S.house.rentDue, amt: Economy.money(S.house.rentAmount) }
      });
    }
    if (S.purse.debt > 0) {
      var nextSunday = S.time.day + (7 - (S.time.day % 7)) % 7;
      if (nextSunday <= S.time.day) nextSunday += 7;
      candidates.push({ day: nextSunday, key: 'goals.deadline_debt', params: { d: nextSunday } });
    }
    if (S.job.employed) {
      var qd = S.time.day + (7 - (S.time.day % 7)) % 7;
      if (qd < S.time.day) qd += 7;
      if (qd === S.time.day - 0 && S.time.day % 7 !== 0) qd += 7;
      candidates.push({
        day: qd,
        key: 'goals.deadline_quota',
        params: { d: qd, n: Math.max(0, S.factory.quota.target - S.factory.quota.made) }
      });
    }
    if (S.time.act === 1) {
      candidates.push({ day: 21, key: 'goals.deadline_act', params: { d: 21 } });
    }
    if (!candidates.length) return { key: 'goals.deadline_none' };
    candidates.sort(function (a, b) { return a.day - b.day; });
    return candidates[0];
  },

  /* Flavour for the shift, chosen by station. */
  stationLineKey: function () {
    return 'shift.stations.' + S.factory.station + '.line';
  },

  stationNameKey: function () {
    return 'shift.stations.' + S.factory.station + '.name';
  },

  /* Which death is claiming you. The proximate cause is recorded on the body
     as it happens; the checks below only cover deaths with no single blow. */
  deathId: function () {
    var harm = { starve: 'death_starve', cold: 'death_cold', injury: 'death_injury', sick: 'death_sick' };
    if (S.body.lastHarm && harm[S.body.lastHarm]) return harm[S.body.lastHarm];
    if (S.body.hunger >= 96) return 'death_starve';
    if (S.body.warmth <= 4) return 'death_cold';
    if (S.body.injury) return 'death_injury';
    if (S.body.dust >= 80) return 'death_sick';
    if (S.house.larder <= 0 && S.body.hunger > 70) return 'death_starve';
    return 'death_sick';
  },

  /* What the town looks like, for the objectives panel. In-world only. */
  worldLine: function () {
    var signs = Empire.signs();
    return signs.length ? signs[0] : '';
  }
};

/* ==========================================================================
   ENDINGS — chosen by what you built, resolved by what it cost.
   ========================================================================== */
var Endings = {

  /* The strike is called at the reckoning if there is anything to call. */
  callStrike: function () {
    var u = S.tracks.union;
    if (!u.joined || u.struck) return false;
    if (u.meetings < 2 && u.dues < 2) return false;
    u.struck = true;
    S.flags.strikeCalled = true;
    State.applyStanding({ notice: 12, foreman: -20 });
    return true;
  },

  /* Whether it held. Numbers the player has been able to feel all game:
     how the floor stands with you, what the fund holds, whether the town
     was angry enough, and whether anybody gave names. */
  strikeHeld: function () {
    var u = S.tracks.union;
    var score = 0;
    if (S.standing.workmates >= 35) score += 2;
    if (S.standing.workmates >= 60) score += 1;
    if (u.dues >= 3) score += 1;
    if (u.meetings >= 3) score += 1;
    if (S.empire.unrest >= 45) score += 1;
    if (S.tracks.informant.names.length > 0) score -= 3;
    if (u.exposed) score -= 2;
    return score >= 4;
  },

  /* The service does not care what you chose. It cares what you arrived as. */
  shillingEpilogue: function () {
    if (S.body.dust >= 55 || S.body.health <= 32 || S.body.lead >= 55) return 'invalided';
    if (S.mind.literacy >= 2 && S.mind.resolve >= 45 && S.body.tremor < 45) return 'promoted';
    if (S.body.health <= 55 || S.body.tremor >= 55) return 'died';
    return 'survived';
  },

  /* Everyone you named gets a fate, and the fate is always shown. */
  assignFates: function () {
    var names = S.tracks.informant.names;
    for (var i = 0; i < names.length; i++) {
      if (names[i].fate) continue;
      var u = S.empire.unrest;
      var f;
      if (u >= 72 && S.empire.gallows && Util.chance(0.35)) f = 'hanged';
      else if (u >= 52) f = Util.chance(0.55) ? 'transported' : 'gaoled';
      else if (u >= 32) f = Util.chance(0.5) ? 'gaoled' : 'blacklisted';
      else f = Util.chance(0.6) ? 'blacklisted' : 'released';
      names[i].fate = f;
      names[i].fateDay = S.time.day;
    }
    return names;
  },

  fatesToShow: function () {
    var out = [], names = S.tracks.informant.names;
    for (var i = 0; i < names.length; i++) {
      if (names[i].fate && !names[i].shown) out.push(names[i]);
    }
    return out;
  },

  fateLine: function (entry) {
    var def = INFORMANT_FATES[entry.fate];
    if (!def) return '';
    return interpolate(def.line, { name: entry.name });
  },

  /* Which ending this is. Order matters: the rope first, then the grave. */
  pick: function () {
    if (S.flags.condemned) return 'the_drop';
    if (S.dead) return 'broken';
    if (S.tracks.enlist.joined) return 'the_shilling';
    if (S.tracks.emigrate.booked && (!State.kinPresent() || S.tracks.emigrate.kinBooked)) return 'passage';
    if (S.tracks.informant.names.length > 0 && S.standing.foreman > 70) return 'foremans_chair';
    if (S.tracks.informant.names.length > 0) return 'queens_evidence';
    if (S.tracks.union.struck) return Endings.strikeHeld() ? 'strike_holds' : 'strike_breaks';
    return 'the_machine';
  },

  /* The four things every ending screen shows, whatever the ending is. */
  account: function () {
    var k = State.kin();
    var damage = [];
    if (S.body.dust > 5) damage.push(T('endings.dmgDust', { n: Math.round(S.body.dust), band: band(S.body.dust, 'dust') }));
    if (S.body.tremor > 5) damage.push(T('endings.dmgTremor', { n: Math.round(S.body.tremor), band: band(S.body.tremor, 'tremor') }));
    if (S.body.lead > 5) damage.push(T('endings.dmgLead', { n: Math.round(S.body.lead), band: band(S.body.lead, 'lead') }));
    for (var i = 0; i < S.body.scars.length; i++) {
      damage.push(T('endings.dmgScar', { what: T('injuries.' + S.body.scars[i].type) }));
    }
    if (!damage.length) damage.push(T('endings.dmgNone'));

    var kinLine;
    if (!k) kinLine = T('endings.kinNone');
    else if (k.status === 'DEAD') kinLine = T('endings.kinDead', { name: k.name });
    else if (k.status === 'TAKEN') kinLine = T('endings.kinTaken', { name: k.name });
    else if (S.tracks.emigrate.kinBooked) kinLine = T('endings.kinSailed', { name: k.name });
    else if (k.working) kinLine = T('endings.kinWorking', { name: k.name, n: Math.round(k.tremor || 0) });
    else kinLine = T('endings.kinAlive', { name: k.name, band: band(k.health, 'health') });

    Endings.assignFates();
    var names = [];
    for (var j = 0; j < S.tracks.informant.names.length; j++) {
      names.push(Endings.fateLine(S.tracks.informant.names[j]));
    }

    return {
      days: S.time.day,
      damage: damage,
      kin: kinLine,
      names: names,
      earned: S.ledger.grossTotal,
      stopped: S.ledger.deductTotal,
      debt: S.purse.debt
    };
  }
};