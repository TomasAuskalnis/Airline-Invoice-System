<script>
    // get data that was returned when the page was loaded
    let { data } = $props();

    // get the product and category data
    // if state changes the variable will auto update
    let flights = $state(data.flights);

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

    // Svelte 5 introduces $inspect(), which is for debugging reactive state instead of console.log
    $inspect(flights);
</script> 

<section>
    <h1>Flights</h1>

    <div class="col-sm-10">
        <table class="table table-bordered table-hover w-100">

            <!-- setup headers-->
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Arrival</th> 
                    <th>Departure</th>
                    <th>Status</th>
                    <th>Aircraft</th>
                    <th>Route</th>
                    <th>Created by</th>
                </tr>
            </thead>
            <tbody>
                
                <!-- go through users-->
                {#each flights as flight}
                    <tr >
                        <td>{flight.flight_id}</td>
                        <td>{flight.arrival_time}</td>
                        <td>{flight.departure_time}</td>
                        <td>{flight.status}</td>
                        <td>{flight.aircraft_id}</td>
                        <td>{flight.route_id}</td>
                        <td>{flight.created_by}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</section>
<!-- Deimas-->
