<script lang="ts">
import UnitTraits from "./UnitTraits.svelte";
    import Attribute from "./Attribute.svelte";

let { unit, boardUnit=undefined }:{
	unit:Unit, 
	field?:Field|undefined,
	boardUnit?:BoardUnit|undefined
} = $props()
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
		<span class="float-end">{unit.attack.amount}d{unit.attack.sides}+<Attribute value={unit.attack.modifier} {boardUnit} bonus="attack.modifier" /></span>
	</div>
	<div class="col-12 col-md-6">
		<b>HP:</b> 
		<span class="float-end"><Attribute value={unit.hp} {boardUnit} bonus="hp" /></span>
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
		<!--
		<b>Efectos de combate:</b><br>
		{#each calculateCombatTraits(createBoardUnit(unit, {x:0, y:0}), createBoardUnit(NoUnit, [], {x:0, y:0})) as effect}
			<div class="ms-2">
				<Effect {effect} />
			</div>

		{/each}
		-->
	</div>
</div>

