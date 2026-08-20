/* ==========================================================================
   GRIMWICK WORKS — js/minigames.js   (Build 5)

   Four short bench games, one per floor. Each is a way of EXPRESSING the
   shift, not a new system underneath it: every game returns a quality from
   0 to 1, and the only thing quality does is move the day's output inside a
   ±10% band. Quality 0.5 is dead centre and is exactly what the sim did
   before this file existed — so skipping a game, or switching them off in
   Settings, reproduces Build 4 output to the piece.

   The canvas is only alive while a game is open; there is no persistent loop.
   Every game is playable on the keyboard alone and can be skipped at any
   moment.
   ========================================================================== */

var MINI_W = 640, MINI_H = 224;

var Minigames = {

  enabled: function () {
    return !!(S && S.settings && S.settings.minigames);
  },

  reduced: function () {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  },

  forStation: function (station) {
    return { CASTING: 'pour', CAP_BENCH: 'scoop', GRINDING: 'edge', STAMPING: 'press' }[station] || 'press';
  },

  /* ---------------------------------------------------------------- shell */
  play: function (station, onDone) {
    if (!Minigames.enabled()) { onDone(0.5); return; }
    var kind = Minigames.forStation(station);
    var game = Minigames.games[kind];
    var finished = false;
    var raf = null, scrim = null;

    function finish(quality, verdictKey) {
      if (finished) return;
      finished = true;
      if (raf) cancelAnimationFrame(raf);
      if (game.teardown) game.teardown();
      var q = Util.clamp(quality, 0, 1);
      Minigames.showVerdict(scrim, kind, q, verdictKey, function () {
        UI.closeModal(scrim);
        onDone(q);
      });
    }

    var m = el('div', 'modal modal--mini');
    var head = el('div', 'modal__head');
    head.appendChild(el('span', null, T('mini.' + kind + '.title')));
    m.appendChild(head);
    var body = el('div', 'modal__body');

    body.appendChild(el('p', 'mini__instruction', T('mini.' + kind + '.how')));

    var stage = el('div', 'mini');
    var canvas = document.createElement('canvas');
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = MINI_W * dpr;
    canvas.height = MINI_H * dpr;
    canvas.style.aspectRatio = MINI_W + ' / ' + MINI_H;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', T('mini.' + kind + '.how'));
    stage.appendChild(canvas);

    var hud = el('div', 'mini__hud');
    var label = el('span', 'mini__label', T('mini.' + kind + '.label'));
    var score = el('span', 'mini__score', '0');
    hud.appendChild(label);
    hud.appendChild(score);
    stage.appendChild(hud);
    body.appendChild(stage);

    var actions = el('div', 'actions');
    actions.appendChild(UI.button({
      id: 'btn-mini-skip', small: true,
      label: T('mini.skip'), hint: T('mini.skipHint'),
      onClick: function () { finish(0.5, 'skipped'); }
    }));
    body.appendChild(actions);
    m.appendChild(body);
    scrim = UI.openModal(m);

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var api = {
      ctx: ctx, canvas: canvas, w: MINI_W, h: MINI_H,
      reduced: Minigames.reduced(),
      setScore: function (v) { score.textContent = v; },
      shake: function () {
        if (Minigames.reduced()) return;
        stage.classList.remove('shake');
        void stage.offsetWidth;
        stage.classList.add('shake');
      },
      finish: finish,
      /* the body brings its own difficulty to the bench */
      tremor: S.body.tremor / 100,
      fatigue: S.body.fatigue / 100,
      skill: Factory.skill(station) / 100,
      guardsOff: S.factory.guard === 'off',
      pace: S.factory.pace
    };

    game.setup(api);

    var t0 = performance.now();
    function frame(now) {
      if (finished) return;
      var t = (now - t0) / 1000;
      game.step(api, t);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  },

  showVerdict: function (scrim, kind, q, verdictKey, onDone) {
    var body = scrim.querySelector('.modal__body');
    clear(body);
    var cls = q >= 0.68 ? 'good' : (q >= 0.42 ? 'ok' : 'bad');
    var vKey = verdictKey === 'skipped' ? 'mini.skipped'
      : 'mini.' + kind + '.' + (cls === 'good' ? 'good' : (cls === 'ok' ? 'ok' : 'bad'));
    body.appendChild(el('div', 'mini__verdict mini__verdict--' + cls, T('mini.verdict.' + cls)));
    body.appendChild(el('p', 'prose', T(vKey)));
    var pct = Math.round((0.90 + q * 0.20) * 100);
    body.appendChild(UI.kv(T('mini.effect'), pct + '%' + ' ' + T('mini.effectOf')));
    body.appendChild(UI.actions([
      UI.button({ id: 'btn-mini-done', primary: true, label: T('mini.toTheBench'), onClick: onDone })
    ]));
    Audio.thunk();
  },

  /* ================================================================ games */
  games: {

    /* -------------------------------------------------------- THE POUR ---
       Lead into the mould. Hold to pour, release on the line. Overfill and
       it goes over the flags and takes the boot with it. */
    pour: {
      setup: function (api) {
        var g = api.g = {
          fill: 0, target: 0.78, pouring: false, mould: 0, moulds: 4,
          score: 0, results: [], spill: 0, sparks: [], done: false, last: 0
        };
        g.rate = 0.55 + api.pace === 'driven' ? 0.72 : 0.55;
        api.onKey = function (e) {
          if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            if (e.type === 'keydown') g.pouring = true; else g.pouring = false;
          }
        };
        api.onDown = function () { g.pouring = true; };
        api.onUp = function () { g.pouring = false; };
        document.addEventListener('keydown', api.onKey);
        document.addEventListener('keyup', api.onKey);
        api.canvas.addEventListener('mousedown', api.onDown);
        document.addEventListener('mouseup', api.onUp);
        api.canvas.addEventListener('touchstart', api.onDown, { passive: true });
        document.addEventListener('touchend', api.onUp);
        Minigames._t = api;
      },
      teardown: function () {
        var api = Minigames._t;
        if (!api) return;
        document.removeEventListener('keydown', api.onKey);
        document.removeEventListener('keyup', api.onKey);
        document.removeEventListener('mouseup', api.onUp);
        document.removeEventListener('touchend', api.onUp);
      },
      step: function (api, t) {
        var g = api.g, c = api.ctx, w = api.w, h = api.h;
        var dt = Math.min(0.05, t - g.last); g.last = t;

        if (g.pouring && !g.done) {
          g.fill += dt * (0.62 + api.pace === 'driven' ? 0.2 : 0);
          if (g.fill > 1.02) {
            g.results.push(0);
            g.spill = 0.6;
            api.shake();
            Audio.pour();
            g.fill = 0; g.mould++; g.pouring = false;
          }
        } else if (!g.pouring && g.fill > 0.02 && !g.done) {
          /* released: judge it */
          var err = Math.abs(g.fill - g.target);
          var quality = Util.clamp(1 - err / 0.30, 0, 1);
          g.results.push(quality);
          Audio.tick();
          g.fill = 0; g.mould++;
        }
        if (g.mould >= g.moulds && !g.done) {
          g.done = true;
          var sum = 0;
          for (var i = 0; i < g.results.length; i++) sum += g.results[i];
          api.finish(sum / g.results.length);
        }
        api.setScore(Math.round((g.results.reduce(function (a, b) { return a + b; }, 0) / g.moulds) * 100));

        /* ---- draw ---- */
        c.fillStyle = '#0D0F12'; c.fillRect(0, 0, w, h);
        /* furnace glow */
        var grad = c.createRadialGradient(90, 120, 8, 90, 120, 120);
        grad.addColorStop(0, 'rgba(255,196,110,.55)');
        grad.addColorStop(1, 'rgba(255,120,30,0)');
        c.fillStyle = grad; c.fillRect(0, 0, 240, h);
        c.fillStyle = '#2E211A'; c.fillRect(40, 60, 110, 120);
        c.fillStyle = '#120C08'; c.fillRect(60, 80, 70, 100);
        c.fillStyle = 'rgba(255,150,50,' + (0.6 + Math.sin(t * 8) * 0.15) + ')';
        c.fillRect(64, 120 + Math.sin(t * 9) * 3, 62, 58);

        /* ladle */
        c.fillStyle = '#4A423A';
        c.fillRect(250, 44, 90, 26);
        c.fillRect(230, 50, 24, 8);
        /* the stream */
        if (g.pouring) {
          var sg = c.createLinearGradient(0, 70, 0, 172);
          sg.addColorStop(0, '#FFF0C2'); sg.addColorStop(.5, '#FFB43C'); sg.addColorStop(1, '#D8541A');
          c.fillStyle = sg;
          c.fillRect(291, 70, 8, 102);
          c.globalAlpha = .5;
          c.fillStyle = '#FFCF7A';
          c.fillRect(288 + Math.sin(t * 30) * 1.4, 70, 14, 102);
          c.globalAlpha = 1;
        }
        /* the mould, filling */
        c.fillStyle = '#3A3129'; c.fillRect(250, 172, 92, 30);
        var fh = Math.min(1, g.fill) * 26;
        c.fillStyle = '#FFAE4A';
        c.fillRect(253, 199 - fh, 86, fh);
        /* the line you are aiming at */
        c.strokeStyle = '#E0A24A'; c.lineWidth = 2;
        c.setLineDash([5, 4]);
        c.beginPath();
        c.moveTo(246, 199 - g.target * 26); c.lineTo(348, 199 - g.target * 26); c.stroke();
        c.setLineDash([]);

        /* the finished ones, cooling */
        for (var m = 0; m < g.results.length; m++) {
          var qy = g.results[m];
          c.fillStyle = qy > 0 ? '#6F675C' : '#3A2A22';
          c.beginPath(); c.arc(410 + m * 34, 186, 11, 0, 6.3); c.fill();
          c.fillStyle = qy > .7 ? '#A49A8B' : 'rgba(164,154,139,.4)';
          c.beginPath(); c.arc(406 + m * 34, 182, 4, 0, 6.3); c.fill();
        }
        if (g.spill > 0) {
          g.spill -= dt * 2;
          c.fillStyle = 'rgba(255,120,40,' + Math.max(0, g.spill) + ')';
          c.fillRect(240, 196, 120, 8);
        }
        c.fillStyle = '#C9C4B8';
        c.font = '600 15px "Courier Prime", monospace';
        c.fillText((g.mould + 1) + ' / ' + g.moulds, 560, 30);
      }
    },

    /* ------------------------------------------------------- THE SCOOP ---
       Fulminate into copper cups. The lane is narrow, and your own hands
       are the difficulty: the shake you have earned pushes the scoop about. */
    scoop: {
      setup: function (api) {
        var g = api.g = { x: 0.5, aim: 0.5, filled: 0, inLane: 0, total: 0, last: 0, lane: 0.5, spill: 0 };
        api.onMove = function (e) {
          var r = api.canvas.getBoundingClientRect();
          var cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
          g.aim = Util.clamp(cx / r.width, 0, 1);
        };
        api.onKey = function (e) {
          if (e.key === 'ArrowLeft') { g.aim = Util.clamp(g.aim - 0.06, 0, 1); e.preventDefault(); }
          if (e.key === 'ArrowRight') { g.aim = Util.clamp(g.aim + 0.06, 0, 1); e.preventDefault(); }
        };
        api.canvas.addEventListener('mousemove', api.onMove);
        api.canvas.addEventListener('touchmove', api.onMove, { passive: true });
        document.addEventListener('keydown', api.onKey);
        Minigames._t = api;
      },
      teardown: function () {
        var api = Minigames._t;
        if (api) document.removeEventListener('keydown', api.onKey);
      },
      step: function (api, t) {
        var g = api.g, c = api.ctx, w = api.w, h = api.h;
        var dt = Math.min(0.05, t - g.last); g.last = t;

        /* the lane wanders; your hand wanders more than you would like */
        g.lane = 0.5 + Math.sin(t * 0.7) * 0.24 + Math.sin(t * 1.9) * 0.07;
        var jitter = (api.tremor * 0.055 + api.fatigue * 0.02)
          * (Math.sin(t * 27) * 0.6 + Math.sin(t * 41.3) * 0.4);
        g.x += (g.aim - g.x) * Math.min(1, dt * 12);
        var hand = Util.clamp(g.x + jitter, 0, 1);

        var laneW = 0.085 + api.skill * 0.05;
        var inside = Math.abs(hand - g.lane) < laneW;
        g.total += dt;
        if (inside) { g.inLane += dt; g.filled += dt * 26; }
        else if (Math.abs(hand - g.lane) > laneW * 2.2) g.spill = 0.5;

        if (t > 7.5) { api.finish(Util.clamp(g.inLane / Math.max(0.5, g.total), 0, 1)); return; }
        api.setScore(Math.floor(g.filled));

        /* ---- draw ---- */
        c.fillStyle = '#0D0F12'; c.fillRect(0, 0, w, h);
        /* lamp */
        var lg = c.createRadialGradient(w - 90, 40, 4, w - 90, 40, 130);
        lg.addColorStop(0, 'rgba(224,162,74,.42)'); lg.addColorStop(1, 'rgba(224,162,74,0)');
        c.fillStyle = lg; c.fillRect(w - 220, 0, 220, h);

        /* the bench */
        c.fillStyle = '#3A2E1E'; c.fillRect(0, 150, w, 16);
        c.fillStyle = '#241C12'; c.fillRect(0, 166, w, 8);

        /* the lane */
        var lx = g.lane * w, lw = laneW * w;
        c.fillStyle = 'rgba(224,162,74,.13)';
        c.fillRect(lx - lw, 40, lw * 2, 110);
        c.strokeStyle = 'rgba(224,162,74,.5)'; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(lx - lw, 40); c.lineTo(lx - lw, 150);
        c.moveTo(lx + lw, 40); c.lineTo(lx + lw, 150); c.stroke();

        /* the cups */
        for (var i = 0; i < 16; i++) {
          var cx2 = 24 + i * (w - 48) / 15;
          var lit = Math.abs(cx2 / w - g.lane) < laneW;
          c.fillStyle = lit ? '#E8C98A' : '#8F6C22';
          c.beginPath(); c.arc(cx2, 142, 6, 0, 6.3); c.fill();
        }

        /* the scoop, where your hand actually is */
        var hx = hand * w;
        c.fillStyle = inside ? '#E0A24A' : '#9AA0A6';
        c.save();
        c.translate(hx, 96);
        c.rotate(jitter * 5);
        c.fillRect(-4, -46, 8, 44);
        c.fillRect(-11, -4, 22, 12);
        c.restore();
        if (inside) {
          c.fillStyle = 'rgba(224,162,74,.5)';
          c.fillRect(hx - 2, 108, 4, 30);
        }
        if (g.spill > 0) {
          g.spill -= dt * 1.6;
          c.fillStyle = 'rgba(154,160,166,' + Math.max(0, g.spill) + ')';
          c.fillRect(hx - 16, 146, 32, 5);
        }
        /* the clock */
        c.fillStyle = '#3A424B'; c.fillRect(20, 200, w - 40, 6);
        c.fillStyle = '#C9C4B8'; c.fillRect(20, 200, (w - 40) * Math.min(1, t / 7.5), 6);
      }
    },

    /* -------------------------------------------------------- THE EDGE ---
       The blade against the wheel. There is one angle that grinds and every
       other angle burns. The sweet spot moves, because the wheel wears. */
    edge: {
      setup: function (api) {
        var g = api.g = { angle: 0.5, aim: 0.5, sweet: 0.5, held: false, ground: 0, burn: 0, good: 0, total: 0, last: 0, sparks: [] };
        api.onMove = function (e) {
          var r = api.canvas.getBoundingClientRect();
          var cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
          g.aim = Util.clamp(cx / r.width, 0, 1);
        };
        api.onKey = function (e) {
          if (e.key === 'ArrowLeft') { g.aim = Util.clamp(g.aim - 0.05, 0, 1); e.preventDefault(); }
          if (e.key === 'ArrowRight') { g.aim = Util.clamp(g.aim + 0.05, 0, 1); e.preventDefault(); }
          if (e.code === 'Space') { e.preventDefault(); g.held = (e.type === 'keydown'); }
        };
        api.onDown = function () { g.held = true; };
        api.onUp = function () { g.held = false; };
        api.canvas.addEventListener('mousemove', api.onMove);
        api.canvas.addEventListener('touchmove', api.onMove, { passive: true });
        api.canvas.addEventListener('mousedown', api.onDown);
        api.canvas.addEventListener('touchstart', api.onDown, { passive: true });
        document.addEventListener('mouseup', api.onUp);
        document.addEventListener('touchend', api.onUp);
        document.addEventListener('keydown', api.onKey);
        document.addEventListener('keyup', api.onKey);
        Minigames._t = api;
      },
      teardown: function () {
        var api = Minigames._t;
        if (!api) return;
        document.removeEventListener('keydown', api.onKey);
        document.removeEventListener('keyup', api.onKey);
        document.removeEventListener('mouseup', api.onUp);
        document.removeEventListener('touchend', api.onUp);
      },
      step: function (api, t) {
        var g = api.g, c = api.ctx, w = api.w, h = api.h;
        var dt = Math.min(0.05, t - g.last); g.last = t;

        g.sweet = 0.5 + Math.sin(t * 0.55) * 0.26 + Math.sin(t * 1.3) * 0.06;
        g.angle += (g.aim - g.angle) * Math.min(1, dt * 10);
        var band = 0.07 + api.skill * 0.045;
        var off = Math.abs(g.angle - g.sweet);
        var onSpot = off < band;

        if (g.held) {
          g.total += dt;
          if (onSpot) { g.good += dt; g.ground += dt * 22; }
          else { g.burn = Math.min(1, g.burn + dt * 0.55); }
          if (onSpot && !api.reduced) {
            for (var s = 0; s < 4; s++) {
              g.sparks.push({ x: 300, y: 120, vx: 120 + Math.random() * 240, vy: -70 + Math.random() * 150, life: 0.5 });
            }
            if (Math.random() < 0.14) Audio.spark();
          }
        }
        if (t > 7.5) {
          var q = Util.clamp((g.good / Math.max(0.6, g.total || 0.6)) * (1 - g.burn * 0.5), 0, 1);
          if (g.total < 1.5) q = 0.15;
          api.finish(q); return;
        }
        api.setScore(Math.floor(g.ground));

        /* ---- draw ---- */
        c.fillStyle = '#0D0F12'; c.fillRect(0, 0, w, h);
        /* dust shaft */
        c.fillStyle = 'rgba(201,190,138,.05)';
        c.beginPath(); c.moveTo(120, 0); c.lineTo(210, 0); c.lineTo(150, h); c.lineTo(20, h); c.fill();

        /* the wheel */
        c.save();
        c.translate(190, 120);
        c.rotate(t * 11);
        c.fillStyle = '#6F675C';
        c.beginPath(); c.arc(0, 0, 78, 0, 6.3); c.fill();
        c.strokeStyle = '#57503F'; c.lineWidth = 3;
        for (var a = 0; a < 12; a++) {
          c.save(); c.rotate(a * 0.5236);
          c.beginPath(); c.moveTo(0, -76); c.lineTo(0, -52); c.stroke();
          c.restore();
        }
        c.restore();
        c.strokeStyle = '#241D16'; c.lineWidth = 4;
        c.beginPath(); c.arc(190, 120, 78, 0, 6.3); c.stroke();

        /* the blade at your angle */
        c.save();
        c.translate(268, 120);
        c.rotate(-0.5 + g.angle * 1.0);
        var bg = c.createLinearGradient(0, -6, 0, 6);
        bg.addColorStop(0, '#CFD4D8'); bg.addColorStop(.5, '#8D949A'); bg.addColorStop(1, '#3F4448');
        c.fillStyle = g.burn > 0.4 ? '#4A6B8E' : bg;
        c.fillRect(0, -5, 150, 10);
        c.fillStyle = '#4A423A'; c.fillRect(145, -9, 30, 18);
        c.restore();

        /* the gauge: where the wheel wants it */
        c.fillStyle = '#22272D'; c.fillRect(40, 196, w - 80, 12);
        c.fillStyle = 'rgba(224,162,74,.30)';
        c.fillRect(40 + (g.sweet - band) * (w - 80), 196, band * 2 * (w - 80), 12);
        c.fillStyle = onSpot ? '#E0A24A' : '#C9C4B8';
        c.fillRect(40 + g.angle * (w - 80) - 2, 192, 4, 20);

        /* sparks */
        for (var i = g.sparks.length - 1; i >= 0; i--) {
          var p = g.sparks[i];
          p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; p.life -= dt;
          if (p.life <= 0) { g.sparks.splice(i, 1); continue; }
          c.fillStyle = 'rgba(255,196,99,' + Math.max(0, p.life * 2) + ')';
          c.fillRect(p.x, p.y, 2.2, 2.2);
        }
        if (g.burn > 0.05) {
          c.fillStyle = 'rgba(74,107,142,' + g.burn * 0.5 + ')';
          c.fillRect(0, 0, w, h);
        }
        c.fillStyle = '#3A424B'; c.fillRect(20, 214, w - 40, 4);
        c.fillStyle = '#C9C4B8'; c.fillRect(20, 214, (w - 40) * Math.min(1, t / 7.5), 4);
      }
    },

    /* -------------------------------------------------------- THE PRESS ---
       A ton and a quarter on a rhythm. Feed the blank on the beat. Feed it
       late and the ram comes down on your hand, which is what the stop-bar
       was for, which is why the stop-bar matters. */
    press: {
      setup: function (api) {
        var g = api.g = {
          period: api.pace === 'driven' ? 0.86 : 1.05,
          hits: 0, misses: 0, near: 0, total: 0, last: 0, lastBeat: -1,
          fed: false, flash: 0, shells: []
        };
        if (api.guardsOff) g.period *= 0.82;
        api.onHit = function (e) {
          if (e && e.preventDefault) e.preventDefault();
          var phase = (performance.now() / 1000) % g.period / g.period;
          g.pending = phase;
          g.feed = true;
        };
        api.onKey = function (e) {
          if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') api.onHit(e);
        };
        document.addEventListener('keydown', api.onKey);
        api.canvas.addEventListener('mousedown', api.onHit);
        api.canvas.addEventListener('touchstart', api.onHit, { passive: false });
        Minigames._t = api;
      },
      teardown: function () {
        var api = Minigames._t;
        if (api) document.removeEventListener('keydown', api.onKey);
      },
      step: function (api, t) {
        var g = api.g, c = api.ctx, w = api.w, h = api.h;
        var dt = Math.min(0.05, t - g.last); g.last = t;

        var beat = Math.floor(t / g.period);
        var phase = (t % g.period) / g.period;
        if (beat !== g.lastBeat) {
          if (g.lastBeat >= 0 && !g.fed) g.misses++;
          g.lastBeat = beat; g.fed = false; g.total++;
          Audio.press();
          api.shake();
        }
        /* the ram is down between .45 and .60 of the beat */
        if (g.feed) {
          g.feed = false;
          if (!g.fed) {
            g.fed = true;
            var d = Math.abs(phase - 0.28);
            if (d < 0.10) { g.hits++; g.shells.push({ x: 300, y: 150, vx: 150 + Math.random() * 60, life: 1 }); Audio.coin(); }
            else if (phase > 0.44 && phase < 0.62) { g.near++; g.flash = 1; api.shake(); Audio.hit(); }
            else { g.misses++; }
          }
        }
        if (t > 7.6) {
          var q = Util.clamp((g.hits - g.near * 0.8) / Math.max(1, g.total), 0, 1);
          api.finish(q); return;
        }
        api.setScore(g.hits);

        /* ---- draw ---- */
        c.fillStyle = '#0D0F12'; c.fillRect(0, 0, w, h);
        c.fillStyle = '#241A14'; c.fillRect(0, 176, w, 48);

        /* frame */
        c.fillStyle = '#3A3128'; c.fillRect(200, 14, 240, 16);
        c.fillStyle = '#2E2820'; c.fillRect(206, 14, 20, 150); c.fillRect(414, 14, 20, 150);

        /* the ram: down at .45-.60 */
        var down = phase > 0.42 && phase < 0.64;
        var ramY = down ? 60 : (phase < 0.42 ? phase / 0.42 * 20 : 20 - (phase - 0.64) / 0.36 * 20);
        c.fillStyle = '#4A423A'; c.fillRect(256, 30 + ramY, 128, 16);
        c.fillStyle = '#5C646A'; c.fillRect(286, 46 + ramY, 68, 52);
        c.fillStyle = '#8D949A'; c.fillRect(278, 98 + ramY, 84, 14);

        /* the die and the blank you feed it */
        c.fillStyle = '#3A3128'; c.fillRect(262, 150, 116, 24);
        if (g.fed && !down) {
          c.fillStyle = '#C39A3E';
          c.beginPath(); c.moveTo(290, 150); c.quadraticCurveTo(320, 118, 350, 150); c.fill();
        }

        /* the beat marker */
        c.fillStyle = '#22272D'; c.fillRect(40, 198, w - 80, 14);
        c.fillStyle = 'rgba(78,107,94,.45)';
        c.fillRect(40 + 0.18 * (w - 80), 198, 0.20 * (w - 80), 14);   /* the window */
        c.fillStyle = 'rgba(142,59,47,.5)';
        c.fillRect(40 + 0.44 * (w - 80), 198, 0.18 * (w - 80), 14);   /* the ram */
        c.fillStyle = '#E0A24A';
        c.fillRect(40 + phase * (w - 80) - 2, 194, 4, 22);

        /* finished shells */
        for (var i = g.shells.length - 1; i >= 0; i--) {
          var s = g.shells[i];
          s.x += s.vx * dt; s.life -= dt;
          if (s.life <= 0) { g.shells.splice(i, 1); continue; }
          c.fillStyle = 'rgba(195,154,62,' + Math.max(0, s.life) + ')';
          c.beginPath(); c.moveTo(s.x, s.y); c.quadraticCurveTo(s.x + 15, s.y - 16, s.x + 30, s.y); c.fill();
        }
        if (g.flash > 0) {
          g.flash -= dt * 2.2;
          c.fillStyle = 'rgba(142,59,47,' + Math.max(0, g.flash) * 0.5 + ')';
          c.fillRect(0, 0, w, h);
        }
        c.fillStyle = '#C9C4B8';
        c.font = '600 15px "Courier Prime", monospace';
        c.fillText(g.hits + ' fed', 500, 30);
        if (g.near) { c.fillStyle = '#EA9084'; c.fillText(g.near + ' near', 500, 52); }
      }
    }
  }
};
