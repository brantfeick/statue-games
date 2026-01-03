<script>
  import '$lib/index.css';
</script>

<main class="min-h-screen bg-white text-black">
  <header class="border-b-2 border-blue-600 bg-blue-500">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-3 hover:opacity-90 transition">
        <svg class="h-10 w-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Simplified goose silhouette -->
          <ellipse cx="50" cy="55" rx="25" ry="20" fill="#f97316"/>
          <path d="M 28 45 Q 20 35 22 25" stroke="#f97316" stroke-width="8" fill="none" stroke-linecap="round"/>
          <circle cx="22" cy="22" r="7" fill="#f97316"/>
          <path d="M 20 22 L 12 20" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
          <circle cx="23" cy="20" r="1.5" fill="white"/>
        </svg>
        <div>
          <div class="text-xl font-bold text-orange-500">
            GooseGames
          </div>
        </div>
      </a>

      <nav class="hidden gap-4 text-sm font-medium text-white sm:flex">
        <a href="/" class="rounded px-3 py-1 hover:bg-blue-600 transition">
          Games
        </a>
      </nav>
    </div>
  </header>

  <section class="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pb-16 sm:pt-10">
    <slot />
  </section>

  <footer class="border-t-2 border-gray-300 bg-gray-100 py-4 text-xs text-gray-600">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
      <span>© {new Date().getFullYear()} GooseGames. All rights reserved.</span>
      <span class="text-[0.7rem] uppercase tracking-wider text-gray-500">
        Classic web games
      </span>
    </div>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    color: #000000;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>