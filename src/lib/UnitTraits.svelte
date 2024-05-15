<script lang="ts">
import TraitIcon from "./TraitIcon.svelte";

let { unit }:{unit:Unit} = $props()
</script>

<span style="float-end">
	{#each unit.traits as trait}
		<TraitIcon {trait} />
	{/each}
</span>
