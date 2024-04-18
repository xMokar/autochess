<script lang="ts">
    import { type Player, type Field, type ChampInstance, type Champ, Champs } from "$lib/system";
    import ViewField from "./ViewField.svelte";

export let home:Player
export let visitor:Player

function findTarget(attacker:ChampInstance, target:Field) {
	let targets = target
		.filter(target => target.hp>0)
		.map(target => {
			let distance = Math.sqrt(
				Math.pow(attacker.x- (target.x), 2)+
				Math.pow(attacker.y- (-target.y-1), 2)
			)
			return { target, distance }
		})
		.sort((a, b) => a.distance-b.distance)
	if (targets.length==0)
		return undefined
	return targets[0].target
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

function AttackRolls(attacker:Champ, defender:Champ, sides:number) {
	if(!sides)
		return [0]
	let roll = () => Math.max(Math.floor(Math.random()*sides)+1, 0)
	let rolls = Object.entries(attacker.armorpen)
		.filter(([target, _]) => defender.armorType.id == target)
		.flatMap(([_, dice]) => Array(dice).fill(0).map(roll))
		
	return rolls
}

interface DamageRoll {
	rolls:number[],
	total:number,
	sides:number,
	max:number
}
function calculateDamage(source:Champ, target:Champ) {
	let sides = Math.max(source.attack-target.defense,0)
	let rolls = AttackRolls(source, target, sides)
	let total = rolls.reduce((total, v) => total+v)
	let num_dice = rolls.length
	let max = num_dice*sides

	return {
		rolls,
		total,
		sides,
		max
	} as DamageRoll
}

function Attack(source:Player, champinstance:ChampInstance, target:Player) {
	if(champinstance.hp<=0) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.champinstance.champ.name} esta fuera de combate.`)
		return null
	}
	let targetChampInstance = findTarget(champinstance, target.field)
	if(!targetChampInstance) {
		//log.push(`<b>${turn.player.name}</b>: no tiene a quien atacar.`)
		return null
	}
	let damage = calculateDamage(champinstance.champ, targetChampInstance.champ)
	
	log.push(`<b>${source.name}</b>: ${champinstance.champ.name} ataca a ${targetChampInstance.champ.name}(HP: ${targetChampInstance.hp}): (${damage.rolls.length}d${damage.sides}) ${damage.rolls.join('+')}=<b>${damage.total}</b>`)
	targetChampInstance.hp = Math.max(targetChampInstance.hp-damage.total, 0)
	if (targetChampInstance.hp==0) {
		log.push(`* ${targetChampInstance.champ.name} de <b>${target.name}</b> ha caido`)
	}
	return damage
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
			<hr>
			Tabla de balance de daño:<br>
			{#each Champs as source}
				{#each Champs as target}
					{@const damage = calculateDamage(source, target)}
					{source.name}->{target.name}: {damage.rolls.length}d{damage.sides}({damage.rolls.length}-{damage.max}) (promedio: {(damage.rolls.length+damage.max)/2})<br>
				{/each}
				<br>
			{/each}

		</div>
	</div>
</div>
