/* ==========================================================================
   GRIMWICK WORKS — data/items.js
   Goods, prices in pence. Prices are 1851-plausible and deliberately mean.
   No text here: every label is a strings key.
   ========================================================================== */

var ITEMS = {
  bread:  { id: 'bread',  labelKey: 'town.actions.buyBread',  price: 5,  meals: 2 },
  coal:   { id: 'coal',   labelKey: 'town.actions.buyCoal',   price: 7,  fuel: 2 },
  physic: { id: 'physic', labelKey: 'town.actions.buyPhysic', price: 14, doses: 1 },
  apothecary: { id: 'apothecary', labelKey: 'town.actions.apothecary', price: 150 },
  beer:   { id: 'beer',   labelKey: 'town.actions.drink',     price: 2 }
};

/* Standing charges the Works takes off every docket, worked or not. */
var CHARGES = {
  lampOil:    { key: 'docket.lines.lampOil',    base: 2, always: true },
  toolHire:   { key: 'docket.lines.toolHire',   base: 3, always: true },
  breakages:  { key: 'docket.lines.breakages',  base: 0 },
  store:      { key: 'docket.lines.store',      base: 0 },
  burialClub: { key: 'docket.lines.burialClub', base: 1, weeklyOn: 6 },
  chapelRate: { key: 'docket.lines.chapelRate', base: 1, weeklyOn: 0 },
  doctorsBook:{ key: 'docket.lines.doctorsBook',base: 0 },
  quotaFine:  { key: 'docket.lines.quotaFine',  base: 0 },
  coomCharge: { key: 'docket.lines.coomCharge', base: 0 },
  spoilage:   { key: 'docket.lines.spoilage',   base: 0 },
  rentAtSource:{key: 'docket.lines.rentAtSource',base: 0 }
};

var FINES = {
  late:    { key: 'docket.lines.fineLate',    amount: 4 },
  spoiled: { key: 'docket.lines.fineSpoiled', amount: 6 },
  talk:    { key: 'docket.lines.fineTalk',    amount: 3 },
  absent:  { key: 'docket.lines.fineAbsent',  amount: 8 }
};

/* ==========================================================================
   THINGS YOU OWN — every one of them is also next week's rent if it has to be.
   Pawn value is what Ostrek gives. Redeem is what he wants back, and it is
   always more, and there is a clock on it.
   ========================================================================== */
var GOODS = {
  watch:  { id: 'watch',  name: 'your father\u2019s watch', pawn: 34, redeem: 46,
            note: 'It has not gone since he died. You wind it anyway.' },
  shawl:  { id: 'shawl',  name: 'your mother\u2019s shawl',  pawn: 18, redeem: 25, warmth: 4,
            note: 'Wool, good wool, and the only warm thing in the room.' },
  boots:  { id: 'boots',  name: 'a pair of sound boots',      pawn: 26, redeem: 35, warmth: 5,
            note: 'Resoled twice. The third time will not take.' },
  coat:   { id: 'coat',   name: 'your winter coat',           pawn: 22, redeem: 30, warmth: 6,
            note: 'Too thin for February and the only one you have.' },
  bible:  { id: 'bible',  name: 'the family bible',           pawn: 9,  redeem: 13, resolve: 2,
            note: 'Four names written inside the cover. Three of them crossed through.' },
  tools:  { id: 'tools',  name: 'your own hand tools',        pawn: 30, redeem: 40, skill: 4,
            note: 'A works hand with his own tools is worth a halfpenny more an hour.' }
};

var STARTING_GOODS = [
  { id: 'coat', stashed: false },
  { id: 'boots', stashed: false },
  { id: 'shawl', stashed: false },
  { id: 'watch', stashed: false },
  { id: 'bible', stashed: false }
];

/* Base prices in pence, before the war gets at them. */
var BASE_PRICES = {
  bread: 5, coal: 7, cloth: 9, physic: 14, laudanum: 11, candle: 2, surgeon: 150
};

