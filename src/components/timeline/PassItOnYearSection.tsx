import type { Ref } from "react";
import { SongEntry } from "@/components/timeline/SongEntry";
import type { translations } from "@/components/timeline/translations";
import type { TimelineEntryItem, TimelineView } from "@/utils/timeline";

type PageTranslations = (typeof translations)["en"];

function localizedText(lang: "en" | "he", english?: string, hebrew?: string) {
	return lang === "he" ? hebrew?.trim() || english?.trim() : english?.trim();
}

function EventDetails({
	entry,
	lang,
	labels,
}: {
	entry: Extract<TimelineEntryItem, { type: "conflict" }>;
	lang: "en" | "he";
	labels: PageTranslations;
}) {
	const { conflict, conflictEntry } = entry;
	const title = localizedText(lang, conflict.title, conflict.title_he);
	const start = conflictEntry.startDate.toISOString().slice(0, 10);
	const end = conflictEntry.endDate?.toISOString().slice(0, 10);
	const filedUnder = labels.passItOn.filedUnder.replace(
		"{{year}}",
		String(entry.year),
	);

	return (
		<details className="pass-it-on-event-disclosure">
			<summary className="pass-it-on-event-summary">
				<span className="pass-it-on-event-tape" aria-hidden="true" />
				<span className="pass-it-on-event-heading">
					<strong lang={lang} dir={lang === "he" ? "rtl" : "ltr"}>
						{title}
					</strong>
					<span className="pass-it-on-event-dates" dir="ltr">
						<time dateTime={conflictEntry.startDate.toISOString()}>
							{start}
						</time>
						{end && (
							<>
								<span aria-hidden="true">–</span>
								<time dateTime={conflictEntry.endDate?.toISOString()}>
									{end}
								</time>
							</>
						)}
					</span>
				</span>
				<span className="pass-it-on-disclosure-mark" aria-hidden="true" />
			</summary>
			<div className="pass-it-on-event-content">
				<p className="pass-it-on-filed-under">{filedUnder}</p>
				{localizedText(lang, conflict.reason, conflict.reason_he) && (
					<div>
						<h4>{labels.reason}</h4>
						<p>{localizedText(lang, conflict.reason, conflict.reason_he)}</p>
					</div>
				)}
				{localizedText(lang, conflict.description, conflict.description_he) && (
					<div>
						<h4>{labels.description}</h4>
						<p>
							{localizedText(
								lang,
								conflict.description,
								conflict.description_he,
							)}
						</p>
					</div>
				)}
				{localizedText(lang, conflict.effects, conflict.effects_he) && (
					<div>
						<h4>{labels.effects}</h4>
						<p>{localizedText(lang, conflict.effects, conflict.effects_he)}</p>
					</div>
				)}
				{conflict.wikipedia_url && (
					<a
						className="pass-it-on-source-link"
						href={conflict.wikipedia_url}
						target="_blank"
						rel="noreferrer"
					>
						{labels.wikipedia}
					</a>
				)}
			</div>
		</details>
	);
}

export function PassItOnYearSection({
	year,
	entries,
	lang,
	highlightTerm,
	translations: labels,
	sectionRef,
	isActive,
	view,
}: {
	year: number;
	entries: TimelineEntryItem[];
	lang: "en" | "he";
	highlightTerm: string;
	translations: PageTranslations;
	sectionRef: Ref<HTMLElement>;
	isActive: boolean;
	view: TimelineView;
}) {
	const songs = entries.filter(
		(entry): entry is Extract<TimelineEntryItem, { type: "song" }> =>
			entry.type === "song",
	);
	const events = entries.filter(
		(entry): entry is Extract<TimelineEntryItem, { type: "conflict" }> =>
			entry.type === "conflict",
	);
	const songCountLabel = `${songs.length} ${songs.length === 1 ? labels.passItOn.trackOne : labels.passItOn.trackMany}`;
	const historyCountLabel = `${events.length} ${events.length === 1 ? labels.passItOn.historyOne : labels.passItOn.historyMany}`;
	const countLabel =
		view === "history"
			? historyCountLabel
			: view === "music"
				? songCountLabel
				: `${songCountLabel} · ${historyCountLabel}`;

	return (
		<section
			className={`pass-it-on-year${isActive ? " is-active" : ""}`}
			id={`pass-it-on-year-${year}`}
			data-year={year}
			data-view={view}
			ref={sectionRef}
			dir={lang === "he" ? "rtl" : "ltr"}
			aria-labelledby={`pass-it-on-year-heading-${year}`}
		>
			<h2
				className="pass-it-on-year-spool"
				id={`pass-it-on-year-heading-${year}`}
				tabIndex={-1}
			>
				<span>{year}</span>
				<span className="pass-it-on-year-reel" aria-hidden="true" />
				<span className="pass-it-on-year-track-count">{countLabel}</span>
			</h2>
			<div
				className={`pass-it-on-year-columns pass-it-on-year-columns-${view}`}
			>
				{view !== "history" && (
					<div className="pass-it-on-lane pass-it-on-music-lane">
						<h3>
							<span className="pass-it-on-lane-marker" aria-hidden="true" />
							{labels.passItOn.music}
						</h3>
						{songs.length > 0 ? (
							<div className="pass-it-on-song-list">
								{songs.map((entry, index) => (
									<details
										className={`pass-it-on-song-disclosure pass-it-on-song-leaning-${entry.leaning}`}
										key={`${entry.song.artist}-${entry.song.name}-${entry.song.published_date}`}
									>
										<summary className="pass-it-on-song-summary">
											<span
												className="pass-it-on-track-number"
												aria-hidden="true"
											>
												{String(index + 1).padStart(2, "0")}
											</span>
											<span className="pass-it-on-song-summary-copy">
												<strong lang={lang} dir="auto">
													{entry.song.name}
												</strong>
												<span dir="auto">{entry.song.artist}</span>
											</span>
											<time
												className="pass-it-on-song-date"
												dir="ltr"
												dateTime={entry.song.published_date}
											>
												{entry.song.published_date}
											</time>
											<span
												className={`pass-it-on-leaning pass-it-on-leaning-${entry.leaning}`}
											>
												<span
													className="pass-it-on-leaning-dot"
													aria-hidden="true"
												/>
												{labels.filters.leaning[entry.leaning]}
											</span>
											<span
												className="pass-it-on-disclosure-mark"
												aria-hidden="true"
											/>
										</summary>
										<div className="pass-it-on-song-content">
											<SongEntry
												song={entry.song}
												lang={lang}
												leaning={entry.leaning}
												variant="full"
												hideHeader
												showMarginTop={false}
												highlightTerm={highlightTerm}
												className="pass-it-on-song-actions"
											/>
										</div>
									</details>
								))}
							</div>
						) : (
							<p className="pass-it-on-lane-empty">
								{labels.passItOn.noSongsInYear}
							</p>
						)}
					</div>
				)}
				{view === "all" && (
					<div className="pass-it-on-ribbon-spine" aria-hidden="true">
						<span />
					</div>
				)}
				{view !== "music" && (
					<div className="pass-it-on-lane pass-it-on-history-lane">
						<h3>
							<span className="pass-it-on-lane-marker" aria-hidden="true" />
							{labels.passItOn.history}
						</h3>
						{events.length > 0 ? (
							<div className="pass-it-on-event-list">
								{events.map((entry) => (
									<EventDetails
										key={entry.conflictEntry.id}
										entry={entry}
										lang={lang}
										labels={labels}
									/>
								))}
							</div>
						) : (
							<p className="pass-it-on-lane-empty">
								{labels.passItOn.noHistoryInYear}
							</p>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
