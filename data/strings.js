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
    dismiss: 'Leave it',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    soundHint: 'The Works, as it sounds from the inside.'
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
    wound: 'The wound',
    infection: 'turning \u2014',
    fever: 'FEVER \u2014',
    scars: 'Carried for good',
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
    lead: 'Lead',
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
    lead: ['clean', 'a taste of it', 'the blue line', 'the colic', 'the palsy of it'],
    skill: ['new to it', 'learning', 'handy', 'good', 'the best on the floor'],
    tremor: ['steady', 'a flicker', 'a shake', 'a bad shake', 'the palsy'],
    resolve: ['broken', 'low', 'bearing it', 'set', 'hard'],
    standing: ['hated', 'disliked', 'nothing to them', 'tolerated', 'well thought of'],
    notice: ['unknown', 'noted', 'watched', 'listed', 'wanted']
  },

  shift: {
    heading: 'THE FLOOR',
    stations: {
      CASTING: {
        name: 'Casting floor',
        short: 'Casting',
        line: 'Lead comes off the ladle in a bright rope. It is the best light in Grimwick and the sweetish smell in the back of the throat is the price of it. Best paid floor in the Works, and there is a reason for that.',
        hazard: 'Scalds. And lead, which does not leave.',
        unit: 'ball',
        units: 'balls'
      },
      CAP_BENCH: {
        name: 'Cap bench',
        short: 'Cap bench',
        line: 'Fulminate of mercury measured by hand into copper cups. Fourteen women and girls down the bench because their hands are smaller and their wage is two thirds of yours. The Works has never pretended otherwise.',
        hazard: 'The shake. And the flash, which takes whoever is nearest.',
        unit: 'cap',
        units: 'caps'
      },
      GRINDING: {
        name: 'Grinding shed',
        short: 'Grinding',
        line: 'Bayonet edges on a sandstone wheel turning at speed. You breathe the wheel. Slowly, over years, the wheel comes to live inside you and there is a name for it and the name is not encouraging.',
        hazard: 'Stone in the lung. And a wheel that bursts.',
        unit: 'blade',
        units: 'blades'
      },
      STAMPING: {
        name: 'Stamping shop',
        short: 'Stamping',
        line: 'Helmet shells and lock plates under a drop press that weighs a ton and a quarter. No skill in it worth the name. The press comes down whether or not your hand has finished its business underneath.',
        hazard: 'The press. It does not know you are there.',
        unit: 'shell',
        units: 'shells'
      }
    },

    dials: {
      heading: 'HOW YOU MEAN TO WORK IT',
      pace: 'Pace',
      care: 'Care',
      guard: 'Guards',
      paceOpts: {
        slow:   { label: 'Slow',   hint: 'Save yourself. The count will show it and so will the docket.' },
        steady: { label: 'Steady', hint: 'The pace a body can hold for twelve hours. Roughly.' },
        driven: { label: 'Driven', hint: 'Everything you have, from the bell to the bell.' }
      },
      careOpts: {
        sloppy:     { label: 'Sloppy',     hint: 'More through your hands. More of it sent back at inspection.' },
        proper:     { label: 'Proper',     hint: 'The way you were shown, by a man who is dead now.' },
        meticulous: { label: 'Meticulous', hint: 'Almost nothing rejected. Almost nothing made.' }
      },
      guardOpts: {
        on:  { label: 'Guards on',  hint: 'The cage, the screen, the stop-bar. Fitted for a reason nobody will tell you.' },
        off: { label: 'Guards off', hint: 'Quicker. Coom prefers it and does not write down that he prefers it.' }
      }
    },

    work: 'Work the shift',
    workHint: 'Twelve hours at the bench, as you have set it.',
    abstain: 'Stay abed',
    abstainHint: 'No wage, no count. The charges are taken anyway and Coom keeps a book.',
    already: 'The shift is over. The gate is shut behind you.',
    workedFor: 'Worked {h} hours at {station}.',
    abstained: 'You did not go in. The bell went without you.',
    foremanNotes: 'Coom makes a mark in the book beside your name.',
    offRoll: 'You are off the roll. The gate opens at five for other men now. There is a hiring crowd at the timber yard and it is never shorter than eleven.',
    gateWait: 'Stand at the gate for a day\u2019s hiring',
    gateWaitHint: 'Casual work, if the gang boss points at you. Most days he does not.',
    leaveGate: 'Out at seven',
    leaveGateHint: 'The bell, the yard, the street, the evening.',
    casualGot: 'A gang boss wants four hands for the coal wharf and you are one of the four. Paid in coin at the end of it, which is the only good thing about it.',
    casualNone: 'You stand from six until noon. He points at other men. At noon you stop pretending and go home.',
    skipBeats: 'Skip to the tally',

    tally: {
      heading: 'THE TALLY',
      made: 'Made',
      rejected: 'Sent back',
      passed: 'Passed',
      credit: 'To the count',
      wage: 'Earned at piece rate',
      dayMoney: 'Day money',
      skill: 'Hand at this bench',
      skillUp: '+{n} to the hand',
      hours: 'Hours',
      quotaAfter: 'Week\u2019s count',
      nothing: 'Nothing. The bench stood idle and the charges did not.',
      done: 'Out at seven'
    },

    quota: {
      heading: 'THE COUNT',
      week: 'Week {n}',
      required: 'Required',
      made: 'Made',
      remaining: 'Still wanted',
      shiftsLeft: '{n} shifts left in the week',
      beaten: 'THE COUNT IS BEATEN',
      beatenText: 'You made {made} against {target}. The Works pays a bonus of {bonus} and sets the new figure at {next}. Nobody announces the second part.',
      missed: 'THE COUNT IS SHORT',
      missedText: 'You made {made} against {target}. That is a fine of {fine} and a warning entered against your number. The figure stands where it is.',
      ratchet: 'Last week {old}   \u2192   this week {next}',
      warning: 'Warning {n} of {max}.',
      dismissal: 'Coom reads it off a card he did not write. You are off the roll from the end of the shift. Your tools are the property of the Works and always were.',
      warningsLabel: 'Warnings'
    },

    transfer: {
      request: 'Ask Coom for a transfer',
      requestHint: 'A different bench, a different way to be worn out.',
      heading: 'ASK FOR A TRANSFER',
      pick: 'Which bench?',
      current: 'Now: {station}, hand {skill} of 100',
      target: 'Asking for: {station}, hand {skill} of 100',
      costLine: 'Your {from} hand does not travel. At the {to} bench you begin at {skill} and you will be poorer for weeks while it comes up.',
      wageLine: 'A steady shift there today: about {wage}, against about {now} where you stand.',
      hazardLine: 'What it takes off you: {hazard}',
      confirm: 'Ask him',
      cancel: 'Leave it',
      granted: 'Coom looks at you for longer than the question needs, and says yes, and writes it down in a way that means he has not forgotten being asked.',
      refused: 'He says the bench is full. The bench is not full.',
      needStanding: 'Coom will not hear it from you. Not at present.',
      alreadyThere: 'You are already at that bench.',
      pending: 'You have asked already today.'
    },

    outcomes: {
      normal: 'The day goes the way days go: no one dies, nothing is finished, the bell rings.',
      good: 'The line runs sweet for once. You make your count before the four o\u2019clock bell and no one says a word about it.',
      bad: 'A belt slips and the whole bench loses an hour. The hour comes out of you, not the Works.',
      hurt: 'Something goes wrong at speed, the way it always does \u2014 too fast to see, too slow to stop.'
    },

    beats: {
      open: {
        CASTING: 'five o\u2019clock. the crucible is already going and the shed is orange.',
        CAP_BENCH: 'five o\u2019clock. fourteen down the bench, the youngest of them nine.',
        GRINDING: 'five o\u2019clock. the wheel comes up to speed with a noise like held breath.',
        STAMPING: 'five o\u2019clock. the press is cold and takes four blows to wake.'
      },
      pace: {
        slow: 'you work at the pace of a man who intends to be alive in ten years.',
        steady: 'you find the pace and sit inside it.',
        driven: 'you go at it. by seven your shirt is through and it is a long way to seven at night.'
      },
      care: {
        sloppy: 'you stop looking at what leaves your hands.',
        proper: 'you work the way you were shown, by a man who is dead now.',
        meticulous: 'you check each one. the bench notices you checking each one.'
      },
      guard: {
        on: 'the stop-bar is down. it costs you a half-second a piece and you pay it.',
        off: 'the guard is folded back against the frame. nobody asked you to. nobody stopped you.'
      },
      CASTING: [
        'the ladle comes up full and the light off it is the best light in Grimwick.',
        'lead goes into the mould and the mould hisses at it.',
        'the fumes are sweetish. everyone knows about the fumes. everyone breathes them.',
        'a bead of sweat falls in and is gone before it is anything.',
        'you tap out the sprue and the ball drops grey and perfect.',
        'Teague has been on this floor eleven years and his hands shake when he lifts his tea.'
      ],
      CAP_BENCH: [
        'the scoop, the cup, the tap. four thousand times, and it is not noon.',
        'Anne Corrie is eleven and faster than you and it is not close.',
        'the fulminate is grey and looks like nothing at all.',
        'somebody down the bench is singing under her breath, and stops.',
        'your thumb goes numb at the second knuckle and stays numb.',
        'Lisbet counts hers out loud so as not to lose the place.'
      ],
      GRINDING: [
        'the blade goes on and the wheel throws a fan of sparks the length of the shed.',
        'the stone dust hangs in the shaft of light. you are standing in the light.',
        'the wheel eats a sixteenth of an inch off the stone and something off you.',
        'you spit and it comes out grey and you do not look at it.',
        'Barrow works with a rag over his mouth. Barrow is fifty-one and looks seventy.',
        'the edge comes up bright. it will be in a crate by Friday and in a man by spring.'
      ],
      STAMPING: [
        'the ram comes down. the shell comes out. your hand is elsewhere, and must be.',
        'the shop shakes on the third blow and the dust comes off the roof beams.',
        'lock plates, then shells, then lock plates. no skill in it worth the name.',
        'Wickes is seventeen and has stopped flinching, which is the wrong lesson.',
        'the brass rings when it drops in the bin. it is the only clean sound in here.',
        'you count the strokes without meaning to and lose the count at four hundred.'
      ],
      common: [
        'Coom walks the line with his hands behind his back and says nothing to anyone.',
        'the four o\u2019clock bell. six hours gone, six to go.',
        'somebody\u2019s child brings in the dinner cans and is sent out again.',
        'the gas goes up at half past four and the shed turns yellow.',
        'a soldier crosses the yard with a caplock slung and does not look in.',
        'the belt slips on the main shaft and everything stops for eleven minutes.'
      ],
      nearMiss: {
        CASTING: 'the ladle catches the lip of the mould. hot lead goes past your wrist and onto the flags. you look at the flags for a while.',
        CAP_BENCH: 'a cup goes over. grey powder on the bench. everyone within four feet stops breathing until it is swept.',
        GRINDING: 'the blade snatches and goes out of your hand across the shed. it stands in the door frame.',
        STAMPING: 'the ram comes down early. you are not under it. you were under it a half-second before.'
      },
      hurt: 'and then \u2014',
      close: {
        good: 'the seven o\u2019clock bell. you have beaten the bench today and nobody has said so.',
        normal: 'the seven o\u2019clock bell. you put your things down where you always put them.',
        bad: 'the seven o\u2019clock bell. you are short and you know exactly how short.',
        hurt: 'they let you off at seven with the rest. there is no arrangement for anything else.'
      }
    },

    catastrophe: {
      flash: {
        title: 'THE FLASH',
        text: 'A cup goes over at the far end and takes the bench with it in a white line that arrives before the sound does. When you can see again the shed is full of a smell like a struck match the size of a room, and there is a shape on the floor where {name} was sitting. {name} was {age} years old.',
        survived: 'You are burned across the hands and the side of the face. Your hands will not be steady again.'
      },
      burst: {
        title: 'THE WHEEL',
        text: 'The stone lets go at speed. A wheel of that size does not break, it becomes shrapnel with a direction. Half of it goes through the shed wall. The other half goes through {name}, who was {age} years old, and who had been at that wheel since before you were born.',
        survived: 'A splinter of the stone takes you above the eye. You keep the eye. Not all of it.'
      },
      cruciblespill: {
        title: 'THE CRUCIBLE',
        text: 'The trunnion gives. Two hundredweight of molten lead goes across the floor of the shed, finding the low places, the way water does. {name}, who was {age} years old, could not get up onto the bench in time.',
        survived: 'It goes over your boot. The boot is not the problem. What is under the boot is the problem.'
      },
      press: {
        title: 'THE PRESS',
        text: 'The stop-bar was folded back. The ram came down on the return stroke, which it is not supposed to do, which everyone says it is not supposed to do. {name} was reaching in. {name} was {age} years old.',
        survived: 'You get your hand back. Not all of your hand.'
      },
      neighbourDied: '{name} is carried out through the yard on a door. The shift resumes at twenty past.',
      worksResponse: 'The Works posts a notice within the hour. It uses the word regrettable and the word carelessness in the same sentence.',
      resumed: 'The bench is working again by twenty past the hour. There is a queue of eleven men at the gate and everybody on the floor can count.'
    },

    injuryHappened: 'YOU ARE HURT',
    injuryLine: '{what}. {detail}',
    injuryDetail: {
      scald: 'Molten lead across the forearm. The skin is not where it was.',
      burn: 'A burn along the inside of the hand, dressed with nothing.',
      cutArm: 'A cut to the forearm, deep, with grit in it.',
      back: 'Something in the low back lets go and does not come back.',
      hernia: 'A rupture in the groin, which is what lifting does to a man eventually.',
      crushedHand: 'The press catches the hand across the back. The bones are in the wrong arrangement.',
      lostFingers: 'Two fingers and the top of a third. They are somewhere under the press.',
      wheelSplinter: 'A splinter of grinding stone above the eye, driven in by a wheel doing eight hundred turns a minute.',
      fulminateFlash: 'Burns across both hands and the side of the face, and a shake that starts that night and does not stop.'
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
      apothecary: 'The apothecary on Kell Street \u2014 {price}',
      apothecaryHint: 'A surgeon\u2019s dressing and a proper draught. More than a week\u2019s wage, which is the arrangement.',
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
      apothecary: 'He cuts away what is dead, dresses it properly, and charges you what he charges. It is the first competent thing done to your body since you came to Grimwick.',
      apothecaryNoWound: 'He sells you a draught for the chest and tells you to leave the grinding shed, which is advice for a different man with a different rent.',
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
    pieces: 'Passed at inspection',
    bonusLine: 'Count bonus',
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
      dustAllowance: 'Wheel allowance',
      bonusLine: 'Count bonus',
      quotaFine: 'Fine \u2014 count short of the week',
      coomCharge: 'Overlooker\u2019s charge',
      skimBench: 'Bench hire',
      skimApron: 'Apron and gloves',
      skimSweep: 'Sweeping of the shed',
      skimLight: 'Light and heat, apportioned'
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

  foreman: {
    name: 'Overseer Halbrecht Coom',
    heading: 'THE OVERSEER',
    standing: 'How he has you',
    blurbGood: 'Coom is civil to you this week, in the way a man is civil to a tool that has not yet broken.',
    blurbFlat: 'Coom knows your number and not your name, and that is the arrangement he prefers.',
    blurbBad: 'Coom has a use for you being poorer. He has had it for some days now.',
    blurbSpite: 'Coom has put you where the work is worst, and he has done it in front of the bench so that it is understood.',
    endure: 'Say nothing',
    endureHint: 'Cost nothing. Change nothing.',
    flatter: 'Take your cap off to him',
    flatterHint: 'It works, a little, and you will feel it later.',
    bribe: 'Put a shilling in his hand \u2014 {amt}',
    bribeHint: 'It buys about a week. It has never once bought more.',
    report: 'Write to the Factory Inspector',
    reportHint: 'The Ten Hours Act is law here. Nobody has ever seen it enforced in Grimwick.',
    scribe: 'Pay the scribe to write it \u2014 {amt}',
    scribeHint: 'You cannot write it yourself and you know it.',
    r_endure: 'You say nothing. He goes down the line. That is the whole of it.',
    r_flatter: 'You take your cap off and say the thing he likes to hear. He accepts it as his due, which it is not, and the bench sees you do it.',
    r_bribe: 'The coin goes from your hand into his without either of you looking at it. He is easier with you for a week and dearer with you after.',
    r_report: 'You send it. There is no receipt for such a letter and no way to know it arrived, until it has.',
    skimNotice: 'There are charges on your docket tonight that were not on anybody else\u2019s.',
    spiteNotice: 'Coom puts you at the worst bench in the Works and does it where the floor can hear.',
    informant: 'Coom offers you a bargain about the men who talk. Not today \u2014 he wants you to know it exists.'
  },

  inspector: {
    heading: 'THE FACTORY INSPECTOR',
    sent: 'The letter goes to the Inspectorate at the county town. It takes three days and it is out of your hands the moment it leaves them.',
    arrival: 'A gentleman from the Inspectorate is in the yard at nine with a notebook and clean boots.',
    visit: 'The shed has been swept since four in the morning. The guards are all fitted and oiled. The children are not on the floor \u2014 they are in the timber yard, in the rain, and will be there until he leaves.',
    findsNothing: 'He finds the works to be in substantial compliance. He writes substantial compliance in the book and closes the book. He is not a liar. He is simply a man who has been shown a different factory.',
    aftermath: 'Everyone on the floor knows who wrote the letter by the afternoon. Nobody says a word to you. That is the punishment; there is no other one coming.',
    workmates: 'The bench turns its back. You eat your dinner alone against the wall of the shed.',
    coomKnows: 'Coom says nothing at all about it, which is how you learn that he knows.'
  },

  fever: {
    onset: 'The wound is hot and the heat has gone up into the arm. You are shivering in a warm room.',
    burning: 'The fever has you. You are not entirely sure which day it is and you go to the bench anyway.',
    breaking: 'The fever turns in the night. You wake soaked and weak and alive.',
    worsening: 'It is worse. There is a smell to the dressing now.',
    tooLate: 'The red line is above the elbow.'
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
    act1_quota: 'The week\u2019s count wants {n} more, and there are {d} shifts left to make it in.',
    act1_fever: 'The wound has turned and the fever is on you. A surgeon, or it finishes the way it finishes.',
    deadline_quota: 'The count, day {d} \u2014 {n} wanted',
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
    noDebt: 'You owe the store nothing.',
    noWound2: 'Nothing on you needs a surgeon.',
    foremanCold: 'Coom will not hear it from you.',
    askedAlready: 'You have asked him once today. Twice is a different conversation.',
    dialsLocked: 'The shift is set. The bell has gone.',
    noScribe: 'You cannot write, and the scribe wants paying.',
    reportedAlready: 'The letter is already sent.',
    sacked: 'You are off the roll.'
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
    scald: 'a scalding',
    burn: 'a lead burn',
    cutArm: 'a cut to the forearm',
    back: 'a ruined back',
    hernia: 'a rupture',
    crushedHand: 'a crushed hand',
    lostFingers: 'two fingers gone',
    wheelSplinter: 'stone in the eye',
    fulminateFlash: 'flash burns',
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
    monteCarlo: '200-shift Monte Carlo',
    monteDone: 'Monte Carlo: {n} shifts per setting, printed to the console.',
    permCheck: 'Assert permanent stats',
    permOk: 'PERMANENCE: dust, tremor and lead cannot be reduced.',
    passed: 'ROUND TRIP: identical.',
    failed: 'ROUND TRIP: DIFFERS — see console.'
  }
};
