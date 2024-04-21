<script lang="ts">
import type { Champ } from "$lib/system";
import ElementIcon from "$lib/ElementIcon.svelte";

export let champ:Champ
</script>

<ElementIcon armor={champ.element.id} />
{champ.name}
