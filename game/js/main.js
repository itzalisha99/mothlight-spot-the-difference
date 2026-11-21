// Mothlight — boot, input and the render loop. Level 1 starts playing
// immediately: the first frame is peak gameplay, never a menu.

import { Game, CANVAS_W, CANVAS_H } from './game.js';
import { applyShotParams } from './shots.js';

const canvas = document.getElementById('game');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const game = new Game(canvas);
applyShotParams(game, window.location.search);

// Exposed for automated play-testing only.
window.__mothlight = game;

function canvasPoint(ev) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((ev.clientX - rect.left) / rect.width) * CANVAS_W,
    y: ((ev.clientY - rect.top) / rect.height) * CANVAS_H,
  };
}

canvas.addEventListener('click', (ev) => {
  const p = canvasPoint(ev);
  game.click(p.x, p.y);
});

window.addEventListener('keydown', (ev) => {
  if (ev.key === ' ' || ev.key.startsWith('Arrow')) ev.preventDefault();
  game.key(ev.key);
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  game.update(dt);
  game.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
