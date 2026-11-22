import { ImageResponse } from "next/og";
import { translations } from "@/components/timeline/translations";
import { requireLocale } from "@/utils/locale";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";
export const alt = "חרוזים מסוכסכים – ציר זמן אינטראקטיבי";

function fixRTL(text: string) {
	return text
		.split(/\s+/)
		.map((word) => Array.from(word).reverse().join(""))
		.reverse()
		.join(" ");
}

const baseUrl = "www.conflictbars.org";
const cassetteYears = ["2025", "2023", "2014", "2006", "2000", "1987"];

function CassetteReel() {
	return (
		<svg
			width="34"
			height="34"
			viewBox="0 0 40 40"
			aria-hidden="true"
			style={{ flexShrink: 0 }}
		>
			<circle
				cx="20"
				cy="20"
				r="17.5"
				fill="#120f0d"
				stroke="#5c5146"
				strokeWidth="1.5"
			/>
			<circle
				cx="20"
				cy="20"
				r="10.5"
				fill="#2a241f"
				stroke="#d4b56a"
				strokeWidth="1.4"
			/>
			<path
				d="M18.4 10.5 L21.6 10.5 L21 15 L19 15 Z M27.8 23.6 L26.2 26.4 L22.5 23.6 L23.5 21.8 Z M12.2 23.6 L13.8 26.4 L17.5 23.6 L16.5 21.8 Z"
				fill="#f5d873"
			/>
			<circle cx="20" cy="20" r="4.2" fill="#0d0b0a" />
		</svg>
	);
}

async function loadHeebo() {
	const weights = [400, 700, 900] as const;
	return Promise.all(
		weights.map(async (weight) => {
			const css = await fetch(
				`https://fonts.googleapis.com/css2?family=Heebo:wght@${weight}`,
			).then((res) => res.text());
			const match = css.match(
				/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/,
			);
			if (!match) {
				throw new Error(`Could not load Heebo ${weight}`);
			}
			const data = await fetch(match[1]).then((res) => res.arrayBuffer());
			return {
				name: "Heebo",
				data,
				weight,
				style: "normal" as const,
			};
		}),
	);
}

