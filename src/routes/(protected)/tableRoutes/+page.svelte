<script>
    // imports 
    import { enhance } from '$app/forms';

    // route form component
    import RouteForm from '$lib/components/RouteForm.svelte';

    import { slide, fade } from 'svelte/transition';

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

    // CRUD
    /* ========================= 
       Add, Update and Delete
    ========================== */

    // Page-level state for form visibility and updating
    let showForm = $state(false); // whether to show form, default to not shown
    let route = $state(null); // selected route, default none

    // Show the form when the user clicks the add button
    function handleAddNew() {
        route = null; // still none
        showForm = true; // show the form
	}
      
    // Function when updating the form
    function handleUpdate(routeIn) {
        //console.log(flightIn)
        route = routeIn; // set selected route to argument
		showForm = true;
	}

    /* ========================= 
       Modal Popup (Delete)
    ========================== */

    // Track which route is pending deletion
    let routeToDelete = $state(null);

    // Whether the modal is visible
    let showDeleteModal = $state(false);

    // Modal error shown inside the delete modal
    let modalDeleteError = $state('');

    // Open modal and remember the selected route
    function openDeleteModal(route) {
        routeToDelete = route;
        showDeleteModal = true;
        modalDeleteError = ''; // clear old errors
    }

    // Close modal and clear selected flight/error
    function closeDeleteModal() {
        showDeleteModal = false;
        routeToDelete = null;
        modalDeleteError = '';
    }

    // Dedicated enhance handler for delete modal form
    // - On success: close modal
    // - On failure: keep modal open and show the error message
    function enhanceDeleteModal() {
        return async ({ result, update }) => {
            if (!result) return; // return nothing if no result

            if (result.type === 'success') {
                // Close FIRST so UI updates immediately
                closeDeleteModal();

                // This re-runs the page load and refreshes `data`
                await update();
            }

            if (result.type === 'failure') {
                // Keep modal open and show error inside it
                modalDeleteError = result.data?.errors?.general
                    || result.data?.message
                    || result.data?.error
                    || 'Delete failed';
            }
        };
    }
</script> 

<h1>Aircraft</h1>

<section id="existing-routes">
    <div>
        <!-- add routes button, run function to add new on click-->
        <button type="button" class="btn btn-success w-100" onclick={handleAddNew}>
            <i class="bi bi-plus-circle"></i> Add New Route
        </button>
    </div>



    <!-- Right column -->
    <div class="col-sm-10">

        <!-- Route form - Show form at the top if active -->
        {#if showForm}
            <div transition:slide={{ duration: 400 }}>
                <!-- uses component-->
                <RouteForm 
                    {route}
                    onCancel={() => {
                        showForm = false;
                        route = null;
                    }}
                />
                <!-- optional visual separation -->
                <hr class="my-4" />
            </div>
        {/if}

        <!-- Routes table -->
        <table class="table table-bordered table-hover w-100">

            <!-- setup headers-->
            <thead class="table-success success-header">
                <tr>
                    <th>ID</th>
                    <th>Origin</th> 
                    <th>Destination</th>
                    <th>Distance</th>
                </tr>
            </thead>

            <tbody>
                <!-- go through routes-->
                {#each routes as route}
                    <tr >
                        <td>{route.route_id}</td>
                        <td>{route.origin}</td>
                        <td>{route.destination}</td>
                        <td>{route.distance}</td>

                        <td>
                            <!-- update button-->
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary me-1"
                                aria-label="Update"
                                onclick={() => handleUpdate(route)}
                            >
                                <i class="bi bi-pencil"></i>
                            </button>
                            <!-- NOTE: the button is type="button" so it does NOT submit here -->

                            <!-- delete button-->
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                aria-label="Delete"
                                onclick={() => openDeleteModal(route)}
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</section>

<!-- Modal Popup with smooth fade -->
{#if showDeleteModal}
<div
    class="modal d-block"
    tabindex="-1"
    style="background: rgba(0,0,0,0.5); z-index: 1050;"
    transition:fade|slide
>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">Confirm Delete</h5>
        <button
            type="button"
            class="btn-close"
            aria-label="Close"
            onclick={closeDeleteModal}
        ></button>
      </div>

      <div class="modal-body">
        <p>
            Are you sure you want to delete <strong>{routeToDelete?.route_id}</strong>?
        </p>

        <!-- Show failure message inside the modal -->
        {#if modalDeleteError}
          <div class="alert alert-danger mt-3">{modalDeleteError}</div>
        {/if}
      </div>

      <div class="modal-footer">
        <!-- This is the REAL delete form -->
        <!-- function to delete called through form post-->
        <form method="POST" action="?/deleteRoute" use:enhance={enhanceDeleteModal}>
          <input type="hidden" name="routeID" value={routeToDelete?.route_id} />
          <button type="submit" class="btn btn-danger">Yes, Delete</button>

          <button
            type="button"
            class="btn btn-secondary"
            onclick={closeDeleteModal}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
{/if}

<style>
    .success-header {
        --bs-table-bg: var(--bs-success);
        --bs-table-color: #fff;
    }
</style>

<!-- Deimas-->
