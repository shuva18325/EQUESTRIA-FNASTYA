/* ==========================================================================
   GRIMWICK WORKS — data/npcs.js
   People. In Prompt 1 they exist to be referenced by events and the house.
   ========================================================================== */

var NPCS = {
  tamsin:  { id: 'tamsin',  name: 'Tamsin',        relation: 'sister',     age: 9,  where: 'house' },
  coom:    { id: 'coom',    name: 'Overseer Coom', relation: 'overlooker', age: 46, where: 'works' },
  barrow:  { id: 'barrow',  name: 'Barrow',        relation: 'bench mate', age: 51, where: 'works' },
  kell:    { id: 'kell',    name: 'Mr. Kell',      relation: 'rent man',   age: 38, where: 'row' },
  ashen:   { id: 'ashen',   name: 'Mother Ashen',  relation: 'neighbour',  age: 67, where: 'row' },
  serjeant:{ id: 'serjeant',name: 'Serjeant Vask', relation: 'recruiter',  age: 33, where: 'tavern' }
};

/* The bench either side of you. The cap bench is filled with women and girls
   because their hands are smaller and their wage is two thirds of yours, and
   the Works has never pretended otherwise. */
var FLOOR_HANDS = [
  { id: 'lisbet',  name: 'Lisbet Vaunce', age: 14, station: 'CAP_BENCH', alive: true },
  { id: 'annec',   name: 'Anne Corrie',   age: 11, station: 'CAP_BENCH', alive: true },
  { id: 'mother',  name: 'Mother Ashen',  age: 67, station: 'CAP_BENCH', alive: true },
  { id: 'barrow',  name: 'Barrow',        age: 51, station: 'GRINDING',  alive: true },
  { id: 'teague',  name: 'Teague',        age: 29, station: 'CASTING',   alive: true },
  { id: 'wickes',  name: 'Wickes',        age: 17, station: 'STAMPING',  alive: true }
];

var TOWN_NPCS = {
  ostrek:  { id: 'ostrek',  name: 'Ostrek',            role: 'pawnbroker', where: 'pawn' },
  almoner: { id: 'almoner', name: 'The Almoner',       role: 'chapel',     where: 'chapel' },
  bligh:   { id: 'bligh',   name: 'Mrs. Bligh',        role: 'apothecary', where: 'apothecary' },
  serrel:  { id: 'serrel',  name: 'Serrel',            role: 'smuggler',   where: 'railyard' },
  vask:    { id: 'vask',    name: 'Serjeant Vask',     role: 'garrison',   where: 'garrison' },
  moll:    { id: 'moll',    name: 'Moll Tarrow',       role: 'landlady',   where: 'ewe' },
  vane:    { id: 'vane',    name: 'Sarrow Vane',       role: 'union',      where: 'cut' },
  storeman:{ id: 'storeman',name: 'The store clerk',   role: 'company',    where: 'store' }
};

/* ==========================================================================
   KIN — chosen once, at the start, and never chosen again.
   Each one is a different game: a different cost, a different guilt.
   ========================================================================== */
var KIN_OPTIONS = [
  {
    id: 'sister',
    label: 'A younger sister',
    who: 'Tamsin, nine years old',
    blurb: 'She can wind cartridge paper at the table, or she can go on the cap bench beside you for six pence a shift. The bench is where the shake comes from. She does not know that. You do.',
    cost: 'She can work. What working does to her is permanent.',
    kin: { id: 'tamsin', name: 'Tamsin', relation: 'sister', age: 9, health: 72, mood: 55,
           status: 'WELL', canWork: true, working: false, tremor: 0, chronic: null }
  },
  {
    id: 'father',
    label: 'An aging father',
    who: 'Ost Halloran, fifty-eight',
    blurb: 'Thirty-one years on the casting floor and the lungs to show for it. He cannot work and he will not stop offering to. He taught you the trade, and the trade is worth something.',
    cost: 'Medicine every week, or he goes down fast. Starts you a better hand at the casting floor, and able to read.',
    kin: { id: 'ost', name: 'Ost', relation: 'father', age: 58, health: 44, mood: 40,
           status: 'AILING', canWork: false, working: false, tremor: 0, chronic: 'lungs' },
    apply: function (s) {
      s.factory.skills.CASTING = 38;
      s.mind.literacy = 2;
      s.body.lead = 6;
    }
  },
  {
    id: 'child',
    label: 'A small child',
    who: 'Nell, four years old',
    blurb: 'Your brother\u2019s girl. He went for a soldier and the regiment wrote once. She cannot work, cannot be left, and cannot be explained to.',
    cost: 'One hour of your evening, every evening, unless you pay a neighbour to mind her.',
    kin: { id: 'nell', name: 'Nell', relation: 'niece', age: 4, health: 66, mood: 62,
           status: 'WELL', canWork: false, working: false, tremor: 0, chronic: null, needsMinding: true },
    apply: function (s) {
      s.evening.apMax = 1;
      s.evening.ap = 1;
    }
  }
];

/* Kept for saves written before kin were chosen. */
var STARTING_KIN = [KIN_OPTIONS[0].kin];
