# Mothlight — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/itzalisha99/mothlight-spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/itzalisha99/mothlight-spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Mothlight** is a spot-the-difference hunt in six hand-drawn scenes. Two
near-identical pictures sit side by side — the left is the original, the
right is changed — and you click every difference before the mothlight
burns out. 42 differences in all, across a dawn bun shop, a lantern night
market, a clockmaker's workshop, a moth garden, a river of sky lanterns,
and a lighthouse in a storm.

## How to play

- **Click** a difference in either picture to ring it in gold in both.
- **Wrong click:** red X, −2 seconds, combo resets.
- **H** — hint (3 per scene, −25 points): one unfound difference pulses blue.
- **N** — next scene after clearing one. **R** — restart the scene.
- **1–6** — jump to a scene. **M** — mute.
- **Scoring:** a find is 100 + 25 per combo step (100, 125, 150…). Clearing
  a scene adds 10 points per second left. Find all 42 to earn your rank:
  Curious Newcomer, Patient Spotter, Sharp-Eyed Wanderer, Eagle-Eyed
  Keeper, or Legend of the Mothlight.
- **Sounds:** all synthesised WebAudio — find chime, wrong buzz, hint
  shimmer, win arpeggio, and a tick under 10 seconds.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

The game is plain static files under `game/` with no build step and no
network request: `game/index.html` opens in desktop Chrome and plays.
All art is flat vector shapes drawn on canvas in code; all sound is
synthesised WebAudio.

## Screenshots

`?shot=` freezes the game in a real mid-play state for honest renders of
the game's own code (see `shots.json`):

- `?shot=cover` — Clockmaker's Workshop, 4 of 7 found
- `?shot=play` — Bun Shop at Dawn, 2 of 5 found
- `?shot=festival` — Sky Lanterns over the River, 5 of 8 found, hint pulsing
- `?shot=win` — Lighthouse at Storm's End, all 9 found, LEVEL COMPLETE card

`?level=N&found=1,2&time=&score=` stages any other state for testing.

## Layout

- `game/index.html` — page shell
- `game/css/style.css` — page chrome around the canvas
- `game/js/main.js` — boot, input, render loop
- `game/js/game.js` — state, scoring, timer, hints, rendering, overlays
- `game/js/levels.js` — the 6 scenes and their 42 differences
- `game/js/scenes.js` — the six scene painters
- `game/js/draw.js` — canvas helpers
- `game/js/audio.js` — WebAudio sounds
- `game/js/shots.js` — screenshot staging
- `main.ts` — the entry program (copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json`)
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged

## make.fun

Built for the [best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
bounty on make.fun. Referral code: `y05d5qm6`.

MIT licensed.
