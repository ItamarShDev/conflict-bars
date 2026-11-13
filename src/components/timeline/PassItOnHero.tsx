import { useId } from "react";
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
	const cassetteId = `pass-it-on-cassette-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
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

	return (
		<section className="pass-it-on-hero" aria-labelledby="pass-it-on-title">
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
					<p className="pass-it-on-kicker">{copy.kicker}</p>
					<h1 id="pass-it-on-title" className="pass-it-on-title">
						<span>{copy.titleLead}</span>
						<span>{copy.titleEmphasis}</span>
					</h1>
					<p
						className="pass-it-on-hebrew"
						lang={lang === "en" ? "he" : "en"}
						dir={lang === "en" ? "rtl" : "ltr"}
					>
						{copy.hebrewTagline}
					</p>
					<p className="pass-it-on-subtitle">{copy.subtitle}</p>
					<a className="pass-it-on-cta" href="#pass-it-on-chronology">
						<span>{copy.cta}</span>
						<span aria-hidden="true">↓</span>
					</a>
				</div>
				<div className="pass-it-on-hero-art">
					<svg
						className="pass-it-on-cassette"
						viewBox="0 0 640 405"
						role="img"
						aria-labelledby={`${cassetteId}-title ${cassetteId}-description`}
						lang={lang}
						style={{ direction: "ltr" }}
					>
						<title id={`${cassetteId}-title`}>{copy.cassetteAlt}</title>
						<desc id={`${cassetteId}-description`}>
							{copy.cassetteDescription}
						</desc>
						<defs>
							<clipPath id={`${cassetteId}-window`}>
								<rect x="86" y="67" width="468" height="106" rx="11" />
							</clipPath>
						</defs>
						<path
							d="M55 34 Q79 12 112 18 L553 34 Q588 36 591 71 L575 345 Q573 375 541 380 L76 366 Q45 364 45 332 L40 74 Q39 45 55 34Z"
							fill="#f5d873"
							stroke="#564631"
							strokeWidth="7"
						/>
						<path
							d="M70 50 Q85 39 103 43 L544 58 Q562 59 562 77 L551 328 Q550 344 533 346 L88 333 Q69 332 69 315Z"
							fill="#f7e9b7"
							stroke="#897550"
							strokeWidth="2"
						/>
						<image
							href="/pass-it-on/tel-aviv-graffiti.jpg"
							x="86"
							y="67"
							width="468"
							height="106"
							preserveAspectRatio="xMidYMid slice"
							clipPath={`url(#${cassetteId}-window)`}
						/>
						<path d="M86 186 L550 198 L546 222 L90 210Z" fill="#b6533e" />
						<text
							x="330"
							y="207"
							fill="#fff2d1"
							textAnchor="end"
							fontFamily='"Pass It On Hebrew", cursive'
							fontSize="20"
							direction="rtl"
							unicodeBidi="plaintext"
						>
							מיקס של זמן
						</text>
						<text
							x="524"
							y="218"
							fill="#fff2d1"
							textAnchor="end"
							fontFamily='"Courier New", Courier, monospace'
							fontSize="8"
							letterSpacing="1"
							direction="ltr"
							unicodeBidi="isolate"
						>
							CONFLICT BARS / SIDE A
						</text>
						<rect
							x="110"
							y="233"
							width="420"
							height="75"
							rx="20"
							fill="#d9c796"
							stroke="#8b7951"
							strokeWidth="2"
						/>
						{[210, 430].map((x) => (
							<g key={x}>
								<circle cx={x} cy="269" r="31" fill="#645947" />
								<circle cx={x} cy="269" r="22" fill="#f6e9c3" />
								<circle cx={x} cy="269" r="9" fill="#5b4a32" />
								<path
									d={`M${x} 246v46m-23-23h46m-39-16 32 32m0-32-32 32`}
									stroke="#806e49"
									strokeWidth="2"
								/>
							</g>
						))}
						<path
							d="M239 269 C278 238 354 238 401 269 C354 300 278 300 239 269Z"
							fill="none"
							stroke="#624d36"
							strokeWidth="3"
						/>
						<text
							x="320"
							y="333"
							fill="#5e4c37"
							textAnchor="middle"
							fontFamily='"Courier New", Courier, monospace'
							fontSize="8"
							letterSpacing="1"
							direction={lang === "he" ? "rtl" : "ltr"}
							unicodeBidi="isolate"
						>
							{copy.cassetteCaption}
						</text>
						<circle cx="82" cy="71" r="5" fill="#58452f" />
						<circle cx="550" cy="78" r="5" fill="#58452f" />
						<circle cx="84" cy="317" r="5" fill="#58452f" />
						<circle cx="540" cy="324" r="5" fill="#58452f" />
					</svg>
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
