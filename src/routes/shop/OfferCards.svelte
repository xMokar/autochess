<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Unit }  from "$lib/system";

interface Props {
		player:ShopPlayer,
		offered:Unit[],
		buy:(i:number) => void,
	}

let { player, offered, buy }:Props = $props()
</script>

Oro: {player.gold} Cartas en la mano: {player.hand.length}<br>
<div class="row mt-2">
	{#each offered as unit, i}
		<div class="col-3 mb-1">
			{#snippet actions()}
				<span class="float-end">
					<button disabled={player.gold==0} class="btn btn-sm btn-danger" onclick={() => buy(i)}>Comprar</button>
				</span>
			{/snippet}
			<UnitCard {unit} {actions} />
		</div>
	{/each}
</div>

