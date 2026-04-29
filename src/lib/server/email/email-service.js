console.log('EMAIL SERVICE FILE LOADED');

import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { user } from '../db/auth.schema';

const resend = new Resend(RESEND_API_KEY);

export async function sendOrderConfirmationEmail({ email }) { 
    console.log('sendOrderConfirmationEmail called with:', email);
    
    const send =await resend.emails.send({ 
        from: 'WebDev Shop <onboarding@resend.dev>', 
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

 