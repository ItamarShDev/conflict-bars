"use client";

import { useMutation, useQuery } from "convex/react";
import { useId, useMemo, useState } from "react";
import type { SubmitSongFormTranslations } from "@/components/timeline/translations";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type SubmitSongFormProps = {
	onSuccess?: () => void;
	translations: SubmitSongFormTranslations;
};

export function SubmitSongForm({
	onSuccess,
	translations,
}: SubmitSongFormProps) {
	const submitSong = useMutation(api.mutations.submitSongWithUser);
	const songs = useQuery(api.songs.getAllSongs) ?? [];
	const artists = useQuery(api.artists.getAllArtists) ?? [];
	const [status, setStatus] = useState<SubmissionStatus>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const artistListId = useId();
	const languageListId = useId();

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

		const form = event.currentTarget;
		const formData = new FormData(form);

		const displayName = (formData.get("displayName") as string)?.trim();
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

		if (!displayName || !songName || !artist || !publishedDate) {
			setStatus("error");
			setErrorMessage(translations.errors.required);
			return;
		}

		const artistId = artistNameToId.get(artist.toLowerCase());
		if (!artistId) {
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
				userDisplayName: displayName,
				userEmail: email ? email : undefined,
				song: {
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
		} catch (error) {
			console.error("Failed to submit song", error);
			setStatus("error");
			setErrorMessage(translations.errors.generic);
		}
	};

	return (
		<div className="border border-neutral-700 rounded-lg p-6 bg-neutral-900/50">
			<h2 className="text-xl font-semibold mb-4">{translations.title}</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.displayName}
						</span>
						<input
							name="displayName"
							type="text"
							required
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.email}
						</span>
						<input
							name="email"
							type="email"
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.songName}
						</span>
						<input
							name="songName"
							type="text"
							required
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.artist}
						</span>
						<input
							name="artist"
							type="text"
							required
							list={artistListId}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.publishedDate}
						</span>
						<input
							name="publishedDate"
							type="date"
							required
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.language}
						</span>
						<input
							name="language"
							type="text"
							list={languageListId}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.lyricHebrew}
						</span>
						<textarea
							name="lyricHebrew"
							rows={3}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.lyricEnglish}
						</span>
						<textarea
							name="lyricEnglish"
							rows={3}
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.linkLyrics}
						</span>
						<input
							name="linkLyrics"
							type="url"
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.linkInfo}
						</span>
						<input
							name="linkInfo"
							type="url"
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium">
							{translations.fields.linkYoutube}
						</span>
						<input
							name="linkYoutube"
							type="url"
							className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
						/>
					</label>
				</div>

				<div className="flex items-center gap-4">
					<button
						type="submit"
						disabled={status === "submitting"}
						className="rounded bg-emerald-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
					>
						{status === "submitting"
							? translations.buttons.submitting
							: translations.buttons.submit}
					</button>
					{status === "success" && (
						<span className="text-sm text-emerald-400">
							{translations.success}
						</span>
					)}
					{status === "error" && errorMessage && (
						<span className="text-sm text-red-400">{errorMessage}</span>
					)}
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
