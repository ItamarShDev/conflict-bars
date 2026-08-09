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
			className="flex h-8 items-center border-2 border-(--color-control-border) bg-(--color-control-background) px-3 text-xs font-black tracking-wider text-(--color-control-foreground) transition wobble-sm hover:bg-(--color-control-foreground)/10 hover:text-(--color-accent)"
		>
			{lang === "en" ? "English / עברית" : "עברית / English"}
		</Link>
	);
}
