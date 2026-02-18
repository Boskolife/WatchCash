/**
 * Initializes play/pause and mute/unmute for a single video control block.
 * Container must contain: video, button with class "play" (with .play-icon, .pause-icon),
 * button with class "mute" (with .mute-icon, .unmute-icon). Uses .is-hidden to toggle icons.
 */
export function initVideoControlsForContainer(container) {
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
export function initVideoControls() {
  document
    .querySelectorAll('[data-video-controls]')
    .forEach(initVideoControlsForContainer);
}

export function removeVideoControls() {
  document.querySelectorAll('video').forEach((video) => {
    video.removeAttribute('controls');
    video.controls = false;
  });
}

export function loadSliderVideo(video) {
  if (video && video.getAttribute('preload') === 'none') {
    video.setAttribute('preload', 'auto');
    video.load();
  }
}

/**
 * Selects appropriate video source based on screen width
 * Looks for sources with "-mob." or "mobile" in filename for mobile versions
 */
export function initResponsiveVideoSources() {
  const videos = document.querySelectorAll('video');
  if (!videos.length) return;

  function selectVideoSource(video) {
    const sources = video.querySelectorAll('source');
    if (sources.length < 2) return; // Need at least 2 sources for responsive behavior

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const mobileSource = Array.from(sources).find(
      (source) => source.src.includes('-mob.') || source.src.includes('mobile'),
    );
    const desktopSource = Array.from(sources).find(
      (source) => !source.src.includes('-mob.') && !source.src.includes('mobile'),
    );

    if (isMobile && mobileSource) {
      // Remove all sources and add mobile source first
      sources.forEach((source) => source.remove());
      video.appendChild(mobileSource);
      if (desktopSource) video.appendChild(desktopSource);
    } else if (!isMobile && desktopSource) {
      // Remove all sources and add desktop source first
      sources.forEach((source) => source.remove());
      video.appendChild(desktopSource);
      if (mobileSource) video.appendChild(mobileSource);
    }

    // Reload video to use new source
    video.load();
  }

  // Initialize on page load
  videos.forEach(selectVideoSource);

  // Update on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      videos.forEach(selectVideoSource);
    }, 250);
  });
}

export function initVideoLazyLoading() {
  const videos = document.querySelectorAll('video');
  if (!videos.length) return;

  // Set preload="none" for videos without autoplay to prevent immediate loading
  videos.forEach((video) => {
    const hasAutoplay = video.hasAttribute('autoplay');
    const hasPreload = video.hasAttribute('preload');

    // Only set preload="none" if video doesn't have autoplay and preload is not already set
    if (!hasAutoplay && !hasPreload) {
      video.setAttribute('preload', 'none');
    }
  });

  // Use Intersection Observer for videos outside sliders
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target;
        // Load video when it enters viewport
        if (video.getAttribute('preload') === 'none') {
          video.setAttribute('preload', 'auto');
          video.load();
        }
        videoObserver.unobserve(video);
      }
    });
  }, observerOptions);

  // Observe videos that are not in sliders and don't have autoplay
  videos.forEach((video) => {
    const isInSlider =
      video.closest('.swiper-slide') || video.closest('.slider-video');
    const hasAutoplay = video.hasAttribute('autoplay');

    // Only observe videos outside sliders and without autoplay
    if (!isInSlider && !hasAutoplay) {
      videoObserver.observe(video);
    }
  });
}
