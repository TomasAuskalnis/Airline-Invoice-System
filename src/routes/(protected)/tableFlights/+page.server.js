import { flightsService } from '$lib/server/services/flights-service.js';
import { aircraftsService } from '$lib/server/services/aircrafts-service.js';
import { error, fail } from '@sveltejs/kit';
import { inspect } from 'node:util';
import { ZodError } from 'zod';

// load - server side
export async function load() {
    try {
        // use functions from service layer that then calls data access layer functions
        const flights = await flightsService.getAllFlights();
        const aircraft = await aircraftsService.getAllAircrafts();
        //$inspect(flights);

        // return data
        return {
            flights: flights,
            aircraft: aircraft
        };
    
    // if business logic threw an error then catch it 
    } catch (error) {
        console.error('Error retrieving flights:', error);
        return fail(500, { error });
    }
}

// Handle form actions
// contains all needed functions within the export
export const actions = {

    // creating flights, usable from page, takes request object
    createFlight: async ({ request }) => {
        try {
            // get the from data from the request object (form)
            const formData = await request.formData();
            
            // create an array with the form data
            // get should correspond to names in markdown of form
            // never pass a flight id in here or it will break auto increment
            const flightData = {
                arrival_time: formData.get('flightArrival'),
                departure_time: formData.get('flightDeparture'),
                status: formData.get('flightStatus'),
                aircraft_id: Number(formData.get('flightAircraft')),
                route_id: Number(formData.get('flightRoute')),
                created_by: Number(formData.get('flightCreatedBy'))
            };
            // ids don't update but that's fine (flights don't change route or aircraft mid flight)

            // Call the flight service passing in the form data into the create function
            await flightsService.createFlight(flightData);

            // return a success message to the page
            return { success: true };

        } catch (err) { // catching errors, don't read too hard into details
            console.error('Error creating flight:', err);

            // If validation fails (checked by Zod), it throws a ZodError.
            // We extract the field-specific messages and send them back to the page
            // so the user can see what input was invalid instead of a server error.
            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach((error) => {
                    const field = error.path[0]?.toString();
                    if (field) {
                        errors[field] = error.message;
                    }
                });
                return fail(400, { errors });
            }

            return fail(500, {
                errors: { general: err instanceof Error ? err.message : 'Failed to create flight' }
            });
        }
    },

    // updating flight from main page, takes request from a form again
    updateFlight: async ({ request }) => {
		try {
            // Get the form data
            const formData = await request.formData();
            const id = Number(formData.get('flightID'));

            // Fetch existing flight from DB
            const existingFlight = await flightsService.getFlightById(id);
            
            // error if doesn't exist
            if (!existingFlight) {
                return fail(404, {
                    errors: { general: 'Flight not found' }
                });
            }

			// create a variable with the form data
            // same logic as creating
            const flightData = {
                arrival_time: formData.get('flightArrival'),
                departure_time: formData.get('flightDeparture'),
                status: formData.get('flightStatus'),
                aircraft_id: Number(formData.get('flightAircraft')),
                route_id: Number(formData.get('flightRoute')),
                created_by: Number(formData.get('flightCreatedBy'))
            };

            // Call the flights service passing in the form data
            await flightsService.updateFlight(id, flightData);
            
            // return success to main page
			return { success: true };

		} catch (err) { // catch errors
            console.error('Error updating flight:', err);

            // Zod validation error → return user input errors (not a server error)
            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach((error) => {
                    const field = error.path[0]?.toString();
                    if (field) {
                        errors[field] = error.message;
                    }
                });
                return fail(400, { errors });
            }

            return fail(500, {
                errors: { general: err instanceof Error ? err.message : 'Failed to update flight' }
            });
        }
	},

    // deleting flights, takes request from form
    deleteFlight: async ({ request }) => {
		try {
			const formData = await request.formData();

            // small form that only needs id, retrieve it 
            const id = Number(formData.get('flightID'));
			
            // Call the flight service passing in the ID
			await flightsService.deleteFlight(id);
            
            // return success to main page
			return { success: true };

		} catch (err) { // catch errors
            console.error('Error deleting flight:', err);

            // Zod validation error → return user input errors (not a server error)
            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach((error) => {
                    const field = error.path[0]?.toString();
                    if (field) {
                        errors[field] = error.message;
                    }
                });
                return fail(400, { errors });
            }

            // Drizzle errors can be nested; check both err and err.cause
            const code = err?.cause?.code || err?.code || '';
            const message = (err?.cause?.message || err?.message || '').toString();
            const isForeignKey = code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || message.includes('SQLITE_CONSTRAINT_FOREIGNKEY');

            if (isForeignKey) {
            return fail(409, {
                errors: {
                general: 'Cannot delete this flight because it is linked to other records.'
                }
            });
            }

            // Generic, non-leaky message for unexpected DB errors
            return fail(500, {
                errors: { general: 'Failed to delete flight' }
            });
        }
	},

    pay: async ({ locals, flight_id }) => { 
        console.log("user attempting checkout")
        console.log(flight_id)

        if (!locals.user) throw error(401, 'Not authenticated'); 

        // 1️ Get user's cart and items  
        // figure out how to get id to here as an argument
        // won't work as is
        // const flight = await flightsService.getFlightById(id); 

        // 3️ Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment', // one-time payment
            payment_method_types: ['card'], // allow card payments
            customer_email: "X00227989@myTUDublin.ie",// locals.user.email, // optional, prefill Stripe checkout
            metadata: {
            flightID: flight_id.toString() // <-- link Stripe session to order
        },
            

        /*
        line_items: items.map(item => ({
        price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: item.unitPrice // price in cents
        },

        quantity: item.quantity
        })),
        */

        //success_url: `${ORIGIN}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
        //cancel_url: `${ORIGIN}/cart`

        });

        // 4️ Redirect user to Stripe-hosted checkout page
        throw redirect(303, session.url);
    }
};