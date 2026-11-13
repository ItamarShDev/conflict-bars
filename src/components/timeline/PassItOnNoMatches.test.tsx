import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PassItOnNoMatches } from "./PassItOnNoMatches";
import { translations } from "./translations";

describe("Pass It On no-match status", () => {
	it.each(["en", "he"] as const)(
		"renders localized feedback and a clear action in %s",
		(lang) => {
			const html = renderToStaticMarkup(
				<PassItOnNoMatches
					message={translations[lang].passItOn.noSongMatch}
					clearLabel={translations[lang].passItOn.clearSongSearchAndFilters}
					onClear={() => {}}
				/>,
			);
			expect(html).toContain('role="status"');
			expect(html).toContain(translations[lang].passItOn.noSongMatch);
			expect(html).toContain(
				translations[lang].passItOn.clearSongSearchAndFilters,
			);
			expect(html).toContain('<button type="button"');
		},
	);
});
