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
		];
	},
};

export default nextConfig;
