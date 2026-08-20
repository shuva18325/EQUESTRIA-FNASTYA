/* ==========================================================================
   GRIMWICK WORKS — tools/build-single-file.js
   Inlines every stylesheet and script into one self-contained page, for
   places that can only take a single file (a published artifact, an email
   attachment, a USB stick). The multi-file build in the repo root is the
   source of truth; this is only ever generated from it.

     node tools/build-single-file.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function grab(re) {
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}
const cssFiles = grab(/<link rel="stylesheet" href="([^"]+\.css)">/g);
const jsFiles  = grab(/<script src="([^"]+\.js)"><\/script>/g);
const fontLink = (html.match(/<link href="(https:\/\/fonts\.googleapis[^"]+)" rel="stylesheet">/) || [])[1];

const css = cssFiles.map(f =>
  `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(root, f), 'utf8')
).join('\n');

const js = jsFiles.map(f =>
  `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(root, f), 'utf8')
).join('\n;\n');

/* Written as page content only: no doctype, no <html>, no <head>, no <body>.
   The host supplies those. */
const out = `<title>Grimwick Works</title>
<meta name="description" content="A floor hand at the Grimwick Small Arms Works, Year 312 of the Iron Concord.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink ? `<link rel="stylesheet" href="${fontLink}">` : ''}

<style>
${css}
</style>

<div id="app">
  <header id="topbar" class="topbar"></header>
  <main id="stage" class="stage"></main>
  <footer class="logbar">
    <div id="log" aria-live="polite"></div>
  </footer>
</div>

<script>
${js}
</script>
<script>
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { UI.boot(); });
  } else {
    UI.boot();
  }
</script>
`;

const dest = path.join(root, 'dist', 'grimwick-works.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log('wrote ' + path.relative(root, dest) + '  ' +
  (Buffer.byteLength(out) / 1024).toFixed(0) + ' KB  ' +
  `(${cssFiles.length} stylesheets, ${jsFiles.length} scripts)`);
