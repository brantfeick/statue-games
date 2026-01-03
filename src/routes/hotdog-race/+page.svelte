<script>
  import { onMount, onDestroy } from 'svelte';

  let canvas;
  let ctx;
  let animationFrame;

  const WIDTH = 800;
  const HEIGHT = 500;

  // Game phases: 'eating' | 'racing' | 'finished'
  let phase = 'eating';
  let eatingProgress = 0;
  let raceProgress = 0;
  let playerIsRacing = false;
  const maxEatingProgress = 100;
  const maxRaceProgress = 100;

  // Button mashing tracking
  let lastKey = null;
  let lastKeyTime = 0;
  let keyStreak = 0;
  let currentSpeed = 0;
  const maxSpeed = 15;
  const speedDecay = 0.3;

  // Player stick figure position and animation
  let playerX = 150;
  let playerY = 300;
  let playerAnimationFrame = 0;
  let playerEatingFrame = 0;

  // Opponent (CPU) stick figure
  let opponentX = 150;
  let opponentY = 200;
  let opponentAnimationFrame = 0;
  let opponentEatingProgress = 0;
  let opponentRaceProgress = 0;
  let opponentIsRacing = false;
  const opponentEatingSpeed = 0.25;
  const opponentRaceSpeed = 0.22;

  let winner = null; // 'player' | 'opponent' | null
  let gameStarted = false;
  let countdown = 3;

  function handleKeyDown(e) {
    if (!gameStarted || phase === 'finished') return;

    const now = Date.now();
    const key = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' ? 'left' :
                e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' ? 'right' : null;

    if (!key) return;

    e.preventDefault();

    // Check if alternating keys
    if (lastKey && lastKey !== key) {
      const timeDiff = now - lastKeyTime;
      if (timeDiff < 200) { // Fast enough
        keyStreak = Math.min(keyStreak + 1, 20);
        currentSpeed = Math.min(maxSpeed, 2 + keyStreak * 0.6);
      } else {
        keyStreak = Math.max(0, keyStreak - 1);
      }
    } else if (lastKey === key) {
      // Same key pressed - reset streak
      keyStreak = Math.max(0, keyStreak - 2);
    }

    lastKey = key;
    lastKeyTime = now;

    // Update progress based on speed
    if (!playerIsRacing) {
      eatingProgress = Math.min(maxEatingProgress, eatingProgress + currentSpeed * 0.8);
      playerEatingFrame = (playerEatingFrame + 1) % 4;

      // Check if player finished eating
      if (eatingProgress >= maxEatingProgress) {
        playerIsRacing = true;
      }
    } else {
      raceProgress = Math.min(maxRaceProgress, raceProgress + currentSpeed);
      playerAnimationFrame = (playerAnimationFrame + 1) % 6;
    }
  }

  function startGame() {
    gameStarted = true;
    countdown = 3;
    eatingProgress = 0;
    raceProgress = 0;
    playerIsRacing = false;
    opponentEatingProgress = 0;
    opponentRaceProgress = 0;
    opponentIsRacing = false;
    phase = 'eating';
    winner = null;
    playerX = 150;
    opponentX = 150;
    keyStreak = 0;
    currentSpeed = 0;
    lastKey = null;
    countdownTick();
  }

  function countdownTick() {
    if (countdown > 0) {
      setTimeout(() => {
        countdown--;
        if (countdown > 0) {
          countdownTick();
        }
      }, 1000);
    }
  }

  function drawStickFigure(x, y, frame, isEating = false, isRunning = false, color = '#10b981') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Head
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(x, y + 12);
    ctx.lineTo(x, y + 50);
    ctx.stroke();

    if (isEating) {
      // Eating animation - hot dog in hand
      const hotdogX = x + 15 + Math.sin(frame * 0.5) * 3;
      const hotdogY = y + 25;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hotdogX - 8, hotdogY);
      ctx.lineTo(hotdogX + 8, hotdogY);
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;

      // Arm holding hot dog
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.lineTo(hotdogX, hotdogY);
      ctx.stroke();
    } else if (isRunning) {
      // Running animation
      const armAngle = Math.sin(frame * 0.8) * 0.6;
      const legAngle = Math.sin(frame * 0.8 + Math.PI) * 0.5;

      // Arms
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.lineTo(x + Math.cos(armAngle) * 20, y + 20 + Math.sin(armAngle) * 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.lineTo(x - Math.cos(armAngle) * 20, y + 20 - Math.sin(armAngle) * 15);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(x, y + 50);
      ctx.lineTo(x + Math.cos(legAngle) * 18, y + 50 + Math.sin(legAngle) * 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 50);
      ctx.lineTo(x - Math.cos(legAngle) * 18, y + 50 - Math.sin(legAngle) * 20);
      ctx.stroke();
    } else {
      // Idle - simple arms and legs
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.lineTo(x + 15, y + 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.lineTo(x - 15, y + 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 50);
      ctx.lineTo(x + 12, y + 65);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 50);
      ctx.lineTo(x - 12, y + 65);
      ctx.stroke();
    }
  }

  function drawHotDog(x, y, progress) {
    const length = 40;
    const eatenLength = (length * progress) / maxEatingProgress;

    // Bun
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x - length / 2, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + length / 2, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - length / 2, y - 8, length, 16);

    // Hot dog (remaining)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x - length / 2 + eatenLength, y - 4, length - eatenLength, 8);

    // Mustard
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - length / 2 + eatenLength, y);
    ctx.lineTo(x + length / 2, y);
    ctx.stroke();
  }

  function drawTrack() {
    // Track lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(100, playerY + 80);
    ctx.lineTo(700, playerY + 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(100, opponentY + 80);
    ctx.lineTo(700, opponentY + 80);
    ctx.stroke();
    ctx.setLineDash([]);

    // Start line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(100, 400);
    ctx.stroke();

    // Finish line
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(700, 150);
    ctx.lineTo(700, 400);
    ctx.stroke();
  }

  function animate() {
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Decay speed
    currentSpeed = Math.max(0, currentSpeed - speedDecay);
    if (currentSpeed < 1) {
      keyStreak = Math.max(0, keyStreak - 0.5);
    }

    if (!gameStarted) {
      // Start screen
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Hot Dog Race', WIDTH / 2, HEIGHT / 2 - 40);
      ctx.font = '18px sans-serif';
      ctx.fillText('Press SPACE to start', WIDTH / 2, HEIGHT / 2 + 20);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Mash LEFT/RIGHT or A/D keys rapidly to eat and run!', WIDTH / 2, HEIGHT / 2 + 60);
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    if (countdown > 0) {
      // Countdown
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(countdown.toString(), WIDTH / 2, HEIGHT / 2);
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    // Update opponent
    if (!opponentIsRacing) {
      opponentEatingProgress = Math.min(maxEatingProgress, opponentEatingProgress + opponentEatingSpeed);
      if (opponentEatingProgress >= maxEatingProgress) {
        opponentIsRacing = true;
      }
    } else {
      opponentRaceProgress = Math.min(maxRaceProgress, opponentRaceProgress + opponentRaceSpeed);
      opponentX = 150 + (opponentRaceProgress / maxRaceProgress) * 550;
      opponentAnimationFrame = (opponentAnimationFrame + 1) % 6;
    }

    // Update player position
    if (playerIsRacing) {
      playerX = 150 + (raceProgress / maxRaceProgress) * 550;
    }

    // Update phase
    if (playerIsRacing || opponentIsRacing) {
      phase = 'racing';
    }

    // Check winner
    if (raceProgress >= maxRaceProgress && !winner) {
      winner = 'player';
      phase = 'finished';
    } else if (opponentRaceProgress >= maxRaceProgress && !winner) {
      winner = 'opponent';
      phase = 'finished';
    }

    // Draw track
    drawTrack();

    // Draw players based on their individual state
    if (phase !== 'finished') {
      // Player
      if (!playerIsRacing) {
        drawHotDog(200, playerY - 30, eatingProgress);
        drawStickFigure(playerX, playerY, playerEatingFrame, true, false, '#10b981');
      } else {
        drawStickFigure(playerX, playerY, playerAnimationFrame, false, true, '#10b981');
      }

      // Opponent
      if (!opponentIsRacing) {
        drawHotDog(200, opponentY - 30, opponentEatingProgress);
        drawStickFigure(opponentX, opponentY, Math.floor(opponentEatingProgress / 5) % 4, true, false, '#3b82f6');
      } else {
        drawStickFigure(opponentX, opponentY, opponentAnimationFrame, false, true, '#3b82f6');
      }

      // Progress bars
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(50, 420, 700, 20);
      ctx.fillRect(50, 445, 700, 20);

      if (!playerIsRacing) {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(50, 420, (eatingProgress / maxEatingProgress) * 700, 20);
      } else {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(50, 420, (raceProgress / maxRaceProgress) * 700, 20);
      }

      if (!opponentIsRacing) {
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(50, 445, (opponentEatingProgress / maxEatingProgress) * 700, 20);
      } else {
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(50, 445, (opponentRaceProgress / maxRaceProgress) * 700, 20);
      }

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      if (phase === 'eating') {
        ctx.fillText('EAT THE HOT DOG!', 50, 410);
      } else {
        ctx.fillText('RACE TO THE FINISH!', 50, 410);
      }
    }

    // Draw finished state
    if (phase === 'finished') {
      ctx.fillStyle = winner === 'player' ? '#10b981' : '#ef4444';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        winner === 'player' ? 'YOU WIN!' : 'YOU LOST!',
        WIDTH / 2,
        HEIGHT / 2 - 20
      );
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('Press SPACE to play again', WIDTH / 2, HEIGHT / 2 + 30);
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function handleSpace(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (!gameStarted || phase === 'finished') {
        startGame();
      }
    }
  }


  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleSpace);
    animate();
  });

  onDestroy(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keydown', handleSpace);
  });
