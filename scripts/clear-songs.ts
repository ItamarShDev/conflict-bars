import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
	console.error(
		"Error: NEXT_PUBLIC_CONVEX_URL environment variable is not set",
	);
	console.log("Please run 'npx convex dev' first to get your deployment URL");
	process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function clearSongs() {
	console.log("\n🗑️  Clearing existing songs from Convex...");

	try {
		await client.mutation(api.mutations.clearAllSongs, {});
		console.log("  ✓ Cleared all songs");
	} catch (error) {
		console.error("  ✗ Error clearing songs:", error);
		process.exit(1);
	}
}

clearSongs().catch((error) => {
	console.error("Fatal error while clearing songs:", error);
	process.exit(1);
});
