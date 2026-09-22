/* Food Never Comes (FNC) — Procedural Web Audio Engine (Zero External Dependencies) */

let audioCtx = null;
let isSoundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Unlock audio on first user gesture
['click', 'touchstart', 'keydown'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, { once: true });
});

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  const icon = document.getElementById('sound-icon');
  const text = document.getElementById('sound-text');
  const anim = document.getElementById('sound-anim');

  if (isSoundEnabled) {
    getAudioContext();
    if (icon) icon.textContent = "🔊";
    if (text) text.textContent = "SFX ON";
    if (anim) anim.classList.remove('hidden');
    playTone(600, 'sine', 0.1, 0.1);
    if (typeof showToast === 'function') showToast("Universal SFX Active! Sound on all clicks 🎵", "mint");
  } else {
    if (icon) icon.textContent = "🔇";
    if (text) text.textContent = "SFX OFF";
    if (anim) anim.classList.add('hidden');
    if (typeof showToast === 'function') showToast("Audio Muted", "info");
  }
}

function playTone(freq, type = 'sine', duration = 0.12, maxGain = 0.1, delay = 0) {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(maxGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  } catch (e) {}
}

function soundBlip() {
  playTone(720, 'sine', 0.04, 0.06);
}

function soundTabClick() {
  playTone(520, 'triangle', 0.06, 0.07);
}

function soundPop() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

function soundWarmBell() {
  if (!isSoundEnabled) return;
  playTone(523.25, 'triangle', 0.4, 0.09, 0.0);
  playTone(659.25, 'triangle', 0.4, 0.09, 0.05);
  playTone(1046.50, 'sine', 0.5, 0.11, 0.1);
}

function soundChaChing() {
  if (!isSoundEnabled) return;
  playTone(1800, 'triangle', 0.09, 0.08, 0.0);
  playTone(2400, 'triangle', 0.3, 0.12, 0.06);
}

function soundFanfare() {
  if (!isSoundEnabled) return;
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
    playTone(freq, 'sine', 0.28, 0.1, idx * 0.08);
  });
}

function soundRadarPing() {
  if (!isSoundEnabled) return;
  playTone(1100, 'sine', 0.25, 0.07, 0);
  playTone(880, 'sine', 0.35, 0.04, 0.1);
}

function soundChaiClink() {
  if (!isSoundEnabled) return;
  playTone(2800, 'triangle', 0.08, 0.06, 0);
  playTone(3200, 'sine', 0.12, 0.08, 0.04);
}
