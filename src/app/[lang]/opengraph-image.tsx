import { ImageResponse } from "next/og";
import { translations } from "@/components/timeline/translations";

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

const descriptionByLang: Record<string, string> = {
	en: "Interactive timeline of Israeli hip-hop and the conflicts that shaped it",
	he: "ציר זמן אינטראקטיבי של היפ-הופ ישראלי והסכסוכים שעיצבו אותו",
};

const baseUrl = "www.conflictbars.org";

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
	const isHebrew = lang !== "en";
	const activeLang = isHebrew ? "he" : "en";
	const translation = translations[activeLang];
	const description = isHebrew
		? fixRTL(descriptionByLang[activeLang])
		: descriptionByLang[activeLang];

	const colors = {
		background: "#1c1b18",
		foreground: "#f4f1ea",
		accent: "#ff2d55",
		cardBg: "#fffdf5",
		border: "#1c1b18",
		left: "#ff2d55",
		right: "#00aaff",
		context: "#9e9a93",
	};

	const cards = [
		{
			label: isHebrew ? "סכסוך" : "Conflict",
			caption: isHebrew
				? "אירוע מרכזי מחזית הסכסוך"
				: "Headline event from the conflict",
			borderColor: colors.left,
		},
		{
			label: isHebrew ? "שיר" : "Song",
			caption: isHebrew ? "קול אמנים מהתקופה" : "Artists' voices from the era",
			borderColor: colors.right,
		},
		{
			label: isHebrew ? "הקשר" : "Context",
			caption: isHebrew
				? "סיכום ההשפעה והתגובה"
				: "Impact and response summary",
			borderColor: colors.context,
		},
	];

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				width: "100%",
				height: "100%",
				direction: "ltr",
				fontFamily: '"Heebo", "Noto Sans Hebrew", sans-serif',
				color: colors.foreground,
				padding: 64,
				backgroundColor: colors.background,
				backgroundImage: [
					"radial-gradient(circle at 50% 0%, rgba(255,45,85,0.08) 0%, transparent 55%)",
					"repeating-linear-gradient(90deg, rgba(244,241,234,0.04) 0, transparent 1px, transparent 80px)",
					"repeating-linear-gradient(0deg, rgba(244,241,234,0.04) 0, transparent 1px, transparent 80px)",
				].join(", "),
				backgroundSize: "100% 100%, 80px 80px, 80px 80px",
			}}
		>
			<header style={{ display: "flex", flexDirection: "column", gap: 32 }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 16,
					}}
				>
					<div
						style={{
							background: colors.accent,
							color: colors.cardBg,
							padding: "10px 22px",
							border: `2px solid ${colors.border}`,
							borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
							boxShadow: "5px 5px 0 rgba(0,0,0,0.18)",
							fontSize: 26,
							fontWeight: 800,
						}}
					>
						{isHebrew
							? fixRTL("סצנת היפ-הופ הישראלית")
							: "Israeli Hip-Hop Scene"}
					</div>
					<div style={{ fontSize: 24, opacity: 0.7, fontWeight: 400 }}>
						{isHebrew ? fixRTL(translation.title) : translation.title}
					</div>
				</div>

				<h1
					style={{
						fontSize: 86,
						fontWeight: 900,
						lineHeight: 1.05,
						margin: 0,
					}}
				>
					{isHebrew ? fixRTL(translation.title) : translation.title}
				</h1>

				<p
					style={{
						fontSize: 26,
						lineHeight: 1.4,
						opacity: 0.85,
						maxWidth: "95%",
					}}
				>
					{description}
				</p>
			</header>

			<div
				style={{
					display: "flex",
					gap: 24,
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
							flex: 1,
							minHeight: 0,
							background: colors.cardBg,
							color: colors.border,
							border: `3px solid ${card.borderColor}`,
							borderRadius: "16px 255px 16px 225px / 255px 16px 225px 16px",
							boxShadow: "6px 6px 0 rgba(0,0,0,0.18)",
							padding: 32,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								position: "absolute",
								top: -14,
								left: 24,
								width: 80,
								height: 24,
								background: "rgba(255,255,255,0.35)",
								border: "1px solid rgba(0,0,0,0.08)",
								transform: "rotate(-35deg)",
							}}
						/>
						<div style={{ fontSize: 36, fontWeight: 800 }}>
							{isHebrew ? fixRTL(card.label) : card.label}
						</div>
						<div
							style={{
								fontSize: 24,
								fontWeight: 400,
								opacity: 0.85,
								lineHeight: 1.35,
							}}
						>
							{isHebrew ? fixRTL(card.caption) : card.caption}
						</div>
					</div>
				))}
			</div>

			<footer
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderTop: "2px solid rgba(244,241,234,0.3)",
					paddingTop: 24,
					fontSize: 24,
					opacity: 0.8,
				}}
			>
				<span style={{ fontWeight: 700 }}>
					{isHebrew ? `${baseUrl}/he` : `${baseUrl}/en`}
				</span>
				<span>
					{isHebrew
						? fixRTL("אמנות, פוליטיקה וקולות מרובים ברגע אחד")
						: "Art, politics, and many voices in one moment"}
				</span>
			</footer>
		</div>,
		{
			...size,
			fonts: await loadHeebo(),
		},
	);
}
