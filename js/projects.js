/* ============================================================
   projects.js — Project rendering, carousel, detail modal
   ============================================================
   All data lives in data.json (loaded by main.js into
   window._siteData before initProjects() is called).

   To add / edit a project: open data.json → "projects" array.
   ============================================================ */

var GITHUB_USER     = 'Bedo-Mostafa'; /* fallback if data.json missing */
var STATIC_PROJECTS = [];             /* filled from data.json          */


/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */
function tagColorClass(color) {
  var map = { cyan: 'tag-cyan', orange: 'tag-orange', green: 'tag-green', purple: 'tag-purple' };
  return map[color] || 'tag-cyan';
}

/* ─────────────────────────────────────────────────────────────
   CARD RENDER  (compact — click opens the modal)
   ───────────────────────────────────────────────────────────── */
function renderCard(proj) {
  var tagsHtml = proj.tags.slice(0, 3).map(function (t, i) {
    return '<span class="tag ' + tagColorClass((proj.tagColors || [])[i] || 'cyan') + '">' + t + '</span>';
  }).join('');

  var media = proj.media || [];
  var thumbHtml;
  if (media.length > 0) {
    if (media[0].type === 'youtube') {
      thumbHtml = '<div class="card-thumb card-thumb-yt">'
        + '<img src="https://img.youtube.com/vi/' + media[0].id + '/mqdefault.jpg" alt="" loading="lazy">'
        + '<div class="card-thumb-play"><i class="fa-solid fa-play"></i></div>'
        + '</div>';
    } else {
      thumbHtml = '<div class="card-thumb"><img src="' + media[0].src + '" alt="" loading="lazy"></div>';
    }
  } else if (proj.id === 'byte-dodger') {
    // Special animated placeholder for the playable game card
    thumbHtml = '<div class="card-thumb card-thumb-placeholder card-thumb-game">'
      + '<i class="fa-solid fa-rocket"></i>'
      + '<span class="card-thumb-game-label">PLAYABLE DEMO</span>'
      + '</div>';
  } else {
    thumbHtml = '<div class="card-thumb card-thumb-placeholder"><i class="' + proj.icon + '"></i></div>';
  }

  return '<article class="proj-card reveal" data-category="' + proj.category
    + '" data-id="' + proj.id + '" role="button" tabindex="0">'
    + thumbHtml
    + '<div class="card-body">'
    + '<div class="card-title">' + proj.title + '</div>'
    + '<div class="card-short-desc">' + (proj.shortDesc || proj.desc || '') + '</div>'
    + '<div class="card-footer">'
    + '<div class="proj-tags">' + tagsHtml + '</div>'
    + '<span class="card-view-more">View details <i class="fa-solid fa-arrow-right"></i></span>'
    + '</div>'
    + '</div>'
    + '</article>';
}

/* ─────────────────────────────────────────────────────────────
   PROJECT DETAIL MODAL
   ───────────────────────────────────────────────────────────── */
function ensureModal() {
  if (document.getElementById('proj-modal')) return;
  var modal = document.createElement('div');
  modal.id = 'proj-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div class="pm-backdrop"></div>'
    + '<div class="pm-panel">'
    + '<button class="pm-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>'
    + '<div class="pm-scroll">'
    + '<div class="pm-media-hero" id="pm-media-hero"></div>'
    + '<div class="pm-content">'
    + '<div class="pm-header">'
    + '<div class="pm-icon" id="pm-icon"></div>'
    + '<div class="pm-header-text">'
    + '<h2 class="pm-title" id="pm-title"></h2>'
    + '<div class="pm-tags" id="pm-tags"></div>'
    + '</div>'
    + '</div>'
    + '<div class="pm-links" id="pm-links"></div>'
    + '<div class="pm-section-label"><i class="fa-solid fa-align-left"></i> Overview</div>'
    + '<div class="pm-desc" id="pm-desc"></div>'
    + '<div class="pm-tools-wrap" id="pm-tools-wrap">'
    + '<div class="pm-section-label"><i class="fa-solid fa-wrench"></i> Tools &amp; Technologies</div>'
    + '<div class="pm-tools" id="pm-tools"></div>'
    + '</div>'
    + '<div class="pm-gallery-wrap" id="pm-gallery-wrap">'
    + '<div class="pm-section-label"><i class="fa-solid fa-images"></i> Media &amp; Screenshots</div>'
    + '<div class="pm-gallery" id="pm-gallery"></div>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';
  document.body.appendChild(modal);
  modal.querySelector('.pm-backdrop').addEventListener('click', closeProjectModal);
  modal.querySelector('.pm-close').addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeProjectModal();
  });
}

