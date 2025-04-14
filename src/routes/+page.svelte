<script lang="ts">
	import { onMount } from 'svelte';
	import BlockingToggle from '$lib/components/BlockingToggle.svelte';
	import BlockedSitesList from '$lib/components/BlockedSitesList.svelte';
	import { loadBlockedSites, loadBlockingStatus } from '$lib/stores';

	onMount(() => {
		loadBlockedSites();
		loadBlockingStatus();
	});
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="main-container">
	<div class="app-container">
		<div class="logo-container">
			<div class="logo-circle">
				<div class="logo-emoji">🔒</div>
			</div>
		</div>

		<h1 class="app-title">FocusLock</h1>

		<BlockingToggle />

		<div class="blocked-sites-section">
			<BlockedSitesList />
		</div>

		<p class="app-description">
			FocusLock helps you stay focused by blocking distracting websites.
		</p>
	</div>
</div>

<style>
	:global(body) {
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		color: #1f2937;
		margin: 0;
	}

	.main-container {
		display: flex;
		min-height: 100vh;
		align-items: center;
		justify-content: center;
		background-color: #f9fafb;
		background-image:
			radial-gradient(#e0e7ff 1px, transparent 1px), radial-gradient(#e0e7ff 1px, transparent 1px);
		background-position:
			0 0,
			10px 10px;
		background-size: 20px 20px;
	}

	.app-container {
		animation: fadeIn 0.6s ease-out;
		border: 1px solid rgba(0, 0, 0, 0.03);
		background-color: white;
		padding: 2.5rem;
		box-shadow:
			0 10px 25px rgba(0, 0, 0, 0.05),
			0 20px 48px rgba(0, 0, 0, 0.03),
			0 1px 4px rgba(0, 0, 0, 0.05);
	}

	.logo-container {
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-circle {
		display: flex;
		height: 5rem;
		width: 5rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: #eef2ff;
	}

	.logo-emoji {
		font-size: 2.25rem;
	}

	.app-title {
		margin-bottom: 1.5rem;
		text-align: center;
		font-size: 1.875rem;
		font-weight: 700;
		color: #4f46e5;
	}

	.blocked-sites-section {
		margin-top: 1.5rem;
		border-top: 1px solid #eef2ff;
		padding-top: 1.5rem;
	}

	.app-description {
		margin-top: 2rem;
		text-align: center;
		font-size: 0.875rem;
		color: #6b7280;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
