<script lang="ts">
    import type { Champ } from "$lib/system";

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
		ARMOR: <span class="armor {champ.armorType.id}">.</span>
	</div>
	<div class="col-12">
		<b>Objetivos:</b> <br>
		&nbsp;{champ.targetting.name}<br>
		Dados de ataque:<br>
		{#each Object.entries(champ.armorpen).sort(([_a,a],[_b,b]) => b-a) as [armor, dice]}
			{#each Array(dice) as _}
				<span class="armor {armor}"></span>
			{/each}
		{/each}
	</div>
</div>

