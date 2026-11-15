# Feel free to submit pull requests, or suggest songs

# Welcome to your Convex functions directory!

Write your Convex functions here.
See https://docs.convex.dev/functions for more.

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get(id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result),
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.

## Maintenance access

Catalog writes, publication and bulk deletion in `mutations.ts` are internal
Convex mutations, unavailable to browser clients. Migration/maintenance scripts
invoke them through `npx convex run`, using the operator's existing Convex CLI
login (or server-only CONVEX_DEPLOY_KEY). Scripts pin the CLI deployment to the
hosted NEXT_PUBLIC_CONVEX_URL, so reads and writes target the same database.
Confirm this URL before running a script. Local/self-hosted deployments are
rejected by the helper; use the authenticated Convex CLI directly for those.
Do not put a deploy key in NEXT_PUBLIC_* variables. No new credentials are needed
by the public site. Public song suggestions remain unpublished; their artist
helper can only create a missing artist, not overwrite an existing artist.

### Compatible rollout

The frontend retains the existing public `upsertArtist` name and argument shape.
On the updated backend this endpoint only creates a missing artist (name only)
or returns an existing ID; supplied metadata is ignored and existing records are
never modified. Privileged artist upserts move to internal `maintainArtist`.
This lets the frontend and backend deploy independently without a missing-function
window. Deploy the backend before running the updated maintenance scripts.
Merging/frontend deployment alone does not close the backend exposure; deploy
Convex separately to activate the access restrictions.
