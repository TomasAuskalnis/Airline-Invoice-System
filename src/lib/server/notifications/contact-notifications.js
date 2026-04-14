import { sendContactEmail } from '$lib/server/email/email-service.js';
console.log("n")

export async function notifyContactReceived({ email }) {
    await sendContactEmail({ to: email });
}