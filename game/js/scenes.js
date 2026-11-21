// Mothlight — the six scene painters. Each painter draws one picture in
// panel-local coordinates (600 x 520) for variant 'left' (ORIGINAL) or
// 'right' (CHANGED). The two variants are identical except at the scene's
// difference points, so the hunt is fair. All art is flat vector shapes.
// `t` is animation time in seconds (0 when frozen for screenshots).

import { LEVELS } from './levels.js';
import {
  circle, ellipse, rr, poly, line, text, sparkle, star5, gear, vgrad, cat, person,
} from './draw.js';

function croissant(ctx, x, y) {
  ellipse(ctx, x, y, 20, 11, 0, '#d99a4e', '#8a5a20', 2);
  line(ctx, x - 8, y - 6, x - 4, y + 5, '#8a5a20', 2);
  line(ctx, x + 2, y - 7, x + 6, y + 5, '#8a5a20', 2);
}

function lanternRound(ctx, x, y, r, color, lit) {
  if (lit) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.2);
    g.addColorStop(0, 'rgba(255, 190, 90, 0.5)');
    g.addColorStop(1, 'rgba(255, 190, 90, 0)');
    circle(ctx, x, y, r * 2.2, g);
  }
  circle(ctx, x, y, r, color, '#7a2d1d', 2);
  line(ctx, x - r * 0.55, y - r * 0.4, x + r * 0.55, y - r * 0.4, 'rgba(0,0,0,0.25)', 2);
  line(ctx, x - r * 0.55, y + r * 0.35, x + r * 0.55, y + r * 0.35, 'rgba(0,0,0,0.25)', 2);
  rr(ctx, x - 5, y - r - 4, 10, 5, 2, '#c9a227');
  rr(ctx, x - 5, y + r - 1, 10, 5, 2, '#c9a227');
}

function fishShape(ctx, x, y, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ellipse(ctx, 0, 0, 16, 7, 0, '#9fb8c8', '#5a7688', 2);
  poly(ctx, [[-14, 0], [-24, -7], [-24, 7]], '#9fb8c8', '#5a7688', 2);
  circle(ctx, 8, -2, 2, '#22303a');
  ctx.restore();
}

