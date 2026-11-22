import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TimelineHeader } from "./TimelineHeader";

vi.mock("./HelpModal", () => ({ HelpModal: () => null }));

const props = {
	title: "חרוזים מסוכסכים",
	subtitle: "היפ־הופ לצד הקשר היסטורי",
	lang: "he" as const,
	nav: { href: "/bubble", label: "תרשים" },
};
const headerStyles = readFileSync(
	new URL("../../app/globals.css", import.meta.url),
	"utf8",
);

describe("TimelineHeader layouts", () => {
	it("preserves the sticky title header by default", () => {
		const html = renderToStaticMarkup(<TimelineHeader {...props} />);
		expect(html).toContain("control-bar sticky");
		expect(html).toContain("<h1");
		expect(html).toContain("חרוזים מסוכסכים");
	});

	it("uses a compact non-sticky utility row when requested", () => {
		const html = renderToStaticMarkup(<TimelineHeader {...props} compact />);
		expect(html).toContain('class="pass-it-on-utility-row"');
		expect(html).not.toContain("control-bar sticky");
		expect(html).not.toContain("<h1");
	});

	it("exposes no theme switch", () => {
		const html = renderToStaticMarkup(<TimelineHeader {...props} compact />);
		expect(html).not.toContain("pass-it-on-theme-switch");
		expect(html).not.toContain('role="switch"');
	});

	it("renders the language toggle link when provided", () => {
		const html = renderToStaticMarkup(
			<TimelineHeader
				{...props}
				compact
				languageToggle={{ href: "/en", label: "English" }}
			/>,
		);
		expect(html).toContain('href="/en"');
		expect(html).toContain(">English</a>");
	});

	it("aligns the compact header controls to one accessible outer height", () => {
		const sharedControlRule = headerStyles.match(
			/\.pass-it-on \.pass-it-on-utility-button,\s*\.pass-it-on \.pass-it-on-theme-switch,\s*\.pass-it-on \.pass-it-on-theme-track\s*\{([^}]+)\}/,
		)?.[1];

		expect(sharedControlRule).toContain("height: 3rem;");
		expect(sharedControlRule).toContain("min-height: 3rem;");
	});
});
