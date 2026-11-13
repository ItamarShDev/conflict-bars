import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PassItOnHero } from "./PassItOnHero";
import { translations } from "./translations";

const stats = {
	songCount: 7,
	artistCount: 5,
	startYear: 2000,
	endYear: 2021,
};

describe("Pass It On cassette artwork", () => {
	it.each(["en", "he"] as const)(
		"renders its local photo and caption in %s",
		(lang) => {
			const html = renderToStaticMarkup(
				<PassItOnHero
					lang={lang}
					stats={stats}
					eventCount={4}
					copy={translations[lang].passItOn}
				/>,
			);
			expect(html).toContain('href="/pass-it-on/tel-aviv-graffiti.jpg"');
			expect(html).toContain('clip-path="url(#pass-it-on-cassette-');
			expect(html).toContain(
				'font-family="&quot;Pass It On Hebrew&quot;, cursive"',
			);
			expect(html).toContain('direction="rtl"');
			expect(html).toContain(translations[lang].passItOn.cassetteCaption);
			expect(html).not.toContain("DESIGN STUDY");
		},
	);
});
