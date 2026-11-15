import { describe, expect, it } from "vitest";
import { getMobileDockSpace, getYearScrollTop } from "./timeline-scroll";

describe("year section scroll positioning", () => {
	it("accounts for the desktop top-sticky rail", () => {
		expect(getYearScrollTop(100, 500, 64, true)).toBe(524);
	});

	it("does not subtract the fixed mobile bottom dock", () => {
		expect(getYearScrollTop(100, 500, 64, false)).toBe(588);
	});

	it("reserves measured dock height and spacing only on mobile", () => {
		expect(getMobileDockSpace(138, true)).toBe(154);
		expect(getMobileDockSpace(138, false)).toBe(0);
	});
});
