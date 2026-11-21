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
			en: "Hip-hop was just taking root locally as early Israeli acts like Shabak Samech adapted American rap cadence to Hebrew street life and political tension.",
			he: "ההיפ־הופ רק החל להכות שורש מקומי, כשלהקות חלוצות כמו שבק ס׳ התאימו את מקצבי הראפ האמריקאי לחיי היומיום ולמתח הפוליטי בעברית.",
		},
	},
	{
		match: (conflict, year) =>
			year === 1993 ||
			/oslo/i.test(conflict.title ?? "") ||
			/אוסלו/.test(conflict.title_he ?? ""),
		intro: {
			en: "The Oslo years saw Israeli hip-hop enter the mainstream and the first Palestinian rap crews form in Lod, blending cautious optimism with sharp social critique.",
			he: "שנות אוסלו הביאו את ההיפ־הופ הישראלי למיינסטרים ואת לידת ההרכבים הפלסטיניים הראשונים בלוד, בין תקווה זהירה לביקורת חברתית חדה.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2000 ||
			/second intifada|al-aqsa/i.test(conflict.title ?? "") ||
			/האינתיפאדה השנייה/.test(conflict.title_he ?? ""),
		intro: {
			en: "The Second Intifada split the local scene wide open — from Subliminal's nationalist Hebrew anthems to DAM's Arabic protest rap and Hadag Nahash's satirical critique.",
			he: "האינתיפאדה השנייה פיצלה את הסצנה המקומית — מהמנוני הימין של סאבלימינל, דרך ראפ המחאה בערבית של דאם ועד הסאטירה של הדג נחש.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2005 ||
			/disengagement/i.test(conflict.title ?? "") ||
			/ההתנתקות/.test(conflict.title_he ?? ""),
		intro: {
			en: "The Gaza disengagement deepened internal Israeli polarization, echoed in hip-hop tracks torn between fatigue, ideological division, and questioning of political leadership.",
			he: "ההתנתקות מעזה העמיקה את הקיטוב הפנימי בישראל, והדהדה בשירי היפ־הופ שביטאו שחיקה, מחלוקת אידיאולוגית וביקורת על ההנהגה.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2006 ||
			/lebanon/i.test(conflict.title ?? "") ||
			/לבנון/.test(conflict.title_he ?? ""),
		intro: {
			en: "Siren routines and northern shelters shifted Hebrew rap from broad ideological slogans toward home-front anxiety, military reserve duty, and disillusionment.",
			he: "שגרת האזעקות והמקלטים בצפון העבירה את הראפ העברי מסיסמאות גדולות לחרדת העורף, שירות המילואים ותחושת האכזבה.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2008 ||
			/cast lead/i.test(conflict.title ?? "") ||
			/עופרת יצוקה/.test(conflict.title_he ?? ""),
		intro: {
			en: "Widespread rocket fire and the Gaza ground operation sharpened the divide between militant solidarity tracks and anti-war dissident verses on both sides.",
			he: "ירי הרקטות והמבצע הקרקעי בעזה חידדו את הפער בין שירי הזדהות לוחמניים לבין בתי מחאה אנטי־מלחמתיים משני הצדדים.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2012 ||
			/pillar of defense/i.test(conflict.title ?? "") ||
			/עמוד ענן/.test(conflict.title_he ?? ""),
		intro: {
			en: "As Iron Dome interceptions entered daily life, a new generation of indie rappers began documenting the surreal routine of sirens and social media feeds.",
			he: "כשיירוטי כיפת ברזל הפכו לחלק מהיומיום, דור חדש של ראפרים עצמאיים תיעד את השגרה הסוריאליסטית של אזעקות ורשתות חברתיות.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2014 ||
			/protective edge/i.test(conflict.title ?? "") ||
			/צוק איתן/.test(conflict.title_he ?? ""),
		intro: {
			en: "Fifty days of war pushed both mainstream Israeli hip-hop and underground Palestinian rap to confront grief, trauma, and the human cost of recurring cycles of violence.",
			he: "חמישים ימי לחימה דחפו את ההיפ־הופ הישראלי והראפ הפלסטיני המחתרתי לעסוק בשכול, בטראומה ובמחיר האנושי של סבבי האלימות.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2018 ||
			/march of return/i.test(conflict.title ?? "") ||
			/צעדת השיבה/.test(conflict.title_he ?? ""),
		intro: {
			en: "Border protests and southern kite fires inspired raw, documentary-style storytelling from Gazan youth MCs and Israeli periphery artists alike.",
			he: "המחאות על הגבול והמציאות בעוטף הולידו סיפור ישיר ותיעודי מצד אמנים צעירים בעזה לצד ראפרים מהפריפריה הישראלית.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2021 ||
			/guardian of the walls/i.test(conflict.title ?? "") ||
			/שומר החומות/.test(conflict.title_he ?? ""),
		intro: {
			en: "Viral short-form video carried young Gazan voices like MC Abdul worldwide while mixed-city unrest prompted stark reflections inside Israeli hip-hop.",
			he: "סרטונים ויראליים נשאו קולות צעירים מעזה כמו MC Abdul לעולם, בעוד המהומות בערים המעורבות עוררו תגובות חדות בהיפ־הופ הישראלי.",
		},
	},
	{
		match: (conflict, year) =>
			year === 2023 ||
			/swords of iron|israel-hamas/i.test(conflict.title ?? "") ||
			/חרבות ברזל/.test(conflict.title_he ?? ""),
		intro: {
			en: "After October 7, rap became an immediate outlet for shock, rage, and grief — from viral wartime anthems to deeply personal diaries of displacement and loss.",
			he: "לאחר ה־7 באוקטובר הפך הראפ לערוץ מיידי של הלם, זעם ואבל — מהמנוני מלחמה ויראליים ועד יומנים אישיים של עקירה ואובדן.",
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
