<script lang="ts">
import type { Effect } from "./system";

let { effect }:{effect:Effect} = $props();
</script>
<span class="badge me-1" class:bg-success={effect.active} class:bg-secondary={!effect.active} style="white-space: nowrap">{@html effect.message}</span>



