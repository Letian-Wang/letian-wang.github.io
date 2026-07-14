import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const BLOG_OUT_DIR = path.join(ROOT, 'blog');
const SITE_URL = 'https://letian-wang.github.io';
const SITE_TITLE = 'Letian Wang';
const BS = String.fromCharCode(92);

function stripQuotes(s) {
  if ((s.charAt(0) === '"' && s.charAt(s.length - 1) === '"') || (s.charAt(0) === "'" && s.charAt(s.length - 1) === "'")) {
    return s.slice(1, -1);
  }
  return s;
}

function parseFrontMatter(raw) {
  const srcLines = raw.split('\n');
  if (srcLines[0] === undefined || srcLines[0].trim() !== '---') {
    return { data: {}, body: raw.trim() };
  }
  let i = 1;
  const dataLines = [];
  while (i < srcLines.length && srcLines[i].trim() !== '---') {
    dataLines.push(srcLines[i]);
    i++;
  }
  const body = srcLines.slice(i + 1).join('\n').trim();
  const data = {};
  dataLines.forEach(function (line) {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') {
      value = value.slice(1, -1).split(',').map(function (s) {
        return stripQuotes(s.trim());
      }).filter(Boolean);
    } else if (value === 'true' || value === 'false') {
      value = (value === 'true');
    } else {
      value = stripQuotes(value);
    }
    data[key] = value;
  });
  return { data: data, body: body };
}

function readingTimeFor(body) {
  const words = body.split('\n').join(' ').split(' ').filter(function (w) { return w.length > 0; });
  return Math.max(1, Math.round(words.length / 200));
}

function escapeHtml(str) {
  return String(str)
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;');
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDateHuman(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
}

function formatDateRFC822(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toUTCString();
}

function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter(function (f) {
    return f.slice(-3) === '.md' && f.toUpperCase() !== 'TEMPLATE.MD';
  });
  return files.map(function (file) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const parsed = parseFrontMatter(raw);
    const data = parsed.data;
    const slug = file.slice(0, -3);
    let tags = data.tags;
    if (typeof tags === 'string') tags = tags ? [tags] : [];
    if (!Array.isArray(tags)) tags = [];
    return {
      slug: slug,
      title: data.title || slug,
      date: data.date || '1970-01-01',
      summary: data.summary || '',
      tags: tags,
      featured: data.featured === true,
      author: data.author || SITE_TITLE,
      readingTime: readingTimeFor(parsed.body),
      body: parsed.body
    };
  });
}

