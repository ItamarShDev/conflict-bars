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
				copy={translations.he.passItOn}
			/>,
		);
		expect(html).toContain('class="pass-it-on-rail-years"');
		expect(html).not.toContain('class="pass-it-on-rail-submit"');
		expect(html).not.toContain('dir="ltr"');
	});

	it("renders only the scrollable years without rail controls", () => {
		const html = renderToStaticMarkup(
			<PassItOnYearSpool
				years={[2008, 2010]}
				groups={[]}
				selectedYear={2008}
				onSelect={() => {}}
				copy={translations.he.passItOn}
			/>,
		);
		expect(html).toContain('class="pass-it-on-rail-years"');
		expect(html).not.toContain("pass-it-on-rail-submit");
		expect(html).not.toContain("pass-it-on-advance");
		expect(html).not.toContain('class="pass-it-on-rail-controls"');
		expect(html).not.toContain("pass-it-on-rail-arrow");
		expect(html).not.toContain("pass-it-on-scrubber-counter");
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
			"grid-template-columns: minmax(0, 1fr);",
		);
		expect(mobileRailStyles).toContain("grid-column: 1 / -1;");
		expect(mobileRailStyles).toContain("min-width: 2.75rem;");
		expect(mobileRailStyles).toContain("scroll-margin-top: 12px;");
		expect(mobileRailStyles).toContain(
			"scroll-margin-bottom: var(--pass-it-on-mobile-dock-space);",
		);
	});

	it("fills the tape from inline start in RTL", () => {
		expect(globalStyles).toMatch(
			/\.pass-it-on \.pass-it-on-tape-progress \{[^}]*inset-inline-start: 0;[^}]*border-inline-end: 2px solid #fde68a;/,
		);
		expect(globalStyles).toContain(
			'[dir="rtl"] .pass-it-on .pass-it-on-tape-progress',
		);
	});
});
