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
