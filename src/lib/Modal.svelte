<script lang="ts">
    import type { Snippet } from "svelte";

	let { show = $bindable(), body }:{show:boolean, body:Snippet} = $props()

	let dialog:HTMLDialogElement; // HTMLDialogElement

	$effect(() => {
		if (dialog && show) dialog.showModal();
	})
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (show = false)}
	onclick={() => dialog.close()}
>
	{@render body()}
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 1em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

