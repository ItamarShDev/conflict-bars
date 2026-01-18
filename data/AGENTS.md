# data/AGENTS quick map

Purpose: fast orientation for adding songs in `data/`.

## Structure
- Artist dirs: `data/<artist-kebab>/` (e.g., `data/guy-mazig/`).
- Era files: `90s.ts`, `2000s.ts`, `2010s.ts`, `2020s.ts` exporting `SongList` arrays.
- Per-artist `index.ts`: re-export combined arrays (e.g., `export const artist = [...artist2010s];`).

## Song shape (file data)
```ts
{
  name: "Song Title",
  artist: "Artist Name (native)",
  published_date: "YYYY" | "YYYYs",
  language?: "Hebrew" | "Arabic" | "English" | ..., 
  lyric_sample?: { hebrew?: string; english_translation?: string },
  links?: { lyrics?: string; song_info?: string; youtube?: string },
}
```

## Quick add steps
1) Find/create artist dir (`data/<artist-kebab>/`).
2) Open/create era file for song year; append entry inside exported array.
3) Ensure `index.ts` re-exports era array (add if missing).
4) Prefer richer data (lyrics, translation, links) per AGENTS guide.

## Cross-checks
- Keep naming consistent with Convex artist names when possible.
- Dates: use exact year when known; fallback to decade string if necessary.
- Neutral tone; include sources/links when available.
