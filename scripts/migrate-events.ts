import { dirname, join } from "node:path";
import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { israeliConflicts } from "../timeline/conflicts";

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
	console.log("🎬 Migrating events from conflicts...\n");

	try {
		let successCount = 0;
		let errorCount = 0;

		for (const conflictEntry of israeliConflicts) {
			try {
				const conflict = conflictEntry.conflict;
				if (!conflict) {
					console.log(`⚠️  Skipped: No conflict data for ${conflictEntry.time.start}`);
					continue;
				}

				await client.mutation(api.mutations.insertEvent, {
					start: conflictEntry.time.start,
					end: conflictEntry.time.end,
					title: conflict.title,
					title_he: conflict.title_he,
					reason: conflict.reason,
					reason_he: conflict.reason_he,
					description: conflict.description,
					description_he: conflict.description_he,
					effects: conflict.effects,
					effects_he: conflict.effects_he,
					wikipedia_url: conflict.wikipedia_url,
				});

				successCount++;
				console.log(`✓ Migrated: ${conflict.title}`);
			} catch (error) {
				errorCount++;
				console.error(
					`✗ Failed to migrate event for ${conflictEntry.time.start}:`,
					error,
				);
			}
		}

		console.log(
			`\n✅ Migration complete: ${successCount} succeeded, ${errorCount} failed\n`,
		);
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	}
}

run();
