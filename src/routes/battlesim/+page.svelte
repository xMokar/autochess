<script lang="ts">
import { initBattle, fight, createBoardUnit } from "$lib/combat";
import { getPlayers } from "$lib/state";
import { UnitMap, updatePlayerTraits } from "$lib/database";
import BoardGrid from "./BoardGrid.svelte";

let [ _player1, _player2 ] = getPlayers()
let home = $state(_player1)
let visitor = $state(_player2)
$effect(() => {
	initBattle(home, visitor)
})

let winner = $state("Nadie")
function run100() {
	resetStats()
	for(let i=0; i<100; i++) {
		run()
	}
	if (stats.victories.home>stats.victories.visitor) {
		winner = `<b class="text-${home.color}">${home.name}</b>`
	} else if (stats.victories.home<stats.victories.visitor) {
		winner = `<b class="text-${visitor.color}">${visitor.name}</b>`
	} else {
		winner = "Nadie"
	}
}

function run() {
	log = []
	let result = fight(home, visitor)
	if(!result.winner) 
		winner = "Nadie"
	else {
		winner = `<b class="text-${result.winner.color}">${result.winner.name}</b>`
		if (result.winner == home) stats.victories.home++
		else if(result.winner == visitor) stats.victories.visitor++
	}
	stats.combats++
	log = result.log
	home = home
	visitor = visitor
}
function resetCombat() {
	initBattle(home, visitor)
	home = home
	visitor = visitor
	log = []
}

function resetAll() {
	resetCombat()
	resetStats()
}
function resetStats() {
	stats.combats = 0 
	stats.victories.home = 0 
	stats.victories.visitor = 0 
}


let log:string[] = $state([])
let stats = $state({
	combats: 0,
	victories: {
		home: 0,
		visitor: 0,
	}
})

let onRemoveUnit = (player:Player, c:Coordinate) => {
	player.board=player.board.filter(i => !(i.setx==c.x && i.sety==c.y))
	updatePlayerTraits(player)
}
let onAddUnit = (player:Player, c:Coordinate, value:string) => {
	if(!value) {
		return;
	}
	player.board.push(createBoardUnit(UnitMap[value], c))
	updatePlayerTraits(player)
	console.log(player)
}
</script>

<div class="container mt-2">
	<div class="mb-2">
		<a class="btn btn-primary" href="/">Regresar</a>
		<button onclick={resetAll} class="btn btn-secondary">Limpiar</button>
		<button onclick={run} class="btn btn-success">Pelear</button>
		<button onclick={run100} class="btn btn-warning">Pelear x100</button>
		{@html winner} ganó!
	</div>

	<div>
		<b>Estadisticas: </b>
		Combates: {stats.combats}<br>
		Victorias de <span class="text-{home.color}">{home.name}</span>: {stats.victories.home} 
			({Math.round(stats.victories.home/stats.combats*100)}%)<br>
		Victorias de <span class="text-{visitor.color}">{visitor.name}</span>: {stats.victories.visitor} 
			({Math.round(stats.victories.visitor/stats.combats*100)}%)<br>
		<br>
		{#each log as msg}
			{@html msg}<br>
		{/each}
	</div>
			<BoardGrid player={visitor} mirrored={true} {onAddUnit} {onRemoveUnit} />
			<BoardGrid player={home} mirrored={false} {onAddUnit} {onRemoveUnit}  />
</div>
