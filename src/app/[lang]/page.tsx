import { Timeline } from "@/components/timeline/Timeline";

export default async function TimelinePage({
	params,
}: {
	params: Promise<{ lang: "en" | "he" }>;
}) {
	const { lang } = await params;
	return <Timeline lang={lang} />;
}
