import { describe, expect, it } from "vitest";
import { loadFileSongs } from "@/utils/file-songs";
import { solutionAspirationAnnotations } from "../../../timeline/solution-aspiration";
import { buildResolutionChartData, solutionKey } from "./solution-chart-data";

describe("buildResolutionChartData", () => {
	it("matches every catalog song to its annotation", () => {
		const songs = loadFileSongs();
		const data = buildResolutionChartData(songs);

		expect(data.totals.songs).toBe(songs.length);
		expect(data.totals.songs).toBe(
			Object.keys(solutionAspirationAnnotations).length,
		);
		expect(
			data.basisCounts.full_lyrics +
				data.basisCounts.partial_lyrics +
				data.basisCounts.catalog_excerpt,
		).toBe(data.totals.songs);
	});

	it("keeps explicit two-state songs inside the broader positive count", () => {
		const data = buildResolutionChartData(loadFileSongs());

		expect(data.totals.explicit).toBeGreaterThan(0);
		expect(data.totals.positive).toBeGreaterThan(data.totals.explicit);
		expect(
			data.cells
				.flat()
				.every((cell) => cell.explicit.length <= cell.positive.length),
		).toBe(true);
	});

	it("uses the same normalized key shape as the generation script", () => {
		expect(
			solutionKey({
				artist: "Hadag Nahash (הדג נחש)",
				name: "מספרים (Misparim / Numbers)",
			}),
		).toBe("hadag nahash (הדג נחש)::מספרים (misparim / numbers)");
	});
});
