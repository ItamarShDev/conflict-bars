import Link from "next/link";

export default function NotFound() {
	return (
		<main
			lang="he"
			dir="rtl"
			className="flex min-h-screen items-center justify-center bg-(--color-background) px-6 py-16 text-(--color-foreground)"
		>
			<section
				aria-labelledby="not-found-title"
				className="control-bar flex w-full max-w-xl flex-col items-center gap-4 p-8 text-center md:p-12"
			>
				<p className="text-sm font-black tracking-widest text-(--color-accent)">
					404
				</p>
				<h1 id="not-found-title" className="text-3xl font-black md:text-4xl">
					העמוד לא נמצא
				</h1>
				<p className="max-w-md text-base text-(--color-control-muted) md:text-lg">
					הכתובת שחיפשת אינה זמינה באתר.
				</p>
				<Link
					href="/"
					className="control-bar inline-flex min-h-11 items-center justify-center px-5 py-2 font-black transition hover:border-(--color-accent) hover:text-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-accent)"
				>
					חזרה לציר הזמן
				</Link>
			</section>
		</main>
	);
}
