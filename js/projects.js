/* ============================================================
   projects.js — Project data, media showcase, GitHub fetch
   ============================================================

   HOW TO ADD A NEW PROJECT
   ─────────────────────────
   1. Find the STATIC_PROJECTS array below (starts ~line 20).
   2. Copy any existing project object and paste it as a new
      entry inside the array (add a comma after the previous
      closing brace  }  before your new one).
   3. Fill in these fields:
        id          – unique slug, e.g. 'my-new-game'
        title       – display name
        desc        – fresh description (don't copy the CV!)
        tags        – array of tech labels
        tagColors   – parallel array: 'cyan'|'orange'|'green'|'purple'
        icon        – Font Awesome class e.g. 'fa-solid fa-gamepad'
        category    – 'unity'|'graphics'|'systems'|'webgl'|'github'
        github      – full URL string, or null
        demo        – live demo URL string, or null
        featured    – true | false
        scoreUnlock – score needed in mini-game to reveal this card
                      (0 = always visible, 50 = unlocked at 50 pts)
        media       – array of media objects:
                      { type:'image',   src:'URL', caption:'text' }
                      { type:'youtube', id:'VIDEO_ID', caption:'text' }
   4. Save the file. Done!
   ============================================================ */

const GITHUB_USER = 'Bedo-Mostafa';

/* ─────────────────────────────────────────────────────────────
   STATIC_PROJECTS  ← ADD YOUR NEW PROJECT INSIDE THIS ARRAY
   ───────────────────────────────────────────────────────────── */
