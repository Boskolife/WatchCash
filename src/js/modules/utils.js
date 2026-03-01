const VIEWPORT_ACTIVE_BREAKPOINT = 768;

/**
 * Adds is-active class when element is fully in viewport.
 * Disabled when viewport width is below VIEWPORT_ACTIVE_BREAKPOINT.
 */
export function initViewportActiveSections() {
  const sections = document.querySelectorAll('[data-viewport-active]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { threshold: 0.85 },
  );

  function update() {
    const isEnabled = window.innerWidth > VIEWPORT_ACTIVE_BREAKPOINT;
    if (isEnabled) {
      sections.forEach((section) => observer.observe(section));
    } else {
      sections.forEach((section) => {
        observer.unobserve(section);
        section.classList.remove('is-active');
      });
    }
  }

  update();
  window.addEventListener('resize', update);
}

export function updateCurrentYear() {
  const year = new Date().getFullYear();
  const yearElement = document.querySelector('.year-current');
  if (!yearElement) return;
  yearElement.textContent = year;
}

const HERO_BANNER_GAP_PX = 24;

/**
 * Keeps the hero banner (fixed) from overlapping the footer:
 * when the footer enters the viewport, the banner stops and sits just above it with a gap.
 */
export function initHeroBannerAboveFooter() {
  const banner = document.querySelector('.hero__banner');
  const footer = document.getElementById('footer');
  if (!banner || !footer) return;

  let rafId = null;

  function updateBannerPosition() {
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (footerRect.top < viewportHeight - HERO_BANNER_GAP_PX) {
      const bottomPx = viewportHeight - footerRect.top + HERO_BANNER_GAP_PX;
      banner.style.bottom = `${bottomPx}px`;
      banner.style.transform = `translateX(110%)`;
    } else {
      banner.style.bottom = '';
      banner.style.transform = '';
    }
  }

  function onScrollOrResize() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      updateBannerPosition();
      rafId = null;
    });
  }

  updateBannerPosition();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
}
