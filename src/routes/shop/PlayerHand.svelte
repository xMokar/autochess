<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";

let { player, actions=undefined }: {player:ShopPlayer, actions:any} = $props()
</script>
<div class="card mt-2">
	<div class="card-header">
		Viendo la mano de <span class="text-{player.color}">{player.name}</span>
		<span class="float-end">{@render actions(player)}</span>
	</div>
	<div class="card-body">
		<div class="row">
			{#each player.hand as unit}
				<div class="col-3 mb-2">
					<UnitCard {unit} actions={undefined} />
				</div>
			{/each}
		</div>
	</div>
</div>

