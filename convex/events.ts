import { query } from "./_generated/server";

export const getAllEvents = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    return events.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  },
});
