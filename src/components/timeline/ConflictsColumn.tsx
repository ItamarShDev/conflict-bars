import { ConflictEntry } from "@/components/ConflictEntry";
import type { TimelineEntryItem } from "@/utils/timeline";

interface ConflictsColumnProps {
	conflicts: TimelineEntryItem[];
	lang: "en" | "he";
}

export function ConflictsColumn({ conflicts, lang }: ConflictsColumnProps) {
	const conflictItems = conflicts.filter((e) => e.type === "conflict");

	if (conflictItems.length === 0) {
		return null;
	}

	return (
		<div
			className={`col-span-full min-w-0 sm:col-span-1 sm:col-start-3 sm:order-3 ${lang === "he" ? "ms-0 me-2 sm:me-6" : "me-0 ms-2 sm:ms-6"}`}
		>
			{conflictItems.map((conflictEntry) => {
				const conflictDetails = conflictEntry.conflictEntry;
				if (!conflictDetails) {
					return null;
				}
				return (
					<div
						key={conflictDetails.id}
						data-conflict-id={conflictDetails.id}
						className="mb-4 sm:mb-6"
					>
						<ConflictEntry conflict={conflictDetails} lang={lang} />
					</div>
				);
			})}
		</div>
	);
}
