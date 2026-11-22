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
	it("winds connected magnetic tape around both reels and lower guides", () => {
		const html = renderToStaticMarkup(
			<PassItOnHero
				lang="he"
				stats={stats}
				eventCount={4}
				copy={translations.he.passItOn}
			/>,
		);

		expect(html.match(/class="pass-it-on-cassette-tape-pack"/g)).toHaveLength(
			2,
		);
		expect(html.match(/class="pass-it-on-cassette-reel"/g)).toHaveLength(2);
		expect(html.match(/class="pass-it-on-cassette-guide"/g)).toHaveLength(2);
		expect(html).toContain('class="pass-it-on-cassette-tape-path"');
		expect(html).toContain('class="pass-it-on-cassette-tape-dash"');
		const tapePath = html.match(
			/class="pass-it-on-cassette-tape-path" d="([^"]+)"/,
		)?.[1];
		const dashedTapePath = html.match(
			/class="pass-it-on-cassette-tape-dash" d="([^"]+)"/,
		)?.[1];
		expect(tapePath).toBeDefined();
		expect(dashedTapePath).toBe(tapePath);
		if (!tapePath) throw new Error("Expected a solid cassette tape path");
		const values = tapePath.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
		const points = Array.from({ length: values.length / 2 }, (_, index) => ({
			x: values[index * 2],
			y: values[index * 2 + 1],
		}));
		expect(points[0]).toEqual({ x: 182.5, y: 269 });
		expect(points.at(-1)).toEqual({ x: 457.5, y: 269 });
		expect(points.some((point) => point.x < 175 && point.y >= 302)).toBe(true);
		expect(points.some((point) => point.x > 465 && point.y >= 302)).toBe(true);
		const transportStart = points.findIndex(
			(point) => point.x === 169 && point.y === 308.5,
		);
		expect(points[transportStart + 1]).toEqual({ x: 471, y: 308.5 });
		expect(heroStyles).toMatch(
			/@keyframes pass-it-on-reel-turn[\s\S]*?rotate\(-360deg\)/,
		);
		expect(html).not.toContain(
			"M239 269 C278 238 354 238 401 269 C354 300 278 300 239 269Z",
		);
	});

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
			expect(html).toContain('href="/pass-it-on/haifa-harbour.jpg"');
			expect(html).toContain('href="/pass-it-on/ramon-crater.jpg"');
			expect(html).not.toContain("aria-pressed=");
			expect(html).not.toContain("pass-it-on-motion-control");
			expect(html).not.toContain("pass-it-on-cta");
			expect(html).not.toContain('viewBox="0 0 24 24"');
			expect(html).toContain('clip-path="url(#pass-it-on-cassette-');
			expect(html).toContain(
				'font-family="&quot;Pass It On Hebrew&quot;, cursive"',
			);
			expect(html).toContain('direction="rtl"');
			expect(html).toContain(translations[lang].passItOn.cassetteCaption);
			expect(html).toContain(translations[lang].passItOn.cassetteDescription);
			expect(html).toContain(translations[lang].passItOn.cassetteLabel);
			if (lang === "he") expect(html).not.toContain("CONFLICT BARS / SIDE A");
			expect(html).not.toContain("DESIGN STUDY");
		},
	);

	it("anchors the Hebrew side label inside the red strip, clear of the title", () => {
		const html = renderToStaticMarkup(
			<PassItOnHero
				lang="he"
				stats={stats}
				eventCount={4}
				copy={translations.he.passItOn}
			/>,
		);
		const labelTextIndex = html.indexOf(translations.he.passItOn.cassetteLabel);
		const labelTagStart = html.lastIndexOf("<text", labelTextIndex);
		const labelTagEnd = html.indexOf(">", labelTagStart);
		const labelTag = html.slice(labelTagStart, labelTagEnd + 1);

		expect(labelTextIndex).toBeGreaterThanOrEqual(0);
		expect(labelTag).toContain('x="540"');
		expect(labelTag).toContain('text-anchor="start"');
		expect(labelTag).toContain('direction="rtl"');
		expect(labelTag).toContain('letter-spacing="0"');
		expect(labelTag).toContain('y="218"');
		expect(html).toContain('<text x="330" y="207"');
	});

	it("uses a static first photo when reduced motion is preferred", () => {
		const reducedMotionStyles = heroStyles.slice(
			heroStyles.lastIndexOf("@media (prefers-reduced-motion: reduce)"),
		);

		expect(reducedMotionStyles).toContain(
			".pass-it-on .pass-it-on-cassette-photo {",
		);
		expect(reducedMotionStyles).toContain(
			".pass-it-on .pass-it-on-cassette-photo-tel-aviv {",
		);
		expect(reducedMotionStyles).toContain(
			".pass-it-on .pass-it-on-cassette-reel,",
		);
		expect(reducedMotionStyles).toContain(
			".pass-it-on .pass-it-on-cassette-tape-dash,",
		);
		expect(reducedMotionStyles).toContain("animation: none;");
		expect(reducedMotionStyles).toContain("opacity: 1;");
	});

	it("keeps Tel Aviv as the opaque photo base and pauses animations out of view", () => {
		const basePhotoRule = heroStyles.match(
			/\.pass-it-on \.pass-it-on-cassette-photo-tel-aviv\s*\{([^}]+)\}/,
		)?.[1];
		const haifaMotion = heroStyles.slice(
			heroStyles.indexOf("@keyframes pass-it-on-photo-haifa"),
			heroStyles.indexOf("@keyframes pass-it-on-photo-ramon"),
		);

		expect(basePhotoRule).toContain("opacity: 1;");
		expect(basePhotoRule).not.toContain("animation:");
		expect(haifaMotion).toMatch(/60%,\s*66\.6667%\s*\{\s*opacity: 1;/);
		expect(haifaMotion).toMatch(/66\.6668%,\s*100%\s*\{\s*opacity: 0;/);
		expect(heroStyles).toContain("animation-play-state: paused;");
	});

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
