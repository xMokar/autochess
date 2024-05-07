<script lang="ts">
    import { type Field, type Unit } from "$lib/system";
    import { calculateFieldEffects } from "./combat";
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
	<div class="col-12 col-md-6">
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
	<div class="col-12 col-md-6">
		<b>Ataca cada:</b>
		<span class="float-end">{unit.attackcooldown} ticks</span>
	</div>
	<div class="col-12">
		<b>Objetivos:</b> <br>
		<div class="ms-2" style="height: 3rem">
		{unit.targetting.name}
		</div>
		<b>Efectos:</b><br>
		<div class="ms-2">
		{#each calculateFieldEffects(unit, field) as effect}
			<Effect {effect} />
		{/each}
		</div>
	</div>
</div>

