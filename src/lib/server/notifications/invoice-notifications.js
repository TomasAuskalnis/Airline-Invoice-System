import { send } from "vite";
import { sendInvoiceConfirmationEmail } from "../email/email-service.js";

export async function notifyInvoiceReceived({ email, flight }) {
    await sendInvoiceConfirmationEmail({
        to: email,
        flight_id: flight.flight_id,    
    })
}