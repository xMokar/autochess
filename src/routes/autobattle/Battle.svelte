<script lang="ts">
import { type Player, type Field, type ActiveUnit, type DamageRoll, calculateDamage } from "$lib/system";
import FieldGrid from "./FieldGrid.svelte";

export let home:Player
export let visitor:Player

function setBattleCoordinates(player:Player) {
	for(let activeUnit of player.field) {
		activeUnit.x = activeUnit.setx
		activeUnit.y = player.mirrored? -activeUnit.sety-1: activeUnit.sety
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
		random: (_:ActiveUnit, target:Field) => {
			if(!target.length)
				return []
			let n = Math.floor(Math.random()*target.length)
			return [target[n]]
		},
		closest1: (attacker:ActiveUnit, target:Field) => {
			return target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0,1)
		},
		farthest1: (attacker:ActiveUnit, target:Field) => {
			return target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,1)
		}, 
		farthest2: (attacker:ActiveUnit, target:Field) => {
			return target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,2)
		}, 
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



let winner = "Nadie"
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
			combatRound(home, visitor)
		else
			combatRound(visitor, home)
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
	if(!activeUnit.hp) {
		return null;
	}
	let targets = targetting[activeUnit.unit.targetting.id](activeUnit, 
		target.field.filter(activeUnit => activeUnit.hp>0))
	if(!targets) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.activeUnit.unit.name} esta fuera de combate.`)
		return null
	}
	let total_damage:DamageRoll = {
			damage:0,
			max:0,
			min:0,
	}
	for(let targetUnit of targets) {
		let damage = calculateDamage(activeUnit.unit, targetUnit.unit)
		total_damage.damage += damage.damage
		total_damage.max += damage.max
		total_damage.min += damage.min
		
		log.push(`<span class="text-${source.color}">${activeUnit.unit.name}</span>(${activeUnit.hp}) ataca a <span class="text-${target.color}">${targetUnit.unit.name}</span>(${targetUnit.hp}): <b>${damage.damage}</b>`)
		targetUnit.hp = Math.max(targetUnit.hp-damage.damage, 0)
		if (targetUnit.hp==0) {
			log.push(`* <span class="text-${target.color}">${targetUnit.unit.name}</b></span> <span class="text-warning">ha caido</span>`)
		}
	}
	return total_damage
}

interface Turn {
	activeUnit:ActiveUnit,
	source:Player,
	target:Player,
}

type TurnBySpeed = {[key:string]:Turn[]}
function *createTurnOrder(source:Player, target:Player) {
	let turns1:Turn[] = source.field
		.filter(activeUnit => activeUnit.hp>0)
		.map(activeUnit => ({
			activeUnit, source, target
		}))
	let turns2:Turn[] = target.field
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
		}, {} as TurnBySpeed)
	let player1bs = splitUnitsBySpeed(turns1)
	let player2bs = splitUnitsBySpeed(turns2)
	let allbs = splitUnitsBySpeed([...turns1, ...turns2])
	let speeds = [...Object.keys(allbs)]
		.map(Number)
		.sort((a,b)=>b-a)
		.map(String)
	for(let speed of speeds) {
		let pop = (playerbs:TurnBySpeed) => {
			if(!playerbs[speed]) return undefined
			return playerbs[speed].pop()
		}
		while(true) {
			let p1t = pop(player1bs)
			if(p1t) yield(p1t)
			let p2t = pop(player2bs)
			if(p2t) yield(p2t)
			if(!p1t && !p2t) break;
		}
	}
}

function combatRound(source:Player, target:Player)  {
	log.push(`<b class="text-${source.color}">${source.name}</b> tiene preferencia.`)
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
		let damage = Attack(turn.source, turn.activeUnit, turn.target)
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
		<button on:click={resetAll} class="btn btn-secondary">Limpiar</button>
		<button on:click={run} class="btn btn-success">Pelear</button>
		<button on:click={run100} class="btn btn-warning">Pelear x100</button>
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
			<FieldGrid player={home} />
</div>
