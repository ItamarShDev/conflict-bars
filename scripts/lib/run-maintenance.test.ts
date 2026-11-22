import { execFileSync } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runMaintenance, toConvexLyricSample } from "./run-maintenance";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));
afterEach(() => {
	vi.unstubAllEnvs();
	vi.clearAllMocks();
});
describe("authenticated maintenance runner", () => {
	it("keeps lyric text but excludes file-only language metadata from Convex arguments", () => {
		const lyricText = {
			arabic: "أصل",
			hebrew: "מקור",
			english_translation: "Original",
		};
		expect(
			toConvexLyricSample({ ...lyricText, original_language: "ar" }),
		).toStrictEqual(lyricText);
		expect(toConvexLyricSample(undefined)).toBeUndefined();
	});
	it("pins writes to the read deployment without passing credentials as arguments", async () => {
		vi.stubEnv(
			"NEXT_PUBLIC_CONVEX_URL",
			"https://example-test-123.convex.cloud",
		);
		vi.mocked(execFileSync).mockReturnValue('"event-id"');
		await expect(
			runMaintenance("insertEvent", {
				title: "Event",
				start: "2000-01-01",
				reason: "Reason",
			}),
		).resolves.toBe("event-id");
		expect(execFileSync).toHaveBeenCalledWith(
			"npx",
			[
				"convex",
				"run",
				"--deployment",
				"example-test-123",
				"--codegen",
				"disable",
				"mutations:insertEvent",
				JSON.stringify({
					title: "Event",
					start: "2000-01-01",
					reason: "Reason",
				}),
			],
			expect.any(Object),
		);
	});
	it("rejects unsupported targets before invoking the CLI", async () => {
		vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "https://example.com");
		await expect(runMaintenance("clearAllSongs", {})).rejects.toThrow(
			"hosted NEXT_PUBLIC_CONVEX_URL",
		);
		expect(execFileSync).not.toHaveBeenCalled();
	});
});
