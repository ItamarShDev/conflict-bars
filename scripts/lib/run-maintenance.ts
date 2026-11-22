import { execFileSync } from "node:child_process";
import {
	type FunctionArgs,
	type FunctionReturnType,
	getFunctionName,
} from "convex/server";
import { internal } from "../../convex/_generated/api";
import type { FileSong } from "../../timeline/types";

export function toConvexLyricSample(
	sample: FileSong["lyric_sample"],
): FunctionArgs<typeof internal.mutations.insertSong>["lyric_sample"] {
	if (!sample) return undefined;
	const { hebrew, arabic, english_translation } = sample;
	return { hebrew, arabic, english_translation };
}

// The Convex CLI authenticates with the operator's deployment credentials.
// Never expose a deploy key in browser code or accept one from a visitor.
export async function runMaintenance<
	Name extends keyof typeof internal.mutations,
>(
	name: Name,
	args: FunctionArgs<(typeof internal.mutations)[Name]>,
): Promise<FunctionReturnType<(typeof internal.mutations)[Name]>> {
	const url = new URL(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");
	if (
		url.protocol !== "https:" ||
		!/^[a-z]+-[a-z]+-[0-9]+\.convex\.cloud$/.test(url.hostname)
	) {
		throw new Error(
			"Maintenance scripts require a hosted NEXT_PUBLIC_CONVEX_URL; use the Convex CLI directly for local deployments.",
		);
	}
	// Pin writes to the same deployment used by these scripts for reads.
	const deployment = url.hostname.split(".")[0];
	const output = execFileSync(
		"npx",
		[
			"convex",
			"run",
			"--deployment",
			deployment,
			"--codegen",
			"disable",
			getFunctionName(internal.mutations[name]),
			JSON.stringify(args),
		],
		{ encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
	);
	return JSON.parse(output.trim() || "null");
}
