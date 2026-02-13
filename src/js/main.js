const MOBILE_MENU_OPEN_CLASS = 'mobile-menu--open';
const BODY_MENU_OPEN_CLASS = 'body-menu-open';

function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const burger = document.querySelector('.header__burger-menu');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const overlay = document.querySelector('.mobile-menu__overlay');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');

  if (!menu || !burger) return;

  function openMenu() {
    menu.classList.add(MOBILE_MENU_OPEN_CLASS);
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.classList.add('header__burger-menu--active');
    document.body.classList.add(BODY_MENU_OPEN_CLASS);
  }

  function closeMenu() {
    menu.classList.remove(MOBILE_MENU_OPEN_CLASS);
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('header__burger-menu--active');
    document.body.classList.remove(BODY_MENU_OPEN_CLASS);
  }

  burger.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains(MOBILE_MENU_OPEN_CLASS)) {
      closeMenu();
    }
  });
}

initMobileMenu();
