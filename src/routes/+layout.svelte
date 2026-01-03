<script>
  import '$lib/index.css';
</script>

<main class="min-h-screen bg-white text-black">
  <header class="border-b-2 border-slate-950 bg-slate-900">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-3 hover:opacity-90 transition">
        <img src="/goose-games.png" alt="GooseGames Logo" class="h-10 w-10 object-contain" />
        <div>
          <div class="text-xl font-bold">
            <span class="text-white">Goose</span><span class="text-orange-500">Games</span>
          </div>
        </div>
      </a>

      <nav class="hidden gap-4 text-sm font-medium sm:flex">
        <a href="https://statue.dev/" class="rounded px-3 py-1 text-orange-500 hover:text-orange-400 transition font-bold">
          Built with Statue
        </a>
      </nav>
    </div>
  </header>

  <section class="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pb-16 sm:pt-10">
    <slot />
  </section>

  <footer class="border-t-2 border-gray-300 bg-gray-100 py-4 text-xs text-gray-600">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
      <span>{new Date().getFullYear()} GooseGames.</span>
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