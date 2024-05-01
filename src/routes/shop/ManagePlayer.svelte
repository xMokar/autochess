<script lang="ts">
    import UnitMiniCard from "$lib/UnitMiniCard.svelte";
    import { updatePlayer } from "$lib/state";
import type { Player, Coordinate, ActiveUnit } from "$lib/system";
    import PlayerHand from "./PlayerHand.svelte";

let { player, actions }: {player:Player, actions:any} = $props();
let grid = Array(9).fill(0).map((_, i) => ({
	i,
	x: i%3,
	y: Math.floor(i/3)
}))
let taken:number|undefined = $state(undefined)
function take(i:number) {
	taken = i
}
function drop(c: Coordinate) {
	if(taken===undefined) return
	let [unit] = player.hand.splice(taken, 1)
	player.field.push({
		unit,
		setx: c.x,
		sety: c.y,
		x: c.x,
		y: c.y,
		hp: unit.hp,
	})
	updatePlayer(player)
	taken=undefined
}
function release(c:Coordinate) {
	let i = player.field.findIndex(unit => unit.setx==c.x&&unit.sety==c.y)
	let [activeUnit] = player.field.splice(i, 1)
	player.hand.push(activeUnit.unit)
}
</script>

{#snippet cardActions(i:number)}
	{#if taken===undefined}
		<button onclick={() => take(i)} class="btn btn-sm btn-primary">Agarrar</button>
	{/if}
{/snippet}
<PlayerHand player={player} {actions} {cardActions} />
<div class="card mt-2">
	<div class="card-header">Tablero</div>
	<div class="card-body">
		<div class="row">
		{#each grid as g, index}
		{@const unit = player.field.find(u => u.setx==g.x && u.sety==g.y)}
		{#snippet fieldCardActions()}
			<button onclick={() => release(g)} class="btn btn-sm btn-info">
				Regresar
			</button>
		{/snippet}
			<div class="col-4" style="min-height: 9rem">
				{#if taken!== undefined && !unit}
				<button onclick={() => drop(g)} class="btn btn-sm btn-primary">
					Soltar
				</button>
				{/if}
				{#if unit}
					<UnitMiniCard unit={unit.unit} cardActions={fieldCardActions} field={player.field} {index} />
				{/if}
				

			</div>
		{/each}
		</div>
	</div>
</div>