function openProjectModal(proj) {
  ensureModal();
  var modal = document.getElementById('proj-modal');

  document.getElementById('pm-icon').innerHTML = '<i class="' + proj.icon + '"></i>';
  document.getElementById('pm-title').textContent = proj.title;

  document.getElementById('pm-tags').innerHTML = proj.tags.map(function (t, i) {
    return '<span class="tag ' + tagColorClass((proj.tagColors || [])[i] || 'cyan') + '">' + t + '</span>';
  }).join('');

  var linksHtml = '';
  if (proj.github) linksHtml += '<a href="' + proj.github + '" target="_blank" rel="noopener" class="btn btn-ghost pm-link-btn"><i class="fa-brands fa-github"></i> GitHub</a>';
  if (proj.demo && proj.demo !== '__minigame__') linksHtml += '<a href="' + proj.demo + '" target="_blank" rel="noopener" class="btn btn-primary pm-link-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>';
  if (proj.demo === '__minigame__') linksHtml += '<button class="btn btn-primary pm-link-btn" onclick="closeProjectModal();openMiniGameFromCard()"><i class="fa-solid fa-gamepad"></i> Play Live Demo</button>';
  document.getElementById('pm-links').innerHTML = linksHtml;

  var descText = proj.fullDesc || proj.desc || '';
  document.getElementById('pm-desc').innerHTML = descText
    .split(/\n\n+/)
    .map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; })
    .join('');

  var tools = proj.tools || [];
  var toolsWrap = document.getElementById('pm-tools-wrap');
  if (tools.length > 0) {
    document.getElementById('pm-tools').innerHTML = tools.map(function (t) {
      return '<div class="pm-tool pm-tool-' + (t.color || 'cyan') + '">'
        + '<i class="' + t.icon + '"></i><span>' + t.name + '</span></div>';
    }).join('');
    toolsWrap.style.display = '';
  } else {
    toolsWrap.style.display = 'none';
  }

  var media = proj.media || [];
  var heroEl = document.getElementById('pm-media-hero');
  if (media.length > 0) {
    var first = media[0];
    if (first.type === 'youtube') {
      heroEl.innerHTML = '<div class="pm-hero-yt" data-ytid="' + first.id + '">'
        + '<img src="https://img.youtube.com/vi/' + first.id + '/hqdefault.jpg" alt="' + (first.caption || '') + '">'
        + '<div class="pm-hero-play"><i class="fa-solid fa-play"></i></div>'
        + '</div>';
      heroEl.querySelector('.pm-hero-yt').addEventListener('click', function () {
        var id = this.dataset.ytid;
        this.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>';
      });
    } else {
      heroEl.innerHTML = '<img class="pm-hero-img" src="' + first.src + '" alt="' + (first.caption || '') + '" onclick="openLightbox(\'' + first.src.replace(/'/g, "\\'") + '\',\'' + (first.caption || '').replace(/'/g, "\\'") + '\')">';
    }
  } else {
    heroEl.innerHTML = '<div class="pm-hero-placeholder"><i class="' + proj.icon + '"></i><span>Add images or a YouTube video to your project entry to show them here</span></div>';
  }

  var galleryWrap = document.getElementById('pm-gallery-wrap');
  var galleryEl = document.getElementById('pm-gallery');
  var rest = media.slice(1);
  if (rest.length > 0) {
    galleryEl.innerHTML = rest.map(function (m) {
      if (m.type === 'youtube') {
        return '<div class="pm-gal-item pm-gal-yt" data-ytid="' + m.id + '">'
          + '<img src="https://img.youtube.com/vi/' + m.id + '/mqdefault.jpg" alt="' + (m.caption || '') + '">'
          + '<div class="pm-gal-play"><i class="fa-solid fa-play"></i></div>'
          + (m.caption ? '<div class="pm-gal-cap">' + m.caption + '</div>' : '')
          + '</div>';
      }
      return '<div class="pm-gal-item" onclick="openLightbox(\'' + m.src.replace(/'/g, "\\'") + '\',\'' + (m.caption || '').replace(/'/g, "\\'") + '\')">'
        + '<img src="' + m.src + '" alt="' + (m.caption || '') + '" loading="lazy">'
        + (m.caption ? '<div class="pm-gal-cap">' + m.caption + '</div>' : '')
        + '</div>';
    }).join('');
    galleryEl.querySelectorAll('.pm-gal-yt').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = this.dataset.ytid;
        var cap = this.querySelector('.pm-gal-cap');
        var capHtml = cap ? cap.outerHTML : '';
        this.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>' + capHtml;
      });
    });
    galleryWrap.style.display = '';
  } else {
    galleryWrap.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.pm-scroll').scrollTop = 0;
}

