/* ==========================================================================
   GRIMWICK WORKS — js/debug.js
   Tilde opens it. Sets any field in S, jumps any day, forces any event,
   god mode, and a save round-trip deep-compare. Never shown to a player.
   ========================================================================== */

var Debug = {
  open: false,
  node: null,
  filter: '',

  toggle: function () {
    Debug.open = !Debug.open;
    if (Debug.open) Debug.build(); else Debug.destroy();
  },

  destroy: function () {
    if (Debug.node && Debug.node.parentNode) Debug.node.parentNode.removeChild(Debug.node);
    Debug.node = null;
  },

  refresh: function () {
    if (Debug.open) { Debug.destroy(); Debug.build(); }
  },

  /* ---- reflective walk over S: every primitive leaf gets a control ---- */
  leaves: function (obj, path, out, depth) {
    out = out || [];
    depth = depth || 0;
    if (depth > 6) return out;
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      if (path === '' && (k === 'log' || k === 'dockets' || k === 'docket')) continue;
      var v = obj[k];
      var p = path ? path + '.' + k : k;
      if (v === null) { out.push({ path: p, type: 'null', value: v }); continue; }
      if (typeof v === 'object') { Debug.leaves(v, p, out, depth + 1); continue; }
      out.push({ path: p, type: typeof v, value: v });
    }
    return out;
  },

  setPath: function (root, path, value) {
    var parts = path.split('.'), node = root, i;
    for (i = 0; i < parts.length - 1; i++) node = node[parts[i]];
    node[parts[parts.length - 1]] = value;
  },

  build: function () {
    var wrap = el('div', 'debug');
    var head = el('div', 'debug__head');
    head.appendChild(el('span', null, T('debug.title')));
    head.appendChild(el('span', null, T('debug.hint')));
    wrap.appendChild(head);

    var body = el('div', 'debug__body');

    /* --- tools --- */
    var tools = el('div', 'actions');

    var godRow = el('div', 'debug__row');
    var godLabel = el('label', null, T('debug.god'));
    var god = document.createElement('input');
    god.type = 'checkbox';
    god.checked = !!S.settings.god;
    god.addEventListener('change', function () { S.settings.god = god.checked; });
    godRow.appendChild(godLabel);
    godRow.appendChild(god);
    body.appendChild(godRow);

    var dayRow = el('div', 'debug__row');
    dayRow.appendChild(el('label', null, T('debug.jumpDay')));
    var dayIn = document.createElement('input');
    dayIn.type = 'number';
    dayIn.min = '1';
    dayIn.max = '60';
    dayIn.value = String(S.time.day);
    dayIn.addEventListener('change', function () {
      var d = Util.clamp(parseInt(dayIn.value, 10) || 1, 1, 60);
      S.time.day = d;
      Loop.startDay(false);
      Debug.refresh();
    });
    dayRow.appendChild(dayIn);
    body.appendChild(dayRow);

    var evRow = el('div', 'debug__row');
    evRow.appendChild(el('label', null, T('debug.forceEvent')));
    var sel = document.createElement('select');
    var ids = Events.ids();
    for (var i = 0; i < ids.length; i++) {
      var o = document.createElement('option');
      o.value = ids[i];
      o.textContent = ids[i];
      sel.appendChild(o);
    }
    evRow.appendChild(sel);
    body.appendChild(evRow);

    tools.appendChild(UI.button({
      small: true, label: T('debug.fire'),
      onClick: function () { Events.force(sel.value, function () { UI.render(); }); }
    }));
    tools.appendChild(UI.button({
      small: true, label: T('debug.roundTrip'),
      onClick: function () {
        var diff = Save.roundTripTest();
        if (diff.length === 0) {
          console.log('%c' + T('debug.passed'), 'color:#8fbb85');
          UI.log(T('debug.passed'), 'good');
        } else {
          console.warn(T('debug.failed'), diff);
          UI.log(T('debug.failed'), 'bad');
        }
      }
    }));
    tools.appendChild(UI.button({
      small: true, label: T('debug.dumpState'),
      onClick: function () { console.log(Util.deepClone(S)); }
    }));
    tools.appendChild(UI.button({
      small: true, label: T('debug.kill'),
      onClick: function () { S.body.health = 0; Loop.checkDeath(); UI.showEnding(S.endingId); }
    }));
    body.appendChild(tools);

    /* --- filter --- */
    var fRow = el('div', 'debug__row');
    fRow.appendChild(el('label', null, T('debug.filter')));
    var fIn = document.createElement('input');
    fIn.type = 'text';
    fIn.value = Debug.filter;
    fIn.addEventListener('input', function () {
      Debug.filter = fIn.value;
      Debug.refresh();
      var again = document.querySelector('.debug input[type=text]');
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });
    fRow.appendChild(fIn);
    body.appendChild(fRow);

    /* --- every field in S --- */
    body.appendChild(el('div', 'debug__group', 'S'));
    var leaves = Debug.leaves(S, '', []);
    for (var j = 0; j < leaves.length; j++) {
      (function (leaf) {
        if (Debug.filter && leaf.path.indexOf(Debug.filter) === -1) return;
        var row = el('div', 'debug__row');
        row.appendChild(el('label', null, leaf.path));
        var input = document.createElement('input');
        if (leaf.type === 'boolean') {
          input.type = 'checkbox';
          input.checked = !!leaf.value;
          input.addEventListener('change', function () {
            Debug.setPath(S, leaf.path, input.checked);
            UI.render();
          });
        } else {
          input.type = leaf.type === 'number' ? 'number' : 'text';
          input.value = leaf.value === null ? '' : String(leaf.value);
          input.addEventListener('change', function () {
            var v = input.value;
            if (leaf.type === 'number') v = parseFloat(v) || 0;
            else if (v === 'null') v = null;
            Debug.setPath(S, leaf.path, v);
            UI.render();
          });
        }
        row.appendChild(input);
        body.appendChild(row);
      })(leaves[j]);
    }

    /* injury is the one nullable object: give it a switch of its own */
    body.appendChild(el('div', 'debug__group', 'injury'));
    var injRow = el('div', 'debug__row');
    injRow.appendChild(el('label', null, 'body.injury'));
    var injSel = document.createElement('select');
    var none = document.createElement('option');
    none.value = '';
    none.textContent = 'null';
    injSel.appendChild(none);
    for (var t in STR.injuries) {
      if (Object.prototype.hasOwnProperty.call(STR.injuries, t)) {
        var io = document.createElement('option');
        io.value = t;
        io.textContent = t;
        if (S.body.injury && S.body.injury.type === t) io.selected = true;
        injSel.appendChild(io);
      }
    }
    injSel.addEventListener('change', function () {
      if (!injSel.value) S.body.injury = null;
      else S.body.injury = { type: injSel.value, severity: 2, daysLeft: 4, permanent: false };
      UI.render();
    });
    injRow.appendChild(injSel);
    body.appendChild(injRow);

    wrap.appendChild(body);
    document.body.appendChild(wrap);
    Debug.node = wrap;
  }
};
