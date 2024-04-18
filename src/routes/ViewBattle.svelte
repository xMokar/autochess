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

function Attack(attacker:Champ, defender:Champ, sides:number) {
	if(!sides)
		return [0]
	let roll=() => Math.max(((Math.floor(Math.random()*sides)))+1, 0)
	let rolls = Object.entries(attacker.armorpen)
		.filter(([target, _]) => defender.armorType.id == target)
		.flatMap(([_, dice]) => Array(dice).fill(0).map(roll))
		
	return rolls
}

function calculateDamage(source:Champ, target:Champ) {
		let sides = Math.max(source.attack-target.defense,0)
		let rolls = Attack(source, target, sides)
		let total = rolls.reduce((total, v) => total+v)
		let num_dice = rolls.length
		let max = num_dice*sides

		return {
			rolls,
			total,
			sides,
			max
		}

}
function combatRound(player:Player, target:Player)  {
	log.push('')
	log.push(`Ronda de combate,  se tiró un moneda... <b>${player.name}</b> empieza.`)
	let turns = [...player.field.map(champinstance => ({
		champinstance, player:player, enemy: target
	})), ...target.field.map(champinstance => ({
		champinstance, player:target, enemy: player
	}))]
		.sort((a, b) => b.champinstance.champ.movespeed-a.champinstance.champ.movespeed)

	let total = {
		[player.name]: {
				dmgmax: 0,
				dmg: 0,
			},
		[target.name]: {
				dmgmax: 0,
				dmg: 0,
			}
	}
	
	for(let turn of turns) {
		if(turn.champinstance.hp<=0) {
			//log.push(`<b>${turn.player.name}</b>: ${turn.champinstance.champ.name} esta fuera de combate.`)
			continue
		}
		let enemy = findTarget(turn.champinstance, turn.enemy.field)
		if(!enemy) {
			//log.push(`<b>${turn.player.name}</b>: no tiene a quien atacar.`)
			continue;
		}
		let damage = calculateDamage(turn.champinstance.champ, enemy.champ)
		total[turn.player.name].dmgmax += damage.max
		total[turn.player.name].dmg += damage.total
		
		log.push(`<b>${turn.player.name}</b>: ${turn.champinstance.champ.name} ataca a ${enemy.champ.name}(HP: ${enemy.hp}): (${damage.rolls.length}d${damage.sides}) ${damage.rolls.join('+')}=<b>${damage.total}</b>`)
		enemy.hp = Math.max(enemy.hp-damage.total, 0)
	}
	log.push(`Daño realizado: <b>${player.name}</b>: ${total[player.name].dmg}/${total[player.name].dmgmax}, <b>${target.name}</b>: ${total[target.name].dmg}/${total[target.name].dmgmax}`)
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
					{source.name}->{target.name}: {damage.sides}-{damage.max} (promedio: {(damage.sides+damage.max)/2})<br>
				{/each}
				<br>
			{/each}

		</div>
	</div>
</div>
