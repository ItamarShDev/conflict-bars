import { v } from "convex/values";
import { query } from "../_generated/server";

export const findByNameAndDate = query({
	args: {
		name: v.string(),
		published_date: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db
			.query("songs")
			.withIndex("by_published_date", (q) =>
				q.eq("published_date", args.published_date),
			)
			.filter((song) => song.eq(song.field("name"), args.name))
			.first();
	},
});
