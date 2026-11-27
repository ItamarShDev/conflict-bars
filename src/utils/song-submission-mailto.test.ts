import { describe, expect, it } from "vitest";
import {
	buildSongSubmissionMailto,
	MAX_MAILTO_URL_LENGTH,
	SONG_SUBMISSION_RECIPIENT,
} from "./song-submission-mailto";

const correctionPayload = {
	isCorrection: true,
	songName: "שם חדש & 'Live'",
	artist: "אמן",
	publishedDate: "2023-06",
	language: "Hebrew",
	existingSong: {
		name: "שם מקורי",
		artist: "אמן מקורי",
		publishedDate: "2022-01",
	},
	lyricSample: { hebrew: "שורה ראשונה\nשורה שנייה +? #()!*" },
	links: { songInfo: "https://example.com/song?a=1&b=2" },
};

describe("song submission mailto draft", () => {
	it("encodes Unicode, punctuation, query characters, and line breaks", () => {
		const draft = buildSongSubmissionMailto(correctionPayload);

		expect(draft.url).not.toBeNull();
		expect(draft.url).toContain(`mailto:${SONG_SUBMISSION_RECIPIENT}?`);
		const query = new URLSearchParams(draft.url?.split("?")[1]);
		expect(query.get("subject")).toBe(draft.subject);
		expect(query.get("body")).toBe(draft.body);
		expect(draft.subject).not.toMatch(/[\r\n]/);
		expect(draft.body).toContain("Current entry:");
		expect(draft.body).toContain("- Artist: אמן מקורי");
		expect(draft.body).toContain("- Published date: 2022-01");
		expect(draft.body).toContain("- Published date: 2023-06");
		expect(draft.body).toContain("שורה ראשונה\r\nשורה שנייה +? #()!*");
	});

	it("keeps user newlines out of the email subject", () => {
		const draft = buildSongSubmissionMailto({
			...correctionPayload,
			songName: "Song\r\nBcc: stranger@example.com",
		});

		expect(draft.subject).toBe(
			"Song correction suggestion: Song Bcc: stranger@example.com - אמן",
		);
		expect(draft.subject).not.toMatch(/[\r\n]/);
	});

	it("keeps the complete body for oversized drafts instead of truncating", () => {
		const lyric = "מילה 😀 & + #".repeat(1200);
		const draft = buildSongSubmissionMailto({
			...correctionPayload,
			lyricSample: { hebrew: lyric },
			links: undefined,
		});

		expect(draft.url).toBeNull();
		expect(draft.body.length).toBeGreaterThan(MAX_MAILTO_URL_LENGTH);
		expect(draft.body).toContain(lyric);
		expect(draft.body.endsWith(lyric)).toBe(true);
	});

	it("keeps new-song drafts distinct from corrections", () => {
		const draft = buildSongSubmissionMailto({
			...correctionPayload,
			isCorrection: false,
			songName: "New song",
			publishedDate: "2001",
			existingSong: undefined,
		});

		expect(draft.body).toContain("New song submission.");
		expect(draft.body).toContain("- Published date: 2001");
		expect(draft.body).not.toContain("Current entry:");
	});

	it("preserves day-level dates in correction drafts", () => {
		const draft = buildSongSubmissionMailto({
			...correctionPayload,
			publishedDate: "2023-06-14",
			existingSong: {
				...correctionPayload.existingSong,
				publishedDate: "2008-08-01",
			},
		});

		expect(draft.body).toContain("- Published date: 2008-08-01");
		expect(draft.body).toContain("- Published date: 2023-06-14");
	});
});
