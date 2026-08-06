"use client";

import { useTheme } from "@/components/ThemeProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { translations } from "./translations";

interface TimelineHeaderProps {
	title: string;
	subtitle: string;
	themeToggle: (typeof translations)["en"]["themeToggle"];
	lang: "en" | "he";
}

function Equalizer() {
	return (
		<div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
			<span className="eq-bar h-4 w-1 rounded-full bg-(--color-accent)" />
			<span className="eq-bar h-4 w-1 rounded-full bg-(--color-accent)" />
			<span className="eq-bar h-4 w-1 rounded-full bg-(--color-accent)" />
		</div>
	);
}

export function TimelineHeader({
	title,
	subtitle,
	themeToggle,
	lang,
}: TimelineHeaderProps) {
	const { theme, setTheme } = useTheme();
	return (
		<header className="control-bar sticky top-0 z-40 mx-auto mb-6 flex w-full max-w-6xl flex-col gap-3 rounded-b-2xl px-4 py-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-b-3xl sm:px-6 sm:py-5">
			<div className="flex items-center gap-3">
				<Equalizer />
				<div>
					<h1 className="font-display text-2xl font-black leading-none tracking-tight text-(--color-foreground) sm:text-4xl">
						{title}
					</h1>
					<p className="mt-1 text-xs font-medium uppercase tracking-widest text-(--color-muted-foreground)">
						{subtitle}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2 sm:gap-3">
				<LanguageSwitcher lang={lang} />
				<fieldset
					aria-label={themeToggle.label}
					className="flex items-center rounded-full border border-(--color-control-border) bg-(--color-control-background) p-0.5 text-xs text-(--color-control-foreground) shadow-inner"
				>
					{(["classic", "boombox"] as const).map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => setTheme(option)}
							aria-pressed={theme === option}
							className={`rounded-full px-3 py-1.5 font-semibold transition-all ${
								theme === option
									? "bg-(--color-accent) text-[#1c1c19]"
									: "hover:bg-(--color-muted)"
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
