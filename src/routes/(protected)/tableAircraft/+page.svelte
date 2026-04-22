<script>
// imports 
    import { enhance } from '$app/forms';

    // aircraft form component
    import AircraftForm from '$lib/components/AircraftForm.svelte';

    import { slide, fade } from 'svelte/transition';

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

    // CRUD
    /* ========================= 
       Add, Update and Delete
    ========================== */

    // Page-level state for form visibility and updating
    let showForm = $state(false); // whether to show form, default to not shown
    let aircraft = $state(null); // selected aircraft, default none

    // Show the form when the user clicks the add button
    function handleAddNew() {
        aircraft = null; // still none
        showForm = true; // show the form
	}
      
    // Function when updating the form
    function handleUpdate(aircraftIn) {
        //console.log(aircraftIn)
        aircraft = aircraftIn; // set selected aircraft to argument
		showForm = true;
	}

    /* ========================= 
       Modal Popup (Delete)
    ========================== */

    // Track which aircraft is pending deletion
    let aircraftToDelete = $state(null);

    // Whether the modal is visible
    let showDeleteModal = $state(false);

    // Modal error shown inside the delete modal
    let modalDeleteError = $state('');

    // Open modal and remember the selected aircraft
    function openDeleteModal(aircraft) {
        aircraftToDelete = aircraft;
        showDeleteModal = true;
        modalDeleteError = ''; // clear old errors
    }

    // Close modal and clear selected aircraft/error
    function closeDeleteModal() {
        showDeleteModal = false;
        aircraftToDelete = null;
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

<section id="existing-aircraft">
    <div>
        <!-- add aircraft button, run function to add new on click-->
        <button type="button" class="btn btn-success w-100" onclick={handleAddNew}>
            <i class="bi bi-plus-circle"></i> Add New Aircraft
        </button>
    </div>



    <!-- Right column -->
    <div class="col-sm-10">

        <!-- Aircraft form - Show form at the top if active -->
        {#if showForm}
            <div transition:slide={{ duration: 400 }}>
                <!-- uses component-->
                <AircraftForm 
                    {aircraft}
                    onCancel={() => {
                        showForm = false;
                        aircraft = null;
                    }}
                />
                <!-- optional visual separation -->
                <hr class="my-4" />
            </div>
        {/if}

        <!-- Aircraft table-->
        <table class="table table-bordered table-hover w-100">

            <!-- setup headers-->
            <thead class="table-success success-header">
                <tr>
                    <th>ID</th>
                    <th>Model</th> 
                    <th>Capacity</th>
                    <th>Range</th>
                    <th>Speed</th>
                    <th>Fuel consumption</th>
                </tr>
            </thead>
            <tbody>
                
                <!-- go through users-->
                {#each aircrafts as aircraft}
                    <tr >
                        <td>{aircraft.aircraft_id}</td>
                        <td>{aircraft.model}</td>
                        <td>{aircraft.capacity}</td>
                        <td>{aircraft.range}</td>
                        <td>{aircraft.speed}</td>
                        <td>{aircraft.hourlyFuel}</td>

                        <td>
                            <!-- update button-->
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary me-1"
                                aria-label="Update"
                                onclick={() => handleUpdate(aircraft)}
                            >
                                <i class="bi bi-pencil"></i>
                            </button>
                            <!-- NOTE: the button is type="button" so it does NOT submit here -->

                            <!-- delete button-->
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                aria-label="Delete"
                                onclick={() => openDeleteModal(aircraft)}
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
            Are you sure you want to delete <strong>{aircraftToDelete?.aircraft_id}</strong>?
        </p>

        <!-- Show failure message inside the modal -->
        {#if modalDeleteError}
          <div class="alert alert-danger mt-3">{modalDeleteError}</div>
        {/if}
      </div>

      <div class="modal-footer">
        <!-- This is the REAL delete form -->
        <!-- function to delete called through form post-->
        <form method="POST" action="?/deleteAircraft" use:enhance={enhanceDeleteModal}>
          <input type="hidden" name="aircraftID" value={aircraftToDelete?.aircraft_id} />
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
