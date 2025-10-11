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
		stack: {
			viewAll: "הצג שירים",
			close: "סגור",
			songsLabel: "שירים",
		},
	},
};

export type SubmitSongFormTranslations =
	(typeof translations)["en"]["submitSongForm"];
