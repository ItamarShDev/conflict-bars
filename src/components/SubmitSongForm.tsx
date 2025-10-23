"use client";

import { useQuery } from "convex/react";
import { useEffect, useId, useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { sendThankYouMail } from "../actions/email";
import type { SubmitSongFormProps } from "./SubmitSongForm.types";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function SubmitSongForm({
	onSuccess,
	translations,
	lang = "en",
	editSong,
	submitSong,
}: SubmitSongFormProps) {
	const songs = useQuery(api.songs.getAllSongs) ?? [];
	const artists = useQuery(api.artists.getAllArtists) ?? [];
	const [status, setStatus] = useState<SubmissionStatus>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [prefillEmail, setPrefillEmail] = useState<string>("");
	const [artistValue, setArtistValue] = useState<string>(
		editSong?.artist ?? "",
	);
	const [missingFields, setMissingFields] = useState<Set<string>>(new Set());
	const artistListId = useId();
	const languageListId = useId();
	const isEditMode = !!editSong;

	useEffect(() => {
		const savedEmail = sessionStorage.getItem("submitSongFormEmail");
		if (savedEmail) {
			setPrefillEmail(savedEmail);
		}
	}, []);

	const { artistOptions, languages } = useMemo(() => {
		const languageSet = new Set<string>();
		for (const song of songs) {
			if (song.language) {
				languageSet.add(song.language);
			}
		}
		const artistOptions = artists
			.map((artist) => ({
				id: artist._id,
				name: artist.name,
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		return {
			artistOptions,
			languages: Array.from(languageSet).sort((a, b) => a.localeCompare(b)),
		};
	}, [songs, artists]);

	const artistNameToId = useMemo(() => {
		const map = new Map<string, Id<"artists">>();
		for (const option of artistOptions) {
			if (option.name) {
				map.set(option.name.toLowerCase(), option.id);
			}
		}
		return map;
	}, [artistOptions]);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();
		setStatus("submitting");
		setErrorMessage(null);
		setMissingFields(new Set());

		const form = event.currentTarget;
		const formData = new FormData(form);

		const displayName = (formData.get("displayName") as string)?.trim() ?? "";
		const emailRaw = (formData.get("email") as string) ?? "";
		const email = emailRaw.trim();
		const songName = (formData.get("songName") as string)?.trim();
		const artist = (formData.get("artist") as string)?.trim();
		const publishedDate = (formData.get("publishedDate") as string)?.trim();
		const languageRaw = (formData.get("language") as string) ?? "";
		const language = languageRaw.trim();
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

		const artistId = artistNameToId.get(artist.toLowerCase());
		if (!artistId) {
			setMissingFields(new Set(["artist"]));
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

		try {
			await submitSong({
				songId: editSong?._id,
				userDisplayName: displayName,
				userEmail: email,
				suggestion: {
					name: songName,
					artistId,
					published_date: publishedDate,
					language: language ? language : undefined,
					lyric_sample: lyricSample,
					links,
				},
			});
			setStatus("success");
			onSuccess?.();
			form.reset();
			await sendThankYouMail({
				submitterEmail: email,
				songName,
				artist,
				publishedDate,
				language,
				lyricSample,
				links,
			});
		} catch (error) {
			console.error("Failed to submit song", error);
			setStatus("error");
			setErrorMessage(translations.errors.generic);
		}
	};

	const t = translations;

	return (
		<div
			className={`border border-neutral-700 rounded-lg p-6 bg-neutral-900/50 text-start`}
		>
			<h2 className="text-xl font-semibold mb-4 text-neutral-100">{isEditMode ? t.editTitle : t.title}</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.displayName}
						</span>
						<input
							name="displayName"
							type="text"
							placeholder={t.placeholders.displayNameOptional}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.email}
						</span>
						<input
							name="email"
							type="email"
							defaultValue={prefillEmail}
							dir="ltr"
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.songName}
						</span>
						<input
							name="songName"
							type="text"
							required
							defaultValue={editSong?.name || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className={`rounded border px-3 py-2 bg-neutral-950 text-neutral-100 ${
								missingFields.has("songName")
									? "border-red-500"
									: "border-neutral-700"
							}`}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
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
							className={`rounded border px-3 py-2 ${
								missingFields.has("artist")
									? "border-red-500"
									: "border-neutral-700"
							} ${
								isEditMode
									? "bg-neutral-900 text-neutral-100 cursor-not-allowed opacity-100"
									: "bg-neutral-950 text-neutral-100"
							}`}
						/>
					</label>
				</div>

				<div
					className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${lang === "he" ? "flex flex-col-reverse" : ""}`}
				>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
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
							className={`rounded border px-3 py-2 bg-neutral-950 text-neutral-100 ${
								missingFields.has("publishedDate")
									? "border-red-500"
									: "border-neutral-700"
							}`}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.language}
						</span>
						<input
							name="language"
							type="text"
							required
							defaultValue={editSong?.language || ""}
							list={languageListId}
							className={`rounded border px-3 py-2 bg-neutral-950 text-neutral-100 ${
								missingFields.has("language")
									? "border-red-500"
									: "border-neutral-700"
							}`}
						/>
					</label>
				</div>

				<div
					className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${lang === "he" ? "flex flex-col-reverse" : ""}`}
				>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.lyricHebrew}
						</span>
						<textarea
							name="lyricHebrew"
							rows={3}
							required
							defaultValue={editSong?.lyric_sample?.hebrew || ""}
							dir="rtl"
							className={`rounded border px-3 py-2 bg-neutral-950 text-neutral-100 ${
								missingFields.has("lyricHebrew")
									? "border-red-500"
									: "border-neutral-700"
							}`}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.lyricEnglish}
						</span>
						<textarea
							name="lyricEnglish"
							rows={3}
							defaultValue={editSong?.lyric_sample?.english_translation || ""}
							dir="ltr"
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
						/>
					</label>
				</div>

				<div
					className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${lang === "he" ? "flex flex-col-reverse" : ""}`}
				>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.linkLyrics}
						</span>
						<input
							name="linkLyrics"
							type="url"
							defaultValue={editSong?.links?.lyrics || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.linkInfo}
						</span>
						<input
							name="linkInfo"
							type="url"
							defaultValue={editSong?.links?.song_info || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-neutral-300">
							{t.fields.linkYoutube}
						</span>
						<input
							name="linkYoutube"
							type="url"
							defaultValue={editSong?.links?.youtube || ""}
							dir={lang === "he" ? "rtl" : "ltr"}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
						/>
					</label>
				</div>

				<div className="flex items-center justify-end gap-4">
					<div>
						{status === "success" && (
							<span className="text-sm text-emerald-400">{t.success}</span>
						)}
						{status === "error" && errorMessage && (
							<span className="text-sm text-red-400">{errorMessage}</span>
						)}
					</div>
					<button
						type="submit"
						disabled={status === "submitting"}
						className="rounded bg-emerald-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
					>
						{status === "submitting" ? t.buttons.submitting : t.buttons.submit}
					</button>
				</div>
				<datalist id={artistListId}>
					{artistOptions.map((option) => (
						<option key={option.id} value={option.name} />
					))}
				</datalist>
				<datalist id={languageListId}>
					{languages.map((langOption) => (
						<option key={langOption} value={langOption} />
					))}
				</datalist>
			</form>
		</div>
	);
}
