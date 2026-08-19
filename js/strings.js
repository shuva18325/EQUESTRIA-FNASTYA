/* ==========================================================================
   GRIMWICK WORKS — js/strings.js
   The lookup engine for data/strings.js. Logic files call T('a.b.c').
   No English lives here either — only the machinery that fetches it.
   ========================================================================== */

function T(path, params) {
  var node = STR, parts = String(path).split('.'), i;
  for (i = 0; i < parts.length; i++) {
    if (node == null || typeof node !== 'object' || !(parts[i] in node)) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[strings] missing key: ' + path);
      }
      return '';
    }
    node = node[parts[i]];
  }
  if (typeof node === 'string') return params ? interpolate(node, params) : node;
  return node;
}

function interpolate(text, params) {
  return text.replace(/\{(\w+)\}/g, function (m, k) {
    return (params && k in params) ? String(params[k]) : m;
  });
}

/* Five-band descriptor for a 0..100 stat: bands.<name> arrays in strings. */
function band(value, bandsKey, invert) {
  var arr = T('bands.' + bandsKey);
  if (!arr || !arr.length) return '';
  var v = invert ? 100 - value : value;
  var idx = Math.min(arr.length - 1, Math.max(0, Math.floor(v / (100 / arr.length))));
  return arr[idx];
}

/* -100..100 standing -> descriptor */
function standingBand(value) {
  var arr = T('bands.standing');
  var idx = Math.min(arr.length - 1, Math.max(0, Math.floor((value + 100) / (200 / arr.length))));
  return arr[idx];
}
