<script>
  import '$lib/index.css';
</script>

<main class="min-h-screen bg-white text-black">
  <header class="border-b-2 border-blue-600 bg-blue-500">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-3 hover:opacity-90 transition">
        <svg class="h-10 w-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Goose body -->
          <ellipse cx="55" cy="60" rx="28" ry="22" fill="white" stroke="black" stroke-width="2"/>
          <!-- Goose neck -->
          <path d="M 30 50 Q 20 35 25 25" stroke="black" stroke-width="2.5" fill="none"/>
          <ellipse cx="25" cy="47" rx="6" ry="12" fill="white" stroke="black" stroke-width="2"/>
          <!-- Goose head -->
          <circle cx="25" cy="25" r="8" fill="white" stroke="black" stroke-width="2"/>
          <!-- Goose beak -->
          <path d="M 20 25 L 12 25 L 15 22 Z" fill="orange" stroke="black" stroke-width="1.5"/>
          <path d="M 20 25 L 12 25 L 15 28 Z" fill="orange" stroke="black" stroke-width="1.5"/>
          <!-- Eye -->
          <circle cx="26" cy="23" r="2" fill="black"/>
          <!-- Wing -->
          <path d="M 50 55 Q 65 50 70 58" stroke="black" stroke-width="2" fill="none"/>
          <!-- Tail feathers -->
          <path d="M 75 65 L 85 60 M 75 68 L 88 68 M 75 71 L 85 76" stroke="black" stroke-width="2"/>
        </svg>
        <div>
          <div class="text-xl font-bold text-white">
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