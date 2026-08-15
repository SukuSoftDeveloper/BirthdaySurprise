document.addEventListener('DOMContentLoaded', () => {
  initPageProgress(5);
  AOS.init({ duration: 1000, once: true });

  if (typeof BIRTHDAY_CONFIG !== 'undefined') {
    document.getElementById('friend-name').textContent = BIRTHDAY_CONFIG.friendName;
    const wishList = document.querySelector('.wish-list');
    if (wishList && BIRTHDAY_CONFIG.page5.wishes) {
      wishList.innerHTML = BIRTHDAY_CONFIG.page5.wishes.map(w => `<li>${w}</li>`).join('');
    }
    const quoteCard = document.querySelector('.glass-card');
    if (quoteCard) {
      quoteCard.querySelector('p:first-child').textContent = BIRTHDAY_CONFIG.page5.quote;
      quoteCard.querySelector('p:last-child').textContent = BIRTHDAY_CONFIG.page5.signature;
    }
  }

  initFireworks();
  initBirthdayTimer();

  const musicOptions = {
    defaultTrack: 'celebration',
    songSrc: (typeof BIRTHDAY_CONFIG !== 'undefined' && BIRTHDAY_CONFIG.music)
      ? BIRTHDAY_CONFIG.music
      : 'assets/music/birthday-song.mp3',
    celebrationLabel: '🎆 Celebration Sounds',
    songLabel: '🎵 Birthday Song'
  };

  const musicPlayer = initDualMusicPlayer(musicOptions);

  gsap.from('.final-message', {
    scale: 0.5,
    opacity: 0,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)',
    delay: 0.5
  });

  gsap.from('.birthday-cake', {
    y: -100,
    rotation: 360,
    duration: 1.5,
    ease: 'bounce.out'
  });

  setTimeout(() => {
    launchConfettiBurst();
    launchConfetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
  }, 2000);

  document.getElementById('celebrate-btn').addEventListener('click', () => {
    if (musicPlayer && musicPlayer.celebration) {
      musicPlayer.celebration.burst();
    }

    launchConfettiBurst();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        launchConfetti({
          particleCount: 100,
          spread: 100,
          origin: { x: Math.random(), y: Math.random() * 0.5 + 0.3 },
          colors: ['#ff6b9d', '#ffd700', '#a855f7', '#ffffff', '#4facfe']
        });
      }, i * 300);
    }

    gsap.to('.birthday-cake', {
      scale: 1.3,
      rotation: 10,
      yoyo: true,
      repeat: 3,
      duration: 0.3
    });
  });
});

function initBirthdayTimer() {
  const birthday = new Date();
  birthday.setHours(birthday.getHours() + 24);

  function update() {
    const now = new Date();
    const diff = birthday - now;
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

function initFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fireworks = [];
  const particles = [];

  class Firework {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * canvas.height * 0.5;
      this.speed = 3 + Math.random() * 3;
      this.color = ['#ff6b9d', '#ffd700', '#a855f7', '#4facfe', '#fa709a'][Math.floor(Math.random() * 5)];
      this.done = false;
    }

    update() {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.explode();
        this.done = true;
      }
    }

    explode() {
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(15, 12, 41, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.03) {
      fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].done) fireworks.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
