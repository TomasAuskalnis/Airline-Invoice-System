<!-- used like this
<AircraftForm 
    {aircraft} // input aircraft from page
    onCancel={() => {// function from page 
        showForm = false; // component function to show/hide its form
        aircraft = null; // variable from page
    }}
/>
-->

<script>
    import { enhance } from '$app/forms';

    /* =========================
       Props
    ========================== */
    let { // initialise multiple variables as properties
        aircraft = null,     // null = add mode, object = update mode
        onCancel
    } = $props();

    /* =========================
       Derived state
    ========================== */
    let isUpdateMode = $derived(aircraft != null);

    // based on whether form title is for updating or adding
    let formTitle = $derived(isUpdateMode ? 'Update Aircraft' : 'Add New Aircraft');

    /* =========================
       Local state
    ========================== */
    let errors = $state({});
    let successMessage = $state('');

    /* reference to schema
    export const aircraft = sqliteTable('aircraft', {
        aircraft_id: integer().primaryKey({ autoIncrement: true }),
        model: text().notNull().unique(),
        status: text().notNull(),
        capacity: integer().notNull(),
        range: integer().notNull(),
        speed: integer().notNull()
    });
    */

    // aircraft form variables
    let aircraftForm = $state({
        aircraftModel: '',
        aircraftStatus: '',
        aircraftCapacity: 0,
        aircraftRange: 0,
        aircraftSpeed: 0
    });

    /* =========================
       Sync aircraft → form
    ========================== */
    $effect(() => {
        if (aircraft) { // if there is a aircraft set values of form
            aircraftForm.aircraftModel = aircraft.model ?? '';
            aircraftForm.aircraftStatus = aircraft.status ?? '';
            aircraftForm.aircraftCapacity = aircraft.capacity ?? 0;
            aircraftForm.aircraftRange = aircraft.range ?? 0;
            aircraftForm.aircraftSpeed = aircraft.speed ?? 0;

        } else { // if there now isn't return them to blanks
            aircraftForm.aircraftModel = '';
            aircraftForm.aircraftStatus = '';
            aircraftForm.aircraftCapacity = 0;
            aircraftForm.aircraftRange = 0;
            aircraftForm.aircraftSpeed = 0;
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
                    ? 'Aircraft updated!'
                    : 'Aircraft created!';
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

<div id="aircraft-form" class="card shadow-sm w-50">
    <div class="card-header bg-success text-white">
        <h2 class="h4 mb-0">{formTitle}</h2>
    </div>

    <div class="card-body">
        <form
            method="POST"
            action={isUpdateMode ? '?/updateAircraft' : '?/createAircraft'}
            use:enhance={enhanceFlightForm}

            enctype="multipart/form-data"
        >
            {#if isUpdateMode} 
                <input type="hidden" name="aircraftID" value={aircraft.aircraft_id} />
            {/if}

            <!-- Model -->
            <div class="mb-3">
                <label for="aircraftModel" class="form-label">
                    Model <span class="text-danger" aria-label="required">*</span>
                </label>

                <!-- make sure to setup aria for accessibility -->
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.model}
                    id="aircraftModel"
                    name="aircraftModel"
                    bind:value={aircraftForm.aircraftModel}
                    required

                    aria-required="true"
                    aria-describedby={errors.model ? 'aircraftModel-error' : undefined}
                    aria-invalid={errors.model ? 'true' : 'false'}

                    placeholder="Enter Aircraft model"
                />
                {#if errors.model}
                    <div id="aircraftModel-error" class="form-text text-danger">
                        {errors.model}
                    </div>
                {/if}
            </div>

            <!-- Status -->
            <div class="mb-3">
                <label for="aircraftStatus" class="form-label">
                    Status <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.status}
                    id="aircraftStatus"
                    name="aircraftStatus"
                    bind:value={aircraftForm.aircraftStatus}
                    required
                    aria-required="true"
                    aria-describedby={errors.status ? 'aircraftStatus-error' : undefined}
                    aria-invalid={errors.status ? 'true' : 'false'}
                    placeholder="Enter Status"
                />
                {#if errors.status}
                    <div id="aircraftStatus-error" class="form-text text-danger">
                        {errors.status}
                    </div>
                {/if}
            </div>

            <!-- Capacity -->
            <div class="mb-3">
                <label for="aircraftCapacity" class="form-label">
                    Capacity <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.capacity}
                    id="aircraftCapacity"
                    name="aircraftCapacity"
                    bind:value={aircraftForm.aircraftCapacity}
                    required
                    aria-required="true"
                    aria-describedby={errors.capacity ? 'aircraftCapacity-error' : undefined}
                    aria-invalid={errors.capacity ? 'true' : 'false'}
                    placeholder="Enter Capacity"
                />
                {#if errors.capacity}
                    <div id="aircraftCapacity-error" class="form-text text-danger">
                        {errors.capacity}
                    </div>
                {/if}
            </div>

            <!-- Range -->
            <div class="mb-3">
                <label for="aircraftRange" class="form-label">
                    Range <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.range}
                    id="aircraftRange"
                    name="aircraftRange"
                    bind:value={aircraftForm.aircraftRange}
                    required
                    aria-required="true"
                    aria-describedby={errors.range ? 'aircraftRange-error' : undefined}
                    aria-invalid={errors.range ? 'true' : 'false'}
                    placeholder="Enter Range"
                />
                {#if errors.range}
                    <div id="aircraftRange-error" class="form-text text-danger">
                        {errors.range}
                    </div>
                {/if}
            </div>

            <!-- Speed -->
            <div class="mb-3">
                <label for="aircraftSpeed" class="form-label">
                    Speed <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.speed}
                    id="aircraftSpeed"
                    name="aircraftSpeed"
                    bind:value={aircraftForm.aircraftSpeed}
                    required
                    aria-required="true"
                    aria-describedby={errors.speed ? 'aircraftSpeed-error' : undefined}
                    aria-invalid={errors.speed ? 'true' : 'false'}
                    placeholder="Enter Speed"
                />
                {#if errors.speed}
                    <div id="aircraftSpeed-error" class="form-text text-danger">
                        {errors.speed}
                    </div>
                {/if}
            </div>

            <button type="submit" class="btn btn-success">
                <i class="bi bi-{isUpdateMode ? 'check' : 'plus'}-circle me-1"></i>
                {isUpdateMode ? 'Update Aircraft' : 'Create Aircraft'}
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