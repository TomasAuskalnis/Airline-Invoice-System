<script>
    // get data that was returned when the page was loaded
    let { data } = $props();

    // get the product and category data
    // if state changes the variable will auto update
    let users = $state(data.users);

    // Svelte 5 introduces $inspect(), which is for debugging reactive state instead of console.log
    $inspect(users);
</script> 

<section>
    <h1>Users</h1>

    <div class="col-sm-10">
        <table class="table table-bordered table-hover w-100">

            <!-- setup headers-->
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First name</th> 
                    <th>Last name</th>
                    <th>Role</th>
                    <th>Privileges</th>
                </tr>
            </thead>
            <tbody>
                
                <!-- go through users-->
                {#each users as user}
                    <tr >
                        <td>{user.user_id}</td>
                        <td>{user.fname}</td>
                        <td>{user.lname}</td>
                        <td>{user.role}</td>
                        <td>{user.privileges}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</section>
<!-- Deimas-->