console.log('EMAIL SERVICE FILE LOADED');

import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { user } from '../db/auth.schema';

const resend = new Resend(RESEND_API_KEY);

export async function sendOrderConfirmationEmail({ email }) { 
    console.log('sendOrderConfirmationEmail called with:', email);
    
    const send =await resend.emails.send({ 
        from: 'Airline Invoice System <onboarding@resend.dev>', 
        to: email, 
        subject: `Inquiry Confirmation`, 
        html: ` 
            <h2>Thank you for your inquiry</h2> 
            <p>We will get back to you shortly.</p> 
            ` 
    }); 

    console.log("Email sent to", email);
    return send;
} 

export async function sendInvoiceConfirmationEmail({ email, flight_id }) { 
    console.log('sendInvoiceConfirmationEmail called with:', email, flight_id);
    
    const send =await resend.emails.send({ 
        from: 'Airline Invoice System <onboarding@resend.dev>', 
        to: email, 
        subject: `Invoice Confirmation for Flight ${flight_id}`, 
        html: ` 
            <h2>Thank you for your invoice</h2> 
            <p>Your invoice for flight ${flight_id} has been received.</p> 
            <p>We will get back to you shortly.</p> 
            ` 
    }); 

    console.log("Email sent to", email);
    return send;
}  