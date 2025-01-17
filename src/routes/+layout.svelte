<script lang="ts">
	import { page } from '$app/state';

	import '../app.css';
	import { storeTitle } from './store.title.svelte';
	let { children } = $props();

	const menuItems = [
		{
			title: 'Flashcards',
			url: '/flashcards'
		}
	];

	let mobileMenuOpened = $state(false);
</script>

<div class="min-h-full">
	<div class="bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 pb-28">
		<nav class="bg-slate-900">
			<div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between px-4 sm:px-0">
					<div class="flex items-center">
						<a href="/" class="flex flex-shrink-0 items-center space-x-2">
							<p class="text-xl font-bold text-slate-100">Almost Quizlet</p>
						</a>
						<div class="hidden md:block">
							<div class="ml-10 flex items-baseline space-x-4">
								{#each menuItems as item}
									<a
										href={item.url}
										class={page.url.pathname.startsWith(item.url)
											? 'rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900'
											: 'rounded-md px-3 py-2 text-sm font-medium text-stone-100 hover:bg-slate-800'}
										aria-current="page">{item.title}</a
									>
								{/each}
							</div>
						</div>
					</div>
					<div class="-mr-2 flex md:hidden">
						<button
							onclick={() => (mobileMenuOpened = !mobileMenuOpened)}
							type="button"
							class="inline-flex items-center justify-center rounded-md bg-slate-700 p-2 text-white hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span class="sr-only">Open main menu</span>

							{#if mobileMenuOpened}
								<svg
									class="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							{:else}
								<svg
									class="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							{/if}
						</button>
					</div>
				</div>
			</div>

			<!-- Mobile menu, show/hide based on menu state. -->
			{#if mobileMenuOpened}
				<div class="border-b border-slate-600 md:hidden" id="mobile-menu">
					<div class="space-y-1 px-2 py-3 sm:px-3">
						{#each menuItems as item}
							<a
								href={item.url}
								class={page.url.pathname.startsWith(item.url)
									? 'bg-slat-900 block rounded-md px-3 py-2 text-base font-medium text-white'
									: 'block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-slate-600'}
								aria-current="page">{item.title}</a
							>
						{/each}
					</div>
				</div>
			{/if}
		</nav>
		<header class="pb-0 pt-8">
			<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<h1 class="text-4xl font-medium tracking-tight text-slate-50">{storeTitle.value}</h1>
			</div>
		</header>
	</div>

	<main class="-mt-20 pb-12">
		<div class="mx-auto max-w-4xl px-4 pb-6 sm:px-6 lg:px-8">
			<div
				class="flex flex-col space-y-6 rounded-2xl bg-slate-900 px-5 py-6 text-slate-300 shadow sm:px-6"
			>
				{@render children()}
			</div>
		</div>

		<p class="text-center text-sm text-slate-600">© 2024 Almost Apps</p>
	</main>
</div>
