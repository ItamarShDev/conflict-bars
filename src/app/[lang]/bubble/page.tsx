import { redirect } from "next/navigation";
import { requireLocale } from "@/utils/locale";

export default async function BubblePage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	requireLocale(lang);
	redirect(lang === "he" ? "/stats?tab=leaning" : `/${lang}/stats?tab=leaning`);
}
