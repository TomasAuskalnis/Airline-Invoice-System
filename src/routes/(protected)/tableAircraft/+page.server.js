import { aircraftsService } from '$lib/server/services/aircrafts-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// load - server side
export async function load() {
    try {
        // use functions from service layer that then calls data access layer functions
        const aircraft = await aircraftsService.getAllAircrafts();
        console.log(aircraft)

        // return data
        return {
            aircraft: aircraft
        };
    
    // if business logic threw an error then catch it 
    } catch (error) {
        console.error('Error retrieving aircraft:', error);
        return fail(500, { error });
    }
}

// CRUD
// Handle form actions
// contains all needed functions within the export
export const actions = {

    // creating aircraft, usable from page, takes request object
    createAircraft: async ({ request }) => {
        try {
            // get the from data from the request object (form)
            const formData = await request.formData();
            //console.log(formData)
            
            // create an array with the form data
            // get should correspond to names in markdown of form
            // never pass a aircraft id in here or it will break auto increment
            const aircraftData = {
                model: formData.get('aircraftModel'),
                capacity: Number(formData.get('aircraftCapacity')),
                range: Number(formData.get('aircraftRange')),
                speed: Number(formData.get('aircraftSpeed')),
                hourlyFuel: Number(formData.get('aircraftFuel'))
            };

            // Call the aircraft service passing in the form data into the create function
            await aircraftsService.createAircraft(aircraftData);

            // return a success message to the page
            return { success: true };

        } catch (err) { // catching errors, don't read too hard into details
            console.error('Error creating aircraft:', err);

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
                errors: { general: err instanceof Error ? err.message : 'Failed to create aircraft' }
            });
        }
    },

    // updating aircraft from main page, takes request from a form again
    updateAircraft: async ({ request }) => {
		try {
            // Get the form data
            const formData = await request.formData();
            const id = Number(formData.get('aircraftID'));

            // Fetch existing flight from DB
            const existingAircraft = await aircraftsService.getAircraftById(id);
            
            // error if doesn't exist
            if (!existingAircraft) {
                return fail(404, {
                    errors: { general: 'Aircraft not found' }
                });
            }

			// create a variable with the form data
            // same logic as creating
            const aircraftData = {
                model: formData.get('aircraftModel'),
                capacity: Number(formData.get('aircraftCapacity')),
                range: Number(formData.get('aircraftRange')),
                speed: Number(formData.get('aircraftSpeed')),
                hourlyFuel: Number(formData.get('aircraftFuel'))
            };

            // Call the flights service passing in the form data
            await aircraftsService.updateAircraft(id, aircraftData);
            
            // return success to main page
			return { success: true };

		} catch (err) { // catch errors
            console.error('Error updating aircraft:', err);

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
                errors: { general: err instanceof Error ? err.message : 'Failed to update aircraft' }
            });
        }
	},

    // deleting aircraft, takes request from form
    deleteAircraft: async ({ request }) => {
		try {
			const formData = await request.formData();

            // small form that only needs id, retrieve it 
            const id = Number(formData.get('aircraftID'));
            //console.log(id)
			
            // Call the aircraft service passing in the ID
			await aircraftsService.deleteAircraft(id);
            
            // return success to main page
			return { success: true };

		} catch (err) { // catch errors
            console.error('Error deleting aircraft:', err);

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
                general: 'Cannot delete this aircraft because it is linked to other records.'
                }
            });
            }

            // Generic, non-leaky message for unexpected DB errors
            return fail(500, {
                errors: { general: 'Failed to delete aircraft' }
            });
        }
	}
};