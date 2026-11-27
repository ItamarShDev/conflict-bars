import { describe, expect, it } from "vitest";
import {
	buildSongSubmissionIssueUrl,
	MAX_GITHUB_ISSUE_URL_LENGTH,
	type SongIssuePayload,
} from "./song-submission-issue";

function preparedIssue(payload: SongIssuePayload): URL {
	const result = buildSongSubmissionIssueUrl(payload);
	if (result.status !== "ready") {
		throw new Error("Expected a prefilled issue URL");
	}
	return new URL(result.url);
}

describe("song submission issue drafts", () => {
	it("prepares a bilingual GitHub issue for a new song", () => {
		const issue = preparedIssue({
			isEditMode: false,
			songName: "New track",
			artist: "Test artist",
			publishedDate: "2024",
			language: "Hebrew",
			lyricSample: {
				hebrew: "שורה",
				englishTranslation: "A line",
			},
			links: { youtube: "https://example.com/video" },
		});

		expect(issue.origin + issue.pathname).toBe(
			"https://github.com/ItamarShDev/conflict-bars/issues/new",
		);
		expect(issue.searchParams.get("title")).toContain("Song submission");
		expect(issue.searchParams.get("title")).toContain("New track");
		expect(issue.searchParams.get("body")).toContain("שורה");
		expect(issue.searchParams.get("body")).toContain("A line");
		expect(issue.searchParams.get("body")).toContain(
			"https://example.com/video",
		);
	});

	it("distinguishes corrections and identifies the existing archive entry", () => {
		const issue = preparedIssue({
			isEditMode: true,
			songName: "Corrected title",
			artist: "Test artist",
			publishedDate: "2024",
			language: "Arabic",
			existingSong: { name: "Old title", published_date: "2023" },
		});

		expect(issue.searchParams.get("title")).toContain("Song correction");
		expect(issue.searchParams.get("body")).toContain("Old title (2023)");
		expect(issue.searchParams.get("body")).toContain("Corrected title");
		expect(issue.searchParams.get("body")).toContain("Suggested correction");
	});

	it("rejects long lyric samples without returning a truncated URL", () => {
		const result = buildSongSubmissionIssueUrl({
			isEditMode: false,
			songName: "Long lyric",
			artist: "Test artist",
			publishedDate: "2024",
			language: "Hebrew",
			lyricSample: { hebrew: "ש".repeat(1200) },
		});

		expect(result).toMatchObject({
			status: "too-long",
			maxLength: MAX_GITHUB_ISSUE_URL_LENGTH,
		});
		expect(result.status === "too-long" && result.actualLength).toBeGreaterThan(
			MAX_GITHUB_ISSUE_URL_LENGTH,
		);
		expect(result).not.toHaveProperty("url");
	});

	it("rejects long link URLs without returning a truncated URL", () => {
		const result = buildSongSubmissionIssueUrl({
			isEditMode: false,
			songName: "Long link",
			artist: "Test artist",
			publishedDate: "2024",
			language: "Hebrew",
			links: { lyrics: `https://example.com/${"x".repeat(8000)}` },
		});

		expect(result).toMatchObject({
			status: "too-long",
			maxLength: MAX_GITHUB_ISSUE_URL_LENGTH,
		});
		expect(result).not.toHaveProperty("url");
	});
});
