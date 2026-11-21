// Mothlight — the six scenes and their 42 differences.
// Panel coordinates are 600 x 520. A difference is { x, y, r, label } and is
// clickable in BOTH panels at that point; a difference may also carry a
// second hit point (x2, y2) for things that sit in two places, like the
// lighthouse beam. "left" is the ORIGINAL picture, "right" is the CHANGED one.

export const PANEL_W = 600;
export const PANEL_H = 520;

export const LEVELS = [
  {
    name: 'The Bun Shop at Dawn',
    tag: 'Warm-up',
    time: 120,
    diffs: [
      { x: 118, y: 92, r: 30, label: 'Moon turned to a star' },
      { x: 302, y: 214, r: 34, label: 'A croissant vanished' },
      { x: 472, y: 128, r: 30, label: 'The bell fell off the sign' },
      { x: 168, y: 402, r: 36, label: 'The shop cat slipped away' },
      { x: 438, y: 404, r: 32, label: 'Red jam turned green' },
    ],
  },
  {
    name: 'Lantern Night Market',
    tag: 'Getting busy',
    time: 115,
    diffs: [
      { x: 96, y: 118, r: 32, label: 'A lantern changed colour' },
      { x: 268, y: 322, r: 34, label: 'A fish is missing from the stall' },
      { x: 486, y: 84, r: 28, label: 'A star blinked out' },
      { x: 356, y: 178, r: 34, label: "The vendor lost his hat" },
      { x: 198, y: 428, r: 30, label: 'A coin rolled away' },
      { x: 528, y: 300, r: 32, label: 'The kite string snapped' },
    ],
  },
  {
    name: "The Clockmaker's Workshop",
    tag: 'Ticking puzzle',
    time: 110,
    diffs: [
      { x: 300, y: 132, r: 36, label: 'The big clock lost an hour' },
      { x: 122, y: 258, r: 30, label: 'A gear fell off the wall' },
      { x: 452, y: 386, r: 32, label: "The cat's tail went down" },
      { x: 96, y: 396, r: 28, label: 'The candle flame went blue' },
      { x: 508, y: 216, r: 30, label: 'An extra book appeared' },
      { x: 210, y: 78, r: 28, label: 'A bird landed on the window' },
      { x: 300, y: 452, r: 30, label: 'The pendulum stopped swinging' },
    ],
  },
  {
    name: 'The Moth Garden',
    tag: 'Quiet hunt',
    time: 105,
    diffs: [
      { x: 132, y: 300, r: 32, label: 'A tulip changed colour' },
      { x: 300, y: 128, r: 30, label: 'A butterfly flew away' },
      { x: 470, y: 180, r: 34, label: 'The moth lost a wing spot' },
      { x: 210, y: 420, r: 30, label: "The watering can lost its spout" },
      { x: 512, y: 420, r: 30, label: 'A mushroom sprouted' },
      { x: 96, y: 452, r: 30, label: "The snail lost its shell swirl" },
      { x: 486, y: 70, r: 30, label: 'The sun hid behind a cloud' },
    ],
  },
  {
    name: 'Sky Lanterns over the River',
    tag: 'Festival lights',
    time: 100,
    diffs: [
      { x: 132, y: 96, r: 30, label: 'A sky lantern went out' },
      { x: 268, y: 330, r: 32, label: 'The boat flag changed colour' },
      { x: 452, y: 268, r: 34, label: 'The bridge lost an arch light' },
      { x: 386, y: 428, r: 30, label: 'A fish stopped jumping' },
      { x: 508, y: 84, r: 30, label: "The moon lost its crater" },
      { x: 210, y: 150, r: 32, label: 'Fireworks turned green' },
      { x: 96, y: 356, r: 32, label: 'A festival-goer vanished' },
      { x: 540, y: 380, r: 30, label: 'Blossom fell off the tree' },
    ],
  },
  {
    name: "The Lighthouse at Storm's End",
    tag: 'Final storm',
    time: 95,
    diffs: [
      {
        x: 140, y: 220, x2: 470, y2: 220, r: 40,
        label: 'The beam turned the other way',
      },
      { x: 132, y: 84, r: 28, label: 'A gull flew off' },
      { x: 480, y: 452, r: 34, label: 'A wave grew taller' },
      { x: 300, y: 240, r: 28, label: 'A lighthouse window went dark' },
      { x: 120, y: 452, r: 30, label: 'The anchor vanished' },
      { x: 420, y: 140, r: 28, label: 'A rain cloud drifted away' },
      { x: 210, y: 430, r: 32, label: "The little boat lost its sail" },
      { x: 540, y: 470, r: 30, label: 'A rock slipped into the sea' },
      { x: 300, y: 52, r: 28, label: 'The flag flipped direction' },
    ],
  },
];

export const TOTAL_DIFFS = LEVELS.reduce((n, l) => n + l.diffs.length, 0);

// Final ranks, by score, when all 42 differences are found.
export const RANKS = [
  { min: 11500, name: 'Legend of the Mothlight' },
  { min: 9000, name: 'Eagle-Eyed Keeper' },
  { min: 6500, name: 'Sharp-Eyed Wanderer' },
  { min: 4000, name: 'Patient Spotter' },
  { min: 0, name: 'Curious Newcomer' },
];

export function rankForScore(score) {
  for (const r of RANKS) if (score >= r.min) return r.name;
  return 'Curious Newcomer';
}

// True when panel point (px, py) hits difference d (either hit point).
export function diffHit(d, px, py) {
  const dx = px - d.x;
  const dy = py - d.y;
  if (dx * dx + dy * dy <= d.r * d.r) return true;
  if (d.x2 !== undefined) {
    const dx2 = px - d.x2;
    const dy2 = py - d.y2;
    if (dx2 * dx2 + dy2 * dy2 <= d.r * d.r) return true;
  }
  return false;
}
