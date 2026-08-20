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

/* Wage constants. 26d a day gross is a floor hand's rate in Grimwick. */
/* Invented charges Coom writes in when he has a use for you being poorer. */
var COOM_SKIMS = [
  { key: 'docket.lines.skimBench',  amount: 3 },
  { key: 'docket.lines.skimApron',  amount: 2 },
  { key: 'docket.lines.skimSweep',  amount: 2 },
  { key: 'docket.lines.skimLight',  amount: 4 }
];

var QUOTA = {
  startTarget: 5900,
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
