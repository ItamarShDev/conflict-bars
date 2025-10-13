import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	artists: defineTable({
		name: v.string(),
		normalized_name: v.string(),
		era: v.optional(v.string()),
		affiliation: v.optional(v.string()),
		notes: v.optional(v.string()),
	}).index("by_normalized_name", ["normalized_name"]),

	songs: defineTable({
		name: v.string(),
		artist: v.optional(v.string()),
		artist_id: v.optional(v.id("artists")),
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
	})
		.index("by_published_date", ["published_date"])
		.index("by_artist", ["artist_id"])
		.index("by_submitted_by", ["submitted_by"]),

	users: defineTable({
		display_name: v.string(),
		email: v.optional(v.string()),
	}).index("by_email", ["email"]),

	events: defineTable({
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
	})
		.index("by_start", ["start"])
		.index("by_end", ["end"]),
});
