<script lang="ts">
import type { Snippet } from "svelte";
import Modal from "./Modal.svelte";
import TraitIcon from "./TraitIcon.svelte";
import UnitInfo from "./UnitInfo.svelte";
    import { getBoardUnitBonus } from "./combat";

let { unit, actions = undefined, onclick, board = undefined, boardUnit = undefined}:{
	unit:Unit, 
	boardUnit?:BoardUnit,
	onclick:()=>void,
	board?:Board|undefined,
	actions?:Snippet|undefined
} = $props()
let showModal = $state(false)
</script>

{#snippet card()}
	<div class="card">
		<div class="card-header">{unit.name}</div>
		<div class="card-body">
			<UnitInfo {unit} {board} {boardUnit} />
		</div>
	</div>
{/snippet}
{#if showModal}
	<Modal onclose={()=>showModal=false} body={card} />
{/if}
<div class="card w-100">
	<div class="card-header p-1">
		<button onclick={() => showModal=true} class="btn btn-sm btn-info p-0"><span class="bi bi-info-circle"></span></button>
		{unit.name}
			{#if boardUnit}
			{@const maxhp = boardUnit.unit.maxhp+getBoardUnitBonus(boardUnit, "hp") }
			{@const percent = Math.floor(boardUnit.hp/maxhp*100) }
			<div class="progress">
				<div class="progress-bar bg-danger" role="progress-bar" style="width: {percent}%" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">{boardUnit.hp}</div>
			</div>
			{/if}
	</div>
	<div class="card-body p-0" style="height: 120px">

		<button {onclick} class="unit p-0 position-relative">
			<img src="/units/{unit.id}.png" width="100%" class="{unit.id}" alt={unit.name} />
			<div class="overlay position-absolute bottom-0 pb-2 ps-2">
				{#each unit.traits.filter(t => t.name) as trait}
					<div class="trait mb-1 pe-3 ps-2 text-start" style="font-size: 80%">
						<TraitIcon {trait} /> {trait.name}<br>
					</div>
				{/each}
				
			</div>
		</button>
			<div>
				{#if actions}
					{@render actions()}
				{/if}
			</div>
	</div>
</div>

<style>
.unit {
  height: 120px;
  width: 100%;
  overflow: hidden;
}

.overlay .trait {
background: #eee;
border-radius: 1rem;
border: 1px solid #aaa;
}
</style>