function closeProjectModal() {
  var modal = document.getElementById('proj-modal');
  if (modal) {
    /* Stop any playing YouTube iframes by blanking their src */
    modal.querySelectorAll('iframe').forEach(function (f) { f.src = ''; });
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.closeProjectModal = closeProjectModal;

/* ─────────────────────────────────────────────────────────────
   LIGHTBOX
   ───────────────────────────────────────────────────────────── */
function openLightbox(src, caption) {
  var lb = document.getElementById('proj-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'proj-lightbox';
    lb.innerHTML = '<div class="lb-backdrop"></div><div class="lb-content"><button class="lb-close"><i class="fa-solid fa-xmark"></i></button><img class="lb-img" src="" alt=""><div class="lb-caption"></div></div>';
    document.body.appendChild(lb);
    lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }
  lb.querySelector('.lb-img').src = src;
  lb.querySelector('.lb-caption').textContent = caption || '';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  var lb = document.getElementById('proj-lightbox');
  if (lb) { lb.classList.remove('active'); document.body.style.overflow = ''; }
}
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/* ─────────────────────────────────────────────────────────────
   OPEN MINI-GAME (from project card modal or anywhere)
   ───────────────────────────────────────────────────────────── */
function openMiniGameFromCard() {
  var overlay = document.getElementById('mini-game-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  if (window.MiniGame) window.MiniGame.init();
}
window.openMiniGameFromCard = openMiniGameFromCard;

/* ─────────────────────────────────────────────────────────────
   BIND CARD → MODAL
   ───────────────────────────────────────────────────────────── */
function bindCardEvents(card, proj) {
  function tryOpen(e) {
    openProjectModal(proj);
  }
  card.addEventListener('click', tryOpen);
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tryOpen(e); }
  });
}

/* ─────────────────────────────────────────────────────────────
   CAROUSEL
   ───────────────────────────────────────────────────────────── */
