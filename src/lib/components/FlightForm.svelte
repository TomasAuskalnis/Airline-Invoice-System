<!-- used like this
<FlightForm 
    {flight} // input flight from page
    onCancel={() => {// function from page 
        showForm = false; // component function to show/hide its form
        flight = null; // variable from page
    }}
/>
-->

<script>
    import { enhance } from '$app/forms';

    /* =========================
       Props
    ========================== */
    let { // initialise multiple variables as properties
        flight = null,     // null = add mode, object = update mode
        onCancel
    } = $props();

    /* =========================
       Derived state
    ========================== */
    let isUpdateMode = $derived(flight != null);

    // based on whether form title is for updating or adding
    let formTitle = $derived(isUpdateMode ? 'Update Flight' : 'Add New Flight');

    /* =========================
       Local state
    ========================== */
    let errors = $state({});
    let successMessage = $state('');

    /* reference to schema
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

    // flight form variables
    let flightForm = $state({
        flightArrival: '',
        flightDeparture: '',
        flightStatus: '',
        flightAircraftID: 0,
        flightRouteID: 0,
        flightCreatedByID: 0
    });

    /* =========================
       Sync flight → form
    ========================== */
    $effect(() => {
        if (flight) { // if there is a flight set values of form
            flightForm.flightArrival = flight.arrival_time ?? '';
            flightForm.flightDeparture = flight.departure_time ?? '';
            flightForm.flightStatus = flight.status ?? '';
            flightForm.flightAircraftID = flight.aircraft_id ?? 0;
            flightForm.flightRouteID = flight.route_id ?? 0;
            flightForm.flightCreatedByID = flight.created_by ?? 0;

        } else { // if there now isn't return them to blanks
            flightForm.flightArrival = '';
            flightForm.flightDeparture = '';
            flightForm.flightStatus = '';
            flightForm.flightAircraftID = 0;
            flightForm.flightRouteID = 0;
            flightForm.flightCreatedByID = 0;
        }
    });

    /* =========================
       enhance handler
    ========================== */
    function enhanceFlightForm() {
        return ({ result, update }) => {
            if (!result) return;

            update();

            if (result.type === 'success') {
                successMessage = isUpdateMode
                    ? 'Flight updated!'
                    : 'Flight created!';
                errors = {};
            } else if (result.type === 'failure') {
                errors = { ...result.data.errors };
            } else {
                errors = {};
            }
        };
    }

    // function for each form's cancel option
    function handleCancel() {
        errors = {};
        successMessage = '';
        onCancel?.();
    }
</script>

<!-- =========================
     Markup
     this is the html for the form that will be added to the page
     when using the component
========================== -->

