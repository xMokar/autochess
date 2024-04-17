<script lang="ts">
    import { Attack, type Player, type Field, type ChampInstance } from "$lib/system";
    import ViewField from "./ViewField.svelte";

export let home:Player
export let visitor:Player

function findEnemy(attacker:ChampInstance, targetField:Field) {
	let enemies = targetField
		.filter(target => target.hp>0)
		.map(target => {
			let distance = Math.sqrt(
				Math.pow(attacker.x- (target.x), 2)+
				Math.pow(attacker.y- (-target.y-1), 2)
			)
			return { target, distance }
		})
		.sort((a, b) => a.distance-b.distance)
	if (enemies.length==0)
		return undefined
	return enemies[0].target
}


function run() {
	log = []
	resetAll()
	for(let i=0; i<5; i++) {
		combatRound(home, visitor)
	}
	let homeAlive = home.field.filter(champinstance => champinstance.hp>0).length>0
	let visitorAlive = visitor.field.filter(champinstance => champinstance.hp>0).length>0
	if (homeAlive && visitorAlive)
		log.push("It's a tie")
	else if (homeAlive) 
		log.push(`${home.name} is the winner`)
	else if (visitorAlive)
		log.push(`${visitor.name} is the winner`)
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

function combatRound(player:Player, target:Player) {
	log.push('Ronda de combate...')
	let turns = [...player.field.map(champinstance => ({
		champinstance, player:player, enemy: target
	})), ...target.field.map(champinstance => ({
		champinstance, player:target, enemy: player
	}))]
		.sort((a, b) => b.champinstance.champ.movespeed-a.champinstance.champ.movespeed)

	
	for(let turn of turns) {
		if(turn.champinstance.hp<=0) {
			log.push(`${turn.player.name}: ${turn.champinstance.champ.name} esta fuera de combate.`)
			continue
		}
		let enemy = findEnemy(turn.champinstance, turn.enemy.field)
		if(!enemy) {
			log.push(`${turn.player.name}: no hay objetivos`)
			continue;
		}
		let damageRolls = Attack(turn.champinstance.champ, enemy.champ)
		let damage = damageRolls.reduce((total, v) => total+v)
		enemy.hp = Math.max(enemy.hp-damage, 0)
		if(damage>0) {
			log.push(`${turn.player.name}: ${turn.champinstance.champ.name} ataca ${enemy.champ.name}: ${damageRolls.join('+')}=${damage} (HP: ${enemy.hp})`)
		} else {
			log.push(`${turn.player.name}: ${turn.champinstance.champ.name} ataca a ${enemy.champ.name}, no hace daño.`)
		}
	}
}
let log:string[] = []
reset(home.field)
reset(visitor.field)


</script>

<div class="container">
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
				{msg}<br>
			{/each}
		</div>
	</div>
</div>
