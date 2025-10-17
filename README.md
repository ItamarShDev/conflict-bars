# Israeli Hip‑Hop Conflict Timeline

An interactive timeline exploring Israeli hip‑hop artists and key events across years and decades. Built with TanStack Router, Vite, React, TypeScript, and Tailwind CSS.

## Project Goal

The goal of this project is to document and visualize how Israeli hip‑hop intersects with key sociopolitical events, especially periods of conflict. The timeline aims to:

- Provide a clear, chronological view of artists, releases, public statements, and notable events by decade.
- Offer neutral, contextual metadata such as stated or perceived political affiliations, when relevant.
- Make exploration accessible in multiple languages through locale‑aware routing.
- Encourage community contributions to expand coverage and improve accuracy.

Where possible, entries should be concise, sourced, and written in a neutral tone. See the Timeline Content Model section below for how data is structured.

## Stack

- TanStack Router (file-based routing)
- Vite (build tool)
- React 19
- TypeScript 5.x
- Tailwind CSS v4
- Biome (linting & formatting)
- Convex (Database & Backend)
- Bun (package manager)

Project structure follows `src/` with `@/*` path alias.

## Project Structure

- `src/routes/` — TanStack Router file-based routes
  - `__root.tsx` — Root layout with locale middleware
  - `$lang.tsx` — Dynamic locale route
- `src/components/` — React components
- `src/utils/` — Utility functions
- `convex/` — Convex database schema and functions
- `public/` — Static assets (icons, svgs)
- `scripts/` — Build and utility scripts

## Local Development

1) Install dependencies

```bash
bun install
```

2) Start the Convex development server (required)

```bash
npx convex dev
```

This will:
- Create a Convex deployment (or connect to existing)
- Generate type-safe API code
- Set up environment variables
- Watch for changes to Convex functions

**Keep this terminal running.**

3) Migrate data to Convex (first time only)

In a new terminal:

```bash
bun run migrate
```

This populates your Convex database with existing songs and events data.

4) Start the development server

In another terminal:

```bash
bun run dev
```

Open http://localhost:5173

**Note:** The Convex dev server must be running for the app to work.

## Available Scripts

- `bun run dev` — start development server
- `bun run build` — production build
- `bun run prerender` — build and prerender static files
- `bun run start` — start production preview server
- `bun run lint` — run Biome linter on `src`
- `bun run format` — format code with Biome
- `bun run typecheck` — run TypeScript type checking
- `bun run migrate` — migrate data to Convex database
- `npx convex dev` — start Convex development server
- `npx convex dashboard` — open Convex dashboard in browser

## Timeline Content Model

### Database (Convex)

Timeline data is stored in Convex database with two main tables:

- **songs** — Song entries with artist, date, lyrics, links
- **events** — Conflict/event entries with dates, descriptions, effects

You can view and manage data at https://dashboard.convex.dev

### Schema & Queries

- `convex/schema.ts` — Database schema definition
- `convex/songs.ts` — Song queries
- `convex/events.ts` — Event queries
- `convex/mutations.ts` — Data mutations

### Data Loading

- `src/routes/loaders.ts` — TanStack Router data loaders
- `src/routes/$lang.tsx` — Route with loader for timeline data

## Internationalization

The app uses a `$lang` route parameter to support locale-aware routing:
- `/he` — Hebrew (RTL)
- `/en` — English (LTR)

## Styling

Tailwind CSS v4 is configured. Use utility classes in your components; global styles live in `src/routes/globals.css`.

## Deployment

The app is ready for deployment to any static hosting service:

```bash
# Build and prerender static files
bun run prerender

# Preview the build locally
bun run start

# Deploy the `dist/` directory to your hosting provider
```

### Deployment Options

- **Vercel** — Deploy `dist/` directory
- **Netlify** — Deploy `dist/` directory
- **GitHub Pages** — Deploy `dist/` directory to `gh-pages` branch
- **Any CDN** — Upload `dist/` contents

The app is fully prerendered and works as a static site with client-side hydration.

## Contributing

1. Create a feature branch.
2. Make changes with type-safe timeline entries.
3. Run `bun run lint` and `bun run build` to verify.
4. Open a PR.

## License

License not specified.
