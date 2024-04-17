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
		let homeFirst = Math.random()*100>50
		if (homeFirst)
			combatRound(home, visitor)
		else
			combatRound(visitor, home)
	}
	let homeAlive = home.field.filter(champinstance => champinstance.hp>0).length>0
	let visitorAlive = visitor.field.filter(champinstance => champinstance.hp>0).length>0
	if (homeAlive && visitorAlive)
		log.push("It's a tie")
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

function combatRound(player:Player, target:Player) {
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
		let enemy = findEnemy(turn.champinstance, turn.enemy.field)
		if(!enemy) {
			//log.push(`<b>${turn.player.name}</b>: no tiene a quien atacar.`)
			continue;
		}
		let damageRolls = Attack(turn.champinstance.champ, enemy.champ)
		let damage = damageRolls.reduce((total, v) => total+v)
		enemy.hp = Math.max(enemy.hp-damage, 0)

		// general damage calculations/stats
		let dr = enemy.champ.defense
		let dmgmin = Math.max(turn.champinstance.champ.attack-dr,0)
		let dice_thrown = damageRolls.length-1
		let dmg_perthrow = 6-dr
		let dmgmax = dmgmin+(dice_thrown*dmg_perthrow)
		total[turn.player.name].dmgmax += dmgmax
		total[turn.player.name].dmg += damage
		
		if(damage>0) {
			log.push(`<b>${turn.player.name}</b>: ${turn.champinstance.champ.name} ataca ${enemy.champ.name}: ${damageRolls.join('+d')}=${damage}(${dmgmin}-${dmgmax}) (HP: ${enemy.hp})`)
		} else {
			log.push(`<b>${turn.player.name}</b>: ${turn.champinstance.champ.name} ataca a ${enemy.champ.name}, no hace daño.`)
		}
	}
	log.push(`Daño realizado: <b>${player.name}</b>: ${total[player.name].dmg}/${total[player.name].dmgmax}, <b>${target.name}</b>: ${total[target.name].dmg}/${total[target.name].dmgmax}`)
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
				{@html msg}<br>
			{/each}
		</div>
	</div>
</div>
