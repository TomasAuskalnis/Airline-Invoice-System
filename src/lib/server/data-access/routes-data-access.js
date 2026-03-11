import { db } from '../db/index.js';
import { route } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/* routes schema
export const route = sqliteTable('route', {
    route_id: integer().primaryKey({ autoIncrement: true }),
    origin: text().notNull(),
    destination: text().notNull(),      
    distance: integer().notNull()
});
*/

// function to access categories table
export const routesDataAccess = {

/** Find a category by its ID */
    async findById(id) {
        const result = await db.select().from(route).where(eq(route.route_id, id)).limit(1);
        return result[0] ?? null;
    },

    /** Get all routes */
        async findAll() {
        return await db.select().from(route);
    },

    /* Create a new route */
    async create(routeData) {
        const result = await db.insert(user).values(routeData).returning();
        console.log("Added route >>>>>>>", result[0]);
        return result[0];
    },

    /** Update an existing route */
    async update(id, routeData) {
        const result = await db.update(user).set(routeData).where(eq(route.route_id, id)).returning();
        console.log("Updated route >>>>>>>", result[0]);
        return result[0];
    },

    /** Delete a route */
    async delete(id) {
        const result = await db.delete(route).where(eq(route.route_id, id));
        console.log("Deleted route >>>>>>>", result);
        return result.rowsAffected > 0;
    }
}; 