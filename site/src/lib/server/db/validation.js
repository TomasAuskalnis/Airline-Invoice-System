import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'; 
import { user, aircraft, flight, route } from './schema.js';

/* what needs to be done for each table;
1. Define required type and length for each columm
2. Add a message that will be displayed as an error if requirements not met
*/

/** =========================
* User Schemas
export const user = sqliteTable('user', {
    user_id: integer().primaryKey({ autoIncrement: true }),
    role: integer().notNull(),       
    privileges: text().notNull(),     
    name: text().notNull()
});
* ========================= */
export const selectUserSchema = createSelectSchema(user);

export const insertUserSchema = createInsertSchema(user, {
    user_id: z.number().int().positive().min(1, 'User ID is required'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    passwordHash: z.string().min(6, 'Password is required'),
    fname: z.string().min(1, 'Firstname is required'),
    lname: z.string().min(1, 'Lastname is required'),
    role: z.enum(['user', 'admin']).default('user')
});

// rules for updating the table
export const updateUserSchema = insertUserSchema
    .partial()
    .omit({
    user_id: true,
    passwordHash: true // update password separately
});

// rules fr deleting from the rable
export const deleteUserSchema = z.object({
    user_id: z.number().int().positive()
});

/** ========================= 
 *  * Aircraft Schemas
 * export const aircraft = sqliteTable('aircraft', {
    aircraft_id: integer().primaryKey({ autoIncrement: true }),
    model: text().notNull().unique(),
    status: text().notNull(),
    capacity: integer().notNull(),
    range: integer().notNull(),
    speed: integer().notNull()
 });
* ========================= */
export const selectAircraftSchema = createSelectSchema(aircraft);

export const insertAircraftSchema = createInsertSchema(aircraft, {
    aircraft_id: z.number().int().positive().min(1, 'Aircraft ID is required'),
    model: z.string().min(2, 'Model is required'),
    status: z.string().min(2, 'Status is required'),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    range: z.number().int().min(1, 'Range must be at least 1'),
    speed: z.number().int().min(1, 'Speed must be at least 1')
});

export const updateAircraftSchema = insertAircraftSchema
    .partial()
    .omit({ aircraft_id: true });

export const deleteAircraftSchema = z.object({
    aircraft_id: z.number().int().positive()
});

/** =========================
* Flight Schemas
export const flight = sqliteTable('flight', {
    flight_id: integer().primaryKey({ autoIncrement: true }),
    arrival_time: text().notNull(),
    departure_time: text().notNull(),
    status: text().notNull(),
    aircraft_id: integer().notNull(),
    route_id: integer().notNull(),
    created_by: integer().notNull()
});
* ========================= */
export const selectFlightSchema = createSelectSchema(flight);

export const insertFlightSchema = createInsertSchema(flight, {
    flight_id: z.number().int().positive().min(1, 'Flight ID is required'),
    arrival_time: z.string().min(2, 'Arrival time is required'),
    departure_time: z.string().min(2, 'Departure time is required'),
    status: z.string().min(2, 'Status is required'),
    aircraft_id: z.number().int().positive().min(1, 'Aircraft ID is required'),
    route_id: z.number().int().positive().min(1, 'Route ID is required'),
    created_by: z.number().int().positive().min(1, 'Created by is required (a user ID)')
});

export const updateFlightSchema = insertFlightSchema
    .partial()
    .omit({
    flight_id: true,
    aircraft_id: true,
    route_id: true
});

export const deleteFlightSchema = z.object({
    flight_id: z.number().int().positive()
});

/** =========================
* Route Schemas
export const route = sqliteTable('route', {
    route_id: integer().primaryKey({ autoIncrement: true }),
    origin: text().notNull(),
    destination: text().notNull(),      
    distance: integer().notNull()
});
* ======================== */
export const selectRouteSchema = createSelectSchema(route);

export const insertRouteSchema = createInsertSchema(route, {
    route_id: z.number().int().positive().min(1, 'Route ID is required'),
    origin: z.string().min(2, 'Origin is required'),
    destination: z.string().min(2, 'Origin is required'),
    distance: z.number().int().min(1, 'Distance is required')
});

export const updateRouteSchema = insertRouteSchema
    .partial()
    .omit({
    route_id: true
});

export const deleteRouteSchema = z.object({
    route_id: z.number().int().positive()
});