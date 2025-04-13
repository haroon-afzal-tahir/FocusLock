// Get blocking status and blocked sites from storage
async function getStoredData() {
	const data = await chrome.storage.sync.get(['isBlockingEnabled', 'blockedSites']);
	return {
		isBlockingEnabled: data.isBlockingEnabled || false,
		blockedSites: data.blockedSites || []
	};
}

// Function to check if a URL should be blocked
function shouldBlockUrl(url, blockedSites) {
	const urlObj = new URL(url);
	const hostname = urlObj.hostname.replace('www.', '');

	return blockedSites.some((site) => {
		const siteHost = site.url.replace('www.', '');
		return hostname.includes(siteHost) || siteHost.includes(hostname);
	});
}

// Redirect to a block page
function redirectToBlockPage(tabId) {
	chrome.tabs.update(tabId, {
		url: chrome.runtime.getURL('blocked.html')
	});
}

// Update badge based on blocking status
function updateBadge(isEnabled) {
	if (isEnabled) {
		chrome.action.setBadgeText({ text: 'ON' });
		chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' }); // Green color
		chrome.action.setBadgeTextColor({ color: '#FFFFFF' }); // White text color
	} else {
		chrome.action.setBadgeText({ text: 'OFF' });
		chrome.action.setBadgeBackgroundColor({ color: '#9E9E9E' }); // Gray color
	}
}

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes) => {
	if (changes.isBlockingEnabled) {
		updateBadge(changes.isBlockingEnabled.newValue);
	}
});

// Initialize badge when extension loads
getStoredData().then(({ isBlockingEnabled }) => {
	updateBadge(isBlockingEnabled);
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
	// Only process main frame navigations (not iframes)
	if (details.frameId !== 0) return;

	const { isBlockingEnabled, blockedSites } = await getStoredData();

	if (isBlockingEnabled && shouldBlockUrl(details.url, blockedSites)) {
		redirectToBlockPage(details.tabId);
	}
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === 'loading' && tab.url) {
		const { isBlockingEnabled, blockedSites } = await getStoredData();

		if (isBlockingEnabled && shouldBlockUrl(tab.url, blockedSites)) {
			redirectToBlockPage(tabId);
		}
	}
});
