<script>
    import { enhance } from '$app/forms';


    // get data that was returned when the page was loaded
    let { data,form } = $props();
    // get the user opening page too
    let user =  $state(data.user);
</script>

<section>
<div class="container">
    <section id="objects">
        <div class="row">
            <div class="col-4">
                <h3 id="formHeading">Enter your details for a response</h3>

                <!-- Check if request submits sucessfully, if not send an error message -->
                {#if form?.success}
                    <p class="text-success">Contact request submitted successfully!</p>
                {/if}
                {#if form?.error}
                    <p class="text-danger">Error submitting contact request: {form.error}</p>
                {/if}

                <form method="POST" action="?/notifyContactReceived" use:enhance class="p-2">
    
                    <h3>Details</h3>
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-4">
                                <label for="email" class="form-label">Email</label>
                                <input type="text" id="email" name="email" class="form-control" value="Enter email">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mb-4">
                                <label for="firstname" class="form-label">First name</label>
                                <input type="text" id="firstname" name="firstname" class="form-control" value="Insert first name here">
                            </div>
                        </div>
                                                <div class="col-12">
                            <div class="mb-4">
                                <label for="surname" class="form-label">Surname</label>
                                <input type="text" id="surname" name="surname" class="form-control" value="Insert surname here">
                            </div>
                            <div class="mb-4">
                                <label for="phone" class="form-label">Phone number</label>
                                <input type="text" id="phone" name="phone"  class="form-control" value="Enter phone number">
                            </div>
                            
                            <div class="mb-4">
                                <label for="ticket">Ticket:</label>
                                <textarea id="ticket" name="ticket" rows="4" cols="50" style=""> Enter your inquiry.
                                </textarea>
                            </div>

                        </div>
                                                <div class="col-12">
                        </div>
                    </div> <!-- close row -->                   
                    <div class="p-2">
                        <button type="submit" class="btn btn-primary">
                            Send Email
                        </button>
                    </div>
                </form>
            </div> <!-- close first main col before form tag -->
        </div>
    </section>
</div> <!-- End of div container-->

</section>

<!--Tomas-->