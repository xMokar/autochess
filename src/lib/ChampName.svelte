<script lang="ts">
import type { Unit } from "$lib/system";
import ElementIcon from "$lib/ElementIcon.svelte";

export let unit:Unit
</script>

<ElementIcon element={unit.element} />
{unit.name}
