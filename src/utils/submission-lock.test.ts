import { describe, expect, it } from "vitest";
import {
	releaseSubmissionLock,
	tryAcquireSubmissionLock,
} from "./submission-lock";

describe("submission lock", () => {
	it("rejects overlapping submissions until the active request settles", () => {
		const lock = { current: false };

		expect(tryAcquireSubmissionLock(lock)).toBe(true);
		expect(tryAcquireSubmissionLock(lock)).toBe(false);

		releaseSubmissionLock(lock);
		expect(tryAcquireSubmissionLock(lock)).toBe(true);
	});
});
