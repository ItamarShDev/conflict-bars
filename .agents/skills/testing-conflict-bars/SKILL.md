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
   `timeline/conflicts.ts` data into the Convex event shape (`_id`, `_creationTime`, `start`, `end`, `title`, `title_he`, `reason`, `reason_he`, …).
2. Create an untracked `.env.local` in the repo root:
   ```
   NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
   CONVEX_URL=http://127.0.0.1:3210
   ```

### Shim request/response details

`preloadQuery` (convex/nextjs) uses `ConvexHttpClient` and sends a `POST /api/query` body like:

```json
{
  "path": "events/getAllEvents",
  "format": "convex_encoded_json",
  "args": [{}]
}
```

A working shim only needs to return the Convex-encoded JSON value:

```js
import { convexToJson } from "/path/to/repo/node_modules/convex/dist/esm/values/index.js";

const events = legacyConflicts.map((c, i) => ({
  _id: `event${i}`,
  _creationTime: Date.now(),
  start: c.time.start,
  end: c.time.end,
  title: c.conflict.title,
  title_he: c.conflict.title_he,
  reason: c.conflict.reason,
  reason_he: c.conflict.reason_he,
  description: c.conflict.description,
  description_he: c.conflict.description_he,
  effects: c.conflict.effects,
  effects_he: c.conflict.effects_he,
  wikipedia_url: c.conflict.wikipedia_url,
}));

const value = convexToJson(events); // plain JSON array of objects for string-only fields
res.end(JSON.stringify({ status: "success", value }));
```

No `WebSocket` support is needed for the server render; the browser `ConvexProvider` will attempt WebSocket reconnection, but read-only timeline rendering still works.

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

## Card/song counts must be re-baselined after any `data/` change

`data/songs-generated.json` is generated and gitignored, and `loadFileSongs()` reads it directly at
request time. Two failure modes to watch for:

1. **Stale dev-server bundle.** If `npm run generate-songs` (or a data commit) changes the JSON while
   `next dev` is running, one route can keep serving an older snapshot while another serves the new
   one — e.g. `/en` reporting 149 cards and `/he` reporting 153 at the same time. This is a testing
   artifact, not a product bug. Before trusting counts, kill the dev server, `rm -rf .next/dev`, and
   restart. A hard browser reload alone is NOT enough.
2. **The shared checkout can move under you.** In a lead/tester split the lead may commit new data
   mid-run. Always re-derive expected counts from the JSON at the *current* HEAD immediately before
   asserting, and record the commit SHA in the report. Handy one-liner:

```
git log --oneline -1 && node -e 'const s=require("./data/songs-generated.json");console.log(s.length)'
```

Also note `.env.local` is gitignored and can disappear during cleanup/commits; if the dev server
suddenly 500s with `Environment variable NEXT_PUBLIC_CONVEX_URL is not set`, just recreate it.

Beware `pkill -f next` right after spawning a new dev server — it kills the one you just started.
Prefer `setsid nohup npm run dev &` and verify with `curl -o /dev/null -w '%{http_code}'`.

## Card/song counts must be re-baselined after any `data/` change

`data/songs-generated.json` is generated and gitignored, and `loadFileSongs()` reads it directly at
request time. Two failure modes to watch for:

1. **Stale dev-server bundle.** If `npm run generate-songs` (or a data commit) changes the JSON while
   `next dev` is running, one route can keep serving an older snapshot while another serves the new
   one — e.g. `/en` reporting 149 cards and `/he` reporting 153 at the same time. This is a testing
   artifact, not a product bug. Before trusting counts, kill the dev server, `rm -rf .next/dev`, and
   restart. A hard browser reload alone is NOT enough.
2. **The shared checkout can move under you.** In a lead/tester split the lead may commit new data
   mid-run. Always re-derive expected counts from the JSON at the *current* HEAD immediately before
   asserting, and record the commit SHA in the report. Handy one-liner:

```
git log --oneline -1 && node -e 'const s=require("./data/songs-generated.json");console.log(s.length)'
```

Also note `.env.local` is gitignored and can disappear during cleanup/commits; if the dev server
suddenly 500s with `Environment variable NEXT_PUBLIC_CONVEX_URL is not set`, just recreate it.

Beware `pkill -f next` right after spawning a new dev server — it kills the one you just started.
Prefer `setsid nohup npm run dev &` and verify with `curl -o /dev/null -w '%{http_code}'`.

### The song counter only renders when a filter or search is active
`Timeline.tsx` computes `searchCountText` as `null` unless `searchTerm` is non-empty or a
leaning/decade filter is set, so on a clean page load there is **no** `Found N song(s)` text to
assert against. To get an on-screen number equal to the whole catalog (a nice visual proof that
nothing was silently dropped), select **all four decade chips** — the decade buckets partition the
catalog, so the counter must equal the total record count. Otherwise count `.boombox-song-card`
elements in the DOM.

