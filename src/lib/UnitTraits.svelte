<script lang="ts">
    import TraitIcon from "./TraitIcon.svelte";
import type { Unit } from "./system";

let { unit }:{unit:Unit} = $props()
</script>

<span style="width: 60px; display: inline-block;">
	{#each unit.traits as trait}
		<TraitIcon {trait} />
	{/each}
</span>
