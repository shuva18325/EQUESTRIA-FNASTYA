/* ==========================================================================
   GRIMWICK WORKS — data/strings.js
   Every word the player can read lives in this file. Logic files hold keys,
   never English. Look text up with T('path.to.key') from js/strings.js.
   ========================================================================== */

var STR = {

  app: {
    title: 'GRIMWICK WORKS',
    subtitle: 'Grimwick, in the Iron Concord — Year 312',
    dateline: '1851 by the old reckoning, which no one is paid to use',
    newGame: 'Take the work',
    resume: 'Continue',
    loadGame: 'Load a slot',
    saveGame: 'Save',
    menu: 'Menu',
    close: 'Close',
    back: 'Back',
    replayTutorial: 'Replay the first days',
    skipTutorial: 'Skip',
    tutorialNext: 'Next',
    tutorialDone: 'Understood',
    openingCard: [
      'Your father is three years in the ground and the parish took the cost out of your name.',
      'The Grimwick Small Arms Works pays a floor hand twenty-six pence a day, less charges.',
      'Your sister Tamsin is nine. She winds cartridge paper at the kitchen table and coughs at night.',
      'There is no one coming. There is only the shift.'
    ],
    openingButton: 'Report to the gate'
  },

  ui: {
    outcome: 'WHAT CAME OF IT',
    continueBtn: 'Go on',
    dismiss: 'Leave it'
  },

  hud: {
    day: 'Day',
    act: 'Act',
    of: 'of',
    season: 'Season',
    weather: 'Weather',
    phase: 'Phase',
    objectives: 'STANDING ORDERS',
    goal: 'What is wanted of you',
    deadline: 'Next reckoning',
    purse: 'Purse',
    debt: 'Owed to the store',
    body: 'BODY',
    mind: 'MIND',
    standing: 'STANDING',
    house: 'HOUSE',
    kin: 'Kin',
    log: 'THE DAY SO FAR',
    apLeft: 'Hours of evening left',
    noneLeft: 'The evening is gone.',
    rentDue: 'Rent due day {d}',
    rentAmount: 'Rent',
    coal: 'Coal',
    larder: 'Larder',
    daysLeft: '{n}d of fuel',
    mealsLeft: '{n} meals',
    literacy: 'Letters',
    injury: 'Injury',
    injuryNone: 'none, for now',
    kinStatus: {
      WELL: 'well enough',
      AILING: 'ailing',
      FEVERED: 'fevered',
      DEAD: 'buried'
    },
    nothing: 'nothing'
  },

  phases: {
    SHIFT: 'SHIFT',
    EVENING: 'EVENING',
    NIGHT: 'NIGHT',
    shiftBlurb: 'The gate bell went at five. You are inside it.',
    eveningBlurb: 'The gas is lit. You have two hours before your body takes them back.',
    nightBlurb: 'The room is cold in the way rooms are cold when no one has money.'
  },

  seasons: {
    'LATE SUMMER': 'LATE SUMMER',
    'AUTUMN': 'AUTUMN',
    'WINTER': 'WINTER',
    'THAW': 'THAW'
  },

  weather: {
    soot: 'Soot-fall, no wind',
    rain: 'Cold rain, all day',
    fog: 'Yellow fog off the cut',
    frost: 'Black frost',
    sleet: 'Sleet, sideways',
    still: 'Still and close',
    wind: 'Wind off the moor'
  },

  stats: {
    health: 'Health',
    fatigue: 'Fatigue',
    hunger: 'Hunger',
    warmth: 'Warmth',
    dust: 'Dust',
    tremor: 'Tremor',
    resolve: 'Resolve',
    literacy: 'Letters',
    foreman: 'Foreman',
    workmates: 'Workmates',
    garrison: 'Garrison',
    notice: 'Notice',
    permanent: 'does not mend'
  },

  literacy: ['Cannot read', 'Reads shop signs', 'Reads a printed notice', 'Reads a book, slowly'],

  bands: {
    health: ['dying', 'bad', 'poorly', 'holding', 'sound'],
    fatigue: ['fresh', 'used', 'worn', 'staggering', 'finished'],
    hunger: ['fed', 'peckish', 'hungry', 'gnawing', 'starving'],
    warmth: ['frozen', 'chilled', 'cool', 'warm enough', 'warm'],
    dust: ['clear', 'a catch in it', 'a rattle', 'a bad chest', 'stone lung'],
    tremor: ['steady', 'a flicker', 'a shake', 'a bad shake', 'the palsy'],
    resolve: ['broken', 'low', 'bearing it', 'set', 'hard'],
    standing: ['hated', 'disliked', 'nothing to them', 'tolerated', 'well thought of'],
    notice: ['unknown', 'noted', 'watched', 'listed', 'wanted']
  },

  shift: {
    heading: 'THE FLOOR',
    stations: {
      CAPPING: {
        name: 'Cap filling',
        line: 'Fulminate of mercury, measured by hand into copper cups. The girls who do this for ten years cannot hold a cup of tea by twenty-five.'
      },
      CASTING: {
        name: 'Ball casting',
        line: 'Lead comes off the ladle in a bright rope. The fumes are sweetish. Nobody mentions it.'
      },
      STAMPING: {
        name: 'Helmet stamping',
        line: 'The press comes down whether or not your hand has finished its business under it.'
      },
      GRINDING: {
        name: 'Bayonet grinding',
        line: 'The wheel throws a fan of sparks and a fog of stone. You breathe the wheel. Slowly, the wheel is inside you.'
      }
    },
    work: 'Work the shift',
    workHint: 'Twelve hours. Twenty-six pence gross, less charges.',
    abstain: 'Stay abed',
    abstainHint: 'No wage. The charges are taken anyway. The foreman writes your name down.',
    already: 'The shift is over. The gate is shut behind you.',
    workedFor: 'Worked {h} hours at {station}.',
    abstained: 'You did not go in. The bell went without you.',
    foremanNotes: 'Hollick makes a mark in the book beside your name.',
    offRoll: 'You are off the roll. The gate opens at five for other men now. There is a hiring crowd at the timber yard and it is never shorter than eleven.',
    gateWait: 'Stand at the gate for a day\u2019s hiring',
    gateWaitHint: 'Casual work, if the foreman points at you. Most days he does not.',
    leaveGate: 'Out at seven',
    leaveGateHint: 'The bell, the yard, the street, the evening.',
    casualGot: 'A gang boss wants four hands for the coal wharf and you are one of the four. It is paid in coin at the end of it, which is the only good thing about it.',
    casualNone: 'You stand from six until noon. He points at other men. At noon you stop pretending and go home.',
    outcomes: {
      normal: 'The day goes the way days go: no one dies, nothing is finished, the bell rings.',
      good: 'The line runs sweet for once. You make your count before the four o’clock bell and no one says a word about it.',
      bad: 'A belt slips and the whole bench loses an hour. The hour comes out of you, not the Works.',
      hurt: 'Something goes wrong at speed, the way it always does — too fast to see, too slow to stop.'
    }
  },

  town: {
    heading: 'GRIMWICK, AFTER THE BELL',
    market: {
      name: 'Sallow Street Market',
      blurb: 'Barrows under wet canvas. Bread, coal, and things sold by people who need to sell them more than you need to buy them.'
    },
    tenement: {
      name: 'Fourteen Cinder Row',
      blurb: 'Two rooms up a stair that leaks. Tamsin, the stove, the damp on the north wall.'
    },
    tavern: {
      name: 'The Barrel & Bayonet',
      blurb: 'Sawdust, wet wool, and men saying things they will deny on Monday.'
    },
    actions: {
      buyBread: 'Buy bread — {price}',
      buyBreadHint: 'Two meals for the larder.',
      buyCoal: 'Buy coal — {price}',
      buyCoalHint: 'Two nights of fire.',
      buyPhysic: 'Buy physic — {price}',
      buyPhysicHint: 'A brown bottle. It does about half of what it claims.',
      tick: 'Ask the grocer for tick',
      tickHint: 'Bread on credit. The company store owns the ledger and the ledger grows.',
      tendKin: 'Sit with Tamsin',
      tendKinHint: 'An hour of your evening. It is worth more to her than to you.',
      rest: 'Rest in the dark',
      restHint: 'No fire, no talk. It is free and it is something.',
      dressWound: 'Dress the wound',
      dressWoundHint: 'Hot water, a clean rag, and the bottle if there is one. It is what there is.',
      mend: 'Mend your coat',
      mendHint: 'Warmth you do not have to buy.',
      drink: 'Drink — {price}',
      drinkHint: 'Beer, and the noise of other people.',
      listen: 'Listen at the bar',
      listenHint: 'Talk of the Works, the garrison, and what is coming down the line.',
      readNotice: 'Read the posted notice',
      readNoticeHint: 'Print on a board. You would have to be able to read it.',
      endEvening: 'Turn in',
      endEveningHint: 'Bank whatever is left of you and go up the stairs.'
    },
    results: {
      boughtBread: 'Bread and dripping, wrapped in yesterday’s proclamation.',
      boughtCoal: 'A quarter sack. The boy weighs it short and you both know it.',
      boughtPhysic: 'It tastes of liquorice and turpentine.',
      tookTick: 'The grocer writes it in the book. The book belongs to the Works.',
      tended: 'She tells you about the paper she wound. You tell her about nothing.',
      tendedBad: 'She is hot to the touch and talks about the ceiling.',
      rested: 'You sit. The room does its slow work of getting colder.',
      dressedPhysic: 'You pour the brown bottle over it and it goes white and then it screams. Tamsin holds the lamp and does not look away, which is more than you manage.',
      dressedRag: 'Hot water and a rag boiled twice. It is not medicine. It is better than the alternative, which is nothing.',
      mended: 'A bad seam, well hidden. It will hold through the frost.',
      drank: 'It is thin, and it helps, and that is the trouble with it.',
      listened: 'Men who know nothing repeat it with confidence. Some of it is true.',
      readNotice: 'You read it twice to be sure of it.',
      cannotRead: 'The letters sit there being letters.'
    }
  },

  night: {
    heading: 'NIGHT',
    bedDown: 'Bed down',
    bedDownHint: 'Eat what there is, burn what there is, sleep.',
    shareChoice: 'There is one meal in the larder and two of you.',
    shareSelf: 'Eat it yourself',
    shareSelfHint: 'You are the one who has to stand at the bench tomorrow.',
    shareKin: 'Give it to Tamsin',
    shareKinHint: 'She is nine and she is smaller than you and she is losing.',
    shareSplit: 'Halve it',
    shareSplitHint: 'Neither of you is fed. Both of you are less hungry.',
    ate: 'You eat standing up, out of the paper.',
    ateNothing: 'There is nothing to eat. You drink water and lie down.',
    burned: 'The last of the coal goes on and gives up its little heat.',
    noCoal: 'No fire. You sleep in your coat and your coat is not enough.',
    slept: 'Sleep comes down like a lid.',
    sleptBadly: 'You surface all night, listening for the bell.',
    rentPaid: 'The rent man comes at eight. He is paid and says nothing.',
    rentMissed: 'The rent man comes at eight. He writes it down and does not go away happy.',
    secondHelping: 'You go back to the paper and finish what is in it, standing up, in the dark, like an animal at a trough. Nobody sees you do it.',
    kinAte: 'You watch her eat it. You tell her you had something at the Works, and she is nine, so she believes you.',
    sharedHalf: 'Half each, which fills neither of you and stops the worst of it for both.',
    youWentWithout: 'You eat it. She watches you do it. Neither of you says anything and that is somehow the whole of it.',
    woundWorse: 'The hand is hot and there is a red line above the wrist that was not there yesterday.',
    coughing: 'You wake at two coughing and cannot stop for a quarter of an hour.',
    kinWorse: 'Tamsin coughs through the wall until the small hours.',
    kinBetter: 'The fever breaks near dawn. She sleeps properly for the first time in days.',
    kinDied: 'She is cold when you go to wake her.'
  },

  docket: {
    works: 'GRIMWICK SMALL ARMS WORKS',
    dept: 'ORDNANCE DIVISION — FLOOR ROLL',
    title: 'WAGE DOCKET',
    hand: 'Hand',
    handValue: 'No. 1140, floor',
    dayLabel: 'Day',
    dateLabel: 'Date',
    hoursLabel: 'Hours worked',
    stationLabel: 'Station',
    gross: 'GROSS WAGE',
    deductions: 'DEDUCTIONS',
    net: 'NET',
    carried: 'Carried to the store book',
    owed: 'BALANCE OWED',
    noDeductions: 'No charges this day.',
    stamp: 'CHECKED',
    press: 'Press on',
    clerkNote: 'Errors to be reported within the day. They are not corrected.',
    lines: {
      lampOil: 'Lamp oil',
      toolHire: 'Tool hire',
      breakages: 'Breakages',
      store: 'Company store',
      burialClub: 'Burial club',
      chapelRate: 'Chapel rate',
      fineLate: 'Fine — late at the gate',
      fineSpoiled: 'Fine — spoiled batch',
      fineTalk: 'Fine — talking on the floor',
      fineAbsent: 'Fine — absent without leave',
      rentAtSource: 'Rent, stopped at source',
      doctorsBook: 'Doctor’s book',
      dustAllowance: 'Wheel allowance'
    },
    bodyNotes: {
      default: 'You go home with the taste of brass in your mouth.',
      injury: 'Your left hand will not open in the morning.',
      dust: 'You cough something out on the stairs and do not look at it.',
      tremor: 'You sign your name and the name comes out an old man’s.',
      fatigue: 'You slept standing for a moment and nobody noticed, which is the worst of it.',
      hunger: 'Your belly has stopped asking for anything.',
      cold: 'You could not feel your feet from the third hour on.',
      sick: 'Something is going round the sheds and it has found you.',
      idle: 'A day not worked still costs. That is the arrangement.',
      broke: 'You count it twice on the stairs. It is the same the second time.'
    }
  },

  events: {
    e_shortMeasure: {
      title: 'THE MEASURE',
      text: 'The fulminate scoop has been changed. It is heavier now, and the count you are held to has not moved. Barrow on the next bench, who has been here nineteen years, catches your eye and looks away.',
      say: 'Say nothing and make the count',
      sayHint: 'Your hands will pay for it.',
      complain: 'Take it to the overlooker',
      complainHint: 'Hollick does not like being told things.',
      slow: 'Work to the old measure',
      slowHint: 'You will be short at the tally.',
      r_say: 'You make the count. Your fingers are numb to the second knuckle by the four o’clock bell.',
      r_complain: 'Hollick listens with his hands behind his back and tells you the scoop is the scoop. The bench hears him say it.',
      r_slow: 'You are twenty short at the tally and it is written down as spoilage.'
    },
    e_gateSearch: {
      title: 'AT THE GATE',
      text: 'Two of the garrison at the gate with their caplocks slung, turning out pockets. A corporal with a list. Ahead of you a puddler is taken aside for the sake of a folded paper he says he cannot read.',
      submit: 'Stand and be turned out',
      submitHint: 'Slow, cold, and nothing to hide.',
      avoid: 'Go round by the cut',
      avoidHint: 'Twenty minutes late at the gate. There is a fine for that.',
      r_submit: 'Hands in your pockets that are not yours. The corporal finds a bent nail and a heel of bread and is disappointed by both.',
      r_avoid: 'You come in by the timber yard with wet boots and Hollick standing at the door with his watch out.'
    },
    e_pressGang: {
      title: 'RECRUITING PARTY',
      text: 'A sergeant of the line has set a table outside the Barrel & Bayonet with a bottle and a bowl of shillings. Colonial service. Three years, they say, which everyone knows to mean five.',
      listen: 'Hear him out',
      listenHint: 'Listening costs nothing yet.',
      walk: 'Walk past',
      walkHint: 'There is nothing in it for you.',
      r_listen: 'He is a good talker and he is not lying about the food, which is the part that does the work.',
      r_walk: 'He does not call after you. He does not have to. He will be there next week.'
    },
    e_boyHand: {
      title: 'THE NEW BOY',
      text: 'A boy of about eleven is put on the press beside you. Nobody explains the press to him. He watches your hands and copies them, half a beat behind, which is exactly the wrong distance.',
      teach: 'Show him properly',
      teachHint: 'It costs you count. It costs him fewer fingers.',
      ignore: 'Keep your count',
      ignoreHint: 'Your tally is your wage.',
      r_teach: 'You lose fourteen off your tally and he still has both hands at the bell.',
      r_ignore: 'He learns by the usual method. By the afternoon he has stopped copying you and started flinching.'
    },
    e_dampPowder: {
      title: 'A BAD BATCH',
      text: 'The fulminate is damp and three caps in ten will not take. The overlooker’s book says the fault is the hand, not the powder, and the book is not interested in the weather.',
      report: 'Report the batch',
      reportHint: 'Honest and expensive.',
      pass: 'Pass them along',
      passHint: 'Somebody in a colonial square will find out first.',
      r_report: 'Hollick writes SPOILED beside your number and the fine is entered before you are back at the bench.',
      r_pass: 'They go into the crates. You think about it on the stairs and then you stop thinking about it.'
    },
    e_pamphlet: {
      title: 'PRINT',
      text: 'Somebody has left a folded sheet under the bench. Cheap print, badly set. There are words on it about the tally and the scoop and the men who own both.',
      read: 'Read it',
      readHint: 'You would have to know your letters.',
      pocket: 'Pocket it',
      pocketHint: 'The garrison turns out pockets at the gate.',
      burn: 'Push it into the stove',
      burnHint: 'Safest. Gone.',
      r_read: 'It says what the bench says, only in sentences, which somehow makes it worse.',
      r_readIlliterate: 'You hold it and the letters hold their peace. Barrow watches you hold it.',
      r_pocket: 'It sits in your coat all day being heavier than paper.',
      r_burn: 'It goes up quickly. Cheap paper always does.'
    },
    e_landlordDun: {
      title: 'THE RENT MAN, EARLY',
      text: 'Mr. Kell has come up the stair a day before he is owed, which he does when he means to be understood. He stands in the doorway so that the door cannot be shut.',
      payNow: 'Pay him now',
      payNowHint: 'Settles the week early.',
      putOff: 'Ask him to come Friday',
      putOffHint: 'He will. With his brother.',
      r_payNow: 'He counts it in the doorway, twice, and writes it in a book he does not show you.',
      r_putOff: 'He looks past you at the room, pricing it, and says Friday in a way that has a fist in it.'
    },
    e_steamGun: {
      title: 'THE PRESTIGE ENGINE',
      text: 'The yard is cleared for two hours so that a steam gun on a lorry can be photographed for a gentleman from the capital. It has burst twice at trials. It is protected by men who have never seen it burst.',
      watch: 'Watch with the rest',
      watchHint: 'Two hours of no work and no wage.',
      grumble: 'Say what everyone is thinking',
      grumbleHint: 'Out loud. Where it can be heard.',
      r_watch: 'It hisses, turns, and does nothing else, and the gentleman is delighted.',
      r_grumble: 'You get a laugh off the bench and a look off the overlooker, and only one of those two is written down.'
    },
    e_sickKin: {
      title: 'THE NORTH WALL',
      text: 'Tamsin has been coughing since the small hours and the damp on the north wall has come out in a black bloom the size of a hand.',
      physic: 'Give her the physic',
      physicHint: 'Uses the bottle.',
      doctor: 'Send for the doctor',
      doctorHint: 'The doctor’s book, and the book has a long memory.',
      wait: 'Wait it out',
      waitHint: 'Most of them pass. Most.',
      r_physic: 'She keeps it down. By morning she is only tired, which here counts as recovery.',
      r_doctor: 'He is in the room four minutes, writes something, and is owed for it until the spring.',
      r_wait: 'You sit up with her because there is nothing else to give.'
    },
    e_omen: {
      title: 'THE SAINT OF THE WHEEL',
      text: 'Somebody has chalked a saint’s mark above the grinding shed door. Old Mother Ashen swears it kept the wheel from bursting in ’47. The wheel that burst in ’47 was in the other shed.',
      touch: 'Touch it going in',
      touchHint: 'It does nothing. Everyone does it.',
      scrub: 'Scrub it off',
      scrubHint: 'The bench will not thank you.',
      r_touch: 'You touch it. The shed is exactly as dangerous as it was.',
      r_scrub: 'You take it off with your sleeve and four men watch you do it and remember.'
    },
    e_wageCut: {
      title: 'A NOTICE ON THE BOARD',
      text: 'A printed sheet has gone up by the timekeeper’s hut. Men are standing in front of it in their own weather, waiting for somebody who can read it to arrive.',
      readIt: 'Read it aloud',
      readItHint: 'You would have to know your letters.',
      askAbout: 'Wait for someone to say what it says',
      askAboutHint: 'You will hear it third-hand and half wrong.',
      r_readIt: 'Lamp oil is up a penny from Monday. You read it out and the men take it out on the messenger, which is you.',
      r_askAbout: 'By the time it reaches you it has become a rumour of a wage cut. It is only lamp oil. It is always only something.'
    }
  },

  endings: {
    death_starve: {
      title: 'STARVATION',
      text: 'It is not dramatic and it is not quick. You get colder than food can fix, and then you get tired, and the tired does not lift. The Works fills your place on the Monday from a queue at the gate that is never shorter than eleven men.',
      epitaph: 'The parish buries you. The burial club, which you paid into for {days} days, disputes the claim.'
    },
    death_cold: {
      title: 'EXPOSURE',
      text: 'The frost gets into the room and then into you. There is a moment near the end where you are warm, and it is a lie, and it is the kindest thing that happens to you all winter.',
      epitaph: 'Fourteen Cinder Row is re-let within the week, at a shilling more.'
    },
    death_injury: {
      title: 'MORTIFICATION OF THE WOUND',
      text: 'The wound goes bad in the ordinary way. The red line goes up from the hand towards the heart and everyone in the room knows what the red line means and nobody says it.',
      epitaph: 'The Works records the cause as carelessness of the hand. The hand is not consulted.'
    },
    death_sick: {
      title: 'THE CHEST',
      text: 'Stone lung, they call it in the grinding shed, and they call it that because they have all seen it. It takes years, or it takes a bad winter on top of the years.',
      epitaph: 'You are forty-one on the register. You are not forty-one.'
    },
    survived_prompt: {
      title: 'THE TENTH DAY',
      text: 'You are alive, in work, and owed for. In Grimwick that is a good week. Act One is not over — the rifled musket is still on its way from the capital, and the Works does not yet know what it will cost the hands to retool for it.',
      epitaph: 'The bell goes at five tomorrow.'
    },
    survived_winter: {
      title: 'THE THAW',
      text: 'Sixty days. The frost comes off the cobbles, the cut runs brown and fast, and the Works takes on forty new hands because forty of the old ones are not coming back. You are not one of the forty. That is the entire achievement and it is a real one.',
      epitaph: 'You are still owed for. You will be owed for in the spring as well.'
    },
    milestone_continue: 'Go on',
    again: 'Begin again',
    summary: 'THE ACCOUNT',
    summaryDays: 'Days survived',
    summaryEarned: 'Earned, gross',
    summaryDeducted: 'Stopped in charges',
    summaryDebt: 'Owed at the end',
    summaryDust: 'Dust in the lung',
    summaryTremor: 'Shake in the hand'
  },

  tutorial: {
    steps: [
      {
        title: 'STANDING ORDERS',
        text: 'This panel is the only thing in Grimwick that tells you the truth about time. Day, act, what is wanted of you, and when it is wanted by. It never goes away.'
      },
      {
        title: 'THE SHIFT',
        text: 'Twelve hours at whichever bench they put you at. You may also stay abed — the charges are taken from you either way, and the foreman keeps a book.'
      },
      {
        title: 'THE EVENING',
        text: 'Two hours. That is all. Bread, coal, an hour beside your sister, or an hour in the Barrel & Bayonet. You cannot have all of it, and choosing is the game.'
      },
      {
        title: 'THE NIGHT',
        text: 'You eat what there is and burn what there is. Hunger, cold, and an untended wound are the three ordinary ways to die here. None of them are sudden.'
      },
      {
        title: 'THE DOCKET',
        text: 'Every night the Works hands you a slip of paper. Gross wage, then every charge, then what is left. Some weeks the charges are larger than the wage. Read it. It is the only honest document in the empire.'
      }
    ],
    skipAll: 'Skip the hand-holding',
    replayed: 'The first days again.'
  },

  goals: {
    act1_survive: 'Work the week out and keep the rent paid.',
    act1_rent: 'Find {amt} for Mr. Kell before the rent day.',
    act1_kin: 'Tamsin is ill. Get physic into her or a doctor up the stair.',
    act1_debt: 'The store book is at {amt} and it grows on Sundays.',
    act1_hungry: 'There is nothing in the larder. Get bread into the house.',
    act1_cold: 'No coal. A frost night in an unfired room takes something off you that does not come back.',
    act1_hurt: 'You are carrying an injury. Untended, wounds here go bad and then they go fatal.',
    act1_sacked: 'You are off the roll. Find work or find another way to eat.',
    act2_retool: 'The Works retools for the rifled musket. Nobody has said what happens to the hands who cannot keep the new count.',
    act3_end: 'What is left of the winter is what is left of you.',
    deadline_rent: 'Rent, day {d} — {amt}',
    deadline_debt: 'Store book compounds, day {d}',
    deadline_act: 'The retooling, day {d}',
    deadline_none: 'Nothing scheduled. That has never once been true.'
  },

  save: {
    heading: 'THE RECORD',
    slot: 'Slot {n}',
    autosave: 'Autosave',
    empty: 'empty',
    savedAt: 'Day {d}, {season}',
    doSave: 'Write',
    doLoad: 'Load',
    doDelete: 'Erase',
    saved: 'Written to slot {n}.',
    loaded: 'Loaded from slot {n}.',
    deleted: 'Slot {n} erased.',
    noSave: 'Nothing written there yet.',
    autoSaved: 'The night is recorded.',
    migrated: 'An older record, brought forward.',
    corrupt: 'That record cannot be read.',
    noStorage: 'This browser will not keep a record between visits. The game will still play; it will simply forget you, which is in keeping.',
    confirmOverwrite: 'Write over slot {n}?',
    confirmLoad: 'Load slot {n}? The current day is lost.',
    yes: 'Do it',
    no: 'Leave it'
  },

  disabled: {
    noPennies: 'You have not the money.',
    noAp: 'The evening is gone.',
    noPhysic: 'You have no physic in the house.',
    noKin: 'There is no one to sit with.',
    notEvening: 'Not now. This is not the evening.',
    shiftDone: 'The shift is worked. The gate is shut.',
    illiterate: 'You cannot read.',
    noCoat: 'Nothing left to mend.',
    noWound: 'Nothing on you is open.',
    alreadyRested: 'You have already sat in the dark this evening.',
    tickCapped: 'The grocer will not put another penny in the book.',
    dead: 'You are dead.',
    noDebt: 'You owe the store nothing.'
  },

  log: {
    dayBegins: '— DAY {d}. {season}. {weather}. —',
    phaseShift: 'The gate bell.',
    phaseEvening: 'Out of the gate at seven.',
    phaseNight: 'Up the stairs at Cinder Row.',
    spent: 'Paid out {amt}.',
    gained: 'Took in {amt}.',
    debtUp: 'The store book grows to {amt}.',
    hurt: 'You are hurt: {what}.',
    healed: 'The {what} has closed over.',
    fined: 'Fined: {what}.',
    noticeUp: 'Somebody with a list has written something down.',
    resolveDown: 'Something in you gives a little.',
    resolveUp: 'You find you are not finished yet.'
  },

  injuries: {
    crushedHand: 'a crushed hand',
    burn: 'a lead burn',
    cutArm: 'a cut to the forearm',
    brokenRib: 'a broken rib',
    lungFever: 'a fever on the chest'
  },

  debug: {
    title: 'DEBUG — not for the player',
    hint: 'Tilde toggles this panel.',
    god: 'God mode',
    jumpDay: 'Jump to day',
    forceEvent: 'Force event',
    fire: 'Fire',
    roundTrip: 'Save round-trip test',
    dumpState: 'Dump S to console',
    kill: 'Set health 0',
    apply: 'Apply',
    filter: 'Filter fields',
    passed: 'ROUND TRIP: identical.',
    failed: 'ROUND TRIP: DIFFERS — see console.'
  }
};
