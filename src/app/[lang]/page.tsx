import { preloadQuery } from "convex/nextjs";
import { Timeline } from "@/components/timeline/Timeline";
import { loadFileSongs } from "@/utils/file-songs";
import { requireHebrewLocale } from "@/utils/hebrew-locale";
import { api } from "../../../convex/_generated/api";

export default async function TimelinePage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	requireHebrewLocale(lang);
	const songs = loadFileSongs();

	const convexEvents = await preloadQuery(api.events.getAllEvents);
	return <Timeline lang={lang} songs={songs} convexEvents={convexEvents} />;
}
