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
    defaultTrack: 'song',
    songSrc: (typeof BIRTHDAY_CONFIG !== 'undefined' && BIRTHDAY_CONFIG.music)
      ? BIRTHDAY_CONFIG.music
      : 'assets/music/birthday-song.mp3',
    celebrationLabel: '🎆 Celebration Sounds',
    songLabel: '🎵 Birthday Song'
  };

  // disable built-in celebration soundscape for this page
  musicOptions.disableCelebration = true;
  const musicPlayer = initDualMusicPlayer(musicOptions);

  // attempt autoplay the song when page loads (may be blocked by browser)
  if (musicPlayer && musicPlayer.playActive) {
    musicPlayer.playActive().catch(() => {
      // Autoplay blocked — show a small prompt to enable audio
      const prompt = document.createElement('button');
      prompt.className = 'autoplay-prompt';
      prompt.textContent = 'Enable sound';
      Object.assign(prompt.style, {
        position: 'fixed',
        bottom: '18px',
        right: '18px',
        zIndex: 9999,
        padding: '10px 14px',
        background: 'linear-gradient(90deg,#ff6b9d,#a855f7)',
        color: '#fff',
        border: 'none',
        borderRadius: '999px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        fontSize: '14px'
      });

      prompt.addEventListener('click', async () => {
        try {
          await musicPlayer.playActive();
        } catch (_) {}
        prompt.remove();
      });

      document.body.appendChild(prompt);
    });
  }

  // final message reveal is orchestrated after lights illuminate

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
    // placeholder - replaced by triggerCelebrate
    triggerCelebrate();
  });

  // extract celebrate action so it can be invoked programmatically
  function triggerCelebrate() {
    if (musicPlayer && musicPlayer.celebration) {
      try { musicPlayer.celebration.burst(); } catch (e) {}
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
  }

  // Automatically play the celebration animation after 10 seconds,
  // but keep the button available for manual clicks.
  try {
    const celebrateBtn = document.getElementById('celebrate-btn');
    if (celebrateBtn) {
      // function to animate the button and trigger celebration
      const doAuto = () => {
        try { celebrateBtn.classList.add('auto-animate'); } catch (e) {}
        try { triggerCelebrate(); } catch (e) {}
        setTimeout(() => { try { celebrateBtn.classList.remove('auto-animate'); } catch (e) {} }, 4000);
      };

      // start after 10s, then run in a loop every 10s
      const startPeriodic = () => {
        doAuto();
        setInterval(doAuto, 10000);
      };

      setTimeout(startPeriodic, 10000);
    }
  } catch (e) {}
  // start photo slideshow for the birthday photo
  initPhotoSlideshow();
});

