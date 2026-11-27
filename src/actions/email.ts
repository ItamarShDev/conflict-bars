"use server";

import nodemailer from "nodemailer";
import { isValidSongPublishedDate } from "../utils/timeline";

export type SongSubmissionEmailPayload = {
	submitterName?: string;
	submitterEmail?: string;
	songName: string;
	artist: string;
	publishedDate: string;
	language: string;
	formLanguage: "en" | "he";
	isCorrection: boolean;
	existingSong?: {
		name: string;
		publishedDate: string;
	};
	lyricSample?: {
		hebrew?: string;
		englishTranslation?: string;
	};
	links?: {
		lyrics?: string;
		songInfo?: string;
		youtube?: string;
	};
	honeypot?: string;
};

const notificationEmail = "itamarsharifytech@gmail.com";
const textLimits = {
	submitterName: 100,
	songName: 200,
	artist: 200,
	language: 64,
	lyric: 5000,
	url: 2048,
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalText(value: unknown, maxLength: number): string | undefined {
	if (value === undefined || value === null || value === "") {
		return undefined;
	}
	if (typeof value !== "string") {
		throw new Error("Invalid submission details.");
	}

	const normalized = value.trim();
	if (normalized.length > maxLength) {
		throw new Error("Invalid submission details.");
	}
	return normalized || undefined;
}

function requiredText(value: unknown, maxLength: number): string {
	const normalized = optionalText(value, maxLength);
	if (!normalized) {
		throw new Error("Invalid submission details.");
	}
	return normalized;
}

function optionalUrl(value: unknown): string | undefined {
	const link = optionalText(value, textLimits.url);
	if (!link) {
		return undefined;
	}

	try {
		const url = new URL(link);
		if (
			(url.protocol !== "https:" && url.protocol !== "http:") ||
			url.username ||
			url.password
		) {
			throw new Error("Invalid submission details.");
		}
	} catch {
		throw new Error("Invalid submission details.");
	}

	return link;
}

function normalizePayload(value: unknown): SongSubmissionEmailPayload | null {
	if (!isRecord(value)) {
		throw new Error("Invalid submission details.");
	}

	if (typeof value.honeypot === "string" && value.honeypot.trim()) {
		return null;
	}
	if (value.honeypot !== undefined && typeof value.honeypot !== "string") {
		throw new Error("Invalid submission details.");
	}

	const songName = requiredText(value.songName, textLimits.songName);
	const artist = requiredText(value.artist, textLimits.artist);
	const publishedDate = requiredText(value.publishedDate, 10);
	const language = requiredText(value.language, textLimits.language);
	const submitterName = optionalText(
		value.submitterName,
		textLimits.submitterName,
	);
	const submitterEmail = optionalText(value.submitterEmail, 254);

	if (
		!isValidSongPublishedDate(publishedDate) ||
		(submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail))
	) {
		throw new Error("Invalid submission details.");
	}
	if (value.formLanguage !== "en" && value.formLanguage !== "he") {
		throw new Error("Invalid submission details.");
	}
	if (typeof value.isCorrection !== "boolean") {
		throw new Error("Invalid submission details.");
	}

	let existingSong: SongSubmissionEmailPayload["existingSong"];
	if (value.isCorrection) {
		if (!isRecord(value.existingSong)) {
			throw new Error("Invalid submission details.");
		}
		const name = requiredText(value.existingSong.name, textLimits.songName);
		const originalDate = requiredText(value.existingSong.publishedDate, 10);
		if (!isValidSongPublishedDate(originalDate)) {
			throw new Error("Invalid submission details.");
		}
		existingSong = { name, publishedDate: originalDate };
	}

	let lyricSample: SongSubmissionEmailPayload["lyricSample"];
	if (value.lyricSample !== undefined) {
		if (!isRecord(value.lyricSample)) {
			throw new Error("Invalid submission details.");
		}
		lyricSample = {
			hebrew: optionalText(value.lyricSample.hebrew, textLimits.lyric),
			englishTranslation: optionalText(
				value.lyricSample.englishTranslation,
				textLimits.lyric,
			),
		};
	}
	if (!lyricSample?.hebrew) {
		throw new Error("Invalid submission details.");
	}

	let links: SongSubmissionEmailPayload["links"];
	if (value.links !== undefined) {
		if (!isRecord(value.links)) {
			throw new Error("Invalid submission details.");
		}
		links = {
			lyrics: optionalUrl(value.links.lyrics),
			songInfo: optionalUrl(value.links.songInfo),
			youtube: optionalUrl(value.links.youtube),
		};
	}

	return {
		submitterName,
		submitterEmail,
		songName,
		artist,
		publishedDate,
		language,
		formLanguage: value.formLanguage,
		isCorrection: value.isCorrection,
		existingSong,
		lyricSample,
		links,
	};
}

