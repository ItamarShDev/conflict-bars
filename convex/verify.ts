import { query } from "./_generated/server";

export const searchByName = query({
	args: {},
	handler: async (ctx) => {
		const songs = await ctx.db.query("songs").collect();
		// Filter for Tamer Nafar songs by name patterns
		const tamerSongs = songs.filter(
			(s) =>
				s.name?.toLowerCase().includes("politi") ||
				s.name?.toLowerCase().includes("beat never") ||
				s.name?.toLowerCase().includes("palestinian") ||
				s.name?.toLowerCase().includes("vote") ||
				s.name?.toLowerCase().includes("innocent") ||
				s.name?.includes("נפאר"),
		);
		return tamerSongs.map((s) => ({
			name: s.name,
			lyric_sample: s.lyric_sample?.hebrew?.substring(0, 50) || "(empty)",
		}));
	},
});
