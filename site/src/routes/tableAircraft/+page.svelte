<script>
    // get data that was returned when the page was loaded
    let { data } = $props();

    // get the product and category data
    // if state changes the variable will auto update
    let aircrafts = $state(data.aircraft);

    /*
    export const aircraft = sqliteTable('aircraft', {
        aircraft_id: integer().primaryKey({ autoIncrement: true }),
        model: text().notNull().unique(),
        status: text().notNull(),
        capacity: integer().notNull(),
        range: integer().notNull(),
        speed: integer().notNull()
    });
    */

    // Svelte 5 introduces $inspect(), which is for debugging reactive state instead of console.log
    $inspect(aircrafts);
</script> 

<section>
    <h1>Aircraft</h1>

    <div class="col-sm-10">
        <table class="table table-bordered table-hover w-100">

            <!-- setup headers-->
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Model</th> 
                    <th>Status</th>
                    <th>Capacity</th>
                    <th>Range</th>
                    <th>Speed</th>
                </tr>
            </thead>
            <tbody>
                
                <!-- go through users-->
                {#each aircrafts as aircraft}
                    <tr >
                        <td>{aircraft.aircraft_id}</td>
                        <td>{aircraft.model}</td>
                        <td>{aircraft.status}</td>
                        <td>{aircraft.capacity}</td>
                        <td>{aircraft.range}</td>
                        <td>{aircraft.speed}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</section>
<!-- Deimas-->
