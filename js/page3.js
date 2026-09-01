document.addEventListener('DOMContentLoaded', () => {
  initPageProgress(3);
  AOS.init({ duration: 800, once: true });

  const envelope = document.getElementById('envelope');
  const letterContent = document.getElementById('letter-content');
  const nextSection = document.getElementById('next-section');
  let opened = false;

  const messages = [
    'Hey Sravya!',
    'Happy Birthday 🎂✨',
    'Keep smiling, keep dreaming, and keep being you.✨'
  ];

  // typing sound (place a short keyboard click sound at assets/sounds/typing.mp3)
  let typingAudio = null;
  try {
    typingAudio = new Audio('assets/sounds/typing.mp3');
    typingAudio.preload = 'auto';
    typingAudio.volume = 0.7;
  } catch (e) {
    typingAudio = null;
  }


  envelope.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    envelope.classList.add('open');
    launchConfetti({ particleCount: 80, spread: 70 });

    setTimeout(() => {
      envelope.style.display = 'none';
      letterContent.classList.remove('d-none');
      startTypewriter();
    }, 1200);
  });

  function startTypewriter() {
    const typedEl = document.getElementById('typed-text');
    let msgIndex = 0;
    let charIndex = 0;

    function typeChar() {
      if (msgIndex >= messages.length) {
        showMessageCards();
        return;
      }

      const current = messages[msgIndex];
      if (charIndex < current.length) {
        typedEl.textContent += current.charAt(charIndex);
        // play typing sound for this character (best effort)
        try {
          if (typingAudio) {
            // clone so overlapping sounds can play
            const s = typingAudio.cloneNode();
            // slight random speed for natural feel
            try { s.playbackRate = 0.92 + Math.random() * 0.16; } catch (e) {}
            s.volume = 0.65 + Math.random() * 0.25;
            s.play().catch(() => {});
          }
        } catch (e) {}

        charIndex++;
        setTimeout(typeChar, 60);
      } else {
        typedEl.textContent += '\n';
        msgIndex++;
        charIndex = 0;
        setTimeout(typeChar, 800);
      }
    }

    typeChar();
  }

  function showMessageCards() {
    const cards = document.querySelectorAll('.message-card');
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('visible');
        launchConfetti({ particleCount: 15, spread: 40, origin: { y: 0.8 } });
      }, i * 800);
    });

    setTimeout(() => {
      nextSection.classList.remove('d-none');
      gsap.from(nextSection, { opacity: 0, y: 30, duration: 0.6 });
    }, cards.length * 800 + 500);
  }

  document.getElementById('next-btn').addEventListener('click', () => {
    navigateWithTransition('page4.html', '🎈 Get Ready to Play!');
  });
});
