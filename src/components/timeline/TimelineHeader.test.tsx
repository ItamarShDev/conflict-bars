import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TimelineHeader } from "./TimelineHeader";
import { translations } from "./translations";

vi.mock("@/components/ThemeProvider", () => ({
	useTheme: () => ({ theme: "classic", setTheme: vi.fn() }),
}));
vi.mock("./HelpModal", () => ({ HelpModal: () => null }));
vi.mock("./LanguageSwitcher", () => ({ LanguageSwitcher: () => null }));

const props = {
	title: "Conflict Bars",
	subtitle: "Hip-hop alongside historical context",
	themeToggle: translations.en.themeToggle,
	lang: "en" as const,
	nav: { href: "/en/bubble", label: "Bubble view" },
};

describe("TimelineHeader layouts", () => {
	it("preserves the sticky title header by default", () => {
		const html = renderToStaticMarkup(<TimelineHeader {...props} />);
		expect(html).toContain("control-bar sticky");
		expect(html).toContain("<h1");
		expect(html).toContain("Conflict Bars");
	});

	it("uses a compact non-sticky utility row when requested", () => {
		const html = renderToStaticMarkup(<TimelineHeader {...props} compact />);
		expect(html).toContain('class="pass-it-on-utility-row"');
		expect(html).not.toContain("control-bar sticky");
		expect(html).not.toContain("<h1");
	});
});
