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
    cat: 'factory',
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
    cat: 'soldiers',
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
    cat: 'factory',
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
    cat: 'factory',
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
    cat: 'factory',
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
    cat: 'folklore',
    phase: 'SHIFT',
    weight: 6,
    cond: function (S) { return S.job.employed && S.factory.station === 'GRINDING'; },
    titleKey: 'events.e_omen.title',
    textKey: 'events.e_omen.text',
    choices: [
      { id: 'touch', labelKey: 'events.e_omen.touch', hintKey: 'events.e_omen.touchHint', supernatural: true,
        resultKey: 'events.e_omen.r_touch',
        effects: { standing: { workmates: 2 }, flags: { touchedTheMark: true } } },
      { id: 'scrub', labelKey: 'events.e_omen.scrub', hintKey: 'events.e_omen.scrubHint', debunk: true,
        resultKey: 'events.e_omen.r_scrub',
        effects: { standing: { workmates: -7 }, mind: { resolve: 2 }, flags: { scrubbedTheMark: true } } }
    ]
  },

  {
    id: 'e_pamphlet',
    cat: 'crime',
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
    cat: 'factory',
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
    cat: 'soldiers',
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
    cat: 'household',
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
    cat: 'kin',
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

/* ==========================================================================
   THE DECK — Build 3.
   Text lives inline here because this is a data file, not a logic file.
   requires: { minAct, maxAct, location, season, weather, housed, employed,
               kin, flags:{}, notFlags:[], stats:{ key: {min,max} } }
   Nothing draws unless every requirement is met; js/events.js asserts it.
   ========================================================================== */

var EVENTS_DECK = [

/* ------------------------------------------------------------------ STREET */
{
  id: 'st_crossing', cat: 'street', phase: 'EVENING', weight: 8,
  requires: {},
  title: 'THE CROSSING SWEEPER',
  text: 'A boy of about seven works the crossing at Sallow Street with a broom twice his height, clearing the horse muck so that people with clean boots can keep them. He has been there every evening this month. He sweeps in front of you and waits, not quite looking up.',
  choices: [
    { text: 'Give him a farthing', hint: 'A quarter of a penny. It is what the crossing is worth and it is not nothing.',
      effects: { purse: { pennies: -1 }, mind: { resolve: 3 } },
      result: 'He takes it without thanks, which is correct, because thanks would make it charity and this is a transaction.' },
    { text: 'Walk round the crossing', hint: 'Then he has swept for nothing, and knows it.',
      effects: { mind: { resolve: -2 } },
      result: 'He does not say anything. He steps back and starts the same patch again for the next pair of boots.' }
  ]
},
{
  id: 'st_gaslamp', cat: 'street', phase: 'EVENING', weight: 7,
  requires: { season: 'WINTER' },
  title: 'THE LAMPLIGHTER',
  text: 'The lamplighter comes down Cinder Row at four with his pole and his little ladder, and behind him the street turns from black to a colour that is nearly warm. He is sixty and does eleven streets and is paid by the lamp.',
  choices: [
    { text: 'Walk the row behind him', hint: 'Costs nothing. Buys nothing.',
      effects: { mind: { resolve: 4 }, body: { warmth: -3 } },
      result: 'You walk under each one as it comes up. It is the only thing in Grimwick that arrives on time and does what it is for.' },
    { text: 'Get indoors', hint: 'The cold is real and the light is not warmth.',
      effects: { body: { warmth: 2 } },
      result: 'You are in before he reaches the corner. The room is dark, and stays dark, because a candle is tuppence.' }
  ]
},
{
  id: 'st_ballad', cat: 'street', phase: 'EVENING', weight: 7,
  requires: { location: 'market' },
  title: 'THE BALLAD SELLER',
  text: 'A woman is singing a broadside on the corner of the square — a murder ballad, the one about the girl at the lock gates, printed on a sheet the size of your hand for a halfpenny. She sings it badly and the crowd is four deep.',
  choices: [
    { text: 'Buy the sheet', hint: 'A halfpenny. Something to look at that is not a docket.',
      effects: { purse: { pennies: -1 }, mind: { resolve: 4 }, flags: { hasBallad: true } },
      result: 'The print is so bad that two of the verses are the same verse. You keep it anyway, folded, in the lining.' },
    { text: 'Listen and pay nothing', hint: 'Everybody else is.',
      effects: { mind: { resolve: 2 } },
      result: 'You get the tune for free, which is most of what a ballad is, and it stays in your head for three days.' },
    { text: 'Push through and get on', hint: 'The evening is two hours long.',
      effects: {},
      result: 'You are past the crowd and up the street before the girl in the song has even reached the lock gates.' }
  ]
},
{
  id: 'st_dogfight', cat: 'street', phase: 'EVENING', weight: 6,
  requires: { minAct: 1 },
  title: 'BEHIND THE EWE',
  text: 'There is a ring of men in the yard behind the Black Ewe and money going over their heads faster than the talk. Two terriers and a barrel of rats. It is illegal and it has been going on every Friday for eleven years.',
  choices: [
    { text: 'Put a penny on the small dog', hint: 'The small one is quicker. It is usually about being quicker.',
      requires: { stats: { pennies: { min: 2 } } },
      effects: { purse: { pennies: -2 }, standing: { workmates: 3 } },
      result: 'The small dog does forty rats in six minutes and you are up threepence, and the noise of forty men is worth more than the threepence.',
      effectsAlt: { purse: { pennies: 3 } } },
    { text: 'Watch from the wall', hint: 'Free, and you can say you did not bet.',
      effects: { mind: { resolve: -2 }, standing: { workmates: 1 } },
      result: 'It is quick and it is loud and afterwards a man sweeps the barrel out into the gutter and everybody goes back inside.' },
    { text: 'Keep walking', hint: 'You have seen it before.',
      effects: {},
      result: 'The noise follows you up the row and stops, all at once, the way it does when the barrel is empty.' }
  ]
},
{
  id: 'st_funeral', cat: 'street', phase: 'EVENING', weight: 6,
  requires: {},
  title: 'A FUNERAL, GOING PAST',
  text: 'A parish funeral comes up the row: a deal box on a handcart, two women, and no minister, because the minister is at a paying one at three. Everyone on the pavement stops and takes their hat off. It costs nothing and nobody has ever not done it.',
  choices: [
    { text: 'Stop and take your hat off', hint: 'It is what is done.',
      effects: { mind: { resolve: 2 }, standing: { workmates: 2 } },
      result: 'You stand with your hat in your hands and the cart goes past and one of the women nods at you, and that is the whole ceremony.' },
    { text: 'Ask who it was', hint: 'You will know the name. That is the trouble with asking.',
      effects: { mind: { resolve: -5 }, flags: { knewTheDead: true } },
      result: 'It is the puddler from the far shed, the one taken at the gate about the folded paper. Nobody says what he died of and everybody knows.' }
  ]
},
{
  id: 'st_fire', cat: 'street', phase: 'EVENING', weight: 5,
  requires: { minAct: 1 },
  title: 'FIRE IN THE ROW',
  text: 'A chimney has gone up three doors down and the whole row is out in the street with buckets. The insurance company brigade arrives, checks the plate on the wall, finds no plate, and stands there in their brass helmets watching it burn because that house is not a subscriber.',
  choices: [
    { text: 'Get in the bucket line', hint: 'It is somebody’s room. Next week it is yours.',
      effects: { body: { fatigue: 12, health: -2 }, standing: { workmates: 8 }, mind: { resolve: 5 } },
      result: 'Forty people, two buckets each, and it is out by nine. The brigade watches the entire thing and then drives away.' },
    { text: 'Fetch what you can from your own room first', hint: 'Fire goes along a row.',
      effects: { mind: { resolve: -3 }, flags: { savedOwnFirst: true } },
      result: 'You have your things in the street before anybody else has thought of it, and the neighbours notice that you did.' }
  ]
},
{
  id: 'st_photograph', cat: 'street', phase: 'EVENING', weight: 5,
  requires: { minAct: 2, location: 'market' },
  title: 'A GENTLEMAN WITH A CAMERA',
  text: 'A man from a London society has set a camera up in the square to make a record of the labouring poor. He wants a group at the pump and is offering a penny each to stand still for ninety seconds. He calls it a study.',
  choices: [
    { text: 'Stand for the penny', hint: 'Ninety seconds. A penny is a penny.',
      effects: { purse: { pennies: 1 }, mind: { resolve: -3 } },
      result: 'You hold still for a minute and a half looking at a brass tube. He says thank you, my good fellow, and the plate goes in a case, and you never see it and neither does anybody you know.' },
    { text: 'Refuse to be a study', hint: 'It costs you a penny to keep your face.',
      effects: { mind: { resolve: 5 } },
      result: 'He is astonished and then irritated, and writes something in a notebook that you would very much like to read.' }
  ]
},
{
  id: 'st_watercart', cat: 'street', phase: 'EVENING', weight: 6,
  requires: {},
  title: 'THE STANDPIPE',
  text: 'The standpipe at the end of the row runs for one hour a day and the queue starts forty minutes before it. Everything anyone in these houses drinks, washes in, or boils comes out of that hour.',
  choices: [
    { text: 'Queue for your water', hint: 'An hour of the evening for two buckets.',
      effects: { body: { fatigue: 4 }, standing: { workmates: 3 }, flags: { hasWater: true } },
      result: 'Forty minutes in a queue of women who know everything about everybody, and two buckets, and it is the cleanest water you will have this week.' },
    { text: 'Send the bucket down with a neighbour’s girl', hint: 'A halfpenny, and she does four households at once.',
      requires: { stats: { pennies: { min: 1 } } },
      effects: { purse: { pennies: -1 }, flags: { hasWater: true } },
      result: 'She does four households in one trip and takes a halfpenny from each, which makes her the best-paid person on the row per hour, and she is eleven.' }
  ]
},
{
  id: 'st_evictionOther', cat: 'street', phase: 'EVENING', weight: 6,
  requires: {},
  title: 'NUMBER ELEVEN, TURNED OUT',
  text: 'The bailiffs are at number eleven. A bed, two chairs, a press and a birdcage are on the cobbles in the rain, and a woman is sitting on the bed as though it were still indoors, because there is nowhere else to sit.',
  choices: [
    { text: 'Help carry her things under the arch', hint: 'It does not solve it. It keeps the bed dry.',
      effects: { body: { fatigue: 6 }, standing: { workmates: 6 }, mind: { resolve: 3 } },
      result: 'Four of you get it under the arch by the bakehouse. It will be gone by morning and everybody helping knows it, and it is done anyway.' },
    { text: 'Ask her what she will do', hint: 'There is only one answer and you both know what it is.',
      effects: { mind: { resolve: -6 }, flags: { sawEviction: true } },
      result: 'She says the workhouse takes the children into a separate ward. She says it flatly, the way you say a thing you have already decided.' },
    { text: 'Go up your own stair', hint: 'It is raining and it is not your bed.',
      effects: { mind: { resolve: -3 } },
      result: 'You are up the stair in four steps. You hear the birdcage go over, later, and nobody picks it up.' }
  ]
},
{
  id: 'st_lostChild', cat: 'street', phase: 'EVENING', weight: 5,
  requires: {},
  title: 'A CHILD ON THE CORNER',
  text: 'There is a child of about three standing at the mouth of the alley, not crying, which is worse than crying. Nobody in the street is looking at her. Everyone in the street has seen her.',
  choices: [
    { text: 'Take her to the chapel', hint: 'The Almoner keeps a book for it. The book is how they end up in the ward.',
      effects: { mind: { resolve: -4 }, standing: { workmates: 2 }, flags: { tookChildToChapel: true } },
      result: 'The Almoner writes her down as found, and asks you three questions about yourself, and none about her.' },
    { text: 'Ask up and down the row', hint: 'Somebody will know the face.',
      effects: { body: { fatigue: 6 }, mind: { resolve: 4 } },
      result: 'Fourth door: a girl of fourteen who has been minding four of them and lost count. She takes her back without a word to you.' },
    { text: 'Leave her. Someone will come.', hint: 'Someone usually does.',
      effects: { mind: { resolve: -6 } },
      result: 'She is not there when you come back past. That is all you will ever know about it.' }
  ]
},
{
  id: 'st_soupKitchen', cat: 'street', phase: 'EVENING', weight: 6,
  requires: { season: 'WINTER' },
  title: 'THE SOUP AT THE CHAPEL DOOR',
  text: 'A subscription kitchen is giving out thin soup at St. Aulder’s side door, one ladle each, on condition of a ticket signed by a ratepayer. The queue is round the corner and half of it will not have a ticket.',
  choices: [
    { text: 'Queue with your ticket', hint: 'You have a ticket because you have an employer.',
      requires: { employed: true },
      effects: { body: { hunger: -18 }, mind: { resolve: -4 } },
      result: 'It is hot and it is mostly water and it is the best thing that happens to you all week, which is the part you resent.' },
    { text: 'Give your place to the man behind', hint: 'He has no ticket and has been there longer.',
      effects: { mind: { resolve: 6 }, standing: { workmates: 4 } },
      result: 'He takes it, and does not look at you, and eats it in the doorway standing up in about nine seconds.' }
  ]
},
{
  id: 'st_recruitParade', cat: 'street', phase: 'EVENING', weight: 6,
  requires: { minAct: 2 },
  title: 'THE BAND COMES THROUGH',
  text: 'A recruiting party comes down Sallow Street behind a drum, with ribbons in the men’s hats and a serjeant walking backwards to keep the step. Half the children in Grimwick are following it. Some of them are fourteen and will be taken.',
  choices: [
    { text: 'Watch it go past', hint: 'It is a good band. That is the entire method.',
      effects: { mind: { resolve: -2 }, standing: { garrison: 2 } },
      result: 'It is a good band. You catch yourself walking in step for half a street and stop, and the stopping is deliberate and it costs something.' },
    { text: 'Pull a boy you know out of the line', hint: 'He is fifteen and has told them seventeen.',
      effects: { mind: { resolve: 6 }, standing: { workmates: 5, garrison: -6 }, flags: { savedTheBoy: true } },
      result: 'You get him by the collar out of the crowd and he swears at you the whole way home. His mother says nothing at all to you, which is how you know.' }
  ]
},

/* ----------------------------------------------------------------- FACTORY */
{
  id: 'fa_beltSnap', cat: 'factory', phase: 'SHIFT', weight: 8,
  requires: { employed: true },
  title: 'THE MAIN BELT',
  text: 'The main drive belt goes at the shaft end with a noise like a shot, and the whole floor stops. Six shillings of leather, and eleven minutes of two hundred hands standing still, and the charge for it has to come from somewhere.',
  choices: [
    { text: 'Help splice it', hint: 'Quicker back to work. The Works notices who moved.',
      effects: { body: { fatigue: 8 }, standing: { foreman: 5, workmates: -2 } },
      result: 'Four of you have it laced and back on the pulleys in nine minutes and Coom writes the nine minutes down, not the four of you.' },
    { text: 'Stand still with everybody else', hint: 'Eleven minutes of not working, which is a rest.',
      effects: { body: { fatigue: -6 }, standing: { workmates: 3, foreman: -2 } },
      result: 'Eleven minutes of standing in a stopped shed, which is the longest anybody has been still since Sunday.' }
  ]
},
{
  id: 'fa_inspection', cat: 'factory', phase: 'SHIFT', weight: 7,
  requires: { employed: true },
  title: 'ORDNANCE INSPECTION',
  text: 'A government viewer is going along the benches with a gauge, condemning anything that fails it. Everything he condemns is charged to the hand that made it, at cost, which is not the price the Works sells it at.',
  choices: [
    { text: 'Put your doubtful ones at the bottom', hint: 'He takes from the top of the tray.',
      effects: { standing: { foreman: 0 }, mind: { resolve: -3 }, flags: { hidFromViewer: true } },
      result: 'He takes eleven off the top, passes them all, and moves down the bench. The doubtful ones go in the crate under the good ones.' },
    { text: 'Give him the tray as it stands', hint: 'Honest, and it will cost you.',
      effects: { fine: 'spoiled', mind: { resolve: 4 }, standing: { foreman: 2 } },
      result: 'He condemns six. Six is written against your number before he has reached the next bench.' }
  ]
},
{
  id: 'fa_womenTurnedOff', cat: 'factory', phase: 'SHIFT', weight: 7,
  requires: { employed: true, minAct: 1 },
  title: 'THE CAP BENCH IS CUT',
  text: 'The Works puts eleven women off the cap bench and replaces them with a new filling machine that does the work of six and breaks twice a week. The eleven are given their books at the gate at seven in the morning.',
  choices: [
    { text: 'Say nothing. It is not your bench.', hint: 'It is not your bench this month.',
      effects: { mind: { resolve: -5 }, standing: { workmates: -3 } },
      result: 'The machine is running by Thursday and short by Friday, and by the next Monday four of them are back at two thirds of the old rate.' },
    { text: 'Stand with them at the gate', hint: 'Coom is at the window and Coom counts.',
      effects: { standing: { workmates: 10, foreman: -10, notice: 5 }, mind: { resolve: 7 } },
      result: 'Nineteen of you stand there for a quarter of an hour. Nothing changes. Every one of the eleven remembers who stood.' }
  ]
},
{
  id: 'fa_ratchetTalk', cat: 'factory', phase: 'SHIFT', weight: 7,
  requires: { employed: true, minAct: 1 },
  title: 'BARROW DOES THE ARITHMETIC',
  text: 'Barrow puts his rag down and works it out on the bench in chalk: the count in ’48, the count now, and the wage in ’48 and the wage now. The four numbers sit there in front of the whole bench, and nobody says anything for a while.',
  choices: [
    { text: 'Copy the figures down', hint: 'You would have to be able to write them.',
      requires: { stats: { literacy: { min: 1 } } },
      effects: { mind: { resolve: 6 }, flags: { hasTheFigures: true }, standing: { notice: 3 } },
      result: 'You copy the four numbers onto the inside of a cap-paper and put it in your boot. They are not an argument yet. They are the start of one.' },
    { text: 'Rub it off before Coom comes round', hint: 'For Barrow, not for you.',
      effects: { standing: { workmates: 6, foreman: 1 }, mind: { resolve: -2 } },
      result: 'You take it off with your sleeve about forty seconds before Coom turns the corner, and Barrow does not thank you, and does not need to.' }
  ]
},
{
  id: 'fa_boyAsleep', cat: 'factory', phase: 'SHIFT', weight: 6,
  requires: { employed: true },
  title: 'THE BOY AT THE END OF THE BENCH',
  text: 'Wickes is asleep standing up at the end of the bench with his hand six inches from the ram. He has been on since five and he is seventeen and he did a night shift on Tuesday because he was offered one.',
  choices: [
    { text: 'Wake him with your elbow', hint: 'Quiet. Nobody else needs to see it.',
      effects: { standing: { workmates: 5 }, mind: { resolve: 3 } },
      result: 'He comes round hard, gets his hand back, and does not look at you for the rest of the shift, which is how they say thank you here.' },
    { text: 'Call the overlooker', hint: 'It is a fine for sleeping. It is also him keeping his hand.',
      effects: { standing: { workmates: -8, foreman: 4 }, mind: { resolve: -4 } },
      result: 'Coom fines him fourpence for sleeping at the machine and the bench decides, correctly, that you cost him the fourpence.' }
  ]
},
{
  id: 'fa_gasFailure', cat: 'factory', phase: 'SHIFT', weight: 6,
  requires: { employed: true, season: 'WINTER' },
  title: 'THE GAS GOES DOWN',
  text: 'The gas pressure drops at half past four and the whole shed goes to a brown half-dark. The count does not drop with it. Two benches down, somebody puts a blade through their thumb inside ten minutes.',
  choices: [
    { text: 'Work by feel', hint: 'You know the motion. Your hands know it better than your eyes.',
      effects: { body: { fatigue: 8, tremor: 1 }, mind: { resolve: -2 } },
      result: 'You make your count in the dark by knowing where everything is. It is the most frightening competent thing you have ever done.' },
    { text: 'Stop until they fix it', hint: 'You will not be paid for the stopping.',
      effects: { standing: { foreman: -6, workmates: 4 }, mind: { resolve: 3 } },
      result: 'You stand with your hands flat on the bench until the gas comes up at ten past five, and it is docked, and it was correct.' }
  ]
},
{
  id: 'fa_newMachine', cat: 'factory', phase: 'SHIFT', weight: 6,
  requires: { employed: true, minAct: 2 },
  title: 'THE RIFLING MACHINE ARRIVES',
  text: 'Three crates come up the hill on a low-loader and take eleven men to unload. Inside is a rifling bench from a works in the capital, and with it a printed sheet of new rates, and the new rates are for a job nobody in Grimwick has done yet.',
  choices: [
    { text: 'Volunteer to learn it', hint: 'New work, and the rates on new work are always good, at first.',
      effects: { standing: { foreman: 8, workmates: -4 }, flags: { learningRifling: true }, mind: { resolve: 3 } },
      result: 'Coom writes your number down for the training. Barrow watches him do it and says nothing at all, which is a whole sentence.' },
    { text: 'Wait and see what the rate settles at', hint: 'It always settles downward.',
      effects: { standing: { workmates: 4 }, flags: { waitedOnRifling: true } },
      result: 'You keep your bench. Within a month the rifling rate is cut by a fifth, and the men who volunteered are the ones who take the cut.' }
  ]
},

/* --------------------------------------------------------------- HOUSEHOLD */
{
  id: 'ho_northWall', cat: 'household', phase: 'NIGHT', weight: 8,
  requires: { housed: true },
  title: 'THE NORTH WALL',
  text: 'The black bloom on the north wall has come out again the size of two hands, and the plaster behind it is soft. It comes back every winter and it is in the fabric of the building, not the room.',
  choices: [
    { text: 'Scrub it back with lime', hint: 'It will be back by the thaw. It always is.',
      requires: { stats: { pennies: { min: 2 } } },
      effects: { purse: { pennies: -2 }, body: { fatigue: 6 }, kin: { health: 4 } },
      result: 'Lime and water and an hour on a chair. It goes white, and stays white, until about February.' },
    { text: 'Move the bed away from it', hint: 'The room is nine feet across.',
      effects: { kin: { health: 2, mood: -2 } },
      result: 'You get the bed eighteen inches further off the wall. Eighteen inches is what is available.' },
    { text: 'Leave it', hint: 'It is the landlord’s wall, in theory.',
      effects: { kin: { health: -4 }, body: { health: -1 } },
      result: 'It spreads about a hand’s width a week and the room smells of it by Sunday.' }
  ]
},
{
  id: 'ho_bugs', cat: 'household', phase: 'NIGHT', weight: 7,
  requires: { housed: true },
  title: 'THE BEDSTEAD',
  text: 'The bedstead is alive again. Everybody in the row has them, everybody in the row burns sulphur for them twice a year, and the things come back through the wall from next door within a month.',
  choices: [
    { text: 'Burn sulphur and shut the room up', hint: 'Costs a night’s coal and a night out of the room.',
      requires: { stats: { coal: { min: 1 } } },
      effects: { coal: -1, body: { warmth: -8 }, kin: { mood: 4 }, flags: { burnedSulphur: true } },
      result: 'Two hours of yellow smoke and a night sitting on the stair with your coat over you both. It works for about a month.' },
    { text: 'Take the bedstead apart and scald the joints', hint: 'Water, and an hour, and no coal.',
      effects: { body: { fatigue: 10 }, kin: { mood: 2 } },
      result: 'You scald every joint with the kettle twice. It is most of them. Most of them is not all of them.' },
    { text: 'Sleep on the floor and let them have the bed', hint: 'They will find the floor.',
      effects: { body: { fatigue: 6, warmth: -4 } },
      result: 'They find the floor.' }
  ]
},
{
  id: 'ho_roofLeak', cat: 'household', phase: 'NIGHT', weight: 6,
  requires: { housed: true, weather: 'rain' },
  title: 'THE STAIR AND THE RAIN',
  text: 'The rain gets in over the stairhead and comes down the inside of the wall as far as your door. Four households use the stair. The stair belongs to none of them, and to Mr. Kell, who is aware of it.',
  choices: [
    { text: 'Go round the four doors and split the cost of a slate', hint: 'Fourpence each, if all four pay.',
      requires: { stats: { pennies: { min: 4 } } },
      effects: { purse: { pennies: -4 }, standing: { workmates: 6 }, flags: { fixedTheStair: true } },
      result: 'Three of the four pay. The fourth has nothing, and everyone knows she has nothing, and it is done anyway.' },
    { text: 'Write to Kell about the stair', hint: 'You would have to be able to write.',
      requires: { stats: { literacy: { min: 2 } } },
      effects: { mind: { resolve: 2 }, flags: { wroteToKell: true } },
      result: 'He does not answer. In six weeks a man comes and looks at the stair, and does not go up onto the roof, and leaves.' },
    { text: 'Put a pail under it', hint: 'It is a pail. It works as well as a pail works.',
      effects: { body: { warmth: -3 } },
      result: 'The pail fills twice in the night and the sound of it is the sound of the whole winter.' }
  ]
},
{
  id: 'ho_coalShort', cat: 'household', phase: 'NIGHT', weight: 7,
  requires: { housed: true, stats: { coal: { max: 0 } } },
  title: 'NO FIRE',
  text: 'There is nothing in the grate and nothing in the sack, and it is the kind of cold that gets into the bedding and stays there. The bakehouse two doors down has a wall that is warm on the outside until about midnight.',
  choices: [
    { text: 'Sit against the bakehouse wall', hint: 'Outside, but warm. Until midnight.',
      effects: { body: { warmth: 10, fatigue: 6 }, kin: { mood: -2 } },
      result: 'Four of you from the row sit against the same warm bricks in the dark and nobody makes anything of it.' },
    { text: 'Break up the chair', hint: 'It burns for two hours. Then there is no chair.',
      effects: { body: { warmth: 16 }, mind: { resolve: -6 }, flags: { burnedTheChair: true } },
      result: 'It gives two hours of real heat and a smell of varnish, and in the morning there is one chair in the room instead of two.' },
    { text: 'Go to bed in everything you own', hint: 'Free. Not enough.',
      effects: { body: { warmth: -4 }, kin: { health: -3 } },
      result: 'Coats, the shawl, the rag rug off the floor. You lie there listening to each other not sleeping.' }
  ]
},
{
  id: 'ho_neighbourBorrow', cat: 'household', phase: 'EVENING', weight: 7,
  requires: { housed: true },
  title: 'MOTHER ASHEN AT THE DOOR',
  text: 'Mother Ashen from the floor below wants the loan of a shovel of coal until Friday. She has asked before. She has also paid it back before, twice, and not the third time.',
  choices: [
    { text: 'Give her the shovelful', hint: 'A night of your fire.',
      requires: { stats: { coal: { min: 1 } } },
      effects: { coal: -1, standing: { workmates: 5 }, mind: { resolve: 4 }, flags: { lentCoal: true } },
      result: 'She takes it in a bucket with a cloth over it so the row does not see, and says Friday, and means it.' },
    { text: 'Say you have none', hint: 'She will hear your grate going through the floor.',
      effects: { mind: { resolve: -5 }, standing: { workmates: -4 } },
      result: 'She says of course, love, and goes back down, and your fire is audible through her ceiling all evening.' }
  ]
},
{
  id: 'ho_kellRepairs', cat: 'household', phase: 'EVENING', weight: 6,
  requires: { housed: true, minAct: 2 },
  title: 'KELL PUTS THE RENT UP',
  text: 'A printed notice on the stairhead: rents in the Row rise by fourpence a week from the quarter day, on account of improvements. The only improvement anybody can identify is the notice, which is printed.',
  choices: [
    { text: 'Pay it and say nothing', hint: 'Everybody will pay it.',
      effects: { mind: { resolve: -4 }, flags: { rentRaised: true } },
      result: 'Everybody pays it. Fourpence a week is a loaf and a half, which is exactly how it will be measured from now on.' },
    { text: 'Get the four households to refuse together', hint: 'Four households, one landlord, and he only needs to evict one of you.',
      effects: { standing: { workmates: 8 }, mind: { resolve: 6 }, flags: { rentStrike: true, rentRaised: true } },
      result: 'Three of the four agree on the stairhead. By Thursday one has paid privately, and by Friday everyone knows which one.' }
  ]
},
{
  id: 'ho_pawnTicketExpires', cat: 'household', phase: 'EVENING', weight: 6,
  requires: { flags: { hasTicketOut: true } },
  title: 'A TICKET RUNNING OUT',
  text: 'Ostrek sends a boy up with a note: the ticket on your things has three days left on it, after which what is in his window belongs to whoever wants it. He is not threatening. He is telling you the date.',
  choices: [
    { text: 'Go and renew the ticket', hint: 'A penny buys another month.',
      requires: { stats: { pennies: { min: 1 } } },
      effects: { purse: { pennies: -1 }, mind: { resolve: 2 } },
      result: 'A penny, a new date written in, and the thing stays under his counter for another month, being yours in the technical sense.' },
    { text: 'Let it go', hint: 'It is a watch. It is not bread.',
      effects: { mind: { resolve: -8 }, flags: { lostTheTicket: true } },
      result: 'It is in the window by Saturday with a card on it. You take the other side of the street for about a fortnight.' }
  ]
},
{
  id: 'ho_sundayDinner', cat: 'household', phase: 'EVENING', weight: 5,
  requires: { housed: true, kin: true, stats: { pennies: { min: 8 } } },
  title: 'A PIECE OF MEAT',
  text: 'There is a shoulder end at the butcher’s for sevenpence that would do the two of you for two days and be the first meat in the room this month. Sevenpence is also two days of coal.',
  choices: [
    { text: 'Buy the meat', hint: 'Two days of eating like people.',
      effects: { purse: { pennies: -7 }, larder: 3, kin: { mood: 14, health: 4 }, mind: { resolve: 6 } },
      result: 'It is boiled with two onions and it is the best hour of the month and it is gone by Tuesday.' },
    { text: 'Buy the coal instead', hint: 'Warmth outlasts the meal.',
      effects: { purse: { pennies: -7 }, coal: 2, kin: { mood: -4 } },
      result: 'You are warm and you have not eaten meat since the spring, and both of those things are correct decisions.' }
  ]
},
{
  id: 'ho_letterHome', cat: 'household', phase: 'EVENING', weight: 5,
  requires: {},
  title: 'A LETTER FROM THE COUNTRY',
  text: 'A letter comes up from the parish your mother was born in: an uncle is dead, there is a matter of eleven shillings and a bed, and it wants an answer in writing within the month.',
  choices: [
    { text: 'Read it yourself', hint: 'You would need your letters.',
      requires: { stats: { literacy: { min: 2 } } },
      effects: { mind: { resolve: 3 }, purse: { pennies: 22 }, flags: { gotTheLegacy: true } },
      result: 'Eleven shillings, less the carriage and the writing of the reply. It is the largest sum you have held at one time in three years.' },
    { text: 'Pay the scribe on the square to read it', hint: 'Tuppence, and he reads it aloud in the open.',
      requires: { stats: { pennies: { min: 2 } } },
      effects: { purse: { pennies: 20 }, mind: { resolve: -2 }, flags: { gotTheLegacy: true } },
      result: 'He reads it out in the square in a carrying voice and four people learn about your uncle before you do. The money is real.' },
    { text: 'Put it behind the clock', hint: 'It will still be there next month.',
      effects: { mind: { resolve: -3 }, flags: { ignoredTheLetter: true } },
      result: 'It stays behind the clock. In six weeks a second letter comes saying the matter is closed.' }
  ]
},

/* --------------------------------------------------------------------- KIN */
{
  id: 'ki_wantsToWork', cat: 'kin', phase: 'EVENING', weight: 8,
  requires: { kin: true, flags: { kinKind: 'sister' }, notFlags: ['putKinToWork'] },
  title: 'SHE ASKS AGAIN',
  text: 'Tamsin has heard that Anne Corrie at the cap bench brings home six pence a shift, and she has done the arithmetic on the table with a piece of chalk, and she is right about the arithmetic.',
  choices: [
    { text: 'Tell her no again', hint: 'You cannot tell her the real reason without frightening her.',
      effects: { kin: { mood: -8 }, mind: { resolve: -3 } },
      result: 'She says it is not fair, and she is nine, and it is not fair, and you cannot explain the shake to a person who has never had steady hands taken away.' },
    { text: 'Tell her exactly what the fulminate does', hint: 'She is nine. She will believe you and it will not stop her asking.',
      effects: { kin: { mood: -4, health: 0 }, mind: { resolve: 4 }, flags: { toldHerTheTruth: true } },
      result: 'You tell her about the hands. She listens properly, the way children do, and then asks whether six pence a shift would pay the rent, and it would.' }
  ]
},
{
  id: 'ki_fatherOffers', cat: 'kin', phase: 'EVENING', weight: 8,
  requires: { kin: true, flags: { kinKind: 'father' } },
  title: 'HE WANTS TO GO BACK ON',
  text: 'Ost has got his boots on and is sitting by the door with them on. He says they will take him back on the casting floor for half rate and half the hours, and he could do half the hours, and he could not do half the hours.',
  choices: [
    { text: 'Take his boots off him', hint: 'He will not forgive it quickly.',
      effects: { kin: { mood: -12, health: 5 }, mind: { resolve: -4 } },
      result: 'He lets you. That is the worst part of it: he lets you, without much of an argument, because he already knew.' },
    { text: 'Let him try one shift', hint: 'It is his trade. It was his trade before it was yours.',
      effects: { kin: { health: -14, mood: 10 }, purse: { pennies: 13 }, flags: { fatherWorked: true } },
      result: 'He does the shift. He is paid thirteen pence and he cannot get up the stairs afterwards, and he is happier than you have seen him since the spring.' }
  ]
},
{
  id: 'ki_childFever', cat: 'kin', phase: 'NIGHT', weight: 9,
  requires: { kin: true, stats: { kinHealth: { max: 55 } } },
  title: 'HOT IN THE NIGHT',
  text: 'They are hot to the touch and the heat is the dry kind. In the Rows this is either three days of nothing or it is the thing that empties the room, and there is no way to tell which from the doorway at two in the morning.',
  choices: [
    { text: 'Sit up with them', hint: 'It does nothing medical. It is not nothing.',
      effects: { body: { fatigue: 18 }, kin: { mood: 10, health: 2 }, mind: { resolve: 2 } },
      result: 'You sit up with a candle-end and the fever breaks a little towards five, or seems to, which is what people mean by it breaking.' },
    { text: 'Give them the physic', hint: 'Uses the bottle.',
      requires: { stats: { physic: { min: 1 } } },
      effects: { physic: -1, kin: { health: 16, mood: 6 } },
      result: 'It goes down and stays down and by morning they are only tired, which here counts as recovery.' },
    { text: 'Fetch Mrs. Bligh out of her bed', hint: 'She will come. She will also be owed.',
      effects: { purse: { debt: 26 }, kin: { health: 22 }, flags: { blighCame: true } },
      result: 'She comes in her nightdress with a coat over it, does four competent things in eleven minutes, and does not mention the money until the morning.' }
  ]
},
{
  id: 'ki_schooling', cat: 'kin', phase: 'EVENING', weight: 6,
  requires: { kin: true, housed: true },
  title: 'THE RAGGED SCHOOL',
  text: 'There is a free school in the chapel undercroft on three evenings a week: letters, numbers, and a great deal about obedience. It is free, and the hours it takes are hours that could be spent earning or minding.',
  choices: [
    { text: 'Send them', hint: 'Letters are the only thing in Grimwick that cannot be pawned.',
      effects: { kin: { mood: 6 }, mind: { resolve: 3 }, flags: { kinAtSchool: true } },
      result: 'They come back able to write four words and full of a story about Jonah, and the four words are the part that matters.' },
    { text: 'Keep them at the table winding paper', hint: 'It is threepence a week from home.',
      effects: { purse: { pennies: 3 }, kin: { mood: -6 } },
      result: 'Threepence a week and a set of hands that will be good at winding paper, which is a trade that will not exist in fifteen years.' }
  ]
},
{
  id: 'ki_kinSteals', cat: 'kin', phase: 'EVENING', weight: 6,
  requires: { kin: true, stats: { larder: { max: 0 } } },
  title: 'SOMETHING IN THE POCKET',
  text: 'There is half a loaf in the room that you did not buy and nobody will say where it came from, and the shop at the corner of Sallow Street has a boy who watches the door.',
  choices: [
    { text: 'Take it back to the shop', hint: 'Honest, and it costs you the half loaf and possibly the child.',
      effects: { larder: -1, mind: { resolve: 4 }, standing: { notice: 3 }, flags: { returnedTheLoaf: true } },
      result: 'The shopman takes it, and looks at the child for a long moment, and decides not to send for anybody. He could have.' },
    { text: 'Eat it and say nothing', hint: 'It is half a loaf and you have nothing.',
      effects: { body: { hunger: -12 }, mind: { resolve: -5 }, flags: { ateTheStolenLoaf: true } },
      result: 'It is eaten in about four minutes between the two of you and nobody says anything and everybody understands the arrangement now.' },
    { text: 'Make them take it back themselves', hint: 'A lesson, delivered at the worst possible time.',
      effects: { kin: { mood: -10 }, mind: { resolve: 2 }, standing: { notice: 2 } },
      result: 'They go, and come back without it, and do not speak for the rest of the evening, and they will remember this one.' }
  ]
},
{
  id: 'ki_kinFriend', cat: 'kin', phase: 'EVENING', weight: 5,
  requires: { kin: true },
  title: 'SOMEBODY FROM THE BENCH',
  text: 'Lisbet Vaunce from the cap bench has walked home with Tamsin two evenings running and is on the stair now with a paper of broken biscuit to share out. She is fourteen and has been on the bench since she was ten.',
  choices: [
    { text: 'Ask her in', hint: 'There is not much in the room, but there is a room.',
      effects: { kin: { mood: 10 }, standing: { workmates: 4 }, mind: { resolve: 4 }, larder: 1 },
      result: 'She eats the biscuit, tells four jokes, and shows Tamsin the way she holds a scoop so it does not tire the thumb. Her own hands are not steady.' },
    { text: 'Send her home', hint: 'Where she has been going since she was ten.',
      effects: { kin: { mood: -6 }, standing: { workmates: -2 } },
      result: 'She goes without any fuss at all, which is the thing that stays with you.' }
  ]
},
{
  id: 'ki_kinDoubts', cat: 'kin', phase: 'NIGHT', weight: 6,
  requires: { kin: true, stats: { resolve: { max: 30 } } },
  title: 'THEY ASK WHAT HAPPENS NEXT',
  text: 'From the other side of the room, in the dark, they ask what happens if you cannot work. They have clearly been holding the question for some days, and have chosen the dark to ask it in so as not to have to see your face.',
  choices: [
    { text: 'Tell them the truth', hint: 'The workhouse separates the wards. They are old enough to be told.',
      effects: { kin: { mood: -10 }, mind: { resolve: 6 }, flags: { toldThemTheTruth: true } },
      result: 'You tell them about the wards and the separation and the rest of it. They are quiet for a while, and then say, all right. All right.' },
    { text: 'Tell them it will not happen', hint: 'A lie, told kindly, which they will remember either way.',
      effects: { kin: { mood: 6 }, mind: { resolve: -6 } },
      result: 'They accept it because they want to. You lie there afterwards doing the arithmetic that proves it was a lie.' }
  ]
},
/* ---------------------------------------------------------------- SOLDIERS */
{
  id: 'so_billeting', cat: 'soldiers', phase: 'EVENING', weight: 7,
  requires: { housed: true, minAct: 1 },
  title: 'BILLETING',
  text: 'Two men of the line are billeted along Cinder Row under the Act, and the row is expected to feed them at fourpence a day, which is not what feeding a soldier costs. One of them is nineteen and from a county you have never been to.',
  choices: [
    { text: 'Take one of them in', hint: 'Fourpence a day and a man in your room.',
      effects: { purse: { pennies: 4 }, larder: -1, kin: { mood: -4 }, standing: { garrison: 6 } },
      result: 'He sleeps by the door, eats what you eat, apologises for the amount of it, and tells you the regiment is for the eastern frontier in the spring.' },
    { text: 'Say the room will not hold another', hint: 'True, and refusing is noted.',
      effects: { standing: { garrison: -8, notice: 4 }, mind: { resolve: 2 } },
      result: 'The corporal writes the number of the house down. The two of them go to number eleven, which has less room than you have.' }
  ]
},
{
  id: 'so_deserter', cat: 'soldiers', phase: 'EVENING', weight: 6,
  requires: { minAct: 2 },
  title: 'A MAN IN THE COAL YARD',
  text: 'There is a man asleep behind the coal heaps in an army shirt with the facings cut off. He is about twenty and has not eaten for two days and there is a standing reward of a crown for a deserter delivered to the post.',
  choices: [
    { text: 'Feed him and say nothing', hint: 'A crown is a crown, and he is twenty.',
      requires: { stats: { larder: { min: 1 } } },
      effects: { larder: -1, mind: { resolve: 8 }, standing: { notice: 6 }, flags: { fedTheDeserter: true } },
      result: 'He eats standing up in about ninety seconds and is gone before dark, north, on the rails, which is the only direction there is.' },
    { text: 'Take the reward to the post', hint: 'A crown. Five shillings. Nine days of bread.',
      effects: { purse: { pennies: 60 }, mind: { resolve: -14 }, standing: { garrison: 10, workmates: -12 }, flags: { soldTheDeserter: true } },
      result: 'They pay it at the counter in silver and the corporal writes your name in the book, and the coal yard is quiet for a long time afterwards.' },
    { text: 'Leave him where he is', hint: 'The patrols come through at eleven.',
      effects: { mind: { resolve: -3 } },
      result: 'The patrols come through at eleven. You hear about it at the bench in the morning from a man who watched it happen.' }
  ]
},
{
  id: 'so_drill', cat: 'soldiers', phase: 'EVENING', weight: 6,
  requires: { location: 'market' },
  title: 'BAYONET DRILL IN THE SQUARE',
  text: 'A company is at bayonet exercise in the market square for the edification of the town: point, guard, thrust, recover, forty men in a line. The blades came off your wheel, or off the wheel next to yours, in the last fortnight.',
  choices: [
    { text: 'Watch the blades', hint: 'You know exactly how they were finished.',
      effects: { mind: { resolve: -4 }, flags: { sawTheDrill: true } },
      result: 'You can see the grind marks from four yards. You could pick out the shed they came from. Somebody in a square somewhere is going to meet that edge.' },
    { text: 'Get on with the evening', hint: 'It is a display and you have two hours.',
      effects: {},
      result: 'The drum keeps time behind you all the way up Sallow Street and then stops mid-bar for the serjeant to correct somebody.' }
  ]
},
{
  id: 'so_slate', cat: 'soldiers', phase: 'EVENING', weight: 6,
  requires: { location: 'ewe' },
  title: 'A SOLDIER’S SLATE',
  text: 'A corporal has run up eleven pence on Moll Tarrow’s slate and the regiment moves on Thursday. Moll cannot go to the garrison about it and everybody in the room knows she cannot.',
  choices: [
    { text: 'Say something to him about it', hint: 'In front of the room. That is the only way it works.',
      effects: { standing: { workmates: 7, garrison: -8 }, mind: { resolve: 5 } },
      result: 'He pays four of the eleven on the spot to end the conversation, which is four more than Moll expected, and he does not forget your face.' },
    { text: 'Let it alone', hint: 'The garrison is the garrison.',
      effects: { mind: { resolve: -3 } },
      result: 'He goes on Thursday owing eleven pence. Moll rubs it off the slate herself on the Friday and says nothing about it, ever.' }
  ]
},
{
  id: 'so_proclamation', cat: 'soldiers', phase: 'EVENING', weight: 7,
  requires: { minAct: 2 },
  title: 'A PROCLAMATION ON THE BOARD',
  text: 'A new proclamation is nailed up by the pump: assemblies of more than twelve persons in the borough of Grimwick require the written permission of the magistrate, on account of the disturbances elsewhere. There have been no disturbances here.',
  choices: [
    { text: 'Read it out for the men who cannot', hint: 'Somebody will have to. It might as well be accurate.',
      requires: { stats: { literacy: { min: 2 } } },
      effects: { standing: { workmates: 6, notice: 8 }, mind: { resolve: 3 }, flags: { readTheProclamation: true } },
      result: 'You read it twice through because they ask you to. A man at the back writes down which parts they made you repeat.' },
    { text: 'Read it to yourself and move off', hint: 'Knowing it is enough.',
      requires: { stats: { literacy: { min: 1 } } },
      effects: { standing: { notice: 1 }, flags: { readTheProclamation: true } },
      result: 'Twelve persons. You count the men round the board without meaning to. Fourteen.' },
    { text: 'Wait to be told what it says', hint: 'It will reach you third-hand and half wrong.',
      effects: { mind: { resolve: -2 } },
      result: 'By the time it reaches the Ewe it has become a ban on meetings of any kind and a curfew that does not exist.' }
  ]
},
{
  id: 'so_invalid', cat: 'soldiers', phase: 'EVENING', weight: 6,
  requires: { minAct: 1 },
  title: 'AN INVALID OF THE COLONIAL SERVICE',
  text: 'A man is sitting on the chapel steps with his discharge papers spread on his knee so that people can see they are genuine. He has one hand and a pension of ninepence a week and has been sitting there since eleven in the morning.',
  choices: [
    { text: 'Give him a penny', hint: 'You have very little and he has ninepence a week.',
      requires: { stats: { pennies: { min: 1 } } },
      effects: { purse: { pennies: -1 }, mind: { resolve: 4 } },
      result: 'He thanks you by regiment and number, which is how he thanks everybody, because it is the only formal thing he has left.' },
    { text: 'Ask him what it was like', hint: 'He will tell you. That is the risk.',
      effects: { mind: { resolve: -6 }, flags: { heardTheFrontier: true } },
      result: 'He describes a square at a river crossing for four minutes in an entirely level voice, and you go home with it, and it stays.' }
  ]
},

/* ------------------------------------------------------------------- CRIME */
{
  id: 'cr_fence', cat: 'crime', phase: 'EVENING', weight: 7,
  requires: { employed: true, minAct: 1 },
  title: 'A MAN WHO BUYS CAPS',
  text: 'A man in the snug of the Ewe will pay threepence a hundred for percussion caps and does not ask how they leave the Works. The gate search is done by two men who search perhaps one in six.',
  choices: [
    { text: 'Take out a hundred', hint: 'Threepence. One in six are searched.',
      effects: { purse: { pennies: 3 }, standing: { notice: 10 }, flags: { stealingCaps: true }, mind: { resolve: -3 } },
      result: 'A hundred caps is a handful. You are not searched. It is the not being searched that makes the second time easy.' },
    { text: 'Tell him you are not interested', hint: 'He will ask somebody else within the hour.',
      effects: { mind: { resolve: 2 } },
      result: 'He shrugs and moves along the bench and is talking to somebody else before you have finished your drink.' }
  ]
},
{
  id: 'cr_coining', cat: 'crime', phase: 'EVENING', weight: 6,
  requires: {},
  title: 'A BAD SHILLING',
  text: 'You are given a shilling in your change that rings wrong on the counter. Pewter, washed, and rather well made. Passing it on is a felony. Not passing it on costs you a shilling, which is a day.',
  choices: [
    { text: 'Pass it at the market in the dark', hint: 'It is a felony and it is a day’s wage.',
      effects: { purse: { pennies: 12 }, standing: { notice: 8 }, mind: { resolve: -5 }, flags: { passedBadCoin: true } },
      result: 'The woman at the barrow takes it without looking and gives you eleven pence change, and it is somebody else’s problem now, and you know exactly whose sort of somebody.' },
    { text: 'Take it back to where you got it', hint: 'They will say you brought it in.',
      effects: { mind: { resolve: 3 }, standing: { workmates: -2 } },
      result: 'He says he never gave it you and he is possibly telling the truth, and you leave with the shilling still in your hand.' },
    { text: 'Put it in the fire', hint: 'A day’s wage, gone, and nobody defrauded.',
      effects: { mind: { resolve: 6 }, flags: { burnedTheCoin: true } },
      result: 'It goes soft at the edges and sits in the ash looking like exactly what it is. It is the most expensive thing you have ever done on principle.' }
  ]
},
{
  id: 'cr_burglary', cat: 'crime', phase: 'EVENING', weight: 6,
  requires: { housed: true },
  title: 'NUMBER SIX HAS BEEN DONE',
  text: 'Somebody has been into number six through the back and taken a clock, a coat and four shillings in a jar. The row has decided within about an hour that it was one of the casuals from the lodging house on Kell Street.',
  choices: [
    { text: 'Say it was probably somebody from the row', hint: 'It was probably somebody from the row.',
      effects: { standing: { workmates: -8 }, mind: { resolve: 4 }, flags: { saidTheTruth: true } },
      result: 'Nobody wants it said. It is much better for everybody if it was a stranger, and by evening it is settled that it was.' },
    { text: 'Go along with the lodging house', hint: 'It is easy and it is what everybody has decided.',
      effects: { standing: { workmates: 4 }, mind: { resolve: -4 } },
      result: 'Two men from the row go and turn the lodging house over on Thursday, and find nothing, and that is not taken as evidence of anything.' }
  ]
},
{
  id: 'cr_garrotting', cat: 'crime', phase: 'EVENING', weight: 5,
  requires: { minAct: 2 },
  title: 'IN THE ALLEY OFF SALLOW STREET',
  text: 'Two men have a third against the wall in the alley and one of them has an arm across his throat from behind. It is being done quietly and quickly by people who have done it before.',
  choices: [
    { text: 'Shout and run at them', hint: 'Two of them, and you.',
      effects: { body: { health: -8, fatigue: 10 }, mind: { resolve: 8 }, standing: { workmates: 4 } },
      result: 'They go over the wall. The man on the ground has a bitten tongue and no watch, and thanks you, and you have a knuckle you cannot bend.' },
    { text: 'Fetch the garrison patrol', hint: 'Two streets. Two minutes. It is a long two minutes.',
      effects: { standing: { garrison: 5, notice: 4 }, mind: { resolve: -2 } },
      result: 'By the time you come back with them there is nobody in the alley at all, and the patrol takes your name for the report.' },
    { text: 'Turn round and take the long way', hint: 'You have two hands and a sister.',
      effects: { mind: { resolve: -7 } },
      result: 'You take the long way. It adds four minutes. You think about the four minutes for a week.' }
  ]
},
{
  id: 'cr_receiving', cat: 'crime', phase: 'EVENING', weight: 6,
  requires: { housed: true, flags: { hasStash: true } },
  title: 'SOMETHING TO KEEP FOR A WEEK',
  text: 'A man you know at the bench asks whether you have a loose floorboard, and whether it would hold a parcel for a week, and offers a shilling, and does not say what is in the parcel.',
  choices: [
    { text: 'Take the shilling and the parcel', hint: 'A shilling is a shilling and it is a week.',
      effects: { purse: { pennies: 12 }, standing: { notice: 12 }, flags: { holdingParcel: true } },
      result: 'It is the size of a brick and heavier than a brick and it goes under the third board, and you think about it every night for six nights.' },
    { text: 'Say no', hint: 'He will remember which, at the bench.',
      effects: { standing: { workmates: -4 }, mind: { resolve: 2 } },
      result: 'He says fair enough and does not mention it again, and is noticeably careful with you afterwards.' }
  ]
},
{
  id: 'cr_informerApproach', cat: 'crime', phase: 'EVENING', weight: 6,
  requires: { minAct: 2, notFlags: ['informer'] },
  title: 'COOM, ON THE STAIRS, ALONE',
  text: 'Coom catches you on the works stair when there is nobody else on it, which is not an accident. He says the Works pays a retainer of two shillings a week for a man who tells him who is at the meetings, and he says it as though he were reading out a rate.',
  choices: [
    { text: 'Ask him what the retainer buys', hint: 'Listening is not agreeing. It is also not refusing.',
      effects: { flags: { informantOffered: true }, standing: { foreman: 4 }, mind: { resolve: -4 } },
      result: 'Names, dates, and the sense to write nothing down. He says the last man who did it is now a shed overlooker in the north, and he might even be telling the truth.' },
    { text: 'Say no on the stair', hint: 'To his face, on the stair, with nobody to see it.',
      effects: { standing: { foreman: -12 }, mind: { resolve: 8 }, flags: { refusedCoom: true } },
      result: 'He takes it perfectly well, which is the frightening part, and he is on the stair again the following Tuesday with somebody else.' }
  ]
},

/* ---------------------------------------------------------------- SICKNESS */
{
  id: 'si_cholera', cat: 'sickness', phase: 'NIGHT', weight: 7,
  requires: { minAct: 1, season: 'LATE SUMMER' },
  title: 'IT IS IN THE COURTS',
  text: 'There is cholera in the courts behind Kell Street: eleven in four days. The parish is burning straw at the ends of the alleys against the miasma, which does nothing, because it is in the standpipe, which nobody in authority will accept until 1854.',
  choices: [
    { text: 'Boil everything you drink', hint: 'It costs coal. You do not know why it works. It works.',
      requires: { stats: { coal: { min: 1 } } },
      effects: { coal: -1, body: { health: 3 }, kin: { health: 3 }, flags: { boiledWater: true } },
      result: 'Your grandmother did it and could not have told you why either. Nobody in this room takes it. That is either the boiling or it is luck, and you will never know which.' },
    { text: 'Burn straw at the door like everybody else', hint: 'It is what the parish says to do.',
      effects: { body: { health: -2 }, kin: { health: -2 } },
      result: 'The whole street smells of wet straw smoke for a week and the courts bury nine more.' },
    { text: 'Keep away from the courts and hope', hint: 'The standpipe is shared with the courts.',
      effects: { body: { health: -4 }, kin: { health: -4 } },
      result: 'You keep away from the courts. The water does not.' }
  ]
},
{
  id: 'si_feverVan', cat: 'sickness', phase: 'EVENING', weight: 6,
  requires: { housed: true },
  title: 'THE FEVER VAN',
  text: 'The fever van is at the end of the row for the woman at number nine. It is a closed cart painted grey and everybody watches it from behind their own window and nobody stands in the street while it is there.',
  choices: [
    { text: 'Help them carry her down', hint: 'Nobody else will. It is typhus and everybody knows it.',
      effects: { body: { health: -6 }, standing: { workmates: 9 }, mind: { resolve: 6 }, flags: { helpedTheVan: true } },
      result: 'She weighs nothing at all. The driver thanks you by touching his hat and does not shake your hand, and is right not to.' },
    { text: 'Watch from the window like everybody else', hint: 'It is typhus.',
      effects: { mind: { resolve: -4 } },
      result: 'It takes four minutes. Her sister does the carrying at the top of the stairs on her own.' }
  ]
},
{
  id: 'si_ownCough', cat: 'sickness', phase: 'NIGHT', weight: 8,
  requires: { stats: { dust: { min: 35 } } },
  title: 'THE COUGH, AT TWO IN THE MORNING',
  text: 'You wake at two coughing and cannot stop for a quarter of an hour, and what comes up at the end of it is grey. This has been happening one night a week, then two, and you have been counting without deciding to count.',
  choices: [
    { text: 'Take a spoonful of laudanum', hint: 'It stops the cough. It stops several things.',
      requires: { stats: { laudanum: { min: 1 } } },
      effects: { laudanum: -1, body: { health: 2, fatigue: -10 }, mind: { resolve: 3 }, flags: { usedLaudanum: true } },
      result: 'It stops inside two minutes and you sleep like a stone until the bell, and you understand, quite clearly, how people end up on it.' },
    { text: 'Sit up until it passes', hint: 'It passes. It always has so far.',
      effects: { body: { fatigue: 12, health: -1 } },
      result: 'A quarter of an hour on the edge of the bed with a hand on the wall, and then it stops, and then you lie down and wait for the bell.' }
  ]
},
{
  id: 'si_vaccination', cat: 'sickness', phase: 'EVENING', weight: 6,
  requires: { location: 'chapel', kin: true },
  title: 'VACCINATION DAY',
  text: 'The parish surgeon is in the vestry doing free vaccination against the smallpox, arm to arm, from a child vaccinated eight days ago. It is free, it is compulsory in law since ’53 in some parishes and not in this one, and half the row will not have it done.',
  choices: [
    { text: 'Have them done', hint: 'A sore arm for a week. Smallpox takes one in three.',
      effects: { kin: { health: -3, mood: -4 }, flags: { kinVaccinated: true }, mind: { resolve: 4 } },
      result: 'Four scratches on the upper arm and a week of a hot elbow, and the surgeon writes it in the book, and that is a thing that cannot now happen to them.' },
    { text: 'Keep them out of it', hint: 'Arm to arm from another child. People have views.',
      effects: { kin: { mood: 2 }, flags: { refusedVaccination: true } },
      result: 'Mother Ashen is loud in her approval, on the grounds that the matter belongs to Providence, which has an uneven record in this row.' }
  ]
},
{
  id: 'si_badMeat', cat: 'sickness', phase: 'NIGHT', weight: 6,
  requires: { stats: { larder: { min: 1 } } },
  title: 'THE MEAT WAS OFF',
  text: 'Whatever was in the larder was further along than it looked in the dark of the room, and by midnight it has both of you up. There is one privy in the yard for four households.',
  choices: [
    { text: 'Ride it out', hint: 'A bad night. Probably only a bad night.',
      effects: { body: { health: -5, hunger: 14, fatigue: 10 }, kin: { health: -5 } },
      result: 'It is over by about six and you go in to the shift grey and empty and stand at the bench for twelve hours.' },
    { text: 'Send for something from the apothecary', hint: 'Chalk and opium. It works.',
      requires: { stats: { pennies: { min: 4 } } },
      effects: { purse: { pennies: -4 }, body: { health: -1, hunger: 8 }, kin: { health: -1 } },
      result: 'Chalk mixture with a little opium in it, which is exactly what it needs, and it settles in an hour.' }
  ]
},
{
  id: 'si_leadColic', cat: 'sickness', phase: 'NIGHT', weight: 7,
  requires: { stats: { lead: { min: 35 } } },
  title: 'THE COLIC',
  text: 'It starts in the middle of the night as a cramp under the ribs that folds you in half, and it is not food. There is a blue line along your gums that has been there since the spring and that you have been declining to look at.',
  choices: [
    { text: 'Sweat it out and go in tomorrow', hint: 'Missing the shift is a warning.',
      effects: { body: { health: -6, fatigue: 14 }, mind: { resolve: -4 } },
      result: 'Four hours of it and then it lets go all at once. You go in. Teague on the next bench has had it eleven times and tells you so, as though it were reassuring.' },
    { text: 'Take laudanum for it', hint: 'It is the only thing that touches it.',
      requires: { stats: { laudanum: { min: 1 } } },
      effects: { laudanum: -1, body: { health: -2, fatigue: -6 }, flags: { usedLaudanum: true } },
      result: 'The pain goes somewhere else in the room and you watch it from a distance until morning.' },
    { text: 'Ask for a move off the casting floor', hint: 'It means asking Coom for something.',
      effects: { mind: { resolve: 3 }, standing: { foreman: -4 }, flags: { askedOffCasting: true } },
      result: 'Coom says the casting floor is the best paid floor in the Works and that men queue for it, and both of those things are true.' }
  ]
},

/* --------------------------------------------------------------- FOLKLORE
   Every one of these has a mundane explanation and the game always shows it.
   The omen is coincidence, fraud, or grief. There is nothing else here. */
{
  id: 'fo_ghostShed', cat: 'folklore', phase: 'SHIFT', weight: 7,
  requires: { employed: true },
  title: 'THE GIRL IN THE NIGHT SHED',
  text: 'The night hands say a girl walks the stamping shop between two and three — the one taken by the press in ’44 — and that you hear her before the ram. Wickes will not go in there alone now and has started taking the long way round through the yard.',
  choices: [
    { text: 'Go and look, at two', hint: 'It is a shed. Sheds make noise.', debunk: true,
      effects: { body: { fatigue: 8 }, mind: { resolve: 5 }, flags: { lookedForTheGhost: true } },
      result: 'It is a broken pane in the clerestory and the draught off the cut coming across it, making a sound in the dark like a young voice. You wedge it with a rag and the shed is silent, and the story goes on being told anyway.' },
    { text: 'Let them have the story', hint: 'It keeps boys out of a shed at two in the morning.', supernatural: true,
      effects: { standing: { workmates: 3 }, mind: { resolve: -2 } },
      result: 'It keeps them out of the shed at night, which is the only useful thing anybody has ever done about that press, and it was not done on purpose.' }
  ]
},
{
  id: 'fo_medals', cat: 'folklore', phase: 'EVENING', weight: 7,
  requires: { location: 'market' },
  title: 'SAINT AULDER’S MEDALS',
  text: 'A man at the square is selling tin medals of St. Aulder blessed at the shrine, a penny each, guaranteed against accident at machinery. He has sold forty this evening. Half the cap bench is wearing one.',
  choices: [
    { text: 'Buy one', hint: 'A penny. It does nothing. Everybody knows it does nothing.', supernatural: true,
      requires: { stats: { pennies: { min: 1 } } },
      effects: { purse: { pennies: -1 }, mind: { resolve: 4 }, flags: { boughtMedal: true } },
      result: 'You wear it inside your shirt where it cannot catch on anything. It does not do a single thing, and it is a penny, and you feel better, and both of those are facts.' },
    { text: 'Look at the stamping on the back', hint: 'You have stamped a great deal of tin.', debunk: true,
      effects: { mind: { resolve: -3 }, standing: { workmates: -2 }, flags: { sawTheFraud: true } },
      result: 'They are struck from the same die as the works blanks, off scrap, by somebody with a fly press. You know the die marks. You say so, quietly, to one person, and it makes no difference at all to anybody.' }
  ]
},
{
  id: 'fo_cunningWoman', cat: 'folklore', phase: 'EVENING', weight: 6,
  requires: { kin: true, stats: { kinHealth: { max: 60 } } },
  title: 'THE WOMAN AT THE END OF THE COURT',
  text: 'There is a woman in the court behind Kell Street who cures children for sixpence with a charm written on paper, folded small, sewn into the shift and worn until it falls apart. Four women on the row swear by her.',
  choices: [
    { text: 'Pay the sixpence', hint: 'Sixpence, and a paper, and nothing else in it.', supernatural: true,
      requires: { stats: { pennies: { min: 6 } } },
      effects: { purse: { pennies: -6 }, kin: { mood: 8 }, mind: { resolve: -2 }, flags: { boughtTheCharm: true } },
      result: 'The paper has letters on it that are not any language. The child is better in nine days, which is how long that fever runs whatever is sewn into anybody’s shift.' },
    { text: 'Spend the sixpence on food instead', hint: 'Sixpence of bread against a folded paper.', debunk: true,
      effects: { purse: { pennies: -6 }, larder: 2, kin: { health: 5 } },
      result: 'Two loaves and a pennyworth of dripping. The child is better in nine days, which is how long that fever runs.' }
  ]
},
{
  id: 'fo_corpseCandle', cat: 'folklore', phase: 'NIGHT', weight: 6,
  requires: { minAct: 1 },
  title: 'A LIGHT OVER THE CUT',
  text: 'There is a light moving along the cut at about one in the morning, low down and yellow, and the row says it is a corpse candle and that it goes to the house where the next one will be. Mother Ashen has been up telling people whose house it stopped at.',
  choices: [
    { text: 'Follow it', hint: 'It is a light. Lights are carried by somebody.', debunk: true,
      effects: { body: { fatigue: 8, warmth: -6 }, mind: { resolve: 4 }, flags: { followedTheLight: true, knowsSerrel: true } },
      result: 'It is Serrel and two others bringing something up off a goods van with a dark lantern, and they see you see them, and nothing is said by anybody, then or ever.' },
    { text: 'Stay in and let it pass', hint: 'It is one in the morning and the bell is at five.', supernatural: true,
      effects: { mind: { resolve: -2 } },
      result: 'In the morning the row has agreed it stopped over number nine. Number nine has had a woman dying in it for three weeks and everybody knows that too.' }
  ]
},
{
  id: 'fo_unluckyBench', cat: 'folklore', phase: 'SHIFT', weight: 7,
  requires: { employed: true },
  title: 'THE BENCH THEY WILL NOT WORK',
  text: 'Three men have been hurt at the fourth press in eighteen months and nobody will take it now. The floor says the bench is unlucky. Coom says the floor is superstitious and puts whoever is newest on it.',
  choices: [
    { text: 'Put a straight edge on the guide', hint: 'You have your own tools and eleven minutes.', debunk: true,
      effects: { body: { fatigue: 6 }, standing: { workmates: 10, foreman: -4 }, mind: { resolve: 7 }, flags: { foundTheFault: true } },
      result: 'The guide is out by a sixteenth and has been since somebody dropped it. Three men and eighteen months, and it is a bent piece of iron, and it takes an afternoon to shim.' },
    { text: 'Chalk the saint’s mark over it like the others', hint: 'It does nothing and it is what is done.', supernatural: true,
      effects: { standing: { workmates: 4 }, mind: { resolve: -3 }, flags: { chalkedTheMark: true } },
      result: 'You chalk it. It is a bent guide. It will be a bent guide next month, and the mark will be over it, and there will be a fourth man.' }
  ]
},
{
  id: 'fo_cryingWall', cat: 'folklore', phase: 'NIGHT', weight: 6,
  requires: { housed: true },
  title: 'CRYING IN THE WALL',
  text: 'There is a child crying somewhere in the fabric of the building, at about the same hour, three nights running. The row has settled on the story of the family that was in these rooms before the last one, and the baby that did not come out of them.',
  choices: [
    { text: 'Go along the landing and knock on doors', hint: 'Somebody has a wall in common with that noise.', debunk: true,
      effects: { body: { fatigue: 6 }, mind: { resolve: 5 }, standing: { workmates: 4 }, flags: { foundTheChild: true } },
      result: 'It is the back room of the house behind, whose wall is your wall. A girl of about two, alone, while her mother does the night shift at the mill. She is there every night. There is no ghost and no help either.' },
    { text: 'Put the pillow over your head', hint: 'The bell is at five.', supernatural: true,
      effects: { mind: { resolve: -5 } },
      result: 'It stops around four. In the morning the story on the stairhead has gained a detail about a light under the door, and by Sunday there are two lights.' }
  ]
}
];
