document.addEventListener('DOMContentLoaded', () => {
  initPageProgress(1);
  AOS.init({ duration: 1000, once: true });

  if (typeof BIRTHDAY_CONFIG !== 'undefined') {
    document.querySelector('.display-title').textContent = BIRTHDAY_CONFIG.page1.greeting;
    document.querySelectorAll('.subtitle')[1].textContent = BIRTHDAY_CONFIG.page1.subtitle;
  }

  tsParticles.load('particles-js', {
    particles: {
      number: { value: 60 },
      color: { value: ['#ffffff', '#ffd700', '#ff6b9d'] },
      shape: { type: ['circle', 'star'] },
      opacity: { value: { min: 0.1, max: 0.6 } },
      size: { value: { min: 1, max: 4 } },
      move: { enable: true, speed: 1.5, direction: 'top', outModes: 'out' },
      twinkle: { particles: { enable: true, frequency: 0.05, opacity: 1 } }
    },
    interactivity: { events: { onHover: { enable: true, mode: 'bubble' } } }
  });

  const giftBox = document.getElementById('gift-box');
  const startBtn = document.getElementById('start-btn');
  let opened = false;

  giftBox.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    gsap.to('.gift-lid', {
      rotationX: -120,
      y: -30,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    gsap.to('.gift-box', {
      scale: 1.2,
      duration: 0.5,
      yoyo: true,
      repeat: 1
    });

    launchConfetti({ particleCount: 150, spread: 100 });
    launchConfettiBurst();

    setTimeout(() => {
      startBtn.classList.remove('d-none');
      gsap.from(startBtn, { opacity: 0, y: 30, duration: 0.6 });
    }, 1000);
  });

  startBtn.addEventListener('click', () => {
    navigateWithTransition('page2.html', '💕 Opening Memories...');
  });

  setTimeout(() => launchConfetti({ particleCount: 50, spread: 60 }), 1500);
});
