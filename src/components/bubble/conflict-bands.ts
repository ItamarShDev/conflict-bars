import { translations } from "@/components/timeline/translations";
import { israeliConflicts } from "../../../timeline/conflicts";
import type { ConflictBand } from "./chart-data";

function toFractionalYear(iso: string): number {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return Number.NaN;
	return date.getFullYear() + date.getMonth() / 12;
}

export function getConflictBands(conflicts = israeliConflicts): ConflictBand[] {
	const currentYear = new Date().getFullYear() + 1;
	return conflicts
		.map((entry) => {
			const start = toFractionalYear(entry.time.start);
			const end = entry.time.end
				? toFractionalYear(entry.time.end)
				: currentYear;
			const title =
				entry.conflict?.title_he?.trim() ||
				translations.he.passItOn.eventTitleFallback;
			if (Number.isNaN(start) || Number.isNaN(end)) return null;
			const label = title.split(" (")[0];
			return { start, end, label, title };
		})
		.filter((band): band is ConflictBand => band !== null);
}
