/* ==========================================================================
   GRIMWICK WORKS — data/endings.js
   Nine endings. No score, no stars, no grade. Every one of them shows the
   same four things: the days, the damage, the kin, and the names you gave.
   ========================================================================== */

var ENDINGS = {

  the_machine: {
    id: 'the_machine',
    title: 'THE MACHINE',
    text: [
      'You worked sixty days. You made the count more weeks than you missed it, you paid the rent more Fridays than you did not, and you kept a roof and a bench and a number in a book.',
      'Nothing changed. The count is higher than it was in the autumn and it will be higher again in the spring. Coom is still on the stair. The store book still compounds on a Sunday. The men who were laid off at the retooling are still at the gate at five, and there are more of them now.',
      'In the spring the Works takes on forty new hands, because forty of the old ones did not come through the winter. You are not one of the forty. That is the entire achievement, and it is a real one, and it is what the arrangement is for.'
    ],
    closing: 'The bell goes at five tomorrow.'
  },

  broken: {
    id: 'broken',
    title: 'BROKEN ON THE FLOOR',
    text: [
      'It is not dramatic and it is not quick, and there is no moment in it where anybody could have done anything differently for less money than they had.'
    ],
    causes: {
      injury: 'The wound went bad in the ordinary way. The red line came up from the hand towards the heart and everybody in the room knew what the red line meant and nobody said it. The Works records the cause as carelessness of the hand. The hand is not consulted.',
      starve: 'You got colder than food could fix, and then tired, and the tired did not lift. The Works fills your place on the Monday from a queue at the gate that is never shorter than eleven men.',
      cold: 'The frost got into the room and then into you. There is a moment near the end where you are warm, and it is a lie, and it is the kindest thing that happens to you all winter.',
      sick: 'Stone lung, they call it in the grinding shed, and they call it that because they have all seen it. It takes years, or it takes one bad winter on top of the years.'
    },
    closing: 'The parish buries you. The burial club disputes the claim.'
  },

  strike_holds: {
    id: 'strike_holds',
    title: 'THE STRIKE HOLDS',
    text: [
      'Eleven days out. The Works brings in hands from Woolvern on the Tuesday and the Woolvern men get off the train, look at four hundred people standing in the sidings in the rain saying nothing at all, and get back on it.',
      'On the ninth day the Ordnance Board writes to the Works about the delivery of breech blocks, and on the eleventh the Works settles: the count comes down a fifth, the lamp oil charge is struck off the docket, and the guards on the presses are not to be folded back on any account.',
      'It is not victory. Sarrow Vane is blacklisted at every works in the county and leaves for the north in March. Four men are not taken back. The count will begin climbing again inside a year, because the ratchet was never the count — it was who is permitted to set it, and that has not changed.'
    ],
    closing: 'But the lamp oil is off the docket, and every hand in Grimwick knows exactly why it came off.'
  },

  strike_breaks: {
    id: 'strike_breaks',
    title: 'THE STRIKE BREAKS',
    text: [
      'Nineteen days out and no fund left. The Woolvern hands come in on the Thursday behind two files of the garrison and the line does not hold, because a line of people with nothing in the house holds for exactly as long as the nothing lasts.',
      'The Works takes back who it wants. There is a paper to sign at the gate about combinations, and the men who will not sign it are not taken, and their names go on a list that is circulated to eleven works in the county by the end of the month.',
      'You are on the list.'
    ],
    closing: 'They do not have to hang anybody. They only have to be able to wait longer than you can.'
  },

  queens_evidence: {
    id: 'queens_evidence',
    title: 'QUEEN’S EVIDENCE',
    text: [
      'You are comfortable. That is the correct word and it is worth using precisely: two rooms with a fire in them, a coat that fits, the store book cleared, and a retainer of two shillings a week paid in an envelope that is never handed over in front of anyone.',
      'The arrests came in the second week of the reckoning and they were quiet and they were accurate, and everybody on the floor understood within a day how accurate they had been and what that meant about where the accuracy came from.',
      'Nobody says anything to you. Nobody will ever say anything to you. You eat your dinner against the wall of the shed and the bench has moved four feet down without anybody appearing to decide to.'
    ],
    closing: 'You will not be short again. You will not be spoken to again either.'
  },

  the_shilling: {
    id: 'the_shilling',
    title: 'THE SHILLING',
    text: [
      'You took it in the square with your hat off and a ribbon in it, in front of a table with a bowl of coin on it, and there is a form of words you have to repeat and you repeated it.',
      'Three years, they said, which everybody knows means five. The food is real — that part was never a lie. Boots, a coat, a shilling a day less stoppages for the coat and the boots, and a barracks in the county town that is warmer than any room you have slept in since your father died.',
      'The regiment is for the Kelsgrave highlands in the spring.'
    ],
    closing: 'You are out of Grimwick. That was the whole of what you asked for.',
    epilogues: {
      died: 'The column went into the second range in the March and the lists were printed in the Advertiser in small type on the fourth page. Grimwick reads its own name in that type about once a fortnight now and has stopped remarking on it.',
      invalided: 'The chest you brought out of the grinding shed did what the chest was always going to do, only faster, at altitude, carrying sixty pounds. They discharged you as unfit at the depot before the regiment ever went up, with ninepence a week and your papers, and you sat on the chapel steps in a town you did not choose with the papers spread on your knee so people could see they were genuine.',
      survived: 'Two seasons in the passes and you came down again with both hands and most of your hearing, which of the men who went up with you puts you in the smaller half. There is a pension of a shilling a week and a settled character and no Works and no Coom and no count.',
      promoted: 'It turns out that a man who can read a gauge, hold a count under a bell, and stand at a bench for twelve hours without complaining is exactly what the service means by a good corporal. You are made up inside the year. You are very good at it, and you think about that on the nights when you cannot sleep.'
    }
  },

  passage: {
    id: 'passage',
    title: 'PASSAGE',
    text: [
      'Two crowns for you and one for the child, paid in a room over a chandler’s office at the coast, in coin, counted twice by a man who has counted a great deal of coin in that room and has never once been to sea.',
      'The ship is a converted timber barque with four hundred and eleven people in a space fitted for cargo, and the passage is nine weeks if the weather holds. There is a bucket for every twelve people. There is no doctor. The Advertiser reports the arrivals but not the departures, because departures are not news.',
      'You do not know what is at the other end of it. Nobody on that ship knows. What you know is what is behind you, exactly and to the penny, and that is what makes it possible to get on.'
    ],
    closing: 'Grimwick is a smell of soot on your coat for about a fortnight, and then it is not even that.'
  },

  the_drop: {
    id: 'the_drop',
    title: 'THE DROP',
    text: [
      'The assizes sat at the county town for two days and yours took the better part of eleven minutes. There was counsel for the Crown and none for you, which is lawful and usual, and there was a man who had known you at the bench who gave evidence and did not look up while he gave it.',
      'They are hanging for it this year. They were not last year and they will not be the year after, and there is no principle in any of that; there was Woolvern in between, and the magistrates have to be seen to have done something about Woolvern.',
      'It is done at eight in the morning in the square, on the new platform, in front of about two thousand people, several of whom have brought children so that the children will remember it and be improved.'
    ],
    closing: 'The Advertiser gives it four lines and spells your name wrong.'
  },

  foremans_chair: {
    id: 'foremans_chair',
    title: 'THE FOREMAN’S CHAIR',
    hidden: true,
    text: [
      'Coom is moved up to the Woolvern works in the spring, on the strength of a floor that stayed quiet through a bad winter when three other works in the county did not, and that is put in writing and it is put in writing about him.',
      'You are given the book, the stair, and the office with the window over the floor. Two shillings and sixpence a day, no count, no bench, and the fulminate at a distance of forty feet for the rest of your life.',
      'On the first morning you stand at the top of the stair with the book and you watch two hundred people come in under you at five o’clock, and you find that you already know exactly how it is done, because you have been watching it done to you for sixty days.'
    ],
    closing: 'You make a mark in the book beside somebody’s name. It takes about a second and a half.',
    replayTutorial: true,
    /* the day-one card, replayed, from the top of the stair */
    replay: [
      'His father is three years in the ground and the parish took the cost out of his name.',
      'The Grimwick Small Arms Works pays a floor hand twenty-six pence a day, less charges, and you are the man who decides what the charges are.',
      'His sister is nine. She winds cartridge paper at the kitchen table and coughs at night, and there is a place for her at the cap bench whenever he asks, and he will ask.',
      'There is no one coming. There is only the shift. You know that better than anybody in the building, because you are the reason it is true.'
    ]
  }
};

/* Kept so old saves and Build 1 death ids still resolve to something. */
var DEATH_CAUSES = {
  death_starve: 'starve',
  death_cold:   'cold',
  death_injury: 'injury',
  death_sick:   'sick'
};

/* What became of the people you named. Shown, always. */
var INFORMANT_FATES = {
  released:    { id: 'released',    line: '{name} was held eleven days and let out with nothing proved. {name} has not worked since; the list travels faster than the acquittal.' },
  blacklisted: { id: 'blacklisted', line: '{name} was put off at the gate and is on a list circulated to eleven works in the county. Last seen at the hiring crowd at Woolvern, which is a longer crowd than ours.' },
  gaoled:      { id: 'gaoled',      line: '{name} got two years with hard labour at the county gaol. The hard labour is a treadwheel and the treadwheel grinds nothing; it is there to be turned.' },
  transported: { id: 'transported', line: '{name} was transported for seven years. The ship went from the coast in the March. There is no arrangement for coming back, whatever the sentence says.' },
  hanged:      { id: 'hanged',      line: '{name} was hanged at the county town on a Tuesday morning, on the evidence, in about eleven minutes.' }
};
