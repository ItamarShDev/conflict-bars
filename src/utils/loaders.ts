import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { ConvexEvent, Song } from "../../timeline/types";

const convexUrl =
	import.meta.env.VITE_CONVEX_URL || "https://affable-lemur-532.convex.cloud";
const client = new ConvexHttpClient(convexUrl);

export interface TimelineData {
	songs: Song[];
	events: ConvexEvent[];
}

export async function loadTimelineData(): Promise<TimelineData> {
	try {
		const [songs, events] = await Promise.all([
			client.query(api.songs.getAllSongs),
			client.query(api.events.getAllEvents),
		]);

		return {
			songs: songs || [],
			events: events || [],
		};
	} catch (error) {
		console.error("Failed to load timeline data:", error);
		return {
			songs: [],
			events: [],
		};
	}
}
