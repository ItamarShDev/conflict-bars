import type { EventsTimeline } from "../../timeline/types";

type ConflictDetails = NonNullable<EventsTimeline["conflict"]>;

export interface ConflictHipHopIntro {
	en: string;
	he: string;
}

interface ConflictIntroRule {
	match: (conflict: ConflictDetails, startYear: number) => boolean;
	intro: ConflictHipHopIntro;
}

const CONFLICT_HIPHOP_INTRO_RULES: ConflictIntroRule[] = [
	{
		match: (conflict, year) =>
			year === 1991 ||
			/first intifada/i.test(conflict.title ?? "") ||
			/האינתיפאדה הראשונה/.test(conflict.title_he ?? ""),
		intro: {
			en: "Early Hebrew-language acts such as Shabak Samech recorded rap songs during the First Intifada.",
			he: "להקות מוקדמות בעברית כמו שבק ס׳ הקליטו שירי ראפ במהלך האינתיפאדה הראשונה.",
		},
	},
	{
		match: (conflict, year) =>
			year === 1993 ||
			/oslo/i.test(conflict.title ?? "") ||
			/אוסלו/.test(conflict.title_he ?? ""),
		intro: {
			en: "Songs released around the Oslo period include early Hebrew rap singles alongside emerging Palestinian rap from Lod.",
			he: "שירים מתקופת אוסלו כוללים סינגלים מוקדמים בעברית לצד ראפ פלסטיני מוקדם מלוד.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2000 ||
			/second intifada|al-aqsa/i.test(conflict.title ?? "") ||
			/האינתיפאדה השנייה/.test(conflict.title_he ?? ""),
		intro: {
			en: "Tracks released during the Second Intifada range from Subliminal's nationalist Hebrew singles to DAM's Arabic protest rap and Hadag Nahash's satire.",
			he: "שירים מתקופת האינתיפאדה השנייה משתרעים בין סינגלים לאומניים של סאבלימינל, ראפ מחאה בערבית של דאם וסאטירה של הדג נחש.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2005 ||
			/disengagement/i.test(conflict.title ?? "") ||
			/ההתנתקות/.test(conflict.title_he ?? ""),
		intro: {
			en: "Songs released around the Gaza disengagement describe fatigue, ideological division, and questioning of leadership.",
			he: "שירים מתקופת ההתנתקות מתארים שחיקה, פלגנות אידיאולוגית וביקורת על ההנהגה.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2006 ||
			/lebanon/i.test(conflict.title ?? "") ||
			/לבנון/.test(conflict.title_he ?? ""),
		intro: {
			en: "Tracks recorded around the Second Lebanon War describe sirens, shelters, reserve duty, and home-front anxiety.",
			he: "שירים שנקלטו סביב מלחמת לבנון השנייה מתארים אזעקות, מקלטים, מילואים וחרדת עורף.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2008 ||
			/cast lead/i.test(conflict.title ?? "") ||
			/עופרת יצוקה/.test(conflict.title_he ?? ""),
		intro: {
			en: "Songs from the Cast Lead period include solidarity tracks on the Israeli side and anti-war verses on the other.",
			he: "שירים מתקופת עופרת יצוקה כוללים שירי הזדהות בצד הישראלי ובתי מחאה אנטי־מלחמתיים בצד השני.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2012 ||
			/pillar of defense/i.test(conflict.title ?? "") ||
			/עמוד ענן/.test(conflict.title_he ?? ""),
		intro: {
			en: "Tracks from the Pillar of Defense period document the routine of sirens, Iron Dome interceptions, and social media feeds.",
			he: "שירים מתקופת עמוד ענן מתעדים שגרת אזעקות, יירוטי כיפת ברזל ורשתות חברתיות.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2014 ||
			/protective edge/i.test(conflict.title ?? "") ||
			/צוק איתן/.test(conflict.title_he ?? ""),
		intro: {
			en: "Songs released around Operation Protective Edge express grief, trauma, and the human cost of the extended fighting.",
			he: "שירים מתקופת צוק איתן מבטאים שכול, טראומה ומחיר אנושי של הלחימה הממושכת.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2018 ||
			/march of return/i.test(conflict.title ?? "") ||
			/צעדת השיבה/.test(conflict.title_he ?? ""),
		intro: {
			en: "Tracks recorded around the March of Return protests include documentary-style storytelling by young Gazan MCs and Israeli periphery artists.",
			he: "שירים מתקופת צעדת השיבה כוללים סיפורים תיעודיים של אמנים צעירים מעזה ומהפריפריה הישראלית.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2021 ||
			/guardian of the walls/i.test(conflict.title ?? "") ||
			/שומר החומות/.test(conflict.title_he ?? ""),
		intro: {
			en: "Songs from the Guardian of the Walls period include viral videos by young Gazan MCs such as MC Abdul and Israeli tracks responding to unrest in mixed cities.",
			he: "שירים מתקופת שומר החומות כוללים סרטונים ויראליים של אמנים צעירים מעזה כמו MC Abdul ותגובות של היפ־הופ ישראלי למהומות בערים המעורבות.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2023 ||
			/swords of iron|israel-hamas/i.test(conflict.title ?? "") ||
			/חרבות ברזל/.test(conflict.title_he ?? ""),
		intro: {
			en: "Songs released after October 7 include wartime tracks and personal accounts of displacement, shock, and loss.",
			he: "שירים שיצאו לאחר ה־7 באוקטובר כוללים שירי מלחמה ותיעודים אישיים של עקירה, הלם ואובדן.",
		},
	},
];

export function getConflictHipHopIntro(
	conflict: ConflictDetails,
	startYear: number,
	lang: "en" | "he",
): string | null {
	const matched = CONFLICT_HIPHOP_INTRO_RULES.find((rule) =>
		rule.match(conflict, startYear),
	);
	return matched ? matched.intro[lang] : null;
}
