<script>
  const games = [
    {
      id: 'tic-tac-toe',
      name: 'Tic-Tac-Toe',
      description: 'Play classic 3×3 Tic-Tac-Toe against a simple computer opponent.',
      path: '/tic-tac-toe',
      difficulty: 'Easy',
      image: '/tic-tac-toe.png'
    },
    {
      id: 'brickbreaker',
      name: 'Brickbreaker',
      description: 'Move your paddle, keep the ball in play, and clear all the bricks.',
      path: '/brickbreaker',
      difficulty: 'Medium',
      image: '/brick-breaker.png'
    },
    {
      id: 'hotdog-race',
      name: 'Hot Dog Race',
      description: 'Eat a hot dog, then race 100m! Mash left/right keys as fast as you can.',
      path: '/hotdog-race',
      difficulty: 'Hard',
      image: '/hot-dog-race.png'
    }
  ];
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
          Tiny internet games, <span class="text-orange-500">tons of fun!</span>
        </h1>
        <p class="mt-3 max-w-xl text-base text-gray-700">
          A compact hub for simple, nostalgic web games.
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
            <div class="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-orange-500 bg-white p-1 shadow-sm overflow-hidden">
              <img src={game.image} alt={game.name} class="w-full h-full object-cover rounded" />
            </div>
          </div>

          <div class="relative mt-3 flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                <span class="h-1.5 w-1.5 rounded-full {game.difficulty === 'Easy' ? 'bg-green-500' : game.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}" />
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
