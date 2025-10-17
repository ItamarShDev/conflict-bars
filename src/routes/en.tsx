import { createFileRoute } from "@tanstack/react-router";
import { Timeline } from "@/components/timeline/Timeline";
import { loadTimelineData } from "@/utils/loaders";

export const Route = createFileRoute("/en")({
	loader: async () => {
		return loadTimelineData();
	},
	component: TimelinePage,
});

function TimelinePage() {
	const data = Route.useLoaderData();
	return <Timeline lang="en" initialData={data} />;
}
