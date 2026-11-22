import type { FileSongList } from "../../timeline/types";

export const theHerd2020s = [
	{
		name: "Soul of My Soul",
		artist: "The Herd",
		collaborators: ["Sereen", "MO", "Big Rigs"],
		language: "English",
		published_date: "2024-06-14",
		political_leaning: "left",
		lyric_sample: {
			original_language: "en",
			hebrew: "אבל זה משודר ישירות לטלפונים שלנו",
			english_translation: "But it’s streaming to our phones",
		},
		context: {
			he: "השיר מעמיד תיעוד מעזה שמגיע ישירות לטלפונים מול האופן שבו המלחמה מוצגת בתקשורת. The Herd ושלושת האמנים הפלסטינים האורחים משתמשים בפער הזה כדי לבקר את המלחמה ולהביע סולידריות עם תושבי עזה.",
			en: "The verse contrasts footage reaching listeners’ phones with media coverage of the war. The Herd and its three Palestinian guests use that contrast to criticize the war and express solidarity with people in Gaza.",
		},
		links: {
			lyrics:
				"https://theherd.bandcamp.com/track/soul-of-my-soul-feat-sereen-mo-big-rigs",
			song_info:
				"https://musicfeeds.com.au/news/the-herd-reunite-for-new-single-soul-of-my-soul/",
		},
	},
] satisfies FileSongList;
