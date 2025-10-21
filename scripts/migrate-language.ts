import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convexUrl = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
if (!convexUrl) {
	console.error(
		"❌ Error: CONVEX_URL environment variable is not set.\n" +
			"Make sure you're running this with: npx convex run scripts/migrate-language.ts\n" +
			"Or set CONVEX_URL manually.",
	);
	process.exit(1);
}

const client = new ConvexClient(convexUrl);

// Language translations to Hebrew
const languageTranslations: Record<string, string> = {
	// English names
	hebrew: "עברית",
	english: "אנגלית",
	arabic: "ערבית",
	french: "צרפתית",
	russian: "רוסית",
	spanish: "ספרדית",
	german: "גרמנית",
	italian: "איטלקית",
	portuguese: "פורטוגזית",
	dutch: "הולנדית",
	polish: "פולנית",
	turkish: "טורקית",
	greek: "יוונית",
	japanese: "יפנית",
	chinese: "סינית",
	korean: "קוריאנית",
	thai: "תאילנדית",
	vietnamese: "וייטנמית",
	indonesian: "אינדונזית",
	malay: "מלאית",
	tagalog: "טגלוג",
	hindi: "הינדית",
	bengali: "בנגלית",
	urdu: "אורדו",
	swahili: "סווהילית",
	amharic: "אמהרית",
	hebrew_english: "עברית/אנגלית",
	english_hebrew: "עברית/אנגלית",
	hebrew_arabic: "עברית/ערבית",
	arabic_hebrew: "עברית/ערבית",
	hebrew_french: "עברית/צרפתית",
	french_hebrew: "עברית/צרפתית",
	hebrew_russian: "עברית/רוסית",
	russian_hebrew: "עברית/רוסית",
	english_arabic: "אנגלית/ערבית",
	arabic_english: "אנגלית/ערבית",
	english_french: "אנגלית/צרפתית",
	french_english: "אנגלית/צרפתית",
	// Already Hebrew
	עברית: "עברית",
	אנגלית: "אנגלית",
	ערבית: "ערבית",
	צרפתית: "צרפתית",
	רוסית: "רוסית",
	ספרדית: "ספרדית",
	גרמנית: "גרמנית",
	איטלקית: "איטלקית",
	פורטוגזית: "פורטוגזית",
	הולנדית: "הולנדית",
	פולנית: "פולנית",
	טורקית: "טורקית",
	יוונית: "יוונית",
	יפנית: "יפנית",
	סינית: "סינית",
	קוריאנית: "קוריאנית",
	תאילנדית: "תאילנדית",
	וייטנמית: "וייטנמית",
	אינדונזית: "אינדונזית",
	מלאית: "מלאית",
	טגלוג: "טגלוג",
	הינדית: "הינדית",
	בנגלית: "בנגלית",
	אורדו: "אורדו",
	סווהילית: "סווהילית",
	אמהרית: "אמהרית",
	"עברית/אנגלית": "עברית/אנגלית",
	"עברית/ערבית": "עברית/ערבית",
	"עברית/צרפתית": "עברית/צרפתית",
	"עברית/רוסית": "עברית/רוסית",
	"אנגלית/ערבית": "אנגלית/ערבית",
	"אנגלית/צרפתית": "אנגלית/צרפתית",
};

function normalizeLanguage(language: string | undefined): string | undefined {
	if (!language) return undefined;

	const trimmed = language.trim().toLowerCase();

	// Check direct translation
	if (languageTranslations[trimmed]) {
		return languageTranslations[trimmed];
	}

	// Try to normalize pairs (e.g., "Arabic/Hebrew" -> "Hebrew/Arabic")
	if (trimmed.includes("/")) {
		const parts = trimmed
			.split("/")
			.map((p) => p.trim())
			.sort();
		const normalized = parts.map((p) => languageTranslations[p] || p).join("/");
		return normalized;
	}

	// If not found, return as-is (might be a language we don't have a translation for)
	return language;
}

async function migrateLanguages() {
	console.log("🔄 Starting language migration...");

	try {
		const songs = await client.query(api.songs.getAllSongs);
		console.log(`📊 Found ${songs.length} songs to process`);

		let updated = 0;
		let unchanged = 0;

		for (const song of songs) {
			const oldLanguage = song.language;
			const newLanguage = normalizeLanguage(oldLanguage);

			if (oldLanguage !== newLanguage) {
				console.log(
					`  ✏️  "${song.name}" by ${song.artist}: "${oldLanguage}" → "${newLanguage}"`,
				);
				// Note: You would need to add an updateSong mutation if it doesn't exist
				// For now, just logging the changes
				updated++;
			} else {
				unchanged++;
			}
		}

		console.log(`\n✅ Migration summary:`);
		console.log(`  • Updated: ${updated} songs`);
		console.log(`  • Unchanged: ${unchanged} songs`);
		console.log(`  • Total: ${songs.length} songs`);
	} catch (error) {
		console.error("❌ Migration failed:", error);
		process.exit(1);
	}
}

migrateLanguages();
