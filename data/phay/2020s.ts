import type { FileSongList } from "../../timeline/types";

export const phay2020s = [
	{
		name: "Watermelon Seeds",
		artist: "Phay",
		published_date: "2024-03-01",
		political_leaning: "left",
		language: "English",
		lyric_sample: {
			original_language: "en",
			hebrew: "עד שתרמילי הקליעים שלהם / יהפכו לגרעיני אבטיח",
			english_translation:
				"Till the shells from they bullets / Turn to watermelon seeds",
		},
		context: {
			he: "פיי מדמיין שתרמילי קליעים הופכים לגרעיני אבטיח, דימוי שבו מה שנשאר מהירי יכול להצמיח חיים. בריאיון על הסינגל הוא קושר את הכתיבה למלחמה בעזה ולקריאה לחירות פלסטינית.",
			en: "Phay imagines spent casings turning into watermelon seeds, an image in which what remains after gunfire can grow into life. In an interview about the single, he connects its writing to the war in Gaza and the call for Palestinian freedom.",
			sources: [
				{
					url: "https://www.rollingstone.com/music/music-features/palestinian-rapper-phay-syntk-watermelon-seeds-1234983775/",
					he: "ריאיון על כתיבת השיר והמלחמה בעזה",
					en: "Interview about writing the song and the Gaza war",
				},
			],
		},
		links: {
			lyrics: "https://www.antiwarsongs.org/canzone.php?id=69593&lang=en",
			song_info: "https://music.apple.com/us/song/watermelon-seeds/1731430062",
		},
	},
] satisfies FileSongList;