<div id="flight-form" class="card shadow-sm w-50">
    <div class="card-header bg-success text-white">
        <h2 class="h4 mb-0">{formTitle}</h2>
    </div>

    <div class="card-body">
        <form
            method="POST"
            action={isUpdateMode ? '?/updateFlight' : '?/createFlight'}
            use:enhance={enhanceFlightForm}

            enctype="multipart/form-data"
        >
            {#if isUpdateMode} 
                <input type="hidden" name="flightID" value={flight.flight_id} />
            {/if}

            <!-- Arrival -->
            <div class="mb-3">
                <label for="flightArrival" class="form-label">
                    Arrival <span class="text-danger" aria-label="required">*</span>
                </label>

                <!-- make sure to setup aria for accessibility -->
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.arrival}
                    id="flightArrival"
                    name="flightArrival"
                    bind:value={flightForm.flightArrival}
                    required

                    aria-required="true"
                    aria-describedby={errors.arrival ? 'flightArrival-error' : undefined}
                    aria-invalid={errors.arrival ? 'true' : 'false'}

                    placeholder="Enter Flight arrival"
                />
                {#if errors.arrival}
                    <div id="flightArrival-error" class="form-text text-danger">
                        {errors.arrival}
                    </div>
                {/if}
            </div>

            <!-- Departure -->
            <div class="mb-3">
                <label for="flightDeparture" class="form-label">
                    Departure <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.departure}
                    id="flightDeparture"
                    name="flightDeparture"
                    bind:value={flightForm.flightDeparture}
                    required
                    aria-required="true"
                    aria-describedby={errors.departure ? 'flightDeparture-error' : undefined}
                    aria-invalid={errors.departure ? 'true' : 'false'}
                    placeholder="Enter Departure"
                />
                {#if errors.departure}
                    <div id="flightDeparture-error" class="form-text text-danger">
                        {errors.departure}
                    </div>
                {/if}
            </div>

            <!-- Status -->
            <div class="mb-3">
                <label for="flightStatus" class="form-label">
                    Status <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.status}
                    id="flightStatus"
                    name="flightStatus"
                    bind:value={flightForm.flightStatus}
                    required
                    aria-required="true"
                    aria-describedby={errors.status ? 'flightStatus-error' : undefined}
                    aria-invalid={errors.status ? 'true' : 'false'}
                    placeholder="Paid/Unpaid"
                />
                {#if errors.status}
                    <div id="flightStatus-error" class="form-text text-danger">
                        {errors.status}
                    </div>
                {/if}
            </div>

            <!-- Aircraft -->
            <div class="mb-3">
                <label for="flightAircraft" class="form-label">
                    Aircraft <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.aircraft}
                    id="flightAircraft"
                    name="flightAircraft"
                    bind:value={flightForm.flightAircraftID}
                    required
                    aria-required="true"
                    aria-describedby={errors.aircraft ? 'flightAircraft-error' : undefined}
                    aria-invalid={errors.aircraft ? 'true' : 'false'}
                    placeholder="Enter Aircraft"
                />
                {#if errors.aircraft}
                    <div id="flightAircraft-error" class="form-text text-danger">
                        {errors.aircraft}
                    </div>
                {/if}
            </div>

            <!-- Route -->
            <div class="mb-3">
                <label for="flightRoute" class="form-label">
                    Route <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.route}
                    id="flightRoute"
                    name="flightRoute"
                    bind:value={flightForm.flightRouteID}
                    required
                    aria-required="true"
                    aria-describedby={errors.route ? 'flightRoute-error' : undefined}
                    aria-invalid={errors.route ? 'true' : 'false'}
                    placeholder="Enter Route"
                />
                {#if errors.route}
                    <div id="flightRoute-error" class="form-text text-danger">
                        {errors.route}
                    </div>
                {/if}
            </div>

            <!-- Created By -->
            <div class="mb-3">
                <label for="flightCreatedBy" class="form-label">
                    Created By <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.createdBy}
                    id="flightCreatedBy"
                    name="flightCreatedBy"
                    bind:value={flightForm.flightCreatedByID}
                    required
                    aria-required="true"
                    aria-describedby={errors.createdBy ? 'flightCreatedBy-error' : undefined}
                    aria-invalid={errors.createdBy ? 'true' : 'false'}
                    placeholder="Enter Created By"
                />
                {#if errors.createdBy}
                    <div id="flightCreatedBy-error" class="form-text text-danger">
                        {errors.createdBy}
                    </div>
                {/if}
            </div>

            <button type="submit" class="btn btn-success">
                <i class="bi bi-{isUpdateMode ? 'check' : 'plus'}-circle me-1"></i>
                {isUpdateMode ? 'Update Flight' : 'Create Flight'}
            </button>

            <button
                type="button"
                class="btn btn-secondary"
                onclick={handleCancel}
            >
                <i class="bi bi-x-circle me-1"></i>
                Cancel / Close
            </button>
        </form>
    </div>
</div>

{#if successMessage}
    <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i>
        {successMessage}
        <button
            type="button"
            class="btn-close"
            aria-label="Close"
            onclick={handleCancel}
        ></button>
    </div>
{/if}

{#if errors.general}
    <div class="alert alert-danger mt-3" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {errors.general}
    </div>
{/if}