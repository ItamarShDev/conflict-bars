import { describe, expect, it } from "vitest";
import { canonicalSongLanguage, displaySongLanguage } from "./song-language";

const supportedLanguages = [
	["Arabic", "ערבית"],
	["Arabic/English", "ערבית/אנגלית"],
	["Arabic/English/French", "ערבית/אנגלית/צרפתית"],
	["Arabic/Hebrew", "ערבית/עברית"],
	["English", "אנגלית"],
	["English/Arabic", "אנגלית/ערבית"],
	["English/Arabic/French", "אנגלית/ערבית/צרפתית"],
	["Hebrew", "עברית"],
	["Hebrew/Arabic", "עברית/ערבית"],
	["Hebrew/Arabic/English", "עברית/ערבית/אנגלית"],
	["Hebrew/Arabic/English/German", "עברית/ערבית/אנגלית/גרמנית"],
	[
		"Hebrew/Arabic/Russian/Yiddish/Amharic/English",
		"עברית/ערבית/רוסית/יידיש/אמהרית/אנגלית",
	],
	["Irish/Arabic", "אירית/ערבית"],
] as const;

describe("Hebrew song-language labels", () => {
	it.each(supportedLanguages)(
		"localizes and round-trips canonical value %s",
		(canonical, display) => {
			expect(displaySongLanguage(canonical, "he")).toBe(display);
			expect(canonicalSongLanguage(display, "he")).toBe(canonical);
		},
	);

	it("preserves custom language text and English compatibility values", () => {
		expect(displaySongLanguage("Kurdish/Arabic", "he")).toBe("Kurdish/ערבית");
		expect(canonicalSongLanguage("Kurdish/ערבית", "he")).toBe("Kurdish/Arabic");
		expect(displaySongLanguage("Hebrew/Arabic", "en")).toBe("Hebrew/Arabic");
		expect(canonicalSongLanguage("Hebrew/Arabic", "en")).toBe("Hebrew/Arabic");
	});
});
