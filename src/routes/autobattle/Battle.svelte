<script lang="ts">
    import { type Player, type Field, type ChampInstance, type DamageRoll, calculateDamage } from "$lib/system";
    import FieldGrid from "./FieldGrid.svelte";

export let home:Player
export let visitor:Player

function setBattleCoordinates(player:Player) {
	for(let ci of player.field) {
		ci.x = ci.setx
		ci.y = player.mirrored? -ci.sety-1: ci.sety
	}
}
setBattleCoordinates(visitor)
setBattleCoordinates(home)

interface Coordinate {
	x: number;
	y: number;
}
function coordinatesBetween(point1:Coordinate, point2:Coordinate) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    
    // Calculate the number of points to interpolate (including both endpoints)
    const numPoints = Math.max(Math.abs(dx), Math.abs(dy));
	let coordinates = Array(numPoints).fill(null).map((_, i) => {
        const x = Math.round(point1.x + i * (dx / numPoints));
        const y = Math.round(point1.y + i * (dy / numPoints));
        return { x, y };
    })
	return coordinates.slice(1)
}

function coordinatesToChampInstances(field:Field) {
	return (c:Coordinate) => field.find(ci => ci.x==c.x && ci.y==c.y)
}

let calculateDistance = (source:ChampInstance, target:ChampInstance) => {
	let distance = Math.sqrt(
		Math.pow(source.x- target.x, 2)+
		Math.pow(source.y- target.y, 2)
	)
	return { target, distance }
}
let targetting:{[key:string]: (c:ChampInstance, f:Field) => ChampInstance[]} = {
		random: (_:ChampInstance, target:Field) => {
			let n = Math.floor(Math.random()*target.length)
			return [target[n]]
		},
		closest1: (attacker:ChampInstance, target:Field) => {
			return target
				.filter(target => target.hp>0)
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0,1)
		},
		farthest1: (attacker:ChampInstance, target:Field) => {
			return target
				.filter(target => target.hp>0)
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,1)
		}, 
		farthest2: (attacker:ChampInstance, target:Field) => {
			return target
				.filter(target => target.hp>0)
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,2)
		}, 
		farthest1_direct: (attacker:ChampInstance, target:Field) => {
			let [farthest1] = targetting.farthest1(attacker, target)
			if(!farthest1) return []
			let blocker = coordinatesBetween(attacker, farthest1)
				.map(coordinatesToChampInstances(target))
				.filter(x => x)
				.shift()
			if (blocker)
				return [blocker]

			return [blocker? blocker: farthest1]
		}
}



function run() {
	log = []
	resetCombat()
	for(let i=0; i<5; i++) {
		let homeFirst = Math.random()*100>50
		if (homeFirst)
			combatRound(home, visitor)
		else
			combatRound(visitor, home)
	}
	let homeAlive = home.field.filter(champinstance => champinstance.hp>0).length>0
	let visitorAlive = visitor.field.filter(champinstance => champinstance.hp>0).length>0
	stats.combats++
	if (homeAlive && visitorAlive)
		log.push("Empate!")
	else if (homeAlive) {
		stats.victories.home++
		log.push(`${home.name} es el ganador`)
	} else if (visitorAlive) {
		stats.victories.visitor++
		log.push(`${visitor.name} es el ganador`)
	}
	log = log
	home = home
	visitor = visitor
}
function reset(field:Field) {
	for(let champinstance of field) {
		champinstance.hp = champinstance.champ.hp
	}
}
function resetCombat() {
	reset(home.field)
	reset(visitor.field)
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


function Attack(source:Player, champinstance:ChampInstance, target:Player) {
	if(champinstance.hp<=0) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.champinstance.champ.name} esta fuera de combate.`)
		return null
	}
	let targets = targetting[champinstance.champ.targetting.id](champinstance, target.field)
	let total_damage:DamageRoll = {
			sides:0,
			damage:0,
			max:0,
			min:0,
	}
	for(let targetChampInstance of targets) {
		let damage = calculateDamage(champinstance.champ, targetChampInstance.champ)
		total_damage.damage += damage.damage
		total_damage.max += damage.max
		total_damage.min += damage.min
		
		log.push(`<span class="text-${source.color}">${champinstance.champ.name}</span> ataca a <span class="text-${target.color}">${targetChampInstance.champ.name}</span>(HP: ${targetChampInstance.hp}): <b>${damage.damage}</b>`)
		targetChampInstance.hp = Math.max(targetChampInstance.hp-damage.damage, 0)
		if (targetChampInstance.hp==0) {
			log.push(`* <span class="text-${target.color}">${targetChampInstance.champ.name}</b></span> <span class="text-warning">ha caido</span>`)
		}
	}
	return total_damage
}

interface Turn {
	champinstance:ChampInstance,
	source:Player,
	target:Player,
}

function combatRound(source:Player, target:Player)  {
	log.push(`<b class="text-${source.color}">${source.name}</b> tiene preferencia.`)
	let turns:Turn[] = [...source.field.map(champinstance => ({
		champinstance, source, target
	})), ...target.field.map(champinstance => ({
		champinstance, source:target, target: source
	}))]
		.sort((a, b) => b.champinstance.champ.movespeed-a.champinstance.champ.movespeed)

	let total = {
		[source.name]: {
			dmgmax: 0,
			dmg: 0,
		},
		[target.name]: {
			dmgmax: 0,
			dmg: 0,
		}
	}
	
	for(let turn of turns) {
		let damage = Attack(turn.source, turn.champinstance, turn.target)
		if (!damage)
			continue
		total[turn.source.name].dmgmax += damage.max
		total[turn.source.name].dmg += damage.damage
	}
	log.push(`Daño realizado: <b>${source.name}</b>: ${total[source.name].dmg}/${total[source.name].dmgmax}, <b>${target.name}</b>: ${total[target.name].dmg}/${total[target.name].dmgmax}`)
	log.push('')
}
let log:string[] = []
let stats = {
	combats: 0,
	victories: {
		home: 0,
		visitor: 0,
	}
}

</script>

<div class="container mt-2">
	<div class="mb-2">
		<a class="btn btn-primary" href="/">Guía del juego</a>
		<button on:click={run} class="btn btn-success">Pelear</button>
		<button on:click={resetAll} class="btn btn-secondary">Limpiar</button>
	</div>

	<div>
		<b>Estadisticas: </b>
		Combates: {stats.combats} 
		Victorias de <span class="text-{home.color}">{home.name}</span>:{stats.victories.home} 
			({Math.round(stats.victories.home/stats.combats*100)}%)
		Victorias de <span class="text-{visitor.color}">{visitor.name}</span>:{stats.victories.visitor} 
			({Math.round(stats.victories.visitor/stats.combats*100)}%)<br>
		{#each log as msg}
			{@html msg}<br>
		{/each}
	</div>
			<FieldGrid player={visitor} mirrored={true} />
			<FieldGrid player={home} />
</div>
