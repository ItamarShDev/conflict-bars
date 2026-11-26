import { readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { artistPoliticalAffiliation } from "../timeline/artist-political-affiliation";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../data");
const outputPath = join(__dirname, "../data/songs-generated.json");

type RawSong = {
	name?: unknown;
	artist?: unknown;
	collaborators?: unknown;
	published_date?: unknown;
	political_leaning?: unknown;
	language?: unknown;
	lyric_sample?: unknown;
	context?: unknown;
	full_lyrics?: unknown;
	links?: unknown;
};

function isRawSong(value: unknown): value is RawSong {
	return (
		typeof value === "object" &&
		value !== null &&
		"name" in value &&
		"artist" in value
	);
}

function walk(dir: string): RawSong[] {
	const songs: RawSong[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			songs.push(...walk(full));
			continue;
		}
		if (!entry.endsWith(".ts") || entry === "index.ts") continue;
		const mod = require(full) as Record<string, unknown>;
		for (const val of Object.values(mod)) {
			if (!Array.isArray(val)) continue;
			for (const item of val) {
				if (isRawSong(item)) songs.push(item);
			}
		}
	}
	return songs;
}

const rawSongs = walk(dataDir);

const enriched = rawSongs.map((song) => {
	const details =
		artistPoliticalAffiliation[
			song.artist as keyof typeof artistPoliticalAffiliation
		];
	return {
		...song,
		artist_details: details
			? {
					affiliation: details.affiliation,
					era: details.era,
					notes: details.notes,
				}
			: undefined,
	};
});

const LYRIC_KEYS = ["hebrew", "arabic", "english_translation"] as const;

function lyricExcerpt(song: RawSong) {
	return song.lyric_sample as Record<string, unknown> | undefined;
}

function lyricsLink(song: RawSong) {
	const links = song.links as Record<string, unknown> | undefined;
	return typeof links?.lyrics === "string" ? links.lyrics.trim() : "";
}

function hasSourcedLyricExcerpt(song: RawSong) {
	return (
		LYRIC_KEYS.some((key) => {
			const value = lyricExcerpt(song)?.[key];
			return typeof value === "string" && value.trim().length > 0;
		}) && lyricsLink(song).length > 0
	);
}

// Songs without a sourced lyric excerpt stay in data/ but are held out of
// the generated catalog, which feeds both public surfaces (timeline, bubble).
const publishable = enriched.filter(hasSourcedLyricExcerpt);
const heldOut = enriched.filter((song) => !hasSourcedLyricExcerpt(song));

writeFileSync(outputPath, JSON.stringify(publishable, null, 2));
console.log(`Generated ${publishable.length} songs → ${outputPath}`);

if (heldOut.length > 0) {
	console.warn(
		`⚠ ${heldOut.length} songs held out of the catalog (missing sourced lyric excerpt):`,
	);
	for (const song of heldOut) {
		const missing = [
			!LYRIC_KEYS.some((key) => {
				const value = lyricExcerpt(song)?.[key];
				return typeof value === "string" && value.trim().length > 0;
			}) && "excerpt",
			!lyricsLink(song) && "lyrics source",
		]
			.filter(Boolean)
			.join(" + ");
		console.warn(`  held out: ${song.artist} | ${song.name} (${missing})`);
	}
}
