/**
 * Built-in celebration soundscape � crackers, rockets, sparkles & soft festive melody.
 * Uses Web Audio API (no external file needed).
 */
class CelebrationAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.running = false;
    this.intervals = [];
    this.timeouts = [];
    this.melodyTimer = null;
    this.noteIndex = 0;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    this.reverb = this.ctx.createConvolver();
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.25;
    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.value = 0.75;
    this.dryGain.connect(this.master);
    this.reverb.connect(this.reverbGain);
    this.reverbGain.connect(this.master);
    this.buildReverbImpulse();
  }

  buildReverbImpulse() {
    const rate = this.ctx.sampleRate;
    const length = rate * 1.2;
    const impulse = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    this.reverb.buffer = impulse;
  }

  async start() {
    this.init();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (this.running) return;

    this.running = true;
    this.fadeGain(this.master, 0.42, 1.8);
    this.startMelody();
    this.scheduleEffects();
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    this.fadeGain(this.master, 0, 1.2);

    this.intervals.forEach(clearInterval);
    this.timeouts.forEach(clearTimeout);
    this.intervals = [];
    this.timeouts = [];
    if (this.melodyTimer) clearInterval(this.melodyTimer);
  }

  fadeGain(node, target, duration) {
    const now = this.ctx.currentTime;
    node.gain.cancelScheduledValues(now);
    node.gain.setValueAtTime(node.gain.value, now);
    node.gain.linearRampToValueAtTime(target, now + duration);
  }

  playTone(freq, start, duration, type = 'sine', volume = 0.08) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(this.dryGain);
    gain.connect(this.reverb);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  startMelody() {
    const melody = [523, 587, 659, 784, 659, 587, 523, 392, 440, 494, 523, 659, 784, 880, 784, 659];
    this.noteIndex = 0;

    this.melodyTimer = setInterval(() => {
      if (!this.running) return;
      const freq = melody[this.noteIndex % melody.length];
      this.playTone(freq, this.ctx.currentTime, 0.45, 'triangle', 0.06);
      this.noteIndex++;
    }, 520);
  }

  scheduleEffects() {
    const effectLoop = setInterval(() => {
      if (!this.running) return;
      const roll = Math.random();
      if (roll < 0.35) this.playCracker();
      else if (roll < 0.6) this.playSparkle();
      else if (roll < 0.8) this.playRocket();
      else this.playBlast();
    }, 900 + Math.random() * 700);

    this.intervals.push(effectLoop);
  }

  playCracker() {
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.dryGain);
    gain.connect(this.reverb);
    src.start(t);

    this.playTone(1200 + Math.random() * 400, t, 0.05, 'square', 0.04);
  }

  playSparkle() {
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const freq = 1800 + Math.random() * 2200;
      this.playTone(freq, t + i * 0.07, 0.18, 'sine', 0.035);
    }
  }

  playRocket() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.55);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.08);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2000, t + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.dryGain);
    gain.connect(this.reverb);
    osc.start(t);
    osc.stop(t + 0.65);

    this.timeouts.push(setTimeout(() => {
      if (this.running) this.playBlast(true);
    }, 550));
  }

  playBlast(soft = false) {
    const t = this.ctx.currentTime;
    const dur = soft ? 0.25 : 0.4;
    const vol = soft ? 0.12 : 0.2;

    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(gain);
    gain.connect(this.dryGain);
    gain.connect(this.reverb);
    src.start(t);

    [392, 494, 587].forEach((f, i) => {
      this.playTone(f, t + i * 0.04, 0.3, 'triangle', soft ? 0.04 : 0.07);
    });
  }

  burst() {
    if (!this.ctx) this.init();
    for (let i = 0; i < 6; i++) {
      this.timeouts.push(setTimeout(() => {
        if (Math.random() > 0.5) this.playBlast();
        else this.playCracker();
        this.playSparkle();
      }, i * 120));
    }
  }
}

function initDualMusicPlayer(options = {}) {
  const {
    celebrationLabel = '?? Celebration Sounds',
    songLabel = '?? Birthday Song',
    songSrc = 'assets/music/birthday-song.mp3',
    defaultTrack = 'celebration',
    disableCelebration = false
  } = options;

  const player = document.querySelector('.music-player');
  if (!player) return null;

  const playBtn = player.querySelector('#music-btn');
  const labelEl = player.querySelector('.music-label');

  // If the celebration track is disabled, remove its button from the UI
  if (disableCelebration) {
    const cBtn = player.querySelector('.music-track-btn[data-track="celebration"]');
    if (cBtn) cBtn.remove();
  }

  const trackBtns = player.querySelectorAll('.music-track-btn');

  const celebration = disableCelebration ? null : new CelebrationAudio();
  const songAudio = new Audio(songSrc);
  songAudio.loop = true;
  songAudio.volume = 0.7;

  let activeTrack = defaultTrack;
  let playing = false;

  function setActiveTrack(track) {
    activeTrack = track;
    trackBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.track === track);
    });
    labelEl.textContent = track === 'celebration' ? celebrationLabel : songLabel;
  }

  function stopAll() {
    if (celebration) celebration.stop();
    songAudio.pause();
    playing = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.remove('playing');
  }

  async function playActive() {
    if (activeTrack === 'celebration' && celebration) {
      songAudio.pause();
      await celebration.start();
    } else {
      if (celebration) celebration.stop();
      try {
        await songAudio.play();
      } catch (_) {}
    }
    playing = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add('playing');
  }

  playBtn.addEventListener('click', async () => {
    if (playing) {
      stopAll();
    } else {
      await playActive();
    }
  });

  trackBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const track = btn.dataset.track;
      if (track === activeTrack) return;

      const wasPlaying = playing;
      stopAll();
      setActiveTrack(track);
      if (wasPlaying) await playActive();
    });
  });

  setActiveTrack(defaultTrack);

  return { celebration, songAudio, stopAll, playActive };
}
