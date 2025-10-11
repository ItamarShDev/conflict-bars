export const translations = {
	en: {
		title: "Timeline",
		subtitle: "Direction is the political leaning of the artist",
		lyrics: "Lyrics",
		info: "Info",
		conflict: "Conflict",
		reason: "Reason",
		wikipedia: "Wikipedia",
		youtube: "YouTube",
		description: "Description",
		effects: "Effects",
		submitSongButton: "Submit a song",
		submitSongForm: {
			modalCloseAria: "Close submit song form",
			title: "Submit a Song",
			fields: {
				displayName: "Your name *",
				email: "Email",
				songName: "Song name *",
				artist: "Artist *",
				publishedDate: "Published date (YYYY-MM-DD) *",
				language: "Language",
				lyricHebrew: "Lyric sample (Hebrew)",
				lyricEnglish: "Lyric sample (English translation)",
				linkLyrics: "Lyrics link",
				linkInfo: "Song info link",
				linkYoutube: "YouTube link",
			},
			buttons: {
				submitting: "Submitting...",
				submit: "Submit song",
			},
			success: "Thanks! We'll review your submission soon.",
			errors: {
				required: "Please fill in all required fields.",
				generic:
					"Something went wrong while submitting the song. Please try again.",
			},
		},
		helpModal: {
			buttonLabel: "How it works",
			buttonAria: "Open site explanation",
			modalTitle: "How to read this timeline",
			description: {
				intro: "This site visualizes key moments in the Israeli hip-hop scene alongside major conflicts.",
				columns: {
					left: "Left column: Israeli major conflicts",
					right: "Right column: Songs released in the same period",
				},
				borders:
					"Card borders indicate political leaning — red for left, blue for right, gray for unknown.",
				submissions:
					"Want to contribute? Use the Submit a Song button to share missing tracks or context.",
			},
			close: "Close",
		},
		stack: {
			viewAll: "View songs",
			close: "Close",
			songsLabel: "songs",
		},
	},
	he: {
		title: "ציר זמן",
		subtitle: "בכיוון הנטייה הפוליטית",
		lyrics: "מילים",
		info: "מידע",
		conflict: "סכסוך",
		reason: "סיבה",
		wikipedia: "ויקיפדיה",
		youtube: "יוטיוב",
		description: "תיאור",
		effects: "השפעות",
		submitSongButton: "הוסף שיר",
		submitSongForm: {
			modalCloseAria: "סגור את טופס שליחת השיר",
			title: "הוסף שיר",
			fields: {
				displayName: "השם שלך *",
				email: "אימייל",
				songName: "שם השיר *",
				artist: "אמן *",
				publishedDate: "תאריך יציאה (YYYY-MM-DD) *",
				language: "שפה",
				lyricHebrew: "קטע מילים (עברית)",
				lyricEnglish: "קטע מילים (תרגום לאנגלית)",
				linkLyrics: "קישור למילים",
				linkInfo: "קישור למידע על השיר",
				linkYoutube: "קישור ליוטיוב",
			},
			buttons: {
				submitting: "שולח...",
				submit: "שלח שיר",
			},
			success: "תודה! נעבור על ההגשה שלך בקרוב.",
			errors: {
				required: "אנא מלא את כל השדות החיוניים.",
				generic: "משהו השתבש בשליחת השיר. נסה שוב בבקשה.",
			},
		},
		helpModal: {
			buttonLabel: "איך זה עובד",
			buttonAria: "פתח הסבר על האתר",
			modalTitle: "איך לקרוא את הציר",
			description: {
				intro: "האתר מציג אירועים מרכזיים בסצנת ההיפ-הופ הישראלי לצד סכסוכים משמעותיים.",
				columns: {
					left: "צד שמאל: סכסוכים מרכזיים בישראל",
					right: "צד ימין: שירים שיצאו באותה תקופה",
				},
				borders:
					"מסגרת הכרטיס מציינת נטייה פוליטית — אדום לשמאל, כחול לימין, אפור ללא ידוע.",
				submissions:
					"רוצים להוסיף? לחצו על כפתור הוסף שיר ושלחו שיר או מידע שחסר.",
			},
			close: "סגור",
		},
		stack: {
			viewAll: "הצג שירים",
			close: "סגור",
			songsLabel: "שירים",
		},
	},
};

export type SubmitSongFormTranslations =
	(typeof translations)["en"]["submitSongForm"];
export type HelpModalTranslations = (typeof translations)["en"]["helpModal"];
