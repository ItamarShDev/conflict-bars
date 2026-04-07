import { preloadQuery } from "convex/nextjs";
import { Timeline } from "@/components/timeline/Timeline";
import { loadFileSongs } from "@/utils/file-songs";
import { api } from "../../../convex/_generated/api";

export default async function TimelinePage({
	params,
}: {
	params: Promise<{ lang: "en" | "he" }>;
}) {
	const { lang } = await params;
	const songs = loadFileSongs();

	const convexEvents = await preloadQuery(api.events.getAllEvents);
	return <Timeline lang={lang} songs={songs} convexEvents={convexEvents} />;
}
