export const artistPoliticalAffiliation: Record<
	string,
	{
		era: string;
		affiliation: string;
		notes: string;
	}
> = {
	"Shabak Samech": {
		era: "1990s–present",
		affiliation: "Counterculture / Apolitical",
		notes: "Known for humor, youth rebellion, not strongly political.",
	},
	Subliminal: {
		era: "1990s–present",
		affiliation: "Right-leaning / Nationalist",
		notes:
			"Prominent after 2nd Intifada, pro-IDF, patriotic lyrics, clashes with leftist rappers.",
	},
	"The Shadow (HaTzel)": {
		era: "2000s–present",
		affiliation: "Far-right",
		notes: "Became a political figure, outspoken nationalist.",
	},
	"Sagol 59": {
		era: "1990s–present",
		affiliation: "Left-leaning",
		notes: "Known for peace activism, collaborations with Palestinian rappers.",
	},
	"Hadag Nahash": {
		era: "2000s–present",
		affiliation: "Left-wing / Liberal",
		notes: "Anti-corruption, pro-peace, critical of government policies.",
	},
	Tuna: {
		era: "2000s–present",
		affiliation: "Center-left / Social critique",
		notes:
			"Lyrics touch on inequality, frustration with politics, but avoids clear partisan stance.",
	},
	Peled: {
		era: "2000s–present",
		affiliation: "Center-left / Critical",
		notes:
			"Mix of satire and social commentary, often mocks political establishment.",
	},
	"Nechi Nech": {
		era: "2010s–present",
		affiliation: "Center-left / Social critique",
		notes:
			"Touches on discrimination, everyday struggles, less explicitly partisan.",
	},
	"Jimbo J": {
		era: "2010s–present",
		affiliation: "Left-leaning",
		notes:
			"Known for sharp storytelling, social critique, and satire of Israeli politics.",
	},
	"Cohen@Mushon": {
		era: "2000s–2010s",
		affiliation: "Liberal / Apolitical humor",
		notes:
			"Mostly playful, but generally aligned with Tel Aviv left-liberal scene.",
	},
	"Strong Black Coffee (Kafe Shachor Chazak)": {
		era: "2010s–present",
		affiliation: "Social justice",
		notes:
			"Focus on Ethiopian-Israeli struggles, systemic racism, police brutality.",
	},
	Echo: {
		era: "2010s–present",
		affiliation: "Progressive / Feminist",
		notes: "Themes of gender equality, multiculturalism, inclusivity.",
	},
	"Michael Swissa": {
		era: "2010s–present",
		affiliation: "Apolitical / Satirical",
		notes: "Often playful and ironic, not strongly political.",
	},
	Noroz: {
		era: "2020s–present",
		affiliation: "Apolitical / Street culture",
		notes: "Focuses on drill/trap lifestyle themes rather than politics.",
	},
	"Boi Ecchi": {
		era: "2020s–present",
		affiliation: "Apolitical / Internet culture",
		notes: "More focused on aesthetics and vibes than political content.",
	},
	"Mooki (מוקי)": {
		era: "1990s–present",
		affiliation: "Center-left / Peace advocacy",
		notes:
			"Former frontman of Shabak Samech; solo work often emphasizes social themes, justice, and calls for peace rather than partisan politics.",
	},

	DAM: {
		era: "1990s–present",
		affiliation: "Palestinian left / Anti-occupation / Social justice",
		notes:
			"Pioneering Palestinian hip hop group from Lod; lyrics address occupation, inequality, and identity; known for activist stance and collaborations.",
	},
} as const;
