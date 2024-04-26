<script lang="ts">
import { type Player, type Field, type ActiveUnit, type DamageRoll, type Coordinate, calculateDamage } from "$lib/system";
import FieldGrid from "./FieldGrid.svelte";

let { home, visitor}: {home:Player, visitor:Player} = $props()
function setBattleCoordinates(player:Player) {
	for(let activeUnit of player.field) {
		activeUnit.x = activeUnit.setx
		activeUnit.y = player.mirrored? -activeUnit.sety-1: activeUnit.sety
	}
}
setBattleCoordinates(visitor)
setBattleCoordinates(home)

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

function coordinatesToActiveUnits(field:Field) {
	return (c:Coordinate) => field.find(activeUnit => activeUnit.x==c.x && activeUnit.y==c.y)
}

let calculateDistance = (source:ActiveUnit, target:ActiveUnit) => {
	let distance = Math.sqrt(
		Math.pow(source.x- target.x, 2)+
		Math.pow(source.y- target.y, 2)
	)
	return { target, distance }
}
let targetting:{[key:string]: (c:ActiveUnit, f:Field) => ActiveUnit[]} = {
		random: (_:ActiveUnit, target:Field) => !target.length? []:
			[target[Math.floor(Math.random()*target.length)]]
		,
		everyone: (_:ActiveUnit, target:Field) => target,
		nearby: (attacker:ActiveUnit, target:Field) => {
			let closest = target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0, 2)
			return !closest.length? []: [closest[Math.floor(Math.random()*closest.length)]]
		},
		closest1: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0,1)
		,
		weakest1: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a,b) => (a.target.hp-b.target.hp))
				.map(({target}) => target)
				.slice(0, 1)
		,
		farthest1: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,1)
		, 
		farthest2: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,2)
		, 
		farthest1_direct: (attacker:ActiveUnit, target:Field) => {
			let [farthest1] = targetting.farthest1(attacker, target)
			if(!farthest1) return []
			let blocker = coordinatesBetween(attacker, farthest1)
				.map(coordinatesToActiveUnits(target))
				.filter(x => x)
				.shift()
			return [blocker??farthest1]
		}
}



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
function reset(field:Field) {
	for(let activeUnit of field) {
		activeUnit.hp = activeUnit.unit.hp
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


function Attack(source:Player, activeUnit:ActiveUnit, target:Player) {
	let output:string[] = []
	let damage:DamageRoll = {
			damage:0,
			max:0,
			min:0,
	}
	if(!activeUnit.hp) {
		return {
			output,
			damage,
		}
	}
	let targets = targetting[activeUnit.unit.targetting.id](activeUnit, 
		target.field.filter(activeUnit => activeUnit.hp>0))
	if(!targets) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.activeUnit.unit.name} esta fuera de combate.`)
		return {
			output,
			damage,
		}
	}
	for(let targetUnit of targets) {
		let damage = calculateDamage(activeUnit.unit, targetUnit.unit)
		damage.damage += damage.damage
		damage.max += damage.max
		damage.min += damage.min
		
		output.push(`<span class="text-${source.color}">${activeUnit.unit.name}</span>(${activeUnit.hp}) ataca a <span class="text-${target.color}">${targetUnit.unit.name}</span>(${targetUnit.hp}): <b>${damage.damage}</b>`)
		targetUnit.hp = Math.max(targetUnit.hp-damage.damage, 0)
		if (targetUnit.hp==0) {
			output.push(`* <span class="text-${target.color}">${targetUnit.unit.name}</b></span> <span class="text-warning">ha caido</span>`)
		}
	}
	return {
		output,
		damage
	}
}

interface Turn {
	activeUnit:ActiveUnit,
	source:Player,
	target:Player,
}

type TurnsBySpeed = {[key:string]:Turn[]}
function *createTurnOrder(source:Player, target:Player) {
	let sourceUnits:Turn[] = source.field
		.filter(activeUnit => activeUnit.hp>0)
		.map(activeUnit => ({
			activeUnit, source, target
		}))
	let targetUnits:Turn[] = target.field
		.filter(activeUnit => activeUnit.hp>0)
		.map(activeUnit => ({
			activeUnit, source:target, target: source
		}))

	let splitUnitsBySpeed = (player:Turn[]) => player 
		.reduce((total, u) => {
			if(!total[String(u.activeUnit.unit.movespeed)])
				total[String(u.activeUnit.unit.movespeed)] = []
			total[String(u.activeUnit.unit.movespeed)].push(u)
			return total
		}, {} as TurnsBySpeed)

	let sourceUnitsBySpeed = splitUnitsBySpeed(sourceUnits)
	let targetUnitsBySpeed = splitUnitsBySpeed(targetUnits)

	let allUnitsBySpeed = splitUnitsBySpeed([...sourceUnits, ...targetUnits])
	let speeds = [...Object.keys(allUnitsBySpeed)]
		.map(Number)
		.sort((a,b)=>b-a)
		.map(String)

	for(let speed of speeds) {
		let pop = (turns:TurnsBySpeed) => {
			if(!turns[speed]) return undefined
			return turns[speed].pop()
		}
		while(true) {
			let sourceTurn = pop(sourceUnitsBySpeed)
			if(sourceTurn) yield(sourceTurn)
			let targetTurn = pop(targetUnitsBySpeed)
			if(targetTurn) yield(targetTurn)
			if(!sourceTurn && !targetTurn) break;
		}
	}
}

function combatRound(source:Player, target:Player)  {
	let output = []
	output.push(`<b class="text-${source.color}">${source.name}</b> tiene preferencia.`)
	let turns = createTurnOrder(source, target)

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
		let attack = Attack(turn.source, turn.activeUnit, turn.target)
		if (!attack.damage)
			continue
		total[turn.source.name].dmgmax += attack.damage.max
		total[turn.source.name].dmg += attack.damage.damage
		output.push(...attack.output)
	}
	output.push(`Daño realizado: <b>${source.name}</b>: ${total[source.name].dmg}/${total[source.name].dmgmax}, <b>${target.name}</b>: ${total[target.name].dmg}/${total[target.name].dmgmax}`)
	output.push('')
	return output
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
