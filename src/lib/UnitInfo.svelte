<script lang="ts">
    import { type Unit } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";

	let { unit }:{unit:Unit} = $props()
</script>
<div class="row">
	
	<div class="col-12">
		<div style="font-size: 80%; height: 5rem;" class="fw-light">{#each unit.info.split('\n') as line}
			{@html line}<br>
		{/each}
		</div>
	</div>
	<div class="col-12 col-md-6">
		<b>Elemento:</b> 
		<span class="float-end"><ElementIcon element={unit.element} /> </span>
	</div>
	<div class="col-12 col-md-6">
		<b>Ataque:</b>
		<span class="float-end">{unit.attack.amount}d{unit.attack.sides}+{unit.attack.modifier}</span>
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
		<div class="ms-2" style="height: 3rem">
		{unit.targetting.name}
		</div>
	</div>
</div>

