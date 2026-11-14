import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("global not-found page", () => {
	it("renders Hebrew RTL content and an accessible link to the archive", () => {
		const html = renderToStaticMarkup(<NotFound />);

		expect(html).toContain('<main lang="he" dir="rtl"');
		expect(html).toContain("העמוד לא נמצא");
		expect(html).toContain("הכתובת שחיפשת אינה זמינה באתר.");
		expect(html).toContain('href="/he"');
		expect(html).toContain("חזרה לציר הזמן");
		expect(html).not.toContain("Page not found");
	});
});