function buildCarousel(container) {
  var wrapper = document.createElement('div');
  wrapper.className = 'proj-carousel-wrapper';
  var track = document.createElement('div');
  track.className = 'proj-carousel-track';
  track.id = 'projects-carousel-track';
  while (container.firstChild) track.appendChild(container.firstChild);
  wrapper.appendChild(track);

  var prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-arrow carousel-prev';
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prevBtn.setAttribute('aria-label', 'Previous');

  var nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-arrow carousel-next';
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  nextBtn.setAttribute('aria-label', 'Next');

  var dots = document.createElement('div');
  dots.className = 'carousel-dots';

  container.appendChild(prevBtn);
  container.appendChild(wrapper);
  container.appendChild(nextBtn);
  container.appendChild(dots);

  function getStep() {
    var c = track.querySelector('.proj-card');
    return c ? c.offsetWidth + 22 : 360;
  }

  prevBtn.addEventListener('click', function () { track.scrollBy({ left: -getStep(), behavior: 'smooth' }); });
  nextBtn.addEventListener('click', function () { track.scrollBy({ left: getStep(), behavior: 'smooth' }); });

  function updateControls() {
    prevBtn.classList.toggle('carousel-arrow-dim', track.scrollLeft <= 4);
    nextBtn.classList.toggle('carousel-arrow-dim', track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    var visible = track.querySelectorAll('.proj-card:not([style*="display: none"])');
    var perPage = Math.max(1, Math.round(track.clientWidth / getStep()));
    var pages = Math.ceil(visible.length / perPage);
    var current = Math.min(pages - 1, Math.round(track.scrollLeft / (getStep() * perPage)));
    if (dots.childElementCount !== pages) {
      dots.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var d = document.createElement('span');
        d.className = 'carousel-dot' + (i === current ? ' active' : '');
        (function (idx) {
          d.addEventListener('click', function () {
            track.scrollTo({ left: idx * getStep() * perPage, behavior: 'smooth' });
          });
        })(i);
        dots.appendChild(d);
      }
    } else {
      dots.querySelectorAll('.carousel-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }
  }

  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
  return track;
}

/* ─────────────────────────────────────────────────────────────
   GITHUB FETCH
   ───────────────────────────────────────────────────────────── */
async function fetchGitHubReposCarousel(track) {
  try {
    var res = await fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=12');
    if (!res.ok) throw new Error('bad');
    var repos = await res.json();
    var staticIds = new Set(STATIC_PROJECTS.map(function (p) { return p.id; }));
    var langColor = { 'C#': 'cyan', 'C++': 'orange', 'C': 'orange', 'Python': 'green', 'JavaScript': 'green', 'HTML': 'purple' };
    repos.filter(function (r) { return !r.fork && r.name !== GITHUB_USER; }).forEach(function (repo) {
      if (staticIds.has(repo.name)) return;
      var lang = repo.language || 'Code';
      var proj = {
        id: repo.name,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }),
        shortDesc: repo.description || 'A project from my GitHub.',
        fullDesc: repo.description || 'A project from my GitHub repository.',
        tags: [lang].concat((repo.topics || []).slice(0, 2)).filter(Boolean),
        tagColors: [langColor[lang] || 'cyan', 'purple', 'green'],
        tools: lang !== 'Code' ? [{ name: lang, icon: 'fa-solid fa-code', color: langColor[lang] || 'cyan' }] : [],
        icon: 'fa-brands fa-github',
        category: 'github',
        github: repo.html_url,
        demo: repo.homepage || null,
        featured: false,
        scoreUnlock: 0,
        media: [],
      };
      var el = document.createElement('div');
      el.innerHTML = renderCard(proj).trim();
      var card = el.firstElementChild;
      var loader = track.querySelector('.gh-loading');
      if (loader) track.insertBefore(card, loader); else track.appendChild(card);
      bindCardEvents(card, proj);
      if (window._revealObserver) window._revealObserver.observe(card);
    });
    var loader = track.querySelector('.gh-loading');
    if (loader) loader.remove();
    track.dispatchEvent(new Event('scroll'));
  } catch (e) {
    var loader = track.querySelector('.gh-loading');
    if (loader) loader.textContent = '// github fetch failed — check network';
  }
}

/* ─────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────── */
function initProjects() {
  var container = document.getElementById('projects-grid');
  if (!container) return;

  container.classList.add('proj-carousel-container');

  STATIC_PROJECTS.forEach(function (proj) {
    var el = document.createElement('div');
    el.innerHTML = renderCard(proj).trim();
    var card = el.firstElementChild;
    container.appendChild(card);
    bindCardEvents(card, proj);
  });

  var track = buildCarousel(container);

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      track.querySelectorAll('.proj-card').forEach(function (card) {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
      track.scrollTo({ left: 0, behavior: 'smooth' });
      setTimeout(function () { track.dispatchEvent(new Event('scroll')); }, 50);
    });
  });
}

window.initProjects = initProjects;[]