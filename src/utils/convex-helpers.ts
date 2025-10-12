import type { ConvexEvent, EventsTimeline } from "../../timeline/types";

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
