<script>
    import { duration } from 'drizzle-orm/gel-core';
    import { slide, fade } from 'svelte/transition';

    // get data that was returned when the page was loaded
    let { data } = $props();

    // get the product and category data
    // if state changes the variable will auto update
    let users = $state(data.users);

    // Svelte 5 introduces $inspect(), which is for debugging reactive state instead of console.log
    $inspect(users);
</script> 

<section id="existing-users">
    <h1>Users</h1>

    <div class="col-sm-10">
        <table class="table table-bordered table-hover w-100">

            <!-- setup headers-->
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th> 
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                
                <!-- go through users-->
                {#each users as user}
                    <tr>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <!-- Deimas-->
</section>
