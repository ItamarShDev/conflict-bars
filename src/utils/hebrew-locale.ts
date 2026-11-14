import { notFound } from "next/navigation";

export function requireHebrewLocale(locale: string): asserts locale is "he" {
	if (locale !== "he") notFound();
}
