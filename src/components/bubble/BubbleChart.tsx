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
			<div className="pass-it-on-chart pass-it-on-chart-empty">
				<p className="pass-it-on-chart-empty-message">{t.search.noResults}</p>
			</div>
		);
	}

	const chartProps = {
		data,
		bands,
		labels,
		ariaLabel: `${t.bubble.subtitle}: ${data.minYear}-${data.maxYear}`,
	};

	return (
		<div className="pass-it-on-chart">
			<ul className="pass-it-on-chart-stats" aria-label={t.bubble.title}>
				{LEANINGS.map((leaning) => (
					<li
						key={leaning}
						className="pass-it-on-chart-stat"
						data-leaning={leaning}
					>
						<span
							className="pass-it-on-chart-stat-count"
							style={{ color: LEANING_COLORS[leaning] }}
						>
							{data.totals[leaning]}
						</span>
						<span className="pass-it-on-chart-stat-label">
							{labels[leaning]}
						</span>
					</li>
				))}
			</ul>

			<div className="pass-it-on-chart-plot">
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
