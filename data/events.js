/* ==========================================================================
   GRIMWICK WORKS — data/events.js
   Event definitions. Text is keys only. Effects are plain data read by
   js/events.js, so the whole thing survives a save/load round trip.

   effect shape (every field optional):
     body:{health,fatigue,hunger,warmth,dust,tremor}
     mind:{resolve,literacy}
     purse:{pennies,debt}
     standing:{foreman,workmates,garrison,notice}
     flags:{key:value}          set outright
     fine:'late'|'spoiled'|'talk'|'absent'
     larder:n  coal:n  physic:n
     injure:{type,severity,daysLeft,permanent}
     kin:{health,mood}
   ========================================================================== */

var EVENTS = [
  {
    id: 'e_shortMeasure',
    phase: 'SHIFT',
    weight: 10,
    cond: function (S) { return S.job.employed && S.factory.station === 'CAP_BENCH'; },
    titleKey: 'events.e_shortMeasure.title',
    textKey: 'events.e_shortMeasure.text',
    choices: [
      { id: 'say', labelKey: 'events.e_shortMeasure.say', hintKey: 'events.e_shortMeasure.sayHint',
        resultKey: 'events.e_shortMeasure.r_say',
        effects: { body: { tremor: 3, fatigue: 4 }, standing: { foreman: 2 }, mind: { resolve: -2 } } },
      { id: 'complain', labelKey: 'events.e_shortMeasure.complain', hintKey: 'events.e_shortMeasure.complainHint',
        resultKey: 'events.e_shortMeasure.r_complain',
        effects: { standing: { foreman: -8, workmates: 5 }, mind: { resolve: 3 }, flags: { spokeUpToHollick: true } } },
      { id: 'slow', labelKey: 'events.e_shortMeasure.slow', hintKey: 'events.e_shortMeasure.slowHint',
        resultKey: 'events.e_shortMeasure.r_slow',
        effects: { fine: 'spoiled', standing: { foreman: -4, workmates: 2 }, body: { tremor: 1 } } }
    ]
  },

  {
    id: 'e_gateSearch',
    phase: 'SHIFT',
    weight: 8,
    cond: function (S) { return S.job.employed && S.standing.notice >= 10; },
    titleKey: 'events.e_gateSearch.title',
    textKey: 'events.e_gateSearch.text',
    choices: [
      { id: 'submit', labelKey: 'events.e_gateSearch.submit', hintKey: 'events.e_gateSearch.submitHint',
        resultKey: 'events.e_gateSearch.r_submit',
        effects: { standing: { garrison: 3, notice: -5 }, body: { warmth: -6 }, mind: { resolve: -3 } } },
      { id: 'avoid', labelKey: 'events.e_gateSearch.avoid', hintKey: 'events.e_gateSearch.avoidHint',
        resultKey: 'events.e_gateSearch.r_avoid',
        effects: { fine: 'late', standing: { foreman: -5, notice: 3 }, body: { warmth: -10 } } }
    ]
  },

  {
    id: 'e_boyHand',
    phase: 'SHIFT',
    weight: 9,
    cond: function (S) { return S.job.employed && S.factory.station === 'STAMPING'; },
    titleKey: 'events.e_boyHand.title',
    textKey: 'events.e_boyHand.text',
    choices: [
      { id: 'teach', labelKey: 'events.e_boyHand.teach', hintKey: 'events.e_boyHand.teachHint',
        resultKey: 'events.e_boyHand.r_teach',
        effects: { purse: { pennies: -3 }, standing: { workmates: 8, foreman: -3 }, mind: { resolve: 5 }, flags: { taughtTheBoy: true } } },
      { id: 'ignore', labelKey: 'events.e_boyHand.ignore', hintKey: 'events.e_boyHand.ignoreHint',
        resultKey: 'events.e_boyHand.r_ignore',
        effects: { standing: { workmates: -4 }, mind: { resolve: -4 } } }
    ]
  },

  {
    id: 'e_dampPowder',
    phase: 'SHIFT',
    weight: 8,
    cond: function (S) { return S.job.employed && S.factory.station === 'CAP_BENCH'; },
    titleKey: 'events.e_dampPowder.title',
    textKey: 'events.e_dampPowder.text',
    choices: [
      { id: 'report', labelKey: 'events.e_dampPowder.report', hintKey: 'events.e_dampPowder.reportHint',
        resultKey: 'events.e_dampPowder.r_report',
        effects: { fine: 'spoiled', standing: { foreman: 3 }, mind: { resolve: 3 }, flags: { reportedBadBatch: true } } },
      { id: 'pass', labelKey: 'events.e_dampPowder.pass', hintKey: 'events.e_dampPowder.passHint',
        resultKey: 'events.e_dampPowder.r_pass',
        effects: { mind: { resolve: -6 }, flags: { passedBadCaps: true } } }
    ]
  },

  {
    id: 'e_steamGun',
    phase: 'SHIFT',
    weight: 5,
    cond: function (S) { return S.job.employed && S.time.day >= 4; },
    titleKey: 'events.e_steamGun.title',
    textKey: 'events.e_steamGun.text',
    choices: [
      { id: 'watch', labelKey: 'events.e_steamGun.watch', hintKey: 'events.e_steamGun.watchHint',
        resultKey: 'events.e_steamGun.r_watch',
        effects: { purse: { pennies: -4 }, body: { fatigue: -4 } } },
      { id: 'grumble', labelKey: 'events.e_steamGun.grumble', hintKey: 'events.e_steamGun.grumbleHint',
        resultKey: 'events.e_steamGun.r_grumble',
        effects: { fine: 'talk', standing: { workmates: 6, foreman: -6, notice: 4 }, mind: { resolve: 4 } } }
    ]
  },

  {
    id: 'e_omen',
    phase: 'SHIFT',
    weight: 6,
    cond: function (S) { return S.job.employed && S.factory.station === 'GRINDING'; },
    titleKey: 'events.e_omen.title',
    textKey: 'events.e_omen.text',
    choices: [
      { id: 'touch', labelKey: 'events.e_omen.touch', hintKey: 'events.e_omen.touchHint',
        resultKey: 'events.e_omen.r_touch',
        effects: { standing: { workmates: 2 }, flags: { touchedTheMark: true } } },
      { id: 'scrub', labelKey: 'events.e_omen.scrub', hintKey: 'events.e_omen.scrubHint',
        resultKey: 'events.e_omen.r_scrub',
        effects: { standing: { workmates: -7 }, mind: { resolve: 2 }, flags: { scrubbedTheMark: true } } }
    ]
  },

  {
    id: 'e_pamphlet',
    phase: 'SHIFT',
    weight: 7,
    cond: function (S) { return S.job.employed && S.time.day >= 3; },
    titleKey: 'events.e_pamphlet.title',
    textKey: 'events.e_pamphlet.text',
    choices: [
      { id: 'read', labelKey: 'events.e_pamphlet.read', hintKey: 'events.e_pamphlet.readHint',
        enabled: function (S) { return S.mind.literacy >= 1 ? true : 'disabled.illiterate'; },
        resultKey: 'events.e_pamphlet.r_read',
        effects: { mind: { resolve: 6 }, standing: { notice: 5 }, flags: { readThePamphlet: true } } },
      { id: 'pocket', labelKey: 'events.e_pamphlet.pocket', hintKey: 'events.e_pamphlet.pocketHint',
        resultKey: 'events.e_pamphlet.r_pocket',
        effects: { standing: { notice: 8 }, flags: { carryingPrint: true } } },
      { id: 'burn', labelKey: 'events.e_pamphlet.burn', hintKey: 'events.e_pamphlet.burnHint',
        resultKey: 'events.e_pamphlet.r_burn',
        effects: { mind: { resolve: -2 }, standing: { workmates: -2 } } }
    ]
  },

  {
    id: 'e_wageCut',
    phase: 'SHIFT',
    weight: 6,
    cond: function (S) { return S.job.employed && S.time.day >= 5; },
    titleKey: 'events.e_wageCut.title',
    textKey: 'events.e_wageCut.text',
    choices: [
      { id: 'readIt', labelKey: 'events.e_wageCut.readIt', hintKey: 'events.e_wageCut.readItHint',
        enabled: function (S) { return S.mind.literacy >= 2 ? true : 'disabled.illiterate'; },
        resultKey: 'events.e_wageCut.r_readIt',
        effects: { standing: { workmates: -3, foreman: 2 }, flags: { lampOilUp: true } } },
      { id: 'askAbout', labelKey: 'events.e_wageCut.askAbout', hintKey: 'events.e_wageCut.askAboutHint',
        resultKey: 'events.e_wageCut.r_askAbout',
        effects: { mind: { resolve: -2 }, flags: { lampOilUp: true } } }
    ]
  },

  {
    id: 'e_pressGang',
    phase: 'EVENING',
    weight: 7,
    cond: function (S) { return S.time.day >= 4; },
    titleKey: 'events.e_pressGang.title',
    textKey: 'events.e_pressGang.text',
    choices: [
      { id: 'listen', labelKey: 'events.e_pressGang.listen', hintKey: 'events.e_pressGang.listenHint',
        resultKey: 'events.e_pressGang.r_listen',
        effects: { flags: { heardTheRecruiter: true }, standing: { garrison: 4 }, mind: { resolve: -2 } } },
      { id: 'walk', labelKey: 'events.e_pressGang.walk', hintKey: 'events.e_pressGang.walkHint',
        resultKey: 'events.e_pressGang.r_walk',
        effects: { mind: { resolve: 2 } } }
    ]
  },

  {
    id: 'e_landlordDun',
    phase: 'EVENING',
    weight: 8,
    cond: function (S) { return S.house.rentDue - S.time.day <= 2 && S.house.rentDue - S.time.day >= 0; },
    titleKey: 'events.e_landlordDun.title',
    textKey: 'events.e_landlordDun.text',
    choices: [
      { id: 'payNow', labelKey: 'events.e_landlordDun.payNow', hintKey: 'events.e_landlordDun.payNowHint',
        enabled: function (S) { return S.purse.pennies >= S.house.rentAmount ? true : 'disabled.noPennies'; },
        resultKey: 'events.e_landlordDun.r_payNow',
        effects: { purse: { pennies: -40 }, flags: { rentPaidEarly: true }, mind: { resolve: 3 } } },
      { id: 'putOff', labelKey: 'events.e_landlordDun.putOff', hintKey: 'events.e_landlordDun.putOffHint',
        resultKey: 'events.e_landlordDun.r_putOff',
        effects: { mind: { resolve: -5 }, flags: { kellIsAngry: true } } }
    ]
  },

  {
    id: 'e_sickKin',
    phase: 'NIGHT',
    weight: 12,
    cond: function (S) {
      var k = S.house.kin[0];
      return !!k && k.status !== 'DEAD' && (k.health < 60 || S.house.coal <= 0);
    },
    titleKey: 'events.e_sickKin.title',
    textKey: 'events.e_sickKin.text',
    choices: [
      { id: 'physic', labelKey: 'events.e_sickKin.physic', hintKey: 'events.e_sickKin.physicHint',
        enabled: function (S) { return S.house.physic > 0 ? true : 'disabled.noPhysic'; },
        resultKey: 'events.e_sickKin.r_physic',
        effects: { physic: -1, kin: { health: 18, mood: 8 } } },
      { id: 'doctor', labelKey: 'events.e_sickKin.doctor', hintKey: 'events.e_sickKin.doctorHint',
        resultKey: 'events.e_sickKin.r_doctor',
        effects: { purse: { debt: 30 }, kin: { health: 26, mood: 5 }, flags: { doctorsBook: true } } },
      { id: 'wait', labelKey: 'events.e_sickKin.wait', hintKey: 'events.e_sickKin.waitHint',
        resultKey: 'events.e_sickKin.r_wait',
        effects: { kin: { health: -8, mood: -6 }, body: { fatigue: 10 }, mind: { resolve: -3 } } }
    ]
  }
];
