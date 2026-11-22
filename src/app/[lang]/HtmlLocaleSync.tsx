"use client";

import { useEffect } from "react";

export function HtmlLocaleSync({ lang }: { lang: "en" | "he" }) {
	useEffect(() => {
		const root = document.documentElement;
		root.lang = lang;
		root.dir = lang === "he" ? "rtl" : "ltr";
	}, [lang]);
	return null;
}
