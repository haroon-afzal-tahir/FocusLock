import { writable } from 'svelte/store';

export interface BlockedSite {
	url: string;
	id: string;
}

// Store for currently blocked sites
export const blockedSites = writable<BlockedSite[]>([]);

// Store for blocking status
export const isBlockingEnabled = writable(false);

// Load blocked sites from storage
export async function loadBlockedSites() {
	try {
		const data = await chrome.storage.sync.get('blockedSites');
		if (data.blockedSites) {
			blockedSites.set(data.blockedSites);
		}
	} catch (error) {
		console.error('Error loading blocked sites:', error);
	}
}

// Save blocked sites to storage
export async function saveBlockedSites(sites: BlockedSite[]) {
	try {
		await chrome.storage.sync.set({ blockedSites: sites });
	} catch (error) {
		console.error('Error saving blocked sites:', error);
	}
}

// Load blocking status from storage
export async function loadBlockingStatus() {
	try {
		const data = await chrome.storage.sync.get('isBlockingEnabled');
		if (data.isBlockingEnabled !== undefined) {
			isBlockingEnabled.set(data.isBlockingEnabled);
		}
	} catch (error) {
		console.error('Error loading blocking status:', error);
	}
}

// Save blocking status to storage
export async function saveBlockingStatus(enabled: boolean) {
	try {
		console.log('saving blocking status', enabled);
		await chrome.storage.sync.set({ isBlockingEnabled: enabled });
	} catch (error) {
		console.error('Error saving blocking status:', error);
	}
}

export async function redirectToBlockedPage() {
	// This moves the extension route to the blocked page
	// But I want the current tab to be redirected to the blocked page
	// So I need to get the current tab id and then redirect the current tab to the blocked page
	const tab = await getCurrentTab();
	if (tab?.id) {
		if (tab.url) {
			// check if the current tab url is already the blocked page
			if (tab.url.includes('blocked.html')) {
				return;
			}
		}
		chrome.tabs.update(tab.id, { url: chrome.runtime.getURL('blocked.html') });
	}
}

async function getCurrentTab() {
	const queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

export async function getCurrentTabUrl() {
	const tab = await getCurrentTab();
	if (tab?.url) {
		return tab.url;
	}
	return null;
}
