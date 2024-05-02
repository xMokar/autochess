<script lang="ts">
    import { type Unit } from "$lib/system";
    import TraitIcon from "$lib/TraitIcon.svelte";
    import UnitInfo from "./UnitInfo.svelte";
    import UnitTraits from "./UnitTraits.svelte";

	let { unit, actions = undefined }:{unit:Unit, actions:any|undefined} = $props()
	let front = $state(true)
</script>

<div class="card">
	<div class="card-header">
		<UnitTraits {unit} />
		{unit.name}
		<div class="float-end">
			{@render actions()}
			<button onclick={() => front=!front} class="btn btn-sm btn-secondary"><span class="bi bi-sign-turn-left-fill"></span></button>
		</div>

	</div>
	<div class="card-body">
		{#if front}
			<div class="unit">
				<img src="/units/{unit.id}.png" width="100%" class="{unit.id}"  />
			</div>
			<div class="col-12 col-md-6">
			</div>
			<div class="col-12 col-md-6">
				<b>Rasgos:</b> 
				{#each unit.traits as trait}
					<span class="float-end"><TraitIcon {trait} /> </span>
				{/each}
			</div>
			<div class="col-12 col-md-6">
				<b>Ataque:</b>
				<span class="float-end">{unit.attack.amount}d{unit.attack.sides}+{unit.attack.modifier}</span>
			</div>
		{:else}
		<UnitInfo {unit} field={undefined} />
		{/if}
	</div>
</div>

