import { translations } from "@/components/timeline/translations";

interface StatsTabsProps {
	lang: "en" | "he";
	active: "leaning" | "resolution";
}

export function StatsTabs({ lang, active }: StatsTabsProps) {
	const t = translations[lang];
	const prefix = lang === "he" ? "/stats" : `/${lang}/stats`;
	return (
		<nav className="stats-tabs" aria-label={t.stats.tabsLabel}>
			<a
				href={`${prefix}?tab=resolution`}
				aria-current={active === "resolution" ? "page" : undefined}
				className={active === "resolution" ? "active" : ""}
			>
				{t.stats.resolutionTab}
			</a>
			<a
				href={`${prefix}?tab=leaning`}
				aria-current={active === "leaning" ? "page" : undefined}
				className={active === "leaning" ? "active" : ""}
			>
				{t.stats.leaningTab}
			</a>
		</nav>
	);
}
