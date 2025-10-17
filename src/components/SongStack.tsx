"use client";

import { useEffect, useMemo, useState } from "react";
import { translations } from "@/components/timeline/translations";
import type { Song } from "../../timeline/types";
import { ExpandedModal } from "./song-stack/ExpandedModal";
import { getSongCountText } from "./song-stack/SongCountLabel";
import { StackedCards } from "./song-stack/StackedCards";

type SongStackItem = {
	song: Song;
	timestamp: string;
	leaning: "left" | "right" | "center" | "unknown";
};

type SongStackProps = {
	songs: SongStackItem[];
	lang: "en" | "he";
	year: number;
};

const OVERLAY_TRANSITION_MS = 350;

export function SongStack({ songs, lang, year }: SongStackProps) {
	const t = translations[lang];
	const [isExpanded, setIsExpanded] = useState(false);
	const [isOverlayVisible, setIsOverlayVisible] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// Check if hash matches current year and open preview
		const hash = window.location.hash.slice(1); // Remove '#'
		if (hash === String(year)) {
			window.location.hash = `${year}`;
			setIsOverlayVisible(true);
			requestAnimationFrame(() => {
				setIsExpanded(true);
			});
		}
	}, [year]);

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
	const songCountText = getSongCountText(lang, songCount, t.stack.songsLabel);

	const openStack = () => {
		if (isOverlayVisible) {
			setIsExpanded(true);
			return;
		}
		window.location.hash = `${year}`;
		setIsOverlayVisible(true);
		requestAnimationFrame(() => {
			setIsExpanded(true);
		});
	};

	const closeStack = () => {
		setIsExpanded(false);
		window.history.replaceState(null, "", window.location.pathname);
	};

	if (collapsedCards.length === 0) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={openStack}
				className={`w-full text-left focus:outline-none ${lang === "he" ? "text-right" : ""}`}
				aria-expanded={isExpanded}
				aria-label={`${t.stack.viewAll} ${songCountText}`}
			>
				<StackedCards
					songs={collapsedCards}
					lang={lang}
					isExpanded={isExpanded}
					isOverlayVisible={isOverlayVisible}
				/>
			</button>

			{isMounted && isOverlayVisible && (
				<ExpandedModal
					songs={songs}
					lang={lang}
					year={year}
					isExpanded={isExpanded}
					onClose={closeStack}
					songCountText={songCountText}
				/>
			)}
		</>
	);
}
