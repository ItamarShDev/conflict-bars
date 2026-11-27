"use client";

import { useId, useState } from "react";
import {
	canonicalSongLanguage,
	displaySongLanguage,
} from "../utils/song-language";
import { buildSongSubmissionIssueUrl } from "../utils/song-submission-issue";
import type { SubmitSongFormProps } from "./SubmitSongForm.types";

type SubmissionStatus = "idle" | "ready" | "error";

export function SubmitSongForm({
	translations,
	lang = "en",
	editSong,
	artistNames = [],
	languageNames = [],
}: SubmitSongFormProps) {
	const [status, setStatus] = useState<SubmissionStatus>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [issueUrl, setIssueUrl] = useState<string | null>(null);
	const [artistValue, setArtistValue] = useState<string>(
		editSong?.artist ?? "",
	);
	const [missingFields, setMissingFields] = useState<Set<string>>(new Set());
	const artistListId = useId();
	const languageListId = useId();
	const isEditMode = !!editSong;

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		setStatus("idle");
		setErrorMessage(null);
		setIssueUrl(null);
		setMissingFields(new Set());

		const formData = new FormData(event.currentTarget);

		const songName = (formData.get("songName") as string)?.trim();
		const artist = (formData.get("artist") as string)?.trim();
		const publishedDate = (formData.get("publishedDate") as string)?.trim();
		const languageRaw = (formData.get("language") as string) ?? "";
		const language = canonicalSongLanguage(languageRaw.trim(), lang);
		const lyricHebrew = ((formData.get("lyricHebrew") as string) ?? "").trim();
		const lyricEnglish = (
			(formData.get("lyricEnglish") as string) ?? ""
		).trim();
		const linkLyrics = ((formData.get("linkLyrics") as string) ?? "").trim();
		const linkInfo = ((formData.get("linkInfo") as string) ?? "").trim();
		const linkYoutube = ((formData.get("linkYoutube") as string) ?? "").trim();

		const missing = new Set<string>();
		if (!songName) missing.add("songName");
		if (!artist) missing.add("artist");
		if (!publishedDate) missing.add("publishedDate");
		if (!language) missing.add("language");
		if (!lyricHebrew) missing.add("lyricHebrew");

		if (missing.size > 0) {
			setMissingFields(missing);
			setStatus("error");
			setErrorMessage(translations.errors.required);
			return;
		}

		const lyricSample =
			lyricHebrew || lyricEnglish
				? {
						hebrew: lyricHebrew || undefined,
						english_translation: lyricEnglish || undefined,
					}
				: undefined;

		const links =
			linkLyrics || linkInfo || linkYoutube
				? {
						lyrics: linkLyrics || undefined,
						song_info: linkInfo || undefined,
						youtube: linkYoutube || undefined,
					}
				: undefined;

		const issueResult = buildSongSubmissionIssueUrl({
			isEditMode,
			songName,
			artist,
			publishedDate,
			language,
			lyricSample: lyricSample
				? {
						hebrew: lyricSample.hebrew,
						englishTranslation: lyricSample.english_translation,
					}
				: undefined,
			links: links
				? {
						lyrics: links.lyrics,
						songInfo: links.song_info,
						youtube: links.youtube,
					}
				: undefined,
			existingSong: editSong,
		});
		if (issueResult.status === "too-long") {
			setStatus("error");
			setErrorMessage(
				translations.errors.issueTooLong.replace(
					"{{limit}}",
					String(issueResult.maxLength),
				),
			);
			return;
		}

		setIssueUrl(issueResult.url);
		setStatus("ready");
	};

	const handleFormChange: React.FormEventHandler<HTMLFormElement> = () => {
		setStatus("idle");
		setErrorMessage(null);
		setIssueUrl(null);
	};

	const t = translations;

	const inputBase =
		"min-w-0 border-2 border-(--color-control-border) px-3 py-2 text-sm sm:text-base bg-(--color-control-background) text-(--color-control-foreground) outline-none transition placeholder:text-(--color-control-muted) focus:border-(--color-accent) wobble-sm";

	return (
		<div className="glass-card border-2 border-(--color-control-border) p-4 text-start sm:p-6">
			<h2 className="mb-3 font-display text-lg font-black text-(--color-card-foreground) sm:mb-4 sm:text-xl">
				{isEditMode ? t.editTitle : t.title}
			</h2>
			<form
				onChange={handleFormChange}
				onSubmit={handleSubmit}
				className="space-y-3 sm:space-y-4"
			>
				<div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
					<label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.songName}
						</span>
						<input
							name="songName"
							type="text"
							required
							defaultValue={editSong?.name || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className={`${inputBase} ${
								missingFields.has("songName")
									? "border-red-500"
									: "border-(--color-control-border)"
							}`}
						/>
					</label>
					<label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.artist}
						</span>
						<input
							name="artist"
							type="text"
							required={!isEditMode}
							readOnly={isEditMode}
							value={artistValue}
							onChange={(e) => setArtistValue(e.target.value)}
							list={isEditMode ? undefined : artistListId}
							className={`${inputBase} ${
								missingFields.has("artist")
									? "border-red-500"
									: "border-(--color-control-border)"
							} ${isEditMode ? "cursor-not-allowed opacity-70" : ""}`}
						/>
					</label>
				</div>

				<div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
					<label className="flex min-w-0 flex-col gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.publishedDate}
						</span>
						<input
							name="publishedDate"
							type="number"
							min="1900"
							max="2099"
							placeholder={t.placeholders.publishedYear}
							required
							defaultValue={editSong?.published_date || ""}
							className={`${inputBase} ${
								missingFields.has("publishedDate")
									? "border-red-500"
									: "border-(--color-control-border)"
							}`}
						/>
					</label>
					<label className="flex min-w-0 flex-col gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.language}
						</span>
						<input
							name="language"
							type="text"
							required
							defaultValue={displaySongLanguage(editSong?.language || "", lang)}
							list={languageListId}
							className={`${inputBase} ${
								missingFields.has("language")
									? "border-red-500"
									: "border-(--color-control-border)"
							}`}
						/>
					</label>
				</div>

				<div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
					<label className="flex min-w-0 flex-col gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.lyricHebrew}
						</span>
						<textarea
							name="lyricHebrew"
							rows={3}
							required
							defaultValue={editSong?.lyric_sample?.hebrew || ""}
							dir="rtl"
							className={`${inputBase} ${
								missingFields.has("lyricHebrew")
									? "border-red-500"
									: "border-(--color-control-border)"
							}`}
						/>
					</label>
					<label className="flex min-w-0 flex-col gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.lyricEnglish}
						</span>
						<textarea
							name="lyricEnglish"
							rows={3}
							defaultValue={editSong?.lyric_sample?.english_translation || ""}
							dir="ltr"
							className={inputBase}
						/>
					</label>
				</div>

				<div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
					<label className="flex min-w-0 flex-col gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.linkLyrics}
						</span>
						<input
							name="linkLyrics"
							type="url"
							defaultValue={editSong?.links?.lyrics || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className={inputBase}
						/>
					</label>
					<label className="flex min-w-0 flex-col gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.linkInfo}
						</span>
						<input
							name="linkInfo"
							type="url"
							defaultValue={editSong?.links?.song_info || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className={inputBase}
						/>
					</label>
					<label className="flex min-w-0 flex-col gap-2">
						<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
							{t.fields.linkYoutube}
						</span>
						<input
							name="linkYoutube"
							type="url"
							defaultValue={editSong?.links?.youtube || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className={inputBase}
						/>
					</label>
				</div>

				<p className="text-xs leading-relaxed text-(--color-muted-foreground)">
					{t.issuePrivacyNotice}
				</p>

				<div className="flex flex-col-reverse items-center justify-end gap-4 sm:flex-row">
					<div>
						{status === "ready" && issueUrl && (
							<div
								className="flex flex-col gap-2 text-sm font-bold text-emerald-400"
								role="status"
							>
								<span>{t.issueReady}</span>
								<a
									href={issueUrl}
									target="_blank"
									rel="noreferrer"
									className="underline"
								>
									{t.buttons.openIssue}
								</a>
							</div>
						)}
						{status === "error" && errorMessage && (
							<span className="text-sm font-bold text-red-400">
								{errorMessage}
							</span>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-(--color-accent) px-6 py-2.5 font-black text-[#fffdf5] transition wobble-sm hover:bg-(--color-accent-hover) disabled:opacity-50 sm:w-auto"
					>
						{t.buttons.submit}
					</button>
				</div>
				<datalist id={artistListId}>
					{artistNames.map((artistName) => (
						<option key={artistName} value={artistName} />
					))}
				</datalist>
				<datalist id={languageListId}>
					{languageNames.map((langOption) => (
						<option
							key={langOption}
							value={displaySongLanguage(langOption, lang)}
						/>
					))}
				</datalist>
			</form>
		</div>
	);
}
