<script lang="ts">
    import { ElementMap, type Champ } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";

	export let champ:Champ
</script>
<table class="table table-sm mb-0">
	<tr>
		<td>
		<b>Fuerza:</b>
		</td>
		<td>
			{champ.attack}
		</td>
		<td>
		<b>Def:</b>
		</td>
		<td>{champ.defense} </td>
	</tr>
	<tr>
		<td>
		<b>Vel:</b> 
		</td>
		<td>{champ.movespeed} </td>
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
		{#each Object.entries(champ.armorpen).sort(([_a,a],[_b,b]) => b-a) as [e, dice]}
				<ElementIcon element={ElementMap[e]} />x{dice}&nbsp;
		{/each}

