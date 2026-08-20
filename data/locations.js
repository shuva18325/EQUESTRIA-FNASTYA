/* ==========================================================================
   GRIMWICK WORKS — data/locations.js
   The town, as eleven nodes and three districts.

   The centre is walkable: the Rows, the square and Kell Street cost nothing
   to move between. The works up the hill and the sidings out past the cut
   cost you an hour of your evening each way. Two hours is all you have.
   ========================================================================== */

var DISTRICTS = {
  CENTRE:  { id: 'CENTRE',  name: 'The centre' },
  HILL:    { id: 'HILL',    name: 'Up the hill' },
  SIDINGS: { id: 'SIDINGS', name: 'The sidings' }
};

/* Hours of the evening spent walking. Symmetric on purpose. */
var TRAVEL = {
  CENTRE:  { CENTRE: 0, HILL: 1, SIDINGS: 1 },
  HILL:    { CENTRE: 1, HILL: 0, SIDINGS: 1 },
  SIDINGS: { CENTRE: 1, HILL: 1, SIDINGS: 0 }
};

var LOCATIONS = [
  {
    id: 'rows',
    name: 'The Rows',
    short: 'The Rows',
    sub: 'Fourteen Cinder Row',
    district: 'CENTRE',
    blurb: 'Four floors of brick and one privy in the yard for the lot of them. Two rooms up a stair that leaks, and a north wall that comes out in a black bloom every winter.',
    blurbStreet: 'Somebody else has the rooms now. You know the doorway three houses down, and the grating behind the bakehouse where the heat comes up.',
    actions: ['rest', 'tendKin', 'dressWound', 'mend', 'stash', 'kinToBench', 'payMinder'],
    streetActions: ['shelterGrate', 'begDoorways', 'scavengeRows', 'takeRoom']
  },
  {
    id: 'works',
    outdoor: true,
    name: 'The Works',
    short: 'The Works',
    sub: 'Grimwick Small Arms, the gates',
    district: 'HILL',
    blurb: 'The gate, the timekeeper’s hut, the yard, and the hiring crowd that is never shorter than eleven men. It runs at night as well; it runs at night worse.',
    actions: ['nightShift', 'gateHiring', 'yardTalk', 'askTally', 'askForPlace']
  },
  {
    id: 'market',
    outdoor: true,
    name: 'Market Square',
    short: 'Market Sq.',
    sub: 'Sallow Street',
    district: 'CENTRE',
    blurb: 'Barrows under wet canvas. Bread, coal, cloth, and a board by the pump where the week’s prices are chalked up whether anyone likes them or not.',
    actions: ['marketBoard', 'broadsheet', 'broadsheetAloud', 'buyBread', 'buyCoal', 'buyCloth', 'haggle']
  },
  {
    id: 'store',
    name: 'The Company Store',
    short: 'The Store',
    sub: 'Owned by the Works, open at all hours',
    district: 'CENTRE',
    blurb: 'Cleaner than the market, cheaper than the market, and it never asks for money. Everything goes in the book, and the book is at the Works before you are.',
    actions: ['storeBread', 'storeCoal', 'storeCloth', 'settleBook', 'readLedger']
  },
  {
    id: 'pawn',
    name: 'The Pawnbroker',
    short: 'Pawnbroker',
    sub: 'Ostrek, three brass balls, Sallow Street',
    district: 'CENTRE',
    blurb: 'Ostrek keeps his window clean and his ledger cleaner. Half the Rows is in that window by February and out of it again by May, or not.',
    actions: ['pawnGood', 'redeemGood', 'sellOutright', 'askOstrek']
  },
  {
    id: 'apothecary',
    name: 'The Apothecary',
    short: 'Apothecary',
    sub: 'Mrs. Bligh, Kell Street',
    district: 'CENTRE',
    blurb: 'Blue glass, brass scales, and the only person in Grimwick who will tell you the truth about your body. The truth costs, and so does everything behind the counter.',
    actions: ['buyPhysic', 'buyLaudanum', 'surgeon', 'advice']
  },
  {
    id: 'ewe',
    name: 'The Black Ewe',
    short: 'Black Ewe',
    sub: 'Bottom of Cinder Row',
    district: 'CENTRE',
    blurb: 'Sawdust, wet wool, and men saying things on Friday they will deny on Monday. Moll Tarrow keeps the slate and knows precisely how far each man is behind on it.',
    actions: ['drink', 'listen', 'cards', 'contact']
  },
  {
    id: 'chapel',
    name: 'St. Aulder’s',
    short: 'St. Aulder’s',
    sub: 'The parish chapel, north side of the square',
    district: 'CENTRE',
    blurb: 'Cold stone, a saint carved without a face, and a vestry where the Almoner keeps the dole book. Charity here is real and it is administered like a punishment.',
    actions: ['dole', 'burialClub', 'almoner', 'sitInNave', 'enterWorkhouse']
  },
  {
    id: 'railyard',
    outdoor: true,
    name: 'The Rail Yard',
    short: 'Rail Yard',
    sub: 'The sidings, past the cut',
    district: 'SIDINGS',
    blurb: 'Crates for the colonial trade, a watchman who drinks, and the only rails out of Grimwick. Everything that leaves this town leaves from here, including people.',
    actions: ['loadWork', 'pilfer', 'bigJob', 'smuggler', 'roadOut', 'putBy', 'bookPassage', 'bookKinPassage']
  },
  {
    id: 'garrison',
    outdoor: true,
    name: 'The Garrison Post',
    short: 'Garrison',
    sub: 'Beside the works gate',
    district: 'HILL',
    blurb: 'A brick hut, a flagstaff, and a board of proclamations nobody reads aloud. Serjeant Vask is paid for names and does not pretend otherwise.',
    actions: ['sellBrass', 'bounty', 'enlistAsk', 'takeShilling', 'reportTheft']
  },
  {
    id: 'cut',
    outdoor: true,
    name: 'The Cut',
    short: 'The Cut',
    sub: 'The back alley behind the sidings',
    district: 'SIDINGS',
    requires: { minAct: 2 },
    blurb: 'A dead end between two walls with a broken gas lamp at the mouth of it. Since the spring there have been men in it on Tuesdays who are not there for the drink.',
    actions: ['hearSpeaker', 'takePamphlets', 'payDues', 'askHarrick']
  }
];