// Create a subtle bulb-wire border when arriving from page4
function createBulbBorderIfFromPage4() {
  try {
    // Bulb decoration removed. Keep cinematic background and particle effects.
    (function createDecorativeBackground(){
      const bokehLayer = document.createElement('div');
      bokehLayer.className = 'bokeh-layer';
      document.body.appendChild(bokehLayer);

      // bokeh blobs
      for (let i=0;i<8;i++){
        const b = document.createElement('div');
        b.className = 'bokeh';
        const size = 80 + Math.random()*240;
        b.style.width = size + 'px'; b.style.height = size + 'px';
        b.style.left = (5 + Math.random()*90) + '%';
        b.style.top = (5 + Math.random()*80) + '%';
        b.style.background = ['rgba(130,80,200,0.12)','rgba(70,140,255,0.08)','rgba(255,110,180,0.06)'][Math.floor(Math.random()*3)];
        b.style.opacity = (0.06 + Math.random()*0.12).toFixed(2);
        bokehLayer.appendChild(b);
      }

      // stars
      for (let i=0;i<60;i++){
        const s = document.createElement('div');
        s.className = 'star';
        s.style.left = Math.random()*100 + '%';
        s.style.top = Math.random()*55 + '%';
        s.style.opacity = 0;
        const delay = Math.random()*5000;
        const dur = 2000 + Math.random()*3000;
        s.animate([{opacity:0},{opacity:1},{opacity:0}], { duration: dur, iterations: Infinity, delay: delay, easing: 'ease-in-out' });
        bokehLayer.appendChild(s);
      }

      // gentle golden particles drifting
      setInterval(()=>{
        const g = document.createElement('div'); g.className='golden';
        const startX = 20 + Math.random()*60; g.style.left = startX + '%'; g.style.top = (80 + Math.random()*15) + 'vh';
        document.body.appendChild(g);
        const dur = 7000 + Math.random()*5000;
        g.style.transition = `transform ${dur}ms linear, opacity ${dur}ms linear`;
        requestAnimationFrame(()=>{ g.style.transform = `translateY(-120vh) translateX(${(Math.random()*80-40)}px)`; g.style.opacity='0'; });
        setTimeout(()=>g.remove(), dur+200);
      }, 600 + Math.random()*600);
    })();

    // continuous gentle particles, confetti and hearts
    const heartsContainer = document.querySelector('.hearts-container');
    const spawnHeart = () => {
      if (!heartsContainer) return;
      const h = document.createElement('div');
      h.className = 'heart';
      h.style.left = (20 + Math.random() * 60) + '%';
      h.style.top = (60 + Math.random() * 30) + '%';
      h.textContent = ['💖','💗','💞','💖','💗','💞'][Math.floor(Math.random()*3)];
      h.style.animationDuration = (6 + Math.random()*6) + 's';
      heartsContainer.appendChild(h);
      setTimeout(() => h.remove(), 12000);
    };
    setInterval(spawnHeart, 1000 + Math.random()*1200);

    // soft confetti particles
    const spawnParticle = () => {
      const p = document.createElement('div');
      p.className = 'particle';
      const startX = (20 + Math.random()*60);
      p.style.left = startX + '%';
      p.style.top = (80 + Math.random()*20) + 'vh';
      p.style.background = ['#ff6b9d','#ffd700','#a855f7','#4facfe','#ffffff'][Math.floor(Math.random()*5)];
      document.body.appendChild(p);
      const dur = 9000 + Math.random()*8000;
      p.style.transition = `transform ${dur}ms linear, opacity ${dur}ms linear`;
      requestAnimationFrame(() => {
        p.style.transform = `translateY(-110vh) translateX(${(Math.random()*60-30)}px)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), dur + 200);
    };
    setInterval(spawnParticle, 400);

    // small sparkle bursts near center occasionally
    const sparkleBurst = () => {
      const el = document.createElement('div');
      el.className = 'sparkle-burst';
      const cx = window.innerWidth/2 + (Math.random()*120-60);
      const cy = window.innerHeight/2 + (Math.random()*60-30);
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      document.body.appendChild(el);
      el.style.opacity = '1';
      el.animate([{ transform: 'scale(0.2)', opacity: 1},{ transform: 'scale(1.8)', opacity: 0 }], { duration: 700+Math.random()*600, easing: 'ease-out' });
      setTimeout(() => el.remove(), 1500);
    };
    setInterval(sparkleBurst, 2500 + Math.random()*2000);
  } catch (e) {
    console.warn('bulb border init failed', e);
  }
}

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

function initPhotoSlideshow() {
  const imgEl = document.querySelector('.birthday-photo');
  if (!imgEl) return;

  const images = [
    'assets/images/Img8.jpeg',
    'assets/images/Img7.jpeg',
    'assets/images/Img3.jpeg',
    'assets/images/Img4.jpeg',
    'assets/images/Img5.jpeg',
    'assets/images/Img6.jpeg'
  ];

  // Preload images
  images.forEach(src => { const i = new Image(); i.src = src; });

  // Determine starting index based on current src attribute
  const currentAttrSrc = imgEl.getAttribute('src') || '';
  const baseCurrent = currentAttrSrc.split('/').pop();
  let current = images.findIndex(s => s.endsWith(baseCurrent));
  if (current === -1) current = 0;

  imgEl.style.transition = imgEl.style.transition || 'opacity 0.6s ease';

  const delayMs = 3000; // time each photo is visible

  setInterval(() => {
    // fade out
    imgEl.style.opacity = '0';
    setTimeout(() => {
      // advance index
      current = (current + 1) % images.length;
      imgEl.setAttribute('src', images[current]);
      // fade in
      imgEl.style.opacity = '1';
    }, 600);
  }, delayMs);
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
        // larger, richer explosion
        const count = 120 + Math.floor(Math.random() * 80);
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
        // small secondary mini-bursts
        if (Math.random() < 0.35) {
          const mini = 12 + Math.floor(Math.random() * 18);
          for (let m = 0; m < mini; m++) {
            const angle = Math.random() * Math.PI * 2;
            const px = this.x + Math.cos(angle) * (10 + Math.random() * 20);
            const py = this.y + Math.sin(angle) * (10 + Math.random() * 20);
            particles.push(new Particle(px, py, '#ffffff'));
          }
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

    // slightly higher chance to launch fireworks and occasional paired launches
    if (Math.random() < 0.06) {
      fireworks.push(new Firework());
      if (Math.random() < 0.35) fireworks.push(new Firework());
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

  // Periodic paper-blast: small papers that burst outward every 10 seconds
  function spawnPaperBlast() {
    const count = 22 + Math.floor(Math.random() * 16);
    const centerX = window.innerWidth * (0.45 + Math.random() * 0.1);
    const centerY = window.innerHeight * (0.25 + Math.random() * 0.15);
    const colors = ['#fff','#ffefc7','#ffd7f0','#e6f7ff','#fff7f0','#f0ffe6'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'paper-piece';
      const w = 6 + Math.random() * 14;
      const h = 6 + Math.random() * 14;
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.position = 'fixed';
      el.style.left = centerX + (Math.random() * 40 - 20) + 'px';
      el.style.top = centerY + (Math.random() * 30 - 15) + 'px';
      el.style.zIndex = 9998;
      el.style.opacity = '1';
      el.style.borderRadius = (Math.random() < 0.2 ? '3px' : '0px');
      el.style.transform = `rotate(${Math.random()*360}deg)`;
      el.style.pointerEvents = 'none';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
      document.body.appendChild(el);

      // animate outward
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 320;
      const tx = Math.cos(angle) * dist + (Math.random()*40-20);
      const ty = Math.sin(angle) * dist - (150 + Math.random() * 120);
      const dur = 1400 + Math.random() * 1600;
      el.style.transition = `transform ${dur}ms cubic-bezier(.17,.67,.36,1), opacity ${dur}ms ease-out`;
      requestAnimationFrame(() => {
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random()*720-360}deg) scale(${0.6+Math.random()*1.2})`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), dur + 80);
    }
  }

  // first blast shortly after load, then every 10 seconds
  setTimeout(spawnPaperBlast, 2800);
  setInterval(spawnPaperBlast, 10000);
}
