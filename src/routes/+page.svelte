<script>
  const games = [
    {
      id: 'tic-tac-toe',
      name: 'Tic-Tac-Toe',
      description: 'Play classic 3×3 Tic-Tac-Toe against a simple computer opponent.',
      path: '/tic-tac-toe',
      badge: 'NEW',
      difficulty: 'Easy',
      vibe: 'Coffee-break'
    },
    {
      id: 'brickbreaker',
      name: 'Brickbreaker',
      description: 'Move your paddle, keep the ball in play, and clear all the bricks.',
      path: '/brickbreaker',
      badge: 'ARCADE',
      difficulty: 'Medium',
      vibe: 'Old-school reflexes'
    },
    {
      id: 'crazy-eights',
      name: 'Crazy Eights',
      description: 'Match rank or suit, play 8s as wild, and empty your hand before the computer.',
      path: '/crazy-eights',
      badge: 'CARDS',
      difficulty: 'Medium',
      vibe: 'Laid-back card night'
    },
    {
      id: 'hotdog-race',
      name: 'Hot Dog Race',
      description: 'Eat a hot dog, then race 100m! Mash left/right keys as fast as you can.',
      path: '/hotdog-race',
      badge: 'SPEED',
      difficulty: 'Hard',
      vibe: 'Button-mashing chaos'
    }
  ];
</script>

<svelte:head>
  <title>Central Arcade Hub</title>
  <meta
    name="description"
    content="A tiny hub for simple internet games — jump in and play right in your browser."
  />
</svelte:head>

<div class="relative">
  <div class="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_top,_black,_transparent)]">
    <div class="absolute -left-20 top-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
    <div class="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
  </div>

  <section class="relative z-10">
    <div class="max-w-3xl space-y-6">
      <div class="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 shadow-sm shadow-emerald-500/40">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
        LIVE ARCADE
      </div>

      <div>
        <h1 class="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
          Tiny internet games, <span class="text-emerald-300">zero friction</span>.
        </h1>
        <p class="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
          A compact hub for simple, nostalgic web games. No accounts, no clutter — just click a
          tile and start playing in a dedicated game screen.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span class="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2.5 py-1">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Single‑player
        </span>
        <span class="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2.5 py-1">
          2000s arcade vibes
        </span>
        <span class="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2.5 py-1">
          Runs in your browser
        </span>
      </div>
    </div>
  </section>

  <section class="relative z-10 mt-8">
    <div class="mb-4 flex items-baseline justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Game Gallery
        </h2>
        <p class="mt-1 text-xs text-slate-500">
          Click a card to open a dedicated page for that game.
        </p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each games as game}
        <a
          href={game.path}
          class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-black/30 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:bg-slate-900 hover:shadow-emerald-500/30"
        >
          <div class="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-emerald-500/15 to-transparent opacity-0 transition group-hover:opacity-100" />

          <div class="relative flex items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-semibold text-slate-50">
                {game.name}
              </h3>
              <p class="mt-1 line-clamp-3 text-xs text-slate-400">
                {game.description}
              </p>
            </div>
            {#if game.badge}
              <span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-emerald-300 border border-emerald-400/40">
                {game.badge}
              </span>
            {/if}
          </div>

          <div class="relative mt-3 flex items-center justify-between text-[0.7rem] text-slate-500">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5">
                <span class="h-1 w-1 rounded-full bg-emerald-300" />
                {game.difficulty}
              </span>
              <span class="hidden rounded-full bg-slate-900/80 px-2 py-0.5 sm:inline">
                {game.vibe}
              </span>
            </div>
            <span class="inline-flex items-center gap-1 text-emerald-300 group-hover:text-emerald-200">
              Play
              <span class="transition group-hover:translate-x-0.5">↗</span>
            </span>
          </div>
        </a>
      {/each}

      <div class="flex flex-col justify-between rounded-xl border border-dashed border-slate-800/80 bg-slate-900/40 p-4 text-xs text-slate-500">
        <div>
          <div class="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-600">
            Coming Soon
          </div>
          <p>
            More quick-play games will appear here — think mini puzzlers, reflex tests, and other
            tiny distractions.
          </p>
        </div>
        <div class="mt-3 text-[0.7rem] text-slate-600">
          This hub is intentionally small and cozy.
        </div>
      </div>
    </div>
  </section>
</div>