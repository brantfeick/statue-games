import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Using vitePreprocess for preprocessor
  preprocess: vitePreprocess(),

  kit: {
    // Cloudflare Pages adapter
    adapter: adapter(),

    // Custom alias defined to handle the content folder
    alias: {
      $content: path.resolve('./content'),
      $lib: path.resolve('./src/lib')
    },

    // Prerender the home page, game pages will be SSR disabled
    prerender: {
      entries: ['/'],
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore 404s for static assets during prerender
        if (path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
          return;
        }
        throw new Error(message);
      }
    }
  }
};

export default config; 