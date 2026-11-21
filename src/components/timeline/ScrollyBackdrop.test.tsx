import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ScrollyBackdrop } from "@/components/timeline/ScrollyBackdrop";

describe("ScrollyBackdrop", () => {
	it("activates the era layer matching the selected year", () => {
		const html2000 = renderToStaticMarkup(
			<ScrollyBackdrop selectedYear={2000} />,
		);
		expect(html2000).toContain(
			'data-active="true"><div class="pass-it-on-scrolly-backdrop-photo" style="background-image:url(/pass-it-on/tel-aviv-graffiti.jpg)"',
		);

		const html2006 = renderToStaticMarkup(
			<ScrollyBackdrop selectedYear={2006} />,
		);
		expect(html2006).toContain(
			'data-active="true"><div class="pass-it-on-scrolly-backdrop-photo" style="background-image:url(/pass-it-on/haifa-harbour.jpg)"',
		);

		const html2014 = renderToStaticMarkup(
			<ScrollyBackdrop selectedYear={2014} />,
		);
		expect(html2014).toContain(
			'data-active="true"><div class="pass-it-on-scrolly-backdrop-photo" style="background-image:url(/pass-it-on/ramon-crater.jpg)"',
		);
	});

	it("matches the CSS active-layer selector in globals.css", () => {
		const css = readFileSync(
			resolve(process.cwd(), "src/app/globals.css"),
			"utf8",
		);
		expect(css).toContain(
			'.pass-it-on .pass-it-on-scrolly-backdrop-layer[data-active="true"]',
		);
	});
});
