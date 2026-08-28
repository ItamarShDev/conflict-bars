"use client";

import { useEffect, useMemo, useState } from "react";
import { translations } from "@/components/timeline/translations";
import type { FileSongList } from "../../../timeline/types";
import {
	buildChartData,
	type ConflictBand,
	LEANING_COLORS,
	LEANINGS,
	type Leaning,
} from "./chart-data";
import DivergingColumns from "./DivergingColumns";
import DivergingRows from "./DivergingRows";

interface BubbleChartProps {
	songs: FileSongList;
	lang: "en" | "he";
	bands: ConflictBand[];
}

export function BubbleChart({ songs, lang, bands }: BubbleChartProps) {
	const t = translations[lang];
	const labels = t.filters.leaning as Record<Leaning, string>;
	const [isMobile, setIsMobile] = useState(false);
	const data = useMemo(() => buildChartData(songs), [songs]);

	useEffect(() => {
		const media = window.matchMedia("(max-width: 640px)");
		const update = () => setIsMobile(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);

	if (!data) {
		return (
			<p className="py-12 text-center text-sm font-black uppercase tracking-widest text-(--color-year-foreground)">
				{t.search.noResults}
			</p>
		);
	}

	const chartProps = {
		data,
		bands,
		labels,
		ariaLabel: `${t.bubble.subtitle}: ${data.minYear}-${data.maxYear}`,
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				{LEANINGS.map((leaning) => (
					<div
						key={leaning}
						className="control-bar flex flex-col items-center rounded-lg border-2 border-(--color-control-border) bg-(--color-control-background) p-3"
					>
						<span
							className="font-display text-3xl font-black"
							style={{ color: LEANING_COLORS[leaning] }}
						>
							{data.totals[leaning]}
						</span>
						<span className="text-xs font-black uppercase tracking-widest text-(--color-control-muted)">
							{labels[leaning]}
						</span>
					</div>
				))}
			</div>

			<div className="control-bar rounded-lg border-2 border-(--color-control-border) bg-(--color-control-background) p-4">
				<div dir="ltr">
					{isMobile ? (
						<DivergingRows {...chartProps} />
					) : (
						<DivergingColumns {...chartProps} />
					)}
				</div>
			</div>
		</div>
	);
}
