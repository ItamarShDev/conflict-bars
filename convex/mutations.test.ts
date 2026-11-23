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
		).toEqual(["submitSongEditSuggestion", "upsertArtist"]);
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
			await functions.upsertArtist.handler(ctx, {
				name: "Original",
				affiliation: "overwrite attempt",
				notes: "overwrite attempt",
			}),
		).toBe("artist1");
		expect(ctx.db.patch).not.toHaveBeenCalled();
		expect(ctx.db.insert).not.toHaveBeenCalled();
	});
	it("accepts legacy metadata without trusting it when creating an artist", async () => {
		const insert = vi.fn().mockResolvedValue("artist2");
		const ctx = {
			db: {
				query: () => ({ withIndex: () => ({ first: async () => null }) }),
				insert,
			},
		};
		await expect(
			functions.upsertArtist.handler(ctx, {
				name: " Artist ",
				name_he: "legacy",
				name_en: "legacy",
				era: "legacy",
				affiliation: "legacy",
				notes: "legacy",
			}),
		).resolves.toBe("artist2");
		expect(insert).toHaveBeenCalledWith("artists", {
			name: "Artist",
			normalized_name: "artist",
		});
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
			suggestion: {
				name: "Song",
				published_date: "2000",
				artistId: "artist1",
				lyric_sample: { hebrew: "שורה משיר" },
				links: { lyrics: "https://genius.com/song-lyrics" },
			},
		});
		expect(insert).toHaveBeenLastCalledWith(
			"songs",
			expect.objectContaining({ published: false }),
		);
	});
	it.each([
		{
			name: "Song",
			published_date: "2000",
			artistId: "artist1",
			links: { lyrics: "https://genius.com/song-lyrics" },
		},
		{
			name: "Song",
			published_date: "2000",
			artistId: "artist1",
			lyric_sample: { hebrew: "שורה משיר" },
		},
		{ name: "Song", published_date: "2000", artistId: "artist1" },
	])(
		"rejects new songs without a sourced lyric excerpt: %j",
		async (suggestion) => {
			const ctx = {
				db: {
					query: () => ({ withIndex: () => ({ first: async () => null }) }),
					insert: vi.fn().mockResolvedValue("user1"),
				},
			};
			await expect(
				functions.submitSongEditSuggestion.handler(ctx, {
					userEmail: "test@example.com",
					suggestion,
				}),
			).rejects.toThrow("sourced lyric excerpt");
		},
	);
});
