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

let mode= $state("selectplayer")
let currentPlayer:Player|undefined = $state(undefined)

let resetPlayer = (player:Player) => {
	player.finished = false
	player.rolls = 2
	player.gold = 6
	player.hand = []
	player.field = []
}
let onfold = () => {
	if(!currentPlayer) return
	resetPlayer(currentPlayer)
	currentPlayer = undefined
	mode = "shop"
}
let onrestart = () => {
	for(let player of players) {
		resetPlayer(player)
	}
		
	mode = "selectplayer"	
	currentPlayer = undefined
	goto("/play")
		
}

let onstart = (player:Player) => {
	currentPlayer = player
	mode = "shop"
}

let onroll = (player:Player) => {
	player.rolls--
}
let onbuy = (player:Player, unit:Unit) => {
	player.gold--
	player.hand.push(unit)
}
let oncontinue = () => {
		currentPlayer = players.find(player => player.name != currentPlayer?.name)
		if(currentPlayer===undefined)
			return

		if(currentPlayer.rolls==0) {
			mode="manage"
			return
		}
}
</script>

<div class="container mt-2">
	<a href="/" class="btn btn-primary">Guía del juego</a>
	<button onclick={onrestart} class="btn btn-secondary">Reiniciar</button>
	{#if mode=="selectplayer"}
		<SelectPlayer {players} onselect={onstart} />
	{:else if currentPlayer && mode=="shop"}
		<Shop player={currentPlayer} {oncontinue} {onroll} {onbuy} />
	{:else if mode=="manage"}
		<Manage {players} {onfold} />
	{/if}
</div>
