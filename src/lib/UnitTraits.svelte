<script lang="ts">
import TraitIcon from "./TraitIcon.svelte";

let { unit }:{unit:Unit} = $props()
</script>

<span style="float-end">
	{#each unit.traits.filter(t => t.name) as trait}
		<TraitIcon {trait} />
	{/each}
</span>
