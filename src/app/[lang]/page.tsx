import { preloadQuery } from "convex/nextjs";
import { Timeline } from "@/components/timeline/Timeline";
import { api } from "../../../convex/_generated/api";

export default async function TimelinePage({
	params,
}: {
	params: Promise<{ lang: "en" | "he" }>;
}) {
	const { lang } = await params;
	const songs = await preloadQuery(api.songs.getAllSongs);

	const convexEvents = await preloadQuery(api.events.getAllEvents);
	return (
		<Timeline lang={lang} preloadedSongs={songs} convexEvents={convexEvents} />
	);
}
