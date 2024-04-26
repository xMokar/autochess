<script lang="ts">
    import { type Unit } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";

	let { unit }:{unit:Unit} = $props()
</script>
<div class="row">
	
	<div class="col-12 position-relative">
		<div style="font-size: 70%; height: 3rem;" class="fw-light">{unit.info}</div>
	</div>
	<div class="col-12 col-md-6">
		<b>Elemento:</b> 
		<span class="float-end"><ElementIcon element={unit.element} /> </span>
	</div>
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
	<div class="col-12">
		<b>Nombre del ataque:</b><br>
		<div class="ms-2" style="height: 2rem">{unit.attackName}</div><br>
		<b>Objetivos:</b> <br>
		<span class="ms-2">
		{unit.targetting.name}<br>
		</span>
		<b>Dados de ataque:</b><br>
	</div>
	{#each [...unit.elementStrength].sort((a,b) => (b.dice*b.sides+b.modifier)-(a.dice*a.sides+a.modifier)) as es}
	<div class="col-12 col-md-6">
		<span class="ms-2 text-nowrap">
			<ElementIcon element={es.element} /> {es.dice}d{es.sides}+{es.modifier}
		</span>
	</div>
	{/each}
</div>

