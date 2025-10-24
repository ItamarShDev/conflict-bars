interface TimelineHeaderProps {
	title: string;
	lang: "en" | "he";
}

export function TimelineHeader({ title, lang }: TimelineHeaderProps) {
	return (
		<h1
			className={`text-center text-3xl my-7 font-bold tracking-tight ${lang === "he" ? "text-slate-900" : "text-slate-900"} dark:text-slate-100`}
		>
			{title}
		</h1>
	);
}