// ---- Scene 1: The Bun Shop at Dawn ---------------------------------------
function paintBunShop(ctx, v) {
  // wall and floor
  ctx.fillStyle = vgrad(ctx, 0, 0, 600, 380, '#f8e7c4', '#efcd9c');
  ctx.fillRect(0, 0, 600, 380);
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(0, 380, 600, 140);
  ctx.strokeStyle = 'rgba(90, 50, 20, 0.35)';
  ctx.lineWidth = 2;
  for (let y = 408; y < 520; y += 28) {
    line(ctx, 0, y, 600, y, 'rgba(90, 50, 20, 0.35)', 2);
  }
  // dawn window, top left
  rr(ctx, 64, 48, 112, 104, 8, '#a9d3e8', '#6b4a2f', 4);
  line(ctx, 120, 48, 120, 152, '#6b4a2f', 3);
  line(ctx, 64, 100, 176, 100, '#6b4a2f', 3);
  if (v === 'left') {
    // crescent moon
    circle(ctx, 118, 92, 20, '#ffe9a8');
    circle(ctx, 126, 86, 17, '#a9d3e8');
  } else {
    star5(ctx, 118, 92, 20, '#ffe9a8');
  }
  // hanging lamp
  line(ctx, 300, 0, 300, 46, '#5a3a22', 3);
  poly(ctx, [[282, 46], [318, 46], [306, 66], [294, 66]], '#c9a227', '#8a6d1f', 2);
  circle(ctx, 300, 70, 7, '#ffe9a8');
  // wall shelf with the croissant tray
  rr(ctx, 196, 236, 212, 12, 4, '#8a5a30', '#5a3a22', 2);
  ellipse(ctx, 302, 226, 82, 13, 0, '#e8e0d0', '#b0a890', 2);
  croissant(ctx, 250, 210);
  if (v === 'left') croissant(ctx, 302, 208);
  croissant(ctx, 354, 210);
  // BUNS sign with its bell, top right
  rr(ctx, 420, 96, 106, 66, 10, '#7a4a26', '#d9a441', 3);
  text(ctx, 'BUNS', 473, 130, 'bold 26px Georgia, serif', '#ffe9c4');
  if (v === 'left') {
    circle(ctx, 472, 158, 9, '#d9a441', '#8a6d1f', 2);
    circle(ctx, 472, 169, 3, '#8a6d1f');
  }
  // bread basket, lower left
  rr(ctx, 52, 330, 92, 40, 8, '#b07a45', '#6b4a2f', 3);
  ellipse(ctx, 80, 326, 16, 20, -0.4, '#e8b96a', '#8a5a20', 2);
  ellipse(ctx, 108, 326, 16, 20, 0.4, '#e8b96a', '#8a5a20', 2);
  ellipse(ctx, 94, 322, 16, 22, 0, '#e8b96a', '#8a5a20', 2);
  // baker behind the counter, right
  circle(ctx, 530, 290, 18, '#f2c9a0');
  circle(ctx, 522, 288, 2, '#2c2417');
  circle(ctx, 538, 288, 2, '#2c2417');
  poly(ctx, [[508, 282], [552, 282], [544, 258], [516, 258]], '#fdf6e8', '#d8cbb2', 2);
  circle(ctx, 530, 252, 14, '#fdf6e8');
  rr(ctx, 512, 308, 36, 34, 8, '#fdf6e8', '#d8cbb2', 2);
  rr(ctx, 380, 340, 200, 52, 8, '#8a5a30', '#5a3a22', 3);
  rr(ctx, 380, 340, 200, 12, 8, '#a9743f');
  // flour sacks on the floor, right
  ellipse(ctx, 566, 448, 26, 30, 0, '#e8dcc8', '#b0a890', 2);
  ellipse(ctx, 540, 462, 22, 24, 0, '#ddd0b8', '#b0a890', 2);
  // jam jar on the floor, lower right
  rr(ctx, 420, 382, 36, 46, 6, 'rgba(232, 220, 200, 0.9)', '#8a7a5e', 2);
  rr(ctx, 423, 392, 30, 32, 4, v === 'left' ? '#c0392b' : '#3d8b4f');
  rr(ctx, 418, 376, 40, 10, 4, '#d9a441', '#8a6d1f', 2);
  text(ctx, 'JAM', 438, 408, 'bold 11px Georgia, serif', '#fff');
  // the shop cat on the floor, lower left
  if (v === 'left') cat(ctx, 168, 402, 1, '#3a3348', true);
}

