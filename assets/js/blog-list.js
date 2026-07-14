/*
 * blog-list.js - renders the Blog landing page: fetches
 * content/blog/manifest.json (auto-generated, see scripts/build-blog.mjs)
 * and renders searchable, tag-filterable post cards.
 */
(function () {
  var MANIFEST_URL = 'content/blog/manifest.json';
  var state = { posts: [], query: '', tag: 'all' };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function cardHtml(post) {
    var tags = (post.tags || []).map(function (t) {
      return '<span class="tag">' + escapeHtml(t) + '</span>';
    }).join('');

    return (
      '<article class="blog-card">' +
        '<h2 class="blog-card-title">' +
          '<a href="blog/' + encodeURIComponent(post.slug) + '.html">' + escapeHtml(post.title) + '</a>' +
          (post.featured ? '<span class="badge-featured">Featured</span>' : '') +
        '</h2>' +
        '<div class="blog-card-meta">' +
          '<span>' + formatDate(post.date) + '</span>' +
          '<span class="sep">&middot;</span>' +
          '<span>' + post.readingTime + ' min read</span>' +
        '</div>' +
        '<p class="blog-card-summary">' + escapeHtml(post.summary || '') + '</p>' +
        (tags ? '<div class="blog-card-tags">' + tags + '</div>' : '') +
      '</article>'
    );
  }

  function render() {
    var list = document.getElementById('blog-list');
    if (!list) return;

    var q = state.query.trim().toLowerCase();
    var filtered = state.posts.filter(function (post) {
      var matchesTag = state.tag === 'all' || (post.tags || []).indexOf(state.tag) !== -1;
      if (!matchesTag) return false;
      if (!q) return true;
      var haystack = (post.title + ' ' + post.summary + ' ' + (post.tags || []).join(' ')).toLowerCase();
      return haystack.indexOf(q) !== -1;
    });

    filtered.sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    if (filtered.length === 0) {
      list.innerHTML = '<p class="empty-state">No posts match your search.</p>';
      return;
    }

    list.innerHTML = filtered.map(cardHtml).join('');
  }

  function renderTagFilters() {
    var row = document.getElementById('tag-filter-row');
    if (!row) return;

    var tagSet = {};
    state.posts.forEach(function (post) {
      (post.tags || []).forEach(function (t) { tagSet[t] = true; });
    });
    var tags = Object.keys(tagSet).sort();

    var allBtn = '<span class="tag is-active" data-tag="all">All</span>';
    var rest = tags.map(function (t) {
      return '<span class="tag" data-tag="' + escapeHtml(t) + '">' + escapeHtml(t) + '</span>';
    }).join('');
    row.innerHTML = allBtn + rest;

    row.addEventListener('click', function (e) {
      var el = e.target.closest('[data-tag]');
      if (!el) return;
      state.tag = el.getAttribute('data-tag');
      row.querySelectorAll('.tag').forEach(function (t) { t.classList.remove('is-active'); });
      el.classList.add('is-active');
      render();
    });
  }

  function init() {
    fetch(MANIFEST_URL)
      .then(function (res) { return res.json(); })
      .then(function (posts) {
        state.posts = posts;
        renderTagFilters();
        render();
      })
      .catch(function (err) {
        var list = document.getElementById('blog-list');
        if (list) list.innerHTML = '<p class="empty-state">Could not load posts.</p>';
        console.error('Failed to load blog manifest', err);
      });

    var search = document.getElementById('blog-search');
    if (search) {
      search.addEventListener('input', function () {
        state.query = search.value;
        render();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
