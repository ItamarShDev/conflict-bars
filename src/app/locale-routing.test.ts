import { describe, expect, it } from "vitest";
import { requireLocale } from "@/utils/locale";
import nextConfig from "../../next.config";

describe("locale routing", () => {
	it("redirects the root to Hebrew without blocking English routes", async () => {
		const redirects = (await nextConfig.redirects?.()) ?? [];
		expect(redirects).toContainEqual({
			source: "/",
			destination: "/he",
			permanent: false,
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
