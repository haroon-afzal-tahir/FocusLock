<script lang="ts">
	import { blockedSites, saveBlockedSites, type BlockedSite } from '$lib/stores';

	let newSiteUrl = '';

	let error = '';

	function addSite(e: Event) {
		e.preventDefault();
		if (!newSiteUrl) return;

		// URL regex
		const urlRegex =
			/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
		const url = newSiteUrl.toLowerCase().trim();

		if (!url.match(urlRegex)) {
			error = 'Please enter a valid website URL';
			return;
		}

		// Check if site already exists
		if ($blockedSites.some((site) => site.url.includes(url) || url.includes(site.url))) {
			error = 'This website or a similar one is already blocked';
			return;
		}

		// Add the new site
		const newSite: BlockedSite = {
			url,
			id: crypto.randomUUID()
		};

		$blockedSites = [...$blockedSites, newSite];
		saveBlockedSites($blockedSites);
		newSiteUrl = '';

		// check if the current url is blocked
		if ($blockedSites.some((site) => window.location.href.includes(site.url))) {
			window.location.href = chrome.runtime.getURL('blocked.html');
		}
	}

	function removeSite(id: string) {
		$blockedSites = $blockedSites.filter((site) => site.id !== id);
		saveBlockedSites($blockedSites);
	}
</script>

<div class="blocked-sites-container">
	<h2 class="mb-5 text-xl font-bold text-gray-800">Blocked Websites</h2>

	<div class="mb-6">
		<form onsubmit={addSite} class="flex">
			<input
				type="text"
				bind:value={newSiteUrl}
				required
				placeholder="Enter website URL (e.g., facebook.com)"
				class="flex-grow rounded-l-xl border-2 border-indigo-100 p-3 transition duration-200 focus:border-indigo-300 focus:outline-none"
			/>
			<button
				type="submit"
				class="transform rounded-r-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg active:translate-y-0"
			>
				Add
			</button>
		</form>
		{#if error}
			<p class="mt-2 text-xs text-red-500">{error}</p>
		{/if}
		<p class="mt-2 text-xs text-gray-500">
			Enter domain names like "facebook.com" or "twitter.com"
		</p>
	</div>

	{#if $blockedSites.length === 0}
		<div class="rounded-xl border border-gray-100 bg-gray-50 p-8 text-center">
			<p class="text-gray-500 italic">No websites blocked yet</p>
		</div>
	{:else}
		<ul class="space-y-3">
			{#each $blockedSites as site}
				<li
					class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-sm"
				>
					<span class="font-medium text-gray-700">{site.url}</span>
					<button
						onclick={() => removeSite(site.id)}
						class="rounded-lg bg-white px-3 py-1 text-red-500 shadow-sm transition duration-200 hover:text-red-700 hover:shadow"
					>
						Remove
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
