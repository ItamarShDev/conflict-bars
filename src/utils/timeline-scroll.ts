export const MOBILE_DOCK_BREAKPOINT = 760;
export const MOBILE_DOCK_SPACING = 16;

export function getMobileDockSpace(dockHeight: number, isMobile: boolean) {
	return isMobile ? dockHeight + MOBILE_DOCK_SPACING : 0;
}

export function getYearScrollTop(
	scrollY: number,
	sectionTop: number,
	railHeight: number,
	hasTopStickyRail: boolean,
) {
	return scrollY + sectionTop - (hasTopStickyRail ? railHeight : 0) - 12;
}
