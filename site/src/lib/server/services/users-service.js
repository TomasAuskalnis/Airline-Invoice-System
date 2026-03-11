// business logic for users table

// import the users data access js file
import { usersDataAccess } from '../data-access/users-data-access.js';

// import error utility
import { ValidationError, NotFoundError } from '../utils/errors.js';

// import schemas from validation
import { insertUserSchema, updateUserSchema, deleteUserSchema } from '../db/validation.js';

// The Service Layer performs validation, permission checks,
// and applies domain rules before database operations occur.
// This layer uses both Zod validators and DAL functions.
export const usersService = {

    /** Get a user by ID */
    async getUserById(id) {
        // use function already present in data access js
        const user = await usersDataAccess.findById(id);

        // throw error if not found, else return it
        if (!user) throw new NotFoundError('User not found');
        return user;
    },

    /** Get all users */
    async getAllUsers() {
        return await usersDataAccess.findAll();
    },

    // get users by role
    async getUsersByRole(role) { 
        return await usersDataAccess.findByRole(role);
    },

    async createUser(userData) {
        console.log("IN createUser >>>>>>");

        // Validate with Zod
        const validated = insertUserSchema.parse(userData);
        return await usersDataAccess.create(validated);
    },

    async updateUser(id, userData) {
        console.log("IN updateUser >>>>>>");

        // Validate with Zod
        const validated = updateUserSchema.parse(userData);
        const updatedUser = await usersDataAccess.update(id, validated);

        if (!updatedUser) throw new NotFoundError('User not found after update');
        return updatedUser;
    },

    async deleteUser(id) {
        console.log("IN deleteUser >>>>>>");

        // Validate with Zod (expects object with id)
        const validated = deleteUserSchema.parse({ id });
        const deleted = await usersDataAccess.delete(validated.id);

        if (!deleted) throw new NotFoundError('User not found to delete');
        return deleted;
    }
}; 