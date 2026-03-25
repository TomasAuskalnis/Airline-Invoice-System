<script>

    // get data that was returned when the page was loaded
    let { data } = $props();

    // Svelte 5 introduces $inspect(), which is for debugging reactive state.
    // this is instead of console.log
    $inspect(data.aircraft);

</script>
