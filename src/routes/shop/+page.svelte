<script lang="ts">
    import { goto } from "$app/navigation";
    import { fight } from "$lib/combat";
    import { getPlayers, updatePlayer } from "$lib/state";
import { Units, type Unit, type Player } from "$lib/system";
    import ManagePlayer from "./ManagePlayer.svelte";
import OfferCards from "./OfferCards.svelte";
import PlayerHand from "./PlayerHand.svelte";

let players = $state(getPlayers())
let newDeck = Units
	.flatMap(unit => Array(5).fill(unit))
	.map((unit,index) => ({...unit, index}) as Unit)

let shuffle = (deck:Unit[]) => deck
	.map(unit => ({ unit, order: Math.random()*deck.length }))
	.sort((a, b) => b.order-a.order)
	.map(({unit}) => unit)

let deck = shuffle(newDeck)

let endTurn = () => {
		if(!currentPlayer) return
		currentPlayer.finished = true
		updatePlayer(currentPlayer)
		currentPlayer = undefined
		if(!players.find(player=>!player.finished)) {
			mode="view"
		}
		
}
let mode= $state(players.find(p=>!p.finished)?"buy":"view")
let currentPlayer:Player|undefined = $state(undefined)

let offered:Unit[] = $state([])
let discard:Unit[] = $state([])
let roll = () => {
	if(!currentPlayer) return
	discard.push(...offered)
	offered = deck.splice(0,5)
	currentPlayer.rolls--
}
let select = (player:Player|undefined) => {
	currentPlayer = player
	log = []
}
let buy = (index:number) => {
	if(!currentPlayer) return
	if(currentPlayer.gold==0)
		return;
	currentPlayer.gold--
	currentPlayer.hand.push(...offered.splice(index, 1))
}

let resetPlayer = (player:Player) => {
	player.finished = false
	player.rolls = 2
	player.gold = 5
	player.hand = []
	player.field = []
}
let fold = () => {
	if(!currentPlayer) return
	deck.push(...currentPlayer.hand)
	resetPlayer(currentPlayer)
	currentPlayer = undefined
	mode = "buy"
}
let restart = () => {
	for(let player of players) {
		resetPlayer(player)
		updatePlayer(player)
	}
		
	mode = "buy"	
	goto("/shop")
		
}
let log:string[] = $state([])
let winner:Player|undefined = $state(undefined)
let doFight = () => {
	currentPlayer = undefined
	let result = fight(players[0], players[1])
	log = result.log
	winner = result.winner
}
</script>

<div class="container mt-2">
	<a href="/" class="btn btn-primary">Guía del juego</a>
	<button onclick={restart} class="btn btn-secondary">Reiniciar</button>
	{#if mode=="buy"}
		{#if currentPlayer}
			<div class="card mt-2">
				<div class="card-header">
					Tienda para <span class="text-{currentPlayer.color}">{currentPlayer.name}</span>
					<span class="float-end">
						{#if currentPlayer.rolls>0}
							<button onclick={roll} class="btn btn-primary">Pedir cartas nuevas</button>
						{:else}
							<button onclick={endTurn} class="btn btn-danger">Termina tu turno de compra</button>
						{/if}
					</span>
				</div>
				<div class="card-body">
					<OfferCards player={currentPlayer} offered={offered} buy={(index) => buy(index)} />
				</div>
			</div>

			<PlayerHand player={currentPlayer} actions={undefined} cardActions={undefined} />
		{:else}
			{@const activePlayers = players.filter(player => !player.finished)}
			<h5>Comprar cartas</h5>
			<div class="row">
				{#each activePlayers as player}
					<div class="col-6">
						<div class="card">
							<div class="card-header">
								<input type="text" bind:value={player.name} />
							</div>
							<div class="card-body">
								<button onclick={() => {
									currentPlayer = player
									updatePlayer(player)
									roll()
								}} class="btn btn-success me-2">
									Iniciar turno de compra
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<h5>Ver la mano de cada jugador</h5>
		{#each players as player}
			<button onclick={() => select(player)} class="btn btn-warning me-2">
				Ver mano de {player.name}
			</button>
		{/each}
		<button onclick={() => select(undefined)} class="btn btn-secondary">
			Nadie
		</button>
		<button onclick={() => doFight()} class="btn btn-danger">
			Pelear
		</button>
		{#if winner}
			<b class="text-{winner.color}">{winner.name}</b> es el ganador!
		{/if}

		{#if currentPlayer}
			{#snippet actions()}
				<button class="btn btn-info" onclick={fold}>
					Retirarse
				</button>
			{/snippet}
			<ManagePlayer player={currentPlayer} {actions} />
		{/if}

		<div>
		{#each log as msg}
		{@html msg}<br>
		{/each}
		</div>
	{/if}
</div>
