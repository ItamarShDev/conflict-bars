---
name: testing-conflict-bars
description: How to stand up and test the ConflictBars Next.js app locally (including without a real Convex deployment), and how to drive precise mobile/RTL viewport testing in the browser.
---

# Testing ConflictBars locally

## Running the app without a Convex deployment

`npm run dev` starts Next 16 on :3000 (a `predev` step regenerates `data/songs-generated.json`).

Song data comes from repo files (`loadFileSongs()` in `src/utils/file-songs.ts`), so **songs render without any backend**. The only server-side Convex dependency is
`preloadQuery(api.events.getAllEvents)` in `src/app/[lang]/page.tsx`, which fails the page render if `NEXT_PUBLIC_CONVEX_URL` / `CONVEX_URL` are unset.

If no `npx convex dev` login is available, you can unblock the page with a throwaway HTTP shim (keep it **outside** the repo / untracked):

1. Write a small `node:http` server on `127.0.0.1:3210` that answers `POST /api/query` with
   `{"status":"success","value": <array of events>}`. Events can be converted from the legacy
   `timeline/conflicts.ts` data into the Convex event shape (`_id`, `_creationTime`, `title`, `title_he`, `reason`, `reason_he`, …).
2. Create an untracked `.env.local` in the repo root:
   ```
   NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
   CONVEX_URL=http://127.0.0.1:3210
   ```

**Known limitation:** the browser Convex client (`useQuery` / `useMutation`) talks over a **WebSocket**, which an HTTP shim cannot serve. The console will loop
`WebSocket closed with code 1006 / Attempting reconnect`. Consequences:

- `api.artists.getAllArtists` / `api.songs.getAllSongs` resolve to `[]`.
- The submit-song mutation can **never** succeed, so the post-success path
  (`sendThankYouMail`, success toast, modal auto-close) is unreachable.
- You can still test client-side validation: required fields are `songName`, `artist`,
  `publishedDate`, `language`, `lyricHebrew`, and the artist must match a known Convex artist —
  with an empty artist list any filled-in form yields the "required fields" error, which is a
  usable way to prove error surfacing.

Report the submission/email path as untested unless a real Convex URL and a `GMAIL` credential are supplied.

## Before/after comparison against `main`

Do not switch branches in the shared checkout. Copy the repo to a sibling directory and check out
`main` there (or use `git worktree`), then run the reference server on another port:

```
npx next dev --hostname 127.0.0.1 --port 3001
```

Gotchas seen when copying a repo tree: a stray `node_modules/node_modules` symlink pointing outside
the filesystem root makes Turbopack fail with `Module not found: Can't resolve 'scheduler'`. Delete
that nested symlink and `rm -rf .next` before starting. Give the copy its own `.env.local`.

## Driving exact viewports (mobile / tablet / desktop)

Chrome enforces a minimum window width around 500 CSS px, so you cannot get a 375px viewport by
resizing the window. Use CDP device-metrics emulation against the DevTools endpoint (port is
typically `29229` on the Devin box; check `curl http://localhost:29229/json/list`):

- `Emulation.setDeviceMetricsOverride {width, height, deviceScaleFactor: 0, mobile: false}`
- `Emulation.clearDeviceMetricsOverride`

**Important:** resizing or maximising the Chrome window **clears** the override — re-apply it after
any `wmctrl` call. Shrinking the window to ~532px wide while emulating 375px makes the recording
look like a phone.

## Measuring horizontal overflow honestly

`document.documentElement.scrollWidth <= window.innerWidth` is a **weak** check: `innerWidth`
includes the classic scrollbar (~15px), so up to 15px of real overflow passes. Compare against
`document.documentElement.clientWidth` instead, and confirm by scrolling:

```js
window.scrollTo(9999, 0); const maxScrollX = window.scrollX; window.scrollTo(0, 0);
```

To locate the culprit, iterate elements whose `getBoundingClientRect().right > clientWidth`.

## Layout facts worth knowing

- Below `sm` (640px) the timeline is one full-width column ordered year header → conflicts → songs;
  at `sm`+ it is `grid-cols-[1fr_50px_1fr]` (songs | year marker | conflicts) with `sm:order-*`.
- The vertical centre line is `hidden sm:block`.
- The help button (`HelpModal.tsx`) is fixed `end-4 top-6` and the submit-song button
  (`SubmitSongModal.tsx`) is fixed `bottom-4 end-4`; in `/he` these mirror to the **left**.
- The Next.js dev-overlay indicator is also fixed bottom-left and will visually collide with the
  Hebrew submit button in dev. That is not a product bug.
- The expanded song modal's Close control is white text on `bg-white/10`; over a light backdrop it
  is nearly invisible in light mode. Pre-existing — don't attribute it to a layout PR.

## Devin Secrets Needed

- `NEXT_PUBLIC_CONVEX_URL` / Convex deploy key — required for any real query, mutation or
  end-to-end submission test. Without it, only read-only file-backed rendering can be tested.
- `GMAIL` (Gmail app password used by `src/actions/email.ts`) — required to verify submission
  notification emails. Not available by default.
