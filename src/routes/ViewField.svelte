<script lang="ts">
import { type Player, type Field } from '$lib/system'

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

</script>
<div class="row">
{player.name}<hr>
{#each fieldToArray(player.field, mirrored) as slot}
	<div class="col-4">
		<div class="card"><div class="card-body">

		{#if slot}
		{slot.champ.name} <span class="badge bg-danger position-absolute top-0 end-0">{slot.hp}</span>
		{:else}
		&nbsp;
		{/if}
		</div></div>
	</div>
{/each}
</div>

