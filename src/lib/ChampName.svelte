<script lang="ts">
import type { Unit } from "$lib/system";
import TraitIcon from "$lib/TraitIcon.svelte";

let { unit }:{unit:Unit} = $props()
</script>

<TraitIcon trait={unit.trait} />
{unit.name}
