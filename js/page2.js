document.addEventListener('DOMContentLoaded', () => {
  initPageProgress(2);
  AOS.init({ duration: 800, once: true });

  document.querySelectorAll('.polaroid').forEach((polaroid, index) => {
    polaroid.addEventListener('click', () => {
      const img = polaroid.querySelector('img');
      const caption = polaroid.querySelector('.polaroid-caption').textContent;

      document.getElementById('modal-img').src = img.src;
      document.getElementById('modal-caption').textContent = caption;

      const modal = new bootstrap.Modal(document.getElementById('photoModal'));
      modal.show();

      launchConfetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });

      gsap.from('#modal-img', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });
    });

    polaroid.addEventListener('mouseenter', () => {
      gsap.to(polaroid, { rotation: 0, scale: 1.08, duration: 0.3 });
    });

    polaroid.addEventListener('mouseleave', () => {
      const rotate = polaroid.style.getPropertyValue('--rotate') || '0deg';
      gsap.to(polaroid, { rotation: parseFloat(rotate), scale: 1, duration: 0.3 });
    });
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    navigateWithTransition('page3.html', '💌 Opening your letter...');
  });

  gsap.from('.polaroid', {
    y: 100,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.3
  });

  // Background music autoplay logic (attempt only; no manual play button)
  // Replace 'your-song.mp3' with your file placed in assets/music/
  const BG_SONG_SRC = 'assets/music/your-song.mp3';
  const bgAudio = new Audio(BG_SONG_SRC);
  bgAudio.loop = true;
  bgAudio.preload = 'auto';

  function tryAutoplay() {
    const setAllowed = () => {
      try { sessionStorage.setItem('bgAudioAllowed', '1'); } catch (e) {}
    };

    const attemptUnmuted = () => {
      bgAudio.muted = false;
      const p = bgAudio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setAllowed()).catch(() => {
          // try muted-play fallback
          bgAudio.muted = true;
          const pm = bgAudio.play();
          if (pm && typeof pm.then === 'function') {
            pm.then(() => {
              // if muted-play succeeds, try unmuting (may or may not work)
              try { bgAudio.muted = false; } catch (e) {}
              setAllowed();
            }).catch(() => {});
          }
        });
      }
    };

    // If earlier play succeeded in this session, try more aggressive attempt (including muted fallback)
    const wasAllowed = sessionStorage.getItem('bgAudioAllowed');
    if (wasAllowed) {
      attemptUnmuted();
    } else {
      // first try unmuted, then muted fallback
      attemptUnmuted();
    }

    try { sessionStorage.removeItem('navigatedFrom'); } catch (e) {}
  }

  // Retry autoplay on common user gesture events (no visible button)
  function addRetryListeners() {
    const retry = () => {
      const p = bgAudio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          try { sessionStorage.setItem('bgAudioAllowed', '1'); } catch (e) {}
        }).catch(() => {});
      }
      // remove listeners after first attempt
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('touchstart', retry);
      window.removeEventListener('keydown', retry);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };

    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') tryAutoplay();
    };

    window.addEventListener('pointerdown', retry, { once: true });
    window.addEventListener('touchstart', retry, { once: true });
    window.addEventListener('keydown', retry, { once: true });
    document.addEventListener('visibilitychange', visibilityHandler);
  }

  // Try autoplay after short delay to allow page scripts to finish
  setTimeout(() => {
    tryAutoplay();
    addRetryListeners();
    // create manual fallback button in case autoplay is blocked
    createManualPlayButton();
  }, 300);

  // create a small manual play button so user can start music if autoplay is blocked
  function createManualPlayButton() {
    if (document.getElementById('music-fallback-btn')) return;
    const wasAllowed = sessionStorage.getItem('bgAudioAllowed');
    // if already allowed, no need to show
    if (wasAllowed) return;

    const btn = document.createElement('button');
    btn.id = 'music-fallback-btn';
    btn.textContent = '🎵 Play music';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '18px',
      bottom: '18px',
      zIndex: 9999,
      padding: '8px 12px',
      borderRadius: '999px',
      background: 'linear-gradient(90deg,#ff6b9d,#a855f7)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
      cursor: 'pointer',
      fontSize: '14px'
    });

    btn.addEventListener('click', async () => {
      try {
        await bgAudio.play();
        try { sessionStorage.setItem('bgAudioAllowed', '1'); } catch (e) {}
        btn.remove();
      } catch (e) {
        // ignore
      }
    });

    // remove button if audio starts playing by other means
    bgAudio.addEventListener('play', () => { try { btn.remove(); } catch (e) {} });

    document.body.appendChild(btn);
  }

  // Also attempt autoplay when page is shown (covers bfcache/back navigation),
  // and on popstate (history navigation) so coming from page3 via back works.
  window.addEventListener('pageshow', (ev) => {
    tryAutoplay();
  });

  window.addEventListener('popstate', () => {
    tryAutoplay();
  });

  // visibilitychange: when user returns to tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') tryAutoplay();
  });
});
