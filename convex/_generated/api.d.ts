/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as artists from "../artists.js";
import type * as events from "../events.js";
import type * as internal_artists from "../internal/artists.js";
import type * as internal_songs from "../internal/songs.js";
import type * as mutations from "../mutations.js";
import type * as songs from "../songs.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  artists: typeof artists;
  events: typeof events;
  "internal/artists": typeof internal_artists;
  "internal/songs": typeof internal_songs;
  mutations: typeof mutations;
  songs: typeof songs;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
