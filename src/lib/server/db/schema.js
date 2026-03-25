import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema.js';

// -------------------------------------
// users table
// -------------------------------------


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
export const flight = sqliteTable('flight', {
	flight_id: integer().primaryKey({ autoIncrement: true }),
	arrival_time: text().notNull(),
	departure_time: text().notNull(),
	status: text().notNull(),
	aircraft_id: integer().notNull(),
	route_id: integer().notNull(),
	created_by: integer().notNull()
});

// -------------------------------------
// routes table
// -------------------------------------
export const route = sqliteTable('route', {
	route_id: integer().primaryKey({ autoIncrement: true }),
	origin: text().notNull(),
	destination: text().notNull(),
	distance: integer().notNull()
});

// -------------------------------------
// relationships
// -------------------------------------
// users -> flights (1:many)
export const userRelations = relations(user, ({ many }) => ({
	flight: many(flight, { fields: [user.user_id], references: [flight.created_by] })
}));

// aircraft -> flights (1:many)
export const aircraftRelations = relations(aircraft, ({ many }) => ({
	flight: many(flight, {
		fields: [aircraft.aircraft_id],
		references: [flight.aircraft_id]
	})
}));

// routes -> flights (1:many)
export const routeRelations = relations(route, ({ many }) => ({
	flight: many(flight, { fields: [route.route_id], references: [flight.route_id] })
}));

export *  from './auth.schema';
