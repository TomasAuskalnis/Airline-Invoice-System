<!-- used like this
<RouteForm 
    {route} // input route from page
    onCancel={() => {// function from page 
        showForm = false; // component function to show/hide its form
        route = null; // variable from page
    }}
/>
-->

<script>
    import { enhance } from '$app/forms';

    /* =========================
       Props
    ========================== */
    let { // initialise multiple variables as properties
        route = null,     // null = add mode, object = update mode
        onCancel
    } = $props();

    /* =========================
       Derived state
    ========================== */
    let isUpdateMode = $derived(route != null);

    // based on whether form title is for updating or adding
    let formTitle = $derived(isUpdateMode ? 'Update Route' : 'Add New Route');

    /* =========================
       Local state
    ========================== */
    let errors = $state({});
    let successMessage = $state('');

    /* reference to schema
    export const route = sqliteTable('route', {
        route_id: integer().primaryKey({ autoIncrement: true }),
        origin: text().notNull(),
        destination: text().notNull(),
        distance: integer().notNull()
    });
    */

    // route form variables
    let routeForm = $state({
        routeOrigin: '',
        routeDestination: '',
        routeDistance: 0
    });

    /* =========================
       Sync route → form
    ========================== */
    $effect(() => {
        if (route) { // if there is a route set values of form
            routeForm.routeOrigin = route.origin ?? '';
            routeForm.routeDestination = route.destination ?? '';
            routeForm.routeDistance = route.distance ?? 0;

        } else { // if there now isn't return them to blanks
            routeForm.routeOrigin = '';
            routeForm.routeDestination = '';
            routeForm.routeDistance = 0;
        }
    });

    /* =========================
       enhance handler
    ========================== */
    function enhanceRouteForm() {
        return ({ result, update }) => {
            if (!result) return;

            update();

            if (result.type === 'success') {
                successMessage = isUpdateMode
                    ? 'Route updated!'
                    : 'Route created!';
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

<div id="route-form" class="card shadow-sm w-50">
    <div class="card-header bg-success text-white">
        <h2 class="h4 mb-0">{formTitle}</h2>
    </div>

    <div class="card-body">
        <form
            method="POST"
            action={isUpdateMode ? '?/updateRoute' : '?/createRoute'}
            use:enhance={enhanceRouteForm}

            enctype="multipart/form-data"
        >
            {#if isUpdateMode} 
                <input type="hidden" name="routeID" value={route.route_id} />
            {/if}

            <!-- Origin -->
            <div class="mb-3">
                <label for="routeOrigin" class="form-label">
                    Origin <span class="text-danger" aria-label="required">*</span>
                </label>

                <!-- make sure to setup aria for accessibility -->
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.arrival}
                    id="routeOrigin"
                    name="routeOrigin"
                    bind:value={routeForm.routeOrigin}
                    required

                    aria-required="true"
                    aria-describedby={errors.origin ? 'routeOrigin-error' : undefined}
                    aria-invalid={errors.origin ? 'true' : 'false'}

                    placeholder="Enter Route origin"
                />
                {#if errors.origin}
                    <div id="routeOrigin-error" class="form-text text-danger">
                        {errors.origin}
                    </div>
                {/if}
            </div>

            <!-- Destination -->
            <div class="mb-3">
                <label for="routeDestination" class="form-label">
                    Destination <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.destination}
                    id="routeDestination"
                    name="routeDestination"
                    bind:value={routeForm.routeDestination}
                    required
                    aria-required="true"
                    aria-describedby={errors.destination ? 'routeDestination-error' : undefined}
                    aria-invalid={errors.destination ? 'true' : 'false'}
                    placeholder="Enter Destination"
                />
                {#if errors.destination}
                    <div id="routeDestination-error" class="form-text text-danger">
                        {errors.destination}
                    </div>
                {/if}
            </div>

            <!-- Distance -->
            <div class="mb-3">
                <label for="routeDistance" class="form-label">
                    Distance <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.distance}
                    id="routeDistance"
                    name="routeDistance"
                    bind:value={routeForm.routeDistance}
                    required
                    aria-required="true"
                    aria-describedby={errors.distance ? 'routeDistance-error' : undefined}
                    aria-invalid={errors.distance ? 'true' : 'false'}
                    placeholder="Enter Distance"
                />
                {#if errors.distance}
                    <div id="routeDistance-error" class="form-text text-danger">
                        {errors.distance}
                    </div>
                {/if}
            </div>

            <button type="submit" class="btn btn-success">
                <i class="bi bi-{isUpdateMode ? 'check' : 'plus'}-circle me-1"></i>
                {isUpdateMode ? 'Update Route' : 'Create Route'}
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