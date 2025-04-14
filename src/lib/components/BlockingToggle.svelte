<script lang="ts">
	import { UNBLOCKABLE_SITES } from '$lib/sites';
	import {
		blockedSites,
		getCurrentTabUrl,
		isBlockingEnabled,
		redirectToBlockedPage,
		saveBlockingStatus
	} from '$lib/stores';

	async function toggleBlocking() {
		$isBlockingEnabled = !$isBlockingEnabled;
		saveBlockingStatus($isBlockingEnabled);

		// Only check for blocked sites when enabling blocking
		if ($isBlockingEnabled) {
			const currentUrl = await getCurrentTabUrl();
			if (!currentUrl) return;

			const urlObj = new URL(currentUrl);
			const hostname = urlObj.hostname.replace('www.', '');

			// Check if current site is blocked using proper hostname comparison
			const isCurrentSiteBlocked = $blockedSites.some((site) => {
				const siteHost = site.url.replace('www.', '');
				return hostname.includes(siteHost) || siteHost.includes(hostname);
			});

			if (isCurrentSiteBlocked && !UNBLOCKABLE_SITES.includes(hostname)) {
				redirectToBlockedPage();
			}
		}
	}
</script>

<div class="blocking-toggle">
	<div class="toggle-container">
		<div>
			<h2 class="toggle-title">Blocking Status</h2>
			<p class="toggle-status">
				{$isBlockingEnabled ? 'FocusLock is active' : 'FocusLock is disabled'}
			</p>
		</div>

		<button
			class="toggle-button {$isBlockingEnabled ? 'enabled' : 'disabled'}"
			on:click={toggleBlocking}
		>
			{$isBlockingEnabled ? 'Enabled' : 'Disabled'}
		</button>
	</div>
</div>

<style>
	.blocking-toggle {
		margin-bottom: 2rem;
	}

	.toggle-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.toggle-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.toggle-status {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: #4b5563;
	}

	.toggle-button {
		border-radius: 0.75rem;
		padding: 0.75rem 1.25rem;
		font-weight: 600;
		color: white;
		transform: translateY(0);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s;
	}

	.toggle-button:hover {
		transform: translateY(-0.125rem);
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
	}

	.toggle-button:active {
		transform: translateY(0);
	}

	.enabled {
		background-color: #22c55e;
	}

	.enabled:hover {
		background-color: #16a34a;
	}

	.disabled {
		background-color: #9ca3af;
	}

	.disabled:hover {
		background-color: #6b7280;
	}
</style>
