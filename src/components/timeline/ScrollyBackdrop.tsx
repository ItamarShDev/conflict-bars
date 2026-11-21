"use client";

import { useEffect, useRef } from "react";

interface EraLayer {
	id: string;
	src: string;
	tint: string;
	darkTint: string;
}

const BACKDROP_LAYERS: EraLayer[] = [
	{
		id: "tel-aviv",
		src: "/pass-it-on/tel-aviv-graffiti.jpg",
		tint: "linear-gradient(180deg, rgba(20, 15, 12, 0.56) 0%, rgba(44, 18, 16, 0.48) 52%, rgba(16, 13, 11, 0.84) 100%)",
		darkTint:
			"linear-gradient(180deg, rgba(20, 15, 12, 0.62) 0%, rgba(40, 16, 15, 0.54) 52%, rgba(14, 11, 9, 0.88) 100%)",
	},
	{
		id: "haifa",
		src: "/pass-it-on/haifa-harbour.jpg",
		tint: "linear-gradient(180deg, rgba(14, 21, 28, 0.58) 0%, rgba(18, 34, 46, 0.48) 52%, rgba(14, 16, 20, 0.84) 100%)",
		darkTint:
			"linear-gradient(180deg, rgba(12, 18, 25, 0.64) 0%, rgba(16, 30, 42, 0.54) 52%, rgba(12, 14, 18, 0.88) 100%)",
	},
	{
		id: "ramon",
		src: "/pass-it-on/ramon-crater.jpg",
		tint: "linear-gradient(180deg, rgba(26, 18, 12, 0.58) 0%, rgba(48, 28, 16, 0.48) 52%, rgba(16, 13, 11, 0.84) 100%)",
		darkTint:
			"linear-gradient(180deg, rgba(24, 16, 11, 0.64) 0%, rgba(44, 24, 14, 0.54) 52%, rgba(14, 11, 9, 0.88) 100%)",
	},
];

function getLayerIndexForYear(year: number | null): number {
	if (year === null) return 0;
	if (year < 2005) return 0;
	if (year < 2014) return 1;
	if (year < 2021) return 2;
	return 0;
}

export function ScrollyBackdrop({
	selectedYear,
}: {
	selectedYear: number | null;
}) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const activeIndex = getLayerIndexForYear(selectedYear);

	useEffect(() => {
		const el = rootRef.current;
		if (!el) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let rafId = 0;

		const updateParallax = () => {
			rafId = 0;
			if (reducedMotion.matches) {
				el.style.setProperty("--scrolly-parallax-y", "0px");
				return;
			}
			const maxScroll = Math.max(
				1,
				document.documentElement.scrollHeight - window.innerHeight,
			);
			const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
			const offset = (progress - 0.5) * -44;
			el.style.setProperty("--scrolly-parallax-y", `${offset.toFixed(1)}px`);
		};

		const onScroll = () => {
			if (!rafId) {
				rafId = window.requestAnimationFrame(updateParallax);
			}
		};

		updateParallax();
		window.addEventListener("scroll", onScroll, { passive: true });
		reducedMotion.addEventListener("change", updateParallax);
		return () => {
			window.removeEventListener("scroll", onScroll);
			reducedMotion.removeEventListener("change", updateParallax);
			if (rafId) window.cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<div
			ref={rootRef}
			className="pass-it-on-scrolly-backdrop"
			aria-hidden="true"
		>
			{BACKDROP_LAYERS.map((layer, index) => (
				<div
					key={layer.id}
					className="pass-it-on-scrolly-backdrop-layer"
					data-active={index === activeIndex}
				>
					<div
						className="pass-it-on-scrolly-backdrop-photo"
						style={{ backgroundImage: `url(${layer.src})` }}
					/>
					<div
						className="pass-it-on-scrolly-backdrop-wash pass-it-on-scrolly-backdrop-wash-light"
						style={{ background: layer.tint }}
					/>
					<div
						className="pass-it-on-scrolly-backdrop-wash pass-it-on-scrolly-backdrop-wash-dark"
						style={{ background: layer.darkTint }}
					/>
				</div>
			))}
			<div className="pass-it-on-scrolly-backdrop-ambient" />
			<div className="pass-it-on-scrolly-backdrop-grain" />
		</div>
	);
}
