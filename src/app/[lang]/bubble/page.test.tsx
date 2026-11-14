import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import BubblePage from "./page";

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

async function renderPage(lang: "en" | "he") {
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
		expect(html).toContain('data-nav="/he"');
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

	it("sets English direction for the chart page", async () => {
		const html = await renderPage("en");
		expect(html).toContain(
			'lang="en" dir="ltr" class="relative min-h-screen pass-it-on pass-it-on-chart-page"',
		);
		expect(html).toContain(
			'class="pass-it-on-chart-title">Releases by political leaning</h1>',
		);
	});
});
