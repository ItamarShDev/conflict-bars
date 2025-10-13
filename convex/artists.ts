import { query } from "./_generated/server";

export const getAllArtists = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query("artists").collect();
	},
});
