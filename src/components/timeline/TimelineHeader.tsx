"use client";

import Link from "next/link";
import { HelpModal, type HelpModalStats } from "./HelpModal";
import type { translations } from "./translations";

interface TimelineHeaderProps {
	title: string;
	subtitle: string;
	helpModal?: (typeof translations)["en"]["helpModal"];
	stats?: HelpModalStats;
	nav?: { href: string; label: string };
	languageToggle?: { href: string; label: string };
	lang: "en" | "he";
	railOffset?: boolean;
	id?: string;
	compact?: boolean;
}

export function TimelineHeader({
	title,
	subtitle,
	helpModal,
	stats,
	nav,
	languageToggle,
	lang,
	railOffset = true,
	id,
	compact = false,
}: TimelineHeaderProps) {
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
				{languageToggle && (
					<Link
						href={languageToggle.href}
						className={
							compact
								? "pass-it-on-utility-button"
								: "z-30 flex h-9 shrink-0 items-center justify-center rounded-full border-2 border-(--color-control-border) bg-(--color-control-background) px-3 text-sm font-black text-(--color-control-foreground) hover:bg-(--color-control-foreground)/10 hover:text-(--color-accent) md:h-10"
						}
					>
						{languageToggle.label}
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
			</div>
		</header>
	);
}
