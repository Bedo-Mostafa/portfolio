/* ============================================================
   minigame.js — Byte Dodger
   WASD / Arrows to move · Space / Z to shoot · R to restart
   Facts unlocked at score milestones — game pauses to show them
   ============================================================ */

(function () {
  var COLORS = {
    accent: '#00e5ff',
    accent2: '#ff6b35',
    accent3: '#a8ff3e',
    dim: '#1a2a35',
    bg: '#0a1219',
  };

  var FACT_MILESTONES = [];
  var canvas, ctx, gameLoop, state, explosions;
  var keydownHandler, keyupHandler;
  var pauseUI = null;

  /* ── LOAD FACTS from data.json (or window._siteData) then init ── */
  function loadAndInit() {
    if (window._siteData && window._siteData.funFacts) {
      buildMilestones(window._siteData.funFacts);
      init();
    } else {
      fetch('data.json')
        .then(function (r) { return r.json(); })
        .then(function (d) { buildMilestones(d.funFacts || []); init(); })
        .catch(function () { init(); });
    }
  }

  function buildMilestones(facts) {
    FACT_MILESTONES = facts.map(function (f, i) {
      return { score: (i + 1) * 50, key: f.key, val: f.val };
    });
  }

  /* ── INIT ── */
  function init() {
    canvas = document.getElementById('mini-game-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    explosions = [];
    resetState();
    removePauseUI();
    bindControls();
    clearInterval(gameLoop);
    gameLoop = setInterval(tick, 1000 / 60);
  }

  function resizeCanvas() {
    var overlay = document.getElementById('mini-game-overlay');
    var maxW = overlay ? overlay.clientWidth - 48 : window.innerWidth - 48;
    var maxH = window.innerHeight - 160;
    var w = Math.min(maxW, 860);
    var h = Math.min(maxH, Math.round(w * 0.58));
    w = Math.max(w, 340);
    h = Math.max(h, 220);
    canvas.width = w;
    canvas.height = h;
  }

  /* ── FULL RESET ── */
  function resetState() {
    explosions = [];
    state = {
      player: {
        x: canvas.width / 2,
        y: canvas.height - 50,
        w: 14, h: 18,
        speed: 4.5, dx: 0, dy: 0,
        invincible: 0,
        trail: [],
      },
      bullets: [],
      enemies: [],
      stars: (function () {
        var arr = [];
        for (var i = 0; i < 70; i++) arr.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          spd: Math.random() * 0.8 + 0.2,
        });
        return arr;
      })(),
      score: 0,
      lives: 3,
      frame: 0,
      over: false,
      started: false,
      paused: false,
      keys: {},
      seenMilestones: new Set(),
    };
  }

  /* ── PAUSE UI (DOM overlay card) ── */
  function createPauseUI(fact) {
    removePauseUI();
    var wrap = document.createElement('div');
    wrap.id = 'game-pause-ui';
    wrap.innerHTML =
      '<div class="gpu-box">' +
      '<div class="gpu-badge"><i class="fa-solid fa-lock-open"></i>&nbsp; FILE UNLOCKED</div>' +
      '<div class="gpu-score">Score reached: <span class="gpu-score-num">' + state.score + '</span></div>' +
      '<div class="gpu-fact">' +
      '<span class="gpu-key">' + fact.key + '</span>' +
      '<span class="gpu-eq">&nbsp;=&nbsp;</span>' +
      '<span class="gpu-val">' + fact.val + '</span>' +
      '</div>' +
      '<div class="gpu-hint">Press <kbd>Enter</kbd> to resume &nbsp;·&nbsp; <kbd>Esc</kbd> to quit</div>' +
      '<div class="gpu-actions">' +
      '<button class="gpu-btn gpu-resume" id="gpu-resume-btn"><i class="fa-solid fa-play"></i> Resume</button>' +
      '<button class="gpu-btn gpu-quit"   id="gpu-quit-btn"><i class="fa-solid fa-xmark"></i> Quit</button>' +
      '</div>' +
      '</div>';

    var overlay = document.getElementById('mini-game-overlay');
    if (overlay) overlay.appendChild(wrap);
    pauseUI = wrap;

    document.getElementById('gpu-resume-btn').addEventListener('click', resumeGame);
    document.getElementById('gpu-quit-btn').addEventListener('click', quitGame);
  }

  function removePauseUI() {
    if (pauseUI) { pauseUI.remove(); pauseUI = null; }
  }

  function resumeGame() {
    removePauseUI();
    state.paused = false;
    state.player.invincible = Math.max(state.player.invincible, 90);
  }

  function quitGame() {
    removePauseUI();
    var overlay = document.getElementById('mini-game-overlay');
    if (overlay) overlay.classList.remove('active');
    if (window.MiniGame) window.MiniGame.destroy();
  }

  /* ── BIND CONTROLS ── */
  function bindControls() {
    if (keydownHandler) document.removeEventListener('keydown', keydownHandler);
    if (keyupHandler) document.removeEventListener('keyup', keyupHandler);

    keydownHandler = function (e) {
      if (!state) return;
      if (state.paused) {
        if (e.key === 'Enter') { resumeGame(); e.preventDefault(); }
        if (e.key === 'Escape') { quitGame(); e.preventDefault(); }
        return;
      }
      state.keys[e.key] = true;
      if (!state.started && !state.over) state.started = true;
      if (state.over && (e.key === 'r' || e.key === 'R')) { doRestart(); return; }
      if ((e.key === ' ' || e.key === 'z' || e.key === 'Z') && state.started && !state.over) {
        fireBullet();
        e.preventDefault();
      }
    };
    keyupHandler = function (e) { if (state) state.keys[e.key] = false; };

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (!state || state.paused) return;
      var touch = e.touches[0];
      var rect = canvas.getBoundingClientRect();
      state.player.x = touch.clientX - rect.left;
      state.player.y = touch.clientY - rect.top;
      if (!state.started) state.started = true;
    }, { passive: false });

    canvas.addEventListener('touchstart', function (e) {
      if (!state) return;
      if (state.paused) { resumeGame(); return; }
      if (!state.started) { state.started = true; return; }
      if (state.over) { doRestart(); return; }
      fireBullet();
    });
  }

  /* ── RESTART ── */
  function doRestart() {
    removePauseUI();
    resetState();
    state.started = true;
  }

  /* ── SHOOT ── */
  function fireBullet() {
    if (!state || !canvas) return;
    state.bullets.push({ x: state.player.x, y: state.player.y - 12, spd: 10 });
  }

  /* ── SPAWN ENEMY ── */
  function spawnEnemy() {
    var diff = state.score;
    var types = [
      { w: 13, h: 13, icon: '◆', color: COLORS.accent2, pts: 10, spd: 1.6 + diff / 900 },
      { w: 17, h: 13, icon: '▶', color: '#c678ff', pts: 20, spd: 2.3 + diff / 700 },
      { w: 9, h: 9, icon: '●', color: COLORS.accent, pts: 5, spd: 3.4 + diff / 600 },
    ];
    var t = types[Math.floor(Math.random() * types.length)];
    state.enemies.push({
      x: Math.random() * (canvas.width - 20) + 10,
      y: -16, angle: 0,
      w: t.w, h: t.h, icon: t.icon, color: t.color, pts: t.pts, spd: t.spd,
    });
  }

  /* ── CHECK MILESTONES ── */
  function checkMilestones() {
    for (var i = 0; i < FACT_MILESTONES.length; i++) {
      var m = FACT_MILESTONES[i];
      if (state.score >= m.score && !state.seenMilestones.has(m.score)) {
        state.seenMilestones.add(m.score);
        state.paused = true;
        createPauseUI(m);
        return;
      }
    }
  }

  /* ── TICK ── */
  function tick() {
    if (!state || !canvas) return;
    var player = state.player;
    var bullets = state.bullets;
    var enemies = state.enemies;
    var stars = state.stars;
    var keys = state.keys;

    state.frame++;

    for (var si = 0; si < stars.length; si++) {
      stars[si].y += stars[si].spd * (state.paused ? 0.12 : 1);
      if (stars[si].y > canvas.height) { stars[si].y = 0; stars[si].x = Math.random() * canvas.width; }
    }

    if (!state.over && state.started && !state.paused) {
      player.dx = 0; player.dy = 0;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.dx = -player.speed;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx = player.speed;
      if (keys['ArrowUp'] || keys['w'] || keys['W']) player.dy = -player.speed;
      if (keys['ArrowDown'] || keys['s'] || keys['S']) player.dy = player.speed;

      player.x = Math.max(player.w, Math.min(canvas.width - player.w, player.x + player.dx));
      player.y = Math.max(player.h, Math.min(canvas.height - player.h, player.y + player.dy));

      player.trail.push({ x: player.x, y: player.y });
      if (player.trail.length > 9) player.trail.shift();

      var spawnRate = Math.max(28, 80 - state.score / 10);
      if (state.frame % Math.floor(spawnRate) === 0) spawnEnemy();

      for (var bi = bullets.length - 1; bi >= 0; bi--) bullets[bi].y -= bullets[bi].spd;
      state.bullets = bullets.filter(function (b) { return b.y > -10; });

      var newEnemies = [];
      for (var ei = 0; ei < enemies.length; ei++) {
        enemies[ei].y += enemies[ei].spd;
        enemies[ei].angle += 0.05;
        if (enemies[ei].y < canvas.height + 20) newEnemies.push(enemies[ei]);
      }
      state.enemies = newEnemies;

      var bArr = state.bullets;
      var eArr = state.enemies;
      for (var bi2 = bArr.length - 1; bi2 >= 0; bi2--) {
        for (var ei2 = eArr.length - 1; ei2 >= 0; ei2--) {
          var b = bArr[bi2], e = eArr[ei2];
          if (Math.abs(b.x - e.x) < e.w && Math.abs(b.y - e.y) < e.h) {
            bArr.splice(bi2, 1);
            var pts = e.pts, ex2 = e.x, ey2 = e.y, ec = e.color;
            eArr.splice(ei2, 1);
            state.score += pts;
            spawnExplosion(ex2, ey2, ec);
            checkMilestones();
            break;
          }
        }
      }

      if (player.invincible <= 0) {
        for (var ei3 = state.enemies.length - 1; ei3 >= 0; ei3--) {
          var en = state.enemies[ei3];
          if (Math.abs(player.x - en.x) < en.w + 6 && Math.abs(player.y - en.y) < en.h + 6) {
            state.enemies.splice(ei3, 1);
            state.lives--;
            player.invincible = 90;
            spawnExplosion(player.x, player.y, COLORS.accent2);
            if (state.lives <= 0) state.over = true;
            break;
          }
        }
      } else {
        player.invincible--;
      }
    }

    draw();
  }

  /* ── EXPLOSION ── */
  function spawnExplosion(x, y, color) {
    var particles = [];
    for (var i = 0; i < 10; i++) {
      particles.push({ angle: (i / 10) * Math.PI * 2, spd: Math.random() * 3 + 1, life: 1 });
    }
    explosions.push({ x: x, y: y, color: color, particles: particles });
  }

  /* ── DRAW ── */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    state.stars.forEach(function (s) {
      ctx.fillStyle = 'rgba(0,229,255,' + (s.r * 0.28) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });

    if (!state.started) {
      var firstScore = FACT_MILESTONES.length > 0 ? FACT_MILESTONES[0].score : 50;
      drawCentered('BYTE DODGER', canvas.height / 2 - 44, COLORS.accent, 22);
      drawCentered('Arrow / WASD to move   Space / Z to shoot', canvas.height / 2 - 4, COLORS.dim, 12);
      drawCentered('Touch: drag to move, tap to shoot', canvas.height / 2 + 18, COLORS.dim, 11);
      drawCentered('Every ' + firstScore + ' pts → game pauses & reveals a fact about me', canvas.height / 2 + 44, COLORS.accent3, 11);
      drawCentered('Press any key or tap to start', canvas.height / 2 + 68, COLORS.accent2, 13);
      drawHUD();
      return;
    }

    state.player.trail.forEach(function (pt, i) {
      ctx.fillStyle = 'rgba(0,229,255,' + (i / state.player.trail.length * 0.38) + ')';
      ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
    });

    var player = state.player;
    if (!state.over && (player.invincible <= 0 || state.frame % 6 < 3)) {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.beginPath();
      ctx.moveTo(0, -player.h);
      ctx.lineTo(player.w * 0.6, player.h * 0.5);
      ctx.lineTo(0, player.h * 0.2);
      ctx.lineTo(-player.w * 0.6, player.h * 0.5);
      ctx.closePath();
      ctx.fillStyle = COLORS.accent;
      ctx.shadowColor = COLORS.accent;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    }

    state.bullets.forEach(function (b) {
      ctx.fillStyle = COLORS.accent3;
      ctx.shadowColor = COLORS.accent3;
      ctx.shadowBlur = 8;
      ctx.fillRect(b.x - 2, b.y - 8, 4, 16);
    });
    ctx.shadowBlur = 0;

    state.enemies.forEach(function (e) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle);
      ctx.font = (e.w * 1.5) + 'px monospace';
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 12;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.icon, 0, 0);
      ctx.restore();
      ctx.shadowBlur = 0;
    });

    for (var xi = explosions.length - 1; xi >= 0; xi--) {
      var ex = explosions[xi];
      var alive = false;
      ex.particles.forEach(function (p) {
        if (p.life <= 0) return;
        p.life -= 0.048; alive = true;
        var px = ex.x + Math.cos(p.angle) * p.spd * (1 - p.life) * 22;
        var py = ex.y + Math.sin(p.angle) * p.spd * (1 - p.life) * 22;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = ex.color;
        ctx.fillRect(px - 2, py - 2, 5, 5);
      });
      ctx.globalAlpha = 1;
      if (!alive) explosions.splice(xi, 1);
    }

    drawHUD();

    if (state.paused) {
      ctx.fillStyle = 'rgba(4,8,13,0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (state.over) {
      ctx.fillStyle = 'rgba(4,8,13,0.82)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCentered('GAME OVER', canvas.height / 2 - 36, COLORS.accent2, 28);
      drawCentered('SCORE: ' + state.score, canvas.height / 2 + 8, COLORS.accent, 18);
      var u = state.seenMilestones.size;
      if (u > 0) drawCentered('Facts revealed: ' + u + ' / ' + FACT_MILESTONES.length, canvas.height / 2 + 38, COLORS.accent3, 12);
      drawCentered('Press R to restart  |  Tap to restart', canvas.height / 2 + 66, COLORS.dim, 12);
    }
  }

  /* ── HUD ── */
  function drawHUD() {
    ctx.font = '13px Share Tech Mono, monospace';
    ctx.fillStyle = COLORS.accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('SCORE: ' + state.score, 12, 12);

    ctx.fillStyle = COLORS.accent2;
    ctx.textAlign = 'right';
    var hearts = '';
    for (var i = 0; i < state.lives; i++) hearts += '♥ ';
    ctx.fillText(hearts.trim(), canvas.width - 12, 12);

    var nextM = null;
    for (var i = 0; i < FACT_MILESTONES.length; i++) {
      if (!state.seenMilestones.has(FACT_MILESTONES[i].score)) { nextM = FACT_MILESTONES[i]; break; }
    }
    if (nextM && state.started && !state.over && !state.paused) {
      ctx.font = '10px Share Tech Mono, monospace';
      ctx.fillStyle = COLORS.accent3;
      ctx.textAlign = 'center';
      ctx.fillText(nextM.score + ' pts → next fact', canvas.width / 2, 12);
    }
  }

  function drawCentered(text, y, color, size) {
    ctx.font = size + 'px Share Tech Mono, monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, y);
  }

  /* ── DESTROY ── */
  function destroy() {
    clearInterval(gameLoop); gameLoop = null;
    removePauseUI();
    if (keydownHandler) document.removeEventListener('keydown', keydownHandler);
    if (keyupHandler) document.removeEventListener('keyup', keyupHandler);
    keydownHandler = null; keyupHandler = null;
    state = null; explosions = [];
  }

  window.MiniGame = { init: loadAndInit, destroy: destroy };
})();