import { usersService } from '$lib/server/services/users-service';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// load - server side
export async function load() {
    try {
        // use functions from service layer that then calls data access layer functions
        const users = await usersService.getAllUsers();

        // return data
        return {
            users: users
        }
    
    // if business logic threw an error then catch it 
    } catch (error) {
        console.error('Error retrieving users:', error);
        return fail(500, { error });
    }
}

// Handle form actions
// contains all needed functions within the export
export const actions = {

    // creating users, usable from page, takes request object
    createUser: async ({ request }) => {
        try {
            // get the from data from the request object (form)
            const formData = await request.formData();
            
            // create an array with the form data
            // get should correspond to names in markdown of form
            // never pass a user id in here or it will break auto increment
            const userData = {
                name: formData.get('userName'),
                email: formData.get('userEmail'),
                role: formData.get('userRole'),
                password: formData.get('userPassword'),
                dob: formData.get('userDob')
            };

            // Call the users service passing in the form data into the create function
            await usersService.createUser(userData);

            // return a success message to the page
            return { success: true };

        } catch (err) { // catching errors, don't read too hard into details
            console.error('Error creating user:', err);

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
                errors: { general: err instanceof Error ? err.message : 'Failed to create user' }
            });
        }
    },

    // updating user from main page, takes request from a form again
    updateUser: async ({ request }) => {
        try {
            // Get the form data
            const formData = await request.formData();
            const id = Number(formData.get('userID'));

            // Fetch existing user from DB
            const existingUser = await usersService.getById(id);
            
            // error if doesn't exist
            if (!existingUser) {
                return fail(404, {
                    errors: { general: 'User not found' }
                });
            }

            // create a variable with the form data
            // same logic as creating
            const userData = {
                name: formData.get('userName'),
                email: formData.get('userEmail'),
                role: formData.get('flightStatus'),
                password: formData.get('userPassword'),
                dob: formData.get('userDob')
            };

            // Call the users service passing in the form data
            await usersService.updateProfile(id, userData);
            
            // return success to main page
            return { success: true };

        } catch (err) { // catch errors
            console.error('Error updating user:', err);

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
                errors: { general: err instanceof Error ? err.message : 'Failed to update user' }
            });
        }
    },

    // deleting users, takes request from form
    deleteUser: async ({ request }) => {
        try {
            const formData = await request.formData();

            // small form that only needs id, retrieve it 
            const id = Number(formData.get('userID'));
            console.log(typeof(id))
            
            // Call the users service passing in the ID
            await usersService.deleteUser(id);
            
            // return success to main page
            return { success: true };

        } catch (err) { // catch errors
            console.error('Error deleting user:', err);

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
                general: 'Cannot delete this user because it is linked to other records.'
                }
            });
            }

            // Generic, non-leaky message for unexpected DB errors
            return fail(500, {
                errors: { general: 'Failed to delete user' }
            });
        }
    }
};