document.addEventListener('DOMContentLoaded', () => {
  initPageProgress(3);
  AOS.init({ duration: 800, once: true });

  const envelope = document.getElementById('envelope');
  const letterContent = document.getElementById('letter-content');
  const nextSection = document.getElementById('next-section');
  let opened = false;

  const messages = [
    'Dear Best Friend,',
    'Happy Birthday! 🎉',
    'You mean the world to me...'
  ];

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
