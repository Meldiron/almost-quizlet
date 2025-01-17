<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { account } from '$lib/appwrite';
	import Progress from '$lib/components/Progress.svelte';
	import { flashcards } from '$lib/database';
	import { tick } from 'svelte';
	import { storeTitle } from '../store.title.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	storeTitle.value = 'Flashcards';

	let isReseting = $state(false);
	async function onReset(slug: string) {
		isReseting = true;
		if (confirm('Are sure you want to reset your progress?')) {
			try {
				await account.updatePrefs({
					flashcards: JSON.stringify({
						...data.flashcards,
						[slug]: {}
					})
				});

				await invalidateAll();
			} catch (err) {
				console.error(err);
				alert('Something went wrong. Please try again.');
			} finally {
				isReseting = false;
			}
		}
	}
</script>

<div class="grid grid-cols-12 gap-4">
	{#each flashcards as flashcard}
		<div
			class="col-span-12 flex w-full flex-col justify-between rounded-xl bg-slate-800 p-4 xs:col-span-6 lg:col-span-4"
		>
			<div>
				<Progress
					total={flashcard.cards.length}
					size="sm"
					progress={data.flashcards[flashcard.slug] ?? {}}
				/>
			</div>

			<div>
				<h3 class="line-clamp-3 px-1">{flashcard.name}</h3>
				<p class="mt-2">
					<span class="rounded-full bg-slate-900 px-3 py-1.5 text-xs"
						>{flashcard.cards.length} {flashcard.cards.length === 1 ? 'card' : 'cards'}</span
					>
				</p>
			</div>

			<div class="mt-6 flex justify-end gap-2">
				{#if ((data.flashcards[flashcard.slug] ?? {}).correct ?? 0) > 0 || ((data.flashcards[flashcard.slug] ?? {}).incorrect ?? 0) > 0}
					<button
						disabled={isReseting}
						aria-label="Reset progress"
						onclick={() => onReset(flashcard.slug)}
						type="button"
						class="rounded-full bg-orange-800 bg-opacity-50 px-4 text-orange-500 disabled:opacity-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
							/>
						</svg>
					</button>
				{/if}

				<a
					href={`/flashcards/${flashcard.slug}`}
					class="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 pr-2 text-sm text-slate-900"
					><span>Learn</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-6"
					>
						<path
							fill-rule="evenodd"
							d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			</div>
		</div>
	{/each}
</div>
