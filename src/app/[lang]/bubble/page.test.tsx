import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import BubblePage, { generateMetadata } from "./page";

vi.mock("@/utils/file-songs", () => ({
	loadFileSongs: () => [],
}));

vi.mock("@/components/timeline/TimelineHeader", () => ({
	TimelineHeader: ({
		compact,
		nav,
	}: {
		compact?: boolean;
		nav?: { href: string };
	}) => <div data-compact={String(compact)} data-nav={nav?.href} />,
}));

vi.mock("@/components/bubble/BubbleChart", () => ({
	BubbleChart: () => <div data-chart-root="true" />,
}));

async function renderPage(lang: string) {
	const page = await BubblePage({ params: Promise.resolve({ lang }) });
	return renderToStaticMarkup(page);
}

describe("BubblePage Pass It On wrapper", () => {
	it("sets Hebrew direction and renders the compact header and editorial chart intro", async () => {
		const html = await renderPage("he");

		expect(html).toContain(
			'lang="he" dir="rtl" class="relative min-h-screen pass-it-on pass-it-on-chart-page"',
		);
		expect(html).toContain('data-compact="true"');
		expect(html).toContain('data-nav="/"');
		expect(html).toContain('class="pass-it-on-chart-intro"');
		expect(html).toContain(
			'class="pass-it-on-chart-title">שירים לפי נטייה פוליטית</h1>',
		);
		expect(html).toContain(
			'class="pass-it-on-chart-subtitle">שירים לפי שנה — שמאל מול ימין</p>',
		);
		expect(html).toContain('class="pass-it-on-chart-main"');
		expect(html).not.toContain("pass-it-on-cassette");
	});

	it("does not add a timeline dock or Submit action to the chart page", async () => {
		const html = await renderPage("he");
		expect(html).not.toContain("pass-it-on-year-rail");
		expect(html).not.toContain("הוסף שיר");
	});

	it("accepts the English chart route", async () => {
		const html = await renderPage("en");
		expect(html).toContain('lang="en" dir="ltr"');
		expect(html).toContain('data-nav="/en"');
	});

	it("sets the chart canonical and social metadata to /bubble", async () => {
		const metadata = await generateMetadata({
			params: Promise.resolve({ lang: "he" }),
		});
		expect(metadata.alternates?.canonical).toBe(
			"https://www.conflictbars.org/bubble",
		);
		expect(metadata.openGraph?.url).toBe("https://www.conflictbars.org/bubble");
		expect(metadata.openGraph?.locale).toBe("he_IL");
		expect(metadata.twitter?.title).toContain("שירים לפי נטייה פוליטית");
		const enMetadata = await generateMetadata({
			params: Promise.resolve({ lang: "en" }),
		});
		expect(enMetadata.alternates?.canonical).toBe(
			"https://www.conflictbars.org/en/bubble",
		);
		await expect(
			generateMetadata({ params: Promise.resolve({ lang: "fr" }) }),
		).rejects.toThrow();
	});
});
