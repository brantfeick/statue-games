<script>
  const emptyBoard = () => Array(9).fill(null);

  let board = emptyBoard();
  let player = 'X';
  let computer = 'O';
  let turn = 'player'; // 'player' | 'computer'
  let winner = null; // 'X' | 'O' | 'draw' | null
  let startingPlayer = 'player';

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function checkWinner(nextBoard) {
    for (const [a, b, c] of winningLines) {
      if (nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[a] === nextBoard[c]) {
        return nextBoard[a];
      }
    }

    if (nextBoard.every((cell) => cell !== null)) {
      return 'draw';
    }

    return null;
  }

  function resetGame(swapStarter = false) {
    board = emptyBoard();
    winner = null;

    if (swapStarter) {
      startingPlayer = startingPlayer === 'player' ? 'computer' : 'player';
    }

    turn = startingPlayer;

    if (turn === 'computer') {
      // Delay slightly so the UI has time to render the reset state
      setTimeout(computerMove, 250);
    }
  }

  function handleCellClick(index) {
    if (winner || turn !== 'player' || board[index] !== null) return;

    const next = board.slice();
    next[index] = player;
    const result = checkWinner(next);

    board = next;
    winner = result;

    if (!winner) {
      turn = 'computer';
      setTimeout(computerMove, 350);
    }
  }

  function computerMove() {
    if (winner || turn !== 'computer') return;

    const next = board.slice();

    const emptyIndices = next
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);

    if (!emptyIndices.length) {
      winner = checkWinner(next);
      return;
    }

    const chooseMove = (symbol) => {
      for (const [a, b, c] of winningLines) {
        const line = [next[a], next[b], next[c]];
        const count = line.filter((v) => v === symbol).length;
        const emptyIndexInLine = [a, b, c].find((pos) => next[pos] === null);

        if (count === 2 && emptyIndexInLine != null) {
          return emptyIndexInLine;
        }
      }
      return null;
    };

    let move = chooseMove(computer);
    if (move == null) {
      move = chooseMove(player);
    }

    if (move == null) {
      const randomIdx = Math.floor(Math.random() * emptyIndices.length);
      move = emptyIndices[randomIdx];
    }

    next[move] = computer;
    board = next;
    winner = checkWinner(next);

    if (!winner) {
      turn = 'player';
    }
  }

  $: statusText = (() => {
    if (winner === 'draw') return "It's a draw.";
    if (winner === player) return 'You win!';
    if (winner === computer) return 'Computer wins.';
    return turn === 'player' ? 'Your move.' : "Computer is thinking…";
  })();
</script>

<svelte:head>
  <title>Tic-Tac-Toe — GooseGames</title>
  <meta
    name="description"
    content="Play a simple Tic-Tac-Toe game against the computer right in your browser."
  />
</svelte:head>

<div class="mx-auto max-w-5xl">
  <div class="mb-6 flex items-center justify-between gap-3">
    <div>
      <a
        href="/"
        class="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900"
      >
        ← Back to games
      </a>
      <h1 class="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
        Tic-Tac-Toe
      </h1>
      <p class="mt-1 text-xs text-gray-700 sm:text-sm">
        Classic 3×3. You are <span class="font-semibold text-orange-300">X</span>, the computer is
        <span class="font-semibold text-blue-500">O</span>.
      </p>
    </div>
    <div class="hidden text-right text-[0.7rem] text-gray-600 sm:block">
      <div class="font-semibold uppercase tracking-[0.25em] text-gray-500">Mode</div>
      <div>Single player vs CPU</div>
    </div>
  </div>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
    <div class="space-y-4">
      <div class="rounded-xl border border-gray-300 bg-gray-100/70 p-4 text-xs text-gray-800">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gray-600">
              Status
            </div>
            <div class="mt-1 text-sm text-black">{statusText}</div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2 text-[0.7rem] text-gray-700">
          <div class="rounded-lg bg-white/70 px-3 py-2">
            <div class="text-[0.6rem] uppercase tracking-[0.2em] text-gray-600">You</div>
            <div class="mt-1 text-sm font-semibold text-orange-300">X</div>
          </div>
          <div class="rounded-lg bg-white/70 px-3 py-2">
            <div class="text-[0.6rem] uppercase tracking-[0.2em] text-gray-600">Computer</div>
            <div class="mt-1 text-sm font-semibold text-blue-500">O</div>
          </div>
        </div>
      </div>

      <div class="space-y-2 text-[0.7rem] text-gray-600">
        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-orange-500/90 px-3 py-2 text-xs font-semibold text-white shadow shadow-orange-500/40 hover:bg-orange-400"
          on:click={() => resetGame(false)}
        >
          Restart (same starter)
        </button>
        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-gray-400 bg-gray-100/80 px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-300/80"
          on:click={() => resetGame(true)}
        >
          Swap who starts
        </button>
        <p class="mt-2">
          Tip: try to force a draw by playing center and corners. The computer makes simple
          tactical moves, not perfect ones.
        </p>
      </div>
    </div>

    <div class="flex items-center justify-center">
      <div class="aspect-square w-full max-w-sm rounded-2xl border border-gray-300 bg-gray-100/70 p-4 shadow-inner shadow-black/40">
        <div class="grid h-full grid-cols-3 gap-2">
          {#each board as cell, index}
            <button
              type="button"
              class="aspect-square flex items-center justify-center rounded-xl border border-gray-400 bg-white/70 text-4xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:border-orange-400/60 hover:bg-gray-100/90 disabled:cursor-default disabled:hover:border-gray-400/80 disabled:hover:bg-white/70"
              on:click={() => handleCellClick(index)}
              disabled={cell !== null || winner !== null || turn !== 'player'}
            >
              {#if cell === 'X'}
                <span class="text-orange-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.65)]">X</span>
              {:else if cell === 'O'}
                <span class="text-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]">O</span>
              {:else}
                <span class="opacity-0">X</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

{#if winner !== null}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" on:click={() => resetGame(false)}>
    <div class="mx-4 w-full max-w-md rounded-2xl border border-gray-400 bg-gray-100 p-6 shadow-2xl shadow-black/50" on:click|stopPropagation>
      <div class="text-center">
        {#if winner === 'draw'}
          <div class="mb-3 text-5xl">🤝</div>
          <h2 class="text-2xl font-bold text-black">It's a Draw!</h2>
          <p class="mt-2 text-sm text-gray-700">Well played by both sides.</p>
        {:else if winner === player}
          <div class="mb-3 text-5xl">🎉</div>
          <h2 class="text-2xl font-bold text-orange-300">You Win!</h2>
          <p class="mt-2 text-sm text-gray-700">Great job! You beat the computer.</p>
        {:else}
          <div class="mb-3 text-5xl">🤖</div>
          <h2 class="text-2xl font-bold text-blue-500">Computer Wins!</h2>
          <p class="mt-2 text-sm text-gray-700">Better luck next time!</p>
        {/if}
      </div>

      <div class="mt-6 space-y-2">
        <button
          type="button"
          class="w-full rounded-lg bg-orange-500/90 px-4 py-3 text-sm font-semibold text-white shadow shadow-orange-500/40 transition hover:bg-orange-400"
          on:click={() => resetGame(false)}
        >
          Play Again (same starter)
        </button>
        <button
          type="button"
          class="w-full rounded-lg border border-gray-400 bg-gray-300/80 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-400/80"
          on:click={() => resetGame(true)}
        >
          Play Again (swap starter)
        </button>
      </div>
    </div>
  </div>
{/if}


