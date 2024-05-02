<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Player, Unit } from "$lib/system";

let {deck = $bindable(), player = $bindable(), onend}:{
		deck:Unit[],
		player:Player,
		onend:()=>void,
	} = $props()

let offered:Unit[] = $state([])
let roll = () => {
	deck.push(...offered)
	offered = deck.splice(0,5)
	player.rolls--
}

let buy = (index:number) => {
	if(player.gold==0)
		return;
	player.gold--
	player.hand.push(...offered.splice(index, 1))
}
let _onend = () => {
	deck.push(...offered)
	onend()
}
roll()
</script>

<div class="card mt-2">
	<div class="card-header">
		Tienda para <span class="text-{player.color}">{player.name}</span>
		<span class="float-end">
			{#if player.rolls>0}
				<button onclick={roll} class="btn btn-primary">Pedir cartas nuevas</button>
			{:else}
				<button onclick={_onend} class="btn btn-danger">Termina tu turno de compra</button>
			{/if}
		</span>
	</div>
	<div class="card-body">
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

	</div>
</div>
