"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitcher({ lang }: { lang: "en" | "he" }) {
	const pathname = usePathname();
	const nextLang = lang === "en" ? "he" : "en";
	const nextPath = `/${nextLang}${pathname.slice(3) || ""}`;

	return (
		<Link
			href={nextPath}
			className="flex h-8 items-center rounded-full border border-(--color-control-border) bg-(--color-control-background) px-3 text-xs font-bold uppercase tracking-wider text-(--color-control-foreground) transition hover:bg-(--color-muted) hover:text-(--color-accent)"
		>
			{lang === "en" ? "EN / עב" : "עב / EN"}
		</Link>
	);
}
