import { flightsDataAccess } from '../data-access/flights-data-access.js';
import { NotFoundError } from '../utils/errors.js';
import { insertFlightSchema, updateFlightSchema, deleteFlightSchema }from '../db/validation.js';

// works the same as products service layer

// The Service Layer performs validation, permission checks,
// and applies domain rules before database operations occur.
export const flightsService = {

    /** Get flight by ID */
    async getFlightById(id) {
        const flight = await flightsDataAccess.findById(id);

        if (!flight) throw new NotFoundError('Flight not found');
        return flight;
    },

    /** Get all flights */
    async getAllFlights() {
        return await flightsDataAccess.findAll();
    },

    /** Create a new flight */
    async createFlight(flightData) {
        console.log('IN createFlight >>>>>>');
        const validated = insertFlightSchema.parse(flightData);
        return await flightsDataAccess.create(validated);
    },

    /** Update a flight */
    async updateFlight(flight_id, flightData) {
        console.log('IN updateFlight >>>>>>');
        const validated = updateFlightSchema.parse(flightData);
        const updatedFlight = await flightsDataAccess.update(flight_id, validated);

        if (!updatedFlight) throw new NotFoundError('Flight not found after update');
        return updatedFlight;
    },

    /** Delete a flight */
    async deleteFlight(flight_id) {
        console.log('IN deleteFlight >>>>>>', flight_id);
        const validated = deleteFlightSchema.parse({ flight_id });
        const deleted = await flightsDataAccess.delete(validated.flight_id);

        if (!deleted) throw new NotFoundError('Flight not found to delete');
        return deleted;
    }
};