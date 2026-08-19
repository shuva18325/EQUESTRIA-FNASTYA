/* ==========================================================================
   GRIMWICK WORKS — js/empire.js
   Imperial attention only, in Prompt 1: notice drifts, the garrison notices
   the noticed. The empire's own events arrive in a later prompt.
   ========================================================================== */

var Empire = {

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
