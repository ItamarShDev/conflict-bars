"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Only render children after component is mounted to avoid hydration mismatch
	if (!isMounted) {
		return <>{children}</>;
	}

	return <>{children}</>;
}
