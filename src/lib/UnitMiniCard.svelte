<script lang="ts">
    import { type Field, type Unit } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";
    import type { Snippet } from "svelte";
    import { calculateFieldEffects } from "./combat";

	let { unit, cardActions, field, index=0 }:{
		unit:Unit,
		field:Field,
		cardActions:Snippet<[number]>,
		index:number
	} = $props()
</script>

<div class="card g-1">
	<div class="card-header" style="min-height: 4rem">
		<span class="position-absolute top-0 start-0">
			<ElementIcon element={unit.element} />
		</span>
		{unit.name}
		<span class="badge bg-danger position-absolute top-0 end-0">
			{unit.hp}
		</span>
	</div>
	<div class="card-body">
		<div class="row">
			<div class="col-12 col-md-6">
				<b>HP:</b> 
				<span class="float-end">{unit.hp}</span>
			</div>
			<div class="col-12 col-md-6">
				<b>Ataque:</b>
				<span class="float-end">{unit.attack.amount}d{unit.attack.sides}+{unit.attack.modifier}</span>
			</div>
			<div class="col-12 col-md-6 position-relative">
				<b>Def:</b> 
				<span class="float-end">{unit.defense}</span>
			</div>
			<div class="col-12 col-md-6">
				<b>Vel:</b>
				<span class="float-end">{unit.movespeed}</span>
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
	</div>
</div>


