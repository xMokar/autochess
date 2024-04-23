<script lang="ts">
import { type Player, type Field, type UnitInstance, Units, UnitMap } from '$lib/system'
    import UnitCard from '$lib/UnitCard.svelte';

export let player:Player
export let mirrored = false

function fieldToArray(field:Field, mirrored:boolean=false) {
	let newfield = Array(9).fill(undefined).map((_, i) => {
		let x = i%3
		let y = Math.floor(i/3)
		return field.find(unitinstance => {
			return (unitinstance.setx == x) && (unitinstance.sety == y)
		})
	})
	if(!mirrored) return newfield
	return [ ...newfield.slice(6), ...newfield.slice(3,6), ...newfield.slice(0,3)]
}

function remove(unitinstance:UnitInstance) {
	return () => {
		player.field=player.field.filter(i => !(i.x==unitinstance.x && i.y==unitinstance.y))
	}
}

function add(index:number) {
	return (ev:Event) => {
		if(!ev.target)
			return
		let select = ev.target as HTMLSelectElement
		let y = Math.floor(index/3)
		let mirroredy = mirrored? 2-y: y
		let x = index%3

		let existing = player.field.find(i => i.setx==x && i.sety==mirroredy)
		if(existing && !select.value) {
			player.field=player.field.filter(i => !(i.setx==x && i.sety==mirroredy))
		} if(existing) {
			existing.unit = UnitMap[select.value]
		} else if(!existing) { 
			player.field.push({
				setx: x,
				sety: mirroredy,
				x,
				y:mirrored?-(3-y):y,
				hp: 0,
				unit: UnitMap[select.value]
			})
		}
		player.field = player.field
		localStorage.setItem(player.id, JSON.stringify(player))
	}
}

console.log('xxx', player.field)
$: isAlive = player.field.filter(unitinstance => unitinstance.hp>0).length>0
$: status = isAlive? "bg-"+player.color: "bg-secondary"
</script>
<div class="card mb-1 border-{player.color}" >
	<div class="card-header {status} text-white">
		<!-- 
		we're not doing any validation, if the user enters HTML code here, it'll be used in the logs
		no big deal :)
		-->
		<input type="text" bind:value={player.name} />
		<span class="badge bg-danger position-absolute top-0 end-0">{player.field.reduce((total, v) => total+v.hp, 0)}</span><br>
	</div>

	<div class="card-body p-1">
		<div class="row gx-1">
			{#each fieldToArray(player.field, mirrored) as unitinstance, index (index)}
				<div class="col-4 mb-1" style="min-height: 175px">
					<div class="card h-100 border-{player.color}">
						<div class="card-header">
							<select on:change={add(index)} value={unitinstance?unitinstance.unit.id:""} class="mw-100">
								<option value="">-</option>
								{#each Units as unit}
									<option value="{unit.id}">{unit.name}</option>
								{/each}
							</select>
							{#if unitinstance}
							<span class="badge bg-danger position-absolute top-0 end-0">{unitinstance.hp}</span><br>
							{/if}
						</div>
						<div class="card-body p-1">
							{#if unitinstance}
								<UnitCard unit="{unitinstance.unit}" />
							{:else}
							&nbsp;
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

