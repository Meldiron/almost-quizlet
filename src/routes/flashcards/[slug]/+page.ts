export let ssr = false;

import type { PageLoad } from './$types';
import { flashcards } from '$lib/database';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const data = await parent();
	const flashcard = flashcards.find((flashcard) => flashcard.slug === params.slug);

	if (!flashcard) {
		throw redirect(307, '/flashcards');
	}

	const progress = data.flashcards[params.slug] ?? {
		incorrect: 0,
		correct: 0
	};

	return {
		flashcard,
		progress
	};
};
