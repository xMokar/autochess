<script lang="ts">
import type { Effect } from "./system";

let { effect }:{effect:Effect} = $props();
</script>
<style>
.effect {
background: #fff;
border: 1px solid #ccc;
border-radius: 5px;
}

.active {
border: 2px solid #000;
font-weight: bold;
background: #afa;
}

</style>
<span class="d-inline-block text-dark effect me-1 mt-1" class:active={effect.active} class:inactive={!effect.active}>
		{@html effect.message}
</span>