// ---- Scene 2: Lantern Night Market ---------------------------------------
function paintMarket(ctx, v) {
  ctx.fillStyle = vgrad(ctx, 0, 0, 600, 420, '#191238', '#33235f');
  ctx.fillRect(0, 0, 600, 420);
  ctx.fillStyle = '#3d2f5e';
  ctx.fillRect(0, 420, 600, 100);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  for (let y = 448; y < 520; y += 24) line(ctx, 0, y, 600, y, 'rgba(0,0,0,0.25)', 2);
  // stars
  const stars = [[40, 40], [150, 30], [240, 50], [330, 34], [420, 46], [560, 40], [200, 130], [440, 120], [90, 200], [570, 180]];
  for (const [sx, sy] of stars) sparkle(ctx, sx, sy, 4, '#fff8d0');
  if (v === 'left') sparkle(ctx, 486, 84, 9, '#fff8d0');
  // crescent moon
  circle(ctx, 548, 58, 16, '#ffe9a8');
  circle(ctx, 554, 53, 13, '#33235f');
  // lantern strings
  ctx.strokeStyle = '#0f0a24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 62);
  ctx.quadraticCurveTo(300, 84, 600, 62);
  ctx.stroke();
  lanternRound(ctx, 60, 96, 14, '#e84a3a', true);
  lanternRound(ctx, 160, 102, 14, '#f2b134', true);
  lanternRound(ctx, 260, 94, 14, '#e84a3a', true);
  lanternRound(ctx, 360, 102, 14, '#f2b134', true);
  lanternRound(ctx, 460, 94, 14, '#e84a3a', true);
  lanternRound(ctx, 540, 100, 14, '#f2b134', true);
  line(ctx, 96, 66, 96, 100, '#0f0a24', 2);
  lanternRound(ctx, 96, 118, 15, v === 'left' ? '#e84a3a' : '#3f7fd0', true);
  // bunting flags
  const flagColors = ['#e84a3a', '#f2b134', '#3f7fd0', '#4caf6d'];
  for (let i = 0; i < 12; i++) {
    const fx = 30 + i * 48;
    const fy = 138 + Math.sin(i * 0.9) * 8;
    poly(ctx, [[fx, fy], [fx + 18, fy], [fx + 9, fy + 16]], flagColors[i % 4]);
  }
  // spice stall, left
  rr(ctx, 20, 300, 130, 80, 8, '#5a3a22', '#3a2412', 3);
  circle(ctx, 52, 292, 14, '#c0392b');
  circle(ctx, 86, 292, 14, '#f2b134');
  circle(ctx, 120, 292, 14, '#4caf6d');
  text(ctx, 'SPICES', 85, 340, 'bold 15px Georgia, serif', '#ffe9c4');
  // fish stall, centre
  poly(ctx, [[190, 252], [350, 252], [342, 282], [198, 282]], '#e84a3a');
  poly(ctx, [[230, 252], [270, 252], [262, 282], [238, 282]], '#fdf6e8');
  poly(ctx, [[310, 252], [350, 252], [342, 282], [318, 282]], '#fdf6e8');
  rr(ctx, 196, 330, 148, 52, 8, '#6b4a2f', '#3a2412', 3);
  ellipse(ctx, 268, 326, 62, 12, 0, '#cfe8f5', '#8fb8cc', 2);
  fishShape(ctx, 238, 322, false);
  if (v === 'left') fishShape(ctx, 268, 322, false);
  fishShape(ctx, 298, 322, true);
  text(ctx, 'FISH', 270, 362, 'bold 15px Georgia, serif', '#ffe9c4');
  // vendor behind the fish stall
  circle(ctx, 356, 205, 15, '#f2c9a0');
  if (v === 'left') poly(ctx, [[332, 198], [380, 198], [356, 168]], '#d9a441', '#8a6d1f', 2);
  rr(ctx, 338, 220, 36, 60, 8, '#3f7fd0', '#24507e', 2);
  // kite, right sky
  poly(ctx, [[528, 262], [548, 286], [528, 312], [508, 286]], '#e84a3a', '#7a2d1d', 2);
  poly(ctx, [[528, 262], [548, 286], [528, 312], [508, 286]], 'rgba(255,255,255,0.15)');
  line(ctx, 508, 286, 528, 286, '#7a2d1d', 1);
  if (v === 'left') {
    ctx.strokeStyle = '#d8cbb2';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(528, 312);
    ctx.quadraticCurveTo(540, 340, 532, 366);
    ctx.stroke();
  } else {
    line(ctx, 528, 312, 530, 326, '#d8cbb2', 1.5);
  }
  // shopper silhouette, right
  person(ctx, 452, 400, 1.1, '#2c2140', '#2c2140', '#241a36');
  // coin on the ground
  if (v === 'left') {
    circle(ctx, 198, 428, 9, '#f2b134', '#8a6d1f', 2);
    text(ctx, '$', 198, 429, 'bold 11px Georgia, serif', '#8a6d1f');
  }
}

