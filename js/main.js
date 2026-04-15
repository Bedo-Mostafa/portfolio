/* ============================================================
   main.js — Core interactions & init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom cursor ── */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
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

  // Expose so projects.js can use the same observer
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
  const lines = [
    { type: 'cmd',  text: 'whoami' },
    { type: 'out',  text: 'abdelrhman_mostafa — game developer' },
    { type: 'cmd',  text: 'cat skills.txt | grep primary' },
    { type: 'out',  text: 'C# · Unity · C++ · OpenGL · Box2D' },
    { type: 'cmd',  text: 'ls ./awards/' },
    { type: 'out',  text: '2nd_EgyptGameJam.exe  3rd_MiniJam.exe' },
    { type: 'cmd',  text: 'echo $STATUS' },
    { type: 'out',  text: 'open_to_work=true  location=Cairo,Egypt' },
  ];

  const termBody = document.getElementById('term-body');
  if (termBody) {
    let li = 0, ci = 0, delay = 400;

    function typeNext() {
      if (li >= lines.length) {
        // Add blinking cursor at end
        const cursor = document.createElement('span');
        cursor.className = 't-cursor';
        termBody.appendChild(cursor);
        return;
      }
      const line = lines[li];
      const row = document.createElement('div');
      row.className = 't-line';

      if (line.type === 'cmd') {
        row.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd"></span>`;
        termBody.appendChild(row);
        const cmdEl = row.querySelector('.t-cmd');
        typeText(cmdEl, line.text, 40, () => {
          li++;
          setTimeout(typeNext, 120);
        });
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

    setTimeout(typeNext, delay);
  }

  /* ── Footer year ── */
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = `© ${new Date().getFullYear()} Abdelrhman Mostafa Hamed`;

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
  document.querySelectorAll('.skill-group').forEach(g => barObserver.observe(g));

  /* ── Mini game overlay ── */
  const gameOverlay = document.getElementById('mini-game-overlay');
  const gameTrigger = document.querySelector('.game-trigger');
  const gameClose   = document.querySelector('.game-close');

  if (gameTrigger && gameOverlay) {
    gameTrigger.addEventListener('click', () => {
      gameOverlay.classList.add('active');
      if (window.MiniGame) window.MiniGame.init();
    });
  }
  if (gameClose && gameOverlay) {
    gameClose.addEventListener('click', () => {
      gameOverlay.classList.remove('active');
      if (window.MiniGame) window.MiniGame.destroy();
    });
  }

  /* ── Active nav highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) current = s.id;
    });
    navAs.forEach(a => {
      a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  /* ── Init projects (after DOM ready) ── */
  if (window.initProjects) {
    window.initProjects();
    observeAll(); // re-observe newly added cards
    // Slight delay so GitHub cards also get observed
    setTimeout(observeAll, 1500);
  }
});