### Rebuilding the shim's event data
`/tmp/events.json` (input to `convex-shim.mjs`) does not survive box restarts. Regenerate it with a
throwaway tsx script that imports `israeliConflicts` from `timeline/conflicts.ts` — note the export
is named `israeliConflicts`, not `conflicts`. The script must live **inside the repo** (e.g.
`scripts/tmp-mkevents.ts`, then delete it) because tsx resolves relative imports from the file's own
directory; a script in `/tmp` fails with `Cannot find module './timeline/conflicts'`. There are 11
events, whose start years are the 11 conflict years.

### Expected section count = union of song years and conflict years
Sections are the union, so the count is NOT the number of song years. Conflict years with zero songs
(e.g. 1991, 1993, 2005) still render a section containing only the conflict card — that is correct,
not an "empty section". Derive it explicitly:

```
python3 -c "
import json
cy={int(str(e['start'])[:4]) for e in json.load(open('/tmp/events.json'))}
sy={int(str(s['published_date'])[:4]) for s in json.load(open('data/songs-generated.json'))}
print('sections',len(cy|sy),'conflict',len(cy&(cy|sy)),'noConflict',len(sy-cy))"
```

## Driving exact viewports (mobile / tablet / desktop)

Chrome enforces a minimum window width around 500 CSS px, so you cannot get a 375px viewport by
resizing the window. Use CDP device-metrics emulation against the DevTools endpoint (port is
typically `29229` on the Devin box; check `curl http://localhost:29229/json/list`):

- `Emulation.setDeviceMetricsOverride {width, height, deviceScaleFactor: 0, mobile: false}`
- `Emulation.clearDeviceMetricsOverride`

**Important:** resizing or maximising the Chrome window **clears** the override — re-apply it after
any `wmctrl` call. Shrinking the window to ~532px wide while emulating 375px makes the recording
look like a phone.

### Devin mouse-coordinate gotcha

On a 1600×1200 display, the test harness maps its 1024×768 coordinate space to the real screen, but
clicks near the browser window chrome (close/maximise buttons or title bar) can hit the Chrome frame
instead of the intended page control. When the recording needs precise clicks on small fixed controls
(e.g. the `?` help button or `Submit a song` button), prefer driving the click with
`document.querySelector(...).click()` via the DevTools console and capturing the resulting state
with screenshots. Always verify the actual cursor/element with `document.elementFromPoint(x, y)`.

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

## Verifying `links` (YouTube / Genius / lyrics) at scale

Song cards render one anchor per truthy value in `links` (`lyrics`, `song_info`, `youtube`). Cards
with no links omit the row entirely, so "no empty link row" is checkable in the DOM.

- **Assert by anchor *label*, not by hostname.** Lyrics links are not all Genius (also
  lyricstranslate, bandcamp, shirrim, songtexte), so a hostname regex undercounts and silently
  reclassifies some lyrics links as "Info". Counting the rendered label is exact and locale-aware:
  English `Lyrics` / `YouTube` / `Info`, Hebrew `מילים` / `יוטיוב` / `מידע`. These label counts
  should equal the source counts from `data/songs-generated.json`.
- **Verify all YouTube links cheaply via oEmbed** instead of only spot-checking a few. A deleted or
  private video returns HTTP 404/401, a live one returns JSON with `title` + `author_name`:
  `https://www.youtube.com/oembed?format=json&url=<encoded watch URL>`
  Then token-match the returned `title` against the card's song name to catch *right artist, wrong
  song*. Expect false positives from transliteration/translation: a card named `נולדתי פה` legitimately
  maps to a video titled "Born Here", and `Kulun 'Andun Dababat` to "Kollon 3endon Dababaat" — check
  those by eye rather than treating them as mismatches.
- **genius.com returns 403 to this VM** (Cloudflare human-check), in the browser *and* via curl, and
  the `r.jina.ai` text proxy is also blocked for genius.com. Report Genius content checks as
  environment-blocked/untested rather than as failures. lyricstranslate.com and bandcamp also
  bot-challenge CLI requests but load fine in the real browser — recheck a 403 in the browser before
  calling a link dead. A genuine dead link looks different: songtexte.com served a real
  "Seite nicht gefunden (404)" page.
- The Wayback availability API (`https://archive.org/wayback/available?url=...`) is a useful
  independent existence signal for blocked domains, but it is **flaky for exact-URL queries** and
  produced false "no snapshot" results here. Re-query individually before reporting a URL as
  unarchived, and never state a link is fabricated on a single negative.
- Removing a record's only *lyrics* link does not make the record link-less if it still has a
  YouTube link — the "cards with no links" total stays put. Recompute that number from the data
  rather than adjusting it by hand.
