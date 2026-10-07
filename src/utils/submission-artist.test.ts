import { describe, expect, it, vi } from "vitest";
import type { Id } from "../../convex/_generated/dataModel";
import { resolveSubmissionArtist } from "./submission-artist";

const artist = "Teapacks (טיפקס)";
const id = "teapacks-id" as Id<"artists">;
const findArtist = vi.fn().mockResolvedValue(undefined);
const editSong = {
	artist,
	artist_details: {
		era: "1980s–present",
		affiliation: "Unknown",
		notes: "Scene-adjacent pop/hip-hop act.",
	},
};

describe("resolveSubmissionArtist", () => {
	it("reuses a known artist for new submissions and corrections", async () => {
		const upsert = vi.fn();
		const known = new Map([[artist.toLowerCase(), id]]);
		expect(
			await resolveSubmissionArtist(
				artist,
				known,
				undefined,
				findArtist,
				upsert,
			),
		).toBe(id);
		expect(
			await resolveSubmissionArtist(
				artist.toUpperCase(),
				known,
				editSong,
				findArtist,
				upsert,
			),
		).toBe(id);
		expect(upsert).not.toHaveBeenCalled();
	});

	it("rechecks Convex before upserting to preserve an uncached artist", async () => {
		const lookup = vi.fn().mockResolvedValue(id);
		const upsert = vi.fn();
		expect(
			await resolveSubmissionArtist(
				artist,
				new Map(),
				editSong,
				lookup,
				upsert,
			),
		).toBe(id);
		expect(lookup).toHaveBeenCalledWith(artist.toLowerCase());
		expect(upsert).not.toHaveBeenCalled();
	});

	it("upserts an unseeded file artist with its catalog metadata", async () => {
		const upsert = vi.fn().mockResolvedValue(id);
		expect(
			await resolveSubmissionArtist(
				artist,
				new Map(),
				editSong,
				findArtist,
				upsert,
			),
		).toBe(id);
		expect(upsert).toHaveBeenCalledExactlyOnceWith({
			name: artist,
			...editSong.artist_details,
		});
	});

	it("does not create unknown artists for new submissions", async () => {
		const upsert = vi.fn();
		expect(
			await resolveSubmissionArtist(
				artist,
				new Map(),
				undefined,
				findArtist,
				upsert,
			),
		).toBeUndefined();
		expect(upsert).not.toHaveBeenCalled();
	});

	it("does not use a correction to create a different artist", async () => {
		const upsert = vi.fn();
		expect(
			await resolveSubmissionArtist(
				"Other artist",
				new Map(),
				editSong,
				findArtist,
				upsert,
			),
		).toBeUndefined();
		expect(upsert).not.toHaveBeenCalled();
	});

	it("requires catalog metadata before seeding a missing artist", async () => {
		const upsert = vi.fn();
		expect(
			await resolveSubmissionArtist(
				artist,
				new Map(),
				{ artist },
				findArtist,
				upsert,
			),
		).toBeUndefined();
		expect(upsert).not.toHaveBeenCalled();
	});

	it("propagates an upsert failure to the form error handler", async () => {
		const upsert = vi.fn().mockRejectedValue(new Error("Unavailable"));
		await expect(
			resolveSubmissionArtist(artist, new Map(), editSong, findArtist, upsert),
		).rejects.toThrow("Unavailable");
	});
});
