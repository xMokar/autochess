<script lang="ts">
    import { NoUnit, type Field, type Unit } from "$lib/system";
    import { calculateCombatTraits, calculateDamage, calculateDamageStats, calculateTeamTraits } from "./combat";
    import UnitTraits from "./UnitTraits.svelte";
    import Effect from "./Effect.svelte";

	let { unit, field=undefined }:{unit:Unit, field:Field|undefined} = $props()
</script>
<div class="row">
	
	<div class="col-12">
		<div style="font-size: 80%; height: 4rem;" class="fw-light">{#each unit.info.split('\n') as line}
			{@html line}<br>
		{/each}
		</div>
	</div>
	<div class="col-6">
		<b>Precio:</b>
		<div class="float-end">
		{unit.cost} <span class="icon">🪙</span>
		</div>
	</div>
	<div class="col-6">
		<b>Rasgos:</b> 
		<UnitTraits {unit} />
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
	<div class="col-6">
		<b>Energía maxima:</b>
		<span class="float-end">{unit.energymax}</span>
	</div>
	<div class="col-6">
		<b>Energía por tick:</b>
		<span class="float-end">{unit.energypertick}</span>
	</div>
	<div class="col-12">
		<b>Objetivos:</b> <br>
		<div class="ms-2" style="height: 3rem">
		{unit.targetting.name}
		</div>
		{#if field}
			<b>Efectos de equipo:</b><br>
			<div class="ms-2">
			{#each calculateTeamTraits(unit, field) as effect}
				<Effect {effect} />
			{/each}
			</div>
		{/if}
		<b>Efectos de combate:</b><br>
		{#each calculateCombatTraits(unit, NoUnit) as effect}
			<div class="ms-2">
				<Effect {effect} />
			</div>

		{/each}
	</div>
</div>

