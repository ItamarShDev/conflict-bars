import nodemailer from "nodemailer";

export interface SongSubmissionEmailPayload {
	submitterName: string;
	submitterEmail?: string;
	songName: string;
	artist: string;
	publishedDate: string;
	language?: string;
	lyricSample?: {
		hebrew?: string;
		englishTranslation?: string;
	};
	links?: {
		lyrics?: string;
		songInfo?: string;
		youtube?: string;
	};
}

const notificationEmail = "itamarsharify@gmail.com";

function formatAdminMessage(payload: SongSubmissionEmailPayload) {
	const lines = [
		"New song submission received.",
		`Submitter: ${payload.submitterName}`,
		`Submitter email: ${payload.submitterEmail ?? "N/A"}`,
		`Song: ${payload.songName}`,
		`Artist: ${payload.artist}`,
		`Published date: ${payload.publishedDate}`,
		payload.language ? `Language: ${payload.language}` : undefined,
	];

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
	const lines = [
		`Hi ${payload.submitterName},`,
		"",
		"Thanks for submitting a song to the Israeli Hip-Hop timeline!",
		"We'll review the details soon. Here's what we received:",
		"",
		`Song: ${payload.songName}`,
		`Artist: ${payload.artist}`,
		`Published date: ${payload.publishedDate}`,
		payload.language ? `Language: ${payload.language}` : undefined,
	];

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

	lines.push(
		"",
		"We appreciate your contribution!",
		"",
		"– Israeli Hip-Hop Conflict Timeline",
	);

	return lines.filter(Boolean).join("\n");
}

export async function sendThankYouMail(payload: SongSubmissionEmailPayload) {
	if (!payload.submitterEmail) {
		return;
	}

	const mail = "itamarsharify@gmail.com";
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: mail,
			pass: process.env.GMAIL,
		},
	});

	const mailOptions = {
		to: payload.submitterEmail,
		from: mail,
		subject: "Thanks for your song submission",
		text: formatSubmitterMessage(payload),
	};

	await transporter.sendMail(mailOptions);
}

export async function sendMail(payload: SongSubmissionEmailPayload) {
	const mail = notificationEmail;
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: mail,
			pass: process.env.GMAIL,
		},
	});

	const mailOptions = {
		to: mail,
		from: payload.submitterEmail ?? mail,
		subject: `New song submission: ${payload.songName} by ${payload.artist}`,
		text: formatAdminMessage(payload),
	};

	await transporter.sendMail(mailOptions);
}
