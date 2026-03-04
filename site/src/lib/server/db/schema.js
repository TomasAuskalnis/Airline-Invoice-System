import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// -------------------------------------
// users table
// -------------------------------------
export const users = sqliteTable('users', {
	user_id: integer().primaryKey({ autoIncrement: true }),
	role: integer().notNull().unique(),
	privilages: text().notNull(),
	name: text().notNull()
});

// -------------------------------------
// aircraft table
// -------------------------------------
export const aircraft = sqliteTable('aircraft', {
	aircraft_id: integer().primaryKey({ autoIncrement: true }),
	model: text().notNull().unique(),
	status: text().notNull(),
	capacity: integer().notNull(),
	range: integer().notNull(),
	speed: integer().notNull()
});

// -------------------------------------
// flights table
// -------------------------------------
export const flights = sqliteTable('flights', {
	flight_id: integer().primaryKey({ autoIncrement: true }),
	destination: text().notNull().unique(),

	// arrival and departure times are stored in format "YYYY-MM-DD HH:MM:SS"
	arrival_time: text().notNull(),
	departure_time: text().notNull(),

	status: text().notNull(),
	origin: text().notNull(),
	aircraft_id: integer().notNull(),
	route_id: integer().notNull(),
	created_by: integer().notNull(),
	distance: integer().notNull()
});

// -------------------------------------
// routes table
// -------------------------------------
export const routes = sqliteTable('routes', {
	route_id: integer().primaryKey({ autoIncrement: true }),
	distance: integer().notNull().unique(),
	starting_route: text().notNull(),
	ending_route: text().notNull()
});

// -------------------------------------
// relationships
// -------------------------------------

// to setup a relationship create a variable for the relationship
// it will be set to a relations object
// specifies relationship of the 1st table towards the 2nd table
// set variable to export 

// users -> flights (1:many)
export const userRelations = relations(users, ({ many }) => ({
	flights: many(flights,{
		fields: [users.user_id],
		references: [flights.created_by]
	})
}));

// aircraft -> flights (many:1)
export const aircraftRelations = relations(aircraft, ({ many }) => ({
	flights: many(flights,{
		fields: [aircraft.aircraft_id],
		references: [flights.aircraft_id]
	})
}));

// routes -> flights (1:many)
export const routeRelations = relations(routes, ({ many }) => ({
	flights: many(flights, {
		fields: [routes.route_id],
		references: [flights.route_id]
	})
}));
