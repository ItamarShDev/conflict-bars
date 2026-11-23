import type { FileSongList } from "../../timeline/types";

export const haykal2020s = [
	{
		name: "Kam Min Jannah (كم من جنة)",
		artist: "Haykal (هيكل)",
		language: "Arabic",
		published_date: "2025-10-15",
		collaborators: ["Julmud (جلمود)", "Acamol"],
		context: {
			he: "בתים טעונים פוליטית הנעים בין אבל על ארץ כבושה לבין זעם סאטירי על השיתוק סביב המלחמה בעזה.",
			en: "Politically charged verses moving between mourning a colonised land and satirical outrage at the paralysis surrounding the war in Gaza.",
		},
		links: {
			youtube: "https://www.youtube.com/watch?v=uBffJ1NV1GM",
			song_info:
				"https://scenenoise.com/New-Music/Haykal-Julmud-Acamol-Score-a-Fractured-Palestine-on-Kam-Min-Janneh",
		},
	},
	{
		name: "Ma Btiji (ما بتيجي)",
		artist: "Haykal (هيكل)",
		published_date: "2026-05-22",
		language: "Arabic",
		political_leaning: "unknown",
		links: {
			lyrics: "https://haykal.bandcamp.com/track/ma-btiji",
			song_info: "https://haykal.bandcamp.com/track/ma-btiji",
		},
		lyric_sample: {
			original_language: "ar",
			arabic: "في المستشفى بحضر فيديو لمستشفى في غزة",
			hebrew: "בבית החולים אני צופה בסרטון של בית חולים בעזה.",
			english_translation:
				"In the hospital, I watch a video of a hospital in Gaza.",
		},
		context: {
			en: "After describing lung surgery, Haykal watches footage of a hospital in Gaza and describes it as ruined. A May 2026 WHO analysis documented widespread hospital damage in Gaza; the song does not identify the hospital in the video.",
			he: "אחרי שהוא מספר על ניתוח בריאה, היכל צופה בתיעוד של בית חולים בעזה ומתאר אותו כהרוס. דו״ח של ארגון הבריאות העולמי ממאי 2026 תיעד נזק נרחב לבתי החולים בעזה; השיר אינו מזהה את בית החולים שבסרטון.",
		},
	},
	{
		name: "Innahu",
		artist: "Haykal (هيكل)",
		collaborators: ["Bn Khalti"],
		published_date: "2026-10-16",
		language: "Arabic",
		political_leaning: "left",
		links: {
			lyrics: "https://haykal.bandcamp.com/track/innahu",
			song_info: "https://haykal.bandcamp.com/track/innahu",
		},
		lyric_sample: {
			original_language: "ar",
			arabic: "شو يتعاطفوا ودولهم بتزيد في الدم؟",
			hebrew:
				"איך הם יכולים להביע הזדהות כשהמדינות שלהם מגבירות את שפיכות הדמים?",
			english_translation:
				"How can they sympathize when their countries add to the bloodshed?",
		},
		context: {
			en: "Haykal contrasts expressions of sympathy with what he sees as states’ complicity. The verse names Gaza and refers to U.S. military bases; the question voices his argument about responsibility, not an independently verified allegation about any specific strike.",
			he: "היכל מעמת גילויי הזדהות עם מה שהוא רואה כמעורבותן של מדינות בשפיכות הדמים. הבית מזכיר את עזה ומתייחס לבסיסים צבאיים אמריקאיים; השאלה מבטאת את עמדתו בשאלת האחריות ולא קביעה מאומתת לגבי תקיפה מסוימת.",
		},
	},
] satisfies FileSongList;
