import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	agentRules: false,
	env: {
		LIGHTNINGCSS_WASM: "1",
	},
};

export default nextConfig;
