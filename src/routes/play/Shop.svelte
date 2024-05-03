<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Player, Unit } from "$lib/system";
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
	oncontinue()
}
let viewhand = () => {
	view="hand"
}
</script>

{#if view=="shop"}
<div class="card mt-2">
	<div class="card-header">
		Tienda para <span class="text-{player.color}">{player.name}</span>
		<span class="float-end">
			<button onclick={viewhand} class="btn btn-outline-secondary">Ver mano</button>

			<button onclick={_oncontinue} class="btn btn-outline-danger">Continuar</button>
		</span>
	</div>
	<div class="card-body">
		Oro: {player.gold} Cartas en la mano: {player.hand.length}<br>
		<div class="row mt-2">
			{#each cards as unit, i}
				<div class="col-12 col-md-4 mb-1">
					{#snippet actions()}
							<button disabled={player.gold==0} class="btn btn-sm btn-warning" onclick={() => buy(i)} title="Comprar"><span class="bi bi-currency-dollar"></span></button>
					{/snippet}
					<UnitCard {unit} {actions} />
				</div>
			{/each}
		</div>

	</div>
</div>
{:else}
	<Hand {player} onclose={() => view="shop"} cardActions={undefined} boardActions={undefined} closeText="Regresar" />

{/if}
