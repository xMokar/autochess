<script lang="ts">
    import { goto } from "$app/navigation";
	import { type Unit, type Player } from "$lib/system";
    import Manage from "./Manage.svelte";
    import SelectPlayer from "./SelectPlayer.svelte";
    import Shop from "./Shop.svelte";

let player1 = $state({ 
			id: 'player1',
			name: 'Azul',
			hp: 3,
			mirrored: false,
			color: 'primary',
			finished: false,
			maxgold: 5,
			gold: 10,
			rolls: 2,
			hand: [],
			field: [ ],
		} as Player)
let player2 = $state({
			id: 'player2',
			name: 'Rojo',
			hp: 3,
			mirrored: true,
			color: 'danger',
			finished: false,
			maxgold: 5,
			gold: 10,
			rolls: 2,
			hand: [],
			field: []
		} as Player
)
let players:Player[] = $state([player1, player2])

let mode= $state("selectplayer")
let currentPlayerIndex:number|undefined = $state(undefined)
let currentPlayer:Player|undefined = $derived(currentPlayerIndex==undefined? 
		undefined: 
		players[currentPlayerIndex])

let resetPlayer = (player:Player) => {
	player.finished = false
	player.hp = 3
	player.rolls = 2
	player.gold = 10
	player.hand = []
	player.field = []
}
let onfold = () => {
	if(!currentPlayer) return
	resetPlayer(currentPlayer)
	currentPlayerIndex = undefined
	mode = "shop"
}
let onrestart = () => {
	for(let player of players) {
		resetPlayer(player)
	}
		
	mode = "selectplayer"	
	currentPlayerIndex = undefined
	goto("/play")
		
}

let onstart = (player:Player) => {
	let index = players.findIndex(p => p.id==player.id)
	players = [...players.slice(index), ...players.slice(0, index)]
	currentPlayerIndex = 0
	mode = "shop"
}

let onroll = (player:Player) => {
	player.rolls--
	player.gold -= 2
}
let onbuy = (player:Player, unit:Unit) => {
	player.gold--
	player.hand.push(unit)
}
let oncontinue = () => {
		if(currentPlayerIndex===players.length-1 || currentPlayerIndex===undefined)
			currentPlayerIndex = 0
		else {
			let index = currentPlayerIndex+1
			while(index<players.length && players[index].hp<=0) 
				index++
			if(index<players.length && players[index].hp>0)
				currentPlayerIndex = index
			else 
				currentPlayerIndex = undefined
		}
		
		if(currentPlayer===undefined)
			return

		if(currentPlayer.rolls==0) {
			mode="manage"
			return
		}
}
let colors = [ "none", "primary", "danger", "warning", "info", "success", "secondary", "dark", "$indigo-200" ]
let onnewplayer = () => {
	let id = players.length+1
	players.push({
			id: 'player'+id,
			name: 'Player'+id,
			hp: 3,
			mirrored: false,
			color: colors[id],
			finished: false,
			maxgold: 5,
			gold: 10,
			rolls: 2,
			hand: [],
			field: []
	})
}
let onremoveplayer = (player:Player) => {
	players = players.filter(p => player.id!=p.id)
}
let ondamage = (player:Player, amount:number) => {
	player.hp-=amount
}
let onendcombat = () => {
	mode="shop"
	currentPlayerIndex = 0
	for(let player of players) {
		if(player.hp<=0) continue
		player.rolls=1
		player.gold+=4
	}
}
</script>

<div class="container mt-2">
	<a href="/" class="btn btn-primary">Guía del juego</a>
	<button onclick={onrestart} class="btn btn-secondary">Reiniciar</button>
	{#if mode=="selectplayer"}
		<SelectPlayer {players} onselect={onstart} {onnewplayer} {onremoveplayer} />
	{:else if currentPlayer && mode=="shop"}
		<Shop player={currentPlayer} {oncontinue} {onroll} {onbuy} />
	{:else if mode=="manage"}
		<Manage {players} {onfold} {ondamage} {onendcombat} />
	{/if}
</div>
