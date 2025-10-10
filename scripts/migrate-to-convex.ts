/**
 * Migration script to populate Convex database with existing songs and events data
 * Run with: npx tsx scripts/migrate-to-convex.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { timeline } from "../src/app/timeline";
import { israeliConflicts } from "../src/app/timeline/conflicts";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
	console.error(
		"Error: NEXT_PUBLIC_CONVEX_URL environment variable is not set",
	);
	console.log("Please run 'npx convex dev' first to get your deployment URL");
	process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function migrateSongs() {
	console.log(`\n📝 Migrating ${timeline.length} songs to Convex...`);

	let successCount = 0;
	let errorCount = 0;

	for (const song of timeline) {
		try {
			await client.mutation(api.mutations.insertSong, {
				name: song.name,
				artist: song.artist,
				published_date: song.published_date,
				language: song.language,
				lyric_sample: song.lyric_sample,
				links: song.links,
			});
			successCount++;
			if (successCount % 10 === 0) {
				console.log(`  ✓ Migrated ${successCount} songs...`);
			}
		} catch (error) {
			console.error(`  ✗ Error migrating song "${song.name}":`, error);
			errorCount++;
		}
	}

	console.log(
		`\n✅ Songs migration complete: ${successCount} successful, ${errorCount} failed`,
	);
}

async function migrateEvents() {
	console.log(`\n📅 Migrating ${israeliConflicts.length} events to Convex...`);

	let successCount = 0;
	let errorCount = 0;

	for (const event of israeliConflicts) {
		if (!event.conflict) {
			console.warn(`  ⚠️ Skipping event without conflict data`);
			continue;
		}

		try {
			await client.mutation(api.mutations.insertEvent, {
				start: event.time.start,
				end: event.time.end,
				title: event.conflict.title,
				title_he: event.conflict.title_he,
				reason: event.conflict.reason,
				reason_he: event.conflict.reason_he,
				description: event.conflict.description,
				description_he: event.conflict.description_he,
				effects: event.conflict.effects,
				effects_he: event.conflict.effects_he,
				wikipedia_url: event.conflict.wikipedia_url,
			});
			successCount++;
			if (successCount % 5 === 0) {
				console.log(`  ✓ Migrated ${successCount} events...`);
			}
		} catch (error) {
			console.error(
				`  ✗ Error migrating event "${event.conflict.title}":`,
				error,
			);
			errorCount++;
		}
	}

	console.log(
		`\n✅ Events migration complete: ${successCount} successful, ${errorCount} failed`,
	);
}

async function clearExistingData() {
	console.log("\n🗑️  Clearing existing data from Convex...");

	try {
		await client.mutation(api.mutations.clearAllSongs);
		console.log("  ✓ Cleared all songs");
	} catch (error) {
		console.error("  ✗ Error clearing songs:", error);
	}

	try {
		await client.mutation(api.mutations.clearAllEvents);
		console.log("  ✓ Cleared all events");
	} catch (error) {
		console.error("  ✗ Error clearing events:", error);
	}
}

async function verifyMigration() {
	console.log("\n🔍 Verifying migration...");

	try {
		const songs = await client.query(api.songs.getAllSongs);
		console.log(`  ✓ Found ${songs.length} songs in Convex`);

		const events = await client.query(api.events.getAllEvents);
		console.log(`  ✓ Found ${events.length} events in Convex`);
	} catch (error) {
		console.error("  ✗ Error verifying migration:", error);
	}
}

async function main() {
	console.log("🚀 Starting migration to Convex...");
	console.log(`   Convex URL: ${CONVEX_URL}`);

	// Clear existing data first
	await clearExistingData();

	// Migrate songs and events
	await migrateSongs();
	await migrateEvents();

	// Verify migration
	await verifyMigration();

	console.log("\n✨ Migration complete!\n");
}

main().catch((error) => {
	console.error("Fatal error during migration:", error);
	process.exit(1);
});
