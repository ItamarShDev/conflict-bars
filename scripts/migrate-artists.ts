import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { artistPoliticalAffiliation } from "../timeline/artist-political-affiliation";
import type { SongList } from "../timeline/types";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
	console.error(
		"Error: NEXT_PUBLIC_CONVEX_URL environment variable is not set",
	);
	console.log("Please run 'npx convex dev' first to get your deployment URL");
	process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

function normalize(name: string) {
	return name.trim().toLowerCase();
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
	if (existing) {
		return existing._id;
	}
	return client.mutation(api.mutations.upsertArtist, {
		name,
		era: data?.era,
		affiliation: data?.affiliation,
		notes: data?.notes,
	});
}

async function assignSongArtist(songId: string, artistId: string) {
	await client.mutation(api.mutations.assignArtistToSong, {
		songId: songId as any,
		artistId: artistId as any,
	});
}

async function upsertSongWithArtist(song: SongList[number]) {
	const artistInfo = artistPoliticalAffiliation[song.artist] ?? undefined;
	const artistId = await ensureArtist(song.artist, artistInfo);

	const existingSong = await client.query(
		api.internal.songs.findByNameAndDate,
		{
			name: song.name,
			published_date: song.published_date,
		},
	);

	if (existingSong) {
		await assignSongArtist(existingSong._id, artistId);
		return existingSong._id;
	}

	return client.mutation(api.mutations.insertSong, {
		name: song.name,
		artistId,
		published_date: song.published_date,
		language: song.language,
		lyric_sample: song.lyric_sample,
		links: song.links,
		published: true,
	});
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

async function run() {
	const songs = loadDataSongs();
	for (const song of songs) {
		try {
			await upsertSongWithArtist(song);
		} catch (error) {
			console.error(`Failed to process ${song.name} by ${song.artist}`, error);
		}
	}
}

run().catch((error) => {
	console.error("Fatal migration error", error);
	process.exit(1);
});
