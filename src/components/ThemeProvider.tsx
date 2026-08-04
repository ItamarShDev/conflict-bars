"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "classic" | "boombox";
type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

export default function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [theme, setThemeState] = useState<Theme>("classic");

	useEffect(() => {
		const savedTheme = window.localStorage.getItem("conflict-bars-theme");
		const nextTheme: Theme = savedTheme === "boombox" ? "boombox" : "classic";
		setThemeState(nextTheme);
		document.documentElement.dataset.theme =
			nextTheme === "boombox" ? "boombox" : "classic";
	}, []);

	const setTheme = (nextTheme: Theme) => {
		setThemeState(nextTheme);
		document.documentElement.dataset.theme =
			nextTheme === "boombox" ? "boombox" : "classic";
		window.localStorage.setItem("conflict-bars-theme", nextTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
