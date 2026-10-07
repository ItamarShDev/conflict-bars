import type { Id } from "../../convex/_generated/dataModel";
import type { FileSong } from "../../timeline/types";

export async function resolveSubmissionArtist(
	artist: string,
	artistNameToId: ReadonlyMap<string, Id<"artists">>,
	editSong: Pick<FileSong, "artist" | "artist_details"> | undefined,
	findArtist: (normalized: string) => Promise<Id<"artists"> | undefined>,
	upsertArtist: (
		args: { name: string } & NonNullable<FileSong["artist_details"]>,
	) => Promise<Id<"artists">>,
) {
	const existingId = artistNameToId.get(artist.toLowerCase());
	if (existingId) return existingId;
	if (editSong?.artist !== artist || !editSong.artist_details) return;
	const currentId = await findArtist(artist.trim().toLowerCase());
	if (currentId) return currentId;
	return upsertArtist({ name: artist, ...editSong.artist_details });
}
