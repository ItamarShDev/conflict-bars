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
		tint: "linear-gradient(180deg, rgba(247, 241, 229, 0.84) 0%, rgba(235, 222, 199, 0.78) 55%, rgba(244, 236, 221, 0.90) 100%)",
		darkTint:
			"linear-gradient(180deg, rgba(24, 18, 15, 0.74) 0%, rgba(36, 20, 18, 0.68) 55%, rgba(16, 13, 11, 0.88) 100%)",
	},
	{
		id: "haifa",
		src: "/pass-it-on/haifa-harbour.jpg",
		tint: "linear-gradient(180deg, rgba(242, 240, 232, 0.84) 0%, rgba(219, 227, 232, 0.78) 55%, rgba(244, 238, 226, 0.90) 100%)",
		darkTint:
			"linear-gradient(180deg, rgba(16, 23, 30, 0.76) 0%, rgba(20, 32, 42, 0.68) 55%, rgba(14, 16, 20, 0.88) 100%)",
	},
	{
		id: "ramon",
		src: "/pass-it-on/ramon-crater.jpg",
		tint: "linear-gradient(180deg, rgba(247, 239, 226, 0.84) 0%, rgba(235, 217, 194, 0.78) 55%, rgba(244, 236, 221, 0.90) 100%)",
		darkTint:
			"linear-gradient(180deg, rgba(30, 20, 14, 0.76) 0%, rgba(44, 26, 18, 0.68) 55%, rgba(16, 13, 11, 0.88) 100%)",
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
			<div className="pass-it-on-scrolly-backdrop-grain" />
		</div>
	);
}
