import { describe, expect, it } from "vitest";
import type { EventsTimeline, FileSong } from "../../timeline/types";
import {
	filterYearGroups,
	getCatalogStats,
	getEntriesByYear,
} from "./timeline";

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

const archiveSongs: FileSong[] = [
	{ ...song, name: "First 2008 song", published_date: "2008-02-01" },
	{ ...song, name: "Second 2008 song", published_date: "2008-11-01" },
	{
		...song,
		name: "Song without a historical note",
		published_date: "2012-06-15",
	},
];

const archiveEvents: EventsTimeline[] = [
	{
		time: { start: "1991-06-01", end: "1993-09-13" },
		conflict: { title: "Event-only year", reason: "A sourced reason." },
	},
	{
		time: { start: "2008-05-06", end: "2008-12-02" },
		conflict: { title: "First 2008 event", reason: "A sourced reason." },
	},
	{
		time: { start: "2008-07-04", end: "2009-03-10" },
		conflict: { title: "Second 2008 event", reason: "Another sourced reason." },
	},
];

describe("timeline archive grouping", () => {
	const yearGroups = getEntriesByYear(archiveSongs, archiveEvents);

	it("groups the union of song years and event start years", () => {
		expect(yearGroups.map(([year]) => year)).toEqual([1991, 2008, 2012]);
		const eventOnly = yearGroups.find(([year]) => year === 1991)?.[1] ?? [];
		const songOnly = yearGroups.find(([year]) => year === 2012)?.[1] ?? [];
		expect(eventOnly.every((entry) => entry.type === "conflict")).toBe(true);
		expect(songOnly.every((entry) => entry.type === "song")).toBe(true);
	});

	it("keeps every song and event in the same year", () => {
		const entries = yearGroups.find(([year]) => year === 2008)?.[1] ?? [];
		expect(entries.filter((entry) => entry.type === "song")).toHaveLength(2);
		expect(entries.filter((entry) => entry.type === "conflict")).toHaveLength(
			2,
		);
	});

	it("files events under their start year while preserving full date ranges", () => {
		const entries = yearGroups.find(([year]) => year === 2008)?.[1] ?? [];
		const eventEntries = entries.filter((entry) => entry.type === "conflict");
		expect(eventEntries.map((entry) => entry.year)).toEqual([2008, 2008]);
		expect(
			eventEntries.map((entry) => [
				entry.conflictEntry.startDate.toISOString().slice(0, 10),
				entry.conflictEntry.endDate?.toISOString().slice(0, 10),
			]),
		).toEqual([
			["2008-05-06", "2008-12-02"],
			["2008-07-04", "2009-03-10"],
		]);
	});

	it("filters only songs before adding historical events", () => {
		const filtered = getEntriesByYear(
			archiveSongs,
			archiveEvents,
			"first 2008 song",
		);
		const matchingYear = filtered.find(([year]) => year === 2008)?.[1] ?? [];
		expect(matchingYear.filter((entry) => entry.type === "song")).toHaveLength(
			1,
		);
		expect(
			matchingYear.filter((entry) => entry.type === "conflict"),
		).toHaveLength(2);
		expect(filtered.map(([year]) => year)).toEqual([1991, 2008]);
	});

	it("keeps historical years visible when no song matches", () => {
		const filtered = getEntriesByYear(archiveSongs, archiveEvents, "no match");
		expect(filtered.map(([year]) => year)).toEqual([1991, 2008]);
		expect(
			filtered
				.flatMap(([, entries]) => entries)
				.every((entry) => entry.type === "conflict"),
		).toBe(true);
	});

	it("removes empty year groups for Music and History views", () => {
		expect(filterYearGroups(yearGroups, "all").map(([year]) => year)).toEqual([
			1991, 2008, 2012,
		]);
		expect(filterYearGroups(yearGroups, "music").map(([year]) => year)).toEqual(
			[2008, 2012],
		);
		expect(
			filterYearGroups(yearGroups, "history").map(([year]) => year),
		).toEqual([1991, 2008]);
		expect(
			filterYearGroups(yearGroups, "music").every(([, entries]) =>
				entries.every((entry) => entry.type === "song"),
			),
		).toBe(true);
		expect(
			filterYearGroups(yearGroups, "history").every(([, entries]) =>
				entries.every((entry) => entry.type === "conflict"),
			),
		).toBe(true);
	});

	it("returns a safe empty range for an empty catalog", () => {
		expect(getCatalogStats([])).toEqual({
			songCount: 0,
			artistCount: 0,
			startYear: null,
			endYear: null,
		});
		expect(getCatalogStats(archiveSongs)).toMatchObject({
			songCount: 3,
			startYear: 2008,
			endYear: 2012,
		});
	});

	it("keeps date-only catalog years in UTC and ignores invalid placeholders", () => {
		const stats = getCatalogStats([
			{ ...song, published_date: "2019-12-31" },
			{ ...song, name: "New year", published_date: "2020-01-01" },
			{ ...song, name: "Decade placeholder", published_date: "2020s" },
			{ ...song, name: "Invalid date", published_date: "2020-99-01" },
		]);
		expect(stats).toMatchObject({
			songCount: 4,
			startYear: 2019,
			endYear: 2020,
		});
	});
});
