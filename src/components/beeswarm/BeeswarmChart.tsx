"use client";

import { useMemo } from "react";
import { translations } from "@/components/timeline/translations";
import { getArtistLeaning } from "@/utils/timeline";
import type { FileSong, FileSongList } from "../../../timeline/types";

type Leaning = "left" | "right" | "center" | "unknown";

const LEANING_ORDER: Record<Leaning, number> = {
	left: 0,
	right: 1,
	center: 2,
	unknown: 3,
};

const LEANING_COLORS: Record<Leaning, string> = {
	left: "var(--color-leaning-left)",
	right: "var(--color-leaning-right)",
	center: "var(--color-leaning-center)",
	unknown: "var(--color-leaning-unknown)",
};

interface BeeswarmChartProps {
	songs: FileSongList;
	lang: "en" | "he";
}

interface Node {
	x: number;
	y: number;
	r: number;
	year: number;
	leaning: Leaning;
	song: FileSong;
}

export function BeeswarmChart({ songs, lang }: BeeswarmChartProps) {
	const t = translations[lang];
	const leaningLabels = t.filters.leaning as Record<Leaning, string>;

	const layout = useMemo(() => {
		const valid = songs
			.map((song) => {
				const year = Number(song.published_date.slice(0, 4));
				if (!Number.isFinite(year)) return null;
				return {
					song,
					year,
					leaning: getArtistLeaning(song.artist_details),
				};
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		if (valid.length === 0) return null;

		const years = valid.map((item) => item.year);
		const minYear = Math.min(...years);
		const maxYear = Math.max(...years);

		const countByYear = new Map<number, number>();
		for (const item of valid) {
			countByYear.set(item.year, (countByYear.get(item.year) || 0) + 1);
		}
		const maxPerYear = Math.max(...countByYear.values());

		const width = 800;
		const margin = 56;
		const r = 4;
		const gap = 2;
		const rowHeight = Math.min(120, Math.max(64, maxPerYear * 5));
		const height = (maxYear - minYear + 1) * rowHeight + margin * 2;

		const yFor = (year: number) => margin + (year - minYear) * rowHeight;

		const byYear = new Map<number, typeof valid>();
		for (const item of valid) {
			const list = byYear.get(item.year) || [];
			list.push(item);
			byYear.set(item.year, list);
		}

		const nodes: Node[] = [];
		for (const [year, list] of byYear) {
			list.sort(
				(a, b) =>
					LEANING_ORDER[a.leaning as Leaning] -
						LEANING_ORDER[b.leaning as Leaning] ||
					a.song.name.localeCompare(b.song.name),
			);
			const targetY = yFor(year);
			const step = r * 2 + gap;
			for (let i = 0; i < list.length; i++) {
				const direction = i % 2 === 0 ? 1 : -1;
				const offset = direction * Math.ceil(i / 2) * step;
				nodes.push({
					...list[i],
					x: width / 2 + offset,
					y: targetY,
					r,
				});
			}
		}

		const iterations = 120;
		for (let iter = 0; iter < iterations; iter++) {
			const alpha = 1 - iter / iterations;

			for (const node of nodes) {
				const targetY = yFor(node.year);
				node.y += (targetY - node.y) * 0.5 * alpha;
				node.x += (width / 2 - node.x) * 0.02 * alpha;
				node.x = Math.max(r, Math.min(width - r, node.x));
				node.y = Math.max(r, Math.min(height - r, node.y));
			}

			for (let i = 0; i < nodes.length; i++) {
				for (let j = i + 1; j < nodes.length; j++) {
					const a = nodes[i];
					const b = nodes[j];
					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const dist2 = dx * dx + dy * dy;
					const minDist = a.r + b.r + gap;
					if (dist2 < minDist * minDist && dist2 > 0.0001) {
						const dist = Math.sqrt(dist2);
						const force = ((minDist - dist) / dist) * 0.5 * alpha;
						const fx = dx * force;
						const fy = dy * force;
						a.x -= fx;
						a.y -= fy;
						b.x += fx;
						b.y += fy;
					} else if (dist2 <= 0.0001) {
						a.x -= 0.5;
						a.y -= 0.5;
						b.x += 0.5;
						b.y += 0.5;
					}
				}
			}
		}

		const totals: Record<Leaning, number> = {
			left: 0,
			right: 0,
			center: 0,
			unknown: 0,
		};
		for (const item of valid) {
			totals[item.leaning as Leaning]++;
		}

		return { nodes, minYear, maxYear, width, height, r, margin, totals };
	}, [songs]);

	if (!layout) {
		return (
			<p className="py-12 text-center text-sm font-black uppercase tracking-widest text-(--color-year-foreground)">
				{t.search.noResults}
			</p>
		);
	}

	const { nodes, minYear, maxYear, width, height, margin, totals } = layout;
	const leanings: Leaning[] = ["left", "right", "center", "unknown"];

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				{leanings.map((leaning) => (
					<div
						key={leaning}
						className="control-bar flex flex-col items-center rounded-lg border-2 border-(--color-control-border) bg-(--color-control-background) p-3"
					>
						<span
							className="font-display text-3xl font-black"
							style={{ color: LEANING_COLORS[leaning] }}
						>
							{totals[leaning]}
						</span>
						<span className="text-xs font-black uppercase tracking-widest text-(--color-control-muted)">
							{leaningLabels[leaning]}
						</span>
					</div>
				))}
			</div>

			<div className="control-bar rounded-lg border-2 border-(--color-control-border) bg-(--color-control-background) p-4">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="w-full h-auto"
					role="img"
					aria-label={`${t.beeswarm.subtitle}: ${minYear}-${maxYear}`}
				>
					{Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
						const year = minYear + i;
						const rowHeight = (height - margin * 2) / (maxYear - minYear + 1);
						const y = margin + i * rowHeight;
						return (
							<g key={year}>
								<line
									x1={margin}
									y1={y}
									x2={width - margin}
									y2={y}
									stroke="var(--color-control-border)"
									strokeOpacity={0.3}
									strokeWidth={1}
								/>
								<text
									x={margin - 10}
									y={y + 4}
									textAnchor="end"
									className="text-xs font-black"
									style={{ fill: "var(--color-control-foreground)" }}
								>
									{year}
								</text>
							</g>
						);
					})}

					{nodes.map((node) => (
						<circle
							key={`${node.year}-${node.leaning}-${node.song.artist}-${node.song.name}`}
							cx={node.x}
							cy={node.y}
							r={node.r}
							fill={LEANING_COLORS[node.leaning as Leaning]}
							stroke="var(--color-control-foreground)"
							strokeWidth={0.5}
							strokeOpacity={0.2}
						>
							<title>
								{`${node.song.name} — ${node.song.artist}\n${node.year} · ${leaningLabels[node.leaning as Leaning]}`}
							</title>
						</circle>
					))}
				</svg>

				<div className="mt-4 flex flex-wrap items-center justify-center gap-3">
					{leanings.map((leaning) => (
						<div
							key={leaning}
							className="flex items-center gap-2 text-sm font-black text-(--color-control-foreground)"
						>
							<span
								className="inline-block h-3 w-3 rounded-full"
								style={{ backgroundColor: LEANING_COLORS[leaning] }}
							/>
							{leaningLabels[leaning]}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
