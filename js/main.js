// /* ============================================================
//    main.js — Core interactions & init
//    All site content loaded from data.json → window._siteData
//    ============================================================ */

// document.addEventListener('DOMContentLoaded', () => {

//   /* ── Load data.json first, then boot everything ── */
//   fetch('data.json')
//     .then(r => r.json())
//     .then(data => {
//       window._siteData = data;
//       /* populate STATIC_PROJECTS for projects.js */
//       if (window.STATIC_PROJECTS !== undefined) {
//         window.STATIC_PROJECTS.length = 0;
//         data.projects.forEach(p => window.STATIC_PROJECTS.push(p));
//       }
//       /* also set GITHUB_USER */
//       if (data.site && data.site.githubUser) window.GITHUB_USER = data.site.githubUser;
//       boot(data);
//     })
//     .catch(() => boot(null)); /* graceful fallback if fetch fails */

//   function boot(data) {

//     /* ── Custom cursor ── */
//     const cursor = document.getElementById('cursor');
//     if (cursor && window.matchMedia('(pointer: fine)').matches) {
//       document.addEventListener('mousemove', e => {
//         cursor.style.left = e.clientX + 'px';
//         cursor.style.top = e.clientY + 'px';
//       });
//       document.querySelectorAll('a, button, .proj-card, .filter-btn').forEach(el => {
//         el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
//         el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
//       });
//     } else if (cursor) {
//       cursor.style.display = 'none';
//     }

