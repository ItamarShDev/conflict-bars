import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PassItOnYearSpool } from "./PassItOnYearSpool";
import { translations } from "./translations";

const globalStyles = readFileSync(
	new URL("../../app/globals.css", import.meta.url),
	"utf8",
);
const mobileRailStyles = globalStyles.slice(
	globalStyles.lastIndexOf("@media (max-width: 760px)"),
);

describe("Pass It On year rail direction", () => {
	it("inherits the page reading direction instead of forcing LTR", () => {
		const html = renderToStaticMarkup(
			<PassItOnYearSpool
				years={[2008, 2010]}
				groups={[]}
				selectedYear={2008}
				onSelect={() => {}}
				isAutoAdvancing={false}
				onToggleAutoAdvance={() => {}}
				onPrevious={() => {}}
				onNext={() => {}}
				copy={translations.he.passItOn}
			/>,
		);
		expect(html).toContain('class="pass-it-on-rail-years"');
		expect(html).not.toContain('class="pass-it-on-rail-submit"');
		expect(html).not.toContain('dir="ltr"');
	});

	it("renders the optional submit action beside the scrollable years", () => {
		const html = renderToStaticMarkup(
			<PassItOnYearSpool
				years={[2008, 2010]}
				groups={[]}
				selectedYear={2008}
				onSelect={() => {}}
				isAutoAdvancing={false}
				onToggleAutoAdvance={() => {}}
				onPrevious={() => {}}
				onNext={() => {}}
				submitAction={<button type="button">הוספת שיר</button>}
				copy={translations.he.passItOn}
			/>,
		);
		const yearsIndex = html.indexOf('class="pass-it-on-rail-years"');
		const submitIndex = html.indexOf('class="pass-it-on-rail-submit"');

		expect(yearsIndex).toBeGreaterThan(-1);
		expect(submitIndex).toBeGreaterThan(yearsIndex);
		expect(html.slice(submitIndex)).toContain("הוספת שיר");
		expect(html).toContain('class="pass-it-on-rail-controls"');
		expect(html).toContain('aria-label="השנה הקודמת"');
		expect(html).toContain('aria-label="השנה הבאה"');
		expect(html).toContain(
			`aria-label="${translations.he.passItOn.autoAdvance}"`,
		);
	});

	it("docks the rail with safe-area padding and measured scroll space", () => {
		expect(globalStyles).toMatch(
			/\.pass-it-on \.pass-it-on-year-rail \{\s*top: 0;/,
		);
		expect(globalStyles).toContain("position: sticky;");
		expect(globalStyles).toContain("overflow-x: auto;");
		expect(mobileRailStyles).toContain("position: fixed;");
		expect(mobileRailStyles).toContain("inset-inline: 0;");
		expect(mobileRailStyles).toContain("inset-block: auto 0;");
		expect(mobileRailStyles).toContain("z-index: 40;");
		expect(mobileRailStyles).toContain("env(safe-area-inset-bottom, 0px)");
		expect(mobileRailStyles).toContain("env(safe-area-inset-left, 0px)");
		expect(mobileRailStyles).toContain("env(safe-area-inset-right, 0px)");
		expect(mobileRailStyles).toContain(
			"grid-template-columns: minmax(0, 1fr) minmax(44px, 7rem);",
		);
		expect(mobileRailStyles).toContain("grid-column: 1 / -1;");
		expect(mobileRailStyles).toContain("min-width: 2.75rem;");
		expect(mobileRailStyles).toContain("scroll-margin-top: 12px;");
		expect(mobileRailStyles).toContain(
			"scroll-margin-bottom: var(--pass-it-on-mobile-dock-space);",
		);
	});

	it("flips both rail arrows and the auto-advance arrow in RTL and fills tape from inline start", () => {
		expect(globalStyles).toContain(
			'[dir="rtl"] .pass-it-on .pass-it-on-rail-controls .pass-it-on-advance span',
		);
		expect(globalStyles).toContain(
			'.pass-it-on[dir="rtl"] .pass-it-on-rail-controls .pass-it-on-advance span',
		);
		expect(globalStyles).toMatch(
			/\.pass-it-on \.pass-it-on-tape-progress \{[^}]*inset-inline-start: 0;[^}]*border-inline-end: 2px solid #fde68a;/,
		);
		expect(globalStyles).toContain(
			'[dir="rtl"] .pass-it-on .pass-it-on-tape-progress',
		);
	});
});
