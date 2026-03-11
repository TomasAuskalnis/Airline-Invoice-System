import { db } from '../db/index.js';
import { flight } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// works the same as the products access layer
/*
export const flight = sqliteTable('flight', {
    flight_id: integer().primaryKey({ autoIncrement: true }),
    arrival_time: text().notNull(),
    departure_time: text().notNull(),
    status: text().notNull(),
    aircraft_id: integer().notNull(),
    route_id: integer().notNull(),
    created_by: integer().notNull()
});
*/

// function to access flight table
export const flightsDataAccess = {

/** Find a flight by its ID */
    async findById(id) {
        const result = await db.select().from(flight).where(eq(flight.flight_id, id)).limit(1);
        return result[0] ?? null;
    },

    /** Get all flights */
    async findAll() {
        return await db.select().from(flight);
    },

    /** Create a new flight */
    async create(flightData) {
        const result = await db.insert(flight).values(flightData).returning();
        console.log("Added flight >>>>>>>", result[0]);
        return result[0];
    },

    /** Update an existing flight */
    async update(id, flightData) {
        const result = await db.update(flight).set(flightData).where(eq(flight.flight_id, id)).returning();
        console.log("Updated flight >>>>>>>", result[0]);
        return result[0];
    },

    /** Delete a flight */
    async delete(id) {
        const result = await db.delete(flight).where(eq(flight.flight_id, id));
        console.log("Deleted flight >>>>>>>", result);
        return result.rowsAffected > 0;
    }
}; 