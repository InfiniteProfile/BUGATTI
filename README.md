# BUGATTI

An independent, Bugatti-only profile gallery with an effectively unbounded sequence of profiles (1, 2, 3, ... with no final number), built with vanilla HTML, CSS and JavaScript.

**Not affiliated with or endorsed by Bugatti.** No official logos are used. All cars are CSS illustrations, not photographs.

## Features
- Unbounded profile sequence, directly addressable by number (e.g. 500000).
- Endless scrolling in both directions using a small, recycled set of cards.
- Search by exact profile number, with arbitrary large integers (up to 200 digits).
- Deep links: `index.html#500000` opens that profile.
- CSS-built car views: front, front three-quarter (pseudo-3D), side and rear three-quarter, in four silhouette families (vintage, hypercar, track, wedge).
- No backend, API, library or build step.

## Files
- `index.html` page shell and search form
- `style.css` design system and CSS car rendering
- `script.js` documented model data, generator, virtual feed, search
- `README.md` this file

## Deploy on GitHub Pages
Push the four files to a repository, then Settings > Pages > Deploy from a branch > `main` / root.

## How it works
- **Deterministic generation:** the profile number is hashed (splitmix64-style mixing over its 64-bit chunks) into a seed. The same number always gives the same car, colour, wheels, view and setting. `Math.random()` is never used.
- **BigInt search:** input is validated as digits only, normalised (leading zeros removed), and parsed with `BigInt`. Neighbours use BigInt arithmetic, so numbers are never rounded, abbreviated or shown in scientific notation. Searching rebinds the card pool to the target; no intermediate profile is generated.
- **DOM recycling:** a fixed pool of 14 or more cards is absolutely positioned inside a fixed-height track. When the viewport nears either end, cards are moved to the other end, rebound to new numbers, and the scroll offset is corrected by the exact distance in the same frame, so nothing visibly jumps. Profile 1 is the only lower limit. At most 48 recent profiles are cached.

## Real models versus fictional concepts
- Profiles 1 to 12 are documented Bugatti models, and about one in five later profiles are too. They carry a gold, solid-outline tag (Documented model, one-off or concept) and only facts taken from `REAL` in `script.js`. Figures marked "claimed" are manufacturer claims.
- All other profiles are named `Bugatti-Inspired Concept <number>`, carry a blue dashed tag reading "Fictional concept", and show no specifications.
- Livery colours on documented models are illustrative, not factory records.
- Authentic photographs are not bundled because no image URLs have been verified for reuse. Add only images whose licence you have confirmed.
