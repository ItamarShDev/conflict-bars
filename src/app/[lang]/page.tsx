import { Timeline } from "@/components/timeline/Timeline";
import { loadFileSongs } from "@/utils/file-songs";
import { requireLocale } from "@/utils/locale";
import { israeliConflicts } from "../../../timeline/conflicts";

export default async function TimelinePage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	requireLocale(lang);
	const songs = loadFileSongs();

	return <Timeline lang={lang} songs={songs} events={israeliConflicts} />;
}
