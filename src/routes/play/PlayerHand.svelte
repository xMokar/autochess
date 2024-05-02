<script lang="ts">
    import UnitMiniCard from "$lib/UnitMiniCard.svelte";
    import type { Player } from "$lib/system";
    import type { Snippet } from "svelte";

let { player, actions=undefined, cardActions }:{
	player:Player, 
	actions:any, 
	cardActions:Snippet<[number]>|undefined
} = $props()
</script>
<div class="card mt-2">
	<div class="card-header">
		Viendo la mano de <span class="text-{player.color}">{player.name}</span>
		<span class="float-end">{@render actions(player)}</span>
	</div>
	<div class="card-body">
		<div class="row">
			{#each player.hand as unit, index}
				<div class="col-6 col-md-4 mb-2">
					<UnitMiniCard {unit} {cardActions} {index} field={undefined} />
				</div>
			{/each}
		</div>
	</div>
</div>

