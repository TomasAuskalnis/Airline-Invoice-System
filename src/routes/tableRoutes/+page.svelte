<script>
    // get data that was returned when the page was loaded
    let { data } = $props();

    // get the product and category data
    // if state changes the variable will auto update
    let routes = $state(data.routes);

    /*
    export const route = sqliteTable('route', {
        route_id: integer().primaryKey({ autoIncrement: true }),
        origin: text().notNull(),
        destination: text().notNull(),      
        distance: integer().notNull()
    });
    */

    // Svelte 5 introduces $inspect(), which is for debugging reactive state instead of console.log
    $inspect(routes);
</script> 

<section>
    <h1>Routes</h1>

    <div class="col-sm-10">
        <table class="table table-bordered table-hover w-100">

            <!-- setup headers-->
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Origin</th> 
                    <th>Destination</th>
                    <th>Distance</th>
                </tr>
            </thead>
            <tbody>
                
                <!-- go through users-->
                {#each routes as route}
                    <tr >
                        <td>{route.route_id}</td>
                        <td>{route.origin}</td>
                        <td>{route.destination}</td>
                        <td>{route.distance}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</section>
<!-- Deimas-->
