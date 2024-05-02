<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Player, Unit }  from "$lib/system";

interface Props {
		player:Player,
		offered:Unit[],
		buy:(i:number) => void,
	}

let { player, offered, buy }:Props = $props()
</script>

Oro: {player.gold} Cartas en la mano: {player.hand.length}<br>
<div class="row mt-2">
	{#each offered as unit, i}
		<div class="col-12 col-md-4 mb-1">
			{#snippet actions()}
					<button disabled={player.gold==0} class="btn btn-sm btn-warning" onclick={() => buy(i)} title="Comprar"><span class="bi bi-currency-dollar"></span></button>
			{/snippet}
			<UnitCard {unit} {actions} />
		</div>
	{/each}
</div>

