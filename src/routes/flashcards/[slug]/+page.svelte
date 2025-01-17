<script lang="ts">
	import { tick } from 'svelte';
	import { storeTitle } from '../../store.title.svelte';
	import Progress from '$lib/components/Progress.svelte';
	import type { PageData } from './$types';
	import { account } from '$lib/appwrite';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	let progress = $state(data.progress);

	storeTitle.value = data.flashcard.name;

	let q = $state('');
	let a = $state('');
	let correctA = $state('');

	let wasCorrect: null | boolean = $state(null);

	let isHoldingShift = $state(false);

	$effect(() => {
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Shift') {
				isHoldingShift = true;
			}
		});
		document.addEventListener('keyup', (event) => {
			if (event.key === 'Shift') {
				isHoldingShift = false;
			}
		});
		document.addEventListener('keypress', async (event: any) => {
			const targetId = event?.target?.id ?? '';
			if (event.key === 'Enter' && targetId === 'body' && q !== '') {
				let override = event.shiftKey;
				let finalCorrect = override ? true : wasCorrect;

				saveAnswer(finalCorrect === null ? true : finalCorrect);

				await tick();
				document.getElementById('answer')?.focus();
			}
		});
	});

	async function saveAnswer(correct: boolean) {
		try {
			correct ? progress.correct++ : progress.incorrect++;

			progress.correct = progress.correct;
			progress.incorrect = progress.incorrect;

			wasCorrect = null;
			a = '';

			loadQuestion();

			await account.updatePrefs({
				flashcards: JSON.stringify({
					...data.flashcards,
					[data.flashcard.slug]: progress
				})
			});
		} catch (err) {
			console.error(err);
			alert('Something went wrong. Please refresh the page.');
		}
	}

	function onSubmit(e: Event) {
		e.preventDefault();
		wasCorrect = a === correctA;
	}

	loadQuestion();

	function loadQuestion() {
		let finished = progress.correct + progress.incorrect;

		if (finished >= data.flashcard.cards.length) {
			q = '';
			correctA = '';
			return;
		}

		const nextCard = data.flashcard.cards[finished];
		q = nextCard.q;
		correctA = nextCard.a;
	}
</script>

<div>
	<Progress total={data.flashcard.cards.length} size="lg" {progress} />

	<div class="mt-3">
		<span
			class="mr-1 inline-flex rounded-full border border-green-500 px-3 py-1.5 text-xs text-green-500"
			>{progress.correct} correct</span
		>
		<span
			class="mr-1 inline-flex rounded-full border border-red-500 px-3 py-1.5 text-xs text-red-500"
			>{progress.incorrect} incorrect</span
		>
		<span
			class="mr-1 inline-flex rounded-full border border-slate-800 bg-slate-800 px-3 py-1.5 text-xs"
			>{data.flashcard.cards.length - progress.correct - progress.incorrect} remaining</span
		>
	</div>
</div>

{#if q}
	<form onsubmit={onSubmit} class="flex flex-col gap-2">
		<div
			class="rounded-2xl rounded-b-[4px] border-2 border-blue-600 bg-blue-900 bg-opacity-25 p-6 text-blue-100"
		>
			<p class="-mt-2 mb-1 text-xs opacity-50">Question:</p>
			<p class="font-sans text-lg font-medium">{q}</p>
		</div>

		{#if wasCorrect === false}
			<div class="border-2 border-green-600 bg-green-900 bg-opacity-25 p-6 text-green-100">
				<p class="-mt-2 mb-1 text-xs opacity-50">Correct answer:</p>
				<p class="font-sans text-lg font-medium">{correctA}</p>
			</div>
		{/if}

		<div class="items- center relative flex w-full">
			<input
				bind:value={a}
				id="answer"
				placeholder={wasCorrect === null ? 'Type answer here' : ''}
				disabled={wasCorrect !== null}
				class={`w-full border-2 font-sans ${wasCorrect === null ? 'border-slate-600 bg-slate-600 bg-opacity-10 text-slate-100' : wasCorrect === false ? 'border-red-600 bg-red-900 bg-opacity-25 text-red-100' : 'border-green-600 bg-green-900 bg-opacity-25 text-green-100'} rounded-2xl rounded-t-[4px] p-6 pt-10 ${wasCorrect === null ? 'rounded-r-none' : ''}`}
			/>
			<div class="absolute left-6 top-6">
				<p class="-mt-2 mb-1 text-xs opacity-50">Your answer:</p>
			</div>

			{#if wasCorrect === null}
				<button
					type="submit"
					class="rounded-2xl rounded-l-none border-2 border-l-0 border-slate-600 bg-slate-600 bg-opacity-10 px-6 text-slate-100"
					>Submit</button
				>
			{/if}
		</div>

		{#if wasCorrect !== null}
			<div class="mt-4 grid grid-cols-12 gap-4">
				<button
					onclick={() => saveAnswer(true)}
					type="button"
					class={`col-span-6 rounded-2xl border-2 border-slate-600 bg-slate-600 px-6 py-3 text-slate-100 ${isHoldingShift ? 'bg-opacity-30' : 'bg-opacity-10'}`}
				>
					<p class="mb-3">
						<span
							class="rounded-lg border-2 border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-300 text-opacity-50"
							>Shift</span
						>
						<span class="px-1 text-slate-500">+</span>
						<span
							class="rounded-lg border-2 border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-300 text-opacity-50"
							>Enter</span
						>
					</p>
					<p class="text-lg">I was correct</p>
				</button>
				<button
					onclick={() => saveAnswer(wasCorrect === null ? true : wasCorrect)}
					type="button"
					class="col-span-6 rounded-2xl border-2 border-slate-600 bg-slate-600 bg-opacity-10 px-6 py-3 text-slate-100"
				>
					<p class="mb-3">
						<span
							class="rounded-lg border-2 border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-300 text-opacity-50"
							>Enter</span
						>
					</p>
					<p class="text-lg">I was wrong</p></button
				>
			</div>
		{/if}
	</form>
{/if}
