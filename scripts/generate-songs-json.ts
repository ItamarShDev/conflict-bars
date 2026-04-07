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
	language?: unknown;
	lyric_sample?: unknown;
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

writeFileSync(outputPath, JSON.stringify(enriched, null, 2));
console.log(`Generated ${enriched.length} songs → ${outputPath}`);
