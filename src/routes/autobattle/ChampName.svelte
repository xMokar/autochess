<script lang="ts">
import type { Champ } from "$lib/system";
import ArmorIcon from "./ArmorIcon.svelte";

export let champ:Champ
</script>

<ArmorIcon armor={champ.element.id} />
{champ.name}
