// aircraftsService.js
// business logic for aircrafts table

// import the aircrafts data access js file
import { aircraftsDataAccess } from '../data-access/aircrafts-data-access.js';

// import error utility
import { ValidationError, NotFoundError } from '../utils/errors.js';

// import schemas from validation
import { insertAircraftSchema, updateAircraftSchema, deleteAircraftSchema } from '../db/validation.js';

// export whole function to be usable elsewhere
export const aicraftsService = {

    /** Get a aircraft by ID */
    async getAircraftById(id) {
        // use function already present in data access js
        const aircraft = await aircraftsDataAccess.findById(id);

        // throw error if not found, else return it
        if (!aircraft) throw new NotFoundError('Aircraft not found');
        return aircraft;
    },

    /** Get a aircraft by model */
    async getAircraftByName(model) {
        const aircraft = await aircraftsDataAccess.findByName(model);
        if (!aircraft) throw new NotFoundError('Aircraft not found');
        return aircraft;
    },

    /** Get all aircrafts */
    async getAllAircrafts() {
        return await aircraftsDataAccess.findAll();
    },

    /** Create a new aircraft */
    async createAircraft(aircraftData) {
        console.log("IN createAircraft >>>>>>");

        // Validate with Zod
        const validated = insertAircraftSchema.parse(aircraftData);
        return await aircraftsDataAccess.create(validated);
    },

    /** Update a aircraft */
    async updateAircraft(id, aircraftData) {
        console.log("IN updateAircraft >>>>>>");

        // Validate with Zod
        const validated = updateAircraftSchema.parse(aircraftData);
        const updatedAircraft = await aircraftsDataAccess.update(id, validated);

        if (!updatedAircraft) throw new NotFoundError('Aircraft not found after update');
        return updatedAircraft;
    },

    /** Delete a aircraft */
    async deleteAircraft(id) {
        console.log("IN deleteAircraft >>>>>>");

        // Validate with Zod (expects object with id)
        const validated = deleteAircraftSchema.parse({ id });
        const deleted = await aircraftsDataAccess.delete(validated.id);

        if (!deleted) throw new NotFoundError('Aircraft not found to delete');
        return deleted;
    }
}; 