export default async function Image({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	requireLocale(lang);
	const translation = translations.he;
	const description = fixRTL(
		"ציר זמן אינטראקטיבי של היפ-הופ ישראלי ופלסטיני והסכסוכים שעיצבו אותו",
	);

	const cards = [
		{
			label: "שמאל / מחאה",
			caption: "קולות ביקורתיים ושלום",
			edgeSide: "left" as const,
			edgeGradient: "linear-gradient(180deg, #ff2e55 0%, #fb7185 100%)",
			badgeColor: "#be123c",
			badgeBg: "rgba(255, 46, 85, 0.14)",
		},
		{
			label: "מרכז / סאטירה",
			caption: "תיעוד חברתי ומבט אישי",
			edgeSide: "top" as const,
			edgeGradient: "linear-gradient(90deg, #f59e0b 0%, #fde68a 100%)",
			badgeColor: "#b45309",
			badgeBg: "rgba(245, 158, 11, 0.16)",
		},
		{
			label: "ימין / לאומי",
			caption: "שירי חוסן, שייכות ולאומיות",
			edgeSide: "right" as const,
			edgeGradient: "linear-gradient(180deg, #0ea5e9 0%, #38bdf8 100%)",
			badgeColor: "#0369a1",
			badgeBg: "rgba(14, 165, 233, 0.15)",
		},
	];

	return new ImageResponse(
		<div
			lang="he"
			dir="rtl"
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				width: "100%",
				height: "100%",
				direction: "ltr",
				fontFamily: '"Heebo", "Noto Sans Hebrew", sans-serif',
				color: "#f7f1e3",
				padding: "40px 56px 36px",
				backgroundColor: "#0e0c0a",
				backgroundImage: [
					"radial-gradient(circle at 14% 72%, rgba(255,46,85,0.22) 0%, transparent 45%)",
					"radial-gradient(circle at 86% 72%, rgba(14,165,233,0.22) 0%, transparent 45%)",
					"radial-gradient(circle at 50% 0%, rgba(245,216,115,0.14) 0%, transparent 50%)",
				].join(", "),
			}}
		>
			{/* Top 3D Cassette Scrubber Bar */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 18,
					padding: "12px 18px",
					borderRadius: 16,
					background: "linear-gradient(180deg, #241f1b 0%, #161210 100%)",
					border: "1px solid rgba(255, 246, 226, 0.16)",
					boxShadow: "0 12px 28px rgba(0, 0, 0, 0.5)",
				}}
			>
				<CassetteReel />
				<div
					style={{
						position: "relative",
						display: "flex",
						flex: 1,
						alignItems: "center",
						justifyContent: "space-between",
						padding: "8px 18px",
						borderRadius: 10,
						background: "#0d0a09",
						border: "1px solid rgba(255, 246, 226, 0.12)",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							bottom: 0,
							width: "58%",
							background:
								"linear-gradient(270deg, rgba(255,46,85,0.34) 0%, rgba(245,158,11,0.26) 55%, rgba(14,165,233,0.3) 100%)",
						}}
					/>
					{cassetteYears.map((year) => {
						const isActive = year === "2000";
						return (
							<div
								key={year}
								style={{
									position: "relative",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									padding: "4px 14px",
									borderRadius: 999,
									fontSize: 18,
									fontWeight: isActive ? 900 : 700,
									color: isActive ? "#1b1612" : "rgba(247, 241, 227, 0.8)",
									background: isActive
										? "#f5d873"
										: "rgba(255, 255, 255, 0.06)",
								}}
							>
								{year}
							</div>
						);
					})}
				</div>
				<CassetteReel />
			</div>

			{/* Hero Title + Conflict Anchor */}
			<header
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					gap: 10,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
					}}
				>
					<span
						style={{
							fontSize: 19,
							fontWeight: 700,
							color: "#fde68a",
							letterSpacing: "0.04em",
						}}
					>
						1987–2025
					</span>
					<div
						style={{
							display: "flex",
							background: "rgba(245, 216, 115, 0.16)",
							color: "#f5d873",
							padding: "5px 16px",
							border: "1px solid rgba(245, 216, 115, 0.45)",
							borderRadius: 999,
							fontSize: 20,
							fontWeight: 700,
						}}
					>
						{fixRTL("ארכיון קלטת אינטראקטיבי")}
					</div>
				</div>

				<h1
					style={{
						fontSize: 72,
						fontWeight: 900,
						lineHeight: 1.05,
						margin: 0,
						color: "#fffaf0",
					}}
				>
					{fixRTL(translation.title)}
				</h1>

				<p
					style={{
						fontSize: 24,
						lineHeight: 1.35,
						margin: 0,
						color: "rgba(247, 241, 227, 0.82)",
					}}
				>
					{description}
				</p>
			</header>

			{/* Physical Political Spectrum Cards */}
			<div
				style={{
					display: "flex",
					gap: 20,
					alignItems: "stretch",
				}}
			>
				{cards.map((card) => (
					<div
						key={card.label}
						style={{
							position: "relative",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							alignItems: "flex-end",
							flex: 1,
							background: "linear-gradient(180deg, #fffdf8 0%, #f6eddd 100%)",
							color: "#1b1612",
							borderRadius: 16,
							boxShadow: "0 14px 30px rgba(0, 0, 0, 0.45)",
							padding: "22px 26px",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								position: "absolute",
								...(card.edgeSide === "left"
									? { top: 0, bottom: 0, left: 0, width: 10 }
									: card.edgeSide === "right"
										? { top: 0, bottom: 0, right: 0, width: 10 }
										: { top: 0, left: 0, right: 0, height: 8 }),
								background: card.edgeGradient,
							}}
						/>
						<div
							style={{
								display: "flex",
								padding: "4px 12px",
								borderRadius: 999,
								background: card.badgeBg,
								color: card.badgeColor,
								fontSize: 22,
								fontWeight: 900,
							}}
						>
							{fixRTL(card.label)}
						</div>
						<div
							style={{
								fontSize: 21,
								fontWeight: 400,
								color: "#4d4238",
								lineHeight: 1.35,
								marginTop: 10,
							}}
						>
							{fixRTL(card.caption)}
						</div>
					</div>
				))}
			</div>

			{/* Footer */}
			<footer
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderTop: "1px solid rgba(247, 241, 227, 0.18)",
					paddingTop: 16,
					fontSize: 21,
					color: "rgba(247, 241, 227, 0.78)",
				}}
			>
				<span style={{ fontWeight: 700, color: "#f5d873" }}>
					{`${baseUrl}/he`}
				</span>
				<span>
					{fixRTL("אירועים היסטוריים, שירים והקשר פוליטי בציר זמן אחד")}
				</span>
			</footer>
		</div>,
		{
			...size,
			fonts: await loadHeebo(),
		},
	);
}
