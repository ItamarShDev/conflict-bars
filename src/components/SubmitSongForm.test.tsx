import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SubmitSongForm } from "./SubmitSongForm";
import { translations } from "./timeline/translations";

function renderForm(editSong?: {
	name: string;
	artist: string;
	published_date: string;
	language?: string;
}) {
	return renderToStaticMarkup(
		<SubmitSongForm
			artistNames={["Test artist"]}
			languageNames={["Arabic", "English", "Hebrew", "Hebrew/Arabic"]}
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

	it("warns in Hebrew that the GitHub issue is public", () => {
		expect(renderForm()).toContain("ייפתח דיווח ציבורי ב-GitHub");
	});
});
