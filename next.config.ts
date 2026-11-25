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
				destination: "/stats/leaning",
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
			{
				source: "/stats/leaning",
				destination: "/he/stats/leaning",
			},
			{
				source: "/stats/resolution",
				destination: "/he/stats/resolution",
			},
		];
	},
};

export default nextConfig;
