import { describe, expect, it } from "vitest";
import { israeliConflicts } from "../../../timeline/conflicts";
import { getConflictBands } from "./conflict-bands";

describe("conflict chart bands", () => {
	it("preserves dated events and supplies a Hebrew title when missing", () => {
		const bands = getConflictBands();
		const validConflicts = israeliConflicts.filter((entry) => {
			const start = new Date(entry.time.start).getTime();
			const end = entry.time.end
				? new Date(entry.time.end).getTime()
				: Date.now();
			return !Number.isNaN(start) && !Number.isNaN(end);
		});
		expect(bands).toHaveLength(validConflicts.length);

		const event = israeliConflicts.find((entry) =>
			Number.isFinite(new Date(entry.time.start).getTime()),
		);
		if (!event) throw new Error("Expected at least one dated conflict event");
		const [fallbackBand] = getConflictBands([
			{ ...event, conflict: undefined },
		]);
		expect(fallbackBand?.title).toBe("אירוע היסטורי");
	});

	it("returns no bands for empty or invalid date data", () => {
		expect(getConflictBands([])).toEqual([]);

		const event = israeliConflicts[0];
		expect(
			getConflictBands([
				{
					...event,
					time: { ...event.time, start: "not-a-date" },
				},
			]),
		).toEqual([]);
	});
});
