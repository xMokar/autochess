<script lang="ts">
    import type { Champ } from "$lib/system";
    import ArmorIcon from "./ArmorIcon.svelte";

	export let champ:Champ
</script>

<div class="row">
	<div class="col-6">
		<b>Fuerza:</b> {champ.attack}
	</div>
	<div class="col-6">
		<b>Def:</b> {champ.defense}
	</div>
	<div class="col-6">
		<b>Vel:</b> {champ.movespeed}
	</div>
	<div class="col-12">
		<b>Elemento:</b> <ArmorIcon armor={champ.element.id} /> 
	</div>
	<div class="col-12">
		<b>Objetivos:</b> <br>
		&nbsp;{champ.targetting.name}<br>
		<b>Dados de ataque:</b><br>
		{#each Object.entries(champ.armorpen).sort(([_a,a],[_b,b]) => b-a) as [armor, dice]}
				<ArmorIcon {armor} />x{dice}&nbsp;
		{/each}
	</div>
</div>

