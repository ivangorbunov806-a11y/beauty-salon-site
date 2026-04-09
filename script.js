const menuToggle = document.querySelector('.menu-toggle');
const menuDialog = document.getElementById('fullscreen-menu');
const menuClose = document.querySelector('.menu-close');
const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

let lastFocusedElement = null;

const toggleMenu = (open) => {
  if (!menuDialog || !menuToggle) {
    return;
  }

  if (open) {
    lastFocusedElement = document.activeElement;
    menuDialog.hidden = false;
    menuDialog.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    requestAnimationFrame(() => {
      const firstFocusable = menuDialog.querySelector(focusableSelector);
      firstFocusable?.focus();
    });

    return;
  }

  menuDialog.setAttribute('aria-hidden', 'true');
  menuDialog.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  lastFocusedElement?.focus();
};

if (menuToggle && menuDialog && menuClose) {
  menuToggle.addEventListener('click', () => toggleMenu(true));
  menuClose.addEventListener('click', () => toggleMenu(false));

  menuDialog.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (menuDialog.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      toggleMenu(false);
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableItems = [...menuDialog.querySelectorAll(focusableSelector)].filter(
      (el) => !el.hasAttribute('hidden')
    );

    if (!focusableItems.length) {
      return;
    }

    const firstFocusable = focusableItems[0];
    const lastFocusable = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  });
}

const serviceItems = [...document.querySelectorAll('.service-item')];
const servicePreviewImage = document.getElementById('menu-service-image');

const setActiveService = (item) => {
  if (!item || !servicePreviewImage) {
    return;
  }

  const nextImage = item.dataset.image;
  const nextAlt = item.dataset.alt || 'Превью услуги';

  serviceItems.forEach((serviceItem) => {
    serviceItem.classList.toggle('is-active', serviceItem === item);
    serviceItem.setAttribute('aria-current', serviceItem === item ? 'true' : 'false');
  });

  if (!nextImage || nextImage === servicePreviewImage.getAttribute('src')) {
    return;
  }

  servicePreviewImage.classList.add('is-fading');

  window.setTimeout(() => {
    servicePreviewImage.src = nextImage;
    servicePreviewImage.alt = nextAlt;
    servicePreviewImage.classList.remove('is-fading');
  }, 140);
};

if (serviceItems.length && servicePreviewImage) {
  serviceItems.forEach((item, index) => {
    item.dataset.index = String(index);
  });

  const focusByIndex = (index) => {
    const safeIndex = Math.max(0, Math.min(serviceItems.length - 1, index));
    const target = serviceItems[safeIndex];
    target?.focus();
    setActiveService(target);
  };

  serviceItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        setActiveService(item);
      }
    });

    item.addEventListener('focus', () => setActiveService(item));
    item.addEventListener('click', () => setActiveService(item));
    item.addEventListener('keydown', (event) => {
      const currentIndex = Number(item.dataset.index || '0');

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusByIndex(currentIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusByIndex(currentIndex - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        focusByIndex(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        focusByIndex(serviceItems.length - 1);
      }
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