/* Where you are when the poorhouse has you. Not on the map; it replaces it. */
var WORKHOUSE_ACTIONS = ['pickOakum', 'workhouseChapel', 'askAfterKin', 'applyToLeave'];

/* ==========================================================================
   WHAT YOU CAN DO, AND WHAT IT READS LIKE.
   Mechanics live in js/town.js; every word of it lives here.
   {p} is a price, {n} a number, {kin} the name of whoever depends on you.
   ========================================================================== */
var ACTION_TEXT = {

  /* ---- the Rows ---- */
  rest:        { label: 'Rest in the dark', hint: 'No fire, no talk. It is free, and it is something.',
                 r: 'You sit. The room does its slow work of getting colder around you and you let it.' },
  tendKin:     { label: 'Sit with {kin}', hint: 'An hour of your evening. It is worth more to them than to you.',
                 r: 'They tell you about the day. You tell them about nothing, and they let you.',
                 rBad: 'They are hot to the touch and talking about the ceiling, and you sit there being no use.' },
  dressWound:  { label: 'Dress the wound', hint: 'Hot water, a clean rag, and the bottle if there is one.',
                 r: 'Hot water and a rag boiled twice. It is not medicine. It is better than nothing, which is the alternative.',
                 rPhysic: 'You pour the brown bottle over it and it goes white and then it screams. {kin} holds the lamp and does not look away, which is more than you manage.' },
  mend:        { label: 'Mend your coat', hint: 'Warmth you do not have to buy. Cloth helps.',
                 r: 'A bad seam, well hidden. It will hold through the frost.',
                 rCloth: 'You line the shoulders with the new cloth. It is the warmest you have been in a month.' },
  stash:       { label: 'Lift the floorboard', hint: 'What is under the floor cannot be turned out of your pockets at the gate.',
                 r: 'Third board from the wall, the one that was always loose. You put it under and stand on it once to be sure.',
                 rEmpty: 'You lift it, look into the dark of it, and put it back. There is nothing to hide this week.' },
  kinToBench:  { label: 'Put {kin} on the cap bench', hint: 'Six pence a shift. The shake is permanent, and she is nine.',
                 r: 'You walk her up to the gate in the morning and Coom writes her number in the book without looking up. She is proud of it. That is the part you were not ready for.' },
  payMinder:   { label: 'Pay Mother Ashen to mind {kin} — {p}', hint: 'Buys back the hour she costs you.',
                 r: 'Mother Ashen takes the coin and the child and asks no questions, which is worth the coin on its own.' },
  shelterGrate:{ label: 'Sleep on the bakehouse grating', hint: 'Warm brick until four, when the boy comes out and moves you.',
                 r: 'The brick holds the oven heat until about four. You sleep hard for three hours and are moved on at the fourth.' },
  begDoorways: { label: 'Beg in the doorways of the Rows', hint: 'People with nothing give more often. That is the worst of it.',
                 r: 'Four doors, three refusals, and a woman with less than you who gives you a heel of bread and will not be thanked.',
                 rNothing: 'Nobody answers. In the Rows they know the knock, and they know what it means.' },
  scavengeRows:{ label: 'Pick over the ash pits', hint: 'Cinders, bones, rags. All of it is worth something to somebody.',
                 r: 'Half a bucket of unburnt cinders and a length of copper wire. It is a living. It is not much of one.',
                 rNothing: 'The pits have been gone over twice before you got to them. There are more of you than there are pits.' },

  /* ---- the Works ---- */
  nightShift:  { label: 'Take a night shift', hint: 'Twelve more hours at a penny more. It costs you three.',
                 r: 'The night shed is worse: fewer hands, the same count, and the gas turned down to save it.' },
  gateHiring:  { label: 'Stand for the hiring', hint: 'Casual work, if the gang boss points at you.',
                 r: 'He wants four and takes four, and one of them is you. Coal wharf, paid at the end of it.',
                 rNothing: 'He points at other men. You stand there until it is plainly finished and then you walk back down the hill.' },
  yardTalk:    { label: 'Stand in the yard with the hands', hint: 'Talk. Some of it is worth knowing.',
                 r: 'Nothing you could repeat, and three things you did not know this morning.' },
  askTally:    { label: 'Query your tally with the timekeeper', hint: 'It is never wrong in your favour. Sometimes it is wrong.',
                 r: 'He runs a finger down the column, finds nothing, and looks at you until you go.',
                 rFound: 'He finds it — a column carried wrong — and corrects it without a word of apology.' },

  /* ---- the square ---- */
  marketBoard: { label: 'Read the board by the pump', hint: 'This week’s prices, chalked against last week’s.',
                 r: '' },
  buyBread:    { label: 'Buy bread — {p}', hint: 'Two meals for the larder.',
                 r: 'Bread and dripping, wrapped in yesterday’s proclamation.' },
  buyCoal:     { label: 'Buy coal — {p}', hint: 'Two nights of fire.',
                 r: 'A quarter sack. The boy weighs it short and you both know it.' },
  buyCloth:    { label: 'Buy cloth — {p}', hint: 'Enough to line a coat, or to make a shroud, which is the other thing it is for.',
                 r: 'Grey fustian off the end of the roll, cut generously because the woman knows your face.' },
  haggle:      { label: 'Haggle at the barrows', hint: 'Costs an hour. Might cost you nothing else.',
                 r: 'You get a penny off the bread by being tiresome for a quarter of an hour. It is a penny.',
                 rNothing: 'She has heard it before, from better hagglers, on worse days. You pay what everyone pays.' },

  /* ---- the company store ---- */
  storeBread:  { label: 'Bread on the book — {p}', hint: 'Cheaper than the market. It goes in the ledger.',
                 r: 'The clerk writes it down without looking up. It is cheaper. That is the whole of the trick.' },
  storeCoal:   { label: 'Coal on the book — {p}', hint: 'Cheaper than the market. It goes in the ledger.',
                 r: 'A better sack than the market gives, honestly weighed, entered against your number.' },
  storeCloth:  { label: 'Cloth on the book — {p}', hint: 'Cheaper than the market. It goes in the ledger.',
                 r: 'Good cloth, cheap, and no money changes hands, and that is exactly how it works.' },
  settleBook:  { label: 'Pay down the book — {p}', hint: 'Coin against the ledger. It compounds on Sundays.',
                 r: 'He takes it, writes it, and the figure at the bottom is still a figure.' },
  readLedger:  { label: 'Ask to see the ledger', hint: 'You are entitled to see it. Nobody ever asks.',
                 r: '' },

  /* ---- Ostrek ---- */
  pawnGood:    { label: 'Pawn something', hint: 'Coin now. More to get it back, and a clock on it.',
                 r: 'Ostrek turns it over twice, names a figure, and writes the ticket. He does not haggle and he does not gloat.' },
  redeemGood:  { label: 'Redeem a ticket', hint: 'What you left, at what he wants for it.',
                 r: 'He has it wrapped in paper under the counter with your ticket number on it, exactly where he said it would be.' },
  sellOutright:{ label: 'Sell it outright', hint: 'A little more, and it is gone for good.',
                 r: 'Two pence more than the pawn and no ticket. It is in the window by Saturday.' },
  askOstrek:   { label: 'Ask Ostrek what he hears', hint: 'Everything in Grimwick passes over that counter eventually.',
                 r: 'He tells you three things while polishing the same brass ball, and does not say where any of them came from.' },

  /* ---- Kell Street ---- */
  buyPhysic:   { label: 'Buy physic — {p}', hint: 'A brown bottle. It does about half of what it claims.',
                 r: 'It tastes of liquorice and turpentine and Mrs. Bligh does not pretend it is more than it is.' },
  buyLaudanum: { label: 'Buy laudanum — {p}', hint: 'For the pain, and for the rest of it.',
                 r: 'Blue glass, wax over the cork. She looks at you a moment longer than the sale requires.' },
  surgeon:     { label: 'Have the wound seen to — {p}', hint: 'A surgeon’s dressing. More than a week’s wage.',
                 r: 'She cuts away what is dead, dresses it properly, and charges what she charges. It is the first competent thing done to your body since you came to Grimwick.' },
  advice:      { label: 'Ask her honestly how you are', hint: 'She will tell you. That is the trouble with asking.',
                 r: '' },

  /* ---- the Black Ewe ---- */
  drink:       { label: 'Drink — {p}', hint: 'Beer, and the noise of other people.',
                 r: 'It is thin, and it helps, and that is the trouble with it.' },
  listen:      { label: 'Listen at the bar', hint: 'The Works, the garrison, and what is coming down the line.',
                 r: 'Men who know nothing repeat it with confidence. Some of it turns out to be true.' },
  cards:       { label: 'Take a hand at cards — {p} stake', hint: 'Four pence in. Sometimes eight out.',
                 rWin: 'You win two hands and stand up while you are ahead, which nobody else in the room has ever managed.',
                 rLose: 'You lose it in eleven minutes and sit there a while longer so as not to look like a man who has lost it.' },
  contact:     { label: 'Ask Moll about the men in the cut', hint: 'She knows who drinks with whom, and when they stop.',
                 r: 'Moll wipes the same patch of counter for a while and then tells you where they meet and what night, and that she never told you.' },

  /* ---- St. Aulder's ---- */
  dole:        { label: 'Take the parish dole', hint: 'Bread and a shilling of coal, and your name in the book, read out on Sunday.',
                 r: 'You give your name, your number, your circumstances, and your reasons, to a man writing it down. Then you get the bread.',
                 rRefused: 'The Almoner says the dole is for the deserving and the deserving list is full this week.' },
  burialClub:  { label: 'Pay into the burial club — {p}', hint: 'A penny a week against a pauper’s grave.',
                 r: 'A penny in the tin, a mark in the book. It buys a box and a stone, eventually, for somebody.' },
  almoner:     { label: 'Ask the Almoner for relief', hint: 'For {kin}, not for you. He hears that better.',
                 r: 'He asks whether you drink, whether you attend, and whether the child is legitimate, and then he gives you the relief.',
                 rRefused: 'He asks whether you drink, whether you attend, and whether the child is legitimate. Then he says no.' },
  sitInNave:   { label: 'Sit in the cold nave a while', hint: 'The saint has no face. Somebody chiselled it off in a bad year.',
                 r: 'Nobody speaks to you for an hour. It is the only hour this week in which nobody wants anything.' },

  /* ---- the rail yard ---- */
  loadWork:    { label: 'Load crates for the night gang', hint: 'Honest work, paid in coin, and it takes your back.',
                 r: 'Four hours of crates for the colonial trade. Rifles, by the weight of them, though the stencil says agricultural machinery.' },
  pilfer:      { label: 'Take something off a crate', hint: 'The watchman drinks. He is not always drinking.',
                 rGot: 'A tin of preserved meat and two yards of copper wire, inside your coat and out through the gap in the fence.',
                 rCaught: 'The watchman is not drinking tonight. He is slow, and old, and he still gets close enough to see your face.' },
  smuggler:    { label: 'Deal with Serrel', hint: 'He moves things out of Grimwick and occasionally people.',
                 r: 'Serrel deals in what falls off things. He buys without asking and sells without saying.' },
  roadOut:     { label: 'Ask what it costs to leave', hint: 'There are rails out of here. There is a price on them.',
                 r: 'A place in a goods van as far as the coast is two crowns, paid before, no refund for weather or arrest. He says it like a timetable.' },

  /* ---- the garrison post ---- */
  sellBrass:   { label: 'Sell scrap brass at the post', hint: 'They buy metal and ask where it came from afterwards.',
                 r: 'A corporal weighs it, pays under the weight, and writes your number in a book that is not for brass.' },
  bounty:      { label: 'Give Vask a name', hint: 'They pay for names. Everyone on the floor knows they pay for names.',
                 r: 'You say the name. Vask writes it, counts out the coin, and thanks you in a voice meant to be overheard.' },
  enlistAsk:   { label: 'Ask about enlistment', hint: 'Three years, they say, which everybody knows means five.',
                 r: 'Colonial service. The food is real and the rest of it is a recruiting sheet read aloud by a man who has never been.' },
  reportTheft: { label: 'Report a theft in the Rows', hint: 'They will come. That is the problem with them coming.',
                 r: 'Two men come down Cinder Row in the morning and turn out four rooms, none of them the right one.' },

  /* ---- the cut ---- */
  hearSpeaker: { label: 'Hear the speaker out', hint: 'A man from the north with a good voice and no money.',
                 r: 'He talks about the scoop and the tally and the men who own both, in sentences, which somehow makes it worse than knowing it.' },
  takePamphlets:{label: 'Take a bundle to hand out', hint: 'Print, in a garrison town, in your coat.',
                 r: 'Forty sheets, badly set, still smelling of the press. You put them where the shirt is thickest.' },
  payDues:     { label: 'Pay into the fund — {p}', hint: 'For the men who are put off for talking. There are always some.',
                 r: 'Tuppence into a tea caddy with a slot cut in the lid. Vane writes your number, not your name.' },
  askHarrick:  { label: 'Ask Vane what it is for', hint: 'He has been put off two works already for answering that.',
                 r: 'He says: the count goes up every week you beat it, and no man alive can beat it forever, and that is not an accident, it is the design.' },

  /* ---- the workhouse ---- */
  pickOakum:   { label: 'Pick oakum', hint: 'Old tarred rope, unpicked by hand into fibre. Three pounds of it before supper.',
                 r: 'Tarred rope, unpicked strand by strand, until the fingers split at the tips and then keep going.' },
  workhouseChapel:{ label: 'Attend the ward chapel', hint: 'Attendance is noted. Non-attendance is noted harder.',
                 r: 'Forty minutes on a backless bench, and a sermon on the sin of improvidence delivered to people who have nothing.' },
  askAfterKin: { label: 'Ask after {kin}', hint: 'They are in another ward. That is the rule and it is enforced.',
                 r: 'The matron says they are in the children’s ward and doing well and cannot be seen today. She says it the same way every time.' },
  broadsheet:  { label: 'Buy the Advertiser — {p}', hint: 'A penny of print. You would have to be able to read it.',
                 r: '' },
  broadsheetAloud:{ label: 'Have the Advertiser read to you — {p}', hint: 'Tuppence to the scribe on the corner, who reads it in a carrying voice.',
                 r: '' },
  takeShilling:{ label: 'Take the shilling', hint: 'Three years, they say, which everybody knows means five. The bounty is paid at the table.',
                 r: 'You take it off the table in front of about forty people and repeat a form of words after the serjeant, and it is done, and it took under a minute.' },
  bigJob:      { label: 'Go out with Serrel’s people', hint: 'A bonded waggon, four men, and a watchman who is paid not to be there.',
                 rGot: 'Two hundredweight of contract powder off a bonded waggon in eleven minutes. Serrel pays in the morning, in coin, without counting it in front of you.',
                 rCaught: 'The watchman is there after all, and so are two of the garrison, and the four of you go over the fence in four directions.' },
  putBy:       { label: 'Put money by with Serrel', hint: 'He holds it. The store cannot stop what is not in your pocket on a Friday.',
                 r: 'He writes the figure on the inside of a cigar box lid, in chalk, with your number beside it. It is the only bank a man like you will ever have.' },
  bookPassage: { label: 'Book your passage — {p}', hint: 'Two crowns for a berth to the coast and out. Paid before, no refund for weather or arrest.',
                 r: 'A room over a chandler’s office, coin counted twice, and a ticket with a sailing date on it in ink that has not dried.' },
  bookKinPassage:{ label: 'Book {kin}’s passage — {p}', hint: 'A child’s berth is one crown. Nobody sails who is not paid for.',
                 r: 'One crown, and the name written in the book, spelled the way you say it rather than the way it is spelled.' },
  takeRoom:    { label: 'Take a room again — {p}', hint: 'A week down and a week in hand. Moll knows a landlord who is not particular.',
                 r: 'Two rooms on the fourth floor this time, smaller, damper, and yours until the seventh day.' },
  askForPlace: { label: 'Ask Coom to put you back on the roll', hint: 'He remembers. That is the difficulty.',
                 r: 'He lets you stand there through the whole of the hiring before he says it. But he says it, and your number goes back in the book.',
                 rRefused: 'He looks at you for a while, and then past you, and then at the next man.' },
  enterWorkhouse:{ label: 'Present yourself at the workhouse', hint: 'Food, a bed, and the wards are separated. They will take your kin from you.',
                 r: 'You give your name at the gate. They take your clothes to be baked for the lice, they take your kin to the other ward, and they give you a number and a bowl.' },
  applyToLeave:{ label: 'Apply for discharge', hint: 'Three hours’ notice, in writing, and they keep the clothes.',
                 r: 'You give notice. It takes a day to be processed because everything here takes a day to be processed.' }
};
