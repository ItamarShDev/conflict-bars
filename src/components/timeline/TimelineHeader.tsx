"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { HelpModal, type HelpModalStats } from "./HelpModal";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { translations } from "./translations";

interface TimelineHeaderProps {
	title: string;
	subtitle: string;
	themeToggle: (typeof translations)["en"]["themeToggle"];
	helpModal?: (typeof translations)["en"]["helpModal"];
	stats?: HelpModalStats;
	nav?: { href: string; label: string };
	lang: "en" | "he";
	railOffset?: boolean;
	id?: string;
	compact?: boolean;
}

function ThemeIcon({
	kind,
	className,
}: {
	kind: "sun" | "moon";
	className: string;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			focusable="false"
		>
			{kind === "sun" ? (
				<>
					<circle cx="12" cy="12" r="3.5" />
					<path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
				</>
			) : (
				<path d="M20.4 15.4A8.6 8.6 0 0 1 8.6 3.6 8.7 8.7 0 1 0 20.4 15.4Z" />
			)}
		</svg>
	);
}

export function TimelineHeader({
	title,
	subtitle,
	themeToggle,
	helpModal,
	stats,
	nav,
	lang,
	railOffset = true,
	id,
	compact = false,
}: TimelineHeaderProps) {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "boombox";
	return (
		<header
			id={id}
			className={
				compact
					? "pass-it-on-utility-row"
					: `control-bar sticky top-0 z-30 flex w-full flex-col gap-3 border-0 border-b-4 border-(--color-accent) px-4 py-4 md:flex-row md:items-center md:justify-between md:py-5 ${
							railOffset ? "ps-14 md:ps-20" : ""
						}`
			}
		>
			{!compact && (
				<div className="min-w-0">
					<h1 className="font-display text-2xl font-black leading-none tracking-tight text-(--color-control-foreground) md:text-4xl">
						{title}
					</h1>
					<p className="mt-1 text-xs font-black uppercase tracking-widest text-(--color-control-muted)">
						{subtitle}
					</p>
				</div>
			)}

			<div
				className={
					compact
						? "pass-it-on-utility-controls"
						: "flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-3"
				}
			>
				{nav && (
					<Link
						href={nav.href}
						className={
							compact
								? "pass-it-on-utility-button"
								: "z-30 flex h-9 shrink-0 items-center justify-center rounded-full border-2 border-(--color-control-border) bg-(--color-control-background) px-3 text-sm font-black text-(--color-control-foreground) hover:bg-(--color-control-foreground)/10 hover:text-(--color-accent) md:h-10"
						}
					>
						{nav.label}
					</Link>
				)}
				{helpModal && stats && (
					<HelpModal
						translations={helpModal}
						stats={stats}
						lang={lang}
						className={
							compact
								? "pass-it-on-utility-button pass-it-on-help-button"
								: "z-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-(--color-control-border) bg-(--color-control-background) text-sm font-black text-(--color-control-foreground) hover:bg-(--color-control-foreground)/10 hover:text-(--color-accent) md:h-10 md:w-10"
						}
					/>
				)}
				<LanguageSwitcher lang={lang} />
				<button
					type="button"
					role="switch"
					aria-checked={isDark}
					aria-label={themeToggle.label}
					title={themeToggle.label}
					data-selected-theme={theme}
					dir="ltr"
					className="pass-it-on-theme-switch"
					onClick={() => setTheme(isDark ? "classic" : "boombox")}
				>
					<span className="pass-it-on-theme-track" aria-hidden="true">
						<ThemeIcon kind="sun" className="pass-it-on-theme-track-icon" />
						<ThemeIcon kind="moon" className="pass-it-on-theme-track-icon" />
					</span>
					<span className="pass-it-on-theme-thumb" aria-hidden="true">
						<ThemeIcon
							kind={isDark ? "moon" : "sun"}
							className="pass-it-on-theme-thumb-icon"
						/>
					</span>
				</button>
			</div>
		</header>
	);
}
