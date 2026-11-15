import { describe, expect, it, vi } from "vitest";

vi.mock("./_generated/server", () => ({
	mutation: (definition: object) => ({ ...definition, visibility: "public" }),
	internalMutation: (definition: object) => ({
		...definition,
		visibility: "internal",
	}),
}));

import * as mutations from "./mutations";

type TestMutation = {
	visibility: string;
	handler: (ctx: unknown, args: unknown) => Promise<unknown>;
};
const functions = mutations as unknown as Record<string, TestMutation>;

describe("mutation access boundary", () => {
	it("exposes only the limited visitor submission operations", () => {
		expect(
			Object.entries(functions)
				.filter(([, fn]) => fn.visibility === "public")
				.map(([name]) => name)
				.sort(),
		).toEqual(["ensureSubmissionArtist", "submitSongEditSuggestion"]);
	});
	it("never modifies an existing artist from a visitor request", async () => {
		const first = vi
			.fn()
			.mockResolvedValue({ _id: "artist1", name: "Original" });
		const ctx = {
			db: {
				query: () => ({ withIndex: () => ({ first }) }),
				patch: vi.fn(),
				insert: vi.fn(),
			},
		};
		expect(
			await functions.ensureSubmissionArtist.handler(ctx, { name: "Original" }),
		).toBe("artist1");
		expect(ctx.db.patch).not.toHaveBeenCalled();
		expect(ctx.db.insert).not.toHaveBeenCalled();
	});
	it.each([
		{ start: "bad" },
		{ start: "2000-01-01", end: "bad" },
		{ start: "2000-01-01", end: "1999-01-01" },
	])("rejects malformed event ranges before writing: %j", async (args) => {
		const ctx = { db: { insert: vi.fn() } };
		await expect(functions.insertEvent.handler(ctx, args)).rejects.toThrow(
			"Invalid event date range",
		);
		expect(ctx.db.insert).not.toHaveBeenCalled();
	});
	it("accepts a valid event range", async () => {
		const ctx = { db: { insert: vi.fn().mockResolvedValue("event1") } };
		await expect(
			functions.insertEvent.handler(ctx, {
				start: "2000-01-01",
				end: "2000-02-01",
				title: "Event",
				reason: "Reason",
			}),
		).resolves.toBe("event1");
	});
	it("keeps visitor songs unpublished", async () => {
		const insert = vi
			.fn()
			.mockResolvedValueOnce("user1")
			.mockResolvedValueOnce("song1");
		const ctx = {
			db: {
				query: () => ({ withIndex: () => ({ first: async () => null }) }),
				insert,
			},
		};
		await functions.submitSongEditSuggestion.handler(ctx, {
			userEmail: "test@example.com",
			suggestion: { name: "Song", published_date: "2000", artistId: "artist1" },
		});
		expect(insert).toHaveBeenLastCalledWith(
			"songs",
			expect.objectContaining({ published: false }),
		);
	});
});
