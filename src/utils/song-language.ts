const hebrewLanguageNames: Record<string, string> = {
	Amharic: "אמהרית",
	Arabic: "ערבית",
	English: "אנגלית",
	French: "צרפתית",
	German: "גרמנית",
	Hebrew: "עברית",
	Irish: "אירית",
	Russian: "רוסית",
	Yiddish: "יידיש",
};

const canonicalLanguageNames = Object.fromEntries(
	Object.entries(hebrewLanguageNames).map(([canonical, display]) => [
		display,
		canonical,
	]),
);

function mapLanguageParts(
	value: string,
	names: Record<string, string>,
): string {
	return value
		.split("/")
		.map((part) => names[part] ?? part)
		.join("/");
}

export function displaySongLanguage(value: string, lang: "en" | "he"): string {
	return lang === "he" ? mapLanguageParts(value, hebrewLanguageNames) : value;
}

export function canonicalSongLanguage(
	value: string,
	lang: "en" | "he",
): string {
	return lang === "he"
		? mapLanguageParts(value, canonicalLanguageNames)
		: value;
}
