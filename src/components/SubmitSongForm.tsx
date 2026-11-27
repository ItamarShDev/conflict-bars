"use client";

import { useId, useRef, useState } from "react";
import { sendThankYouMail } from "../actions/email";
import {
	canonicalSongLanguage,
	displaySongLanguage,
} from "../utils/song-language";
import {
	releaseSubmissionLock,
	tryAcquireSubmissionLock,
} from "../utils/submission-lock";
import { isValidSongPublishedDate } from "../utils/timeline";
import type { SubmitSongFormProps } from "./SubmitSongForm.types";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function SubmitSongForm({
	translations,
	lang = "en",
	editSong,
	artistNames = [],
	languageNames = [],
}: SubmitSongFormProps) {
	const [status, setStatus] = useState<SubmissionStatus>("idle");
	const submissionInProgress = useRef(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [artistValue, setArtistValue] = useState<string>(
		editSong?.artist ?? "",
	);
	const [missingFields, setMissingFields] = useState<Set<string>>(new Set());
	const artistListId = useId();
	const languageListId = useId();
	const isEditMode = !!editSong;

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();
		if (
			submissionInProgress.current ||
			status === "submitting" ||
			status === "success"
		) {
			return;
		}
		setErrorMessage(null);
		setMissingFields(new Set());

		const formData = new FormData(event.currentTarget);

		const submitterName = (
			(formData.get("displayName") as string) ?? ""
		).trim();
		const submitterEmail = ((formData.get("email") as string) ?? "").trim();
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
		const honeypot = (formData.get("website") as string) ?? "";

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

		if (!isValidSongPublishedDate(publishedDate)) {
			setMissingFields(new Set(["publishedDate"]));
			setStatus("error");
			setErrorMessage(translations.errors.invalidPublishedDate);
			return;
		}

		if (!tryAcquireSubmissionLock(submissionInProgress)) {
			return;
		}
		setStatus("submitting");
		try {
			await sendThankYouMail({
				submitterName: submitterName || undefined,
				submitterEmail: submitterEmail || undefined,
				songName,
				artist,
				publishedDate,
				language,
				formLanguage: lang,
				isCorrection: isEditMode,
				existingSong: editSong
					? {
							name: editSong.name,
							publishedDate: editSong.published_date,
						}
					: undefined,
				lyricSample: {
					hebrew: lyricHebrew,
					englishTranslation: lyricEnglish || undefined,
				},
				links: {
					lyrics: linkLyrics || undefined,
					songInfo: linkInfo || undefined,
					youtube: linkYoutube || undefined,
				},
				honeypot,
			});
			setStatus("success");
		} catch {
			setStatus("error");
			setErrorMessage(translations.errors.generic);
		} finally {
			releaseSubmissionLock(submissionInProgress);
		}
	};

	const handleFormChange: React.FormEventHandler<HTMLFormElement> = () => {
		if (submissionInProgress.current || status === "submitting") {
			return;
		}
		setStatus("idle");
		setErrorMessage(null);
	};

	const t = translations;

	const inputBase =
		"min-w-0 border-2 border-(--color-control-border) px-3 py-2 text-sm sm:text-base bg-(--color-control-background) text-(--color-control-foreground) outline-none transition placeholder:text-(--color-control-muted) focus:border-(--color-accent) wobble-sm";

	return (
		<div className="glass-card border-2 border-(--color-control-border) p-4 text-start sm:p-6">
			<h2 className="mb-3 font-display text-lg font-black text-(--color-card-foreground) sm:mb-4 sm:text-xl">
				{isEditMode ? t.editTitle : t.title}
			</h2>
			<form onChange={handleFormChange} onSubmit={handleSubmit}>
				<fieldset
					disabled={status === "submitting"}
					className="m-0 min-w-0 space-y-3 border-0 p-0 sm:space-y-4"
				>
					<label className="sr-only" aria-hidden="true">
						Website
						<input
							name="website"
							type="text"
							tabIndex={-1}
							autoComplete="off"
						/>
					</label>
					<div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
						<label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
							<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
								{t.fields.displayName}
							</span>
							<input
								name="displayName"
								type="text"
								maxLength={100}
								placeholder={t.placeholders.optional}
								autoComplete="name"
								className={inputBase}
							/>
						</label>
						<label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
							<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
								{t.fields.email}
							</span>
							<input
								name="email"
								type="email"
								maxLength={254}
								placeholder={t.placeholders.optional}
								autoComplete="email"
								className={inputBase}
							/>
						</label>
					</div>
					<div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
						<label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
							<span className="text-xs font-black uppercase tracking-wider text-(--color-muted-foreground)">
								{t.fields.songName}
							</span>
							<input
								name="songName"
								type="text"
								maxLength={200}
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
								maxLength={200}
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
								type="text"
								maxLength={10}
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
								maxLength={64}
								required
								defaultValue={displaySongLanguage(
									editSong?.language || "",
									lang,
								)}
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
								maxLength={5000}
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
								maxLength={5000}
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
								maxLength={2048}
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
								maxLength={2048}
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
								maxLength={2048}
								defaultValue={editSong?.links?.youtube || ""}
								dir={lang === "he" ? "rtl" : "ltr"}
								className={inputBase}
							/>
						</label>
					</div>

					<p className="text-xs leading-relaxed text-(--color-muted-foreground)">
						{t.privacyNotice}
					</p>

					<div className="flex flex-col-reverse items-center justify-end gap-4 sm:flex-row">
						<div>
							{status === "success" && (
								<span
									className="text-sm font-bold text-emerald-400"
									role="status"
								>
									{t.success}
								</span>
							)}
							{status === "error" && errorMessage && (
								<span className="text-sm font-bold text-red-400">
									{errorMessage}
								</span>
							)}
						</div>
						<button
							type="submit"
							disabled={status === "submitting" || status === "success"}
							className="w-full bg-(--color-accent) px-6 py-2.5 font-black text-[#fffdf5] transition wobble-sm hover:bg-(--color-accent-hover) disabled:opacity-50 sm:w-auto"
						>
							{status === "submitting"
								? t.buttons.submitting
								: t.buttons.submit}
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
				</fieldset>
			</form>
		</div>
	);
}
