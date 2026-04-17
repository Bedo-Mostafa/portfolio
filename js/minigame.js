/* ============================================================
   minigame.js — Byte Dodger (Easter Egg)
   WASD / Arrows to move · Space / Z to shoot · R to restart
   ============================================================ */

(function () {
  var COLORS = {
    accent: '#00e5ff',
    accent2: '#ff6b35',
    accent3: '#a8ff3e',
    dim: '#1a2a35',
    bg: '#0a1219',
  };

  var canvas, ctx, gameLoop, state, explosions;
  var keydownHandler, keyupHandler;

  /* ── INIT ── */
  function init() {
    canvas = document.getElementById('mini-game-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    var size = Math.min(window.innerWidth - 40, 520);
    canvas.width = size;
    canvas.height = Math.round(size * 0.65);

    explosions = [];
    resetState();
    bindControls();
    clearInterval(gameLoop);
    gameLoop = setInterval(tick, 1000 / 60);
  }

  /* ── FULL RESET ── */
  function resetState() {
    explosions = [];
    state = {
      player: {
        x: canvas.width / 2,
        y: canvas.height - 40,
        w: 14, h: 18,
        speed: 4, dx: 0, dy: 0,
        invincible: 0,
        trail: [],
      },
      bullets: [],
      enemies: [],
      stars: (function () {
        var arr = [];
        for (var i = 0; i < 55; i++) arr.push({
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
      keys: {},
      funFactsUnlocked: false,
    };
  }

  /* ── BIND CONTROLS (called once per init; remove old listeners first) ── */
  function bindControls() {
    if (keydownHandler) document.removeEventListener('keydown', keydownHandler);
    if (keyupHandler) document.removeEventListener('keyup', keyupHandler);

    keydownHandler = function (e) {
      if (!state) return;
      state.keys[e.key] = true;
      if (!state.started && !state.over) state.started = true;
      if (state.over && (e.key === 'r' || e.key === 'R')) {
        doRestart();
        return;
      }
      if ((e.key === ' ' || e.key === 'z' || e.key === 'Z') && state.started && !state.over) {
        fireBullet();
        e.preventDefault(); /* stop page scroll */
      }
    };
    keyupHandler = function (e) {
      if (state) state.keys[e.key] = false;
    };

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    /* Touch */
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (!state) return;
      var touch = e.touches[0];
      var rect = canvas.getBoundingClientRect();
      state.player.x = touch.clientX - rect.left;
      state.player.y = touch.clientY - rect.top;
      if (!state.started) state.started = true;
    }, { passive: false });

    canvas.addEventListener('touchstart', function (e) {
      if (!state) return;
      if (!state.started) { state.started = true; return; }
      if (state.over) { doRestart(); return; }
      fireBullet();
    });
  }

  /* ── RESTART (keeps canvas alive, re-uses same loop) ── */
  function doRestart() {
    var wasUnlocked = state && state.funFactsUnlocked;
    resetState();
    state.started = true;
    if (wasUnlocked) state.funFactsUnlocked = true;
  }

  /* ── SHOOT ── */
  function fireBullet() {
    if (!state || !canvas) return;
    state.bullets.push({ x: state.player.x, y: state.player.y - 10, spd: 9 });
  }

  /* ── SPAWN ENEMY ── */
  function spawnEnemy() {
    var diff = state.score;
    var types = [
      { w: 12, h: 12, icon: '◆', color: COLORS.accent2, pts: 10, spd: 1.5 + diff / 900 },
      { w: 16, h: 12, icon: '▶', color: '#c678ff', pts: 20, spd: 2.2 + diff / 700 },
      { w: 8, h: 8, icon: '●', color: COLORS.accent, pts: 5, spd: 3.2 + diff / 600 },
    ];
    var t = types[Math.floor(Math.random() * types.length)];
    state.enemies.push({ x: Math.random() * (canvas.width - 20) + 10, y: -16, angle: 0, ...t });
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

    if (!state.over && state.started) {
      /* Movement */
      player.dx = 0; player.dy = 0;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.dx = -player.speed;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx = player.speed;
      if (keys['ArrowUp'] || keys['w'] || keys['W']) player.dy = -player.speed;
      if (keys['ArrowDown'] || keys['s'] || keys['S']) player.dy = player.speed;

      player.x = Math.max(player.w, Math.min(canvas.width - player.w, player.x + player.dx));
      player.y = Math.max(player.h, Math.min(canvas.height - player.h, player.y + player.dy));

      /* Trail */
      player.trail.push({ x: player.x, y: player.y });
      if (player.trail.length > 9) player.trail.shift();

      /* Spawn */
      var spawnRate = Math.max(30, 80 - state.score / 12);
      if (state.frame % Math.floor(spawnRate) === 0) spawnEnemy();

      /* Move bullets */
      for (var bi = bullets.length - 1; bi >= 0; bi--) bullets[bi].y -= bullets[bi].spd;
      state.bullets = bullets.filter(function (b) { return b.y > -10; });

      /* Move enemies */
      var newEnemies = [];
      for (var ei = 0; ei < enemies.length; ei++) {
        enemies[ei].y += enemies[ei].spd;
        enemies[ei].angle += 0.05;
        if (enemies[ei].y < canvas.height + 20) newEnemies.push(enemies[ei]);
      }
      state.enemies = newEnemies;

      /* Bullet-enemy collision */
      var bArr = state.bullets;
      var eArr = state.enemies;
      for (var bi2 = bArr.length - 1; bi2 >= 0; bi2--) {
        for (var ei2 = eArr.length - 1; ei2 >= 0; ei2--) {
          var b = bArr[bi2], e = eArr[ei2];
          if (Math.abs(b.x - e.x) < e.w && Math.abs(b.y - e.y) < e.h) {
            bArr.splice(bi2, 1);
            var pts = e.pts;
            var ex = e.x, ey = e.y, ec = e.color;
            eArr.splice(ei2, 1);
            state.score += pts;
            spawnExplosion(ex, ey, ec);
            /* Unlock fun facts at 80 pts */
            if (state.score >= 80 && !state.funFactsUnlocked) {
              state.funFactsUnlocked = true;
              if (window.unlockFunFacts) window.unlockFunFacts();
            }
            break;
          }
        }
      }

      /* Player-enemy collision */
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

    /* Stars always scroll */
    for (var si = 0; si < stars.length; si++) {
      stars[si].y += stars[si].spd;
      if (stars[si].y > canvas.height) {
        stars[si].y = 0;
        stars[si].x = Math.random() * canvas.width;
      }
    }

    draw();
  }

  /* ── EXPLOSION ── */
  function spawnExplosion(x, y, color) {
    var particles = [];
    for (var i = 0; i < 9; i++) {
      particles.push({ angle: (i / 9) * Math.PI * 2, spd: Math.random() * 3 + 1, life: 1 });
    }
    explosions.push({ x: x, y: y, color: color, particles: particles });
  }

  /* ── DRAW ── */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Stars */
    state.stars.forEach(function (s) {
      ctx.fillStyle = 'rgba(0,229,255,' + (s.r * 0.28) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });

    if (!state.started) {
      drawCentered('BYTE DODGER', canvas.height / 2 - 30, COLORS.accent, 18);
      drawCentered('Arrow / WASD to move   Space / Z to shoot', canvas.height / 2, COLORS.dim, 11);
      drawCentered('Touch: drag to move, tap to shoot', canvas.height / 2 + 20, COLORS.dim, 10);
      drawCentered('Reach 80 pts → unlock fun_facts.txt in About', canvas.height / 2 + 42, COLORS.accent3, 10);
      drawCentered('Press any key or tap to start', canvas.height / 2 + 62, COLORS.accent2, 11);
      drawHUD();
      return;
    }

    /* Player trail */
    state.player.trail.forEach(function (pt, i) {
      var alpha = (i / state.player.trail.length) * 0.38;
      ctx.fillStyle = 'rgba(0,229,255,' + alpha + ')';
      ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
    });

    /* Player ship */
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
      ctx.shadowColor = COLORS.accent; ctx.shadowBlur = 14;
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    }

    /* Bullets */
    state.bullets.forEach(function (b) {
      ctx.fillStyle = COLORS.accent3;
      ctx.shadowColor = COLORS.accent3; ctx.shadowBlur = 8;
      ctx.fillRect(b.x - 2, b.y - 7, 4, 14);
    });
    ctx.shadowBlur = 0;

    /* Enemies */
    state.enemies.forEach(function (e) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle);
      ctx.font = (e.w * 1.5) + 'px monospace';
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color; ctx.shadowBlur = 12;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(e.icon, 0, 0);
      ctx.restore();
      ctx.shadowBlur = 0;
    });

    /* Explosions */
    for (var xi = explosions.length - 1; xi >= 0; xi--) {
      var ex = explosions[xi];
      var alive = false;
      ex.particles.forEach(function (p) {
        if (p.life <= 0) return;
        p.life -= 0.048;
        alive = true;
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

    /* Game over screen */
    if (state.over) {
      ctx.fillStyle = 'rgba(4,8,13,0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCentered('GAME OVER', canvas.height / 2 - 28, COLORS.accent2, 24);
      drawCentered('SCORE: ' + state.score, canvas.height / 2 + 6, COLORS.accent, 16);
      drawCentered('Press R to restart  |  Tap to restart', canvas.height / 2 + 36, COLORS.dim, 11);
    }
  }

  /* ── HUD ── */
  function drawHUD() {
    ctx.font = '11px Share Tech Mono, monospace';
    ctx.fillStyle = COLORS.accent;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('SCORE: ' + state.score, 10, 10);
    ctx.fillStyle = COLORS.accent2;
    ctx.textAlign = 'right';
    var hearts = '';
    for (var i = 0; i < state.lives; i++) hearts += '♥ ';
    ctx.fillText(hearts.trim(), canvas.width - 10, 10);
    /* unlock hint — only before unlocked */
    if (state.started && !state.over && !state.funFactsUnlocked) {
      ctx.font = '9px Share Tech Mono, monospace';
      ctx.fillStyle = COLORS.accent3;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('80 pts → unlock fun_facts.txt', canvas.width / 2, 10);
    }
  }

  function drawCentered(text, y, color, size) {
    ctx.font = size + 'px Share Tech Mono, monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, y);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* ── DESTROY (called when overlay closes) ── */
  function destroy() {
    clearInterval(gameLoop);
    gameLoop = null;
    if (keydownHandler) document.removeEventListener('keydown', keydownHandler);
    if (keyupHandler) document.removeEventListener('keyup', keyupHandler);
    keydownHandler = null;
    keyupHandler = null;
    state = null;
    explosions = [];
  }

  window.MiniGame = { init: init, destroy: destroy };
})();