<script lang="ts">
import { type Player, type Field, type ChampInstance, Champs, ChampMap } from '$lib/system'

export let player:Player
export let mirrored = false

function fieldToArray(field:Field, mirrored:boolean=false) {
	let newfield = Array(9).fill(undefined).map((_, i) => {
		let x = i%3
		let y = Math.floor(i/3)
		return field.find(slot => {
			return (slot.x == x) && (slot.y == y)
		})
	})
	if(!mirrored) return newfield
	return [ ...newfield.slice(6), ...newfield.slice(3,6), ...newfield.slice(0,3)]
}

function remove(champinstance:ChampInstance) {
	return () => {
		player.field=player.field.filter(ci => !(ci.x==champinstance.x && ci.y==champinstance.y))
	}
}

function add(index:number) {
	return (ev:Event) => {
		if(!ev.target)
			return
		let select = ev.target as HTMLSelectElement
		let y = Math.floor(index/3)
		y = mirrored? 2-y: y
		let x = index%3

		let existing = player.field.find(ci => ci.x==x && ci.y==y)
		if(existing && !select.value) {
			player.field=player.field.filter(ci => !(ci.x==x && ci.y==y))
		} if(existing) {
			existing.champ = ChampMap[select.value]
		} else if(!existing) { 
			player.field.push({
				x: x,
				y: y,
				hp: 0,
				champ: ChampMap[select.value]
			})
		}
		player.field = player.field
	}
}

$: isAlive = player.field.filter(champinstance => champinstance.hp>0).length>0
$: status = isAlive? "bg-success": "bg-secondary"
</script>
<div class="card mb-1">
	<div class="card-header {status} text-white">
		{player.name}
		<span class="badge bg-danger position-absolute top-0 end-0">{player.field.reduce((total, v) => total+v.hp, 0)}</span><br>
	</div>

	<div class="card-body p-1"><div class="row gx-1">
{#each fieldToArray(player.field, mirrored) as slot, index (index)}
	<div class="col-4">
		
		<div class="card mb-1">
		<div class="card-header">
		<select on:change={add(index)} value={slot?slot.champ.id:""}>
			<option value="">-</option>
			{#each Champs as champ}
				<option value="{champ.id}">{champ.name}</option>
			{/each}
		</select>
		{#if slot}
		<span class="badge bg-danger position-absolute top-0 end-0">{slot.hp}</span><br>
		{/if}
		
		</div>
		<div class="card-body p-1">

		{#if slot}
		<div class="row">
			<div class="col-6">
				ATK: {slot.champ.attack}
			</div>
			<div class="col-6">
				DEF: {slot.champ.defense}
			</div>
			<div class="col-6">
				SPD: {slot.champ.movespeed}
			</div>
			<div class="col-12">
				ARMOR: <span class="armor {slot.champ.armorType.id}">.</span>
			</div>
			<div class="col-12">
				Dados de ataque:<br>
				{#each Object.entries(slot.champ.armorpen).sort(([_a,a],[_b,b]) => b-a) as [armor, dice]}
					{#each Array(dice) as _}
						<span class="armor {armor}"></span>
					{/each}
				{/each}
			</div>
		</div>


		{:else}
		&nbsp;
		{/if}
		</div></div>
	</div>
{/each}
</div>
</div>
</div>

