import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const insertSong = mutation({
	args: {
		name: v.string(),
		artist: v.string(),
		published_date: v.string(),
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
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("songs", args);
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
