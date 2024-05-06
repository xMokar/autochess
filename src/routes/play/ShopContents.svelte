<script lang="ts">
    import Effect from '$lib/Effect.svelte';
import UnitCard from '$lib/UnitCard.svelte';
    import type { Player, Unit } from '$lib/system';
    import type { Snippet } from 'svelte';

let { player, buttons, cards, onbuy, rolled }:{
	player:Player,
	buttons:Snippet,
	cards:Unit[],
	onbuy:(i:number) => void,
	rolled:boolean
} = $props()
</script>
<div class="card mt-2">
	<div class="card-header">
		Tienda para <span class="text-{player.color}">{player.name}</span>
		<span class="float-end">
			{@render buttons()}
		</span>
	</div>
	<div class="card-body">
		Oro: {player.gold} Cartas en la mano: {player.hand.length}<br>
		<div class="row mt-2">
				{#each cards as unit, i}
					<div class="col-md-4 mb-1 d-flex align-items-stretch">
						{#snippet actions()}
							<button disabled={player.gold==0} class="btn btn-sm btn-warning" onclick={() => onbuy(i)} title="Comprar"><span class="bi bi-currency-dollar"></span></button>
						{/snippet}
						<UnitCard {unit} {actions} />
					</div>
				{:else}
					<div class="col-12">
						La tienda esta vacia.
						{#if rolled}
							Es momento de darle click al botón de "Siguiente jugador"
						{:else}
							Puedes pedir unidades, que no las vea el otro jugador.
						{/if}
					</div>
				{/each}
		</div>

	</div>
</div>
