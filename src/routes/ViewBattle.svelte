<script lang="ts">
    import { Attack, type Player, type Field, type FieldSlot } from "$lib/cards";
    import ViewField from "./ViewField.svelte";

export let home:Player
export let visitor:Player

function findEnemy(attacker:FieldSlot, targetField:Field) {
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


function reset(field:Field) {
	for(let slot of field) {
		slot.hp = slot.champ.hp
	}
}

function calculate(player:Player, target:Player) {
	console.log('Combat round...')
	let field = [...player.field.map(slot => ({
		slot, player:player, enemy: target
	})), ...target.field.map(slot => ({
		slot, player:target, enemy: player
	}))]
		.sort((a, b) => b.slot.champ.movespeed-a.slot.champ.movespeed)

	for(let fieldslot of field) {
		if(fieldslot.slot.hp<=0) {
			console.log(fieldslot.player.name, ':', fieldslot.slot.champ.name, 'is out of combat.')
			continue
		}
		let enemy = findEnemy(fieldslot.slot, fieldslot.enemy.field)
		if(!enemy) {
				console.log(fieldslot.player.name, ': no enemy found')
				continue;
		}
		let damage = Attack(fieldslot.slot.champ, enemy.champ)
		enemy.hp -= damage
		if (enemy.hp<0) enemy.hp = 0
		console.log(fieldslot.player.name, ':', fieldslot.slot.champ.name, 'attacks', enemy.champ.name, 'for', damage, 'HP, his HP is now ', enemy.hp)
	}

}
reset(home.field)
reset(visitor.field)
for(let i = 0; i < 5; i++) {
	calculate(home, visitor)
}

let homeAlive = home.field.filter(slot => slot.hp>0).length>0
let visitorAlive = visitor.field.filter(slot => slot.hp>0).length>0

let winner = ""
if (homeAlive && visitorAlive)
	winner = "TIE"
else if (homeAlive) 
	winner = "HOME"
else if (visitorAlive)
	winner = "VISITOR"
else
	winner = "???"
</script>

<div class="container">
	Winner: {winner}
	<ViewField player={visitor} mirrored={true} />
	<hr>
	<ViewField player={home} />
</div>
