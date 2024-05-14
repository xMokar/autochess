<script lang="ts">
import UnitCard from '$lib/UnitCard.svelte';
    import type { Coordinate, Player, Unit } from '$lib/system';
    import DropUnitCard from './DropUnitCard.svelte';

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
		Tablero de {player.name}
	</div>
	<div class="card-body">
		<div class="row">
			<div class="col-9">
				<div class="row row-cols-3">
				{#each grid as g}
					{@const fieldUnit = player.field.find(u => u.setx==g.x && u.sety==g.y)}
					<div class="col d-flex align-items-stretch mb-1">
						{#if takenUnit!== undefined && !fieldUnit}
							<DropUnitCard onclick={() => onrelease(g)} unit={takenUnit} />
						{/if}
						{#if fieldUnit}
							<UnitCard field={player.field} unit={fieldUnit.unit} onclick={() => onclick(g)} />
						{/if}
					</div>
				{/each}
				</div>
			</div>
			<div class="col-3">
				...
			</div>
		</div>
	</div>
</div>
