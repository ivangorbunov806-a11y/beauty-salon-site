const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const setStagger = (containerSelector, itemSelector, step = 90, maxDelay = 420) => {
  document.querySelectorAll(containerSelector).forEach((container) => {
    container.querySelectorAll(itemSelector).forEach((item, index) => {
      const delay = Math.min(index * step, maxDelay);
      item.style.setProperty('--reveal-delay', `${delay}ms`);
    });
  });
};

setStagger('#services .service-grid', '.card');
setStagger('#about .about-gallery', '.fade-up');
setStagger('#gallery .gallery-layout', '.fade-up', 120, 180);

const observer = new IntersectionObserver(
  (entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('show');
      currentObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px',
  }
);

document.querySelectorAll('.fade-up').forEach((element) => {
  observer.observe(element);
});
