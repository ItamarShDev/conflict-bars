"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IsraelFlag() {
	return (
		<svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
			<rect width="30" height="20" fill="#fff" />
			<path d="M2 3.5h26M2 16.5h26" stroke="#0038b8" strokeWidth="2" />
			<path
				d="m15 5.5 4.5 8h-9l4.5-8Zm0 9-4.5-8h9l-4.5 8Z"
				fill="none"
				stroke="#0038b8"
				strokeWidth="1.15"
			/>
		</svg>
	);
}

function UnitedKingdomFlag() {
	return (
		<svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
			<rect width="30" height="20" fill="#1d3f8b" />
			<path d="m0 0 30 20M30 0 0 20" stroke="#fff" strokeWidth="4.5" />
			<path d="m0 0 30 20M30 0 0 20" stroke="#c8102e" strokeWidth="1.6" />
			<path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="7" />
			<path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3" />
		</svg>
	);
}

export function LanguageSwitcher({ lang }: { lang: "en" | "he" }) {
	const pathname = usePathname() ?? `/${lang}`;
	const nextLang = lang === "en" ? "he" : "en";
	const nextPath = `/${nextLang}${pathname.slice(3) || ""}`;
	const switchLabel =
		lang === "en" ? "Switch language to Hebrew" : "החלפת שפה לאנגלית";

	return (
		<fieldset className="pass-it-on-language-switcher" dir="ltr">
			<legend className="sr-only">
				{lang === "en" ? "Language selection" : "בחירת שפה"}
			</legend>
			{lang === "he" ? (
				<span
					className="pass-it-on-language-option is-current h-11 w-11"
					aria-current="true"
				>
					<span className="sr-only">עברית</span>
					<IsraelFlag />
				</span>
			) : (
				<Link
					href={nextPath}
					className="pass-it-on-language-option pass-it-on-language-link h-11 w-11"
					aria-label={switchLabel}
					title={switchLabel}
				>
					<IsraelFlag />
				</Link>
			)}
			{lang === "en" ? (
				<span
					className="pass-it-on-language-option is-current h-11 w-11"
					aria-current="true"
				>
					<span className="sr-only">English</span>
					<UnitedKingdomFlag />
				</span>
			) : (
				<Link
					href={nextPath}
					className="pass-it-on-language-option pass-it-on-language-link h-11 w-11"
					aria-label={switchLabel}
					title={switchLabel}
				>
					<UnitedKingdomFlag />
				</Link>
			)}
		</fieldset>
	);
}
