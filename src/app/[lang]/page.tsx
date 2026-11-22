import { preloadQuery } from "convex/nextjs";
import { Timeline } from "@/components/timeline/Timeline";
import { loadFileSongs } from "@/utils/file-songs";
import { requireLocale } from "@/utils/locale";
import { api } from "../../../convex/_generated/api";

export default async function TimelinePage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	requireLocale(lang);
	const songs = loadFileSongs();

	const convexEvents = await preloadQuery(api.events.getAllEvents);
	return <Timeline lang={lang} songs={songs} convexEvents={convexEvents} />;
}
