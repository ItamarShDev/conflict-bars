import { describe, expect, it } from "vitest";
import { requireLocale } from "@/utils/locale";
import nextConfig from "../../next.config";

describe("locale routing", () => {
	it("serves Hebrew at the root and redirects /he to it", async () => {
		const redirects = (await nextConfig.redirects?.()) ?? [];
		const rewrites = (await nextConfig.rewrites?.()) ?? [];
		expect(redirects).toContainEqual({
			source: "/he",
			destination: "/",
			permanent: true,
		});
		expect(rewrites).toContainEqual({
			source: "/",
			destination: "/he",
		});
		expect(
			redirects.find((redirect) => redirect.source.startsWith("/en")),
		).toBeUndefined();
	});

	it("accepts Hebrew and English and rejects unsupported locale segments", () => {
		expect(() => requireLocale("he")).not.toThrow();
		expect(() => requireLocale("en")).not.toThrow();
		expect(() => requireLocale("fr")).toThrow();
	});
});
