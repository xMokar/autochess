<script lang="ts">
    import { type Field, type Unit } from "$lib/system";
    import Modal from "./Modal.svelte";
    import TraitIcon from "./TraitIcon.svelte";
    import UnitInfo from "./UnitInfo.svelte";
    import UnitTraits from "./UnitTraits.svelte";

	let { unit, actions = undefined, onclick, field }:{
		unit:Unit, 
		onclick:()=>void,
		field:Field|undefined,
		actions:any|undefined
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
	<div class="card-header">
		{unit.name}
		<div class="float-end">
			<button onclick={() => showModal=true} class="btn btn-sm btn-secondary"><span class="bi bi-info-circle-fill"></span></button>
		</div>
	</div>
	<div class="card-body">

		<div class="unit position-relative">
			<span {onclick} role="button">
			<img src="/units/{unit.id}.png" width="100%" class="position-absolute {unit.id}" alt={unit.name} />
			</span>
			<div class="overlay position-absolute bottom-0 pb-2 ps-2">
				{#each unit.traits as trait}
					<div class="trait">
						<TraitIcon {trait} /> {trait.name}&nbsp;<br>
					</div>
				{/each}
				
			</div>
		</div>
			<div>
				{@render actions()}
			</div>
	</div>
</div>

<style>
.unit {
  max-height: 200px!important; 
  height: 150px;
  width: 100%;
  overflow: hidden;
}

.overlay .trait {
background: #eee;
border-radius: 1rem;
}
</style>
