/* ============================================================
   projects.js — Project data, carousel, detail modal
   ============================================================

   HOW TO ADD A NEW PROJECT
   ─────────────────────────
   1. Find the STATIC_PROJECTS array below.
   2. Copy any existing object and fill in these fields:
        id          – unique slug, e.g. 'my-new-game'
        title       – display name
        shortDesc   – one-line summary shown on the card
        fullDesc    – long description for the modal (blank lines = paragraphs)
        tags        – array of tech labels
        tagColors   – 'cyan'|'orange'|'green'|'purple' (one per tag)
        tools       – array of { name, icon (FA class), color }
        icon        – Font Awesome class for the card icon
        category    – 'unity'|'graphics'|'systems'|'webgl'|'github'
        github      – URL or null
        demo        – URL or null
        featured    – true | false
        scoreUnlock – 0 = always visible, N = unlocked at N pts in mini-game
        media       – array of:
                        { type:'image',   src:'URL', caption:'text' }
                        { type:'youtube', id:'VIDEO_ID', caption:'text' }
   ============================================================ */

const GITHUB_USER = 'Bedo-Mostafa';

/* ─────────────────────────────────────────────────────────────
   STATIC_PROJECTS
   ───────────────────────────────────────────────────────────── */
const STATIC_PROJECTS = [
  {
    id: 'opengl-maze',
    title: '3D OpenGL Maze Explorer',
    shortDesc: 'First-person 3D maze built vertex-by-vertex on raw OpenGL with custom GLSL shaders.',
    fullDesc: `A hand-crafted 3D maze assembled vertex-by-vertex on raw OpenGL — no engine scaffolding, no shortcuts.

Every piece of geometry is defined manually using VAOs, VBOs, and EBOs. Custom GLSL shaders handle every lighting calculation, and Phong illumination reacts in real-time as you navigate the first-person camera through designed corridors.

The goal was to understand what engines hide from you: MVP matrix transformations, the depth buffer, texture mapping coordinates, and how a real-time render loop actually works at the metal.`,
    tags: ['C++', 'OpenGL', 'GLSL', 'Graphics'],
    tagColors: ['cyan', 'orange', 'purple', 'green'],
    tools: [
      { name: 'C++', icon: 'fa-solid fa-code', color: 'orange' },
      { name: 'OpenGL 3.3', icon: 'fa-solid fa-cube', color: 'cyan' },
      { name: 'GLSL Shaders', icon: 'fa-solid fa-wand-magic-sparkles', color: 'purple' },
      { name: 'GLM Math Library', icon: 'fa-solid fa-square-root-variable', color: 'green' },
      { name: 'GLFW', icon: 'fa-solid fa-window-maximize', color: 'cyan' },
    ],
    icon: 'fa-solid fa-cube',
    category: 'graphics',
    github: 'https://github.com/Bedo-Mostafa/3D-Maze-OpenGL',
    demo: 'https://abdelrhman-mostafa.itch.io/3d-maze-explorer',//'https://youtu.be/z4MjLof0k9c',
    featured: true,
    scoreUnlock: 0,
    media: [
      { type: 'youtube', id: 'z4MjLof0k9c', caption: 'Gameplay walkthrough' }
    ],
  },
  {
    id: 'physics-prototype',
    title: 'Low-Level 2D Physics Prototype',
    shortDesc: 'Box2D called directly, game-loop hand-rolled — physics without an engine safety net.',
    fullDesc: `Physics without a safety net — Box2D called directly, game-loop hand-rolled.

Every collision manifold, every impulse response, every frame paced by code rather than an editor. The prototype demonstrates rigid body dynamics, joint constraints, and custom collision filtering — all wired up by hand with no game engine in between.

Built to feel what engines hide from you: how a fixed timestep accumulator prevents spiral-of-death frame drops, and how collision callbacks map to actual gameplay events.`,
    tags: ['C++', 'Box2D', 'Physics', '2D'],
    tagColors: ['orange', 'cyan', 'green', 'cyan'],
    tools: [
      { name: 'C++', icon: 'fa-solid fa-code', color: 'orange' },
      { name: 'Box2D', icon: 'fa-solid fa-atom', color: 'cyan' },
      { name: 'SDL2', icon: 'fa-solid fa-display', color: 'green' },
    ],
    icon: 'fa-solid fa-atom',
    category: 'systems',
    github: null,
    demo: null,
    featured: true,
    scoreUnlock: 0,
    media: [
      // https://youtu.be/L-FQmg9gyos
      { type: 'youtube', id: 'L-FQmg9gyos', caption: 'Gameplay walkthrough' }
    ],
  },
  {
    id: 'tick-tock',
    title: 'Tick Tock Treasure',
    shortDesc: '3D treasure hunt designed around countdown anxiety — urgency that grows every run.',
    fullDesc: `Seconds vanish, stakes rise — a 3D treasure hunt designed around the anxiety of a countdown.

Player movement, environment interaction, and collectible logic wire together to create something that feels urgent even on your third run. The level geometry was designed to give the player just enough navigational clarity that the timer, not confusion, creates the pressure.

Key systems: Unity's character controller extended with custom physics responses, a dynamic UI that reacts to time remaining, and an item spawning system that randomises treasure positions each session.`,
    tags: ['Unity', 'C#', '3D', 'Adventure'],
    tagColors: ['cyan', 'green', 'orange', 'purple'],
    tools: [
      { name: 'Unity', icon: 'fa-solid fa-gamepad', color: 'cyan' },
      { name: 'C#', icon: 'fa-solid fa-hashtag', color: 'green' },
      { name: 'Unity Physics', icon: 'fa-solid fa-atom', color: 'orange' },
      { name: 'Cinemachine', icon: 'fa-solid fa-video', color: 'purple' },
    ],
    icon: 'fa-solid fa-gem',
    category: 'unity',
    github: 'https://github.com/Hazem-Ahmed1/3D-Game-Grahpics',
    demo: 'https://hazem-ahmed-a.itch.io/tick-tock-treasure',
    featured: true,
    scoreUnlock: 0,
    media: [
      { type: 'youtube', id: 'QsxG-32OnnU', caption: 'Gameplay walkthrough' }
    ],
  },
  {
    id: 'yallahwy',
    title: 'Yallahwy — ITI Game Jam',
    shortDesc: 'Arcade chaos built in 3 days — C++ with SFML and Box2D under jam constraints.',
    fullDesc: `Built in 72 hours for an ITI game jam — speed over comfort, correctness under pressure.

Core loop is immediate: responsive controls, tight collision handling, and fast restart cycles. SFML handles rendering and input while Box2D drives rigid body interactions and collision resolution.

The constraint shaped the architecture: minimal abstractions, direct system wiring, and a focus on stability over feature breadth. The result is a compact, deterministic gameplay loop that holds under rapid iteration and demo conditions.`,
    tags: ['C++', 'SFML', 'Box2D', 'Game Jam'],
    tagColors: ['orange', 'cyan', 'cyan', 'purple'],
    tools: [
      { name: 'C++', icon: 'fa-solid fa-code', color: 'orange' },
      { name: 'SFML', icon: 'fa-solid fa-display', color: 'cyan' },
      { name: 'Box2D', icon: 'fa-solid fa-atom', color: 'green' },
    ],
    icon: 'fa-solid fa-fire',
    category: 'systems',
    github: null,
    demo: 'https://abdelrhman-mostafa.itch.io/yallahwy',
    featured: true,
    scoreUnlock: 50,
    media: [
      { type: 'image', src: 'assets/yallahwy/1.png', caption: 'Core gameplay – fast loop and immediate restart' },
      { type: 'image', src: 'assets/yallahwy/2.png', caption: 'Physics interaction – Box2D collision handling' },
      { type: 'image', src: 'assets/yallahwy/3.png', caption: 'Arcade chaos – dense objects and reactions' },
      { type: 'image', src: 'assets/yallahwy/4.png', caption: 'Arcade chaos – dense objects and reactions' }
    ]
  },
  {
    id: 'domino-jam',
    title: 'Domino — Egypt Game Jam 2nd Place',
    shortDesc: 'Fully rule-enforced domino game shipped under jam pressure. Didn\'t crash at the demo table.',
    fullDesc: `Shipped under jam pressure with full rule enforcement: placement validity, turn sequencing, score tracking, and stable scene transitions.

Built in 6 days for the Egypt Game Jam hosted by ITI. The challenge wasn't just making a playable game — it was making a correct domino game. Every placement is validated against adjacency and pip-matching rules. The AI opponent uses a weighted decision tree to pick the best valid tile.

The kind of submission that doesn't crash on the demo table. This one didn't. Won 2nd place out of all competing teams.`,
    tags: ['Unity', 'C#', 'Game Jam', 'Board Game'],
    tagColors: ['cyan', 'green', 'orange', 'purple'],
    tools: [
      { name: 'Unity', icon: 'fa-solid fa-gamepad', color: 'cyan' },
      { name: 'C#', icon: 'fa-solid fa-hashtag', color: 'green' },
      { name: 'AI / Decision Tree', icon: 'fa-solid fa-brain', color: 'orange' },
      { name: 'UI Toolkit', icon: 'fa-solid fa-layer-group', color: 'purple' },
    ],
    icon: 'fa-solid fa-trophy',
    category: 'unity',
    github: 'https://github.com/Bedo-Mostafa/EGJ',
    demo: 'https://abdelrhman-mostafa.itch.io/a3dt-domino',
    featured: true,
    scoreUnlock: 100,
    media: [
      //https://youtu.be/nK0kg0FuQmE?si=3Xk2BtFag8AdWoRh
      { type: 'youtube', id: 'nK0kg0FuQmE', caption: 'Gameplay walkthrough' }
    ],
  },
  {
    id: 'kg-webgl',
    title: 'Educational WebGL Games (KG1 & KG2)',
    shortDesc: 'Browser-native games for kindergarteners — cognitive exercises disguised as play.',
    fullDesc: `Two browser-native games built for kindergarteners — zero friction, pure interaction.

Each mechanic is a cognitive exercise in disguise: shape recognition, sequencing, spatial awareness. The games were designed with a UX-first approach — a five-year-old should never need to read a tutorial. Every interaction is discoverable through play.

Commissioned by Whitton Publishing. Ships in a browser tab with no install, no loading screen that loses young attention spans. Built with Unity's WebGL pipeline and optimised for low-end school hardware.`,
    tags: ['Unity', 'WebGL', 'Educational', 'C#'],
    tagColors: ['cyan', 'orange', 'green', 'green'],
    tools: [
      { name: 'Unity', icon: 'fa-solid fa-gamepad', color: 'cyan' },
      { name: 'C#', icon: 'fa-solid fa-hashtag', color: 'green' },
      { name: 'WebGL Export', icon: 'fa-brands fa-chrome', color: 'orange' },
      { name: 'Educational UX Design', icon: 'fa-solid fa-child', color: 'purple' },
    ],
    icon: 'fa-solid fa-children',
    category: 'webgl',
    demo: null,
    featured: false,
    scoreUnlock: 150,
    media: [
      { type: 'image', src: 'assets/KG1&2/1.png', caption: 'Main menu – phonics learning entry screen' },
      { type: 'image', src: 'assets/KG1&2/2.png', caption: 'Interactive stage – character responding to player input' },
      { type: 'image', src: 'assets/KG1&2/3.png', caption: 'UI feedback – animated curtain transition' },
      { type: 'image', src: 'assets/KG1&2/4.png', caption: 'Game scene – learning environment setup' },
      { type: 'image', src: 'assets/KG1&2/5.png', caption: 'Object interaction – selecting and matching elements' },
      { type: 'image', src: 'assets/KG1&2/6.png', caption: 'Phonics exercise – letter recognition activity' },
      { type: 'image', src: 'assets/KG1&2/7.png', caption: 'Progression system – advancing through levels' },
      { type: 'image', src: 'assets/KG1&2/8.png', caption: 'Visual feedback – correct/incorrect response cues' },
      { type: 'image', src: 'assets/KG1&2/9.png', caption: 'World map – selecting different learning modules' },
      { type: 'image', src: 'assets/KG1&2/10.png', caption: 'Choice interaction – selecting correct answer paths' },
      { type: 'image', src: 'assets/KG1&2/11.png', caption: 'Writing practice – tracing letters activity' },
      { type: 'image', src: 'assets/KG1&2/12.png', caption: 'Assessment screen – evaluating player input' },
      { type: 'image', src: 'assets/KG1&2/13.png', caption: 'Main menu – themed environment variation' },
      { type: 'image', src: 'assets/KG1&2/14.png', caption: 'Mini-game – movement and interaction sequence' },
      { type: 'image', src: 'assets/KG1&2/15.png', caption: 'Final gameplay – question and answer challenge' }
    ]
  },
  /* ══════════════════════════════════════════════════════
     ↓  ADD YOUR NEW PROJECTS BELOW THIS LINE  ↓
     ══════════════════════════════════════════════════════ */


  /* ══════════════════════════════════════════════════════
     ↑  ADD YOUR NEW PROJECTS ABOVE THIS LINE  ↑
     ══════════════════════════════════════════════════════ */
];

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

  var lockedAttr = proj.scoreUnlock > 0 ? ' data-score-unlock="' + proj.scoreUnlock + '"' : '';
  var lockedClass = proj.scoreUnlock > 0 ? ' proj-locked' : '';

  var lockedOverlay = proj.scoreUnlock > 0
    ? '<div class="card-locked-overlay">'
    + '<div class="locked-badge"><i class="fa-solid fa-lock"></i> Reach ' + proj.scoreUnlock + ' pts to unlock</div>'
    + '<button class="btn-play-unlock" onclick="event.stopPropagation();openMiniGameFromCard()" title="Play mini-game to unlock">'
    + '<i class="fa-solid fa-gamepad"></i> Play to Unlock</button>'
    + '</div>'
    : '';

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
  } else {
    thumbHtml = '<div class="card-thumb card-thumb-placeholder"><i class="' + proj.icon + '"></i></div>';
  }

  return '<article class="proj-card reveal' + lockedClass + '" data-category="' + proj.category
    + '" data-id="' + proj.id + '"' + lockedAttr + ' role="button" tabindex="0">'
    + lockedOverlay
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
  if (proj.demo) linksHtml += '<a href="' + proj.demo + '" target="_blank" rel="noopener" class="btn btn-primary pm-link-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>';
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
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
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
   SCORE-BASED UNLOCK
   ───────────────────────────────────────────────────────────── */
function unlockProjectsUpTo(score) {
  document.querySelectorAll('.proj-card.proj-locked').forEach(function (card) {
    if (score >= parseInt(card.dataset.scoreUnlock, 10)) {
      card.classList.remove('proj-locked');
      var overlay = card.querySelector('.card-locked-overlay');
      if (overlay) overlay.remove();
      card.classList.add('just-unlocked');
      setTimeout(function () { card.classList.remove('just-unlocked'); }, 2500);
    }
  });
}
window.unlockProjectsUpTo = unlockProjectsUpTo;

/* ─────────────────────────────────────────────────────────────
   OPEN MINI-GAME FROM LOCKED CARD
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
    if (e.target.closest('.btn-play-unlock')) return;
    if (card.classList.contains('proj-locked')) return;
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

window.initProjects = initProjects;