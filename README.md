# ConflictBars

An interactive timeline exploring Israeli hip‑hop artists and key events across years and decades. Built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Project Goal

The goal of this project is to document and visualize how Israeli hip‑hop intersects with key sociopolitical events, especially periods of conflict. The timeline aims to:

- Provide a clear, chronological view of artists, releases, public statements, and notable events by decade.
- Offer neutral, contextual metadata such as stated or perceived political affiliations, when relevant.
- Make exploration accessible in multiple languages through locale‑aware routing.
- Encourage community contributions to expand coverage and improve accuracy.

Where possible, entries should be concise, sourced, and written in a neutral tone. See the Timeline Content Model section below for how data is structured.

## Stack

- Next.js 15 (App Router) with Turbopack
- React 19
- TypeScript 5.x
- Tailwind CSS v4
- ESLint 9
- Convex (Database & Backend)

Project structure follows `src/` with `@/*` path alias.

## Project Structure

- `src/app/`
  - `timeline/` — timeline routes and data per artist/decade
  - `[lang]/` — language-aware segment (middleware-based detection)
  - `favicon.ico`, globals, route files
- `src/data/` — shared data (if any)
- `src/middleware.ts` — locale middleware and routing helpers
- `public/` — static assets (icons, svgs)

## Local Development

1) Install dependencies

```bash
npm install
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
npm run migrate
```

This populates your Convex database with existing songs and events data.

4) Start the Next.js dev server

In another terminal:

```bash
npm run dev
```

Open http://localhost:3000

**Note:** The Convex dev server must be running for the app to work.

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — production build (Next.js with Turbopack)
- `npm run start` — start production server
- `npm run lint` — run ESLint on `src`
- `npm run migrate` — migrate data to Convex database
- `npx convex dev` — start Convex development server
- `npx convex dashboard` — open Convex dashboard in browser

## Timeline Content Model

### Database (Convex)

Timeline data is now stored in Convex database with two main tables:

- **songs** — Song entries with artist, date, lyrics, links
- **events** — Conflict/event entries with dates, descriptions, effects

You can view and manage data at https://dashboard.convex.dev

### Schema & Queries

- `convex/schema.ts` — Database schema definition
- `convex/songs.ts` — Song queries
- `convex/events.ts` — Event queries
- `convex/mutations.ts` — Data mutations

### Legacy Data Files

Original data files are kept in `src/app/timeline/` for reference and migration:

- `src/app/timeline/tuna/2010s.ts`
- `src/app/timeline/subliminal/2010s.ts`
- `src/app/timeline/conflicts.ts`

Metadata like political affiliation is still in:

- `src/app/timeline/atrist-political-affiliation.ts`

For detailed migration information, see [CONVEX_MIGRATION.md](./CONVEX_MIGRATION.md)

## Internationalization

The app uses a `[lang]` segment and middleware (`src/middleware.ts`) to support locale-aware routing.

## Styling

Tailwind CSS v4 is configured. Use utility classes in your components; global styles live under `src/app/` as needed.

## Deployment

The app is ready for deployment on platforms like Vercel. Build with:

```bash
npm run build && npm run start
```

See Next.js deployment docs for details: https://nextjs.org/docs/app/building-your-application/deploying

## Contributing

1. Create a feature branch.
2. Make changes with type-safe timeline entries in `src/app/timeline/`.
3. Run `npm run lint` and `npm run build` to verify.
4. Open a PR.

## License

License not specified.
