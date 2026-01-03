<script>
  const games = [
    {
      id: 'tic-tac-toe',
      name: 'Tic-Tac-Toe',
      description: 'Play classic 3×3 Tic-Tac-Toe against a simple computer opponent.',
      path: '/tic-tac-toe',
      difficulty: 'Easy',
      icon: 'tictactoe'
    },
    {
      id: 'brickbreaker',
      name: 'Brickbreaker',
      description: 'Move your paddle, keep the ball in play, and clear all the bricks.',
      path: '/brickbreaker',
      difficulty: 'Medium',
      icon: 'bricks'
    },
    {
      id: 'hotdog-race',
      name: 'Hot Dog Race',
      description: 'Eat a hot dog, then race 100m! Mash left/right keys as fast as you can.',
      path: '/hotdog-race',
      difficulty: 'Hard',
      icon: 'hotdog'
    }
  ];

  function getGameIcon(iconType) {
    const icons = {
      tictactoe: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="28" y="10" width="4" height="60" fill="#f97316"/>
        <rect x="48" y="10" width="4" height="60" fill="#f97316"/>
        <rect x="10" y="28" width="60" height="4" fill="#f97316"/>
        <rect x="10" y="48" width="60" height="4" fill="#f97316"/>
        <circle cx="19" cy="19" r="6" stroke="#2563eb" stroke-width="3" fill="none"/>
        <path d="M 34 34 L 46 46 M 46 34 L 34 46" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
        <circle cx="59" cy="19" r="6" stroke="#2563eb" stroke-width="3" fill="none"/>
      </svg>`,
      bricks: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="15" height="8" fill="#ef4444" stroke="#000" stroke-width="1"/>
        <rect x="27" y="10" width="15" height="8" fill="#f97316" stroke="#000" stroke-width="1"/>
        <rect x="44" y="10" width="15" height="8" fill="#eab308" stroke="#000" stroke-width="1"/>
        <rect x="61" y="10" width="15" height="8" fill="#22c55e" stroke="#000" stroke-width="1"/>
        <rect x="18" y="20" width="15" height="8" fill="#3b82f6" stroke="#000" stroke-width="1"/>
        <rect x="35" y="20" width="15" height="8" fill="#8b5cf6" stroke="#000" stroke-width="1"/>
        <rect x="52" y="20" width="15" height="8" fill="#ec4899" stroke="#000" stroke-width="1"/>
        <circle cx="40" cy="55" r="5" fill="#fff" stroke="#000" stroke-width="2"/>
        <rect x="25" y="65" width="30" height="5" rx="2" fill="#22c55e" stroke="#000" stroke-width="1"/>
      </svg>`,
      hotdog: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="40" rx="28" ry="12" fill="#fbbf24" stroke="#000" stroke-width="2"/>
        <rect x="15" y="35" width="50" height="10" fill="#dc2626" stroke="#000" stroke-width="1.5"/>
        <path d="M 20 40 Q 25 37 30 40 Q 35 43 40 40 Q 45 37 50 40 Q 55 43 60 40" stroke="#eab308" stroke-width="2" fill="none"/>
        <path d="M 55 25 L 60 20 M 60 20 L 65 25 M 60 20 L 60 15" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
        <circle cx="20" cy="55" r="3" fill="#6b7280"/>
        <circle cx="32" cy="58" r="3" fill="#6b7280"/>
        <circle cx="48" cy="58" r="3" fill="#6b7280"/>
        <circle cx="60" cy="55" r="3" fill="#6b7280"/>
      </svg>`
    };
    return icons[iconType] || '';
  }
</script>

<svelte:head>
  <title>GooseGames - Classic Web Games</title>
  <meta
    name="description"
    content="Play classic web games for free - Tic-Tac-Toe, Brickbreaker, Hot Dog Race and more!"
  />
</svelte:head>

<div>
  <section>
    <div class="max-w-3xl space-y-6">
      <div>
        <h1 class="text-balance text-4xl font-bold tracking-tight text-black sm:text-5xl">
          Free Online Games, <span class="text-orange-500">Play Now!</span>
        </h1>
        <p class="mt-3 max-w-xl text-base text-gray-700">
          Classic web games from the early 2000s. No downloads, no signup required.
        </p>
      </div>
    </div>
  </section>

  <section class="mt-8">
    <div class="mb-4">
      <h2 class="text-lg font-bold text-black">
        GAME GALLERY
      </h2>
      <p class="mt-1 text-sm text-gray-600">
        Click a game to start playing
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each games as game}
        <a
          href={game.path}
          class="group relative overflow-hidden rounded-lg border-2 border-gray-300 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg"
        >
          <div class="relative flex items-start justify-between gap-3">
            <div class="flex-1">
              <h3 class="text-base font-bold text-black">
                {game.name}
              </h3>
              <p class="mt-1 line-clamp-3 text-sm text-gray-700">
                {game.description}
              </p>
            </div>
            <div class="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-orange-500 bg-orange-50 p-2 shadow-sm">
              {@html getGameIcon(game.icon)}
            </div>
          </div>

          <div class="relative mt-3 flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                <span class="h-1.5 w-1.5 rounded-full bg-orange-500" />
                {game.difficulty}
              </span>
            </div>
            <span class="inline-flex items-center gap-1 font-bold text-orange-500 group-hover:text-orange-600">
              PLAY
              <span class="transition group-hover:translate-x-0.5">►</span>
            </span>
          </div>
        </a>
      {/each}
    </div>
  </section>
</div>
