"use client";

import { useTheme } from "@/components/ThemeProvider";
import type { translations } from "./translations";

interface TimelineHeaderProps {
	title: string;
	themeToggle: (typeof translations)["en"]["themeToggle"];
}

export function TimelineHeader({ title, themeToggle }: TimelineHeaderProps) {
	const { theme, setTheme } = useTheme();
	return (
		<div className="relative mx-auto my-5 flex max-w-5xl flex-col items-center justify-center gap-2 sm:my-7 sm:flex-row sm:gap-0">
			<h1 className="text-center text-2xl font-bold tracking-tight text-(--color-foreground) sm:text-3xl">
				{title}
			</h1>
			<div className="relative sm:absolute sm:end-0 sm:top-1/2 sm:-translate-y-1/2">
				<fieldset
					aria-label={themeToggle.label}
					className="flex items-center rounded-full border border-(--color-control-border) bg-(--color-control-background) p-0.5 text-xs text-(--color-control-foreground) shadow-sm"
				>
					{(["classic", "boombox"] as const).map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => setTheme(option)}
							aria-pressed={theme === option}
							className={`rounded-full px-2 py-1 font-medium transition-colors ${
								theme === option
									? "bg-(--color-accent) text-white"
									: "hover:bg-(--color-muted)"
							}`}
						>
							{themeToggle[option]}
						</button>
					))}
				</fieldset>
			</div>
		</div>
	);
}
