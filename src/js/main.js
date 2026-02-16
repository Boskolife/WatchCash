// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';

const MOBILE_MENU_OPEN_CLASS = 'mobile-menu--open';
const BODY_MENU_OPEN_CLASS = 'body-menu-open';
const CONTACT_MODAL_OPEN_CLASS = 'contact-modal--open';
const BODY_MODAL_OPEN_CLASS = 'body-modal-open';

function initContactModal() {
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
    if (e.key === 'Escape' && modal.classList.contains(CONTACT_MODAL_OPEN_CLASS)) {
      closeModal();
    }
  });
}

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

/**
 * Initializes play/pause and mute/unmute for a single video control block.
 * Container must contain: video, button with class "play" (with .play-icon, .pause-icon),
 * button with class "mute" (with .mute-icon, .unmute-icon). Uses .is-hidden to toggle icons.
 */
function initVideoControlsForContainer(container) {
  const video = container.querySelector('video');
  const playBtn = container.querySelector('button.play');
  const muteBtn = container.querySelector('button.mute');

  if (!video || !playBtn || !muteBtn) return;

  const playIcon = playBtn.querySelector('.play-icon');
  const pauseIcon = playBtn.querySelector('.pause-icon');
  const unmuteIcon = muteBtn.querySelector('.unmute-icon');
  const muteIcon = muteBtn.querySelector('.mute-icon');

  function updatePlayButton() {
    if (video.paused) {
      playIcon?.classList.remove('is-hidden');
      pauseIcon?.classList.add('is-hidden');
      playBtn.setAttribute('aria-label', 'Play video');
    } else {
      playIcon?.classList.add('is-hidden');
      pauseIcon?.classList.remove('is-hidden');
      playBtn.setAttribute('aria-label', 'Pause video');
    }
  }

  function updateMuteButton() {
    if (video.muted) {
      muteIcon?.classList.add('is-hidden');
      unmuteIcon?.classList.remove('is-hidden');
      muteBtn.setAttribute('aria-label', 'Unmute video');
    } else {
      muteIcon?.classList.remove('is-hidden');
      unmuteIcon?.classList.add('is-hidden');
      muteBtn.setAttribute('aria-label', 'Mute video');
    }
  }

  function initializeControls() {
    updatePlayButton();
    updateMuteButton();
  }

  if (video.readyState >= 2) {
    initializeControls();
  } else {
    video.addEventListener('loadeddata', initializeControls);
  }

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch((err) => console.error('Error playing video:', err));
    } else {
      video.pause();
    }
  });

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
  });

  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);
  video.addEventListener('volumechange', updateMuteButton);
}

/** Initializes all video control blocks: data-video-controls containers and slider items. */
function initVideoControls() {
  document.querySelectorAll('[data-video-controls]').forEach(initVideoControlsForContainer);
}

function initShopSlider() {
  const shopSlider = new Swiper('.shop__slider', {
    modules: [Navigation],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 4,
    spaceBetween: 32,
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      480: {
        slidesPerView: 2.5,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 32,
      },
    },
  });

  if (!shopSlider) return;
}

const SLIDER_VIDEO_BREAKPOINTS = {
  320: {
    slidesPerView: 1,
    loop: false,
    spaceBetween: 16,
  },
  480: {
    slidesPerView: 1.3,
    loop: true,
    centeredSlides: true,
    spaceBetween: 16,
  },
  576: {
    slidesPerView: 1.8,
    loop: true,
    centeredSlides: true,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 2.5,
    loop: true,
    centeredSlides: true,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 3.5,
    loop: true,
    centeredSlides: true,
    spaceBetween: 16,
  },
  1200: {
    slidesPerView: 3.8,
    loop: true,
    centeredSlides: true,
    spaceBetween: 20,
  },
};

function initSliderVideo() {
  document.querySelectorAll('.slider-video').forEach((section) => {
    const container = section.querySelector('.swiper_video');
    if (!container) return;

    const navNext = section.querySelector('.swiper-button-next');
    const navPrev = section.querySelector('.swiper-button-prev');

    const swiperInstance = new Swiper(container, {
      modules: [Navigation],
      navigation: {
        nextEl: navNext,
        prevEl: navPrev,
      },
      breakpoints: SLIDER_VIDEO_BREAKPOINTS,
    });

    function pauseAllVideos() {
      container.querySelectorAll('video').forEach((v) => v.pause());
    }

    function playActiveSlideVideo() {
      const activeSlide = container.querySelector('.swiper-slide-active');
      if (!activeSlide) return;
      const video = activeSlide.querySelector('video');
      if (video) {
        video.play().catch((err) => console.error('Video play failed:', err));
      }
    }

    function onSlideChange() {
      pauseAllVideos();
      playActiveSlideVideo();
    }

    container.querySelectorAll('.slider-video__item').forEach(initVideoControlsForContainer);

    swiperInstance.on('slideChangeTransitionEnd', onSlideChange);
    onSlideChange();
  });
}

function updateCurrentYear() {
  const year = new Date().getFullYear();
  const yearElement = document.querySelector('.year-current');
  if (!yearElement) return;
  yearElement.textContent = year;
}

initMobileMenu();
initContactModal();
updateCurrentYear();
initVideoControls();
initShopSlider();
initSliderVideo();
