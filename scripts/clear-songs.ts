import { dirname, join } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { config } from "dotenv";
import { api } from "../convex/_generated/api";

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

async function clearAllTables() {
	console.log("\n🗑️  Clearing all tables from Convex database...\n");

	try {
		// Clear songs first (has foreign keys to artists)
		console.log("  Clearing songs...");
		await client.mutation(api.mutations.clearAllSongs, {});
		console.log("  ✓ Cleared all songs");

		// Clear artists last (no dependencies)
		console.log("  Clearing artists...");
		await client.mutation(api.mutations.clearAllArtists, {});
		console.log("  ✓ Cleared all artists");

		console.log("\n✅ All tables cleared successfully\n");
	} catch (error) {
		console.error("  ✗ Error clearing tables:", error);
		process.exit(1);
	}
}

clearAllTables().catch((error) => {
	console.error("Fatal error while clearing tables:", error);
	process.exit(1);
});
