import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { ABOUT_BRANDS_BREAKPOINT, ABOUT_SHIPPING_BREAKPOINT, SLIDER_VIDEO_BREAKPOINTS } from './constants.js';
import { loadSliderVideo, initVideoControlsForContainer } from './video.js';

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
  const sliderElement = document.querySelector('.shop__slider');
  if (!sliderElement) return;

  new Swiper(sliderElement, {
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
}

export function initSliderVideo() {
  document.querySelectorAll('.slider-video').forEach((section) => {
    const container = section.querySelector('.swiper_video');
    if (!container) return;

    const navNext = section.querySelector('.swiper-button-next');
    const navPrev = section.querySelector('.swiper-button-prev');

    // Count total slides
    const slideCount = container.querySelectorAll('.swiper-slide').length;
    
    // Create breakpoints with loopedSlides for each breakpoint where loop is enabled
    // For Swiper loop to work properly, loopedSlides must be >= slidesPerView
    // When slideCount is small (e.g., 5), we need to ensure loopedSlides is sufficient
    // Rule: loopedSlides should be at least equal to slideCount for seamless looping
    const breakpointsWithLoopedSlides = {
      320: {
        ...SLIDER_VIDEO_BREAKPOINTS[320],
        // No loopedSlides needed here as loop is false
      },
      480: {
        ...SLIDER_VIDEO_BREAKPOINTS[480],
        // For 1.3 slidesPerView with 5 slides, need at least 5 loopedSlides
        loopedSlides: Math.max(Math.ceil(SLIDER_VIDEO_BREAKPOINTS[480].slidesPerView), slideCount),
      },
      576: {
        ...SLIDER_VIDEO_BREAKPOINTS[576],
        // For 1.8 slidesPerView with 5 slides, need at least 5 loopedSlides
        loopedSlides: Math.max(Math.ceil(SLIDER_VIDEO_BREAKPOINTS[576].slidesPerView), slideCount),
      },
      768: {
        ...SLIDER_VIDEO_BREAKPOINTS[768],
        // For 2.5 slidesPerView with 5 slides, need at least 5 loopedSlides
        loopedSlides: Math.max(Math.ceil(SLIDER_VIDEO_BREAKPOINTS[768].slidesPerView), slideCount),
      },
      1024: {
        ...SLIDER_VIDEO_BREAKPOINTS[1024],
        // For 3.5 slidesPerView with 5 slides, need at least 5 loopedSlides (all slides)
        loopedSlides: Math.max(Math.ceil(SLIDER_VIDEO_BREAKPOINTS[1024].slidesPerView), slideCount),
      },
      1200: {
        ...SLIDER_VIDEO_BREAKPOINTS[1200],
        // For 3.8 slidesPerView with 5 slides, need at least 5 loopedSlides (all slides)
        loopedSlides: Math.max(Math.ceil(SLIDER_VIDEO_BREAKPOINTS[1200].slidesPerView), slideCount),
      },
      1441: {
        ...SLIDER_VIDEO_BREAKPOINTS[1441],
        // For 3.8 slidesPerView with 5 slides, need at least 5 loopedSlides (all slides)
        loopedSlides: Math.max(Math.ceil(SLIDER_VIDEO_BREAKPOINTS[1441].slidesPerView), slideCount),
      },
    };

    const swiperInstance = new Swiper(container, {
      modules: [Navigation],
      loop: true,
      loopedSlides: slideCount, // Default value
      navigation: {
        nextEl: navNext,
        prevEl: navPrev,
      },
      breakpoints: breakpointsWithLoopedSlides,
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

    // Initialize video controls for each slide item
    container.querySelectorAll('.slider-video__item').forEach((item) => {
      initVideoControlsForContainer(item);
    });
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
