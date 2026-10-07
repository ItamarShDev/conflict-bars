import { describe, expect, it } from "vitest";
import type { FileSong } from "../../timeline/types";
import { getEntriesByYear } from "./timeline";

const song: FileSong = {
	name: "Test song",
	artist: "Test artist",
	published_date: "2020",
	full_lyrics: { hebrew: "טקסט לבדיקה", english_translation: "Second verse" },
};

describe("full lyrics search", () => {
	it.each(["טקסט", " SECOND VERSE "])(
		"matches text in either language: %s",
		(query) => {
			const entries = getEntriesByYear([song], [], query);
			expect(entries).toHaveLength(1);
			expect(entries[0][1][0].song).toEqual(song);
		},
	);

	it("does not match unrelated text and keeps songs without lyrics searchable", () => {
		expect(getEntriesByYear([song], [], "absent")).toHaveLength(0);
		expect(
			getEntriesByYear([{ ...song, full_lyrics: undefined }], [], "Test song"),
		).toHaveLength(1);
	});
});
