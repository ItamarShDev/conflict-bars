import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import Image, { alt } from "./opengraph-image";
import TwitterImage from "./twitter-image";

vi.mock("next/og", () => ({
	ImageResponse: class {
		element: unknown;
		options: unknown;

		constructor(element: unknown, options: unknown) {
			this.element = element;
			this.options = options;
		}
	},
}));

function getText(node: ReactNode): string {
	if (node === null || node === undefined || typeof node === "boolean") {
		return "";
	}
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}
	if (Array.isArray(node)) return node.map(getText).join("");
	if (isValidElement(node)) {
		return getText((node.props as { children?: ReactNode }).children);
	}
	return "";
}

afterEach(() => vi.unstubAllGlobals());

describe("Hebrew social image route", () => {
	it("renders Hebrew-only Open Graph content and backs the Twitter route", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL) => {
				if (String(input).includes("fonts.googleapis.com")) {
					return new Response(
						"src: url(https://fonts.test/heebo.ttf) format('truetype')",
					);
				}
				return new Response(new Uint8Array([0, 1, 2]));
			}),
		);

		const response = await Image({ params: Promise.resolve({ lang: "he" }) });
		const element = (response as unknown as { element: ReactElement }).element;
		const text = getText(element);
		const markup = renderToStaticMarkup(element);

		expect(alt).toContain("ציר זמן אינטראקטיבי");
		expect(text).toMatch(/[\u0590-\u05ff]/);
		expect(text).toContain("www.conflictbars.org/he");
		expect(text).toContain("1987");
		expect(text).toContain("2025");
		expect(text).not.toMatch(/\b(?:Conflict|Israeli|Scene|Song|Context)\b/);
		expect(markup).toContain('lang="he" dir="rtl"');
		expect(markup).toContain("<svg");
		expect(markup).toContain("#0e0c0a");
		expect(TwitterImage).toBe(Image);
	});

	it("serves the English social-image route with the same artwork", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL) => {
				if (String(input).includes("fonts.googleapis.com")) {
					return new Response(
						"src: url(https://fonts.test/heebo.ttf) format('truetype')",
					);
				}
				return new Response(new Uint8Array([0, 1, 2]));
			}),
		);
		const response = await Image({ params: Promise.resolve({ lang: "en" }) });
		expect(
			(response as unknown as { element: ReactElement }).element,
		).toBeTruthy();
	});

	it("rejects unsupported locales at runtime", async () => {
		await expect(
			Image({ params: Promise.resolve({ lang: "fr" }) }),
		).rejects.toThrow();
	});
});
