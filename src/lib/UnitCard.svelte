<script lang="ts">
    import { ElementMap, type Unit } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";

	export let unit:Unit
</script>
<div class="row">
	
	<div class="col-12 position-relative">
		<div style="font-size: 70%; height: 3rem;" class="fw-light">{unit.info}</div>
	</div>
	<div class="col-12 position-relative">
		<b>Elemento:</b> 
			<ElementIcon element={unit.element} /> 
	</div>
	<div class="col-12 col-md-6 position-relative">
		<b>Def:</b> 
		<span>{unit.defense}</span>
	</div>
	<div class="col-12 col-md-6">
		<b>Vel:</b>
		<span>{unit.movespeed}</span>
	</div>
	<div class="col-12">
		<b>Nombre del ataque:</b><br>
		<span class="ms-4">{unit.attackName}</span><br>
		<b>Objetivos:</b> <br>
		<span class="ms-4">
		{unit.targetting.name}<br>
		</span>
		<b>Dados de ataque:</b><br>
	</div>
	{#each unit.elementStrength.sort((a,b) => b.dice-a.dice) as es}
	<div class="col-12 col-md-6">
		<span class="ms-4 text-nowrap">
			<ElementIcon element={es.element} /> {es.dice}d{es.sides}+{es.modifier}
		</span>
	</div>
	{/each}
</div>

