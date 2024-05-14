<script lang="ts">
import type { Coordinate, Player, Unit } from "$lib/system";
import type { Snippet } from "svelte";
import ManagePlayerHand from "./ManagePlayerHand.svelte";
import ManagePlayerBoard from "./ManagePlayerBoard.svelte";
import UnitCard from "$lib/UnitCard.svelte";
import { fade } from "svelte/transition";

let { player, actions }: {player:Player, actions?:Snippet|undefined} = $props();
let takenUnit:Unit|undefined = $state(undefined)
function ontakeFromHand(index:number) {
	if (takenUnit) {
		onreleaseOnHand()
	}
	[takenUnit] = player.hand.splice(index, 1)
}
function ontakeFromBoard(c:Coordinate) {
	if (takenUnit) {
		onreleaseOnBoard(c)
	}
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

<ManagePlayerHand {player} onclick={ontakeFromHand} onrelease={onreleaseOnHand} boardActions={actions} {takenUnit} />
<ManagePlayerBoard {player} onclick={ontakeFromBoard} onrelease={onreleaseOnBoard} {takenUnit} />
{#if takenUnit}
	<div class="position-fixed top-0 end-0" style="width: 250px" in:fade out:fade>
		<UnitCard unit={takenUnit} onclick={onreleaseOnHand} />
	</div>
{/if}
