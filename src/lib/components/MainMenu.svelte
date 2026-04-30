<script>
    import { ROLES } from '$lib/constants/roles.js';

    let { data } = $props();
</script>

<!-- Header with Navbar -->
<header class="navbar navbar-expand-md navbar-dark bd-navbar bg-home">
  <nav class="container-xl flex-wrap flex-md-nowrap" aria-label="Main navigation">
		<div class="container-fluid main-wrapper">
			<a class="navbar-brand" href="/">
				<i class="bi bi-airplane-fill me-2"></i>Airline Management System
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
						<a class="nav-link" href="/tableFlights"><i class="bi bi-globe me-1"></i>Flights</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/tableRoutes"><i class="bi bi-globe me-1"></i>Routes</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/users"><i class="bi bi-people me-1"></i>Users</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/tableAircraft"><i class="bi bi-airplane me-1"></i>Aircraft</a>
					</li>
					{#if data.user}
						<li class="nav-item dropdown">
							<button class="nav-link dropdown-toggle btn btn-link" type="button" data-bs-toggle="dropdown">
  								<i class="bi bi-person-circle me-1"></i>{data.user.name} ({data.user.role})
							</button>
							<ul class="dropdown-menu dropdown-menu-end">
								<li><a class="dropdown-item" href="/account"><i class="bi bi-person me-1"></i>Profile</a></li>
								<li><hr class="dropdown-divider" /></li>
								<li>
									<form method="post" action="/auth/logout">
										<button class="dropdown-item text-danger" type="submit">
											<i class="bi bi-box-arrow-right me-1"></i>Logout
										</button>
									</form>
								</li>
							</ul>
						</li>
					{:else}
					<li class="nav-item">
						<a class="nav-link" href="/auth/login"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a>
					</li>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
</header>


<style>
	.bg-home {
		background-color: #0B3D91;
	}

</style>