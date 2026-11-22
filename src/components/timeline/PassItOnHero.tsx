import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HelpModalStats } from "@/components/timeline/HelpModal";
import type { translations } from "@/components/timeline/translations";

type PassItOnCopy = (typeof translations)["en"]["passItOn"];

export function PassItOnHero({
	lang,
	stats,
	eventCount,
	copy,
}: {
	lang: "en" | "he";
	stats: HelpModalStats;
	eventCount: number;
	copy: PassItOnCopy;
}) {
	const heroRef = useRef<HTMLElement | null>(null);
	const [isInViewport, setIsInViewport] = useState(true);
	const [isDocumentVisible, setIsDocumentVisible] = useState(true);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	const dateRange =
		stats.startYear !== null && stats.endYear !== null
			? `${stats.startYear}–${stats.endYear}`
			: copy.noDateRange;
	const catalogSummary = copy.catalogSummary
		.replace("{{songs}}", String(stats.songCount))
		.replace("{{artists}}", String(stats.artistCount))
		.replace("{{range}}", dateRange);
	const eventSummary = copy.eventSummary.replace(
		"{{count}}",
		String(eventCount),
	);
	const motionPaused =
		!isInViewport || !isDocumentVisible || prefersReducedMotion;

	useEffect(() => {
		if (typeof window.matchMedia !== "function") return;
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setPrefersReducedMotion(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);

	useEffect(() => {
		const hero = heroRef.current;
		if (!hero || typeof IntersectionObserver === "undefined") return;
		const observer = new IntersectionObserver(
			([entry]) => setIsInViewport(entry?.isIntersecting ?? false),
			{ threshold: 0.05 },
		);
		observer.observe(hero);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const update = () => setIsDocumentVisible(!document.hidden);
		update();
		document.addEventListener("visibilitychange", update);
		return () => document.removeEventListener("visibilitychange", update);
	}, []);

	return (
		<section
			ref={heroRef}
			className="pass-it-on-hero"
			aria-labelledby="pass-it-on-title"
			data-motion-paused={motionPaused}
		>
			<svg
				className="pass-it-on-hero-ribbon pass-it-on-ribbon-wide"
				viewBox="0 0 1000 700"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path d="M1012 96 C930 40 905 300 770 392 S590 352 556 486 S518 626 500 708" />
				<path
					className="pass-it-on-hero-ribbon-stitch"
					d="M1012 96 C930 40 905 300 770 392 S590 352 556 486 S518 626 500 708"
				/>
			</svg>
			<svg
				className="pass-it-on-hero-ribbon pass-it-on-ribbon-narrow"
				viewBox="0 0 400 800"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path d="M412 372 C340 330 330 560 210 596 S52 640 40 808" />
				<path
					className="pass-it-on-hero-ribbon-stitch"
					d="M412 372 C340 330 330 560 210 596 S52 640 40 808"
				/>
			</svg>
			<div className="pass-it-on-hero-inner">
				<div className="pass-it-on-hero-copy">
					<h1 id="pass-it-on-title" className="pass-it-on-title">
						<span>{copy.titleLead}</span>
						<span>{copy.titleEmphasis}</span>
					</h1>
					<p className="pass-it-on-hebrew" lang="he" dir="rtl">
						{copy.hebrewTagline}
					</p>
					<p className="pass-it-on-subtitle">{copy.subtitle}</p>
				</div>
				<div className="pass-it-on-hero-art">
					<Image
						className="pass-it-on-cassette pass-it-on-cassette-real"
						src="/pass-it-on/cassette-hero.png"
						alt={copy.cassetteAlt}
						width={640}
						height={427}
						priority
					/>
					<div
						className="pass-it-on-j-card"
						dir={lang === "he" ? "rtl" : "ltr"}
					>
						<p>{catalogSummary}</p>
						<p>{eventSummary}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
