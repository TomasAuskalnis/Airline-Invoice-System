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

// CRUD
// Handle form actions
// contains all needed functions within the export
export const actions = {

    // creating routes, usable from page, takes request object
    createRoute: async ({ request }) => {
        try {
            // get the from data from the request object (form)
            const formData = await request.formData();
            
            // create an array with the form data
            // get should correspond to names in markdown of form
            // never pass a route id in here or it will break auto increment
            const routeData = {
                origin: formData.get('routeOrigin'),
                destination: formData.get('routeDestination'),
                distance: Number(formData.get('routeDistance'))
            };
        
            // Call the route service passing in the form data into the create function
            await routesService.createRoute(routeData);

            // return a success message to the page
            return { success: true };

        } catch (err) { // catching errors, don't read too hard into details
            console.error('Error creating route:', err);

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
                errors: { general: err instanceof Error ? err.message : 'Failed to create route' }
            });
        }
    },

    // updating route from main page, takes request from a form again
    updateRoute: async ({ request }) => {
		try {
            // Get the form data
            const formData = await request.formData();
            const id = Number(formData.get('routeID'));

            // Fetch existing route from DB
            const existingRoute = await routesService.getRouteById(id);
            
            // error if doesn't exist
            if (!existingRoute) {
                return fail(404, {
                    errors: { general: 'Route not found' }
                });
            }

			// create a variable with the form data
            // same logic as creating
            const routeData = {
                origin: formData.get('routeOrigin'),
                destination: formData.get('routeDestination'),
                distance: Number(formData.get('routeDistance'))
            };
            //console.log(routeData)

            // Call the flights service passing in the form data
            await routesService.updateRoute(id, routeData);
            
            // return success to main page
			return { success: true };

		} catch (err) { // catch errors
            console.error('Error updating route:', err);

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
                errors: { general: err instanceof Error ? err.message : 'Failed to update route' }
            });
        }
	},

    // deleting flights, takes request from form
    deleteRoute: async ({ request }) => {
		try {
			const formData = await request.formData();

            // small form that only needs id, retrieve it 
            const id = Number(formData.get('routeID'));
			
            // Call the route service passing in the ID
			await routesService.deleteRoute(id);
            
            // return success to main page
			return { success: true };

		} catch (err) { // catch errors
            console.error('Error deleting route:', err);

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
                general: 'Cannot delete this route because it is linked to other records.'
                }
            });
            }

            // Generic, non-leaky message for unexpected DB errors
            return fail(500, {
                errors: { general: 'Failed to delete route' }
            });
        }
	}
};