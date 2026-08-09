# AGENTS Guide

This doc orients AI/automation agents to work safely and effectively on ConflictBars, an interactive bilingual timeline of Israeli/Palestinian hip‑hop and key conflicts.

## Purpose & Scope
- Purpose: Connect key conflicts with contemporaneous hip-hop output so users can explore cultural responses alongside events; keep language neutral, sourced, and concise.
- Song types included: Studio releases, singles, notable collaborations, politically contextual tracks, and vetted community submissions with clear dates/links.
- Out of scope: Off-topic or undated items, non-hip-hop entries unless directly tied to the scene or conflicts, and unsourced claims.

## Song Eligibility
- Must be Israeli/Palestinian hip-hop (artists from or rooted in the scene). Scene-adjacent acts that rap (e.g. Hatikva 6) count.
- Must reference or clearly relate to the conflicts (timing, lyrics, context, or public reception). Purely apolitical tracks without conflict relevance belong out of scope.
- Must be verifiable: the release exists, the artist and title are correct, and the date is real.
- Include links and dates to support conflict relevance.
- Never invent a record, a lyric, or a URL. A fabricated YouTube/Genius ID is worse than no link — verify a URL resolves before adding it, and omit `links` entirely when nothing can be confirmed. When only prose context exists, put a neutral sourced summary in `lyric_sample.english_translation` rather than inventing lyrics.

## Audience & Goals
- Audience: AI/automation agents and contributors acting on scripted tasks (content, code, data).
- Goal: Preserve product intent, neutrality, data integrity, and operational safety while making targeted changes.

## Product in 60s
- What it is: A two-sided timeline showing major conflicts (one column) alongside songs/releases (the other) with political-leaning cues.
- UX highlights: Bilingual UI (en/he), “How it works” help modal, political-leaning color borders, filters (language/leaning/conflict), song stack + submit-song modal.
- Tone: Neutral, sourced, concise. Avoid editorializing.

## Architecture Overview
- Frontend: Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4. Lint/format via Biome 2.
- Songs: file data under `data/`, compiled to `data/songs-generated.json` at `predev`/`prebuild` and read server-side by `src/utils/file-songs.ts`.
- Conflicts/events + submissions: Convex (`convex/schema.ts`, `convex/events.ts`, `convex/songs.ts`, `convex/artists.ts`, `convex/mutations.ts`).
- Data flow: `src/app/[lang]/page.tsx` loads generated songs and preloads `api.events.getAllEvents` → `src/utils/convex-helpers.ts` normalizes events → `src/utils/timeline.ts` merges conflicts and songs by year → rendered by `src/components/timeline/Timeline.tsx` and children.
- Routing/i18n: locale is the `[lang]` segment (`en`/`he`); `next.config.ts` redirects `/` → `/he`. UI strings in `src/components/timeline/translations.ts`.

## Timeline rendering rules
- The timeline renders the **union** of years that have a conflict and years that have a song, so a song in a year with no recorded conflict still appears, with a neutral “no recorded conflict for this year” note in the conflict column. Do not re-gate rendering on conflict years only.
- `published_date` is parsed with `new Date()`. Decade placeholders (`"2020s"`) produce an invalid date and the entry silently disappears — always use `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`.
- Political-leaning borders come from `timeline/artist-political-affiliation.ts`, keyed by the **exact** `artist` string used in the song records. A key that differs by a character (transliteration, Hebrew spelling) falls back to the grey “unknown” border. When adding an artist, add the map entry with the identical string.

## Data & Content Sources
- Source of truth for songs: `data/<artist>/<era>.ts`. `data/songs-generated.json` is a build artifact and git-ignored — never edit it by hand.
- `scripts/generate-songs-json.ts` walks `data/` recursively and picks up **every** exported array in every `.ts` file except `index.ts`. Consequently, dropping an artist from `index.ts` does not remove their songs; delete the era files (or the artist folder) instead. Re-run `npm run generate-songs` after any data change and check the printed count.
- Conflicts: `timeline/conflicts.ts` + `timeline/conflict-utils.ts` for file data; Convex `events` for what the app renders (seed with `npm run migrate:events`).
- Content expectations: dates, links, neutral bilingual context, and a political-affiliation entry per artist.

### Song shape (file data)
```ts
{
  name: "Song Title (transliteration / translation)",
  artist: "Artist Name (native)",
  collaborators?: string[],
  language?: "Hebrew" | "Arabic" | "English" | "Hebrew/Arabic",
  published_date: "YYYY" | "YYYY-MM" | "YYYY-MM-DD",
  lyric_sample?: { hebrew?: string; english_translation?: string },
  links?: { lyrics?: string; song_info?: string; youtube?: string },
}
```
- Era buckets are file names: `90s.ts`, `2000s.ts`, `2010s.ts`, `2020s.ts`; each artist's `index.ts` re-exports the combined array. A song must live in the era file matching its year.
- Shared types: `timeline/types.ts`.

### Song shape (Convex)
- Table `songs`: `name`, `artist_id`, optional `collaborator_ids`, `published_date` (string), `published`, optional `language`, `lyric_sample` (`hebrew`, `english_translation`), `links` (`lyrics`, `song_info`, `youtube`), `submitted_by`.
- `convex/songs.ts` hydrates artist + collaborators and sorts by date. Mutations: `insertSong`, `updateSong`, `deleteSong` plus artist/collaborator helpers. Visitor corrections land in `song_edit_suggestions` (`convex/mutations.ts`) and are emailed by `src/actions/email.ts`.

### Data hygiene
- One record per artist+song. When merging duplicates keep the richest entry (lyrics, links, language, collaborators) and the better-sourced date.
- Keep the artist string byte-identical across records, collaborator lists, and the affiliation map.
- Do not remove data unless it is fabricated, out of scope, or unverifiable — and say so in the PR.

## Operations (local)
1) `npm install`
2) `npx convex dev` (required — conflicts come from Convex)
3) First time: `npm run migrate` (songs/artists) and `npm run migrate:events` (conflicts)
4) `npm run dev` → http://localhost:3000 (redirects to `/he`)

Checks before opening a PR: `npm run generate-songs`, `npm run lint` (Biome), `npm run typecheck`, `npm run build`. Formatting fixes: `npm run format` or `npx biome check --write <paths>`.
Other: `npm run db:clear`, `npm run reset-data`, `npm run migrate:language`, `npx convex dashboard`.

## Contribution Guidance for Agents
- Respect neutrality: Do not introduce biased language; keep political labels factual, sourced, and minimal.
- Validate data: verify existence, artist, title, date, and conflict relevance before adding; verify links resolve.
- i18n: Maintain both en/he strings when adding UI copy; mirror structure in the translations file.
- Safety: Avoid destructive commands; no hardcoded secrets.
- Code style: Follow existing patterns (Tailwind utilities, TS types). Add concise comments only for non-obvious logic.
- PR-ready changes: keep them scoped and run the checks above.

## References
- Project README: `README.md`
- Data contribution notes: `data/AGENTS.md`
- Song generation: `scripts/generate-songs-json.ts`, `src/utils/file-songs.ts`
- Timeline utilities: `src/utils/timeline.ts`, `src/utils/convex-helpers.ts`
- Translations: `src/components/timeline/translations.ts`
- Political affiliation map: `timeline/artist-political-affiliation.ts`
