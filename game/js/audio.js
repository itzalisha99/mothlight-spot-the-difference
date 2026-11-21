// Mothlight — all sound is synthesised WebAudio, no audio files.
// The context is created lazily on the first user gesture so browsers
// allow it; every sound is a short envelope over an oscillator.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, dur, type, vol, when, slideTo) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + (when || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // Two-note find chime, rising with the combo.
  find(combo) {
    const base = 523 + Math.min(combo, 8) * 24;
    this.tone(base, 0.16, 'sine', 0.2);
    this.tone(base * 1.5, 0.24, 'sine', 0.2, 0.07);
  }

  // Low wrong-answer buzz.
  wrong() {
    this.tone(130, 0.22, 'sawtooth', 0.14, 0, 90);
  }

  // Hint shimmer: a quick high arpeggio.
  hint() {
    [880, 1108, 1318].forEach((f, i) => this.tone(f, 0.18, 'sine', 0.12, i * 0.06));
  }

  // Win arpeggio on clearing a scene.
  win() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.18, i * 0.09));
  }

  // Short clock tick under 10 seconds.
  tick() {
    this.tone(1200, 0.05, 'square', 0.06);
  }

  // Soft UI click for buttons and scene dots.
  click() {
    this.tone(700, 0.06, 'sine', 0.1);
  }

  // Sad low note when time runs out.
  timeUp() {
    this.tone(392, 0.4, 'triangle', 0.16, 0, 196);
  }
}
