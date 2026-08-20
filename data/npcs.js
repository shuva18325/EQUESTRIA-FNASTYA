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

/* The one dependent the player starts with. */
var STARTING_KIN = [
  { id: 'tamsin', name: 'Tamsin', relation: 'sister', health: 72, mood: 55, status: 'WELL' }
];