- One track credited to several artists is stored as one record per artist (e.g. "Inn Ann" for
  Al Nather / Daboor / Shabjdeed), so the same URL legitimately appears on multiple cards. This is
  intended, not duplication.

## Auditing `lyric_sample` rendering

`SongEntry.tsx` picks the lyric per locale with a fallback: `/he` prefers `hebrew` then
`english_translation`, `/en` the reverse. Consequences when auditing data that has partial samples:

- A record with **only** `english_translation` still renders on `/he` (via fallback), but `dir` is
  set to `"rtl"` only when `lang === "he" && lyricSample.hebrew`, so English-only samples correctly
  render `dir="ltr"` inside the RTL card. Verify the text stays within the card rect rather than
  assuming breakage.
- The block is guarded by `lyricSample && lyricContent`, so a sample whose fields are all empty
  renders nothing at all — there is no empty-quotes block to hunt for. Assert this positively:
  count lyric blocks and compare to the number of records with a non-empty sample.
- **The component adds its own wrapping `"` quotes.** If the data value itself starts or ends with a
  quote character (straight or curly), the card visibly renders a doubled quote such as
  `""Our fathers...` or `...its day"."`. This is a data-hygiene issue, not a component bug, and it is
  easy to miss because it only shows in pixels. Scan the source for it, remembering that which field
  renders depends on locale:

```
python3 -c "
import json
Q='\"\u201c\u201d'
for s in json.load(open('data/songs-generated.json')):
    for k,v in (s.get('lyric_sample') or {}).items():
        if not v: continue
        v=v.strip()
        if v[0] in Q or v[-1] in Q or (v[-1]=='.' and v[-2] in Q):
            print(k, s['artist'], s['name'])"
```

Prose-summary samples (allowed by `AGENTS.md` when only context exists, not lyrics) are the most
likely offenders because they quote a refrain at the end.

## Leaning borders: assert the border is painted, not just the class

After deletions from `timeline/artist-political-affiliation.ts`, "no broken leaning border" needs two
checks: every card carries a `leaning-*` class, **and** the accent border actually paints. Read
computed styles and require a non-zero width and a non-transparent colour — the accent is 8px on one
side only (left in LTR, mirrored to right in RTL), so take `max(borderLeftWidth, borderRightWidth)`:

| leaning | accent colour |
|---|---|
| left | `rgb(255, 45, 85)` pink |
| right | `rgb(0, 170, 255)` blue |
| center | `rgb(255, 213, 0)` yellow |
| unknown | `rgb(158, 154, 147)` grey |

Grey `unknown` is a *painted* border, not a missing one. It recurs for artists whose affiliation
string contains no `left`/`right`/`center` substring — historically Shabak Samech
(`Counterculture / Apolitical`), Saz (`Palestinian / Coexistence advocacy`) and Noroz. Screenshot a
section that mixes an unknown card with a classified one so the difference is visibly a colour
choice. Whether grey is the desired presentation for apolitical artists is a standing product
question, not a bug to report each run.

## Devin Secrets Needed

- `NEXT_PUBLIC_CONVEX_URL` / Convex deploy key — required for any real query, mutation or
  end-to-end submission test. Without it, only read-only file-backed rendering can be tested.
- `GMAIL` (Gmail app password used by `src/actions/email.ts`) — required to verify submission
  notification emails. Not available by default.

## RTL and Hebrew-input gotchas

- The OS keyboard layout may not support Hebrew, so `computer.type` with Hebrew Unicode may not enter characters in form inputs.
- Workaround: use `browser_console` to set the input value and dispatch `new Event('input', { bubbles: true })`. In React-controlled inputs this is usually enough to trigger `onChange`.
- For `/he` the search input is `dir="rtl"`, so Hebrew text displays correctly. For `/en` the input is `dir="ltr"`, so Hebrew text appears visually reversed.
- `LanguageSwitcher` DOM text is `עברית / English` on `/he` and `English / עברית` on `/en`. In an RTL context the slash and Latin text may be reordered by the Unicode bidi algorithm, so trust `textContent` for assertions.

## CDP device-metrics persistence

- `Emulation.setDeviceMetricsOverride` with `mobile: true` can persist across reloads.
- `Emulation.clearDeviceMetricsOverride` should be followed by `Page.reload` to take effect.
- Maximising the Chrome window does **not** always clear the override; if it persists, open a fresh tab or explicitly set a desktop viewport and reload.
- Use `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (not `window.innerWidth`) to check horizontal overflow after overriding.

## Favicon metadata

- Next.js may render two `<link rel="icon">` tags from `icons: { icon: "/favicon.svg" }`: one auto-generated `.ico` with a query parameter and one `/favicon.svg`. Both should resolve; verify `/favicon.svg` returns an SVG response.
