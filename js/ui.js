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
    var p = UI.panel(T('shift.heading'), 'shift-panel');
    var body = p._body;
    var resolved = S.factory.lastOutcome !== null;

    if (!S.job.employed) {
      body.appendChild(el('p', 'prose', T('shift.offRoll')));
      if (!resolved) {
        body.appendChild(UI.actions([
          UI.button({
            id: 'btn-work', primary: true,
            label: T('shift.gateWait'), hint: T('shift.gateWaitHint'),
            onClick: function () { Loop.gateWait(); }
          })
        ]));
      }
    } else {
      body.appendChild(el('p', 'eyebrow', T(Narrative.stationNameKey())));
      body.appendChild(el('p', 'prose', T(Narrative.stationLineKey())));
      if (!resolved) {
        body.appendChild(el('p', 'prose prose--dim', T('phases.shiftBlurb')));
        body.appendChild(UI.actions([
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
      }
    }

    if (resolved) {
      var key = 'shift.outcomes.normal';
      if (S.factory.lastOutcome === 'good') key = 'shift.outcomes.good';
      else if (S.factory.lastOutcome === 'bad') key = 'shift.outcomes.bad';
      else if (S.factory.lastOutcome === 'hurt') key = 'shift.outcomes.hurt';
      else if (S.factory.lastOutcome === 'absent') key = 'shift.abstained';
      else if (S.factory.lastOutcome === 'casual_got' || S.factory.lastOutcome === 'casual') key = 'shift.casualGot';
      body.appendChild(el('p', 'prose', T(key)));
      body.appendChild(UI.actions([
        UI.button({
          id: 'btn-leave-gate', primary: true,
          label: T('shift.leaveGate'), hint: T('shift.leaveGateHint'),
          onClick: function () { Loop.toEvening(); }
        })
      ]));
    }
    return p;
  },

  eveningPanel: function () {
    var p = UI.panel(T('town.heading'), 'evening-panel');
    p._head.appendChild(el('span', null, T('hud.apLeft') + ': ' + S.evening.ap));
    var body = p._body;

    if (S.evening.ap <= 0) body.appendChild(el('p', 'prose prose--dim', T('hud.noneLeft')));

    var locs = Town.locations();
    for (var i = 0; i < locs.length; i++) {
      var loc = locs[i];
      var sec = el('div', 'panel panel--flag');
      var head = el('div', 'panel__head');
      head.appendChild(el('span', null, T(loc.nameKey)));
      sec.appendChild(head);
      var sb = el('div', 'panel__body');
      sb.appendChild(el('p', 'prose prose--dim', T(loc.blurbKey)));

      var list = el('div', 'actions');
      for (var j = 0; j < loc.actions.length; j++) {
        var d = Town.describe(loc.actions[j]);
        if (!d) continue;
        list.appendChild(UI.button({
          label: d.label,
          hint: d.hint,
          reason: d.disabledReason,
          onClick: (function (id) { return function () { Loop.act(id); }; })(d.id)
        }));
      }
      sb.appendChild(list);
      sec.appendChild(sb);
      body.appendChild(sec);
    }

    body.appendChild(UI.actions([
      UI.button({
        id: 'btn-turn-in', primary: true,
        label: T('town.actions.endEvening'), hint: T('town.actions.endEveningHint'),
        onClick: function () { Loop.endEvening(); }
      })
    ]));
    return p;
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
    stats.appendChild(UI.statRow('stats.resolve', S.mind.resolve, 'resolve', { fillClass: 'warn' }));
    body.appendChild(stats);

    body.appendChild(UI.kv(T('stats.literacy'), T('literacy')[S.mind.literacy]));
    body.appendChild(UI.kv(
      T('hud.injury'),
      b.injury ? T('injuries.' + b.injury.type) : T('hud.injuryNone'),
      b.injury ? 'bad' : null
    ));
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

    var k = State.kin();
    if (k) {
      body.appendChild(el('div', 'divider'));
      body.appendChild(UI.kv(k.name, T('hud.kinStatus.' + k.status), k.status === 'FEVERED' || k.status === 'DEAD' ? 'bad' : null));
      if (k.status !== 'DEAD') {
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
    var m = UI.modal(T(evt.titleKey), function (body) {
      body.appendChild(el('p', 'prose', T(evt.textKey)));
      var choices = Events.describeChoices(evt);
      var wrap = el('div', 'actions');
      for (var i = 0; i < choices.length; i++) {
        (function (c) {
          wrap.appendChild(UI.button({
            label: c.label, hint: c.hint, reason: c.disabledReason,
            onClick: function () {
              var resultKey = Events.choose(evt, c.id);
              UI.closeModal(scrim);
              Audio.thunk();
              if (resultKey) {
                UI.showResult(T(resultKey), onDone);
              } else if (onDone) onDone();
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

    d.appendChild(item(T('docket.gross'), docket.gross));
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
          onClick: function () { UI.closeModal(scrim); if (onDone) onDone(); }
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
    else UI.showOpening(function () { Loop.newGame(); });
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
          onClick: function () { UI.closeModal(scrim); Loop.newGame(); }
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
