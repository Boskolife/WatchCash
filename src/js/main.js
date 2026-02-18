// Swiper imports
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// intl-tel-input imports
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

// Modules
import { initContactModal, initMobileMenu } from './modules/modals.js';
import {
  initVideoControls,
  initVideoLazyLoading,
  removeVideoControls,
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
} from './modules/forms.js';
import { updateCurrentYear } from './modules/utils.js';

// Initialize all modules
initMobileMenu();
initContactModal();
updateCurrentYear();
removeVideoControls();
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
