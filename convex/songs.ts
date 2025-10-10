import { query } from "./_generated/server";

export const getAllSongs = query({
  args: {},
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect();
    return songs.sort((a, b) => 
      new Date(a.published_date).getTime() - new Date(b.published_date).getTime()
    );
  },
});

export const getSongsByArtist = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("songs").withIndex("by_artist").collect();
  },
});
