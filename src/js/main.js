// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// intl-tel-input styles
import 'intl-tel-input/build/css/intlTelInput.css';

// Modules
import { initContactModal, initMobileMenu } from './modules/modals.js';
import {
  initVideoControls,
  initVideoLazyLoading,
  removeVideoControls,
  initResponsiveVideoSources,
} from './modules/video.js';
import {
  initAboutBrandsSlider,
  initShopSlider,
  initSliderVideo,
  initAboutShippingSlider,
} from './modules/sliders.js';
import {
  initSellFormDragDrop,
  initSellFormPhone,
  initCustomSelect,
  initSellFormSubmit,
  initSellFormProgressiveReveal,
  initYearProductionFormSteps,
} from './modules/forms.js';
import { updateCurrentYear, initViewportActiveSections } from './modules/utils.js';
import { initFaqAccordion } from './modules/faq.js';

// Initialize all modules
initMobileMenu();
initContactModal();
updateCurrentYear();
removeVideoControls();
initResponsiveVideoSources();
initVideoLazyLoading();
initVideoControls();
initAboutBrandsSlider();
initShopSlider();
initSliderVideo();
initAboutShippingSlider();
initSellFormDragDrop();
initSellFormPhone();
initCustomSelect();
initSellFormSubmit();
initSellFormProgressiveReveal();
initYearProductionFormSteps();
initFaqAccordion();
initViewportActiveSections();