<script lang="ts">
    import UnitMiniCard from "$lib/UnitMiniCard.svelte";
    import type { Player } from "$lib/system";
    import type { Snippet } from "svelte";

let {player, onclose, onclick, boardActions, closeText}:{
	player:Player, 
	boardActions:Snippet|undefined,
	onclose:()=>void,
	onclick:(i:number)=>void,
	closeText:string
} = $props();
</script>
<div class="card mt-2">
	<div class="card-header bg-{player.color} text-light">
		Viendo la mano de {player.name}
		<span class="float-end">
			<button onclick={onclose} class="btn btn-outline-light">{closeText}</button>
			{#if boardActions}
			{@render boardActions()}
			{/if}
		</span>
	</div>
	<div class="card-body">
		<div class="row">
			{#each player.hand as unit, index}
				<div class="col-4 mb-2 d-flex align-items-stretch">
					<UnitMiniCard {unit} onclick={() => onclick(index)} {index} field={undefined} cardActions={undefined} />
				</div>
			{:else}
				No tienes cartas en la mano.
			{/each}
		</div>
	</div>
</div>

