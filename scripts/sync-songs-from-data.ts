import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { config } from "dotenv";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { artistPoliticalAffiliation } from "../timeline/artist-political-affiliation";
import type { SongList } from "../timeline/types";

config({
	path: join(dirname(new URL(import.meta.url).pathname), "../.env.local"),
});

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
	console.error(
		"Error: NEXT_PUBLIC_CONVEX_URL environment variable is not set",
	);
	console.log("Please run 'npx convex dev' first to get your deployment URL");
	process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

function normalize(value: string) {
	return value.trim().toLowerCase();
}

function songKey(name: string, publishedDate: string) {
	return `${normalize(name)}|${publishedDate.trim()}`;
}

function loadDataSongs(): SongList {
	const dataDir = join(dirname(new URL(import.meta.url).pathname), "../data");
	const songFiles: SongList = [];

	function walk(directory: string) {
		for (const entry of readdirSync(directory)) {
			const fullPath = join(directory, entry);
			const stats = statSync(fullPath);
			if (stats.isDirectory()) {
				walk(fullPath);
				continue;
			}
			if (!entry.endsWith(".ts")) continue;
			if (entry === "index.ts") continue;
			const mod = require(fullPath);
			for (const value of Object.values(mod)) {
				if (Array.isArray(value)) {
					songFiles.push(...(value as SongList));
				}
			}
		}
	}

	walk(dataDir);
	return songFiles;
}

async function ensureArtist(
	name: string,
	data: (typeof artistPoliticalAffiliation)[string] | undefined,
) {
	const existing = await client.query(
		api.internal.artists.getByNormalizedName,
		{
			normalized: normalize(name),
		},
	);
	if (existing) return existing._id;
	return client.mutation(api.mutations.upsertArtist, {
		name,
		era: data?.era,
		affiliation: data?.affiliation,
		notes: data?.notes,
	});
}

async function upsertSong(song: SongList[number]) {
	const artistInfo = artistPoliticalAffiliation[song.artist] ?? undefined;
	const artistId = (await ensureArtist(
		song.artist,
		artistInfo,
	)) as Id<"artists">;

	const existing = await client.query(api.internal.songs.findByNameAndDate, {
		name: song.name,
		published_date: song.published_date,
	});

	if (existing) {
		await client.mutation(api.mutations.updateSong, {
			songId: existing._id,
			updates: {
				name: song.name,
				artist_id: artistId,
				language: song.language,
				lyric_sample: song.lyric_sample,
				links: song.links,
				published: true,
			},
		});
		return { action: "updated" as const, id: existing._id };
	}

	const inserted = await client.mutation(api.mutations.insertSong, {
		name: song.name,
		artistId,
		published_date: song.published_date,
		language: song.language,
		lyric_sample: song.lyric_sample,
		links: song.links,
		published: true,
	});
	return { action: "inserted" as const, id: inserted };
}

async function run() {
	console.log("\n🔄 Syncing local songs into Convex...");
	const localSongs = loadDataSongs();
	const localKeys = new Set(
		localSongs.map((song) => songKey(song.name, song.published_date)),
	);
	console.log(
		`Loaded ${localSongs.length} local songs (${localKeys.size} unique keys).`,
	);

	let inserted = 0;
	let updated = 0;

	for (const song of localSongs) {
		try {
			const result = await upsertSong(song);
			if (result.action === "inserted") inserted += 1;
			if (result.action === "updated") updated += 1;
		} catch (error) {
			console.error(
				`✗ Failed to sync ${song.name} (${song.published_date})`,
				error,
			);
		}
	}

	console.log(
		`\n✅ Sync complete. Inserted: ${inserted}, Updated: ${updated}.`,
	);
}

run().catch((error) => {
	console.error("Fatal sync error", error);
	process.exit(1);
});
