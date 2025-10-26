import type { ConvexEvent, EventsTimeline } from "../../timeline/types";
import { eventColor } from "./colors";

export function convertConvexEventToTimeline(
	event: ConvexEvent,
): EventsTimeline {
	return {
		time: {
			start: event.start,
			end: event.end,
		},
		conflict: {
			title: event.title,
			title_he: event.title_he,
			reason: event.reason,
			reason_he: event.reason_he,
			description: event.description,
			description_he: event.description_he,
			effects: event.effects,
			effects_he: event.effects_he,
			wikipedia_url: event.wikipedia_url,
		},
	};
}

export function convertConvexEventsToTimeline(
	events: ConvexEvent[],
): EventsTimeline[] {
	return events.map(convertConvexEventToTimeline);
}

// Build a mapping from year -> array of muted colors for events active in that year
export function buildYearEventColors(
	events: EventsTimeline[],
): Record<number, string[]> {
	const map: Record<number, string[]> = {};
	const currentYear = new Date().getFullYear();
	for (const e of events) {
		const start = new Date(e.time.start).getFullYear();
		const end = e.time.end ? new Date(e.time.end).getFullYear() : currentYear;
		const title = e.conflict?.title ?? e.time.start;
		const color = eventColor(title, e.time.start);
		for (let y = start; y <= end; y++) {
			if (!map[y]) map[y] = [];
			// Avoid duplicates if multiple events hash to same color for a year
			if (!map[y].includes(color)) {
				map[y].push(color);
			}
		}
	}
	return map;
}
