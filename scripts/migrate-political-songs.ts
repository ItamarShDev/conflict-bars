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
		songId: songId as never,
		artistId: artistId as never,
	});
}

async function upsertSongWithArtist(song: SongList[number]) {
	const artistInfo = artistPoliticalAffiliation[song.artist] ?? undefined;
	const artistId = await ensureArtist(song.artist, artistInfo);

	// Ensure collaborators exist and get their IDs
	const collaboratorIds: string[] = [];
	if (song.collaborators && song.collaborators.length > 0) {
		for (const collaborator of song.collaborators) {
			const collaboratorInfo =
				artistPoliticalAffiliation[collaborator] ?? undefined;
			const collaboratorId = await ensureArtist(collaborator, collaboratorInfo);
			collaboratorIds.push(collaboratorId as never);
		}
	}

	const existingSong = await client.query(
		api.internal.songs.findByNameAndDate,
		{
			name: song.name,
			published_date: song.published_date,
		},
	);

	if (existingSong) {
		await assignSongArtist(existingSong._id, artistId);
		if (collaboratorIds.length > 0) {
			await client.mutation(api.mutations.assignCollaboratorsToSong, {
				songId: existingSong._id as never,
				collaboratorIds: collaboratorIds as never,
			});
		}
		return existingSong._id;
	}

	return client.mutation(api.mutations.insertSong, {
		name: song.name,
		artistId,
		collaboratorIds: collaboratorIds.length > 0 ? (collaboratorIds as never) : undefined,
		published_date: song.published_date,
		language: song.language,
		lyric_sample: song.lyric_sample,
		links: song.links,
		published: true,
	});
}

function loadPoliticalSongs(): SongList {
	const dataDir = join(dirname(new URL(import.meta.url).pathname), "../data");
	const songFiles: SongList = [];

	// List of politically-oriented artists to load
	const politicalArtists = [
		"sagol-59",
		"subliminal",
		"hadag-nahash",
		"jimbo-j",
		"strong-black-coffee",
		"echo",
		"dam",
		"peled",
		"nechi-nech",
		"tuna",
		"mooki",
		"cohen-mushon",
		"michael-swissa",
		"noroz",
		"boi-ecchi",
		"dudu-tassa",
		"yosef-dayan",
		"adi-ulmansky",
		"the-shadow",
		"shabak-samech",
		"nigel-hadmor",
		"silverdone",
		"fishy-hagadol",
		"kla-6",
		"shanan-street",
		"axsom",
		"loukatz",
		"ness-ve-stilla",
		"shadia-mansour",
		"ramallah-underground",
		"checkpoint-303",
		"shabjdeed",
		"daboor",
		"ortega",
		"hatikvah-6",
		"maor-askenazi",
		"hanan-ben-ari",
		"odeya",
		"eyal-golan",
		"aviv-gefen",
		"itay-levi",
		"e-z",
		"benia-bar-avi",
		"al-nather",
		"system-ali",
		"iz",
		"hype-crew",
		"ravid-plotnik",
	];

	function walk(directory: string) {
		for (const entry of readdirSync(directory)) {
			const fullPath = join(directory, entry);
			const stats = statSync(fullPath);

			// Only process directories for political artists
			if (stats.isDirectory()) {
				if (politicalArtists.includes(entry)) {
					walk(fullPath);
				}
				continue;
			}

			if (!entry.endsWith(".ts")) continue;
			if (entry === "index.ts") continue;

			try {
				const mod = require(fullPath);
				for (const value of Object.values(mod)) {
					if (Array.isArray(value)) {
						songFiles.push(...(value as SongList));
					}
				}
			} catch (error) {
				console.warn(`Failed to load ${fullPath}:`, error);
			}
		}
	}

	walk(dataDir);
	return songFiles;
}

async function run() {
	console.log("Starting migration of political songs...");

	// Phase 1: Ensure all artists from political affiliation file exist in database
	console.log("\nPhase 1: Creating/updating all artists in database...");
	let artistsCreated = 0;

	for (const [artistName, artistData] of Object.entries(
		artistPoliticalAffiliation,
	)) {
		try {
			const artistId = await ensureArtist(artistName, artistData);
			if (artistId) {
				artistsCreated++;
				console.log(`✓ Artist ensured: ${artistName}`);
			}
		} catch (error) {
			console.error(`✗ Failed to create artist ${artistName}:`, error);
		}
	}

	console.log(
		`\nPhase 1 complete: ${artistsCreated} artists created/updated`,
	);

	// Phase 2: Migrate songs
	console.log("\nPhase 2: Migrating songs...");
	const songs = loadPoliticalSongs();
	console.log(`Found ${songs.length} political songs to migrate`);

	let successCount = 0;
	let errorCount = 0;

	for (const song of songs) {
		try {
			await upsertSongWithArtist(song);
			successCount++;
			console.log(`✓ Migrated: ${song.name} by ${song.artist}`);
		} catch (error) {
			errorCount++;
			console.error(
				`✗ Failed to process ${song.name} by ${song.artist}:`,
				error,
			);
		}
	}

	console.log(
		`\nPhase 2 complete: ${successCount} succeeded, ${errorCount} failed`,
	);
	console.log(
		`\nTotal migration complete: ${artistsCreated} artists, ${successCount} songs`,
	);
}

run().catch(console.error);
