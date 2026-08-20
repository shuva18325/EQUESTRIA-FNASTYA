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
