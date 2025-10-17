import { createRootRoute, useLocation, useNavigate, Outlet, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
const convexUrl$1 = "https://affable-lemur-532.convex.cloud";
let convex = null;
try {
  convex = new ConvexReactClient(convexUrl$1);
} catch (error) {
  console.error("Failed to initialize Convex client:", error);
}
function ConvexClientProvider({ children }) {
  if (!convex) {
    return /* @__PURE__ */ jsxs("div", { style: { padding: "20px", color: "red", fontFamily: "monospace" }, children: [
      /* @__PURE__ */ jsx("h2", { children: "Error: Convex Client Not Initialized" }),
      /* @__PURE__ */ jsx("p", { children: "VITE_CONVEX_URL environment variable is not set." }),
      /* @__PURE__ */ jsx("p", { children: "Please ensure your .env.local file contains:" }),
      /* @__PURE__ */ jsx("code", { children: "VITE_CONVEX_URL=your_convex_url" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Or run: ",
        /* @__PURE__ */ jsx("code", { children: "npx convex dev" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx(ConvexProvider, { client: convex, children });
}
function ErrorBoundary({ children, fallback }) {
  const [error, setError] = useState(null);
  useEffect(() => {
    const handleError = (event) => {
      setError(event.error);
    };
    const handleUnhandledRejection = (event) => {
      setError(new Error(event.reason?.message || String(event.reason)));
    };
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);
  if (error) {
    return fallback?.(error, () => setError(null)) || /* @__PURE__ */ jsx(DefaultErrorPage, { error, reset: () => setError(null) });
  }
  return children;
}
function DefaultErrorPage({
  error,
  reset
}) {
  return /* @__PURE__ */ jsx("div", { className: "h-full w-full flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full mx-auto px-6 py-12 text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "⚠️" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: "Something went wrong" }),
      /* @__PURE__ */ jsx("p", { className: "text-[var(--color-muted-foreground)] mb-4", children: "An unexpected error occurred. Please try again." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-[var(--color-card-background)] rounded-lg p-4 mb-6 text-left", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-mono text-red-500 break-words", children: error.message || "Unknown error" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: reset,
          className: "flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-2 px-4 rounded transition-colors",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            window.location.href = "/";
          },
          className: "flex-1 bg-[var(--color-muted)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] font-semibold py-2 px-4 rounded transition-colors",
          children: "Go home"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--color-muted-foreground)] mt-6", children: "If the problem persists, please refresh the page or contact support." })
  ] }) });
}
function ThemeProvider({
  children
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
const appCss = "/assets/globals-vgRDMgJW.css";
const Route$3 = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  component: RootLayout,
  notFoundComponent: () => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "404 - Page Not Found" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "The page you're looking for doesn't exist." })
  ] }) })
});
function RootLayout() {
  const locales = ["he", "en"];
  const defaultLocale = "he";
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const pathname = location.pathname;
    const hasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (!hasLocale && pathname !== "/") {
      navigate({
        to: "/he",
        params: { lang: defaultLocale },
        search: { redirect: pathname }
      });
    } else if (pathname === "/") {
      navigate({ to: "/he", params: { lang: defaultLocale } });
    }
  }, [location.pathname, navigate]);
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx("div", { className: "h-full w-full antialiased bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col", children: /* @__PURE__ */ jsx(ConvexClientProvider, { children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsx(Outlet, {}) }) }) }) }) });
}
const api = anyApi;
const convexUrl = "https://affable-lemur-532.convex.cloud";
const client = new ConvexHttpClient(convexUrl);
async function loadTimelineData() {
  try {
    const [songs, events] = await Promise.all([
      client.query(api.songs.getAllSongs),
      client.query(api.events.getAllEvents)
    ]);
    return {
      songs: songs || [],
      events: events || []
    };
  } catch (error) {
    console.error("Failed to load timeline data:", error);
    return {
      songs: [],
      events: []
    };
  }
}
const $$splitComponentImporter$1 = () => import("./he-CuUh3WxZ.js");
const Route$2 = createFileRoute("/he")({
  loader: async () => {
    return loadTimelineData();
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./en-CaSBM0M-.js");
const Route$1 = createFileRoute("/en")({
  loader: async () => {
    return loadTimelineData();
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route = createFileRoute("/")({
  beforeLoad: async () => {
    throw redirect({ to: "/he" });
  }
});
const HeRoute = Route$2.update({
  id: "/he",
  path: "/he",
  getParentRoute: () => Route$3
});
const EnRoute = Route$1.update({
  id: "/en",
  path: "/en",
  getParentRoute: () => Route$3
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  EnRoute,
  HeRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$2 as R,
  Route$1 as a,
  api as b,
  router as r
};
