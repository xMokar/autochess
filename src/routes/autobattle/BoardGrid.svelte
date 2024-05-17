<script lang="ts">
import { updatePlayer } from '$lib/state';
import { Units } from '$lib/database'
import UnitCard from '$lib/UnitCard.svelte';

let { player, mirrored=false, onAddUnit, onRemoveUnit }:{
	player:Player, 
	mirrored:boolean,
	onAddUnit: (player:Player, c:Coordinate, value:string)=>void,
	onRemoveUnit: (player:Player, c:Coordinate)=>void
} = $props()
let boardArray = $derived(boardToArray(player.board, mirrored))

function boardToArray(board:Board, mirrored:boolean=false) {
	let newboard = Array(9).fill(undefined).map((_, i) => {
		let x = i%3
		let y = Math.floor(i/3)
		return board.find(boardUnit => {
			return (boardUnit.setx == x) && (boardUnit.sety == y)
		})
	})
	if(!mirrored) return newboard
	return [ ...newboard.slice(6), ...newboard.slice(3,6), ...newboard.slice(0,3)]
}

function add(index:number) {
	return (ev:Event) => {
		if(!ev.target)
			return
		let select = ev.target as HTMLSelectElement
		let y = Math.floor(index/3)
		let mirroredy = mirrored? 2-y: y
		let x = index%3
		let c:Coordinate = { x, y: mirroredy }
		onRemoveUnit(player, c)
		onAddUnit(player, c, select.value)
		updatePlayer(player)
	}
}


let isAlive = $derived(player.board.filter(boardUnit => boardUnit.hp>0).length>0)
let status = $derived(isAlive? "bg-"+player.color: "bg-secondary")
</script>
<div class="card mb-1 border-{player.color}" >
	<div class="card-header {status} text-white">
		<!-- 
		we're not doing any validation, if the user enters HTML code here, it'll be used in the logs
		no big deal :)
		-->
		<input type="text" bind:value={player.name} />
		<span class="badge bg-danger position-absolute top-0 end-0">{player.board.reduce((total, v) => total+v.hp, 0)}</span><br>
	</div>

	<div class="card-body p-1">
		<div class="row gx-1">
			{#each boardArray as boardUnit, index (index)}
				{#snippet actions()}
					<select onchange={add(index)} value={boardUnit?boardUnit.unit.id:""} class="mw-100 form-control">
						<option value="">-</option>
						{#each Units as unit}
							<option value="{unit.id}">{unit.name}</option>
						{/each}
					</select>
				{/snippet}
				<div class="col-4 mb-1">
					{#if boardUnit}
						
						<UnitCard unit={boardUnit.unit} {boardUnit} {actions} onclick={() => onRemoveUnit(player, {x: boardUnit.setx, y: boardUnit.sety})} board={player.board} />
					{:else}
						<div class="card h-100 border-{player.color}">
							<div class="card-header p-0 ps-2">Espacio vacio
							</div>
							<div class="card-body p-1">
								{@render actions()}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

