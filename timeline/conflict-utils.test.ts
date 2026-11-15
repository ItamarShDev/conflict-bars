import { describe, expect, it } from "vitest";
import { parseConflictsForTimeline } from "./conflict-utils";

describe("legacy event dates", () => {
	it("skips invalid starts, ends, and reversed ranges without losing valid events", () => {
		const dates = [
			{ start: "invalid" },
			{ start: "2000-01-01", end: "invalid" },
			{ start: "2000-01-01", end: "1999-01-01" },
			{ start: "2000-01-01" },
			{ start: "2001-01-01", end: "2001-03-01" },
		];
		const entries = parseConflictsForTimeline(
			dates.map((time) => ({
				time,
				conflict: { title: "Event", reason: "Reason" },
			})),
		);
		expect(entries).toHaveLength(2);
		expect(entries.map((e) => e.startDate.toISOString())).toEqual([
			"2000-01-01T00:00:00.000Z",
			"2001-01-01T00:00:00.000Z",
		]);
	});
});