// ---- Scene 3: The Clockmaker's Workshop ----------------------------------
function paintWorkshop(ctx, v, t) {
  ctx.fillStyle = vgrad(ctx, 0, 0, 600, 460, '#464b63', '#33364a');
  ctx.fillRect(0, 0, 600, 460);
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(0, 460, 600, 60);
  for (let y = 482; y < 520; y += 20) line(ctx, 0, y, 600, y, 'rgba(40, 22, 10, 0.4)', 2);
  // window, top left
  rr(ctx, 56, 40, 128, 116, 8, '#bcd8e8', '#2c2417', 4);
  line(ctx, 120, 40, 120, 156, '#2c2417', 3);
  line(ctx, 56, 98, 184, 98, '#2c2417', 3);
  if (v === 'right') {
    ellipse(ctx, 210, 78, 12, 8, 0, '#7a8a9a');
    circle(ctx, 220, 72, 5, '#7a8a9a');
    poly(ctx, [[224, 71], [229, 73], [224, 75]], '#e8a33d');
  }
  // wall gears
  if (v === 'left') gear(ctx, 122, 258, 26, '#d9a441', '#8a6d1f');
  gear(ctx, 70, 196, 16, '#8a8fa8', '#555a70');
  gear(ctx, 500, 320, 18, '#8a8fa8', '#555a70');
  // small wall clocks
  circle(ctx, 430, 80, 22, '#f6ecd2', '#2c2417', 3);
  line(ctx, 430, 80, 430, 64, '#2c2417', 2);
  line(ctx, 430, 80, 442, 84, '#2c2417', 2);
  // the big clock
  circle(ctx, 300, 150, 88, '#d9a441', '#8a6d1f', 4);
  circle(ctx, 300, 150, 76, '#f6ecd2');
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    circle(ctx, 300 + Math.sin(a) * 66, 150 - Math.cos(a) * 66, 3, '#2c2417');
  }
  // hands: 10:10 left, 11:10 right
  const hourAngle = v === 'left' ? -Math.PI / 3 : -Math.PI / 6;
  line(ctx, 300, 150, 300 + Math.sin(hourAngle) * 42, 150 - Math.cos(hourAngle) * 42, '#2c2417', 6);
  line(ctx, 300, 150, 300 + Math.sin(Math.PI / 3) * 62, 150 - Math.cos(Math.PI / 3) * 62, '#2c2417', 4);
  circle(ctx, 300, 150, 7, '#c0392b');
  // pendulum: swings left, still right
  const swing = v === 'left' ? Math.sin(t * 1.6) * 0.1 : 0;
  const bobX = 300 + Math.sin(swing) * 205;
  const bobY = 238 + Math.cos(swing) * 205;
  line(ctx, 300, 238, bobX, bobY, '#2c2417', 4);
  circle(ctx, bobX, bobY, 16, '#d9a441', '#8a6d1f', 3);
  // bookshelf with books, right
  rr(ctx, 460, 232, 100, 10, 3, '#6b4a2f', '#3a2412', 2);
  rr(ctx, 472, 200, 14, 32, 2, '#c0392b');
  rr(ctx, 488, 200, 14, 32, 2, '#3f7fd0');
  rr(ctx, 504, 200, 14, 32, 2, '#4caf6d');
  if (v === 'right') rr(ctx, 518, 200, 14, 32, 2, '#f2b134');
  // workbench, right, with the cat
  rr(ctx, 380, 400, 200, 12, 4, '#6b4a2f', '#3a2412', 2);
  rr(ctx, 392, 412, 10, 48, 2, '#5a3a22');
  rr(ctx, 558, 412, 10, 48, 2, '#5a3a22');
  cat(ctx, 452, 386, 1, '#1e1a24', v === 'left');
  // hammer and wrench on the bench
  line(ctx, 520, 396, 548, 384, '#8a5a20', 4);
  rr(ctx, 546, 378, 14, 8, 2, '#9aa0b5');
  line(ctx, 400, 396, 420, 388, '#8a8fa8', 3);
  // candle on the floor, left
  rr(ctx, 88, 420, 16, 10, 3, '#d9a441');
  rr(ctx, 93, 396, 6, 26, 2, '#fdf6e8');
  ctx.beginPath();
  ctx.moveTo(96, 372);
  ctx.quadraticCurveTo(106, 388, 96, 398);
  ctx.quadraticCurveTo(86, 388, 96, 372);
  ctx.fillStyle = v === 'left' ? '#ff9d2e' : '#3fa7ff';
  ctx.fill();
  // rug
  ellipse(ctx, 300, 492, 120, 16, 0, '#7a3b4d');
  ellipse(ctx, 300, 492, 80, 10, 0, '#9a4b5d');
}

