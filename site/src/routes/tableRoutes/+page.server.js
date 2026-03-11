import { routesService } from '$lib/server/services/routes-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// load - server side
export async function load() {
    try {
        // use functions from service layer that then calls data access layer functions
        const routes = await routesService.getAllRoutes();
        //$inspect(routes);

        // return data
        return {
            routes: routes
        };
    
    // if business logic threw an error then catch it 
    } catch (error) {
        console.error('Error retrieving routes:', error);
        return fail(500, { error });
    }
}