/* How hard the war gets at each price, and what the season does to it. */
var PRICE_SENSITIVITY = { bread: 1.00, coal: 0.90, cloth: 0.70, physic: 0.50, laudanum: 0.60, candle: 0.40, surgeon: 0.20 };
var SEASON_PRICE = {
  'LATE SUMMER': { coal: 0.92, bread: 0.96 },
  'AUTUMN':      { coal: 1.14, bread: 1.02 },
  'WINTER':      { coal: 1.38, bread: 1.14 },
  'THAW':        { coal: 1.05, bread: 1.08 }
};

/* The company store is always cheaper. That is the trap, and it looks like mercy. */
var STORE_DISCOUNT = 0.85;

var RENT = { amount: 40, every: 7, missesToEviction: 2, deposit: 60 };

var WORKHOUSE = { dailyOakum: 0, leaveDelay: 1, kinSeparated: true };

/* ==========================================================================
   WHAT THE WORKS WANTS MADE TODAY.
   The Ordnance Division sends a day order down with the five o'clock bell.
   Common ball is common ball. Now and then it is a breech block for a pattern
   that does not have a name yet, worth eleven times the ball, and if you spoil
   one it is written against your number at the value of the article.
   ========================================================================== */
var RARITY = {
  COMMON:    { id: 'COMMON',    label: 'Common',      rank: 0 },
  UNCOMMON:  { id: 'UNCOMMON',  label: 'Service',     rank: 1 },
  FINE:      { id: 'FINE',      label: 'Fine',        rank: 2 },
  RARE:      { id: 'RARE',      label: 'Select',      rank: 3 },
  PROTOTYPE: { id: 'PROTOTYPE', label: 'Experimental', rank: 4 }
};

/* value: pence per hundred pieces at the Works' own valuation.
   output: how many you can make against an ordinary day.
   reject: how hard the viewer's gauge is on it.
   quota:  what one piece is worth against the week's count.
   spoil:  what one condemned piece costs you, in pence. */
