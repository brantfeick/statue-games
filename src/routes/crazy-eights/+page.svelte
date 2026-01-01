<script>
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  function createDeck() {
    const deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  let drawPile = [];
  let discardPile = [];
  let playerHand = [];
  let computerHand = [];
  let currentSuit = null;
  let currentRank = null;
  let currentPlayer = 'player'; // 'player' | 'computer'
  let winner = null; // 'player' | 'computer' | null
  let message = '';
  let choosingSuit = false;
  let pendingEightCard = null;

  function startGame() {
    drawPile = createDeck();
    playerHand = [];
    computerHand = [];
    discardPile = [];
    winner = null;
    message = '';
    choosingSuit = false;
    pendingEightCard = null;

    for (let i = 0; i < 5; i += 1) {
      playerHand.push(drawPile.pop());
      computerHand.push(drawPile.pop());
    }

    let top = drawPile.pop();
    while (top.rank === '8') {
      drawPile.unshift(top);
      top = drawPile.pop();
    }
    discardPile.push(top);
    currentSuit = top.suit;
    currentRank = top.rank;
    currentPlayer = 'player';
    message = 'Your turn — play a card that matches rank or suit, or an 8 as wild.';
  }

  function canPlay(card) {
    if (!card) return false;
    if (card.rank === '8') return true;
    return card.rank === currentRank || card.suit === currentSuit;
  }

  function reshuffleIfNeeded() {
    if (drawPile.length === 0 && discardPile.length > 1) {
      const top = discardPile.pop();
      drawPile = discardPile;
      discardPile = [top];
      for (let i = drawPile.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [drawPile[i], drawPile[j]] = [drawPile[j], drawPile[i]];
      }
    }
  }

  function drawCard(hand) {
    reshuffleIfNeeded();
    if (drawPile.length === 0) return null;
    const card = drawPile.pop();
    hand.push(card);
    return card;
  }

  function handlePlayerPlay(cardIndex) {
    if (winner || currentPlayer !== 'player' || choosingSuit) return;
    const card = playerHand[cardIndex];
    if (!canPlay(card)) {
      message = 'That card cannot be played. Match rank or suit, or play an 8.';
      return;
    }

    playerHand.splice(cardIndex, 1);

    if (card.rank === '8') {
      choosingSuit = true;
      pendingEightCard = card;
      message = 'Choose a suit for your wild 8.';
      return;
    }

    playCardToDiscard(card, 'player');
  }

  function chooseSuit(suit) {
    if (!choosingSuit || !pendingEightCard) return;
    const card = pendingEightCard;
    pendingEightCard = null;
    choosingSuit = false;

    discardPile.push(card);
    currentSuit = suit;
    currentRank = card.rank;

    if (playerHand.length === 0) {
      winner = 'player';
      message = 'You emptied your hand — you win!';
      return;
    }

    currentPlayer = 'computer';
    message = `You changed suit to ${suit}. Computer is thinking…`;
    setTimeout(computerTurn, 700);
  }

  function playCardToDiscard(card, who) {
    discardPile.push(card);
    currentSuit = card.suit;
    currentRank = card.rank;

    if (who === 'player') {
      if (playerHand.length === 0) {
        winner = 'player';
        message = 'You emptied your hand — you win!';
        return;
      }
      currentPlayer = 'computer';
      message = 'Nice play. Computer is thinking…';
      setTimeout(computerTurn, 700);
    } else {
      if (computerHand.length === 0) {
        winner = 'computer';
        message = 'Computer played its last card — you lose.';
        return;
      }
      currentPlayer = 'player';
      message = 'Your turn — match rank or suit, or play an 8 as wild.';
    }
  }

  function playerDraw() {
    if (winner || currentPlayer !== 'player' || choosingSuit) return;
    const before = playerHand.length;
    const card = drawCard(playerHand);
    if (!card || playerHand.length === before) {
      message = 'No cards left to draw — turn passes.';
      currentPlayer = 'computer';
      setTimeout(computerTurn, 600);
      return;
    }
    if (canPlay(card)) {
      message = 'You drew a playable card — you may play it or end your turn.';
    } else {
      message = 'Drawn card cannot be played — turn passes.';
      currentPlayer = 'computer';
      setTimeout(computerTurn, 700);
    }
  }

  function computerTurn() {
    if (winner || currentPlayer !== 'computer') return;

    const playable = computerHand.filter((c) => canPlay(c));
    if (playable.length === 0) {
      const drawn = drawCard(computerHand);
      if (!drawn) {
        message = 'Deck is empty. No more moves — round ends in a stalemate.';
        winner = null;
        return;
      }
      if (canPlay(drawn)) {
        setTimeout(() => computerPlayCard(drawn), 500);
      } else {
        currentPlayer = 'player';
        message = 'Computer drew and passed. Your turn.';
      }
      return;
    }

    playable.sort((a, b) => {
      const rankOrder = ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
      return rankOrder;
    });
    const card = playable[0];
    setTimeout(() => computerPlayCard(card), 500);
  }

  function computerPlayCard(card) {
    const idx = computerHand.findIndex((c) => c === card);
    if (idx === -1) return;
    computerHand.splice(idx, 1);

    if (card.rank === '8') {
      let bestSuit = suits[0];
      let bestCount = -1;
      for (const suit of suits) {
        const count = computerHand.filter((c) => c.suit === suit).length;
        if (count > bestCount) {
          bestSuit = suit;
          bestCount = count;
        }
      }
      discardPile.push(card);
      currentSuit = bestSuit;
      currentRank = card.rank;

      if (computerHand.length === 0) {
        winner = 'computer';
        message = 'Computer played an 8 and emptied its hand — you lose.';
        return;
      }

      currentPlayer = 'player';
      message = `Computer played an 8 and changed suit to ${bestSuit}. Your turn.`;
    } else {
      playCardToDiscard(card, 'computer');
    }
  }

  function cardLabel(card) {
    if (!card) return '';
    return `${card.rank}${card.suit}`;
  }

  $: topCard = discardPile[discardPile.length - 1];
</script>

<svelte:head>
  <title>Crazy Eights — Central Arcade</title>
  <meta
    name="description"
    content="Play a simple Crazy Eights card game against the computer. Match rank or suit, play 8s as wild."
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
        Crazy Eights
      </h1>
      <p class="mt-1 text-xs text-slate-400 sm:text-sm">
        Match rank or suit with the top card, or play an
        <span class="font-semibold text-emerald-300">8</span> as wild and choose the suit. First to
        empty their hand wins.
      </p>
    </div>
    <div class="hidden text-right text-[0.7rem] text-slate-500 sm:block">
      <div class="font-semibold uppercase tracking-[0.25em] text-slate-600">Mode</div>
      <div>Single player vs CPU</div>
    </div>
  </div>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
    <div class="space-y-4">
      <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
        <div class="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-500">
          Status
        </div>
        <div class="mt-1 text-sm text-slate-100">
          {message}
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2 text-[0.7rem] text-slate-400">
          <div class="rounded-lg bg-slate-950/70 px-3 py-2">
            <div class="text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">You</div>
            <div class="mt-1 text-sm font-semibold text-emerald-300">
              {playerHand.length} cards
            </div>
          </div>
          <div class="rounded-lg bg-slate-950/70 px-3 py-2">
            <div class="text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">Computer</div>
            <div class="mt-1 text-sm font-semibold text-cyan-300">
              {computerHand.length} cards
            </div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2 text-[0.65rem] text-slate-400">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
            on:click={startGame}
          >
            {playerHand.length === 0 && computerHand.length === 0 ? 'Start round' : 'Restart round'}
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 disabled:opacity-60"
            on:click={playerDraw}
            disabled={winner || currentPlayer !== 'player' || choosingSuit}
          >
            Draw card
          </button>
        </div>
      </div>

      {#if choosingSuit}
        <div class="space-y-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-[0.7rem] text-emerald-100">
          <div class="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-emerald-200">
            Wild 8
          </div>
          <p class="mt-1">
            Choose a suit for your wild 8:
          </p>
          <div class="mt-2 flex flex-wrap gap-2">
            {#each suits as suit}
              <button
                type="button"
                class="rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-semibold hover:bg-slate-800"
                on:click={() => chooseSuit(suit)}
              >
                {suit}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="space-y-4">
      <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Center
            </div>
            <div class="mt-1 text-sm text-slate-100">
              Top card: {#if topCard}{cardLabel(topCard)}{/if}
            </div>
            <div class="mt-1 text-[0.7rem] text-slate-400">
              Active suit: <span class="font-semibold text-emerald-300">{currentSuit}</span>
            </div>
          </div>
          <div class="text-[0.7rem] text-slate-500 text-right">
            <div>Draw pile: {drawPile.length}</div>
            <div>Discard: {discardPile.length}</div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
        <div class="flex items-center justify-between gap-3">
          <div class="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Your hand
          </div>
          <div class="text-[0.7rem] text-slate-400">
            {currentPlayer === 'player' ? 'Your turn' : "Computer's turn"}
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          {#if playerHand.length === 0}
            <span class="text-[0.7rem] text-slate-500">
              Start a round to get cards.
            </span>
          {:else}
            {#each playerHand as card, index}
              <button
                type="button"
                class="relative rounded-lg border px-2.5 py-2 text-[0.75rem] font-semibold shadow-sm transition
                  {canPlay(card) && !winner && currentPlayer === 'player' && !choosingSuit
                    ? 'border-emerald-400/60 bg-slate-900/80 text-emerald-100 hover:bg-slate-900'
                    : 'border-slate-700 bg-slate-950/70 text-slate-200 opacity-80'}"
                disabled={winner || currentPlayer !== 'player' || choosingSuit}
                on:click={() => handlePlayerPlay(index)}
              >
                <span class={card.suit === '♥' || card.suit === '♦' ? 'text-rose-300' : ''}>
                  {cardLabel(card)}
                </span>
              </button>
            {/each}
          {/if}
        </div>
      </div>

      <div class="rounded-xl border border-slate-900 bg-slate-950/60 p-3 text-[0.65rem] text-slate-500">
        <div class="font-semibold uppercase tracking-[0.25em] text-slate-600">
          Notes
        </div>
        <ul class="mt-2 list-disc space-y-1 pl-4">
          <li>8s are wild: you can always play them and then choose any suit.</li>
          <li>If no playable card is in hand, you draw; if the draw is still not playable, your turn passes.</li>
          <li>Simple CPU: it plays the lowest-rank valid card, choosing suit on 8s based on its hand.</li>
        </ul>
      </div>
    </div>
  </div>
</div>


