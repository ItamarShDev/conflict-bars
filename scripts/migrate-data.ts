import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { config } from "dotenv";
import { api } from "../convex/_generated/api";
import { artistPoliticalAffiliation } from "../timeline/artist-political-affiliation";
import type { SongList } from "../timeline/types";

// Load environment variables from .env.local
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

function normalize(name: string) {
	return name.trim().toLowerCase();
}

async function ensureArtist(
	name: string,
	data: (typeof artistPoliticalAffiliation)[string] | undefined,
	forceUpdate: boolean = false,
) {
	const existing = await client.query(
		api.internal.artists.getByNormalizedName,
		{
			normalized: normalize(name),
		},
	);

	// Extract Hebrew and English names from the artist name
	// Format: "English Name (עברית Name)" or just "English Name"
	let nameEn = name;
	let nameHe: string | undefined;

	const hebrewMatch = name.match(/\(([^)]+)\)/);
	if (hebrewMatch) {
		nameEn = name.substring(0, hebrewMatch.index).trim();
		nameHe = hebrewMatch[1].trim();
		console.log(`  📝 Extracted: "${nameEn}" (EN) / "${nameHe}" (HE)`);
	}

	if (existing) {
		if (forceUpdate) {
			await client.mutation(api.mutations.upsertArtist, {
				name,
				name_he: nameHe,
				name_en: nameEn,
				era: data?.era,
				affiliation: data?.affiliation,
				notes: data?.notes,
			});
		}
		return existing._id;
	}

	const newArtistId = await client.mutation(api.mutations.upsertArtist, {
		name,
		name_he: nameHe,
		name_en: nameEn,
		era: data?.era,
		affiliation: data?.affiliation,
		notes: data?.notes,
	});
	return newArtistId;
}

async function assignSongArtist(songId: string, artistId: string) {
	await client.mutation(api.mutations.assignArtistToSong, {
		songId: songId as never,
		artistId: artistId as never,
	});
}

async function upsertSongWithArtist(
	song: SongList[number],
	forceUpdate: boolean = false,
) {
	const artistInfo = artistPoliticalAffiliation[song.artist] ?? undefined;
	const artistId = await ensureArtist(song.artist, artistInfo, forceUpdate);

	// Ensure collaborators exist and get their IDs
	const collaboratorIds: string[] = [];
	if (song.collaborators && song.collaborators.length > 0) {
		for (const collaborator of song.collaborators) {
			if (!collaborator) continue;
			const collaboratorInfo =
				artistPoliticalAffiliation[collaborator] ?? undefined;
			const collaboratorId = await ensureArtist(
				collaborator,
				collaboratorInfo,
				forceUpdate,
			);
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
		if (forceUpdate) {
			// Update existing song with new data
			await client.mutation(api.mutations.updateSong, {
				songId: existingSong._id as never,
				updates: {
					name: song.name,
					artist_id: artistId as never,
					collaborator_ids:
						collaboratorIds.length > 0 ? (collaboratorIds as never) : undefined,
					language: song.language,
					lyric_sample: song.lyric_sample,
					links: song.links,
				},
			});
		} else {
			// Just ensure artist assignment
			await assignSongArtist(existingSong._id, artistId);
			if (collaboratorIds.length > 0) {
				await client.mutation(api.mutations.assignCollaboratorsToSong, {
					songId: existingSong._id as never,
					collaboratorIds: collaboratorIds as never,
				});
			}
		}
		return existingSong._id;
	}

	return client.mutation(api.mutations.insertSong, {
		name: song.name,
		artistId,
		collaboratorIds:
			collaboratorIds.length > 0 ? (collaboratorIds as never) : undefined,
		published_date: song.published_date,
		language: song.language,
		lyric_sample: song.lyric_sample,
		links: song.links,
		published: true,
	});
}

function loadAllSongs(): SongList {
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
	console.log("🎵 Israeli Hip-Hop Timeline - Data Migration Tool\n");

	// Check for force flag
	const forceUpdate = process.argv.includes("--force");
	if (forceUpdate) {
		console.log(
			"⚠️  Running in FORCE UPDATE mode - existing data will be overwritten\n",
		);
	}

	// Phase 1: Ensure all artists from political affiliation file exist in database
	console.log("📊 Phase 1: Creating/updating all artists in database...");
	const artistsCreated = 0;
	let artistsUpdated = 0;

	for (const [artistName, artistData] of Object.entries(
		artistPoliticalAffiliation,
	)) {
		try {
			// Always use forceUpdate=true in Phase 1 to ensure Hebrew names are extracted and saved
			const artistId = await ensureArtist(artistName, artistData, true);
			if (artistId) {
				artistsUpdated++;
				console.log(`✓ Artist ensured: ${artistName}`);
			}
		} catch (error) {
			console.error(`✗ Failed to create artist ${artistName}:`, error);
		}
	}

	console.log(
		`\n✅ Phase 1 complete: ${artistsCreated} created, ${artistsUpdated} updated\n`,
	);

	// Phase 2: Migrate songs
	console.log("🎵 Phase 2: Migrating songs...");
	const songs = loadAllSongs();
	console.log(`Found ${songs.length} songs to migrate\n`);

	let successCount = 0;
	let errorCount = 0;

	for (const song of songs) {
		try {
			await upsertSongWithArtist(song, forceUpdate);
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
		`\n✅ Phase 2 complete: ${successCount} succeeded, ${errorCount} failed\n`,
	);
	console.log(
		`\n🎉 Total migration complete:\n   - ${artistsCreated + artistsUpdated} artists\n   - ${successCount} songs\n`,
	);

	if (!forceUpdate && errorCount > 0) {
		console.log(
			"💡 Tip: Run with --force flag to overwrite conflicting data:\n   npm run db:migrate -- --force\n",
		);
	}

	// Run Convex codegen to update type definitions
	console.log("🔧 Running Convex codegen...");
	try {
		execSync("npx convex codegen", { stdio: "inherit" });
		console.log("✅ Convex codegen completed\n");
	} catch (error) {
		console.error("⚠️  Convex codegen failed:", error);
		console.log("You can run it manually with: npx convex codegen\n");
	}
}

run().catch(console.error);
