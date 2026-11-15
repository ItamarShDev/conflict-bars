import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { FileSongList } from "../../../timeline/types";
import { BubbleChart } from "./BubbleChart";

const songs: FileSongList = [
	{
		name: "Left song",
		artist: "Left artist",
		artist_details: { affiliation: "left" },
		published_date: "2000",
	},
	{
		name: "Right song",
		artist: "Right artist",
		artist_details: { affiliation: "right" },
		published_date: "2001",
	},
	{
		name: "Center song",
		artist: "Center artist",
		artist_details: { affiliation: "center" },
		published_date: "2002",
	},
	{
		name: "Unknown song",
		artist: "Unknown artist",
		published_date: "2003",
	},
];

describe("BubbleChart Pass It On presentation", () => {
	it("renders four leaning totals and a left-to-right chart plot", () => {
		const html = renderToStaticMarkup(
			<BubbleChart songs={songs} lang="en" bands={[]} />,
		);
		const stats = html.match(
			/<li class="pass-it-on-chart-stat"[^>]*>[\s\S]*?<\/li>/g,
		);

		expect(html).toContain('class="pass-it-on-chart"');
		expect(html).toContain('<ul class="pass-it-on-chart-stats"');
		expect(html).toContain('<li class="pass-it-on-chart-stat"');
		expect(html).toContain('class="pass-it-on-chart-plot"');
		expect(html).toContain('dir="ltr"');
		expect(stats).toHaveLength(4);
		expect(html).toContain('data-leaning="left"');
		expect(html).toContain('data-leaning="right"');
		expect(html).toContain('data-leaning="center"');
		expect(html).toContain('data-leaning="unknown"');
		for (const stat of stats ?? []) {
			expect(stat).toContain('class="pass-it-on-chart-stat-count"');
			expect(stat).toContain(">1</span>");
		}
	});

	it("renders a styled localized empty state when there are no valid songs", () => {
		const html = renderToStaticMarkup(
			<BubbleChart songs={[]} lang="he" bands={[]} />,
		);

		expect(html).toContain('class="pass-it-on-chart pass-it-on-chart-empty"');
		expect(html).toContain("אין שירים שמתאימים לחיפוש.");
		expect(html).not.toContain("pass-it-on-chart-stats");
	});
});
