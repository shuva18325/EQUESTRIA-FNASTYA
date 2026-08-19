# GRIMWICK WORKS

A browser game. Grimdark industrial fantasy, no magic.

You are a floor hand at the Grimwick Small Arms Works in the year 312 of the Iron
Concord. You fill percussion caps, cast ball, stamp helmet shells and grind
bayonets. You are a cog. The game's job is to make being a cog feel like something.

**Build 1 of 6 — SKELETON.** Systems, not looks. Flat colours and honest labels;
the art pass is Build 5.

## Running it

Double-click `index.html`. That is the whole procedure — no build step, no
bundler, no server, no npm. Vanilla HTML/CSS/JS with plain `<script src>` tags
(deliberately not ES modules, so `file://` works). The only external dependency
is Google Fonts, and every face has a real fallback: with no network the game
looks slightly different and plays identically.

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

Not yet: the factory floor system (Build 2), the town map and destitution track
(Build 3), empire events (Build 4), art and audio (Builds 5–6).

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
