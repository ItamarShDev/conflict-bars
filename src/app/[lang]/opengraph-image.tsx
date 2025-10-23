import { ImageResponse } from "next/og";
import { translations } from "@/components/timeline/translations";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";
export const alt = "Conflict Bars – Interactive Israeli hip-hop timeline";

const descriptionByLang: Record<string, string> = {
	en: "An interactive timeline exploring Israeli hip-hop artists and key events across years and decades",
	he: "ציר זמן אינטראקטיבי לחקר אמני היפ־הופ ישראליים ואירועים מרכזיים לאורך השנים",
};

export default function Image({
	params,
}: {
	params: { lang: string };
}) {
	const lang = params.lang === "he" ? "he" : "en";
	const isHebrew = lang === "he";
	const translation = translations[lang];
	const description = descriptionByLang[lang] ?? descriptionByLang.en;

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				width: "100%",
				height: "100%",
				background: "linear-gradient(135deg, #0f172a, #1e293b)",
				padding: "64px",
				color: "#f8fafc",
				fontFamily:
					'"Geist", "Segoe UI", "Helvetica Neue", "Arial", "Noto Sans Hebrew", sans-serif',
				direction: isHebrew ? "rtl" : "ltr",
			}}
		>
			<header
				style={{
					display: "flex",
					flexDirection: isHebrew ? "row-reverse" : "row",
					alignItems: "center",
					gap: "16px",
				}}
			>
				<div
					style={{
						background: "rgba(2, 132, 199, 0.2)",
						border: "1px solid rgba(56, 189, 248, 0.4)",
						color: "#38bdf8",
						padding: "8px 18px",
						borderRadius: "9999px",
						fontSize: 28,
						fontWeight: 600,
					}}
				>
					{isHebrew ? "סצנת היפ־הופ ישראלית" : "Israeli Hip-Hop Scene"}
				</div>
				<div
					style={{
						opacity: 0.6,
						fontSize: 24,
					}}
				>
					{isHebrew ? "סכסוכים בחרוזים" : "Conflict Bars"}
				</div>
			</header>
			<main
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "32px",
				}}
			>
				<div
					style={{
						fontSize: 86,
						fontWeight: 700,
						lineHeight: 1.05,
					}}
				>
					{translation.title}
				</div>
				<div
					style={{
						fontSize: 32,
						lineHeight: 1.4,
						opacity: 0.85,
						maxWidth: "80%",
					}}
				>
					{description}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: isHebrew ? "row-reverse" : "row",
						gap: "20px",
					}}
				>
					{[
						{
							label: isHebrew ? "סכסוך" : "Conflict",
							borderColor: "#ef4444",
							background: "rgba(239, 68, 68, 0.15)",
							caption: isHebrew
								? "אירוע מרכזי מחזית הסכסוך"
								: "Headline event from the conflict",
						},
						{
							label: isHebrew ? "שיר" : "Song",
							borderColor: "#3b82f6",
							background: "rgba(59, 130, 246, 0.15)",
							caption: isHebrew
								? "קול אמנים מהתקופה"
								: "Artists' voices from the era",
						},
						{
							label: isHebrew ? "הקשר" : "Context",
							borderColor: "#64748b",
							background: "rgba(100, 116, 139, 0.2)",
							caption: isHebrew
								? "סיכום ההשפעה והתגובה"
								: "Impact and response summary",
						},
					].map((card) => (
						<div
							key={card.label}
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								width: "33%",
								borderRadius: "24px",
								border: `2px solid ${card.borderColor}`,
								background: card.background,
								padding: "24px",
								color: "#f8fafc",
							}}
						>
							<div
								style={{
									fontSize: 30,
									fontWeight: 600,
								}}
							>
								{card.label}
							</div>
							<div
								style={{
									fontSize: 24,
									opacity: 0.85,
									lineHeight: 1.35,
								}}
							>
								{card.caption}
							</div>
						</div>
					))}
				</div>
			</main>
			<footer
				style={{
					display: "flex",
					flexDirection: isHebrew ? "row-reverse" : "row",
					justifyContent: "space-between",
					alignItems: "center",
					borderTop: "1px solid rgba(148, 163, 184, 0.4)",
					paddingTop: "24px",
					fontSize: 24,
					opacity: 0.8,
				}}
			>
				<span>{isHebrew ? "conflictbars.vercel.app/he" : "conflictbars.vercel.app/en"}</span>
				<span>
					{isHebrew
						? "אמנות, פוליטיקה וקולות מרובים ברגע אחד"
						: "Art, politics, and many voices in one moment"}
				</span>
			</footer>
		</div>,
		{
			...size,
		}
	);
}
