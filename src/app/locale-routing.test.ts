import { describe, expect, it } from "vitest";
import { requireHebrewLocale } from "@/utils/hebrew-locale";
import nextConfig from "../../next.config";

describe("Hebrew-only locale routing", () => {
	it("declares permanent Hebrew redirects for legacy English routes", async () => {
		const redirects = (await nextConfig.redirects?.()) ?? [];
		expect(redirects).toContainEqual({
			source: "/",
			destination: "/he",
			permanent: false,
		});
		expect(redirects).toContainEqual({
			source: "/en",
			destination: "/he",
			permanent: true,
		});

		const nestedRedirect = redirects.find(
			(redirect) => redirect.source === "/en/:path*",
		);
		expect(nestedRedirect).toMatchObject({
			destination: "/he/:path*",
			permanent: true,
		});
	});

	it("accepts Hebrew and rejects unsupported locale segments", () => {
		expect(() => requireHebrewLocale("he")).not.toThrow();
		expect(() => requireHebrewLocale("en")).toThrow();
		expect(() => requireHebrewLocale("fr")).toThrow();
	});
});
