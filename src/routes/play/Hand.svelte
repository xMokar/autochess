<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Player } from "$lib/system";
    import type { Snippet } from "svelte";

let {player, onclick, boardActions}:{
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
		{#if boardActions}
		<div class="float-end">
		{@render boardActions()}
		</div>
		{/if}
	</div>
	<div class="card-body">
		<div class="row">
			{#each player.hand as unit, index}
				<div class="col-3 mb-2 d-flex align-items-stretch">
					<UnitCard {unit} onclick={() => onclick(index)} actions={undefined} front={true} />
				</div>
			{:else}
				No tienes cartas en la mano.
			{/each}
		</div>
	</div>
</div>

