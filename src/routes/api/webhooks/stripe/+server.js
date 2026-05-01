import { stripe } from '$lib/server/stripe.js';
import { json } from '@sveltejs/kit';
import { flightsService } from '$lib/server/services/flights-service.js';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';

/**
* Stripe Webhook Endpoint
* Receives events from Stripe (e.g. checkout completed)
* Must use raw request body for signature verification
*/

export const POST = async ({ request }) => {

    // 1️ Get Stripe signature header (signature for encryption/hash purposes)
    const sig = request.headers.get('stripe-signature');

    // 2️ Read raw body (required for Stripe verification)
    const rawBody = await request.text();
    let event;

    // try to verify signature 3 times max
    try {
        event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET
        );

    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // 4️ Handle relevant Stripe events
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const flightID = Number(session.metadata?.flightID);
        const paymentIntentId = session.payment_intent;

        // check flight id
        if (!flightID) {
            console.warn('checkout.session.completed without metadata');
        }

        try {
            // 5️ Mark flight status as paid (single source of truth)
            await flightsService.updateFlight(flightID, {
                status: 'paid',
                paymentIntentId
            });

            console.log(`Flight ${flightID} marked as paid`);
        } catch (err) {
            console.error(`Failed to update order ${flightID}:`, err);
        }
    }

    // 6️ Acknowledge receipt to Stripe
    return json({ received: true });
};
