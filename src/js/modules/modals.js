import {
  MOBILE_MENU_OPEN_CLASS,
  BODY_MENU_OPEN_CLASS,
  CONTACT_MODAL_OPEN_CLASS,
  BODY_MODAL_OPEN_CLASS,
} from './constants.js';

export function initContactModal() {
  const modal = document.querySelector('.contact-modal');
  const openBtns = document.querySelectorAll('[data-open-contact-modal]');
  const closeBtn = document.querySelector('.contact-modal__close');
  const overlay = document.querySelector('.contact-modal__overlay');

  if (!modal || !openBtns.length) return;

  function openModal() {
    modal.classList.add(CONTACT_MODAL_OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    openBtns.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
    document.body.classList.add(BODY_MODAL_OPEN_CLASS);
    closeBtn?.focus();
  }

  function closeModal() {
    modal.classList.remove(CONTACT_MODAL_OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'true');
    openBtns.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove(BODY_MODAL_OPEN_CLASS);
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      modal.classList.contains(CONTACT_MODAL_OPEN_CLASS)
    ) {
      closeModal();
    }
  });
}

export function initMobileMenu() {
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
