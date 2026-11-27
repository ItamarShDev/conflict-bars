export type SubmissionLock = { current: boolean };

export function tryAcquireSubmissionLock(lock: SubmissionLock): boolean {
	if (lock.current) {
		return false;
	}
	lock.current = true;
	return true;
}

export function releaseSubmissionLock(lock: SubmissionLock) {
	lock.current = false;
}
