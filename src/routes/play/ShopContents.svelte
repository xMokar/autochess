<script lang="ts">
    import UnitCard from '$lib/UnitCard.svelte';
    import type { Player, Unit } from '$lib/system';
    import type { Snippet } from 'svelte';

let { player, buttons, cards, show, onbuy }:{
	player:Player,
	buttons:Snippet,
	cards:Unit[],
	onbuy:(i:number) => void,
	show:boolean
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
						{#if show}
							{#snippet actions()}
								<button disabled={player.gold==0} class="btn btn-sm btn-warning" onclick={() => onbuy(i)} title="Comprar"><span class="bi bi-currency-dollar"></span></button>
							{/snippet}
							<UnitCard {unit} {actions} />
						{:else}
							<div class="card">
								<div class="card-header">Carta escondida</div>
								<div class="card-body">
									El contenido de esta carta esta oculto por privacidad, si eres <span class="text-{player.color}">{player.name}</span> puedes darle click al boton de Mostrar para ver tus cartas.
								</div>
							</div>
							
						{/if}
					</div>
				{:else}
					<div class="col-12">
						Ya compraste todas las cartas de esta ronda de compra, dale click en el botón de "Siguiente jugador".
					</div>
				{/each}
		</div>

	</div>
</div>
