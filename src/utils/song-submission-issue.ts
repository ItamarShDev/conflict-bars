import type { FileSong } from "../../timeline/types";

const ISSUE_URL = "https://github.com/ItamarShDev/conflict-bars/issues/new";
export const MAX_GITHUB_ISSUE_URL_LENGTH = 7000;

export type SongSubmissionIssueUrlResult =
	| { status: "ready"; url: string }
	| {
			status: "too-long";
			maxLength: number;
			actualLength: number;
	  };

export type SongIssuePayload = {
	isEditMode: boolean;
	songName: string;
	artist: string;
	publishedDate: string;
	language: string;
	lyricSample?: {
		hebrew?: string;
		englishTranslation?: string;
	};
	links?: {
		lyrics?: string;
		songInfo?: string;
		youtube?: string;
	};
	existingSong?: Pick<FileSong, "name" | "published_date">;
};

export function buildSongSubmissionIssueUrl(
	payload: SongIssuePayload,
): SongSubmissionIssueUrlResult {
	const title = `${payload.isEditMode ? "Song correction / תיקון שיר" : "Song submission / הצעת שיר"}: ${payload.songName} — ${payload.artist}`;
	const body = [
		payload.isEditMode
			? "## Suggested correction / הצעת תיקון"
			: "## New song submission / הצעת שיר חדשה",
		payload.existingSong
			? `Existing entry / הרשומה הקיימת: ${payload.existingSong.name} (${payload.existingSong.published_date})`
			: undefined,
		"",
		"### Proposed details / פרטים מוצעים",
		`- Song / שיר: ${payload.songName}`,
		`- Artist / אמן: ${payload.artist}`,
		`- Release date / שנת יציאה: ${payload.publishedDate}`,
		`- Language / שפה: ${payload.language}`,
		"",
		"### Lyric sample / קטע מילים",
		payload.lyricSample?.hebrew
			? `- Hebrew / עברית: ${payload.lyricSample.hebrew}`
			: undefined,
		payload.lyricSample?.englishTranslation
			? `- English translation / תרגום לאנגלית: ${payload.lyricSample.englishTranslation}`
			: undefined,
		"",
		"### Links / קישורים",
		payload.links?.lyrics
			? `- Lyrics / מילים: ${payload.links.lyrics}`
			: undefined,
		payload.links?.songInfo
			? `- Info / מידע: ${payload.links.songInfo}`
			: undefined,
		payload.links?.youtube ? `- YouTube: ${payload.links.youtube}` : undefined,
	].filter((line): line is string => line !== undefined);

	const issue = new URL(ISSUE_URL);
	issue.searchParams.set("title", title);
	issue.searchParams.set("body", body.join("\n"));
	const url = issue.toString();

	if (url.length > MAX_GITHUB_ISSUE_URL_LENGTH) {
		return {
			status: "too-long",
			maxLength: MAX_GITHUB_ISSUE_URL_LENGTH,
			actualLength: url.length,
		};
	}

	return { status: "ready", url };
}
