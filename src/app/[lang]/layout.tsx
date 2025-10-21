export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	return (
		<main lang={lang} dir={lang === "he" ? "rtl" : "ltr"}>
			{children}
		</main>
	);
}
