import { usersService } from '$lib/server/services/users-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { sendOrderConfirmationEmail } from '$lib/server/email/email-service.js';
import { notifyContactReceived } from '$lib/server/notifications/contact-notifications.js';

// load - server side
export async function load(event) {

    try {
        // make sure to convert to number
        let userId = Number(event.locals.user.id);
        console.log("USerID >>>>>>>>>>>>>>>>>", userId );

        const userData = await usersService.getById(userId);
        console.log(userData)
        
        // return data to main page
        return {
            userId // user
        }

    // catch errors
    } catch (err) {
        console.error('Error retrieving user:', err);
        return fail(500, { err });
    }
}

export const actions = {
    notifyContactReceived: async (event) => {
        try {
            const result = await sendOrderConfirmationEmail({
                email: 'x00227989@mytudublin.ie'
            });
            console.log('Resend result:', result);
            return { success: true };
        } catch (err) {
            console.error('Action error:', err); 
            return fail(500, { error: 'Failed to send email' });
        }
    }
};