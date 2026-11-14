import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "./LanguageSwitcher";

const pathnameMock = vi.hoisted(() => ({ value: "/en/bubble" }));

vi.mock("next/navigation", () => ({
	usePathname: () => pathnameMock.value,
}));

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: {
		href: string;
		children: ReactNode;
		className?: string;
		"aria-label"?: string;
		title?: string;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

describe("LanguageSwitcher", () => {
	it("preserves the route suffix and highlights English", () => {
		pathnameMock.value = "/en/bubble";
		const html = renderToStaticMarkup(<LanguageSwitcher lang="en" />);

		expect(html).toContain('href="/he/bubble"');
		expect(html).toContain('aria-label="Switch language to Hebrew"');
		expect(html).toContain('title="Switch language to Hebrew"');
		expect(html).toContain(
			'class="pass-it-on-language-option is-current h-11 w-11"',
		);
		expect(html).toContain("<svg");
		expect((html.match(/aria-hidden="true"/g) ?? []).length).toBe(2);
		expect(html).toContain("h-11 w-11");
		expect(html).not.toContain("English / עברית");
	});

	it("targets English from the Hebrew root with localized labeling", () => {
		pathnameMock.value = "/he";
		const html = renderToStaticMarkup(<LanguageSwitcher lang="he" />);

		expect(html).toContain('href="/en"');
		expect(html).toContain('aria-label="החלפת שפה לאנגלית"');
		expect(html).toContain('title="החלפת שפה לאנגלית"');
		expect(html).toContain('<legend class="sr-only">בחירת שפה</legend>');
	});
});
