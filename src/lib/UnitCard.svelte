<script lang="ts">
    import { type Unit } from "$lib/system";
    import UnitInfo from "./UnitInfo.svelte";
    import UnitTraits from "./UnitTraits.svelte";

	let { unit, actions = undefined, onclick }:{
		unit:Unit, 
		onclick:()=>void,
		actions:any|undefined
	} = $props()
	let front = $state(true)
</script>

<div class="card">
	<div class="card-header" style="height: 4.5rem">
		<UnitTraits {unit} />
		{unit.name}
		<div class="float-end">
			{@render actions()}
			<button onclick={() => front=!front} class="btn btn-sm btn-secondary"><span class="bi bi-sign-turn-left-fill"></span></button>
		</div>

	</div>
	<div class="card-body">
		{#if front}
			<div class="unit">
				<span {onclick} role="button">
				<img src="/units/{unit.id}.png" width="100%" class="{unit.id}" alt={unit.name} />
				</span>
			</div>
		{:else}
		<UnitInfo {unit} field={undefined} />
		{/if}
	</div>
</div>

