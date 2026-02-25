<script>
	import favicon from '$lib/assets/favicon.svg';

	// onMount runs after the component is mounted to the DOM
	// only runs in the browser, not SSR (server-side rendering)
	import { onMount } from 'svelte';

	// Browser used to test if client or server side
	import { browser } from '$app/environment';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';

	onMount( async () => {
		if (browser) {

		// if running in the browser, load Bootstrap
		console.log("Loading Bootstrap");
		await import('bootstrap');
		}
	})

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Header with Navbar -->
<header class="navbar navbar-expand-md navbar-dark bd-navbar bg-dark">
  <nav class="container-xl flex-wrap flex-md-nowrap" aria-label="Main navigation">
		<div class="container-fluid main-wrapper">
			<a class="navbar-brand" href="/">
				<i class="bi bi-code-square me-2"></i>Flight scheduling
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav me-auto">
					<li class="nav-item">
						<a class="nav-link active" href="/"><i class="bi bi-house me-1"></i>Home</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/about"><i class="bi bi-info-circle me-1"></i>About</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/contact"><i class="bi bi-envelope me-1"></i>Contact</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/flights"><i class="bi bi-globe me-1"></i>Flights</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/login"><i class="bi bi-people me-1"></i>Users</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>



{@render children()}
