<script lang="ts">
    import { type Field, type Unit } from "$lib/system";
    import type { Snippet } from "svelte";
    import { calculateFieldEffects } from "./combat";
    import UnitInfo from "./UnitInfo.svelte";

	let { unit, cardActions, field, index=0 }:{
		unit:Unit,
		field:Field,
		cardActions:Snippet<[number]>,
		index:number
	} = $props()
	let front = $state(true)
</script>

<div class="card g-1">
	<div class="card-header">
		{unit.name}
		<div class="float-end">
			<button onclick={() => front=!front} class="btn btn-sm btn-secondary"><span class="bi bi-sign-turn-left-fill"></span></button>
		</div>
	</div>
	<div class="card-body">
		{#if front}
		<div class="row">
			<div class="unit">
				<img src="/units/{unit.id}.png" width="100%" class="{unit.id}"  />
			</div>
			<div class="col-12 col-md-6">
				<b>Ataque:</b>
				<span class="float-end">{unit.attack.amount}d{unit.attack.sides}+{unit.attack.modifier}</span>
			</div>
			<div class="col-12">
				{#each calculateFieldEffects(unit, field) as effect}
					<span class:fw-bold={effect.active} class:text-muted={!effect.active} style="white-space: nowrap">{@html effect.message}</span>
				{/each}
			</div>
			<div class="col-12 col-md-6">
				{@render cardActions(index)}
			</div>
		</div>
		{:else}
			<UnitInfo {unit} field={undefined} />
		{/if}
	</div>
</div>


