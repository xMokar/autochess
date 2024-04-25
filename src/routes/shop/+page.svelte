<script lang="ts">
import UnitCard from "$lib/UnitCard.svelte";
import { Units, type DeckUnit } from "$lib/system";
    import OfferCards from "./OfferCards.svelte";
    import PlayerHand from "./PlayerHand.svelte";

let players:ShopPlayer[] = [ 
		{ 
			name: 'Jugador1',
			color: 'primary',
			picked: false,
			finished: false,
			gold: 5,
			rolls: 2,
			units: []
		},
		{
			name: 'Jugador2',
			color: 'danger',
			picked: false,
			finished: false,
			gold: 5,
			rolls: 2,
			units: []
		}
	]

let newDeck = Units
	.flatMap(unit => Array(5).fill(unit))
	.map((unit,index) => ({...unit, index}) as DeckUnit)

let shuffle = (deck:DeckUnit[]) => deck
	.map(unit => ({ unit, order: Math.random()*deck.length }))
	.sort((a, b) => b.order-a.order)
	.map(({unit}) => unit)

let deck = shuffle(newDeck)

let endTurn = () => {
		if(!currentPlayer) return
		currentPlayer.finished = true
		currentPlayer = undefined
		if(!players.find(player=>!player.finished)) {
			mode="view"
		}
		
}
let mode="buy"
let currentPlayer:ShopPlayer|undefined = undefined

let offered:DeckUnit[] = []
let discard:DeckUnit[] = []
let roll = () => {
	if(!currentPlayer) return
	discard.push(...offered)
	offered = deck.splice(0,5)
	currentPlayer.rolls--
}
let buy = (index:number) => {
	if(!currentPlayer) return
	if(currentPlayer.gold==0)
		return;
	currentPlayer.gold--
	currentPlayer.units.push(...offered.splice(index, 1))
	offered = offered
}

let fold = () => {
	if(!currentPlayer) return
	currentPlayer.finished = false
	currentPlayer.rolls = 2
	currentPlayer.gold = 5
	deck.push(...currentPlayer.units)
	currentPlayer.units = []
	currentPlayer = undefined
	mode = "buy"
}
</script>
<div class="container mt-2">
	<a href="/" class="btn btn-primary">Guía del juego</a>
	<a href="/shop" data-sveltekit-reload="true" class="btn btn-secondary">Reiniciar la tienda</a>
	{#if mode=="buy"}
		{#if currentPlayer}
			<div class="card mt-2">
				<div class="card-header">
					Tienda para <span class="text-{currentPlayer.color}">{currentPlayer.name}</span>
					<span class="float-end">
						{#if currentPlayer.rolls>0}
							<button on:click={roll} class="btn btn-primary">Pedir cartas nuevas</button>
						{:else}
							<button on:click={endTurn} class="btn btn-danger">Termina tu turno de compra</button>
						{/if}
					</span>
				</div>
				<div class="card-body">
					<OfferCards player={currentPlayer} offered={offered} on:buy={(ev) => buy(ev.detail)} />
				</div>
			</div>

			<PlayerHand player={currentPlayer} />
		{:else}
			{@const activePlayers = players.filter(player => !player.finished)}
			<h5>Comprar cartas</h5>
			{#each activePlayers as player}
				<button on:click={() => {
					currentPlayer = player
					roll()
				}} class="btn btn-success me-2">
					{player.name} inicia su turno de compra
				</button>
			{/each}
		{/if}
	{:else}
		<h5>Ver la mano de cada jugador</h5>
		{#each players as player}
			<button on:click={() => currentPlayer = player} class="btn btn-warning me-2">
				Ver mano de {player.name}
			</button>
		{/each}
		<button on:click={() => currentPlayer = undefined} class="btn btn-secondary">
			Nadie
		</button>

		{#if currentPlayer}
			<button class="btn btn-info" on:click={fold}>
				Retirarse
			</button>
			<PlayerHand player={currentPlayer} />
		{/if}
	{/if}
</div>
