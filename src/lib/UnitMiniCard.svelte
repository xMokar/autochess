<script lang="ts">
    import { type Field, type Unit } from "$lib/system";
    import type { Snippet } from "svelte";
    import UnitInfo from "./UnitInfo.svelte";
    import UnitTraits from "./UnitTraits.svelte";

	let { unit, cardActions, field, onclick, index=0 }:{
		unit:Unit,
		field:Field|undefined,
		cardActions:Snippet<[number]>|undefined,
		index:number,
		onclick:()=>void,
	} = $props()
	let front = $state(true)
</script>

<div class="card g-1">
	<div class="card-header">
		<UnitTraits {unit} />
		{unit.name}
		<div class="float-end">
			<button onclick={() => front=!front} class="btn btn-sm btn-secondary"><span class="bi bi-sign-turn-left-fill"></span></button>
		</div>
	</div>
	<div class="card-body">
		{#if front}
		<div class="row">
			<div class="unit">
				<span {onclick} role="button">
					<img src="/units/{unit.id}.png"  width="100%" class="unit {unit.id}" alt="{unit.name}" />
				</span>
			</div>
			{#if cardActions}
				{@render cardActions(index)}
			{/if}
		</div>
		{:else}
			<UnitInfo {unit} {field} />
		{/if}
	</div>
</div>


