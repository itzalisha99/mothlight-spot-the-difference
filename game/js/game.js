// Mothlight — game state, scoring, timer, hints, input and rendering.
// One 1280 x 720 canvas: top HUD, two 600 x 520 panels at (20, 76) and
// (660, 76), bottom bar. The left panel is the ORIGINAL, the right panel
// is the CHANGED picture. Click a difference in either panel to ring it
// in both. Level 1 starts playing at once: the first frame is peak play.

import { LEVELS, TOTAL_DIFFS, rankForScore, diffHit } from './levels.js';
import { paintScene } from './scenes.js';
import { SoundFX } from './audio.js';
import { circle, ellipse, rr, poly, line, text } from './draw.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const PANEL_X = [20, 660];
export const PANEL_Y = 76;
export const PANEL_W = 600;
export const PANEL_H = 520;

const GOLD = '#ffd76a';
const GOLD_DARK = '#c9a227';
const INK = '#17122e';
const MUTED = '#b8a8d8';
const GREEN = '#4caf6d';
const BLUE = '#4fa7ff';
const RED = '#ff4d4d';

const HINT_BTN = { x: 20, y: 628, w: 150, h: 56 };
const SOUND_BTN = { x: 1110, y: 628, w: 150, h: 56 };

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sfx = new SoundFX();
    this.levelIndex = 0;
    this.records = LEVELS.map((l) => ({
      found: [],
      timeLeft: l.time,
      cleared: false,
    }));
    this.score = 0;
    this.combo = 0;
    this.hintsLeft = 3;
    this.status = 'playing'; // playing | levelClear | timeUp | gameComplete
    this.timeLeft = LEVELS[0].time;
    this.wrongMarks = [];
    this.hintPulse = null; // { diff, until }
    this.toast = null; // { text, until }
    this.confetti = [];
    this.levelBonus = 0;
    this.rank = '';
    this.frozen = false;
    this.elapsed = 0;
    this.lastTickSecond = -1;
    this.stars = [];
    let seed = 12345;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 70; i++) {
      this.stars.push({ x: rnd() * 1280, y: rnd() * 720, r: rnd() * 1.4 + 0.4, a: 0.15 + rnd() * 0.35 });
    }
  }

  level() {
    return LEVELS[this.levelIndex];
  }

  record() {
    return this.records[this.levelIndex];
  }

  totalFound() {
    return this.records.reduce((n, r) => n + r.found.length, 0);
  }

  foundCount() {
    return this.record().found.length;
  }

  // Load a scene. A cleared scene replays fresh; an uncleared one restores
  // its saved progress.
  loadLevel(i) {
    this.levelIndex = i;
    const rec = this.records[i];
    if (rec.cleared) {
      rec.found = [];
      rec.timeLeft = LEVELS[i].time;
      rec.cleared = false;
    }
    this.timeLeft = rec.timeLeft;
    this.hintsLeft = 3;
    this.combo = 0;
    this.status = 'playing';
    this.wrongMarks = [];
    this.hintPulse = null;
    this.toast = null;
    this.confetti = [];
    this.levelBonus = 0;
    this.lastTickSecond = -1;
  }

  restartScene() {
    const rec = this.record();
    rec.found = [];
    rec.timeLeft = this.level().time;
    rec.cleared = false;
    this.loadLevel(this.levelIndex);
  }

  restartGame() {
    this.records = LEVELS.map((l) => ({ found: [], timeLeft: l.time, cleared: false }));
    this.score = 0;
    this.loadLevel(0);
  }

  nextScene() {
    if (this.status !== 'levelClear') return;
    if (this.levelIndex >= LEVELS.length - 1) {
      this.restartGame();
      return;
    }
    this.loadLevel(this.levelIndex + 1);
  }

  jumpTo(i) {
    if (i < 0 || i >= LEVELS.length || i === this.levelIndex) return;
    this.record().timeLeft = this.timeLeft;
    this.loadLevel(i);
    this.sfx.click();
  }

  useHint() {
    if (this.status !== 'playing' || this.hintsLeft <= 0) return;
    const unfound = this.level().diffs
      .map((d, i) => i)
      .filter((i) => !this.record().found.includes(i));
    if (!unfound.length) return;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 25);
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintPulse = { diff: pick, until: this.elapsed + 2.5 };
    this.sfx.hint();
  }

  // One click at canvas coordinates.
  click(x, y) {
    if (this.status === 'levelClear') {
      if (this.inRect(x, y, 530, 432, 220, 48)) {
        this.sfx.click();
        this.nextScene();
      }
      return;
    }
    if (this.status === 'timeUp') {
      if (this.inRect(x, y, 540, 420, 200, 48)) {
        this.sfx.click();
        this.restartScene();
      }
      return;
    }
    if (this.status === 'gameComplete') {
      if (this.inRect(x, y, 530, 400, 220, 48)) {
        this.sfx.click();
        this.restartGame();
      }
      return;
    }
    // Bottom-bar controls.
    if (this.inRect(x, y, HINT_BTN.x, HINT_BTN.y, HINT_BTN.w, HINT_BTN.h)) {
      this.useHint();
      return;
    }
    if (this.inRect(x, y, SOUND_BTN.x, SOUND_BTN.y, SOUND_BTN.w, SOUND_BTN.h)) {
      this.sfx.muted = !this.sfx.muted;
      this.sfx.click();
      return;
    }
    for (let i = 0; i < LEVELS.length; i++) {
      const dx = 640 + (i - 2.5) * 44;
      if ((x - dx) * (x - dx) + (y - 656) * (y - 656) <= 15 * 15) {
        this.jumpTo(i);
        return;
      }
    }
    // Panels.
    for (let p = 0; p < 2; p++) {
      const px = x - PANEL_X[p];
      const py = y - PANEL_Y;
      if (px >= 0 && px < PANEL_W && py >= 0 && py < PANEL_H) {
        this.clickPanel(px, py, p);
        return;
      }
    }
  }

  clickPanel(px, py, panel) {
    const rec = this.record();
    const diffs = this.level().diffs;
    for (let i = 0; i < diffs.length; i++) {
      if (rec.found.includes(i)) continue;
      if (diffHit(diffs[i], px, py)) {
        this.findDiff(i);
        return;
      }
    }
    // Wrong click: red X, minus 2 seconds, combo resets.
    this.wrongMarks.push({ x: px, y: py, panel, until: this.elapsed + 0.8 });
    this.timeLeft = Math.max(0, this.timeLeft - 2);
    this.combo = 0;
    this.sfx.wrong();
  }

  findDiff(i) {
    const rec = this.record();
    rec.found.push(i);
    const points = 100 + 25 * this.combo;
    this.score += points;
    this.combo += 1;
    const d = this.level().diffs[i];
    this.toast = { text: `${d.label}  ·  +${points}`, until: this.elapsed + 1.8 };
    this.sfx.find(this.combo);
    if (rec.found.length === this.level().diffs.length) this.clearLevel();
  }

  clearLevel() {
    const rec = this.record();
    rec.cleared = true;
    this.levelBonus = Math.ceil(this.timeLeft) * 10;
    this.score += this.levelBonus;
    this.status = 'levelClear';
    this.spawnConfetti();
    this.sfx.win();
    if (this.levelIndex === LEVELS.length - 1 && this.totalFound() === TOTAL_DIFFS) {
      this.rank = rankForScore(this.score);
    }
  }

  spawnConfetti() {
    const colors = ['#ffd76a', '#e84a3a', '#4caf6d', '#4fa7ff', '#f2a7c3', '#f2b134'];
    this.confetti = [];
    let seed = 999;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 130; i++) {
      this.confetti.push({
        x: 200 + rnd() * 880,
        y: -20 - rnd() * 120,
        vx: (rnd() - 0.5) * 60,
        vy: 90 + rnd() * 140,
        w: 6 + rnd() * 6,
        h: 4 + rnd() * 6,
        rot: rnd() * Math.PI,
        vr: (rnd() - 0.5) * 6,
        color: colors[i % colors.length],
      });
    }
  }

  key(k) {
    if (k === 'h' || k === 'H') this.useHint();
    else if (k === 'n' || k === 'N') {
      if (this.status === 'levelClear') this.nextScene();
    } else if (k === 'r' || k === 'R') {
      if (this.status === 'timeUp') this.restartScene();
      else if (this.status === 'gameComplete' || this.status === 'levelClear') this.restartGame();
      else this.restartScene();
    } else if (k === 'm' || k === 'M') {
      this.sfx.muted = !this.sfx.muted;
    } else if (k >= '1' && k <= '6') {
      this.jumpTo(Number(k) - 1);
    }
  }

  inRect(x, y, rx, ry, rw, rh) {
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  }

  update(dt) {
    if (this.frozen) return;
    this.elapsed += dt;
    if (this.status === 'playing') {
      this.timeLeft -= dt;
      const whole = Math.ceil(this.timeLeft);
      if (whole <= 10 && whole > 0 && whole !== this.lastTickSecond) {
        this.lastTickSecond = whole;
        this.sfx.tick();
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.status = 'timeUp';
        this.sfx.timeUp();
      }
    }
    this.wrongMarks = this.wrongMarks.filter((m) => m.until > this.elapsed);
    if (this.hintPulse && this.hintPulse.until <= this.elapsed) this.hintPulse = null;
    if (this.toast && this.toast.until <= this.elapsed) this.toast = null;
    for (const c of this.confetti) {
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rot += c.vr * dt;
      if (c.y > 740) c.y = -10;
    }
  }

  // ---- rendering ----------------------------------------------------------

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    for (const s of this.stars) {
      ctx.globalAlpha = s.a;
      circle(ctx, s.x, s.y, s.r, '#fff8d0');
    }
    ctx.globalAlpha = 1;
    this.renderHud(ctx);
    this.renderPanels(ctx);
    this.renderBottomBar(ctx);
    this.renderToast(ctx);
    this.renderConfetti(ctx);
    if (this.status === 'levelClear') this.renderLevelClear(ctx);
    else if (this.status === 'timeUp') this.renderTimeUp(ctx);
    else if (this.status === 'gameComplete') this.renderGameComplete(ctx);
  }

  renderHud(ctx) {
    const lvl = this.level();
    text(ctx, '✦ MOTHLIGHT', 20, 28, 'bold 30px Georgia, serif', GOLD, 'left');
    text(ctx, lvl.name, 20, 54, '15px Georgia, serif', MUTED, 'left');
    // timer bar
    const frac = Math.max(0, this.timeLeft / lvl.time);
    rr(ctx, 490, 20, 300, 14, 7, '#3a2f55');
    if (frac > 0) {
      ctx.save();
      rr(ctx, 490, 20, 300 * frac, 14, 7, this.timeLeft <= 10 ? RED : GOLD);
      ctx.restore();
    }
    text(ctx, fmtTime(this.timeLeft), 640, 52, 'bold 17px Georgia, serif',
      this.timeLeft <= 10 ? RED : '#fdf6e8');
    // score and combo
    text(ctx, `SCORE ${this.score}`, 980, 28, 'bold 22px Georgia, serif', '#fdf6e8', 'right');
    text(ctx, `COMBO ×${this.combo}`, 980, 52, 'bold 15px Georgia, serif', GOLD, 'right');
    // found counter
    const found = this.foundCount();
    const total = lvl.diffs.length;
    rr(ctx, 1000, 12, 260, 40, 10, '#2c1e3a', GOLD_DARK, 2);
    text(ctx, `FOUND ${found}/${total} · ${total - found} LEFT`, 1130, 33,
      'bold 17px Georgia, serif', '#fdf6e8');
  }

  renderPanels(ctx) {
    for (let p = 0; p < 2; p++) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(PANEL_X[p], PANEL_Y, PANEL_W, PANEL_H, 14);
      ctx.clip();
      ctx.translate(PANEL_X[p], PANEL_Y);
      paintScene(ctx, this.levelIndex, p === 0 ? 'left' : 'right', this.elapsed);
      this.renderMarks(ctx, p);
      ctx.restore();
      ctx.strokeStyle = GOLD_DARK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(PANEL_X[p], PANEL_Y, PANEL_W, PANEL_H, 14);
      ctx.stroke();
      // panel label
      rr(ctx, PANEL_X[p] + 16, PANEL_Y + 12, 158, 26, 13, 'rgba(23, 18, 46, 0.8)');
      text(ctx, p === 0 ? 'LEFT · ORIGINAL' : 'RIGHT · CHANGED',
        PANEL_X[p] + 95, PANEL_Y + 26, 'bold 12px Georgia, serif', GOLD);
    }
  }

  renderMarks(ctx, panel) {
    const rec = this.record();
    const diffs = this.level().diffs;
    // found: gold ring + check, in both panels
    for (const i of rec.found) {
      const d = diffs[i];
      for (const [hx, hy] of [[d.x, d.y], ...(d.x2 !== undefined ? [[d.x2, d.y2]] : [])]) {
        ctx.globalAlpha = 0.25;
        circle(ctx, hx, hy, d.r + 12, GOLD);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(hx, hy, d.r + 4, 0, Math.PI * 2);
        ctx.stroke();
        text(ctx, '✓', hx, hy + 1, 'bold 26px Georgia, serif', GOLD);
      }
    }
    // hint pulse: blue ring on one unfound difference, both panels
    if (this.hintPulse) {
      const d = diffs[this.hintPulse.diff];
      const pulse = 1 + Math.sin(this.elapsed * 8) * 0.12;
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.9;
      for (const [hx, hy] of [[d.x, d.y], ...(d.x2 !== undefined ? [[d.x2, d.y2]] : [])]) {
        ctx.beginPath();
        ctx.arc(hx, hy, (d.r + 6) * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // wrong clicks: red X, only in the panel that was clicked
    for (const m of this.wrongMarks) {
      if (m.panel !== panel) continue;
      const a = Math.min(1, (m.until - this.elapsed) / 0.8);
      ctx.globalAlpha = a;
      ctx.strokeStyle = RED;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      line(ctx, m.x - 12, m.y - 12, m.x + 12, m.y + 12, RED, 4);
      line(ctx, m.x + 12, m.y - 12, m.x - 12, m.y + 12, RED, 4);
      ctx.globalAlpha = 1;
    }
    // time up: missed differences circled in dashed red
    if (this.status === 'timeUp') {
      ctx.strokeStyle = RED;
      ctx.lineWidth = 3;
      ctx.setLineDash([9, 7]);
      for (let i = 0; i < diffs.length; i++) {
        if (rec.found.includes(i)) continue;
        const d = diffs[i];
        for (const [hx, hy] of [[d.x, d.y], ...(d.x2 !== undefined ? [[d.x2, d.y2]] : [])]) {
          ctx.beginPath();
          ctx.arc(hx, hy, d.r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }
  }

  renderBottomBar(ctx) {
    // hint button
    rr(ctx, HINT_BTN.x, HINT_BTN.y, HINT_BTN.w, HINT_BTN.h, 10,
      this.hintsLeft > 0 ? '#2f6da3' : '#3a2f55', '#7ec8e8', 2);
    circle(ctx, 52, 656, 6, GOLD);
    line(ctx, 49, 662, 55, 662, GOLD, 2);
    line(ctx, 50, 665, 54, 665, GOLD, 2);
    text(ctx, `HINT (${this.hintsLeft})`, 108, 657, 'bold 17px Georgia, serif', '#fdf6e8');
    // scene dots
    text(ctx, 'SCENES', 640, 626, 'bold 11px Georgia, serif', MUTED);
    for (let i = 0; i < LEVELS.length; i++) {
      const dx = 640 + (i - 2.5) * 44;
      const rec = this.records[i];
      const fill = i === this.levelIndex ? GOLD : rec.cleared ? GREEN : '#3a2f55';
      circle(ctx, dx, 656, 15, fill, i === this.levelIndex ? GOLD : '#8a7fb0', 2);
      text(ctx, String(i + 1), dx, 657, 'bold 13px Georgia, serif',
        i === this.levelIndex ? INK : '#fdf6e8');
    }
    // sound button
    rr(ctx, SOUND_BTN.x, SOUND_BTN.y, SOUND_BTN.w, SOUND_BTN.h, 10, '#3a2f55', '#8a7fb0', 2);
    text(ctx, this.sfx.muted ? 'SOUND OFF' : 'SOUND ON', 1185, 657,
      'bold 15px Georgia, serif', '#fdf6e8');
    // footer lines
    const lvl = this.level();
    text(ctx, `Level ${this.levelIndex + 1} · ${lvl.tag} · ${lvl.diffs.length} differences · 42 differences in all · 6 scenes`,
      20, 710, '12px Georgia, serif', MUTED, 'left');
    text(ctx, 'Click a difference in either picture · H hint · N next · R restart',
      1260, 710, '12px Georgia, serif', MUTED, 'right');
  }

  renderToast(ctx) {
    if (!this.toast) return;
    ctx.font = 'bold 15px Georgia, serif';
    const tw = ctx.measureText(this.toast.text).width + 36;
    rr(ctx, 640 - tw / 2, 600, tw, 26, 13, 'rgba(23, 18, 46, 0.88)', GOLD_DARK, 1);
    text(ctx, this.toast.text, 640, 614, 'bold 15px Georgia, serif', GOLD);
  }

  renderConfetti(ctx) {
    for (const c of this.confetti) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }
  }

  card(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(10, 8, 24, 0.55)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    rr(ctx, x, y, w, h, 16, '#241b3a', GOLD, 3);
  }

  renderLevelClear(ctx) {
    const lvl = this.level();
    const isLast = this.levelIndex === LEVELS.length - 1;
    const allFound = this.totalFound() === TOTAL_DIFFS;
    this.card(ctx, 380, 180, 520, 320);
    text(ctx, 'LEVEL COMPLETE', 640, 224, 'bold 32px Georgia, serif', GOLD);
    text(ctx, lvl.name, 640, 260, '17px Georgia, serif', '#fdf6e8');
    text(ctx, `Time bonus  +${this.levelBonus}`, 640, 302, 'bold 19px Georgia, serif', GREEN);
    text(ctx, `Combo ×${this.combo}   ·   Score ${this.score}`, 640, 334,
      '17px Georgia, serif', '#fdf6e8');
    if (isLast && allFound) {
      text(ctx, `All 42 found — ${this.rank}!`, 640, 368, 'bold 19px Georgia, serif', GOLD);
      text(ctx, 'You are a true Keeper of the Mothlight.', 640, 394, '14px Georgia, serif', MUTED);
    } else {
      text(ctx, `${this.totalFound()} of 42 differences found in all`, 640, 368,
        '15px Georgia, serif', MUTED);
    }
    rr(ctx, 530, 432, 220, 48, 10, GOLD, GOLD_DARK, 2);
    text(ctx, isLast ? 'PLAY AGAIN  (N)' : 'NEXT SCENE  (N)', 640, 457,
      'bold 17px Georgia, serif', INK);
  }

  renderTimeUp(ctx) {
    const lvl = this.level();
    const missed = lvl.diffs.filter((d, i) => !this.record().found.includes(i));
    this.card(ctx, 380, 180, 520, 300);
    text(ctx, "TIME'S UP", 640, 226, 'bold 32px Georgia, serif', RED);
    text(ctx, `${missed.length} difference${missed.length === 1 ? '' : 's'} missed — circled in red`, 640, 264,
      '16px Georgia, serif', '#fdf6e8');
    missed.slice(0, 4).forEach((d, i) => {
      text(ctx, `· ${d.label}`, 640, 300 + i * 24, '14px Georgia, serif', MUTED);
    });
    rr(ctx, 540, 420, 200, 48, 10, GOLD, GOLD_DARK, 2);
    text(ctx, 'RETRY  (R)', 640, 445, 'bold 17px Georgia, serif', INK);
  }

  renderGameComplete(ctx) {
    this.card(ctx, 380, 170, 520, 300);
    text(ctx, 'ALL 42 FOUND!', 640, 214, 'bold 32px Georgia, serif', GOLD);
    text(ctx, this.rank, 640, 262, 'bold 24px Georgia, serif', '#fdf6e8');
    text(ctx, `Final score ${this.score}`, 640, 300, '18px Georgia, serif', MUTED);
    text(ctx, 'The mothlight thanks you, sharp-eyed wanderer.', 640, 332,
      '14px Georgia, serif', MUTED);
    rr(ctx, 530, 400, 220, 48, 10, GOLD, GOLD_DARK, 2);
    text(ctx, 'PLAY AGAIN  (R)', 640, 425, 'bold 17px Georgia, serif', INK);
  }
}
