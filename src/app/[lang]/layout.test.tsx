import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Layout, { generateMetadata } from "./layout";

describe("route metadata and document wrapper", () => {
	it("uses Hebrew metadata and sets RTL direction on /he", async () => {
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
		expect(metadata.alternates?.languages).toEqual({
			he: "https://www.conflictbars.org/he",
			en: "https://www.conflictbars.org/en",
		});
		expect(metadata.openGraph?.locale).toBe("he_IL");
		expect(metadata.openGraph?.alternateLocale).toEqual(["en_US"]);
		expect(html).toContain('<main lang="he" dir="rtl">');
	});

	it("uses English metadata and sets LTR direction on /en", async () => {
		const metadata = await generateMetadata({
			params: Promise.resolve({ lang: "en" }),
		});
		const html = renderToStaticMarkup(
			await Layout({
				children: <div>Timeline</div>,
				params: Promise.resolve({ lang: "en" }),
			}),
		);

		expect(metadata.alternates?.canonical).toBe(
			"https://www.conflictbars.org/en",
		);
		expect(metadata.openGraph?.locale).toBe("en_US");
		expect(metadata.openGraph?.alternateLocale).toEqual(["he_IL"]);
		expect(html).toContain('<main lang="en" dir="ltr">');
	});

	it("rejects unsupported locale metadata", async () => {
		await expect(
			generateMetadata({ params: Promise.resolve({ lang: "fr" }) }),
		).rejects.toThrow();
	});
});
