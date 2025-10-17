import { createFileRoute, notFound } from "@tanstack/react-router";
import { Timeline } from "@/components/timeline/Timeline";
import { loadTimelineData } from "@/utils/loaders";

const VALID_LANGS = ["he", "en"] as const;
type ValidLang = (typeof VALID_LANGS)[number];

function isValidLang(lang: string): lang is ValidLang {
	return VALID_LANGS.includes(lang as ValidLang);
}

export const Route = createFileRoute("/$lang")({
	// Validate the lang parameter before loading
	beforeLoad: ({ params }) => {
		if (!isValidLang(params.lang)) {
			throw notFound();
		}
	},
	loader: async () => {
		return loadTimelineData();
	},
	component: TimelinePage,
});

function TimelinePage() {
	const { lang } = Route.useParams();
	const data = Route.useLoaderData();

	// TypeScript knows lang is valid here due to beforeLoad validation
	return <Timeline lang={lang as ValidLang} initialData={data} />;
}
