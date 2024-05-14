<script lang="ts">
import type { Coordinate, Player, Unit } from "$lib/system";
import type { Snippet } from "svelte";
import Hand from "./Hand.svelte";
import ManagePlayerBoard from "./ManagePlayerBoard.svelte";

let { player, actions }: {player:Player, actions:Snippet|undefined} = $props();
let takenUnit:Unit|undefined = $state(undefined)
function ontakeFromHand(index:number) {
	[takenUnit] = player.hand.splice(index, 1)
}
function ontakeFromBoard(c:Coordinate) {
	let index=player.field.findIndex(au => c.x==au.setx && c.y==au.sety)
	takenUnit = player.field[index].unit
	player.field.splice(index, 1)
}
function onreleaseOnHand() {
	if(!takenUnit)
		return
	player.hand.push(takenUnit)
	takenUnit = undefined
}

function onreleaseOnBoard(c:Coordinate) {
	if(takenUnit===undefined) {
		console.log("ERROR: transferCard() taken===undefined")
		return
	}
	let unit = takenUnit
	player.field.push({
		unit,
		setx: c.x,
		sety: c.y,
		x: c.x,
		y: c.y,
		hp: unit.hp,
		energy: 0,
	})
	takenUnit = undefined
}

$effect(()=> {
	// track player, when it changes, reset state.
	player;
	takenUnit = undefined
})
</script>

<Hand {player} onclick={ontakeFromHand} onrelease={onreleaseOnHand} boardActions={actions} {takenUnit} closeText="Tablero" />
<ManagePlayerBoard {player} onclick={ontakeFromBoard} onrelease={onreleaseOnBoard} {takenUnit} />
