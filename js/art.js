/* ==========================================================================
   GRIMWICK WORKS — js/art.js
   Every picture in the game is drawn here, in SVG, at runtime. No image
   files, no CDN, nothing to fail on file://. Motion lives in CSS classes
   (gw-*) so prefers-reduced-motion can switch all of it off at once.

   Drawn from the period: a brick arms works with its chimneys, a caplock
   musket, conical ball and cartridge, a percussion cap, a bayonet, and a
   stamped brass helmet shell.
   ========================================================================== */

var Art = {

  /* ---------------------------------------------------------------- defs */
  defs: function () {
    return '' +
    '<defs>' +
      '<linearGradient id="gwSky" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#4a3d2a"/>' +
        '<stop offset="45%" stop-color="#7a6238"/>' +
        '<stop offset="100%" stop-color="#b08d4c"/>' +
      '</linearGradient>' +
      '<linearGradient id="gwBrick" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#8e4a2c"/>' +
        '<stop offset="100%" stop-color="#4e281c"/>' +
      '</linearGradient>' +
      '<linearGradient id="gwRoof" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#3a332c"/>' +
        '<stop offset="100%" stop-color="#241f1b"/>' +
      '</linearGradient>' +
      '<radialGradient id="gwLamp" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0%" stop-color="#ffd489" stop-opacity=".95"/>' +
        '<stop offset="100%" stop-color="#ffb04a" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<radialGradient id="gwMolten" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0%" stop-color="#fff0c2"/>' +
        '<stop offset="35%" stop-color="#ffb43c"/>' +
        '<stop offset="70%" stop-color="#d8541a" stop-opacity=".8"/>' +
        '<stop offset="100%" stop-color="#7a1f08" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="gwSteel" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#cfd4d8"/>' +
        '<stop offset="45%" stop-color="#8d949a"/>' +
        '<stop offset="55%" stop-color="#6b7278"/>' +
        '<stop offset="100%" stop-color="#3f4448"/>' +
      '</linearGradient>' +
      '<linearGradient id="gwBrass" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#f0d489"/>' +
        '<stop offset="40%" stop-color="#c39a3e"/>' +
        '<stop offset="70%" stop-color="#8f6c22"/>' +
        '<stop offset="100%" stop-color="#5d4614"/>' +
      '</linearGradient>' +
      '<linearGradient id="gwWood" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#8a5a2f"/>' +
        '<stop offset="55%" stop-color="#5e3a1c"/>' +
        '<stop offset="100%" stop-color="#3b2411"/>' +
      '</linearGradient>' +
      '<linearGradient id="gwStone" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#9a9184"/>' +
        '<stop offset="50%" stop-color="#6f675c"/>' +
        '<stop offset="100%" stop-color="#4a443c"/>' +
      '</linearGradient>' +
      '<pattern id="gwCourses" width="16" height="8" patternUnits="userSpaceOnUse">' +
        '<rect width="16" height="8" fill="none"/>' +
        '<path d="M0 7.5H16M8 0V7.5" stroke="#2b1611" stroke-width="1" opacity=".45"/>' +
      '</pattern>' +
      '<filter id="gwSoft"><feGaussianBlur stdDeviation="6"/></filter>' +
      '<filter id="gwSoft2"><feGaussianBlur stdDeviation="2"/></filter>' +
    '</defs>';
  },

  /* ------------------------------------------------------------ the works
     The banner over the shift screen: brick block, lit windows, three stacks
     going hard, the yard wall and the gate.
     ------------------------------------------------------------------- */
  works: function () {
    var w = [];
    w.push('<svg class="gw-svg gw-works" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice" role="img" aria-label="">');
    w.push(Art.defs());

    /* sky and the permanent overcast */
    w.push('<rect width="1200" height="320" fill="url(#gwSky)"/>');
    w.push('<ellipse cx="640" cy="40" rx="640" ry="90" fill="#241d16" opacity=".55" filter="url(#gwSoft)"/>');

    /* smoke — three plumes, staggered */
    w.push(Art.smoke(268, 44, 1));
    w.push(Art.smoke(742, 20, 2));
    w.push(Art.smoke(985, 66, 3));

    /* the rest of the district, going at it too */
    w.push('<g opacity=".42" fill="#2c2219">');
    w.push('<rect x="20" y="150" width="120" height="120"/><rect x="52" y="86" width="18" height="70"/>');
    w.push('<rect x="1052" y="168" width="140" height="102"/><rect x="1112" y="110" width="16" height="62"/>');
    w.push('<rect x="900" y="196" width="90" height="74"/>');
    w.push('</g>');
    w.push('<g opacity=".22" fill="#1a140f">');
    for (var fs = 0; fs < 9; fs++) w.push('<rect x="' + (10 + fs * 130) + '" y="' + (200 + (fs % 3) * 8) + '" width="7" height="70"/>');
    w.push('</g>');

    /* main block */
    w.push('<g>');
    w.push('<rect x="150" y="120" width="620" height="150" fill="url(#gwBrick)"/>');
    w.push('<rect x="150" y="120" width="620" height="150" fill="url(#gwCourses)"/>');
    w.push('<rect x="142" y="112" width="636" height="14" fill="url(#gwRoof)"/>');
    w.push('<rect x="150" y="180" width="620" height="5" fill="#2b1611" opacity=".6"/>');

    /* arched windows, two rows, lit */
    var x, r;
    for (r = 0; r < 2; r++) {
      for (x = 0; x < 13; x++) {
        var wx = 168 + x * 46, wy = 134 + r * 52;
        w.push('<path d="M' + wx + ' ' + (wy + 30) + ' V' + (wy + 9) +
               ' a10 10 0 0 1 20 0 V' + (wy + 30) + ' Z" fill="#1a120c"/>');
        w.push('<path class="gw-win" style="animation-delay:' + ((x * 137 + r * 411) % 2600) + 'ms" d="M' +
               (wx + 2) + ' ' + (wy + 28) + ' V' + (wy + 10) +
               ' a8 8 0 0 1 16 0 V' + (wy + 28) + ' Z" fill="#e8a83f" opacity=".72"/>');
      }
    }

    /* the sign board */
    w.push('<rect x="330" y="188" width="260" height="30" fill="#241a12" stroke="#8a6a34" stroke-width="2"/>');
    w.push('<text x="460" y="209" text-anchor="middle" font-family="Georgia,serif" font-size="17" letter-spacing="1.5" fill="#d9b76a">GRIMWICK SMALL ARMS</text>');

    /* chimneys */
    w.push(Art.chimney(250, 44, 36, 226));
    w.push(Art.chimney(724, 20, 40, 250));
    w.push(Art.chimney(968, 66, 30, 204));

    /* the flag of the Concord */
    w.push('<rect x="452" y="60" width="3" height="54" fill="#4a4038"/>');
    w.push('<path class="gw-flag" d="M455 62 h58 l-8 10 8 10 h-58 Z" fill="#7a2c26"/>');
    w.push('<path class="gw-flag" style="animation-delay:-.7s" d="M455 62 h58 l-8 10 8 10 h-58 Z" fill="#000" opacity=".18"/>');

    /* side shed with skylights */
    w.push('<path d="M770 270 V196 l90 -34 90 34 v74 Z" fill="#4a2a1e"/>');
    w.push('<path d="M770 196 l90 -34 90 34 Z" fill="url(#gwRoof)"/>');
    for (x = 0; x < 4; x++) {
      w.push('<rect class="gw-win" style="animation-delay:' + (x * 700) + 'ms" x="' + (792 + x * 34) + '" y="214" width="22" height="30" fill="#e8a83f" opacity=".55"/>');
    }
    w.push('</g>');

    /* yard, wall, gate, cobbles */
    w.push('<rect x="0" y="268" width="1200" height="52" fill="#2a231c"/>');
    w.push('<rect x="0" y="264" width="1200" height="8" fill="#3a3129"/>');
    for (x = 0; x < 60; x++) {
      w.push('<rect x="' + (x * 20 + (x % 2 ? 6 : 0)) + '" y="' + (280 + (x % 3) * 10) + '" width="14" height="6" rx="3" fill="#3b332a" opacity=".8"/>');
    }

    /* gas lamp */
    w.push('<circle cx="96" cy="228" r="30" fill="url(#gwLamp)" class="gw-lamp"/>');
    w.push('<rect x="93" y="228" width="5" height="46" fill="#2c2620"/>');
    w.push('<path d="M86 222 h20 l-4 -12 h-12 Z" fill="#3a332b" stroke="#6b5c3f"/>');

    /* the queue at the gate, which is never shorter than eleven */
    for (var q = 0; q < 11; q++) {
      w.push(Art.figure(486 + q * 17, 290 + (q % 2) * 4, .62 + (q % 3) * .06, '#181310'));
    }
    /* a soldier crossing with a caplock slung */
    w.push('<g transform="translate(1024,290)">');
    w.push(Art.figure(0, 0, 1, '#141009'));
    w.push('<rect x="-2" y="-30" width="2.6" height="30" fill="#141009" transform="rotate(18)"/>');
    w.push('</g>');
    w.push('<g transform="translate(160,258)">');
    w.push('<rect x="0" y="12" width="86" height="26" fill="#3a2a1c"/>');
    w.push('<circle cx="16" cy="42" r="11" fill="none" stroke="#241a12" stroke-width="4"/>');
    w.push('<circle cx="70" cy="42" r="11" fill="none" stroke="#241a12" stroke-width="4"/>');
    w.push('</g>');

    /* soot in the air, over everything */
    w.push('<rect width="1200" height="320" fill="#120e0a" opacity=".22"/>');
    w.push('<rect width="1200" height="320" fill="url(#gwVign)" opacity=".0"/>');
    w.push('</svg>');
    return w.join('');
  },

  chimney: function (x, top, w, base) {
    return '<g>' +
      '<path d="M' + x + ' ' + base + ' L' + (x + 3) + ' ' + top + ' h' + (w - 6) + ' L' + (x + w) + ' ' + base + ' Z" fill="#3d251b"/>' +
      '<path d="M' + x + ' ' + base + ' L' + (x + 3) + ' ' + top + ' h' + (w - 6) + ' L' + (x + w) + ' ' + base + ' Z" fill="url(#gwCourses)"/>' +
      '<rect x="' + (x - 2) + '" y="' + (top - 6) + '" width="' + (w + 4) + '" height="7" fill="#2a1a12"/>' +
      '</g>';
  },

  smoke: function (x, y, n) {
    var g = ['<g class="gw-smokestack">'];
    for (var i = 0; i < 5; i++) {
      g.push('<ellipse class="gw-smoke gw-smoke' + n + '" style="animation-delay:' + (i * 1.5 + n * 0.6) + 's" cx="' + (x + 18) + '" cy="' + y + '" rx="26" ry="18" fill="#1d1913" opacity=".18"/>');
    }
    g.push('</g>');
    return g.join('');
  },

  figure: function (x, y, s, fill) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + fill + '">' +
      '<circle cx="0" cy="-22" r="4.6"/>' +
      '<path d="M-5 -17 h10 l3 13 -4 0 -1 12 h-3 l-1 -9 -1 9 h-3 l-1 -12 -4 0 Z"/>' +
      '</g>';
  },

  /* ------------------------------------------------------------- stations */
  station: function (id) {
    if (id === 'CASTING') return Art.casting();
    if (id === 'CAP_BENCH') return Art.capBench();
    if (id === 'GRINDING') return Art.grinding();
    return Art.stamping();
  },

  frame: function (inner, cls) {
    return '<svg class="gw-svg gw-station ' + (cls || '') + '" viewBox="0 0 640 240" preserveAspectRatio="xMidYMid meet" role="img" aria-label="">' +
      Art.defs() +
      Art.shedBack() +
      inner +
      Art.shedFront() +
      '</svg>';
  },

  /* brick, roof trusses, a barred window, and the shaft that drives it all */
  shedBack: function () {
    var g = ['<rect width="640" height="240" fill="#241a14"/>'];
    g.push('<rect width="640" height="182" fill="url(#gwBrick)" opacity=".55"/>');
    g.push('<rect width="640" height="182" fill="url(#gwCourses)" opacity=".7"/>');
    /* roof trusses */
    g.push('<g stroke="#2e2419" stroke-width="6" opacity=".8">');
    g.push('<path d="M-10 46 H650"/>');
    g.push('<path d="M60 46 L120 6 L180 46 M300 46 L360 6 L420 46 M540 46 L600 6 L650 46" fill="none"/>');
    g.push('</g>');
    /* a window nobody has cleaned since the works was built */
    g.push('<g transform="translate(28,62)">');
    g.push('<rect width="96" height="76" fill="#0f0c08"/>');
    g.push('<rect x="4" y="4" width="88" height="68" fill="#8a7f52" opacity=".30" class="gw-win"/>');
    g.push('<path d="M48 4 V72 M4 26 H92 M4 50 H92" stroke="#241a12" stroke-width="4"/>');
    g.push('</g>');
    /* the floor */
    g.push('<rect y="176" width="640" height="64" fill="#1d1710"/>');
    g.push('<rect y="176" width="640" height="4" fill="#100c08"/>');
    for (var i = 0; i < 22; i++) {
      g.push('<rect x="' + (i * 30) + '" y="' + (188 + (i % 3) * 14) + '" width="20" height="5" rx="2" fill="#241d15" opacity=".9"/>');
    }
    return g.join('');
  },

  /* soot in the air of the shed, and the frame of the doorway you see it through */
  shedFront: function () {
    return '<rect width="640" height="240" fill="#0d0a08" opacity=".16"/>' +
      '<rect width="640" height="34" fill="#0d0a08" opacity=".35"/>' +
      '<rect y="222" width="640" height="18" fill="#0d0a08" opacity=".3"/>';
  },

  casting: function () {
    var g = [];
    /* furnace mouth */
    g.push('<ellipse cx="150" cy="120" rx="110" ry="80" fill="url(#gwMolten)" opacity=".38" class="gw-glow"/>');
    g.push('<path d="M70 176 V96 a52 52 0 0 1 104 0 v80 Z" fill="#2e211a"/>');
    g.push('<path d="M92 176 V104 a30 30 0 0 1 60 0 v72 Z" fill="#120c08"/>');
    g.push('<path class="gw-fire" d="M100 172 q10 -34 22 -16 q6 -30 20 -6 q10 -18 12 22 Z" fill="#ff9a2e"/>');
    g.push('<path class="gw-fire" style="animation-delay:-.6s" d="M106 172 q8 -24 18 -12 q6 -20 14 -4 q8 -12 10 16 Z" fill="#ffd07a"/>');

    /* crucible on its trunnion, tipping */
    g.push('<g class="gw-ladle" transform="translate(300,84)">');
    g.push('<path d="M-34 0 h68 l-10 46 h-48 Z" fill="#4a423a" stroke="#2a241e" stroke-width="3"/>');
    g.push('<path d="M-30 4 h60 l-8 12 h-44 Z" fill="url(#gwMolten)"/>');
    g.push('<rect x="-52" y="-6" width="18" height="8" rx="3" fill="#3b342c"/>');
    g.push('</g>');
    /* the pour */
    g.push('<path class="gw-pour" d="M300 130 q6 26 2 44" stroke="url(#gwMolten)" stroke-width="7" fill="none" stroke-linecap="round"/>');
    g.push('<ellipse cx="302" cy="178" rx="30" ry="9" fill="url(#gwMolten)" opacity=".8" class="gw-glow"/>');

    /* the mould block, and balls cooling */
    g.push('<rect x="256" y="176" width="120" height="22" rx="3" fill="#3a3129"/>');
    for (var i = 0; i < 5; i++) g.push('<circle cx="' + (270 + i * 24) + '" cy="176" r="7" fill="#151009"/>');
    g.push('<rect x="420" y="160" width="150" height="38" rx="4" fill="#2b241d" stroke="#3f362c"/>');
    for (var r = 0; r < 2; r++) {
      for (var c = 0; c < 7; c++) {
        g.push('<circle cx="' + (436 + c * 20) + '" cy="' + (172 + r * 18) + '" r="8" fill="#6f675c"/>');
        g.push('<circle cx="' + (433 + c * 20) + '" cy="' + (169 + r * 18) + '" r="3" fill="#a49a8b" opacity=".8"/>');
      }
    }
    /* a second furnace down the shed, and the pig-lead stack */
    g.push('<g opacity=".55" transform="translate(500,40) scale(.6)">');
    g.push('<path d="M70 176 V96 a52 52 0 0 1 104 0 v80 Z" fill="#2e211a"/>');
    g.push('<path d="M92 176 V104 a30 30 0 0 1 60 0 v72 Z" fill="#1a0f08"/>');
    g.push('<ellipse cx="122" cy="150" rx="30" ry="24" fill="url(#gwMolten)" opacity=".5" class="gw-glow"/>');
    g.push('</g>');
    g.push('<g transform="translate(560,150)">');
    for (var pl = 0; pl < 3; pl++) {
      for (var pc = 0; pc < 3 - pl; pc++) {
        g.push('<rect x="' + (pc * 22 + pl * 11) + '" y="' + (-pl * 11) + '" width="20" height="9" rx="2" fill="#5c646a"/>');
      }
    }
    g.push('</g>');
    g.push(Art.worker(214, 176, 1.5, true));
    return Art.frame(g.join(''), 'gw-casting');
  },

  capBench: function () {
    var g = [];
    /* the long bench */
    g.push('<rect x="30" y="150" width="580" height="16" fill="#4a3a26"/>');
    g.push('<rect x="30" y="166" width="580" height="8" fill="#2e2418"/>');
    g.push('<rect x="60" y="174" width="12" height="30" fill="#2e2418"/>');
    g.push('<rect x="560" y="174" width="12" height="30" fill="#2e2418"/>');

    /* trays of copper cups */
    for (var t = 0; t < 3; t++) {
      var bx = 80 + t * 180;
      g.push('<rect x="' + bx + '" y="126" width="150" height="26" rx="3" fill="#2a221a" stroke="#4a3c2c"/>');
      for (var c = 0; c < 9; c++) {
        for (var r = 0; r < 2; r++) {
          g.push('<circle cx="' + (bx + 12 + c * 16) + '" cy="' + (134 + r * 12) + '" r="4.4" fill="url(#gwBrass)"/>');
        }
      }
    }
    /* powder jar and scoop */
    g.push('<path d="M300 150 v-30 a14 14 0 0 1 28 0 v30 Z" fill="#3a3630" stroke="#5a5348"/>');
    g.push('<rect x="302" y="112" width="24" height="6" fill="#5a5348"/>');
    g.push('<path class="gw-scoop" d="M352 150 l14 -22 6 4 -14 22 Z" fill="#8d949a"/>');

    /* the lamp, and the light it makes */
    g.push('<circle cx="470" cy="112" r="42" fill="url(#gwLamp)" class="gw-lamp"/>');
    g.push('<path d="M462 130 h16 l-3 -22 h-10 Z" fill="#c39a3e"/>');
    g.push('<path class="gw-fire" d="M468 108 q2 -12 5 -12 q3 0 5 12 Z" fill="#ffd07a"/>');

    /* the bench: a woman, a girl, a child */
    /* the shelf of finished tins behind the bench */
    g.push('<rect x="150" y="66" width="360" height="8" fill="#3a2e1e"/>');
    for (var tn = 0; tn < 9; tn++) {
      g.push('<rect x="' + (158 + tn * 38) + '" y="46" width="26" height="20" rx="2" fill="#4a3f2a" stroke="#5f5136"/>');
    }
    g.push(Art.worker(150, 150, 1.25, false, '#241c16'));
    g.push(Art.worker(250, 150, 0.95, false, '#241c16'));
    g.push(Art.worker(420, 150, 0.82, false, '#241c16'));
    g.push(Art.worker(520, 150, 1.2, false, '#241c16'));
    return Art.frame(g.join(''), 'gw-cap');
  },

  grinding: function () {
    var g = [];
    /* shaft and belt overhead */
    g.push('<rect x="0" y="26" width="640" height="10" fill="#2e2820"/>');
    g.push('<path d="M300 36 L262 118 M330 36 L360 118" stroke="#3a3128" stroke-width="7" class="gw-belt"/>');

    /* the wheel */
    g.push('<g transform="translate(300,132)">');
    g.push('<circle r="82" fill="url(#gwStone)" class="gw-wheel"/>');
    g.push('<g class="gw-wheel">');
    for (var a = 0; a < 12; a++) {
      g.push('<rect x="-1.5" y="-80" width="3" height="26" fill="#57503f" opacity=".55" transform="rotate(' + (a * 30) + ')"/>');
    }
    g.push('</g>');
    g.push('<circle r="82" fill="none" stroke="#241d16" stroke-width="4"/>');
    g.push('<circle r="14" fill="#3d372e" stroke="#221c16" stroke-width="4"/>');
    g.push('</g>');

    /* blade held to the stone */
    g.push('<g transform="translate(386,120) rotate(-16)">');
    g.push('<path d="M0 0 h96 l16 6 -16 6 H0 Z" fill="url(#gwSteel)"/>');
    g.push('<rect x="96" y="-2" width="26" height="16" rx="3" fill="#4a423a"/>');
    g.push('</g>');

    /* the spark fan */
    g.push('<g class="gw-sparks">');
    for (var i = 0; i < 22; i++) {
      var ang = -30 + i * 4.2;
      g.push('<line class="gw-spark" style="animation-delay:' + (i * 90) + 'ms" x1="356" y1="120" x2="' +
        (356 + 150 * Math.cos(ang * Math.PI / 180)) + '" y2="' + (120 + 150 * Math.sin(ang * Math.PI / 180)) +
        '" stroke="#ffc463" stroke-width="1.6" opacity="0"/>');
    }
    g.push('</g>');

    /* dust in the shaft of light */
    g.push('<path d="M150 0 L250 0 L190 200 L60 200 Z" fill="#c9b98a" opacity=".07"/>');
    g.push('<g class="gw-dust" fill="#cdbf9c" opacity=".35">');
    for (var d = 0; d < 26; d++) {
      g.push('<circle style="animation-delay:' + (d * 220) + 'ms" cx="' + (70 + (d * 37) % 180) + '" cy="' + (20 + (d * 61) % 180) + '" r="1.6"/>');
    }
    g.push('</g>');
    /* the next wheel down the shed, and the rack of blades waiting */
    g.push('<g opacity=".5" transform="translate(560,120) scale(.55)">');
    g.push('<circle r="82" fill="url(#gwStone)" class="gw-wheel"/>');
    g.push('<circle r="82" fill="none" stroke="#241d16" stroke-width="6"/>');
    g.push('</g>');
    g.push('<g transform="translate(40,150)">');
    for (var bl = 0; bl < 6; bl++) {
      g.push('<path d="M' + (bl * 13) + ' 0 l6 -46 3 46 Z" fill="url(#gwSteel)" opacity=".9"/>');
    }
    g.push('<rect x="-6" y="0" width="90" height="8" fill="#3a2e1e"/>');
    g.push('</g>');
    g.push(Art.worker(452, 176, 1.5, true));
    return Art.frame(g.join(''), 'gw-grind');
  },

  stamping: function () {
    var g = [];
    /* press frame */
    g.push('<rect x="200" y="20" width="240" height="18" fill="#3a3128"/>');
    g.push('<rect x="206" y="20" width="20" height="160" fill="#2e2820"/>');
    g.push('<rect x="414" y="20" width="20" height="160" fill="#2e2820"/>');
    /* flywheel */
    g.push('<g transform="translate(500,70)"><circle r="46" fill="none" stroke="#3a3128" stroke-width="12" class="gw-wheel"/>' +
           '<circle r="8" fill="#4a423a"/></g>');
    /* the ram */
    g.push('<g class="gw-ram">');
    g.push('<rect x="256" y="38" width="128" height="16" fill="#4a423a"/>');
    g.push('<rect x="286" y="54" width="68" height="52" fill="url(#gwSteel)"/>');
    g.push('<rect x="278" y="106" width="84" height="14" fill="#5c646a"/>');
    g.push('</g>');
    /* die and the shell on it */
    g.push('<rect x="262" y="156" width="116" height="24" fill="#3a3128"/>');
    g.push('<path d="M290 156 q30 -34 60 0 Z" fill="url(#gwBrass)"/>');
    g.push('<path class="gw-shock" d="M240 180 h160" stroke="#8a7a52" stroke-width="2" opacity="0"/>');
    /* bin of finished shells */
    g.push('<rect x="60" y="150" width="120" height="46" rx="4" fill="#2b241d" stroke="#3f362c"/>');
    for (var i = 0; i < 5; i++) {
      g.push('<path transform="translate(' + (76 + i * 22) + ',150) scale(.5)" d="M0 0 q30 -34 60 0 Z" fill="url(#gwBrass)"/>');
    }
    /* a second press further down, out of step with this one */
    g.push('<g opacity=".45" transform="translate(-118,26) scale(.7)">');
    g.push('<rect x="200" y="20" width="240" height="18" fill="#3a3128"/>');
    g.push('<rect x="206" y="20" width="20" height="160" fill="#2e2820"/>');
    g.push('<rect x="414" y="20" width="20" height="160" fill="#2e2820"/>');
    g.push('<g class="gw-ram" style="animation-delay:-.7s"><rect x="256" y="38" width="128" height="16" fill="#4a423a"/>' +
           '<rect x="286" y="54" width="68" height="52" fill="#5c646a"/></g>');
    g.push('</g>');
    g.push(Art.worker(420, 176, 1.5, true));
    return Art.frame(g.join(''), 'gw-stamp');
  },

  worker: function (x, y, s, standing, fill) {
    fill = fill || '#1e1811';
    if (standing) {
      return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + fill + '">' +
        '<circle cx="0" cy="-40" r="7"/>' +
        '<path d="M-9 -33 h18 l5 22 -6 1 -2 10 h-4 l-2 -8 -2 8 h-4 l-2 -10 -6 -1 Z"/>' +
        '</g>';
    }
    /* seated at the bench, shoulders forward */
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + fill + '">' +
      '<circle cx="0" cy="-34" r="6.6"/>' +
      '<path d="M-8 -27 q8 -3 16 0 l4 18 h-24 Z"/>' +
      '<path d="M6 -18 q12 4 14 12 l-4 3 q-6 -8 -12 -9 Z"/>' +
      '</g>';
  },

  /* ---------------------------------------------------------------- icons
     Used on the tally and the docket. Period-correct: a caplock musket, a
     conical ball and its paper cartridge, a percussion cap, a socket bayonet,
     a stamped helmet shell.
     ------------------------------------------------------------------- */
  icon: function (name, size) {
    var box = {
      musket:   '0 0 260 64',
      cartridge:'0 0 40 96',
      ball:     '0 0 44 60',
      cap:      '0 0 40 44',
      blade:    '0 0 220 40',
      helmet:   '0 0 96 84'
    }[name] || '0 0 40 40';
    return '<svg class="gw-icon gw-icon--' + name + '" viewBox="' + box + '" ' +
      (size ? 'style="height:' + size + 'px" ' : '') + 'role="img" aria-label="">' +
      Art.defs() + Art['icon_' + name]() + '</svg>';
  },

  icon_musket: function () {
    return '' +
      /* barrel */
      '<rect x="70" y="20" width="180" height="7" rx="2" fill="url(#gwSteel)"/>' +
      '<rect x="240" y="18" width="12" height="11" rx="2" fill="#6b7278"/>' +
      /* ramrod under the barrel */
      '<rect x="96" y="30" width="146" height="3" rx="1.5" fill="#8d949a" opacity=".8"/>' +
      /* barrel bands */
      '<rect x="120" y="17" width="7" height="16" fill="#5c646a"/>' +
      '<rect x="176" y="17" width="7" height="16" fill="#5c646a"/>' +
      /* fore-end and stock */
      '<path d="M28 28 h92 v10 H44 Z" fill="url(#gwWood)"/>' +
      '<path d="M14 24 q-10 14 2 26 l30 8 q16 -10 22 -22 l-10 -12 Z" fill="url(#gwWood)"/>' +
      '<path d="M44 30 h72 v6 H50 Z" fill="#000" opacity=".18"/>' +
      /* lock plate, hammer, nipple */
      '<path d="M60 22 h34 a10 10 0 0 1 0 18 H60 Z" fill="#7a8087"/>' +
      '<path d="M78 22 q10 -12 18 -4 l-6 6 q-4 -4 -8 4 Z" fill="#4a5054"/>' +
      '<circle cx="96" cy="24" r="3" fill="#c39a3e"/>' +
      /* trigger and guard */
      '<path d="M62 40 q10 12 26 6" stroke="#5c646a" stroke-width="3" fill="none"/>' +
      '<rect x="70" y="38" width="3" height="8" fill="#5c646a"/>';
  },

  icon_cartridge: function () {
    return '' +
      '<path d="M8 40 h24 v44 a6 6 0 0 1 -6 6 H14 a6 6 0 0 1 -6 -6 Z" fill="url(#gwBrass)"/>' +
      '<rect x="8" y="78" width="24" height="4" fill="#7a5c18" opacity=".7"/>' +
      '<path d="M10 40 q10 -34 20 0 Z" fill="#8d949a"/>' +
      '<path d="M14 34 q6 -18 12 0 Z" fill="#b9c0c6"/>' +
      '<circle cx="20" cy="88" r="3.4" fill="#5d4614"/>';
  },

  icon_ball: function () {
    return '' +
      '<path d="M10 40 q12 -34 24 0 v10 H10 Z" fill="url(#gwSteel)"/>' +
      '<path d="M10 50 h24 v6 H10 Z" fill="#5c646a"/>' +
      '<path d="M14 50 h4 v6 h-4 Z M26 50 h4 v6 h-4 Z" fill="#3f4448"/>' +
      '<path d="M16 22 q6 -12 12 0" fill="#cfd4d8" opacity=".7"/>';
  },

  icon_cap: function () {
    return '' +
      '<path d="M10 16 h20 v20 a4 4 0 0 1 -4 4 H14 a4 4 0 0 1 -4 -4 Z" fill="url(#gwBrass)"/>' +
      '<path d="M10 16 q10 -10 20 0 Z" fill="#e8c98a"/>' +
      '<path d="M13 20 h14 v3 H13 Z" fill="#000" opacity=".18"/>';
  },

  icon_blade: function () {
    return '' +
      '<path d="M6 18 h150 l50 2 -50 2 H6 Z" fill="url(#gwSteel)"/>' +
      '<path d="M6 18 h150 l50 2 H6 Z" fill="#cfd4d8" opacity=".45"/>' +
      '<rect x="0" y="12" width="26" height="16" rx="3" fill="#4a423a"/>' +
      '<rect x="24" y="14" width="6" height="12" fill="#6b7278"/>';
  },

  icon_helmet: function () {
    return '' +
      '<path d="M10 62 q0 -46 38 -46 t38 46 z" fill="url(#gwBrass)"/>' +
      '<path d="M44 16 q4 -12 8 0 v46 h-8 Z" fill="#e8c98a"/>' +
      '<path d="M10 62 q38 14 76 0 l2 8 q-40 14 -80 0 Z" fill="#8f6c22"/>' +
      '<circle cx="26" cy="48" r="5" fill="#5d4614" opacity=".7"/>' +
      '<path d="M20 34 q28 -18 56 0" stroke="#f0d489" stroke-width="2" fill="none" opacity=".5"/>';
  },

  unitIcon: function (station) {
    return { CASTING: 'ball', CAP_BENCH: 'cap', GRINDING: 'blade', STAMPING: 'helmet' }[station] || 'ball';
  },

  /* ------------------------------------------------------------ town map
     Roads and nodes only — the labels are real HTML buttons laid over this,
     so they stay at a readable size at every width.
     ------------------------------------------------------------------- */
  townMap: function (nodes, hereId) {
    var pos = Art.mapPositions;
    var edges = [
      ['rows', 'ewe'], ['rows', 'market'], ['market', 'store'], ['market', 'pawn'],
      ['market', 'chapel'], ['market', 'apothecary'], ['market', 'works'],
      ['works', 'garrison'], ['market', 'railyard'], ['railyard', 'cut'], ['works', 'railyard']
    ];
    var g = ['<svg class="gw-svg gw-map" viewBox="0 0 640 360" preserveAspectRatio="none" role="presentation">'];
    g.push(Art.defs());
    g.push('<rect width="640" height="360" fill="#181410"/>');
    /* the cut, the river of soot everything is built along */
    g.push('<path d="M-10 300 q160 -40 320 -10 t330 -30" stroke="#241d16" stroke-width="26" fill="none" opacity=".8"/>');
    var i, a, b;
    for (i = 0; i < edges.length; i++) {
      a = pos[edges[i][0]]; b = pos[edges[i][1]];
      if (!a || !b) continue;
      var far = nodes.far[edges[i][0]] !== nodes.far[edges[i][1]];
      g.push('<path d="M' + a.x + ' ' + a.y + ' Q' + ((a.x + b.x) / 2 + 14) + ' ' + ((a.y + b.y) / 2 - 18) +
        ' ' + b.x + ' ' + b.y + '" stroke="' + (far ? '#5a4a33' : '#3d342a') + '" stroke-width="' + (far ? 5 : 7) +
        '" fill="none" stroke-linecap="round"' + (far ? ' stroke-dasharray="12 8"' : '') + '/>');
    }
    for (var id in pos) {
      if (!Object.prototype.hasOwnProperty.call(pos, id)) continue;
      if (!nodes.visible[id]) continue;
      var p = pos[id];
      var here = id === hereId;
      g.push('<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (here ? 16 : 11) + '" fill="' +
        (here ? '#d8834b' : (nodes.reach[id] ? '#6b5c40' : '#39322a')) + '" stroke="#120e0a" stroke-width="3"/>');
      if (here) g.push('<circle class="gw-here" cx="' + p.x + '" cy="' + p.y + '" r="24" fill="none" stroke="#d8834b" stroke-width="2" opacity=".7"/>');
    }
    g.push('</svg>');
    return g.join('');
  },

  mapPositions: {
    rows:       { x: 96,  y: 250 },
    ewe:        { x: 52,  y: 314 },
    market:     { x: 250, y: 214 },
    store:      { x: 336, y: 168 },
    pawn:       { x: 196, y: 136 },
    chapel:     { x: 306, y: 92  },
    apothecary: { x: 372, y: 262 },
    works:      { x: 498, y: 78  },
    garrison:   { x: 566, y: 152 },
    railyard:   { x: 500, y: 302 },
    cut:        { x: 616, y: 248 }
  },

  /* Mount SVG into a host element. Art is authored here, never user text. */
  into: function (node, markup) {
    if (!node) return;
    node.innerHTML = markup;
  }
};
