import { notFound } from "next/navigation";

export function requireLocale(locale: string): asserts locale is "en" | "he" {
	if (locale !== "en" && locale !== "he") notFound();
}
