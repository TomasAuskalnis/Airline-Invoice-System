import { routesDataAccess } from '../data-access/routes-data-access.js';
import { NotFoundError } from '../utils/errors.js';
import { insertRouteSchema, updateRouteSchema, deleteRouteSchema }from '../db/validation.js';
import { route } from '../db/schema.js';

// The Service Layer performs validation, permission checks,
// and applies domain rules before database operations occur.
export const routesService = {

    /** Get route by ID */
    async getRouteById(id) {
        const category = await routesDataAccess.findById(id);

        if (!route) throw new NotFoundError('Route not found');
        return route;
    },

    /** Get all routes */
    async getAllRoutes() {
        return await routesDataAccess.findAll();
    },

    /** Create a new route */
    async createRoute(routeData) {
        console.log("IN createRoute >>>>>>");

        // Validate with Zod
        const validated = insertRouteSchema.parse(routeData);
        return await routesDataAccess.create(validated);
    },

    /** Update an route */
    async updateRoute(id, routeData) {
        console.log('IN updateRoute >>>>>>');
        const validated = updateRouteSchema.parse(routeData);
        const updatedRoute = await routesDataAccess.update(id, validated);

        if (!updatedRoute) throw new NotFoundError('Route not found after update');
        return updatedRoute;
    },

    /** Delete an route */
    async deleteRoute(id) {
        console.log('IN deleteRoute >>>>>>', id);
        const validated = deleteRouteSchema.parse({ id });
        const deleted = await routesDataAccess.delete(validated.id);

        if (!deleted) throw new NotFoundError('Route not found to delete');
        return deleted;
    }
};