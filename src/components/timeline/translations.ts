export const translations = {
	en: {
		title: "Conflict Bars",
		subtitle: "Israeli and Palestinian hip-hop alongside historical context",
		passItOn: {
			titleLead: "A mixtape of",
			titleEmphasis: "complicated times.",
			hebrewTagline: "להעביר הלאה",
			cassetteAlt: "A real compact cassette tape",
			subtitle:
				"Israeli and Palestinian hip-hop, filed alongside historical context from the same periods.",
			catalogSummary: "{{songs}} tracks · {{artists}} artists · {{range}}",
			eventSummary: "{{count}} historical notes in the archive",
			noDateRange: "Dates not available",
			chronologyKicker: "THE CHRONOLOGY",
			chronologyTitle: "Every year on the tape.",
			method:
				"Historical notes are filed under the year they start, with their full date ranges. Sharing a year does not imply a connection to a track.",
			searchNote:
				"Search and the leaning/decade filters apply to songs; historical notes remain in view.",
			viewLabel: "Show",
			all: "All",
			music: "Music",
			history: "History",
			status: "{{songs}} songs · {{events}} historical notes",
			yearNavigation: "Jump to a year",
			selectYear: "Select year",
			filedUnder: "Filed under {{year}} · start year",
			eventTitleFallback: "Historical event",
			hipHopEffectLabel: "Hip-hop impact",
			spectrumLeft: "← Left / Dissent",
			spectrumCenter: "Center / Critique",
			spectrumRight: "Right / Nationalist →",
			noSongsInYear: "No songs are listed in the archive for this year.",
			noHistoryInYear: "No historical notes start in this year in the archive.",
			noSongsFound: "No songs match these search and filter settings.",
			noSongMatch:
				"No songs match these search and filter settings. Historical notes are not filtered.",
			clearSongSearchAndFilters: "Clear song search and filters",
			noHistoryAvailable: "No historical notes are available in this archive.",
			emptyArchive:
				"No songs or historical notes are available in this archive yet.",
			trackOne: "track",
			trackMany: "tracks",
			historyOne: "historical note",
			historyMany: "historical notes",
			credits: "Image and type credits",
			photoCredit:
				"Street photograph: “Graffiti Eilat street Tel Aviv.jpg” by Nizzan Cohen, own work; cropped and color-treated for this page under CC BY 4.0.",
			photoSourceLabel: "Photo source and license",
			photoLicenseLabel: "CC BY 4.0 license",
			haifaCredit:
				"Haifa harbor panorama by Equalhuman, cropped from the CC0 1.0 public-domain image.",
			haifaSourceLabel: "Haifa photograph source",
			cc0LicenseLabel: "CC0 1.0 license",
			ramonCredit:
				"Ramon Crater panorama by Ebfe, released worldwide into the public domain by the author.",
			ramonSourceLabel: "Ramon Crater source and release",
			fontCredit:
				"Gveret Levin and Instrument Serif are used under the SIL Open Font License 1.1.",
			fontLicenseLabel: "Full font license texts",
		},
		search: {
			label: "Search songs",
			placeholder: "Search songs by name, artist, or lyrics",
			noResults: "No songs match your search yet.",
			results: "Found {{count}} song(s)",
		},
		lyrics: "Lyrics",
		lyricExcerpt: {
			original: "Original lyric",
			hebrew: "Hebrew translation",
			english: "English translation",
		},
		fullLyrics: {
			button: "Full lyrics",
			title: "Full lyrics",
			close: "Close lyrics",
			hebrew: "Hebrew",
			english: "English translation",
			missingHebrew: "Full Hebrew lyrics haven’t been added yet.",
			missingEnglish: "The full English translation hasn’t been added yet.",
			source: "Open lyrics source",
		},
		info: "Info",
		conflict: "Conflict",
		eventLabel: "Event",
		reason: "Reason",
		wikipedia: "Wikipedia",
		youtube: "YouTube",
		description: "Description",
		effects: "Effects",
		submitSongButton: "Submit a song",
		submitSongForm: {
			modalCloseAria: "Close submit song form",
			title: "Submit a Song",
			editTitle: "Suggest Song Edit",
			fields: {
				songName: "Song name *",
				artist: "Artist *",
				publishedDate: "Published date (YYYY, YYYY-MM, or YYYY-MM-DD) *",
				language: "Language *",
				lyricHebrew: "Lyric sample (Hebrew) *",
				lyricEnglish: "Lyric sample (English translation)",
				linkLyrics: "Lyrics link",
				linkInfo: "Song info link",
				linkYoutube: "YouTube link",
			},
			placeholders: {
				publishedYear: "YYYY",
			},
			buttons: {
				submit: "Prepare GitHub issue",
				openIssue: "Review and submit on GitHub",
			},
			issueReady:
				"Your draft is ready. Review it and submit the issue on GitHub to finish.",
			issuePrivacyNotice:
				"This opens a public GitHub issue. Do not include private information.",
			errors: {
				required: "Please fill in all required fields.",
				invalidPublishedDate:
					"Enter a date as YYYY, YYYY-MM, or YYYY-MM-DD (1900–2099).",
				issueTooLong:
					"The complete draft exceeds the safe GitHub URL limit ({{limit}} characters). Nothing was truncated; shorten the lyric sample or links, or create the issue manually.",
			},
		},
		helpModal: {
			buttonLabel: "How it works",
			buttonAria: "Open site explanation",
			modalTitle: "How to travel through time",
			description: {
				intro:
					"This site presents Israeli and Palestinian hip-hop alongside historical context from the same periods, without asserting a cause-and-effect connection.",
				columns: {
					left: "Choose a year to see historical notes filed under their start year",
					right: "Songs released in that year appear in a separate column",
				},
				borders:
					"Card borders indicate political leaning — red for left, blue for right, yellow for center, gray for unknown.",
				catalog:
					"The timeline currently covers {{songs}} songs by {{artists}} artists, spanning {{startYear}}–{{endYear}}.",
				emptyCatalog: "No cataloged songs are available yet.",
				submissions:
					"Want to contribute? Use the Submit a Song button to share missing tracks or context.",
			},
			close: "Close",
		},
		timeTravel: {
			play: "Play",
			pause: "Pause",
			previous: "Previous year",
			next: "Next year",
			selectYear: "Select year",
			noConflict: "No recorded conflict for this year.",
			noSongs: "No songs recorded for this year.",
		},
		editSuggestion: {
			buttonTitle: "Suggest edit",
			buttonAria: "Suggest edit for this song",
			iconTitle: "Suggest edit",
		},
		stack: {
			viewAll: "View songs",
			close: "Close",
			songsLabel: "songs",
		},
		filters: {
			toggle: "Filters",
			clearAll: "Clear all",
			leaning: {
				label: "Political leaning",
				left: "Left",
				right: "Right",
				center: "Center",
				unknown: "Unknown",
			},
			decade: {
				label: "Decade",
			},
		},
		nav: {
			bubble: "Stats",
			stats: "Stats",
			timeline: "Timeline",
		},
		languageToggle: "עברית",
		stats: {
			title: "Catalog statistics",
			subtitle: "Political patterns across the archive",
			description:
				"Two complementary charts: release volume by political leaning, and the changing presence of coexistence and two-state aspirations in the lyrics.",
			tabsLabel: "Statistics views",
			resolutionTab: "Resolution aspirations",
			leaningTab: "Releases by leaning",
			resolutionChartTitle: "Shared-resolution aspirations over time",
			resolutionChartDescription:
				"Each bubble counts songs classified as aspiring to peaceful coexistence or a shared political resolution. Circle area is proportional to the count; solid inner circles mark explicit two-state support. Small dots mark exclusive or anti-compromise songs in the same year and leaning.",
			resolutionPositiveLabel: "peaceful-resolution songs",
			explicitTwoStateLabel: "explicit two-state songs",
			shareLabel: "of classified catalog",
			legendPositive: "peaceful/shared resolution",
			legendExplicit: "explicit two-state",
			legendOpposed: "exclusive/opposed present",
			methodNote:
				"Method: lyrics-linked automated classification with manual review of positive and opposed results; evidence came from {{full}} full lyric texts, {{partial}} partial texts, and {{excerpt}} catalog excerpts. Interpretive classifications are conservative and linked to sources. Because matches are sparse and lyric coverage is uneven, treat the chart as documented examples over time rather than a representative trend measurement.",
		},
		bubble: {
			title: "Releases by political leaning",
			subtitle: "Songs per year — left vs right",
			description:
				"Israeli hip-hop releases counted per year by the artist's political leaning, with conflict periods marked behind the bars.",
		},
	},
	he: {
		title: "חרוזים מסוכסכים",
		subtitle: "היפ־הופ ישראלי ופלסטיני לצד הקשר היסטורי",
		passItOn: {
			titleLead: "מיקסטייפ של",
			titleEmphasis: "זמנים מורכבים.",
			hebrewTagline: "להעביר הלאה",
			cassetteAlt: "קלטת שמע אמיתית",
			subtitle: "היפ־הופ ישראלי ופלסטיני לצד הקשר היסטורי מאותה תקופה.",
			catalogSummary: "{{songs}} שירים · {{artists}} אמנים · {{range}}",
			eventSummary: "{{count}} הערות היסטוריות בארכיון",
			noDateRange: "אין תאריכים זמינים",
			chronologyKicker: "ציר הזמן",
			chronologyTitle: "כל שנה על הקלטת.",
			method:
				"הערות היסטוריות משויכות לשנת ההתחלה ומציגות את טווח התאריכים המלא. הופעה באותה שנה אינה טענה לקשר לשיר.",
			searchNote:
				"החיפוש ומסנני הנטייה והעשור חלים על שירים בלבד; הערות היסטוריות נשארות מוצגות.",
			viewLabel: "הצגה",
			all: "הכל",
			music: "מוזיקה",
			history: "היסטוריה",
			status: "{{songs}} שירים · {{events}} הערות היסטוריות",
			yearNavigation: "מעבר לשנה",
			selectYear: "בחירת שנה",
			filedUnder: "משויך לשנת {{year}} · שנת התחלה",
			eventTitleFallback: "אירוע היסטורי",
			hipHopEffectLabel: "ההשפעה על ההיפ־הופ",
			spectrumLeft: "← שמאל / מחאה",
			spectrumCenter: "מרכז / ביקורת",
			spectrumRight: "ימין / לאומי →",
			noSongsInYear: "אין שירים הרשומים בארכיון לשנה זו.",
			noHistoryInYear: "אין בארכיון הערות היסטוריות שמתחילות בשנה זו.",
			noSongsFound: "לא נמצאו שירים התואמים לחיפוש ולמסננים האלה.",
			noSongMatch:
				"לא נמצאו שירים התואמים לחיפוש ולמסננים. הערות היסטוריות אינן מסוננות.",
			clearSongSearchAndFilters: "ניקוי חיפוש השירים והמסננים",
			noHistoryAvailable: "אין הערות היסטוריות בארכיון.",
			emptyArchive: "אין עדיין שירים או הערות היסטוריות בארכיון.",
			trackOne: "שיר",
			trackMany: "שירים",
			historyOne: "הערה היסטורית",
			historyMany: "הערות היסטוריות",
			credits: "קרדיט לתמונה ולגופנים",
			photoCredit:
				"תצלום רחוב: “Graffiti Eilat street Tel Aviv.jpg” מאת Nizzan Cohen, עבודה מקורית; נחתך ועבר טיפול צבע בעמוד זה ברישיון CC BY 4.0.",
			photoSourceLabel: "מקור התמונה והרישיון",
			photoLicenseLabel: "רישיון CC BY 4.0",
			haifaCredit:
				"תצלום פנורמי של נמל חיפה מאת Equalhuman, בחיתוך מתוך תמונה בנחלת הכלל ברישיון CC0 1.0.",
			haifaSourceLabel: "מקור תצלום חיפה",
			cc0LicenseLabel: "רישיון CC0 1.0",
			ramonCredit:
				"תצלום פנורמי של מכתש רמון מאת Ebfe, שוחרר לנחלת הכלל ברחבי העולם על ידי היוצר.",
			ramonSourceLabel: "מקור ושחרור תצלום מכתש רמון",
			fontCredit:
				"הגופנים Gveret Levin ו־Instrument Serif משמשים ברישיון SIL Open Font License 1.1.",
			fontLicenseLabel: "טקסט מלא של רישיונות הגופנים",
		},
		search: {
			label: "חיפוש שירים",
			placeholder: "חפשו שירים לפי שם, אמן או מילים",
			noResults: "אין שירים שמתאימים לחיפוש.",
			results: "נמצאו {{count}} שירים",
		},
		lyrics: "מילים",
		lyricExcerpt: {
			original: "המילים במקור",
			hebrew: "תרגום לעברית",
			english: "תרגום לאנגלית",
		},
		fullLyrics: {
			button: "מילים מלאות",
			title: "מילים מלאות",
			close: "סגירת המילים",
			hebrew: "עברית",
			english: "תרגום לאנגלית",
			missingHebrew: "המילים המלאות בעברית עדיין לא נוספו.",
			missingEnglish: "התרגום המלא לאנגלית עדיין לא נוסף.",
			source: "פתיחת מקור המילים",
		},
		info: "מידע",
		conflict: "סכסוך",
		eventLabel: "אירוע",
		reason: "סיבה",
		wikipedia: "ויקיפדיה",
		youtube: "יוטיוב",
		description: "תיאור",
		effects: "השפעות",
		submitSongButton: "הוסף שיר",
		submitSongForm: {
			modalCloseAria: "סגור את טופס שליחת השיר",
			title: "הוסף שיר",
			editTitle: "הצעת עריכה לשיר",
			fields: {
				songName: "שם השיר *",
				artist: "אמן *",
				publishedDate: "תאריך יציאה (YYYY, YYYY-MM או YYYY-MM-DD) *",
				language: "שפה *",
				lyricHebrew: "קטע מילים (עברית) *",
				lyricEnglish: "קטע מילים (תרגום לאנגלית)",
				linkLyrics: "קישור למילים",
				linkInfo: "קישור למידע על השיר",
				linkYoutube: "קישור ליוטיוב",
			},
			placeholders: {
				publishedYear: "YYYY",
			},
			buttons: {
				submit: "הכנת פנייה ל-GitHub",
				openIssue: "בדיקה ושליחה ב-GitHub",
			},
			issueReady:
				"הטיוטה מוכנה. בדקו אותה ושלחו את הפנייה ב-GitHub כדי להשלים את ההגשה.",
			issuePrivacyNotice:
				"ייפתח דיווח ציבורי ב-GitHub. אין לכלול מידע אישי או פרטי.",
			errors: {
				required: "אנא מלא את כל השדות החיוניים.",
				invalidPublishedDate:
					"יש להזין תאריך בפורמט YYYY, YYYY-MM או YYYY-MM-DD (1900–2099).",
				issueTooLong:
					"הטיוטה המלאה חורגת ממגבלת האורך הבטוחה לקישור GitHub ({{limit}} תווים). לא קוצר תוכן; יש לקצר את קטע המילים או הקישורים, או ליצור פנייה ידנית.",
			},
		},
		helpModal: {
			buttonLabel: "איך זה עובד",
			buttonAria: "פתח הסבר על האתר",
			modalTitle: "איך לטייל בזמן",
			description: {
				intro:
					"האתר מציג היפ־הופ ישראלי ופלסטיני לצד הקשר היסטורי מאותה תקופה, בלי לטעון לקשר של סיבה ותוצאה.",
				columns: {
					left: "בחרו שנה כדי לראות הערות היסטוריות המשויכות לשנת ההתחלה",
					right: "שירים שיצאו באותה שנה מופיעים בעמודה נפרדת",
				},
				borders:
					"מסגרת הכרטיס מציינת נטייה פוליטית — אדום לשמאל, כחול לימין, צהוב למרכז, אפור ללא ידוע.",
				catalog:
					"ציר הזמן כולל כעת {{songs}} שירים של {{artists}} אמנים, ומשתרע על פני השנים {{startYear}}–{{endYear}}.",
				emptyCatalog: "עדיין אין שירים בקטלוג.",
				submissions:
					"רוצים להוסיף? לחצו על כפתור הוסף שיר ושלחו שיר או מידע שחסר.",
			},
			close: "סגור",
		},
		timeTravel: {
			play: "הפעל",
			pause: "השהה",
			previous: "שנה קודמת",
			next: "שנה הבאה",
			selectYear: "בחרו שנה",
			noConflict: "אין סכסוך מתועד לשנה זו.",
			noSongs: "אין שירים מתועדים לשנה זו.",
		},
		editSuggestion: {
			buttonTitle: "הצע עריכה",
			buttonAria: "הצע עריכה לשיר זה",
			iconTitle: "הצע עריכה",
		},
		stack: {
			viewAll: "הצג שירים",
			close: "סגור",
			songsLabel: "שירים",
		},
		filters: {
			toggle: "סינון",
			clearAll: "נקה הכל",
			leaning: {
				label: "נטייה פוליטית",
				left: "שמאל",
				right: "ימין",
				center: "מרכז",
				unknown: "לא ידוע",
			},
			decade: {
				label: "עשור",
			},
		},
		nav: {
			bubble: "סטטיסטיקה",
			stats: "סטטיסטיקה",
			timeline: "ציר זמן",
		},
		languageToggle: "English",
		stats: {
			title: "קצת מספרים",
			subtitle: "דפוסים פוליטיים לאורך הארכיון",
			description:
				"שני תרשימים משלימים: היקף שירים לפי נטייה פוליטית, והשתנות נוכחות הכמיהה לדו־קיום ולפתרון שתי המדינות במילים.",
			tabsLabel: "תצוגות סטטיסטיקה",
			resolutionTab: "כמיהה לפתרון",
			leaningTab: "שירים לפי נטייה",
			resolutionChartTitle: "כמיהה לפתרון משותף לאורך זמן",
			resolutionChartDescription:
				"כל בועה סופרת שירים שסווגו כמבטאים כמיהה לדו־קיום שלום או לפתרון מדיני משותף. שטח העיגול יחסי לכמות; עיגול פנימי מלא מסמן תמיכה מפורשת בשתי מדינות. נקודות קטנות מסמנות שירים בלעדיים או מתנגדי פשרה באותה שנה ונטייה.",
			resolutionPositiveLabel: "שירי פתרון שליו",
			explicitTwoStateLabel: "שירי שתי מדינות מפורשים",
			shareLabel: "מהקטלוג המסווג",
			legendPositive: "פתרון שליו/משותף",
			legendExplicit: "שתי מדינות במפורש",
			legendOpposed: "קיים שיר בלעדי/מתנגד",
			methodNote:
				"שיטה: סיווג אוטומטי של מילים המקושרות לשירים, עם בדיקה ידנית של תוצאות חיוביות ומתנגדות; המקורות כללו {{full}} מילים מלאות, {{partial}} מילים חלקיות ו־{{excerpt}} קטעים מהקטלוג. הסיווגים הפרשניים שמרניים ומקושרים למקורות. מכיוון שההתאמות מעטות וכיסוי המילים אינו אחיד, יש לראות בתרשים דוגמאות מתועדות לאורך זמן ולא מדד מייצג למגמה.",
		},
		bubble: {
			title: "שירים לפי נטייה פוליטית",
			subtitle: "שירים לפי שנה — שמאל מול ימין",
			description:
				"מספר שירי ההיפ־הופ הישראליים שיצאו בכל שנה לפי הנטייה הפוליטית של האמן, עם תקופות הסכסוך מסומנות ברקע.",
		},
	},
};

export type SubmitSongFormTranslations =
	(typeof translations)["en"]["submitSongForm"];
export type HelpModalTranslations = (typeof translations)["en"]["helpModal"];
export type FiltersTranslations = (typeof translations)["en"]["filters"];
