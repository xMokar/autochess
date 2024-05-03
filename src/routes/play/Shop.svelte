<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Player, Unit } from "$lib/system";
    import Page from "../+page.svelte";
    import Hand from "./Hand.svelte";

let {cards, player = $bindable(), oncontinue, ontake}:{
		cards:Unit[],
		player:Player,
		oncontinue:()=>void,
		ontake:(index:number)=>Unit
	} = $props()

let view = $state("shop")

let buy = (index:number) => {
	if(player.gold==0)
		return;
	player.gold--
	player.hand.push(ontake(index))
}
let _oncontinue = () => {
	show = false
	oncontinue()
}
let viewhand = () => {
	view="hand"
}
let show = $state(false)
</script>

{#if view=="shop"}
<div class="card mt-2">
	<div class="card-header">
		Tienda para <span class="text-{player.color}">{player.name}</span>
		<span class="float-end">
			{#if !show}
				<button class="btn btn-outline-primary" onclick={() => show = true}>Mostrar cartas</button>
			{/if}
			<button onclick={viewhand} class="btn btn-outline-secondary">Ver mano</button>

			<button onclick={_oncontinue} class="btn btn-outline-danger">Continuar</button>
		</span>
	</div>
	<div class="card-body">
		Oro: {player.gold} Cartas en la mano: {player.hand.length}<br>
		<div class="row mt-2">
				{#each cards as unit, i}
					<div class="col-12 col-md-4 mb-1">
						{#if show}
							{#snippet actions()}
									<button disabled={player.gold==0} class="btn btn-sm btn-warning" onclick={() => buy(i)} title="Comprar"><span class="bi bi-currency-dollar"></span></button>
							{/snippet}
							<UnitCard {unit} {actions} />
						{:else}
							<div class="card">
								<div class="card-header">Carta escondida</div>
								<div class="card-body">
									El contenido de esta carta esta oculto por privacidad, puedes darle click al boton de Mostrar para ver tus cartas.
								</div>
							</div>
							
						{/if}
					</div>
				{/each}
		</div>

	</div>
</div>
{:else}
	<Hand {player} onclose={() => view="shop"} cardActions={undefined} boardActions={undefined} closeText="Regresar" />

{/if}
