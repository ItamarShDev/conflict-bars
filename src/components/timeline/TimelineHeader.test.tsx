import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TimelineHeader } from "./TimelineHeader";
import { translations } from "./translations";

const themeMock = vi.hoisted(() => ({
	value: "classic" as "classic" | "boombox",
	setTheme: vi.fn(),
}));

vi.mock("@/components/ThemeProvider", () => ({
	useTheme: () => ({ theme: themeMock.value, setTheme: themeMock.setTheme }),
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

beforeEach(() => {
	themeMock.value = "classic";
	themeMock.setTheme.mockClear();
});

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

	it("exposes the current light theme as a labeled switch", () => {
		themeMock.value = "classic";
		const html = renderToStaticMarkup(<TimelineHeader {...props} compact />);
		expect(html).toContain('role="switch" aria-checked="false"');
		expect(html).toContain('aria-label="Dark mode"');
		expect(html).toContain('data-selected-theme="classic"');
		expect(html).toContain("pass-it-on-theme-thumb-icon");
		expect(html).toContain("pass-it-on-theme-track-icon");
		expect(html).not.toContain("Zine");
		expect(html).not.toContain("Boombox");
	});

	it("reflects the persisted dark theme in Hebrew", () => {
		themeMock.value = "boombox";
		const html = renderToStaticMarkup(
			<TimelineHeader
				{...props}
				lang="he"
				themeToggle={translations.he.themeToggle}
				compact
			/>,
		);
		expect(html).toContain('role="switch" aria-checked="true"');
		expect(html).toContain('aria-label="מצב כהה"');
		expect(html).toContain('data-selected-theme="boombox"');
	});
});
