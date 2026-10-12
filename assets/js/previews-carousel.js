/* Highlights section: horizontally sliding carousel of preview demos.

   The arrows are shown by default and the script only ever takes them away
   when it has measured the track and found that it truly cannot scroll. Every
   event that can change the layout - initial paint, video metadata arriving,
   the Isotope grid re-laying the item out, scrolling, resizing - re-runs the
   measurement, so a measurement taken too early can never leave the carousel
   stuck without arrows. */
(function () {
  const track = document.getElementById('previewsTrack');
  const carousel = track ? track.closest('.previews-carousel') : null;
  const prevBtn = carousel ? carousel.querySelector('.carousel-btn.prev') : null;
  const nextBtn = carousel ? carousel.querySelector('.carousel-btn.next') : null;

  /* Nothing to drive (e.g. the markup is absent on this page) - stay quiet. */
  if (!track || !carousel || !prevBtn || !nextBtn) return;

  const GAP_FALLBACK = 10;

  function getGapPx() {
    const gap = getComputedStyle(track).gap || '';
    const px = parseFloat(gap);
    return isNaN(px) ? GAP_FALLBACK : px;
  }

  function getSlideWidth() {
    const firstSlide = track.querySelector('.slide');
    if (!firstSlide) return track.clientWidth;
    const width = firstSlide.getBoundingClientRect().width + getGapPx();
    /* Before layout settles a slide can measure 0; stepping by the viewport
       width is a sane stand-in and still moves the track. */
    return width > 1 ? width : track.clientWidth;
  }

  function maxScroll() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function scrollBySlides(direction) {
    const dx = getSlideWidth() * (direction || 1);
    const target = Math.max(0, Math.min(maxScroll(), track.scrollLeft + dx));
    track.scrollTo({ left: target, behavior: 'smooth' });
  }

  function markEnd(btn, atEnd) {
    btn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
  }

  /* Decide whether the track can scroll and which end it sits at. The arrows
     are hidden only when the track has been laid out (clientWidth > 0) and
     still has no overflow - an unmeasured or in-flight layout shows them. */
  function updateButtons() {
    const laidOut = track.clientWidth > 0;
    const overflow = track.scrollWidth - track.clientWidth;
    const scrollable = !laidOut || overflow > 1;

    carousel.classList.toggle('is-static', !scrollable);

    if (!scrollable) {
      markEnd(prevBtn, true);
      markEnd(nextBtn, true);
      return;
    }

    const limit = maxScroll();
    markEnd(prevBtn, track.scrollLeft <= 1);
    markEnd(nextBtn, track.scrollLeft >= limit - 1);
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
  document.addEventListener('DOMContentLoaded', updateButtons);

  /* Media reports its real size late, and Isotope relays the grid item after
     this script first runs; both change what the track can scroll. */
  track.querySelectorAll('video, img').forEach(function (media) {
    ['loadedmetadata', 'loadeddata', 'load', 'error'].forEach(function (type) {
      media.addEventListener(type, updateButtons);
    });
  });

  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(updateButtons);
    observer.observe(track);
    observer.observe(carousel);
  }

  /* A few spaced re-checks catch any relayout that fires no event we listen
     for (web fonts, a late Isotope pass). Cheap, and strictly a safety net. */
  [0, 100, 400, 1200, 3000].forEach(function (delay) {
    setTimeout(updateButtons, delay);
  });
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(updateButtons);

  updateButtons();
})();
