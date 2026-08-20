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
  }
};
