import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata, viewport } from "./layout";

vi.mock("./globals.css", () => ({}));
vi.mock("next/font/google", () => ({
	Frank_Ruhl_Libre: () => ({ variable: "frank-ruhl" }),
	Geist: () => ({ variable: "geist" }),
	Geist_Mono: () => ({ variable: "geist-mono" }),
	Libre_Franklin: () => ({ variable: "libre-franklin" }),
}));
vi.mock("@vercel/analytics/next", () => ({ Analytics: () => null }));
describe("Hebrew document metadata", () => {
	it("sets the document language, direction, and root metadata to Hebrew", () => {
		const html = renderToStaticMarkup(
			<RootLayout>
				<div>תוכן</div>
			</RootLayout>,
		);

		expect(html).toContain('<html lang="he" dir="rtl"');
		expect(metadata.title).toBe("חרוזים מסוכסכים");
		expect(metadata.description).toContain("ציר זמן אינטראקטיבי");
		expect(metadata.openGraph?.locale).toBe("he_IL");
		expect(viewport).toMatchObject({
			width: "device-width",
			initialScale: 1,
			viewportFit: "cover",
		});
		expect(html).not.toContain('name="viewport"');
	});
});
