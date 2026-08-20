/* ==========================================================================
   GRIMWICK WORKS — data/locations.js
   Evening locations and their actions. Mechanics only; text lives in strings.
   Each action: { id, labelKey, hintKey, ap, cost(S)->pence, enabled(S)->true
   or a strings key giving the reason it is barred, run(S)->{textKey, log} }
   The full town map arrives in Prompt 3; these three are honest stubs.
   ========================================================================== */

var LOCATIONS = [
  {
    id: 'market',
    nameKey: 'town.market.name',
    blurbKey: 'town.market.blurb',
    actions: ['buyBread', 'buyCoal', 'buyPhysic', 'apothecary', 'tick', 'readNotice']
  },
  {
    id: 'tenement',
    nameKey: 'town.tenement.name',
    blurbKey: 'town.tenement.blurb',
    actions: ['tendKin', 'dressWound', 'rest', 'mend']
  },
  {
    id: 'tavern',
    nameKey: 'town.tavern.name',
    blurbKey: 'town.tavern.blurb',
    actions: ['drink', 'listen']
  }
];
