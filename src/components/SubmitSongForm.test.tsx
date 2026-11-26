import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitSongForm } from "./SubmitSongForm";
import { translations } from "./timeline/translations";

const formMocks = vi.hoisted(() => ({
	queryResults: [] as unknown[],
}));

vi.mock("convex/react", () => ({
	useQuery: () => formMocks.queryResults.shift(),
	useConvex: () => ({ query: vi.fn(), mutation: vi.fn() }),
}));
vi.mock("../actions/email", () => ({ sendThankYouMail: vi.fn() }));

const supportedLanguages = ["Arabic", "English", "Hebrew", "Hebrew/Arabic"];

beforeEach(() => {
	formMocks.queryResults = [
		supportedLanguages.map((language) => ({ language })),
		[],
	];
});

function renderForm(editSong?: {
	name: string;
	artist: string;
	published_date: string;
	language?: string;
}) {
	return renderToStaticMarkup(
		<SubmitSongForm
			submitSong={vi.fn() as never}
			translations={translations.he.submitSongForm}
			lang="he"
			editSong={editSong}
		/>,
	);
}

describe("SubmitSongForm Hebrew language field", () => {
	it("renders localized options while retaining the free-text field", () => {
		const html = renderForm();
		const languageInput = html.match(/<input[^>]*name="language"[^>]*>/)?.[0];

		expect(languageInput).toContain('type="text"');
		expect(languageInput).toContain('list="');
		expect(html).toContain('value="ערבית"');
		expect(html).toContain('value="אנגלית"');
		expect(html).toContain('value="עברית"');
		expect(html).toContain('value="עברית/ערבית"');
		expect(html).not.toContain('<option value="Hebrew"');
	});

	it("shows an edit's canonical language in Hebrew for round-trip submission", () => {
		const html = renderForm({
			name: "Original title",
			artist: "Original artist",
			published_date: "2001",
			language: "Hebrew/Arabic",
		});
		const languageInput = html.match(/<input[^>]*name="language"[^>]*>/)?.[0];

		expect(languageInput).toContain('value="עברית/ערבית"');
	});

	it("requires a lyric excerpt and a lyrics source link", () => {
		const html = renderForm();
		const lyricHebrewInput = html.match(
			/<textarea[^>]*name="lyricHebrew"[^>]*>/,
		)?.[0];
		const linkLyricsInput = html.match(
			/<input[^>]*name="linkLyrics"[^>]*>/,
		)?.[0];

		expect(lyricHebrewInput).toContain("required");
		expect(linkLyricsInput).toContain("required");
		expect(linkLyricsInput).toContain('type="url"');
		expect(html).toContain("קישור למקור המילים *");
	});

	it("does not require a lyrics source link on edit suggestions", () => {
		const html = renderForm({
			name: "Original title",
			artist: "Original artist",
			published_date: "2001",
		});
		const linkLyricsInput = html.match(
			/<input[^>]*name="linkLyrics"[^>]*>/,
		)?.[0];

		expect(linkLyricsInput).not.toContain("required");
	});
});
