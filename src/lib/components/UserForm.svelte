<!-- used like this
<RouteForm 
    {user} // input route from page
    onCancel={() => {// function from page 
        showForm = false; // component function to show/hide its form
        user = null; // variable from page
    }}
/>
-->

<script>
    import { enhance } from '$app/forms';

    /* =========================
       Props
    ========================== */
    let { // initialise multiple variables as properties
        user = null,     // null = add mode, object = update mode
        onCancel
    } = $props();

    /* =========================
       Derived state
    ========================== */
    let isUpdateMode = $derived(user != null);

    // based on whether form title is for updating or adding
    let formTitle = $derived(isUpdateMode ? 'Update User' : 'Add New User');

    /* =========================
       Local state
    ========================== */
    let errors = $state({});
    let successMessage = $state('');

    /* reference to schema
     export const registerAuthSchema = z.object({
     name: z.string().min(2, 'Name must be at least 2 characters'),
     email: z.string().email('Must be a valid email'),
     password: z.string().min(6, 'Password must be at least 6 characters'),
     dob: z.string().min(1, 'Date of birth is required').nullable().optional()
    */

    // route form variables
    let userForm = $state({
        userName: '',
        userEmail: '',
        userPassword: '',
        userDob: ''
    });

    /* =========================
       Sync route → form
    ========================== */
    $effect(() => {
        if (user) { // if there is a user set values of form
            userForm.userName = user.name ?? '';
            userForm.userEmail = user.email ?? '';
            userForm.userPassword = user.password ?? '';
            userForm.userDob = user.dob ?? '';

        } else { // if there now isn't return them to blanks
            userForm.userName = '';
            userForm.userEmail = '';
            userForm.userPassword = '';
            userForm.userDob = '';
        }
    });

    /* =========================
       enhance handler
    ========================== */
    function enhanceUserForm() {
        return ({ result, update }) => {
            if (!result) return;

            update();

            if (result.type === 'success') {
                successMessage = isUpdateMode
                    ? 'User updated!'
                    : 'User created!';
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

<div id="user-form" class="card shadow-sm w-50">
    <div class="card-header bg-success text-white">
        <h2 class="h4 mb-0">{formTitle}</h2>
    </div>

    <div class="card-body">
        <form
            method="POST"
            action={isUpdateMode ? '?/updateUser' : '?/createUser'}
            use:enhance={enhanceUserForm}

            enctype="multipart/form-data"
        >
            {#if isUpdateMode} 
                <input type="hidden" name="userName" value={user.name} />
            {/if}

            <!-- Name -->
            <div class="mb-3">
                <label for="userName" class="form-label">
                    Name <span class="text-danger" aria-label="required">*</span>
                </label>

                <!-- make sure to setup aria for accessibility -->
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.arrival}
                    id="userName"
                    name="userName"
                    bind:value={UserForm.userName}
                    required

                    aria-required="true"
                    aria-describedby={errors.origin ? 'userName-error' : undefined}
                    aria-invalid={errors.origin ? 'true' : 'false'}

                    placeholder="Enter Name"
                />
                {#if errors.origin}
                    <div id="userName-error" class="form-text text-danger">
                        {errors.name}
                    </div>
                {/if}
            </div>

            <!-- Email -->
            <div class="mb-3">
                <label for="userEmail" class="form-label">
                    Email <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    class:is-invalid={errors.email}
                    id="userEmail"
                    name="userEmail"
                    bind:value={userForm.userEmail}
                    required
                    aria-required="true"
                    aria-describedby={errors.email ? 'userEmail-error' : undefined}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    placeholder="Enter Email"
                />
                {#if errors.email}
                    <div id="userEmail-error" class="form-text text-danger">
                        {errors.email}
                    </div>
                {/if}
            </div>

            <!-- Password -->
            <div class="mb-3">
                <label for="userPassword" class="form-label">
                    Password <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.password}
                    id="userPassword"
                    name="userPassword"
                    bind:value={UserForm.userPassword}
                    required
                    aria-required="true"
                    aria-describedby={errors.password ? 'userPassword-error' : undefined}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    placeholder="Enter Password"
                />
                {#if errors.password}
                    <div id="userPassword-error" class="form-text text-danger">
                        {errors.password}
                    </div>
                {/if}
            </div>

            <!-- Date of Birth -->
            <div class="mb-3">
                <label for="userDob" class="form-label">
                    Date of Birth <span class="text-danger" aria-label="required">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    class:is-invalid={errors.dob}
                    id="userDob"
                    name="userDob"
                    bind:value={UserForm.userDob}
                    required
                    aria-required="true"
                    aria-describedby={errors.dob ? 'userDob-error' : undefined}
                    aria-invalid={errors.dob ? 'true' : 'false'}
                    placeholder="Enter Date of Birth"
                />
                {#if errors.dob}
                    <div id="userDob-error" class="form-text text-danger">
                        {errors.dob}
                    </div>
                {/if}
            </div>

            <button type="submit" class="btn btn-success">
                <i class="bi bi-{isUpdateMode ? 'check' : 'plus'}-circle me-1"></i>
                {isUpdateMode ? 'Update User' : 'Create User'}
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