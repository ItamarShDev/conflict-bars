import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mailer = vi.hoisted(() => ({
	createTransport: vi.fn(),
	sendMail: vi.fn(),
	close: vi.fn(),
}));

vi.mock("nodemailer", () => ({
	default: { createTransport: mailer.createTransport },
}));

import { sendThankYouMail } from "./email";

const validPayload: Parameters<typeof sendThankYouMail>[0] = {
	submitterName: "Contributor",
	submitterEmail: "contributor@example.com",
	songName: "Updated title",
	artist: "File artist",
	publishedDate: "2023-06",
	language: "Hebrew",
	formLanguage: "he",
	isCorrection: true,
	existingSong: {
		name: "Original title",
		publishedDate: "2022-01",
	},
	lyricSample: { hebrew: "בדיקת מילים" },
	links: { songInfo: "https://example.com/song" },
};

describe("song submission email action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mailer.createTransport.mockReturnValue(mailer);
		mailer.sendMail.mockResolvedValue(undefined);
		vi.stubEnv("GMAIL", "test-only-not-a-real-credential");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("emails correction details to the maintainer and optional submitter", async () => {
		await expect(sendThankYouMail(validPayload)).resolves.toEqual({
			status: "success",
		});

		expect(mailer.createTransport).toHaveBeenCalledWith({
			service: "gmail",
			auth: {
				user: "itamarsharifytech@gmail.com",
				pass: "test-only-not-a-real-credential",
			},
		});
		expect(mailer.sendMail).toHaveBeenCalledTimes(2);
		const adminMail = mailer.sendMail.mock.calls[0][0];
		expect(adminMail.to).toBe("itamarsharifytech@gmail.com");
		expect(adminMail.replyTo).toBe("contributor@example.com");
		expect(adminMail.subject).toContain("song correction");
		expect(adminMail.text).toContain("Current file entry:");
		expect(adminMail.text).toContain("Published date: 2022-01");
		expect(adminMail.text).toContain("Published date: 2023-06");
		expect(mailer.sendMail.mock.calls[1][0].to).toBe("contributor@example.com");
		expect(mailer.sendMail.mock.calls[1][0].text).toContain(
			"שם השיר: Updated title",
		);
		expect(mailer.close).toHaveBeenCalledOnce();
	});

	it("emails new submissions without requiring a submitter address", async () => {
		await expect(
			sendThankYouMail({
				...validPayload,
				submitterEmail: undefined,
				existingSong: undefined,
				isCorrection: false,
			}),
		).resolves.toEqual({ status: "success" });

		expect(mailer.sendMail).toHaveBeenCalledOnce();
		expect(mailer.sendMail.mock.calls[0][0].subject).toContain(
			"song submission",
		);
		expect(mailer.sendMail.mock.calls[0][0].text).not.toContain(
			"Current file entry:",
		);
	});

	it("reports submission success when only the confirmation email fails", async () => {
		mailer.sendMail
			.mockResolvedValueOnce(undefined)
			.mockRejectedValueOnce(new Error("Confirmation transport failed"));

		await expect(sendThankYouMail(validPayload)).resolves.toEqual({
			status: "success",
		});
		expect(mailer.sendMail).toHaveBeenCalledTimes(2);
		expect(mailer.close).toHaveBeenCalledOnce();
	});

	it("rejects invalid dates before creating a mail transport", async () => {
		await expect(
			sendThankYouMail({ ...validPayload, publishedDate: "2023-02-29" }),
		).rejects.toThrow("Invalid submission details.");
		expect(mailer.createTransport).not.toHaveBeenCalled();
		expect(mailer.sendMail).not.toHaveBeenCalled();
	});

	it("silently skips honeypot submissions without sending mail", async () => {
		await expect(
			sendThankYouMail({ ...validPayload, honeypot: "bot-filled" }),
		).resolves.toEqual({ status: "success" });
		expect(mailer.createTransport).not.toHaveBeenCalled();
		expect(mailer.sendMail).not.toHaveBeenCalled();
	});

	it("does not create a transport when the server credential is missing", async () => {
		vi.stubEnv("GMAIL", "");
		await expect(sendThankYouMail(validPayload)).rejects.toThrow(
			"Submission email is unavailable.",
		);
		expect(mailer.createTransport).not.toHaveBeenCalled();
	});
});
