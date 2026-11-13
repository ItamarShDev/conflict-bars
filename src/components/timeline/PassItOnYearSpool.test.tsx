import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PassItOnYearSpool } from "./PassItOnYearSpool";
import { translations } from "./translations";

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
		expect(html).not.toContain('dir="ltr"');
	});
});
