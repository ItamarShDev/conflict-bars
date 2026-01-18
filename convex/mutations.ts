import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation } from "./_generated/server";

function normalizeArtistName(name: string) {
	return name.trim().toLowerCase();
}

function normalizeSongName(name: string) {
	return name.trim().toLowerCase();
}

function fieldLength(str?: string | null) {
	return (str ?? "").trim().length;
}

function mergeSongData(base: Doc<"songs">, incoming: Partial<Doc<"songs">>) {
	const merged: Doc<"songs"> = { ...base };

	if (incoming.name) merged.name = incoming.name;
	if (incoming.artist_id) merged.artist_id = incoming.artist_id;
	if (incoming.language) merged.language = incoming.language;
	if (incoming.published !== undefined) merged.published = incoming.published;
	if (incoming.collaborator_ids)
		merged.collaborator_ids = incoming.collaborator_ids;

	if (incoming.lyric_sample) {
		merged.lyric_sample = merged.lyric_sample ?? {};
		if (
			incoming.lyric_sample.hebrew &&
			fieldLength(incoming.lyric_sample.hebrew) >
				fieldLength(merged.lyric_sample.hebrew)
		) {
			merged.lyric_sample.hebrew = incoming.lyric_sample.hebrew;
		}
		if (
			incoming.lyric_sample.english_translation &&
			fieldLength(incoming.lyric_sample.english_translation) >
				fieldLength(merged.lyric_sample.english_translation)
		) {
			merged.lyric_sample.english_translation =
				incoming.lyric_sample.english_translation;
		}
	}

	if (incoming.links) {
		merged.links = merged.links ?? {};
		for (const key of ["lyrics", "song_info", "youtube"] as const) {
			if (incoming.links[key]) {
				merged.links[key] = incoming.links[key];
			}
		}
	}

	if (incoming.published_date) {
		merged.published_date = incoming.published_date;
	}

	return merged;
}

function buildPatch(from: Doc<"songs">, to: Doc<"songs">) {
	const patch: Partial<Doc<"songs">> = {};
	if (from.language !== to.language) patch.language = to.language;
	if (from.published !== to.published) patch.published = to.published;
	if (from.collaborator_ids !== to.collaborator_ids)
		patch.collaborator_ids = to.collaborator_ids;
	if (JSON.stringify(from.lyric_sample) !== JSON.stringify(to.lyric_sample))
		patch.lyric_sample = to.lyric_sample;
	if (JSON.stringify(from.links) !== JSON.stringify(to.links))
		patch.links = to.links;
	if (from.published_date !== to.published_date)
		patch.published_date = to.published_date;
	if (from.artist_id !== to.artist_id) patch.artist_id = to.artist_id;
	if (from.name !== to.name) patch.name = to.name;
	return patch;
}

async function findDuplicateByName(
	ctx: { db: MutationCtx["db"] },
	artistId: Id<"artists">,
	name: string,
	excludeId?: Id<"songs">,
): Promise<Doc<"songs"> | null> {
	const normalized = normalizeSongName(name);
	const songs = await ctx.db
		.query("songs")
		.withIndex("by_artist", (q) => q.eq("artist_id", artistId))
		.collect();
	for (const song of songs) {
		if (excludeId && song._id === excludeId) continue;
		if (normalizeSongName(song.name) === normalized) return song;
	}
	return null;
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

export const deleteSong = mutation({
	args: {
		songId: v.id("songs"),
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.songId);
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
		const { artistId, collaboratorIds, published, name, ...rest } = args;
		const duplicate = await findDuplicateByName(ctx, artistId, args.name);
		const incomingPartial: Partial<Doc<"songs">> = {
			name,
			artist_id: artistId,
			collaborator_ids: collaboratorIds ?? undefined,
			published: published ?? false,
			...rest,
		};

		if (duplicate) {
			const merged = mergeSongData(duplicate, incomingPartial);
			const patch = buildPatch(duplicate, merged);
			if (Object.keys(patch).length > 0) {
				await ctx.db.patch(duplicate._id, patch);
			}
			return duplicate._id;
		}

		return await ctx.db.insert("songs", {
			name,
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
		}),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db.get(args.songId);
		if (!existing) throw new Error("Song not found");

		const targetArtist = args.updates.artist_id ?? existing.artist_id;
		const targetName = args.updates.name ?? existing.name;

		let merged = mergeSongData(existing, args.updates as Partial<Doc<"songs">>);

		if (targetArtist) {
			const duplicate = await findDuplicateByName(
				ctx,
				targetArtist,
				targetName,
				args.songId,
			);
			if (duplicate) {
				merged = mergeSongData(merged, duplicate);
				await ctx.db.delete(duplicate._id);
			}
		}

		const patch = buildPatch(existing, merged);
		if (Object.keys(patch).length > 0) {
			await ctx.db.patch(args.songId, patch);
		}
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
