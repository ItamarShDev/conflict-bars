import type { SongSubmissionEmailPayload } from "@/actions/email";
import { sendAdminMail, sendThankYouMail } from "@/actions/email";

export async function POST(request: Request) {
	const payload = (await request.json()) as SongSubmissionEmailPayload;
	try {
		await sendAdminMail(payload);
		await sendThankYouMail(payload);
	} catch (error) {
		return Response.json(error, { status: 400 });
	}

	return Response.json({ message: "email sent" }, { status: 200 });
}
