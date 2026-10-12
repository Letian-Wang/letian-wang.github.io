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

  function maxScroll() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  /* The track reserves room for the arrows with horizontal padding, and
     `scroll-padding` keeps scroll-snap settling on that same inset, so the
     scroll offset that brings a slide to the start of the visible track is its
     offset inside the track minus that inset. */
  function startInset() {
    const style = getComputedStyle(track);
    const scrollPad = parseFloat(style.scrollPaddingLeft); /* NaN when `auto` */
    if (!isNaN(scrollPad)) return scrollPad;
    const pad = parseFloat(style.paddingLeft);
    return isNaN(pad) ? 0 : pad;
  }

  /* Slides are sized by their own aspect ratio now, so every step is a
     different width and "one slide width" measured off the first slide would
     be wrong for all the others. Read the boundaries off the layout instead:
     the track is positioned, so it is the slides' offsetParent and
     `offsetLeft` is each slide's own position within it. */
  function slideStarts() {
    const inset = startInset();
    const starts = [];
    track.querySelectorAll('.slide').forEach(function (slide) {
      starts.push(Math.max(0, slide.offsetLeft - inset));
    });
    return starts.sort(function (a, b) { return a - b; });
  }

  /* Scroll to the next (or previous) slide boundary. The 1px slack absorbs the
     fractional scroll offsets a snapped track can come to rest on. */
  function scrollBySlides(direction) {
    const starts = slideStarts();
    const limit = maxScroll();
    const here = track.scrollLeft;
    let target;

    if ((direction || 1) > 0) {
      target = starts.find(function (x) { return x > here + 1; });
      if (target === undefined) target = limit;
    } else {
      const before = starts.filter(function (x) { return x < here - 1; });
      target = before.length ? before[before.length - 1] : 0;
    }

    track.scrollTo({ left: Math.max(0, Math.min(limit, target)), behavior: 'smooth' });
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
