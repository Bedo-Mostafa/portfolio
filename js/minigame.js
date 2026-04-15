/* ============================================================
   minigame.js — Pixel Dodger (Easter Egg)
   Arrow keys / WASD to move, dodge incoming bytes
   ============================================================ */

(function() {
  const COLORS = {
    accent:  '#00e5ff',
    accent2: '#ff6b35',
    accent3: '#a8ff3e',
    dim:     '#1a2a35',
    bg:      '#0a1219',
  };

  let canvas, ctx, gameLoop, state;

  function init() {
    canvas = document.getElementById('mini-game-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Responsive size
    const size = Math.min(window.innerWidth - 40, 500);
    canvas.width  = size;
    canvas.height = Math.round(size * 0.65);

    resetState();
    bindControls();
    gameLoop = setInterval(tick, 1000 / 60);
  }

  function resetState() {
    state = {
      player: {
        x: canvas.width / 2,
        y: canvas.height - 40,
        w: 14, h: 18,
        speed: 4, dx: 0, dy: 0,
        invincible: 0,
        trail: [],
      },
      bullets:  [],
      enemies:  [],
      stars:    Array.from({length: 50}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        spd: Math.random() * 0.8 + 0.2,
      })),
      score:   0,
      lives:   3,
      frame:   0,
      over:    false,
      started: false,
      keys:    {},
    };
  }

  function bindControls() {
    document.addEventListener('keydown', e => {
      state.keys[e.key] = true;
      if (!state.started && !state.over) { state.started = true; }
      if (state.over && e.key === 'r') { resetState(); state.started = true; }
      // Shoot
      if ((e.key === ' ' || e.key === 'z') && state.started && !state.over) {
        fireBullet();
      }
    });
    document.addEventListener('keyup', e => { state.keys[e.key] = false; });

    // Touch controls
    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      state.player.x = touch.clientX - rect.left;
      state.player.y = touch.clientY - rect.top;
      if (!state.started) state.started = true;
    }, { passive: false });

    canvas.addEventListener('touchstart', e => {
      if (!state.started) state.started = true;
      fireBullet();
    });
  }

  function fireBullet() {
    state.bullets.push({ x: state.player.x, y: state.player.y - 10, spd: 8 });
  }

  function spawnEnemy() {
    const types = [
      { w:12, h:12, icon:'◆', color: COLORS.accent2, pts:10, spd: 1.5 + state.score/800 },
      { w:18, h:12, icon:'▶', color: COLORS.accent4 || '#c678ff', pts:20, spd: 2 + state.score/600 },
      { w: 8, h: 8, icon:'●', color: COLORS.accent, pts:5,  spd: 3 + state.score/500 },
    ];
    const t = types[Math.floor(Math.random() * types.length)];
    state.enemies.push({
      x: Math.random() * (canvas.width - 20) + 10,
      y: -16,
      ...t,
      angle: 0,
    });
  }

  function tick() {
    if (!state) return;
    const { player, bullets, enemies, stars, keys } = state;
    state.frame++;

    // Input
    if (!state.over && state.started) {
      player.dx = 0; player.dy = 0;
      if (keys['ArrowLeft'] || keys['a'] || keys['A'])  player.dx = -player.speed;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx =  player.speed;
      if (keys['ArrowUp'] || keys['w'] || keys['W'])    player.dy = -player.speed;
      if (keys['ArrowDown'] || keys['s'] || keys['S'])  player.dy =  player.speed;

      player.x = Math.max(player.w, Math.min(canvas.width - player.w, player.x + player.dx));
      player.y = Math.max(player.h, Math.min(canvas.height - player.h, player.y + player.dy));

      // Trail
      player.trail.push({ x: player.x, y: player.y });
      if (player.trail.length > 8) player.trail.shift();

      // Spawn enemies
      const spawnRate = Math.max(35, 80 - state.score / 15);
      if (state.frame % spawnRate === 0) spawnEnemy();

      // Move bullets
      bullets.forEach(b => { b.y -= b.spd; });
      state.bullets = bullets.filter(b => b.y > -10);

      // Move enemies + collision
      enemies.forEach(e => {
        e.y += e.spd;
        e.angle += 0.05;
      });

      // Bullet-enemy collision
      for (let bi = bullets.length - 1; bi >= 0; bi--) {
        for (let ei = enemies.length - 1; ei >= 0; ei--) {
          const b = bullets[bi], e = enemies[ei];
          if (Math.abs(b.x - e.x) < e.w && Math.abs(b.y - e.y) < e.h) {
            bullets.splice(bi, 1);
            enemies.splice(ei, 1);
            state.score += e.pts;
            spawnExplosion(e.x, e.y, e.color);
            break;
          }
        }
      }

      // Player-enemy collision
      if (player.invincible <= 0) {
        for (let ei = enemies.length - 1; ei >= 0; ei--) {
          const e = enemies[ei];
          if (Math.abs(player.x - e.x) < e.w + 6 && Math.abs(player.y - e.y) < e.h + 6) {
            enemies.splice(ei, 1);
            state.lives--;
            player.invincible = 90;
            if (state.lives <= 0) { state.over = true; }
            break;
          }
        }
      } else {
        player.invincible--;
      }

      // Remove offscreen enemies
      state.enemies = enemies.filter(e => e.y < canvas.height + 20);
    }

    // Scrolling stars
    stars.forEach(s => { s.y += s.spd; if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; } });

    draw();
  }

  const explosions = [];
  function spawnExplosion(x, y, color) {
    explosions.push({
      x, y, color,
      particles: Array.from({length: 8}, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        spd: Math.random() * 3 + 1,
        life: 1,
      })),
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    state.stars.forEach(s => {
      ctx.fillStyle = `rgba(0,229,255,${s.r * 0.3})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    });

    if (!state.started) {
      drawCentered('PRESS ANY KEY', canvas.height/2 - 18, COLORS.accent, 14);
      drawCentered('Arrow/WASD + Space/Z to shoot', canvas.height/2 + 12, COLORS.dim, 11);
      drawCentered('Touch: drag to move, tap to shoot', canvas.height/2 + 30, COLORS.dim, 10);
      drawHUD();
      return;
    }

    // Player trail
    const { player } = state;
    player.trail.forEach((pt, i) => {
      const alpha = (i / player.trail.length) * 0.4;
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
    });

    // Player ship (triangle)
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
      ctx.shadowColor = COLORS.accent; ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }

    // Bullets
    state.bullets.forEach(b => {
      ctx.fillStyle = COLORS.accent3;
      ctx.shadowColor = COLORS.accent3; ctx.shadowBlur = 8;
      ctx.fillRect(b.x - 2, b.y - 6, 4, 12);
      ctx.shadowBlur = 0;
    });

    // Enemies
    ctx.save();
    state.enemies.forEach(e => {
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle);
      ctx.font = `${e.w * 1.4}px monospace`;
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color; ctx.shadowBlur = 10;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(e.icon, 0, 0);
      ctx.setTransform(1,0,0,1,0,0);
      ctx.shadowBlur = 0;
    });
    ctx.restore();

    // Explosions
    for (let xi = explosions.length - 1; xi >= 0; xi--) {
      const ex = explosions[xi];
      let alive = false;
      ex.particles.forEach(p => {
        if (p.life <= 0) return;
        p.life -= 0.05;
        alive = true;
        const px = ex.x + Math.cos(p.angle) * p.spd * (1 - p.life) * 20;
        const py = ex.y + Math.sin(p.angle) * p.spd * (1 - p.life) * 20;
        ctx.fillStyle = ex.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(px - 2, py - 2, 4, 4);
      });
      ctx.globalAlpha = 1;
      if (!alive) explosions.splice(xi, 1);
    }

    drawHUD();

    if (state.over) {
      ctx.fillStyle = 'rgba(4,8,13,0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCentered('GAME OVER', canvas.height/2 - 18, COLORS.accent2, 22);
      drawCentered(`SCORE: ${state.score}`, canvas.height/2 + 14, COLORS.accent, 14);
      drawCentered('press R to restart', canvas.height/2 + 38, COLORS.dim, 11);
    }
  }

  function drawHUD() {
    ctx.font = '11px Share Tech Mono, monospace';
    ctx.fillStyle = COLORS.accent;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(`SCORE: ${state.score}`, 10, 10);
    ctx.fillStyle = COLORS.accent2;
    ctx.textAlign = 'right';
    ctx.fillText(`LIVES: ${'♥ '.repeat(state.lives)}`, canvas.width - 10, 10);
  }

  function drawCentered(text, y, color, size) {
    ctx.font = `${size}px Share Tech Mono, monospace`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, y);
  }

  function destroy() {
    clearInterval(gameLoop);
    state = null;
  }

  /* Public API */
  window.MiniGame = { init, destroy, reset: () => { resetState(); state.started = true; } };
})();