function postPageHtml(post, prev, next) {
  const tagsHtml = post.tags.map(function (t) {
    return '<span class="tag">' + escapeHtml(t) + '</span>';
  }).join(' ');

  const prevHtml = prev ? (
    '<a class="post-nav-link post-nav-prev" href="' + prev.slug + '.html">' +
    '<span class="post-nav-label">Previous</span>' +
    '<span class="post-nav-title">' + escapeHtml(prev.title) + '</span>' +
    '</a>'
  ) : '<span></span>';

  const nextHtml = next ? (
    '<a class="post-nav-link post-nav-next" href="' + next.slug + '.html">' +
    '<span class="post-nav-label">Next</span>' +
    '<span class="post-nav-title">' + escapeHtml(next.title) + '</span>' +
    '</a>'
  ) : '<span></span>';

  const metaObj = {
    slug: post.slug,
    title: post.title,
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null
  };
  const metaJson = JSON.stringify(metaObj).split('</script').join('<' + BS + '/script');
  const rawMd = post.body.split('</script').join('<' + BS + '/script');

  const out = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + escapeHtml(post.title) + ' &middot; ' + SITE_TITLE + '</title>',
    '<meta name="description" content="' + escapeHtml(post.summary) + '">',
    '<link rel="canonical" href="' + SITE_URL + '/blog/' + post.slug + '.html">',
    '<meta property="og:type" content="article">',
    '<meta property="og:title" content="' + escapeHtml(post.title) + '">',
    '<meta property="og:description" content="' + escapeHtml(post.summary) + '">',
    '<meta property="og:url" content="' + SITE_URL + '/blog/' + post.slug + '.html">',
    '<meta property="og:site_name" content="' + SITE_TITLE + '">',
    '<meta property="article:published_time" content="' + post.date + '">',
    '<meta name="twitter:card" content="summary">',
    '<meta name="twitter:title" content="' + escapeHtml(post.title) + '">',
    '<meta name="twitter:description" content="' + escapeHtml(post.summary) + '">',
    '<link rel="icon" href="../images/ut_logo.jpg">',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link href="https://fonts.googleapis.com/css2?family=Asap:wght@400;500;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">',
    '<link rel="stylesheet" id="hljs-theme" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css">',
    '<link rel="stylesheet" href="../assets/css/theme.css">',
    '<link rel="stylesheet" href="../style.css">',
    '<link rel="stylesheet" href="../assets/css/blog.css">',
    '<script src="../assets/js/nav.js"><' + '/script>',
    '</head>',
    '<body data-page="blog">',
    '<div id="reading-progress"></div>',
    '<header class="site-nav">',
    '<div class="site-nav-inner">',
    '<a class="site-brand" href="../index.html">' + SITE_TITLE + '</a>',
    '<nav class="site-nav-links">',
    '<a class="nav-link" data-nav="home" href="../index.html">Home</a>',
    '<a class="nav-link" data-nav="blog" href="../blog.html">Blog</a>',
    '</nav>',
    '<div class="nav-right">',
    '<button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">',
    '<span class="theme-icon-sun">&#9728;</span>',
    '<span class="theme-icon-moon">&#9789;</span>',
    '</button>',
    '</div>',
    '</div>',
    '</header>',
    '<main class="post-shell">',
    '<header class="post-header">',
    '<h1 class="post-title">' + escapeHtml(post.title) + '</h1>',
    '<div class="post-meta">',
    '<span class="post-meta-author">' + escapeHtml(post.author) + '</span>',
    '<span class="post-meta-sep">&middot;</span>',
    '<span class="post-meta-date">' + formatDateHuman(post.date) + '</span>',
    '<span class="post-meta-sep">&middot;</span>',
    '<span class="post-meta-reading">' + post.readingTime + ' min read</span>',
    '</div>',
    (tagsHtml ? '<div class="post-meta-tags">' + tagsHtml + '</div>' : ''),
    '</header>',
    '<div class="post-layout">',
    '<nav class="post-toc" id="post-toc">',
    '<div class="post-toc-label">Contents</div>',
    '<ol id="post-toc-list"></ol>',
    '</nav>',
    '<article class="post-content" id="post-content"></article>',
    '</div>',
    '<div class="post-actions">',
    '<button id="copy-link-btn" class="post-action-btn">Copy link</button>',
    '<a id="share-x-btn" class="post-action-btn" target="_blank" rel="noopener">Share on X</a>',
    '<a id="share-linkedin-btn" class="post-action-btn" target="_blank" rel="noopener">Share on LinkedIn</a>',
    '</div>',
    '<nav class="post-nav">',
    prevHtml,
    nextHtml,
    '</nav>',
    '</main>',
    '<script type="text/markdown" id="raw-markdown">',
    rawMd,
    '<' + '/script>',
    '<script type="application/json" id="post-meta">',
    metaJson,
    '<' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/core.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/python.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/javascript.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/bash.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/json.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/yaml.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><' + '/script>',
    '<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"><' + '/script>',
    '<script src="../assets/js/blog-post.js"><' + '/script>',
    '</body>',
    '</html>'
  ];
  return out.join('\n');
}

function buildRss(posts) {
  const items = posts.map(function (p) {
    return [
      '<item>',
      '<title>' + escapeHtml(p.title) + '</title>',
      '<link>' + SITE_URL + '/blog/' + p.slug + '.html</link>',
      '<guid>' + SITE_URL + '/blog/' + p.slug + '.html</guid>',
      '<pubDate>' + formatDateRFC822(p.date) + '</pubDate>',
      '<description>' + escapeHtml(p.summary) + '</description>',
      '</item>'
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    '<title>' + SITE_TITLE + ' &mdash; Blog</title>',
    '<link>' + SITE_URL + '/blog.html</link>',
    '<description>Research notes and essays by ' + SITE_TITLE + '</description>',
    '<language>en-us</language>',
    '<lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>',
    items,
    '</channel>',
    '</rss>'
  ].join('\n');
}

function buildSitemap(posts) {
  const base = [SITE_URL + '/', SITE_URL + '/blog.html'];
  const postUrls = posts.map(function (p) { return SITE_URL + '/blog/' + p.slug + '.html'; });
  const all = base.concat(postUrls);
  const entries = all.map(function (u) {
    return '<url><loc>' + u + '</loc></url>';
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>'
  ].join('\n');
}

function main() {
  const posts = loadPosts();
  const chronological = posts.slice().sort(function (a, b) {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });
  const byDateDesc = posts.slice().sort(function (a, b) {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  if (!fs.existsSync(BLOG_OUT_DIR)) fs.mkdirSync(BLOG_OUT_DIR, { recursive: true });

  chronological.forEach(function (post, i) {
    const prev = i > 0 ? chronological[i - 1] : null;
    const next = i < chronological.length - 1 ? chronological[i + 1] : null;
    const html = postPageHtml(post, prev, next);
    fs.writeFileSync(path.join(BLOG_OUT_DIR, post.slug + '.html'), html, 'utf8');
  });

  const manifest = byDateDesc.map(function (p) {
    return {
      slug: p.slug,
      title: p.title,
      date: p.date,
      summary: p.summary,
      tags: p.tags,
      featured: p.featured,
      readingTime: p.readingTime,
      author: p.author
    };
  });

  fs.writeFileSync(path.join(CONTENT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'rss.xml'), buildRss(byDateDesc), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(byDateDesc), 'utf8');

  console.log('Built ' + posts.length + ' post(s).');
}

main();
