<script>
    // imports 
    import { enhance } from '$app/forms';

    // flight form component
    import FlightForm from '$lib/components/FlightForm.svelte';

    import { slide, fade } from 'svelte/transition';

    // get data that was returned when the page was loaded
    let { data } = $props();

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

    /* ========================= 
       Add, Update and Delete
    ========================== */

    // Page-level state for form visibility and updating
    let showForm = $state(false); // whether to show form, default to not shown
    let flight = $state(null); // selected flight, default none

    // Show the form when the user clicks the add button
    function handleAddNew() {
        flight = null; // still none
        showForm = true; // show the form
	}
      
    // Function when updating the form
    function handleUpdate(flightIn) {
        //console.log(flightIn)
        flight = flightIn; // set selected flight to argument
		showForm = true;
	}

    /* ========================= 
       Modal Popup (Delete)
    ========================== */

    // Track which flight is pending deletion
    let flightToDelete = $state(null);

    // Whether the modal is visible
    let showDeleteModal = $state(false);

    // Modal error shown inside the delete modal
    let modalDeleteError = $state('');

    // Open modal and remember the selected flight
    function openDeleteModal(flight) {
        flightToDelete = flight;
        showDeleteModal = true;
        modalDeleteError = ''; // clear old errors
    }

    // Close modal and clear selected flight/error
    function closeDeleteModal() {
        showDeleteModal = false;
        flightToDelete = null;
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


<section id="existing-flights">
    <div>
        <!-- add flight button, run function to add new on click-->
        <button type="button" class="btn btn-success w-100" onclick={handleAddNew}>
            <i class="bi bi-plus-circle"></i> Add New Flight
        </button>
    </div>

    <!-- Right column -->
    <div class="col-sm-10">
        
        <!-- Flight form - Show form at the top if active -->
        {#if showForm}
            <div transition:slide={{ duration: 400 }}>
                <!-- uses component-->
                <FlightForm 
                    {flight}
                    onCancel={() => {
                        showForm = false;
                        flight = null;
                    }}
                />
                <!-- optional visual separation -->
                <hr class="my-4" />
            </div>
        {/if}

        <!-- Flights Table -->
        <table class="table table-bordered table-hover w-100">
            <thead class="table-success success-header">
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
                <!-- iterate over flights, adding a new table row for each flight -->
                {#each flights as flight (flight.flight_id)}
                    <tr>
                        <td>{flight.flight_id}</td>
                        <td>{flight.arrival_time}</td>
                        <td>{flight.departure_time}</td>
                        <td>{flight.status}</td>
                        <td>{flight.aircraft_id}</td>
                        <td>{flight.route_id}</td>
                        <td>{flight.created_by}</td>
                        <td>
                            <!-- update button-->
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary me-1"
                                aria-label="Update"
                                onclick={() => handleUpdate(flight)}
                            >
                                <i class="bi bi-pencil"></i>
                            </button>

                            <!-- !!! BUG !!! Updating IDs of Route, Aircraft etc doesnt work-->

                            <!-- NOTE: the button is type="button" so it does NOT submit here -->
                            <!-- delete button-->
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                aria-label="Delete"
                                onclick={() => openDeleteModal(flight)}
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div> <!-- Close of right column (END OF DISPLAY TABLE) -->
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
    </div>

      <div class="modal-body">
        <p>
            Are you sure you want to delete <strong>{flightToDelete?.flight_id}</strong>?
        </p>

        <!-- Show failure message inside the modal -->
        {#if modalDeleteError}
          <div class="alert alert-danger mt-3">{modalDeleteError}</div>
        {/if}
      </div>

      <div class="modal-footer">
        <!-- This is the REAL delete form -->
        <!-- function to delete called through form post-->
        <form method="POST" action="?/deleteFlight" use:enhance={enhanceDeleteModal}>
          <input type="hidden" name="flightID" value={flightToDelete?.flight_id} />
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
{/if}

<style>
    .success-header {
        --bs-table-bg: var(--bs-success);
        --bs-table-color: #fff;
    }
</style>

<!-- deleting works but creating/updating complains that form id is not a valid number, fix-->
<!-- Deimas-->
