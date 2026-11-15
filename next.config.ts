import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	agentRules: false,
	env: {
		LIGHTNINGCSS_WASM: "1",
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/he",
				permanent: false,
			},
			{
				source: "/en",
				destination: "/he",
				permanent: true,
			},
			{
				source: "/en/:path*",
				destination: "/he/:path*",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
