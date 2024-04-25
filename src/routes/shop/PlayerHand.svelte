<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";

export let player:ShopPlayer
</script>
<div class="card mt-2">
	<div class="card-header">
		Viendo la mano de <span class="text-{player.color}">{player.name}</span>
	</div>
	<div class="card-body">
		<div class="row">
			{#each player.units as unit (unit.index)}
				<div class="col-3 mb-2">
					<UnitCard {unit} />
				</div>
			{/each}
		</div>
	</div>
</div>

