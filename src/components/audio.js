// TITANIUM 2027 — Web Audio API Procedural Space Drone & Sound Synthesizer.
// 100% self-contained, 0 external audio files, zero bandwidth.

let audioCtx = null;
let oscBass = null;
let oscHarmonic = null;
let filterNode = null;
let gainNode = null;
let active = false;
let listeners = [];

export function isAudioActive() {
  return active;
}

export function onAudioStateChange(cb) {
  listeners.push(cb);
  return () => { listeners = listeners.filter(fn => fn !== cb); };
}

function notify() {
  listeners.forEach(fn => {
    try { fn(active); } catch (e) { console.error(e); }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('titanium-audio-change', { detail: { active } }));
  }
}

export function toggleAudio() {
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;
      audioCtx = new AudioContextClass();

      // Warm analog lowpass filter
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(140, audioCtx.currentTime);

      // Master output gain (starts silent)
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);

      // Deep space fundamental drone (A1 = 55Hz)
      oscBass = audioCtx.createOscillator();
      oscBass.type = 'sine';
      oscBass.frequency.setValueAtTime(55, audioCtx.currentTime);

      // Warm overtone drone (E2 = 82.4Hz)
      oscHarmonic = audioCtx.createOscillator();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(82.4, audioCtx.currentTime);

      oscBass.connect(filterNode);
      oscHarmonic.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscBass.start();
      oscHarmonic.start();
    } catch (e) {
      console.warn('Web Audio initialization error', e);
      return false;
    }
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (active) {
    // Smooth fade out
    gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    active = false;
  } else {
    // Smooth cinematic fade in (restrained ambient volume: 0.035)
    gainNode.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 1.2);
    active = true;
  }

  notify();
  return active;
}
