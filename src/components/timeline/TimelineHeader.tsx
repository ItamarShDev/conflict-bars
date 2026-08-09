"use client";

import { useTheme } from "@/components/ThemeProvider";
import { HelpModal, type HelpModalStats } from "./HelpModal";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { translations } from "./translations";

interface TimelineHeaderProps {
	title: string;
	subtitle: string;
	themeToggle: (typeof translations)["en"]["themeToggle"];
	helpModal: (typeof translations)["en"]["helpModal"];
	stats: HelpModalStats;
	lang: "en" | "he";
}

export function TimelineHeader({
	title,
	subtitle,
	themeToggle,
	helpModal,
	stats,
	lang,
}: TimelineHeaderProps) {
	const { theme, setTheme } = useTheme();
	return (
		<header className="control-bar sticky top-0 z-30 flex w-full flex-col gap-3 border-0 border-b-4 border-(--color-accent) px-4 py-4 ps-14 md:flex-row md:items-center md:justify-between md:ps-20 md:py-5">
			<div>
				<h1 className="font-display text-2xl font-black leading-none tracking-tight text-(--color-control-foreground) md:text-4xl">
					{title}
				</h1>
				<p className="mt-1 text-xs font-black uppercase tracking-widest text-(--color-control-muted)">
					{subtitle}
				</p>
			</div>

			<div className="flex items-center gap-2 md:gap-3">
				<HelpModal
					translations={helpModal}
					stats={stats}
					lang={lang}
					className="z-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-(--color-control-border) bg-(--color-control-background) text-sm font-black text-(--color-control-foreground) hover:bg-(--color-control-foreground)/10 hover:text-(--color-accent) md:h-10 md:w-10"
				/>
				<LanguageSwitcher lang={lang} />
				<fieldset
					aria-label={themeToggle.label}
					className="flex items-center border-2 border-(--color-control-border) bg-(--color-control-background) p-0.5 text-xs text-(--color-control-foreground) wobble-sm"
				>
					{(["classic", "boombox"] as const).map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => setTheme(option)}
							aria-pressed={theme === option}
							className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition wobble-sm ${
								theme === option
									? "bg-(--color-accent) text-[#fffdf5]"
									: "hover:bg-(--color-control-foreground)/10"
							}`}
						>
							{themeToggle[option]}
						</button>
					))}
				</fieldset>
			</div>
		</header>
	);
}
