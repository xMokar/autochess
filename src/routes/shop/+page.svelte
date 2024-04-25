<script lang="ts">
    import ElementIcon from "$lib/ElementIcon.svelte";
import UnitCard from "$lib/UnitCard.svelte";
import { Units, type Unit } from "$lib/system";

interface Player {
	name: string,
	color: string,
	picked: boolean,
	finished: boolean,
	gold: number,
	rolls: number,
	units: DeckUnit[]
}

interface DeckUnit extends Unit {
	index:number
}

let players:Player[] = [ 
		{ 
			name: 'Jugador1',
			color: 'primary',
			picked: false,
			finished: false,
			gold: 6,
			rolls: 2,
			units: []
		},
		{
			name: 'Jugador2',
			color: 'danger',
			picked: false,
			finished: false,
			gold: 6,
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
let currentPlayer:Player|undefined = undefined

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
	currentPlayer.gold = 6
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
			<h5>Comprar cartas</h5>
			<h5>Quien puede ver esta página: <span class="text-{currentPlayer.color}">{currentPlayer.name}</span></h5>

			{#if currentPlayer.rolls>0}
				<button on:click={roll} class="btn btn-primary">{currentPlayer.name} pide nuevas cartas</button>
			{:else}
				<button on:click={endTurn} class="btn btn-danger">{currentPlayer.name} Termina su turno de compra.</button>
			{/if}
			Oro: {currentPlayer.gold} Cartas en la mano: {currentPlayer.units.length}<br>
			<div class="row mt-2">
				{#each offered as unit, i (unit.index)}
					<div class="col-3">
						<div class="card">
							<div class="card-header">
								<ElementIcon element={unit.element} />
								{unit.name}
								{#if currentPlayer.gold>0}
								<span class="float-end">
									<button class="btn btn-sm btn-danger" title="Comprar" on:click={() => buy(i)}>$</button>
								</span>
								{/if}
							</div>
							<div class="card-body">
								<UnitCard {unit} />
							</div>
						</div>
					</div>
				{/each}
			</div>
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
			<div class="row mt-2">
				{#each currentPlayer.units as unit, i (unit.index)}
					<div class="col-3">
						<div class="card">
							<div class="card-header">
								<ElementIcon element={unit.element} />
								{unit.name}
							</div>
							<div class="card-body">
								<UnitCard {unit} />
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
