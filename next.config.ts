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
				destination: "/en",
				permanent: false,
			},
		];
	},
};

export default nextConfig;
