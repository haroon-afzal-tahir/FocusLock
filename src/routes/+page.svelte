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

<div
	class="flex min-h-screen items-center justify-center bg-[#f9fafb] bg-[radial-gradient(#e0e7ff_1px,transparent_1px),radial-gradient(#e0e7ff_1px,transparent_1px)] bg-[0_0,10px_10px] bg-[length:20px_20px]"
>
	<div
		class="animate-fadeIn container border border-[rgba(0,0,0,0.03)] bg-white p-10 shadow-[0_10px_25px_rgba(0,0,0,0.05),0_20px_48px_rgba(0,0,0,0.03),0_1px_4px_rgba(0,0,0,0.05)]"
	>
		<div class="mb-6 flex items-center justify-center">
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
				<div class="text-4xl">🔒</div>
			</div>
		</div>

		<h1 class="mb-6 text-center text-3xl font-bold text-indigo-600">FocusLock</h1>

		<BlockingToggle />

		<div class="mt-6 border-t border-indigo-100 pt-6">
			<BlockedSitesList />
		</div>

		<p class="mt-8 text-center text-sm text-gray-500">
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

	.animate-fadeIn {
		animation: fadeIn 0.6s ease-out;
	}
</style>
