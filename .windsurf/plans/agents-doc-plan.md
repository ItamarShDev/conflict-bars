# AGENTS.md plan

Create AGENTS.md that succinctly explains the ConflictBars project purpose, architecture, data sources, and contribution expectations for AI/automation agents.

- Outline the audience and goals for AGENTS.md (who should read it and what they need to know).
- Summarize the product: interactive timeline of Israeli hip-hop vs. conflicts, key features (bilingual UI, political leaning indicators, song submission modal), and UX intent.
- Describe architecture and stack: Next.js App Router, React/TS, Tailwind v4, Convex backend (songs/events tables, migrations), data flow from Convex queries to timeline rendering utilities.
- Note content sources: Convex data, legacy timeline files in `data/` and `timeline/`, political affiliation mapping, translation files, and how entries are structured.
- Add operational guidance: local setup commands (npm install, convex dev, migrate, dev server), deployment expectations (build/start), linting/build checks.
- Include contribution etiquette and quality bar for agents: neutrality of tone, sourcing, localization considerations, and avoiding destructive changes.
- Keep the doc concise, skimmable, and link to existing files (README, CONVEX_MIGRATION.md) for depth.