// ---- Scene 4: The Moth Garden --------------------------------------------
function tulip(ctx, x, y, color) {
  line(ctx, x, y, x, y + 34, '#3d8b4f', 3);
  poly(ctx, [[x, y + 18], [x - 12, y + 8], [x, y + 26]], '#3d8b4f');
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.quadraticCurveTo(x - 10, y - 16, x, y - 12);
  ctx.quadraticCurveTo(x + 10, y - 16, x + 10, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function paintGarden(ctx, v) {
  ctx.fillStyle = vgrad(ctx, 0, 0, 600, 280, '#cfe9f5', '#eaf7ee');
  ctx.fillRect(0, 0, 600, 280);
  ctx.fillStyle = vgrad(ctx, 0, 280, 600, 240, '#79b364', '#5d9a4e');
  ctx.fillRect(0, 280, 600, 240);
  // fence
  ctx.fillStyle = '#8a6d4d';
  ctx.fillRect(0, 250, 600, 8);
  ctx.fillRect(0, 272, 600, 8);
  for (let x = 30; x < 600; x += 90) ctx.fillRect(x, 240, 10, 52);
  // sun, top right
  circle(ctx, 486, 70, 26, '#ffd94d', '#e8a33d', 3);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    line(ctx, 486 + Math.cos(a) * 32, 70 + Math.sin(a) * 32,
      486 + Math.cos(a) * 42, 70 + Math.sin(a) * 42, '#ffd94d', 3);
  }
  if (v === 'right') {
    ellipse(ctx, 486, 70, 46, 24, 0, '#fdf6e8');
    ellipse(ctx, 462, 76, 26, 16, 0, '#fdf6e8');
    ellipse(ctx, 510, 76, 26, 16, 0, '#fdf6e8');
  }
  // trees
  rr(ctx, 28, 200, 14, 84, 4, '#6b4a2f');
  circle(ctx, 36, 180, 42, '#4d8a3f');
  circle(ctx, 66, 200, 30, '#5d9a4e');
  rr(ctx, 556, 210, 14, 74, 4, '#6b4a2f');
  circle(ctx, 564, 190, 38, '#4d8a3f');
  // butterfly
  if (v === 'left') {
    ellipse(ctx, 288, 122, 14, 9, -0.5, '#f28c28');
    ellipse(ctx, 312, 122, 14, 9, 0.5, '#f28c28');
    ellipse(ctx, 288, 134, 11, 8, 0.4, '#f2b134');
    ellipse(ctx, 312, 134, 11, 8, -0.4, '#f2b134');
    ellipse(ctx, 300, 128, 4, 10, 0, '#3a2c1c');
  }
  // the moth on its leaf
  ellipse(ctx, 470, 196, 34, 10, 0.2, '#5d9a4e');
  ellipse(ctx, 452, 176, 20, 13, -0.5, '#c9a86a');
  ellipse(ctx, 488, 176, 20, 13, 0.5, '#c9a86a');
  ellipse(ctx, 452, 190, 15, 10, 0.4, '#b8935a');
  ellipse(ctx, 488, 190, 15, 10, -0.4, '#b8935a');
  ellipse(ctx, 470, 180, 5, 12, 0, '#3a2c1c');
  line(ctx, 468, 170, 460, 158, '#3a2c1c', 2);
  line(ctx, 472, 170, 480, 158, '#3a2c1c', 2);
  if (v === 'left') circle(ctx, 452, 174, 5, '#3a2c1c');
  // tulip bed
  const tulipColors = ['#e84a3a', '#f2b134', '#e84a3a', '#f2b134', '#e84a3a', '#f2b134', '#e84a3a'];
  const tulipXs = [80, 132, 190, 250, 310, 370, 430];
  tulipXs.forEach((tx, i) => {
    const c = tx === 132 ? (v === 'left' ? '#e84a3a' : '#8a4fd0') : tulipColors[i];
    tulip(ctx, tx, 300, c);
  });
  // daisies scattered on the grass
  for (const [dx, dy] of [[60, 360], [330, 380], [420, 340], [540, 340], [160, 480], [380, 480]]) {
    circle(ctx, dx, dy, 5, '#fdf6e8', '#e8a33d', 1);
    circle(ctx, dx, dy, 2, '#f2b134');
  }
  // watering can
  rr(ctx, 186, 398, 48, 34, 6, '#3d8b4f', '#245c31', 2);
  rr(ctx, 192, 388, 36, 10, 4, '#3d8b4f', '#245c31', 2);
  if (v === 'left') {
    line(ctx, 232, 404, 252, 388, '#3d8b4f', 6);
    circle(ctx, 254, 386, 5, '#3d8b4f', '#245c31', 2);
    circle(ctx, 258, 396, 2, '#7ec8e8');
    circle(ctx, 262, 404, 2, '#7ec8e8');
  }
  // mushroom, right only
  if (v === 'right') {
    rr(ctx, 506, 400, 12, 22, 4, '#fdf6e8', '#d8cbb2', 2);
    ctx.beginPath();
    ctx.arc(512, 402, 18, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = '#e84a3a';
    ctx.fill();
    circle(ctx, 506, 392, 3, '#fdf6e8');
    circle(ctx, 518, 396, 3, '#fdf6e8');
  }
  // snail
  ellipse(ctx, 96, 458, 22, 9, 0, '#8a6d4d');
  circle(ctx, 82, 446, 12, '#d9a441', '#8a6d1f', 2);
  if (v === 'left') {
    ctx.strokeStyle = '#8a6d1f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(82, 446, 7, 0, Math.PI * 1.5);
    ctx.stroke();
  }
  line(ctx, 74, 436, 72, 428, '#8a6d4d', 2);
  line(ctx, 78, 436, 78, 428, '#8a6d4d', 2);
  // stepping stones
  ellipse(ctx, 350, 450, 26, 9, 0, '#c9c2b2', '#a89e88', 2);
  ellipse(ctx, 400, 470, 26, 9, 0, '#c9c2b2', '#a89e88', 2);
  // grass tufts
  ctx.strokeStyle = '#4d8a3f';
  ctx.lineWidth = 2;
  for (const [gx, gy] of [[40, 500], [140, 500], [280, 500], [470, 500], [560, 490]]) {
    line(ctx, gx, gy, gx - 5, gy - 12, '#4d8a3f', 2);
    line(ctx, gx + 4, gy, gx + 4, gy - 13, '#4d8a3f', 2);
    line(ctx, gx + 9, gy, gx + 14, gy - 11, '#4d8a3f', 2);
  }
}

// ---- Scene 5: Sky Lanterns over the River --------------------------------
function skyLantern(ctx, x, y, lit) {
  if (lit) {
    const g = ctx.createRadialGradient(x, y, 4, x, y, 46);
    g.addColorStop(0, 'rgba(255, 170, 60, 0.55)');
    g.addColorStop(1, 'rgba(255, 170, 60, 0)');
    circle(ctx, x, y, 46, g);
  }
  rr(ctx, x - 13, y - 18, 26, 36, 10, lit ? '#ff9d2e' : '#5a5a66', lit ? '#c96a12' : '#3a3a44', 2);
  line(ctx, x - 13, y - 6, x + 13, y - 6, 'rgba(0,0,0,0.2)', 2);
  line(ctx, x - 13, y + 6, x + 13, y + 6, 'rgba(0,0,0,0.2)', 2);
  if (lit) circle(ctx, x, y + 4, 5, '#ffe9a8');
}

function paintRiver(ctx, v) {
  ctx.fillStyle = vgrad(ctx, 0, 0, 600, 340, '#241640', '#6e3468');
  ctx.fillRect(0, 0, 600, 340);
  ctx.fillStyle = vgrad(ctx, 0, 340, 600, 180, '#274b7d', '#1c3a66');
  ctx.fillRect(0, 340, 600, 180);
  // stars
  for (const [sx, sy] of [[40, 50], [90, 130], [180, 60], [260, 40], [340, 120], [420, 50], [470, 160], [570, 130], [60, 220], [360, 200]]) {
    sparkle(ctx, sx, sy, 3, '#fff8d0');
  }
  // moon with crater
  circle(ctx, 508, 84, 24, '#fdf6e8', '#d8cbb2', 2);
  if (v === 'left') circle(ctx, 500, 78, 6, '#d8cbb2');
  // sky lanterns
  skyLantern(ctx, 132, 96, v === 'left');
  skyLantern(ctx, 300, 76, true);
  skyLantern(ctx, 420, 130, true);
  skyLantern(ctx, 70, 190, true);
  // fireworks
  const fwColor = v === 'left' ? '#f2b134' : '#4caf6d';
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5;
    line(ctx, 210, 150, 210 + Math.cos(a) * 26, 150 + Math.sin(a) * 26, fwColor, 2);
    circle(ctx, 210 + Math.cos(a) * 30, 150 + Math.sin(a) * 30, 2, fwColor);
  }
  // far bank with houses
  ctx.fillStyle = '#1a1030';
  ctx.fillRect(0, 300, 600, 40);
  for (const [hx, hw, hh] of [[60, 44, 26], [150, 36, 20], [330, 40, 24], [520, 48, 28]]) {
    rr(ctx, hx, 310 - hh, hw, hh + 30, 3, '#1a1030');
    rr(ctx, hx + 8, 318 - hh, 10, 10, 1, '#ffd94d');
    rr(ctx, hx + hw - 18, 318 - hh, 10, 10, 1, '#ffd94d');
  }
  // bridge
  ctx.fillStyle = '#3a2440';
  ctx.beginPath();
  ctx.moveTo(380, 268);
  ctx.quadraticCurveTo(460, 200, 540, 268);
  ctx.lineTo(540, 284);
  ctx.quadraticCurveTo(460, 222, 380, 284);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(380, 268);
  ctx.quadraticCurveTo(460, 200, 540, 268);
  ctx.stroke();
  if (v === 'left') {
    circle(ctx, 452, 268, 7, '#ffd94d');
    const g = ctx.createRadialGradient(452, 268, 2, 452, 268, 22);
    g.addColorStop(0, 'rgba(255, 217, 77, 0.6)');
    g.addColorStop(1, 'rgba(255, 217, 77, 0)');
    circle(ctx, 452, 268, 22, g);
  }
  // boat with flag
  poly(ctx, [[232, 352], [304, 352], [292, 372], [244, 372]], '#6b4a2f', '#3a2412', 2);
  line(ctx, 268, 352, 268, 306, '#3a2412', 3);
  poly(ctx, [[268, 308], [290, 316], [268, 324]], v === 'left' ? '#e84a3a' : '#3f7fd0');
  // festival-goer on the dock, left only
  if (v === 'left') {
    rr(ctx, 56, 384, 84, 10, 3, '#6b4a2f', '#3a2412', 2);
    person(ctx, 96, 356, 1, '#f2c9a0', '#e84a3a', '#2c2140');
  }
  // jumping fish
  if (v === 'left') {
    ctx.save();
    ctx.translate(386, 428);
    ctx.rotate(-0.6);
    fishShape(ctx, 0, 0, false);
    ctx.restore();
    ellipse(ctx, 386, 448, 16, 4, 0, 'rgba(255,255,255,0.35)');
  }
  // blossom tree on the right bank
  rr(ctx, 534, 396, 12, 60, 4, '#5a3a22');
  circle(ctx, 540, 372, 34, '#7a4a5e');
  if (v === 'left') {
    circle(ctx, 524, 360, 10, '#f2a7c3');
    circle(ctx, 556, 356, 10, '#f2a7c3');
    circle(ctx, 540, 348, 10, '#f2a7c3');
  } else {
    circle(ctx, 516, 452, 6, '#f2a7c3');
    circle(ctx, 540, 460, 6, '#f2a7c3');
    circle(ctx, 562, 450, 6, '#f2a7c3');
  }
  // lantern reflections on the river
  ctx.strokeStyle = 'rgba(255, 170, 60, 0.35)';
  ctx.lineWidth = 3;
  for (const rx of [132, 300, 420]) {
    line(ctx, rx, 400, rx, 430, 'rgba(255, 170, 60, 0.35)', 3);
  }
  // reeds at the left edge
  ctx.strokeStyle = '#3d8b4f';
  ctx.lineWidth = 3;
  for (const rx of [16, 30, 44]) {
    line(ctx, rx, 420, rx + 6, 372, '#3d8b4f', 3);
  }
}

// ---- Scene 6: The Lighthouse at Storm's End ------------------------------
function paintLighthouse(ctx, v) {
  ctx.fillStyle = vgrad(ctx, 0, 0, 600, 360, '#20263e', '#3c4266');
  ctx.fillRect(0, 0, 600, 360);
  ctx.fillStyle = vgrad(ctx, 0, 360, 600, 160, '#16324f', '#0f2438');
  ctx.fillRect(0, 360, 600, 160);
  // cliffs
  poly(ctx, [[0, 320], [70, 300], [90, 360], [60, 520], [0, 520]], '#141a2c');
  poly(ctx, [[600, 330], [540, 310], [520, 380], [560, 520], [600, 520]], '#141a2c');
  // rain streaks
  ctx.strokeStyle = 'rgba(180, 200, 230, 0.35)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 26; i++) {
    const rx = (i * 47) % 600;
    const ry = (i * 89) % 300;
    line(ctx, rx, ry, rx - 8, ry + 22, 'rgba(180, 200, 230, 0.35)', 1.5);
  }
  // gull
  if (v === 'left') {
    ctx.strokeStyle = '#fdf6e8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(122, 84, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(142, 84, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // rain cloud
  if (v === 'left') {
    ellipse(ctx, 420, 140, 44, 20, 0, '#2c3248');
    ellipse(ctx, 392, 148, 26, 14, 0, '#2c3248');
    ellipse(ctx, 448, 148, 26, 14, 0, '#2c3248');
    ctx.strokeStyle = 'rgba(140, 170, 220, 0.7)';
    ctx.lineWidth = 2;
    for (const rx of [392, 410, 428, 446]) line(ctx, rx, 162, rx - 4, 182, 'rgba(140, 170, 220, 0.7)', 2);
  }
  // the beam: left panel points left, right panel points right
  ctx.fillStyle = 'rgba(255, 214, 106, 0.4)';
  if (v === 'left') {
    poly(ctx, [[300, 90], [300, 108], [118, 252], [118, 190]], 'rgba(255, 214, 106, 0.4)');
  } else {
    poly(ctx, [[300, 90], [300, 108], [482, 252], [482, 190]], 'rgba(255, 214, 106, 0.4)');
  }
  // lighthouse tower
  rr(ctx, 282, 112, 36, 288, 4, '#e84a3a', '#7a2d1d', 3);
  rr(ctx, 282, 112, 36, 52, 4, '#fdf6e8');
  rr(ctx, 282, 216, 36, 52, 4, '#fdf6e8');
  rr(ctx, 282, 320, 36, 52, 4, '#fdf6e8');
  // window, lit left, dark right
  rr(ctx, 290, 228, 20, 26, 4, v === 'left' ? '#ffd76a' : '#2a2a3a', '#7a2d1d', 2);
  line(ctx, 300, 228, 300, 254, '#7a2d1d', 2);
  // lamp room
  rr(ctx, 274, 84, 52, 28, 4, '#2c3248', '#141a2c', 3);
  rr(ctx, 282, 90, 36, 16, 2, '#ffd76a');
  poly(ctx, [[270, 84], [330, 84], [300, 62]], '#c0392b', '#7a2d1d', 2);
  // flag on top: points left on the left panel, right on the right
  line(ctx, 300, 62, 300, 34, '#141a2c', 3);
  if (v === 'left') poly(ctx, [[300, 36], [276, 44], [300, 52]], '#e84a3a');
  else poly(ctx, [[300, 36], [324, 44], [300, 52]], '#e84a3a');
  // waves
  ctx.strokeStyle = 'rgba(220, 235, 250, 0.5)';
  ctx.lineWidth = 3;
  for (const wy of [392, 420, 452, 486]) {
    ctx.beginPath();
    for (let x = 0; x <= 600; x += 20) {
      const y = wy + Math.sin(x * 0.03 + wy) * 5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // the tall wave, right side
  ctx.fillStyle = '#274b7d';
  ctx.beginPath();
  ctx.moveTo(440, 470);
  ctx.quadraticCurveTo(470, v === 'left' ? 430 : 408, 500, 462);
  ctx.quadraticCurveTo(480, 470, 440, 470);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 470, v === 'left' ? 436 : 416, 5, 'rgba(255,255,255,0.7)');
  // little boat with sail
  poly(ctx, [[186, 442], [234, 442], [224, 458], [196, 458]], '#6b4a2f', '#3a2412', 2);
  line(ctx, 210, 442, 210, 408, '#3a2412', 3);
  if (v === 'left') poly(ctx, [[210, 410], [210, 440], [232, 440]], '#fdf6e8', '#d8cbb2', 2);
  // anchor on the rocks, left only
  if (v === 'left') {
    ctx.strokeStyle = '#3a3a44';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(120, 452, 12, 0, Math.PI);
    ctx.stroke();
    line(ctx, 120, 452, 120, 424, '#3a3a44', 4);
    line(ctx, 108, 430, 132, 430, '#3a3a44', 4);
    circle(ctx, 120, 420, 4, '#3a3a44');
  }
  // rock in the sea
  if (v === 'left') {
    ellipse(ctx, 540, 470, 26, 14, 0, '#3a3a44');
  } else {
    ellipse(ctx, 540, 492, 22, 8, 0, '#2c2c36');
  }
  // foam
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ellipse(ctx, 300, 500, 90, 8, 0, 'rgba(255,255,255,0)');
  ctx.beginPath();
  ctx.ellipse(300, 500, 90, 8, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.stroke();
}

const PAINTERS = [
  paintBunShop,
  paintMarket,
  paintWorkshop,
  paintGarden,
  paintRiver,
  paintLighthouse,
];

// Paint scene `levelIndex` for variant 'left' or 'right' at time `t`.
export function paintScene(ctx, levelIndex, variant, t) {
  PAINTERS[levelIndex](ctx, variant, t || 0);
}

export function sceneName(levelIndex) {
  return LEVELS[levelIndex].name;
}
