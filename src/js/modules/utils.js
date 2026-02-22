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
