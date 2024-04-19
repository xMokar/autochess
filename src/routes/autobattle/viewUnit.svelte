<script lang="ts">
    import type { Champ } from "$lib/system";
    import ArmorIcon from "./ArmorIcon.svelte";

	export let champ:Champ
	console.log('xxx',champ)
</script>

<div class="row">
	<div class="col-6">
		ATK: {champ.attack}
	</div>
	<div class="col-6">
		DEF: {champ.defense}
	</div>
	<div class="col-6">
		SPD: {champ.movespeed}
	</div>
	<div class="col-12">
		ARMOR: <ArmorIcon armor={champ.armorType.id} /> 
	</div>
	<div class="col-12">
		<b>Objetivos:</b> <br>
		&nbsp;{champ.targetting.name}<br>
		Dados de ataque:<br>
		{#each Object.entries(champ.armorpen).sort(([_a,a],[_b,b]) => b-a) as [armor, dice]}
			{#each Array(dice) as _}
				<ArmorIcon {armor} />
			{/each}
		{/each}
	</div>
</div>

