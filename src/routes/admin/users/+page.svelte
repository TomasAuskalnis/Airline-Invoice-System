<script>
    import { duration } from 'drizzle-orm/gel-core';
    import { enhance } from '$app/forms';

    // user form component
    import UserForm from '$lib/components/UserForm.svelte';

    import { slide, fade } from 'svelte/transition';

    // get data that was returned when the page was loaded
    let { data } = $props();

    // get the product and category data
    // if state changes the variable will auto update
    let users = $state(data.users);

    // Svelte 5 introduces $inspect(), which is for debugging reactive state instead of console.log
    $inspect(users);

    //Tomas

    /* ========================= 
       Add, Update and Delete
    ========================== */

    // Page-level state for form visbility and updating
    let showForm = $state(false); // whether to show form, default not shown
    let user = $state(null); // selected user, default none

    // Show the form when the user clicks the add button
    function handleAddNew() {
        user = null;
        showForm = true; // show the form
    }

    // Function when updating the form
    function handleUpdate(userIn) {
        //console.log(userIn)
        user = userIn; // set selected user to argument
        showForm = true;
    }

    /* ========================= 
       Modal Popup (Delete)
    ========================== */

    // Track which user is pending deletion
    let userToDelete = $state(null);

    // Whether the modal is visible
    let showDeleteModal = $state(false);

    // Modal error shown inside the delete modal
    let modalDeleteError = $state('');

    // Open modal and remember the selected user
    function openDeleteModal(user){
        userToDelete = user;
        //console.log(userToDelete.id)
        showDeleteModal = true;
        modalDeleteError = ''; // clear old errors
    }

    // Close modal and clear selected user/error
    function closeDeleteModal() {
        showDeleteModal = false;
        userToDelete = null;
        modalDeleteError = '';
    }

    // Dedicated enhance handler for delete modal form
    // - On success: close modal
    // - On failure: keep modal open and show the error message
    function enhanceDeleteModal() {
        return async ({ result, update }) => {
            if(!result) return; // return nothing if no result

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
    // Tomas
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
                        <td>
                            <!-- update button -->
                             <button
                                  type="button"
                                  class="btn btn-sm btn-outline-primary me-1"
                                  aria-label="Update"
                                  onclick={() => handleUpdate(user)}
                                >
                                    <i class="bi bi-pencil"></i>
                                </button>


                                <button
                                   type="button"
                                   class="btn btn-sm btn-outline-danger"
                                   aria-label="Delete"
                                   onclick={() => openDeleteModal(user)}
                                >
                                   <i class="bi bi-trash"></i>
                                </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <!-- Deimas-->


    <!-- Right column -->
    <div class="col-sm-10">

        <!-- User form - Show form at the top if active -->
        {#if showForm}
             <div transition:slide={{ duration: 400 }}>
                <!-- uses component -->
                 <UserForm
                     {user}
                     onCancel={() => {
                        showForm = false;
                        user = null;
                     }}
                />
                <!-- optional visual separation -->
                 <hr class="my-4" />
             </div>
        {/if}
    </div>
</section>

<!-- Modal Popup with smooth fade -->
<!-- modal dialog was being closed too early and rgba had too many 0s-->
{#if showDeleteModal}
<div
  class="modal d-block"
  tabindex="-1"
  style="background: rgba(0,0,0,0.5); z-index: 1050;"
  transition:fade
>
  <div class="modal-dialog" role="document">
    <div class="modal-content">

      <!-- Header -->
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">Confirm Delete</h5>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          onclick={closeDeleteModal}
        ></button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <p>
          Are you sure you want to delete
          <strong>{userToDelete?.id}</strong>?
        </p>

        {#if modalDeleteError}
          <div class="alert alert-danger mt-3">
            {modalDeleteError}
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <form method="POST" action="?/deleteUser" use:enhance={enhanceDeleteModal}>
          <input type="hidden" name="userID" value={userToDelete?.id} />

          <button type="submit" class="btn btn-danger">
            Yes, Delete
          </button>

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

<!-- Tomas -->
