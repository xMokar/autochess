<script lang="ts">
    import { ElementMap, type Champ } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";

	export let champ:Champ
</script>
<div class="row">

	<div class="col-12 position-relative">
		<b>Elemento:</b> 
		<span class="position-absolute end-0 me-4">
			<ElementIcon element={champ.element} /> 
		</span>
	</div>
	<div class="col-6 position-relative">
		<b>Def:</b> 
		<span class="position-absolute end-0 me-4">{champ.defense}</span>
	</div>
	<div class="col-6">
		<b>Vel:</b>
		<span class="position-absolute end-0 me-4">{champ.movespeed}</span>
	</div>
	<div class="col-12">
		<b>Objetivos:</b> <br>
		<span class="ms-4">
		{champ.targetting.name}<br>
		</span>
		<b>Dados de ataque:</b><br>
	</div>
	{#each champ.elementStrength.sort((a,b) => b.dice-a.dice) as es}
	<div class="col-6">
		<span class="ms-4">
			<ElementIcon element={es.element} /> {es.dice}d{es.sides}+{es.modifier}<br>
		</span>
	</div>
	{/each}
</div>