function formatAdminMessage(payload: SongSubmissionEmailPayload) {
	const lines = [
		payload.isCorrection
			? "New song correction suggestion received."
			: "New song submission received.",
		payload.submitterName
			? `Submitter name: ${payload.submitterName}`
			: undefined,
		`Submitter email: ${payload.submitterEmail ?? "N/A"}`,
	];

	if (payload.existingSong) {
		lines.push(
			"",
			"Current file entry:",
			`- Song: ${payload.existingSong.name}`,
			`- Published date: ${payload.existingSong.publishedDate}`,
		);
	}

	lines.push(
		"",
		"Proposed details:",
		`- Song: ${payload.songName}`,
		`- Artist: ${payload.artist}`,
		`- Published date: ${payload.publishedDate}`,
		`- Language: ${payload.language}`,
	);

	if (payload.lyricSample?.hebrew || payload.lyricSample?.englishTranslation) {
		lines.push("", "Lyric sample:");
		if (payload.lyricSample.hebrew) {
			lines.push(`- Hebrew: ${payload.lyricSample.hebrew}`);
		}
		if (payload.lyricSample.englishTranslation) {
			lines.push(
				`- English translation: ${payload.lyricSample.englishTranslation}`,
			);
		}
	}

	if (
		payload.links?.lyrics ||
		payload.links?.songInfo ||
		payload.links?.youtube
	) {
		lines.push("", "Links:");
		if (payload.links.lyrics) {
			lines.push(`- Lyrics: ${payload.links.lyrics}`);
		}
		if (payload.links.songInfo) {
			lines.push(`- Info: ${payload.links.songInfo}`);
		}
		if (payload.links.youtube) {
			lines.push(`- YouTube: ${payload.links.youtube}`);
		}
	}

	return lines.filter(Boolean).join("\n");
}

function formatSubmitterMessage(payload: SongSubmissionEmailPayload) {
	const lines =
		payload.formLanguage === "he"
			? [
					"שלום,",
					"",
					payload.isCorrection
						? "תודה על הצעת התיקון ל-Conflict Bars. קיבלנו אותה ונבדוק את הפרטים בקרוב."
						: "תודה על הצעתך להוסיף שיר ל-Conflict Bars. קיבלנו אותה ונבדוק את הפרטים בקרוב.",
				]
			: [
					"Hello,",
					"",
					payload.isCorrection
						? "Thanks for suggesting a correction to Conflict Bars. We received it and will review the details soon."
						: "Thanks for suggesting a song for Conflict Bars. We received it and will review the details soon.",
				];

	lines.push(
		"",
		payload.formLanguage === "he" ? "הפרטים שהתקבלו:" : "Details received:",
		payload.formLanguage === "he"
			? `שם השיר: ${payload.songName}`
			: `Song: ${payload.songName}`,
		payload.formLanguage === "he"
			? `אמן: ${payload.artist}`
			: `Artist: ${payload.artist}`,
		payload.formLanguage === "he"
			? `תאריך פרסום: ${payload.publishedDate}`
			: `Published date: ${payload.publishedDate}`,
		payload.formLanguage === "he"
			? `שפה: ${payload.language}`
			: `Language: ${payload.language}`,
	);

	if (
		payload.links?.lyrics ||
		payload.links?.songInfo ||
		payload.links?.youtube
	) {
		lines.push("", payload.formLanguage === "he" ? "קישורים:" : "Links:");
		if (payload.links.lyrics) {
			lines.push(
				payload.formLanguage === "he"
					? `- מילים: ${payload.links.lyrics}`
					: `- Lyrics: ${payload.links.lyrics}`,
			);
		}
		if (payload.links.songInfo) {
			lines.push(
				payload.formLanguage === "he"
					? `- מידע: ${payload.links.songInfo}`
					: `- Info: ${payload.links.songInfo}`,
			);
		}
		if (payload.links.youtube) {
			lines.push(`- YouTube: ${payload.links.youtube}`);
		}
	}

	lines.push(
		"",
		payload.formLanguage === "he"
			? "תודה על התרומה!"
			: "We appreciate your contribution!",
		"",
		"- Conflict Bars",
	);

	return lines.join("\n");
}

function safeSubject(value: string) {
	const normalized = value.replace(/\s+/g, " ");
	return [...normalized]
		.filter((character) => {
			const code = character.charCodeAt(0);
			return code > 31 && code !== 127;
		})
		.join("")
		.slice(0, 180);
}

export async function sendThankYouMail(payload: SongSubmissionEmailPayload) {
	const normalizedPayload = normalizePayload(payload);
	if (!normalizedPayload) {
		return { status: "success" };
	}

	const password = process.env.GMAIL;
	if (!password) {
		throw new Error("Submission email is unavailable.");
	}

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: notificationEmail,
			pass: password,
		},
	});
	const kind = normalizedPayload.isCorrection
		? "song correction"
		: "song submission";

	try {
		await transporter.sendMail({
			to: notificationEmail,
			from: notificationEmail,
			replyTo: normalizedPayload.submitterEmail,
			subject: safeSubject(
				`New ${kind}: ${normalizedPayload.songName} by ${normalizedPayload.artist}`,
			),
			text: formatAdminMessage(normalizedPayload),
		});

		if (normalizedPayload.submitterEmail) {
			const confirmationSubject = normalizedPayload.isCorrection
				? normalizedPayload.formLanguage === "he"
					? "תודה על הצעת התיקון שלך"
					: "Thanks for your correction suggestion"
				: normalizedPayload.formLanguage === "he"
					? "תודה על הצעת השיר שלך"
					: "Thanks for your song submission";
			try {
				await transporter.sendMail({
					to: normalizedPayload.submitterEmail,
					from: notificationEmail,
					subject: confirmationSubject,
					text: formatSubmitterMessage(normalizedPayload),
				});
			} catch {
				console.error("Failed to send submitter confirmation email.");
			}
		}

		return { status: "success" };
	} finally {
		transporter.close();
	}
}
