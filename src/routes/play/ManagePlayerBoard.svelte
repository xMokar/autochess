<script lang="ts">
import UnitCard from '$lib/UnitCard.svelte';
import { fade } from 'svelte/transition';
import DropUnitCard from './DropUnitCard.svelte';
    import TraitInfo from './TraitInfo.svelte';

let { player, onclick, onrelease, takenUnit}:{
	player:Player,
	onclick:(c:Coordinate)=>void,
	onrelease:(c:Coordinate)=>void,
	takenUnit:Unit|undefined
}= $props()

let grid = Array(9).fill(0).map((_, i) => ({
	i,
	x: i%3,
	y: Math.floor(i/3)
}))

</script>
<div class="card mt-2" id="board">
	<div class="card-header bg-{player.color} text-light">
		Tablero
	</div>
	<div class="card-body">
		<div class="row">
			<div class="col-9">
				<div class="row row-cols-3">
				{#each grid as g}
					{@const boardUnit = player.board.find(u => u.setx==g.x && u.sety==g.y)}
					<div class="col d-flex align-items-stretch mb-1" style="height: 150px">
						{#if takenUnit!== undefined && !boardUnit}
							<DropUnitCard onclick={() => onrelease(g)} unit={takenUnit} />
						{/if}
						{#if boardUnit}
							<div in:fade>
								<UnitCard board={player.board} unit={boardUnit.unit} boardUnit={boardUnit} onclick={() => onclick(g)} />
							</div>
						{/if}
					</div>
				{/each}
				</div>
			</div>
			<div class="col-3">
				{#each player.traits as trait}
					<TraitInfo {trait} />
					<br>
				{/each}
			</div>
		</div>
	</div>
</div>
