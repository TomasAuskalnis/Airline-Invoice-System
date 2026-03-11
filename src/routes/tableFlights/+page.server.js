import { flightsService } from '$lib/server/services/flights-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// load - server side
export async function load() {
    try {
        // use functions from service layer that then calls data access layer functions
        const flights = await flightsService.getAllFlights();
        //$inspect(flights);

        // return data
        return {
            flights: flights
        };
    
    // if business logic threw an error then catch it 
    } catch (error) {
        console.error('Error retrieving flights:', error);
        return fail(500, { error });
    }
}