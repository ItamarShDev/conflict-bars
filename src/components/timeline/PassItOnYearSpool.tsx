"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { translations } from "@/components/timeline/translations";
import type { TimelineEntryItem } from "@/utils/timeline";
import {
	getMobileDockSpace,
	MOBILE_DOCK_BREAKPOINT,
} from "@/utils/timeline-scroll";

type PassItOnCopy = (typeof translations)["en"]["passItOn"];

function MiniCassetteReel({ side }: { side: "start" | "end" }) {
	return (
		<span
			className={`pass-it-on-scrubber-reel pass-it-on-scrubber-reel-${side}`}
			aria-hidden="true"
		>
			<Image
				src="/pass-it-on/cassette-reel.png"
				alt=""
				width={28}
				height={28}
				className="pass-it-on-scrubber-reel-rotor"
			/>
		</span>
	);
}

export function PassItOnYearSpool({
	years,
	groups,
	selectedYear,
	onSelect,
	copy,
}: {
	years: number[];
	groups: [number, TimelineEntryItem[]][];
	selectedYear: number | null;
	onSelect: (year: number) => void;
	copy: PassItOnCopy;
}) {
	const yearsRef = useRef<HTMLUListElement>(null);
	const railRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const rail = railRef.current;
		if (!rail) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let rafId = 0;

		const updateScrub = () => {
			rafId = 0;
			const maxScroll = Math.max(
				1,
				document.documentElement.scrollHeight - window.innerHeight,
			);
			const pct = Math.min(1, Math.max(0, window.scrollY / maxScroll));
			rail.style.setProperty("--tape-progress", `${(pct * 100).toFixed(1)}%`);
			if (reducedMotion.matches) {
				rail.style.setProperty("--spool-deg", "0deg");
			} else {
				rail.style.setProperty(
					"--spool-deg",
					`${(window.scrollY * 0.55).toFixed(1)}deg`,
				);
			}
		};

		const onScroll = () => {
			if (!rafId) {
				rafId = window.requestAnimationFrame(updateScrub);
			}
		};

		updateScrub();
		window.addEventListener("scroll", onScroll, { passive: true });
		reducedMotion.addEventListener("change", updateScrub);
		return () => {
			window.removeEventListener("scroll", onScroll);
			reducedMotion.removeEventListener("change", updateScrub);
			if (rafId) window.cancelAnimationFrame(rafId);
		};
	}, []);

	useEffect(() => {
		const rail = railRef.current;
		const root = rail?.closest<HTMLElement>(".pass-it-on");
		if (!rail || !root) return;

		const mobileViewport = window.matchMedia(
			`(max-width: ${MOBILE_DOCK_BREAKPOINT}px)`,
		);
		const updateDockSpace = () => {
			const space = getMobileDockSpace(
				rail.getBoundingClientRect().height,
				mobileViewport.matches,
			);
			root.style.setProperty("--pass-it-on-mobile-dock-space", `${space}px`);
		};
		const observer =
			typeof ResizeObserver === "undefined"
				? null
				: new ResizeObserver(updateDockSpace);
		observer?.observe(rail);
		window.addEventListener("resize", updateDockSpace);
		mobileViewport.addEventListener("change", updateDockSpace);
		updateDockSpace();

		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", updateDockSpace);
			mobileViewport.removeEventListener("change", updateDockSpace);
			root.style.removeProperty("--pass-it-on-mobile-dock-space");
		};
	}, []);

	useEffect(() => {
		const rail = railRef.current;
		const yearsSection = rail
			?.closest(".pass-it-on-chronology")
			?.querySelector<HTMLElement>(".pass-it-on-years");
		if (!rail || !yearsSection) return;

		const setVisibility = (visible: boolean) => {
			rail.dataset.timelineVisible = visible ? "true" : "false";
		};
		if (typeof IntersectionObserver === "undefined") {
			setVisibility(true);
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => setVisibility(entries[0]?.isIntersecting ?? false),
			{ rootMargin: "0px 0px -15% 0px" },
		);
		observer.observe(yearsSection);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const rail = yearsRef.current;
		const active = rail?.querySelector<HTMLButtonElement>(
			`[data-year="${selectedYear}"]`,
		);
		if (!rail || !active) return;

		const railRect = rail.getBoundingClientRect();
		const activeRect = active.getBoundingClientRect();
		const centerDelta =
			activeRect.left +
			activeRect.width / 2 -
			(railRect.left + rail.clientWidth / 2);
		const left = rail.scrollLeft + centerDelta;
		const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
			.matches
			? "auto"
			: "smooth";
		rail.scrollTo({ left, behavior });
	}, [selectedYear]);

	const entryFlags = (year: number) => {
		const entries = groups.find(([groupYear]) => groupYear === year)?.[1] ?? [];
		return {
			hasMusic: entries.some((entry) => entry.type === "song"),
			hasHistory: entries.some((entry) => entry.type === "conflict"),
		};
	};

	return (
		<nav
			className="pass-it-on-year-rail"
			aria-label={copy.yearNavigation}
			ref={railRef}
		>
			<div className="pass-it-on-rail-year-row">
				<div className="pass-it-on-tape-window">
					<span className="pass-it-on-tape-progress" aria-hidden="true" />
					<ul className="pass-it-on-rail-years" ref={yearsRef}>
						{years.map((year) => {
							const flags = entryFlags(year);
							return (
								<li key={year}>
									<button
										type="button"
										className="pass-it-on-year-button"
										data-year={year}
										aria-label={`${copy.selectYear} ${year}`}
										aria-pressed={year === selectedYear}
										onClick={() => onSelect(year)}
									>
										<span>{year}</span>
										<span
											className="pass-it-on-year-markers"
											aria-hidden="true"
										>
											<i
												className="pass-it-on-marker-music"
												data-active={flags.hasMusic}
											/>
											<i
												className="pass-it-on-marker-history"
												data-active={flags.hasHistory}
											/>
										</span>
									</button>
								</li>
							);
						})}
					</ul>
					<MiniCassetteReel side="end" />
				</div>
			</div>
		</nav>
	);
}
