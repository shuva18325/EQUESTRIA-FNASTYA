/* ==========================================================================
   GRIMWICK WORKS — js/empire.js
   Imperial attention only, in Prompt 1: notice drifts, the garrison notices
   the noticed. The empire's own events arrive in a later prompt.
   ========================================================================== */

var Empire = {

  /* Weekly: the war moves, and the price of bread moves with it. */
  week: function () {
    var e = S.empire;
    e.week += 1;
    var pressure = (S.time.act - 1) * 4 + 1;
    e.war = Util.clamp100(e.war + Util.rndInt(-3, 5) + pressure);
    /* a war eats men, and the men it does not eat come home and want work */
    e.glut = Util.clamp100(e.glut + Util.rndInt(-2, 4) + (e.war > 60 ? 2 : 0));
    e.levy = e.war > 55 ? 1 : 0;
    e.lastNews = Empire.newsBand();
    Economy.recomputeMarket();
    return e;
  },

  newsBand: function () {
    var w = S.empire.war;
    if (w >= 78) return 'total';
    if (w >= 58) return 'hard';
    if (w >= 38) return 'open';
    if (w >= 18) return 'rumour';
    return 'quiet';
  },

  /* Called once at the start of every day. */
  tick: function () {
    /* attention fades if you give it nothing to look at */
    if (S.standing.notice > 0 && Util.chance(0.5)) {
      S.standing.notice = Util.clamp100(S.standing.notice - 1);
    }
    /* carrying print around a garrison town is its own slow arithmetic */
    if (S.flags.carryingPrint) S.standing.notice = Util.clamp100(S.standing.notice + 2);
    if (S.standing.garrison < -40) S.standing.notice = Util.clamp100(S.standing.notice + 1);
  },

  band: function () { return band(S.standing.notice, 'notice'); },

  /* High notice makes the gate slower and the pockets emptier. */
  searchRisk: function () {
    return Util.clamp(S.standing.notice / 140, 0, 0.5);
  }
};
