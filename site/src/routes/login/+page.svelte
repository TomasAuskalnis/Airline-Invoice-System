<script>
function loginAdmin () {
    console.log ("Login start")
    const employeenumber = document.getElementById("employeenumber").value;
    const firstname = document.getElementById("firstname").value;
    const surname = document.getElementById("surname").value;
    const adminPassword = document.getElementById("adminpassword").value;

    if (employeenumber === "12345" && firstname === "Admin" && surname === "User" && adminPassword === "password") {
        alert("Login success");
        window.location.href = "/users";
    }
    else {
        alert("Login failed")
    }
}
</script>




<section>
<div class="container">
    <section id="objects">
        <div class="row">
            <div class="col-4">
                <h3 id="formHeading">Please login to access Users</h3>
                
                <form id="objectsForm" class="p-2">
                    
                    <h3>Details</h3>
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-4">
                                <label for="employeenumber" class="form-label">Employee Number</label>
                                <input type="text" id="employeenumber" class="form-control" value="0">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mb-4">
                                <label for="firstname" class="form-label">First name</label>
                                <input type="text" id="firstname" class="form-control" value="Insert first name here">
                            </div>
                        </div>
                                                <div class="col-12">
                            <div class="mb-4">
                                <label for="surname" class="form-label">Surname</label>
                                <input type="text" id="surname" class="form-control" value="Insert surname here">
                            </div>
                            <div class="mb-4">
                                <label for="adminpassword" class="form-label">Password</label>
                                <input type="password" id="adminpassword" class="form-control" value="">
                            </div>
                        </div>
                                                <div class="col-12">
                        </div>
                    </div> <!-- close row -->                   
                    <div class="p-2">
                        <button class="btn btn-primary" type="button" id="submitButton" onclick={() => loginAdmin()}>Login</button>
                    </div>
                </form>
            </div> <!-- close first main col before form tag -->
    </section>
</div> <!-- End of div container-->

</section>

<!--Tomas-->