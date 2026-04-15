/* ============================================================
   projects.js — Static project data + GitHub live fetch
   ============================================================ */

const GITHUB_USER = 'Bedo-Mostafa';

/* Static / manually curated projects */
const STATIC_PROJECTS = [
  {
    id: 'opengl-maze',
    title: '3D OpenGL Maze Explorer',
    desc: 'A hand-crafted 3D maze built from scratch on raw OpenGL — every vertex wrangled by hand, every pixel pushed through custom GLSL shaders. Real-time first-person navigation with Phong lighting and dynamic shadow casting.',
    tags: ['C++', 'OpenGL', 'GLSL', 'Graphics'],
    tagColors: ['cyan','orange','purple','green'],
    icon: 'fa-solid fa-cube',
    category: 'graphics',
    github: `https://github.com/${GITHUB_USER}`,
    demo: null,
    featured: true,
  },
  {
    id: 'physics-prototype',
    title: 'Low-Level 2D Physics Prototype',
    desc: 'Physics stripped bare — no engine safety net, just Box2D calls and raw game-loop architecture. Built to understand what happens at the seams: collision manifolds, impulse resolution, memory ownership.',
    tags: ['C++', 'Box2D', 'Physics', '2D'],
    tagColors: ['orange','cyan','green','cyan'],
    icon: 'fa-solid fa-atom',
    category: 'systems',
    github: `https://github.com/${GITHUB_USER}`,
    demo: null,
    featured: true,
  },
  {
    id: 'tick-tock',
    title: 'Tick Tock Treasure',
    desc: 'A race-against-the-clock 3D treasure hunt where every second ticking away reshapes the hunt. Designed to keep players in perpetual motion — exploration, discovery, and a clock that never lets you breathe.',
    tags: ['Unity', 'C#', '3D', 'Game'],
    tagColors: ['cyan','green','orange','purple'],
    icon: 'fa-solid fa-gem',
    category: 'unity',
    github: `https://github.com/${GITHUB_USER}`,
    demo: null,
    featured: true,
  },
  {
    id: '2d-side-scroller',
    title: '2D Side-Scrolling Adventure',
    desc: 'Platform by platform, hazard by hazard — a layered side-scroller with physics-driven jumping, contextual collision zones, and level design that teaches through play rather than text.',
    tags: ['Unity', 'C#', '2D', 'Platformer'],
    tagColors: ['cyan','green','orange','cyan'],
    icon: 'fa-solid fa-gamepad',
    category: 'unity',
    github: `https://github.com/${GITHUB_USER}`,
    demo: null,
    featured: false,
  },
  {
    id: 'domino-jam',
    title: 'Domino (Egypt Game Jam — 2nd Place)',
    desc: 'Jam-forged in crunch time: full domino rule enforcement, placement validation, and turn-based state management — all under game-jam pressure. Won 2nd place at ITI Egypt Game Jam 2026.',
    tags: ['Unity', 'C#', 'Game Jam', 'Board Game'],
    tagColors: ['cyan','green','orange','purple'],
    icon: 'fa-solid fa-trophy',
    category: 'unity',
    github: `https://github.com/${GITHUB_USER}`,
    demo: null,
    featured: true,
  },
  {
    id: 'kg-webgl',
    title: 'Educational WebGL Games (KG1 & KG2)',
    desc: 'Two browser-native games crafted for the youngest players — zero install, pure interaction. Each mechanic is a disguised cognitive exercise, turning screen time into skill-building for kindergarteners.',
    tags: ['Unity', 'WebGL', 'Educational', 'C#'],
    tagColors: ['cyan','orange','green','green'],
    icon: 'fa-solid fa-children',
    category: 'webgl',
    github: `https://github.com/${GITHUB_USER}`,
    demo: null,
    featured: false,
  },
];

/* Tag color mapping */
function tagColor(color) {
  const map = { cyan:'tag-cyan', orange:'tag-orange', green:'tag-green', purple:'tag-purple' };
  return map[color] || 'tag-cyan';
}

/* Render a single project card */
function renderCard(proj) {
  const tagsHtml = proj.tags.map((t, i) =>
    `<span class="tag ${tagColor(proj.tagColors?.[i] || 'cyan')}">${t}</span>`
  ).join('');
  const githubLink = proj.github
    ? `<a href="${proj.github}" target="_blank" rel="noopener" class="proj-link" title="GitHub"><i class="fa-brands fa-github"></i></a>`
    : '';
  const demoLink = proj.demo
    ? `<a href="${proj.demo}" target="_blank" rel="noopener" class="proj-link" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
    : '';

  return `
    <article class="proj-card reveal" data-category="${proj.category}">
      <div class="proj-card-top">
        <div class="proj-icon"><i class="${proj.icon}"></i></div>
        <div class="proj-links">${githubLink}${demoLink}</div>
      </div>
      <div class="proj-title">${proj.title}</div>
      <div class="proj-desc">${proj.desc}</div>
      <div class="proj-tags">${tagsHtml}</div>
    </article>
  `;
}

/* Fetch live repos from GitHub and inject as cards */
async function fetchGitHubRepos(grid) {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=10`);
    if (!res.ok) return;
    const repos = await res.json();

    // Filter out forks, and repos already shown statically
    const staticIds = STATIC_PROJECTS.map(p => p.id);
    const interesting = repos.filter(r =>
      !r.fork && r.description && r.stargazers_count >= 0
    );

    interesting.forEach(repo => {
      // Map repo language to tag colors
      const langColorMap = {
        'C#': 'cyan', 'C++': 'orange', 'C': 'orange',
        'Python': 'green', 'JavaScript': 'green', 'HTML': 'purple',
      };
      const lang = repo.language || 'Code';
      const langColor = langColorMap[lang] || 'cyan';

      const proj = {
        id: repo.name,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        desc: repo.description || 'A project from my GitHub.',
        tags: [lang, ...(repo.topics || []).slice(0,2)],
        tagColors: [langColor, 'purple', 'green'],
        icon: 'fa-brands fa-github',
        category: 'github',
        github: repo.html_url,
        demo: repo.homepage || null,
        featured: false,
      };
      const el = document.createElement('div');
      el.innerHTML = renderCard(proj);
      const card = el.firstElementChild;
      grid.appendChild(card);
      // Trigger reveal observer
      if (window._revealObserver) window._revealObserver.observe(card);
    });

    // Remove loading spinner if present
    const loader = grid.querySelector('.gh-loading');
    if (loader) loader.remove();
  } catch(e) {
    const loader = grid.querySelector('.gh-loading');
    if (loader) loader.textContent = '// github fetch failed — check connection';
  }
}

/* Initialise projects section */
function initProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Render static cards
  STATIC_PROJECTS.forEach(proj => {
    const el = document.createElement('div');
    el.innerHTML = renderCard(proj);
    grid.appendChild(el.firstElementChild);
  });

  // GitHub live loader placeholder
  const loader = document.createElement('div');
  loader.className = 'gh-loading';
  loader.innerHTML = '<i class="fa-brands fa-github"></i> &nbsp;loading more from github...';
  grid.appendChild(loader);

  fetchGitHubRepos(grid);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.proj-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

window.initProjects = initProjects;
