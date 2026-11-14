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
			expect(html).toContain(
				`aria-label="${translations[lang].passItOn.pauseAnimation}"`,
			);
			expect(html).toContain(
				`<span>${translations[lang].passItOn.pauseAnimation}</span>`,
			);
			expect(translations[lang].passItOn.resumeAnimation).not.toBe("");
			expect(translations[lang].passItOn.motionStaticLabel).not.toBe("");
			expect(translations[lang].passItOn.motionDisabled).not.toBe("");
			expect(html).toContain('data-motion-state="playing"');
			expect(html).toContain('class="pass-it-on-motion-control"');
			expect(html).not.toContain('viewBox="0 0 24 24"');
			expect(html).toContain('clip-path="url(#pass-it-on-cassette-');
			expect(html).toContain(
				'font-family="&quot;Pass It On Hebrew&quot;, cursive"',
			);
			expect(html).toContain('direction="rtl"');
			expect(html).toContain(translations[lang].passItOn.cassetteCaption);
			expect(html).not.toContain("DESIGN STUDY");
		},
	);

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

	it("keeps Tel Aviv as the opaque photo base and uses touch-sized control text", () => {
		const basePhotoRule = heroStyles.match(
			/\.pass-it-on \.pass-it-on-cassette-photo-tel-aviv\s*\{([^}]+)\}/,
		)?.[1];
		const motionControlRule = heroStyles.match(
			/\.pass-it-on \.pass-it-on-motion-control\s*\{([^}]+)\}/,
		)?.[1];
		const haifaMotion = heroStyles.slice(
			heroStyles.indexOf("@keyframes pass-it-on-photo-haifa"),
			heroStyles.indexOf("@keyframes pass-it-on-photo-ramon"),
		);

		expect(basePhotoRule).toContain("opacity: 1;");
		expect(basePhotoRule).not.toContain("animation:");
		expect(motionControlRule).toContain("min-width: 44px;");
		expect(motionControlRule).toContain("min-height: 44px;");
		expect(haifaMotion).toMatch(/60%,\s*66\.6667%\s*\{\s*opacity: 1;/);
		expect(haifaMotion).toMatch(/66\.6668%,\s*100%\s*\{\s*opacity: 0;/);
		expect(heroStyles).toContain("animation-play-state: paused;");
	});
});
