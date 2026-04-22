<script>
    let { data } = $props();
    const { flight } = data; // data from server js

    const euro = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
});

</script>
<!-- displays the flight-->
<h2>Payment Confirmed</h2>
<p>Thank you for paying your invoice for flight ID <strong>#{flight.flight_id}</strong>.</p>

<a href="/tableFlights" class="btn btn-primary">View all flights</a> 