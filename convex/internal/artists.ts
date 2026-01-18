import { v } from "convex/values";
import { query } from "../_generated/server";

export const getByNormalizedName = query({
	args: {
		normalized: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db
			.query("artists")
			.withIndex("by_normalized_name", (q) =>
				q.eq("normalized_name", args.normalized),
			)
			.first();
	},
});
