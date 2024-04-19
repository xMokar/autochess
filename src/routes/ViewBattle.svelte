<script lang="ts">
    import { type Player, type Field, type ChampInstance, type DamageRoll, calculateDamage } from "$lib/system";
    import ViewField from "./ViewField.svelte";

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
		farthest3: (attacker:ChampInstance, target:Field) => {
			return target
				.filter(target => target.hp>0)
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,3)
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
	resetAll()
	for(let i=0; i<5; i++) {
		let homeFirst = Math.random()*100>50
		if (homeFirst)
			combatRound(home, visitor)
		else
			combatRound(visitor, home)
	}
	let homeAlive = home.field.filter(champinstance => champinstance.hp>0).length>0
	let visitorAlive = visitor.field.filter(champinstance => champinstance.hp>0).length>0
	if (homeAlive && visitorAlive)
		log.push("Empate!")
	else if (homeAlive) 
		log.push(`${home.name} es el ganador`)
	else if (visitorAlive)
		log.push(`${visitor.name} es el ganador`)
	log = log
	home = home
	visitor = visitor
}
function reset(field:Field) {
	for(let champinstance of field) {
		champinstance.hp = champinstance.champ.hp
	}
}
function resetAll() {
	reset(home.field)
	reset(visitor.field)
	home = home
	visitor = visitor
	log = []
}


function Attack(source:Player, champinstance:ChampInstance, target:Player) {
	if(champinstance.hp<=0) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.champinstance.champ.name} esta fuera de combate.`)
		return null
	}
	let targets = targetting[champinstance.champ.targetting.id](champinstance, target.field)
	let total_damage:DamageRoll = {
			sides:0,
			rolls:[],
			total:0,
			max:0,
	}
	for(let targetChampInstance of targets) {
		let damage = calculateDamage(champinstance.champ, targetChampInstance.champ)
		total_damage.rolls.push(...damage.rolls)
		total_damage.total += damage.total
		total_damage.max += damage.max
		
		log.push(`<b>${source.name}</b>: ${champinstance.champ.name} ataca a ${targetChampInstance.champ.name}(HP: ${targetChampInstance.hp}): (${damage.rolls.length}d${damage.sides}) ${damage.rolls.join('+')}=<b>${damage.total}</b>`)
		targetChampInstance.hp = Math.max(targetChampInstance.hp-damage.total, 0)
		if (targetChampInstance.hp==0) {
			log.push(`* ${targetChampInstance.champ.name} de <b>${target.name}</b> ha caido`)
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
	log.push('')
	log.push(`Ronda de combate,  se tiró un moneda... <b>${source.name}</b> empieza.`)
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
		total[turn.source.name].dmg += damage.total
	}
	log.push(`Daño realizado: <b>${source.name}</b>: ${total[source.name].dmg}/${total[source.name].dmgmax}, <b>${target.name}</b>: ${total[target.name].dmg}/${total[target.name].dmgmax}`)
}
let log:string[] = []

</script>

<div class="container mt-2">
	<a href="/help">Help!</a>
	<div class="row">
		<div class="col-6">
			<ViewField player={visitor} mirrored={true} />
			<ViewField player={home} />
		</div>
		<div class="col-6">
			<button on:click={run} class="btn btn-primary">Pelear</button>
			<button on:click={resetAll} class="btn btn-secondary">Reiniciar</button>
			<br>
			{#each log as msg}
				{@html msg}<br>
			{/each}
		</div>
	</div>
</div>
