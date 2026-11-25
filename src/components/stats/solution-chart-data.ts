import { LEANINGS } from "@/components/bubble/chart-data";
import { getSongLeaning } from "@/utils/timeline";
import {
	type SolutionAspirationAnnotation,
	solutionAspirationAnnotations,
} from "../../../timeline/solution-aspiration";
import type {
	FileSong,
	FileSongList,
	SongLeaning,
} from "../../../timeline/types";

export type ResolutionLeaning = SongLeaning;

export interface ResolutionSongMatch {
	song: FileSong;
	annotation: SolutionAspirationAnnotation;
	year: number;
	leaning: ResolutionLeaning;
}

export interface ResolutionCell {
	year: number;
	leaning: ResolutionLeaning;
	positive: ResolutionSongMatch[];
	explicit: ResolutionSongMatch[];
	opposed: ResolutionSongMatch[];
	total: number;
}

export interface ResolutionChartData {
	matches: ResolutionSongMatch[];
	years: number[];
	cells: ResolutionCell[][];
	maxPositive: number;
	maxExplicit: number;
	totals: {
		songs: number;
		positive: number;
		explicit: number;
		opposed: number;
		insufficient: number;
	};
	basisCounts: Record<
		"full_lyrics" | "partial_lyrics" | "catalog_excerpt",
		number
	>;
}

export function solutionKey(song: Pick<FileSong, "artist" | "name">): string {
	return `${song.artist}::${song.name}`.normalize("NFC").toLowerCase();
}

function positiveCategory(annotation: SolutionAspirationAnnotation): boolean {
	return (
		annotation.category === "explicit_two_state" ||
		annotation.category === "peaceful_resolution"
	);
}

export function buildResolutionChartData(
	songs: FileSongList,
): ResolutionChartData {
	const matches: ResolutionSongMatch[] = [];
	const basisCounts = {
		full_lyrics: 0,
		partial_lyrics: 0,
		catalog_excerpt: 0,
	};

	for (const song of songs) {
		const annotation = solutionAspirationAnnotations[solutionKey(song)];
		const year = Number(song.published_date.slice(0, 4));
		if (!annotation || !Number.isFinite(year)) continue;
		basisCounts[annotation.evidenceBasis]++;
		matches.push({
			song,
			annotation,
			year,
			leaning: getSongLeaning(song),
		});
	}

	const minYear = Math.min(...matches.map((match) => match.year));
	const maxYear = Math.max(...matches.map((match) => match.year));
	const years = Array.from(
		{ length: maxYear - minYear + 1 },
		(_, index) => minYear + index,
	);

	const cells = years.map((year) =>
		LEANINGS.map((leaning) => {
			const items = matches.filter(
				(match) => match.year === year && match.leaning === leaning,
			);
			return {
				year,
				leaning,
				positive: items.filter((match) => positiveCategory(match.annotation)),
				explicit: items.filter(
					(match) => match.annotation.category === "explicit_two_state",
				),
				opposed: items.filter(
					(match) => match.annotation.category === "exclusive_or_opposed",
				),
				total: items.length,
			};
		}),
	);

	return {
		matches,
		years,
		cells,
		maxPositive: Math.max(
			1,
			...cells.flat().map((cell) => cell.positive.length),
		),
		maxExplicit: Math.max(
			1,
			...cells.flat().map((cell) => cell.explicit.length),
		),
		totals: {
			songs: matches.length,
			positive: matches.filter((match) => positiveCategory(match.annotation))
				.length,
			explicit: matches.filter(
				(match) => match.annotation.category === "explicit_two_state",
			).length,
			opposed: matches.filter(
				(match) => match.annotation.category === "exclusive_or_opposed",
			).length,
			insufficient: matches.filter(
				(match) => match.annotation.category === "insufficient_evidence",
			).length,
		},
		basisCounts,
	};
}