var ORDERS = {
  ball_common: {
    id: 'ball_common', rarity: 'COMMON', icon: 'ball',
    name: 'Ball cartridge, common',
    line: 'Spherical ball for the old smoothbores, cast a hundred to the ladle. Colonial levies and militia. Nobody counts them twice.',
    stations: ['CASTING'], value: 1.00, output: 1.15, reject: 0.85, quota: 1.00, spoil: 1
  },
  cap_service: {
    id: 'cap_service', rarity: 'COMMON', icon: 'cap',
    name: 'Percussion caps, service',
    line: 'Copper cups, fulminate, a paper of a hundred. The Works ships them by the barrel and the barrel does not care about you.',
    stations: ['CAP_BENCH'], value: 1.00, output: 1.15, reject: 0.85, quota: 1.00, spoil: 1
  },
  bayonet_line: {
    id: 'bayonet_line', rarity: 'COMMON', icon: 'blade',
    name: 'Socket bayonets, line pattern',
    line: 'Triangular section, seventeen inches, ground to an edge that only has to be adequate.',
    stations: ['GRINDING'], value: 1.00, output: 1.10, reject: 0.90, quota: 1.00, spoil: 2
  },
  helmet_shell: {
    id: 'helmet_shell', rarity: 'COMMON', icon: 'helmet',
    name: 'Helmet shells, drawn brass',
    line: 'Two blows and a trim. Comb, brim, and a hole for the plume nobody is issued.',
    stations: ['STAMPING'], value: 1.00, output: 1.10, reject: 0.90, quota: 1.00, spoil: 2
  },

  conical_minie: {
    id: 'conical_minie', rarity: 'UNCOMMON', icon: 'cartridge',
    name: 'Conical ball, expanding',
    line: 'Hollow-based conical for the new rifling. It takes the grooves when it is fired, which is the whole idea, and it must be cast true or it does not.',
    stations: ['CASTING'], value: 1.55, output: 0.90, reject: 1.25, quota: 1.35, spoil: 3
  },
  cap_waterproof: {
    id: 'cap_waterproof', rarity: 'UNCOMMON', icon: 'cap',
    name: 'Percussion caps, waterproofed',
    line: 'Sealed with a lacquer for the highland damp, where three in ten of the ordinary ones will not take.',
    stations: ['CAP_BENCH'], value: 1.45, output: 0.88, reject: 1.30, quota: 1.38, spoil: 3
  },
  sword_bayonet: {
    id: 'sword_bayonet', rarity: 'FINE', icon: 'blade',
    name: 'Sword bayonets, rifle pattern',
    line: 'Twenty-two inches, yataghan curve, for the rifle regiments. Ground on two faces and inspected on both.',
    stations: ['GRINDING'], value: 2.10, output: 0.72, reject: 1.55, quota: 1.90, spoil: 7
  },
  lock_plate: {
    id: 'lock_plate', rarity: 'FINE', icon: 'musket',
    name: 'Lock plates, rifled musket',
    line: 'The plate the whole lock hangs off. Struck, filed, and case-hardened, and every one of them is gauged.',
    stations: ['STAMPING'], value: 2.00, output: 0.70, reject: 1.50, quota: 1.95, spoil: 7
  },
  cuirass_plate: {
    id: 'cuirass_plate', rarity: 'RARE', icon: 'helmet',
    name: 'Cuirasses, heavy horse',
    line: 'Breastplates for the heavy cavalry, drawn in three blows and planished by hand. Proofed at forty yards with a service charge; a plate that fails proof is a plate that killed somebody in a drawing room somewhere.',
    stations: ['STAMPING'], value: 3.60, output: 0.45, reject: 1.70, quota: 3.00, spoil: 16
  },
  rifling_blank: {
    id: 'rifling_blank', rarity: 'RARE', icon: 'musket',
    name: 'Barrel blanks, rifled',
    line: 'Bored, reamed and cut with three grooves on a machine that came up from the capital in crates. There are four men in Grimwick who can set it and you are being taught by one of them, badly.',
    stations: ['GRINDING', 'CASTING'], value: 3.40, output: 0.48, reject: 1.65, quota: 2.90, spoil: 15
  },
  breech_block: {
    id: 'breech_block', rarity: 'PROTOTYPE', icon: 'musket',
    name: 'Breech blocks, pattern not adopted',
    line: 'For a breech-loading arm that the Board has not approved and may never approve. Eleven pieces are wanted, each one gauged to a thousandth, each one worth what you make in a fortnight. The drawings are collected at the end of the shift and counted.',
    stations: ['STAMPING', 'CASTING', 'GRINDING'], value: 14.00, output: 0.16, reject: 2.10, quota: 7.50, spoil: 40,
    minAct: 2, requiresWar: 45
  },
  fuze_shell: {
    id: 'fuze_shell', rarity: 'PROTOTYPE', icon: 'cartridge',
    name: 'Percussion fuzes, siege',
    line: 'For the blackpowder shells they are rediscovering for the highland forts. Fulminate in a brass body that has to strike and not before. Two hands were lost to these at the Woolvern works in the spring.',
    stations: ['CAP_BENCH'], value: 12.00, output: 0.18, reject: 2.00, quota: 6.80, spoil: 34,
    minAct: 2, requiresWar: 40
  }
};

/* Wage constants. 26d a day gross is a floor hand's rate in Grimwick. */
/* Invented charges Coom writes in when he has a use for you being poorer. */
var COOM_SKIMS = [
  { key: 'docket.lines.skimBench',  amount: 3 },
  { key: 'docket.lines.skimApron',  amount: 2 },
  { key: 'docket.lines.skimSweep',  amount: 2 },
  { key: 'docket.lines.skimLight',  amount: 4 }
];

var QUOTA = {
  startTarget: 5200,
  ratchetPct: 7,        /* beat it and next week rises by at least this */
  bonus: 14,            /* always smaller than you expected */
  fine: 10,
  warningsToDismissal: 3
};

var WAGE = {
  baseDay: 26,
  dayFloor: 10,         /* the Works' day money: a ruined shift still pays this */
  hours: 12,
  goodDayBonus: 3,
  badDayPenalty: 4,
  rent: 40,          /* 3s 4d a week */
  rentEvery: 7,
  debtInterestPct: 12,
  tickAmount: 6,     /* pence of credit per loaf on tick */
  tickCap: 120
};