</script>

<svelte:head>
  <title>Hot Dog Race — Central Arcade</title>
  <meta
    name="description"
    content="Eat a hot dog, then race 100m! Mash left/right keys as fast as you can in this stick figure button-mashing game."
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
        Hot Dog Race
      </h1>
      <p class="mt-1 text-xs text-slate-400 sm:text-sm">
        Phase 1: Eat the hot dog. Phase 2: Race 100m. Mash
        <span class="font-semibold text-emerald-300">LEFT/RIGHT</span> or
        <span class="font-semibold text-emerald-300">A/D</span> keys rapidly!
      </p>
    </div>
    <div class="hidden text-right text-[0.7rem] text-slate-500 sm:block">
      <div class="font-semibold uppercase tracking-[0.25em] text-slate-600">Controls</div>
      <div>Alternate L/R rapidly</div>
    </div>
  </div>

  <div class="flex justify-center">
    <div
      class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-inner shadow-black/50"
    >
      <canvas
        bind:this={canvas}
        width={800}
        height={500}
        class="block max-w-full rounded-xl bg-slate-950"
      />
    </div>
  </div>

  <div class="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
    <div class="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-500">
      How to Play
    </div>
    <ul class="space-y-1 text-slate-400">
      <li>• Press <span class="font-semibold text-emerald-300">SPACE</span> to start</li>
      <li>
        • Rapidly alternate between <span class="font-semibold text-emerald-300">LEFT</span> and
        <span class="font-semibold text-emerald-300">RIGHT</span> (or A/D) keys
      </li>
      <li>• Faster button mashing = faster eating and running</li>
      <li>• Finish eating first, then race to the finish line!</li>
    </ul>
  </div>
</div>

