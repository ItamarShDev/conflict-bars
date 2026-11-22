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
		];
	},
	async rewrites() {
		return [
			{
				source: "/",
				destination: "/he",
			},
			{
				source: "/bubble",
				destination: "/he/bubble",
			},
		];
	},
};

export default nextConfig;
