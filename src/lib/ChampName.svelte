<script lang="ts">
import type { Unit } from "$lib/system";
import ElementIcon from "$lib/ElementIcon.svelte";

let { unit }:{unit:Unit} = $props()
</script>

<ElementIcon element={unit.element} />
{unit.name}
