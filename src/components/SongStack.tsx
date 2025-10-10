"use client";

import type { Song } from "@/app/timeline/types";
import { useEffect, useMemo, useState } from "react";
import type { SongTranslations } from "./SongTimelineEntry";
import { ExpandedModal } from "./song-stack/ExpandedModal";
import { getSongCountText } from "./song-stack/SongCountLabel";
import { StackedCards } from "./song-stack/StackedCards";
import { TapToOpenBadge } from "./song-stack/TapToOpenBadge";

type SongStackTranslations = {
	viewAll: string;
	close: string;
	songsLabel: string;
};

type SongStackItem = {
	song: Song;
	timestamp: string;
	leaning: "left" | "right" | "center" | "unknown";
};

type SongStackProps = {
	songs: SongStackItem[];
	lang: "en" | "he";
	t: SongTranslations;
	labels: SongStackTranslations;
	year: number;
};

const STACK_OVERLAP = 140;
const STACK_TRANSLATE = 2;
const STACK_ROTATIONS = [-1.8, 1.2, -0.9, 1.6];
const STACK_SCALES = [0.94, 0.96, 0.92, 0.95];
const OVERLAY_TRANSITION_MS = 350;

export function SongStack({ songs, lang, t, labels, year }: SongStackProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isOverlayVisible, setIsOverlayVisible] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isOverlayVisible) {
			return;
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsExpanded(false);
			}
		};
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = originalOverflow;
		};
	}, [isOverlayVisible]);

	useEffect(() => {
		if (!isOverlayVisible) {
			return;
		}

		if (isExpanded) {
			return;
		}

		const timeout = window.setTimeout(() => {
			setIsOverlayVisible(false);
		}, OVERLAY_TRANSITION_MS);

		return () => {
			window.clearTimeout(timeout);
		};
	}, [isOverlayVisible, isExpanded]);

	const collapsedCards = useMemo(() => songs, [songs]);
	const songCount = songs.length;
	const songCountText = getSongCountText(lang, songCount, labels.songsLabel);

	const openStack = () => {
		if (isOverlayVisible) {
			setIsExpanded(true);
			return;
		}
		setIsOverlayVisible(true);
		requestAnimationFrame(() => {
			setIsExpanded(true);
		});
	};

	const closeStack = () => {
		setIsExpanded(false);
	};

	if (collapsedCards.length === 0) {
		return null;
	}

	return (
		<div className="mt-4" aria-hidden={songCount === 0}>
			<button
				type="button"
				onClick={openStack}
				className={`group relative block w-full text-left focus:outline-none ${lang === "he" ? "text-right" : ""}`}
				aria-expanded={isExpanded}
				aria-label={`${labels.viewAll} ${songCountText}`}
			>
				<StackedCards
					songs={collapsedCards}
					lang={lang}
					t={t}
					isExpanded={isExpanded}
					isOverlayVisible={isOverlayVisible}
					stackRotations={STACK_ROTATIONS}
					stackScales={STACK_SCALES}
					stackTranslate={STACK_TRANSLATE}
					stackOverlap={STACK_OVERLAP}
				/>
				<TapToOpenBadge lang={lang} isExpanded={isExpanded} />
			</button>

			{isMounted && isOverlayVisible && (
				<ExpandedModal
					songs={songs}
					lang={lang}
					t={t}
					year={year}
					isExpanded={isExpanded}
					onClose={closeStack}
					viewAllLabel={labels.viewAll}
					closeLabel={labels.close}
					songCountText={songCountText}
				/>
			)}
		</div>
	);
}
