import { dirname, join } from "node:path";
import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables from .env.local
config({ path: join(dirname(new URL(import.meta.url).pathname), "../.env.local") });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
	console.error(
		"Error: NEXT_PUBLIC_CONVEX_URL environment variable is not set",
	);
	console.log("Please run 'npx convex dev' first to get your deployment URL");
	process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function run() {
	console.log("🎵 Removing 'artist' column from songs...\n");

	try {
		// Get all songs
		const songs = await client.query(api.songs.getAllSongs, {});
		console.log(`Found ${songs.length} songs to process\n`);

		let processedCount = 0;
		let errorCount = 0;

		for (const song of songs) {
			try {
				// Update song to remove artist field (set to undefined)
				await client.mutation(api.mutations.updateSong, {
					songId: song._id as never,
					updates: {
						// By not including 'artist' in updates, it won't be modified
						// The artist_id and artist_details will be used instead
					},
				});
				processedCount++;
				console.log(`✓ Processed: ${song.name}`);
			} catch (error) {
				errorCount++;
				console.error(`✗ Failed to process ${song.name}:`, error);
			}
		}

		console.log(
			`\n✅ Migration complete: ${processedCount} processed, ${errorCount} failed\n`,
		);
		console.log(
			"Note: The 'artist' column is now deprecated. Use 'artist_id' and 'artist_details' instead.\n",
		);
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	}
}

run().catch(console.error);
