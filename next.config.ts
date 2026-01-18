import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		LIGHTNINGCSS_WASM: "1",
	},
};

export default nextConfig;
