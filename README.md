# GRIMWICK WORKS

A browser game. Grimdark industrial fantasy, no magic.

You are a floor hand at the Grimwick Small Arms Works in the year 312 of the Iron
Concord. You fill percussion caps, cast ball, stamp helmet shells and grind
bayonets. You are a cog. The game's job is to make being a cog feel like something.

**Build 2 of 6 — THE SHIFT.** The twelve hours are now the best-designed part
of the game; everything else in Grimwick is what the shift does to you. The
factory also has its graphics and its sound, brought forward from Build 5 at
the designer's request — all of it drawn and synthesised at runtime, so there
is still nothing to download and nothing that can fail on `file://`.

## Running it

Double-click `index.html`. That is the whole procedure — no build step, no
bundler, no server, no npm. Vanilla HTML/CSS/JS with plain `<script src>` tags
(deliberately not ES modules, so `file://` works). The only external dependency
is Google Fonts, and every face has a real fallback: with no network the game
looks slightly different and plays identically.

## The shift (Build 2)

Three dials, set before the bell, then twelve hours you watch happen:

- **Pace** — slow / steady / driven. Output against fatigue and accidents.
- **Care** — sloppy / proper / meticulous. Output against what inspection sends back.
- **Guards** — on / off. Guards off is faster, Coom prefers it, and it is how
  hands are lost. The game never says so. It lets the press explain.

Four floors, four different deaths: the **casting floor** (best paid, scalds,
and lead, which is permanent), the **cap bench** (the shake, and a fulminate
flash that takes whoever is nearest — staffed, as it was, by women and girls),
the **grinding shed** (stone in the lung, and a wheel that bursts), and the
**stamping shop** (no skill worth the name, and the press does not know you are
there). Each floor has its own skill, so a transfer costs real money for weeks —
and the cost is spelled out before you can agree to it.

**The count** is a weekly quota. Miss it: a fine, then a warning, then
dismissal. Beat it: a bonus smaller than you expected, and next week's figure
rises — shown old beside new, so you watch it happen to you.

**Overseer Halbrecht Coom** is a standing meter, not a friend. He assigns the
worst bench out of spite, writes invented charges onto your docket, and what
you may say to him at all is gated by where you stand: endure, flatter, bribe,
or write to the Factory Inspector. Reporting him is real, and mostly bad. The
Inspector finds the works in substantial compliance, because he is shown a
different factory, and by the afternoon everyone on the floor knows who wrote
the letter.

**Injuries** are typed and often permanent — scald, crushed hand, two fingers
gone, stone in the eye, hernia, flash burns, back. Untreated, a wound turns:
infection, then fever within about four nights, then death. The apothecary on
Kell Street costs more than a week's wage. That is the design, and it was the
fact.

The shift resolves as a short column of beat-lines — *"the ladle comes up full
and the light off it is the best light in Grimwick"* — paced at under four
seconds, skippable at any point, then the tally.

## Graphics and sound

Both are generated at runtime and shipped as code, not assets:

- `js/art.js` draws the works itself (brick, arched windows, three stacks going
  hard, the flag, the gate queue that is never shorter than eleven men), the
  interior of each of the four floors, and period-correct icons — a caplock
  musket, a conical ball, a paper cartridge, a percussion cap, a socket bayonet,
  a stamped brass helmet shell. Motion lives in CSS classes, so
  `prefers-reduced-motion` switches all of it off at once.
- `js/audio.js` synthesises the Works with WebAudio: the shafting and boiler
  under everything, then whatever the floor you are on does to the ear — the
  drop press every 1.55 seconds, the tick of the cap bench, the wheel and its
  sparks, the pour. Plus the five o'clock bell, the docket, and the flash.
  Toggleable from the top bar; the setting is saved with everything else.

## What is in this build

- **The day loop.** SHIFT → EVENING → NIGHT, resolved in that order, every
  transition an explicit click. Sixty days, three acts, four seasons.
- **The wage docket.** The signature screen. Every night the Works hands you a
  slip: hours, gross wage, every charge by name, then what is left. Some nights
  the charges are larger than the wage, and the difference goes on the store book.
- **The body that does not mend.** `dust` and `tremor` only ever rise —
  stone lung off the grinding wheel, the palsy off mercury fulminate. Health can
  be nursed; those two are a ratchet.
