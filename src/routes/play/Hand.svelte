<script lang="ts">
    import UnitMiniCard from "$lib/UnitMiniCard.svelte";
    import type { Player } from "$lib/system";
    import type { Snippet } from "svelte";

let {player, onclose, boardActions, cardActions, closeText}:{
	player:Player, 
	cardActions:Snippet<[number]>,
	boardActions:Snippet,
	onclose:()=>void,
	closeText:string
} = $props();
</script>
<div class="card mt-2">
	<div class="card-header bg-{player.color} text-light">
		Viendo la mano de {player.name}
		<span class="float-end">
			<button onclick={onclose} class="btn btn-primary">{closeText}</button>
			{@render boardActions()}
		</span>
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

