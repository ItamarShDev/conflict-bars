export const SONG_SUBMISSION_RECIPIENT = "itamarsharifytech@gmail.com";
export const MAX_MAILTO_URL_LENGTH = 8000;

export type SongSubmissionMailtoPayload = {
	isCorrection: boolean;
	songName: string;
	artist: string;
	publishedDate: string;
	language: string;
	existingSong?: {
		name: string;
		artist: string;
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
};

export type SongSubmissionMailtoDraft = {
	recipient: string;
	subject: string;
	body: string;
	url: string | null;
};

function encodeMailtoValue(value: string) {
	return encodeURIComponent(value).replace(/[!'()*]/g, (character) => {
		return `%${character.charCodeAt(0).toString(16).toUpperCase()}`;
	});
}

function normalizeNewlines(value: string) {
	return value.replace(/\r\n|\r|\n/g, "\r\n");
}

function normalizeSubjectPart(value: string) {
	const withoutControls = Array.from(value, (character) => {
		const codePoint = character.codePointAt(0) ?? 0;
		return codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f)
			? " "
			: character;
	}).join("");

	return withoutControls.replace(/\s+/g, " ").trim();
}

export function buildSongSubmissionMailto(
	payload: SongSubmissionMailtoPayload,
): SongSubmissionMailtoDraft {
	const subject = `${payload.isCorrection ? "Song correction suggestion" : "Song submission"}: ${normalizeSubjectPart(payload.songName)} - ${normalizeSubjectPart(payload.artist)}`;
	const lines = [
		payload.isCorrection
			? "Correction suggestion for a song."
			: "New song submission.",
	];

	if (payload.isCorrection && payload.existingSong) {
		lines.push(
			"",
			"Current entry:",
			`- Song: ${payload.existingSong.name}`,
			`- Artist: ${payload.existingSong.artist}`,
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

	const body = normalizeNewlines(lines.join("\n"));
	const url = `mailto:${SONG_SUBMISSION_RECIPIENT}?subject=${encodeMailtoValue(subject)}&body=${encodeMailtoValue(body)}`;

	return {
		recipient: SONG_SUBMISSION_RECIPIENT,
		subject,
		body,
		url: url.length <= MAX_MAILTO_URL_LENGTH ? url : null,
	};
}
