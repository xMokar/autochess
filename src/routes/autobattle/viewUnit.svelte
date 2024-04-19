<script lang="ts">
    import type { Champ } from "$lib/system";
    import ArmorIcon from "./ArmorIcon.svelte";

	export let champ:Champ
	console.log('xxx',champ)
</script>

<div class="row">
	<div class="col-6">
		<b>ATK:</b> {champ.attack}
	</div>
	<div class="col-6">
		<b>DEF:</b> {champ.defense}
	</div>
	<div class="col-6">
		<b>SPD:</b> {champ.movespeed}
	</div>
	<div class="col-12">
		<b>ARMOR:</b> <ArmorIcon armor={champ.armorType.id} /> 
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

