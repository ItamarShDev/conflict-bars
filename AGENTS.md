# AGENTS Guide

This doc orients AI/automation agents to work safely and effectively on ConflictBars, an interactive bilingual timeline of Israeli hip‑hop and key conflicts.

## Purpose & Scope
- Purpose: Connect key Israeli conflicts with contemporaneous hip-hop output so users can explore cultural responses alongside events; keep language neutral, sourced, and concise.
- Song types included: Studio releases, singles, notable collaborations, politically contextual tracks, and vetted community submissions with clear dates/links.
- Out of scope: Off-topic or undated items, non-hip-hop entries unless directly tied to the scene or conflicts, and unsourced claims.

## Song Eligibility
- Must be Israeli hip-hop (artists from or rooted in the Israeli/Palestinian scene).
- Must reference or clearly relate to Israeli conflicts (timing, lyrics, context, or public reception). Purely apolitical tracks without conflict relevance belong out of scope.
- Include links and dates to support conflict relevance.

## Audience & Goals
- Audience: AI/automation agents and contributors acting on scripted tasks (content, code, data).
- Goal: Preserve product intent, neutrality, data integrity, and operational safety while making targeted changes.

## Product in 60s
- What it is: A two-sided timeline showing major conflicts (left column) alongside songs/releases (right) with political-leaning cues.
- UX highlights: Bilingual UI (en/he), “How it works” help modal, political leaning color borders, song stack + submit-song modal.
- Tone: Neutral, sourced, concise. Avoid editorializing.

## Architecture Overview
- Frontend: Next.js 15 (App Router) + React 19 + TypeScript 5 + Tailwind CSS v4.
- Backend/Data: Convex (songs/events tables, generated API types). Core files: `convex/songs.ts`, `convex/events.ts`, `convex/mutations.ts`, `convex/schema.ts`.
- Data flow: Convex queries preload songs/events → `src/utils/convex-helpers.ts` converts to timeline-friendly shape → `src/utils/timeline.ts` merges conflicts and songs → rendered by `src/components/timeline/Timeline.tsx` and children.
- Translations: `src/components/timeline/translations.ts` (en/he strings).

## Data & Content Sources
- Primary: Convex DB (songs/events). Migrate/import scripts under `scripts/` and `npm run migrate`.
- Legacy/reference: `data/` and `timeline/` folders (artist decades, conflict metadata, political affiliation map in `timeline/artist-political-affiliation.ts`).
- Content expectations: Each entry should have dates, links, and optional political affiliation; keep language neutral and sourced where possible.

## Operations (local)
1) Install deps: `npm install`
2) Run Convex dev server (required): `npx convex dev`
3) Seed/migrate data (first time): `npm run migrate`
4) Start app: `npm run dev` → http://localhost:3000

Other commands: `npm run lint`, `npm run build`, `npm run start`, `npx convex dashboard`.

## Contribution Guidance for Agents
- Respect neutrality: Do not introduce biased language; keep political labels factual and minimal.
- Validate data: Prefer Convex as source of truth; keep legacy files consistent if touched.
- i18n: Maintain both en/he strings when adding UI copy; mirror structure in translations file.
- Safety: Avoid destructive commands; do not remove data unless explicitly requested. No hardcoded secrets.
- Code style: Follow existing patterns (Tailwind utilities, TS types). Add concise comments only for non-obvious logic.
- PR-ready changes: Run lint/build locally when feasible; keep changes scoped.

## References
- Project README: `README.md`
- Convex migration notes: `CONVEX_MIGRATION.md`
- Timeline utilities: `src/utils/convex-helpers.ts`, `src/utils/timeline.ts`
- Translations: `src/components/timeline/translations.ts`
- Political affiliation map: `timeline/artist-political-affiliation.ts`
