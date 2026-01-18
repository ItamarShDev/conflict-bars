import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";

async function addArtistDetails(ctx: QueryCtx, song: Doc<"songs">) {
	const artist = song.artist_id ? await ctx.db.get(song.artist_id) : null;

	// Hydrate collaborator details
	const collaboratorDetails = song.collaborator_ids
		? await Promise.all(song.collaborator_ids.map((id) => ctx.db.get(id)))
		: undefined;

	return {
		...song,
		artist: artist?.name ?? "",
		artist_details: artist ?? undefined,
		collaborators: collaboratorDetails?.map((c) => c?.name).filter(Boolean),
		collaborator_details: collaboratorDetails?.filter(Boolean),
	};
}

async function hydrateSongs(ctx: QueryCtx, songs: Doc<"songs">[]) {
	return Promise.all(songs.map((song) => addArtistDetails(ctx, song)));
}

export const getAllSongs = query({
	args: {},
	handler: async (ctx) => {
		const songs = await ctx.db.query("songs").collect();
		const hydrated = await hydrateSongs(ctx, songs);
		return hydrated.sort(
			(a, b) =>
				new Date(a.published_date).getTime() -
				new Date(b.published_date).getTime(),
		);
	},
});

export const getSongsByArtist = query({
	args: {
		artistId: v.id("artists"),
	},
	handler: async (ctx, args) => {
		const songs = await ctx.db
			.query("songs")
			.withIndex("by_artist", (q) => q.eq("artist_id", args.artistId))
			.collect();
		return hydrateSongs(ctx, songs);
	},
});
