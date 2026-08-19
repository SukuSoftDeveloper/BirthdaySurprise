document.addEventListener('DOMContentLoaded', () => {
  initPageProgress(4);
  AOS.init({ duration: 800, once: true });

  const balloonMessages = [
    '🎈 Keep that smile, it suits you 😊',
    '🎈 Never stop dreaming big. ✨',
    'Stay awesome! ⭐',
    '🎈 More happy days are waiting for you! 🌸',
    'Party time! 🎉',
    'Birthday queen! 👑'
  ];

  const colors = ['#ff6b9d', '#ffd700', '#a855f7', '#4facfe', '#fa709a', '#43e97b'];
  const area = document.getElementById('balloons-area');
  let poppedCount = 0;
  let scratchReady = false;

  balloonMessages.forEach((msg, i) => {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.background = `radial-gradient(circle at 30% 30%, ${colors[i]}, ${colors[i]}88)`;
    balloon.style.left = (10 + i * 14) + '%';
    balloon.style.top = (20 + Math.random() * 30) + '%';
    balloon.style.animationDelay = (i * 0.3) + 's';
    balloon.dataset.message = msg;

    const hiddenMsg = document.createElement('div');
    hiddenMsg.className = 'hidden-message';
    hiddenMsg.textContent = msg;
    // we'll compute pixel positions for the message when the balloon is popped
    hiddenMsg.style.left = '0px';
    hiddenMsg.style.top = '0px';

    balloon.addEventListener('click', () => {
      if (balloon.classList.contains('popped')) return;
      // compute position for the revealed message to avoid overlap
      const areaRect = area.getBoundingClientRect();
      const bRect = balloon.getBoundingClientRect();
      const msgWidth = 220; // desired width for message area
      // desired left: center align under balloon within area
      let left = bRect.left - areaRect.left + (bRect.width / 2) - (msgWidth / 2);
      // clamp inside area
      left = Math.max(6, Math.min(left, areaRect.width - msgWidth - 6));

      // place message and avoid overlapping with already-visible messages
      const baseTop = bRect.top - areaRect.top + bRect.height + 8; // start below balloon
      hiddenMsg.style.width = msgWidth + 'px';
      // measure actual message height without showing it visibly
      hiddenMsg.style.visibility = 'hidden';
      hiddenMsg.classList.add('show');
      const measured = hiddenMsg.getBoundingClientRect();
      const msgHeight = Math.max(28, measured.height || 36);
      hiddenMsg.classList.remove('show');
      hiddenMsg.style.visibility = '';

      // helper to get rect relative to area
      const rectForEl = (el) => {
        const r = el.getBoundingClientRect();
        return {
          l: r.left - areaRect.left,
          t: r.top - areaRect.top,
          r: r.right - areaRect.left,
          b: r.bottom - areaRect.top
        };
      };

      const rectIntersects = (a, b) => !(a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b);

      let top = baseTop;
      const visible = Array.from(area.querySelectorAll('.hidden-message.show'));
      let attempts = 0;
      while (attempts < 20) {
        const newRect = { l: left, t: top, r: left + msgWidth, b: top + msgHeight };
        const collision = visible.some(v => rectIntersects(newRect, rectForEl(v)));
        if (!collision) break;
        top += msgHeight + 8; // move down to avoid collision
        // if moving down goes out of area, try stacking upward
        if (top + msgHeight > areaRect.height - 8) {
          let upTop = baseTop - msgHeight - 8;
          while (upTop > 6) {
            const upRect = { l: left, t: upTop, r: left + msgWidth, b: upTop + msgHeight };
            const collUp = visible.some(v => rectIntersects(upRect, rectForEl(v)));
            if (!collUp) { top = upTop; break; }
            upTop -= msgHeight + 8;
          }
          break;
        }
        attempts++;
      }

      // clamp left/top within area
      left = Math.max(6, Math.min(left, areaRect.width - msgWidth - 6));
      top = Math.max(6, Math.min(top, areaRect.height - msgHeight - 6));

      hiddenMsg.style.left = left + 'px';
      hiddenMsg.style.top = top + 'px';
      // play pop sound
      if (typeof playPopSound === 'function') playPopSound();
      balloon.classList.add('popped');
      hiddenMsg.classList.add('show');
      poppedCount++;

      launchConfetti({
        particleCount: 40,
        spread: 60,
        origin: {
          x: parseFloat(balloon.style.left) / 100,
          y: 0.5
        },
        colors: [colors[i], '#ffffff']
      });

      document.getElementById('pop-count').textContent =
        poppedCount >= 6 ? 'All popped! Scratch your gift below! 🎁' : `Popped ${poppedCount}/6! Keep going! 🎯`;

      if (poppedCount >= 6) {
        setTimeout(showScratchCard, 1000);
      }
    });

    area.appendChild(balloon);
    area.appendChild(hiddenMsg);

    gsap.from(balloon, {
      y: 200,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'bounce.out'
    });
  });

  function showScratchCard() {
    const section = document.getElementById('scratch-section');
    const hint = document.getElementById('scratch-hint');
    section.classList.remove('d-none');
    hint.classList.remove('d-none');

    gsap.fromTo(section,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        onComplete: () => {
          requestAnimationFrame(() => initScratchCard());
        }
      }
    );
  }

  function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const width = container.offsetWidth || 300;
      const height = container.offsetHeight || 200;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScratchLayer(width, height);
    }

    function drawScratchLayer(width, height) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#777';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#999';
      for (let i = 0; i < 2000; i++) {
        ctx.fillRect(
          Math.random() * width,
          Math.random() * height,
          2,
          2
        );
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Scratch Here! ✨', width / 2, height / 2);
    }

    resizeCanvas();
    scratchReady = true;

    let scratching = false;
    let revealed = false;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function scratchAt(x, y) {
      if (revealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkRevealProgress() {
      if (revealed) return;

      const width = container.offsetWidth || 300;
      const height = container.offsetHeight || 200;
      const dpr = window.devicePixelRatio || 1;
      const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr);
      let transparent = 0;
      const total = imageData.data.length / 4;

      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] < 128) transparent++;
      }

      if (transparent / total > 0.35) {
        revealGift();
      }
    }

    function revealGift() {
      if (revealed) return;
      revealed = true;
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      launchConfettiBurst();
      showFinalButton();
    }

    function startScratch(e) {
      if (!scratchReady || revealed) return;
      scratching = true;
      const pos = getPos(e);
      scratchAt(pos.x, pos.y);
      checkRevealProgress();
    }

    function moveScratch(e) {
      if (!scratching || revealed) return;
      e.preventDefault();
      const pos = getPos(e);
      scratchAt(pos.x, pos.y);
      checkRevealProgress();
    }

    function stopScratch() {
      scratching = false;
    }

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', moveScratch);
    canvas.addEventListener('mouseup', stopScratch);
    canvas.addEventListener('mouseleave', stopScratch);

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startScratch(e);
    }, { passive: false });

    canvas.addEventListener('touchmove', moveScratch, { passive: false });
    canvas.addEventListener('touchend', stopScratch);
    canvas.addEventListener('touchcancel', stopScratch);
  }

  function showFinalButton() {
    const section = document.getElementById('final-btn-section');
    section.classList.remove('d-none');
    gsap.from(section, { opacity: 0, y: 30, duration: 0.6 });
  }

  document.getElementById('next-btn').addEventListener('click', () => {
    try {
      sessionStorage.setItem('fromPage4To5', '1');
    } catch (e) {
      // ignore storage errors
    }
    navigateWithTransition('page5.html', '🎆 The Grand Finale!');
  });
});
