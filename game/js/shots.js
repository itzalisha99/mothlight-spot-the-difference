// Mothlight — screenshot staging. `?shot=` freezes the game in a real
// mid-play state (frozen timer) so screenshots are honest renders of the
// game's own code, and `?level=&found=&time=&score=` stages any state.
//
//   ?shot=cover    level 2 (Clockmaker), found [0,1,3,5], 1:23 left, 1450, combo 3
//   ?shot=play     level 0 (Bun Shop), found [1,3], 1:42 left, 420, combo 2
//   ?shot=festival level 4 (River), found [0,2,4,5,7], 1:01 left, 2980, combo 4,
//                  with a hint pulsing on difference 1
//   ?shot=win      level 5 (Lighthouse), all 9 found, 0:34 left, 5120, combo 5,
//                  all 42 found, LEVEL COMPLETE card with its bonus
//   ?level=N&found=1,2&time=83&score=1450&combo=3&status=levelClear&hint=1

import { LEVELS, TOTAL_DIFFS, rankForScore } from './levels.js';

const SHOTS = {
  cover: { level: 2, found: [0, 1, 3, 5], time: 83, score: 1450, combo: 3 },
  play: { level: 0, found: [1, 3], time: 102, score: 420, combo: 2 },
  festival: { level: 4, found: [0, 2, 4, 5, 7], time: 61, score: 2980, combo: 4, hint: 1 },
  win: { level: 5, found: [0, 1, 2, 3, 4, 5, 6, 7, 8], time: 34, score: 5120, combo: 5, status: 'levelClear' },
};

function applyStagedState(game, s) {
  const level = Math.min(Math.max(s.level || 0, 0), LEVELS.length - 1);
  // Stage every earlier scene as cleared so totalFound is honest.
  for (let i = 0; i < level; i++) {
    game.records[i].found = LEVELS[i].diffs.map((d, j) => j);
    game.records[i].cleared = true;
    game.records[i].timeLeft = 0;
  }
  game.loadLevel(level);
  const rec = game.records[level];
  rec.found = (s.found || []).filter((i) => i >= 0 && i < LEVELS[level].diffs.length);
  game.timeLeft = s.time !== undefined ? s.time : LEVELS[level].time;
  rec.timeLeft = game.timeLeft;
  game.score = s.score || 0;
  game.combo = s.combo || 0;
  game.status = s.status || 'playing';
  if (s.hint !== undefined && !rec.found.includes(s.hint)) {
    game.hintPulse = { diff: s.hint, until: Number.POSITIVE_INFINITY };
    game.hintsLeft = 2;
  }
  if (game.status === 'levelClear') {
    rec.cleared = true;
    game.levelBonus = Math.ceil(game.timeLeft) * 10;
    game.score += game.levelBonus;
    game.spawnConfetti();
    // Lay the confetti out mid-fall so the frozen frame shows it.
    for (const c of game.confetti) c.y = 60 + ((c.x * 7) % 420);
    if (level === LEVELS.length - 1 && game.totalFound() === TOTAL_DIFFS) {
      game.rank = rankForScore(game.score);
    }
  }
  game.frozen = true;
  game.elapsed = 0;
}

export function applyShotParams(game, search) {
  const q = new URLSearchParams(search);
  const shot = q.get('shot');
  if (shot && SHOTS[shot]) {
    applyStagedState(game, SHOTS[shot]);
    return true;
  }
  if (q.has('level') || q.has('found') || q.has('time') || q.has('score')) {
    const s = {
      level: Number(q.get('level') || 0),
      found: (q.get('found') || '').split(',').filter(Boolean).map(Number),
      time: q.get('time') === null ? undefined : Number(q.get('time')),
      score: Number(q.get('score') || 0),
      combo: Number(q.get('combo') || 0),
      status: q.get('status') || 'playing',
      hint: q.get('hint') === null ? undefined : Number(q.get('hint')),
    };
    applyStagedState(game, s);
    return true;
  }
  return false;
}
