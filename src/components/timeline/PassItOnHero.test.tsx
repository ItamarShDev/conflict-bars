import { readFileSync } from "node:fs";
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
const heroStyles = readFileSync(
	new URL("../../app/globals.css", import.meta.url),
	"utf8",
);

describe("Pass It On cassette artwork", () => {
	it.each(["en", "he"] as const)(
		"renders the real cassette photo and stats card in %s",
		(lang) => {
			const html = renderToStaticMarkup(
				<PassItOnHero
					lang={lang}
					stats={stats}
					eventCount={4}
					copy={translations[lang].passItOn}
				/>,
			);
			expect(html).toContain("cassette-hero.png");
			expect(html).toContain("pass-it-on-cassette-real");
			expect(html).toContain(translations[lang].passItOn.cassetteAlt);
			expect(html).toContain("pass-it-on-j-card");
			expect(html).toContain("7");
			expect(html).not.toContain("aria-pressed=");
			expect(html).not.toContain("pass-it-on-motion-control");
			expect(html).not.toContain("pass-it-on-cta");
			expect(html).not.toContain("pass-it-on-cassette-photo");
		},
	);

	it("stacks the narrow hero controls, cassette, and stats card without overlap", () => {
		const narrowHeroStyles = heroStyles.slice(
			heroStyles.indexOf("@media (max-width: 420px)"),
			heroStyles.lastIndexOf("@media (prefers-reduced-motion: reduce)"),
		);

		expect(narrowHeroStyles).toContain("flex-direction: column;");
		expect(narrowHeroStyles).toContain("align-self: center;");
		expect(narrowHeroStyles).toContain("flex: 0 0 auto;");
		expect(narrowHeroStyles).toContain(".pass-it-on .pass-it-on-j-card {");
		expect(narrowHeroStyles).toContain("position: relative;");
		expect(narrowHeroStyles).toContain("bottom: auto;");
		expect(narrowHeroStyles).toContain("transform: none;");
	});
});
