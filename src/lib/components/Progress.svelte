<script lang="ts">
	interface Props {
		size: 'lg' | 'sm';
		progress: any;
		total: number;
	}

	let { size, progress, total }: Props = $props();

	let h = size === 'sm' ? 'h-1' : 'h-2';

	let widthGreen = $state(0);
	let widthRed = $state(0);
	$effect(() => {
		let correct = progress.correct ?? 0;
		let incorrect = progress.incorrect ?? 0;

		widthGreen = Math.round((correct / total) * 100);
		widthRed = Math.round((incorrect / total) * 100);
	});
</script>

<div class="relative mb-3 flex items-center overflow-hidden rounded-full">
	<div class={`w-full bg-slate-600 ${h}`}></div>

	<div class={`absolute left-0 h-1 bg-green-500 ${h}`} style={`width: ${widthGreen}%;`}></div>
	<div
		class={`absolute left-0 h-1 bg-red-500 ${h}`}
		style={`width: ${widthRed}%; left: ${widthGreen}%;`}
	></div>
</div>
