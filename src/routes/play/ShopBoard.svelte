<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Player } from "$lib/system";

let {player}:{
	player:Player, 
} = $props();
</script>
<div class="card mt-2">
	<div class="card-header bg-{player.color} text-light">
		Viendo el tablero de {player.name}
	</div>
	<div class="card-body">
		<div class="row">
			{#each player.field as unit}
				<div class="col-3 mb-2 d-flex align-items-stretch">
					<UnitCard unit={unit.unit} onclick={() => undefined} actions={undefined} field={player.field} />
				</div>
			{:else}
				No tienes cartas en el tablero
			{/each}
		</div>
	</div>
</div>


