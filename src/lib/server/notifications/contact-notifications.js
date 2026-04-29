import { sendOrderConfirmationEmail } from '$lib/server/email/email-service.js';

export async function notifyContactReceived({ email }) {
    await sendOrderConfirmationEmail({ to: email });
}