import { db } from '../db/index.js';
import { aircraft } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// function to access products table
// this whole function and the functions it contains are exported to be usable outside this js file
export const aircraftsDataAccess = {

    /** Find a aircraft by its ID */
    async findById(id) {
        const result = await db.select().from(aircraft).where(eq(aircraft.aircraft_id, id)).limit(1);
        return result[0] ?? null;
    },

    /** Find a aircraft by its model */
    async findByModel(model) {
        const result = await db.select().from(aircraft).where(eq(aircraft.model, model)).limit(1);
        return result[0] ?? null;
    },

    /** Get all aircraft */
    async findAll() {
        return await db.select().from(aircraft);
    },

    /** Create a new aircraft */
    // works similar to a find but inserts new data into the db instead
    async create(aircraftData) {
        const result = await db.insert(aircraft).values(aircraftData).returning();
        console.log("Added aircraft >>>>>>>", result[0]);
        return result[0];
    },

    /** Update an existing aircraft */
    // looks for an id and updates it with the data
    async update(id, aircraftData) {
        const result = await db.update(aircraft).set(aircraftData).where(eq(aircraft.aircraft_id, id)).returning();
        console.log("Updated aircraft >>>>>>>", result[0]);
        return result[0];
    },

    /** Delete a aircraft */
    // looks for an id and deletes it 
    // return number of rows affected
    async delete(id) {
        const result = await db.delete(aircraft).where(eq(aircraft.aircraft_id, id));
        console.log("Deleted aircraft >>>>>>>", result);
        return result.rowsAffected > 0;
    }
};