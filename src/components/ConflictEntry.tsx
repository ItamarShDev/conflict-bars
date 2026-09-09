import type { CSSProperties } from "react";
import { translations } from "@/components/timeline/translations";
import { eventColor } from "@/utils/colors";
import type { ConflictEntry as ConflictEntryType } from "../../timeline/conflict-utils";
import { ConflictDetail } from "./conflict/ConflictDetail";
import { ConflictHeader } from "./conflict/ConflictHeader";
import { ConflictLinks } from "./conflict/ConflictLinks";
import { ConflictReason } from "./conflict/ConflictReason";
import { ConflictTimestamp } from "./conflict/ConflictTimestamp";

export type ConflictTranslations = {
	conflict: string;
	reason: string;
	lang: "en" | "he";
	wikipedia: string;
	description: string;
	effects: string;
};

interface ConflictTimelineEntryProps {
	conflict: ConflictEntryType;
	lang: "en" | "he";
}

export function ConflictEntry({ conflict, lang }: ConflictTimelineEntryProps) {
	const t = translations[lang];
	const title =
		lang === "he" && conflict.title_he ? conflict.title_he : conflict.title;
	const reason =
		lang === "he" && conflict.reason_he ? conflict.reason_he : conflict.reason;
	const description =
		lang === "he" && conflict.description_he
			? conflict.description_he
			: conflict.description;
	const effects =
		lang === "he" && conflict.effects_he
			? conflict.effects_he
			: conflict.effects;

	const color = eventColor(conflict.title, conflict.song.published_date);

	return (
		<div
			className="boombox-conflict-card event-card relative z-1 p-4 pt-5 text-(--color-conflict-foreground) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) sm:p-5 sm:pt-6 text-start"
			style={{ "--event-color": color } as CSSProperties}
		>
			<div className="flex gap-2 items-start h-full sm:gap-3">
				<div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
					<div>
						<div className="mb-2 flex items-center justify-between gap-2">
							<span className="event-card-label">{t.eventLabel}</span>
							<ConflictTimestamp timestamp={conflict.timestamp} />
						</div>
						<ConflictHeader title={title} />
						<ConflictReason reason={reason} />
					</div>
					{(description || effects) && (
						<div className="space-y-2 border-t border-(--color-conflict-border) pt-2 text-start sm:space-y-3">
							{description && (
								<ConflictDetail label={t.description} content={description} />
							)}
							{effects && (
								<ConflictDetail label={t.effects} content={effects} />
							)}
						</div>
					)}
					<div className="border-t border-(--color-conflict-border) pt-2">
						<ConflictLinks
							wikipediaUrl={conflict.wikipedia_url}
							wikipediaLabel={t.wikipedia}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
