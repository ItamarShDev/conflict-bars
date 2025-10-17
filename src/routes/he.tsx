import { createFileRoute } from "@tanstack/react-router";
import { Timeline } from "@/components/timeline/Timeline";
import { loadTimelineData } from "@/utils/loaders";

export const Route = createFileRoute("/he")({
	loader: async () => {
		return loadTimelineData();
	},
	component: TimelinePage,
});

function TimelinePage() {
	const data = Route.useLoaderData();
	return <Timeline lang="he" initialData={data} />;
}
