<script lang="ts">
	import { blockedSites, isBlockingEnabled, saveBlockingStatus } from '$lib/stores';

	function toggleBlocking() {
		$isBlockingEnabled = !$isBlockingEnabled;
		saveBlockingStatus($isBlockingEnabled);
		// Check if the current URL is blocked
		const currentUrl = window.location.href;
		console.group('blockedSites');
		console.log($blockedSites.map((site) => site.url));
		console.log(currentUrl);
		console.groupEnd();
		if ($blockedSites.some((site) => currentUrl.includes(site.url))) {
			console.log('blocked');
			// Redirect to the blocked page
			window.location.href = chrome.runtime.getURL('blocked.html');
		}
	}
</script>

<div class="blocking-toggle mb-8">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xl font-bold text-gray-800">Blocking Status</h2>
			<p class="mt-1 text-sm text-gray-600">
				{$isBlockingEnabled ? 'FocusLock is active' : 'FocusLock is disabled'}
			</p>
		</div>

		<button
			class="rounded-xl px-5 py-3 font-semibold text-white transition duration-300 {$isBlockingEnabled
				? 'bg-green-500 hover:bg-green-600'
				: 'bg-gray-400 hover:bg-gray-500'} transform shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
			on:click={toggleBlocking}
		>
			{$isBlockingEnabled ? 'Enabled' : 'Disabled'}
		</button>
	</div>
</div>
