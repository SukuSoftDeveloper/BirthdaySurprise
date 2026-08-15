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
});
