<script lang="ts">
import type { Player, Unit } from "$lib/system";
import type { Snippet } from "svelte";
import Hand from "./Hand.svelte";
import ManagePlayerBoard from "./ManagePlayerBoard.svelte";

let { player, actions }: {player:Player, actions:Snippet} = $props();
let taken:number|undefined = $state(undefined)
let takenUnit:Unit|undefined = $derived(taken===undefined? undefined: player.hand[taken])
let view:string = $state("hand")
function ontake(i:number) {
	taken = i
	view = "board"
}

function oncancel() {
	taken=undefined
	view="hand"
}
function transferCard() {
	if(taken===undefined) {
		console.log("ERROR: transferCard() taken===undefined")
		return
	}
	let [unit] = player.hand.splice(taken, 1)
	taken = undefined
	return unit
}

function gotoHand() {
	view = "hand"
}
$effect(()=> {
	// track player, when it changes, reset state.
	player;
	oncancel()
})
</script>

{#if view=="hand"}
	<Hand {player} onclose={() => view="board"} onclick={(i) => ontake(i)} boardActions={actions} closeText="Tablero" />
{:else if view=="board"}
	<ManagePlayerBoard {player} {oncancel} {transferCard} {gotoHand} {takenUnit} />
{/if}
