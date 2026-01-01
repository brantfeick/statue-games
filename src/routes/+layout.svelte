<script>
  import '$lib/index.css';
</script>

<main class="min-h-screen bg-slate-950 text-slate-100">
  <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-2">
        <div class="h-8 w-8 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/40" />
        <div>
          <div class="text-sm font-semibold tracking-[0.25em] text-emerald-300 uppercase">
            Central
          </div>
          <div class="text-xs text-slate-400">
            Arcade Hub
          </div>
        </div>
      </a>

      <nav class="hidden gap-4 text-xs font-medium tracking-wide text-slate-300 sm:flex">
        <a href="/" class="rounded px-3 py-1 hover:bg-slate-800/70 hover:text-white">
          Games
        </a>
      </nav>
    </div>
  </header>

  <section class="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pb-16 sm:pt-10">
    <slot />
  </section>

  <footer class="border-t border-slate-800 bg-slate-950/90 py-4 text-xs text-slate-500">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
      <span>© {new Date().getFullYear()} Central Arcade. All rights reserved.</span>
      <span class="text-[0.7rem] uppercase tracking-[0.25em] text-slate-600">
        Built for tiny internet games
      </span>
    </div>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #020617; /* slate-950 */
    color: #e2e8f0; /* slate-200 */
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>