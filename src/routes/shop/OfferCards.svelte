<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { DeckUnit }  from "$lib/system";
    import { createEventDispatcher } from "svelte";

export let player:ShopPlayer
export let offered:DeckUnit[]
let dispatch = createEventDispatcher()
</script>
			<h5>Quien puede ver esta página: <span class="text-{player.color}">{player.name}</span></h5>

			<slot />
			Oro: {player.gold} Cartas en la mano: {player.units.length}<br>
			<div class="row mt-2">
				{#each offered as unit, i (unit.index)}
					<div class="col-3">
						<UnitCard {unit}>
							<span class="float-end">
								<button class="btn btn-sm btn-danger" on:click={() => dispatch('buy', i)}>Comprar</button>
							</span>
						</UnitCard>
					</div>
				{/each}
			</div>

