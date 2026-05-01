import { send } from "vite";
import { sendInvoiceConfirmationEmail } from "../email/email-service.js";

export async function notifyInvoiceReceived({ email, flight_id, body }) {
    await sendInvoiceConfirmationEmail({
        email,
        flight_id,
        body
    });
}