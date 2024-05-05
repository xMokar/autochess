<script lang="ts">
    import UnitMiniCard from "$lib/UnitMiniCard.svelte";
    import { updatePlayer } from "$lib/state";
import type { Player, Coordinate, ActiveUnit } from "$lib/system";
    import type { Snippet } from "svelte";
    import Hand from "./Hand.svelte";

let { player, actions }: {player:Player, actions:Snippet} = $props();
let grid = Array(9).fill(0).map((_, i) => ({
	i,
	x: i%3,
	y: Math.floor(i/3)
}))
let taken:number|undefined = $state(undefined)
let view:string = $state("hand")
function take(i:number) {
	taken = i
	view = "board"
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
	view="hand"
}
function release(c:Coordinate) {
	let i = player.field.findIndex(unit => unit.setx==c.x&&unit.sety==c.y)
	let [activeUnit] = player.field.splice(i, 1)
	player.hand.push(activeUnit.unit)
	view="hand"
}

function cancel() {
	taken=undefined
	view="hand"
}

let moving:ActiveUnit|undefined = $state(undefined)
function movestart(c:Coordinate) {
	moving=player.field.find(au => c.x==au.setx && c.y==au.sety)
}

function moveend(c:Coordinate) {
	if(!moving)
		return
	moving.setx = c.x
	moving.sety = c.y
	moving.x = c.x
	moving.y = c.y
	moving = undefined

}
</script>

{#snippet cardActions(i:number)}
	{#if taken===undefined}
		<button onclick={() => take(i)} class="btn btn-sm btn-primary">Agarrar</button>
	{/if}
{/snippet}
{#if view=="hand"}
	<Hand {player} onclose={() => view="board"} {cardActions} boardActions={actions} closeText="Tablero" />
{/if}
{#if view=="board"}
<div class="card mt-2">
	<div class="card-header bg-success text-light">
		Tablero de {player.name}
		<div class="float-end">
			<button onclick={cancel} class="btn btn-outline-light">Ver mano</button>
		</div>
	</div>
	<div class="card-body">
		<div class="row">
		{#each grid as g, index}
		{@const unit = player.field.find(u => u.setx==g.x && u.sety==g.y)}
		{#snippet fieldCardActions()}
			{#if taken===undefined}
			<button onclick={() => movestart(g)} class="btn btn-sm btn-primary">
				Agarrar
			</button>
			<button onclick={() => release(g)} class="btn btn-sm btn-info">
				Regresar
			</button>
			{/if}
		{/snippet}
			<div class="col-12 col-md-4" style="min-height: 9rem">
				{#if taken!== undefined && !unit}
					<button onclick={() => drop(g)} class="btn btn-sm btn-primary">Soltar</button>
				{/if}
				{#if moving && player.field.find(au => au.sety==g.y && au.setx==g.x)===undefined}
					<button onclick={() => moveend(g)} class="btn btn-sm btn-primary">Soltar</button>
				{/if}
				{#if unit}
					<UnitMiniCard unit={unit.unit} cardActions={fieldCardActions} field={player.field} {index} />
				{/if}
						
				

			</div>
		{/each}
		</div>
	</div>
</div>
{/if}
