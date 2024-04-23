<script lang="ts">
    import { type Player, type Field, type UnitInstance, type DamageRoll, calculateDamage } from "$lib/system";
    import FieldGrid from "./FieldGrid.svelte";

export let home:Player
export let visitor:Player

function setBattleCoordinates(player:Player) {
	for(let unitinstance of player.field) {
		unitinstance.x = unitinstance.setx
		unitinstance.y = player.mirrored? -unitinstance.sety-1: unitinstance.sety
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

function coordinatesToUnitInstances(field:Field) {
	return (c:Coordinate) => field.find(unitinstance => unitinstance.x==c.x && unitinstance.y==c.y)
}

let calculateDistance = (source:UnitInstance, target:UnitInstance) => {
	let distance = Math.sqrt(
		Math.pow(source.x- target.x, 2)+
		Math.pow(source.y- target.y, 2)
	)
	return { target, distance }
}
let targetting:{[key:string]: (c:UnitInstance, f:Field) => UnitInstance[]} = {
		random: (_:UnitInstance, target:Field) => {
			let n = Math.floor(Math.random()*target.length)
			return [target[n]]
		},
		closest1: (attacker:UnitInstance, target:Field) => {
			return target
				.filter(target => target.hp>0)
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0,1)
		},
		farthest1: (attacker:UnitInstance, target:Field) => {
			return target
				.filter(target => target.hp>0)
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,1)
		}, 
		farthest2: (attacker:UnitInstance, target:Field) => {
			return target
				.filter(target => target.hp>0)
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,2)
		}, 
		farthest1_direct: (attacker:UnitInstance, target:Field) => {
			let [farthest1] = targetting.farthest1(attacker, target)
			if(!farthest1) return []
			let blocker = coordinatesBetween(attacker, farthest1)
				.map(coordinatesToUnitInstances(target))
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
	let homeAlive = home.field.filter(unitinstance => unitinstance.hp>0).length>0
	let visitorAlive = visitor.field.filter(unitinstance => unitinstance.hp>0).length>0
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
	for(let unitinstance of field) {
		unitinstance.hp = unitinstance.unit.hp
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


function Attack(source:Player, unitinstance:UnitInstance, target:Player) {
	if(unitinstance.hp<=0) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.unitinstance.unit.name} esta fuera de combate.`)
		return null
	}
	let targets = targetting[unitinstance.unit.targetting.id](unitinstance, target.field)
	let total_damage:DamageRoll = {
			sides:0,
			damage:0,
			max:0,
			min:0,
	}
	for(let targetUnitInstance of targets) {
		let damage = calculateDamage(unitinstance.unit, targetUnitInstance.unit)
		total_damage.damage += damage.damage
		total_damage.max += damage.max
		total_damage.min += damage.min
		
		log.push(`<span class="text-${source.color}">${unitinstance.unit.name}</span> ataca a <span class="text-${target.color}">${targetUnitInstance.unit.name}</span>(HP: ${targetUnitInstance.hp}): <b>${damage.damage}</b>`)
		targetUnitInstance.hp = Math.max(targetUnitInstance.hp-damage.damage, 0)
		if (targetUnitInstance.hp==0) {
			log.push(`* <span class="text-${target.color}">${targetUnitInstance.unit.name}</b></span> <span class="text-warning">ha caido</span>`)
		}
	}
	return total_damage
}

interface Turn {
	unitinstance:UnitInstance,
	source:Player,
	target:Player,
}

function combatRound(source:Player, target:Player)  {
	log.push(`<b class="text-${source.color}">${source.name}</b> tiene preferencia.`)
	let turns:Turn[] = [...source.field.map(unitinstance => ({
		unitinstance, source, target
	})), ...target.field.map(unitinstance => ({
		unitinstance, source:target, target: source
	}))]
		.sort((a, b) => b.unitinstance.unit.movespeed-a.unitinstance.unit.movespeed)

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
		let damage = Attack(turn.source, turn.unitinstance, turn.target)
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
