/* Shared utilities across all pages */

function createFloatingHearts(count = 15) {
  const container = document.querySelector('.hearts-container');
  if (!container) return;

  const hearts = ['❤️', '💕', '💖', '💗', '💝', '🩷', '✨'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    container.appendChild(heart);
  }
}

function navigateWithTransition(url, message = '✨') {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition active';
  overlay.innerHTML = `<span class="transition-text">${message}</span>`;
  document.body.appendChild(overlay);

  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

function initPageProgress(currentPage, totalPages = 5) {
  const progress = document.querySelector('.page-progress');
  if (!progress) return;

  for (let i = 1; i <= totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    if (i < currentPage) dot.classList.add('completed');
    if (i === currentPage) dot.classList.add('active');
    progress.appendChild(dot);
  }
}

function launchConfetti(options = {}) {
  if (typeof confetti === 'undefined') return;

  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff6b9d', '#ffd700', '#a855f7', '#ff4757', '#ffffff']
  };

  confetti({ ...defaults, ...options });
}

function launchConfettiBurst() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ff6b9d', '#ffd700', '#a855f7']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ff6b9d', '#ffd700', '#a855f7']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function initMusicPlayer(audioSrc) {
  const player = document.querySelector('.music-player');
  if (!player) return;

  const btn = player.querySelector('.music-btn');
  const audio = new Audio(audioSrc);
  audio.loop = true;
  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.innerHTML = '<i class="fas fa-play"></i>';
      btn.classList.remove('playing');
    } else {
      audio.play().catch(() => {});
      btn.innerHTML = '<i class="fas fa-pause"></i>';
      btn.classList.add('playing');
    }
    playing = !playing;
  });

  return audio;
}

function createSparkles(container, count = 20) {
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    sparkle.style.animationDuration = (Math.random() * 1 + 1) + 's';
    container.appendChild(sparkle);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
});
