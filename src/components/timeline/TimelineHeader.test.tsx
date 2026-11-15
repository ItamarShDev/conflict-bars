import { readFileSync } from "node:fs";
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

const props = {
	title: "חרוזים מסוכסכים",
	subtitle: "היפ־הופ לצד הקשר היסטורי",
	themeToggle: translations.he.themeToggle,
	lang: "he" as const,
	nav: { href: "/he/bubble", label: "תרשים" },
};
const headerStyles = readFileSync(
	new URL("../../app/globals.css", import.meta.url),
	"utf8",
);

beforeEach(() => {
	themeMock.value = "classic";
	themeMock.setTheme.mockClear();
});

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

	it("exposes the current light theme as a labeled switch", () => {
		themeMock.value = "classic";
		const html = renderToStaticMarkup(<TimelineHeader {...props} compact />);
		expect(html).toContain('role="switch" aria-checked="false"');
		expect(html).toContain('aria-label="מצב כהה"');
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
		expect(html).not.toContain("pass-it-on-language-switcher");
		expect(html).not.toContain('href="/en');
	});

	it("aligns the compact header controls to one accessible outer height", () => {
		const sharedControlRule = headerStyles.match(
			/\.pass-it-on \.pass-it-on-utility-button,\s*\.pass-it-on \.pass-it-on-theme-switch,\s*\.pass-it-on \.pass-it-on-theme-track\s*\{([^}]+)\}/,
		)?.[1];

		expect(sharedControlRule).toContain("height: 3rem;");
		expect(sharedControlRule).toContain("min-height: 3rem;");
	});
});
