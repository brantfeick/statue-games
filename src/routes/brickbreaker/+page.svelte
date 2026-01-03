<script>
  import { onMount, onDestroy } from 'svelte';

  let canvas;
  let ctx;
  let animationFrame;

  const WIDTH = 640;
  const HEIGHT = 420;

  let paddleWidth = 90;
  const paddleHeight = 14;
  let paddleX = (WIDTH - paddleWidth) / 2;
  const paddleY = HEIGHT - 40;
  const paddleSpeed = 8;

  let rightPressed = false;
  let leftPressed = false;

  const ballRadius = 8;
  let ballX = WIDTH / 2;
  let ballY = HEIGHT - 60;
  let dx = 3;
  let dy = -3.5;

  const brickRowCount = 4;
  const brickColumnCount = 9;
  const brickWidth = 56;
  const brickHeight = 18;
  const brickPadding = 10;
  const brickOffsetTop = 40;
  const brickOffsetLeft = 28;

  let bricks = [];
  let score = 0;
  let lives = 3;
  let paused = false;
  let lifeLost = false;
  let gameOver = false;
  let gameWon = false;

  function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c += 1) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r += 1) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }

  function resetBallAndPaddle() {
    ballX = WIDTH / 2;
    ballY = HEIGHT - 60;
    dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    dy = -3.5;
    paddleX = (WIDTH - paddleWidth) / 2;
  }

  function resetGame() {
    score = 0;
    lives = 3;
    paused = false;
    lifeLost = false;
    gameOver = false;
    gameWon = false;
    paddleWidth = 90;
    initBricks();
    resetBallAndPaddle();
  }

  function keyDownHandler(e) {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      rightPressed = true;
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      leftPressed = true;
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (gameOver || gameWon) {
        resetGame();
      } else {
        paused = !paused;
        lifeLost = false;
      }
    }
  }

  function keyUpHandler(e) {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      rightPressed = false;
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    if (relativeX > 0 && relativeX < rect.width) {
      const scale = WIDTH / rect.width;
      paddleX = relativeX * scale - paddleWidth / 2;
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee';
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddleX, paddleY, paddleWidth, paddleHeight, 6);
    const grad = ctx.createLinearGradient(paddleX, paddleY, paddleX, paddleY + paddleHeight);
    grad.addColorStop(0, '#22c55e');
    grad.addColorStop(1, '#15803d');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c += 1) {
      for (let r = 0; r < brickRowCount; r += 1) {
        const b = bricks[c][r];
        if (b.status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          b.x = brickX;
          b.y = brickY;
          ctx.beginPath();
          ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 4);

          const t = r / (brickRowCount - 1 || 1);
          const colorTop = `hsl(${180 + t * 60}, 80%, 60%)`;
          const colorBottom = `hsl(${200 + t * 40}, 70%, 45%)`;
          const grad = ctx.createLinearGradient(brickX, brickY, brickX, brickY + brickHeight);
          grad.addColorStop(0, colorTop);
          grad.addColorStop(1, colorBottom);

          ctx.fillStyle = grad;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function drawHUD() {
    ctx.font = '12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#e5e7eb';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 12, 10);
    ctx.fillText(`Lives: ${lives}`, WIDTH - 80, 10);

    ctx.fillStyle = '#6b7280';
    ctx.fillText('← → or A/D to move • Space to pause/restart', WIDTH / 2 - 150, HEIGHT - 22);

    if (paused && !gameOver && !gameWon) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (lifeLost) {
        ctx.fillText(`You Have ${lives} ${lives === 1 ? 'Life' : 'Lives'} Remaining - Press Space to Continue`, WIDTH / 2, HEIGHT / 2);
      } else {
        ctx.fillText('Paused — press Space to resume', WIDTH / 2, HEIGHT / 2);
      }
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';
    }
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c += 1) {
      for (let r = 0; r < brickRowCount; r += 1) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            ballX > b.x &&
            ballX < b.x + brickWidth &&
            ballY - ballRadius < b.y + brickHeight &&
            ballY + ballRadius > b.y
          ) {
            dy = -dy;
            b.status = 0;
            score += 10;
            if (score === brickRowCount * brickColumnCount * 10) {
              gameWon = true;
            }
          }
        }
      }
    }
  }

  function update() {
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const bgGrad = ctx.createRadialGradient(
      WIDTH / 2,
      HEIGHT * 0.2,
      10,
      WIDTH / 2,
      HEIGHT / 2,
      HEIGHT
    );
    bgGrad.addColorStop(0, 'rgba(45, 212, 191, 0.25)');
    bgGrad.addColorStop(1, 'rgba(15, 23, 42, 1)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drawBricks();
    drawBall();
    drawPaddle();
    drawHUD();

    if (paused || gameOver || gameWon) {
      animationFrame = requestAnimationFrame(update);
      return;
    }

    if (rightPressed && paddleX < WIDTH - paddleWidth - 8) {
      paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 8) {
      paddleX -= paddleSpeed;
    }

    if (ballX + dx > WIDTH - ballRadius || ballX + dx < ballRadius) {
      dx = -dx;
    }
    if (ballY + dy < ballRadius) {
      dy = -dy;
    } else if (ballY + dy > paddleY - ballRadius) {
      if (ballX > paddleX && ballX < paddleX + paddleWidth) {
        const hitPos = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
        const maxAngle = (Math.PI / 3) * hitPos;
        const speed = Math.sqrt(dx * dx + dy * dy) * 1.02;
        dx = speed * Math.sin(maxAngle);
        dy = -Math.abs(speed * Math.cos(maxAngle));
      } else if (ballY + dy > HEIGHT - ballRadius) {
        lives -= 1;
        if (!lives) {
          gameOver = true;
        } else {
          resetBallAndPaddle();
          paused = true;
          lifeLost = true;
        }
      }
    }

    collisionDetection();

    ballX += dx;
    ballY += dy;

    animationFrame = requestAnimationFrame(update);
  }

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    initBricks();
    resetBallAndPaddle();
    paused = false;
    lifeLost = false;
    gameOver = false;
    gameWon = false;

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    document.addEventListener('mousemove', mouseMoveHandler);

    animationFrame = requestAnimationFrame(update);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', keyDownHandler);
    document.removeEventListener('keyup', keyUpHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
</script>

<svelte:head>
  <title>Brickbreaker — Central Arcade</title>
  <meta
    name="description"
    content="A simple Brickbreaker clone: move your paddle, keep the ball alive, and clear every brick."
  />
</svelte:head>

<div class="mx-auto max-w-5xl">
  <div class="mb-6 flex items-center justify-between gap-3">
    <div>
      <a
        href="/"
        class="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200"
      >
        ← Back to games
      </a>
      <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
        Brickbreaker
      </h1>
      <p class="mt-1 text-xs text-slate-400 sm:text-sm">
        Old-school paddle and bricks. Use <span class="font-semibold text-emerald-300">← →</span> or
        <span class="font-semibold text-emerald-300">A / D</span> to move. Press
        <span class="font-semibold text-cyan-300">Space</span> to pause or restart.
      </p>
    </div>
    <div class="hidden text-right text-[0.7rem] text-slate-500 sm:block">
      <div class="font-semibold uppercase tracking-[0.25em] text-slate-600">Mode</div>
      <div>Single player • Score chase</div>
    </div>
  </div>

  <div class="flex justify-center">
    <div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-inner shadow-black/50">
      <canvas
        bind:this={canvas}
        width={WIDTH}
        height={HEIGHT}
        class="block max-w-full rounded-xl bg-slate-950"
      />
    </div>
  </div>
</div>

{#if gameOver || gameWon}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" on:click={() => resetGame()}>
    <div class="mx-4 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/50" on:click|stopPropagation>
      <div class="text-center">
        {#if gameWon}
          <div class="mb-3 text-5xl">🎉</div>
          <h2 class="text-2xl font-bold text-emerald-300">You Won!</h2>
          <p class="mt-2 text-sm text-slate-400">All bricks cleared! Final score: {score}</p>
        {:else}
          <div class="mb-3 text-5xl">💔</div>
          <h2 class="text-2xl font-bold text-red-400">Game Over!</h2>
          <p class="mt-2 text-sm text-slate-400">You ran out of lives. Final score: {score}</p>
        {/if}
      </div>

      <div class="mt-6">
        <button
          type="button"
          class="w-full rounded-lg bg-emerald-500/90 px-4 py-3 text-sm font-semibold text-slate-950 shadow shadow-emerald-500/40 transition hover:bg-emerald-400"
          on:click={() => resetGame()}
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
{/if}


