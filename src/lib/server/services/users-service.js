import { usersDataAccess } from '$lib/server/data-access/users-data-access.js';
import { idSchema, updateProfileSchema, adminInsertUserSchema, deleteUserSchema } from '$lib/server/db/validation.js';

export const usersService = {
	async getById(id) {
		const validated = idSchema.parse({ id });
		return await usersDataAccess.findById(validated.id);
	},

	async getByEmail(email) {
		return await usersDataAccess.findByEmail(email);
	},

	async getAllUsers() {
		return await usersDataAccess.findAll();
	},

	/** Create a new user */
	async createUser(userData) {
		console.log("IN createUser >>>>>>");

		// Validate with Zod
		const validated = adminInsertUserSchema.parse(userData);
		return await usersDataAccess.create(validated);
	},

	/** Delete a user */
	// make sure to use id as argument (must be consistent with id naming convention)
	async deleteUser(id) {
		console.log('IN deleteUser >>>>>>', id);
		const validated = deleteUserSchema.parse({ id });
		const deleted = await usersDataAccess.delete(validated.id);

		if (!deleted) throw new NotFoundError('User not found to delete');
		return deleted;
	},

	async updateProfile(id, profileData) {
		const validatedId = idSchema.parse({ id });
		const validatedProfile = updateProfileSchema.parse(profileData);

		return await usersDataAccess.update(validatedId.id, validatedProfile);
	},

	async updateProfileByEmail(email, profileData) {
		const existingUser = await usersDataAccess.findByEmail(email);

		if (!existingUser) {
			throw new Error('User not found');
		}

		const validatedProfile = updateProfileSchema.parse(profileData);

		return await usersDataAccess.update(existingUser.id, validatedProfile);
	}
};