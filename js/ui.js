/* ==========================================================================
   GRIMWICK WORKS — js/ui.js
   Renders S. Holds no game state of its own: every screen is a pure function
   of the one object. Buttons either act or are disabled with a stated reason.
   ========================================================================== */

function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}
function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }
function $(sel) { return document.querySelector(sel); }

var UI = {

  root: null,
  modalStack: [],

  mount: function () {
    UI.root = $('#app');
    UI.bindKeys();
  },

  /* ---------------------------------------------------------------- button
     The single contract: an action, or a disabled control that says why.
     ------------------------------------------------------------------ */
  button: function (opts) {
    var b = el('button', 'btn' + (opts.primary ? ' btn--primary' : '') + (opts.small ? ' btn--small' : ''));
    if (opts.id) b.id = opts.id;
    b.type = 'button';
    b.appendChild(el('span', 'btn__label', opts.label));

    var reason = opts.reason || null;
    var hint = reason || opts.hint;
    if (hint) b.appendChild(el('span', 'btn__hint', hint));

    if (reason) {
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
      b.title = reason;
    } else {
      b.title = opts.hint || opts.label;
      /* proof, at runtime, that this control does something */
      b.dataset.acts = '1';
      b.addEventListener('click', function (ev) {
        ev.preventDefault();
        Audio.unlock();          /* browsers keep the sound locked until a click */
        opts.onClick();
      });
    }
    return b;
  },

  /* ---------------------------------------------------------------- log */
  log: function (text, kind) {
    if (!S) return;
    S.log.push({ t: text, k: kind || null, day: S.time.day });
    if (S.log.length > 260) S.log.shift();
    UI.renderLog();
  },

  renderLog: function () {
    var box = $('#log');
    if (!box) return;
    clear(box);
    var start = Math.max(0, S.log.length - 40);
    for (var i = start; i < S.log.length; i++) {
      var e = S.log[i];
      var cls = 'logline' + (e.k ? ' logline--' + e.k : '');
      box.appendChild(el('div', cls, e.t));
    }
    box.scrollTop = box.scrollHeight;
  },

  /* ---------------------------------------------------------------- render */
  render: function () {
    if (!S) return;
    document.body.className = 'season-' + S.time.season.replace(' ', '-') + ' phase-' + S.time.phase;
    UI.renderTopbar();
    UI.renderStage();
    UI.renderLog();
    Debug.refresh();
  },

  renderTopbar: function () {
    var bar = $('#topbar');
    clear(bar);
    bar.appendChild(el('div', 'topbar__title', T('app.title')));

    var meta = el('div', 'topbar__meta');
    meta.appendChild(el('span', null, T('hud.day') + ' ' + S.time.day + ' / 60'));
    meta.appendChild(el('span', null, T('hud.act') + ' ' + S.time.act));
    meta.appendChild(el('span', null, T('seasons.' + S.time.season)));
    meta.appendChild(el('span', null, T('weather.' + S.time.weather)));
    bar.appendChild(meta);

    bar.appendChild(el('div', 'topbar__spacer'));

    var tag = el('div', 'tag tag--phase', T('phases.' + S.time.phase));
    bar.appendChild(tag);

    var tools = el('div', 'topbar__tools');
    tools.appendChild(UI.button({
      label: T(S.settings.audio ? 'ui.soundOn' : 'ui.soundOff'), small: true,
      onClick: function () { Audio.setEnabled(!S.settings.audio); Audio.dial(); UI.render(); }
    }));
    tools.appendChild(UI.button({
      label: T('app.menu'), small: true,
      onClick: function () { UI.showMenu(); }
    }));
    bar.appendChild(tools);
  },

  renderStage: function () {
    var stage = $('#stage');
    clear(stage);

    var main = el('div', 'column column--main');
    main.appendChild(UI.phasePanel());
    stage.appendChild(main);

    var aside = el('div', 'column column--aside');
    aside.appendChild(UI.objectivesPanel());
    aside.appendChild(UI.bodyPanel());
    aside.appendChild(UI.housePanel());
    aside.appendChild(UI.standingPanel());
    stage.appendChild(aside);
  },

  /* ---------------------------------------------------------------- phases */
  phasePanel: function () {
    if (S.time.phase === 'SHIFT') return UI.shiftPanel();
    if (S.time.phase === 'EVENING') return UI.eveningPanel();
    return UI.nightPanel();
  },

  panel: function (headText, id) {
    var p = el('section', 'panel');
    if (id) p.id = id;
    var h = el('div', 'panel__head');
    h.appendChild(el('span', null, headText));
    p.appendChild(h);
    var body = el('div', 'panel__body');
    p.appendChild(body);
    p._body = body;
    p._head = h;
    return p;
  },

  shiftPanel: function () {
    var wrap = el('div', 'column');
    var resolved = S.factory.lastOutcome !== null;

    /* the works itself, over everything */
    var banner = el('div', 'works-banner');
    Art.into(banner, Art.works());
    var plate = el('div', 'works-banner__plate');
    plate.appendChild(el('span', 'works-banner__name', T('docket.works')));
    plate.appendChild(el('span', 'works-banner__dept', T('docket.dept')));
    banner.appendChild(plate);
    wrap.appendChild(banner);

    if (!S.job.employed) {
      var off = UI.panel(T('shift.heading'), 'shift-panel');
      off._body.appendChild(el('p', 'prose', T('shift.offRoll')));
      if (!resolved) {
        off._body.appendChild(UI.actions([
          UI.button({
            id: 'btn-work', primary: true,
            label: T('shift.gateWait'), hint: T('shift.gateWaitHint'),
            onClick: function () { Loop.gateWait(); }
          })
        ]));
      } else {
        off._body.appendChild(el('p', 'prose', T('shift.' + (S.factory.lastOutcome === 'casual' ? 'casualNone' : 'casualGot'))));
        off._body.appendChild(UI.actions([
          UI.button({
            id: 'btn-leave-gate', primary: true,
            label: T('shift.leaveGate'), hint: T('shift.leaveGateHint'),
            onClick: function () { Loop.toEvening(); }
          })
        ]));
      }
      wrap.appendChild(off);
      return wrap;
    }

    var st = S.factory.station;

    /* ---- the floor you are on ---- */
    var floor = UI.panel(T('shift.heading'), 'shift-panel');
    floor._head.appendChild(el('span', null, T('shift.stations.' + st + '.name')));
    var art = el('div', 'station-art');
    Art.into(art, Art.station(st));
    floor._body.appendChild(art);
    floor._body.appendChild(el('p', 'prose', T('shift.stations.' + st + '.line')));
    var haz = el('p', 'prose prose--dim hazard-line');
    haz.appendChild(el('span', 'hazard-line__label', T('shift.stations.' + st + '.hazard')));
    floor._body.appendChild(haz);
    floor._body.appendChild(UI.kv(T('shift.tally.skill'),
      Math.round(Factory.skill(st)) + ' · ' + band(Factory.skill(st), 'skill')));
    wrap.appendChild(floor);

    /* ---- the count ---- */
    wrap.appendChild(UI.quotaPanel());

    if (!resolved) {
      /* ---- the dials ---- */
      wrap.appendChild(UI.dialsPanel());
      /* ---- Coom ---- */
      wrap.appendChild(UI.foremanPanel());

      var go = UI.panel(T('phases.SHIFT'), 'shift-go');
      go._body.appendChild(el('p', 'prose prose--dim', T('phases.shiftBlurb')));
      go._body.appendChild(UI.actions([
        UI.button({
          id: 'btn-work', primary: true,
          label: T('shift.work'), hint: T('shift.workHint'),
          onClick: function () { Loop.work(); }
        }),
        UI.button({
          id: 'btn-abstain',
          label: T('shift.abstain'), hint: T('shift.abstainHint'),
          onClick: function () { Loop.skip(); }
        })
      ]));
      wrap.appendChild(go);
    } else {
      wrap.appendChild(UI.tallyPanel());
    }
    return wrap;
  },

  quotaPanel: function () {
    var q = Factory.quotaProgress();
    var p = UI.panel(T('shift.quota.heading'), 'quota-panel');
    p._head.appendChild(el('span', null, T('shift.quota.week', { n: q.week })));
    var b = p._body;

    var bar = el('div', 'quota-bar');
    var fill = el('div', 'quota-bar__fill');
    fill.style.width = Util.clamp(Math.round(q.made / Math.max(1, q.target) * 100), 0, 100) + '%';
    if (q.made >= q.target) fill.className += ' quota-bar__fill--met';
    bar.appendChild(fill);
    b.appendChild(bar);

    b.appendChild(UI.kv(T('shift.quota.required'), String(q.target)));
    b.appendChild(UI.kv(T('shift.quota.made'), String(q.made), q.made >= q.target ? 'good' : null));
    b.appendChild(UI.kv(T('shift.quota.remaining'), String(q.remaining), q.remaining > 0 ? 'bad' : 'good'));
    b.appendChild(UI.kv(T('shift.quota.shiftsLeft', { n: q.shiftsLeft }), ''));
    if (q.lastTarget) {
      b.appendChild(el('div', 'ratchet', T('shift.quota.ratchet', { old: q.lastTarget, next: q.target })));
    }
    if (S.job.warnings > 0) {
      b.appendChild(UI.kv(T('shift.quota.warningsLabel'),
        S.job.warnings + ' / ' + QUOTA.warningsToDismissal, 'bad'));
    }
    return p;
  },

  dialsPanel: function () {
    var p = UI.panel(T('shift.dials.heading'), 'dials-panel');
    var b = p._body;

    function row(kind, optsKey, table, current) {
      var r = el('div', 'dial');
      r.appendChild(el('div', 'dial__name', T('shift.dials.' + kind)));
      var seg = el('div', 'dial__seg');
      for (var key in table) {
        if (!Object.prototype.hasOwnProperty.call(table, key)) continue;
        (function (k) {
          var copy = T('shift.dials.' + optsKey + '.' + k);
          var btn = UI.button({
            small: true,
            label: copy.label,
            hint: copy.hint,
            onClick: function () { Loop.setDial(kind, k); }
          });
          btn.className += ' dial__opt' + (current === k ? ' dial__opt--on' : '');
          btn.setAttribute('aria-pressed', current === k ? 'true' : 'false');
          if (kind === 'guard' && k === 'off') btn.className += ' dial__opt--off';
          seg.appendChild(btn);
        })(key);
      }
      r.appendChild(seg);
      return r;
    }

    b.appendChild(row('pace', 'paceOpts', PACE, S.factory.pace));
    b.appendChild(row('care', 'careOpts', CARE, S.factory.care));
    b.appendChild(row('guard', 'guardOpts', GUARD, S.factory.guard));

    /* the forecast tells you output and money. it does not tell you the odds
       of losing a hand, because nobody on the floor is told that either. */
    var est = Factory.estimate();
    var f = el('div', 'forecast');
    var icon = el('span', 'forecast__icon');
    Art.into(icon, Art.icon(Art.unitIcon(S.factory.station), 30));
    f.appendChild(icon);
    var ftext = el('div', 'forecast__text');
    ftext.appendChild(el('div', null, est.good + ' ' + T('shift.stations.' + S.factory.station + '.units')
      + ' · ' + Economy.money(est.wage)));
    ftext.appendChild(el('div', 'forecast__sub', T('shift.tally.credit') + ' ' + est.credits));
    f.appendChild(ftext);
    b.appendChild(f);
    return p;
  },

  foremanPanel: function () {
    var p = UI.panel(T('foreman.heading'), 'foreman-panel');
    p._head.appendChild(el('span', null, T('foreman.name')));
    var b = p._body;
    b.appendChild(el('p', 'prose', T(Coom.moodKey())));
    b.appendChild(UI.kv(T('foreman.standing'),
      S.standing.foreman + ' · ' + standingBand(S.standing.foreman),
      S.standing.foreman < -25 ? 'bad' : (S.standing.foreman > 25 ? 'good' : null)));

    var opts = Coom.options();
    var list = el('div', 'actions');
    for (var i = 0; i < opts.length; i++) {
      (function (o) {
        list.appendChild(UI.button({
          label: T(o.labelKey, o.params),
          hint: T(o.hintKey),
          reason: o.reason ? T(o.reason) : null,
          onClick: function () { Loop.foremanChoice(o.id); }
        }));
      })(opts[i]);
    }
    list.appendChild(UI.button({
      label: T('shift.transfer.request'),
      hint: T('shift.transfer.requestHint'),
      reason: (S.factory.transfer && S.factory.transfer.day === S.time.day) ? T('shift.transfer.pending') : null,
      onClick: function () { UI.showTransfer(); }
    }));
    b.appendChild(list);
    return p;
  },

  tallyPanel: function () {
    var sh = S.factory.shift;
    var p = UI.panel(T('shift.tally.heading'), 'tally-panel');
    var b = p._body;

    if (!sh) {
      b.appendChild(el('p', 'prose', T(S.factory.lastOutcome === 'absent' ? 'shift.abstained' : 'shift.tally.nothing')));
    } else {
      var head = el('div', 'tally-head');
      var ic = el('span', 'tally-head__icon');
      Art.into(ic, Art.icon(Art.unitIcon(sh.station), 44));
      head.appendChild(ic);
      var ht = el('div');
      ht.appendChild(el('div', 'tally-head__big', String(sh.good) + ' ' + T('shift.stations.' + sh.station + '.units')));
      ht.appendChild(el('div', 'tally-head__sub', T('shift.tally.passed')));
      head.appendChild(ht);
      b.appendChild(head);

      b.appendChild(UI.kv(T('shift.tally.made'), String(sh.output)));
      b.appendChild(UI.kv(T('shift.tally.rejected'), String(sh.rejects), sh.rejects > sh.output * 0.09 ? 'bad' : null));
      b.appendChild(UI.kv(T('shift.tally.credit'), String(sh.credits), 'good'));
      b.appendChild(UI.kv(T('shift.tally.wage'), Economy.money(sh.wage)));
      b.appendChild(UI.kv(T('shift.tally.hours'), String(sh.hours)));
      if (sh.skillGain) b.appendChild(UI.kv(T('shift.tally.skill'), T('shift.tally.skillUp', { n: sh.skillGain })));
      b.appendChild(el('p', 'prose', T('shift.outcomes.' + (sh.outcome === 'absent' ? 'normal' : sh.outcome))));
    }

    b.appendChild(UI.actions([
      UI.button({
        id: 'btn-leave-gate', primary: true,
        label: T('shift.leaveGate'), hint: T('shift.leaveGateHint'),
        onClick: function () { Loop.toEvening(); }
      })
    ]));
    return p;
  },

  eveningPanel: function () {
    var wrap = el('div', 'column');

    if (S.destitution.workhouse) {
      wrap.appendChild(UI.workhousePanel());
      return wrap;
    }

    /* ---- where you are, and what is left of the evening ---- */
    var map = UI.panel(T('town.heading'), 'evening-panel');
    map._head.appendChild(el('span', null, T('hud.apLeft') + ': ' + S.evening.ap + ' / ' + S.evening.apMax));
    var body = map._body;

    if (!S.house.housed) {
      body.appendChild(el('div', 'destitute-note', T('destitution.note')));
    }

    var where = el('div', 'where');
    where.appendChild(el('span', null, T('town.youAre')));
    var hereLoc = Town.location(Town.here());
    where.appendChild(el('span', 'where__name', hereLoc ? hereLoc.name : ''));
    where.appendChild(el('span', null, T('town.district.' + Town.districtOf(Town.here()))));
    body.appendChild(where);

    body.appendChild(UI.mapNode());

    if (S.evening.ap <= 0) body.appendChild(el('p', 'prose prose--dim', T('hud.noneLeft')));
    wrap.appendChild(map);

    /* ---- the place itself ---- */
    wrap.appendChild(UI.placePanel());

    var turn = UI.panel(T('phases.NIGHT'), 'evening-end');
    turn._body.appendChild(UI.actions([
      UI.button({
        id: 'btn-turn-in', primary: true,
        label: T('town.actions.endEvening'), hint: T('town.actions.endEveningHint'),
        onClick: function () { Loop.endEvening(); }
      })
    ]));
    wrap.appendChild(turn);
    return wrap;
  },

  /* The node map. Roads are drawn; the labels are buttons over the top so
     they stay legible at any width, and collapse to a list on a phone. */
  mapNode: function () {
    var box = el('div', 'map');
    var inner = el('div', 'map__inner');
    var here = Town.here();
    var meta = { visible: {}, reach: {}, far: {} };
    var locs = Town.locations(), i;

    for (i = 0; i < locs.length; i++) {
      var l = locs[i];
      meta.visible[l.id] = Town.visible(l);
      meta.far[l.id] = l.district;
      meta.reach[l.id] = Town.canTravel(l.id) === true;
    }
    var svgHost = el('div', 'map__svg');
    Art.into(svgHost, Art.townMap(meta, here));
    box.appendChild(svgHost);

    for (i = 0; i < locs.length; i++) {
      (function (loc) {
        if (!Town.visible(loc)) return;
        var isHere = loc.id === here;
        var can = Town.canTravel(loc.id);
        var cost = Town.travelCost(loc.id);
        var b = UI.button({
          label: loc.name,
          hint: '',
          reason: (isHere || can === true) ? null : T(can),
          onClick: function () { Loop.travel(loc.id); }
        });
        b.className = 'map__node' + (isHere ? ' map__node--here' : '');
        clear(b);
        b.appendChild(el('span', null, loc.name));
        b.appendChild(el('span', 'map__cost', isHere ? T('town.hereNow')
          : (cost === 0 ? T('town.nearby') : T('town.hoursWalk', { n: cost }))));
        if (isHere) { b.disabled = true; b.title = T('town.hereNow'); }
        var pos = Art.mapPositions[loc.id];
        if (pos) {
          b.style.left = (pos.x / 640 * 100) + '%';
          b.style.top = (pos.y / 360 * 100) + '%';
        }
        inner.appendChild(b);
      })(locs[i]);
    }
    box.appendChild(inner);
    return box;
  },

  placePanel: function () {
    var loc = Town.location(Town.here());
    if (!loc) return el('div');
    var p = UI.panel(loc.name, 'place-panel');
    p._head.appendChild(el('span', null, loc.sub));
    var b = p._body;
    b.appendChild(el('p', 'prose prose--dim',
      (loc.id === 'rows' && !S.house.housed) ? loc.blurbStreet : loc.blurb));

    var ids = Town.actionsAt(loc.id);
    var list = el('div', 'actions');
    for (var i = 0; i < ids.length; i++) {
      var d = Town.describe(ids[i]);
      if (!d) continue;
      (function (desc) {
        list.appendChild(UI.button({
          label: desc.label + (desc.free ? '' : ''),
          hint: desc.hint,
          reason: desc.disabledReason,
          onClick: function () { Loop.act(desc.id); }
        }));
      })(d);
    }
    b.appendChild(list);
    return p;
  },

  workhousePanel: function () {
    var p = UI.panel(T('destitution.workhouseHeading'), 'workhouse-panel');
    p._body.appendChild(el('p', 'prose', T('destitution.workhouseBlurb')));
    p._body.appendChild(UI.kv(T('destitution.daysInside'), String(S.destitution.workhouseDays)));
    var list = el('div', 'actions');
    for (var i = 0; i < WORKHOUSE_ACTIONS.length; i++) {
      var d = Town.describe(WORKHOUSE_ACTIONS[i]);
      if (!d) continue;
      (function (desc) {
        list.appendChild(UI.button({
          label: desc.label, hint: desc.hint, reason: desc.disabledReason,
          onClick: function () { Loop.act(desc.id); }
        }));
      })(d);
    }
    p._body.appendChild(list);
    p._body.appendChild(UI.actions([
      UI.button({
        id: 'btn-turn-in', primary: true,
        label: T('town.actions.endEvening'), hint: T('town.actions.endEveningHint'),
        onClick: function () { Loop.endEvening(); }
      })
    ]));
    return p;
  },

  /* ---------------------------------------------------- the market board */
  showBoard: function () {
    var scrim;
    var m = UI.modal(T('board.heading'), function (body) {
      body.appendChild(el('p', 'prose prose--dim', T('board.war.' + Empire.newsBand())));
      var t = document.createElement('table');
      t.className = 'board';
      var head = document.createElement('tr');
      [T('board.item'), T('board.lastWeek'), T('board.thisWeek'), T('board.change'), T('board.store')]
        .forEach(function (h) {
          var th = document.createElement('th');
          th.textContent = h;
          head.appendChild(th);
        });
      t.appendChild(head);
      var rows = Economy.board();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var tr = document.createElement('tr');
        function cell(text, cls) {
          var td = document.createElement('td');
          td.textContent = text;
          if (cls) td.className = cls;
          tr.appendChild(td);
        }
        cell(T('board.items.' + r.id));
        cell(Economy.money(r.was));
        cell(Economy.money(r.now));
        cell((r.delta > 0 ? '+' : '') + (r.delta === 0 ? T('board.same') : Economy.money(r.delta)),
          r.delta > 0 ? 'up' : (r.delta < 0 ? 'down' : 'flat'));
        cell(Economy.money(r.store), 'board__store');
        t.appendChild(tr);
      }
      body.appendChild(t);
      body.appendChild(el('p', 'prose prose--dim', T('board.storeNote')));
      body.appendChild(UI.actions([
        UI.button({ label: T('app.close'), primary: true, onClick: function () { UI.closeModal(scrim); } })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  showLedger: function () {
    var scrim;
    var m = UI.modal(T('ledger.heading'), function (body) {
      body.appendChild(el('p', 'prose', T('ledger.blurb')));
      body.appendChild(UI.kv(T('ledger.owed'), Economy.money(S.purse.debt), S.purse.debt > 0 ? 'bad' : null));
      body.appendChild(UI.kv(T('ledger.interest'),
        Economy.money(Math.ceil(S.purse.debt * WAGE.debtInterestPct / 100)) + ' · ' + WAGE.debtInterestPct + '%'));
      body.appendChild(UI.kv(T('ledger.stopped'), Economy.money(S.storeTakeThisDay || 0)));
      body.appendChild(el('p', 'prose prose--dim', T('ledger.note')));
      body.appendChild(UI.actions([
        UI.button({ label: T('app.close'), primary: true, onClick: function () { UI.closeModal(scrim); } })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  showAdvice: function () {
    var scrim;
    var m = UI.modal(T('advice.heading'), function (body) {
      body.appendChild(el('p', 'prose', T('advice.opening')));
      var lines = [];
      if (S.body.dust > 40) lines.push(T('advice.dust'));
      if (S.body.tremor > 40) lines.push(T('advice.tremor'));
      if (S.body.lead > 40) lines.push(T('advice.lead'));
      if (S.body.injury && S.body.injury.fever) lines.push(T('advice.fever'));
      else if (S.body.injury) lines.push(T('advice.wound'));
      if (S.body.hunger > 70) lines.push(T('advice.hunger'));
      if (!lines.length) lines.push(T('advice.nothingYet'));
      for (var i = 0; i < lines.length; i++) body.appendChild(el('p', 'prose', lines[i]));
      body.appendChild(el('p', 'prose prose--dim', T('advice.closing')));
      body.appendChild(UI.actions([
        UI.button({ label: T('app.close'), primary: true, onClick: function () { UI.closeModal(scrim); } })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  /* ------------------------------------------------------ Ostrek's window */
  showPawn: function (mode) {
    var scrim;
    var title = mode === 'redeem' ? T('pawn.redeemHeading') : (mode === 'sell' ? T('pawn.sellHeading') : T('pawn.heading'));
    var m = UI.modal(title, function (body) {
      body.appendChild(el('p', 'prose prose--dim', T(mode === 'redeem' ? 'pawn.redeemBlurb' : 'pawn.blurb')));
      var items = mode === 'redeem' ? Town.pawnedList() : Town.pawnList();
      if (!items.length) body.appendChild(el('p', 'prose', T('pawn.nothing')));
      var list = el('div', 'actions');
      for (var i = 0; i < items.length; i++) {
        (function (it) {
          var price = mode === 'redeem' ? it.redeem : (mode === 'sell' ? it.pawn + 2 : it.pawn);
          var reason = null;
          if (S.evening.ap < 1) reason = T('disabled.noAp');
          else if (mode === 'redeem' && !Economy.canAfford(it.redeem)) reason = T('disabled.noPennies');
          list.appendChild(UI.button({
            label: it.name + ' — ' + Economy.money(price),
            hint: mode === 'redeem' ? T('pawn.redeemHint') : (it.note + ' ' + T('pawn.backFor', { p: Economy.money(it.redeem) })),
            reason: reason,
            onClick: function () {
              var res = mode === 'redeem' ? Town.redeemItem(it.id) : Town.pawnItem(it.id, mode === 'sell');
              UI.closeModal(scrim);
              if (res) UI.showResult(res, function () { UI.render(); });
              else UI.render();
            }
          }));
        })(items[i]);
      }
      body.appendChild(list);
      body.appendChild(UI.actions([
        UI.button({ label: T('app.close'), onClick: function () { UI.closeModal(scrim); } })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  /* ------------------------------------------------------ who you keep */
  showCreation: function (onDone) {
    var scrim;
    var m = UI.modal(T('creation.heading'), function (body) {
      body.appendChild(el('p', 'prose', T('creation.blurb')));
      var wrap = el('div', 'creation');
      for (var i = 0; i < KIN_OPTIONS.length; i++) {
        (function (opt) {
          var b = el('button', 'creation__opt');
          b.type = 'button';
          b.dataset.acts = '1';
          b.title = opt.label;
          b.appendChild(el('div', 'creation__who', opt.label + ' — ' + opt.who));
          b.appendChild(el('div', 'creation__blurb', opt.blurb));
          b.appendChild(el('div', 'creation__cost', opt.cost));
          b.addEventListener('click', function () {
            UI.closeModal(scrim);
            Audio.unlock();
            if (onDone) onDone(opt.id);
          });
          wrap.appendChild(b);
        })(KIN_OPTIONS[i]);
      }
      body.appendChild(wrap);
    });
    scrim = UI.openModal(m);
  },

  nightPanel: function () {
    var p = UI.panel(T('night.heading'), 'night-panel');
    var body = p._body;
    body.appendChild(el('p', 'prose', T('phases.nightBlurb')));

    var house = el('div', 'stats');
    house.appendChild(UI.kv(T('hud.larder'), T('hud.mealsLeft', { n: S.house.larder })));
    house.appendChild(UI.kv(T('hud.coal'), T('hud.daysLeft', { n: S.house.coal })));
    body.appendChild(house);

    if (Loop.needsShareChoice()) {
      body.appendChild(el('p', 'prose', T('night.shareChoice')));
      body.appendChild(UI.actions([
        UI.button({
          label: T('night.shareSelf'), hint: T('night.shareSelfHint'),
          onClick: function () { Loop.bedDown('self'); }
        }),
        UI.button({
          label: T('night.shareKin'), hint: T('night.shareKinHint'),
          onClick: function () { Loop.bedDown('kin'); }
        }),
        UI.button({
          label: T('night.shareSplit'), hint: T('night.shareSplitHint'),
          onClick: function () { Loop.bedDown('split'); }
        })
      ]));
    } else {
      body.appendChild(UI.actions([
        UI.button({
          id: 'btn-bed', primary: true,
          label: T('night.bedDown'), hint: T('night.bedDownHint'),
          onClick: function () { Loop.bedDown(null); }
        })
      ]));
    }
    return p;
  },

  actions: function (buttons) {
    var wrap = el('div', 'actions');
    for (var i = 0; i < buttons.length; i++) wrap.appendChild(buttons[i]);
    return wrap;
  },

  kv: function (k, v, cls) {
    var row = el('div', 'kv');
    row.appendChild(el('span', 'kv__k', k));
    row.appendChild(el('span', 'kv__v' + (cls ? ' kv__v--' + cls : ''), v));
    return row;
  },

  /* ---------------------------------------------------------------- aside */
  objectivesPanel: function () {
    var p = UI.panel(T('hud.objectives'), 'objectives');
    var body = p._body;

    var line = el('div', 'kv');
    line.appendChild(el('span', 'kv__k', T('hud.day') + ' ' + S.time.day + ' · ' + T('hud.act') + ' ' + S.time.act));
    line.appendChild(el('span', 'kv__v', T('phases.' + S.time.phase)));
    body.appendChild(line);

    var goal = Narrative.goal();
    var g = el('div', 'objective');
    g.appendChild(el('span', 'objective__label', T('hud.goal')));
    g.appendChild(el('div', 'objective__text', T(goal.key, goal.params)));
    body.appendChild(g);

    var dl = Narrative.deadline();
    var d = el('div', 'objective deadline');
    d.appendChild(el('span', 'objective__label', T('hud.deadline')));
    d.appendChild(el('div', 'objective__text', T(dl.key, dl.params)));
    body.appendChild(d);

    return p;
  },

  statRow: function (nameKey, value, bandKey, opts) {
    opts = opts || {};
    var row = el('div', 'stat' + (opts.permanent ? ' stat--perm' : ''));
    row.appendChild(el('span', 'stat__name', T(nameKey)));
    var bar = el('div', 'stat__bar');
    var fill = el('div', 'stat__fill' + (opts.fillClass ? ' stat__fill--' + opts.fillClass : ''));
    fill.style.width = Util.clamp(value, 0, 100) + '%';
    bar.appendChild(fill);
    row.appendChild(bar);
    var label = bandKey ? band(value, bandKey, !!opts.invertBand) : String(value);
    row.appendChild(el('span', 'stat__val', value + ' · ' + label));
    if (opts.permanent) row.title = T('stats.permanent');
    return row;
  },

  bodyPanel: function () {
    var p = UI.panel(T('hud.body'), 'body-panel');
    var b = S.body, body = p._body;
    var stats = el('div', 'stats');
    stats.appendChild(UI.statRow('stats.health', b.health, 'health', { fillClass: b.health < 35 ? 'bad' : 'good' }));
    stats.appendChild(UI.statRow('stats.fatigue', b.fatigue, 'fatigue', { fillClass: b.fatigue > 70 ? 'bad' : 'warn' }));
    stats.appendChild(UI.statRow('stats.hunger', b.hunger, 'hunger', { fillClass: b.hunger > 70 ? 'bad' : 'warn' }));
    stats.appendChild(UI.statRow('stats.warmth', b.warmth, 'warmth', { fillClass: b.warmth < 30 ? 'bad' : 'good' }));
    stats.appendChild(UI.statRow('stats.dust', b.dust, 'dust', { fillClass: 'perm', permanent: true }));
    stats.appendChild(UI.statRow('stats.tremor', b.tremor, 'tremor', { fillClass: 'perm', permanent: true }));
    stats.appendChild(UI.statRow('stats.lead', b.lead, 'lead', { fillClass: 'perm', permanent: true }));
    stats.appendChild(UI.statRow('stats.resolve', S.mind.resolve, 'resolve', { fillClass: 'warn' }));
    body.appendChild(stats);

    body.appendChild(UI.kv(T('stats.literacy'), T('literacy')[S.mind.literacy]));
    body.appendChild(UI.kv(
      T('hud.injury'),
      b.injury ? T('injuries.' + b.injury.type) : T('hud.injuryNone'),
      b.injury ? 'bad' : null
    ));
    if (b.injury) {
      body.appendChild(UI.kv(T('hud.wound'),
        (b.injury.fever ? T('hud.fever') : T('hud.infection')) + ' ' + Math.round(b.injury.infection || 0),
        (b.injury.fever || (b.injury.infection || 0) > 50) ? 'bad' : null));
    }
    if (b.scars.length) {
      var names = [];
      for (var si = 0; si < b.scars.length; si++) names.push(T('injuries.' + b.scars[si].type));
      body.appendChild(UI.kv(T('hud.scars'), names.join(', '), 'bad'));
    }
    return p;
  },

  housePanel: function () {
    var p = UI.panel(T('hud.house'), 'house-panel');
    var body = p._body;
    body.appendChild(UI.kv(T('hud.purse'), Economy.money(S.purse.pennies)));
    body.appendChild(UI.kv(T('hud.debt'), Economy.money(S.purse.debt), S.purse.debt > 0 ? 'bad' : null));
    body.appendChild(UI.kv(T('hud.rentAmount'), Economy.money(S.house.rentAmount) + ' · ' + T('hud.rentDue', { d: S.house.rentDue })));
    body.appendChild(UI.kv(T('hud.larder'), T('hud.mealsLeft', { n: S.house.larder }), S.house.larder <= 0 ? 'bad' : null));
    body.appendChild(UI.kv(T('hud.coal'), T('hud.daysLeft', { n: S.house.coal }), S.house.coal <= 0 ? 'bad' : null));

    body.appendChild(UI.kv(T('hud.roof'),
      S.destitution.workhouse ? T('hud.roofWorkhouse') : (S.house.housed ? T('hud.roofRoom') : T('hud.roofStreet')),
      S.house.housed ? null : 'bad'));
    if (S.house.goods.length) {
      var gn = [];
      for (var gi = 0; gi < S.house.goods.length; gi++) {
        var gd = GOODS[S.house.goods[gi].id];
        if (gd) gn.push(gd.name + (S.house.goods[gi].stashed ? T('hud.stashed') : ''));
      }
      body.appendChild(UI.kv(T('hud.goods'), gn.join(', ')));
    }
    if (S.house.pawned.length) {
      body.appendChild(UI.kv(T('hud.pawned'), String(S.house.pawned.length), 'bad'));
    }

    var k = State.kin();
    if (k) {
      body.appendChild(el('div', 'divider'));
      body.appendChild(UI.kv(k.name + ', ' + k.relation, T('hud.kinStatus.' + k.status),
        (k.status === 'FEVERED' || k.status === 'DEAD' || k.status === 'TAKEN') ? 'bad' : null));
      if (k.working) body.appendChild(UI.kv(T('hud.kinWorking'), T('hud.kinTremor', { n: Math.round(k.tremor || 0) }), 'bad'));
      if (k.status !== 'DEAD' && k.status !== 'TAKEN') {
        var stats = el('div', 'stats');
        stats.appendChild(UI.statRow('stats.health', k.health, 'health', { fillClass: k.health < 40 ? 'bad' : 'good' }));
        body.appendChild(stats);
      }
    }
    return p;
  },

  standingPanel: function () {
    var p = UI.panel(T('hud.standing'), 'standing-panel');
    var body = p._body;
    body.appendChild(UI.kv(T('stats.foreman'), S.standing.foreman + ' · ' + standingBand(S.standing.foreman)));
    body.appendChild(UI.kv(T('stats.workmates'), S.standing.workmates + ' · ' + standingBand(S.standing.workmates)));
    body.appendChild(UI.kv(T('stats.garrison'), S.standing.garrison + ' · ' + standingBand(S.standing.garrison)));
    body.appendChild(UI.kv(T('stats.notice'), S.standing.notice + ' · ' + Empire.band(), S.standing.notice > 50 ? 'bad' : null));
    return p;
  },

  /* ---------------------------------------------------------------- modals */
  openModal: function (node, opts) {
    opts = opts || {};
    var scrim = el('div', 'scrim fade-in');
    scrim.appendChild(node);
    scrim.dataset.dismissible = opts.dismissible ? '1' : '0';
    document.body.appendChild(scrim);
    UI.modalStack.push(scrim);
    var first = scrim.querySelector('button:not([disabled])');
    if (first) first.focus();
    return scrim;
  },

  closeModal: function (scrim) {
    var idx = UI.modalStack.indexOf(scrim);
    if (idx >= 0) UI.modalStack.splice(idx, 1);
    if (scrim && scrim.parentNode) scrim.parentNode.removeChild(scrim);
  },

  closeAll: function () {
    while (UI.modalStack.length) UI.closeModal(UI.modalStack[UI.modalStack.length - 1]);
    Tutorial.hide();
  },

  modal: function (title, buildBody) {
    var m = el('div', 'modal');
    m.appendChild(el('div', 'modal__head', title));
    var body = el('div', 'modal__body');
    m.appendChild(body);
    buildBody(body, m);
    return m;
  },

  /* ---- event modal ---- */
  showEvent: function (evt, onDone) {
    var scrim;
    var here = (S.time.phase === 'EVENING') ? Town.here() : null;
    var m = UI.modal(Events.titleOf(evt), function (body) {
      body.appendChild(el('p', 'prose', Events.textOf(evt)));
      var choices = Events.describeChoices(evt, here);
      var wrap = el('div', 'actions');
      for (var i = 0; i < choices.length; i++) {
        (function (c) {
          wrap.appendChild(UI.button({
            label: c.label, hint: c.hint, reason: c.disabledReason,
            onClick: function () {
              var result = Events.choose(evt, c.id, here);
              UI.closeModal(scrim);
              Audio.thunk();
              if (result) UI.showResult(result, onDone);
              else if (onDone) onDone();
            }
          }));
        })(choices[i]);
      }
      body.appendChild(wrap);
    });
    scrim = UI.openModal(m);
  },

  /* ---- short result modal ---- */
  showResult: function (text, onDone) {
    var scrim;
    var m = UI.modal(T('ui.outcome'), function (body) {
      body.appendChild(el('p', 'prose', text));
      body.appendChild(UI.actions([
        UI.button({
          label: T('ui.continueBtn'), primary: true,
          onClick: function () { UI.closeModal(scrim); if (onDone) onDone(); }
        })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  /* ---- THE DOCKET ---- */
  showDocket: function (docket, onDone) {
    var scrim;
    var wrap = el('div', 'docket-wrap');
    var d = el('div', 'docket docket-enter');
    d.id = 'docket';

    d.appendChild(el('div', 'docket__works', T('docket.works')));
    d.appendChild(el('div', 'docket__dept', T('docket.dept')));
    d.appendChild(el('div', 'docket__title', T('docket.title')));

    function metaRow(k, v) {
      var r = el('div', 'docket__row docket__row--meta');
      r.appendChild(el('span', null, k));
      r.appendChild(el('span', null, v));
      return r;
    }
    d.appendChild(metaRow(T('docket.hand'), T('docket.handValue')));
    d.appendChild(metaRow(T('docket.dayLabel'), String(docket.day) + ' · ' + T('seasons.' + docket.season)));
    d.appendChild(metaRow(T('docket.hoursLabel'), String(docket.hours)));
    d.appendChild(metaRow(T('docket.stationLabel'), T(docket.stationKey)));

    d.appendChild(el('div', 'docket__rule'));

    function item(label, amount, cls) {
      var row = el('div', 'docket__item' + (cls ? ' ' + cls : ''));
      row.appendChild(el('span', 'lead', label));
      row.appendChild(el('span', 'amt', Economy.money(amount)));
      return row;
    }

    if (docket.pieces) {
      d.appendChild(metaRow(T('docket.pieces'), String(docket.pieces) + ' ' + T(docket.unitKey)));
    }
    d.appendChild(el('div', 'docket__rule'));
    d.appendChild(item(T('docket.gross'), docket.gross));
    if (docket.bonus) d.appendChild(item(T('docket.bonusLine'), docket.bonus));
    if (docket.kinWage) d.appendChild(item(T('docket.kinWage', { name: docket.kinName }), docket.kinWage));
    d.appendChild(el('div', 'docket__section', T('docket.deductions')));

    if (docket.lines.length === 0) {
      d.appendChild(el('div', 'docket__row', T('docket.noDeductions')));
    } else {
      for (var i = 0; i < docket.lines.length; i++) {
        var line = docket.lines[i];
        d.appendChild(item(T(line.key, line.params), line.amount));
      }
    }

    var net = el('div', 'docket__net' + (docket.net < 0 ? ' docket__net--red' : ''));
    net.appendChild(el('span', null, T('docket.net')));
    net.appendChild(el('span', null, Economy.money(docket.net)));
    d.appendChild(net);

    if (docket.carried > 0) {
      d.appendChild(item(T('docket.carried'), docket.carried));
    }
    if (docket.debtAfter > 0) {
      d.appendChild(item(T('docket.owed'), docket.debtAfter));
    }

    d.appendChild(el('div', 'docket__note', T(docket.noteKey || 'docket.bodyNotes.default')));
    d.appendChild(el('div', 'docket__clerk', T('docket.clerkNote')));
    d.appendChild(el('div', 'docket__stamp', T('docket.stamp')));

    wrap.appendChild(d);

    var m = el('div', 'modal');
    var body = el('div', 'modal__body');
    body.appendChild(wrap);
    body.appendChild(UI.actions([
      UI.button({
        id: 'btn-press-on', primary: true,
        label: T('docket.press'),
        onClick: function () { UI.closeModal(scrim); Tutorial.onDocketClosed(); if (onDone) onDone(); }
      })
    ]));
    m.appendChild(body);
    scrim = UI.openModal(m);
    Tutorial.onDocket();
  },

  /* ---- milestone (day 10) ---- */
  showMilestone: function () {
    var scrim;
    var m = UI.modal(T('endings.survived_prompt.title'), function (body) {
      body.appendChild(el('p', 'prose', T('endings.survived_prompt.text')));
      body.appendChild(el('p', 'prose prose--dim', T('endings.survived_prompt.epitaph')));
      body.appendChild(UI.actions([
        UI.button({
          label: T('endings.milestone_continue'), primary: true,
          onClick: function () { UI.closeModal(scrim); UI.render(); }
        })
      ]));
    });
    scrim = UI.openModal(m);
  },

  /* ---- ending ---- */
  showEnding: function (endingId) {
    UI.closeAll();
    var key = 'endings.' + (endingId || 'death_sick');
    var scrim;
    var m = UI.modal(T(key + '.title'), function (body) {
      body.appendChild(el('p', 'prose', T(key + '.text')));
      body.appendChild(el('p', 'prose prose--dim', T(key + '.epitaph', { days: S.time.day })));
      body.appendChild(el('div', 'divider'));
      body.appendChild(el('div', 'eyebrow', T('endings.summary')));
      body.appendChild(UI.kv(T('endings.summaryDays'), String(S.time.day)));
      body.appendChild(UI.kv(T('endings.summaryEarned'), Economy.money(S.ledger.grossTotal)));
      body.appendChild(UI.kv(T('endings.summaryDeducted'), Economy.money(S.ledger.deductTotal)));
      body.appendChild(UI.kv(T('endings.summaryDebt'), Economy.money(S.purse.debt)));
      body.appendChild(UI.kv(T('endings.summaryDust'), String(S.body.dust)));
      body.appendChild(UI.kv(T('endings.summaryTremor'), String(S.body.tremor)));
      body.appendChild(UI.actions([
        UI.button({
          label: T('endings.again'), primary: true,
          onClick: function () { UI.closeModal(scrim); Loop.restart(); }
        })
      ]));
    });
    scrim = UI.openModal(m);
  },

  /* ---- menu / saves ---- */
  showMenu: function () {
    var scrim;
    var m = UI.modal(T('save.heading'), function (body) {
      if (!Store.available) body.appendChild(el('p', 'prose prose--dim', T('save.noStorage')));

      var list = Save.list();
      for (var i = 0; i < list.length; i++) {
        (function (entry) {
          var row = el('div', 'panel panel--flag');
          var head = el('div', 'panel__head');
          var name = entry.slot === 'auto' ? T('save.autosave') : T('save.slot', { n: entry.slot });
          head.appendChild(el('span', null, name));
          head.appendChild(el('span', null, entry.meta
            ? T('save.savedAt', { d: entry.meta.day, season: T('seasons.' + entry.meta.season) })
            : T('save.empty')));
          row.appendChild(head);
          var b = el('div', 'panel__body');
          var acts = el('div', 'actions actions--row');
          if (entry.slot !== 'auto') {
            acts.appendChild(UI.button({
              small: true, label: T('save.doSave'),
              onClick: function () {
                Save.write(entry.slot);
                UI.log(T('save.saved', { n: entry.slot }), 'good');
                UI.closeModal(scrim);
                UI.showMenu();
              }
            }));
          }
          acts.appendChild(UI.button({
            small: true, label: T('save.doLoad'),
            reason: entry.meta ? null : T('save.noSave'),
            onClick: function () {
              if (Save.load(entry.slot)) {
                UI.closeModal(scrim);
                UI.closeAll();
                UI.log(T('save.loaded', { n: entry.slot }), 'good');
                Loop.resumeLoaded();
              }
            }
          }));
          acts.appendChild(UI.button({
            small: true, label: T('save.doDelete'),
            reason: entry.meta ? null : T('save.noSave'),
            onClick: function () {
              Save.erase(entry.slot);
              UI.closeModal(scrim);
              UI.showMenu();
            }
          }));
          b.appendChild(acts);
          row.appendChild(b);
          body.appendChild(row);
        })(list[i]);
      }

      body.appendChild(el('div', 'divider'));
      body.appendChild(UI.actions([
        UI.button({
          label: T('app.replayTutorial'),
          onClick: function () {
            UI.closeModal(scrim);
            Tutorial.restart();
          }
        }),
        UI.button({
          label: T('app.close'), primary: true,
          onClick: function () { UI.closeModal(scrim); }
        })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  /* ---- opening card ---- */
  showOpening: function (onDone) {
    var scrim;
    var m = UI.modal(T('app.title') + ' — ' + T('app.subtitle'), function (body) {
      var lines = T('app.openingCard');
      for (var i = 0; i < lines.length; i++) body.appendChild(el('p', 'prose', lines[i]));
      body.appendChild(el('p', 'prose prose--dim', T('app.dateline')));
      body.appendChild(UI.actions([
        UI.button({
          label: T('app.openingButton'), primary: true,
          onClick: function () {
            UI.closeModal(scrim);
            UI.showCreation(function (kinId) { if (onDone) onDone(kinId); });
          }
        })
      ]));
    });
    scrim = UI.openModal(m);
  },

  /* ---- boot ---- */
  boot: function () {
    UI.mount();
    S = newState();
    Audio.init();
    var auto = Save.peek('auto');
    if (auto && !auto.corrupt) UI.showStart(auto);
    else UI.showOpening(function (kinId) { Loop.newGame(null, kinId); });
  },

  showStart: function (auto) {
    var scrim;
    var m = UI.modal(T('app.title') + ' — ' + T('app.subtitle'), function (body) {
      var lines = T('app.openingCard');
      for (var i = 0; i < lines.length; i++) body.appendChild(el('p', 'prose', lines[i]));
      body.appendChild(UI.actions([
        UI.button({
          label: T('app.resume'), primary: true,
          hint: T('save.savedAt', { d: auto.day, season: T('seasons.' + auto.season) }),
          onClick: function () {
            if (Save.load('auto')) { UI.closeModal(scrim); Loop.resumeLoaded(); }
          }
        }),
        UI.button({
          label: T('app.newGame'), hint: T('app.dateline'),
          onClick: function () {
            UI.closeModal(scrim);
            UI.showCreation(function (kinId) { Loop.newGame(null, kinId); });
          }
        })
      ]));
    });
    scrim = UI.openModal(m);
  },

  /* ---------------------------------------------------------- the shift
     A short column of beat-lines, paced, then the tally. Skippable at any
     point. It should read like a bad day, not a spreadsheet.
     ------------------------------------------------------------------- */
  playShift: function (rec, onDone) {
    var scrim, col, skipBtn, finished = false;
    var timers = [];
    var STEP = 380;

    var m = el('div', 'modal modal--shift');
    var head = el('div', 'modal__head');
    head.appendChild(el('span', null, T('shift.stations.' + rec.station + '.name')));
    m.appendChild(head);
    var body = el('div', 'modal__body');
    col = el('div', 'beats');
    col.setAttribute('aria-live', 'polite');
    body.appendChild(col);
    var footer = el('div', 'actions');
    skipBtn = UI.button({
      id: 'btn-skip-beats', small: true,
      label: T('shift.skipBeats'),
      onClick: function () { finish(); }
    });
    footer.appendChild(skipBtn);
    body.appendChild(footer);
    m.appendChild(body);
    scrim = UI.openModal(m);

    function line(beat) {
      var txt = beat.text || T(beat.key);
      var node = el('div', 'beat' + (beat.kind ? ' beat--' + beat.kind : ''), txt);
      col.appendChild(node);
      col.scrollTop = col.scrollHeight;
      Audio.beat(beat.kind);
    }

    for (var i = 0; i < rec.beats.length; i++) {
      (function (idx) {
        timers.push(setTimeout(function () {
          if (finished) return;
          line(rec.beats[idx]);
          if (idx === rec.beats.length - 1) timers.push(setTimeout(finish, 520));
        }, idx * STEP));
      })(i);
    }

    function finish() {
      if (finished) return;
      finished = true;
      for (var t = 0; t < timers.length; t++) clearTimeout(timers[t]);
      /* anything not yet shown lands at once */
      clear(col);
      for (var b = 0; b < rec.beats.length; b++) {
        var beat = rec.beats[b];
        col.appendChild(el('div', 'beat' + (beat.kind ? ' beat--' + beat.kind : ''), beat.text || T(beat.key)));
      }
      clear(footer);
      UI.shiftAftermath(body, rec, function () {
        UI.closeModal(scrim);
        if (onDone) onDone();
      });
      body.scrollTop = body.scrollHeight;
    }
  },

  shiftAftermath: function (body, rec, onDone) {
    /* the catastrophe, if the shed had one */
    if (rec.catastrophe) {
      var cat = el('div', 'catastrophe');
      cat.appendChild(el('div', 'catastrophe__title', T('shift.catastrophe.' + rec.catastrophe + '.title')));
      cat.appendChild(el('p', 'prose', T('shift.catastrophe.' + rec.catastrophe + '.text', {
        name: rec.died ? rec.died.name : T('hud.nothing'),
        age: rec.died ? rec.died.age : ''
      })));
      cat.appendChild(el('p', 'prose', T('shift.catastrophe.' + rec.catastrophe + '.survived')));
      if (rec.died) cat.appendChild(el('p', 'prose prose--dim', T('shift.catastrophe.neighbourDied', { name: rec.died.name })));
      cat.appendChild(el('p', 'prose prose--dim', T('shift.catastrophe.worksResponse')));
      cat.appendChild(el('p', 'prose prose--dim', T('shift.catastrophe.resumed')));
      body.appendChild(cat);
    } else if (rec.injury) {
      var inj = el('div', 'injury-note');
      inj.appendChild(el('div', 'injury-note__title', T('shift.injuryHappened')));
      inj.appendChild(el('p', 'prose', T('shift.injuryLine', {
        what: T('injuries.' + rec.injury),
        detail: T('shift.injuryDetail.' + rec.injury)
      })));
      body.appendChild(inj);
    }

    /* the tally */
    var t = el('div', 'tally-mini');
    var ic = el('span', 'tally-head__icon');
    Art.into(ic, Art.icon(Art.unitIcon(rec.station), 40));
    t.appendChild(ic);
    var rows = el('div', 'tally-mini__rows');
    rows.appendChild(UI.kv(T('shift.tally.made'), String(rec.output)));
    rows.appendChild(UI.kv(T('shift.tally.rejected'), String(rec.rejects), rec.rejects > rec.output * 0.09 ? 'bad' : null));
    rows.appendChild(UI.kv(T('shift.tally.passed'), String(rec.good), 'good'));
    rows.appendChild(UI.kv(T('shift.tally.credit'), String(rec.credits)));
    rows.appendChild(UI.kv(T('shift.tally.wage'), Economy.money(rec.wage)));
    t.appendChild(rows);
    body.appendChild(t);

    body.appendChild(UI.actions([
      UI.button({
        id: 'btn-shift-done', primary: true,
        label: T('shift.tally.done'),
        onClick: onDone
      })
    ]));
  },

  /* ---------------------------------------------------------- the ratchet */
  showQuota: function (result, onDone) {
    var scrim;
    var m = UI.modal(T(result.beaten ? 'shift.quota.beaten' : 'shift.quota.missed'), function (body) {
      body.appendChild(el('p', 'prose', T(result.beaten ? 'shift.quota.beatenText' : 'shift.quota.missedText', {
        made: result.made,
        target: result.target,
        bonus: Economy.money(result.bonus),
        fine: Economy.money(result.fine),
        next: result.next
      })));

      var rat = el('div', 'ratchet-big');
      var oldBox = el('div', 'ratchet-big__box');
      oldBox.appendChild(el('div', 'ratchet-big__label', T('shift.quota.week', { n: result.week })));
      oldBox.appendChild(el('div', 'ratchet-big__num', String(result.target)));
      var arrow = el('div', 'ratchet-big__arrow', '\u2192');
      var newBox = el('div', 'ratchet-big__box ratchet-big__box--new');
      newBox.appendChild(el('div', 'ratchet-big__label', T('shift.quota.week', { n: result.week + 1 })));
      newBox.appendChild(el('div', 'ratchet-big__num', String(result.next)));
      rat.appendChild(oldBox);
      rat.appendChild(arrow);
      rat.appendChild(newBox);
      body.appendChild(rat);

      if (!result.beaten) {
        body.appendChild(el('p', 'prose prose--dim',
          T('shift.quota.warning', { n: result.warnings, max: QUOTA.warningsToDismissal })));
      }
      body.appendChild(UI.actions([
        UI.button({
          id: 'btn-quota-on', primary: true, label: T('ui.continueBtn'),
          onClick: function () { UI.closeModal(scrim); if (onDone) onDone(); }
        })
      ]));
    });
    scrim = UI.openModal(m);
    Audio.paper();
  },

  /* --------------------------------------------------------- the transfer */
  showTransfer: function () {
    var scrim;
    var m = UI.modal(T('shift.transfer.heading'), function (body) {
      body.appendChild(el('p', 'prose prose--dim', T('shift.transfer.pick')));
      body.appendChild(el('div', 'kv', T('shift.transfer.current', {
        station: T('shift.stations.' + S.factory.station + '.name'),
        skill: Math.round(Factory.skill(S.factory.station))
      })));
      var opts = Factory.transferOptions();
      var list = el('div', 'actions');
      for (var i = 0; i < opts.length; i++) {
        (function (o) {
          list.appendChild(UI.button({
            label: T('shift.stations.' + o.station + '.name'),
            hint: T('shift.stations.' + o.station + '.hazard'),
            reason: o.reason ? T(o.reason) : null,
            onClick: function () { UI.closeModal(scrim); UI.showTransferPreview(o.station); }
          }));
        })(opts[i]);
      }
      body.appendChild(list);
      body.appendChild(UI.actions([
        UI.button({ label: T('shift.transfer.cancel'), onClick: function () { UI.closeModal(scrim); } })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  /* The cost is shown before the player can agree to it. */
  showTransferPreview: function (to) {
    var pv = Factory.transferPreview(to);
    var scrim;
    var m = UI.modal(T('shift.transfer.heading'), function (body) {
      body.appendChild(el('div', 'kv', T('shift.transfer.target', {
        station: T('shift.stations.' + to + '.name'), skill: pv.toSkill
      })));
      body.appendChild(el('p', 'prose transfer-cost', T('shift.transfer.costLine', {
        from: T('shift.stations.' + pv.from + '.short'),
        to: T('shift.stations.' + to + '.short'),
        skill: pv.toSkill
      })));
      body.appendChild(el('p', 'prose', T('shift.transfer.wageLine', {
        wage: Economy.money(pv.wageThere), now: Economy.money(pv.wageNow)
      })));
      body.appendChild(el('p', 'prose prose--dim', T('shift.transfer.hazardLine', {
        hazard: T(pv.hazardKey)
      })));
      body.appendChild(UI.actions([
        UI.button({
          id: 'btn-transfer-confirm', primary: true,
          label: T('shift.transfer.confirm'),
          onClick: function () { UI.closeModal(scrim); Loop.askTransfer(to); }
        }),
        UI.button({ label: T('shift.transfer.cancel'), onClick: function () { UI.closeModal(scrim); } })
      ]));
    });
    scrim = UI.openModal(m, { dismissible: true });
  },

  /* -------------------------------------------------------- the Inspector */
  showInspector: function () {
    var scrim;
    var m = UI.modal(T('inspector.heading'), function (body) {
      body.appendChild(el('p', 'prose', T('inspector.arrival')));
      body.appendChild(el('p', 'prose', T('inspector.visit')));
      body.appendChild(el('p', 'prose', T('inspector.findsNothing')));
      body.appendChild(el('p', 'prose', T('inspector.aftermath')));
      body.appendChild(el('p', 'prose prose--dim', T('inspector.workmates')));
      body.appendChild(el('p', 'prose prose--dim', T('inspector.coomKnows')));
      body.appendChild(UI.actions([
        UI.button({
          id: 'btn-inspector', primary: true, label: T('ui.continueBtn'),
          onClick: function () { UI.closeModal(scrim); Coom.inspectorVisit(); UI.render(); }
        })
      ]));
    });
    scrim = UI.openModal(m);
  },

  bindKeys: function () {
    document.addEventListener('keydown', function (e) {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        Debug.toggle();
        return;
      }
      if (e.key === 'Escape') {
        var top = UI.modalStack[UI.modalStack.length - 1];
        if (top && top.dataset.dismissible === '1') UI.closeModal(top);
        else if (Tutorial.visible()) Tutorial.hide();
      }
    });
  }
};

/* ==========================================================================
   TUTORIAL — days 1-2, five steps, interruptible, skippable, replayable.
   ========================================================================== */
var TUTORIAL_STEPS = [
  { phase: 'SHIFT',   target: '#objectives' },
  { phase: 'SHIFT',   target: '#btn-work' },
  { phase: 'EVENING', target: '#evening-panel' },
  { phase: 'NIGHT',   target: '#night-panel' },
  { phase: 'DOCKET',  target: '#docket' }
];

var Tutorial = {
  node: null,

  visible: function () { return !!Tutorial.node; },

  onPhase: function (phase) {
    if (!S.tutorial.active || S.tutorial.done) return;
    if (S.time.day > 2) { S.tutorial.active = false; return; }
    Tutorial.showFor(phase);
  },

  onDocket: function () {
    if (!S.tutorial.active || S.tutorial.done) return;
    if (S.time.day > 2) { S.tutorial.active = false; return; }
    Tutorial.showFor('DOCKET');
  },

  onDocketClosed: function () { Tutorial.hide(); },

  showFor: function (phase) {
    var step = TUTORIAL_STEPS[S.tutorial.step];
    if (!step || step.phase !== phase) return;
    /* wait a tick so the phase panel exists in the document */
    setTimeout(function () { Tutorial.show(S.tutorial.step); }, 0);
  },

  show: function (i) {
    Tutorial.hide();
    var step = TUTORIAL_STEPS[i];
    var copy = T('tutorial.steps')[i];
    if (!step || !copy) return;

    var target = document.querySelector(step.target);
    var box = el('div', 'tut fade-in');
    box.appendChild(el('div', 'tut__title', copy.title));
    box.appendChild(el('div', 'tut__text', copy.text));

    var foot = el('div', 'tut__foot');
    foot.appendChild(el('span', 'tut__count', (i + 1) + ' / ' + TUTORIAL_STEPS.length));
    var btns = el('div', 'actions actions--row');
    btns.appendChild(UI.button({
      small: true, label: T('app.skipTutorial'), hint: T('tutorial.skipAll'),
      onClick: function () {
        S.tutorial.active = false;
        S.tutorial.done = true;
        Tutorial.hide();
      }
    }));
    btns.appendChild(UI.button({
      small: true, primary: true,
      label: i === TUTORIAL_STEPS.length - 1 ? T('app.tutorialDone') : T('app.tutorialNext'),
      onClick: function () { Tutorial.advance(); }
    }));
    foot.appendChild(btns);
    box.appendChild(foot);

    document.body.appendChild(box);
    Tutorial.node = box;

    if (target) {
      target.classList.add('tut-target');
      var r = target.getBoundingClientRect();
      var top = Math.max(8, Math.min(window.innerHeight - box.offsetHeight - 8, r.top));
      var left = r.left - box.offsetWidth - 16;
      if (left < 8) left = Math.min(window.innerWidth - box.offsetWidth - 8, r.right + 16);
      if (left < 8) left = 8;
      box.style.top = top + 'px';
      box.style.left = left + 'px';
    } else {
      box.style.right = '16px';
      box.style.bottom = '16px';
    }
  },

  advance: function () {
    var wasStep = S.tutorial.step;
    S.tutorial.step += 1;
    Tutorial.hide();
    if (S.tutorial.step >= TUTORIAL_STEPS.length) {
      S.tutorial.done = true;
      S.tutorial.active = false;
      return;
    }
    var next = TUTORIAL_STEPS[S.tutorial.step];
    var prev = TUTORIAL_STEPS[wasStep];
    /* chain within the same phase; otherwise wait for that phase to arrive */
    if (next.phase === prev.phase && next.phase !== 'DOCKET') Tutorial.show(S.tutorial.step);
  },

  hide: function () {
    if (Tutorial.node && Tutorial.node.parentNode) Tutorial.node.parentNode.removeChild(Tutorial.node);
    Tutorial.node = null;
    var marked = document.querySelectorAll('.tut-target');
    for (var i = 0; i < marked.length; i++) marked[i].classList.remove('tut-target');
  },

  restart: function () {
    S.tutorial.active = true;
    S.tutorial.done = false;
    /* start at the first step that belongs to the phase we are actually in,
       so replaying from the menu never leaves the player looking at nothing */
    S.tutorial.step = 0;
    for (var i = 0; i < TUTORIAL_STEPS.length; i++) {
      if (TUTORIAL_STEPS[i].phase === S.time.phase) { S.tutorial.step = i; break; }
    }
    UI.log(T('tutorial.replayed'));
    Tutorial.show(S.tutorial.step);
  }
};
