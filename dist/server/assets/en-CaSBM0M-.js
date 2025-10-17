import { jsx } from "react/jsx-runtime";
import { T as Timeline } from "./Timeline-CogHgnx1.js";
import { a as Route } from "./router-DpmfDipf.js";
import "react";
import "convex/react";
import "@tanstack/react-router";
import "convex/browser";
import "convex/server";
function TimelinePage() {
  const data = Route.useLoaderData();
  return /* @__PURE__ */ jsx(Timeline, { lang: "en", initialData: data });
}
export {
  TimelinePage as component
};
