import { db } from '../db/index.js';
import { user } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/* refer back to schema.js
export const user = sqliteTable('user', {
    user_id: integer().primaryKey({ autoIncrement: true }),
    role: integer().notNull(),       
    privileges: text().notNull(), 
    passwordHash: text().notNull(),  // (just plain text for now) 
    fname: text().notNull(),
    lname: text().notNull(),
});
*/

// function to access users table
export const usersDataAccess = {

    /** Find a user by their ID */
    async findById(id) {
        const result = await db.select().from(user).where(eq(user.user_id, id)).limit(1);
        return result[0] ?? null;
    },

    /** Get all users */
    async findAll() {
        return await db.select().from(user);
    },

    /** Get users by role */
    async findByRole(role) {
        return await db.select().from(user).where(eq(user.role, role));
    },

    /* Create a new user */
    async create(userData) {
        const result = await db.insert(user).values(userData).returning();
        console.log("Added user >>>>>>>", result[0]);
        return result[0];
    },

    /** Update an existing user */
    async update(id, userData) {
        const result = await db.update(user).set(userData).where(eq(user.user_id, id)).returning();
        console.log("Updated user >>>>>>>", result[0]);
        return result[0];
    },

    /** Delete a user */
    async delete(id) {
        const result = await db.delete(user).where(eq(user.user_id, id));
        console.log("Deleted user >>>>>>>", result);
        return result.rowsAffected > 0;
    }
};