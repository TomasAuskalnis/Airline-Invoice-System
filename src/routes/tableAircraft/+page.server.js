import { db } from '$lib/server/db';

// load - server side
export async function load() {
    // get categories and locations
    const aircraft = await db.query.aircraft.findMany();

    // debugging purposes
    console.log('Aircraft:', aircraft);

    // return data
    return {
        aircraft: aircraft
    }
}