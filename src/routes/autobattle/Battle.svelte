<script lang="ts">
    import { initBattle, combatRound } from "$lib/combat";
import { type Player, type Field } from "$lib/system";
import FieldGrid from "./FieldGrid.svelte";

let { home, visitor}: {home:Player, visitor:Player} = $props()

initBattle(home, visitor)

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
	resetCombat()
	for(let i=0; i<5; i++) {
		let homeFirst = Math.random()*100>50
		if (homeFirst)
			log.push(...combatRound(home, visitor))
		else
			log.push(...combatRound(visitor, home))
	}
	let homeAlive = home.field.filter(activeUnit => activeUnit.hp>0).length>0
	let visitorAlive = visitor.field.filter(activeUnit => activeUnit.hp>0).length>0
	stats.combats++
	if (homeAlive && visitorAlive) {
		log.push("Empate!")
		winner = 'Nadie'
	} else if (homeAlive) {
		stats.victories.home++
		log.push(`${home.name} es el ganador`)
		winner = `<b class="text-${home.color}">${home.name}</b>`
	} else if (visitorAlive) {
		stats.victories.visitor++
		log.push(`${visitor.name} es el ganador`)
		winner = `<b class="text-${visitor.color}">${visitor.name}</b>`
	}
	log = log
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

</script>

<div class="container mt-2">
	<div class="mb-2">
		<a class="btn btn-primary" href="/">Guía del juego</a>
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
			<FieldGrid player={visitor} mirrored={true} />
			<FieldGrid player={home} mirrored={false} />
</div>
