export let ssr = false;

import type { LayoutLoad } from './$types';
import { account } from '$lib/appwrite';
import type { Models } from 'appwrite';

export type UserPrefs = {
	flashcards: string;
};

export const load: LayoutLoad = async () => {
	let user: Models.User<UserPrefs>;

	try {
		user = await account.get<UserPrefs>();
	} catch (err) {
		await account.createAnonymousSession();
		user = await account.get<UserPrefs>();
	}

	const flashcards = JSON.parse(user.prefs.flashcards || '{}');

	return {
		user,
		flashcards
	};
};
