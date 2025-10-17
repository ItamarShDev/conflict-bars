import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

// Get Convex URL from environment variables
// Vite uses VITE_ prefix, but we also check for NEXT_PUBLIC_ for compatibility
const convexUrl = 
  import.meta.env.VITE_CONVEX_URL ||
  import.meta.env.VITE_PUBLIC_CONVEX_URL ||
  import.meta.env.NEXT_PUBLIC_CONVEX_URL ||
  // Fallback - this should not be used if env vars are set correctly
  'https://israeli-hiphop-conflict-timeline.convex.cloud';

let convex: ConvexReactClient | null = null;

try {
  convex = new ConvexReactClient(convexUrl);
} catch (error) {
  console.error('Failed to initialize Convex client:', error);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
        <h2>Error: Convex Client Not Initialized</h2>
        <p>VITE_CONVEX_URL environment variable is not set.</p>
        <p>Please ensure your .env.local file contains:</p>
        <code>VITE_CONVEX_URL=your_convex_url</code>
        <p>Or run: <code>npx convex dev</code></p>
      </div>
    );
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
