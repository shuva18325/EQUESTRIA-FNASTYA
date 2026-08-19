/* ==========================================================================
   GRIMWICK WORKS — data/npcs.js
   People. In Prompt 1 they exist to be referenced by events and the house.
   ========================================================================== */

var NPCS = {
  tamsin:  { id: 'tamsin',  name: 'Tamsin',        relation: 'sister',     age: 9,  where: 'house' },
  hollick: { id: 'hollick', name: 'Mr. Hollick',   relation: 'overlooker', age: 44, where: 'works' },
  barrow:  { id: 'barrow',  name: 'Barrow',        relation: 'bench mate', age: 51, where: 'works' },
  kell:    { id: 'kell',    name: 'Mr. Kell',      relation: 'rent man',   age: 38, where: 'row' },
  ashen:   { id: 'ashen',   name: 'Mother Ashen',  relation: 'neighbour',  age: 67, where: 'row' },
  serjeant:{ id: 'serjeant',name: 'Serjeant Vask', relation: 'recruiter',  age: 33, where: 'tavern' }
};

/* The one dependent the player starts with. */
var STARTING_KIN = [
  { id: 'tamsin', name: 'Tamsin', relation: 'sister', health: 72, mood: 55, status: 'WELL' }
];