const STATIC_PROJECTS = [
  {
    id: 'opengl-maze',
    title: '3D OpenGL Maze Explorer',
    desc: 'A hand-crafted 3D maze assembled vertex-by-vertex on raw OpenGL — no engine scaffolding, no shortcuts. Custom GLSL shaders handle every lighting calculation, and Phong illumination reacts in real-time as you navigate the first-person camera through designed corridors.',
    tags: ['C++', 'OpenGL', 'GLSL', 'Graphics'],
    tagColors: ['cyan', 'orange', 'purple', 'green'],
    icon: 'fa-solid fa-cube',
    category: 'graphics',
    github: 'https://github.com/Bedo-Mostafa',
    demo: null,
    featured: true,
    scoreUnlock: 0,
    media: [
      /* Add media here — examples:
         { type: 'image', src: 'https://i.imgur.com/XXXXX.png', caption: 'Maze corridor with Phong lighting' }
         { type: 'youtube', id: 'YOUTUBE_VIDEO_ID', caption: 'Gameplay walkthrough' }
      */
    ],
  },
  {
    id: 'physics-prototype',
    title: 'Low-Level 2D Physics Prototype',
    desc: 'Physics without a safety net — Box2D called directly, game-loop hand-rolled. Every collision manifold, every impulse response, every frame paced by code rather than an editor. Built to feel what engines hide from you.',
    tags: ['C++', 'Box2D', 'Physics', '2D'],
    tagColors: ['orange', 'cyan', 'green', 'cyan'],
    icon: 'fa-solid fa-atom',
    category: 'systems',
    //github: 'https://github.com/Bedo-Mostafa',
    demo: null,
    featured: true,
    scoreUnlock: 0,
    media: [],
  },
  {
    id: 'tick-tock',
    title: 'Tick Tock Treasure',
    desc: 'Seconds vanish, stakes rise — a 3D treasure hunt designed around the anxiety of a countdown. Player movement, environment interaction, and collectible logic wire together to create something that feels urgent even on your third run.',
    tags: ['Unity', 'C#', '3D', 'Adventure'],
    tagColors: ['cyan', 'green', 'orange', 'purple'],
    icon: 'fa-solid fa-gem',
    category: 'unity',
    github: 'https://github.com/Bedo-Mostafa',
    demo: null,
    featured: true,
    scoreUnlock: 0,
    media: [],
  },
  {
    id: '2d-side-scroller',
    title: '2D Side-Scrolling Adventure',
    desc: 'Layers of hazards, physics-driven momentum, and level geometry that communicates before the player even lands. Collision zones are contextual, not blunt — the jump arc does the teaching.',
    tags: ['Unity', 'C#', '2D', 'Platformer'],
    tagColors: ['cyan', 'green', 'orange', 'cyan'],
    icon: 'fa-solid fa-gamepad',
    category: 'unity',
    github: 'https://github.com/Bedo-Mostafa',
    demo: null,
    featured: false,
    scoreUnlock: 30,
    media: [],
  },
  {
    id: 'domino-jam',
    title: 'Domino — Egypt Game Jam 2nd Place',
    desc: "Shipped under jam pressure with full rule enforcement: placement validity, turn sequencing, score tracking, and stable scene transitions. The kind of submission that doesn't crash on the demo table. This one didn't.",
    tags: ['Unity', 'C#', 'Game Jam', 'Board Game'],
    tagColors: ['cyan', 'green', 'orange', 'purple'],
    icon: 'fa-solid fa-trophy',
    category: 'unity',
    github: 'https://github.com/Bedo-Mostafa',
    demo: null,
    featured: true,
    scoreUnlock: 50,
    media: [],
  },
  {
    id: 'kg-webgl',
    title: 'Educational WebGL Games (KG1 & KG2)',
    desc: 'Two browser-native games built for kindergarteners — zero friction, pure interaction. Each mechanic is a cognitive exercise in disguise: shape recognition, sequencing, spatial awareness. Ships in a browser tab; no install, no barrier.',
    tags: ['Unity', 'WebGL', 'Educational', 'C#'],
    tagColors: ['cyan', 'orange', 'green', 'green'],
    icon: 'fa-solid fa-children',
    category: 'webgl',
    github: 'https://github.com/Bedo-Mostafa',
    demo: null,
    featured: false,
    scoreUnlock: 100,
    media: [],
  },

  /* ══════════════════════════════════════════════════════════
     ↓  PASTE YOUR NEW PROJECT OBJECT BELOW THIS LINE  ↓
     ══════════════════════════════════════════════════════════ */


  /* ══════════════════════════════════════════════════════════
     ↑  PASTE YOUR NEW PROJECT OBJECT ABOVE THIS LINE  ↑
     ══════════════════════════════════════════════════════════ */
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */
function tagColorClass(color) {
  const map = { cyan: 'tag-cyan', orange: 'tag-orange', green: 'tag-green', purple: 'tag-purple' };
  return map[color] || 'tag-cyan';
}

function buildMediaHTML(media) {
  if (!media || media.length === 0) return '';
  const items = media.map((m, i) => {
    if (m.type === 'youtube') {
      return '<div class="media-item"><div class="media-thumb yt-thumb" data-ytid="' + m.id + '" title="Play video"><img src="https://img.youtube.com/vi/' + m.id + '/mqdefault.jpg" alt="' + (m.caption || 'Video') + '" loading="lazy"><div class="yt-play-btn"><i class="fa-solid fa-play"></i></div></div>' + (m.caption ? '<div class="media-caption">' + m.caption + '</div>' : '') + '</div>';
    }
    if (m.type === 'image') {
      return '<div class="media-item"><img class="media-thumb-img" src="' + m.src + '" alt="' + (m.caption || 'Screenshot') + '" loading="lazy" onclick="openLightbox(\'' + m.src + '\',\'' + (m.caption || '').replace(/'/g, "\\'") + '\')">' + (m.caption ? '<div class="media-caption">' + m.caption + '</div>' : '') + '</div>';
    }
    return '';
  }).join('');
  return '<div class="proj-media">' + items + '</div>';
}

function renderCard(proj) {
  const tagsHtml = proj.tags.map((t, i) =>
    '<span class="tag ' + tagColorClass(proj.tagColors?.[i] || 'cyan') + '">' + t + '</span>'
  ).join('');
  const githubLink = proj.github ? '<a href="' + proj.github + '" target="_blank" rel="noopener" class="proj-link" title="GitHub"><i class="fa-brands fa-github"></i></a>' : '';
  const demoLink = proj.demo ? '<a href="' + proj.demo + '" target="_blank" rel="noopener" class="proj-link" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>' : '';
  const mediaHTML = buildMediaHTML(proj.media);
  const lockedAttr = proj.scoreUnlock > 0 ? ' data-score-unlock="' + proj.scoreUnlock + '"' : '';
  const lockedClass = proj.scoreUnlock > 0 ? ' proj-locked' : '';
  const lockedBadge = proj.scoreUnlock > 0 ? '<div class="locked-badge"><i class="fa-solid fa-lock"></i> Reach ' + proj.scoreUnlock + ' pts in the mini-game to unlock</div>' : '';
  return '<article class="proj-card reveal' + lockedClass + '" data-category="' + proj.category + '" data-id="' + proj.id + '"' + lockedAttr + '>' + lockedBadge + '<div class="proj-card-top"><div class="proj-icon"><i class="' + proj.icon + '"></i></div><div class="proj-links">' + githubLink + demoLink + '</div></div><div class="proj-title">' + proj.title + '</div><div class="proj-desc">' + proj.desc + '</div>' + mediaHTML + '<div class="proj-tags">' + tagsHtml + '</div></article>';
}

/* ─────────────────────────────────────────────────────────────
   LIGHTBOX
   ───────────────────────────────────────────────────────────── */
function openLightbox(src, caption) {
  let lb = document.getElementById('proj-lightbox');
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

/* ─────────────────────────────────────────────────────────────
   YOUTUBE EMBED
   ───────────────────────────────────────────────────────────── */
function bindYouTubeThumbs(root) {
  root.querySelectorAll('.yt-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var id = thumb.dataset.ytid;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'yt-iframe';
      thumb.replaceWith(iframe);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   SCORE-BASED UNLOCK  (called from minigame.js)
   ───────────────────────────────────────────────────────────── */
function unlockProjectsUpTo(score) {
  document.querySelectorAll('.proj-card.proj-locked').forEach(function (card) {
    var needed = parseInt(card.dataset.scoreUnlock, 10);
    if (score >= needed) {
      card.classList.remove('proj-locked');
      var badge = card.querySelector('.locked-badge');
      if (badge) badge.remove();
      card.classList.add('just-unlocked');
      setTimeout(function () { card.classList.remove('just-unlocked'); }, 2500);
    }
  });
}
window.unlockProjectsUpTo = unlockProjectsUpTo;

/* ─────────────────────────────────────────────────────────────
   GITHUB LIVE REPOS
   ───────────────────────────────────────────────────────────── */
async function fetchGitHubRepos(grid) {
  try {
    var res = await fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=12');
    if (!res.ok) throw new Error('bad response');
    var repos = await res.json();
    var staticIds = new Set(STATIC_PROJECTS.map(function (p) { return p.id; }));
    var langColorMap = { 'C#': 'cyan', 'C++': 'orange', 'C': 'orange', 'Python': 'green', 'JavaScript': 'green', 'HTML': 'purple' };
    repos.filter(function (r) { return !r.fork && r.name !== GITHUB_USER; }).forEach(function (repo) {
      if (staticIds.has(repo.name)) return;
      var lang = repo.language || 'Code';
      var proj = {
        id: repo.name,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }),
        desc: repo.description || 'A project from my GitHub repository.',
        tags: [lang].concat((repo.topics || []).slice(0, 2)).filter(Boolean),
        tagColors: [langColorMap[lang] || 'cyan', 'purple', 'green'],
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
      grid.appendChild(card);
      bindYouTubeThumbs(card);
      if (window._revealObserver) window._revealObserver.observe(card);
    });
    var loader = grid.querySelector('.gh-loading');
    if (loader) loader.remove();
  } catch (e) {
    var loader = grid.querySelector('.gh-loading');
    if (loader) loader.textContent = '// github fetch failed — check network';
  }
}

/* ─────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────── */
function initProjects() {
  var grid = document.getElementById('projects-grid');
  if (!grid) return;

  STATIC_PROJECTS.forEach(function (proj) {
    var el = document.createElement('div');
    el.innerHTML = renderCard(proj).trim();
    var card = el.firstElementChild;
    grid.appendChild(card);
    bindYouTubeThumbs(card);
  });

  var loader = document.createElement('div');
  loader.className = 'gh-loading';
  loader.innerHTML = '<i class="fa-brands fa-github"></i>&nbsp; fetching repos from github...';
  grid.appendChild(loader);
  fetchGitHubRepos(grid);

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      document.querySelectorAll('.proj-card').forEach(function (card) {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });
}

window.initProjects = initProjects;