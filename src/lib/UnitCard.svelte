<script lang="ts">
    import { type Field, type Unit } from "$lib/system";
    import UnitInfo from "./UnitInfo.svelte";
    import UnitTraits from "./UnitTraits.svelte";

	let { unit, actions = undefined, onclick, front:startFront, field }:{
		unit:Unit, 
		onclick:()=>void,
		front:boolean,
		field:Field|undefined,
		actions:any|undefined
	} = $props()
	let front = $state(startFront)
</script>

<div class="card">
	<div class="card-header" style="height: 4.5rem">
		<UnitTraits {unit} />
		{unit.name}
		<div class="float-end">
			<button onclick={() => front=!front} class="btn btn-sm btn-secondary"><span class="bi bi-sign-turn-left-fill"></span></button>
		</div>
	</div>
	<div class="card-body">
		<div>
			{@render actions()}
		</div>

		{#if front}
			<div class="unit">
				<span {onclick} role="button">
				<img src="/units/{unit.id}.png" width="100%" class="{unit.id}" alt={unit.name} />
				</span>
			</div>
		{:else}
		<UnitInfo {unit} {field} />
		{/if}
	</div>
</div>

