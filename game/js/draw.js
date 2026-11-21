// Mothlight — small canvas drawing helpers shared by the scene painters.
// Every helper draws in the caller's current transform, so painters work in
// panel-local coordinates (600 x 520) after translating to a panel origin.

export function circle(ctx, x, y, r, fill, stroke, lw) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw || 2;
    ctx.stroke();
  }
}

export function ellipse(ctx, x, y, rx, ry, rot, fill, stroke, lw) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw || 2;
    ctx.stroke();
  }
}

export function rr(ctx, x, y, w, h, r, fill, stroke, lw) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw || 2;
    ctx.stroke();
  }
}

export function poly(ctx, points, fill, stroke, lw) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw || 2;
    ctx.stroke();
  }
}

export function line(ctx, x1, y1, x2, y2, stroke, lw) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lw || 2;
  ctx.stroke();
}

export function text(ctx, str, x, y, font, fill, align, baseline) {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = baseline || 'middle';
  ctx.fillText(str, x, y);
}

// Four-point sparkle star (for moons, stars, glints).
export function sparkle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fillStyle = fill;
  ctx.fill();
}

// Five-point star.
export function star5(ctx, x, y, r, fill, rot) {
  const a0 = (rot || -Math.PI / 2);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = a0 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

// A simple eight-tooth gear.
export function gear(ctx, x, y, r, fill, stroke) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const a2 = a + Math.PI / 8;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.lineTo(Math.cos(a2) * r * 1.28, Math.sin(a2) * r * 1.28);
    ctx.lineTo(Math.cos(a + Math.PI / 4) * r, Math.sin(a + Math.PI / 4) * r);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  circle(ctx, 0, 0, r * 0.32, stroke || '#2c2417');
  ctx.restore();
}

// Vertical gradient band helper.
export function vgrad(ctx, x, y, w, h, top, bottom) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  return g;
}

// A sitting cat silhouette; tailUp true draws the tail curled up.
export function cat(ctx, x, y, s, fill, tailUp) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = fill;
  // body
  ellipse(ctx, 0, 0, 16, 20, 0, fill);
  // head
  circle(ctx, 2, -24, 11, fill);
  // ears
  poly(ctx, [[-6, -30], [-3, -40], [1, -31]], fill);
  poly(ctx, [[7, -31], [11, -40], [14, -30]], fill);
  // tail
  ctx.strokeStyle = fill;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (tailUp) {
    ctx.moveTo(14, 12);
    ctx.quadraticCurveTo(28, 6, 24, -14);
  } else {
    ctx.moveTo(14, 12);
    ctx.quadraticCurveTo(30, 16, 30, 4);
  }
  ctx.stroke();
  ctx.restore();
}

// A simple standing person (head, body, legs) used for market and river folk.
export function person(ctx, x, y, s, skin, shirt, pants) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  circle(ctx, 0, -34, 9, skin);
  rr(ctx, -10, -26, 20, 26, 6, shirt);
  rr(ctx, -9, 0, 7, 18, 3, pants);
  rr(ctx, 2, 0, 7, 18, 3, pants);
  ctx.restore();
}
