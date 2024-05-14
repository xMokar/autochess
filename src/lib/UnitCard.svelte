<script lang="ts">
    import { type Field, type Unit } from "$lib/system";
    import Modal from "./Modal.svelte";
    import TraitIcon from "./TraitIcon.svelte";
    import UnitInfo from "./UnitInfo.svelte";

	let { unit, actions = undefined, onclick, field = undefined}:{
		unit:Unit, 
		onclick:()=>void,
		field?:Field|undefined,
		actions?:any|undefined
	} = $props()
	let showModal = $state(false)
</script>

{#snippet card()}
	<div class="card">
		<div class="card-header">{unit.name}</div>
		<div class="card-body">
			<UnitInfo {unit} {field} />
		</div>
	</div>
{/snippet}
<Modal bind:show={showModal} body={card} />
<div class="card w-100">
	<div class="card-header p-0 ps-2">
		{unit.name}
		<div class="float-end">
			<button onclick={() => showModal=true} class="btn btn-sm btn-secondary"><span class="bi bi-info-circle-fill"></span></button>
		</div>
	</div>
	<div class="card-body p-0" style="height: 120px">

		<button {onclick} class="unit p-0 position-relative">
			<img src="/units/{unit.id}.png" width="100%" class="{unit.id}" alt={unit.name} />
			<div class="overlay position-absolute bottom-0 pb-2 ps-2">
				{#each unit.traits as trait}
					<div class="trait mb-1 pe-3" style="font-size: 80%">
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
