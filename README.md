# statue-games

A proof of concept demonstrating how Statue can be used to build a lightweight games hub. The project showcases a clean, nostalgic approach to web-based gaming without the usual clutter of modern game portals.

## What This Is

This project started as an experiment to see whether Statue could handle a multi-page gaming site with minimal overhead. The result is a compact arcade hub that features simple, browser-based games like Tic-Tac-Toe, Brickbreaker, Crazy Eights, and Hot Dog Race. Each game lives on its own dedicated page, and the whole experience runs entirely in the browser with no accounts, no tracking, and no unnecessary complexity.

## Live Demo

You can play the games and explore the hub at https://statue-games.pages.dev

## Technical Approach

The site was built using Statue, which proved well-suited for creating a static games hub with multiple routes and isolated game states. Each game operates independently on its own page, which keeps the codebase manageable and makes it easy to add new games without touching existing ones.

The entire project is deployed on Cloudflare Pages, taking advantage of their edge network for fast load times. Since everything runs client-side, there's no backend infrastructure to maintain or scale.

## Future Possibilities

While this is primarily a proof of concept, the architecture makes it straightforward to expand. Adding new games means creating a new route and game component, then adding a card to the gallery. The pattern is repeatable, which was one of the goals from the start.

The project could easily accommodate puzzle games, reflex challenges, or other lightweight interactive experiences that fit the "tiny internet games" philosophy.
