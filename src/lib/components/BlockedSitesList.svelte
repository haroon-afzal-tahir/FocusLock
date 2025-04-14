<script lang="ts">
	import { UNBLOCKABLE_SITES } from '$lib/sites';
	import {
		blockedSites,
		getCurrentTabUrl,
		isBlockingEnabled,
		redirectToBlockedPage,
		saveBlockedSites,
		type BlockedSite
	} from '$lib/stores';

	let newSiteUrl = '';
	let error = '';

	// Function to get hostname from URL
	function getHostnameFromUrl(url: string): string {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname.replace('www.', '');
		} catch (e) {
			return url.replace('www.', '');
		}
	}

	// Function to add current site to blocklist
	async function addCurrentSite() {
		try {
			const currentUrl = await getCurrentTabUrl();
			if (!currentUrl) return;

			const hostname = getHostnameFromUrl(currentUrl);

			// Check if site already exists
			if (
				$blockedSites.some((site) => {
					const siteHost = getHostnameFromUrl(site.url);
					return siteHost.includes(hostname) || hostname.includes(siteHost);
				})
			) {
				error = 'This website is already blocked';
				return;
			}

			if (currentUrl.includes('blocked.html')) {
				error = 'You cannot block the blocked page';
				return;
			}

			if (UNBLOCKABLE_SITES.includes(hostname)) {
				error = 'You cannot block this website';
				return;
			}

			// Add the current site
			const newSite: BlockedSite = {
				url: hostname,
				id: crypto.randomUUID()
			};

			$blockedSites = [...$blockedSites, newSite];
			saveBlockedSites($blockedSites);
			error = ''; // Clear any existing errors

			if ($isBlockingEnabled) {
				// Redirect to blocked page
				redirectToBlockedPage();
			}
		} catch (e) {
			console.error('Error adding current site:', e);
			error = 'Failed to add current site';
		}
	}

	async function addSite(e: Event) {
		e.preventDefault();

		if (!newSiteUrl) return;

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

		if (url.includes('blocked.html')) {
			error = 'You cannot block the blocked page';
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
		error = ''; // Clear any existing errors

		// Check if the current URL matches the newly added blocked site
		try {
			const currentUrl = await getCurrentTabUrl();
			if (!currentUrl) return;

			const currentHostname = getHostnameFromUrl(currentUrl);
			const newSiteHostname = getHostnameFromUrl(url);

			// Check if current hostname contains or is contained by the blocked site hostname
			const isCurrentSiteBlocked =
				currentHostname.includes(newSiteHostname) || newSiteHostname.includes(currentHostname);

			if ($isBlockingEnabled && isCurrentSiteBlocked) {
				redirectToBlockedPage();
			}
		} catch (e) {
			console.error('Error checking current URL:', e);
		}
	}

	function removeSite(id: string) {
		$blockedSites = $blockedSites.filter((site) => site.id !== id);
		saveBlockedSites($blockedSites);
	}
</script>

<div class="blocked-sites-container">
	<h2 class="section-title">Blocked Websites</h2>

	<div class="form-container">
		<div class="block-current-container">
			<button onclick={addCurrentSite} class="block-current-button"> Block Current Site </button>
		</div>

		<form onsubmit={addSite} class="site-form">
			<input
				type="text"
				bind:value={newSiteUrl}
				required
				placeholder="Enter website URL (e.g., facebook.com)"
				class="site-input"
			/>
			<button type="submit" class="add-button"> Add </button>
		</form>
		{#if error}
			<p class="error-message">{error}</p>
		{/if}
		<p class="helper-text">Enter domain names like "facebook.com" or "twitter.com"</p>
	</div>

	{#if $blockedSites.length === 0}
		<div class="empty-list">
			<p class="empty-message">No websites blocked yet</p>
		</div>
	{:else}
		<ul class="sites-list">
			{#each $blockedSites as site}
				<li class="site-item">
					<span class="site-url">{site.url}</span>
					<button onclick={() => removeSite(site.id)} class="remove-button"> Remove </button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.section-title {
		margin-bottom: 1.25rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.form-container {
		margin-bottom: 1.5rem;
	}

	.block-current-container {
		margin-bottom: 1rem;
		display: flex;
	}

	.block-current-button {
		width: 100%;
		transform: translateY(0);
		border-radius: 0.75rem;
		background-color: #16a34a;
		padding: 0.75rem 1.25rem;
		font-weight: 600;
		color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s;
	}

	.block-current-button:hover {
		transform: translateY(-0.125rem);
		background-color: #15803d;
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
	}

	.block-current-button:active {
		transform: translateY(0);
	}

	.site-form {
		display: flex;
	}

	.site-input {
		flex-grow: 1;
		border-radius: 0.75rem 0 0 0.75rem;
		border: 2px solid #eef2ff;
		padding: 0.75rem;
		transition: border-color 0.2s;
	}

	.site-input:focus {
		border-color: #a5b4fc;
		outline: none;
	}

	.add-button {
		transform: translateY(0);
		border-radius: 0 0.75rem 0.75rem 0;
		background-color: #4f46e5;
		padding: 0.75rem 1.25rem;
		font-weight: 600;
		color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s;
	}

	.add-button:hover {
		transform: translateY(-0.125rem);
		background-color: #4338ca;
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
	}

	.add-button:active {
		transform: translateY(0);
	}

	.error-message {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: #ef4444;
	}

	.helper-text {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.empty-list {
		border-radius: 0.75rem;
		border: 1px solid #f3f4f6;
		background-color: #f9fafb;
		padding: 2rem;
		text-align: center;
	}

	.empty-message {
		color: #6b7280;
		font-style: italic;
	}

	.sites-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.site-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.75rem;
		border: 1px solid #f3f4f6;
		background-color: #f9fafb;
		padding: 1rem;
		transition: all 0.2s;
	}

	.site-item:hover {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.site-url {
		font-weight: 500;
		color: #374151;
	}

	.remove-button {
		border-radius: 0.5rem;
		background-color: white;
		padding: 0.25rem 0.75rem;
		color: #ef4444;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.remove-button:hover {
		color: #b91c1c;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
