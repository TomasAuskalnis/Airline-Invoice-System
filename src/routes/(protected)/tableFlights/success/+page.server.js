import { error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe.js';
import { flightsService } from '$lib/server/services/flights-service.js';

export async function load({ url, locals }) {
    // 1️ Ensure user is logged in
    if (!locals.user) {
        throw error(401, 'Not authenticated');
    }

    // Normalize user ID (Better Auth may return it as a string)
    // if not int convert to int
    const userId = Number(locals.user.id);
    if (!Number.isInteger(userId)) {
        throw error(401, 'Invalid user');
    }

    // 2️ Get Stripe session ID from URL
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId) {
        throw error(400, 'Missing session_id');
    }

    // 3️ Fetch Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 4️ Ensure payment is complete
    if (session.payment_status !== 'paid') {
        throw error(400, 'Payment not completed');
    }

    // 5️ Extract flightID from metadata
    const flightID = Number(session.metadata?.flightID);
    if (!Number.isInteger(flightID)) {
        throw error(400, 'Invalid flight reference');
    }

    // 6️ Load flight from database
    const flight = await flightsService.getFlightById(flightID);
    if (!flight) {
        throw error(404, 'Flight not found');
    }

    return { flight };
}