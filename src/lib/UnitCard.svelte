<script lang="ts">
    import { type Unit } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";
    import UnitInfo from "./UnitInfo.svelte";

	let { unit, actions = undefined }:{unit:Unit, actions:any|undefined} = $props()
</script>

<div class="card">
	<div class="card-header">
		<ElementIcon element={unit.element} />
		{unit.name}
	</div>
	<div class="card-body">
		<UnitInfo {unit} />
		{@render actions()}
	</div>
</div>

