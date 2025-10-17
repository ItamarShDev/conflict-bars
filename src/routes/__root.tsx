/// <reference types="vite/client" />
import {
	createRootRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ThemeProvider from "@/components/ThemeProvider";
import "@/styles/globals.css";

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: () => (
		<div className="flex items-center justify-center h-full">
			<div className="text-center">
				<h1 className="text-2xl font-bold">404 - Page Not Found</h1>
				<p className="text-gray-500">
					The page you're looking for doesn't exist.
				</p>
			</div>
		</div>
	),
});

function RootLayout() {
	const locales = ["he", "en"];
	const defaultLocale = "he";
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const pathname = location.pathname;
		const hasLocale = locales.some(
			(locale) =>
				pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
		);

		if (!hasLocale && pathname !== "/") {
			navigate({
				to: "/$lang",
				params: { lang: defaultLocale },
				search: { redirect: pathname },
			});
		} else if (pathname === "/") {
			navigate({ to: "/$lang", params: { lang: defaultLocale } });
		}
	}, [location.pathname, navigate]);

	return (
		<ErrorBoundary>
			<div className="h-full w-full antialiased bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col">
				<ConvexClientProvider>
					<ThemeProvider>
						<div className="flex-1 overflow-auto">
							<Outlet />
						</div>
					</ThemeProvider>
				</ConvexClientProvider>
			</div>
		</ErrorBoundary>
	);
}
