<script lang="ts">
    import UnitMiniCard from '$lib/UnitMiniCard.svelte';
    import type { ActiveUnit, Coordinate, Player, Unit } from '$lib/system';

let { player, oncancel, transferCard, gotoHand, takenUnit}:{
	player:Player,
	oncancel:()=>void,
	transferCard:()=>Unit|undefined,
	gotoHand:()=>void,
	takenUnit:Unit|undefined
}= $props()

let field = $derived(player.field)
let grid = Array(9).fill(0).map((_, i) => ({
	i,
	x: i%3,
	y: Math.floor(i/3)
}))

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
function ondrop(c: Coordinate) {
	let unit = transferCard()
	if(!unit)
		return
	player.field.push({
		unit,
		setx: c.x,
		sety: c.y,
		x: c.x,
		y: c.y,
		hp: unit.hp,
	})
	gotoHand()
}

function release(c:Coordinate) {
	let i = player.field.findIndex(unit => unit.setx==c.x&&unit.sety==c.y)
	let [activeUnit] = player.field.splice(i, 1)
	player.hand.push(activeUnit.unit)
	gotoHand()
}

function isCoordinateAvailable(c:Coordinate) {
	return player.field.find(au => au.sety==c.y && au.setx==c.x)===undefined
}
</script>
<div class="card mt-2">
	<div class="card-header bg-success text-light">
		Tablero de {player.name}
		<div class="float-end">
			<button onclick={oncancel} class="btn btn-outline-light">Ver mano</button>
		</div>
	</div>
	<div class="card-body">
		<div class="row">
		{#each grid as g, index}
			{@const fieldUnit = player.field.find(u => u.setx==g.x && u.sety==g.y)}
			{#snippet cardActions()}
				<button onclick={() => movestart(g)} class="btn btn-sm btn-primary">
					Agarrar {fieldUnit?.unit.name}
				</button>
				{#if takenUnit!==undefined}
				<button onclick={() => release(g)} class="btn btn-sm btn-info">
					Regresar
				</button>
				{/if}
			{/snippet}
			<div class="col-12 col-md-4" style="min-height: 9rem">
				{#if takenUnit!== undefined && !fieldUnit}
					<button onclick={() => ondrop(g)} class="btn btn-sm btn-primary">Soltar {takenUnit.name} aquí</button>
				{/if}
				{#if moving && isCoordinateAvailable(g)}
					<button onclick={() => moveend(g)} class="btn btn-sm btn-primary">Soltar {moving.unit.name} aquí</button>
				{/if}
				{#if fieldUnit}
					<UnitMiniCard unit={fieldUnit.unit} {cardActions} {field} {index} />
				{/if}
			</div>
		{/each}
		</div>
	</div>
</div>
