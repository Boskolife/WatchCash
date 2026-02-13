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

function initVideoControls() {
  const videoContainer = document.querySelector('.who__video');
  if (!videoContainer) return;

  const video = videoContainer.querySelector('video');
  const playBtn = videoContainer.querySelector('.who__btn.play');
  const muteBtn = videoContainer.querySelector('.who__btn.mute');

  if (!video || !playBtn || !muteBtn) return;

  const playIcon = playBtn.querySelector('.play-icon');
  const pauseIcon = playBtn.querySelector('.pause-icon');
  const unmuteIcon = muteBtn.querySelector('.unmute-icon');
  const muteIcon = muteBtn.querySelector('.mute-icon');

  // Update play/pause button state
  function updatePlayButton() {
    if (video.paused) {
      // Video is paused - show play icon
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      playBtn.setAttribute('aria-label', 'Play video');
    } else {
      // Video is playing - show pause icon
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      playBtn.setAttribute('aria-label', 'Pause video');
    }
  }

  // Update mute button state
  function updateMuteButton() {
    if (video.muted) {
      // Video is muted - show unmute icon (to enable sound)
      if (muteIcon) muteIcon.style.display = 'none';
      if (unmuteIcon) unmuteIcon.style.display = 'block';
      muteBtn.setAttribute('aria-label', 'Unmute video');
    } else {
      // Video is unmuted - show mute icon (to disable sound)
      if (muteIcon) muteIcon.style.display = 'block';
      if (unmuteIcon) unmuteIcon.style.display = 'none';
      muteBtn.setAttribute('aria-label', 'Mute video');
    }
  }

  // Initialize button states after video is loaded
  function initializeControls() {
    updatePlayButton();
    updateMuteButton();
  }

  // Wait for video to be ready
  if (video.readyState >= 2) {
    // Video is already loaded
    initializeControls();
  } else {
    // Wait for video to load
    video.addEventListener('loadeddata', initializeControls);
  }

  // Play/Pause toggle
  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    } else {
      video.pause();
    }
  });

  // Mute/Unmute toggle
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
  });

  // Update buttons when video state changes
  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);
  video.addEventListener('volumechange', updateMuteButton);
}

initVideoControls();
