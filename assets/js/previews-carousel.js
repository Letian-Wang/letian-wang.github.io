/* Highlights section: horizontally sliding carousel of preview demos. */
(function () {
  const track = document.getElementById('previewsTrack');
  const carousel = track ? track.closest('.previews-carousel') : null;
  const prevBtn = carousel ? carousel.querySelector('.carousel-btn.prev') : null;
  const nextBtn = carousel ? carousel.querySelector('.carousel-btn.next') : null;

  /* Nothing to drive (e.g. the markup is absent on this page) - stay quiet. */
  if (!track || !prevBtn || !nextBtn) return;

  function getGapPx() {
    const gap = getComputedStyle(track).gap || '0px';
    const px = parseFloat(gap);
    return isNaN(px) ? 0 : px;
  }

  function getSlideWidth() {
    const firstSlide = track.querySelector('.slide');
    if (!firstSlide) return 0;
    const rect = firstSlide.getBoundingClientRect();
    return rect.width + getGapPx();
  }

  function scrollBySlides(direction) {
    const dx = getSlideWidth() * (direction || 1);
    track.scrollBy({ left: dx, behavior: 'smooth' });
  }

  /* The furthest scroll positions actually reachable. Mandatory centre
     snapping stops short of the raw scroll extent, so the first and last
     slides' snap targets are taken into account too. */
  function reachable() {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const slides = track.querySelectorAll('.slide');
    if (!slides.length) return { min: 0, max: maxScroll };
    const trackLeft = track.getBoundingClientRect().left;
    const snapTarget = function (el) {
      const rect = el.getBoundingClientRect();
      const offset = rect.left - trackLeft + track.scrollLeft;
      return offset + rect.width / 2 - track.clientWidth / 2;
    };
    const clamp = function (v) { return Math.max(0, Math.min(maxScroll, v)); };
    return {
      min: clamp(snapTarget(slides[0])),
      max: clamp(snapTarget(slides[slides.length - 1])),
    };
  }

  /* Disable (and so hide) an arrow when the track cannot scroll that way,
     including the case where the slides are not wide enough to scroll at all. */
  function updateButtons() {
    const limits = reachable();
    const scrollable = limits.max - limits.min > 1;
    prevBtn.disabled = !scrollable || track.scrollLeft <= limits.min + 1;
    nextBtn.disabled = !scrollable || track.scrollLeft >= limits.max - 1;
  }

  prevBtn.addEventListener('click', function () { scrollBySlides(-1); });
  nextBtn.addEventListener('click', function () { scrollBySlides(1); });

  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') scrollBySlides(-1);
    if (e.key === 'ArrowRight') scrollBySlides(1);
  });

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  window.addEventListener('load', updateButtons);
  updateButtons();
})();
