import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	agentRules: false,
	env: {
		LIGHTNINGCSS_WASM: "1",
	},
	async redirects() {
		return [
			{
				source: "/he",
				destination: "/",
				permanent: true,
			},
			{
				source: "/bubble",
				destination: "/stats?tab=leaning",
				permanent: true,
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/",
				destination: "/he",
			},
			{
				source: "/stats",
				destination: "/he/stats",
			},
		];
	},
};

export default nextConfig;
