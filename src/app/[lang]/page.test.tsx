import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { israeliConflicts } from "../../../timeline/conflicts";
import type { EventsTimeline } from "../../../timeline/types";
import TimelinePage from "./page";

vi.mock("@/components/timeline/Timeline", () => ({
	Timeline: ({ events }: { events: EventsTimeline[] }) => (
		<div
			data-event-count={events.length}
			data-first-conflict={events[0]?.conflict?.title}
		/>
	),
}));
vi.mock("@/utils/file-songs", () => ({ loadFileSongs: () => [] }));
vi.mock("@/utils/locale", () => ({ requireLocale: () => undefined }));

describe("timeline page data source", () => {
	it("passes the checked-in conflict file directly to the timeline", async () => {
		const page = await TimelinePage({
			params: Promise.resolve({ lang: "en" }),
		});
		const html = renderToStaticMarkup(page);

		expect(html).toContain(`data-event-count="${israeliConflicts.length}"`);
		expect(html).toContain(
			`data-first-conflict="${israeliConflicts[0].conflict?.title}"`,
		);
	});
});
