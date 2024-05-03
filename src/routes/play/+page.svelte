<script lang="ts">
    import { goto } from "$app/navigation";
	import { Units, type Unit, type Player } from "$lib/system";
    import Manage from "./Manage.svelte";
    import SelectPlayer from "./SelectPlayer.svelte";
    import Shop from "./Shop.svelte";

let player1 = $state({ 
			id: 'player1',
			name: 'Azul',
			mirrored: false,
			color: 'primary',
			finished: false,
			maxgold: 5,
			gold: 6,
			rolls: 2,
			hand: [],
			field: [ ],
		} as Player)
let player2 = $state({
			id: 'player2',
			name: 'Rojo',
			mirrored: true,
			color: 'danger',
			finished: false,
			maxgold: 5,
			gold: 6,
			rolls: 2,
			hand: [],
			field: []
		} as Player
)
let players:Player[] = [player1, player2]
let newDeck = Units
	.flatMap(unit => Array(5).fill(unit))
	.map((unit,index) => ({...unit, index}) as Unit)


let shuffle = (deck:Unit[]) => deck
	.map(unit => ({ unit, order: Math.random()*deck.length }))
	.sort((a, b) => b.order-a.order)
	.map(({unit}) => unit)

let deck = $state(shuffle(newDeck))

let endTurn = () => {
		if(!currentPlayer) return
		currentPlayer.finished = true
		currentPlayer = undefined
		if(players.find(player=>!player.finished)) {
			mode="selectplayer"
		} else {
			mode="manage"
		}

		
}
let mode= $state("selectplayer")
let currentPlayer:Player|undefined = $state(undefined)

let resetPlayer = (player:Player) => {
	player.finished = false
	player.rolls = 2
	player.gold = 6
	deck.push(...player.hand)
	deck.push(...player.field.map(au => au.unit))
	console.log(`${player.name}: returning ${player.hand.length} cards from hand, ${player.field.length} cards on the field`)
	console.log(`Deck size: ${deck.length}`)
	player.hand = []
	player.field = []
}
let onfold = () => {
	if(!currentPlayer) return
	deck.push(...currentPlayer.hand)
	resetPlayer(currentPlayer)
	currentPlayer = undefined
	mode = "shop"
}
let restart = () => {
	for(let player of players) {
		resetPlayer(player)
	}
		
	mode = "selectplayer"	
	currentPlayer = undefined
	goto("/play")
		
}
</script>

<div class="container mt-2">
	<a href="/" class="btn btn-primary">Guía del juego</a>
	<button onclick={restart} class="btn btn-secondary">Reiniciar</button>
	{#if mode=="selectplayer"}
		<SelectPlayer {players} onselect={(player) => {
			currentPlayer = player
			mode = "shop"
		}} />
	{:else if currentPlayer && mode=="shop"}
		<Shop bind:deck={deck} bind:player={currentPlayer} onend={endTurn} />
	{:else if mode=="manage"}
		<Manage {players} {onfold} />
	{/if}
</div>