- **Death, not failure.** Starvation, exposure and an untreated wound each have
  an ending screen. Losing your job is *not* a game over: it opens the hiring
  crowd at the timber yard (the destitution track proper arrives in Build 3).
- **One dependent.** Tamsin, nine, winds cartridge paper at the kitchen table.
  When there is one meal and two of you, the game asks you which.
- **Saves.** Three slots plus an autosave every night, versioned and
  migration-safe: an old record is brought forward field by field.
- **Debug panel** behind the `~` key: set any field in `S`, jump to any day,
  force any event, god mode, and a save round-trip deep-compare.
- **Tutorial**, five steps across days 1–2, interruptible, skippable, and
  replayable from the menu.

Not yet: the town map and destitution track (Build 3), empire events and the
Act 2 retooling for the rifled musket (Build 4), the full art and audio pass
beyond the factory (Builds 5–6).

## Shape of the thing

```
index.html
css/   reset · tokens · layout · components · atmosphere
js/    state · loop · factory · town · economy · events
       empire · narrative · ui · save · audio · debug · strings
data/  events · npcs · items · locations · endings · strings
```

`data/*.js` define plain global consts — no `fetch()`, no JSON files, because
`fetch` fails on `file://`. `data/strings.js` holds every word the player can
read; `js/strings.js` is only the lookup engine (`T('path.to.key')`). No English
lives in a logic file.

All game state is one serializable object, `S`, including the RNG seed — so a
loaded save rolls the same dice the run would have rolled. Nothing about the run
is stored in the DOM.

Money is pence. Twelve pence to the shilling, twenty shillings to the crown,
displayed as `3s 4d`. Never a decimal. This is 1851.

## House rules the code holds itself to

1. Body text ≥ 15px, every text pair ≥ 4.5:1. Grim is a palette, not an excuse.
2. Every clickable either acts or is visibly disabled with a stated reason.
3. There is always a legal action. Nought coin, nought food and nought coal is a
   bad position, not a locked one.
4. Standing Orders — day, act, goal and next deadline — are always on screen.
5. State is data.
6. No placeholder text ships.

## Acceptance

Verified by running the real thing in Chromium off `file://`
(see the run notes in the build log):

| # | Check | Result |
|---|-------|--------|
| 1 | Runs by double-clicking `index.html`, no console errors | PASS |
| 2 | Ten consecutive days playable start to finish | PASS |
| 3 | All three phases reachable and exitable every day | PASS |
| 4 | Save → reload page → load, state identical (deep compare) | PASS — 0 differing paths |
| 5 | Docket every night, ≥ 2 itemised deductions | PASS — fewest seen: 2 |
| 6 | Every button acts or is disabled with a hover reason | PASS |
| 7 | Zero coin / food / coal still offers a legal action | PASS |
| 8 | Debug panel can set every field in `S` | PASS |
| 9 | No text under 15px, no contrast pair under 4.5:1 | PASS — measured on computed styles |
| 10 | Tutorial completes and can be skipped | PASS |
| 11 | No horizontal scroll at 390px | PASS |

### Build 2

| # | Check | Result |
|---|-------|--------|
| 1 | Four stations, distinct hazard maths | PASS — lead only on casting, dust only on grinding, tremor on cap bench and stamping, a different catastrophe each |
| 2 | Pace/Care/Guard change output, wage and accident odds | PASS — 200-shift Monte Carlo per setting, run from the debug panel (`Debug.monteCarlo(200)`) |
| 3 | Quota ratchet raises next week's target | PASS — 5900 → 6552 on a beaten week; a missed week holds the figure and fines you |
| 4 | Dust, tremor and lead can never decrease | PASS — 0 violations across direct writes, the effect pipeline and 200 shifts |
| 5 | Untreated injury escalates to fever | PASS — 40/40 runs, median night 4, worst 4 |
| 6 | Transfer cost shown before confirming | PASS — names the skill you lose, the skill you start at, and both wages |
| 7 | Foreman standing changes which options exist | PASS — at −70 only "say nothing" and the stamping shop remain |
| 8 | Reporting to the Inspector fires the full chain | PASS — visit, substantial compliance, workmates −30, then twelve days of spite and skimming |
| 9 | Resolution reads in under 8 seconds and is skippable | PASS — 3.9s in full, 0.1s to skip |
| 10 | Build 1's checks all still pass | PASS — all eleven, re-run against this build |
