import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

function normalizeArtistName(name: string) {
	return name.trim().toLowerCase();
}

export const upsertArtist = mutation({
	args: {
		name: v.string(),
		name_he: v.optional(v.string()),
		name_en: v.optional(v.string()),
		era: v.optional(v.string()),
		affiliation: v.optional(v.string()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const normalized = normalizeArtistName(args.name);
		const existing = await ctx.db
			.query("artists")
			.withIndex("by_normalized_name", (q) =>
				q.eq("normalized_name", normalized),
			)
			.first();
		if (existing) {
			await ctx.db.patch(existing._id, {
				name: args.name,
				name_he: args.name_he ?? undefined,
				name_en: args.name_en ?? undefined,
				normalized_name: normalized,
				era: args.era ?? undefined,
				affiliation: args.affiliation ?? undefined,
				notes: args.notes ?? undefined,
			});
			return existing._id;
		}
		return await ctx.db.insert("artists", {
			name: args.name,
			name_he: args.name_he ?? undefined,
			name_en: args.name_en ?? undefined,
			normalized_name: normalized,
			era: args.era ?? undefined,
			affiliation: args.affiliation ?? undefined,
			notes: args.notes ?? undefined,
		});
	},
});

export const assignArtistToSong = mutation({
	args: {
		songId: v.id("songs"),
		artistId: v.id("artists"),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.songId, {
			artist_id: args.artistId,
		});
	},
});

export const assignCollaboratorsToSong = mutation({
	args: {
		songId: v.id("songs"),
		collaboratorIds: v.array(v.id("artists")),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.songId, {
			collaborator_ids: args.collaboratorIds,
		});
	},
});

export const insertSong = mutation({
	args: {
		name: v.string(),
		artistId: v.id("artists"),
		collaboratorIds: v.optional(v.array(v.id("artists"))),
		published_date: v.string(),
		published: v.optional(v.boolean()),
		language: v.optional(v.string()),
		lyric_sample: v.optional(
			v.object({
				hebrew: v.optional(v.string()),
				english_translation: v.optional(v.string()),
			}),
		),
		links: v.optional(
			v.object({
				lyrics: v.optional(v.string()),
				song_info: v.optional(v.string()),
				youtube: v.optional(v.string()),
			}),
		),
		submitted_by: v.optional(v.id("users")),
	},
	handler: async (ctx, args) => {
		const { artistId, collaboratorIds, published, ...rest } = args;
		return await ctx.db.insert("songs", {
			...rest,
			artist_id: artistId,
			collaborator_ids: collaboratorIds ?? undefined,
			published: published ?? false,
		});
	},
});

export const updateSong = mutation({
	args: {
		songId: v.id("songs"),
		updates: v.object({
			name: v.optional(v.string()),
			artist_id: v.optional(v.id("artists")),
			collaborator_ids: v.optional(v.array(v.id("artists"))),
			language: v.optional(v.string()),
			lyric_sample: v.optional(
				v.object({
					hebrew: v.optional(v.string()),
					english_translation: v.optional(v.string()),
				}),
			),
			links: v.optional(
				v.object({
					lyrics: v.optional(v.string()),
					song_info: v.optional(v.string()),
					youtube: v.optional(v.string()),
				}),
			),
		}),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.songId, args.updates);
		return args.songId;
	},
});

export const insertEvent = mutation({
	args: {
		start: v.string(),
		end: v.optional(v.string()),
		title: v.string(),
		title_he: v.optional(v.string()),
		reason: v.string(),
		reason_he: v.optional(v.string()),
		description: v.optional(v.string()),
		description_he: v.optional(v.string()),
		effects: v.optional(v.string()),
		effects_he: v.optional(v.string()),
		wikipedia_url: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("events", args);
	},
});

export const clearAllSongs = mutation({
	args: {},
	handler: async (ctx) => {
		const songs = await ctx.db.query("songs").collect();
		for (const song of songs) {
			await ctx.db.delete(song._id);
		}
	},
});

export const clearAllEvents = mutation({
	args: {},
	handler: async (ctx) => {
		const events = await ctx.db.query("events").collect();
		for (const event of events) {
			await ctx.db.delete(event._id);
		}
	},
});

export const clearAllUsers = mutation({
	args: {},
	handler: async (ctx) => {
		const users = await ctx.db.query("users").collect();
		for (const user of users) {
			await ctx.db.delete(user._id);
		}
	},
});

export const clearAllArtists = mutation({
	args: {},
	handler: async (ctx) => {
		const artists = await ctx.db.query("artists").collect();
		for (const artist of artists) {
			await ctx.db.delete(artist._id);
		}
	},
});

export const publishAllSongs = mutation({
	args: {},
	handler: async (ctx) => {
		const songs = await ctx.db.query("songs").collect();
		for (const song of songs) {
			await ctx.db.patch(song._id, {
				published: true,
			});
		}
	},
});

export const submitSongEditSuggestion = mutation({
	args: {
		songId: v.optional(v.id("songs")),
		userDisplayName: v.optional(v.string()),
		userEmail: v.string(),
		suggestion: v.object({
			name: v.optional(v.string()),
			artistId: v.optional(v.id("artists")),
			collaboratorIds: v.optional(v.array(v.id("artists"))),
			published_date: v.optional(v.string()),
			language: v.optional(v.string()),
			lyric_sample: v.optional(
				v.object({
					hebrew: v.optional(v.string()),
					english_translation: v.optional(v.string()),
				}),
			),
			links: v.optional(
				v.object({
					lyrics: v.optional(v.string()),
					song_info: v.optional(v.string()),
					youtube: v.optional(v.string()),
				}),
			),
			suggestion_notes: v.optional(v.string()),
		}),
	},
	handler: async (ctx, args) => {
		const displayName = args.userDisplayName?.trim();
		const email = args.userEmail.trim().toLowerCase();
		let userId: Id<"users"> | undefined;
		if (email) {
			const existing = await ctx.db
				.query("users")
				.withIndex("by_email", (q) => q.eq("email", email))
				.first();
			if (existing) {
				userId = existing._id;
			}
		}
		if (!userId) {
			userId = await ctx.db.insert("users", {
				display_name: displayName ?? "",
				email: email,
			});
		}
		const { artistId, collaboratorIds, ...suggestionData } = args.suggestion;

		// For edit suggestions, songId is required
		if (args.songId) {
			return await ctx.db.insert("song_edit_suggestions", {
				song_id: args.songId,
				user_id: userId,
				...suggestionData,
				artist_id: artistId ?? undefined,
				collaborator_ids: collaboratorIds ?? undefined,
				created_at: Date.now(),
			});
		}

		// For new song submissions, insert into songs table
		if (suggestionData.name && suggestionData.published_date && artistId) {
			return await ctx.db.insert("songs", {
				...suggestionData,
				name: suggestionData.name,
				published_date: suggestionData.published_date,
				artist_id: artistId,
				collaborator_ids: collaboratorIds ?? undefined,
				published: false,
				submitted_by: userId,
			});
		}
	},
});
