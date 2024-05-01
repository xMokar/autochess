<script lang="ts">
    import { updatePlayer } from '$lib/state';
import { type Player, type Field, Units, UnitMap, calculateFieldEffects } from '$lib/system'
import UnitInfo from '$lib/UnitInfo.svelte';

let { player, mirrored=false }: {player:Player, mirrored:boolean} = $props()
let fieldArray = $derived(fieldToArray(player.field, mirrored))

function fieldToArray(field:Field, mirrored:boolean=false) {
	let newfield = Array(9).fill(undefined).map((_, i) => {
		let x = i%3
		let y = Math.floor(i/3)
		return field.find(activeUnit => {
			return (activeUnit.setx == x) && (activeUnit.sety == y)
		})
	})
	if(!mirrored) return newfield
	return [ ...newfield.slice(6), ...newfield.slice(3,6), ...newfield.slice(0,3)]
}

function add(index:number) {
	return (ev:Event) => {
		if(!ev.target)
			return
		let select = ev.target as HTMLSelectElement
		let y = Math.floor(index/3)
		let mirroredy = mirrored? 2-y: y
		let x = index%3

		let removeUnit = () => {
			player.field=player.field.filter(i => !(i.setx==x && i.sety==mirroredy))
		}
		let addUnit = () => {
			if(!select.value) {
				return;
			}
			player.field.push({
				setx: x,
				sety: mirroredy,
				x,
				y:mirrored?-(3-y):y,
				hp: 0,
				unit: UnitMap[select.value]
			})
				player.field= player.field
		}
		
		removeUnit()
		addUnit()
			console.log('test', player.field, fieldArray)
		updatePlayer(player)
	}
}

let isAlive = $derived(player.field.filter(activeUnit => activeUnit.hp>0).length>0)
let status = $derived(isAlive? "bg-"+player.color: "bg-secondary")
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
			{#each fieldArray as activeUnit, index}
				<div class="col-4 mb-1" style="min-height: 175px">
					<div class="card h-100 border-{player.color}">
						<div class="card-header">
							<select onchange={add(index)} value={activeUnit?activeUnit.unit.id:""} class="mw-100">
								<option value="">-</option>
								{#each Units as unit}
									<option value="{unit.id}">{unit.name}</option>
								{/each}
							</select>
							{#if activeUnit}
							<span class="badge bg-danger position-absolute top-0 end-0">{activeUnit.hp}</span><br>
							{/if}
						</div>
						<div class="card-body p-1">
							{#if activeUnit}
								<UnitInfo unit="{activeUnit.unit}" field={player.field} />
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

