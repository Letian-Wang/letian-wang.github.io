/*
 * nav.js - shared site header behavior: dark mode toggle + active link
 * highlighting. Included on every page (home, blog list, blog posts).
 *
 * Dark mode preference is applied to <html class="dark"> as early as
 * possible (synchronously, before first paint) to avoid a flash of the
 * wrong theme. Put this script tag in <head> without defer/async.
 */
(function () {
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (stored === 'dark' || (!stored && prefersDark)) {
    root.classList.add('dark');
  }

  function wireUp() {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        root.classList.toggle('dark');
        try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
      });
    }

    var page = document.body.getAttribute('data-page');
    if (page) {
      var link = document.querySelector('.nav-link[data-nav="' + page + '"]');
      if (link) link.classList.add('active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireUp);
  } else {
    wireUp();
  }
})();