//     /* ── Scroll reveal ── */
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry, i) => {
//         if (entry.isIntersecting) {
//           setTimeout(() => entry.target.classList.add('visible'), i * 70);
//           observer.unobserve(entry.target);
//         }
//       });
//     }, { threshold: 0.08 });

//     function observeAll() {
//       document.querySelectorAll('.reveal').forEach(el => {
//         if (!el.classList.contains('visible')) observer.observe(el);
//       });
//     }
//     observeAll();
//     window._revealObserver = observer;

//     /* ── Nav hamburger ── */
//     const toggle = document.querySelector('.nav-toggle');
//     const navLinks = document.querySelector('.nav-links');
//     if (toggle && navLinks) {
//       toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
//       navLinks.querySelectorAll('a').forEach(a => {
//         a.addEventListener('click', () => navLinks.classList.remove('open'));
//       });
//     }

//     /* ── Terminal typewriter ── */
//     const lines = (data && data.terminal) || [
//       { type: 'cmd', text: 'whoami' },
//       { type: 'out', text: 'abdelrhman_mostafa — game developer' },
//       { type: 'cmd', text: 'echo $STATUS' },
//       { type: 'highlight', text: 'open_to_work=true', note: '  location=Cairo,Egypt' },
//     ];

//     const termBody = document.getElementById('term-body');
//     if (termBody) {
//       let li = 0;

//       function typeNext() {
//         if (li >= lines.length) {
//           const cur = document.createElement('span');
//           cur.className = 't-cursor';
//           termBody.appendChild(cur);
//           return;
//         }
//         const line = lines[li];
//         const row = document.createElement('div');
//         row.className = 't-line';

//         if (line.type === 'cmd') {
//           row.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd"></span>`;
//           termBody.appendChild(row);
//           const cmdEl = row.querySelector('.t-cmd');
//           typeText(cmdEl, line.text, 40, () => { li++; setTimeout(typeNext, 120); });
//         } else if (line.type === 'highlight') {
//           row.innerHTML = `<span class="t-out"><span class="t-highlight">${line.text}</span><span class="t-out-dim">${line.note || ''}</span></span>`;
//           row.style.opacity = '0';
//           termBody.appendChild(row);
//           setTimeout(() => { row.style.transition = 'opacity 0.3s'; row.style.opacity = '1'; }, 60);
//           li++;
//           setTimeout(typeNext, 220);
//         } else {
//           row.innerHTML = `<span class="t-out">${line.text}</span>`;
//           row.style.opacity = '0';
//           termBody.appendChild(row);
//           setTimeout(() => { row.style.transition = 'opacity 0.3s'; row.style.opacity = '1'; }, 60);
//           li++;
//           setTimeout(typeNext, 220);
//         }
//       }

//       function typeText(el, text, speed, done) {
//         let i = 0;
//         const iv = setInterval(() => {
//           el.textContent += text[i++];
//           if (i >= text.length) { clearInterval(iv); done && done(); }
//         }, speed);
//       }

//       setTimeout(typeNext, 400);
//     }

//     /* ── Footer year ── */
//     const yr = document.getElementById('footer-year');
//     if (yr) yr.textContent = `© ${new Date().getFullYear()} ${(data && data.site && data.site.fullName) || 'Abdelrhman Mostafa Hamed'}`;

//     /* ── Populate fun-facts grid from data.json ── */
//     if (data && data.funFacts) {
//       const grid = document.getElementById('fun-facts-grid');
//       if (grid) {
//         grid.innerHTML = data.funFacts.map(f =>
//           `<div class="fun-fact-item">
//             <span class="fun-fact-key">${f.key}</span>
//             <span class="fun-fact-eq"> = </span>
//             <span class="fun-fact-val">${f.val}</span>
//           </div>`
//         ).join('');
//       }
//     }

//     /* ── Skill bars animate on scroll ── */
//     const barObserver = new IntersectionObserver(entries => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
//             bar.style.width = bar.dataset.pct + '%';
//           });
//           barObserver.unobserve(entry.target);
//         }
//       });
//     }, { threshold: 0.2 });
//     document.querySelectorAll('.skill-group').forEach(g => barObserver.observe(g));

//     /* ── Mini game overlay ── */
//     const gameOverlay = document.getElementById('mini-game-overlay');
//     const navGameLink = document.getElementById('nav-game-link');
//     const gameClose = document.querySelector('.game-close');

//     if (navGameLink && gameOverlay) {
//       navGameLink.addEventListener('click', (e) => {
//         e.preventDefault();
//         gameOverlay.classList.add('active');
//         if (window.MiniGame) window.MiniGame.init();
//         if (navLinks) navLinks.classList.remove('open');
//       });
//     }
//     if (gameClose && gameOverlay) {
//       gameClose.addEventListener('click', () => {
//         gameOverlay.classList.remove('active');
//         if (window.MiniGame) window.MiniGame.destroy();
//       });
//     }

//     /* ── Fun Facts unlock (called from minigame) ── */
//     window.unlockFunFacts = function () {
//       const section = document.getElementById('fun-facts');
//       if (!section || section.classList.contains('unlocked')) return;
//       section.classList.add('unlocked');
//       showToast('// fun_facts.txt unlocked');
//     };

//     function showToast(msg) {
//       const t = document.createElement('div');
//       t.className = 'game-toast';
//       t.innerHTML = `<i class="fa-solid fa-terminal"></i> ${msg}`;
//       document.body.appendChild(t);
//       requestAnimationFrame(() => t.classList.add('show'));
//       setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3200);
//     }

//     /* ── Active nav highlight on scroll ── */
//     const sections = document.querySelectorAll('section[id]');
//     const navAs = document.querySelectorAll('.nav-links a');
//     window.addEventListener('scroll', () => {
//       let current = '';
//       sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
//       navAs.forEach(a => {
//         a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
//       });
//     }, { passive: true });

//     /* ── Init projects ── */
//     if (window.initProjects) {
//       window.initProjects();
//       observeAll();
//       setTimeout(observeAll, 1500);
//     }

//   } /* end boot() */
// });


/* ============================================================
   main.js — Core interactions & init
   All site content loaded from data.json → window._siteData
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Load data.json first, then boot everything ── */
  fetch('data.json')
    .then(r => r.json())
    .then(data => {
      window._siteData = data;
      /* populate STATIC_PROJECTS for projects.js */
      if (window.STATIC_PROJECTS !== undefined) {
        window.STATIC_PROJECTS.length = 0;
        data.projects.forEach(p => window.STATIC_PROJECTS.push(p));
      }
      /* also set GITHUB_USER */
      if (data.site && data.site.githubUser) window.GITHUB_USER = data.site.githubUser;
      boot(data);
    })
    .catch(() => boot(null)); /* graceful fallback if fetch fails */

  function boot(data) {

    /* ── Custom cursor ── */
    const cursor = document.getElementById('cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
      document.querySelectorAll('a, button, .proj-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    } else if (cursor) {
      cursor.style.display = 'none';
    }

    /* ── Scroll reveal ── */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 70);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    function observeAll() {
      document.querySelectorAll('.reveal').forEach(el => {
        if (!el.classList.contains('visible')) observer.observe(el);
      });
    }
    observeAll();
    window._revealObserver = observer;

    /* ── Nav hamburger ── */
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
      });
    }

    /* ── Terminal typewriter ── */
    const lines = (data && data.terminal) || [
      { type: 'cmd', text: 'whoami' },
      { type: 'out', text: 'abdelrhman_mostafa — game developer' },
      { type: 'cmd', text: 'echo $STATUS' },
      { type: 'highlight', text: 'open_to_work=true', note: '  location=Cairo,Egypt' },
    ];

    const termBody = document.getElementById('term-body');
    if (termBody) {
      let li = 0;

      function typeNext() {
        if (li >= lines.length) {
          const cur = document.createElement('span');
          cur.className = 't-cursor';
          termBody.appendChild(cur);
          return;
        }
        const line = lines[li];
        const row = document.createElement('div');
        row.className = 't-line';

        if (line.type === 'cmd') {
          row.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd"></span>`;
          termBody.appendChild(row);
          const cmdEl = row.querySelector('.t-cmd');
          typeText(cmdEl, line.text, 40, () => { li++; setTimeout(typeNext, 120); });
        } else if (line.type === 'highlight') {
          row.innerHTML = `<span class="t-out"><span class="t-highlight">${line.text}</span><span class="t-out-dim">${line.note || ''}</span></span>`;
          row.style.opacity = '0';
          termBody.appendChild(row);
          setTimeout(() => { row.style.transition = 'opacity 0.3s'; row.style.opacity = '1'; }, 60);
          li++;
          setTimeout(typeNext, 220);
        } else {
          row.innerHTML = `<span class="t-out">${line.text}</span>`;
          row.style.opacity = '0';
          termBody.appendChild(row);
          setTimeout(() => { row.style.transition = 'opacity 0.3s'; row.style.opacity = '1'; }, 60);
          li++;
          setTimeout(typeNext, 220);
        }
      }

      function typeText(el, text, speed, done) {
        let i = 0;
        const iv = setInterval(() => {
          el.textContent += text[i++];
          if (i >= text.length) { clearInterval(iv); done && done(); }
        }, speed);
      }

      setTimeout(typeNext, 400);
    }

    /* ── Footer year ── */
    const yr = document.getElementById('footer-year');
    if (yr) yr.textContent = `© ${new Date().getFullYear()} ${(data && data.site && data.site.fullName) || 'Abdelrhman Mostafa Hamed'}`;

    /* ── Populate skills grid from data.json ── */
    if (data && data.skills) {
      const skillsGrid = document.getElementById('skills-grid');
      if (skillsGrid) {
        skillsGrid.innerHTML = data.skills.map(group => {
          const items = group.items.map(item => {
            const colorClass = item.color ? ` ${item.color}` : '';
            return `<div class="skill-item">${item.name}
              <div class="skill-bar-wrap">
                <div class="skill-bar-track">
                  <div class="skill-bar-fill${colorClass}" data-pct="${item.pct}"></div>
                </div>
              </div>
            </div>`;
          }).join('');
          return `<div class="skill-group reveal">
            <div class="skill-group-title"><i class="${group.icon}"></i> ${group.group}</div>
            <div class="skill-list">${items}</div>
          </div>`;
        }).join('');

      }
    }

    /* ── Populate fun-facts grid from data.json ── */
    if (data && data.funFacts) {
      const grid = document.getElementById('fun-facts-grid');
      if (grid) {
        grid.innerHTML = data.funFacts.map(f =>
          `<div class="fun-fact-item">
            <span class="fun-fact-key">${f.key}</span>
            <span class="fun-fact-eq"> = </span>
            <span class="fun-fact-val">${f.val}</span>
          </div>`
        ).join('');
      }
    }

    /* ── Skill bars animate on scroll ── */
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.pct + '%';
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    /* observe both static and JS-rendered skill groups */
    document.querySelectorAll('.skill-group').forEach(g => barObserver.observe(g));
    /* also observe any already-rendered dynamic groups */
    const dynGrid = document.getElementById('skills-grid');
    if (dynGrid) dynGrid.querySelectorAll('.skill-group').forEach(g => barObserver.observe(g));

    /* ── Mini game overlay ── */
    const gameOverlay = document.getElementById('mini-game-overlay');
    const navGameLink = document.getElementById('nav-game-link');
    const gameClose = document.querySelector('.game-close');

    if (navGameLink && gameOverlay) {
      navGameLink.addEventListener('click', (e) => {
        e.preventDefault();
        gameOverlay.classList.add('active');
        if (window.MiniGame) window.MiniGame.init();
        if (navLinks) navLinks.classList.remove('open');
      });
    }
    if (gameClose && gameOverlay) {
      gameClose.addEventListener('click', () => {
        gameOverlay.classList.remove('active');
        if (window.MiniGame) window.MiniGame.destroy();
      });
    }

    /* ── Fun Facts unlock (called from minigame) ── */
    window.unlockFunFacts = function () {
      const section = document.getElementById('fun-facts');
      if (!section || section.classList.contains('unlocked')) return;
      section.classList.add('unlocked');
      showToast('// fun_facts.txt unlocked');
    };

    function showToast(msg) {
      const t = document.createElement('div');
      t.className = 'game-toast';
      t.innerHTML = `<i class="fa-solid fa-terminal"></i> ${msg}`;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3200);
    }

    /* ── Active nav highlight on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
      navAs.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
      });
    }, { passive: true });

    /* ── Init projects ── */
    if (window.initProjects) {
      window.initProjects();
      observeAll();
      setTimeout(observeAll, 1500);
    }

  } /* end boot() */
});