console.log('EMAIL SERVICE FILE LOADED');

import { Resend } from 'resend'; 
import { RESEND_API_KEY } from '$env/static/private'; 

const resend = new Resend(RESEND_API_KEY); 

export async function sendContactEmail({ to }) { 
    console.log('sendContactEmail called with:', to);
    
    await resend.emails.send({ 
        from: 'WebDev Shop <onboarding@resend.dev>', 
        to, 
        subject: `Inquiry Confirmation`, 
        html: ` 
            <h2>Thank you for your inquiry</h2> 
            <p>We will get back to you shortly.</p> 
            ` 
    }); 

    console.log("Email sent to", to); 
} 

 