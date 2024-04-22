<script lang="ts">
    import { ElementMap, type Champ } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";

	export let champ:Champ
</script>
<table class="table table-sm mb-0">
	<tr>
		<td>
		<b>Def:</b>
		</td>
		<td>{champ.defense} </td>
		<td>
		<b>Vel:</b> 
		</td>
		<td>{champ.movespeed} </td>
	</tr>
	<tr>
		<td>
		<b>Elemento:</b>
		</td>
		<td>
			<ElementIcon element={champ.element} /> 
		</td>
	</tr>
</table>
		<b>Objetivos:</b> <br>
		&nbsp;{champ.targetting.name}<br>
		<b>Dados de ataque:</b><br>
<div class="row">
	{#each champ.elementStrength.sort((a,b) => b.dice-a.dice) as es}
	<div class="col-6">
		<ElementIcon element={es.element} /> {es.dice}d{es.sides}+{es.modifier}<br>
	</div>
	{/each}
</div>

