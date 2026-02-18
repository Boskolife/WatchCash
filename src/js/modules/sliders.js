import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { ABOUT_BRANDS_BREAKPOINT, ABOUT_SHIPPING_BREAKPOINT, SLIDER_VIDEO_BREAKPOINTS } from './constants.js';
import { loadSliderVideo } from './video.js';

export function initAboutBrandsSlider() {
  const el = document.querySelector('.about-brands__slider');
  if (!el) return;

  let swiperInstance = null;
  const mediaQuery = window.matchMedia(
    `(min-width: ${ABOUT_BRANDS_BREAKPOINT}px)`,
  );

  function initSwiper() {
    if (swiperInstance) return;

    const slideCount = el.querySelectorAll('.swiper-slide').length;
    swiperInstance = new Swiper(el, {
      modules: [Autoplay],
      loop: true,
      loopedSlides: slideCount,
      slidesPerView: 'auto',
      spaceBetween: 40,
      speed: 1000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      allowTouchMove: false,
    });
  }

  function destroySwiper() {
    if (!swiperInstance) return;
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  function handleBreakpointChange() {
    if (mediaQuery.matches) {
      initSwiper();
    } else {
      destroySwiper();
    }
  }

  mediaQuery.addEventListener('change', handleBreakpointChange);
  handleBreakpointChange();
}

export function initShopSlider() {
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

export function initSliderVideo() {
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

    function loadSlideVideos(activeIndex) {
      const slides = container.querySelectorAll('.swiper-slide');
      slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        // Load video for active slide and adjacent slides (prev and next)
        if (
          video &&
          (index === activeIndex ||
            index === activeIndex - 1 ||
            index === activeIndex + 1)
        ) {
          loadSliderVideo(video);
        }
      });
    }

    function playActiveSlideVideo() {
      const activeSlide = container.querySelector('.swiper-slide-active');
      if (!activeSlide) return;
      const video = activeSlide.querySelector('video');
      if (video) {
        loadSliderVideo(video);
        video.play().catch((err) => console.error('Video play failed:', err));
      }
    }

    function onSlideChange() {
      pauseAllVideos();
      const activeIndex = swiperInstance.activeIndex;
      loadSlideVideos(activeIndex);
      playActiveSlideVideo();
    }

    swiperInstance.on('slideChangeTransitionEnd', onSlideChange);
    // Load initial active slide video
    const initialIndex = swiperInstance.activeIndex;
    loadSlideVideos(initialIndex);
    onSlideChange();
  });
}

export function initAboutShippingSlider() {
  const els = document.querySelectorAll('.about-shipping__slider');
  if (!els.length) return;

  const swiperInstances = new Map();
  const mediaQuery = window.matchMedia(
    `(min-width: ${ABOUT_SHIPPING_BREAKPOINT}px)`,
  );

  function initSwiper(el) {
    if (swiperInstances.has(el)) return;
    const swiperInstance = new Swiper(el, {
      slidesPerView: 2.3,
      spaceBetween: 30,
    });
    swiperInstances.set(el, swiperInstance);
  }

  function destroySwiper(el) {
    const swiperInstance = swiperInstances.get(el);
    if (!swiperInstance) return;
    swiperInstance.destroy(true, true);
    swiperInstances.delete(el);
  }

  function handleBreakpointChange() {
    els.forEach((el) => {
      if (mediaQuery.matches) {
        initSwiper(el);
      } else {
        destroySwiper(el);
      }
    });
  }

  mediaQuery.addEventListener('change', handleBreakpointChange);
  handleBreakpointChange();
}
