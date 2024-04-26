<script lang="ts">
    import { type Unit } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";
    import type { Snippet } from "svelte";

	let { unit, cardActions, index=0 }:{
		unit:Unit,
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
			<div class="col-12 col-md-6 position-relative">
				<b>Def:</b> 
				<span class="float-end">{unit.defense}</span>
			</div>
			<div class="col-12 col-md-6">
				<b>Vel:</b>
				<span class="float-end">{unit.movespeed}</span>
			</div>
			<div class="col-12 col-md-6">
				{@render cardActions(index)}
			</div>
		</div>
	</div>
</div>


