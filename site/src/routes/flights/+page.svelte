<div class="container">
    <section id="objects">
        <div class="row">
            <div class="col-4">
                <h3 id="formHeading">Flight booking</h3>
                
                <form id="objectsForm" class="p-2">
                    
                    <h3>Details</h3>
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-4">
                                <label for="flight" class="form-label">Flight Num</label>
                                <input type="text" id="flight" class="form-control" value="Flight number">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mb-4">
                                <label for="origin" class="form-label">Origin</label>
                                <input type="text" id="origin" class="form-control" value="Origin">
                            </div>
                        </div>
                                                <div class="col-12">
                            <div class="mb-4">
                                <label for="destination" class="form-label">Destination</label>
                                <input type="text" id="destination" class="form-control" value="Destination">
                            </div>
                            <div class="mb-4">
                                <label for="distance" class="form-label">Distance</label>
                                <input type="number" id="distance" class="form-control" value="0">
                            </div>
                        </div>
                                                <div class="col-12">
                        </div>
                        <div class="col-12">
                            <div class="mb-4">
                                <label for="bookGenre" class="form-label">Aircraft</label>
                                <select id="bookGenre" class="form-select">
                                    <option value="0">Choose aircraft</option>
                                    <option value="thriller" selected>Airbus A320</option>
                                    <option value="comedy">Airbus A340</option>
                                    <option value="documentary">Airbus A380</option>
                                </select>
                            </div>
                        </div>
                    </div> <!-- close row -->                   
                    <div class="p-2">
                        <button class="btn btn-primary" type="button" id="submitButton">Submit</button>
                    </div>
                </form>
            </div> <!-- close first main col before form tag -->

            <!-- Third column -->
            <div class="col-8">
                <h3>Flights</h3>
                <p class="h-75 border"id="bookDetails">
                    Flight details
                </p>

                <button class="btn btn-warning" type="button" id="prevButton" disabled>Previous</button>
                <button class="btn btn-info" type="button" id="nextButton" disabled>Next</button>
            </div> <!-- close third main col -->
        </div> <!-- close row -->
    </section>
</div> <!-- End of div container-->

<!-- Deimas-->