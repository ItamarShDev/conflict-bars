import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Layout, { generateMetadata } from "./layout";

describe("Hebrew route metadata and document wrapper", () => {
	it("uses Hebrew metadata with no English alternate and sets RTL direction", async () => {
		const metadata = await generateMetadata({
			params: Promise.resolve({ lang: "he" }),
		});
		const html = renderToStaticMarkup(
			await Layout({
				children: <div>ציר זמן</div>,
				params: Promise.resolve({ lang: "he" }),
			}),
		);

		expect(metadata.title).toBe("חרוזים מסוכסכים");
		expect(metadata.description).toContain("ציר זמן אינטראקטיבי");
		expect(metadata.alternates?.canonical).toBe(
			"https://www.conflictbars.org/he",
		);
		expect(metadata.alternates?.languages).toBeUndefined();
		expect(metadata.openGraph?.locale).toBe("he_IL");
		expect(html).toContain('<main lang="he" dir="rtl">');
	});

	it("rejects non-Hebrew route metadata", async () => {
		await expect(
			generateMetadata({ params: Promise.resolve({ lang: "en" }) }),
		).rejects.toThrow();
	});
});
